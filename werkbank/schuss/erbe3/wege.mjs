/* Die drei Wege einzeln, in allen vier Epochen. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();
for (const ep of [1,2,3,4]) for (const weg of ['leibgeding','abfindung','bruch']) {
  const p=await b.newPage({viewport:{width:1376,height:768}});
  const f=[]; p.on('pageerror',e=>f.push(e.message)); p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
    await e.click().catch(()=>{}); await p.waitForTimeout(35); return true;};
  await k('stadt:reiter:erbe-blatt-erb-buch');
  for(let i=0;i<4;i++) await k('weiter');
  const ok = await k('erbe:uebergabe:'+weg);
  let leer=0, summe=0, n=0;
  for(let i=0;i<95;i++){
    const z=await p.evaluate(()=>{let c=0;
      document.querySelectorAll('button[data-zug^="erbe:"]').forEach(k=>{
        const r=k.getBoundingClientRect(); if(r.width<2)return;
        const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
        if(!t||(t!==k&&!k.contains(t))||k.disabled)return;
        if(k.querySelector('.preis'))c++;}); return c;});
    n++; summe+=z; if(z===0)leer++;
    if(await p.evaluate(()=>BRAUHAUS.welt.zeit.ende))break;
    if(!await k('weiter'))break;
  }
  const st=await p.evaluate(()=>({e:BRAUHAUS.erbe.stand(),kasse:BRAUHAUS.welt.haus.kasse,lage:BRAUHAUS.lage.length}));
  console.log(`E${ep} ${weg.padEnd(11)} geklickt=${ok} · Erbfaelle ${st.e.erbfaelle} · Leibgeding-Last ${st.e.leibgedingLast} (${st.e.leibgedinge.length} Stueck, verfallen ${st.e.leibgedinge.filter(x=>x.verfallen).length}) · gefallen ${st.e.gefallen.length} · erloschen ${st.e.erloschen.length} · Mittel ${(summe/n).toFixed(2)} (${leer}/${n} null) · Kasse ${st.kasse} · lage ${st.lage} · fehler ${f.length}`);
  await p.close();
}
await b.close();
