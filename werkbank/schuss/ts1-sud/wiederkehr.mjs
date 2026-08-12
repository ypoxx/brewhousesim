/* TS1-SUD: SPIELSTAND SICHERN — WIEDERKEHR
   Der SUD speichert seinen Eigenzustand nach localStorage (Verfahren, Siegel,
   Gaerkeller, laufende Charge, Sudplan). Spielt 12 Wochen, laedt dieselbe URL
   neu, vergleicht die gespeicherten Felder Ziffer fuer Ziffer.

   HAFEN=8971 node wiederkehr.mjs <epoche>                                   */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8971';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/ts1-sud';
const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

// Die Felder, die der SUD speichern muss
const FELDER = ['verfahren', 'fest', 'bottiche', 'zusatz', 'kaufNr', 'guete',
  'anstichWoche', 'nr', 'rueck', 'brettZu', 'gestuft', 'gestuftGesamt',
  'buch', 'jahrSude', 'jahrFass', 'jahrLegte', 'gesamtLegte', 'kalt',
  'bestellt', 'gesamtSude', 'gesamtFass', 'epocheGesetzt'];

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await seite.goto(URL + '&neu=1', { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const sudZustand = () => seite.evaluate((felder) => {
  const B = window.BRAUHAUS;
  const Z = B.SUD_ZUSTAND;
  const d = {};
  felder.forEach(f => { d[f] = Z[f]; });
  return d;
}, FELDER);

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`); if (!el) return null;
    const r = el.getBoundingClientRect(); if (!r.width) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, aus: !!el.disabled };
  }, zug);
  if (!l || l.aus) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(60); await seite.mouse.up();
  await seite.waitForTimeout(320);
  return true;
}

// 12 Wochen spielen und Verfahren aendernums zu veraendern
const vorher = await sudZustand();
for (let i = 0; i < 12; i++) {
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  // Versuche, ein Verfahren zu aendern, um Zustandsaenderungen zu provozieren
  if (i < 2) {
    const button = await seite.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('[data-zug]'));
      return buttons.find(b => b.getAttribute('data-zug').startsWith('sud:'))?.getAttribute('data-zug');
    });
    if (button) await klick(button);
  }
  await klick('weiter');
}
const gespielt = await sudZustand();
await seite.screenshot({ path: `${WURZ}/schuesse/ts1-sud-e${ep}-vor-neuladen.png` });

// Neuladen
await seite.reload({ waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);
const nachher = await sudZustand();
await seite.screenshot({ path: `${WURZ}/schuesse/ts1-sud-e${ep}-nach-neuladen.png` });

// Vergleich
const vergleich = {};
let gleich = 0;
let unterschiedlich = 0;
FELDER.forEach(f => {
  const v = JSON.stringify(gespielt[f]);
  const n = JSON.stringify(nachher[f]);
  if (v === n) {
    gleich++;
  } else {
    unterschiedlich++;
    vergleich[f] = { vor: gespielt[f], nachNeuladen: nachher[f], gleich: false };
  }
});

const erg = {
  epoche: ep,
  url: URL,
  felder: FELDER.length,
  gleich: gleich,
  unterschiedlich: unterschiedlich,
  unterschiede: vergleich,
  fortgesetzt: unterschiedlich === 0
};

fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.mkdirSync(`${WURZ}/schuesse`, { recursive: true });
fs.writeFileSync(`${WURZ}/protokoll/ts1-sud-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
