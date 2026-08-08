import { neuerBrowser, neueSeite, adresse, gehezu } from './lib.mjs';

const EPOCHEN = [
  { epoche: 1, saat: 1350 }, { epoche: 2, saat: 1600 },
  { epoche: 3, saat: 1884 }, { epoche: 4, saat: 1970 }
];
const browser = await neuerBrowser();
for (const e of EPOCHEN) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));
  await page.screenshot({ path: `/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/erster-schirm-e${e.epoche}-1600x900.png` });
  await context.close();
}
await browser.close();
console.log('fertig');
