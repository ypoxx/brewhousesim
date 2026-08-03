/* Wie oft sagt die Kennzahl gar nichts? Vor der Kernaenderung fiel sie auf
   null, sobald die EINE gehaltene Meldung durch die Pruefung fiel.
   HAFEN=8900 node werkbank/schuss/aufsicht/kennzahl-luecken.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const WOCHEN = +(process.env.WOCHEN || 150);
const b = await chromium.launch();
let gesL = 0, gesW = 0;
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1100);
  let luecken = 0, w = 0, ohneText = 0;
  for (; w < WOCHEN; w++) {
    const r = await s.evaluate(() => {
      if (BRAUHAUS.welt.zeit.ende) return null;
      const d = BRAUHAUS.welt.zugDeckung();
      const z = BRAUHAUS.welt.naechsterZug;
      return { leer: d === null || d === undefined, ohneZug: !z };
    });
    if (r === null) break;
    if (r.leer) luecken++;
    if (r.ohneZug) ohneText++;
    const wt = await s.$('[data-zug="weiter"]:not([disabled])');
    if (!wt) break;
    await wt.click({ timeout: 2000 }).catch(()=>{});
    await s.waitForTimeout(80);
  }
  gesL += luecken; gesW += w;
  console.log(`  E${e}: ${luecken} von ${w} Wochen ohne Kennzahl (${(100*luecken/(w||1)).toFixed(1)} %), ${ohneText} ohne Zugtext`);
  await s.close();
}
await b.close();
console.log(`\n  gesamt: ${gesL} von ${gesW} Wochen ohne Kennzahl = ${(100*gesL/(gesW||1)).toFixed(2)} %`);
