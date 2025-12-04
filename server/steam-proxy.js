/**
 * Steam API 代理服务器
 * 
 * 用于解决 Steam API 的 CORS 限制问题
 * 支持获取用户信息、游戏库、成就等数据
 */

const http = require('http');
const https = require('https');
const url = require('url');

// 配置
const CONFIG = {
  port: process.env.PORT || 3001,
  steamApiBase: 'https://api.steampowered.com',
  allowedOrigins: ['*'], // 生产环境应限制为特定域名
};

// Steam API 端点白名单
const ALLOWED_ENDPOINTS = [
  '/ISteamUser/GetPlayerSummaries/v2/',
  '/IPlayerService/GetOwnedGames/v1/',
  '/IPlayerService/GetRecentlyPlayedGames/v1/',
  '/ISteamUserStats/GetPlayerAchievements/v1/',
  '/ISteamUserStats/GetUserStatsForGame/v2/',
  '/ISteamUserStats/GetSchemaForGame/v2/',
  '/ISteamApps/GetAppList/v2/',
  '/IPlayerService/GetSteamLevel/v1/',
  '/ISteamUser/GetFriendList/v1/',
  '/ISteamUser/ResolveVanityURL/v1/',
];

// 创建服务器
const server = http.createServer((req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Steam-API-Key');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // 健康检查
  if (pathname === '/health' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'Steam API Proxy',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Steam API 代理
  if (pathname.startsWith('/steam-api')) {
    handleSteamApiProxy(req, res, parsedUrl);
    return;
  }

  // Steam OpenID 验证
  if (pathname === '/steam-openid/verify') {
    handleOpenIdVerify(req, res, parsedUrl);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

/**
 * 处理 Steam API 代理请求
 */
function handleSteamApiProxy(req, res, parsedUrl) {
  const query = parsedUrl.query;
  const endpoint = query.endpoint;
  const apiKey = query.key || req.headers['x-steam-api-key'];

  // 验证端点
  if (!endpoint) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing endpoint parameter' }));
    return;
  }

  // 检查端点是否在白名单中
  const isAllowed = ALLOWED_ENDPOINTS.some(allowed => endpoint.startsWith(allowed));
  if (!isAllowed) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not allowed' }));
    return;
  }

  // 构建 Steam API URL
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (key !== 'endpoint') {
      queryParams.append(key, value);
    }
  }

  const steamUrl = `${CONFIG.steamApiBase}${endpoint}?${queryParams.toString()}`;
  console.log(`[Steam API] Proxying to: ${steamUrl.replace(/key=[^&]+/, 'key=***')}`);

  // 发起请求到 Steam API
  https.get(steamUrl, (steamRes) => {
    let data = '';

    steamRes.on('data', chunk => {
      data += chunk;
    });

    steamRes.on('end', () => {
      res.writeHead(steamRes.statusCode, {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300' // 缓存5分钟
      });
      res.end(data);
    });

  }).on('error', (error) => {
    console.error('[Steam API Error]', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Steam API request failed', message: error.message }));
  });
}

/**
 * 处理 Steam OpenID 验证
 */
function handleOpenIdVerify(req, res, parsedUrl) {
  const query = parsedUrl.query;

  // 验证必需参数
  const required = ['openid.assoc_handle', 'openid.signed', 'openid.sig', 'openid.claimed_id'];
  for (const param of required) {
    if (!query[param]) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Missing parameter: ${param}` }));
      return;
    }
  }

  // 构建验证请求参数
  const verifyParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    verifyParams.append(key, value);
  }
  verifyParams.set('openid.mode', 'check_authentication');

  // 发送验证请求到 Steam
  const verifyUrl = 'https://steamcommunity.com/openid/login';
  const postData = verifyParams.toString();

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const verifyReq = https.request(verifyUrl, options, (verifyRes) => {
    let data = '';

    verifyRes.on('data', chunk => {
      data += chunk;
    });

    verifyRes.on('end', () => {
      const isValid = data.includes('is_valid:true');
      
      if (isValid) {
        // 从 claimed_id 提取 Steam ID
        const steamIdMatch = query['openid.claimed_id'].match(/\/id\/(\d+)$/);
        const steamId = steamIdMatch ? steamIdMatch[1] : null;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          valid: true,
          steamId: steamId,
          claimedId: query['openid.claimed_id']
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          valid: false,
          error: 'OpenID verification failed'
        }));
      }
    });
  });

  verifyReq.on('error', (error) => {
    console.error('[OpenID Verify Error]', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Verification request failed', message: error.message }));
  });

  verifyReq.write(postData);
  verifyReq.end();
}

// 启动服务器
server.listen(CONFIG.port, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎮 Steam API Proxy Server                               ║
║                                                            ║
║   Server running at http://localhost:${CONFIG.port}              ║
║                                                            ║
║   Endpoints:                                               ║
║   • GET  /                      - Health check            ║
║   • GET  /steam-api?endpoint=   - Steam API proxy         ║
║   • GET  /steam-openid/verify   - OpenID verification     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down...');
  server.close(() => {
    console.log('[Server] Goodbye!');
    process.exit(0);
  });
});
