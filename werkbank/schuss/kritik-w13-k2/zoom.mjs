import { neuerBrowser, neueSeite, adresse, gehezu } from './lib.mjs';
const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
await page.screenshot({
  path: '/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/zoom-zielzeile-e1.png',
  clip: { x: 950, y: 740, width: 650, height: 120 }
});
const rects = await page.evaluate(() => {
  const z = document.querySelector('.zielzeile');
  const d = document.querySelector('.deckung');
  return {
    ziel: z ? z.getBoundingClientRect() : null,
    ziel_text: z ? z.textContent : null,
    deckung: d ? d.getBoundingClientRect() : null,
    deckung_text: d ? d.textContent : null
  };
});
console.log(JSON.stringify(rects, null, 2));
await context.close();
await browser.close();
