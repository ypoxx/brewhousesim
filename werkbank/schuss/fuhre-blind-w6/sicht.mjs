/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — WAS STEHT BEIM AUFSCHLAGEN IM BILD?

   Gerollter Text ist kein abgeschnittener Text — aber er ist auch nicht im
   Bild. Diese Messung zaehlt, wieviel von dem, was ein Brett fuehrt, beim
   Aufschlagen ohne Mausrad zu sehen ist:

     Adressen (.fu-haus) in .fu-liste
     Biersorten (.fu-sorte) in .fu-sorten
     Kaufknoepfe (.fu-kaeufe .knopf) im Kasten .fu-brett.fu-tafel

   Ein Ding gilt als „im Bild", wenn sein Kasten VOLLSTAENDIG im sichtbaren
   Bereich seines rollenden Elternteils UND im Fenster liegt.

     HAFEN=8900 BREITE=1366 HOEHE=768 node sicht.mjs <ziel.json>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8900';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'sicht.json';

const messung = (seite) => seite.evaluate(() => {
  const roller = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) {
      const c = getComputedStyle(n);
      if (c.overflowY === 'auto' || c.overflowY === 'scroll'
        || c.overflowX === 'auto' || c.overflowX === 'scroll') return n;
    }
    return null;
  };
  const zaehl = (was) => {
    const l = [...document.querySelectorAll(was)];
    let sicht = 0; const drunter = [];
    l.forEach(el => {
      const r = el.getBoundingClientRect();
      const p = roller(el);
      const pr = p ? p.getBoundingClientRect() : { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
      const drin = r.top >= pr.top - 1 && r.bottom <= pr.bottom + 1
        && r.top >= -1 && r.bottom <= innerHeight + 1;
      if (drin) sicht++;
      else drunter.push((el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 34));
    });
    return { alle: l.length, sicht, drunter };
  };
  return {
    adressen: zaehl('.fu-haus'),
    sorten: zaehl('.fu-tafel .fu-sorte'),
    kaeufe: zaehl('.fu-tafel .fu-kaeufe .knopf'),
    ziel: zaehl('.fu-ziel-karte'),
    fracht: zaehl('.fu-fracht .knopf')
  };
});

const browser = await chromium.launch();
const alles = { breite: BREITE, hoehe: HOEHE, epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1400);
  for (const b of ['fuhre-fu-brett-fu-haeuser', 'fuhre-fu-brett-fu-schiefer-fu-tafel',
                   'fuhre-fu-brett-fu-keller', 'fuhre-fu-brett-fu-wagen']) {
    try { await seite.click(`[data-zug="stadt:reiter:${b}"]`, { timeout: 2000 }); } catch (x) { }
    await seite.waitForTimeout(350);
  }
  await seite.waitForTimeout(600);
  const r = await messung(seite);
  alles.epochen[e] = r;
  console.log(`E${e} @${BREITE}x${HOEHE}: Adressen ${r.adressen.sicht}/${r.adressen.alle} · `
    + `Sorten ${r.sorten.sicht}/${r.sorten.alle} · Kaufknoepfe ${r.kaeufe.sicht}/${r.kaeufe.alle} · `
    + `Zielkarten ${r.ziel.sicht}/${r.ziel.alle} · Frachtstufen ${r.fracht.sicht}/${r.fracht.alle}`);
  if (r.sorten.drunter.length) console.log('    nicht im Bild (Sorten): ' + JSON.stringify(r.sorten.drunter));
  if (r.kaeufe.drunter.length) console.log('    nicht im Bild (Kauf):   ' + JSON.stringify(r.kaeufe.drunter));
  if (r.fracht.drunter.length) console.log('    nicht im Bild (Fracht): ' + JSON.stringify(r.fracht.drunter));
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
