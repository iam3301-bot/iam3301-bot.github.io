/**
 * 🌃 赛博朋克2077完整视觉特效系统
 * Cyberpunk 2077 Complete Visual Effects System
 * 
 * 特效包括：
 * - Digital Code Rain（数字代码雨）
 * - Neon Particles（霓虹粒子）
 * - Glitch Effect（故障效果）
 * - Scanlines（扫描线）
 * - Holographic UI（全息UI）
 * - City Lights（城市灯光）
 */

class Cyberpunk2077EffectsSystem {
    constructor(options = {}) {
        this.config = {
            digitalCodeRain: true,
            neonParticles: true,
            glitchEffect: true,
            scanlines: true,
            cityLights: true,
            holographicUI: true,
            performance: 'auto',
            codeRainDensity: options.codeRainDensity || 50,
            particleCount: options.particleCount || 80,
            glitchFrequency: options.glitchFrequency || 5000,
            ...options
        };
        
        this.containers = {};
        this.isActive = false;
        this.intervals = [];
        this.animationFrames = [];
        
        this.init();
    }
    
    init() {
        console.log('🌃 赛博朋克2077特效系统初始化...');
        
        // 性能检测
        if (this.config.performance === 'auto') {
            this.detectPerformance();
        }
        
        // 创建容器
        this.createContainers();
        
        // 初始化特效
        if (this.config.digitalCodeRain) this.initDigitalCodeRain();
        if (this.config.neonParticles) this.initNeonParticles();
        if (this.config.glitchEffect) this.initGlitchEffect();
        if (this.config.scanlines) this.initScanlines();
        if (this.config.cityLights) this.initCityLights();
        if (this.config.holographicUI) this.initHolographicUI();
        
        this.isActive = true;
        console.log('✅ 赛博朋克2077特效系统启动完成！');
    }
    
    detectPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        if (isMobile || isLowEnd) {
            this.config.codeRainDensity = 30;
            this.config.particleCount = 40;
            this.config.glitchFrequency = 8000;
            console.log('🔧 检测到低性能设备，调整特效参数');
        }
    }
    
    createContainers() {
        // 主容器
        const mainContainer = document.createElement('div');
        mainContainer.className = 'cyberpunk2077-effects-container';
        mainContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            overflow: hidden;
        `;
        
        // 代码雨容器
        const codeRainContainer = document.createElement('div');
        codeRainContainer.className = 'cyber-code-rain';
        codeRainContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 粒子容器
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'cyber-neon-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 扫描线容器
        const scanlinesContainer = document.createElement('div');
        scanlinesContainer.className = 'cyber-scanlines';
        scanlinesContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 城市灯光容器
        const cityLightsContainer = document.createElement('div');
        cityLightsContainer.className = 'cyber-city-lights';
        cityLightsContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        mainContainer.appendChild(codeRainContainer);
        mainContainer.appendChild(cityLightsContainer);
        mainContainer.appendChild(particlesContainer);
        mainContainer.appendChild(scanlinesContainer);
        
        document.body.appendChild(mainContainer);
        
        this.containers = {
            main: mainContainer,
            codeRain: codeRainContainer,
            particles: particlesContainer,
            scanlines: scanlinesContainer,
            cityLights: cityLightsContainer
        };
    }
    
    initDigitalCodeRain() {
        const chars = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const columns = Math.floor(window.innerWidth / 20);
        
        for (let i = 0; i < this.config.codeRainDensity; i++) {
            const column = document.createElement('div');
            const x = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 15;
            const fontSize = Math.random() * 6 + 12;
            
            // 随机选择字符
            let text = '';
            const charCount = Math.floor(Math.random() * 10) + 5;
            for (let j = 0; j < charCount; j++) {
                text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
            }
            
            column.innerHTML = text;
            column.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: -100px;
                color: #FFD700;
                font-family: 'Courier New', monospace;
                font-size: ${fontSize}px;
                font-weight: 700;
                line-height: 1.2;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                opacity: 0.7;
                animation: cyberCodeFall ${duration}s linear ${delay}s infinite;
                white-space: nowrap;
            `;
            
            this.containers.codeRain.appendChild(column);
        }
    }
    
    initNeonParticles() {
        const colors = ['#FFD700', '#00FFFF', '#FF1493', '#FFEB3B', '#00FF00'];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 6;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                background: ${color};
                border-radius: 50%;
                opacity: 0;
                box-shadow: 0 0 ${size * 3}px ${color};
                animation: cyberParticlePulse ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            this.containers.particles.appendChild(particle);
        }
    }
    
    initGlitchEffect() {
        // 随机对页面元素应用故障效果
        const interval = setInterval(() => {
            if (!this.isActive) return;
            
            const elements = document.querySelectorAll('h1, h2, h3, .card, .game-card');
            if (elements.length === 0) return;
            
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            
            // 应用故障效果
            randomElement.style.animation = 'cyberGlitchShake 0.3s ease-in-out';
            
            setTimeout(() => {
                randomElement.style.animation = '';
            }, 300);
            
        }, this.config.glitchFrequency);
        
        this.intervals.push(interval);
    }
    
    initScanlines() {
        // 横向扫描线
        for (let i = 0; i < 3; i++) {
            const scanline = document.createElement('div');
            const delay = i * 2;
            const duration = Math.random() * 4 + 3;
            
            scanline.style.cssText = `
                position: absolute;
                width: 100%;
                height: 2px;
                left: 0;
                top: -2px;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255, 215, 0, 0.6),
                    transparent
                );
                box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
                animation: cyberScanlineMove ${duration}s linear ${delay}s infinite;
            `;
            
            this.containers.scanlines.appendChild(scanline);
        }
        
        // 静态扫描线纹理
        const staticScanlines = document.createElement('div');
        staticScanlines.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255, 215, 0, 0.02) 2px,
                rgba(255, 215, 0, 0.02) 4px
            );
            pointer-events: none;
        `;
        
        this.containers.scanlines.appendChild(staticScanlines);
    }
    
    initCityLights() {
        // 模拟夜之城的霓虹灯光
        const lightCount = 20;
        
        for (let i = 0; i < lightCount; i++) {
            const light = document.createElement('div');
            const size = Math.random() * 150 + 100;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const color = ['#FFD700', '#00FFFF', '#FF1493'][Math.floor(Math.random() * 3)];
            const duration = Math.random() * 4 + 3;
            const delay = Math.random() * 3;
            
            light.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                background: radial-gradient(
                    circle,
                    ${color}20 0%,
                    ${color}10 30%,
                    transparent 70%
                );
                border-radius: 50%;
                opacity: 0;
                animation: cyberLightFlicker ${duration}s ease-in-out ${delay}s infinite;
                filter: blur(40px);
            `;
            
            this.containers.cityLights.appendChild(light);
        }
    }
    
    initHolographicUI() {
        // 为特定UI元素添加全息效果
        const interval = setInterval(() => {
            if (!this.isActive) return;
            
            const cards = document.querySelectorAll('.card, .game-card');
            cards.forEach((card, index) => {
                if (Math.random() > 0.95) {
                    card.style.transition = 'none';
                    card.style.opacity = '0.8';
                    card.style.transform = `translateY(${Math.random() * 2 - 1}px)`;
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '';
                        card.style.transform = '';
                    }, 50);
                }
            });
        }, 100);
        
        this.intervals.push(interval);
    }
    
    destroy() {
        this.isActive = false;
        
        // 清理定时器
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        // 清理动画帧
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames = [];
        
        // 移除容器
        if (this.containers.main) {
            this.containers.main.remove();
        }
        
        console.log('🌃 赛博朋克2077特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) {
            this.containers.main.style.display = enable ? 'block' : 'none';
        }
    }
}

