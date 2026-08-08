/* GEGNERBLICK — merkt ein Spieler, der NICHTS aufklappt, dass der Gegner zieht?
   Spielt nur: Karren fuellen, abschicken, WEITER. Kein Reiter, kein Brett.
   Misst je Woche: Zahl der Gegnerzuege, Aufschrift des Reiters
   OHNE DICH GESCHEHEN, und welche Textzeilen NEU auf dem Schirm stehen.
   HAFEN=8911 node gegnerblick.mjs <epoche> <wochen>                          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 60);
const HAFEN = process.env.HAFEN || '8911';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
/* `&neu=1` seit dem 8. August (T0.5). */
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const lese = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  let band = null;
  const el = document.querySelector('[data-zug="stadt:reiter:gegner-amort-gg-band"]');
  if (el) { const r = el.getBoundingClientRect(); if (r.width && r.height) band = (el.innerText || '').trim().replace(/\s+/g, ' '); }
  const txt = [];
  document.querySelectorAll('body *').forEach(e => {
    if (e.children.length) return;
    const t = (e.textContent || '').trim(); if (!t) return;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
    txt.push(t.replace(/\s+/g, ' ').slice(0, 140));
  });
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    gzuege: (B.welt.gegner[0] || {}).zuege, band, txt };
});
async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(240);
  return true;
}

const reihe = [];
let vorher = null;
for (let i = 0; i < N; i++) {
  const s = await lese();
  const neuText = vorher ? s.txt.filter(t => !vorher.has(t)) : [];
  const gegnerNeu = vorher ? s.gzuege > vorherZuege : false;
  reihe.push({ n: i + 1, jahr: s.jahr, woche: s.woche, kasse: s.kasse, gzuege: s.gzuege,
    gegnerNeu, band: s.band, neuText: neuText.slice(0, 12), neuTextN: neuText.length });
  var vorherZuege = s.gzuege;
  vorher = new Set(s.txt);
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
await seite.screenshot({ path: `${WURZ}/schuesse/gegnerblick-e${ep}.png` });

const mitZug = reihe.filter(r => r.gegnerNeu);
const bandZahl = reihe.filter(r => r.band && /\d/.test(r.band));
const gegnerWort = /(Adler|Konzern|Nordstern|wirbt|spricht vor|umkämpft|frei geworden|Vorsprung|Ohne dich|Zug)/i;
const mitNeuemGegnertext = mitZug.filter(r => r.neuText.some(t => gegnerWort.test(t)));
const erg = { epoche: ep, wochen: reihe.length,
  gegnerzuegeGesamt: reihe.length ? reihe[reihe.length - 1].gzuege - reihe[0].gzuege : 0,
  wochenMitGegnerzug: mitZug.length,
  wochenMitZahlAmReiter: bandZahl.length,
  reiterAufschriften: [...new Set(reihe.map(r => r.band))],
  wochenMitNeuemGegnertext: mitNeuemGegnertext.length,
  beispieleNeuerText: mitZug.slice(0, 12).map(r => ({ n: r.n, jahr: r.jahr, woche: r.woche, band: r.band, neu: r.neuText.slice(0, 6) })) };
fs.writeFileSync(`${WURZ}/protokoll/gegnerblick-e${ep}.json`, JSON.stringify({ ...erg, reihe }, null, 1));
console.log(JSON.stringify(erg, null, 1).slice(0, 3500));
await browser.close();
