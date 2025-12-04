/**
 * ⚔️ 巫师3：狂猎视觉特效系统
 * The Witcher 3: Wild Hunt Visual Effects System
 * 
 * 标志性特效：
 * - Wolf Emblem（狼徽记浮现）
 * - Sign Effects（法印效果：伊格尼、昆恩）
 * - Sword Trails（剑光轨迹）
 * - Embers（飘散余烬）
 * - Runes Glow（符文发光）
 * - Gwent Cards（昆特牌飘落）
 */

class Witcher3EffectsSystem {
    constructor(options = {}) {
        this.config = {
            wolfEmblem: true,
            signEffects: true,
            swordTrails: true,
            embers: true,
            runesGlow: true,
            gwentCards: true,
            performance: 'auto',
            emberCount: options.emberCount || 40,
            ...options
        };
        
        this.containers = {};
        this.isActive = false;
        this.intervals = [];
        
        this.init();
    }
    
    init() {
        console.log('⚔️ 巫师3特效系统初始化...');
        
        if (this.config.performance === 'auto') {
            this.detectPerformance();
        }
        
        this.createContainers();
        
        if (this.config.wolfEmblem) this.initWolfEmblem();
        if (this.config.signEffects) this.initSignEffects();
        if (this.config.swordTrails) this.initSwordTrails();
        if (this.config.embers) this.initEmbers();
        if (this.config.runesGlow) this.initRunesGlow();
        if (this.config.gwentCards) this.initGwentCards();
        
        this.isActive = true;
        console.log('✅ 巫师3特效系统启动完成！');
    }
    
    detectPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        if (isMobile) {
            this.config.emberCount = 20;
        }
    }
    
    createContainers() {
        const mainContainer = document.createElement('div');
        mainContainer.className = 'witcher3-effects-container';
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
        
        const containerNames = ['emblem', 'signs', 'trails', 'embers', 'runes', 'cards'];
        const createdContainers = {};
        
        containerNames.forEach(name => {
            const container = document.createElement('div');
            container.className = `witcher-${name}`;
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
    
    initWolfEmblem() {
        // 狼徽记在特定位置显现
        const emblem = document.createElement('div');
        emblem.innerHTML = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="wolfGrad">
                        <stop offset="0%" style="stop-color:#C41E3A;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#8B0000;stop-opacity:0.2" />
                    </radialGradient>
                </defs>
                <!-- 简化狼头剪影 -->
                <circle cx="50" cy="40" r="20" fill="url(#wolfGrad)" />
                <ellipse cx="50" cy="55" rx="18" ry="12" fill="url(#wolfGrad)" />
                <circle cx="42" cy="35" r="3" fill="rgba(255,215,0,0.6)" />
                <circle cx="58" cy="35" r="3" fill="rgba(255,215,0,0.6)" />
                <!-- 耳朵 -->
                <path d="M35 25 L30 15 L40 28 Z" fill="url(#wolfGrad)" />
                <path d="M65 25 L70 15 L60 28 Z" fill="url(#wolfGrad)" />
            </svg>
        `;
        
        emblem.style.cssText = `
            position: absolute;
            width: 150px;
            height: 150px;
            left: 10%;
            top: 15%;
            opacity: 0;
            animation: witcherWolfEmblemAppear 10s ease-in-out infinite;
            filter: blur(2px);
        `;
        
        this.containers.emblem.appendChild(emblem);
    }
    
    initSignEffects() {
        // 伊格尼法印（火焰）效果
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.2) return;
            
            const igni = document.createElement('div');
            igni.innerHTML = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <radialGradient id="igniGrad">
                            <stop offset="0%" style="stop-color:#FF4500;stop-opacity:0.9" />
                            <stop offset="50%" style="stop-color:#FF6347;stop-opacity:0.6" />
                            <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:0" />
                        </radialGradient>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#igniGrad)" />
                    <circle cx="50" cy="50" r="30" fill="url(#igniGrad)" opacity="0.7" />
                    <circle cx="50" cy="50" r="20" fill="url(#igniGrad)" opacity="0.5" />
                </svg>
            `;
            
            const x = Math.random() * 80 + 10;
            const y = Math.random() * 80 + 10;
            
            igni.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                left: ${x}%;
                top: ${y}%;
                opacity: 0;
                animation: witcherSignFlash 2s ease-out forwards;
                filter: blur(3px);
            `;
            
            this.containers.signs.appendChild(igni);
            setTimeout(() => igni.remove(), 2000);
        }, 4000);
        
        this.intervals.push(interval);
        
        // 昆恩法印（护盾）效果
        const quenInterval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.15) return;
            
            const quen = document.createElement('div');
            quen.innerHTML = `
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,215,0,0.4)" stroke-width="2" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,215,0,0.3)" stroke-width="1" stroke-dasharray="5,5" />
                    <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,215,0,0.2)" stroke-width="1" />
                </svg>
            `;
            
            quen.style.cssText = `
                position: absolute;
                width: 150px;
                height: 150px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                opacity: 0;
                animation: witcherQuenPulse 3s ease-out forwards;
            `;
            
            this.containers.signs.appendChild(quen);
            setTimeout(() => quen.remove(), 3000);
        }, 6000);
        
        this.intervals.push(quenInterval);
    }
    
    initSwordTrails() {
        // 随机出现剑光轨迹
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.25) return;
            
            const trail = document.createElement('div');
            const isVertical = Math.random() > 0.5;
            const length = Math.random() * 200 + 150;
            
            if (isVertical) {
                trail.style.cssText = `
                    position: fixed;
                    width: 3px;
                    height: ${length}px;
                    left: ${Math.random() * 90 + 5}%;
                    top: -${length}px;
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(192, 192, 192, 0.8),
                        rgba(196, 30, 58, 0.6),
                        transparent
                    );
                    box-shadow: 0 0 10px rgba(192, 192, 192, 0.8);
                    animation: witcherSwordSlashV 1.2s ease-out forwards;
                    pointer-events: none;
                    z-index: 9999;
                `;
            } else {
                trail.style.cssText = `
                    position: fixed;
                    width: ${length}px;
                    height: 3px;
                    left: -${length}px;
                    top: ${Math.random() * 90 + 5}%;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(192, 192, 192, 0.8),
                        rgba(196, 30, 58, 0.6),
                        transparent
                    );
                    box-shadow: 0 0 10px rgba(192, 192, 192, 0.8);
                    animation: witcherSwordSlashH 1.2s ease-out forwards;
                    pointer-events: none;
                    z-index: 9999;
                `;
            }
            
            document.body.appendChild(trail);
            setTimeout(() => trail.remove(), 1200);
        }, 5000);
        
        this.intervals.push(interval);
    }
    
    initEmbers() {
        // 飘散的火焰余烬
        for (let i = 0; i < this.config.emberCount; i++) {
            const ember = document.createElement('div');
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 15 + 10;
            
            ember.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? '#FF6347' : '#FF8C00'};
                border-radius: 50%;
                left: ${x}%;
                bottom: -10px;
                opacity: 0;
                animation: witcherEmberFloat ${duration}s ease-in-out ${delay}s infinite;
                box-shadow: 0 0 ${size * 3}px ${Math.random() > 0.5 ? '#FF6347' : '#FF8C00'};
            `;
            
            this.containers.embers.appendChild(ember);
        }
    }
    
    initRunesGlow() {
        // 符文发光效果
        const runes = ['ᚱ', 'ᚢ', 'ᚾ', 'ᛁ', 'ᚲ'];
        
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.3) return;
            
            const rune = document.createElement('div');
            rune.textContent = runes[Math.floor(Math.random() * runes.length)];
            
            const x = Math.random() * 90 + 5;
            const y = Math.random() * 90 + 5;
            
            rune.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                font-size: ${Math.random() * 30 + 20}px;
                color: #FFD700;
                opacity: 0;
                text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
                animation: witcherRuneFade 4s ease-out forwards;
                font-family: serif;
            `;
            
            this.containers.runes.appendChild(rune);
            setTimeout(() => rune.remove(), 4000);
        }, 3000);
        
        this.intervals.push(interval);
    }
    
    initGwentCards() {
        // 昆特牌飘落效果
        const interval = setInterval(() => {
            if (!this.isActive || Math.random() > 0.1) return;
            
            const card = document.createElement('div');
            card.innerHTML = `
                <svg viewBox="0 0 60 90" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="56" height="86" rx="4" 
                          fill="rgba(26, 15, 15, 0.9)" 
                          stroke="rgba(196, 30, 58, 0.8)" 
                          stroke-width="2" />
                    <text x="30" y="50" font-size="24" fill="rgba(255,215,0,0.6)" 
                          text-anchor="middle" font-family="Cinzel">♠</text>
                </svg>
            `;
            
            const x = Math.random() * 90 + 5;
            const rotation = Math.random() * 360;
            const duration = Math.random() * 10 + 8;
            
            card.style.cssText = `
                position: absolute;
                width: 60px;
                height: 90px;
                left: ${x}%;
                top: -100px;
                opacity: 0;
                transform: rotate(${rotation}deg);
                animation: witcherCardFall ${duration}s linear forwards;
                filter: drop-shadow(0 0 5px rgba(196, 30, 58, 0.5));
            `;
            
            this.containers.cards.appendChild(card);
            setTimeout(() => card.remove(), duration * 1000);
        }, 8000);
        
        this.intervals.push(interval);
    }
    
    destroy() {
        this.isActive = false;
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        if (this.containers.main) {
            this.containers.main.remove();
        }
        
        console.log('⚔️ 巫师3特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) {
            this.containers.main.style.display = enable ? 'block' : 'none';
        }
    }
}

// 注入CSS动画
const witcher3StyleSheet = document.createElement('style');
witcher3StyleSheet.textContent = `
    @keyframes witcherWolfEmblemAppear {
        0%, 90% {
            opacity: 0;
            transform: scale(0.8);
        }
        95% {
            opacity: 0.5;
            transform: scale(1.1);
        }
        100% {
            opacity: 0;
            transform: scale(1);
        }
    }
    
    @keyframes witcherSignFlash {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        20% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }
    
    @keyframes witcherQuenPulse {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        30% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.5);
        }
    }
    
    @keyframes witcherSwordSlashV {
        0% {
            top: -200px;
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            top: 110%;
            opacity: 0;
        }
    }
    
    @keyframes witcherSwordSlashH {
        0% {
            left: -200px;
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            left: 110%;
            opacity: 0;
        }
    }
    
    @keyframes witcherEmberFloat {
        0% {
            bottom: -10px;
            opacity: 0;
            transform: translateX(0) scale(0);
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            bottom: 110%;
            opacity: 0;
            transform: translateX(${Math.random() * 100 - 50}px) scale(1);
        }
    }
    
    @keyframes witcherRuneFade {
        0% {
            opacity: 0;
            transform: scale(0.5) rotate(0deg);
        }
        30% {
            opacity: 0.8;
            transform: scale(1) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(1.2) rotate(360deg);
        }
    }
    
    @keyframes witcherCardFall {
        0% {
            top: -100px;
            opacity: 0;
            transform: rotate(0deg);
        }
        10% {
            opacity: 0.7;
        }
        90% {
            opacity: 0.7;
        }
        100% {
            top: 110%;
            opacity: 0;
            transform: rotate(720deg);
        }
    }
    
    .witcher3-effects-container * {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(witcher3StyleSheet);

// 全局实例
let witcher3Effects = null;

function initWitcher3EffectsIfNeeded() {
    const isWitcherTheme = document.body.classList.contains('theme-witcher') || 
                          localStorage.getItem('gameboxTheme') === 'witcher';
    
    if (isWitcherTheme) {
        if (witcher3Effects) {
            witcher3Effects.destroy();
        }
        witcher3Effects = new Witcher3EffectsSystem();
        console.log('✅ 巫师3特效系统已自动启动');
    } else if (witcher3Effects) {
        witcher3Effects.destroy();
        witcher3Effects = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWitcher3EffectsIfNeeded);
} else {
    initWitcher3EffectsIfNeeded();
}

window.addEventListener('themeChanged', function(e) {
    if (e.detail && e.detail.themeId === 'witcher') {
        if (witcher3Effects) {
            witcher3Effects.destroy();
        }
        witcher3Effects = new Witcher3EffectsSystem();
    } else if (witcher3Effects) {
        witcher3Effects.destroy();
        witcher3Effects = null;
    }
});

if (typeof window !== 'undefined') {
    window.Witcher3EffectsSystem = Witcher3EffectsSystem;
    window.witcher3Effects = witcher3Effects;
}
