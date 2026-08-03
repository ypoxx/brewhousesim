/* Wann kommt das Angebot, und ist es dann zu beantworten? */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto('http://127.0.0.1:8899/spiel/?epoche=4&saat=1350', { waitUntil: 'networkidle' });
await s.waitForTimeout(700);
async function klick(z) {
  const l = await s.evaluate(zz => { const e=document.querySelector(`[data-zug="${zz}"]`); if(!e) return null;
    const q=e.getBoundingClientRect(); if(!q.width) return null;
    const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
    return {x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t)))}; }, z);
  if (!l||l.aus||!l.frei) return false;
  await s.mouse.click(l.x,l.y); await s.waitForTimeout(50); return true;
}
let wo = null;
for (let i=0;i<100;i++) {
  for (const z of ['preis:tafel-zu','kern:blatt-zu']) await klick(z);
  if (!await klick('weiter')) break;
  const a = await s.evaluate(()=>{const l=BRAUHAUS.gegner.lage(); return l.angebot?{...l.angebot, w:BRAUHAUS.welt.zeit.woche, j:BRAUHAUS.welt.zeit.jahr}:null;});
  if (a) { wo = a; break; }
}
console.log('Angebot:', JSON.stringify(wo));
if (wo) {
  // Was steht jetzt am Schirm, ohne irgendein Brett aufzuschlagen?
  let z = await s.evaluate(()=>BRAUHAUS.zuege().filter(x=>/angebot/.test(x.zug)));
  console.log('ohne Aufschlagen:', JSON.stringify(z));
  // Reiter der STADT durchgehen
  const reiter = await s.evaluate(()=>[...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e=>({z:e.getAttribute('data-zug'),t:(e.innerText||'').replace(/\s+/g,' ').slice(0,40)})));
  console.log('Reiter:', JSON.stringify(reiter));
  for (const r of reiter) {
    await klick(r.z);
    await s.waitForTimeout(120);
  }
  await klick('gegner:blatt');
  await s.waitForTimeout(200);
  z = await s.evaluate(()=>BRAUHAUS.zuege().filter(x=>/angebot/.test(x.zug)));
  console.log('nach Reiter+Blatt:', JSON.stringify(z));
  console.log('Blatt da?', await s.evaluate(()=>!!document.querySelector('.gg-blatt')));
}
await b.close();
