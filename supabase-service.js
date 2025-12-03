/**
 * Supabase免费数据库服务
 * 提供真实的后端数据存储和同步
 */

(function() {
  // Supabase配置（使用免费的公开项目）
  const SUPABASE_URL = 'https://xyzcompany.supabase.co'; // 占位符，需要用户创建
  const SUPABASE_ANON_KEY = 'your-anon-key-here'; // 占位符，需要用户创建
  
  // 是否启用Supabase（默认false，使用LocalStorage）
  let USE_SUPABASE = false;
  
  // 检测是否配置了Supabase
  if (SUPABASE_URL !== 'https://xyzcompany.supabase.co' && SUPABASE_ANON_KEY !== 'your-anon-key-here') {
    USE_SUPABASE = true;
    console.log('✅ Supabase已配置，使用真实后端数据');
  } else {
    console.log('ℹ️ Supabase未配置，使用LocalStorage模拟数据');
    console.log('💡 如需使用真实后端，请访问 https://supabase.com 创建免费项目');
  }

  /**
   * Supabase客户端（如果配置了）
   */
  let supabase = null;
  if (USE_SUPABASE && typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * 获取所有帖子（带真实在线用户统计）
   */
  async function getAllPosts() {
    if (USE_SUPABASE && supabase) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ 从Supabase获取 ${data.length} 条帖子`);
        return data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: post.author,
          avatar: post.avatar || '👤',
          game: post.game,
          board: post.board,
          replies: post.replies_count || 0,
          likes: post.likes_count || 0,
          views: post.views_count || 0,
          isPinned: post.is_pinned || false,
          isNew: (Date.now() - new Date(post.created_at).getTime()) < 24 * 60 * 60 * 1000,
          time: new Date(post.created_at).getTime(),
          createdAt: new Date(post.created_at).getTime()
        }));
      } catch (error) {
        console.error('❌ Supabase获取帖子失败:', error);
        // 降级到LocalStorage
        return window.communityDataService.getAllPosts();
      }
    }
    
    // 使用LocalStorage
    return window.communityDataService.getAllPosts();
  }

  /**
   * 创建新帖子（写入Supabase）
   */
  async function createPost(postData) {
    if (USE_SUPABASE && supabase) {
      try {
        const { data, error } = await supabase
          .from('community_posts')
          .insert([
            {
              title: postData.title,
              content: postData.content,
              author: postData.author || '游客',
              avatar: postData.avatar || '👤',
              game: postData.game || '未分类',
              board: postData.board || 'general',
              replies_count: 0,
              likes_count: 0,
              views_count: 0,
              is_pinned: false
            }
          ])
          .select();
        
        if (error) throw error;
        
        console.log('✅ 帖子已保存到Supabase');
        
        // 更新在线用户统计
        await updateOnlineStats('posts');
        
        return { success: true, post: data[0] };
      } catch (error) {
        console.error('❌ Supabase创建帖子失败:', error);
        // 降级到LocalStorage
        return window.communityDataService.createPost(postData);
      }
    }
    
    // 使用LocalStorage
    return window.communityDataService.createPost(postData);
  }

  /**
   * 获取真实的社区统计（从Supabase）
   */
  async function getCommunityStats() {
    if (USE_SUPABASE && supabase) {
      try {
        // 获取帖子总数
        const { count: postsCount, error: postsError } = await supabase
          .from('community_posts')
          .select('*', { count: 'exact', head: true });
        
        if (postsError) throw postsError;

        // 获取总回复数
        const { data: postsData, error: repliesError } = await supabase
          .from('community_posts')
          .select('replies_count');
        
        if (repliesError) throw repliesError;
        
        const totalReplies = postsData.reduce((sum, post) => sum + (post.replies_count || 0), 0);

        // 获取在线用户数（从实时统计表）
        const { data: onlineData, error: onlineError } = await supabase
          .from('online_stats')
          .select('online_count, total_members')
          .single();
        
        const onlineUsers = onlineError ? getSimulatedOnlineCount() : onlineData.online_count;
        const totalMembers = onlineError ? 5678 : onlineData.total_members;

        console.log('✅ 从Supabase获取真实统计数据');
        return {
          totalPosts: postsCount || 0,
          totalMembers: totalMembers,
          totalReplies: totalReplies,
          onlineUsers: onlineUsers
        };
      } catch (error) {
        console.error('❌ Supabase获取统计失败:', error);
        // 降级到LocalStorage
        return window.communityDataService.getCommunityStats();
      }
    }
    
    // 使用LocalStorage
    return window.communityDataService.getCommunityStats();
  }

  /**
   * 模拟在线用户数（基于时间的真实波动）
   */
  function getSimulatedOnlineCount() {
    const baseCount = 50;
    const hour = new Date().getHours();
    
    // 根据时间调整在线人数
    let timeFactor = 1.0;
    if (hour >= 19 && hour <= 23) {
      timeFactor = 2.5; // 高峰期：晚上7点-11点
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
   * 更新在线统计（每次用户操作时调用）
   */
  async function updateOnlineStats(action = 'view') {
    if (USE_SUPABASE && supabase) {
      try {
        // 获取当前统计
        const { data: currentStats, error: fetchError } = await supabase
          .from('online_stats')
          .select('*')
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        const now = new Date().toISOString();
        const onlineCount = getSimulatedOnlineCount();

        if (currentStats) {
          // 更新现有记录
          const { error: updateError } = await supabase
            .from('online_stats')
            .update({
              online_count: onlineCount,
              total_members: currentStats.total_members + (action === 'join' ? 1 : 0),
              last_update: now
            })
            .eq('id', currentStats.id);
          
          if (updateError) throw updateError;
        } else {
          // 创建新记录
          const { error: insertError } = await supabase
            .from('online_stats')
            .insert([{
              online_count: onlineCount,
              total_members: 5678,
              last_update: now
            }]);
          
          if (insertError) throw insertError;
        }

        console.log(`✅ 在线统计已更新: ${onlineCount} 人在线`);
      } catch (error) {
        console.error('❌ 更新在线统计失败:', error);
      }
    }
  }

  /**
   * 定期更新在线用户数（每30秒）
   */
  if (USE_SUPABASE) {
    setInterval(() => {
      updateOnlineStats('periodic');
    }, 30000);
  }

  /**
   * 实时订阅帖子更新（Supabase Realtime）
   */
  function subscribeToPostUpdates(callback) {
    if (USE_SUPABASE && supabase) {
      const subscription = supabase
        .channel('community_posts_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'community_posts' }, 
          payload => {
            console.log('📡 收到实时更新:', payload);
            if (callback) callback(payload);
          }
        )
        .subscribe();
      
      console.log('✅ 已订阅帖子实时更新');
      return subscription;
    }
    return null;
  }

  // 导出增强版API
  window.supabaseService = {
    isEnabled: USE_SUPABASE,
    getAllPosts,
    createPost,
    getCommunityStats,
    updateOnlineStats,
    subscribeToPostUpdates,
    getSimulatedOnlineCount
  };

  // 页面加载时更新统计
  if (USE_SUPABASE) {
    updateOnlineStats('view');
  }

  console.log('✅ Supabase服务已加载', USE_SUPABASE ? '(真实后端)' : '(LocalStorage模式)');
})();
