import { neuerBrowser, neueSeite, adresse, BASIS, zuege } from './lib.mjs';

const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await page.goto(adresse({ epoche: 1, saat: 1350, neu: true }), { waitUntil: 'load' });
await page.waitForSelector('#buehne[data-bereit="1"]', { timeout: 10000 });
const t0 = Date.now();
for (const marke of [0, 100, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000]) {
  const warte = marke - (Date.now() - t0);
  if (warte > 0) await page.waitForTimeout(warte);
  const l = await zuege(page);
  console.log('t=' + (Date.now() - t0) + 'ms  zuege=' + l.length);
}
await context.close();
await browser.close();
