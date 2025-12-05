-- =============================================
-- GameBox Supabase 数据库初始化脚本
-- 使用方法: 在 Supabase Dashboard → SQL Editor 中执行此脚本
-- =============================================

-- 清理现有表（可选，仅在重新初始化时使用）
-- DROP TABLE IF EXISTS community_likes CASCADE;
-- DROP TABLE IF EXISTS community_comments CASCADE;
-- DROP TABLE IF EXISTS community_posts CASCADE;
-- DROP TABLE IF EXISTS community_stats CASCADE;
-- DROP TABLE IF EXISTS online_users CASCADE;
-- DROP TABLE IF EXISTS activity_logs CASCADE;
-- DROP TABLE IF EXISTS user_platform_bindings CASCADE;

-- =============================================
-- 1. 社区帖子表
-- =============================================
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

-- =============================================
-- 2. 帖子评论表
-- =============================================
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

-- =============================================
-- 3. 点赞记录表
-- =============================================
CREATE TABLE IF NOT EXISTS community_likes (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL, -- 'post' 或 'comment'
  target_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_type, target_id, user_id)
);

-- =============================================
-- 4. 社区统计表
-- =============================================
CREATE TABLE IF NOT EXISTS community_stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_members INTEGER DEFAULT 5678,
  total_replies INTEGER DEFAULT 12345,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  last_update TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 在线用户追踪表
-- =============================================
CREATE TABLE IF NOT EXISTS online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. 活动日志表
-- =============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  user_id TEXT,
  details JSONB DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. 用户平台绑定表
-- =============================================
CREATE TABLE IF NOT EXISTS user_platform_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  platform_username VARCHAR(255),
  platform_avatar TEXT,
  platform_profile_url TEXT,
  platform_data JSONB,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- =============================================
