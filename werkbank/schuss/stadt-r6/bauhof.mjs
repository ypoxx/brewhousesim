/* Der Bauhof mit echten Mausklicks: kommt ein Bau wirklich in den Hof, kostet
   er wirklich Geld, und steht er danach auf seinem Boden?
     node werkbank/schuss/stadt-r6/bauhof.mjs                                  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

for (const ep of [1, 2, 3, 4]) {
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,
    { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  const vorher = await seite.evaluate(() => BRAUHAUS.stadt.stehend().length);
  const kasse0 = await seite.evaluate(() => BRAUHAUS.welt.haus.kasse);
  const knoepfe = seite.locator('.stadt-bauhof button[data-zug^="stadt:bau:"]:not([disabled])');
  const n = await knoepfe.count();
  let gekauft = 0;
  for (let i = 0; i < Math.min(n, 3); i++) {
    const k = seite.locator('.stadt-bauhof button[data-zug^="stadt:bau:"]:not([disabled])').first();
    if (!await k.count()) break;
    const zug = await k.getAttribute('data-zug');
    const oben = await seite.evaluate(([x, y]) => {
      const el = document.elementFromPoint(x, y);
      return el ? (el.closest('[data-zug]') || {}).dataset?.zug || el.tagName : null;
    }, await k.boundingBox().then((b) => [b.x + b.width / 2, b.y + b.height / 2]));
    await k.click();
    await seite.waitForTimeout(250);
    const steht = await seite.evaluate((z) =>
      BRAUHAUS.stadt.hat(z.split(':').pop()), zug);
    console.log(`  E${ep} ${zug.padEnd(28)} elementFromPoint: ${String(oben).padEnd(28)}`
      + ` steht danach: ${steht}`);
    if (steht) gekauft++;
  }
  const nachher = await seite.evaluate(() => BRAUHAUS.stadt.stehend().length);
  const kasse1 = await seite.evaluate(() => BRAUHAUS.welt.haus.kasse);
  const lot = await seite.evaluate(() => BRAUHAUS.stadt.boden.fehler());
  console.log(`E${ep}: ${vorher} -> ${nachher} Bauten, Kasse ${kasse0} -> ${kasse1}`
    + `, ${gekauft} gekauft, Lot-Fehler: ${lot.length}`);
  if (lot.length) console.log('   ' + JSON.stringify(lot));
}
await browser.close();
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n')
  : 'keine Fehler auf der Seite');
