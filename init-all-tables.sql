-- ========================================
-- GameBox 社区数据库完整初始化脚本
-- ========================================

-- ========================================
-- 1. 用户资料表 (user_profiles)
-- ========================================

-- 删除旧表
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 创建用户资料表
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

-- 禁用 RLS
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 创建索引
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- 插入测试用户
INSERT INTO user_profiles (user_id, username, avatar, bio, created_at) VALUES
  ('user-admin-001', '管理员', '👨‍💼', 'GameBox 社区管理员', NOW()),
  ('user-test-001', '测试用户1', '🎮', '游戏爱好者', NOW()),
  ('user-test-002', '测试用户2', '🎯', '赛博朋克粉丝', NOW());

-- ========================================
-- 2. 在线用户表 (online_users)
-- ========================================

-- 删除旧表
DROP TABLE IF EXISTS online_users CASCADE;

-- 创建在线用户表
CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 禁用 RLS
ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;

-- 创建索引
CREATE INDEX idx_online_users_last_seen ON online_users(last_seen_at DESC);

-- 插入测试在线用户
INSERT INTO online_users (user_id, username, last_seen_at) VALUES
  ('user-admin-001', '管理员', NOW()),
  ('user-test-001', '测试用户1', NOW());

-- ========================================
-- 3. 社区帖子表 (community_posts)
-- ========================================

-- 注意：不删除帖子表，只确保它存在
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  game TEXT,
  board TEXT NOT NULL DEFAULT 'general',
  pinned BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 禁用 RLS
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

-- 创建索引（如果不存在）
CREATE INDEX IF NOT EXISTS idx_posts_board ON community_posts(board);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_pinned ON community_posts(pinned DESC, created_at DESC);

-- ========================================
-- 4. 评论表 (community_comments)
-- ========================================

-- 删除旧表
DROP TABLE IF EXISTS community_comments CASCADE;

-- 创建评论表
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY DEFAULT ('comment-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8)),
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 禁用 RLS
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

-- 创建索引
CREATE INDEX idx_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_comments_created_at ON community_comments(created_at DESC);

-- 插入测试评论（到现有的置顶帖子）
INSERT INTO community_comments (id, post_id, author, content, created_at) 
SELECT 
  'comment-test-' || generate_series,
  'pinned-welcome',
  CASE generate_series
    WHEN 1 THEN '测试用户1'
    WHEN 2 THEN '测试用户2'
    WHEN 3 THEN '游戏爱好者'
    ELSE '访客' || generate_series
  END,
  CASE generate_series
    WHEN 1 THEN '这是第一条测试评论！'
    WHEN 2 THEN '感谢分享，很有用！'
    WHEN 3 THEN '期待更多精彩内容！'
    ELSE '这是评论 ' || generate_series
  END,
  NOW() - (generate_series || ' minutes')::interval
FROM generate_series(1, 3);

-- ========================================
-- 验证所有表
-- ========================================

-- 验证 user_profiles
SELECT 
  '✅ user_profiles' as "表名",
  COUNT(*) as "记录数",
  MIN(created_at) as "最早创建",
  MAX(created_at) as "最新创建"
FROM user_profiles;

-- 验证 online_users
SELECT 
  '✅ online_users' as "表名",
  COUNT(*) as "记录数",
  MIN(last_seen_at) as "最早在线",
  MAX(last_seen_at) as "最新在线"
FROM online_users;

-- 验证 community_posts
SELECT 
  '✅ community_posts' as "表名",
  COUNT(*) as "帖子总数",
  COUNT(*) FILTER (WHERE pinned = true) as "置顶帖子",
  SUM(likes) as "总点赞数",
  SUM(replies) as "总回复数",
  SUM(views) as "总浏览数"
FROM community_posts;

-- 验证 community_comments
SELECT 
  '✅ community_comments' as "表名",
  COUNT(*) as "评论总数",
  COUNT(DISTINCT post_id) as "涉及帖子数",
  COUNT(DISTINCT author) as "评论用户数"
FROM community_comments;

-- ========================================
-- 显示所有表的详细数据
-- ========================================

-- 用户列表
SELECT '用户列表' as "===", user_id, username, bio, created_at FROM user_profiles ORDER BY created_at;

-- 在线用户
SELECT '在线用户' as "===", user_id, username, last_seen_at FROM online_users ORDER BY last_seen_at DESC;

-- 评论列表
SELECT '评论列表' as "===", id, post_id, author, content, created_at FROM community_comments ORDER BY created_at DESC;

-- ========================================
-- ✅ 初始化完成！
-- ========================================

SELECT '🎉 数据库初始化完成！' as "状态", 
       NOW() as "完成时间",
       '所有表已创建并插入测试数据' as "说明";
