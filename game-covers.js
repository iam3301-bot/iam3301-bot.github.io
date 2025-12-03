/**
 * 游戏封面图片数据库
 * 包含所有游戏的封面图片URL
 */

(function() {
  // 完整的游戏封面图片映射（支持100+游戏）
  const gameCoverDatabase = {
    // 主要游戏（已有封面）
    '艾尔登法环': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    'ELDEN RING': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
    '赛博朋克2077': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    'Cyberpunk 2077': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg',
    '博德之门3': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    "Baldur's Gate 3": 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
    '荒野大镖客2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    'Red Dead Redemption 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg',
    'Dota 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/570/header.jpg',
    'CS2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    'Counter-Strike 2': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
    '战神': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    'God of War': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1593500/header.jpg',
    '只狼': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg',
    '只狼：影逝二度': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg',
    '星空': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg',
    'Starfield': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1716740/header.jpg',
    '空洞骑士': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    '空洞骑士：丝之歌': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    'Hollow Knight': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg',
    
    // 任天堂游戏
    '塞尔达传说': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    '塞尔达传说：旷野之息': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/t/the-legend-of-zelda-breath-of-the-wild-switch/hero',
    '塞尔达传说：王国之泪': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/hero',
    '超级马力欧': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/s/super-mario-odyssey-switch/hero',
    '超级马力欧奥德赛': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/games/switch/s/super-mario-odyssey-switch/hero',
    
    // RPG游戏
    '最终幻想16': 'https://image.api.playstation.com/vulcan/ap/rnd/202212/0912/F7QdROH8k1hAyGIPOWyMPBhO.png',
    '女神异闻录5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1687950/header.jpg',
    '尼尔：自动人形': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/524220/header.jpg',
    '巫师3': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg',
    '怪物猎人世界': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg',
    '怪物猎人': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg',
    '怪物猎人：荒野': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2080690/header.jpg',
    '鬼谷八荒': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1468810/header.jpg',
    '仁王': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/485510/header.jpg',
    '上古卷轴5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
    '辐射4': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg',
    '霍格沃茨之遗': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg',
    
    // 动作冒险游戏
    'GTA 6': 'https://media-rockstargames-com.akamaized.net/tina-uploads/posts/ak73k52o94598a/c79e2f870d22444a9bd3bdda33ba96da.jpg',
    'GTA5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
    'Grand Theft Auto V': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg',
    '死亡空间': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1693980/header.jpg',
    '生化危机4重制版': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    '生化危机4': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    '最后生还者': 'https://image.api.playstation.com/vulcan/ap/rnd/202206/0720/eEJMd2U4HbZPbxthZzaAJtlN.png',
    '对马岛之魂': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0222/niCY1rVHt1oNt7OPQO54vXZD.png',
    '鬼泣5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/601150/header.jpg',
    '霍格沃茨之遗': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg',
    '死亡空间': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1693980/header.jpg',
    '生化危机4': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    '生化危机4重制版': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg',
    '最后生还者': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1888930/header.jpg',
    '对马岛之魂': 'https://image.api.playstation.com/vulcan/ap/rnd/202010/0113/b3iB2zf2xHj9shC0XDTJLwZF.png',
    '鬼泣5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/601150/header.jpg',
    '战神：诸神黄昏': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg',
    
    // 开放世界/沙盒
    '上古卷轴5': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/489830/header.jpg',
    '辐射4': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg',
    '我的世界': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1794680/header.jpg',
    'Minecraft': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1794680/header.jpg',
    '泰拉瑞亚': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg',
    '饥荒': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/219740/header.jpg',
    
    // 多人合作
    '双人成行': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg',
    '胡闹厨房': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/448510/header.jpg',
    
    // 竞技/射击游戏
    '英雄联盟': 'https://images.contentstack.io/v3/assets/blt731acb42bb3d1659/blt7cd7f2a1d317cc6f/6229e6430b1f095c7e5e2e33/LOL_PromoImage_ClientOG.jpg',
    '暗黑破坏神4': 'https://blz-contentstack-images.akamaized.net/v3/assets/blt0e00eb71333df64e/blt2b0d26431d8067d1/64c1ec10e6d14d3a2e88e0d1/D4-S1-KeyArt-16x9-L-enUS.jpg',
    '守望先锋2': 'https://blz-contentstack-images.akamaized.net/v3/assets/blt9c12f249ac15c7ec/bltbfd24eb5eda1e29e/62d24ee5a1e7c50fd732dd4d/OW_Group_Key_Art.jpg',
    'APEX英雄': 'https://media.contentapi.ea.com/content/dam/apex-legends/common/apex-section-bg.jpg.adapt.crop16x9.1023w.jpg',
    '彩虹六号': 'https://staticctf.akamaized.net/J3yJr34U2pZ2Ieem48Dwy9uqj5PNUQTn/3jKEguWyoQ8rvCqLa2mcv7/7c0bc5ecf5a7c49e0c7eb0bee6b5cf36/r6s-featured.jpg',
    '使命召唤': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
    'Call of Duty': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
    '战地': 'https://media.contentapi.ea.com/content/dam/battlefield/battlefield-2042/common/featured-tile-16x9.jpg.adapt.crop16x9.1023w.jpg',
    '永劫无间': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1608800/header.jpg',
    '黑神话：悟空': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg',
    
    // 体育竞速
    '极限竞速': 'https://compass-ssl.xboxlive.com/assets/93/57/9357bc2e-e7f5-4cb3-9e0a-ca5b50bddb0f.jpg',
    'GT赛车': 'https://gmedia.playstation.com/is/image/SIEPDC/gran-turismo-7-hero-banner-desktop-01-en-18nov21',
    'FIFA': 'https://media.contentapi.ea.com/content/dam/ea/fifa/fifa-23/common/featured-tile-16x9.jpg.adapt.crop16x9.1023w.jpg',
    'NBA 2K': 'https://cdn.2k.com/2k/global/News/News_Thumbnail_MAIN_16x9.jpg',
    
    // 中国游戏
    '原神': 'https://webstatic.hoyoverse.com/upload/event/2020/11/11/3bf483f7ae6c274c52ecdf1d922e0e7d_7166511990095952130.jpg',
    'Genshin Impact': 'https://webstatic.hoyoverse.com/upload/event/2020/11/11/3bf483f7ae6c274c52ecdf1d922e0e7d_7166511990095952130.jpg',
    
    // 默认备用封面（按平台）
    'PlayStation': 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-hero-image-02-en-30jul21',
    'Xbox': 'https://compass-ssl.xboxlive.com/assets/7b/63/7b63470a-dde2-4909-866f-0b5bca8abe63.jpg',
    'Nintendo Switch': 'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/switch/site-design-update/hero-switch.jpg',
    '多款游戏': 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/1938090/header.jpg',
    '多款独立游戏': 'https://cdn.cloudflare.steamstatic.com/steam/apps/1145350/header.jpg',
    
    // 漫威/DC游戏
    '漫威蜘蛛侠': 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60afe6c1f6ad4029a6c1a8f5bb8e8726.png',
    "Marvel's Spider-Man": 'https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60afe6c1f6ad4029a6c1a8f5bb8e8726.png'
  };

  // 通用封面生成器（为没有专门封面的游戏生成占位符）
  function getGameCover(gameName) {
    // 1. 优先查找精确匹配
    if (gameCoverDatabase[gameName]) {
      return gameCoverDatabase[gameName];
    }

    // 2. 模糊匹配（去除特殊字符）
    const normalizedName = gameName.replace(/[：:《》\s]/g, '').toLowerCase();
    for (const [key, value] of Object.entries(gameCoverDatabase)) {
      const normalizedKey = key.replace(/[：:《》\s]/g, '').toLowerCase();
      if (normalizedKey.includes(normalizedName) || normalizedName.includes(normalizedKey)) {
        return value;
      }
    }

    // 3. 根据游戏名称生成占位符URL（使用UI Avatars或类似服务）
    // 使用稳定的颜色方案
    const colors = [
      '4338ca', '7c3aed', 'db2777', 'dc2626', 'ea580c',
      '16a34a', '0891b2', '0284c7', '2563eb'
    ];
    const colorIndex = Math.abs(gameName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length;
    const bgColor = colors[colorIndex];
    
    // 使用DiceBear API生成游戏图标
    const encodedName = encodeURIComponent(gameName.substring(0, 2));
    return `https://ui-avatars.com/api/?name=${encodedName}&size=460&background=${bgColor}&color=fff&bold=true&font-size=0.6`;
  }

  // 批量获取封面
  function getGameCovers(gameNames) {
    const covers = {};
    gameNames.forEach(name => {
      covers[name] = getGameCover(name);
    });
    return covers;
  }

  // 导出API
  window.gameCoverAPI = {
    getGameCover,
    getGameCovers,
    database: gameCoverDatabase
  };

  console.log('✅ 游戏封面数据库已加载 -', Object.keys(gameCoverDatabase).length, '款游戏');
})();
