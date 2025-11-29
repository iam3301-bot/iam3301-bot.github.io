import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://www.freetogame.com/api";

const HOT_URL = `${API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${API_BASE}/games?platform=pc&sort-by=release-date`;

async function fetchGames(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败 ${url} 状态码 ${res.status}`);
  }
  return res.json();
}

function mapGame(game, index, mode) {
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
    name: game.title,
    platform: `${game.platform} · ${game.genre}`,
    score,
    tag,
    cover: game.thumbnail
  };
}

async function main() {
  console.log("开始从 FreeToGame API 拉取最新数据…");

  const [hotGames, newGames] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  const hotList = hotGames.slice(0, 30).map((g, i) => mapGame(g, i, "hot"));
  const newList = newGames.slice(0, 30).map((g, i) => mapGame(g, i, "new"));
  const scoreList = [...hotList].sort((a, b) => b.score - a.score);
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
