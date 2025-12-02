/**
 * 简单的 Node.js 代理服务器
 * 用于解决前端调用 Steam API 的 CORS 问题
 * 运行: node server.js
 */

import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const PORT = 3000;

// CORS 头
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 代理 Steam API 请求
function proxySteamRequest(req, res) {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // Steam Search API
  if (pathname === '/api/steam') {
    const term = parsedUrl.searchParams.get('term');
    if (!term) {
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'Missing term parameter' }));
      return;
    }

    const steamUrl = `https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(term)}&cc=us&l=en`;
    
    https.get(steamUrl, (steamRes) => {
      let data = '';
      steamRes.on('data', (chunk) => data += chunk);
      steamRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
        res.end(data);
      });
    }).on('error', (err) => {
      console.error('Steam API 错误:', err);
      res.writeHead(502, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'Steam API request failed', message: err.message }));
    });
  }
  // Steam App Details API
  else if (pathname === '/api/steam/appdetails') {
    const appid = parsedUrl.searchParams.get('appid');
    if (!appid) {
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'Missing appid parameter' }));
      return;
    }

    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    
    https.get(steamUrl, (steamRes) => {
      let data = '';
      steamRes.on('data', (chunk) => data += chunk);
      steamRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
        res.end(data);
      });
    }).on('error', (err) => {
      console.error('Steam API 错误:', err);
      res.writeHead(502, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ error: 'Steam API request failed', message: err.message }));
    });
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json', ...CORS_HEADERS });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}

const server = http.createServer((req, res) => {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // 处理代理请求
  if (req.url.startsWith('/api/steam')) {
    proxySteamRequest(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain', ...CORS_HEADERS });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 代理服务器运行在 http://localhost:${PORT}`);
  console.log(`📡 Steam API 代理端点:`);
  console.log(`   - http://localhost:${PORT}/api/steam?term=游戏名`);
  console.log(`   - http://localhost:${PORT}/api/steam/appdetails?appid=应用ID`);
});
