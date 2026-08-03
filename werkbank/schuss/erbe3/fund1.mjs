import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1376,height:768} });
await p.goto('http://127.0.0.1:8899/spiel/?epoche=1&saat=1350', { waitUntil:'networkidle' });
await p.waitForTimeout(400);
const k = async z => { const e = await p.$(`button[data-zug="${z}"]`); if(!e) return false; await e.click().catch(()=>{}); await p.waitForTimeout(50); return true; };
await k('stadt:reiter:erbe-blatt-erb-buch');
await k('erbe:verschreibe:ochse');
await k('erbe:verschreibe:pfarrhof');
for (let i=0;i<24;i++){
  const s = await p.evaluate(()=>({
    j: BRAUHAUS.welt.zeit.jahr, w: BRAUHAUS.welt.zeit.woche,
    ochse: JSON.stringify(BRAUHAUS.welt.adresse('ochse').bindung),
    pfarr: JSON.stringify(BRAUHAUS.welt.adresse('pfarrhof').bindung)
  }));
  if ([0,9,10,11,19,20,21].includes(i)) console.log(i, s.j+'/'+s.w, 'ochse='+s.ochse, 'pfarrhof='+s.pfarr);
  await k('weiter');
}
const ch = await p.evaluate(()=>BRAUHAUS.welt.chronik.filter(c=>/Ochsen|Michael/.test(c.text)).map(c=>c.jahr+'/'+c.woche+' ['+c.art+'] '+c.text));
console.log(ch.join('\n'));
const buch = await p.evaluate(()=>{const e=document.querySelector('.erb-buch'); return e?e.innerText.replace(/\n+/g,' | '):null;});
console.log('--- BUCH ---\n'+buch);
await b.close();
