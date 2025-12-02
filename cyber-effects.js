/**
 * 🌃 Cyberpunk Visual Effects System
 * Particle systems, loading animations, and interactive effects
 */

// ========== Configuration ==========
const EFFECTS_CONFIG = {
  matrixRain: {
    enabled: true,
    columns: 15,
    speed: [8, 15], // seconds [min, max]
    characters: '01アイウエオカキクセタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
  },
  particles: {
    enabled: true,
    count: 30,
    speed: [15, 25], // seconds [min, max]
    colors: ['yellow', 'pink', 'cyan'],
  },
  soundEffects: {
    enabled: false, // Set to true to enable visual sound indicators
    clickRipple: true,
  }
};

// ========== Matrix Rain Effect ==========
function initMatrixRain() {
  if (!EFFECTS_CONFIG.matrixRain.enabled) return;
  
  const container = document.createElement('div');
  container.className = 'matrix-rain';
  document.body.appendChild(container);
  
  const { columns, speed, characters } = EFFECTS_CONFIG.matrixRain;
  const charArray = characters.split('');
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    
    // Random position
    column.style.left = `${(i / columns) * 100 + Math.random() * (100 / columns)}%`;
    
    // Random delay
    column.style.animationDelay = `${Math.random() * 3}s`;
    
    // Random duration
    const duration = speed[0] + Math.random() * (speed[1] - speed[0]);
    column.style.animationDuration = `${duration}s`;
    
    // Generate random characters
    const length = 10 + Math.floor(Math.random() * 15);
    let text = '';
    for (let j = 0; j < length; j++) {
      text += charArray[Math.floor(Math.random() * charArray.length)] + '<br>';
    }
    column.innerHTML = text;
    
    container.appendChild(column);
  }
}

// ========== Floating Particles ==========
function initFloatingParticles() {
  if (!EFFECTS_CONFIG.particles.enabled) return;
  
  const container = document.createElement('div');
  container.className = 'cyber-particles';
  document.body.appendChild(container);
  
  const { count, speed, colors } = EFFECTS_CONFIG.particles;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = `particle ${colors[Math.floor(Math.random() * colors.length)]}`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random delay
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    // Random duration
    const duration = speed[0] + Math.random() * (speed[1] - speed[0]);
    particle.style.animationDuration = `${duration}s`;
    
    // Random horizontal drift
    const drift = (Math.random() - 0.5) * 100;
    particle.style.setProperty('--drift-x', `${drift}px`);
    
    // Random size
    const size = 2 + Math.random() * 3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    container.appendChild(particle);
  }
}

// ========== Loading Spinner ==========
function createLoadingSpinner() {
  const loading = document.createElement('div');
  loading.className = 'cyber-loading';
  loading.id = 'cyber-loading';
  loading.innerHTML = `
    <div class="cyber-spinner"></div>
    <div class="cyber-loading-text">LOADING</div>
  `;
  document.body.appendChild(loading);
  return loading;
}

function showLoading() {
  const loading = document.getElementById('cyber-loading') || createLoadingSpinner();
  loading.classList.add('active');
}

function hideLoading() {
  const loading = document.getElementById('cyber-loading');
  if (loading) {
    loading.classList.remove('active');
  }
}

