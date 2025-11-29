// tools/update-ranking.mjs
// ------------------------------------------------------------
// 1. 从 FreeToGame API 获取热门 / 新品列表
// 2. 对每个游戏调用 FreeToGame /game?id=xxx 拿详细数据
// 3. 用 Steam Store API 尝试补全系统配置：
//      - https://store.steampowered.com/api/storesearch
//      - https://store.steampowered.com/api/appdetails?appids=APP_ID
// 4. 再读取本地 sysreq-overrides.json 手动覆盖（从任何官网拷来的真实数据）
// 5. 生成 ranking.json，供前端排行榜 & 详情页使用
// ------------------------------------------------------------

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const F2T_API_BASE = 'https://www.freetogame.com/api';
const HOT_URL = `${F2T_API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${F2T_API_BASE}/games?platform=pc&sort-by=release-date`;

const STEAM_APPDETAILS_URL = 'https://store.steampowered.com/api/appdetails';
const STEAM_SEARCH_URL = 'https://store.steampowered.com/api/storesearch';

// ------------------------- 工具函数 -------------------------

// 获取 JSON 数据
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败：${url}，状态码 ${res.status}`);
  }
  return res.json();
}

// 获取 FreeToGame 游戏列表
async function fetchGames(url) {
  return fetchJson(url);
}

// 获取 FreeToGame 游戏详情
async function fetchGameDetail(id) {
  const url = `${F2T_API_BASE}/game?id=${id}`;
  try {
    return await fetchJson(url);
  } catch (err) {
    console.warn(`获取 FreeToGame 详情失败 id=${id}:`, err.message);
    return null;
  }
}

// ------------------------- Steam API -------------------------

// 根据游戏名称搜索 Steam appId
async function searchSteamAppIdByName(name) {
  if (!name) return null;

  const params = new URLSearchParams({
    term: name,
    cc: 'us',
    l: 'en',
  });

  const url = `${STEAM_SEARCH_URL}?${params.toString()}`;
  const data = await fetchJson(url);

  if (!data || !Array.isArray(data.items) || data.items.length === 0) {
    return null;
  }

  const first = data.items[0];
  if (!first || !first.id) return null;

  const steamName = String(first.name || '').toLowerCase();
  const titleNorm = String(name).toLowerCase();

  // 简单的名称一致性校验，避免搜错游戏
  if (!steamName.includes(titleNorm) && !titleNorm.includes(steamName)) {
    return null;
  }

  return first.id;
}

// 解析 Steam 的 pc_requirements HTML
function parseSteamRequirementsHtml(html) {
  if (!html) return null;

  let text = html
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?strong>/g, '')
    .replace(/<\/?p>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const result = {};

  lines.forEach((line) => {
    const m = line.match(/^([^:]+):\s*(.+)$/);
    if (!m) return;
    result[m[1].toLowerCase()] = m[2].trim();
  });

  return result;
}

// 获取 Steam 配置
async function fetchSteamRequirements(appId) {
  const params = new URLSearchParams({
    appids: appId,
    cc: 'us',
    l: 'en',
  });
  const url = `${STEAM_APPDETAILS_URL}?${params.toString()}`;
  const json = await fetchJson(url);

  const entry = json[appId];
  if (!entry?.success || !entry?.data?.pc_requirements) return null;

  const pcReq = entry.data.pc_requirements;
  const minimum = parseSteamRequirementsHtml(pcReq.minimum);
  const recommended = parseSteamRequirementsHtml(pcReq.recommended);

  return { minimum, recommended };
}

// ------------------------- 数据映射 -------------------------

// 处理游戏数据和系统配置
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
    (detailGame?.platform || listGame.platform || 'PC (Windows)') +
    ' · ' +
    (detailGame?.genre || listGame.genre || 'Game');

  const thumbnail = detailGame?.thumbnail || listGame.thumbnail;

  // 评分：简单按名次衰减
  const baseScore = mode === 'hot' ? 9.3 : 9.0;
  const score = Math.max(7.5, baseScore - index * 0.05);

  let tag = '人气不错';
  if (mode === 'new') {
    tag = index < 5 ? '新作速看' : '最近上线';
  } else {
    if (index === 0) tag = '热度第 1';
    else if (index < 3) tag = '焦点热门';
    else if (index < 10) tag = '高人气';
  }

  const description =
    detailGame?.short_description ||
    detailGame?.description ||
    listGame.short_description ||
    '';

  const releaseDate =
    detailGame?.release_date ||
    listGame.release_date ||
    '';

  const publisher =
    detailGame?.publisher ||
    listGame.publisher ||
    '';

  const developer =
    detailGame?.developer ||
    listGame.developer ||
    '';

  const gameUrl =
    detailGame?.game_url ||
    listGame.game_url ||
    '';

  const profileUrl =
    detailGame?.freetogame_profile_url ||
    listGame.freetogame_profile_url ||
    '';

  // ---- 系统配置合并 ----
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
      os: pick('os'),
      processor: pick('processor'),
      memory: pick('memory'),
      graphics: pick('graphics'),
      storage: pick('storage'),
      source: override
        ? 'override'
        : f2tMin
        ? 'freetogame'
        : 'steam',
      steamRaw: steamReq?.raw || null,
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
    systemRequirements: mergedSys,
  };
}

// ------------------------- 主流程 -------------------------

async function main() {
  console.log('开始从 FreeToGame + Steam 拉取最新数据…');

  const sysOverrides = await loadSysOverrides();

  // 1. FreeToGame 列表
  const [hotGames, newGames] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL),
  ]);

  const games = [...hotGames, ...newGames];

  // 2. FreeToGame 详情
  const idSet = new Set();
  for (const g of hotGames) idSet.add(g.id);
  for (const g of newGames) idSet.add(g.id);
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
  const titlesForSteam = Array.from(
    new Set(games.map((g) => g.title).filter(Boolean))
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

  // 4. 合并数据
  const mappedGames = games.map((g, i) =>
    mapGame(g, detailMap.get(g.id), i, 'hot', sysOverrides, steamReqByTitle.get(g.title))
  );

  // 写入 ranking.json
  const outputPath = path.join(__dirname, '..', 'ranking.json');
  await fs.writeFile(outputPath, JSON.stringify(mappedGames, null, 2), 'utf8');
  console.log('排行榜数据已更新！');
}

// ------------------------- 辅助函数 -------------------------

// 读取 sysreq-overrides.json（手动覆盖配置）
async function loadSysOverrides() {
  const filePath = path.join(__dirname, 'sysreq-overrides.json');
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return {};
  }
}

// ------------------------- 执行 -------------------------

main().catch((err) => {
  console.error('更新失败:', err);
});
