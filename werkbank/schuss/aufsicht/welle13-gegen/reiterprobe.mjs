/* Was macht ein Klick auf einen fremden Reiter mit der liegenden Michaelitafel? */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8931';
const b = await chromium.launch();
const s = await b.newPage({ viewport:{width:1600,height:900} });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=1&saat=1350`,{waitUntil:'networkidle'});
await s.waitForTimeout(1300);
async function klick(z){const l=await s.evaluate(z=>{const e=document.querySelector(`[data-zug="${z}"]`);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width||!r.height)return null;const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);return{x:cx,y:cy,aus:!!e.disabled,hit:!!(t&&(t===e||e.contains(t)))};},z);
if(!l||l.aus||!l.hit)return false;await s.mouse.move(l.x,l.y,{steps:4});await s.mouse.down();await s.waitForTimeout(55);await s.mouse.up();await s.waitForTimeout(320);return true;}
const lese=()=>s.evaluate(()=>{const B=window.BRAUHAUS;let liegt=0,knopf=null,greifbar=0;
  document.querySelectorAll('[data-zug]').forEach(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
    const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);
    if(!(t&&(t===el||el.contains(t))))return; if(el.disabled)return; greifbar++;
    const z=el.getAttribute('data-zug');
    if(/^preis:(nimm|festlege|nichts|tafel-zu):?/.test(z))liegt++;
    if(z==='preis:tafel')knopf=(el.innerText||'').trim().replace(/\s+/g,' ');});
  return {jahr:B.welt.zeit.jahr,woche:B.welt.zeit.woche,tafelKnoepfe:liegt,greifbar,knopf};});
for(let i=0;i<30;i++){ if(!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen'); await klick('fuhre:abschicken'); await klick('weiter'); }
console.log('nach dem Jahreswechsel     :', JSON.stringify(await lese()));
for (const r of ['stadt:reiter:sud-sud-brett','stadt:reiter:fuhre-fu-brett-fu-keller','stadt:reiter:name-nm-band','stadt:reiter:gegner-amort-gg-band']) {
  const ok = await klick(r);
  console.log('nach Klick auf', r.replace('stadt:reiter:',''), '(gegriffen='+ok+') :', JSON.stringify(await lese()));
}
await b.close();
