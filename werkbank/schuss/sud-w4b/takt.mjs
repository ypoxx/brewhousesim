// takt.mjs — Kostet die Platzsuche des Kesselzettels Bildzeit?
// Misst die Bildrate ueber 3 s, im Vorgabestand und mit allen fremden
// Brettern offen (dann sucht der Zettel wirklich).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
for (const e of [1]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(1500);
  const miss=()=>s.evaluate(()=>new Promise((f)=>{
    const t=[]; let n=0, v=performance.now();
    const g=()=>{ const jetzt=performance.now(); t.push(jetzt-v); v=jetzt;
      if (++n<180) requestAnimationFrame(g);
      else { t.sort((a,b)=>a-b);
        f({ n, median:+t[Math.floor(t.length/2)].toFixed(1),
            p95:+t[Math.floor(t.length*0.95)].toFixed(1), max:+t[t.length-1].toFixed(1) }); } };
    requestAnimationFrame(g);
  }));
  console.log('  Vorgabestand      : '+JSON.stringify(await miss()));
  const reiter=await s.evaluate(()=>[...document.querySelectorAll('[data-zug^="stadt:reiter:"]')]
    .map(k=>k.getAttribute('data-zug')).filter(x=>!/sud-sud-brett/.test(x)));
  for (const r of reiter) { await s.evaluate((z)=>{const k=document.querySelector(`button[data-zug="${z}"]`);
    if(k){k.disabled=false;k.click();}},r); await s.waitForTimeout(80); }
  await s.waitForTimeout(1200);
  console.log('  alle Bretter offen: '+JSON.stringify(await miss()));
  await s.close();
}
await b.close();
