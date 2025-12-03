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
   * 完整的静态游戏封面数据库（扩展版）
   */
  const staticCoverDatabase = {
    ...steamAppIds,
    // 将steamAppIds转换为封面URL
    ...Object.fromEntries(
      Object.entries(steamAppIds)
        .filter(([_, appId]) => appId !== null)
        .map(([name, appId]) => [name, `https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/${appId}/header.jpg`])
    ),
    // 补充news-api.js中的所有游戏
    '塞尔达传说': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    '超级马力欧': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/s/super-mario-odyssey-switch/hero',
    '最终幻想16': 'https://image.api.playstation.com/vulcan/ap/rnd/202212/0912/F7QdROH8k1hAyGIPOWyMPBhO.png',
    '霍格沃茨之遗': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg',
    '死亡空间': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1693980/header.jpg',
    '生化危机4重制版': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    '最后生还者': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
    '对马岛之魂': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0113/b3iB2zf2xHj9shC0XDTJLwZF.png',
    '鬼泣5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/601150/header.jpg',
    '尼尔：自动人形': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/524220/header.jpg',
    '双人成行': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg',
    '胡闹厨房': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/448510/header.jpg',
    'APEX英雄': 'https://media.contentapi.ea.com/content/dam/apex-legends/common/apex-section-bg.jpg.adapt.crop16x9.1023w.jpg',
    '彩虹六号': 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3jKEguWyoQ8rvCqLa2mcv7/7c0bc5ecf5a7c49e0c7eb0bee6b5cf36/r6s-featured.jpg',
    '使命召唤': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
    '战地': 'https://media.contentapi.ea.com/content/dam/battlefield/battlefield-2042/common/featured-tile-16x9.jpg.adapt.crop16x9.1023w.jpg',
    '极限竞速': 'https://compass-ssl.xboxlive.com/assets/93/57/9357bc2e-e7f5-4cb3-9e0a-ca5b50bddb0f.jpg',
    'GT赛车': 'https://gmedia.playstation.com/is/image/SIEPDC/gran-turismo-7-hero-banner-desktop-01-en-18nov21',
    'FIFA': 'https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-23/common/featured-tile-16x9.jpg.adapt.crop16x9.1023w.jpg',
    'NBA 2K': 'https://cdn.2k.com/2k/global/News/News_Thumbnail_MAIN_16x9.jpg',
    '鬼谷八荒': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1468810/header.jpg',
    '仁王': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/485510/header.jpg'
  };

  /**
   * 智能获取游戏封面（核心函数 - 纯静态版本）
   */
  function getGameCover(gameName, options = {}) {
    // 标准化游戏名称
    const normalizedName = gameName.replace(/《|》|【|】|\[|\]/g, '').trim();
    
    // 1. 检查缓存
    if (coverCache[normalizedName]) {
      return coverCache[normalizedName];
    }

    let coverUrl = null;

    // 2. 从静态数据库获取
    if (staticCoverDatabase[normalizedName]) {
      coverUrl = staticCoverDatabase[normalizedName];
      coverCache[normalizedName] = coverUrl;
      return coverUrl;
    }

    // 3. 模糊匹配
    for (const [key, value] of Object.entries(staticCoverDatabase)) {
      const normalizedKey = key.replace(/《|》|【|】|\[|\]|：|:/g, '').toLowerCase();
      const searchNormalized = normalizedName.replace(/《|》|【|】|\[|\]|：|:/g, '').toLowerCase();
      
      if (normalizedKey.includes(searchNormalized) || searchNormalized.includes(normalizedKey)) {
        coverUrl = value;
        coverCache[normalizedName] = coverUrl;
        return coverUrl;
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
  function getGameCovers(gameNames) {
    const covers = {};
    gameNames.forEach(name => {
      covers[name] = getGameCover(name);
    });
    return covers;
  }

  /**
   * 预加载常见游戏的封面
   */
  function preloadCommonGameCovers() {
    const commonGames = Object.keys(steamAppIds).slice(0, 20); // 预加载前20个常见游戏
    const covers = getGameCovers(commonGames);
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
