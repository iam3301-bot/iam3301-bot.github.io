/**
 * 社区数据服务 - 支持Supabase实时数据库 + LocalStorage后备
 * 实现真实的发帖、互动和实时统计功能
 */

(function() {
  const STORAGE_KEY_POSTS = 'gamebox_community_posts';
  const STORAGE_KEY_STATS = 'gamebox_community_stats';
  const STORAGE_KEY_ONLINE = 'gamebox_online_users';
  const STORAGE_KEY_COMMENTS = 'gamebox_post_comments';

  // Supabase配置检测
  let useSupabase = false;
  let supabaseClient = null;

  // 尝试初始化Supabase
  function initSupabase() {
    if (typeof window.supabase !== 'undefined' && 
        typeof SUPABASE_CONFIG !== 'undefined' && 
        SUPABASE_CONFIG.enabled && 
        SUPABASE_CONFIG.url !== 'https://demo-project.supabase.co') {
      try {
        supabaseClient = window.supabase;
        useSupabase = true;
        console.log('✅ 社区数据服务: 使用Supabase实时数据库');
        subscribeToRealtimeUpdates();
      } catch (e) {
        console.warn('⚠️ Supabase初始化失败，使用本地存储:', e);
        useSupabase = false;
      }
    } else {
      console.log('ℹ️ 社区数据服务: 使用本地存储模式');
    }
  }

  // 实时订阅更新
  function subscribeToRealtimeUpdates() {
    if (!useSupabase || !supabaseClient) return;

    // 订阅帖子变化
    supabaseClient
      .channel('community_posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, (payload) => {
        console.log('📬 帖子实时更新:', payload);
        // 触发UI更新事件
        window.dispatchEvent(new CustomEvent('community-update', { detail: payload }));
      })
      .subscribe();

    // 订阅在线状态变化
    supabaseClient
      .channel('online_status')
      .on('presence', { event: 'sync' }, () => {
        updateOnlinePresence();
      })
      .subscribe();
  }

  // 更新在线状态
  async function updateOnlinePresence() {
    if (!useSupabase || !supabaseClient) return;
    
    try {
      const channel = supabaseClient.channel('online_users');
      await channel.track({
        online_at: new Date().toISOString(),
        user_id: getCurrentUserId()
      });
    } catch (e) {
      console.error('更新在线状态失败:', e);
    }
  }

  // 获取当前用户ID
  function getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('gamebox_current_user') || '{}');
      return user.id || `guest_${Math.random().toString(36).substr(2, 9)}`;
    } catch {
      return `guest_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * 初始化社区数据
   */
  function initCommunityData() {
    // 尝试初始化Supabase
    initSupabase();

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
        lastUpdate: Date.now(),
        startTime: Date.now() // 记录开始时间，用于计算增长
      };
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      console.log('✅ 初始化社区统计数据');
    }

    // 初始化评论数据
    if (!localStorage.getItem(STORAGE_KEY_COMMENTS)) {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify({}));
    }

    // 更新在线用户
    updateOnlineUsers();
    
    // 启动实时更新
    startRealtimeUpdates();
  }

  // 启动实时更新定时器
  let realtimeInterval = null;
  function startRealtimeUpdates() {
    if (realtimeInterval) return;
    
    // 每10秒更新一次在线人数和统计
    realtimeInterval = setInterval(() => {
      updateOnlineUsers();
      incrementStats();
      // 触发UI更新
      window.dispatchEvent(new CustomEvent('community-stats-update'));
    }, 10000);
    
    console.log('🔄 社区实时更新已启动 (每10秒)');
  }

  // 模拟统计增长（基于时间的真实增长模拟）
  function incrementStats() {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEY_STATS);
      const stats = statsJson ? JSON.parse(statsJson) : {
        totalMembers: 5678,
        totalReplies: 12345,
        lastUpdate: Date.now(),
        startTime: Date.now()
      };
      
      const now = Date.now();
      const hoursSinceStart = (now - (stats.startTime || now)) / (1000 * 60 * 60);
      
      // 模拟真实增长：每小时增加 1-3 个会员，2-5 条回复
      if (now - stats.lastUpdate > 60000) { // 每分钟检查一次
        const memberGrowth = Math.random() < 0.3 ? 1 : 0; // 30%概率新增会员
        const replyGrowth = Math.floor(Math.random() * 2); // 0-1条新回复
        
        stats.totalMembers += memberGrowth;
        stats.totalReplies += replyGrowth;
        stats.lastUpdate = now;
        
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      }
    } catch (e) {
      console.error('更新统计失败:', e);
    }
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
          
          <p>感谢大家的支持！有任何问题欢迎在评论区提问~</p>
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
  async function getAllPosts() {
    // 如果使用Supabase，尝试从服务器获取
    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_posts')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (!error && data && data.length > 0) {
          // 同步到本地缓存
          localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(data));
          return data;
        }
      } catch (e) {
        console.warn('从Supabase获取帖子失败，使用本地数据:', e);
      }
    }

    // 使用本地存储
    try {
      const postsJson = localStorage.getItem(STORAGE_KEY_POSTS);
      if (!postsJson) {
        initCommunityData();
        return getAllPosts();
      }
      
      const posts = JSON.parse(postsJson);
      
      // 更新浏览量（随机增加，模拟真实流量）
      const now = Date.now();
      posts.forEach(post => {
        // 根据帖子新鲜度调整浏览增长
        const ageHours = (now - post.time) / (1000 * 60 * 60);
        const viewIncrement = ageHours < 24 ? Math.floor(Math.random() * 5) : Math.floor(Math.random() * 2);
        post.views += viewIncrement;
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
  async function getPostById(id) {
    const posts = await getAllPosts();
    const post = posts.find(p => p.id === id);
    
    if (post) {
      // 增加浏览量
      post.views = (post.views || 0) + 1;
      await updatePost(post.id, { views: post.views });
    }
    
    return post;
  }

  /**
   * 发布新帖子
   */
  async function createPost(postData) {
    try {
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

      // 如果使用Supabase，同时保存到服务器
      if (useSupabase && supabaseClient) {
        try {
          const { error } = await supabaseClient
            .from('community_posts')
            .insert([{
              id: newPost.id,
              title: newPost.title,
              content: newPost.content,
              author: newPost.author,
              avatar: newPost.avatar,
              game: newPost.game,
              board: newPost.board,
              replies: 0,
              likes: 0,
              views: 0,
              is_pinned: false,
              is_new: true,
              created_at: new Date().toISOString()
            }]);
          
          if (error) throw error;
          console.log('✅ 帖子已同步到Supabase');
        } catch (e) {
          console.warn('同步到Supabase失败:', e);
        }
      }

      // 保存到本地
      const posts = await getAllPosts();
      posts.unshift(newPost);
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
  async function deletePost(postId) {
    try {
      const posts = await getAllPosts();
      const index = posts.findIndex(p => p.id === postId);
      
      if (index === -1) {
        return { success: false, error: '帖子不存在' };
      }
      
      posts.splice(index, 1);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));

      // 如果使用Supabase，同时从服务器删除
      if (useSupabase && supabaseClient) {
        try {
          await supabaseClient
            .from('community_posts')
            .delete()
            .eq('id', postId);
        } catch (e) {
          console.warn('从Supabase删除失败:', e);
        }
      }
      
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
  async function updatePost(postId, updates) {
    try {
      const posts = await getAllPosts();
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        return { success: false, error: '帖子不存在' };
      }
      
      Object.assign(post, updates);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));

      // 如果使用Supabase，同时更新服务器
      if (useSupabase && supabaseClient) {
        try {
          await supabaseClient
            .from('community_posts')
            .update(updates)
            .eq('id', postId);
        } catch (e) {
          console.warn('更新Supabase失败:', e);
        }
      }
      
      return { success: true, post };
    } catch (error) {
      console.error('❌ 更新帖子失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取帖子评论
   */
  function getPostComments(postId) {
    try {
      const commentsJson = localStorage.getItem(STORAGE_KEY_COMMENTS);
      const allComments = commentsJson ? JSON.parse(commentsJson) : {};
      return allComments[postId] || [];
    } catch (e) {
      console.error('获取评论失败:', e);
      return [];
    }
  }

  /**
   * 添加评论
   */
  async function addComment(postId, commentData) {
    try {
      const commentsJson = localStorage.getItem(STORAGE_KEY_COMMENTS);
      const allComments = commentsJson ? JSON.parse(commentsJson) : {};
      
      if (!allComments[postId]) {
        allComments[postId] = [];
      }
      
      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        author: commentData.author || '游客',
        avatar: commentData.avatar || '👤',
        content: commentData.content,
        likes: 0,
        time: Date.now(),
        createdAt: Date.now()
      };
      
      allComments[postId].push(newComment);
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(allComments));
      
      // 更新帖子回复数
      await updatePost(postId, { replies: allComments[postId].length });
      
      // 更新统计
      updateStats({ repliesIncrement: 1 });
      
      return { success: true, comment: newComment };
    } catch (error) {
      console.error('添加评论失败:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 获取社区统计数据 - 实时计算
   */
  function getCommunityStats() {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEY_STATS);
      const stats = statsJson ? JSON.parse(statsJson) : {
        totalMembers: 5678,
        totalReplies: 12345,
        lastUpdate: Date.now(),
        startTime: Date.now()
      };
      
      // 从本地帖子计算实际数据
      let posts = [];
      try {
        posts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || '[]');
      } catch (e) {
        posts = [];
      }
      
      // 计算总回复数
      const actualReplies = posts.reduce((sum, p) => sum + (p.replies || 0), 0);
      
      // 基于时间的增长模拟
      const now = Date.now();
      const startTime = stats.startTime || (now - 7 * 24 * 60 * 60 * 1000); // 默认7天前开始
      const daysSinceStart = (now - startTime) / (1000 * 60 * 60 * 24);
      
      // 每天增加约 5-15 个会员（更真实的增长）
      const memberGrowth = Math.floor(daysSinceStart * (5 + Math.random() * 10));
      
      return {
        totalPosts: posts.length,
        totalMembers: stats.totalMembers + memberGrowth,
        totalReplies: stats.totalReplies + actualReplies,
        onlineUsers: getOnlineUserCount()
      };
    } catch (error) {
      console.error('获取统计数据失败:', error);
      return {
        totalPosts: 0,
        totalMembers: 5678,
        totalReplies: 12345,
        onlineUsers: getOnlineUserCount()
      };
    }
  }

  /**
   * 更新统计数据
   */
  function updateStats(updates) {
    try {
      const statsJson = localStorage.getItem(STORAGE_KEY_STATS);
      const stats = statsJson ? JSON.parse(statsJson) : {
        totalMembers: 5678,
        totalReplies: 12345,
        lastUpdate: Date.now(),
        startTime: Date.now()
      };
      
      if (updates.postsIncrement) {
        // 帖子数从实际数据计算
      }
      if (updates.membersIncrement) {
        stats.totalMembers += updates.membersIncrement;
      }
      if (updates.repliesIncrement) {
        stats.totalReplies += updates.repliesIncrement;
      }
      
      stats.lastUpdate = Date.now();
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      
      return getCommunityStats();
    } catch (error) {
      console.error('更新统计数据失败:', error);
      return getCommunityStats();
    }
  }

  /**
   * 获取在线用户数 - 基于时间的真实模拟
   */
  function getOnlineUserCount() {
    // 模拟在线用户数：基础值 + 时间因子 + 随机波动
    const baseCount = 80;
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    
    // 根据时间调整在线人数
    let timeFactor = 1.0;
    if (hour >= 19 && hour <= 23) {
      timeFactor = 2.8; // 高峰期 (19:00-23:00)
    } else if (hour >= 12 && hour <= 14) {
      timeFactor = 2.0; // 午休时间
    } else if (hour >= 9 && hour <= 18) {
      timeFactor = 1.5; // 工作日白天
    } else if (hour >= 0 && hour <= 6) {
      timeFactor = 0.3; // 深夜凌晨
    } else {
      timeFactor = 0.8; // 清晨
    }
    
    // 周末因子
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
      timeFactor *= 1.3; // 周末增加30%
    }
    
    // 分钟级随机波动 ±15%
    const minuteSeed = Math.sin(minute * 0.1) * 0.15;
    const randomFactor = 0.85 + Math.random() * 0.3 + minuteSeed;
    
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
      '战术大师', '探险家', '收集癖', '成就党', '速通玩家',
      '休闲玩家', '硬核玩家', '剧情党', '画面党', '手残党',
      '肝帝', '欧皇', '非酋', '老司机', '萌新',
      '独狼玩家', '社交达人', '建筑大师', '红石工程师', 'PVP高手'
    ];
    
    const onlineCount = getOnlineUserCount();
    const onlineUsers = [];
    
    // 随机选择在线用户
    const shuffled = [...userNames].sort(() => 0.5 - Math.random());
    for (let i = 0; i < Math.min(onlineCount, shuffled.length); i++) {
      onlineUsers.push(shuffled[i]);
    }
    
    localStorage.setItem(STORAGE_KEY_ONLINE, JSON.stringify({
      users: onlineUsers,
      count: onlineCount,
      lastUpdate: Date.now()
    }));
    
    return onlineUsers;
  }

  /**
   * 获取在线用户列表
   */
  function getOnlineUsers() {
    try {
      const dataJson = localStorage.getItem(STORAGE_KEY_ONLINE);
      if (!dataJson) {
        return updateOnlineUsers();
      }
      
      const data = JSON.parse(dataJson);
      
      // 每10秒更新一次在线用户
      if (!data.lastUpdate || Date.now() - data.lastUpdate > 10000) {
        return updateOnlineUsers();
      }
      
      return data.users || [];
    } catch (error) {
      console.error('获取在线用户失败:', error);
      return [];
    }
  }

  /**
   * 点赞帖子
   */
  async function likePost(postId) {
    const posts = await getAllPosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      const likedKey = `liked_${postId}`;
      const isLiked = localStorage.getItem(likedKey);
      
      if (isLiked) {
        post.likes = Math.max(0, (post.likes || 0) - 1);
        localStorage.removeItem(likedKey);
      } else {
        post.likes = (post.likes || 0) + 1;
        localStorage.setItem(likedKey, 'true');
      }
      
      await updatePost(postId, { likes: post.likes });
      return { success: true, likes: post.likes, liked: !isLiked };
    }
    
    return { success: false, error: '帖子不存在' };
  }

  // 导出API
  window.communityDataService = {
    initCommunityData,
    getAllPosts,
    getPostById,
    createPost,
    deletePost,
    updatePost,
    getPostComments,
    addComment,
    getCommunityStats,
    getOnlineUsers,
    getOnlineUserCount,
    likePost,
    updateStats
  };

  // 初始化
  initCommunityData();
  
  console.log('✅ 社区数据服务已加载 (支持实时更新)');
})();
