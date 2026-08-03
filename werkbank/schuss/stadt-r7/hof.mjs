// Der Hof allein: alle fremden Faecher ausgeblendet, damit man sieht, was
// DIE STADT malt — und nicht, was ein Brett davor legt.
//
//   node werkbank/schuss/stadt-r7/hof.mjs <epoche> <ziel.png> [bau] [beschnitt]
//
// beschnitt = "x0,y0,x1,y1" in Bezugspixeln (2752x1536); ohne = ganzes Bild.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const [ep = '1', ziel = '/tmp/hof.png', bau = 'alle', beschnitt = ''] = process.argv.slice(2);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&bau=${bau}&stumm=1`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1400);

await seite.evaluate(() => {
  document.querySelectorAll('[id^="fach-"]').forEach((f) => {
    if (!/-stadt$/.test(f.id)) f.style.visibility = 'hidden';
  });
  const w = document.querySelector('.stadt-werkbank');
  if (w) w.style.visibility = 'hidden';
});
await seite.waitForTimeout(200);

const lage = await seite.evaluate(() => BRAUHAUS.lage.length);
const opt = { path: ziel };
if (beschnitt) {
  const [x0, y0, x1, y1] = beschnitt.split(',').map(Number);
  opt.clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
}
await seite.screenshot(opt);
await browser.close();

console.log(ziel + '  lage=' + lage);
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n') : 'keine Fehler auf der Seite');
