/* Kurzer Blick: welche Bretter der FUHRE liegen offen, welche als Reiter?
   HAFEN=8923 node lage.mjs <epoche> [wochen] */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 0);
const HAFEN = process.env.HAFEN || '8923';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);
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
  await seite.waitForTimeout(200);
  return true;
}
for (let i = 0; i < N; i++) {
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
const lage = await seite.evaluate(() => {
  const raus = [];
  document.querySelectorAll('[id^="ebene-"] [data-stueck] > *').forEach(el => {
    const r = el.getBoundingClientRect();
    raus.push({ stueck: el.parentElement.getAttribute('data-stueck'),
      klassen: el.className, zu: el.classList.contains('stadt-zugeklappt'),
      w: Math.round(r.width), h: Math.round(r.height) });
  });
  const reiter = [];
  document.querySelectorAll('[data-zug^="stadt:reiter:"]').forEach(el => {
    reiter.push((el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60));
  });
  const B = window.BRAUHAUS;
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, bretter: raus, reiter,
    lage: B.lage, fuhre: B.fuhre ? B.fuhre.stand() : null };
});
console.log(JSON.stringify({ ...lage, fehler }, null, 1).slice(0, 6000));
await browser.close();
