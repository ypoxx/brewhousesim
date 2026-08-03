// export.mjs — Der Fall des Kritikers: 1970, beide teuren Festlegungen gekauft.
// Steht dann am Brett, dass im Keller trotzdem kein Exportbier liegt?
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
const s=await b.newPage({viewport:{width:1920,height:1080}});
await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=4&saat=1350`,{waitUntil:'networkidle',timeout:60000});
await s.waitForTimeout(1400);
await s.evaluate(()=>{const k=document.querySelector('button[data-zug="stadt:reiter:sud-sud-brett"]');
  if(k){k.disabled=false;k.click();}});
await s.waitForTimeout(700);
for (const z of ['sud:fuehrung:rechner','sud:behandlung:pasteur']) {
  await s.evaluate((zz)=>{ window.BRAUHAUS.welt.haus.kasse = 5000000;
    window.BRAUHAUS.sende('zeichne',{grund:'probe'}); }, z);
  await s.waitForTimeout(500);
  await s.evaluate((zz)=>{const k=document.querySelector(`button[data-zug="${zz}"]`);
    if(k){k.disabled=false;k.click();}}, z);
  await s.waitForTimeout(600);
}
await s.waitForTimeout(900);
const r=await s.evaluate(()=>({
  verfahren: window.BRAUHAUS.sud.verfahren(),
  kopf: (document.querySelector('.sud-wirte .sud-frage')||{}).textContent,
  zeilen: [...document.querySelectorAll('.sud-wirte .sud-warnung, .sud-wirte .sud-fussnote')].map(x=>x.textContent)
}));
console.log(JSON.stringify(r,null,1));
await b.close();
