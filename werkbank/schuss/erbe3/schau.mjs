/* Bild + Geometrie: Leiste treffbar, Band nicht abgeschnitten, Buch nicht ueberlaufend. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const p = await b.newPage({ viewport:{width:2752,height:1536} });
  const fehler=[]; p.on('pageerror',x=>fehler.push(x.message));
  p.on('console',m=>{if(m.type()==='error')fehler.push(m.text());});
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(500);
  const r = await p.evaluate(()=>{
    const L=document.querySelector('.erb-leiste'), Bd=L.querySelector('.erb-band');
    const box=L.getBoundingClientRect();
    const treffer=[...document.querySelectorAll('.erb-leiste button[data-zug]')].map(k=>{
      const q=k.getBoundingClientRect(); const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
      const pr=k.querySelector('.preis');
      return {zug:k.getAttribute('data-zug'), trifft: !!t&&(t===k||k.contains(t)), aus:k.disabled,
              preis: pr?pr.innerText.trim():'', pTrifft: pr?(()=>{const s=pr.getBoundingClientRect();
                const y=document.elementFromPoint(s.left+s.width/2,s.top+s.height/2); return !!y&&(y===pr||k.contains(y));})():null};
    });
    return { leiste:{x:(box.left/window.innerWidth*100).toFixed(1), y:(box.top/window.innerHeight*100).toFixed(1),
                     w:(box.width/window.innerWidth*100).toFixed(1), h:(box.height/window.innerHeight*100).toFixed(1)},
             bandScroll: Bd.scrollWidth, bandClient: Bd.clientWidth,
             bandScrollH: Bd.scrollHeight, bandClientH: Bd.clientHeight,
             leisteScrollH: L.scrollHeight, leisteClientH: L.clientHeight,
             treffer, band: Bd.innerText.replace(/\s+/g,' ') };
  });
  console.log(`E${e} Leiste x${r.leiste.x} y${r.leiste.y} ${r.leiste.w}x${r.leiste.h} % (Flaeche ${(r.leiste.w*r.leiste.h/100).toFixed(2)} %)`);
  console.log(`   Band ${r.bandScroll}/${r.bandClient} px breit, ${r.bandScrollH}/${r.bandClientH} px hoch · Leiste innen ${r.leisteScrollH}/${r.leisteClientH}`);
  console.log(`   ${r.band}`);
  r.treffer.forEach(t=>console.log(`   ${t.trifft?'TRIFFT':'VERDECKT'} ${t.aus?'aus':'an '} ${t.zug} ${t.preis} ${t.preis?(t.pTrifft?'(Preis sichtbar)':'(PREIS VERDECKT)'):''}`));
  // Buch aufschlagen
  const rb = await p.$('button[data-zug="stadt:reiter:erbe-blatt-erb-buch"]');
  if (rb) { await rb.click().catch(()=>{}); await p.waitForTimeout(200); }
  const rr = await p.evaluate(()=>{const q=document.querySelector('.erb-buch');
    return q?{s:q.scrollHeight,c:q.clientHeight, sichtbar: getComputedStyle(q).display}:null;});
  console.log(`   Buch ${rr? rr.s+'/'+rr.c+' px ('+(rr.s>rr.c?'LAEUFT UEBER':'passt')+')' : 'fehlt'}`);
  await p.screenshot({path:`werkbank/schuss/erbe3/blatt-e${e}.png`});
  await p.evaluate(()=>{const q=document.querySelector('.erb-buch'); if(q) q.scrollIntoView();});
  console.log(`   lage ${await p.evaluate(()=>BRAUHAUS.lage.length)} fehler ${fehler.length} ${fehler.slice(0,2).join(' | ')}`);
  await p.close();
}
await b.close();
