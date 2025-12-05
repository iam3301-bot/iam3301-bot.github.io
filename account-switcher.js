/**
 * GameBox 多账号管理系统
 * 支持保存、切换、删除多个登录账号
 */

const AccountSwitcher = {
  ACCOUNTS_KEY: 'gamebox_saved_accounts',
  CURRENT_ACCOUNT_KEY: 'gamebox_current_account_email',
  MAX_ACCOUNTS: 5, // 最多保存 5 个账号

  /**
   * 保存账号信息（登录成功后调用）
   * @param {Object} user - 用户信息
   * @param {Object} session - 会话信息
   */
  saveAccount(user, session) {
    try {
      const accounts = this.getAllAccounts();
      
      const accountData = {
        email: user.email,
        username: user.username || user.email.split('@')[0],
        avatar: user.avatar || '🎮',
        user_id: user.id,
        last_login: new Date().toISOString(),
        email_confirmed: user.email_confirmed || false
      };

      // 如果账号已存在，更新信息
      accounts[user.email] = accountData;

      // 限制最多保存的账号数量
      const accountList = Object.values(accounts);
      if (accountList.length > this.MAX_ACCOUNTS) {
        // 删除最旧的账号
        accountList.sort((a, b) => new Date(a.last_login) - new Date(b.last_login));
        const oldestEmail = accountList[0].email;
        delete accounts[oldestEmail];
        console.log(`[Account Switcher] 已删除最旧账号: ${oldestEmail}`);
      }

      localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(this.CURRENT_ACCOUNT_KEY, user.email);
      
      console.log(`[Account Switcher] 已保存账号: ${user.email}`);
    } catch (error) {
      console.error('[Account Switcher] 保存账号失败:', error);
    }
  },

  /**
   * 获取所有已保存的账号
   * @returns {Object} 账号列表对象
   */
  getAllAccounts() {
    try {
      const data = localStorage.getItem(this.ACCOUNTS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('[Account Switcher] 读取账号列表失败:', error);
      return {};
    }
  },

  /**
   * 获取账号列表（数组格式，按最近登录时间排序）
   * @returns {Array} 账号数组
   */
  getAccountList() {
    const accounts = this.getAllAccounts();
    const list = Object.values(accounts);
    list.sort((a, b) => new Date(b.last_login) - new Date(a.last_login));
    return list;
  },

  /**
   * 获取当前账号的邮箱
   * @returns {string|null} 当前账号邮箱
   */
  getCurrentAccountEmail() {
    return localStorage.getItem(this.CURRENT_ACCOUNT_KEY);
  },

  /**
   * 删除指定账号
   * @param {string} email - 账号邮箱
   */
  removeAccount(email) {
    try {
      const accounts = this.getAllAccounts();
      if (accounts[email]) {
        delete accounts[email];
        localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
        console.log(`[Account Switcher] 已删除账号: ${email}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[Account Switcher] 删除账号失败:', error);
      return false;
    }
  },

  /**
   * 切换到指定账号
   * @param {string} email - 目标账号邮箱
   * @returns {Promise<Object>} 切换结果
   */
  async switchToAccount(email) {
    try {
      const accounts = this.getAllAccounts();
      const account = accounts[email];

      if (!account) {
        throw new Error('账号不存在');
      }

      // 更新最后登录时间
      account.last_login = new Date().toISOString();
      accounts[email] = account;
      localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
      localStorage.setItem(this.CURRENT_ACCOUNT_KEY, email);

      console.log(`[Account Switcher] 已切换到账号: ${email}`);
      
      return {
        success: true,
        message: `已切换到账号：${account.username}`,
        account: account
      };
    } catch (error) {
      console.error('[Account Switcher] 切换账号失败:', error);
      return {
        success: false,
        message: error.message
      };
    }
  },

  /**
   * 清除所有已保存的账号
   */
  clearAllAccounts() {
    localStorage.removeItem(this.ACCOUNTS_KEY);
    localStorage.removeItem(this.CURRENT_ACCOUNT_KEY);
    console.log('[Account Switcher] 已清除所有账号');
  },

  /**
   * 显示账号切换弹窗
   * @param {Function} onSwitch - 切换账号回调函数
   * @param {Function} onAddNew - 添加新账号回调函数
   */
  showSwitcher(onSwitch, onAddNew) {
    const accounts = this.getAccountList();
    const currentEmail = this.getCurrentAccountEmail();

    // 创建弹窗 HTML
    const modalHTML = `
      <div id="accountSwitcherModal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
      ">
        <div style="
          background: linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(30, 10, 40, 0.95) 100%);
          border: 2px solid var(--cyber-cyan);
          border-radius: 12px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 0 40px rgba(0, 255, 255, 0.3);
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid var(--cyber-cyan);
          ">
            <h2 style="
              margin: 0;
              color: var(--cyber-cyan);
              font-size: 20px;
              font-family: 'Orbitron', sans-serif;
            ">🔄 切换账号</h2>
            <button id="closeSwitcherBtn" style="
              background: transparent;
              border: none;
              color: var(--text-main);
              font-size: 24px;
              cursor: pointer;
              padding: 0;
              width: 30px;
              height: 30px;
              line-height: 30px;
            ">×</button>
          </div>

          <div id="accountList" style="margin-bottom: 20px;">
            ${accounts.length === 0 ? `
              <div style="
                text-align: center;
                padding: 40px 20px;
                color: var(--text-muted);
              ">
                <div style="font-size: 48px; margin-bottom: 10px;">📭</div>
                <div>暂无已保存的账号</div>
              </div>
            ` : accounts.map(account => `
              <div class="account-item" data-email="${account.email}" style="
                background: ${account.email === currentEmail ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
                border: 2px solid ${account.email === currentEmail ? 'var(--cyber-cyan)' : 'rgba(255, 255, 255, 0.1)'};
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
              " onmouseover="this.style.borderColor='var(--cyber-cyan)'; this.style.background='rgba(0, 255, 255, 0.1)'"
                 onmouseout="this.style.borderColor='${account.email === currentEmail ? 'var(--cyber-cyan)' : 'rgba(255, 255, 255, 0.1)'}'; this.style.background='${account.email === currentEmail ? 'rgba(0, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}'">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <div style="
                    font-size: 36px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                  ">${account.avatar}</div>
                  <div style="flex: 1;">
                    <div style="
                      color: var(--text-main);
                      font-size: 16px;
                      font-weight: 600;
                      margin-bottom: 4px;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                    ">
                      ${account.username}
                      ${account.email === currentEmail ? '<span style="color: var(--cyber-cyan); font-size: 12px;">✓ 当前</span>' : ''}
                    </div>
                    <div style="color: var(--text-muted); font-size: 13px;">${account.email}</div>
                    <div style="color: var(--text-muted); font-size: 11px; margin-top: 4px;">
                      最近登录：${new Date(account.last_login).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                <button class="delete-account-btn" data-email="${account.email}" style="
                  background: rgba(255, 0, 0, 0.2);
                  border: 1px solid rgba(255, 0, 0, 0.5);
                  color: #ff4444;
                  padding: 6px 12px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 12px;
                  transition: all 0.3s ease;
                " onmouseover="this.style.background='rgba(255, 0, 0, 0.3)'"
                   onmouseout="this.style.background='rgba(255, 0, 0, 0.2)'">删除</button>
              </div>
            `).join('')}
          </div>

          <button id="addNewAccountBtn" style="
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, var(--cyber-cyan) 0%, var(--accent) 100%);
            border: none;
            border-radius: 8px;
            color: #000;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Rajdhani', sans-serif;
          " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 20px rgba(0, 255, 255, 0.4)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            ➕ 登录其他账号
          </button>
        </div>
      </div>
    `;

    // 插入到页面
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement);

    // 绑定事件
    const modal = document.getElementById('accountSwitcherModal');

    // 关闭按钮
    document.getElementById('closeSwitcherBtn').addEventListener('click', () => {
      modal.remove();
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // 切换账号
    document.querySelectorAll('.account-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-account-btn')) return;
        const email = item.dataset.email;
        modal.remove();
        if (onSwitch) onSwitch(email);
      });
    });

    // 删除账号
    document.querySelectorAll('.delete-account-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = btn.dataset.email;
        if (confirm(`确定要删除账号 ${email} 吗？\n\n删除后需要重新登录该账号。`)) {
          this.removeAccount(email);
          modal.remove();
          this.showSwitcher(onSwitch, onAddNew);
        }
      });
    });

    // 添加新账号
    document.getElementById('addNewAccountBtn').addEventListener('click', () => {
      modal.remove();
      if (onAddNew) onAddNew();
    });
  }
};

// 导出到全局
window.AccountSwitcher = AccountSwitcher;
