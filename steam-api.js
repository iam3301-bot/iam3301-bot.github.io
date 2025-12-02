/**
 * Steam API 工具类 - 支持多种代理方案
 * 
 * 优先级顺序：
 * 1. Cloudflare Worker（推荐，需要部署）
 * 2. 公共 CORS 代理（备用，可能不稳定）
 * 3. 直接调用（通常会失败，仅用于测试）
 */

class SteamAPI {
  constructor() {
    // API 端点配置（按优先级排序）
    this.endpoints = [
      {
        name: 'Cloudflare Worker',
        baseUrl: 'https://steam-proxy.yourdomain.workers.dev', // 👈 部署后替换这里
        enabled: false, // 部署后改为 true
        priority: 1
      },
      {
        name: 'Public CORS Proxy 1',
        baseUrl: 'https://api.allorigins.win/raw?url=',
        enabled: true,
        priority: 2,
        urlWrapper: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      },
      {
        name: 'Public CORS Proxy 2',
        baseUrl: 'https://corsproxy.io/?',
        enabled: true,
        priority: 3,
        urlWrapper: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
      },
      {
        name: 'Direct Steam API',
        baseUrl: 'https://store.steampowered.com/api',
        enabled: false, // CORS 会失败，仅用于测试
        priority: 99
      }
    ];
    
    // 当前使用的端点索引
    this.currentEndpointIndex = 0;
    
    // 获取可用的端点
    this.availableEndpoints = this.endpoints
      .filter(ep => ep.enabled)
      .sort((a, b) => a.priority - b.priority);
  }
  
  /**
   * 搜索 Steam 游戏
   * @param {string} term - 搜索关键词
   * @returns {Promise<Object>} Steam 搜索结果
   */
  async searchGame(term) {
    if (!term) return null;
    
    const steamUrl = `https://store.steampowered.com/api/storesearch?term=${encodeURIComponent(term)}&cc=us&l=en`;
    
    return this._requestWithFallback(steamUrl, '/api/steam?term=' + encodeURIComponent(term));
  }
  
  /**
   * 获取 Steam 游戏详情
   * @param {number|string} appId - Steam 应用 ID
   * @returns {Promise<Object>} Steam 游戏详情
   */
  async getGameDetails(appId) {
    if (!appId) return null;
    
    const steamUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    
    return this._requestWithFallback(steamUrl, '/api/steam/appdetails?appid=' + appId);
  }
  
  /**
   * 使用备用方案请求数据
   * @private
   */
  async _requestWithFallback(directUrl, proxyPath) {
    const errors = [];
    
    // 尝试所有可用的端点
    for (let i = 0; i < this.availableEndpoints.length; i++) {
      const endpoint = this.availableEndpoints[i];
      
      try {
        console.log(`[SteamAPI] 尝试使用: ${endpoint.name}`);
        
        let requestUrl;
        
        // 构建请求 URL
        if (endpoint.urlWrapper) {
          // 使用 URL 包装器（公共代理）
          requestUrl = endpoint.urlWrapper(directUrl);
        } else if (endpoint.baseUrl.includes('workers.dev')) {
          // Cloudflare Worker
          requestUrl = endpoint.baseUrl + proxyPath;
        } else {
          // 直接调用
          requestUrl = directUrl;
        }
        
        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        console.log(`[SteamAPI] ✅ 成功使用: ${endpoint.name}`);
        
        // 记住成功的端点
        this.currentEndpointIndex = i;
        
        return data;
        
      } catch (error) {
        console.warn(`[SteamAPI] ❌ ${endpoint.name} 失败:`, error.message);
        errors.push({ endpoint: endpoint.name, error: error.message });
      }
    }
    
    // 所有端点都失败了
    console.error('[SteamAPI] 所有端点都失败了:', errors);
    throw new Error('无法连接到 Steam API，所有代理都失败了');
  }
  
  /**
   * 获取游戏推荐配置
   * @param {string} gameName - 游戏名称
   * @returns {Promise<Object|null>} 推荐配置对象或 null
   */
  async getRecommendedRequirements(gameName) {
    try {
      // 1. 搜索游戏获取 appId
      const searchResult = await this.searchGame(gameName);
      
      if (!searchResult || !searchResult.items || searchResult.items.length === 0) {
        console.log(`[SteamAPI] 未找到游戏: ${gameName}`);
        return null;
      }
      
      const appId = searchResult.items[0].id;
      
      // 2. 获取游戏详情
      const details = await this.getGameDetails(appId);
      
      if (!details || !details[appId] || !details[appId].success) {
        console.log(`[SteamAPI] 无法获取游戏详情: ${gameName}`);
        return null;
      }
      
      const pcRequirements = details[appId].data.pc_requirements;
      
      if (!pcRequirements || !pcRequirements.recommended) {
        console.log(`[SteamAPI] 游戏无推荐配置: ${gameName}`);
        return null;
      }
      
      // 3. 解析 HTML 格式的配置
      return this._parseRequirementsHTML(pcRequirements.recommended);
      
    } catch (error) {
      console.error(`[SteamAPI] 获取推荐配置失败:`, error);
      return null;
    }
  }
  
  /**
   * 解析 Steam HTML 格式的系统配置
   * @private
   */
  _parseRequirementsHTML(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') return null;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const text = doc.body.textContent || '';
    
    const result = {};
    
    // 提取各项配置
    const patterns = {
      os: /OS[:\s]*([^\n]+)/i,
      processor: /Processor[:\s]*([^\n]+)/i,
      memory: /Memory[:\s]*([^\n]+)/i,
      graphics: /Graphics[:\s]*([^\n]+)/i,
      storage: /Storage[:\s]*([^\n]+)/i,
      directx: /DirectX[:\s]*([^\n]+)/i
    };
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result[key] = match[1].trim();
      }
    }
    
    return Object.keys(result).length > 0 ? result : null;
  }
}

// 创建全局实例
const steamAPI = new SteamAPI();

// 导出（支持多种模块系统）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = steamAPI;
}
if (typeof window !== 'undefined') {
  window.steamAPI = steamAPI;
}
