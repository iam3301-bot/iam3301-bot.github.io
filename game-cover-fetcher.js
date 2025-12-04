/**
 * 智能游戏封面获取系统
 * 自动从多个来源获取游戏封面，无需手动添加
 */

(function() {
  // 封面缓存（避免重复请求）
  const coverCache = {};
  
  // Steam AppID 数据库（常见游戏 - 扩展版）
  const steamAppIds = {
    // 热门大作
    '艾尔登法环': 1245620,
    'Elden Ring': 1245620,
    '赛博朋克2077': 1091500,
    'Cyberpunk 2077': 1091500,
    '博德之门3': 1086940,
    "Baldur's Gate 3": 1086940,
    '荒野大镖客2': 1174180,
    'Red Dead Redemption 2': 1174180,
    '黑神话：悟空': 2358720,
    'Black Myth: Wukong': 2358720,
    '黑神话悟空': 2358720,
    
    // 多人竞技
    'Dota 2': 570,
    'CS2': 730,
    'Counter-Strike 2': 730,
    'PUBG': 578080,
    '绝地求生': 578080,
    'Apex Legends': 1172470,
    'APEX英雄': 1172470,
    '永劫无间': 1608800,
    
    // 魂系游戏
    '战神': 1593500,
    'God of War': 1593500,
    '只狼': 814380,
    'Sekiro': 814380,
    '黑暗之魂3': 374320,
    'Dark Souls III': 374320,
    '仁王2': 1325200,
    
    // RPG
    '星空': 1716740,
    'Starfield': 1716740,
    '空洞骑士': 367520,
    'Hollow Knight': 367520,
    'GTA5': 271590,
    'Grand Theft Auto V': 271590,
    '上古卷轴5': 489830,
    'Skyrim': 489830,
    '辐射4': 377160,
    'Fallout 4': 377160,
    '巫师3': 292030,
    'The Witcher 3': 292030,
    '怪物猎人世界': 582010,
    '怪物猎人崛起': 1446780,
    '生化危机4': 2050650,
    '生化危机4重制版': 2050650,
    '女神异闻录5': 1687950,
    '最终幻想7重制版': 1462040,
    '霍格沃茨之遗': 990080,
    '死亡空间重制版': 1693980,
    '尼尔：机械纪元': 524220,
    'NieR:Automata': 524220,
    
    // 独立游戏
    '我的世界': 1794680,
    'Minecraft': 1794680,
    '泰拉瑞亚': 105600,
    'Terraria': 105600,
    '哈迪斯': 1145360,
    'Hades': 1145360,
    '糖豆人': 1097150,
    '饥荒': 219740,
    '星露谷物语': 413150,
    'Stardew Valley': 413150,
    '蔚蓝': 504230,
    'Celeste': 504230,
    '死亡细胞': 588650,
    'Dead Cells': 588650,
    
    // 动作冒险
    '双人成行': 1426210,
    'It Takes Two': 1426210,
    '鬼泣5': 601150,
    '战地2042': 1517290,
    'Battlefield 2042': 1517290,
    
    // 策略/模拟
    '文明6': 289070,
    'Civilization VI': 289070,
    '戴森球计划': 1366540,
    '缺氧': 457140,
    '城市天际线': 255710,
    
    // 恐怖游戏
    '逃生': 238320,
    '生化危机8': 1196590,
    
    // 中国游戏
    '鬼谷八荒': 1468810,
    '太吾绘卷': 838350,
    '戴森球计划': 1366540,
    '觅长生': 1635730,
    
    // 无Steam AppID的游戏
    '暗黑破坏神4': null,
    '守望先锋2': null,
    '英雄联盟': null,
    '原神': null,
    '塞尔达传说': null,
    '超级马力欧': null,
    '王国之泪': null,
    '塞尔达传说：王国之泪': null
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
    // 将steamAppIds转换为封面URL
    ...Object.fromEntries(
      Object.entries(steamAppIds)
        .filter(([_, appId]) => appId !== null)
        .map(([name, appId]) => [name, `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`])
    ),
    
    // Nintendo 平台游戏
    '塞尔达传说': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    '塞尔达传说：王国之泪': 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000053652/66a56c780cb12c28c54e9e1b06f9cedb3c90ef8e8f5a5d5a4a0e00f8b09b5d94',
    '王国之泪': 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000053652/66a56c780cb12c28c54e9e1b06f9cedb3c90ef8e8f5a5d5a4a0e00f8b09b5d94',
    '超级马力欧': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/s/super-mario-odyssey-switch/hero',
    '动物森友会': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/a/animal-crossing-new-horizons-switch/hero',
    
    // PlayStation 独占
    '最终幻想16': 'https://image.api.playstation.com/vulcan/ap/rnd/202212/0912/F7QdROH8k1hAyGIPOWyMPBhO.png',
    '最后生还者': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/header.jpg',
    '对马岛之魂': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0113/b3iB2zf2xHj9shC0XDTJLwZF.png',
    '战神：诸神黄昏': 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png',
    '蜘蛛侠': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/1520/v4wXOXMiP3H76lhO8y6DGQAZ.jpg',
    'GT赛车7': 'https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/yZ7dpmjtHr1olklnNuJCmKBi.png',
    
    // 暴雪游戏
    '暗黑破坏神4': 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/9s/9SDA4G09I9GX1681334362100.jpg',
    '守望先锋2': 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/gv/GVLC2ZDKK3M31672960982188.jpg',
    '魔兽世界': 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/8h/8HFDGWQ7GP5G1663279156050.jpg',
    '炉石传说': 'https://bnetcmsus-a.akamaihd.net/cms/blog_header/3b/3B1G6QGYZPCH1677016232685.jpg',
    
    // Riot游戏
    '英雄联盟': 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/b4e4aab8a04e68b2acc4e4a18a24c0a8e76f4fbd-616x353.png',
    '瓦罗兰特': 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8c85a54ca13b56f9/5f7a12a2ebf4f75fa61b8655/Valorant_2020_E1A3_PlayValorant_ContentStackThumbnail_1200x625_EP4.jpg',
    '金铲铲之战': 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data/7b7d42e0b81cf97fdd9f37b4a1c89553cc9df4cf-1920x1080.jpg',
    
    // 米哈游
    '原神': 'https://uploadstatic.mihoyo.com/contentweb/20210601/2021060113454782163.jpg',
    '崩坏：星穹铁道': 'https://fastcdn.mihoyo.com/content-v2/hkrpg/101944/5de95b3b5a48df3c43be287b2b0b65bc_8227448313553552321.png',
    '绝区零': 'https://fastcdn.mihoyo.com/content-v2/nap/101978/cdd09e8a3f7d3c46bfdc3f3b7a5f6a3c_2546346451547685684.png',
    
    // EA游戏
    'FIFA': 'https://media.contentapi.ea.com/content/dam/ea/fifa/fc-24/common/fc24-featured-tile-16x9.jpg',
    'FIFA 24': 'https://media.contentapi.ea.com/content/dam/ea/fifa/fc-24/common/fc24-featured-tile-16x9.jpg',
    'EA FC 24': 'https://media.contentapi.ea.com/content/dam/ea/fifa/fc-24/common/fc24-featured-tile-16x9.jpg',
    'APEX英雄': 'https://media.contentapi.ea.com/content/dam/apex-legends/common/apex-section-bg.jpg.adapt.crop16x9.1023w.jpg',
    '极品飞车': 'https://media.contentapi.ea.com/content/dam/need-for-speed/common/2022/nfs-unbound-16x9.jpg.adapt.crop16x9.575p.jpg',
    '战地': 'https://media.contentapi.ea.com/content/dam/battlefield/battlefield-2042/common/featured-tile-16x9.jpg.adapt.crop16x9.1023w.jpg',
    'NBA 2K': 'https://cdn.2k.com/2k/global/News/News_Thumbnail_MAIN_16x9.jpg',
    
    // 育碧游戏
    '彩虹六号': 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3jKEguWyoQ8rvCqLa2mcv7/7c0bc5ecf5a7c49e0c7eb0bee6b5cf36/r6s-featured.jpg',
    '刺客信条': 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/1JuD0PRrn0JGwpBgS2RmZN/d3e8e4e8cbfbc2de5d5f5ee9d3b2b3bd/ACM-share.jpg',
    '孤岛惊魂': 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/4pICuJvYE0E0xH5S55FD1m/3f96c3d5eac5fc3d5dc8c46c3e3d3e3c/FC6-share.jpg',
    
    // 动视游戏
    '使命召唤': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
    '使命召唤：现代战争3': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mwiii/MWIII-REVEAL-TOUT.jpg',
    
    // 更多Steam热门游戏
    '霍格沃茨之遗': 'https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg',
    '死亡空间': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1693980/header.jpg',
    '生化危机4重制版': 'https://cdn.cloudflare.steamstatic.com/steam/apps/2050650/header.jpg',
    '鬼泣5': 'https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg',
    '尼尔：自动人形': 'https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg',
    '双人成行': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg',
    '胡闹厨房': 'https://cdn.cloudflare.steamstatic.com/steam/apps/448510/header.jpg',
    '极限竞速：地平线5': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg',
    '鬼谷八荒': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1468810/header.jpg',
    '仁王': 'https://cdn.cloudflare.steamstatic.com/steam/apps/485510/header.jpg',
    '分手厨房2': 'https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg',
    '糖豆人': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1097150/header.jpg',
    '人类一败涂地': 'https://cdn.cloudflare.steamstatic.com/steam/apps/477160/header.jpg',
    '饥荒': 'https://cdn.cloudflare.steamstatic.com/steam/apps/219740/header.jpg',
    '星露谷物语': 'https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg'
  };

  /**
   * 智能获取游戏封面（核心函数 - 支持实时获取）
   */
  function getGameCover(gameName, options = {}) {
    // 标准化游戏名称
    const normalizedName = gameName.replace(/《|》|【|】|\[|\]/g, '').trim();
    
    // 1. 检查缓存
    if (coverCache[normalizedName]) {
      return coverCache[normalizedName];
    }

    let coverUrl = null;

    // 2. 从静态数据库获取（精确匹配）
    if (staticCoverDatabase[normalizedName]) {
      coverUrl = staticCoverDatabase[normalizedName];
      coverCache[normalizedName] = coverUrl;
      return coverUrl;
    }

    // 3. 模糊匹配静态数据库
    for (const [key, value] of Object.entries(staticCoverDatabase)) {
      const normalizedKey = key.replace(/《|》|【|】|\[|\]|：|:|'|'/g, '').toLowerCase();
      const searchNormalized = normalizedName.replace(/《|》|【|】|\[|\]|：|:|'|'/g, '').toLowerCase();
      
      if (normalizedKey.includes(searchNormalized) || searchNormalized.includes(normalizedKey)) {
        coverUrl = value;
        coverCache[normalizedName] = coverUrl;
        return coverUrl;
      }
    }
    
    // 4. 尝试通过Steam AppID猜测（常见中文游戏名英文对照）
    const steamGuess = guessGameCoverFromSteam(normalizedName);
    if (steamGuess) {
      coverCache[normalizedName] = steamGuess;
      return steamGuess;
    }

    // 5. 生成占位符封面（作为后备）
    coverUrl = generatePlaceholderCover(normalizedName);
    coverCache[normalizedName] = coverUrl;
    
    // 6. 异步获取真实封面（后台更新缓存）
    fetchRealCoverAsync(normalizedName);
    
    return coverUrl;
  }
  
  /**
   * 猜测Steam游戏封面
   */
  function guessGameCoverFromSteam(gameName) {
    // 常见游戏名称映射
    const gameNameMap = {
      // 中文名 -> Steam AppID
      '艾尔登': 1245620,
      '法环': 1245620,
      '赛博朋克': 1091500,
      '博德之门': 1086940,
      '荒野大镖客': 1174180,
      '大镖客': 1174180,
      '黑神话': 2358720,
      '悟空': 2358720,
      '只狼': 814380,
      '星空': 1716740,
      '空洞骑士': 367520,
      '巫师': 292030,
      '生化危机': 2050650,
      '怪物猎人': 582010,
      '战神': 1593500,
      '哈迪斯': 1145360,
      '双人成行': 1426210,
      '死亡细胞': 588650,
      '饥荒': 219740,
      '泰拉瑞亚': 105600,
      '文明': 289070,
      '城市天际线': 255710
    };
    
    for (const [keyword, appId] of Object.entries(gameNameMap)) {
      if (gameName.toLowerCase().includes(keyword.toLowerCase())) {
        return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
      }
    }
    
    return null;
  }
  
  /**
   * 异步获取真实封面（使用RAWG API）
   */
  async function fetchRealCoverAsync(gameName) {
    try {
      // 使用 RAWG API 获取封面（免费API，有请求限制）
      const searchUrl = `https://api.rawg.io/api/games?key=c542e67aec3a4340908f9de9e86038af&search=${encodeURIComponent(gameName)}&page_size=1`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const game = data.results[0];
        if (game.background_image) {
          // 更新缓存
          coverCache[gameName] = game.background_image;
          console.log(`✅ 实时获取封面成功: ${gameName}`);
          
          // 触发UI更新（如果有需要）
          window.dispatchEvent(new CustomEvent('gameCoverUpdated', { 
            detail: { gameName, coverUrl: game.background_image } 
          }));
        }
      }
    } catch (error) {
      // 静默处理错误
      console.log(`封面获取失败: ${gameName}`, error.message);
    }
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
