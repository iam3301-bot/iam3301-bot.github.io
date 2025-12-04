/**
 * 《黑神话：悟空》视觉特效系统
 * Black Myth: Wukong Visual Effects System
 * 
 * 包含特效：
 * - 金色粒子效果（Golden Particles）
 * - 浮动祥云（Floating Clouds）
 * - 金色光线（Golden Light Rays）
 * - 佛光特效（Buddha Light）
 * - 点击涟漪（Click Ripples）
 * - 金箍棒扫光（Staff Sweep）
 */

class WukongEffectsSystem {
    constructor(options = {}) {
        this.config = {
            goldenParticles: true,
            clouds: true,
            lightRays: true,
            buddhaLight: true,
            clickRipples: true,
            staffSweep: true,
            performance: 'auto', // 'high', 'medium', 'low', 'auto'
            particleCount: options.particleCount || 60,
            cloudCount: options.cloudCount || 5,
            rayCount: options.rayCount || 8,
            ...options
        };
        
        this.containers = {};
        this.isActive = false;
        this.animationFrames = [];
        
        this.init();
    }
    
    init() {
        console.log('🐵 黑神话：悟空特效系统初始化...');
        
        // 检测性能
        if (this.config.performance === 'auto') {
            this.detectPerformance();
        }
        
        // 创建特效容器
        this.createContainers();
        
        // 初始化各种特效
        if (this.config.goldenParticles) this.initGoldenParticles();
        if (this.config.clouds) this.initClouds();
        if (this.config.lightRays) this.initLightRays();
        if (this.config.buddhaLight) this.initBuddhaLight();
        if (this.config.clickRipples) this.initClickRipples();
        if (this.config.staffSweep) this.initStaffSweep();
        
        this.isActive = true;
        console.log('✅ 黑神话：悟空特效系统启动完成！');
    }
    
    detectPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        if (isMobile || isLowEnd) {
            this.config.particleCount = 30;
            this.config.cloudCount = 3;
            this.config.rayCount = 5;
            console.log('🔧 检测到低性能设备，调整特效参数');
        }
    }
    
    createContainers() {
        // 主容器
        const mainContainer = document.createElement('div');
        mainContainer.className = 'wukong-effects-container';
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
        
        // 粒子容器
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'wukong-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 祥云容器
        const cloudsContainer = document.createElement('div');
        cloudsContainer.className = 'wukong-clouds';
        cloudsContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 光线容器
        const raysContainer = document.createElement('div');
        raysContainer.className = 'wukong-rays';
        raysContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        // 佛光容器
        const buddhaLightContainer = document.createElement('div');
        buddhaLightContainer.className = 'wukong-buddha-light';
        buddhaLightContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
        `;
        
        mainContainer.appendChild(raysContainer);
        mainContainer.appendChild(buddhaLightContainer);
        mainContainer.appendChild(cloudsContainer);
        mainContainer.appendChild(particlesContainer);
        
        document.body.appendChild(mainContainer);
        
        this.containers = {
            main: mainContainer,
            particles: particlesContainer,
            clouds: cloudsContainer,
            rays: raysContainer,
            buddhaLight: buddhaLightContainer
        };
    }
    
    initGoldenParticles() {
        const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FFDF00', '#DAA520'];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 15 + 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}%;
                bottom: -10px;
                opacity: 0;
                animation: wukongParticleFloat ${duration}s linear ${delay}s infinite;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            this.containers.particles.appendChild(particle);
        }
    }
    
    initClouds() {
        const cloudSVG = `
            <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.3" />
                        <stop offset="50%" style="stop-color:#FFA500;stop-opacity:0.5" />
                        <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0.3" />
                    </linearGradient>
                </defs>
                <ellipse cx="60" cy="30" rx="40" ry="20" fill="url(#cloudGradient)" />
                <ellipse cx="100" cy="25" rx="50" ry="25" fill="url(#cloudGradient)" />
                <ellipse cx="140" cy="30" rx="40" ry="20" fill="url(#cloudGradient)" />
            </svg>
        `;
        
        for (let i = 0; i < this.config.cloudCount; i++) {
            const cloud = document.createElement('div');
            const size = Math.random() * 150 + 100;
            const y = Math.random() * 60 + 10;
            const delay = Math.random() * 20;
            const duration = Math.random() * 40 + 30;
            
            cloud.innerHTML = cloudSVG;
            cloud.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * 0.3}px;
                top: ${y}%;
                left: -200px;
                opacity: 0.6;
                animation: wukongCloudFloat ${duration}s linear ${delay}s infinite;
                filter: blur(2px);
            `;
            
            this.containers.clouds.appendChild(cloud);
        }
    }
    
    initLightRays() {
        for (let i = 0; i < this.config.rayCount; i++) {
            const ray = document.createElement('div');
            const width = Math.random() * 3 + 1;
            const height = Math.random() * 40 + 30;
            const x = (i / this.config.rayCount) * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 4 + 3;
            
            ray.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}%;
                background: linear-gradient(
                    to bottom,
                    rgba(255, 215, 0, 0) 0%,
                    rgba(255, 215, 0, 0.6) 50%,
                    rgba(255, 215, 0, 0) 100%
                );
                left: ${x}%;
                top: 0;
                animation: wukongRayPulse ${duration}s ease-in-out ${delay}s infinite;
                filter: blur(1px);
                transform-origin: top center;
            `;
            
            this.containers.rays.appendChild(ray);
        }
    }
    
    initBuddhaLight() {
        const buddhaLight = document.createElement('div');
        buddhaLight.style.cssText = `
            position: absolute;
            width: 300px;
            height: 300px;
            top: -150px;
            left: 50%;
            transform: translateX(-50%);
            background: radial-gradient(
                circle,
                rgba(255, 215, 0, 0.4) 0%,
                rgba(255, 165, 0, 0.2) 30%,
                rgba(255, 215, 0, 0.1) 60%,
                transparent 100%
            );
            animation: wukongBuddhaGlow 8s ease-in-out infinite;
            pointer-events: none;
        `;
        
        this.containers.buddhaLight.appendChild(buddhaLight);
    }
    
    initClickRipples() {
        document.addEventListener('click', (e) => {
            if (!this.isActive) return;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid #FFD700;
                border-radius: 50%;
                left: ${e.clientX - 10}px;
                top: ${e.clientY - 10}px;
                pointer-events: none;
                z-index: 9999;
                animation: wukongRipple 0.8s ease-out forwards;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            `;
            
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        });
    }
    
    initStaffSweep() {
        // 定期触发金箍棒扫光效果
        setInterval(() => {
            if (!this.isActive || Math.random() > 0.3) return;
            
            const sweep = document.createElement('div');
            const isHorizontal = Math.random() > 0.5;
            
            if (isHorizontal) {
                sweep.style.cssText = `
                    position: fixed;
                    width: 100%;
                    height: 3px;
                    top: ${Math.random() * 80 + 10}%;
                    left: -100%;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(255, 215, 0, 0.8),
                        rgba(255, 165, 0, 0.8),
                        rgba(255, 215, 0, 0.8),
                        transparent
                    );
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                    pointer-events: none;
                    z-index: 9999;
                    animation: wukongStaffSweepH 1.5s ease-out forwards;
                `;
            } else {
                sweep.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: 100%;
                    left: ${Math.random() * 80 + 10}%;
                    top: -100%;
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(255, 215, 0, 0.8),
                        rgba(255, 165, 0, 0.8),
                        rgba(255, 215, 0, 0.8),
                        transparent
                    );
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                    pointer-events: none;
                    z-index: 9999;
                    animation: wukongStaffSweepV 1.5s ease-out forwards;
                `;
            }
            
            document.body.appendChild(sweep);
            setTimeout(() => sweep.remove(), 1500);
        }, 8000);
    }
    
    destroy() {
        this.isActive = false;
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames = [];
        
        if (this.containers.main) {
            this.containers.main.remove();
        }
        
        console.log('🐵 黑神话：悟空特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) {
            this.containers.main.style.display = enable ? 'block' : 'none';
        }
    }
}

// 注入CSS动画
const wukongStyleSheet = document.createElement('style');
wukongStyleSheet.textContent = `
    @keyframes wukongParticleFloat {
        0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes wukongCloudFloat {
        0% {
            left: -200px;
            opacity: 0.4;
        }
        10% {
            opacity: 0.6;
        }
        90% {
            opacity: 0.6;
        }
        100% {
            left: 110%;
            opacity: 0.4;
        }
    }
    
    @keyframes wukongRayPulse {
        0%, 100% {
            opacity: 0.3;
            transform: scaleY(0.8);
        }
        50% {
            opacity: 0.7;
            transform: scaleY(1);
        }
    }
    
    @keyframes wukongBuddhaGlow {
        0%, 100% {
            opacity: 0.6;
            transform: translateX(-50%) scale(1);
        }
        50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.2);
        }
    }
    
    @keyframes wukongRipple {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(20);
            opacity: 0;
        }
    }
    
    @keyframes wukongStaffSweepH {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
    
    @keyframes wukongStaffSweepV {
        0% {
            top: -100%;
        }
        100% {
            top: 100%;
        }
    }
    
    /* 性能优化 */
    .wukong-effects-container * {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(wukongStyleSheet);

// 全局实例
let wukongEffects = null;

// 自动初始化（如果当前是悟空主题）
function initWukongEffectsIfNeeded() {
    // 检查是否有theme-wukong类或者localStorage中存储的主题
    const isWukongTheme = document.body.classList.contains('theme-wukong') || 
                         localStorage.getItem('gameboxTheme') === 'wukong';
    
    if (isWukongTheme) {
        if (wukongEffects) {
            wukongEffects.destroy();
        }
        wukongEffects = new WukongEffectsSystem();
        console.log('✅ 悟空特效系统已自动启动');
    } else if (wukongEffects) {
        wukongEffects.destroy();
        wukongEffects = null;
    }
}

// 页面加载时检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWukongEffectsIfNeeded);
} else {
    initWukongEffectsIfNeeded();
}

// 监听主题切换事件
window.addEventListener('themeChanged', function(e) {
    if (e.detail && e.detail.themeId === 'wukong') {
        if (wukongEffects) {
            wukongEffects.destroy();
        }
        wukongEffects = new WukongEffectsSystem();
    } else if (wukongEffects) {
        wukongEffects.destroy();
        wukongEffects = null;
    }
});

// 导出给主题系统使用
if (typeof window !== 'undefined') {
    window.WukongEffectsSystem = WukongEffectsSystem;
    window.wukongEffects = wukongEffects;
}
