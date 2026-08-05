/* IST DER PROZESSRECHNER ERREICHBAR? — ein Spielstil, der auf ihn hin spart.
   Gekauft wird NUR die Achse `fuehrung`: erst das Labor (42.000), dann der
   Rechner (dann 76.000 dank Anrechnung). Kein Filter, kein Pasteur, kein
   Gaertank — jede DM bleibt fuer die eine Karte liegen.
     HAFEN=8901 node .../rechner.mjs <wochen> <ziel.json>                     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const WOCHEN = +(process.argv[2] || 400);
const ZIEL = process.argv[3] || 'werkbank/schuss/sud-blind-r2/rechner.json';
const HAFEN = process.env.HAFEN || '8901';
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const s = await b.newPage({ viewport: { width: 1366, height: 768 } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=4&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1300);
const ruhe = async (ms = 90) => { await s.waitForTimeout(Math.min(ms, 50));
  try { await s.evaluate(() => new Promise(f => { let a=false; const g=()=>{if(!a){a=true;f(1);}};
    setTimeout(g,2000); requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(g,0))); })); } catch(e){} };
const mitte = z => s.evaluate(q => { const el=document.querySelector(`[data-zug="${q}"]`);
  if(!el) return null; const r=el.getBoundingClientRect(); if(!r.width||!r.height) return null;
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const t=(cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight)?document.elementFromPoint(cx,cy):null;
  return {x:cx,y:cy,aus:!!el.disabled,hit:!!(t&&(t===el||el.contains(t))),
    preis: el.hasAttribute('data-preis')?+el.getAttribute('data-preis'):null,
    text:(el.innerText||'').trim().replace(/\s+/g,' ').slice(0,50)}; }, z);
async function reiterAuf(){ for(let i=0;i<4;i++){
  const o=await s.evaluate(()=>{const f=document.getElementById('fach-hand-sud');const x=f?f.firstElementChild:null;
    return x?!x.classList.contains('stadt-zugeklappt'):null;});
  if(o) return true; const l=await mitte('stadt:reiter:sud-sud-brett');
  if(!l||l.aus||!l.hit) return false; await s.mouse.click(l.x,l.y); await ruhe(180);} return false; }
const kasse = () => s.evaluate(()=>window.BRAUHAUS.welt.haus.kasse);
const jahr  = () => s.evaluate(()=>({j:window.BRAUHAUS.welt.zeit.jahr,w:window.BRAUHAUS.welt.zeit.woche,
  ende:!!window.BRAUHAUS.welt.zeit.ende, v:window.BRAUHAUS.sud.verfahren('fuehrung')}));
await reiterAuf();
const log=[]; let kmax=0, laborAb=null, rechnerAb=null, rechnerJeSichtbar=0;
for(let w=0; w<WOCHEN; w++){
  const z=await jahr(); if(z.ende){ log.push({w,ende:true}); break; }
  await reiterAuf();
  const k=await kasse(); if(k>kmax) kmax=k;
  const lab=await mitte('sud:fuehrung:labor'), rec=await mitte('sud:fuehrung:rechner');
  if(rec && !rec.aus && rec.hit) rechnerJeSichtbar++;
  /* erst Rechner, wenn er geht — sonst Labor */
  if(rec && !rec.aus && rec.hit){ const kv=await kasse(); await s.mouse.click(rec.x,rec.y); await ruhe(220);
    const kn=await kasse(); rechnerAb={jahr:z.j,woche:z.w,schild:rec.preis,abgebucht:kv-kn,text:rec.text}; }
  else if(!rechnerAb && lab && !lab.aus && lab.hit && z.v==='erfahrung'){
    const kv=await kasse(); await s.mouse.click(lab.x,lab.y); await ruhe(220);
    const kn=await kasse(); laborAb={jahr:z.j,woche:z.w,schild:lab.preis,abgebucht:kv-kn,text:lab.text}; }
  if(w%10===0) log.push({w,jahr:z.j,woche:z.w,kasse:k,verfahren:z.v,
    rechnerSchild: rec?rec.preis:null, rechnerAus: rec?rec.aus:null, rechnerHit: rec?rec.hit:null});
  const we=await mitte('weiter');
  if(!we||we.aus||!we.hit){ await ruhe(200); const w2=await mitte('weiter');
    if(!w2||w2.aus||!w2.hit){ log.push({w,abbruch:'WEITER nicht erreichbar'}); break; }
    await s.mouse.click(w2.x,w2.y); } else await s.mouse.click(we.x,we.y);
  await ruhe(70);
}
const ende=await jahr();
const erg={kasseMax:kmax, laborAb, rechnerAb, rechnerJeSichtbar, ende, fehler, log};
fs.writeFileSync(ZIEL, JSON.stringify(erg,null,1));
console.log('Kasse max:',kmax);
console.log('Labor gekauft:',JSON.stringify(laborAb));
console.log('Rechner gekauft:',JSON.stringify(rechnerAb));
console.log('Wochen, in denen der Rechner bedienbar war:',rechnerJeSichtbar);
console.log('Ende:',JSON.stringify(ende),'Fehler',fehler.length);
await b.close();
