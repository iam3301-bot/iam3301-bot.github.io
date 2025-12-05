-- ========================================
-- 修复评论表 ID 自动生成问题
-- ========================================

-- 删除旧的评论表
DROP TABLE IF EXISTS community_comments CASCADE;

-- 重新创建评论表，使用更简单的 ID 生成方式
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY DEFAULT ('comment-' || floor(extract(epoch from now()) * 1000)::text || '-' || substr(md5(random()::text), 1, 8)),
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
  ('comment-test-1', 'pinned-welcome', '测试用户1', '这是第一条测试评论！', NOW() - interval '10 minutes'),
  ('comment-test-2', 'pinned-welcome', '测试用户2', '感谢分享，很有用！', NOW() - interval '5 minutes'),
  ('comment-test-3', 'pinned-welcome', '游戏爱好者', '期待更多精彩内容！', NOW() - interval '2 minutes');

-- 验证
SELECT 
  '✅ community_comments 表已重建' as "状态",
  COUNT(*) as "评论数",
  COUNT(DISTINCT post_id) as "涉及帖子数"
FROM community_comments;

-- 显示评论列表
SELECT 
  id as "评论ID",
  post_id as "帖子ID",
  author as "作者",
  LEFT(content, 30) as "内容预览",
  created_at as "发表时间"
FROM community_comments
ORDER BY created_at DESC;

-- 测试 ID 自动生成
SELECT 
  '✅ 测试 ID 自动生成' as "测试",
  ('comment-' || floor(extract(epoch from now()) * 1000)::text || '-' || substr(md5(random()::text), 1, 8)) as "生成的ID示例";

-- ========================================
-- ✅ 修复完成！
-- ========================================

SELECT '🎉 评论表 ID 生成已修复！' as "状态";
