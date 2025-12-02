/**
 * Steam API 服务 - 获取真实游戏封面和评分
 */

(function() {
  'use strict';

  // Steam Store API 配置
  const STEAM_STORE_API = 'https://store.steampowered.com/api/appdetails';
  const STEAM_SEARCH_API = 'https://store.steampowered.com/api/storesearch';
  
  // CORS 代理列表
  const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    ''  // 直接调用（如果浏览器允许）
  ];

  // 缓存配置
  const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7天
  const cache = new Map();

  /**
   * 简单的游戏名称标准化
   */
  function normalizeGameName(name) {
    return name
      .toLowerCase()
      .replace(/[™®©]/g, '')
      .replace(/\s*-\s*(standard|deluxe|ultimate|gold|complete|goty|definitive|remastered|enhanced)\s*edition/gi, '')
      .replace(/\s+edition$/gi, '')
      .trim();
  }

  /**
   * 搜索 Steam 游戏获取 App ID
   */
  async function searchSteamGame(gameName) {
    const normalized = normalizeGameName(gameName);
    const cacheKey = `search_${normalized}`;
    
    // 检查缓存
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      // 直接使用 Steam 搜索 API
      const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(normalized)}&cc=cn&l=schinese`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const firstMatch = data.items[0];
        const result = {
          appid: firstMatch.id,
          name: firstMatch.name,
          header_image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${firstMatch.id}/header.jpg`
        };
        
        cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn(`Steam 搜索失败 (${gameName}):`, error.message);
    }
    
    return null;
  }

  /**
   * 获取 Steam 游戏详情（包括评分）
   */
  async function getSteamGameDetails(appid) {
    const cacheKey = `details_${appid}`;
    
    // 检查缓存
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=cn&l=schinese`;
      
      const response = await fetch(detailsUrl);
      const data = await response.json();
      
      if (data[appid] && data[appid].success) {
        const gameData = data[appid].data;
        
        // 计算评分（基于 Metacritic 或用户评价）
        let rating = 7.5; // 默认评分
        
        if (gameData.metacritic && gameData.metacritic.score) {
          // Metacritic 评分转换为 10 分制
          rating = (gameData.metacritic.score / 10).toFixed(1);
        } else if (gameData.recommendations && gameData.recommendations.total) {
          // 基于推荐数量估算评分
          const recs = gameData.recommendations.total;
          if (recs > 100000) rating = 9.5;
          else if (recs > 50000) rating = 9.0;
          else if (recs > 20000) rating = 8.5;
          else if (recs > 10000) rating = 8.0;
          else if (recs > 5000) rating = 7.8;
        }
        
        const result = {
          appid: appid,
          name: gameData.name,
          header_image: gameData.header_image,
          rating: parseFloat(rating),
          price: gameData.price_overview ? gameData.price_overview.final / 100 : 0,
          release_date: gameData.release_date ? gameData.release_date.date : 'Unknown',
          short_description: gameData.short_description || '',
          publishers: gameData.publishers || [],
          developers: gameData.developers || []
        };
        
        cache.set(cacheKey, result);
        return result;
      }
    } catch (error) {
      console.warn(`获取 Steam 详情失败 (${appid}):`, error.message);
    }
    
    return null;
  }

  /**
   * 获取游戏的完整信息（封面 + 评分）
   */
  async function getGameInfo(gameName) {
    try {
      // 1. 搜索游戏获取 App ID
      const searchResult = await searchSteamGame(gameName);
      if (!searchResult) {
        return null;
      }
      
      // 2. 获取详细信息
      const details = await getSteamGameDetails(searchResult.appid);
      if (!details) {
        return {
          name: gameName,
          header_image: searchResult.header_image,
          rating: 7.5,
          appid: searchResult.appid
        };
      }
      
      return details;
    } catch (error) {
      console.error(`获取游戏信息失败 (${gameName}):`, error);
      return null;
    }
  }

  /**
   * 批量获取游戏信息
   */
  async function batchGetGameInfo(gameNames, onProgress) {
    const results = [];
    const total = gameNames.length;
    
    for (let i = 0; i < gameNames.length; i++) {
      const gameName = gameNames[i];
      const info = await getGameInfo(gameName);
      results.push(info);
      
      if (onProgress) {
        onProgress(i + 1, total);
      }
      
      // 避免请求过快，每个请求间隔 200ms
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return results;
  }

  /**
   * 根据 Steam App ID 生成封面 URL
   */
  function getSteamCoverUrl(appid) {
    if (!appid) return null;
    return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
  }

  // 导出 API
  window.steamAPI = {
    searchGame: searchSteamGame,
    getGameDetails: getSteamGameDetails,
    getGameInfo: getGameInfo,
    batchGetGameInfo: batchGetGameInfo,
    getSteamCoverUrl: getSteamCoverUrl,
    normalizeGameName: normalizeGameName
  };

  console.log('🎮 Steam API 服务已加载');
})();
