-- =============================================
-- 紧急修复：完整数据库初始化
-- =============================================

-- 1. 删除所有旧表（清理干净）
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS online_users CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

-- =============================================
-- 2. 创建 community_posts 表（帖子表）
-- =============================================
CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  game TEXT DEFAULT '未分类',
  board TEXT DEFAULT 'general',
  pinned BOOLEAN DEFAULT FALSE,
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_posts_board ON community_posts(board);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_posts_pinned ON community_posts(pinned DESC, created_at DESC);

-- 插入置顶帖
INSERT INTO community_posts (id, title, content, author, game, board, pinned, created_at) VALUES
  ('pinned-welcome', '【公告】欢迎来到 GameBox 社区！', 
   E'这是一个由玩家共建的游戏社区。在这里你可以：\n\n🎮 分享游戏心得和攻略\n📷 展示精彩游戏截图\n💬 与其他玩家交流讨论\n🔄 交易游戏物品\n\n请遵守社区规则，友善交流。祝你游戏愉快！', 
   'GameBox官方', '未分类', 'general', TRUE, NOW() - interval '1 day');

SELECT '✅ community_posts 表创建成功' as status, COUNT(*) as count FROM community_posts;

-- =============================================
-- 3. 创建 user_profiles 表（用户资料表）
-- =============================================
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

-- 插入测试用户
INSERT INTO user_profiles (user_id, username, avatar, bio, created_at) VALUES
  ('user-admin-001', '管理员', '👨‍💼', 'GameBox 社区管理员', NOW() - interval '30 days'),
  ('user-test-001', '测试用户1', '🎮', '游戏爱好者', NOW() - interval '15 days'),
  ('user-test-002', '测试用户2', '🎯', '赛博朋克粉丝', NOW() - interval '10 days');

SELECT '✅ user_profiles 表创建成功' as status, COUNT(*) as count FROM user_profiles;

-- =============================================
-- 4. 创建 online_users 表（在线用户表）
-- =============================================
CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_online_users_last_seen ON online_users(last_seen_at DESC);

-- 插入测试在线用户
INSERT INTO online_users (user_id, username, last_seen_at) VALUES
  ('user-admin-001', '管理员', NOW()),
  ('user-test-001', '测试用户1', NOW() - interval '2 minutes');

SELECT '✅ online_users 表创建成功' as status, COUNT(*) as count FROM online_users;

-- =============================================
-- 5. 创建 community_comments 表（评论表）
-- =============================================
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

-- 插入测试评论
INSERT INTO community_comments (id, post_id, author, content, created_at) VALUES
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！', NOW() - interval '30 minutes'),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢分享，很有用！', NOW() - interval '15 minutes'),
  ('comment-test-3', 'pinned-welcome', '游戏爱好者', '期待更多精彩内容！', NOW() - interval '5 minutes');

-- 更新帖子的回复数
UPDATE community_posts SET replies = 3 WHERE id = 'pinned-welcome';

SELECT '✅ community_comments 表创建成功' as status, COUNT(*) as count FROM community_comments;

-- =============================================
-- 6. 最终验证
-- =============================================
SELECT '📊 数据库统计' as "===";

SELECT 
  'community_posts' as "表名",
  COUNT(*) as "记录数",
  '帖子表' as "说明"
FROM community_posts
UNION ALL
SELECT 
  'user_profiles' as "表名",
  COUNT(*) as "记录数",
  '用户资料表' as "说明"
FROM user_profiles
UNION ALL
SELECT 
  'online_users' as "表名",
  COUNT(*) as "记录数",
  '在线用户表' as "说明"
FROM online_users
UNION ALL
SELECT 
  'community_comments' as "表名",
  COUNT(*) as "记录数",
  '评论表' as "说明"
FROM community_comments;

-- 显示所有表的详细数据
SELECT '📋 帖子列表' as "===";
SELECT id, title, author, board, pinned, likes, replies, views, created_at FROM community_posts ORDER BY pinned DESC, created_at DESC;

SELECT '👥 用户列表' as "===";
SELECT user_id, username, avatar, bio, created_at FROM user_profiles ORDER BY created_at;

SELECT '🟢 在线用户' as "===";
SELECT user_id, username, last_seen_at FROM online_users ORDER BY last_seen_at DESC;

SELECT '💬 评论列表' as "===";
SELECT id, post_id, author, content, created_at FROM community_comments ORDER BY created_at DESC;

-- =============================================
-- ✅ 初始化完成！
-- =============================================
SELECT '🎉 数据库初始化完成！' as "状态", NOW() as "时间", '所有表已创建并插入测试数据' as "说明";
