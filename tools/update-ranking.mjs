// tools/update-ranking.mjs
// 在 GitHub Actions（Node 环境）里跑，用 FreeToGame API 拉真实数据，生成 ranking.json

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://www.freetogame.com/api";

// 热度榜 & 新品榜：用平台=pc + popularity / release-date 排序
const HOT_URL = `${API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${API_BASE}/games?platform=pc&sort-by=release-date`;

// 通用请求函数
async function fetchGames(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败 ${url} 状态码 ${res.status}`);
  }
  return res.json();
}

// 把 API 返回的一条游戏，转成我们网站自己的结构
function mapGame(game, index, mode) {
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
    id: game.id,                              // ★ 保留 FreeToGame 的真实 id
    name: game.title,
    platform: `${game.platform} · ${game.genre}`,
    cover: game.thumbnail,

    // 评分（项目内部模拟）
    score,
    tag,

    // 详情页用的真实信息：直接来自 FreeToGame
    description: game.short_description,      // 简要介绍
    releaseDate: game.release_date,
    publisher: game.publisher,
    developer: game.developer,
    gameUrl: game.game_url,
    profileUrl: game.freetogame_profile_url
  };
}

async function main() {
  console.log("开始从 FreeToGame API 拉取最新数据…");

  const [hotGames, newGames] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  // 取前 30 条就够当榜单
  const hotList = hotGames.slice(0, 30).map((g, i) => mapGame(g, i, "hot"));
  const newList = newGames.slice(0, 30).map((g, i) => mapGame(g, i, "new"));

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

main().catch((err) => {
  console.error("更新排行榜失败：", err);
  process.exit(1);
});
