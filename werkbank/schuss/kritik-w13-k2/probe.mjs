import { neuerBrowser, neueSeite, adresse, gehezu, zuege, lage, zaehleTextzeilen } from './lib.mjs';

const browser = await neuerBrowser();
const { page } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
const z = await zuege(page);
const l = await lage(page);
const t = await zaehleTextzeilen(page);
console.log('zuege:', z.length);
console.log('lage:', l.length, l);
console.log('fehler:', page.__fehler);
console.log('textzeilen:', t.anzahl);
console.log(JSON.stringify(t.zeilen.slice(0, 40), null, 1));
await page.screenshot({ path: '/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/probe-e1.png' });
await browser.close();
