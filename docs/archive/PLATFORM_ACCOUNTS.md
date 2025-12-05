# 🎮 多平台游戏账号管理指南

GameBox 支持多个主流游戏平台的账号绑定和数据同步功能。

## 📋 支持的平台

| 平台 | 状态 | 绑定方式 | API 支持 |
|------|------|---------|---------|
| **Steam** | ✅ 完全支持 | Steam ID | 官方 API |
| **Epic Games** | ✅ 手动录入 | 手动输入 | 无公开 API |
| **Xbox Live** | ✅ API 集成 | OpenXBL API | 第三方 API |
| **PlayStation Network** | ✅ API 集成 | NPSSO Token | 第三方 API |

---

## 🔵 Steam 账号绑定

### 功能特性
- ✅ 通过 Steam ID 自动获取用户信息
- ✅ 同步游戏库数据
- ✅ 显示总游戏时长
- ✅ 获取玩家头像和昵称
- ✅ 实时同步最新数据

### 绑定步骤
1. 访问"账号管理"页面
2. 点击 Steam 平台的"添加账号"按钮
3. 输入您的 Steam ID（例如：76561198012345678）
4. 点击"绑定账号"
5. 系统自动获取您的 Steam 信息

### 获取 Steam ID
1. 登录 Steam 网页版
2. 进入个人资料页面
3. 查看 URL 中的数字 ID
4. 或使用工具：https://steamid.io/

### API 说明
- 使用 Steam Web API 获取数据
- 无需 API Key（使用代理服务）
- 数据来源：官方 Steam Store API

---

## 🎯 Epic Games 账号绑定

### 功能特性
- ✅ 手动录入账号信息
- ✅ 记录游戏数量
- ✅ 本地存储管理
- ⚠️ Epic Games 暂无公开 API

### 绑定步骤
1. 访问"其他平台"页面
2. 点击 Epic Games 卡片
3. 点击"绑定 Epic 账号"
4. 手动输入以下信息：
   - Epic 用户名
   - 游戏数量
5. 点击"保存 Epic 账号信息"

### 获取账号信息
1. 登录 Epic Games Store
2. 访问游戏库：https://store.epicgames.com/library
3. 统计您拥有的游戏数量
4. 记录您的 Epic 用户名

### 为什么需要手动录入？
Epic Games 目前没有提供公开的 Web API，因此暂时只能手动录入基本信息。

---

## 🎮 Xbox Live 账号绑定

### 功能特性
- ✅ 通过 OpenXBL API 获取数据
- ✅ 显示 Gamertag（玩家标签）
- ✅ 显示 Gamerscore（玩家分数）
- ✅ 获取游戏库列表
- ✅ 显示成就统计

### 绑定步骤

