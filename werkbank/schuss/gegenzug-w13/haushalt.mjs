import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8932';
const browser = await chromium.launch();
for (const [b,h] of [[1600,900],[2752,1536]]) {
  const seite = await browser.newPage({ viewport: { width: b, height: h } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push(String(e).slice(0,160)));
  seite.on('console', m => { if (m.type()==='error') fehler.push('console: '+m.text().slice(0,160)); });
  for (const ep of [1,2,3,4]) {
    await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
    await seite.waitForTimeout(1000);
    const klick = async z => { const l = await seite.evaluate(zz=>{const e=document.querySelector(`[data-zug="${zz}"]`);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);return{x:cx,y:cy,aus:e.disabled,hit:!!(t&&(t===e||e.contains(t)))};},z); if(!l||l.aus||!l.hit)return false; await seite.mouse.click(l.x,l.y); await seite.waitForTimeout(200); return true; };
    for (let i=0;i<12;i++){ if(!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen'); await klick('fuhre:abschicken'); await klick('weiter'); }
    const r = await seite.evaluate(() => {
      const H = BRAUHAUS.haushalt || {};
      const eig = (f) => { try { const v = f(); return Array.isArray(v) ? v.filter(x => /gegner|gg-/.test(JSON.stringify(x))) : v; } catch(e){ return 'FEHLER '+e; } };
      return { lage: BRAUHAUS.lage.length, lageTexte: BRAUHAUS.lage.slice(0,3),
        pruefe: (()=>{try{const p=H.pruefe();return typeof p==='object'?JSON.stringify(p).slice(0,300):String(p).slice(0,300);}catch(e){return 'n/a';}})(),
        tafelnGegner: eig(()=>H.tafeln()), ueberRandGegner: eig(()=>H.ueberRand()),
        a3: (document.querySelector('[data-stueck="gegner"]')||{getAttribute:()=>null}).getAttribute('data-a3zonen'),
        zonen: (BRAUHAUS.gegner.zonen ? BRAUHAUS.gegner.zonen() : {griffe:[],beschriftungen:[]}) };
    });
    console.log(`${b}x${h} E${ep} lage=${r.lage} a3zonen=${r.a3} griffe=${r.zonen.griffe.length} beschr=${r.zonen.beschriftungen.length}`);
    console.log('   pruefe:', r.pruefe);
    console.log('   tafeln(gegner):', JSON.stringify(r.tafelnGegner).slice(0,200));
    console.log('   ueberRand(gegner):', JSON.stringify(r.ueberRandGegner).slice(0,300));
    if (r.lage) console.log('   LAGE:', JSON.stringify(r.lageTexte).slice(0,300));
  }
  console.log(`${b}x${h}  Seitenfehler ${fehler.length}`, fehler.slice(0,3));
  await seite.close();
}
await browser.close();
