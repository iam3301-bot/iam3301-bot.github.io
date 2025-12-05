-- 修复 online_users 表
-- 如果表存在则删除并重建
DROP TABLE IF EXISTS online_users CASCADE;

-- 重新创建 online_users 表
CREATE TABLE online_users (
  user_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_online_users_active ON online_users(last_active);

-- 启用 RLS
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;

-- 创建策略
DROP POLICY IF EXISTS "允许公开读取在线用户" ON online_users;
CREATE POLICY "允许公开读取在线用户" ON online_users FOR SELECT USING (true);

DROP POLICY IF EXISTS "允许更新在线状态" ON online_users;
CREATE POLICY "允许更新在线状态" ON online_users FOR ALL USING (true);

-- 测试插入
INSERT INTO online_users (user_id, username, last_active)
VALUES ('test-user', '测试用户', NOW())
ON CONFLICT (user_id) DO NOTHING;

-- 查询验证
SELECT * FROM online_users LIMIT 1;