// 注入CSS动画
const cyberpunk2077StyleSheet = document.createElement('style');
cyberpunk2077StyleSheet.textContent = `
    @keyframes cyberCodeFall {
        0% {
            top: -100px;
            opacity: 0;
        }
        5% {
            opacity: 0.7;
        }
        95% {
            opacity: 0.7;
        }
        100% {
            top: 110vh;
            opacity: 0;
        }
    }
    
    @keyframes cyberParticlePulse {
        0%, 100% {
            opacity: 0;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1.5);
        }
    }
    
    @keyframes cyberGlitchShake {
        0%, 100% {
            transform: translate(0, 0);
        }
        20% {
            transform: translate(-2px, 2px);
        }
        40% {
            transform: translate(2px, -2px);
        }
        60% {
            transform: translate(-2px, -2px);
        }
        80% {
            transform: translate(2px, 2px);
        }
    }
    
    @keyframes cyberScanlineMove {
        0% {
            top: -2px;
        }
        100% {
            top: 100%;
        }
    }
    
    @keyframes cyberLightFlicker {
        0%, 100% {
            opacity: 0.3;
        }
        50% {
            opacity: 0.7;
        }
    }
    
    /* 性能优化 */
    .cyberpunk2077-effects-container * {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(cyberpunk2077StyleSheet);

// 全局实例
let cyberpunk2077Effects = null;

// 自动初始化
function initCyberpunk2077EffectsIfNeeded() {
    const isCyberpunkTheme = document.body.classList.contains('theme-cyberpunk') || 
                            localStorage.getItem('gameboxTheme') === 'cyberpunk';
    
    if (isCyberpunkTheme) {
        if (cyberpunk2077Effects) {
            cyberpunk2077Effects.destroy();
        }
        cyberpunk2077Effects = new Cyberpunk2077EffectsSystem();
        console.log('✅ 赛博朋克2077特效系统已自动启动');
    } else if (cyberpunk2077Effects) {
        cyberpunk2077Effects.destroy();
        cyberpunk2077Effects = null;
    }
}

// 页面加载时检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCyberpunk2077EffectsIfNeeded);
} else {
    initCyberpunk2077EffectsIfNeeded();
}

// 监听主题切换事件
window.addEventListener('themeChanged', function(e) {
    if (e.detail && e.detail.themeId === 'cyberpunk') {
        if (cyberpunk2077Effects) {
            cyberpunk2077Effects.destroy();
        }
        cyberpunk2077Effects = new Cyberpunk2077EffectsSystem();
    } else if (cyberpunk2077Effects) {
        cyberpunk2077Effects.destroy();
        cyberpunk2077Effects = null;
    }
});

// 导出给主题系统使用
if (typeof window !== 'undefined') {
    window.Cyberpunk2077EffectsSystem = Cyberpunk2077EffectsSystem;
    window.cyberpunk2077Effects = cyberpunk2077Effects;
}
