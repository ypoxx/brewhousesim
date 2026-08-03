import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = process.argv[2] || '1';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const fehler = [];
p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
p.on('pageerror', e => fehler.push('PAGEERROR ' + e.message));
await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.BRAUHAUS && window.BRAUHAUS.ton, null, { timeout: 15000 });
await p.waitForTimeout(1500);

const info = await p.evaluate(() => {
  const B = window.BRAUHAUS;
  const zuege = [...document.querySelectorAll('[data-zug]')].map(e => ({
    zug: e.dataset.zug, txt: (e.textContent || '').trim().slice(0, 40),
    tag: e.tagName, klasse: e.className, sichtbar: !!(e.offsetWidth || e.offsetHeight)
  }));
  return {
    lage: B.lage ? B.lage.length : 'kein-lage',
    lageInhalt: B.lage ? B.lage.slice(0, 5) : null,
    zeit: B.welt && B.welt.zeit ? { epoche: B.welt.zeit.epoche, jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche } : null,
    tonStumm: B.ton.stumm, tonBereit: B.ton.bereit(), pegel: B.ton.pegel(),
    katalog: B.ton.katalog ? B.ton.katalog().length : null,
    zuege
  };
});
console.log(JSON.stringify({ epoche: EP, fehler, ...info }, null, 1));
await b.close();
