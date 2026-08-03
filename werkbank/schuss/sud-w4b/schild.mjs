// schild.mjs — Was die Schilder dieses Stuecks behaupten (Auflage 3).
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
for (const e of [1,2,3,4]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(1500);
  // Brett aufschlagen
  await s.evaluate(()=>{const k=document.querySelector('button[data-zug="stadt:reiter:sud-sud-brett"]');
    if(k){k.disabled=false;k.click();}});
  await s.waitForTimeout(900);
  const r=await s.evaluate(()=>({
    raenge: [...document.querySelectorAll('.sud-rang')].map(x=>x.textContent),
    zettelraenge: [...document.querySelectorAll('.sud-zrangschild')].map(x=>x.textContent),
    wirte: [...document.querySelectorAll('.sud-wirte .sud-fussnote, .sud-wirte .sud-warnung')]
      .map(x=>x.textContent),
    traegtExport: document.body.innerText.match(/trägt [A-ZÄÖÜ][a-zäöüß]*bier/g) || []
  }));
  console.log('E'+e+' Ränge am Brett : '+JSON.stringify(r.raenge));
  console.log('     WAS BEIM WIRT  : '+r.wirte.map(x=>x.slice(0,150)).join('  ||  '));
  console.log('     "trägt Xbier"  : '+JSON.stringify(r.traegtExport));
  await s.close();
}
await b.close();
