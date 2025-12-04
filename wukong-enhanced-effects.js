/**
 * 🐵 黑神话悟空增强版视觉特效系统
 * Black Myth: Wukong Enhanced Visual Effects System
 * 
 * 新增标志性元素：
 * - 水墨笔触动画 (Ink Brush Strokes)
 * - 孙悟空剪影 (Wukong Silhouette)
 * - 法阵装饰 (Magic Circles)
 * - 花果山云雾 (Huaguo Mountain Mist)
 * - 火花迸射 (Spark Bursts)
 * - 筋斗云特效 (Somersault Cloud)
 * 
 * 保留原有：
 * - 金色粒子、祥云、光线、佛光、涟漪、扫光
 */

class WukongEnhancedEffectsSystem {
    constructor(options = {}) {
        this.config = {
            // 原有特效
            goldenParticles: true,
            clouds: true,
            lightRays: true,
            buddhaLight: true,
            clickRipples: true,
            staffSweep: true,
            
            // 新增特效
            inkBrushStrokes: true,
            wukongSilhouette: true,
            magicCircles: true,
            mountainMist: true,
            sparkBursts: true,
            somersaultCloud: true,
            
            performance: 'auto',
            particleCount: options.particleCount || 60,
            cloudCount: options.cloudCount || 5,
            ...options
        };
        
        this.containers = {};
        this.isActive = false;
        this.intervals = [];
        this.animationFrames = [];
        
        this.init();
    }
    
    init() {
        console.log('🐵 黑神话悟空增强版特效系统初始化...');
        
        if (this.config.performance === 'auto') {
            this.detectPerformance();
        }
        
        this.createContainers();
        
        // 原有特效
        if (this.config.goldenParticles) this.initGoldenParticles();
        if (this.config.clouds) this.initClouds();
        if (this.config.lightRays) this.initLightRays();
        if (this.config.buddhaLight) this.initBuddhaLight();
        if (this.config.clickRipples) this.initClickRipples();
        if (this.config.staffSweep) this.initStaffSweep();
        
        // 新增特效
        if (this.config.inkBrushStrokes) this.initInkBrushStrokes();
        if (this.config.wukongSilhouette) this.initWukongSilhouette();
        if (this.config.magicCircles) this.initMagicCircles();
        if (this.config.mountainMist) this.initMountainMist();
        if (this.config.sparkBursts) this.initSparkBursts();
        if (this.config.somersaultCloud) this.initSomersaultCloud();
        
        this.isActive = true;
        console.log('✅ 黑神话悟空增强版特效系统启动完成！');
    }
    
    detectPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        if (isMobile || isLowEnd) {
            this.config.particleCount = 30;
            this.config.cloudCount = 3;
            console.log('🔧 检测到低性能设备，调整特效参数');
        }
    }
    
    createContainers() {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'wukong-enhanced-effects-container';
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
        
        // 各种特效容器
        const containers = [
            'mist', 'silhouette', 'rays', 'buddhaLight', 
            'clouds', 'particles', 'inkBrush', 'magicCircles'
        ];
        
        const createdContainers = {};
        containers.forEach(name => {
            const container = document.createElement('div');
            container.className = `wukong-${name}`;
            container.style.cssText = `
                position: absolute;
                width: 100%;
                height: 100%;
            `;
            mainContainer.appendChild(container);
            createdContainers[name] = container;
        });
        
        document.body.appendChild(mainContainer);
        
        this.containers = {
            main: mainContainer,
            ...createdContainers
        };
    }
    
    // ==========================================
    // 原有特效（保留）
    // ==========================================
    
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
                animation: wukongParticleDrift ${duration}s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            this.containers.particles.appendChild(particle);
        }
    }
    
    initClouds() {
        const cloudSVG = `
            <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="wukongCloudGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.4" />
                        <stop offset="50%" style="stop-color:#FFA500;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0.4" />
                    </linearGradient>
                </defs>
                <ellipse cx="60" cy="30" rx="40" ry="20" fill="url(#wukongCloudGrad)" />
                <ellipse cx="100" cy="25" rx="50" ry="25" fill="url(#wukongCloudGrad)" />
                <ellipse cx="140" cy="30" rx="40" ry="20" fill="url(#wukongCloudGrad)" />
            </svg>
        `;
        
        for (let i = 0; i < this.config.cloudCount; i++) {
            const cloud = document.createElement('div');
            const size = Math.random() * 150 + 100;
            const y = Math.random() * 40 + 10;
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
                animation: wukongCloudDrift ${duration}s linear ${delay}s infinite;
                filter: blur(2px);
            `;
            
            this.containers.clouds.appendChild(cloud);
        }
    }
    
    initLightRays() {
        for (let i = 0; i < 8; i++) {
            const ray = document.createElement('div');
            const width = Math.random() * 3 + 1;
            const height = Math.random() * 40 + 30;
            const x = (i / 8) * 100;
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
            `;
            
            this.containers.rays.appendChild(ray);
        }
    }
    
    initBuddhaLight() {
        const buddhaLight = document.createElement('div');
        buddhaLight.style.cssText = `
            position: absolute;
            width: 400px;
            height: 400px;
            top: -200px;
            left: 50%;
            transform: translateX(-50%);
            background: radial-gradient(
                circle,
                rgba(255, 215, 0, 0.5) 0%,
                rgba(255, 165, 0, 0.3) 30%,
                rgba(255, 215, 0, 0.1) 60%,
                transparent 100%
            );
            animation: wukongBuddhaGlow 8s ease-in-out infinite;
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
                animation: wukongRippleExpand 0.8s ease-out forwards;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            `;
            
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 800);
        });
    }
    
    initStaffSweep() {
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.3) return;
            
            const sweep = document.createElement('div');
            const isHorizontal = Math.random() > 0.5;
            
            if (isHorizontal) {
                sweep.style.cssText = `
                    position: fixed;
                    width: 100%;
                    height: 4px;
                    top: ${Math.random() * 80 + 10}%;
                    left: -100%;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(255, 215, 0, 0.9),
                        rgba(255, 165, 0, 0.9),
                        rgba(255, 215, 0, 0.9),
                        transparent
                    );
                    box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
                    pointer-events: none;
                    z-index: 9999;
                    animation: wukongStaffSweepH 1.5s ease-out forwards;
                `;
            } else {
                sweep.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 100%;
                    left: ${Math.random() * 80 + 10}%;
                    top: -100%;
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(255, 215, 0, 0.9),
                        rgba(255, 165, 0, 0.9),
                        rgba(255, 215, 0, 0.9),
                        transparent
                    );
                    box-shadow: 0 0 25px rgba(255, 215, 0, 0.9);
                    pointer-events: none;
                    z-index: 9999;
                    animation: wukongStaffSweepV 1.5s ease-out forwards;
                `;
            }
            
            document.body.appendChild(sweep);
            setTimeout(() => sweep.remove(), 1500);
        }, 8000);
        
        this.intervals.push(interval);
    }
    
    // ==========================================
    // 新增特效
    // ==========================================
    
    initInkBrushStrokes() {
        // 水墨笔触效果
        const strokes = [
            'M10,50 Q30,10 50,50 T90,50',
            'M20,30 C20,10 40,10 40,30 S60,50 60,30',
            'M5,45 Q25,25 45,45 Q65,65 85,45'
        ];
        
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.15) return;
            
            const strokePath = strokes[Math.floor(Math.random() * strokes.length)];
            const stroke = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            const rotation = Math.random() * 360;
            const scale = Math.random() * 0.5 + 0.5;
            
            stroke.setAttribute('viewBox', '0 0 100 100');
            stroke.style.cssText = `
                position: absolute;
                width: 200px;
                height: 200px;
                left: ${x}%;
                top: ${y}%;
                transform: rotate(${rotation}deg) scale(${scale});
                opacity: 0;
                pointer-events: none;
                animation: wukongInkBrushFade 4s ease-out forwards;
            `;
            
            path.setAttribute('d', strokePath);
            path.setAttribute('stroke', 'rgba(255, 215, 0, 0.6)');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke-linecap', 'round');
            path.style.filter = 'blur(1px)';
            
            stroke.appendChild(path);
            this.containers.inkBrush.appendChild(stroke);
            
            setTimeout(() => stroke.remove(), 4000);
        }, 3000);
        
        this.intervals.push(interval);
    }
    
    initWukongSilhouette() {
        // 孙悟空剪影
        const silhouette = document.createElement('div');
        silhouette.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="wukongSilhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <!-- 简化的悟空剪影 -->
                <circle cx="50" cy="30" r="12" fill="url(#wukongSilhouetteGrad)" />
                <rect x="46" y="40" width="8" height="30" fill="url(#wukongSilhouetteGrad)" />
                <ellipse cx="50" cy="25" rx="15" ry="8" fill="url(#wukongSilhouetteGrad)" />
                <!-- 金箍棒 -->
                <rect x="35" y="35" width="30" height="3" fill="url(#wukongSilhouetteGrad)" transform="rotate(-30 50 36)" />
            </svg>
        `;
        
        silhouette.style.cssText = `
            position: absolute;
            width: 300px;
            height: 300px;
            right: 5%;
            bottom: 10%;
            opacity: 0.2;
            animation: wukongSilhouetteBreathe 6s ease-in-out infinite;
            filter: blur(3px);
        `;
        
        this.containers.silhouette.appendChild(silhouette);
    }
    
    initMagicCircles() {
        // 法阵装饰
        const circles = 3;
        for (let i = 0; i < circles; i++) {
            const circle = document.createElement('div');
            const size = 100 + i * 50;
            const delay = i * 2;
            
            circle.innerHTML = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255, 215, 0, 0.3)" stroke-width="1" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 165, 0, 0.2)" stroke-width="0.5" stroke-dasharray="5,5" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255, 215, 0, 0.25)" stroke-width="0.5" />
                    <!-- 八卦符号 -->
                    <text x="50" y="55" font-size="20" fill="rgba(255, 215, 0, 0.4)" text-anchor="middle" font-family="serif">卍</text>
                </svg>
            `;
            
            circle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 80 + 10}%;
                top: ${Math.random() * 80 + 10}%;
                animation: wukongMagicCircleRotate ${20 + i * 5}s linear ${delay}s infinite;
                opacity: 0.6;
                filter: blur(1px);
            `;
            
            this.containers.magicCircles.appendChild(circle);
        }
    }
    
    initMountainMist() {
        // 花果山云雾
        for (let i = 0; i < 4; i++) {
            const mist = document.createElement('div');
            const size = Math.random() * 400 + 300;
            const y = 60 + Math.random() * 30;
            const delay = Math.random() * 10;
            const duration = Math.random() * 30 + 20;
            
            mist.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * 0.4}px;
                left: -${size}px;
                bottom: ${y}%;
                background: radial-gradient(
                    ellipse,
                    rgba(255, 215, 0, 0.1) 0%,
                    rgba(255, 165, 0, 0.05) 40%,
                    transparent 70%
                );
                animation: wukongMistDrift ${duration}s linear ${delay}s infinite;
                filter: blur(20px);
            `;
            
            this.containers.mist.appendChild(mist);
        }
    }
    
    initSparkBursts() {
        // 火花迸射效果
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.2) return;
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            // 创建多个火花粒子
            for (let i = 0; i < 8; i++) {
                const spark = document.createElement('div');
                const angle = (i / 8) * Math.PI * 2;
                const distance = Math.random() * 50 + 30;
                
                spark.style.cssText = `
                    position: absolute;
                    width: 3px;
                    height: 12px;
                    left: ${x}%;
                    top: ${y}%;
                    background: linear-gradient(to bottom, #FFD700, #FF8C00);
                    transform-origin: center;
                    opacity: 0;
                    animation: wukongSparkBurst 1s ease-out forwards;
                    animation-delay: 0s;
                    box-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
                    --angle: ${angle}rad;
                    --distance: ${distance}px;
                `;
                
                this.containers.particles.appendChild(spark);
                setTimeout(() => spark.remove(), 1000);
            }
        }, 5000);
        
        this.intervals.push(interval);
    }
    
    initSomersaultCloud() {
        // 筋斗云特效（悬浮云朵）
        const somersaultCloud = document.createElement('div');
        somersaultCloud.innerHTML = `
            <svg viewBox="0 0 150 50" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="cloudGradient">
                        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.7" />
                        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.3" />
                    </radialGradient>
                </defs>
                <ellipse cx="40" cy="25" rx="35" ry="18" fill="url(#cloudGradient)" />
                <ellipse cx="75" cy="20" rx="45" ry="22" fill="url(#cloudGradient)" />
                <ellipse cx="110" cy="25" rx="35" ry="18" fill="url(#cloudGradient)" />
            </svg>
        `;
        
        somersaultCloud.style.cssText = `
            position: absolute;
            width: 250px;
            height: 80px;
            left: 50%;
            top: 20%;
            transform: translateX(-50%);
            animation: wukongSomersaultFloat 8s ease-in-out infinite;
            opacity: 0.5;
            filter: blur(3px);
        `;
        
        this.containers.clouds.appendChild(somersaultCloud);
    }
    
    destroy() {
        this.isActive = false;
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        this.animationFrames.forEach(id => cancelAnimationFrame(id));
        this.animationFrames = [];
        
        if (this.containers.main) {
            this.containers.main.remove();
        }
        
        console.log('🐵 黑神话悟空增强版特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) {
            this.containers.main.style.display = enable ? 'block' : 'none';
        }
    }
}

// 注入CSS动画
const wukongEnhancedStyleSheet = document.createElement('style');
wukongEnhancedStyleSheet.textContent = `
    /* 原有动画 */
    @keyframes wukongParticleDrift {
        0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
        }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) scale(1);
            opacity: 0;
        }
    }
    
    @keyframes wukongCloudDrift {
        0% {
            left: -200px;
            opacity: 0.4;
        }
        10% { opacity: 0.7; }
        90% { opacity: 0.7; }
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
            opacity: 0.8;
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
            transform: translateX(-50%) scale(1.3);
        }
    }
    
    @keyframes wukongRippleExpand {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(25);
            opacity: 0;
        }
    }
    
    @keyframes wukongStaffSweepH {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    @keyframes wukongStaffSweepV {
        0% { top: -100%; }
        100% { top: 100%; }
    }
    
    /* 新增动画 */
    @keyframes wukongInkBrushFade {
        0% {
            opacity: 0;
            transform: rotate(var(--rotation, 0deg)) scale(0.5);
        }
        20% {
            opacity: 0.8;
            transform: rotate(var(--rotation, 0deg)) scale(1);
        }
        80% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
            transform: rotate(var(--rotation, 0deg)) scale(1.2);
        }
    }
    
    @keyframes wukongSilhouetteBreathe {
        0%, 100% {
            opacity: 0.15;
            transform: scale(0.95);
        }
        50% {
            opacity: 0.3;
            transform: scale(1.05);
        }
    }
    
    @keyframes wukongMagicCircleRotate {
        0% {
            transform: rotate(0deg);
            opacity: 0.4;
        }
        50% {
            opacity: 0.7;
        }
        100% {
            transform: rotate(360deg);
            opacity: 0.4;
        }
    }
    
    @keyframes wukongMistDrift {
        0% {
            left: -400px;
            opacity: 0.3;
        }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% {
            left: 110%;
            opacity: 0.3;
        }
    }
    
    @keyframes wukongSparkBurst {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
            ) scale(0.5);
        }
    }
    
    @keyframes wukongSomersaultFloat {
        0%, 100% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 0.4;
        }
        50% {
            transform: translateX(-50%) translateY(-30px) scale(1.1);
            opacity: 0.7;
        }
    }
    
    .wukong-enhanced-effects-container * {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(wukongEnhancedStyleSheet);

// 全局实例
let wukongEnhancedEffects = null;

// 自动初始化
function initWukongEnhancedEffectsIfNeeded() {
    const isWukongTheme = document.body.classList.contains('theme-wukong') || 
                         localStorage.getItem('gameboxTheme') === 'wukong';
    
    if (isWukongTheme) {
        if (wukongEnhancedEffects) {
            wukongEnhancedEffects.destroy();
        }
        wukongEnhancedEffects = new WukongEnhancedEffectsSystem();
        console.log('✅ 悟空增强版特效系统已自动启动');
    } else if (wukongEnhancedEffects) {
        wukongEnhancedEffects.destroy();
        wukongEnhancedEffects = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWukongEnhancedEffectsIfNeeded);
} else {
    initWukongEnhancedEffectsIfNeeded();
}

window.addEventListener('themeChanged', function(e) {
    if (e.detail && e.detail.themeId === 'wukong') {
        if (wukongEnhancedEffects) {
            wukongEnhancedEffects.destroy();
        }
        wukongEnhancedEffects = new WukongEnhancedEffectsSystem();
    } else if (wukongEnhancedEffects) {
        wukongEnhancedEffects.destroy();
        wukongEnhancedEffects = null;
    }
});

if (typeof window !== 'undefined') {
    window.WukongEnhancedEffectsSystem = WukongEnhancedEffectsSystem;
    window.wukongEnhancedEffects = wukongEnhancedEffects;
}
