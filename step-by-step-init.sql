-- ========================================
-- GameBox 数据库分步初始化脚本
-- 请按顺序执行每个步骤
-- ========================================

-- ========================================
-- 步骤 1: 创建用户资料表
-- ========================================
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

INSERT INTO user_profiles (user_id, username, avatar, bio) VALUES
  ('user-admin-001', '管理员', '👨‍💼', 'GameBox 社区管理员'),
  ('user-test-001', '测试用户1', '🎮', '游戏爱好者'),
  ('user-test-002', '测试用户2', '🎯', '赛博朋克粉丝');

SELECT '✅ 步骤 1 完成: user_profiles' as "状态", COUNT(*) as "用户数" FROM user_profiles;

-- ========================================
-- 步骤 2: 创建在线用户表
-- ========================================
DROP TABLE IF EXISTS online_users CASCADE;

CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_online_users_last_seen ON online_users(last_seen_at DESC);

INSERT INTO online_users (user_id, username) VALUES
  ('user-admin-001', '管理员'),
  ('user-test-001', '测试用户1');

SELECT '✅ 步骤 2 完成: online_users' as "状态", COUNT(*) as "在线用户数" FROM online_users;

-- ========================================
-- 步骤 3: 修复帖子表（添加缺失的列）
-- ========================================

-- 添加 pinned 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;

-- 添加 game 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS game TEXT;

-- 添加 board 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS board TEXT DEFAULT 'general';

-- 添加 likes 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;

-- 添加 replies 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS replies INTEGER DEFAULT 0;

-- 添加 views 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 添加 updated_at 列
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 更新现有数据
UPDATE community_posts 
SET 
  pinned = COALESCE(pinned, FALSE),
  game = COALESCE(game, '未分类'),
  board = COALESCE(board, 'general'),
  likes = COALESCE(likes, 0),
  replies = COALESCE(replies, 0),
  views = COALESCE(views, 0),
  updated_at = COALESCE(updated_at, created_at);

-- 置顶欢迎帖
UPDATE community_posts SET pinned = TRUE WHERE id = 'pinned-welcome';

SELECT '✅ 步骤 3 完成: community_posts' as "状态", COUNT(*) as "帖子数" FROM community_posts;

-- ========================================
-- 步骤 4: 创建评论表
-- ========================================
DROP TABLE IF EXISTS community_comments CASCADE;

CREATE TABLE community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_comments_created_at ON community_comments(created_at DESC);

INSERT INTO community_comments (id, post_id, author, content) VALUES
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！'),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢分享，很有用！'),
  ('comment-test-3', 'pinned-welcome', '游戏爱好者', '期待更多精彩内容！');

SELECT '✅ 步骤 4 完成: community_comments' as "状态", COUNT(*) as "评论数" FROM community_comments;

-- ========================================
-- 最终验证
-- ========================================

SELECT '📊 数据库统计' as "===";

SELECT 
  'user_profiles' as "表名",
  COUNT(*) as "记录数"
FROM user_profiles
UNION ALL
SELECT 
  'online_users' as "表名",
  COUNT(*) as "记录数"
FROM online_users
UNION ALL
SELECT 
  'community_posts' as "表名",
  COUNT(*) as "记录数"
FROM community_posts
UNION ALL
SELECT 
  'community_comments' as "表名",
  COUNT(*) as "记录数"
FROM community_comments;

-- 显示帖子详情
SELECT 
  id,
  title,
  author,
  game,
  board,
  pinned,
  likes,
  replies,
  views
FROM community_posts
ORDER BY pinned DESC, created_at DESC;

-- 显示评论
SELECT 
  id,
  post_id,
  author,
  content,
  created_at
FROM community_comments
ORDER BY created_at DESC;

-- ========================================
-- ✅ 全部完成！
-- ========================================

SELECT '🎉 数据库初始化完成！' as "状态", NOW() as "时间";
