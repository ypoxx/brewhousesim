import { neuerBrowser, neueSeite, adresse, gehezu, zuege, klickZug } from './lib.mjs';

const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));

const vorher = await zuege(page);
const stadtVor = await page.evaluate(() => {
  const el = document.querySelector('[data-zug="stadt:alles-zuklappen"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, disabled: el.disabled,
    topTag: top ? top.tagName : null, topKlasse: top ? String(top.className) : null,
    topZug: top ? (top.closest('[data-zug]') || {}).getAttribute?.('data-zug') : null };
});
console.log('VOR Klick, stadt:alles-zuklappen:', JSON.stringify(stadtVor, null, 2));

await klickZug(page, 'kern:anfangen');
// Maus WEG vom Spielfeld, damit kein Hover-Zustand die Zaehlung verfaelscht
await page.mouse.move(2, 2);
await page.waitForTimeout(150);

const nachher = await zuege(page);
const stadtNach = await page.evaluate(() => {
  const el = document.querySelector('[data-zug="stadt:alles-zuklappen"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, disabled: el.disabled,
    topTag: top ? top.tagName : null, topKlasse: top ? String(top.className) : null,
    topZug: top ? (top.closest('[data-zug]') || {}).getAttribute?.('data-zug') : null };
});
console.log('NACH Klick + Maus weg, stadt:alles-zuklappen:', JSON.stringify(stadtNach, null, 2));

console.log('Zuege vorher:', vorher.length, 'nachher:', nachher.length);
const vorZuege = new Set(vorher.map(z => z.zug));
const nachZuege = new Set(nachher.map(z => z.zug));
const neu = [...nachZuege].filter(z => !vorZuege.has(z));
const weg = [...vorZuege].filter(z => !nachZuege.has(z));
console.log('NEU nach Klick (' + neu.length + '):', neu);
console.log('WEG nach Klick (' + weg.length + '):', weg);

await context.close();
await browser.close();
