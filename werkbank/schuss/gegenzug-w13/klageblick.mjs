import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor:1 });
await seite.goto('http://127.0.0.1:8934/spiel/?epoche=1&saat=1350&neu=1', { waitUntil:'networkidle' });
await seite.waitForTimeout(1300);
const klick = async z => { const l = await seite.evaluate(zz=>{const e=document.querySelector(`[data-zug="${zz}"]`);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width)return null;const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);return{x:cx,y:cy,aus:e.disabled,hit:!!(t&&(t===e||e.contains(t)))};},z); if(!l||l.aus||!l.hit)return false; await seite.mouse.move(l.x,l.y,{steps:4}); await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up(); await seite.waitForTimeout(240); return true; };
for (let i=0;i<60;i++){
  const r = await seite.evaluate(()=>{
    const e=document.querySelector('[data-zug="gegner:beschwerde-bild"]');
    const L=BRAUHAUS.gegner.lage();
    const b=Object.keys(L.bindung).map(k=>k+':'+(L.bindung[k].mittel));
    return {j:BRAUHAUS.welt.zeit.jahr,w:BRAUHAUS.welt.zeit.woche,kasse:BRAUHAUS.welt.haus.kasse,
      klage: e?(e.disabled?'aus':'an'):'fehlt', bJahr:L.beschwerdeJahr,
      deck: (function(){ if(!e) return null; const b=e.getBoundingClientRect(); if(!b.width) return 'keine Flaeche';
        const t=document.elementFromPoint(b.left+b.width/2, b.top+b.height/2);
        if(!t) return 'nichts'; if(t===e||e.contains(t)) return 'frei';
        let d=t,k=[]; while(d&&k.length<3){k.push(String(d.className||d.tagName)); d=d.parentElement;} return k.join(' < '); })(),
      box: (function(){ const b=e?e.getBoundingClientRect():null; return b?[Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)]:null; })(),
      bindungen:b, werbung:Object.keys(L.werbung),
      marken: Object.keys((L.haeuser.adler||{}).marken||{})};
  });
  if (r.j===1351 && r.w>=20) console.log(JSON.stringify(r));
  if(!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken'); await klick('weiter');
}
await browser.close();
