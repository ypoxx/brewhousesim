import { neuerBrowser, neueSeite, adresse, gehezu, zaehleTextzeilen } from './lib.mjs';

const browser = await neuerBrowser();
const faelle = [
  { epoche: 2, saat: 1600 },
  { epoche: 3, saat: 1884 }
];
for (const f of faelle) {
  console.log('--- epoche', f.epoche, '---');
  for (let i = 0; i < 6; i++) {
    const { page, context } = await neueSeite(browser, { breite: 1366, hoehe: 768 });
    await gehezu(page, adresse({ epoche: f.epoche, saat: f.saat, neu: true }));
    // laenger warten, um Fontladung/Reflow-Nachzuegler auszuschliessen
    await page.waitForTimeout(400);
    const t = await zaehleTextzeilen(page);
    console.log('lauf', i, 'textzeilen', t.anzahl);
    await context.close();
  }
}
await browser.close();
