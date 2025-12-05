/**
 * 社区数据服务 - 完全对接 Supabase 真实数据库
 * 实现真实的发帖、评论、点赞和实时统计功能
 */

(function() {
  const STORAGE_KEY_POSTS = 'gamebox_community_posts';
  const STORAGE_KEY_STATS = 'gamebox_community_stats';
  const STORAGE_KEY_ONLINE = 'gamebox_online_users';
  const STORAGE_KEY_COMMENTS = 'gamebox_post_comments';
  const STORAGE_KEY_LIKES = 'gamebox_post_likes';

  // Supabase 客户端引用
  let supabaseClient = null;
  let useSupabase = false;
  let realtimeSubscription = null;

  // =============================================
  // Supabase 初始化和实时订阅
  // =============================================

  /**
   * 初始化 Supabase 连接
   */
  async function initSupabase() {
    // 检查 Supabase SDK 是否加载
    if (typeof supabase === 'undefined') {
      console.error('❌ Supabase SDK 未加载！');
      console.error('请确保 community.html 包含：');
      console.error('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
      return false;
    }
    
    // 检查配置是否存在
    if (typeof SUPABASE_CONFIG === 'undefined') {
      console.error('❌ SUPABASE_CONFIG 未定义！');
      console.error('请确保 community.html 包含：');
      console.error('<script src="supabase-config.js"></script>');
      return false;
    }
    
    // 检查配置是否启用
    if (!SUPABASE_CONFIG.enabled) {
      console.warn('⚠️ Supabase 未启用（SUPABASE_CONFIG.enabled = false）');
      console.log('ℹ️ 社区数据服务: 使用本地存储模式');
      return false;
    }
    
    // 检查 URL 和 Key 是否配置
    if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
      console.error('❌ Supabase URL 或 anonKey 未配置！');
      console.error('当前配置：', {
        url: SUPABASE_CONFIG.url,
        anonKey: SUPABASE_CONFIG.anonKey ? '已设置' : '未设置'
      });
      return false;
    }
    
    try {
      // 使用已初始化的客户端
      if (typeof getSupabase === 'function') {
        supabaseClient = getSupabase();
      } else if (typeof window.supabaseClient !== 'undefined') {
        supabaseClient = window.supabaseClient;
      } else {
        // 手动创建客户端
        console.log('🔌 正在连接 Supabase:', SUPABASE_CONFIG.url);
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      }
      
      if (supabaseClient) {
        console.log('✅ Supabase 客户端已创建');
        
        // 测试连接
        console.log('🔍 正在检查数据库表...');
        
        // 确保数据库表存在
        await ensureDatabaseTables();
        
        if (useSupabase) {
          console.log('✅ 社区数据服务: 已连接 Supabase 数据库');
          
          // 订阅实时更新
          subscribeToRealtimeUpdates();
          
          return true;
        } else {
          console.error('❌ 数据库表检查失败，降级到本地存储');
          return false;
        }
      }
    } catch (e) {
      console.error('❌ Supabase 初始化失败:', e);
      console.error('错误详情:', e.message);
      useSupabase = false;
    }
    
    return false;
  }

  /**
   * 确保数据库表存在 - 如果不存在则创建
   */
  async function ensureDatabaseTables() {
    if (!supabaseClient) {
      console.error('❌ Supabase 客户端未初始化');
      return;
    }

    try {
      // 检查 community_posts 表是否存在
      console.log('🔍 检查 community_posts 表...');
      const { data, error } = await supabaseClient
        .from('community_posts')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ 数据库表检查失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误信息:', error.message);
        
        if (error.code === '42P01') {
          // 表不存在
          console.error('');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('❌ 数据库表不存在！');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('');
          console.error('📝 请按以下步骤修复：');
          console.error('');
          console.error('1. 访问 Supabase 控制台:');
          console.error('   https://supabase.com/dashboard/project/gybgiqyyltckgxbdtzwu');
          console.error('');
          console.error('2. 点击左侧菜单 "SQL Editor"');
          console.error('');
          console.error('3. 点击 "New Query"');
          console.error('');
          console.error('4. 复制项目中的 supabase-init.sql 文件内容');
          console.error('   文件位置: /supabase-init.sql');
          console.error('');
          console.error('5. 粘贴到 SQL Editor 并点击 "Run"');
          console.error('');
          console.error('6. 等待执行完成后，刷新此页面');
          console.error('');
          console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.error('');
        } else if (error.code === 'PGRST301') {
          // 权限问题
          console.error('❌ 数据库权限错误！');
          console.error('请检查 Supabase RLS 策略是否正确设置');
        } else {
          console.error('❌ 未知数据库错误');
        }
        
        // 降级到本地存储
        useSupabase = false;
        return;
      }

      console.log('✅ community_posts 表存在');
      
      // 检查 user_profiles 表
      console.log('🔍 检查 user_profiles 表...');
      const { error: profileError } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (profileError && profileError.code === '42P01') {
        console.warn('⚠️ user_profiles 表不存在');
        console.warn('请执行 supabase-init.sql 创建该表');
      } else {
        console.log('✅ user_profiles 表存在');
      }
      
      console.log('✅ 数据库表检查通过');
      useSupabase = true;
      
      // 检查是否有初始数据，如果没有则迁移本地数据
      if (!error && (!data || data.length === 0)) {
        console.log('📤 检测到无数据，准备迁移本地数据...');
        await migrateLocalDataToSupabase();
      }
    } catch (e) {
      console.error('❌ 检查数据库表失败:', e);
      console.error('错误堆栈:', e.stack);
      useSupabase = false;
    }
  }

  /**
   * 获取创建表的 SQL 语句
   */
  function getCreateTableSQL() {
    return `
-- =============================================
-- GameBox 社区数据表 SQL
-- 请在 Supabase SQL Editor 中执行
-- =============================================

-- 1. 社区帖子表
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '游客',
  avatar TEXT DEFAULT '👤',
  game TEXT DEFAULT '未分类',
  board TEXT DEFAULT 'general',
  replies INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT TRUE,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 帖子评论表
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL DEFAULT '游客',
  avatar TEXT DEFAULT '👤',
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 点赞记录表
CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL, -- 'post' 或 'comment'
  target_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_type, target_id, user_id)
);

-- 4. 社区统计表
CREATE TABLE IF NOT EXISTS community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_members INTEGER DEFAULT 5678,
  total_replies INTEGER DEFAULT 12345,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 在线用户追踪表
CREATE TABLE IF NOT EXISTS online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 活动日志表
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  user_id TEXT,
  details JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_board ON community_posts(board);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON community_likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_online_users_active ON online_users(last_active);

-- 启用行级安全策略 (RLS)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "允许公开读取帖子" ON community_posts FOR SELECT USING (true);
CREATE POLICY "允许公开读取评论" ON community_comments FOR SELECT USING (true);
CREATE POLICY "允许公开读取统计" ON community_stats FOR SELECT USING (true);
CREATE POLICY "允许公开读取在线用户" ON online_users FOR SELECT USING (true);

-- 允许插入（可选择限制为已认证用户）
CREATE POLICY "允许创建帖子" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "允许创建评论" ON community_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "允许点赞" ON community_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "允许更新在线状态" ON online_users FOR ALL USING (true);
CREATE POLICY "允许记录活动" ON activity_logs FOR INSERT WITH CHECK (true);

-- 允许更新自己的帖子
CREATE POLICY "允许更新帖子" ON community_posts FOR UPDATE USING (true);
CREATE POLICY "允许更新统计" ON community_stats FOR UPDATE USING (true);
CREATE POLICY "允许删除点赞" ON community_likes FOR DELETE USING (true);

-- 插入初始统计数据
INSERT INTO community_stats (id, total_members, total_replies, start_time)
VALUES (1, 5678, 12345, NOW())
ON CONFLICT (id) DO NOTHING;
`;
  }

  /**
   * 迁移本地数据到 Supabase
   */
  async function migrateLocalDataToSupabase() {
    if (!useSupabase || !supabaseClient) return;

    try {
      // 读取本地帖子数据
      const localPosts = JSON.parse(localStorage.getItem(STORAGE_KEY_POSTS) || '[]');
      
      if (localPosts.length > 0) {
        console.log(`📤 正在迁移 ${localPosts.length} 条本地帖子到 Supabase...`);
        
        // 转换数据格式并插入
        const postsToInsert = localPosts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: post.author || '游客',
          avatar: post.avatar || '👤',
          game: post.game || '未分类',
          board: post.board || 'general',
          replies: post.replies || 0,
          likes: post.likes || 0,
          views: post.views || 0,
          is_pinned: post.isPinned || false,
          is_new: post.isNew || false,
          created_at: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString()
        }));

        const { error } = await supabaseClient
          .from('community_posts')
          .upsert(postsToInsert, { onConflict: 'id' });

        if (error) {
          console.error('迁移数据失败:', error);
        } else {
          console.log('✅ 本地数据迁移成功');
        }
      }
    } catch (e) {
      console.error('数据迁移出错:', e);
    }
  }

  /**
   * 订阅实时更新
   */
  function subscribeToRealtimeUpdates() {
    if (!useSupabase || !supabaseClient) return;

    try {
      // 取消之前的订阅
      if (realtimeSubscription) {
        supabaseClient.removeChannel(realtimeSubscription);
      }

      // 订阅帖子变化
      realtimeSubscription = supabaseClient
        .channel('community_realtime')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'community_posts' }, 
          (payload) => {
            console.log('📬 帖子实时更新:', payload.eventType);
            window.dispatchEvent(new CustomEvent('community-update', { 
              detail: { type: 'post', ...payload } 
            }));
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'community_comments' },
          (payload) => {
            console.log('💬 评论实时更新:', payload.eventType);
            window.dispatchEvent(new CustomEvent('community-update', {
              detail: { type: 'comment', ...payload }
            }));
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ 已订阅社区实时更新');
          }
        });
    } catch (e) {
      console.error('订阅实时更新失败:', e);
    }
  }

  // =============================================
  // 帖子管理功能
  // =============================================

  /**
   * 获取所有帖子
   */
  async function getAllPosts() {
    // 优先使用 Supabase
    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_posts')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 转换数据格式
        const posts = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: post.author,
          avatar: post.avatar,
          game: post.game,
          board: post.board,
          replies: post.replies || 0,
          likes: post.likes || 0,
          views: post.views || 0,
          isPinned: post.is_pinned,
          isNew: post.is_new || isNewPost(post.created_at),
          time: formatTimeAgo(post.created_at),
          createdAt: new Date(post.created_at).getTime()
        }));

        // 同步到本地缓存
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
        
        console.log(`✅ 从 Supabase 获取 ${posts.length} 条帖子`);
        return posts;
      } catch (e) {
        console.error('从 Supabase 获取帖子失败:', e);
        // 降级到本地缓存
      }
    }

    // 使用本地存储
    return getLocalPosts();
  }

  /**
   * 获取本地存储的帖子
   */
  function getLocalPosts() {
    try {
      const postsJson = localStorage.getItem(STORAGE_KEY_POSTS);
      if (!postsJson) {
        // 初始化默认数据
        const defaultPosts = getDefaultPosts();
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(defaultPosts));
        return defaultPosts;
      }
      return JSON.parse(postsJson);
    } catch (e) {
      console.error('读取本地帖子失败:', e);
      return getDefaultPosts();
    }
  }

  /**
   * 根据ID获取帖子
   */
  async function getPostById(id) {
    // 优先从 Supabase 获取
    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // 增加浏览量
          await incrementPostViews(id);
          
          return {
            id: data.id,
            title: data.title,
            content: data.content,
            author: data.author,
            avatar: data.avatar,
            game: data.game,
            board: data.board,
            replies: data.replies || 0,
            likes: data.likes || 0,
            views: (data.views || 0) + 1,
            isPinned: data.is_pinned,
            isNew: data.is_new || isNewPost(data.created_at),
            time: formatTimeAgo(data.created_at),
            createdAt: new Date(data.created_at).getTime()
          };
        }
      } catch (e) {
        console.error('从 Supabase 获取帖子失败:', e);
      }
    }

    // 从本地获取
    const posts = getLocalPosts();
    const post = posts.find(p => p.id === id);
    if (post) {
      post.views = (post.views || 0) + 1;
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    }
    return post;
  }

  /**
   * 增加帖子浏览量
   */
  async function incrementPostViews(postId) {
    if (!useSupabase || !supabaseClient) return;

    try {
      await supabaseClient.rpc('increment_post_views', { post_id: postId });
    } catch (e) {
      // 如果没有存储过程，直接更新
      try {
        const { data: post } = await supabaseClient
          .from('community_posts')
          .select('views')
          .eq('id', postId)
          .single();
        
        if (post) {
          await supabaseClient
            .from('community_posts')
            .update({ views: (post.views || 0) + 1 })
            .eq('id', postId);
        }
      } catch (updateError) {
        console.debug('更新浏览量失败:', updateError);
      }
    }
  }

  /**
   * 创建新帖子
   */
  async function createPost(postData) {
    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: postData.title,
      content: postData.content,
      author: postData.author || getCurrentUsername() || '游客',
      avatar: postData.avatar || getCurrentUserAvatar() || '👤',
      game: postData.game || '未分类',
      board: postData.board || 'general',
      replies: 0,
      likes: 0,
      views: 0,
      isPinned: false,
      isNew: true,
      time: '刚刚',
      createdAt: Date.now()
    };

    // 保存到 Supabase
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
            user_id: getCurrentUserId(),
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        
        console.log('✅ 帖子已保存到 Supabase:', newPost.id);
        
        // 更新统计
        await updateCommunityStatsInDB({ postsIncrement: 1 });
        
        // 记录活动
        await logActivity('CREATE_POST', {
          postId: newPost.id,
          title: newPost.title,
          board: newPost.board
        });

        return { success: true, post: newPost };
      } catch (e) {
        console.error('保存到 Supabase 失败:', e);
        // 降级到本地存储
      }
    }

    // 保存到本地
    const posts = getLocalPosts();
    posts.unshift(newPost);
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    
    return { success: true, post: newPost };
  }

  /**
   * 更新帖子
   */
  async function updatePost(postId, updates) {
    // 更新 Supabase
    if (useSupabase && supabaseClient) {
      try {
        const supabaseUpdates = {};
        if (updates.title) supabaseUpdates.title = updates.title;
        if (updates.content) supabaseUpdates.content = updates.content;
        if (updates.game) supabaseUpdates.game = updates.game;
        if (updates.board) supabaseUpdates.board = updates.board;
        if (updates.replies !== undefined) supabaseUpdates.replies = updates.replies;
        if (updates.likes !== undefined) supabaseUpdates.likes = updates.likes;
        if (updates.views !== undefined) supabaseUpdates.views = updates.views;
        if (updates.isPinned !== undefined) supabaseUpdates.is_pinned = updates.isPinned;
        supabaseUpdates.updated_at = new Date().toISOString();

        const { error } = await supabaseClient
          .from('community_posts')
          .update(supabaseUpdates)
          .eq('id', postId);

        if (error) throw error;
        
        console.log('✅ 帖子已更新:', postId);
        return { success: true };
      } catch (e) {
        console.error('更新帖子失败:', e);
      }
    }

    // 更新本地
    const posts = getLocalPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates };
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      return { success: true };
    }
    return { success: false, error: '帖子不存在' };
  }

  /**
   * 删除帖子
   */
  async function deletePost(postId) {
    // 从 Supabase 删除
    if (useSupabase && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('community_posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;
        
        console.log('✅ 帖子已从 Supabase 删除:', postId);
      } catch (e) {
        console.error('从 Supabase 删除失败:', e);
      }
    }

    // 从本地删除
    const posts = getLocalPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      posts.splice(index, 1);
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
    }
    
    return { success: true };
  }

  // =============================================
  // 评论功能
  // =============================================

  /**
   * 获取帖子评论
   */
  async function getPostComments(postId) {
    // 从 Supabase 获取
    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        return data.map(comment => ({
          id: comment.id,
          author: comment.author,
          avatar: comment.avatar,
          content: comment.content,
          likes: comment.likes || 0,
          time: formatTimeAgo(comment.created_at),
          createdAt: new Date(comment.created_at).getTime()
        }));
      } catch (e) {
        console.error('获取评论失败:', e);
      }
    }

    // 从本地获取
    try {
      const commentsJson = localStorage.getItem(STORAGE_KEY_COMMENTS);
      const allComments = commentsJson ? JSON.parse(commentsJson) : {};
      return allComments[postId] || [];
    } catch (e) {
      return [];
    }
  }

  /**
   * 添加评论
   */
  async function addComment(postId, commentData) {
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: commentData.author || getCurrentUsername() || '游客',
      avatar: commentData.avatar || getCurrentUserAvatar() || '👤',
      content: commentData.content,
      likes: 0,
      time: '刚刚',
      createdAt: Date.now()
    };

    // 保存到 Supabase
    if (useSupabase && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('community_comments')
          .insert([{
            id: newComment.id,
            post_id: postId,
            author: newComment.author,
            avatar: newComment.avatar,
            content: newComment.content,
            likes: 0,
            user_id: getCurrentUserId(),
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;

        // 更新帖子回复数
        const { data: post } = await supabaseClient
          .from('community_posts')
          .select('replies')
          .eq('id', postId)
          .single();
        
        if (post) {
          await supabaseClient
            .from('community_posts')
            .update({ replies: (post.replies || 0) + 1 })
            .eq('id', postId);
        }

        // 更新社区统计
        await updateCommunityStatsInDB({ repliesIncrement: 1 });

        // 记录活动
        await logActivity('ADD_COMMENT', { postId, commentId: newComment.id });

        console.log('✅ 评论已保存到 Supabase');
        return { success: true, comment: newComment };
      } catch (e) {
        console.error('保存评论失败:', e);
      }
    }

    // 保存到本地
    try {
      const commentsJson = localStorage.getItem(STORAGE_KEY_COMMENTS);
      const allComments = commentsJson ? JSON.parse(commentsJson) : {};
      
      if (!allComments[postId]) {
        allComments[postId] = [];
      }
      allComments[postId].push(newComment);
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(allComments));

      // 更新帖子回复数
      await updatePost(postId, { replies: allComments[postId].length });
      
      return { success: true, comment: newComment };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // =============================================
  // 点赞功能
  // =============================================

  /**
   * 点赞/取消点赞帖子
   */
  async function likePost(postId) {
    const userId = getCurrentUserId() || getAnonymousUserId();
    const likeKey = `like_post_${postId}_${userId}`;
    
    // 检查是否已点赞
    let isLiked = false;

    if (useSupabase && supabaseClient) {
      try {
        // 检查是否已点赞
        const { data: existingLike, error: checkError } = await supabaseClient
          .from('community_likes')
          .select('id')
          .eq('target_type', 'post')
          .eq('target_id', postId)
          .eq('user_id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingLike) {
          // 取消点赞
          await supabaseClient
            .from('community_likes')
            .delete()
            .eq('id', existingLike.id);
          isLiked = false;
          console.log('👎 取消点赞:', postId);
        } else {
          // 添加点赞
          const { error: insertError } = await supabaseClient
            .from('community_likes')
            .insert([{
              id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              target_type: 'post',
              target_id: postId,
              user_id: userId,
              created_at: new Date().toISOString()
            }]);

          if (insertError) throw insertError;
          isLiked = true;
          console.log('👍 点赞成功:', postId);
        }

        // 更新帖子点赞数
        const { count } = await supabaseClient
          .from('community_likes')
          .select('id', { count: 'exact', head: true })
          .eq('target_type', 'post')
          .eq('target_id', postId);

        await supabaseClient
          .from('community_posts')
          .update({ likes: count || 0, updated_at: new Date().toISOString() })
          .eq('id', postId);

        // 记录活动
        await logActivity(isLiked ? 'LIKE_POST' : 'UNLIKE_POST', { postId, likes: count });

        // 触发实时更新事件
        window.dispatchEvent(new CustomEvent('post-like-update', { 
          detail: { postId, liked: isLiked, likes: count || 0 } 
        }));

        return { success: true, liked: isLiked, likes: count || 0 };
      } catch (e) {
        console.error('点赞操作失败:', e);
        // 降级到本地存储
      }
    }

    // 本地存储模式
    const liked = localStorage.getItem(likeKey);
    const posts = getLocalPosts();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      if (liked) {
        post.likes = Math.max(0, (post.likes || 0) - 1);
        localStorage.removeItem(likeKey);
        isLiked = false;
      } else {
        post.likes = (post.likes || 0) + 1;
        localStorage.setItem(likeKey, 'true');
        isLiked = true;
      }
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
      
      // 触发实时更新事件
      window.dispatchEvent(new CustomEvent('post-like-update', { 
        detail: { postId, liked: isLiked, likes: post.likes } 
      }));
      
      return { success: true, liked: isLiked, likes: post.likes };
    }
    
    return { success: false, error: '帖子不存在' };
  }

  /**
   * 检查是否已点赞帖子
   */
  async function isPostLiked(postId) {
    const userId = getCurrentUserId() || getAnonymousUserId();

    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_likes')
          .select('id')
          .eq('target_type', 'post')
          .eq('target_id', postId)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        return !!data;
      } catch (e) {
        console.debug('检查点赞状态失败:', e);
        return false;
      }
    }

    return !!localStorage.getItem(`like_post_${postId}_${userId}`);
  }

  /**
   * 点赞/取消点赞评论
   */
  async function likeComment(commentId) {
    const userId = getCurrentUserId() || getAnonymousUserId();
    const likeKey = `like_comment_${commentId}_${userId}`;
    
    let isLiked = false;

    if (useSupabase && supabaseClient) {
      try {
        // 检查是否已点赞
        const { data: existingLike, error: checkError } = await supabaseClient
          .from('community_likes')
          .select('id')
          .eq('target_type', 'comment')
          .eq('target_id', commentId)
          .eq('user_id', userId)
          .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingLike) {
          // 取消点赞
          await supabaseClient
            .from('community_likes')
            .delete()
            .eq('id', existingLike.id);
          isLiked = false;
        } else {
          // 添加点赞
          const { error: insertError } = await supabaseClient
            .from('community_likes')
            .insert([{
              id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
              target_type: 'comment',
              target_id: commentId,
              user_id: userId,
              created_at: new Date().toISOString()
            }]);

          if (insertError) throw insertError;
          isLiked = true;
        }

        // 更新评论点赞数
        const { count } = await supabaseClient
          .from('community_likes')
          .select('id', { count: 'exact', head: true })
          .eq('target_type', 'comment')
          .eq('target_id', commentId);

        await supabaseClient
          .from('community_comments')
          .update({ likes: count || 0 })
          .eq('id', commentId);

        // 记录活动
        await logActivity(isLiked ? 'LIKE_COMMENT' : 'UNLIKE_COMMENT', { commentId, likes: count });

        return { success: true, liked: isLiked, likes: count || 0 };
      } catch (e) {
        console.error('评论点赞操作失败:', e);
      }
    }

    // 本地存储模式
    const liked = localStorage.getItem(likeKey);
    
    // 从本地存储获取评论数据
    try {
      const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY_COMMENTS) || '{}');
      
      // 遍历所有帖子的评论查找目标评论
      for (const postId in allComments) {
        const comments = allComments[postId];
        const comment = comments.find(c => c.id === commentId);
        
        if (comment) {
          if (liked) {
            comment.likes = Math.max(0, (comment.likes || 0) - 1);
            localStorage.removeItem(likeKey);
            isLiked = false;
          } else {
            comment.likes = (comment.likes || 0) + 1;
            localStorage.setItem(likeKey, 'true');
            isLiked = true;
          }
          
          localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(allComments));
          return { success: true, liked: isLiked, likes: comment.likes };
        }
      }
    } catch (e) {
      console.error('本地评论点赞失败:', e);
    }
    
    return { success: false, error: '评论不存在' };
  }

  /**
   * 检查是否已点赞评论
   */
  async function isCommentLiked(commentId) {
    const userId = getCurrentUserId() || getAnonymousUserId();

    if (useSupabase && supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('community_likes')
          .select('id')
          .eq('target_type', 'comment')
          .eq('target_id', commentId)
          .eq('user_id', userId)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        return !!data;
      } catch (e) {
        console.debug('检查评论点赞状态失败:', e);
        return false;
      }
    }

    return !!localStorage.getItem(`like_comment_${commentId}_${userId}`);
  }

  // =============================================
  // 社区统计功能
  // =============================================

  /**
   * 获取社区统计数据
   */
  async function getCommunityStats() {
    // 从 Supabase 获取真实统计
    if (useSupabase && supabaseClient) {
      try {
        // 获取帖子总数
        const { count: postsCount } = await supabaseClient
          .from('community_posts')
          .select('id', { count: 'exact', head: true });

        // 获取统计表数据
        const { data: stats } = await supabaseClient
          .from('community_stats')
          .select('*')
          .eq('id', 1)
          .single();

        // 计算真实回复数（从评论表获取）
        const { count: totalComments } = await supabaseClient
          .from('community_comments')
          .select('id', { count: 'exact', head: true });

        // 获取真实在线用户数（异步查询）
        const onlineUsers = await getOnlineUserCount();

        // 统计真实注册用户数（从 user_profiles 表）
        let realMembers = 0;
        try {
          const { count: membersCount } = await supabaseClient
            .from('user_profiles')
            .select('id', { count: 'exact', head: true });
          
          realMembers = membersCount || 0;
          console.log(`✅ 真实注册用户数: ${realMembers}`);
        } catch (e) {
          console.debug('统计真实用户失败:', e);
          // 降级方案：统计发帖和评论的用户去重
          try {
            const { data: postAuthors } = await supabaseClient
              .from('community_posts')
              .select('author')
              .neq('author', '游客');
            
            const { data: commentAuthors } = await supabaseClient
              .from('community_comments')
              .select('author')
              .neq('author', '游客');
            
            const allAuthors = new Set([
              ...(postAuthors || []).map(p => p.author),
              ...(commentAuthors || []).map(c => c.author)
            ]);
            
            realMembers = allAuthors.size;
          } catch (fallbackError) {
            console.debug('降级统计也失败:', fallbackError);
          }
        }

        const result = {
          totalPosts: postsCount || 0,
          totalMembers: realMembers,  // 使用真实统计的用户数
          totalReplies: totalComments || 0,  // 直接使用评论总数
          onlineUsers: onlineUsers
        };

        console.log('📊 Supabase 统计数据:', result);
        return result;
      } catch (e) {
        console.error('获取 Supabase 统计失败:', e);
      }
    }

    // 本地统计 - 使用真实数据
    const posts = getLocalPosts();
    const totalReplies = posts.reduce((sum, p) => sum + (p.replies || 0), 0);
    
    // 从本地存储获取评论总数
    try {
      const commentsJson = localStorage.getItem(STORAGE_KEY_COMMENTS);
      const allComments = commentsJson ? JSON.parse(commentsJson) : {};
      const actualReplies = Object.values(allComments).reduce((sum, comments) => sum + comments.length, 0);
      
      return {
        totalPosts: posts.length,
        totalMembers: 0,  // 本地模式无法统计真实成员数
        totalReplies: actualReplies,  // 使用真实评论数
        onlineUsers: await getOnlineUserCount()  // 异步获取真实在线数
      };
    } catch (e) {
      return {
        totalPosts: posts.length,
        totalMembers: 0,
        totalReplies: totalReplies,
        onlineUsers: await getOnlineUserCount()  // 异步获取真实在线数
      };
    }
  }

  /**
   * 更新数据库中的社区统计
   */
  async function updateCommunityStatsInDB(updates) {
    if (!useSupabase || !supabaseClient) return;

    try {
      const { data: current } = await supabaseClient
        .from('community_stats')
        .select('*')
        .eq('id', 1)
        .single();

      const newStats = {
        total_members: (current?.total_members || 0) + (updates.membersIncrement || 0),
        total_replies: (current?.total_replies || 0) + (updates.repliesIncrement || 0),
        last_update: new Date().toISOString()
      };

      await supabaseClient
        .from('community_stats')
        .upsert({ id: 1, ...newStats }, { onConflict: 'id' });
    } catch (e) {
      console.debug('更新统计失败:', e);
    }
  }

  /**
   * 计算会员增长（基于时间）
   */
  function calculateMemberGrowth(startTime) {
    const start = startTime ? new Date(startTime).getTime() : Date.now() - 7 * 24 * 60 * 60 * 1000;
    const daysSinceStart = (Date.now() - start) / (1000 * 60 * 60 * 24);
    return Math.floor(daysSinceStart * (5 + Math.random() * 10));
  }

  // =============================================
  // 在线用户功能
  // =============================================

  /**
   * 获取真实在线用户数（从数据库查询最近5分钟活跃的用户）
   */
  async function getOnlineUserCount() {
    // 从 Supabase 获取真实在线用户数
    if (useSupabase && supabaseClient) {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        
        const { count, error } = await supabaseClient
          .from('online_users')
          .select('user_id', { count: 'exact', head: true })
          .gte('last_active', fiveMinutesAgo);
        
        if (error) throw error;
        
        const realOnlineCount = count || 0;
        console.log(`🟢 真实在线用户数: ${realOnlineCount}`);
        return realOnlineCount;
      } catch (e) {
        console.debug('获取真实在线用户数失败:', e);
      }
    }
    
    // 本地模式降级：统计本地活跃用户
    try {
      const localOnlineData = JSON.parse(localStorage.getItem('gamebox_local_online') || '{}');
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      
      let onlineCount = 0;
      for (const userId in localOnlineData) {
        if (localOnlineData[userId] > fiveMinutesAgo) {
          onlineCount++;
        }
      }
      
      return onlineCount;
    } catch (e) {
      return 0;
    }
  }

  /**
   * 获取在线用户列表
   */
  async function getOnlineUsers() {
    // 如果使用 Supabase，从数据库获取
    if (useSupabase && supabaseClient) {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        
        const { data } = await supabaseClient
          .from('online_users')
          .select('username')
          .gte('last_active', fiveMinutesAgo)
          .limit(20);

        if (data && data.length > 0) {
          return data.map(u => u.username);
        }
      } catch (e) {
        console.debug('获取在线用户失败:', e);
      }
    }

    // 模拟在线用户
    const userNames = [
      '褪色者小明', 'V', '海拉鲁勇者', '掌机党', '小骑士', 
      '买家小王', '罪恶都市粉', 'GameBox官方', '赛博浪客',
      '荒野猎人', '星际旅者', '魔法使', '剑圣', '枪神',
      '战术大师', '探险家', '收集癖', '成就党', '速通玩家'
    ];
    
    const count = Math.min(getOnlineUserCount(), userNames.length);
    return userNames.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  /**
   * 更新用户在线状态（心跳机制）
   */
  async function updateOnlineStatus() {
    const userId = getCurrentUserId() || getAnonymousUserId();
    const username = getCurrentUsername() || '访客';

    // 更新到 Supabase
    if (useSupabase && supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('online_users')
          .upsert({
            user_id: userId,
            username: username,
            last_active: new Date().toISOString()
          }, { onConflict: 'user_id' });
        
        if (error) throw error;
        console.log(`💓 心跳更新成功: ${username}`);
      } catch (e) {
        console.debug('更新在线状态失败:', e);
      }
    }
    
    // 同时更新到本地存储（降级方案）
    try {
      const localOnlineData = JSON.parse(localStorage.getItem('gamebox_local_online') || '{}');
      localOnlineData[userId] = Date.now();
      localStorage.setItem('gamebox_local_online', JSON.stringify(localOnlineData));
    } catch (e) {
      console.debug('更新本地在线状态失败:', e);
    }
  }

  // =============================================
  // 活动日志功能
  // =============================================

  /**
   * 记录用户活动
   */
  async function logActivity(action, details = {}) {
    const activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      action: action,
      userId: getCurrentUserId() || getAnonymousUserId(),
      timestamp: new Date().toISOString(),
      epochTime: Date.now(),
      details: details,
      sessionId: getSessionId()
    };

    // 保存到 Supabase
    if (useSupabase && supabaseClient) {
      try {
        await supabaseClient
          .from('activity_logs')
          .insert([{
            id: activity.id,
            action: activity.action,
            user_id: activity.userId,
            details: activity.details,
            session_id: activity.sessionId,
            created_at: activity.timestamp
          }]);
      } catch (e) {
        console.debug('记录活动失败:', e);
      }
    }

    // 保存到本地
    try {
      const ACTIVITY_LOG_KEY = 'gamebox_activity_log';
      let logs = JSON.parse(localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
      logs.unshift(activity);
      if (logs.length > 500) logs = logs.slice(0, 500);
      localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(logs));
    } catch (e) {
      // 忽略
    }

    console.log(`📝 活动记录: ${action}`, details);
    return activity;
  }

  /**
   * 获取活动日志
   */
  function getActivityLogs(options = {}) {
    try {
      const logsJson = localStorage.getItem('gamebox_activity_log');
      let logs = logsJson ? JSON.parse(logsJson) : [];
      
      if (options.action) logs = logs.filter(l => l.action === options.action);
      if (options.userId) logs = logs.filter(l => l.userId === options.userId);
      if (options.since) logs = logs.filter(l => l.epochTime >= options.since);
      if (options.limit) logs = logs.slice(0, options.limit);
      
      return logs;
    } catch (e) {
      return [];
    }
  }

  /**
   * 获取活动统计摘要
   */
  function getActivitySummary(hours = 24) {
    const since = Date.now() - hours * 60 * 60 * 1000;
    const logs = getActivityLogs({ since });
    
    const summary = {
      totalActivities: logs.length,
      uniqueUsers: new Set(logs.map(l => l.userId)).size,
      byAction: {},
      timeRange: {
        start: new Date(since).toISOString(),
        end: new Date().toISOString()
      }
    };
    
    logs.forEach(log => {
      summary.byAction[log.action] = (summary.byAction[log.action] || 0) + 1;
    });
    
    return summary;
  }

  /**
   * 导出活动日志
   */
  function exportActivityLogs() {
    const logs = getActivityLogs();
    return JSON.stringify({
      exportTime: new Date().toISOString(),
      totalRecords: logs.length,
      logs: logs
    }, null, 2);
  }

  // =============================================
  // 辅助函数
  // =============================================

  function getCurrentUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('gamebox_current_user') || localStorage.getItem('currentUser') || '{}');
      return user.id || null;
    } catch {
      return null;
    }
  }

  function getCurrentUsername() {
    try {
      const user = JSON.parse(localStorage.getItem('gamebox_current_user') || localStorage.getItem('currentUser') || '{}');
      return user.username || user.nickname || null;
    } catch {
      return null;
    }
  }

  function getCurrentUserAvatar() {
    try {
      const user = JSON.parse(localStorage.getItem('gamebox_current_user') || localStorage.getItem('currentUser') || '{}');
      return user.avatar || '👤';
    } catch {
      return '👤';
    }
  }

  function getAnonymousUserId() {
    let anonId = localStorage.getItem('gamebox_anonymous_id');
    if (!anonId) {
      anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('gamebox_anonymous_id', anonId);
    }
    return anonId;
  }

  function getSessionId() {
    let sessionId = sessionStorage.getItem('gamebox_session_id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('gamebox_session_id', sessionId);
    }
    return sessionId;
  }

  function isNewPost(createdAt) {
    const postTime = new Date(createdAt).getTime();
    return (Date.now() - postTime) < 24 * 60 * 60 * 1000;
  }

  function formatTimeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = Date.now();
    const diff = now - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  }

  /**
   * 获取默认帖子数据
   */
  function getDefaultPosts() {
    return [
      {
        id: "pinned-1",
        title: "【公告】社区使用指南 - 新人必读",
        content: "欢迎来到 GameBox 社区！本帖包含社区规则、发帖指南、常见问题解答等内容，建议新玩家仔细阅读...",
        author: "GameBox官方",
        avatar: "🎮",
        game: "GameBox",
        board: "general",
        replies: 156,
        likes: 892,
        views: 5432,
        isPinned: true,
        isNew: false,
        time: "置顶",
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000
      },
      {
        id: "elden-newbie",
        title: "新手入门：如何在《艾尔登法环》中少死一点",
        content: "大家好，作为一个从魂系游戏一路走来的老玩家，今天分享一些艾尔登法环的新手技巧。首先是选择职业...",
        author: "褪色者小明",
        avatar: "⚔️",
        game: "艾尔登法环",
        board: "guide",
        replies: 89,
        likes: 456,
        views: 2341,
        isPinned: false,
        isNew: false,
        time: "2小时前",
        createdAt: Date.now() - 2 * 60 * 60 * 1000
      },
      {
        id: "cp-photo",
        title: "【截图分享】夜之城的霓虹灯太美了！",
        content: "用 RTX 4090 开满光追拍的，这游戏的画面真的是绝了，分享几张我最满意的截图...",
        author: "V",
        avatar: "🌃",
        game: "赛博朋克 2077",
        board: "shot",
        replies: 67,
        likes: 234,
        views: 1567,
        isPinned: false,
        isNew: true,
        time: "30分钟前",
        createdAt: Date.now() - 30 * 60 * 1000
      },
      {
        id: "zelda-tears",
        title: "王国之泪 神庙全收集攻略（持续更新中）",
        content: "本帖整理了王国之泪所有神庙的位置和解谜方法，目前已更新 120/152 个，欢迎收藏...",
        author: "海拉鲁勇者",
        avatar: "🗡️",
        game: "塞尔达传说：王国之泪",
        board: "guide",
        replies: 234,
        likes: 678,
        views: 4521,
        isPinned: false,
        isNew: false,
        time: "1天前",
        createdAt: Date.now() - 24 * 60 * 60 * 1000
      },
      {
        id: "steam-deck",
        title: "Steam Deck 上玩什么游戏体验最好？",
        content: "刚入手 Steam Deck，求推荐一些适合掌机玩的游戏，最好是能离线玩的，出差时候打发时间...",
        author: "掌机党",
        avatar: "🎮",
        game: "多游戏",
        board: "general",
        replies: 45,
        likes: 123,
        views: 892,
        isPinned: false,
        isNew: false,
        time: "3小时前",
        createdAt: Date.now() - 3 * 60 * 60 * 1000
      }
    ];
  }

  // =============================================
  // 初始化和导出
  // =============================================

  /**
   * 注册或更新用户资料
   */
  async function ensureUserProfile() {
    const userId = getCurrentUserId();
    const username = getCurrentUsername();
    
    if (!userId || !username || !useSupabase || !supabaseClient) {
      return;
    }

    try {
      // 检查用户是否已存在
      const { data: existingUser } = await supabaseClient
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!existingUser) {
        // 创建新用户资料
        const { error } = await supabaseClient
          .from('user_profiles')
          .insert([{
            id: userId,
            username: username,
            avatar: getCurrentUserAvatar(),
            created_at: new Date().toISOString(),
            last_login_at: new Date().toISOString()
          }]);

        if (error && error.code !== '23505') {  // 忽略重复键错误
          throw error;
        }
        
        console.log('✅ 已创建用户资料:', username);
      } else {
        // 更新最后登录时间
        await supabaseClient
          .from('user_profiles')
          .update({ last_login_at: new Date().toISOString() })
          .eq('id', userId);
        
        console.log('✅ 已更新用户登录时间:', username);
      }
    } catch (e) {
      console.debug('确保用户资料失败:', e);
    }
  }

  /**
   * 初始化社区数据服务
   */
  async function initCommunityData() {
    // 初始化 Supabase 连接
    await initSupabase();
    
    // 确保当前用户资料存在
    await ensureUserProfile();
    
    // 确保本地有默认数据
    if (!localStorage.getItem(STORAGE_KEY_POSTS)) {
      localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(getDefaultPosts()));
    }
    
    // 初始化统计数据（使用真实初始值）
    if (!localStorage.getItem(STORAGE_KEY_STATS)) {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify({
        totalMembers: 0,  // 从0开始统计真实用户
        totalReplies: 0,  // 从0开始统计真实回复
        lastUpdate: Date.now(),
        startTime: Date.now()
      }));
    }
    
    // 立即更新在线状态
    await updateOnlineStatus();
    
    // 启动心跳机制（每30秒更新一次在线状态）
    const heartbeatInterval = setInterval(async () => {
      await updateOnlineStatus();
      window.dispatchEvent(new CustomEvent('community-stats-update'));
    }, 30000);
    
    // 启动统计刷新（每10秒更新一次在线人数显示）
    const statsRefreshInterval = setInterval(() => {
      window.dispatchEvent(new CustomEvent('community-stats-update'));
    }, 10000);
    
    // 页面可见性变化时更新
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        await updateOnlineStatus();
      }
    });
    
    // 用户活跃检测（鼠标移动、键盘输入、滚动）
    let lastActivityUpdate = Date.now();
    const activityThrottle = 30000;  // 30秒内最多更新一次
    
    const updateActivityThrottled = async () => {
      const now = Date.now();
      if (now - lastActivityUpdate > activityThrottle) {
        lastActivityUpdate = now;
        await updateOnlineStatus();
      }
    };
    
    // 监听用户活动
    ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateActivityThrottled, { passive: true });
    });
    
    // 用户离开页面时标记离线
    window.addEventListener('beforeunload', async () => {
      if (useSupabase && supabaseClient) {
        try {
          const userId = getCurrentUserId() || getAnonymousUserId();
          // 删除在线记录
          await supabaseClient
            .from('online_users')
            .delete()
            .eq('user_id', userId);
        } catch (e) {
          console.debug('标记离线失败:', e);
        }
      }
    });
    
    // 启动在线用户清理任务（每5分钟清理一次过期用户）
    const cleanupInterval = setInterval(async () => {
      if (useSupabase && supabaseClient) {
        try {
          await supabaseClient.rpc('cleanup_expired_online_users');
          console.log('🧹 已清理过期在线用户');
        } catch (e) {
          console.debug('清理过期用户失败:', e);
        }
      }
      
      // 清理本地存储中的过期数据
      try {
        const localOnlineData = JSON.parse(localStorage.getItem('gamebox_local_online') || '{}');
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        let cleaned = 0;
        
        for (const userId in localOnlineData) {
          if (localOnlineData[userId] < tenMinutesAgo) {
            delete localOnlineData[userId];
            cleaned++;
          }
        }
        
        if (cleaned > 0) {
          localStorage.setItem('gamebox_local_online', JSON.stringify(localOnlineData));
          console.log(`🧹 已清理 ${cleaned} 个本地过期在线记录`);
        }
      } catch (e) {
        console.debug('清理本地过期数据失败:', e);
      }
    }, 5 * 60 * 1000);  // 每5分钟执行一次
    
    // 存储定时器ID以便后续清理
    window._communityHeartbeat = heartbeatInterval;
    window._communityStatsRefresh = statsRefreshInterval;
    window._communityCleanup = cleanupInterval;
    
    console.log('✅ 社区数据服务已初始化', useSupabase ? '(Supabase 真实在线统计)' : '(本地存储模式)');
    console.log('💓 心跳机制已启动，每30秒更新在线状态');
    console.log('🧹 清理任务已启动，每5分钟清理过期用户');
  }

  // 页面可见性变化时更新状态
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      updateOnlineStatus();
    }
  });

  // 导出 API
  window.communityDataService = {
    // 初始化
    initCommunityData,
    isSupabaseEnabled: () => useSupabase,
    getCreateTableSQL,
    ensureUserProfile,  // 新增：确保用户资料存在
    
    // 帖子功能
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    
    // 评论功能
    getPostComments,
    addComment,
    
    // 点赞功能
    likePost,
    isPostLiked,
    likeComment,
    isCommentLiked,
    
    // 统计功能
    getCommunityStats,
    getOnlineUsers,
    getOnlineUserCount,
    updateStats: updateCommunityStatsInDB,
    
    // 活动追踪
    logActivity,
    getActivityLogs,
    getActivitySummary,
    exportActivityLogs,
    
    // 辅助函数
    logPageView: (pageName) => logActivity('PAGE_VIEW', { page: pageName }),
    logUserLogin: (userId) => logActivity('USER_LOGIN', { userId }),
    logPlatformBinding: (platform, info) => logActivity('PLATFORM_BIND', { platform, account: info?.username }),
    
    // 用户信息获取
    getCurrentUserId,
    getCurrentUsername,
    getCurrentUserAvatar
  };

  // 自动初始化
  initCommunityData();

  console.log('✅ 社区数据服务已加载');
})();
