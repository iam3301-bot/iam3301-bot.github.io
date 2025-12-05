-- ============================================================
-- 🔧 强制重建 community_comments 表（修复 id 字段问题）
-- ============================================================

-- 1. 完全删除旧表（包括所有依赖）
DROP TABLE IF EXISTS community_comments CASCADE;

-- 2. 重新创建表（id 为 TEXT 类型，允许客户端指定）
CREATE TABLE community_comments (
  id TEXT PRIMARY KEY,                          -- ⚠️ TEXT 类型，客户端手动生成 ID
  post_id TEXT NOT NULL,                         -- 外键
  author TEXT NOT NULL,                          -- 评论作者（不能为空）
  content TEXT NOT NULL,                         -- 评论内容
  created_at TIMESTAMPTZ DEFAULT NOW()           -- 创建时间
);

-- 3. 添加外键约束（引用 community_posts 表）
ALTER TABLE community_comments
  ADD CONSTRAINT fk_comments_post
  FOREIGN KEY (post_id)
  REFERENCES community_posts(id)
  ON DELETE CASCADE;

-- 4. 禁用行级安全策略（RLS）
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;

-- 5. 创建索引（提升查询性能）
CREATE INDEX idx_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_comments_created_at ON community_comments(created_at DESC);

-- 6. 插入测试数据
INSERT INTO community_comments (id, post_id, author, content) VALUES
  ('comment-test-001', 'pinned-welcome', '测试用户1', '这是第一条测试评论！社区功能看起来很棒！'),
  ('comment-test-002', 'pinned-welcome', '测试用户2', '感谢管理员的欢迎贴，期待更多精彩内容 🎮'),
  ('comment-test-003', 'pinned-welcome', '游戏爱好者', '终于有专业的游戏社区了，必须支持！👍');

-- 7. 验证表结构
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'community_comments'
ORDER BY ordinal_position;

-- 8. 验证数据
SELECT 
  '✅ 评论表已重建' as "状态",
  COUNT(*) as "测试评论数"
FROM community_comments;

-- 9. 显示所有评论
SELECT 
  id,
  post_id,
  author,
  LEFT(content, 50) as "内容预览",
  created_at
FROM community_comments
ORDER BY created_at DESC;

-- ============================================================
-- ✅ 完成！
-- ============================================================
-- 期望结果：
-- 1. 表结构显示 id 为 TEXT 类型，无 DEFAULT 值
-- 2. 测试评论数：3
-- 3. 所有评论正常显示
-- ============================================================
