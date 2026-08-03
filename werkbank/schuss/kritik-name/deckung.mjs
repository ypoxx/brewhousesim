import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = process.argv[2] || '1', saat = process.argv[3] || '1350';
const vor = (process.argv[4] || '').split(',').filter(Boolean); // Zuege, die vorher geklickt werden
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
for (const z of vor) {
  try { await seite.locator(`[data-zug="${z}"]`).first().click({ timeout: 4000 }); await seite.waitForTimeout(500); }
  catch (e) { console.log('KLICK FEHL', z, String(e).split('\n')[0]); }
}
const r = await seite.evaluate(() => {
  const kette = (el) => { const a = []; let c = el; while (c && c !== document.body) { a.push(c.tagName + '.' + (typeof c.className === 'string' ? c.className : '').split(' ').filter(Boolean).join('.')); c = c.parentElement; } return a.join(' < '); };
  return [...document.querySelectorAll('[data-zug^="name:"]')].map(el => {
    const b = el.getBoundingClientRect();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const top = document.elementFromPoint(cx, cy);
    return {
      zug: el.getAttribute('data-zug'), rect: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)],
      imFenster: b.x >= 0 && b.y >= 0 && b.right <= innerWidth && b.bottom <= innerHeight,
      selbst: kette(el),
      darueber: top ? kette(top) : null,
      trifft: top === el || el.contains(top),
      zIndexKette: (() => { let c = el, s = []; while (c && c !== document.body) { const g = getComputedStyle(c); if (g.zIndex !== 'auto' || g.position !== 'static') s.push(c.id || c.className.split(' ')[0] || c.tagName, g.position, g.zIndex); c = c.parentElement; } return s.join('/'); })(),
    };
  });
});
console.log(JSON.stringify(r, null, 1));
// Ausserdem: welches Element liegt ueber dem NAME-Band insgesamt
const band = await seite.evaluate(() => {
  const b = document.querySelector('.nm-band');
  if (!b) return 'kein .nm-band';
  const r = b.getBoundingClientRect();
  const s = getComputedStyle(b);
  return { rect: [r.x, r.y, r.width, r.height], pointerEvents: s.pointerEvents, overflow: s.overflow, elternPE: getComputedStyle(b.parentElement).pointerEvents, elternKlasse: b.parentElement.className, ebenePE: getComputedStyle(document.getElementById('ebene-kopf')).pointerEvents };
});
console.log('BAND:', JSON.stringify(band));
await browser.close();
