// Blinder Kritiker DER PREIS, Welle 7 — Aufnahme des Schirms in Woche 1.
// Zaehlt am Schirm, nicht im Quelltext: alle [data-zug], ihre Sichtbarkeit,
// ihre Trefferflaeche, ihr Preisschild.
//
//   node schau.mjs <epoche> <ziel.json> [png] [breite] [hoehe]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const [ep = '1', ziel = 'schau.json', png = '', br = '1366', ho = '768'] = process.argv.slice(2);
const HAFEN = process.env.HAFEN || '8903';
const url = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: +br, height: +ho }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1200);

const daten = await seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) return false;
    return true;
  };
  const imFenster = (el) => {
    const r = el.getBoundingClientRect();
    return r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight;
  };
  const treffbar = (el) => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const o = document.elementFromPoint(x, y);
    return !!(o && (o === el || el.contains(o)));
  };
  const zuege = [...document.querySelectorAll('[data-zug]')].map((el) => {
    const r = el.getBoundingClientRect();
    const ps = el.querySelector('.preis');
    return {
      zug: el.getAttribute('data-zug'),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120),
      preisText: ps ? (ps.innerText || '').replace(/\s+/g, ' ').trim() : '',
      disabled: !!el.disabled,
      sollAus: el.getAttribute('data-soll-aus'),
      sichtbar: sichtbar(el),
      imFenster: imFenster(el),
      treffbar: treffbar(el),
      w: Math.round(r.width), h: Math.round(r.height),
      titel: el.getAttribute('title') || '',
    };
  });
  return {
    zeit: B ? JSON.parse(JSON.stringify(B.welt.zeit)) : null,
    haus: B ? { kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen, name: B.welt.haus.name } : null,
    lage: B ? B.lage.slice() : null,
    zuege,
    // alle sichtbaren Textknoten, die "Unterhalt"/"jedes Jahr"/"Michaeli" nennen
    volltext: document.body.innerText,
  };
});

if (png) await seite.screenshot({ path: png });
fs.writeFileSync(ziel, JSON.stringify({ url, fehler, ...daten }, null, 1));
console.log('Epoche', ep, '· Zuege', daten.zuege.length,
  '· sichtbar', daten.zuege.filter((z) => z.sichtbar && z.imFenster).length,
  '· treffbar', daten.zuege.filter((z) => z.treffbar).length,
  '· mit Preisschild', daten.zuege.filter((z) => z.preisText).length,
  '· Fehler', fehler.length, '· lage', (daten.lage || []).length);
await browser.close();
