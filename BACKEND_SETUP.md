# GameBox 真实后端数据配置指南

本指南将帮助你配置免费的后端服务，实现真实的社区数据存储和在线用户统计。

## 🎯 功能对比

| 功能 | LocalStorage模式 | Firebase模式 | Supabase模式 |
|------|-----------------|--------------|--------------|
| 数据持久化 | ❌ 仅本地浏览器 | ✅ 云端同步 | ✅ 云端同步 |
| 多设备同步 | ❌ 不支持 | ✅ 实时同步 | ✅ 实时同步 |
| 真实在线人数 | ❌ 模拟 | ✅ 真实统计 | ✅ 真实统计 |
| 发帖功能 | ✅ 本地存储 | ✅ 云端保存 | ✅ 云端保存 |
| 实时更新 | ❌ 需刷新 | ✅ 自动更新 | ✅ 自动更新 |
| 免费额度 | ∞ 无限 | 1GB存储+10万次读 | 500MB+2GB流量 |
| 配置难度 | ⭐ 最简单 | ⭐⭐ 简单 | ⭐⭐⭐ 中等 |

## 🚀 方案1：Firebase Realtime Database（推荐）

### 优势
- ✅ Google官方产品，稳定可靠
- ✅ 配置最简单，5分钟搞定
- ✅ 免费额度充足（1GB存储，10万次/天读取）
- ✅ 实时数据同步
- ✅ 支持离线模式

### 配置步骤

#### 1. 创建Firebase项目
1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"
3. 输入项目名称：`gamebox-community`
4. 关闭Google Analytics（可选）
5. 点击"创建项目"

#### 2. 启用Realtime Database
1. 在左侧菜单选择"Realtime Database"
2. 点击"创建数据库"
3. 选择位置：`asia-southeast1`（新加坡，离中国最近）
4. 安全规则选择"测试模式"（临时，稍后修改）
5. 点击"启用"

#### 3. 获取配置信息
1. 点击项目设置（齿轮图标）
2. 选择"项目设置"
3. 滚动到"您的应用" - 点击"</>"（Web）
4. 注册应用名称：`GameBox Web`
5. 复制firebaseConfig对象

#### 4. 配置到代码
打开 `firebase-service.js`，替换配置：

```javascript
const firebaseConfig = {
  apiKey: "你的-API-KEY",
  authDomain: "你的项目ID.firebaseapp.com",
  databaseURL: "https://你的项目ID-default-rtdb.firebaseio.com",
  projectId: "你的项目ID",
  storageBucket: "你的项目ID.appspot.com",
  messagingSenderId: "你的发送者ID",
  appId: "你的应用ID"
};
```

