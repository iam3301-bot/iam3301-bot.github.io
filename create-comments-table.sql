-- 创建评论表
CREATE TABLE IF NOT EXISTS community_comments (
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

-- 插入测试评论
INSERT INTO community_comments (id, post_id, author, content, created_at) VALUES
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！', NOW()),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢分享，很有用！', NOW());

-- 验证
SELECT * FROM community_comments ORDER BY created_at DESC;
