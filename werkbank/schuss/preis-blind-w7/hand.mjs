// Blinder Kritiker DER PREIS, Welle 7 — die Hand.
// Faehrt ein Drehbuch aus Schritten ab und schreibt nach jedem Schritt
// Kasse, Protokollzeilen und die sichtbaren Zuege mit Preisschild fort.
//
//   node hand.mjs <epoche> <drehbuch.json> <ziel.json> [pngPraefix] [breite] [hoehe]
//
// Drehbuchschritt:
//   {"klick":"preis:tafel"}            echter Mausklick auf [data-zug]
//   {"klick":"weiter","mal":5}
//   {"waehl":"css-selektor"}           echter Mausklick auf einen Selektor
//   {"png":"name"}                     Bildschirmfoto
//   {"merke":"name"}                   Zustand festhalten
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const [ep = '1', buchPfad, ziel = 'hand.json', pngP = '', br = '1366', ho = '768'] = process.argv.slice(2);
const HAFEN = process.env.HAFEN || '8903';
const url = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;
const buch = JSON.parse(fs.readFileSync(buchPfad, 'utf8'));

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: +br, height: +ho }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1000);

const lies = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const sicht = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0);
  };
  const treff = (el) => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const o = document.elementFromPoint(x, y);
    return !!(o && (o === el || el.contains(o)));
  };
  return {
    kasse: B.welt.haus.kasse,
    rohstoff: B.welt.haus.rohstoff,
    ansehen: B.welt.haus.ansehen,
    zeit: { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche },
    protokollN: B.protokoll.length,
    protokollEnde: B.protokoll.slice(-12),
    chronikN: B.welt.chronik.length,
    chronikEnde: B.welt.chronik.slice(-8),
    lage: B.lage.length,
    zuege: [...document.querySelectorAll('[data-zug]')].map((el) => {
      const ps = el.querySelector('.preis');
      const r = el.getBoundingClientRect();
      return {
        zug: el.getAttribute('data-zug'),
        p: ps ? (ps.innerText || '').replace(/\s+/g, ' ').trim() : '',
        s: sicht(el) ? 1 : 0, t: treff(el) ? 1 : 0, d: el.disabled ? 1 : 0,
        w: Math.round(r.width), h: Math.round(r.height),
        tx: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90),
      };
    }),
    text: document.body.innerText,
  };
});

const spur = [];
spur.push({ schritt: 'start', ...(await lies()) });

async function klickZug(zug) {
  const sel = `[data-zug="${zug}"]`;
  const el = await seite.$(sel);
  if (!el) return { ok: false, grund: 'nicht im DOM' };
  try {
    await el.click({ timeout: 4000 });
    await seite.waitForTimeout(320);
    return { ok: true };
  } catch (e) {
    return { ok: false, grund: String(e).split('\n')[0].slice(0, 160) };
  }
}

for (const s of buch) {
  const mal = s.mal || 1;
  for (let i = 0; i < mal; i++) {
    let erg = { ok: true };
    if (s.klick) erg = await klickZug(s.klick);
    else if (s.waehl) {
      try { await seite.click(s.waehl, { timeout: 4000 }); await seite.waitForTimeout(320); }
      catch (e) { erg = { ok: false, grund: String(e).split('\n')[0].slice(0, 160) }; }
    }
    if (s.png) await seite.screenshot({ path: `${pngP}${s.png}${mal > 1 ? '-' + i : ''}.png` });
    const z = await lies();
    spur.push({ schritt: s.klick || s.waehl || s.png || s.merke, i, erg, ...z });
    if (s.klick || s.waehl) {
      const v = spur[spur.length - 2], n = spur[spur.length - 1];
      console.log(`${s.klick || s.waehl}${mal > 1 ? '#' + i : ''}  ok=${erg.ok}${erg.grund ? ' (' + erg.grund + ')' : ''}  Kasse ${v.kasse} → ${n.kasse}  (${n.kasse - v.kasse})  J${n.zeit.jahr}/W${n.zeit.woche}  lage=${n.lage}`);
    }
  }
}

fs.writeFileSync(ziel, JSON.stringify({ url, fehler, spur }, null, 1));
console.log('Fehler:', fehler.length, '· Schritte:', spur.length);
await browser.close();
