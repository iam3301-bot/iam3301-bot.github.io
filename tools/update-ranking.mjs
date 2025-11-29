import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = "https://www.freetogame.com/api";

// 热度：按 popularity 排序； 新品：按 release-date 排序
const HOT_URL = `${API_BASE}/games?platform=pc&sort-by=popularity`;
const NEW_URL = `${API_BASE}/games?platform=pc&sort-by=release-date`;

// 拉接口
async function fetchGames(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`请求失败 ${url} 状态码 ${res.status}`);
  }
  return res.json();
}

// 把 FreeToGame 的一条游戏，转成我们网站需要的格式
function mapGame(game, index, mode) {
  // API 没有玩家评分，这里根据名次模拟一个“看起来合理”的分数
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
    cover: game.thumbnail // 接口给的封面图片
  };
}

async function main() {
  console.log("开始从 FreeToGame API 拉取最新数据…");

  // 并行请求两个榜单
  const [hotGames, newGames] = await Promise.all([
    fetchGames(HOT_URL),
    fetchGames(NEW_URL)
  ]);

  // 取前 30 条做榜单，已经足够
  const hotList = hotGames.slice(0, 30).map((g, i) => mapGame(g, i, "hot"));
  const newList = newGames.slice(0, 30).map((g, i) => mapGame(g, i, "new"));

  // 评分榜：用热度榜按 score 排序（模拟）
  const scoreList = [...hotList].sort((a, b) => b.score - a.score);

  // 折扣榜：FreeToGame 暂时没有价格/折扣，这里先复用新品榜做演示
  const discountList = newList;

  const data = {
    hot: hotList,
    score: scoreList,
    new: newList,
    discount: discountList
  };

  // 写到仓库根目录的 ranking.json
  const outputPath = path.join(__dirname, "..", "ranking.json");
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf8");

  console.log("已写入最新排行榜数据 →", outputPath);
}

main().catch((err) => {
  console.error("更新排行榜失败：", err);
  process.exit(1);
});
