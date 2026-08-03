/* Aufsicht: in wie vielen Wochen ist eine Bierentscheidung mit mehr als EINEM
   Knopf wirklich bedienbar? Eigener Code. Bedienbar heisst hier streng:
   nicht gesperrt UND elementFromPoint trifft den Knopf selbst. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const WOCHEN = 120;
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1200);
  let gut = 0, gezaehlt = 0;
  for (let w = 0; w < WOCHEN; w++) {
    const r = await s.evaluate(() => {
      if (BRAUHAUS.welt.zeit.ende) return null;
      const knoepfe = [...document.querySelectorAll('[data-zug^="sud:"]')].filter(x => !x.disabled);
      const trifft = knoepfe.filter(x => {
        const c = x.getBoundingClientRect();
        if (!c.width || !c.height) return false;
        const t = document.elementFromPoint(c.left + c.width/2, c.top + c.height/2);
        return t && (t === x || x.contains(t));
      });
      return { n: trifft.length };
    });
    if (r === null) break;
    gezaehlt++;
    if (r.n >= 2) gut++;
    const wt = await s.$('[data-zug="weiter"]:not([disabled])');
    if (!wt) break;
    await wt.click({ timeout: 2000 }).catch(()=>{});
    await s.waitForTimeout(120);
  }
  console.log(`  E${e}: ${gut} von ${gezaehlt} Wochen mit >=2 treffbaren Bierknoepfen = ${(100*gut/(gezaehlt||1)).toFixed(1)} %`);
  await s.close();
}
await b.close();
