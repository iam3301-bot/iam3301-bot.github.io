-- ========================================
-- 修复 community_posts 表结构
-- ========================================

-- 1. 检查现有表结构
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'community_posts'
ORDER BY ordinal_position;

-- 2. 添加缺失的列（如果不存在）
DO $$ 
BEGIN
  -- 添加 pinned 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'pinned'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN pinned BOOLEAN DEFAULT FALSE;
    RAISE NOTICE '✅ 已添加 pinned 列';
  ELSE
    RAISE NOTICE 'ℹ️ pinned 列已存在';
  END IF;

  -- 添加 game 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'game'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN game TEXT;
    RAISE NOTICE '✅ 已添加 game 列';
  ELSE
    RAISE NOTICE 'ℹ️ game 列已存在';
  END IF;

  -- 添加 board 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'board'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN board TEXT NOT NULL DEFAULT 'general';
    RAISE NOTICE '✅ 已添加 board 列';
  ELSE
    RAISE NOTICE 'ℹ️ board 列已存在';
  END IF;

  -- 添加 likes 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'likes'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN likes INTEGER DEFAULT 0;
    RAISE NOTICE '✅ 已添加 likes 列';
  ELSE
    RAISE NOTICE 'ℹ️ likes 列已存在';
  END IF;

  -- 添加 replies 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'replies'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN replies INTEGER DEFAULT 0;
    RAISE NOTICE '✅ 已添加 replies 列';
  ELSE
    RAISE NOTICE 'ℹ️ replies 列已存在';
  END IF;

  -- 添加 views 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'views'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN views INTEGER DEFAULT 0;
    RAISE NOTICE '✅ 已添加 views 列';
  ELSE
    RAISE NOTICE 'ℹ️ views 列已存在';
  END IF;

  -- 添加 updated_at 列
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_posts' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE community_posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE '✅ 已添加 updated_at 列';
  ELSE
    RAISE NOTICE 'ℹ️ updated_at 列已存在';
  END IF;
END $$;

-- 3. 更新现有帖子的默认值
UPDATE community_posts 
SET 
  pinned = COALESCE(pinned, FALSE),
  game = COALESCE(game, '未分类'),
  board = COALESCE(board, 'general'),
  likes = COALESCE(likes, 0),
  replies = COALESCE(replies, 0),
  views = COALESCE(views, 0),
  updated_at = COALESCE(updated_at, created_at)
WHERE 
  pinned IS NULL 
  OR game IS NULL 
  OR board IS NULL 
  OR likes IS NULL 
  OR replies IS NULL 
  OR views IS NULL 
  OR updated_at IS NULL;

-- 4. 将 pinned-welcome 设置为置顶
UPDATE community_posts 
SET pinned = TRUE 
WHERE id = 'pinned-welcome';

-- 5. 验证表结构
SELECT 
  '✅ community_posts 表结构' as "状态",
  column_name as "列名",
  data_type as "数据类型",
  is_nullable as "可空",
  column_default as "默认值"
FROM information_schema.columns
WHERE table_name = 'community_posts'
ORDER BY ordinal_position;

-- 6. 显示帖子数据
SELECT 
  id as "ID",
  title as "标题",
  author as "作者",
  game as "游戏",
  board as "板块",
  pinned as "置顶",
  likes as "点赞",
  replies as "回复",
  views as "浏览",
  created_at as "创建时间"
FROM community_posts
ORDER BY pinned DESC, created_at DESC;

-- ========================================
-- ✅ 修复完成！
-- ========================================

SELECT '🎉 community_posts 表结构已修复！' as "状态";
