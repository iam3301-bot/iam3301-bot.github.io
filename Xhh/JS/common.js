// common.js - 公共脚本：导航高亮、登录状态、顶部搜索

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

  // 如果当前本身是 search.html，尝试填充输入框
  try {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) input.value = q;
  } catch {}
}

function initCommon() {
  initNavActive();
  initAuthButton();
  initGlobalSearch();
}
