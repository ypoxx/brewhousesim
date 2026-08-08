/* Die weiche Abnahme in einem Aufwasch: haushalt.pruefe(), tafeln(),
   ueberRand(), lage, Seitenfehler — je Epoche, nach 12 gespielten Wochen
   ueber die Wochenkarte (kein Reiterklick).
   HAFEN=8923 node haushalt.mjs <epoche> [wochen]                          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 12);
const HAFEN = process.env.HAFEN || '8923';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);
async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 3 });
  await seite.mouse.down(); await seite.waitForTimeout(50); await seite.mouse.up();
  await seite.waitForTimeout(220);
  return true;
}
await klick('kern:anfangen');
for (let i = 0; i < N; i++) {
  const plaene = await seite.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="fuhre:plan:"]')]
      .filter(e => !e.disabled).map(e => e.getAttribute('data-zug')));
  if (await klick('fuhre:sommer-zu')) continue;
  if (plaene.length) { await klick(plaene[0]); continue; }
  await klick('weiter');
}
const erg = await seite.evaluate(() => {
  const B = window.BRAUHAUS, h = B.haushalt || {};
  const nimm = (f) => { try { return typeof f === 'function' ? f() : null; } catch (e) { return 'FEHLER ' + e.message; } };
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
    pruefe: nimm(h.pruefe), tafeln: nimm(h.tafeln), ueberRand: nimm(h.ueberRand),
    lage: B.lage, zuege: document.querySelectorAll('[data-zug]').length };
});
console.log('E' + ep, JSON.stringify({ ...erg, fehler }).slice(0, 3000));
await browser.close();
