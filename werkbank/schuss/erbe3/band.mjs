/* Schlimmster Fall fuer das Band: erloschene Verschreibungen UND ein laufendes
   Leibgeding gleichzeitig. Passt es noch in die 5,6 % hohe Leiste? */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();
for (const ep of [1,2,3,4]) {
  const p=await b.newPage({viewport:{width:2752,height:1536}});
  const f=[]; p.on('pageerror',e=>f.push(e.message));
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
    await e.click().catch(()=>{}); await p.waitForTimeout(35); return true;};
  await k('stadt:reiter:erbe-blatt-erb-buch');
  /* alles verschreiben, was geht, dann Leibgeding */
  for(let r=0;r<6;r++){ const z=await p.evaluate(()=>{const l=[...document.querySelectorAll('button[data-zug^="erbe:verschreibe:"]')].filter(x=>!x.disabled); return l.length?l[0].getAttribute('data-zug'):null;}); if(!z)break; await k(z); }
  await k('erbe:uebergabe:leibgeding');
  let schlimm=null;
  for(let i=0;i<95;i++){
    const r=await p.evaluate(()=>{const L=document.querySelector('.erb-leiste'),B=L.querySelector('.erb-band');
      const bad=[...L.querySelectorAll('button[data-zug]')].filter(k=>{const q=k.getBoundingClientRect();
        const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2); return !(t&&(t===k||k.contains(t)));});
      return {teile:B.children.length, sH:L.scrollHeight, cH:L.clientHeight,
        bsH:B.scrollHeight, bcH:B.clientHeight, verdeckt:bad.map(x=>x.getAttribute('data-zug')),
        txt:B.innerText.replace(/\s+/g,' ')};});
    if(!schlimm||r.teile>schlimm.teile||r.sH>schlimm.sH) schlimm=r;
    if(r.verdeckt.length) { console.log(`E${ep} VERDECKT`, r.verdeckt); break; }
    if(await p.evaluate(()=>BRAUHAUS.welt.zeit.ende))break;
    if(!await k('weiter'))break;
  }
  console.log(`E${ep}: max ${schlimm.teile} Bandteile, Leiste innen ${schlimm.sH}/${schlimm.cH} px, Band ${schlimm.bsH}/${schlimm.bcH} px · ${schlimm.sH>schlimm.cH?'LAEUFT UEBER':'passt'} · fehler ${f.length}`);
  console.log(`   ${schlimm.txt}`);
  await p.close();
}
await b.close();