// ========== Click Ripple Effect ==========
function createClickRipple(x, y) {
  if (!EFFECTS_CONFIG.soundEffects.clickRipple) return;
  
  const ripple = document.createElement('div');
  ripple.className = 'sound-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.transform = 'translate(-50%, -50%)';
  
  document.body.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// ========== Sound Effect Visualization ==========
function playSoundEffect(type = 'click') {
  if (!EFFECTS_CONFIG.soundEffects.enabled) return;
  
  // Visual feedback only (no actual sound)
  // You can integrate Web Audio API here if needed
  
  const colors = {
    click: 'var(--cyber-cyan)',
    hover: 'var(--cyber-yellow)',
    success: 'var(--cyber-cyan)',
    error: 'var(--cyber-pink)',
  };
  
  // Create visual pulse
  const pulse = document.createElement('div');
  pulse.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    background: ${colors[type] || colors.click};
    border-radius: 50%;
    box-shadow: 0 0 15px ${colors[type] || colors.click};
    animation: sound-ripple-expand 0.4s ease-out forwards;
    pointer-events: none;
    z-index: 9999;
  `;
  
  document.body.appendChild(pulse);
  
  setTimeout(() => {
    pulse.remove();
  }, 400);
}

// ========== Enhanced Hover Effects ==========
function enhanceInteractiveElements() {
  // Add ripple effect to all clickable elements
  const clickables = document.querySelectorAll('button, a, .nav-link, .ranking-item, .category-chip, .game-card');
  
  clickables.forEach(element => {
    element.addEventListener('click', (e) => {
      createClickRipple(e.clientX, e.clientY);
      playSoundEffect('click');
    });
    
    // Optional: hover sound effect
    if (EFFECTS_CONFIG.soundEffects.enabled) {
      element.addEventListener('mouseenter', () => {
        playSoundEffect('hover');
      });
    }
  });
}

// ========== Page Load Animation ==========
function animatePageLoad() {
  showLoading();
  
  // Hide loading after page is ready
  window.addEventListener('load', () => {
    setTimeout(() => {
      hideLoading();
    }, 800);
  });
}

// ========== Glitch Text Effect ==========
function applyGlitchEffect(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    const text = element.textContent;
    element.setAttribute('data-text', text);
    element.classList.add('glitch');
  });
}

// ========== Random Glitch Trigger ==========
function triggerRandomGlitch() {
  const glitchables = document.querySelectorAll('.page-title, .logo-mark, .cyber-title');
  
  if (glitchables.length === 0) return;
  
  const random = glitchables[Math.floor(Math.random() * glitchables.length)];
  random.style.animation = 'none';
  
  setTimeout(() => {
    random.style.animation = '';
  }, 10);
  
  // Random interval between 8-15 seconds
  const nextGlitch = 8000 + Math.random() * 7000;
  setTimeout(triggerRandomGlitch, nextGlitch);
}

// ========== Performance Monitor ==========
function initPerformanceMonitor() {
  // Reduce particles on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    EFFECTS_CONFIG.particles.count = Math.floor(EFFECTS_CONFIG.particles.count * 0.6);
    EFFECTS_CONFIG.matrixRain.columns = Math.floor(EFFECTS_CONFIG.matrixRain.columns * 0.7);
  }
  
  // Disable effects if battery is low (if supported)
  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      if (battery.level < 0.2 && !battery.charging) {
        EFFECTS_CONFIG.particles.enabled = false;
        EFFECTS_CONFIG.matrixRain.enabled = false;
      }
    });
  }
}

// ========== Scroll Progress Indicator ==========
function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
  });
}

// ========== Smooth Scroll Enhancement ==========
function enhanceSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========== Initialize Everything ==========
function initCyberEffects() {
  console.log('🌃 Initializing Cyberpunk Effects System...');
  
  // Performance check
  initPerformanceMonitor();
  
  // Visual effects
  initMatrixRain();
  initFloatingParticles();
  createLoadingSpinner();
  initScrollProgress();
  
  // Interactive effects
  enhanceInteractiveElements();
  enhanceSmoothScroll();
  
  // Page load animation
  if (document.readyState === 'loading') {
    animatePageLoad();
  }
  
  // Apply glitch to titles (optional)
  // applyGlitchEffect('.page-title');
  
  // Start random glitch effects
  // setTimeout(triggerRandomGlitch, 10000);
  
  console.log('✅ Cyberpunk Effects System Ready!');
  console.log('💫 Matrix Rain: ' + (EFFECTS_CONFIG.matrixRain.enabled ? 'ON' : 'OFF'));
  console.log('⚡ Particles: ' + (EFFECTS_CONFIG.particles.enabled ? 'ON' : 'OFF'));
  console.log('🎵 Sound Effects: ' + (EFFECTS_CONFIG.soundEffects.enabled ? 'ON' : 'OFF'));
}

// ========== Auto-initialize on DOM ready ==========
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCyberEffects);
} else {
  initCyberEffects();
}

// ========== Export for manual control ==========
window.CyberEffects = {
  showLoading,
  hideLoading,
  playSoundEffect,
  createClickRipple,
  applyGlitchEffect,
  config: EFFECTS_CONFIG,
};
