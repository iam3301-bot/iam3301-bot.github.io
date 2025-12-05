-- ========================================
-- 重新创建评论表（安全版本）
-- ========================================

-- 步骤 1: 删除旧表（如果存在）
DROP TABLE IF EXISTS community_comments CASCADE;

-- 步骤 2: 创建评论表
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY DEFAULT ('comment-' || extract(epoch from now())::text || '-' || substr(md5(random()::text), 1, 8)),
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 步骤 3: 禁用 RLS（行级安全）
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

-- 步骤 4: 创建索引（提高查询性能）
CREATE INDEX idx_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_comments_created_at ON community_comments(created_at DESC);

-- 步骤 5: 插入测试评论
INSERT INTO community_comments (id, post_id, author, content, created_at) VALUES
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！', NOW()),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢分享，很有用！', NOW()),
  ('comment-test-3', 'pinned-welcome', '游戏爱好者', '期待更多精彩内容！', NOW());

-- 步骤 6: 验证表创建成功
SELECT 
  COUNT(*) as "总评论数",
  COUNT(DISTINCT post_id) as "涉及帖子数",
  MIN(created_at) as "最早评论时间",
  MAX(created_at) as "最新评论时间"
FROM community_comments;

-- 步骤 7: 显示所有评论
SELECT 
  id as "评论ID",
  post_id as "帖子ID",
  author as "作者",
  content as "内容",
  created_at as "发表时间"
FROM community_comments 
ORDER BY created_at DESC;

-- ✅ 执行完成！
