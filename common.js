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
      if (confirm("确定要退出登录吗？")) {
        localStorage.removeItem("currentUser");
        location.reload();
      }
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
