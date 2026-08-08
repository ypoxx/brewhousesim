import { neuerBrowser, neueSeite, adresse, gehezu, klickZug } from './lib.mjs';

async function leseZiel(page) {
  return await page.evaluate(() => {
    const z = document.querySelector('.zielzeile');
    return z ? { da: true } : { da: false };
  });
}
async function leseZeit(page) {
  return await page.evaluate(() => {
    const w = window.BRAUHAUS.welt;
    return { jahr: w.zeit.jahr, woche: w.zeit.woche };
  });
}

const browser = await neuerBrowser();
for (const e of [{ epoche: 3, saat: 1884 }, { epoche: 4, saat: 1970 }]) {
  for (let lauf = 0; lauf < 2; lauf++) {
    const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
    await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));
    await klickZug(page, 'kern:anfangen');
    const luecken = [];
    for (let i = 1; i <= 65; i++) {
      const r = await klickZug(page, 'weiter');
      if (!r.gegriffen) break;
      const z = await leseZiel(page);
      const t = await leseZeit(page);
      if (!z.da) luecken.push(t.jahr + '/' + t.woche);
    }
    console.log('epoche', e.epoche, 'lauf', lauf, 'Luecken:', JSON.stringify(luecken));
    await context.close();
  }
}
await browser.close();
