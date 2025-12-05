// =============================================
// 账号历史管理工具
// 用于记住和管理本地登录过的账号
// =============================================

const AccountHistory = {
  STORAGE_KEY: 'gamebox_account_history',
  MAX_ACCOUNTS: 5, // 最多记住5个账号

  // 获取所有历史账号
  getAll() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('获取账号历史失败:', error);
      return [];
    }
  },

  // 添加账号到历史记录
  add(account) {
    if (!account || !account.email) return;

    try {
      let accounts = this.getAll();
      
      // 移除重复的账号
      accounts = accounts.filter(a => a.email !== account.email);
      
      // 添加到开头
      accounts.unshift({
        email: account.email,
        username: account.username || account.email.split('@')[0],
        avatar: account.avatar || null,
        lastLoginTime: Date.now()
      });
      
      // 限制数量
      if (accounts.length > this.MAX_ACCOUNTS) {
        accounts = accounts.slice(0, this.MAX_ACCOUNTS);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('保存账号历史失败:', error);
    }
  },

  // 移除指定账号
  remove(email) {
    try {
      let accounts = this.getAll();
      accounts = accounts.filter(a => a.email !== email);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('移除账号历史失败:', error);
    }
  },

  // 清空所有历史
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('清空账号历史失败:', error);
    }
  },

  // 获取最近登录的账号（排除当前账号）
  getRecent(currentEmail) {
    const accounts = this.getAll();
    return accounts.filter(a => a.email !== currentEmail);
  },

  // 格式化最后登录时间
  formatLastLogin(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.AccountHistory = AccountHistory;
}
