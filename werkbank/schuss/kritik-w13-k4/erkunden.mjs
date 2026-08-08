// Erkundung: nur lesen, nichts zaehlen. Zeigt zuege() nach dem Laden.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const epoche = process.argv[2] || '1';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

const url = `http://127.0.0.1:8933/spiel/?epoche=${epoche}&saat=1350&neu=1`;
await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const zuege = await seite.evaluate(() => BRAUHAUS.zuege());
console.log('ZUEGE (' + zuege.length + '):');
for (const z of zuege) console.log(JSON.stringify(z));

const lage = await seite.evaluate(() => BRAUHAUS.lage.length);
console.log('lage.length=', lage);
console.log('Seitenfehler:', fehler.length ? fehler.join('\n') : 'keine');

const welt = await seite.evaluate(() => ({
  zeit: BRAUHAUS.welt.zeit, kasse: BRAUHAUS.welt.haus.kasse,
  naechsterZug: BRAUHAUS.welt.naechsterZug, bestesZiel: BRAUHAUS.welt.bestesZiel && BRAUHAUS.welt.bestesZiel()
}));
console.log('WELT:', JSON.stringify(welt, null, 2));

await browser.close();
