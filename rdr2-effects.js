/**
 * 🤠 荒野大镖客2视觉特效系统
 * 标志性特效：西部日落、风沙、亚瑟剪影、通缉令
 */

class RDR2EffectsSystem {
    constructor(options = {}) {
        this.config = {
            sunset: true,
            dust: true,
            silhouette: true,
            wanted: true,
            tumbleweeds: true,
            particleCount: options.particleCount || 30,
            ...options
        };
        this.containers = {};
        this.isActive = false;
        this.intervals = [];
        this.init();
    }
    
    init() {
        console.log('🤠 RDR2特效系统初始化...');
        this.createContainers();
        if (this.config.sunset) this.initSunset();
        if (this.config.dust) this.initDust();
        if (this.config.silhouette) this.initSilhouette();
        if (this.config.wanted) this.initWanted();
        if (this.config.tumbleweeds) this.initTumbleweeds();
        this.isActive = true;
        console.log('✅ RDR2特效系统启动完成！');
    }
    
    createContainers() {
        const main = document.createElement('div');
        main.className = 'rdr2-effects-container';
        main.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;overflow:hidden;';
        
        ['sunset', 'dust', 'silhouette', 'wanted'].forEach(name => {
            const c = document.createElement('div');
            c.style.cssText = 'position:absolute;width:100%;height:100%;';
            main.appendChild(c);
            this.containers[name] = c;
        });
        
        document.body.appendChild(main);
        this.containers.main = main;
    }
    
    initSunset() {
        const sunset = document.createElement('div');
        sunset.style.cssText = `
            position:absolute;width:100%;height:300px;bottom:0;
            background:linear-gradient(to top, rgba(212,175,55,0.2), transparent);
            opacity:0.6;filter:blur(30px);
        `;
        this.containers.sunset.appendChild(sunset);
    }
    
    initDust() {
        for (let i = 0; i < this.config.particleCount; i++) {
            const dust = document.createElement('div');
            const size = Math.random() * 3 + 1;
            dust.style.cssText = `
                position:absolute;width:${size}px;height:${size}px;
                background:#D4AF37;border-radius:50%;
                left:${Math.random()*100}%;bottom:-10px;opacity:0;
                animation:rdr2DustFloat ${Math.random()*20+15}s linear ${Math.random()*10}s infinite;
                box-shadow:0 0 ${size*2}px #D4AF37;
            `;
            this.containers.dust.appendChild(dust);
        }
    }
    
    initSilhouette() {
        const silhouette = document.createElement('div');
        silhouette.innerHTML = `
            <svg viewBox="0 0 200 200"><defs>
            <linearGradient id="rdrGrad"><stop offset="0%" style="stop-color:#D4AF37;stop-opacity:0.3"/>
            <stop offset="100%" style="stop-color:#8B4513;stop-opacity:0.1"/></linearGradient></defs>
            <ellipse cx="100" cy="60" rx="20" ry="25" fill="url(#rdrGrad)"/>
            <rect x="90" y="80" width="20" height="50" fill="url(#rdrGrad)"/>
            <ellipse cx="100" cy="40" rx="25" ry="15" fill="url(#rdrGrad)"/>
            </svg>`;
        silhouette.style.cssText = `
            position:absolute;width:250px;height:250px;left:10%;bottom:15%;
            opacity:0.15;filter:blur(2px);animation:rdr2SilhouetteBreathe 8s ease-in-out infinite;
        `;
        this.containers.silhouette.appendChild(silhouette);
    }
    
    initWanted() {
        const wanted = document.createElement('div');
        wanted.innerHTML = `
            <div style="width:150px;height:200px;background:rgba(61,40,23,0.7);
            border:3px solid #D4AF37;padding:10px;font-family:serif;text-align:center;">
            <div style="color:#D4AF37;font-size:24px;font-weight:900;margin-bottom:10px;">WANTED</div>
            <div style="color:#F5DEB3;font-size:16px;margin:10px 0;">DEAD OR ALIVE</div>
            <div style="color:#D4AF37;font-size:32px;font-weight:900;">$5000</div>
            </div>`;
        wanted.style.cssText = `
            position:absolute;top:20px;right:20px;opacity:0;
            animation:rdr2WantedFade 12s ease-in-out infinite;
        `;
        this.containers.wanted.appendChild(wanted);
    }
    
    initTumbleweeds() {
        setInterval(() => {
            if (!this.isActive || Math.random() > 0.2) return;
            const weed = document.createElement('div');
            weed.textContent = '🌿';
            weed.style.cssText = `
                position:absolute;font-size:${Math.random()*20+20}px;
                left:-50px;bottom:${Math.random()*20+10}%;opacity:0.6;
                animation:rdr2TumbleweedRoll ${Math.random()*8+6}s linear forwards;
            `;
            this.containers.dust.appendChild(weed);
            setTimeout(() => weed.remove(), 15000);
        }, 5000);
    }
    
    destroy() {
        this.isActive = false;
        this.intervals.forEach(i => clearInterval(i));
        if (this.containers.main) this.containers.main.remove();
        console.log('🤠 RDR2特效系统已停止');
    }
    
    toggle(enable) {
        this.isActive = enable;
        if (this.containers.main) this.containers.main.style.display = enable ? 'block' : 'none';
    }
}

const rdr2Styles = document.createElement('style');
rdr2Styles.textContent = \`
    @keyframes rdr2DustFloat {
        0%{bottom:-10px;opacity:0;}10%{opacity:0.5;}90%{opacity:0.5;}
        100%{bottom:110%;opacity:0;transform:translateX(\${Math.random()*100-50}px);}
    }
    @keyframes rdr2SilhouetteBreathe {
        0%,100%{opacity:0.1;transform:scale(0.95);}50%{opacity:0.25;transform:scale(1.05);}
    }
    @keyframes rdr2WantedFade {
        0%,90%{opacity:0;}95%{opacity:0.8;}100%{opacity:0;}
    }
    @keyframes rdr2TumbleweedRoll {
        0%{left:-50px;opacity:0.6;transform:rotate(0deg);}
        100%{left:110%;opacity:0;transform:rotate(1080deg);}
    }
    .rdr2-effects-container * {will-change:transform,opacity;}
\`;
document.head.appendChild(rdr2Styles);

let rdr2Effects = null;

function initRDR2EffectsIfNeeded() {
    const isRDR2 = document.body.classList.contains('theme-rdr2') || localStorage.getItem('gameboxTheme') === 'rdr2';
    if (isRDR2) {
        if (rdr2Effects) rdr2Effects.destroy();
        rdr2Effects = new RDR2EffectsSystem();
        console.log('✅ RDR2特效已启动');
    } else if (rdr2Effects) {
        rdr2Effects.destroy();
        rdr2Effects = null;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRDR2EffectsIfNeeded);
} else {
    initRDR2EffectsIfNeeded();
}

window.addEventListener('themeChanged', e => {
    if (e.detail?.themeId === 'rdr2') {
        if (rdr2Effects) rdr2Effects.destroy();
        rdr2Effects = new RDR2EffectsSystem();
    } else if (rdr2Effects) {
        rdr2Effects.destroy();
        rdr2Effects = null;
    }
});

if (typeof window !== 'undefined') {
    window.RDR2EffectsSystem = RDR2EffectsSystem;
    window.rdr2Effects = rdr2Effects;
}
