/**
 * 社区数据服务
 * 使用LocalStorage存储帖子数据，实现真实的发帖和互动功能
 */

(function() {
  const STORAGE_KEY_POSTS = 'gamebox_community_posts';
  const STORAGE_KEY_STATS = 'gamebox_community_stats';
  const STORAGE_KEY_ONLINE = 'gamebox_online_users';

  /**
   * 初始化社区数据
   */
  function initCommunityData() {
    // 如果localStorage中没有数据，初始化默认帖子
    const existingPosts = localStorage.getItem(STORAGE_KEY_POSTS);
    
    if (!existingPosts) {
      const defaultPosts = getDefaultPosts();
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(defaultPosts));
      console.log('✅ 初始化社区默认帖子数据');
    }

    // 初始化统计数据
    const existingStats = localStorage.getItem(STORAGE_KEY_STATS);
    if (!existingStats) {
      const stats = {
        totalMembers: 5678,
        totalReplies: 12345,
        lastUpdate: Date.now()
      };
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      console.log('✅ 初始化社区统计数据');
    }

    // 更新在线用户
    updateOnlineUsers();
  }

  /**
   * 获取默认帖子数据
   */
  function getDefaultPosts() {
    return [
      {
        id: "pinned-1",
        title: "【公告】社区使用指南 - 新人必读",
        content: `
          <h3>欢迎来到 GameBox 社区！</h3>
          <p>本帖包含社区规则、发帖指南、常见问题解答等内容，建议新玩家仔细阅读。</p>
          
          <h4>1. 社区规则</h4>
          <ul>
            <li>友善交流，尊重他人意见</li>
            <li>禁止发布广告、垃圾信息</li>
            <li>剧透内容请标注明确警告</li>
            <li>遵守游戏开发商的服务条款</li>
          </ul>
          
          <h4>2. 发帖指南</h4>
          <ul>
            <li>选择合适的板块发布内容</li>
            <li>标题简洁明了，准确描述内容</li>
            <li>善用标签分类您的帖子</li>
            <li>排版清晰，方便他人阅读</li>
          </ul>
          
          <h4>3. 常见问题</h4>
          <p><strong>Q: 如何获得更多权限？</strong><br>
          A: 保持活跃发帖和评论，获取经验值提升等级即可解锁更多功能。</p>
          
          <p><strong>Q: 帖子被删除了怎么办？</strong><br>
          A: 检查是否违反社区规则，可联系管理员咨询具体原因。</p>
          
          <p>感谢您的支持，祝您在GameBox社区玩得开心！🎮</p>
        `,
        author: "GameBox官方",
        avatar: "🎮",
        game: "GameBox",
        board: "general",
        replies: 156,
        likes: 892,
        views: 5432,
        isPinned: true,
        isNew: false,
        time: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30天前
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      {
        id: "elden-newbie",
        title: "新手入门：如何在《艾尔登法环》中少死一点",
        content: `
          <p>大家好，作为一个从魂系游戏一路走来的老玩家，今天分享一些艾尔登法环的新手技巧。</p>
          
          <h4>🎯 职业选择建议</h4>
          <p>对于新手，推荐选择以下职业：</p>
          <ul>
            <li><strong>流浪骑士</strong>：高防御，容错率高，适合近战</li>
            <li><strong>魔法师</strong>：远程输出，可以风筝大部分Boss</li>
            <li><strong>武士</strong>：平衡型，初始装备优秀</li>
          </ul>
          
          <h4>⚔️ 战斗技巧</h4>
          <ol>
            <li><strong>不要贪刀</strong>：看准时机，打一两刀就撤，耐心磨血</li>
            <li><strong>学会翻滚</strong>：翻滚是最重要的防御手段，练习翻滚时机</li>
            <li><strong>体力管理</strong>：永远保留一些体力用于翻滚和跑路</li>
            <li><strong>善用盾反</strong>：中小型敌人可以尝试盾反，高伤害+硬直</li>
          </ol>
          
          <h4>🗺️ 探索建议</h4>
          <ul>
            <li>前期不要急着打Boss，先在宁姆格福地区充分探索</li>
            <li>多收集黄金卢恩，提升等级让游戏更轻松</li>
            <li>寻找散落各地的战灰和护符，提升战斗力</li>
            <li>善用地图标记功能，记录重要地点</li>
          </ul>
          
          <h4>🌟 实用道具</h4>
          <ul>
            <li><strong>灵体召唤</strong>：不是作弊！合理使用可以大幅降低难度</li>
            <li><strong>药瓶升级</strong>：优先升级红瓶，保证续航能力</li>
            <li><strong>制作材料</strong>：多收集草药和材料，可以制作实用消耗品</li>
          </ul>
          
          <p>记住，艾尔登法环是一个需要耐心和学习的游戏。死亡是游戏的一部分，不要气馁，每次失败都是在积累经验。祝大家早日成为艾尔登之王！💪</p>
        `,
        author: "褪色者小明",
        avatar: "⚔️",
        game: "艾尔登法环",
        board: "guide",
        replies: 89,
        likes: 456,
        views: 2341,
        isPinned: false,
        isNew: false,
        time: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        id: "cp-photo",
        title: "【截图分享】夜之城的霓虹灯太美了！",
        content: `
          <p>用 RTX 4090 开满光追拍的，这游戏的画面真的是绝了！</p>
          
          <h4>📸 拍摄参数</h4>
          <ul>
            <li><strong>显卡</strong>：RTX 4090 24GB</li>
            <li><strong>分辨率</strong>：4K (3840x2160)</li>
            <li><strong>光追等级</strong>：Psycho (最高)</li>
            <li><strong>DLSS</strong>：质量模式</li>
          </ul>
          
          <h4>🌃 拍摄地点</h4>
          <ol>
            <li><strong>雾街</strong>：霓虹灯最密集的地方，晚上去最美</li>
            <li><strong>市中心</strong>：高楼大厦，科技感满满</li>
            <li><strong>北区工业园</strong>：废土朋克风格</li>
            <li><strong>日本街</strong>：传统与未来的碰撞</li>
          </ol>
          
          <p>夜之城的每个角落都是一幅赛博朋克画卷。特别是雨天，地面的反射配合霓虹灯，简直就是电影级别的画面！</p>
          
          <p><strong>Tips：</strong> 推荐大家下载Appearance Menu Mod，可以随时切换V的外观，拍照更方便！</p>
          
          <p>晚点我会把这些截图上传到Steam创意工坊，喜欢的朋友可以收藏~</p>
        `,
        author: "V",
        avatar: "🌃",
        game: "赛博朋克 2077",
        board: "shot",
        replies: 67,
        likes: 234,
        views: 1567,
        isPinned: false,
        isNew: true,
        time: Date.now() - 30 * 60 * 1000, // 30分钟前
        createdAt: Date.now() - 30 * 60 * 1000
      },
      {
        id: "zelda-tears",
        title: "王国之泪 神庙全收集攻略（持续更新中）",
        content: `
          <p>本帖整理了王国之泪所有神庙的位置和解谜方法，目前已更新 120/152 个，欢迎收藏！</p>
          
          <h4>📍 神庙分布统计</h4>
          <ul>
            <li><strong>地表神庙</strong>：60个 ✅ 已完成</li>
            <li><strong>天空岛神庙</strong>：40个 ✅ 已完成</li>
            <li><strong>地下神庙</strong>：20个 🔄 进行中</li>
            <li><strong>特殊神庙</strong>：32个 🔄 进行中</li>
          </ul>
          
          <h4>🎯 新手必做神庙Top 10</h4>
          <ol>
            <li><strong>启始之塔</strong> - 解锁地图塔功能</li>
            <li><strong>鸟望台神庙</strong> - 获得滑翔伞</li>
            <li><strong>回忆之林</strong> - 增加心之器皿</li>
            <li><strong>时间停止</strong> - 学会重要技能</li>
            <li><strong>火焰之试炼</strong> - 获得炎之大剑</li>
            <li><strong>冰雪神庙</strong> - 学会冰冻技巧</li>
            <li><strong>雷电殿堂</strong> - 掌握雷电应用</li>
            <li><strong>风之祭坛</strong> - 强化滑翔能力</li>
            <li><strong>力量测试</strong> - 提升攻击力</li>
            <li><strong>智慧考验</strong> - 获得珍稀道具</li>
          </ol>
          
          <h4>💡 解谜技巧汇总</h4>
          <ul>
            <li><strong>究极手</strong>：最常用的能力，可以移动和组合物体</li>
            <li><strong>通天术</strong>：向上穿透物体，快速到达高处</li>
            <li><strong>时光倒流</strong>：让物体时间倒流，创造性解谜</li>
            <li><strong>余料建造</strong>：粘合物品制作工具和武器</li>
          </ul>
          
          <h4>🗺️ 地图资源</h4>
          <p>我制作了一个互动地图，标记了所有神庙位置、呀哈哈种子、材料点等。需要的朋友可以私信我获取链接。</p>
          
          <h4>📢 更新计划</h4>
          <ul>
            <li>✅ 地表神庙 (已完成)</li>
            <li>✅ 天空岛神庙 (已完成)</li>
            <li>🔄 地下神庙 (进行中，预计3天完成)</li>
            <li>📅 特殊神庙 (计划下周开始)</li>
          </ul>
          
          <p>感谢大家的支持！有任何问题欢迎在评论区提问，我会尽快回复~</p>
        `,
        author: "海拉鲁勇者",
        avatar: "🗡️",
        game: "塞尔达传说：王国之泪",
        board: "guide",
        replies: 234,
        likes: 678,
        views: 4521,
        isPinned: false,
        isNew: false,
        time: Date.now() - 24 * 60 * 60 * 1000, // 1天前
        createdAt: Date.now() - 24 * 60 * 60 * 1000
      },
      {
        id: "steam-deck",
        title: "Steam Deck 上玩什么游戏体验最好？",
        content: `
          <p>刚入手 Steam Deck，求推荐一些适合掌机玩的游戏，最好是能离线玩的，出差时候打发时间...</p>
          
          <h4>🎮 推荐游戏类型</h4>
          <ul>
            <li><strong>独立游戏</strong>：Hades、死亡细胞、空洞骑士</li>
            <li><strong>回合制</strong>：文明6、XCOM2、博德之门3</li>
            <li><strong>Roguelike</strong>：以撒的结合、吸血鬼幸存者</li>
            <li><strong>轻度RPG</strong>：星露谷物语、泰拉瑞亚</li>
          </ul>
          
          <p>有经验的老哥可以分享一下吗？</p>
        `,
        author: "掌机党",
        avatar: "🎮",
        game: "多款游戏",
        board: "general",
        replies: 45,
        likes: 123,
        views: 892,
        isPinned: false,
        isNew: false,
        time: Date.now() - 3 * 60 * 60 * 1000, // 3小时前
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      }
    ];
  }

  /**
   * 获取所有帖子
   */
  function getAllPosts() {
    try {
      const postsJson = localStorage.getItem(STORAGE_KEY_POSTS);
      if (!postsJson) {
        initCommunityData();
        return getAllPosts();
      }
      
      const posts = JSON.parse(postsJson);
      
      // 更新浏览量（随机增加）
      posts.forEach(post => {
        post.views += Math.floor(Math.random() * 3);
      });
      
      // 保存更新后的数据
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      return posts;
    } catch (error) {
      console.error('获取帖子失败:', error);
      return [];
    }
  }

  /**
   * 根据ID获取帖子
   */
  function getPostById(id) {
    const posts = getAllPosts();
    return posts.find(p => p.id === id);
  }

  /**
   * 发布新帖子
   */
  function createPost(postData) {
    try {
      const posts = getAllPosts();
      
      // 生成唯一ID
      const newPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: postData.title,
        content: postData.content,
        author: postData.author || '游客',
        avatar: postData.avatar || '👤',
        game: postData.game || '未分类',
        board: postData.board || 'general',
        replies: 0,
        likes: 0,
        views: 0,
        isPinned: false,
        isNew: true,
        time: Date.now(),
        createdAt: Date.now()
      };
      
      // 添加到帖子列表开头
      posts.unshift(newPost);
      
      // 保存到localStorage
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      // 更新统计数据
      updateStats({ postsIncrement: 1 });
      
      console.log('✅ 新帖子发布成功:', newPost.id);
      return { success: true, post: newPost };
    } catch (error) {
      console.error('❌ 发帖失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 删除帖子
   */
  function deletePost(postId) {
    try {
      const posts = getAllPosts();
      const index = posts.findIndex(p => p.id === postId);
      
      if (index === -1) {
        return { success: false, error: '帖子不存在' };
      }
      
      posts.splice(index, 1);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      console.log('✅ 帖子删除成功:', postId);
      return { success: true };
    } catch (error) {
      console.error('❌ 删除帖子失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 更新帖子数据
   */
  function updatePost(postId, updates) {
    try {
      const posts = getAllPosts();
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        return { success: false, error: '帖子不存在' };
      }
      
      Object.assign(post, updates);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      console.log('✅ 帖子更新成功:', postId);
      return { success: true, post };
    } catch (error) {
      console.error('❌ 更新帖子失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取社区统计数据
   */
  function getCommunityStats() {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEY_STATS);
      const stats = statsJson ? JSON.parse(statsJson) : {
        totalMembers: 5678,
        totalReplies: 12345,
        lastUpdate: Date.now()
      };
      
      const posts = getAllPosts();
      
      return {
        totalPosts: posts.length,
        totalMembers: stats.totalMembers + Math.floor((Date.now() - stats.lastUpdate) / (24 * 60 * 60 * 1000)), // 每天增加1个成员
        totalReplies: stats.totalReplies + posts.reduce((sum, p) => sum + p.replies, 0),
        onlineUsers: getOnlineUserCount()
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        totalPosts: 0,
        totalMembers: 5678,
        totalReplies: 12345,
        onlineUsers: 89
      };
    }
  }

  /**
   * 更新统计数据
   */
  function updateStats(updates) {
    try {
      const stats = getCommunityStats();
      
      if (updates.postsIncrement) {
        stats.totalPosts += updates.postsIncrement;
      }
      if (updates.membersIncrement) {
        stats.totalMembers += updates.membersIncrement;
      }
      if (updates.repliesIncrement) {
        stats.totalReplies += updates.repliesIncrement;
      }
      
      stats.lastUpdate = Date.now();
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      
      return stats;
    } catch (error) {
      console.error('更新统计数据失败:', error);
      return getCommunityStats();
    }
  }

  /**
   * 获取在线用户数
   */
  function getOnlineUserCount() {
    // 模拟在线用户数：基础值 + 时间因子 + 随机波动
    const baseCount = 50;
    const hour = new Date().getHours();
    
    // 根据时间调整在线人数（高峰期：19:00-23:00）
    let timeFactor = 1.0;
    if (hour >= 19 && hour <= 23) {
      timeFactor = 2.5; // 高峰期
    } else if (hour >= 12 && hour <= 14) {
      timeFactor = 1.8; // 午休时间
    } else if (hour >= 8 && hour <= 18) {
      timeFactor = 1.3; // 白天
    } else {
      timeFactor = 0.5; // 深夜
    }
    
    // 随机波动 ±20%
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    return Math.floor(baseCount * timeFactor * randomFactor);
  }

  /**
   * 更新在线用户列表
   */
  function updateOnlineUsers() {
    const userNames = [
      '褪色者小明', 'V', '海拉鲁勇者', '掌机党', '小骑士', 
      '买家小王', '罪恶都市粉', 'GameBox官方', '赛博浪客',
      '荒野猎人', '星际旅者', '魔法使', '剑圣', '枪神',
      '战术大师', '探险家', '收集癖', '成就党', '速通玩家'
    ];
    
    const onlineCount = getOnlineUserCount();
    const onlineUsers = [];
    
    // 随机选择在线用户
    const shuffled = userNames.sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(onlineCount, shuffled.length); i++) {
      onlineUsers.push(shuffled[i]);
    }
    
    localStorage.setItem(STORAGE_KEY_ONLINE, JSON.stringify(onlineUsers));
    return onlineUsers;
  }

  /**
   * 获取在线用户列表
   */
  function getOnlineUsers() {
    try {
      const usersJson = localStorage.getItem(STORAGE_KEY_ONLINE);
      if (!usersJson) {
        return updateOnlineUsers();
      }
      
      // 每30秒更新一次在线用户
      const lastUpdate = localStorage.getItem('online_users_last_update');
      if (!lastUpdate || Date.now() - parseInt(lastUpdate) > 30000) {
        localStorage.setItem('online_users_last_update', Date.now().toString());
        return updateOnlineUsers();
      }
      
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('获取在线用户失败:', error);
      return [];
    }
  }

  // 导出API
  window.communityDataService = {
    initCommunityData,
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    updatePost,
    getCommunityStats,
    getOnlineUsers,
    getOnlineUserCount
  };

  // 初始化
  initCommunityData();
  
  console.log('✅ 社区数据服务已加载');
})();
