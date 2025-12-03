/**
 * 简单的静态文件服务器 + Steam API 代理
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3000;

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

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
    res.end(JSON.stringify({ error: 'API not found' }));
  }
}

// 提供静态文件
function serveStaticFile(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // 移除查询字符串
  filePath = filePath.split('?')[0];
  
  // 安全性检查：防止目录遍历
  filePath = path.normalize(filePath);
  if (filePath.includes('..')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }
  
  const fullPath = path.join(__dirname, filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
      }
      return;
    }
    
    res.writeHead(200, { 
      'Content-Type': contentType,
      ...CORS_HEADERS
    });
    res.end(data);
  });
}

// 创建服务器
const server = http.createServer((req, res) => {
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // 路由分发
  if (req.url.startsWith('/api/steam')) {
    proxySteamRequest(req, res);
  } else {
    serveStaticFile(req, res);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📄 静态文件服务已启动`);
  console.log(`📡 Steam API 代理端点:`);
  console.log(`   - /api/steam?term=游戏名`);
  console.log(`   - /api/steam/appdetails?appid=应用ID`);
});
