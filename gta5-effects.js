/**
 * 🚗 GTA5视觉特效系统
 * Grand Theft Auto V Visual Effects System
 * 
 * 标志性特效：
 * - City Skyline（洛圣都天际线）
 * - Wanted Stars（通缉星动画）
 * - Money Rain（美元雨）
 * - Graffiti Tags（涂鸦标签）
 * - Police Lights（警灯闪烁）
 * - Neon Particles（霓虹粒子）
 */

class GTA5EffectsSystem {
    constructor(options = {}) {
        this.config = {
            skyline: true,
            wantedStars: true,
            moneyRain: true,
            graffiti: true,
            policeLights: true,
            neonParticles: true,
            performance: 'auto',
            particleCount: options.particleCount || 50,
            ...options
        };
        
        this.containers = {};
        this.isActive = false;
        this.intervals = [];
        
        this.init();
    }
    
    init() {
        console.log('🚗 GTA5特效系统初始化...');
        
        if (this.config.performance === 'auto') {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
            if (isMobile) this.config.particleCount = 25;
        }
        
        this.createContainers();
        
        if (this.config.skyline) this.initSkyline();
        if (this.config.wantedStars) this.initWantedStars();
        if (this.config.moneyRain) this.initMoneyRain();
        if (this.config.graffiti) this.initGraffiti();
        if (this.config.policeLights) this.initPoliceLights();
        if (this.config.neonParticles) this.initNeonParticles();
        
        this.isActive = true;
        console.log('✅ GTA5特效系统启动完成！');
    }
    
    createContainers() {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'gta5-effects-container';
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
        
        ['skyline', 'stars', 'money', 'graffiti', 'lights', 'particles'].forEach(name => {
            const container = document.createElement('div');
            container.className = `gta-${name}`;
            container.style.cssText = `position: absolute; width: 100%; height: 100%;`;
            mainContainer.appendChild(container);
            this.containers[name] = container;
        });
        
        document.body.appendChild(mainContainer);
        this.containers.main = mainContainer;
    }
    
    initSkyline() {
        const skyline = document.createElement('div');
        skyline.innerHTML = `
            <svg viewBox="0 0 1000 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#00FF00;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <rect x="50" y="80" width="40" height="120" fill="url(#skylineGrad)" />
                <rect x="120" y="50" width="50" height="150" fill="url(#skylineGrad)" />
                <rect x="200" y="70" width="45" height="130" fill="url(#skylineGrad)" />
                <rect x="280" y="40" width="60" height="160" fill="url(#skylineGrad)" />
                <rect x="370" y="90" width="35" height="110" fill="url(#skylineGrad)" />
                <rect x="440" y="60" width="55" height="140" fill="url(#skylineGrad)" />
                <rect x="530" y="75" width="40" height="125" fill="url(#skylineGrad)" />
                <rect x="600" y="45" width="50" height="155" fill="url(#skylineGrad)" />
                <rect x="680" y="85" width="45" height="115" fill="url(#skylineGrad)" />
                <rect x="760" y="55" width="50" height="145" fill="url(#skylineGrad)" />
                <rect x="840" y="70" width="40" height="130" fill="url(#skylineGrad)" />
                <rect x="910" y="95" width="35" height="105" fill="url(#skylineGrad)" />
            </svg>
        `;
        
        skyline.style.cssText = `
            position: absolute;
            width: 100%;
            height: 200px;
            bottom: 0;
            left: 0;
            opacity: 0.4;
            filter: blur(1px);
        `;
        
        this.containers.skyline.appendChild(skyline);
    }
    
