// DIE PLATZORDNUNG, gemessen: wie viele Bretter bleiben nebeneinander offen,
// und ist dann noch jeder Zug erreichbar?
//
//   node werkbank/schuss/stadt-r7/platzordnung.mjs
//
// Verfahren: alle Reiter der Reihe nach anklicken (wie ein Spieler, der alles
// aufschlagen will), dann zaehlen — offene Bretter, und von allen [data-zug]
// die, deren Mittelpunkt wirklich sich selbst trifft.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const BREITE = +(process.env.BREITE || 1920), HOEHE = +(process.env.HOEHE || 1000);

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(String(e).slice(0, 120)));
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&stumm=1`,
    { waitUntil: 'networkidle' });
  await seite.waitForTimeout(900);

  const reiter = await seite.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map((e) => e.getAttribute('data-zug')));
  for (const r of reiter) {
    const l = await seite.evaluate((z) => {
      const e = document.querySelector(`[data-zug="${z}"]`);
      if (!e || e.disabled) return null;
      const q = e.getBoundingClientRect();
      return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
    }, r);
    if (l) { await seite.mouse.click(l.x, l.y); await seite.waitForTimeout(90); }
  }
  await seite.waitForTimeout(400);

  const d = await seite.evaluate(() => {
    const lage = BRAUHAUS.stadt.rahmen.lage();
    const offen = Object.keys(lage).filter((k) => lage[k] === 'auf');
    let da = 0, weg = 0;
    const verdeckt = [];
    document.querySelectorAll('[data-zug]').forEach((el) => {
      const z = el.getAttribute('data-zug');
      if (/^stadt:reiter:/.test(z)) return;
      const q = el.getBoundingClientRect();
      if (!q.width || !q.height) return;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      if (t && (t === el || el.contains(t) || t.contains(el))) da++;
      else { weg++; verdeckt.push(z); }
    });
    return { offen, bretter: Object.keys(lage).length, da, weg, verdeckt: verdeckt.slice(0, 8),
             lage: BRAUHAUS.lage.length };
  });

  console.log(`Epoche ${ep}: ${d.offen.length} von ${d.bretter} Brettern offen [${d.offen.join(', ')}]`);
  console.log(`   Zuege erreichbar ${d.da}, verdeckt ${d.weg}` +
    (d.weg ? '  — ' + d.verdeckt.join(', ') : '') +
    `   BRAUHAUS.lage ${d.lage}  Seitenfehler ${fehler.length}`);
  await seite.close();
}
await browser.close();
