-- ============================================================
-- 🎯 GameBox 社区数据库 - 最终修复脚本（字段名完全匹配前端代码）
-- ============================================================

-- 步骤 1: 删除并重建 community_posts 表（修正字段名）
-- ============================================================

DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

CREATE TABLE community_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  game TEXT,
  board TEXT DEFAULT 'general',
  likes INTEGER DEFAULT 0,
  replies INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,   -- ⚠️ 注意：前端使用 is_pinned，不是 pinned
  is_new BOOLEAN DEFAULT FALSE,       -- ⚠️ 注意：前端使用 is_new
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_posts_board ON community_posts(board);
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_posts_is_pinned ON community_posts(is_pinned);

-- 插入测试数据
INSERT INTO community_posts (
  id, 
  title, 
  content, 
  author, 
  avatar, 
  game, 
  board, 
  likes, 
  replies, 
  views, 
  is_pinned,
  is_new
) VALUES (
  'pinned-welcome',
  '【公告】欢迎来到 GameBox 社区！',
  '大家好！这里是 GameBox 社区的官方欢迎帖。\n\n在这里你可以：\n\n✨ 分享游戏心得和攻略\n💬 讨论最新游戏资讯\n🎮 结识志同道合的朋友\n📊 查看游戏排行榜和折扣信息\n\n请遵守社区规则，友善交流！',
  '管理员',
  '👨‍💼',
  '公告',
  'announcement',
  42,
  3,
  888,
  TRUE,
  FALSE
);

SELECT '✅ 步骤 1 完成: community_posts 表已重建' as "状态", 
       COUNT(*) as "帖子数" 
FROM community_posts;


-- 步骤 2: 重建 community_comments 表
-- ============================================================

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
INSERT INTO community_comments (id, post_id, author, content) VALUES
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！社区功能看起来很棒！'),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢管理员的欢迎贴，期待更多精彩内容 🎮'),
  ('comment-test-3', 'pinned-welcome', '游戏爱好者', '终于有专业的游戏社区了，必须支持！👍');

SELECT '✅ 步骤 2 完成: community_comments 表已重建' as "状态", 
       COUNT(*) as "评论数" 
FROM community_comments;


-- 步骤 3: 重建 user_profiles 表
-- ============================================================

DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  bio TEXT,
  last_login_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at DESC);

-- 插入测试用户
INSERT INTO user_profiles (id, username, avatar, bio) VALUES
  ('user-admin-001', '管理员', '👨‍💼', 'GameBox 社区管理员'),
  ('user-test-001', '测试用户1', '🎮', '游戏爱好者'),
  ('user-test-002', '测试用户2', '🎯', '赛博朋克粉丝');

SELECT '✅ 步骤 3 完成: user_profiles 表已重建' as "状态", 
       COUNT(*) as "用户数" 
FROM user_profiles;


-- 步骤 4: 重建 online_users 表
-- ============================================================

DROP TABLE IF EXISTS online_users CASCADE;

CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE online_users DISABLE ROW LEVEL SECURITY;

CREATE INDEX idx_online_users_last_seen ON online_users(last_seen_at DESC);

-- 插入初始在线用户
INSERT INTO online_users (user_id, username) VALUES
  ('user-admin-001', '管理员'),
  ('user-test-001', '测试用户1');

SELECT '✅ 步骤 4 完成: online_users 表已重建' as "状态", 
       COUNT(*) as "在线用户数" 
FROM online_users;


-- ============================================================
-- 📊 最终数据验证
-- ============================================================

SELECT '=== 📊 数据库统计 ===' as "检查";

-- 统计所有表的记录数
SELECT 
  'community_posts' as "表名",
  COUNT(*) as "记录数"
FROM community_posts
UNION ALL
SELECT 
  'community_comments' as "表名",
  COUNT(*) as "记录数"
FROM community_comments
UNION ALL
SELECT 
  'user_profiles' as "表名",
  COUNT(*) as "记录数"
FROM user_profiles
UNION ALL
SELECT 
  'online_users' as "表名",
  COUNT(*) as "记录数"
FROM online_users;

-- 显示帖子详情（验证字段名）
SELECT 
  id,
  title,
  author,
  game,
  board,
  is_pinned,    -- ⚠️ 确认使用 is_pinned
  is_new,       -- ⚠️ 确认使用 is_new
  likes,
  replies,
  views
FROM community_posts;

-- 显示评论
SELECT 
  id,
  post_id,
  author,
  LEFT(content, 50) as "内容预览",
  created_at
FROM community_comments
ORDER BY created_at DESC;

-- ============================================================
-- ✅ 完成提示
-- ============================================================

SELECT 
  '🎉 数据库修复完成！' as "状态",
  '所有字段名已匹配前端代码' as "备注",
  NOW() as "完成时间";

-- ============================================================
-- 📋 期望结果：
-- ============================================================
-- 1. community_posts: 1 条记录（欢迎帖，is_pinned=TRUE）
-- 2. community_comments: 3 条记录
-- 3. user_profiles: 3 条记录
-- 4. online_users: 2 条记录
-- ============================================================
