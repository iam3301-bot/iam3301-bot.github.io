/**
 * Cloudflare Worker - Steam API CORS Proxy
 * 
 * 部署步骤：
 * 1. 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up
 * 2. 进入 Workers & Pages
 * 3. 创建新 Worker
 * 4. 复制此代码到编辑器
 * 5. 点击 "Save and Deploy"
 * 6. 获得你的 Worker URL：https://your-worker.your-subdomain.workers.dev
 * 
 * 免费额度：每天 100,000 次请求
 */

// CORS 头配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// 处理 OPTIONS 预检请求
function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}

// 处理 Steam 搜索请求
async function handleSteamSearch(url) {
  const term = url.searchParams.get('term');
  
  if (!term) {
    return new Response(JSON.stringify({ error: 'Missing term parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    const steamUrl = `https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(term)}&cc=us&l=en`;
    const response = await fetch(steamUrl);
    const data = await response.text();
    
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Steam API request failed', 
      message: error.message 
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// 处理 Steam 应用详情请求
async function handleSteamAppDetails(url) {
  const appid = url.searchParams.get('appid');
  
  if (!appid) {
    return new Response(JSON.stringify({ error: 'Missing appid parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
    const response = await fetch(steamUrl);
    const data = await response.text();
    
    return new Response(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Steam API request failed', 
      message: error.message 
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// 主处理函数
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // 处理 OPTIONS 预检
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }
  
  // 路由处理
  if (url.pathname === '/api/steam') {
    return handleSteamSearch(url);
  } else if (url.pathname === '/api/steam/appdetails') {
    return handleSteamAppDetails(url);
  } else if (url.pathname === '/' || url.pathname === '') {
    // 返回使用说明
    return new Response(JSON.stringify({
      name: 'Steam API CORS Proxy',
      version: '1.0.0',
      endpoints: {
        search: '/api/steam?term=游戏名称',
        appdetails: '/api/steam/appdetails?appid=应用ID'
      },
      examples: {
        search: url.origin + '/api/steam?term=Dota2',
        appdetails: url.origin + '/api/steam/appdetails?appid=570'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } else {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

// Cloudflare Worker 入口
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// 如果是 Node.js 环境（用于本地测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleRequest };
}
