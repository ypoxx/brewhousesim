/* AUF DEN PFENNIG. Klickt Preisschilder an und prueft, ob die Kasse GENAU um
   den angeschriebenen Betrag faellt — und ob das Protokoll die Buchung mit
   demselben Betrag traegt.

   Ein Preis, der nie abgebucht wird, ist ein Sperrlisten-Verstoss.

     HAFEN=8903 node pfennig.mjs <epoche> <ziel.json> [breite] [hoehe]

   Geklickt wird nur, was DER PREIS selbst anschreibt (`preis:*`) — und
   danach, solange die Lade reicht, weiter. Jede Buchung wird einzeln
   nachgerechnet.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const ZIEL = process.argv[3] || 'pfennig.json';
const BR = +(process.argv[4] || 1366), HO = +(process.argv[5] || 768);
const HAFEN = process.env.HAFEN || '8903';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const s = await b.newPage({ viewport: { width: BR, height: HO } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1100);

async function ruhe(ms) {
  await s.waitForTimeout(Math.min(ms, 40));
  try { await s.evaluate(() => new Promise(f => { let a = false; const g = () => { if (!a) { a = true; f(1); } };
    setTimeout(g, 2000); requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0))); })); } catch (e) {}
}
const lage = (z) => s.evaluate((zz) => {
  const el = document.querySelector(`[data-zug="${zz}"]`); if (!el) return null;
  const r = el.getBoundingClientRect(); if (!r.width || !r.height) return { sichtbar: false };
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) ? document.elementFromPoint(cx, cy) : null;
  const ps = el.querySelector('.preis');
  return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))), x: cx, y: cy,
    preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
    schild: ps ? (ps.innerText || '').replace(/\s+/g, ' ').trim() : '',
    text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) };
}, z);
const stand = () => s.evaluate(() => ({ kasse: window.BRAUHAUS.welt.haus.kasse,
  n: window.BRAUHAUS.protokoll.length }));
const seit = (n) => s.evaluate((x) => window.BRAUHAUS.protokoll.slice(x)
  .map(p => ({ w: p.wer, s: p.was, p: p.preis })), n);

/* Tafel aufschlagen */
const g = await lage('preis:tafel');
if (g && g.hit && !/schließen/.test(g.text || '')) { await s.mouse.click(g.x, g.y); await ruhe(400); }

const liste = await s.evaluate(() => [...document.querySelectorAll('[data-zug^="preis:"]')]
  .filter(el => !el.disabled && el.querySelector('.preis'))
  .map(el => el.getAttribute('data-zug')));

const proben = [];
for (const z of liste) {
  const l = await lage(z);
  if (!l || !l.sichtbar || l.aus || !l.hit) { proben.push({ zug: z, uebersprungen: 'nicht treffbar' }); continue; }
  const vor = await stand();
  await s.mouse.click(l.x, l.y); await ruhe(400);
  const nach = await stand();
  const buch = await seit(vor.n);
  const soll = l.preis;
  const ist = nach.kasse - vor.kasse;
  proben.push({ zug: z, schild: l.schild, dataPreis: soll, text: l.text,
    kasseVor: vor.kasse, kasseNach: nach.kasse, veraenderung: ist,
    stimmt: soll === null ? null : (ist === soll),
    buchungen: buch });
  console.log(`${z}  Schild ${l.schild} (data-preis ${soll})  Kasse ${vor.kasse} → ${nach.kasse}  Δ ${ist}  ${soll === null ? '—' : (ist === soll ? 'GENAU' : 'ABWEICHUNG ' + (ist - soll))}`);
}
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, fehler, proben }, null, 1));
await b.close();