    initWantedStars() {
        const starContainer = document.createElement('div');
        starContainer.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 5px;
        `;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.textContent = '★';
            star.style.cssText = `
                font-size: 24px;
                color: rgba(255, 215, 0, 0);
                text-shadow: 0 0 10px rgba(255, 215, 0, 0);
                animation: gtaWantedStar 4s ease-in-out ${i * 0.8}s infinite;
            `;
            starContainer.appendChild(star);
        }
        
        this.containers.stars.appendChild(starContainer);
    }
    
    initMoneyRain() {
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.3) return;
            
            const money = document.createElement('div');
            money.textContent = '$';
            money.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 20}px;
                font-weight: 900;
                color: #00FF00;
                text-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
                animation: gtaMoneyFall ${Math.random() * 3 + 2}s linear forwards;
            `;
            
            this.containers.money.appendChild(money);
            setTimeout(() => money.remove(), 5000);
        }, 500);
        
        this.intervals.push(interval);
    }
    
    initGraffiti() {
        const tags = ['GTA', 'LS', 'V', '★'];
        
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.15) return;
            
            const graffiti = document.createElement('div');
            graffiti.textContent = tags[Math.floor(Math.random() * tags.length)];
            graffiti.style.cssText = `
                position: absolute;
                left: ${Math.random() * 90}%;
                top: ${Math.random() * 90}%;
                font-family: Impact, sans-serif;
                font-size: ${Math.random() * 40 + 30}px;
                font-weight: 900;
                color: rgba(255, 20, 147, 0);
                text-shadow: 0 0 20px rgba(255, 20, 147, 0);
                transform: rotate(${Math.random() * 30 - 15}deg);
                animation: gtaGraffitiFade 5s ease-out forwards;
            `;
            
            this.containers.graffiti.appendChild(graffiti);
            setTimeout(() => graffiti.remove(), 5000);
        }, 4000);
        
        this.intervals.push(interval);
    }
    
    initPoliceLights() {
        const lights = document.createElement('div');
        lights.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0), rgba(0, 0, 255, 0));
            animation: gtaPoliceLights 2s ease-in-out infinite;
            opacity: 0;
        `;
        
        this.containers.lights.appendChild(lights);
    }
    
    initNeonParticles() {
        const colors = ['#00FF00', '#FF1493', '#00FFFF', '#FFD700'];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 3 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: 0;
                box-shadow: 0 0 ${size * 3}px ${color};
                animation: gtaNeonPulse ${Math.random() * 3 + 2}s ease-in-out ${Math.random() * 2}s infinite;
            `;
            
            this.containers.particles.appendChild(particle);
        }
    }
    
    destroy() {
        this.isActive = false;
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        if (this.containers.main) this.containers.main.remove();
        console.log('🚗 GTA5特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) {
            this.containers.main.style.display = enable ? 'block' : 'none';
        }
    }
}

const gta5StyleSheet = document.createElement('style');
gta5StyleSheet.textContent = `
    @keyframes gtaWantedStar {
        0%, 90% { color: rgba(255, 215, 0, 0); text-shadow: 0 0 10px rgba(255, 215, 0, 0); }
        95% { color: rgba(255, 215, 0, 1); text-shadow: 0 0 20px rgba(255, 215, 0, 1); }
        100% { color: rgba(255, 215, 0, 0); text-shadow: 0 0 10px rgba(255, 215, 0, 0); }
    }
    
    @keyframes gtaMoneyFall {
        0% { top: -20px; opacity: 0; transform: rotate(0deg); }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: 110%; opacity: 0; transform: rotate(360deg); }
    }
    
    @keyframes gtaGraffitiFade {
        0% { color: rgba(255, 20, 147, 0); text-shadow: 0 0 20px rgba(255, 20, 147, 0); }
        20% { color: rgba(255, 20, 147, 0.6); text-shadow: 0 0 30px rgba(255, 20, 147, 0.8); }
        80% { color: rgba(255, 20, 147, 0.6); text-shadow: 0 0 30px rgba(255, 20, 147, 0.8); }
        100% { color: rgba(255, 20, 147, 0); text-shadow: 0 0 20px rgba(255, 20, 147, 0); }
    }
    
    @keyframes gtaPoliceLights {
        0%, 100% { opacity: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 0, 0, 0.3), transparent); }
        50% { opacity: 0.5; background: radial-gradient(circle at 50% 0%, rgba(0, 0, 255, 0.3), transparent); }
    }
    
    @keyframes gtaNeonPulse {
        0%, 100% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.5); }
    }
    
    .gta5-effects-container * { will-change: transform, opacity; }
`;
document.head.appendChild(gta5StyleSheet);

let gta5Effects = null;

function initGTA5EffectsIfNeeded() {
    const isGTA5Theme = document.body.classList.contains('theme-gta5') || 
                       localStorage.getItem('gameboxTheme') === 'gta5';
    
    if (isGTA5Theme) {
        if (gta5Effects) gta5Effects.destroy();
        gta5Effects = new GTA5EffectsSystem();
        console.log('✅ GTA5特效系统已自动启动');
    } else if (gta5Effects) {
        gta5Effects.destroy();
        gta5Effects = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGTA5EffectsIfNeeded);
} else {
    initGTA5EffectsIfNeeded();
}

window.addEventListener('themeChanged', function(e) {
    if (e.detail && e.detail.themeId === 'gta5') {
        if (gta5Effects) gta5Effects.destroy();
        gta5Effects = new GTA5EffectsSystem();
    } else if (gta5Effects) {
        gta5Effects.destroy();
        gta5Effects = null;
    }
});

if (typeof window !== 'undefined') {
    window.GTA5EffectsSystem = GTA5EffectsSystem;
    window.gta5Effects = gta5Effects;
}
