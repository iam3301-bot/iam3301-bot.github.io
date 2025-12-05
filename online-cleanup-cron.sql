-- =============================================
-- 在线用户自动清理 - Supabase Cron Job
-- =============================================
-- 这个脚本会自动清理超过10分钟未活跃的在线用户
-- 
-- 使用方法：
-- 1. 在 Supabase Dashboard 执行此脚本创建函数
-- 2. 可选：设置定时任务自动调用
-- =============================================

-- 创建清理函数（已在 supabase-init.sql 中创建，这里是独立版本）
CREATE OR REPLACE FUNCTION cleanup_expired_online_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_active < NOW() - INTERVAL '10 minutes';
  
  -- 记录清理日志
  RAISE NOTICE '已清理过期在线用户记录';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 方案1：使用 pg_cron 扩展（需要启用）
-- =============================================
-- 注意：Supabase 免费版可能不支持 pg_cron
-- 如果支持，取消下面的注释

/*
-- 启用 pg_cron 扩展
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 创建定时任务（每5分钟执行一次）
SELECT cron.schedule(
  'cleanup-online-users',
  '*/5 * * * *',  -- 每5分钟执行一次
  'SELECT cleanup_expired_online_users();'
);
*/

-- =============================================
-- 方案2：前端定时调用（推荐）
-- =============================================
-- 如果 pg_cron 不可用，在前端代码中定期调用：
-- 
-- JavaScript 示例：
-- setInterval(async () => {
--   await supabase.rpc('cleanup_expired_online_users');
-- }, 5 * 60 * 1000);  // 每5分钟执行一次

-- =============================================
-- 测试函数
-- =============================================
-- 手动执行清理：
-- SELECT cleanup_expired_online_users();

-- 查看当前在线用户：
-- SELECT * FROM online_users ORDER BY last_active DESC;

-- 查看最近10分钟内活跃的用户：
-- SELECT COUNT(*) as online_count 
-- FROM online_users 
-- WHERE last_active > NOW() - INTERVAL '10 minutes';