#### 步骤 1: 获取 OpenXBL API Key
1. 访问 [OpenXBL 官网](https://xbl.io/)
2. 注册账号（免费）
3. 进入 Dashboard
4. 复制您的 API Key

#### 步骤 2: 配置 API Key
1. 访问"其他平台"页面
2. 点击 Xbox 卡片
3. 点击"配置 API 密钥"
4. 粘贴您的 OpenXBL API Key
5. 点击"保存 API 密钥"

#### 步骤 3: 绑定账号
1. API Key 配置成功后
2. 点击"绑定 Xbox 账号"
3. 输入您的 Xbox Gamertag
4. 系统自动获取您的 Xbox 数据

### OpenXBL API 限制
- **免费额度**: 每月 30,000 次请求
- **限流**: 每分钟 60 次请求
- **数据延迟**: 约 15 分钟更新一次

### 获取 Gamertag
1. 登录 Xbox App 或 Xbox.com
2. 查看您的个人资料
3. Gamertag 显示在您的头像旁边

---

## 🎯 PlayStation Network 账号绑定

### 功能特性
- ✅ 通过 NPSSO Token 认证
- ✅ 显示 PSN Online ID
- ✅ 显示奖杯等级
- ✅ 获取游戏库列表
- ✅ 统计总游戏数量

### 绑定步骤

#### 步骤 1: 获取 NPSSO Token
1. 登录 PlayStation 账号（浏览器）
2. 访问：https://ca.account.sony.com/api/v1/ssocookie
3. 复制页面显示的 `npsso` 值（一串长字符串）

#### 步骤 2: 配置 PSN API
1. 访问"其他平台"页面
2. 点击 PlayStation 卡片
3. 点击"配置 PSN API"
4. 输入以下信息：
   - **NPSSO Token**: 刚才复制的 token
   - **代理服务器地址**: 
     - 默认：`http://localhost:3001`
     - 或使用您自己部署的代理服务器
5. 点击"认证并保存"

#### 步骤 3: 自动绑定
- 认证成功后，系统自动获取您的 PSN 数据
- 显示您的 PSN Online ID
- 同步游戏库和奖杯信息

### 关于 NPSSO Token
- **有效期**: Token 有效期约为 2 个月
- **更新**: 过期后需要重新获取
- **安全性**: Token 仅存储在本地浏览器，不会上传到服务器

### 为什么需要代理服务器？
PlayStation Network API 不支持 CORS（跨域请求），需要通过代理服务器转发请求。

### 部署 PSN 代理服务器（可选）

如果您需要稳定的 PSN 数据同步，可以自行部署代理服务器：

```bash
# 创建代理服务器文件
cat > psn-proxy.js << 'EOF'
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/psn/auth', async (req, res) => {
  const { npsso } = req.body;
  try {
    const response = await axios.post(
      'https://ca.account.sony.com/api/authz/v3/oauth/token',
      { npsso, /* ... */ }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('PSN Proxy running on port 3001'));
EOF

# 安装依赖
npm install express cors axios

# 启动服务器
node psn-proxy.js
```

---

## 🔄 账号切换与退出

### 账号切换功能
- 访问"账号管理"页面
- 点击"切换到其他账号"按钮
- 输入新账号的邮箱和密码
- 系统自动切换并加载新账号的数据

### 退出登录功能
- 访问"账号管理"页面
- 点击"退出登录"按钮
- 确认退出操作
- 系统清除本地登录状态并返回登录页

---

## 💾 数据存储

### LocalStorage 存储
所有平台账号数据均存储在浏览器的 LocalStorage 中：

```javascript
// Steam 绑定数据
localStorage.getItem('steam_accounts')

// Epic Games 绑定数据
localStorage.getItem('epic_binding')

// Xbox Live 绑定数据
localStorage.getItem('xbox_binding')
localStorage.getItem('xbox_api_key')

// PlayStation Network 绑定数据
localStorage.getItem('psn_binding')
localStorage.getItem('psn_api_config')
```

### 数据安全
- ✅ 数据仅存储在本地浏览器
- ✅ 不会上传到任何服务器
- ✅ API Key 和 Token 加密存储
- ⚠️ 清除浏览器数据会导致绑定信息丢失

---

## 🔧 常见问题

### Q1: Steam 绑定失败，提示"无法获取用户信息"
**可能原因**:
- Steam ID 输入错误
- Steam 个人资料设置为私密
- Steam API 暂时不可用

**解决方案**:
1. 确认 Steam ID 正确
2. 进入 Steam 设置 → 隐私设置
3. 将"我的个人资料"设置为"公开"
4. 将"游戏详情"设置为"公开"

### Q2: Xbox 绑定失败，提示"API Key 无效"
**可能原因**:
- OpenXBL API Key 输入错误
- API Key 已过期或失效
- 免费额度已用完

**解决方案**:
1. 重新登录 OpenXBL 并复制新的 API Key
2. 检查 API 使用情况（Dashboard）
3. 如果免费额度用完，等待下个月重置

### Q3: PlayStation 绑定失败，提示"NPSSO Token 无效"
**可能原因**:
- NPSSO Token 已过期
- Token 复制不完整
- 代理服务器未运行

**解决方案**:
1. 重新获取 NPSSO Token
2. 确保完整复制整个 token 字符串
3. 检查代理服务器是否正常运行（`http://localhost:3001`）

### Q4: Epic Games 绑定后无法同步数据
**说明**:
Epic Games 暂无公开 API，绑定功能仅支持手动录入基本信息，无法自动同步游戏库数据。

### Q5: 绑定的账号在其他设备上看不到
**说明**:
账号绑定数据存储在浏览器的 LocalStorage 中，不会跨设备同步。如果需要在多个设备上使用，需要在每个设备上分别绑定。

---

## 📚 相关文档

- **Steam Web API**: https://developer.valvesoftware.com/wiki/Steam_Web_API
- **OpenXBL API**: https://xbl.io/
- **PSN API (非官方)**: https://github.com/tustin/psn-php
- **Epic Games Store**: https://store.epicgames.com/

---

## 🔗 快速导航

- [返回主文档](README.md)
- [Steam API 部署指南](DEPLOYMENT.md)
- [后端配置指南](BACKEND_SETUP.md)
- [OAuth 配置指南](OAUTH_SETUP_GUIDE.md)

---

**需要帮助？** 请在 GitHub 上提交 Issue 或查看相关文档。
