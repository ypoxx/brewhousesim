/* TRITT DER ERBFALL EIN? — gemessen mit einem Haken auf welt.erbe und auf
   dem Ereignis 'erbfall', nicht im Quelltext gelesen.

   HAFEN=8899 node werkbank/schuss/erbe/erbfall.mjs <epoche> <wochen> [stil]
   stil: 'weiter' (nur WEITER)  |  'alles' (jeder freie, aktive Zug jede Woche)
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 1), WOCHEN = +(process.argv[3] || 140), STIL = process.argv[4] || 'weiter';
const HAFEN = process.env.HAFEN || '8899';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
s.on('pageerror', e => fehler.push('pageerror: ' + e.message));

await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(700);

/* DER HAKEN. Vor dem ersten Klick gesetzt. */
await s.evaluate(() => {
  const W = BRAUHAUS.welt;
  window.__erbe = { rufe: [], ereignisse: [] };
  const alt = W.erbe.bind(W);
  W.erbe = function () {
    window.__erbe.rufe.push({ jahr: W.zeit.jahr, woche: W.zeit.woche,
      vorher: W.zeit.amtszeit && W.zeit.amtszeit.name, stapel: new Error().stack.split('\n').slice(1, 4).join(' | ') });
    return alt();
  };
  BRAUHAUS.auf('erbfall', d => window.__erbe.ereignisse.push({
    jahr: W.zeit.jahr, woche: W.zeit.woche, neu: d && d.amtszeit && d.amtszeit.name }));
});

const start = await s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  amt: { ...BRAUHAUS.welt.zeit.amtszeit }
}));

let klicks = 0, gedrueckt = 0;
for (let w = 0; w < WOCHEN; w++) {
  if (STIL === 'alles') {
    gedrueckt += await s.evaluate(() => {
      let n = 0;
      for (const e of document.querySelectorAll('[data-zug]')) {
        if (e.disabled) continue;
        const z = e.getAttribute('data-zug');
        if (z === 'weiter' || z.startsWith('stadt:reiter')) continue;
        const q = e.getBoundingClientRect(); if (!q.width) continue;
        const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        if (!(t && (t === e || e.contains(t)))) continue;
        e.click(); n++;
        if (n > 6) break;
      }
      return n;
    });
    await s.waitForTimeout(40);
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
  await s.waitForTimeout(45);
  klicks++;
  if (!ok) break;
}

const r = await s.evaluate(() => {
  const W = BRAUHAUS.welt;
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende, endgrund: W.zeit.endgrund || null,
    kasse: W.haus.kasse,
    amt: { ...W.zeit.amtszeit },
    erbe: window.__erbe,
    chronikErbfall: W.chronik.filter(c => c.art === 'erbfall').length,
    lage: BRAUHAUS.lage.length
  };
});

console.log(JSON.stringify({ epoche: EP, stil: STIL, klicks, gedrueckt, start, ...r, seitenfehler: fehler.length, fehler: fehler.slice(0, 3) }, null, 1));
await b.close();
