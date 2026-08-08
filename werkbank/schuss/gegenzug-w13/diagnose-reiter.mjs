/* DIAGNOSE R16 — warum steht die Zahl am Reiter OHNE DICH GESCHEHEN nur im
   ersten Braujahr? Spielt N Wochen ohne einen Reiter anzufassen und liest in
   jeder Woche den Kopf des Bandes, die Zeilen, die DIE STADT daraus macht,
   und die Aufschrift des Reiters.
   HAFEN=8924 node diagnose-reiter.mjs <epoche> <wochen>                     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 34);
const HAFEN = process.env.HAFEN || '8924';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const lese = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const band = document.querySelector('.gg-band');
  const kopf = band && band.firstElementChild;
  const reiter = document.querySelector('[data-zug="stadt:reiter:gegner-amort-gg-band"]');
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
    bandKlasse: band ? band.className : null,
    kopfKlasse: kopf ? kopf.className : null,
    kopfInner: kopf ? (kopf.innerText || '') : null,
    kopfText: kopf ? (kopf.textContent || '') : null,
    reiterText: reiter ? (reiter.innerText || '').trim().replace(/\s+/g, ' ') : null,
    reiterHtml: reiter ? reiter.innerHTML : null
  };
});
async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(240);
  return true;
}

for (let i = 0; i < N; i++) {
  const s = await lese();
  if (i >= N - 8 || i < 3) console.log(JSON.stringify(s, null, 1));
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
await browser.close();
