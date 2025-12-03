/**
 * 发帖模态框组件
 * 提供完整的发帖功能界面
 */

(function() {
  // 创建模态框HTML
  const modalHTML = `
    <div id="createPostModal" class="create-post-modal" style="display: none;">
      <div class="modal-overlay" onclick="closeCreatePostModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>✏️ 发布新帖</h3>
          <button class="modal-close" onclick="closeCreatePostModal()">✕</button>
        </div>
        
        <div class="modal-body">
          <form id="createPostForm">
            <div class="form-group">
              <label for="postTitle">帖子标题 *</label>
              <input 
                type="text" 
                id="postTitle" 
                name="title" 
                placeholder="请输入帖子标题（10-100字符）" 
                maxlength="100"
                required
              />
              <span class="char-count">0/100</span>
            </div>
            
            <div class="form-group">
              <label for="postGame">相关游戏 *</label>
              <input 
                type="text" 
                id="postGame" 
                name="game" 
                placeholder="例如：艾尔登法环、赛博朋克2077"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="postBoard">板块选择 *</label>
              <select id="postBoard" name="board" required>
                <option value="general">💬 综合讨论</option>
                <option value="guide">📚 攻略心得</option>
                <option value="shot">📷 游戏截图</option>
                <option value="trade">🔄 交易求助</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="postContent">帖子内容 *</label>
              <textarea 
                id="postContent" 
                name="content" 
                rows="10"
                placeholder="分享你的游戏心得、攻略、截图或问题...&#10;&#10;支持简单的HTML标签：&#10;- &lt;h4&gt;标题&lt;/h4&gt;&#10;- &lt;p&gt;段落&lt;/p&gt;&#10;- &lt;strong&gt;加粗&lt;/strong&gt;&#10;- &lt;ul&gt;&lt;li&gt;列表&lt;/li&gt;&lt;/ul&gt;"
                required
              ></textarea>
              <span class="char-count">0/5000</span>
            </div>
            
            <div class="form-group">
              <label>
                <input type="checkbox" id="agreeRules" required />
                我已阅读并同意<a href="#" onclick="alert('请遵守社区规则：友善交流、禁止广告、标注剧透'); return false;">社区规则</a>
              </label>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" onclick="closeCreatePostModal()">
                取消
              </button>
              <button type="submit" class="btn btn-primary">
                🚀 发布帖子
              </button>
            </div>
          </form>
          
          <div id="postResult" class="post-result" style="display: none;"></div>
        </div>
      </div>
    </div>
  `;

  // CSS样式
  const modalCSS = `
    <style>
      .create-post-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }
      
      .modal-content {
        position: relative;
        width: 90%;
        max-width: 700px;
        max-height: 90vh;
        background: linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 0, 30, 0.95) 100%);
        border: 2px solid rgba(255, 211, 0, 0.5);
        border-radius: 12px;
        box-shadow: 0 0 50px rgba(255, 211, 0, 0.3);
        overflow: hidden;
        animation: modalSlideIn 0.3s ease;
      }
      
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 2px solid rgba(255, 211, 0, 0.3);
        background: rgba(255, 211, 0, 0.05);
      }
      
      .modal-header h3 {
        margin: 0;
        font-family: 'Orbitron', sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: var(--cyber-yellow);
      }
      
      .modal-close {
        width: 32px;
        height: 32px;
        border: none;
        background: rgba(255, 0, 0, 0.2);
        color: #fff;
        font-size: 20px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .modal-close:hover {
        background: rgba(255, 0, 0, 0.4);
        transform: rotate(90deg);
      }
      
      .modal-body {
        padding: 24px;
        max-height: calc(90vh - 80px);
        overflow-y: auto;
      }
      
      .form-group {
        margin-bottom: 20px;
        position: relative;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-size: 13px;
        font-weight: 600;
        color: var(--cyber-cyan);
      }
      
      .form-group input[type="text"],
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 12px;
        background: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(85, 234, 212, 0.3);
        border-radius: 6px;
        color: var(--text-main);
        font-size: 14px;
        font-family: inherit;
        transition: all 0.3s ease;
      }
      
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        outline: none;
        border-color: var(--cyber-cyan);
        box-shadow: 0 0 15px rgba(85, 234, 212, 0.3);
      }
      
      .form-group textarea {
        resize: vertical;
        min-height: 200px;
        line-height: 1.6;
      }
      
      .char-count {
        position: absolute;
        right: 12px;
        bottom: 8px;
        font-size: 11px;
        color: var(--text-muted);
      }
      
      .form-group input[type="checkbox"] {
        margin-right: 8px;
      }
      
      .form-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid rgba(85, 234, 212, 0.2);
      }
      
      .btn {
        padding: 10px 24px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .btn-secondary {
        background: rgba(128, 128, 128, 0.3);
        color: var(--text-main);
        border: 1px solid rgba(128, 128, 128, 0.5);
      }
      
      .btn-secondary:hover {
        background: rgba(128, 128, 128, 0.5);
      }
      
      .btn-primary {
        background: linear-gradient(135deg, rgba(85, 234, 212, 0.3), rgba(0, 255, 159, 0.3));
        color: var(--cyber-cyan);
        border: 2px solid var(--cyber-cyan);
      }
      
      .btn-primary:hover {
        background: linear-gradient(135deg, rgba(85, 234, 212, 0.5), rgba(0, 255, 159, 0.5));
        box-shadow: 0 0 20px rgba(85, 234, 212, 0.4);
        transform: translateY(-2px);
      }
      
      .post-result {
        padding: 16px;
        border-radius: 6px;
        margin-top: 20px;
        text-align: center;
        font-size: 14px;
      }
      
      .post-result.success {
        background: rgba(0, 255, 159, 0.1);
        border: 1px solid rgba(0, 255, 159, 0.3);
        color: var(--cyber-cyan);
      }
      
      .post-result.error {
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        color: #ff5555;
      }
      
      @media (max-width: 768px) {
        .modal-content {
          width: 95%;
          max-height: 95vh;
        }
        
        .modal-body {
          padding: 16px;
        }
      }
    </style>
  `;

  // 插入HTML和CSS
  document.addEventListener('DOMContentLoaded', function() {
    // 插入CSS
    document.head.insertAdjacentHTML('beforeend', modalCSS);
    
    // 插入HTML
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 绑定表单事件
    initFormEvents();
  });

  /**
   * 初始化表单事件
   */
  function initFormEvents() {
    const form = document.getElementById('createPostForm');
    const titleInput = document.getElementById('postTitle');
    const contentInput = document.getElementById('postContent');
    
    // 标题字符计数
    if (titleInput) {
      titleInput.addEventListener('input', function() {
        const count = this.value.length;
        const counter = this.parentElement.querySelector('.char-count');
        if (counter) counter.textContent = `${count}/100`;
      });
    }
    
    // 内容字符计数
    if (contentInput) {
      contentInput.addEventListener('input', function() {
        const count = this.value.length;
        const counter = this.parentElement.querySelector('.char-count');
        if (counter) counter.textContent = `${count}/5000`;
      });
    }
    
    // 表单提交
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
  }

  /**
   * 处理表单提交
   */
  async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const resultDiv = document.getElementById('postResult');
    
    // 禁用提交按钮
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 发布中...';
    
    try {
      // 获取表单数据
      const formData = new FormData(form);
      const title = formData.get('title').trim();
      const game = formData.get('game').trim();
      const board = formData.get('board');
      const content = formData.get('content').trim();
      
      // 验证
      if (!title || title.length < 10) {
        throw new Error('标题至少需要10个字符');
      }
      
      if (!game) {
        throw new Error('请填写相关游戏名称');
      }
      
      if (!content || content.length < 20) {
        throw new Error('内容至少需要20个字符');
      }
      
      // 获取当前用户信息
      const currentUser = getCurrentUser();
      const author = currentUser ? (currentUser.nickname || currentUser.username || '游客') : '游客';
      
      // 发布帖子
      const result = window.communityDataService.createPost({
        title,
        game,
        board,
        content: formatContent(content),
        author,
        avatar: getUserAvatar(author)
      });
      
      if (result.success) {
        // 显示成功消息
        resultDiv.className = 'post-result success';
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
          ✅ 帖子发布成功！<br>
          <a href="post-detail.html?id=${result.post.id}" style="color: var(--cyber-cyan); text-decoration: underline;">
            点击查看帖子详情
          </a>
        `;
        
        // 重置表单
        form.reset();
        
        // 3秒后关闭模态框并刷新页面
        setTimeout(() => {
          closeCreatePostModal();
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(result.error || '发布失败');
      }
    } catch (error) {
      // 显示错误消息
      resultDiv.className = 'post-result error';
      resultDiv.style.display = 'block';
      resultDiv.textContent = `❌ ${error.message}`;
    } finally {
      // 恢复提交按钮
      submitBtn.disabled = false;
      submitBtn.textContent = '🚀 发布帖子';
    }
  }

  /**
   * 格式化内容
   */
  function formatContent(content) {
    // 将换行转换为<p>标签
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    return paragraphs.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  /**
   * 获取当前用户
   */
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem("currentUser");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { 
      return null; 
    }
  }

  /**
   * 获取用户头像
   */
  function getUserAvatar(author) {
    const avatars = {
      'GameBox官方': '🎮',
      '默认': '👤'
    };
    
    return avatars[author] || avatars['默认'];
  }

  /**
   * 打开模态框
   */
  window.openCreatePostModal = function() {
    const modal = document.getElementById('createPostModal');
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // 清空结果提示
      const resultDiv = document.getElementById('postResult');
      if (resultDiv) {
        resultDiv.style.display = 'none';
      }
    }
  };

  /**
   * 关闭模态框
   */
  window.closeCreatePostModal = function() {
    const modal = document.getElementById('createPostModal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  console.log('✅ 发帖模态框组件已加载');
})();
