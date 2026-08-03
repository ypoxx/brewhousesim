/* WIRD GEBRAUT? — die Frage, die dem ganzen Spiel zugrunde liegt.
   HAFEN=8900 node werkbank/schuss/aufsicht/gebraut.mjs <epoche> <wochen> <stil>
   stil: 'weiter' (nur WEITER) | 'brauend' (jede Woche jeden bezahlbaren Sud-Zug)

   Anlass: Am eingefrorenen Stand c6daa5a schliesst 1350 nach drei Braujahren
   mit 'Angestellt hat dieses Haus 0 Sude — 0 Fass Bier'. Endgrund
   'keine-abnehmer', Kasse -14 Pf. Die Frage ist, ob das am Spielstil liegt
   oder am Spiel.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1), WOCHEN = +(process.argv[3] || 100), STIL = process.argv[4] || 'weiter';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(800);

const reiter = await s.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

let gekauft = 0;
for (let w = 0; w < WOCHEN; w++) {
  if (STIL === 'brauend') {
    /* Brett fuer Brett: was DER SUD anbietet und bezahlbar ist, wird gedrueckt. */
    for (const r of reiter) {
      await s.evaluate(z => document.querySelector(`[data-zug="${z}"]`)?.click(), r);
      await s.waitForTimeout(40);
      gekauft += await s.evaluate(() => {
        let n = 0;
        for (const e of document.querySelectorAll('[data-zug^="sud:"]')) {
          if (e.disabled) continue;
          const q = e.getBoundingClientRect(); if (!q.width) continue;
          const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
          if (!(t && (t === e || e.contains(t)))) continue;
          e.click(); n++;
        }
        return n;
      });
      await s.waitForTimeout(40);
    }
  }
  const ok = await s.evaluate(() => {
    const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
      const q = e.getBoundingClientRect(); if (!q.width) return false;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return !!(t && (t === e || e.contains(t))); };
    const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
      if (e && !e.disabled) { e.click(); return true; } return false; };
    if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
    if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
      if (frei('weiter')) break; r.click();
    }
    return tu('weiter');
  });
  await s.waitForTimeout(50);
  if (!ok) break;
}
const r = await s.evaluate(() => {
  const W = BRAUHAUS.welt;
  const p = BRAUHAUS.protokoll || [];
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende, endgrund: W.zeit.endgrund || null,
    kasse: W.haus.kasse,
    sudeGebucht: p.filter(x => /sud|gebraut|angestellt/i.test(x.was || '')).length,
    /* vorrat.faesser ist eine Liste EINZELNER Faesser — ein Objekt je Fass,
       ohne Stueckzahlfeld. Ein erster Anlauf hat hier `f.n` summiert und
       darum immer 0 gemeldet, obwohl die Kopfzeile 'KELLER 3/12 Fass' zeigte. */
    fassImKeller: (W.vorrat && W.vorrat.faesser) ? W.vorrat.faesser.length : null,
    plaetze: W.vorrat ? W.vorrat.plaetze : null,
    sortenImKeller: (W.vorrat && W.vorrat.faesser)
      ? [...new Set(W.vorrat.faesser.map(f => f.sorte))] : null,
    chronik: W.chronik.length
  };
});
console.log(`E${EP} · ${STIL} · Sud-Klicks ${gekauft} ::`, JSON.stringify(r));
await b.close();
