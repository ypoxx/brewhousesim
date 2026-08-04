/* Wird die Kasse je rechnerisch negativ? — kern/welt.js:413 zieht den Unterhalt
   ungeprueft ab. Gemessen wird der TIEFSTE Zwischenstand je Epoche, nicht nur
   der Wochenschluss: der Vorgriff von DER PREIS faengt den Fall am selben
   Wochenwechsel wieder ab, also sieht man ihn wochenweise nicht.
   HAFEN=8980 node werkbank/schuss/aufsicht/kassenboden.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const WOCHEN = +(process.env.WOCHEN || 220);
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1000);
  // Jede Buchung mitschreiben: welt.protokolliere haengt sie an B.protokoll.
  let tiefst = Infinity, negWochen = 0, w = 0;
  for (; w < WOCHEN; w++) {
    const r = await s.evaluate(() => {
      if (BRAUHAUS.welt.zeit.ende) return null;
      return { kasse: BRAUHAUS.welt.haus.kasse };
    });
    if (r === null) break;
    if (r.kasse < tiefst) tiefst = r.kasse;
    if (r.kasse < 0) negWochen++;
    const wt = await s.$('[data-zug="weiter"]:not([disabled])');
    if (!wt) break;
    await wt.click({ timeout: 2000 }).catch(()=>{});
    await s.waitForTimeout(70);
  }
  // Und der tiefste Punkt AUS DEM PROTOKOLL, Buchung fuer Buchung nachgerechnet.
  const p = await s.evaluate(() => {
    const start = [112, 640, 14250, 86000][BRAUHAUS.welt.zeit.epoche - 1];
    let k = start, tief = start, wann = null;
    (BRAUHAUS.protokoll || []).forEach(x => {
      if (typeof x.preis === 'number' && !x.misslungen) {
        k += x.preis;
        if (k < tief) { tief = k; wann = (x.was || '') + ' (' + (x.wer||'') + ')'; }
      }
    });
    return { tief, wann, buchungen: (BRAUHAUS.protokoll||[]).length };
  });
  console.log(`  E${e}: ${w} Wochen · tiefste Wochenkasse ${tiefst} · ${negWochen} Wochen unter 0`);
  console.log(`       aus dem Protokoll nachgerechnet: tiefster Zwischenstand ${p.tief}` +
              (p.tief < 0 ? `  <-- NEGATIV bei: ${p.wann}` : ''));
  await s.close();
}
await b.close();
