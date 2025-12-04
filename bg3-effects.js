/**
 * 🎲 博德之门3特效系统 - D20骰子、魔法阵
 */
class BG3EffectsSystem {
    constructor() {
        this.isActive = false;
        this.init();
    }
    init() {
        console.log('🎲 BG3特效初始化...');
        const main = document.createElement('div');
        main.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;';
        
        // D20骰子
        for (let i = 0; i < 10; i++) {
            const dice = document.createElement('div');
            dice.textContent = ['🎲'][0];
            dice.style.cssText = \`position:absolute;font-size:\${Math.random()*20+15}px;
            left:\${Math.random()*100}%;top:-50px;opacity:0.7;
            animation:bg3DiceFall \${Math.random()*8+6}s linear \${Math.random()*5}s infinite;\`;
            main.appendChild(dice);
        }
        
        // 魔法阵
        const circle = document.createElement('div');
        circle.innerHTML = \`<svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(155,89,182,0.3)" stroke-width="2"/>
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(155,89,182,0.2)" stroke-width="1" stroke-dasharray="5,5"/>
        </svg>\`;
        circle.style.cssText = 'position:absolute;width:300px;height:300px;left:50%;top:50%;transform:translate(-50%,-50%);animation:bg3CircleRotate 20s linear infinite;opacity:0.4;';
        main.appendChild(circle);
        
        document.body.appendChild(main);
        this.main = main;
        this.isActive = true;
        console.log('✅ BG3特效启动');
    }
    destroy() { if (this.main) this.main.remove(); }
}

const bg3Styles = document.createElement('style');
bg3Styles.textContent = \`
@keyframes bg3DiceFall { 0%{top:-50px;opacity:0;}10%{opacity:0.7;}100%{top:110%;opacity:0;} }
@keyframes bg3CircleRotate { 0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);} }
\`;
document.head.appendChild(bg3Styles);

let bg3Effects = null;
function initBG3() {
    const isBG3 = document.body.classList.contains('theme-bg3') || localStorage.getItem('gameboxTheme') === 'bg3';
    if (isBG3 && !bg3Effects) bg3Effects = new BG3EffectsSystem();
    else if (!isBG3 && bg3Effects) { bg3Effects.destroy(); bg3Effects = null; }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initBG3);
else initBG3();
window.addEventListener('themeChanged', e => { if (e.detail?.themeId === 'bg3') initBG3(); });
if (typeof window !== 'undefined') { window.BG3EffectsSystem = BG3EffectsSystem; window.bg3Effects = bg3Effects; }
