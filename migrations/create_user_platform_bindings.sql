-- 创建用户平台绑定表
-- 用于存储用户与各个游戏平台（Steam、PSN、Xbox等）的绑定信息

CREATE TABLE IF NOT EXISTS user_platform_bindings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 平台名称：steam, psn, xbox, epic, etc.
  platform_user_id VARCHAR(255) NOT NULL, -- 平台用户ID
  platform_username VARCHAR(255), -- 平台用户名
  platform_avatar TEXT, -- 平台头像URL
  platform_profile_url TEXT, -- 平台个人资料URL
  platform_data JSONB, -- 平台特定数据（游戏库、成就等）
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 确保每个用户每个平台只能有一个绑定
  UNIQUE(user_id, platform)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_user_id ON user_platform_bindings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_platform ON user_platform_bindings(platform);
CREATE INDEX IF NOT EXISTS idx_user_platform_bindings_user_platform ON user_platform_bindings(user_id, platform);

-- 添加RLS (Row Level Security) 策略
ALTER TABLE user_platform_bindings ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的绑定信息
CREATE POLICY "Users can view own bindings"
  ON user_platform_bindings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bindings"
  ON user_platform_bindings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bindings"
  ON user_platform_bindings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bindings"
  ON user_platform_bindings
  FOR DELETE
  USING (auth.uid() = user_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_platform_bindings_updated_at
  BEFORE UPDATE ON user_platform_bindings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 添加注释
COMMENT ON TABLE user_platform_bindings IS '用户游戏平台绑定表，存储用户与Steam、PSN、Xbox等平台的绑定信息';
COMMENT ON COLUMN user_platform_bindings.platform IS '平台名称：steam, psn, xbox, epic, nintendo, etc.';
COMMENT ON COLUMN user_platform_bindings.platform_data IS '平台特定数据，包括游戏库、总游戏时长、成就数等';
