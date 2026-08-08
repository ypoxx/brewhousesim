import { neuerBrowser, neueSeite, adresse, gehezu, klickZug } from './lib.mjs';

async function leseZiel(page) {
  return await page.evaluate(() => {
    const z = document.querySelector('.zielzeile');
    return z ? { da: true, text: z.textContent } : { da: false };
  });
}

const browser = await neuerBrowser();

console.log('--- Variante A: erst "Anfangen" klicken, dann WEITER (3 Wiederholungen) ---');
for (let lauf = 0; lauf < 3; lauf++) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  await klickZug(page, 'kern:anfangen');
  await klickZug(page, 'weiter');
  const z1 = await leseZiel(page);
  await klickZug(page, 'weiter');
  const z2 = await leseZiel(page);
  console.log('lauf', lauf, 'nach 1. WEITER:', z1.da, '| nach 2. WEITER:', z2.da);
  await context.close();
}

console.log('--- Variante B: OHNE "Anfangen" zu klicken, direkt WEITER (Zettel geht automatisch weg) ---');
for (let lauf = 0; lauf < 3; lauf++) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  await klickZug(page, 'weiter');
  const z1 = await leseZiel(page);
  await klickZug(page, 'weiter');
  const z2 = await leseZiel(page);
  console.log('lauf', lauf, 'nach 1. WEITER:', z1.da, '| nach 2. WEITER:', z2.da);
  await context.close();
}

console.log('--- Variante C: wie A, aber mit LAENGERER Wartezeit (300ms) nach jedem WEITER ---');
for (let lauf = 0; lauf < 2; lauf++) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  await klickZug(page, 'kern:anfangen');
  await klickZug(page, 'weiter');
  await page.waitForTimeout(300);
  const z1 = await leseZiel(page);
  console.log('lauf', lauf, 'nach 1. WEITER + 300ms:', z1.da, z1.text ? z1.text.slice(0,40) : null);
  await context.close();
}

await browser.close();