-- 创建索引（提升查询性能）
-- =============================================
CREATE INDEX IF NOT EXISTS idx_posts_board ON community_posts(board);
CREATE INDEX IF NOT EXISTS idx_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_is_pinned ON community_posts(is_pinned DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON community_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_likes_target ON community_likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON community_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_online_users_active ON online_users(last_active);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_bindings_user ON user_platform_bindings(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_bindings_platform ON user_platform_bindings(platform);

-- =============================================
-- 启用行级安全策略 (RLS)
-- =============================================
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_platform_bindings ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 创建 RLS 策略 - 允许公开访问（适合社区应用）
-- =============================================

-- 帖子策略
DROP POLICY IF EXISTS "允许公开读取帖子" ON community_posts;
CREATE POLICY "允许公开读取帖子" ON community_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许创建帖子" ON community_posts;
CREATE POLICY "允许创建帖子" ON community_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "允许更新帖子" ON community_posts;
CREATE POLICY "允许更新帖子" ON community_posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "允许删除帖子" ON community_posts;
CREATE POLICY "允许删除帖子" ON community_posts FOR DELETE USING (true);

-- 评论策略
DROP POLICY IF EXISTS "允许公开读取评论" ON community_comments;
CREATE POLICY "允许公开读取评论" ON community_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许创建评论" ON community_comments;
CREATE POLICY "允许创建评论" ON community_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "允许更新评论" ON community_comments;
CREATE POLICY "允许更新评论" ON community_comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "允许删除评论" ON community_comments;
CREATE POLICY "允许删除评论" ON community_comments FOR DELETE USING (true);

-- 点赞策略
DROP POLICY IF EXISTS "允许查看点赞" ON community_likes;
CREATE POLICY "允许查看点赞" ON community_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许点赞" ON community_likes;
CREATE POLICY "允许点赞" ON community_likes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "允许删除点赞" ON community_likes;
CREATE POLICY "允许删除点赞" ON community_likes FOR DELETE USING (true);

-- 统计策略
DROP POLICY IF EXISTS "允许公开读取统计" ON community_stats;
CREATE POLICY "允许公开读取统计" ON community_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许更新统计" ON community_stats;
CREATE POLICY "允许更新统计" ON community_stats FOR UPDATE USING (true);

DROP POLICY IF EXISTS "允许插入统计" ON community_stats;
CREATE POLICY "允许插入统计" ON community_stats FOR INSERT WITH CHECK (true);

-- 在线用户策略
DROP POLICY IF EXISTS "允许公开读取在线用户" ON online_users;
CREATE POLICY "允许公开读取在线用户" ON online_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许更新在线状态" ON online_users;
CREATE POLICY "允许更新在线状态" ON online_users FOR ALL USING (true);

-- 活动日志策略
DROP POLICY IF EXISTS "允许查看活动日志" ON activity_logs;
CREATE POLICY "允许查看活动日志" ON activity_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许记录活动" ON activity_logs;
CREATE POLICY "允许记录活动" ON activity_logs FOR INSERT WITH CHECK (true);

-- 平台绑定策略
DROP POLICY IF EXISTS "允许查看绑定" ON user_platform_bindings;
CREATE POLICY "允许查看绑定" ON user_platform_bindings FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许管理平台绑定" ON user_platform_bindings;
CREATE POLICY "允许管理平台绑定" ON user_platform_bindings FOR ALL USING (true);

-- =============================================
-- 创建触发器函数 - 自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_community_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为帖子表添加触发器
DROP TRIGGER IF EXISTS trigger_update_posts_updated_at ON community_posts;
CREATE TRIGGER trigger_update_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_community_updated_at();

-- 为平台绑定表添加触发器
DROP TRIGGER IF EXISTS trigger_update_bindings_updated_at ON user_platform_bindings;
CREATE TRIGGER trigger_update_bindings_updated_at
  BEFORE UPDATE ON user_platform_bindings
  FOR EACH ROW
  EXECUTE FUNCTION update_community_updated_at();

-- =============================================
-- 插入初始数据
-- =============================================

-- 初始化统计数据
INSERT INTO community_stats (id, total_members, total_replies, start_time, last_update)
VALUES (1, 5678, 12345, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET last_update = NOW();

-- 插入示例帖子（可选，首次初始化时使用）
INSERT INTO community_posts (id, title, content, author, avatar, game, board, replies, likes, views, is_pinned, is_new, created_at)
VALUES 
  ('pinned-welcome', '【公告】欢迎来到 GameBox 社区！', '这是一个由玩家共建的游戏社区。在这里你可以：\n\n🎮 分享游戏心得和攻略\n📷 展示精彩游戏截图\n💬 与其他玩家交流讨论\n🔄 交易游戏物品\n\n请遵守社区规则，友善交流。祝你游戏愉快！', 'GameBox官方', '🎮', 'GameBox', 'general', 0, 0, 0, true, false, NOW() - INTERVAL '30 days')
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- 创建实用的数据库函数
-- =============================================

-- 增加帖子浏览量
CREATE OR REPLACE FUNCTION increment_post_views(post_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE community_posts 
  SET views = views + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- 获取热门帖子
CREATE OR REPLACE FUNCTION get_hot_posts(limit_count INT DEFAULT 10)
RETURNS TABLE (
  id TEXT,
  title TEXT,
  author TEXT,
  game TEXT,
  likes INTEGER,
  replies INTEGER,
  views INTEGER,
  heat_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.author,
    p.game,
    p.likes,
    p.replies,
    p.views,
    (p.likes * 3 + p.replies * 2 + p.views * 0.1) as heat_score
  FROM community_posts p
  WHERE p.is_pinned = false
  ORDER BY heat_score DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 清理过期在线用户（超过 10 分钟未活跃）
CREATE OR REPLACE FUNCTION cleanup_expired_online_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_active < NOW() - INTERVAL '10 minutes';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 启用 Realtime（实时订阅）
-- =============================================
-- 注意：需要在 Supabase Dashboard → Database → Replication 中手动启用表的 Realtime
-- 启用以下表：community_posts, community_comments, community_likes

-- =============================================
-- 完成！
-- =============================================
-- 执行此脚本后，你的数据库已完全配置好
-- 可以开始使用 GameBox 社区功能了！
-- 
-- 下一步：
-- 1. 在 Supabase Dashboard → Database → Replication 启用 Realtime
-- 2. 更新 supabase-config.js 配置文件
-- 3. 测试社区功能
-- =============================================
