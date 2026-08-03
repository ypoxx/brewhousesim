import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = process.argv[2] || '1', saat = process.argv[3] || '1350';
const tabs = (process.argv[4] || '').split(',').filter(Boolean);
const wochen = +(process.argv[5] || 0);
const marke = process.argv[6] || 'brett';
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
for (let i = 0; i < wochen; i++) { await seite.locator('[data-zug="weiter"]').first().click(); await seite.waitForTimeout(110); }
for (const t of tabs) { try { await seite.locator(`[data-zug*="${t}"]`).first().click({ timeout: 3000 }); await seite.waitForTimeout(350); } catch (e) { console.log('FEHL', t, String(e).split('\n')[0]); } }
await seite.waitForTimeout(500);
const r = await seite.evaluate(() => {
  const sichtbar = (el) => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none'); };
  return [...document.querySelectorAll('[data-zug]')].filter(sichtbar).map(el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return [el.getAttribute('data-zug'), el.getAttribute('data-preis') ?? '', el.disabled ? 'AUS' : 'an', (t === el || el.contains(t)) ? 'oben' : 'VERDECKT', (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70)].join(' | '); });
});
console.log(r.join('\n'));
console.log('--- TEXT DER OFFENEN BRETTER ---');
console.log(await seite.evaluate(() => (document.getElementById('ebene-kopf').innerText + '\n@@@\n' + document.getElementById('ebene-blatt').innerText).replace(/\s*\n\s*/g, ' | ').slice(0, 4000)));
await seite.screenshot({ path: `${out}/${marke}.png` });
console.log('KASSE', await seite.evaluate(() => BRAUHAUS.welt.haus.kasse), await seite.evaluate(() => BRAUHAUS.welt.zeit.jahr + '/' + BRAUHAUS.welt.zeit.woche));
await browser.close();
