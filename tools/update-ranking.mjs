// tools/update-ranking.mjs
// 从 FreeToGame API 拉取“热门 + 新品”榜单
// 再对每个游戏调用 /game?id=xxx 拿到完整信息
// 生成 ranking.json，给前端排行榜 + 详情页使用

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://www.freetogame.com/api";

// 列表接口：热门 & 新品
const HOT_URL = `${API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${API_BASE}/games?platform=pc&sort-by=release-date`;

// --- 小工具函数 ---

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败：${url}，状态码 ${res.status}`);
  }
  return res.json();
}

// 拉热门 / 新品列表
async function fetchGames(url) {
  return fetchJson(url);
}

// 拉单个游戏详情 /game?id=xxx
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

// 把“列表里的粗信息 + 详情里的完整信息”融合成我们自己的结构
function mapGame(listGame, detailGame, index, mode) {
  // 以详情为主，列表为辅
  const id = listGame.id ?? detailGame?.id;
  const title = listGame.title ?? detailGame?.title;
  const platform =
    (detailGame?.platform || listGame.platform || "PC (Windows)") +
    " · " +
    (detailGame?.genre || listGame.genre || "Game");
  const thumbnail = detailGame?.thumbnail || listGame.thumbnail;

  // API 没有官方评分，这里根据名次模拟一个“热度评分”
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

  return {
    // 基本字段（真实）
    id,
    name: title,
    platform,
    cover: thumbnail,

    // 评分（项目内部模拟）
    score,
    tag,

    // 详情页用的真实信息：优先来自 /game，再退回列表
    description:
      detailGame?.short_description ||
      detailGame?.description ||
      listGame.short_description ||
      "",

    releaseDate:
      detailGame?.release_date ||
      listGame.release_date ||
      "",

    publisher:
      detailGame?.publisher ||
      listGame.publisher ||
      "",

    developer:
      detailGame?.developer ||
      listGame.developer ||
      "",

    gameUrl: detailGame?.game_url || listGame.game_url || "",
    profileUrl:
      detailGame?.freetogame_profile_url ||
      listGame.freetogame_profile_url ||
      ""
  };
}

async function main() {
  console.log("开始从 FreeToGame API 拉取最新数据…");

  // 1. 先拉热门 + 新品列表
  const [hotGamesRaw, newGamesRaw] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  // 只取前 30 个
  const hotTop = hotGamesRaw.slice(0, 30);
  const newTop = newGamesRaw.slice(0, 30);

  // 2. 计算需要补充详情的 id（去重）
  const idSet = new Set();
  for (const g of hotTop) idSet.add(g.id);
  for (const g of newTop) idSet.add(g.id);
  const ids = Array.from(idSet);

  console.log(`需要拉取详情的游戏数量：${ids.length} 条`);

  // 3. 逐个拉 /game?id=xxx 详情
  const detailResults = await Promise.all(
    ids.map((id) => fetchGameDetail(id))
  );

  const detailMap = new Map();
  for (const d of detailResults) {
    if (d && d.id != null) {
      detailMap.set(d.id, d);
    }
  }

  // 4. 把列表 + 详情融合成我们自己的数据结构
  const hotList = hotTop.map((g, i) =>
    mapGame(g, detailMap.get(g.id), i, "hot")
  );
  const newList = newTop.map((g, i) =>
    mapGame(g, detailMap.get(g.id), i, "new")
  );

  // 评分榜：按 score 排序即可
  const scoreList = [...hotList].sort((a, b) => b.score - a.score);

  // 折扣榜：暂时用新品榜占位（FreeToGame 没有价格字段）
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

main().catch((err) => {
  console.error("更新排行榜失败：", err);
  process.exit(1);
});
