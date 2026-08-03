import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:2752,height:1536}});
await p.goto('http://127.0.0.1:8899/spiel/?epoche=1&saat=1350',{waitUntil:'networkidle'});
await p.waitForTimeout(300);
const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
  await e.click().catch(()=>{}); await p.waitForTimeout(40); return true;};
await k('stadt:reiter:erbe-blatt-erb-buch');
await k('erbe:verschreibe:ochse'); await k('erbe:verschreibe:pfarrhof');
for(let i=0;i<22;i++) await k('weiter');
await p.screenshot({path:'werkbank/schuss/erbe3/beleg-erloschen.png'});
const st=await p.evaluate(()=>BRAUHAUS.erbe.stand());
console.log('erloschen:', JSON.stringify(st.erloschen,null,1));
console.log('BUCH-Auszug:', await p.evaluate(()=>{
  const l=document.querySelector('.erb-lade-erloschen'); return l?l.innerText.replace(/\n/g,' | '):'FEHLT';}));
await b.close();
