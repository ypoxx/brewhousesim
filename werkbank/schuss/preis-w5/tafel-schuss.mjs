/* Die Michaelitafel aufschlagen und fotografieren — sonst sieht man von
   diesem Stueck nichts. HAFEN=8899 node tafel-schuss.mjs <epoche> <ziel.png> [jahr] */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const ZIEL = process.argv[3] || '/tmp/tafel.png';
const JAHR = process.argv[4] ? '&jahr=' + process.argv[4] : '';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const f = [];
s.on('pageerror', x => f.push(x.message));
s.on('console', m => { if (m.type() === 'error') f.push(m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350${JAHR}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1200);
await s.evaluate(() => {
  const g = document.querySelector('[data-zug="preis:tafel"]');
  if (g && !/schließen/.test(g.innerText || '')) g.click();
});
await s.waitForTimeout(900);
await s.screenshot({ path: ZIEL });
console.log(ZIEL, f.length ? 'FEHLER: ' + f.join(' | ') : 'keine Fehler auf der Seite');
await b.close();
