/* Wie viele Wochen einer Partie sind die vier Knoepfe der Leiste NICHT
   vom Mauszeiger zu treffen — und wer deckt sie? */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();
for (const ep of [1,2,3,4]) {
  const p=await b.newPage({viewport:{width:2752,height:1536}});
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
    await e.click().catch(()=>{}); await p.waitForTimeout(25); return true;};
  await k('stadt:reiter:erbe-blatt-erb-buch');
  for(let r=0;r<6;r++){ const z=await p.evaluate(()=>{const l=[...document.querySelectorAll('button[data-zug^="erbe:verschreibe:"]')].filter(x=>!x.disabled); return l.length?l[0].getAttribute('data-zug'):null;}); if(!z)break; await k(z); }
  await k('erbe:uebergabe:leibgeding');
  let w=0, verdeckt=0; const decker={};
  for(let i=0;i<100;i++){
    const r=await p.evaluate(()=>{const L=document.querySelector('.erb-leiste'); const bad=[];
      L.querySelectorAll('button').forEach(k=>{const q=k.getBoundingClientRect();
        const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
        if(!(t&&(t===k||k.contains(t)))) bad.push(t? ((t.closest('[data-stueck]')||{getAttribute:()=>'?'}).getAttribute('data-stueck')+' '+(t.className||t.tagName)) : 'nichts');});
      return bad;});
    w++; if(r.length){verdeckt++; r.forEach(x=>decker[x]=(decker[x]||0)+1);}
    if(await p.evaluate(()=>BRAUHAUS.welt.zeit.ende))break;
    if(!await k('weiter'))break;
  }
  console.log(`E${ep}: ${verdeckt}/${w} Wochen mindestens ein Leistenknopf verdeckt · ${JSON.stringify(decker)}`);
  await p.close();
}
await b.close();
