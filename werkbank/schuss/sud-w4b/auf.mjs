// auf.mjs — Klappt das eigene Brett noch auf und zu, und tritt der Zettel
// dabei richtig zurueck? (Gegenprobe zur Stempel-Sicherung.)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
for (const e of [1,4]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(1600);
  const st=()=>s.evaluate(()=>{const z=document.querySelector('.sud-zettel');
    const o=[...document.querySelectorAll('button[data-zug^="sud:"]')]
      .filter(k=>k.getAttribute('data-zug').split(':').length===3 && !k.disabled).length;
    return {brettZu:window.BRAUHAUS.SUD_ZUSTAND.brettZu,
      zettel:z?(z.getBoundingClientRect().width>3?'im Bild':'weg'):'fehlt',
      brettOptionenBedienbar:o};});
  const reiter=async()=>{await s.evaluate(()=>{const k=document.querySelector('button[data-zug="stadt:reiter:sud-sud-brett"]');
    if(k){k.disabled=false;k.click();}}); await s.waitForTimeout(700);};
  console.log('E'+e+' start : '+JSON.stringify(await st()));
  await reiter(); console.log('E'+e+' auf   : '+JSON.stringify(await st()));
  await reiter(); console.log('E'+e+' zu    : '+JSON.stringify(await st()));
  await reiter(); console.log('E'+e+' auf 2 : '+JSON.stringify(await st()));
  await s.close();
}
await b.close();
