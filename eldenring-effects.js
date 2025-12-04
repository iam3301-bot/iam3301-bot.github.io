/**
 * 🗡️ 艾尔登法环特效系统 - 黄金树光芒、卢恩符文
 */
class EldenRingEffectsSystem {
    constructor() {
        this.init();
    }
    init() {
        console.log('🗡️ 艾尔登法环特效初始化...');
        const main = document.createElement('div');
        main.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:1;';
        
        // 黄金树光芒
        const tree = document.createElement('div');
        tree.style.cssText = \`position:absolute;width:300px;height:300px;top:10%;left:50%;
        transform:translateX(-50%);background:radial-gradient(circle, rgba(218,165,32,0.3), transparent);
        animation:erTreeGlow 8s ease-in-out infinite;\`;
        main.appendChild(tree);
        
        // 卢恩符文
        const runes = ['ᚱ','ᚢ','ᚾ','ᛁ','ᛋ'];
        for (let i = 0; i < 15; i++) {
            const rune = document.createElement('div');
            rune.textContent = runes[Math.floor(Math.random()*runes.length)];
            rune.style.cssText = \`position:absolute;left:\${Math.random()*100}%;top:\${Math.random()*100}%;
            font-size:\${Math.random()*25+15}px;color:rgba(218,165,32,0);font-family:serif;
            animation:erRuneFade \${Math.random()*6+4}s ease-in-out \${Math.random()*3}s infinite;\`;
            main.appendChild(rune);
        }
        
        document.body.appendChild(main);
        this.main = main;
        console.log('✅ 艾尔登法环特效启动');
    }
    destroy() { if (this.main) this.main.remove(); }
}

const erStyles = document.createElement('style');
erStyles.textContent = \`
@keyframes erTreeGlow { 0%,100%{opacity:0.6;transform:translateX(-50%) scale(1);}50%{opacity:1;transform:translateX(-50%) scale(1.2);} }
@keyframes erRuneFade { 0%,100%{color:rgba(218,165,32,0);}50%{color:rgba(218,165,32,0.7);} }
\`;
document.head.appendChild(erStyles);

let erEffects = null;
function initER() {
    const isER = document.body.classList.contains('theme-eldenring') || localStorage.getItem('gameboxTheme') === 'eldenring';
    if (isER && !erEffects) erEffects = new EldenRingEffectsSystem();
    else if (!isER && erEffects) { erEffects.destroy(); erEffects = null; }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initER);
else initER();
window.addEventListener('themeChanged', e => { if (e.detail?.themeId === 'eldenring') initER(); });
if (typeof window !== 'undefined') { window.EldenRingEffectsSystem = EldenRingEffectsSystem; window.erEffects = erEffects; }
