function getCurrentUser() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function initNavActive() {
  const current = document.body.getAttribute("data-current-page");
  if (!current) return;
  document.querySelectorAll(".nav-main .nav-link").forEach((link) => {
    if (link.dataset.page === current) {
      link.classList.add("is-active");
    }
  });
}

function initAuthButton() {
  const btn = document.querySelector(".header-user");
  if (!btn) return;

  function refresh() {
    const user = getCurrentUser();
    if (user) {
      btn.textContent = (user.nickname || user.username || "玩家") + " · 已登录";
    } else {
      btn.textContent = "未登录 · 游客";
    }
  }

  refresh();

  btn.addEventListener("click", () => {
    const user = getCurrentUser();
    if (user) {
      // 跳转到账号设置页面，不再使用confirm弹窗
      window.location.href = "account-settings.html";
    } else {
      window.location.href = "login.html";
    }
  });
}

function initGlobalSearch() {
  const wrap = document.querySelector(".header-search");
  if (!wrap) return;
  const input = wrap.querySelector("input");
  const icon = wrap.querySelector(".header-search-icon");
  if (!input) return;

  function goSearch() {
    const kw = input.value.trim();
    const url = "search.html" + (kw ? "?q=" + encodeURIComponent(kw) : "");
    window.location.href = url;
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      goSearch();
    }
  });

  if (icon) {
    icon.addEventListener("click", goSearch);
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) input.value = q;
  } catch {}

  // 添加智能搜索建议功能（支持中英文）
  initSearchSuggestions(input);
}

function initSearchSuggestions(input) {
  if (!input) return;
  
  let suggestBox = document.querySelector('.search-suggestions');
  if (!suggestBox) {
    suggestBox = document.createElement('div');
    suggestBox.className = 'search-suggestions';
    suggestBox.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(10, 10, 20, 0.98);
      border: 1px solid rgba(0, 255, 136, 0.3);
      border-top: none;
      border-radius: 0 0 8px 8px;
      max-height: 300px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
      box-shadow: 0 8px 16px rgba(0, 255, 136, 0.15);
    `;
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(suggestBox);
  }

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      suggestBox.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(() => {
      showSuggestions(query, suggestBox, input);
    }, 300);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      suggestBox.style.display = 'none';
    }, 200);
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) {
      showSuggestions(input.value.trim(), suggestBox, input);
    }
  });
}

function showSuggestions(query, suggestBox, input) {
  // 使用 window.megaGameDB 或 window.chineseGameNames 进行搜索
  if (!window.megaGameDB && !window.chineseGameNames) {
    return;
  }

  const results = [];
  const lowerQuery = query.toLowerCase();

  // 搜索游戏数据库
  if (window.megaGameDB && window.megaGameDB.length > 0) {
    const matches = window.megaGameDB.filter(game => {
      const gameName = (game.name || '').toLowerCase();
      const chineseName = window.chineseGameNames ? 
        window.chineseGameNames.getChineseName(game.name) : '';
      
      // 匹配英文名、中文名或拼音首字母
      return gameName.includes(lowerQuery) || 
             (chineseName && chineseName.includes(query)) ||
             (window.chineseGameNames && 
              window.chineseGameNames.searchGameName(query).length > 0);
    }).slice(0, 8);

    results.push(...matches);
  }

  if (results.length === 0) {
    suggestBox.innerHTML = `
      <div style="padding: 12px; color: rgba(255, 255, 255, 0.5); font-size: 12px; text-align: center;">
        没有找到相关游戏
      </div>
    `;
    suggestBox.style.display = 'block';
    return;
  }

  suggestBox.innerHTML = results.map(game => {
    const chineseName = window.chineseGameNames ? 
      window.chineseGameNames.getChineseName(game.name) : '';
    const displayName = chineseName ? 
      `${game.name} <span style="color: #00ff88;">(${chineseName})</span>` : 
      game.name;
    
    return `
      <div class="search-suggestion-item" 
           onclick="window.location.href='game-detail.html?id=${game.appid || game.id}&name=${encodeURIComponent(game.name)}'"
           style="padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
                  transition: all 0.2s; font-size: 13px; display: flex; align-items: center; gap: 10px;">
        <span style="color: #00ff88; font-size: 16px;">🎮</span>
        <span style="color: #fff;">${displayName}</span>
      </div>
    `;
  }).join('');

  // 添加悬停效果
  suggestBox.querySelectorAll('.search-suggestion-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.background = 'rgba(0, 255, 136, 0.1)';
      item.style.borderLeft = '3px solid #00ff88';
    });
    item.addEventListener('mouseleave', () => {
      item.style.background = 'transparent';
      item.style.borderLeft = 'none';
    });
  });

  suggestBox.style.display = 'block';
}

// HTML 转义函数，防止 XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 安全设置 HTML 内容
function safeSetHTML(element, html) {
  if (!element) return;
  // 创建临时元素解析HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  // 移除所有script标签
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  element.innerHTML = temp.innerHTML;
}

// 图片加载失败处理
function handleImageError(img, placeholderText = '🎮') {
  if (!img) return;
  
  img.onerror = function() {
    // 移除错误处理器，避免无限循环
    this.onerror = null;
    
    // 创建占位符
    const parent = this.parentElement;
    if (parent) {
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle at top, #38bdf8 0, transparent 55%),
                    radial-gradient(circle at bottom, #8b5cf6 0, transparent 55%),
                    #020617;
        font-size: 2em;
        opacity: 0.7;
      `;
      placeholder.textContent = placeholderText;
      this.style.display = 'none';
      parent.appendChild(placeholder);
    }
  };
}

// 批量初始化页面中的所有图片错误处理
function initImageErrorHandling() {
  const images = document.querySelectorAll('img');
  images.forEach(img => handleImageError(img));
}

function initCommon() {
  initNavActive();
  initAuthButton();
  initGlobalSearch();
  initImageErrorHandling();
}