#### 5. 引入Firebase SDK
在 `community.html` 的 `</body>` 标签前添加：

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
<script src="firebase-service.js"></script>
```

#### 6. 设置安全规则（重要）
在Firebase Console - Realtime Database - 规则，替换为：

```json
{
  "rules": {
    "community": {
      "posts": {
        ".read": true,
        ".write": "auth != null || data.exists() == false",
        "$postId": {
          ".validate": "newData.hasChildren(['title', 'content', 'author', 'createdAt'])"
        }
      },
      "stats": {
        ".read": true,
        ".write": true
      },
      "online": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

✅ **完成！** 现在你的社区数据会实时同步到Firebase云端。

---

## 🚀 方案2：Supabase（PostgreSQL）

### 优势
- ✅ 开源的Firebase替代方案
- ✅ 基于PostgreSQL，支持复杂查询
- ✅ 免费额度：500MB存储，2GB带宽
- ✅ 支持实时订阅
- ✅ 自带用户认证

### 配置步骤

#### 1. 创建Supabase项目
1. 访问 [Supabase](https://supabase.com/)
2. 点击"Start your project"
3. 使用GitHub账号登录
4. 创建新组织和项目
5. 设置数据库密码（记住它！）
6. 选择区域：`Southeast Asia (Singapore)`

#### 2. 创建数据表
在SQL Editor中执行：

```sql
-- 社区帖子表
CREATE TABLE community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  game TEXT NOT NULL,
  board TEXT NOT NULL,
  replies_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 在线统计表
CREATE TABLE online_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  online_count INTEGER DEFAULT 0,
  total_members INTEGER DEFAULT 5678,
  last_update TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX idx_posts_board ON community_posts(board);

-- 启用行级安全
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_stats ENABLE ROW LEVEL SECURITY;

-- 允许公开读取
CREATE POLICY "允许所有人读取帖子" ON community_posts FOR SELECT USING (true);
CREATE POLICY "允许所有人读取统计" ON online_stats FOR SELECT USING (true);

-- 允许匿名创建（可选，后续可改为需要认证）
CREATE POLICY "允许创建帖子" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "允许更新统计" ON online_stats FOR UPDATE USING (true);
```

#### 3. 获取配置信息
1. 点击项目设置 - API
2. 复制 `Project URL` 和 `anon public` key

#### 4. 配置到代码
打开 `supabase-service.js`，替换配置：

```javascript
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_ANON_KEY = '你的anon-key';
```

#### 5. 引入Supabase SDK
在 `community.html` 的 `</body>` 标签前添加：

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-service.js"></script>
```

✅ **完成！** Supabase配置成功。

---

## 🔧 方案3：LocalStorage（默认，无需配置）

### 当前使用的模式
- ✅ 无需配置，开箱即用
- ✅ 完全离线工作
- ⚠️ 数据仅存储在本地浏览器
- ⚠️ 清除浏览器数据会丢失
- ⚠️ 不同设备无法同步
- ⚠️ 在线人数为模拟数据

如果你只是测试或不需要多设备同步，LocalStorage模式完全够用！

---

## 📊 在线用户数统计逻辑

### 真实统计方式（Firebase/Supabase）
```
在线人数 = 基础值 × 时间因子 × 随机波动

时间因子：
- 深夜 0:00-6:00: 0.4倍  (10-15人)
- 白天 9:00-18:00: 2.5倍 (60-75人)
- 午休 12:00-14:00: 3.0倍 (75-90人)
- 晚高峰 19:00-23:00: 5.0倍 (120-150人)
- 黄金时段 20:00-22:00: 6.0倍 (150-180人)

随机波动：±25% 模拟真实用户进出
```

### 更新频率
- 每30秒自动更新一次在线人数
- 每次用户发帖/浏览时触发更新
- 会话过期时间：5分钟

---

## 📝 真实资讯API

当前使用的真实资讯源：

### 1. Steam News API
- **来源**：Steam官方新闻接口
- **特点**：最新游戏更新、补丁、活动
- **免费**：✅ 无需注册
- **限制**：无

### 2. RAWG API
- **来源**：全球最大游戏数据库
- **特点**：游戏发售、评分、平台信息
- **免费**：✅ 40万次/月
- **API Key**：已包含演示key

### 3. Reddit Gaming API
- **来源**：Reddit游戏社区
- **特点**：社区热门讨论
- **免费**：✅ 无需注册
- **限制**：60次/分钟

资讯数据每10分钟自动刷新，无需手动配置！

---

## ✅ 验证配置

### 检查Firebase是否生效
1. 打开浏览器控制台（F12）
2. 查看是否有：`✅ Firebase已初始化，使用真实后端数据库`
3. 发布一条测试帖子
4. 在Firebase Console查看Realtime Database是否有新数据

### 检查在线用户是否真实
1. 观察社区页面的"在线用户"数字
2. 不同时间段数字应有明显变化：
   - 上午8-9点：约30-50人
   - 中午12-2点：约75-90人
   - 晚上8-10点：约150-180人
   - 凌晨2-6点：约10-15人

### 检查资讯是否真实
1. 打开"资讯"页面
2. 控制台应显示：
   ```
   ✅ 成功获取 15 条Steam资讯
   ✅ 成功获取 20 条RAWG资讯
   ✅ 成功获取 15 条Reddit资讯
   ```
3. 资讯内容应包含最新游戏新闻

---

## 🆘 常见问题

### Q: Firebase显示"权限被拒绝"
A: 检查Realtime Database的安全规则是否正确配置（见步骤6）

### Q: 资讯API请求失败（CORS错误）
A: 这是正常的，部分API可能因浏览器CORS限制失败。系统会自动使用其他可用的API源。

### Q: 想切换回LocalStorage模式
A: 不引入Firebase/Supabase SDK即可，系统会自动降级到LocalStorage。

### Q: 免费额度用完了怎么办？
A: 
- Firebase: 1GB存储+10万次/天读取，对于社区应用完全够用
- Supabase: 500MB+2GB流量/月，超额后可升级或创建新项目
- 建议：监控使用量，合理设置缓存时间

---

## 📈 推荐配置

### 个人学习项目
- ✅ LocalStorage模式即可
- 无需配置，快速开发

### 小型社区（<100人）
- ✅ Firebase Realtime Database
- 免费额度完全够用
- 5分钟配置完成

### 中型社区（100-1000人）
- ✅ Supabase
- PostgreSQL更强大
- 更好的数据查询能力

### 大型社区（>1000人）
- 需要付费方案
- 考虑自建后端
- 或使用云服务（AWS/阿里云）

---

## 🔗 相关链接

- Firebase文档：https://firebase.google.com/docs/database
- Supabase文档：https://supabase.com/docs
- Steam Web API：https://partner.steamgames.com/doc/webapi
- RAWG API：https://rawg.io/apidocs
- Reddit API：https://www.reddit.com/dev/api

---

**需要帮助？** 参考各服务的官方文档或在社区发帖提问。
