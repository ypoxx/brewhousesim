import { neuerBrowser, neueSeite, adresse, gehezu, zuege, klickZug } from './lib.mjs';
const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
const vor = await zuege(page);
await klickZug(page, 'weiter'); // zettelWeg wird auch ueber 'woche' ausgeloest
await page.mouse.move(2, 2);
await page.waitForTimeout(150);
const nach = await zuege(page);
console.log('Klick auf WEITER (nicht Anfangen): vor', vor.length, 'nach', nach.length);
const vorSet = new Set(vor.map(z => z.zug));
const nachSet = new Set(nach.map(z => z.zug));
console.log('NEU:', [...nachSet].filter(z => !vorSet.has(z)));
console.log('WEG:', [...vorSet].filter(z => !nachSet.has(z)));
await context.close();
await browser.close();
