import { neuerBrowser, neueSeite, adresse, gehezu, klickZug, weiterKlicken, zuege } from './lib.mjs';
const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: false }));
await klickZug(page, 'kern:anfangen');
await weiterKlicken(page, 6);

const vorZuege = await zuege(page);
const vorHatUmtrunk = vorZuege.find(z => z.zug === 'name:anschlag:umtrunk');
console.log('VOR Rueckfrage, name:anschlag:umtrunk in zuege()? ', !!vorHatUmtrunk, vorHatUmtrunk);

const vorInfo = await page.evaluate(() => {
  const el = document.querySelector('[data-zug="name:anschlag:umtrunk"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, topTag: top?.tagName, topKlasse: top ? String(top.className) : null, trifft: top === el || (top && el.contains(top)) };
});
console.log('VOR Rueckfrage, Rect+Treffer:', JSON.stringify(vorInfo));

await klickZug(page, 'kern:neu');
await page.waitForTimeout(80);

const nachZuege = await zuege(page);
const nachHatUmtrunk = nachZuege.find(z => z.zug === 'name:anschlag:umtrunk');
console.log('MIT Rueckfrage, name:anschlag:umtrunk in zuege()? ', !!nachHatUmtrunk, nachHatUmtrunk);

const nachInfo = await page.evaluate(() => {
  const el = document.querySelector('[data-zug="name:anschlag:umtrunk"]');
  if (!el) return { existiert: false };
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const top = document.elementFromPoint(cx, cy);
  const istKasten = top ? !!top.closest('.neu-frage') : false;
  return { existiert: true, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, topTag: top?.tagName, topKlasse: top ? String(top.className) : null, istKasten,
    disabled: el.disabled };
});
console.log('MIT Rueckfrage, Rect+Treffer:', JSON.stringify(nachInfo));

const kastenRect = await page.evaluate(() => {
  const k = document.querySelector('.neu-frage');
  const r = k.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
console.log('Kasten-Rect:', JSON.stringify(kastenRect));

await context.close();
await browser.close();
