/* GIBT ES EIN ENDE? — zwei Proben.
   a) an die Gegenwart heranspielen:  ?epoche=4&jahr=2023
   b) das Haus zugrunde richten:      alles kaufen, nichts liefern
   HAFEN=8911 node ende.mjs <a|b>                                             */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ART = process.argv[2] || 'a';
const HAFEN = process.env.HAFEN || '8911';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12';
const URL = ART === 'a'
  ? `http://127.0.0.1:${HAFEN}/spiel/?epoche=4&jahr=2023&saat=1350`
  : `http://127.0.0.1:${HAFEN}/spiel/?epoche=1&saat=1350`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const stand = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
    ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
    kasse: B.welt.haus.kasse, chronik: (B.welt.chronik || []).length, lage: B.lage.length };
});
const sicht = () => seite.evaluate(() => {
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim(); if (!t) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
    out.push(t.replace(/\s+/g, ' ').slice(0, 160));
  });
  return out;
});
async function klick(zug) {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`); if (!el) return null;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(260);
  return true;
}

const anfang = await stand();
let n = 0, s = anfang;
const grenze = ART === 'a' ? 140 : 500;
while (n < grenze) {
  s = await stand();
  if (s.ende) break;
  n++;
  if (ART === 'b') {
    /* alles kaufen, was Geld kostet, und nie liefern */
    const teuer = await seite.evaluate(() => [...document.querySelectorAll('[data-zug][data-preis]')]
      .filter(e => !e.disabled && +e.getAttribute('data-preis') < 0)
      .map(e => e.getAttribute('data-zug')));
    for (const z of teuer.slice(0, 3)) await klick(z);
  } else {
    if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
    await klick('fuhre:abschicken');
  }
  if (!(await klick('weiter'))) {
    const s2 = await stand();
    if (s2.jahr === s.jahr && s2.woche === s.woche) { await klick('preis:tafel-zu'); await klick('fuhre:sommer-zu'); await klick('weiter'); }
  }
}
const schluss = await stand();
const txt = await sicht();
await seite.screenshot({ path: `${WURZ}/schuesse/ende-${ART}.png` });
const erg = { art: ART, url: URL, anfang, schluss, schritte: n, fehler,
  endzeilen: txt.filter(t => /(ende|Ende|verloren|Gegenwart|geschlossen|Chronik|steht noch|Schluss)/.test(t)).slice(0, 25) };
fs.writeFileSync(`${WURZ}/protokoll/ende-${ART}.json`, JSON.stringify({ ...erg, allerText: txt }, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
