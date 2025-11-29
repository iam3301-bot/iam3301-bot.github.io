// ------------------------------------------------------------
// 1. 从 FreeToGame API 获取热门 / 新品列表
// 2. 对每个游戏调用 FreeToGame /game?id=xxx 拿详细数据
// 3. 用 Steam Store 非公开 API 尝试补全系统配置：
//      - https://store.steampowered.com/api/storesearch
//      - https://store.steampowered.com/api/appdetails?appids=APP_ID
// 4. 再读取本地 sysreq-overrides.json 手动覆盖（从任何官网拷来的真实数据）
// 5. 生成 ranking.json，供前端排行榜 & 详情页使用
// ------------------------------------------------------------

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------- 常量区 -----------------------

const F2T_API_BASE = "https://www.freetogame.com/api";
const HOT_URL = `${F2T_API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${F2T_API_BASE}/games?platform=pc&sort-by=release-date`;

const STEAM_SEARCH_URL = "https://store.steampowered.com/api/storesearch";
const STEAM_APPDETAILS_URL =
  "https://store.steampowered.com/api/appdetails";

// ----------------------- 工具函数 -----------------------

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败：${url}，状态码 ${res.status}`);
  }
  return res.json();
}

async function fetchGames(url) {
  return fetchJson(url);
}

async function fetchGameDetail(id) {
  const url = `${F2T_API_BASE}/game?id=${id}`;
  try {
    return await fetchJson(url);
  } catch (err) {
    console.warn(`获取 FreeToGame 详情失败 id=${id}:`, err.message);
    return null;
  }
}

// 读取本地覆盖表（可选）
async function loadSysOverrides() {
  const overridesPath = path.join(__dirname, "sysreq-overrides.json");
  try {
    const text = await fs.readFile(overridesPath, "utf8");
    const data = JSON.parse(text);
    console.log(
      "已加载系统配置覆盖条目：",
      Object.keys(data).length
    );
    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("未找到 sysreq-overrides.json，跳过覆盖配置。");
    } else {
      console.warn(
        "读取 sysreq-overrides.json 失败：",
        err.message
      );
    }
    return {};
  }
}

// ----------------------- Steam 相关 -----------------------

// 用游戏名在 Steam 商店搜索 appid
async function searchSteamAppIdByName(name) {
  if (!name) return null;

  const params = new URLSearchParams({
    term: name,
    cc: "us",
    l: "en"
  });

  const url = `${STEAM_SEARCH_URL}?${params.toString()}`;
  const data = await fetchJson(url);

  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    return null;
  }

  const first = data.items[0];
  if (!first || !first.id) return null;

  const steamName = String(first.name || "").toLowerCase();
  const titleNorm = String(name).toLowerCase();

  // 简单的名称一致性校验，避免搜错游戏
  if (
    !steamName.includes(titleNorm) &&
    !titleNorm.includes(steamName)
  ) {
    return null;
  }

  return first.id;
}

// 解析 Steam appdetails 返回的 pc_requirements HTML 字符串
function parseSteamRequirementsHtml(html) {
  if (!html) return null;

  // 把 <br> 换成换行，去掉 strong 等标签
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?strong>/gi, "")
    .replace(/<\/?p>/gi, "")
    .replace(/<\/?ul>/gi, "")
    .replace(/<\/?li>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&");

  const lines = text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    // 去掉 “Minimum:” / “Recommended:” 之类标题
    .filter(
      (l) =>
        !/^minimum:?$/i.test(l) && !/^recommended:?$/i.test(l)
    );

  const result = {};

  for (const line of lines) {
    const m = line.match(/^([^:：]+)[:：]\s*(.+)$/);
    if (!m) continue;
    const label = m[1].trim().toLowerCase();
    const value = m[2].trim();
    if (!value) continue;

    if (label.includes("os")) result.os = value;
    else if (label.includes("processor") || label.includes("cpu"))
      result.processor = value;
    else if (label.includes("memory") || label.includes("ram"))
      result.memory = value;
    else if (
      label.includes("graphics") ||
      label.includes("video card") ||
      label.includes("gpu")
    )
      result.graphics = value;
    else if (
      label.includes("storage") ||
      label.includes("hard drive") ||
      label.includes("hdd") ||
      label.includes("disk")
    )
      result.storage = value;
  }

  if (Object.keys(result).length === 0) return null;
  return result;
}

// 调 Steam appdetails 拿 pc_requirements
async function fetchSteamRequirements(appId) {
  if (!appId) return null;
  const params = new URLSearchParams({
    appids: String(appId),
    cc: "us",
    l: "en"
  });
  const url = `${STEAM_APPDETAILS_URL}?${params.toString()}`;
  const json = await fetchJson(url);

  const entry = json[String(appId)];
  if (!entry || !entry.success || !entry.data) return null;

  const pcReq = entry.data.pc_requirements;
  if (!pcReq) return null;

  const minimum = parseSteamRequirementsHtml(pcReq.minimum);
  const recommended = parseSteamRequirementsHtml(
    pcReq.recommended
  );

  if (!minimum && !recommended) return null;

  return {
    minimum,
    recommended,
    raw: pcReq
  };
}

// 简单的并发限制执行器
async function mapWithLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (true) {
      const currentIndex = index++;
      if (currentIndex >= items.length) break;
      const item = items[currentIndex];
      results[currentIndex] = await fn(item, currentIndex);
    }
  }

  const workers = [];
  const workerCount = Math.min(limit, items.length || 1);
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// 批量按游戏名从 Steam 尝试获取系统配置
async function fetchSteamRequirementsForTitles(titles) {
  const uniqueTitles = Array.from(new Set(titles.filter(Boolean)));
  if (uniqueTitles.length === 0) return new Map();

  console.log(
    "尝试从 Steam 获取系统配置的游戏数：",
    uniqueTitles.length
  );

  const entries = await mapWithLimit(
    uniqueTitles,
    5, // 并发数，避免触发 Steam 过快访问限制
    async (title) => {
      try {
        const appId = await searchSteamAppIdByName(title);
        if (!appId) {
          console.log(`Steam 未找到游戏：${title}`);
          return null;
        }
        const req = await fetchSteamRequirements(appId);
        if (!req) {
          console.log(`Steam 返回无系统配置：${title} (appid=${appId})`);
          return null;
        }
        console.log(
          `Steam 配置已获取：${title} (appid=${appId})`
        );
        return { title, requirements: req };
      } catch (err) {
        console.warn(
          `获取 Steam 配置失败：${title}`,
          err.message
        );
        return null;
      }
    }
  );

  const map = new Map();
  for (const e of entries) {
    if (e && e.title && e.requirements) {
      map.set(e.title, e.requirements);
    }
  }
  return map;
}

// ----------------------- 数据合并 -----------------------

function mapGame(
  listGame,
  detailGame,
  index,
  mode,
  overrides,
  steamReq
) {
  const id = listGame.id ?? detailGame?.id;
  const title = listGame.title ?? detailGame?.title;

  const platformText =
    (detailGame?.platform || listGame.platform || "PC (Windows)") +
    " · " +
    (detailGame?.genre || listGame.genre || "Game");

  const thumbnail = detailGame?.thumbnail || listGame.thumbnail;

  // 评分：简单按名次衰减
  const baseScore = mode === "hot" ? 9.3 : 9.0;
  const score = Math.max(7.5, baseScore - index * 0.05);

  let tag = "人气不错";
  if (mode === "new") {
    tag = index < 5 ? "新作速看" : "最近上线";
  } else {
    if (index === 0) tag = "热度第 1";
    else if (index < 3) tag = "焦点热门";
    else if (index < 10) tag = "高人气";
  }

  const description =
    detailGame?.short_description ||
    detailGame?.description ||
    listGame.short_description ||
    "";

  const releaseDate =
    detailGame?.release_date ||
    listGame.release_date ||
    "";

  const publisher =
    detailGame?.publisher ||
    listGame.publisher ||
    "";

  const developer =
    detailGame?.developer ||
    listGame.developer ||
    "";

  const gameUrl =
    detailGame?.game_url ||
    listGame.game_url ||
    "";

  const profileUrl =
    detailGame?.freetogame_profile_url ||
    listGame.freetogame_profile_url ||
    "";

  // ---- 系统配置合并逻辑（最核心） ----
  const f2tMin = detailGame?.minimum_system_requirements || null;
  const override = overrides[title]; // sysreq-overrides.json 里按游戏名匹配
  const steamMin = steamReq?.minimum || null;

  let mergedSys = null;
  const pick = (key) =>
    (override && override[key]) ||
    (f2tMin && f2tMin[key]) ||
    (steamMin && steamMin[key]) ||
    null;

  if (override || f2tMin || steamMin) {
    mergedSys = {
      os: pick("os"),
      processor: pick("processor"),
      memory: pick("memory"),
      graphics: pick("graphics"),
      storage: pick("storage"),
      source: override
        ? "override"
        : f2tMin
        ? "freetogame"
        : "steam",
      steamRaw: steamReq?.raw || null
    };
  }

  return {
    // 基本字段（真实）
    id,
    name: title,
    platform: platformText,
    cover: thumbnail,

    // 评分（项目内部模拟）
    score,
    tag,

    // 详情页用的真实信息
    description,
    releaseDate,
    publisher,
    developer,
    gameUrl,
    profileUrl,

    // 系统配置：完全基于真实来源（F2T / Steam / overrides）
    systemRequirements: mergedSys
  };
}

// ----------------------- 主流程 -----------------------

async function main() {
  console.log("开始从 FreeToGame + Steam 拉取最新数据…");

  const sysOverrides = await loadSysOverrides();

  // 1. FreeToGame 列表
  const [hotGamesRaw, newGamesRaw] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  const hotTop = hotGamesRaw.slice(0, 30);
  const newTop = newGamesRaw.slice(0, 30);

  // 2. FreeToGame 详情
  const idSet = new Set();
  for (const g of hotTop) idSet.add(g.id);
  for (const g of newTop) idSet.add(g.id);
  const ids = Array.from(idSet);

  console.log(`需要拉取 FreeToGame 详情的游戏数：${ids.length}`);

  const detailResults = await Promise.all(
    ids.map((id) => fetchGameDetail(id))
  );
  const detailMap = new Map();
  for (const d of detailResults) {
    if (d && d.id != null) detailMap.set(d.id, d);
  }

  // 3. Steam 系统配置（按名称匹配）
  const allListGames = [...hotTop, ...newTop];
  const titlesForSteam = Array.from(
    new Set(allListGames.map((g) => g.title).filter(Boolean))
  );

  const steamReqEntries = await fetchSteamRequirementsForTitles(
    titlesForSteam
  );
  const steamReqByTitle = new Map();
  for (const e of steamReqEntries.values()) {
    if (e && e.title && e.requirements) {
      steamReqByTitle.set(e.title, e.requirements);
    }
  }

  // 4. 合并成我们自己的结构
  const hotList = hotTop.map((g, i) =>
    mapGame(
      g,
      detailMap.get(g.id),
      i,
      "hot",
      sysOverrides,
      steamReqByTitle.get(g.title)
    )
  );
  const newList = newTop.map((g, i) =>
    mapGame(
      g,
      detailMap.get(g.id),
      i,
      "new",
      sysOverrides,
      steamReqByTitle.get(g.title)
    )
  );

  const scoreList = [...hotList].sort(
    (a, b) => (b.score || 0) - (a.score || 0)
  );

  // 折扣榜：暂时使用新品榜占位（数据真实但不是价格相关）
  const discountList = newList;

  const data = {
    hot: hotList,
    score: scoreList,
    new: newList,
    discount: discountList
  };

  const outputPath = path.join(__dirname, "..", "ranking.json");
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf8");

  console.log("已写入最新排行榜数据 →", outputPath);
}

// 运行
main().catch((err) => {
  console.error("更新排行榜失败：", err);
  process.exit(1);
});
