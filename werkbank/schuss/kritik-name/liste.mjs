import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = process.argv[2] || '1', saat = process.argv[3] || '1350', wochen = +(process.argv[4] || 0);
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
const reiter = await seite.$$eval('[data-zug^="stadt:reiter:"]', els => els.map(e => e.getAttribute('data-zug')));
for (const r of reiter) { try { await seite.locator(`[data-zug="${r}"]`).first().click({ timeout: 2000 }); await seite.waitForTimeout(120); } catch {} }
for (let i = 0; i < wochen; i++) { await seite.locator('[data-zug="weiter"]').first().click(); await seite.waitForTimeout(120); }
await seite.waitForTimeout(400);
const r = await seite.evaluate(() => {
  const sichtbar = (el) => {
    const b = el.getBoundingClientRect();
    if (b.width < 2 || b.height < 2) return false;
    if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false;
    const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none');
  };
  return [...document.querySelectorAll('[data-zug]')].filter(sichtbar).map(el => {
    const b = el.getBoundingClientRect();
    const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return [el.getAttribute('data-zug'), el.getAttribute('data-preis'), el.disabled ? 'AUS' : 'an',
      (t === el || el.contains(t)) ? 'oben' : 'VERDECKT', (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60)].join(' | ');
  });
});
console.log('ANZAHL', r.length);
console.log(r.join('\n'));
console.log('KASSE', await seite.evaluate(() => BRAUHAUS.welt.haus.kasse), 'JAHR', await seite.evaluate(() => BRAUHAUS.welt.zeit.jahr + '/' + BRAUHAUS.welt.zeit.woche));
await browser.close();
