import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
 for (const saat of ['1350','7','99']) {
  const p = await b.newPage({ viewport:{width:1376,height:768} });
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${e}&saat=${saat}`, { waitUntil:'networkidle' });
  await p.waitForTimeout(300);
  const el = await p.$('button[data-zug="stadt:reiter:erbe-blatt-erb-buch"]');
  if (el) { await el.click().catch(()=>{}); await p.waitForTimeout(120); }
  const r = await p.evaluate(()=>{
    const kasse = BRAUHAUS.welt.haus.kasse;
    const preise = [];
    document.querySelectorAll('button[data-zug^="erbe:verschreibe:"]').forEach(k=>{
      const t = k.querySelector('.preis'); preise.push(t?t.innerText.trim():'');
    });
    const st = BRAUHAUS.erbe.stand();
    const P = document.querySelector('#buehne .erb-leiste') ? 'in-buehne' : 'NICHT-in-buehne';
    return { kasse, preise, wochenBisStunde: st.wochenBisStunde,
      amt: BRAUHAUS.welt.zeit.amtszeit.name + '/' + BRAUHAUS.welt.zeit.amtszeit.eigenschaft
        + ' bis ' + BRAUHAUS.welt.zeit.amtszeit.bis, P,
      faesser: BRAUHAUS.welt.vorrat.faesser.length };
  });
  const zahlen = r.preise.map(s=>parseFloat(s.replace(/[^\d,.-]/g,'').replace(/\./g,'').replace(',','.')));
  const summe = zahlen.reduce((a,x)=>a+Math.abs(x||0),0);
  console.log(`E${e} saat=${saat}: kasse ${r.kasse}, verschreibe ${r.preise.join(' ')} = ${summe} → ${(100*summe/r.kasse).toFixed(1)}% · Stunde in ${r.wochenBisStunde} W · ${r.amt} · Fässer ${r.faesser} · ${r.P}`);
  await p.close();
 }
}
await b.close();
