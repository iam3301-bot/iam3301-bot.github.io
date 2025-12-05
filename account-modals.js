// =============================================
// 账号浮窗组件（切换账号 & 退出登录）
// =============================================

const AccountModals = {
  // 显示切换账号浮窗
  showSwitchAccountModal(currentUser) {
    const modalHtml = this.createSwitchAccountModal(currentUser);
    this.showModal(modalHtml, 'switch-account-modal');
  },

  // 显示退出登录浮窗
  showLogoutModal(currentUser) {
    const modalHtml = this.createLogoutModal(currentUser);
    this.showModal(modalHtml, 'logout-modal');
  },

  // 创建切换账号浮窗HTML
  createSwitchAccountModal(currentUser) {
    const recentAccounts = AccountHistory.getRecent(currentUser?.email);
    
    const accountsListHtml = recentAccounts.length > 0 
      ? recentAccounts.map(account => `
          <div class="account-item" data-email="${account.email}">
            <div class="account-avatar">
              ${account.avatar ? `<img src="${account.avatar}" alt="${account.username}">` : '👤'}
            </div>
            <div class="account-info">
              <div class="account-name">${account.username}</div>
              <div class="account-email">${account.email}</div>
              <div class="account-time">最后登录：${AccountHistory.formatLastLogin(account.lastLoginTime)}</div>
            </div>
            <button class="account-remove-btn" data-email="${account.email}" title="移除此账号">×</button>
          </div>
        `).join('')
      : '<div class="no-accounts">暂无其他账号</div>';

    return `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-container switch-account-container">
          <div class="modal-header">
            <div class="modal-icon">🔄</div>
            <div class="modal-title">切换账号</div>
            <button class="modal-close" onclick="AccountModals.closeModal()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="current-account-display">
              <div class="label">当前账号</div>
              <div class="value">
                <span class="icon">👤</span>
                ${currentUser?.username || currentUser?.email || '未知用户'}
              </div>
            </div>

            <div class="section-title">
              <span>最近登录的账号</span>
              ${recentAccounts.length > 0 ? `<button class="clear-history-btn" onclick="AccountModals.clearHistory()">清空历史</button>` : ''}
            </div>
            
            <div class="accounts-list" id="accountsList">
              ${accountsListHtml}
            </div>

            <div class="add-account-section">
              <button class="btn-add-account" onclick="AccountModals.addNewAccount()">
                ➕ 登录其他账号
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="AccountModals.closeModal()">取消</button>
          </div>
        </div>
      </div>
    `;
  },

  // 创建退出登录浮窗HTML
  createLogoutModal(currentUser) {
    return `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-container logout-container">
          <div class="modal-header">
            <div class="modal-icon logout-icon">🚪</div>
            <div class="modal-title">退出登录</div>
            <button class="modal-close" onclick="AccountModals.closeModal()">×</button>
          </div>
          
          <div class="modal-body">
            <div class="current-account-display">
              <div class="label">当前登录账号</div>
              <div class="value highlight">
                <span class="icon">👤</span>
                ${currentUser?.username || currentUser?.email || '未知用户'}
              </div>
            </div>

            <div class="warning-box">
              <div class="warning-icon">⚠️</div>
              <div class="warning-text">
                <strong>确定要退出登录吗？</strong>
                <ul>
                  <li>退出后需要重新登录才能访问个人中心</li>
                  <li>您的游戏数据和设置将安全保存</li>
                  <li>可以随时使用相同账号重新登录</li>
                </ul>
              </div>
            </div>

            <div class="logout-options">
              <label class="checkbox-label">
                <input type="checkbox" id="rememberAccount" checked>
                <span>记住此账号以便快速切换</span>
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="AccountModals.closeModal()">取消</button>
            <button class="btn btn-danger" onclick="AccountModals.confirmLogout()">
              🚪 确认退出
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 显示浮窗
  showModal(html, className) {
    // 移除已存在的浮窗
    this.closeModal();
    
    // 创建新浮窗
    const modalWrapper = document.createElement('div');
    modalWrapper.id = 'accountModalWrapper';
    modalWrapper.className = `account-modal-wrapper ${className}`;
    modalWrapper.innerHTML = html;
    
    document.body.appendChild(modalWrapper);
    
    // 添加样式
    this.injectStyles();
    
    // 动画显示
    requestAnimationFrame(() => {
      modalWrapper.classList.add('show');
    });

    // 绑定事件
    this.bindEvents();
  },

  // 关闭浮窗
  closeModal() {
    const wrapper = document.getElementById('accountModalWrapper');
    if (wrapper) {
      wrapper.classList.remove('show');
      setTimeout(() => {
        wrapper.remove();
      }, 300);
    }
  },

  // 绑定事件
  bindEvents() {
    // 点击遮罩关闭
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal();
        }
      });
    }

    // 账号列表点击事件
    const accountItems = document.querySelectorAll('.account-item');
    accountItems.forEach(item => {
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('account-remove-btn')) {
          const email = item.dataset.email;
          this.switchToAccount(email);
        }
      });
    });

    // 移除账号按钮
    const removeButtons = document.querySelectorAll('.account-remove-btn');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const email = btn.dataset.email;
        this.removeAccount(email);
      });
    });

    // ESC键关闭
    document.addEventListener('keydown', this.handleEscKey);
  },

  // ESC键处理
  handleEscKey(e) {
    if (e.key === 'Escape') {
      AccountModals.closeModal();
    }
  },

  // 切换到指定账号
  async switchToAccount(email) {
    try {
      // 先退出当前账号
      if (typeof GameBoxAuth !== 'undefined') {
        await GameBoxAuth.signOut();
      } else {
        localStorage.removeItem('currentUser');
      }
      
      // 跳转到登录页，并预填邮箱
      window.location.href = `login.html?email=${encodeURIComponent(email)}`;
    } catch (error) {
      console.error('切换账号失败:', error);
      alert('切换失败：' + error.message);
    }
  },

  // 移除账号历史
  removeAccount(email) {
    if (confirm(`确定要移除账号 ${email} 吗？`)) {
      AccountHistory.remove(email);
      
      // 刷新列表
      const currentUser = typeof GameBoxAuth !== 'undefined' 
        ? GameBoxAuth.getCurrentUser() 
        : JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.showSwitchAccountModal(currentUser);
    }
  },

  // 清空历史
  clearHistory() {
    if (confirm('确定要清空所有账号历史吗？')) {
      AccountHistory.clear();
      
      // 刷新列表
      const currentUser = typeof GameBoxAuth !== 'undefined' 
        ? GameBoxAuth.getCurrentUser() 
        : JSON.parse(localStorage.getItem('currentUser') || 'null');
      this.showSwitchAccountModal(currentUser);
    }
  },

  // 添加新账号
  addNewAccount() {
    this.closeModal();
    window.location.href = 'login.html';
  },

  // 确认退出
  async confirmLogout() {
    const rememberAccount = document.getElementById('rememberAccount')?.checked;
    
    try {
      const currentUser = typeof GameBoxAuth !== 'undefined' 
        ? GameBoxAuth.getCurrentUser() 
        : JSON.parse(localStorage.getItem('currentUser') || 'null');

      // 如果勾选记住账号，保存到历史
      if (rememberAccount && currentUser) {
        AccountHistory.add(currentUser);
      }

      // 退出登录
      if (typeof GameBoxAuth !== 'undefined') {
        await GameBoxAuth.signOut();
      } else {
        localStorage.removeItem('currentUser');
      }

      // 关闭浮窗并跳转
      this.closeModal();
      window.location.href = 'login.html';
    } catch (error) {
      console.error('退出登录失败:', error);
      alert('退出失败：' + error.message);
    }
  },

  // 注入样式
  injectStyles() {
    if (document.getElementById('accountModalsStyles')) return;

    const style = document.createElement('style');
    style.id = 'accountModalsStyles';
    style.textContent = `
      .account-modal-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .account-modal-wrapper.show {
        opacity: 1;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        backdrop-filter: blur(5px);
      }

      .modal-container {
        background: linear-gradient(135deg, rgba(17, 24, 39, 0.98), rgba(31, 41, 55, 0.95));
        border: 2px solid rgba(56, 189, 248, 0.4);
        border-radius: 20px;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: modalSlideIn 0.3s ease;
        position: relative;
      }

      .modal-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #00F0FF, #00ff88, #FF003C, #00F0FF);
        background-size: 200% 100%;
        animation: shimmer 3s linear infinite;
      }

      @keyframes modalSlideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      .modal-header {
        padding: 24px 28px 20px;
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(56, 189, 248, 0.1);
      }

      .modal-icon {
        font-size: 48px;
        margin-bottom: 12px;
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
      }

      .logout-icon {
        animation: swing 2s ease-in-out infinite;
      }

      @keyframes swing {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-10deg); }
        75% { transform: rotate(10deg); }
      }

      .modal-title {
        font-family: 'Orbitron', sans-serif;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(135deg, #00F0FF, #00ff88);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
        border: none;
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        font-size: 24px;
        line-height: 1;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      .modal-close:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: rotate(90deg);
      }

      .modal-body {
        padding: 24px 28px;
        overflow-y: auto;
        flex: 1;
      }

      .current-account-display {
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(0, 255, 136, 0.05));
        border: 1px solid rgba(56, 189, 248, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 24px;
      }

      .current-account-display .label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .current-account-display .value {
        font-size: 16px;
        font-weight: 600;
        color: #00F0FF;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .current-account-display .value.highlight {
        color: #FF003C;
      }

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .clear-history-btn {
        background: none;
        border: 1px solid rgba(239, 68, 68, 0.5);
        color: #ef4444;
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .clear-history-btn:hover {
        background: rgba(239, 68, 68, 0.1);
      }

      .accounts-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .account-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 10px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }

      .account-item:hover {
        background: rgba(56, 189, 248, 0.1);
        border-color: rgba(56, 189, 248, 0.4);
        transform: translateX(4px);
      }

      .account-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #00F0FF, #00ff88);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        flex-shrink: 0;
      }

      .account-avatar img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }

      .account-info {
        flex: 1;
        min-width: 0;
      }

      .account-name {
        font-size: 15px;
        font-weight: 600;
        color: #fff;
        margin-bottom: 4px;
      }

      .account-email {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 2px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .account-time {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
      }

      .account-remove-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
        font-size: 20px;
        line-height: 1;
        cursor: pointer;
        border-radius: 50%;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }

      .account-remove-btn:hover {
        background: rgba(239, 68, 68, 0.3);
        transform: scale(1.1);
      }

      .no-accounts {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 14px;
      }

      .add-account-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .btn-add-account {
        width: 100%;
        padding: 14px;
        background: rgba(56, 189, 248, 0.1);
        border: 2px dashed rgba(56, 189, 248, 0.3);
        color: #00F0FF;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.3s ease;
      }

      .btn-add-account:hover {
        background: rgba(56, 189, 248, 0.2);
        border-color: rgba(56, 189, 248, 0.5);
      }

      .warning-box {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        gap: 12px;
      }

      .warning-icon {
        font-size: 24px;
        flex-shrink: 0;
      }

      .warning-text {
        flex: 1;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
      }

      .warning-text strong {
        display: block;
        margin-bottom: 8px;
        color: #ffa500;
      }

      .warning-text ul {
        margin: 8px 0 0;
        padding-left: 20px;
      }

      .warning-text li {
        margin-bottom: 4px;
      }

      .logout-options {
        margin-top: 16px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        cursor: pointer;
      }

      .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .modal-footer {
        padding: 16px 28px 24px;
        border-top: 1px solid rgba(56, 189, 248, 0.1);
        display: flex;
        gap: 12px;
      }

      .btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 700;
        font-family: 'Orbitron', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-secondary {
        background: rgba(56, 189, 248, 0.1);
        color: #00F0FF;
        border: 1px solid rgba(56, 189, 248, 0.3);
      }

      .btn-secondary:hover {
        background: rgba(56, 189, 248, 0.2);
        transform: translateY(-2px);
      }

      .btn-danger {
        background: linear-gradient(135deg, #FF003C, #ff0066);
        color: white;
      }

      .btn-danger:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(255, 0, 60, 0.4);
      }

      @media (max-width: 600px) {
        .modal-container {
          max-width: 100%;
          border-radius: 16px;
        }

        .modal-header {
          padding: 20px 24px 16px;
        }

        .modal-icon {
          font-size: 40px;
        }

        .modal-title {
          font-size: 20px;
        }

        .modal-body {
          padding: 20px 24px;
        }

        .modal-footer {
          padding: 12px 24px 20px;
          flex-direction: column;
        }

        .btn {
          width: 100%;
        }
      }
    `;

    document.head.appendChild(style);
  }
};

// 导出到全局
if (typeof window !== 'undefined') {
  window.AccountModals = AccountModals;
}
