/* Liegt die Michaelitafel nach dem Jahreswechsel — und wie lange?
   Klickt sich bis zum Jahreswechsel, klickt WEITER, und liest danach OHNE
   weiteren Klick zu 12 Zeitpunkten ab. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8931';
const b = await chromium.launch();
const s = await b.newPage({ viewport:{width:1600,height:900} });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=1&saat=1350`,{waitUntil:'networkidle'});
await s.waitForTimeout(1300);
async function klick(z){const l=await s.evaluate(z=>{const e=document.querySelector(`[data-zug="${z}"]`);if(!e)return null;const r=e.getBoundingClientRect();if(!r.width||!r.height)return null;const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);return{x:cx,y:cy,aus:!!e.disabled,hit:!!(t&&(t===e||e.contains(t)))};},z);
if(!l||l.aus||!l.hit)return false;await s.mouse.move(l.x,l.y,{steps:4});await s.mouse.down();await s.waitForTimeout(55);await s.mouse.up();await s.waitForTimeout(240);return true;}
const lese=()=>s.evaluate(()=>{const B=window.BRAUHAUS;
  let liegt=false,knopf=null;
  document.querySelectorAll('[data-zug]').forEach(el=>{const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
    const cx=r.left+r.width/2,cy=r.top+r.height/2;const t=document.elementFromPoint(cx,cy);
    if(!(t&&(t===el||el.contains(t))))return;
    const z=el.getAttribute('data-zug');
    if(/^preis:(nimm|festlege):/.test(z)&&!el.disabled)liegt=true;
    if(z==='preis:tafel')knopf=(el.innerText||'').trim().replace(/\s+/g,' ');});
  return {jahr:B.welt.zeit.jahr,woche:B.welt.zeit.woche,liegt,knopf};});

// bis kurz vor den Jahreswechsel
for(let i=0;i<29;i++){ if(!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen'); await klick('fuhre:abschicken'); await klick('weiter'); }
console.log('vor dem Wechsel:', JSON.stringify(await lese()));
// der Klick, der das Jahr schliesst — danach nichts mehr anfassen
await s.evaluate(()=>{const e=document.querySelector('[data-zug="weiter"]');const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});
const p = await s.evaluate(()=>{const e=document.querySelector('[data-zug="weiter"]');const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};});
await s.mouse.move(p.x,p.y,{steps:4}); await s.mouse.down(); await s.waitForTimeout(55); await s.mouse.up();
const t0=Date.now();
for(const ms of [60,120,250,400,600,900,1300,1800,2500,3500,5000,8000]){
  const rest = ms-(Date.now()-t0); if(rest>0) await s.waitForTimeout(rest);
  const d=await lese();
  console.log(String(ms).padStart(5),'ms  jahr',d.jahr,'W'+d.woche,'liegt='+d.liegt,' knopf:',d.knopf);
}
await b.close();
