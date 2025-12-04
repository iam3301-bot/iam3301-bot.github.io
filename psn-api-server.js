/**
 * PlayStation Network API 代理服务器
 * 用于绕过浏览器 CORS 限制，提供 PSN 数据获取功能
 * 
 * 启动方式: node psn-api-server.js
 * 默认端口: 3001
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PSN_API_PORT || 3001;

// PSN API 配置
const PSN_AUTH_URL = 'https://ca.account.sony.com/api/authz/v3/oauth/authorize';
const PSN_TOKEN_URL = 'https://ca.account.sony.com/api/authz/v3/oauth/token';
const PSN_API_BASE = 'https://m.np.playstation.com/api';

// OAuth 配置 (使用 psn-api 库的配置)
const CLIENT_ID = 'ac8d161a-d966-4728-b0ea-ffec22f69edc';
const CLIENT_SECRET = 'kIDfbPRWBPCHvsVD';
const REDIRECT_URI = 'com.scee.psxandroid.scecompcall://redirect';
const SCOPE = 'psn:mobile.v2.core psn:clientapp';

// CORS 头
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-NPSSO',
  'Content-Type': 'application/json'
};

// 发起 HTTPS 请求
function httpsRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// 使用 NPSSO 获取 Access Code
async function exchangeNpssoForAccessCode(npsso) {
  const params = new URLSearchParams({
    access_type: 'offline',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPE
  });

  const options = {
    hostname: 'ca.account.sony.com',
    path: `/api/authz/v3/oauth/authorize?${params.toString()}`,
    method: 'GET',
    headers: {
      'Cookie': `npsso=${npsso}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const response = await httpsRequest(options);
  
  // 检查重定向以获取 code
  if (response.statusCode === 302 || response.statusCode === 303) {
    const location = response.headers.location;
    if (location) {
      const urlObj = new URL(location);
      const code = urlObj.searchParams.get('code');
      if (code) {
        return { success: true, code };
      }
    }
  }
  
  return { success: false, error: 'Failed to get access code', response };
}

// 使用 Access Code 获取 Token
async function exchangeCodeForTokens(code) {
  const postData = new URLSearchParams({
    code: code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
    token_format: 'jwt'
  }).toString();

  const options = {
    hostname: 'ca.account.sony.com',
    path: '/api/authz/v3/oauth/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const response = await httpsRequest(options, postData);
  
  if (response.statusCode === 200 && response.data) {
    return {
      success: true,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    };
  }
  
  return { success: false, error: 'Failed to get tokens', response };
}

// 调用 PSN API
async function callPsnApi(endpoint, accessToken) {
  const urlObj = new URL(endpoint, PSN_API_BASE);
  
  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  };

  return await httpsRequest(options);
}

// 获取用户资料
async function getUserProfile(accessToken, accountId = 'me') {
  const endpoint = `/userProfile/v1/internal/users/${accountId}/profiles`;
  return await callPsnApi(endpoint, accessToken);
}

// 获取奖杯概要
async function getTrophySummary(accessToken, accountId = 'me') {
  const endpoint = `/trophy/v1/users/${accountId}/trophySummary`;
  return await callPsnApi(endpoint, accessToken);
}

// 获取游戏列表（奖杯标题）
async function getUserTitles(accessToken, accountId = 'me', limit = 800) {
  const endpoint = `/trophy/v1/users/${accountId}/trophyTitles?limit=${limit}`;
  return await callPsnApi(endpoint, accessToken);
}

// 搜索用户
async function searchUser(accessToken, onlineId) {
  const endpoint = `/search/v1/universalSearch?searchTerm=${encodeURIComponent(onlineId)}&domainCategory=SocialAllAccounts`;
  return await callPsnApi(endpoint, accessToken);
}

// 处理 API 路由
async function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // 设置 CORS 头
  Object.keys(CORS_HEADERS).forEach(key => {
    res.setHeader(key, CORS_HEADERS[key]);
  });

  try {
    // 认证端点 - 交换 NPSSO
    if (path === '/api/psn/auth' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const { npsso } = JSON.parse(body);
          
          if (!npsso) {
            res.writeHead(400);
            res.end(JSON.stringify({ success: false, error: 'Missing NPSSO token' }));
            return;
          }

          // Step 1: 获取 Access Code
          const codeResult = await exchangeNpssoForAccessCode(npsso);
          if (!codeResult.success) {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Invalid NPSSO token or failed to get access code' }));
            return;
          }

          // Step 2: 获取 Tokens
          const tokenResult = await exchangeCodeForTokens(codeResult.code);
          if (!tokenResult.success) {
            res.writeHead(401);
            res.end(JSON.stringify({ success: false, error: 'Failed to exchange code for tokens' }));
            return;
          }

          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            accessToken: tokenResult.accessToken,
            refreshToken: tokenResult.refreshToken,
            expiresIn: tokenResult.expiresIn
          }));
        } catch (e) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: e.message }));
        }
      });
      return;
    }

    // 获取用户资料
    if (path === '/api/psn/profile' && req.method === 'GET') {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const accountId = query.accountId || 'me';
      
      if (!accessToken) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: 'Missing access token' }));
        return;
      }

      const result = await getUserProfile(accessToken, accountId);
      res.writeHead(result.statusCode);
      res.end(JSON.stringify(result.data));
      return;
    }

    // 获取奖杯概要
    if (path === '/api/psn/trophy-summary' && req.method === 'GET') {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const accountId = query.accountId || 'me';
      
      if (!accessToken) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: 'Missing access token' }));
        return;
      }

      const result = await getTrophySummary(accessToken, accountId);
      res.writeHead(result.statusCode);
      res.end(JSON.stringify(result.data));
      return;
    }

    // 获取游戏列表
    if (path === '/api/psn/titles' && req.method === 'GET') {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const accountId = query.accountId || 'me';
      const limit = query.limit || 800;
      
      if (!accessToken) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: 'Missing access token' }));
        return;
      }

      const result = await getUserTitles(accessToken, accountId, limit);
      res.writeHead(result.statusCode);
      res.end(JSON.stringify(result.data));
      return;
    }

    // 搜索用户
    if (path === '/api/psn/search' && req.method === 'GET') {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const onlineId = query.onlineId;
      
      if (!accessToken) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: 'Missing access token' }));
        return;
      }

      if (!onlineId) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Missing onlineId parameter' }));
        return;
      }

      const result = await searchUser(accessToken, onlineId);
      res.writeHead(result.statusCode);
      res.end(JSON.stringify(result.data));
      return;
    }

    // 健康检查
    if (path === '/api/psn/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', service: 'PSN API Proxy' }));
      return;
    }

    // 未找到路由
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));

  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

// 启动服务器
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║       PlayStation Network API Proxy Server                ║
╠═══════════════════════════════════════════════════════════╣
║  Server running on port ${PORT}                              ║
║                                                           ║
║  API Endpoints:                                           ║
║  POST /api/psn/auth         - Exchange NPSSO for tokens   ║
║  GET  /api/psn/profile      - Get user profile            ║
║  GET  /api/psn/trophy-summary - Get trophy summary        ║
║  GET  /api/psn/titles       - Get game titles list        ║
║  GET  /api/psn/search       - Search users                ║
║  GET  /api/psn/health       - Health check                ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
