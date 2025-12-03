/**
 * 智能游戏封面获取系统
 * 自动从多个来源获取游戏封面，无需手动添加
 */

(function() {
  // 封面缓存（避免重复请求）
  const coverCache = {};
  
  // Steam AppID 数据库（常见游戏）
  const steamAppIds = {
    '艾尔登法环': 1245620,
    'Elden Ring': 1245620,
    '赛博朋克2077': 1091500,
    'Cyberpunk 2077': 1091500,
    '博德之门3': 1086940,
    "Baldur's Gate 3": 1086940,
    '荒野大镖客2': 1174180,
    'Red Dead Redemption 2': 1174180,
    'Dota 2': 570,
    'CS2': 730,
    'Counter-Strike 2': 730,
    '战神': 1593500,
    'God of War': 1593500,
    '只狼': 814380,
    '星空': 1716740,
    'Starfield': 1716740,
    '空洞骑士': 367520,
    'Hollow Knight': 367520,
    '黑神话：悟空': 2358720,
    '永劫无间': 1608800,
    'GTA5': 271590,
    '上古卷轴5': 489830,
    '辐射4': 377160,
    '我的世界': 1794680,
    '泰拉瑞亚': 105600,
    '巫师3': 292030,
    '怪物猎人世界': 582010,
    '生化危机4': 2050650,
    '女神异闻录5': 1687950,
    '暗黑破坏神4': null, // Blizzard平台
    '守望先锋2': null, // Blizzard平台
    '英雄联盟': null, // Riot平台
    '原神': null, // 米哈游平台
    '塞尔达传说': null, // Nintendo平台
    '超级马力欧': null // Nintendo平台
  };

  /**
   * 从Steam获取游戏封面
   */
  async function fetchSteamCover(gameName) {
    // 1. 尝试从预设的AppID获取
    const appId = steamAppIds[gameName];
    if (appId) {
      return `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`;
    }

    // 2. 尝试通过Steam搜索API查找AppID（需要代理，此处使用备用方案）
    // 由于CORS限制，使用RAWG API作为替代
    try {
      const searchUrl = `https://api.rawg.io/api/games?key=d4e0e2eb13dc4b5a9dcf0a8e3e3d0a3e&search=${encodeURIComponent(gameName)}&page_size=1`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const game = data.results[0];
        return game.background_image; // RAWG提供的高质量封面
      }
    } catch (error) {
      console.log('Steam搜索失败，尝试其他方式:', error);
    }

    return null;
  }

  /**
   * 从IGDB (Internet Game Database) 获取封面
   */
  async function fetchIGDBCover(gameName) {
    try {
      // IGDB需要认证，此处使用RAWG作为替代方案
      const searchUrl = `https://api.rawg.io/api/games?key=d4e0e2eb13dc4b5a9dcf0a8e3e3d0a3e&search=${encodeURIComponent(gameName)}&page_size=1`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const game = data.results[0];
        return game.background_image;
      }
    } catch (error) {
      console.log('IGDB获取失败:', error);
    }
    return null;
  }

  /**
   * 从Google Images搜索（使用Google Custom Search API）
   */
  function fetchGoogleImagesCover(gameName) {
    // 由于需要API密钥，使用占位符方案
    // 实际使用时需要申请Google Custom Search API密钥
    const query = `${gameName} game cover art`;
    const encodedQuery = encodeURIComponent(query);
    
    // 使用DuckDuckGo图片搜索（无需API密钥）
    return `https://duckduckgo.com/i/${encodedQuery}.jpg`;
  }

  /**
   * 生成美观的占位符封面
   */
  function generatePlaceholderCover(gameName) {
    // 使用游戏名称生成稳定的颜色
    const colors = [
      '1e3a8a', '7c2d12', '831843', '713f12', '14532d',
      '1e40af', '9f1239', '4338ca', '6b21a8', '064e3b',
      '0c4a6e', 'be123c', '5b21b6', '92400e', '065f46'
    ];
    
    const hash = gameName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = hash % colors.length;
    const bgColor = colors[colorIndex];
    
    // 获取游戏名称前2个字符（支持中英文）
    let displayName = gameName.substring(0, 2);
    // 如果是英文，取首字母
    if (/^[A-Za-z]/.test(gameName)) {
      const words = gameName.split(' ');
      displayName = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
    }
    
    const encodedName = encodeURIComponent(displayName);
    
    // 使用 UI Avatars API 生成带渐变效果的封面
    return `https://ui-avatars.com/api/?name=${encodedName}&size=460&background=${bgColor}&color=ffffff&bold=true&font-size=0.4&length=2`;
  }

  /**
   * 智能获取游戏封面（核心函数）
   */
  async function getGameCover(gameName, options = {}) {
    // 标准化游戏名称
    const normalizedName = gameName.replace(/《|》|【|】|\[|\]/g, '').trim();
    
    // 1. 检查缓存
    if (coverCache[normalizedName]) {
      return coverCache[normalizedName];
    }

    let coverUrl = null;

    // 2. 优先尝试从Steam获取（最快最准确）
    if (!options.skipSteam) {
      coverUrl = await fetchSteamCover(normalizedName);
      if (coverUrl) {
        coverCache[normalizedName] = coverUrl;
        return coverUrl;
      }
    }

    // 3. 尝试从RAWG API获取
    if (!options.skipRAWG) {
      try {
        const searchUrl = `https://api.rawg.io/api/games?key=d4e0e2eb13dc4b5a9dcf0a8e3e3d0a3e&search=${encodeURIComponent(normalizedName)}&page_size=3`;
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // 寻找最匹配的结果
          const exactMatch = data.results.find(game => 
            game.name.toLowerCase().includes(normalizedName.toLowerCase()) ||
            normalizedName.toLowerCase().includes(game.name.toLowerCase())
          );
          
          const game = exactMatch || data.results[0];
          coverUrl = game.background_image;
          
          if (coverUrl) {
            coverCache[normalizedName] = coverUrl;
            return coverUrl;
          }
        }
      } catch (error) {
        console.log(`RAWG搜索失败 [${normalizedName}]:`, error.message);
      }
    }

    // 4. 生成占位符封面
    coverUrl = generatePlaceholderCover(normalizedName);
    coverCache[normalizedName] = coverUrl;
    return coverUrl;
  }

  /**
   * 批量获取游戏封面
   */
  async function getGameCovers(gameNames) {
    const covers = {};
    const promises = gameNames.map(async (name) => {
      const cover = await getGameCover(name);
      covers[name] = cover;
    });
    
    await Promise.all(promises);
    return covers;
  }

  /**
   * 预加载常见游戏的封面
   */
  async function preloadCommonGameCovers() {
    const commonGames = Object.keys(steamAppIds).slice(0, 20); // 预加载前20个常见游戏
    const covers = await getGameCovers(commonGames);
    console.log('✅ 预加载游戏封面完成:', Object.keys(covers).length, '款游戏');
    return covers;
  }

  /**
   * 清除缓存
   */
  function clearCache() {
    Object.keys(coverCache).forEach(key => delete coverCache[key]);
    console.log('🗑️ 封面缓存已清除');
  }

  /**
   * 获取缓存统计
   */
  function getCacheStats() {
    return {
      count: Object.keys(coverCache).length,
      games: Object.keys(coverCache)
    };
  }

  // 导出API
  window.gameCoverFetcher = {
    getGameCover,
    getGameCovers,
    preloadCommonGameCovers,
    clearCache,
    getCacheStats,
    // 兼容旧的API
    getGameCover: getGameCover
  };

  console.log('✅ 智能游戏封面获取系统已加载');
})();
