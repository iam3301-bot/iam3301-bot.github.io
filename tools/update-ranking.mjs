// tools/update-ranking.mjs
// 从 FreeToGame API 拉取“热门 + 新品”榜单
// 再对每个游戏调用 /game?id=xxx 拿到完整信息（含最低配置）
// 生成 ranking.json，供前端排行榜和详情页使用

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://www.freetogame.com/api";

// 列表接口：热门 & 新品
const HOT_URL = `${API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${API_BASE}/games?platform=pc&sort-by=release-date`;

// ---------- 通用请求函数 ----------

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

// /game?id=xxx 详情接口
async function fetchGameDetail(id) {
  const url = `${API_BASE}/game?id=${id}`;
  try {
    const detail = await fetchJson(url);
    return detail;
  } catch (err) {
    console.warn(`获取游戏详情失败 id=${id}:`, err.message);
    return null;
  }
}

// ---------- 数据映射：列表信息 + 详情信息 合并 ----------

function mapGame(listGame, detailGame, index, mode) {
  // 以详情为主，列表为辅
  const id = listGame.id ?? detailGame?.id;
  const title = listGame.title ?? detailGame?.title;

  const platformText =
    (detailGame?.platform || listGame.platform || "PC (Windows)") +
    " · " +
    (detailGame?.genre || listGame.genre || "Game");

  const thumbnail = detailGame?.thumbnail || listGame.thumbnail;

  // API 没有官方评分：根据名次简单模拟一个“热度评分”
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

  const systemRequirements = detailGame?.minimum_system_requirements || null;

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

    // 最低配置：完全照搬 FreeToGame，不做任何捏造
    systemRequirements
  };
}

// ---------- 主流程 ----------

async function main() {
  console.log("开始从 FreeToGame API 拉取最新数据…");

  // 1. 先拉热门 + 新品列表
  const [hotGamesRaw, newGamesRaw] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  // 只取前 30 条
  const hotTop = hotGamesRaw.slice(0, 30);
  const newTop = newGamesRaw.slice(0, 30);

  // 2. 统计需要拉详情的所有 id（去重）
  const idSet = new Set();
  for (const g of hotTop) idSet.add(g.id);
  for (const g of newTop) idSet.add(g.id);
  const ids = Array.from(idSet);

  console.log(`需要拉取详情的游戏数量：${ids.length} 条`);

  // 3. 逐个请求 /game?id=xxx 详情
  const detailResults = await Promise.all(
    ids.map((id) => fetchGameDetail(id))
  );

  const detailMap = new Map();
  for (const d of detailResults) {
    if (d && d.id != null) {
      detailMap.set(d.id, d);
    }
  }

  // 4. 列表 + 详情 合并为我们自己的结构
  const hotList = hotTop.map((g, i) =>
    mapGame(g, detailMap.get(g.id), i, "hot")
  );
  const newList = newTop.map((g, i) =>
    mapGame(g, detailMap.get(g.id), i, "new")
  );

  // 评分榜：按 score 排序
  const scoreList = [...hotList].sort((a, b) => b.score - a.score);

  // 折扣榜：FreeToGame 没有价格字段，暂时用新品榜占位
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

main().catch((err) => {
  console.error("更新排行榜失败：", err);
  process.exit(1);
});
