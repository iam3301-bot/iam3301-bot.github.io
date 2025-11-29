// proxyServer.js
const express = require("express");  // 引入 express 模块
const fetch = require("node-fetch");  // 引入 node-fetch 模块
const cors = require("cors");  // 引入 CORS 模块

const app = express();  // 创建 express 应用
const port = 3000;  // 设置代理服务器的端口

// 启用 CORS，允许来自所有源的请求
app.use(cors());

// 代理 Steam API 请求
app.get("/api/steam", async (req, res) => {
  const { term } = req.query;  // 从查询参数中获取游戏名称
  if (!term) {
    return res.status(400).json({ error: "缺少游戏名称参数" });
  }

  // Steam API 请求 URL，查询游戏
  const steamApiUrl = `https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(term)}&cc=us&l=en`;

  try {
    // 向 Steam API 发起请求
    const response = await fetch(steamApiUrl);  // 向 Steam 发送 GET 请求
    const data = await response.json();  // 获取响应数据并转换为 JSON 格式

    // 返回 Steam 的数据
    res.json(data);  // 将 Steam 数据发送回前端
  } catch (error) {
    console.error("获取 Steam 数据失败:", error);
    res.status(500).json({ error: "无法从 Steam 获取数据" });  // 错误处理
  }
});

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`代理服务器正在运行在 http://localhost:${port}`);
});
