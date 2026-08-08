import { neuerBrowser, neueSeite, adresse, gehezu, klickZug } from './lib.mjs';

async function leseZiel(page) {
  return await page.evaluate(() => !!document.querySelector('.zielzeile'));
}
async function leseZeit(page) {
  return await page.evaluate(() => {
    const w = window.BRAUHAUS.welt; return w.zeit.jahr + '/' + w.zeit.woche;
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
      const r = await klickZug(page, 'weiter'); // hat bereits 300ms
      if (!r.gegriffen) break;
      await page.waitForTimeout(400); // zusaetzliche Sicherheitsfrist, macht 700ms gesamt
      const da = await leseZiel(page);
      if (!da) luecken.push(await leseZeit(page));
    }
    console.log('epoche', e.epoche, 'lauf', lauf, 'Luecken (700ms gesamt je Klick):', JSON.stringify(luecken));
    await context.close();
  }
}
await browser.close();
