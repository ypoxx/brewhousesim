/* DER KASSENBODEN unter zwei schlechten Haenden.

   HAFEN=8900 node boden.mjs <epoche> <art> <wochen> <ziel.json>
     art = faul     — nur WEITER. Das Haus braut nicht, verkauft nicht,
                      zahlt aber jeden Michaeli. Die haerteste Probe fuer
                      einen Boden.
     art = gierig   — nimmt jede Woche JEDEN bezahlbaren Zug mit Preisschild,
                      billigster zuerst, bis nichts mehr geht. Das Haus
                      verausgabt sich mit Absicht.

   Gezaehlt wird Woche fuer Woche: Kasse, Wochen auf 0, Wochen unter 0, und
   ob in diesen Wochen ueberhaupt noch ein Zug mit Preisschild erreichbar UND
   nach `data-soll-aus` erlaubt ist — also ob das Haus noch handeln kann oder
   nur zusieht.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const ART = process.argv[3] || 'faul';
const WOCHEN = +(process.argv[4] || 420);
const ZIEL = process.argv[5] || `/tmp/pk5/boden-e${ep}-${ART}.json`;
const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try {
    await seite.evaluate(() => new Promise((f) => {
      let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) {}
}

async function stand() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    let frei = 0;
    const liste = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let hit = false;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
      const p = el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null;
      if (p && hit && !el.disabled) frei++;
      if (p) liste.push({ zug: el.getAttribute('data-zug'), preis: p, aus: !!el.disabled,
                          sollAus: el.getAttribute('data-soll-aus'), hit, x: cx, y: cy });
    });
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
             kasse: B.welt.haus.kasse, frei, liste, deckung: d,
             prot: B.protokoll.length,
             letzte: B.protokoll.slice(-6).map(p => p.wer + '|' + p.was + '|' + p.preis) };
  });
}

const reihe = [];
let abbruch = null;
for (let i = 0; i < WOCHEN; i++) {
  let s = await stand();
  if (s.ende) { abbruch = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, frei: s.frei,
               deckung: s.deckung, letzte: s.kasse <= 0 ? s.letzte : undefined });

  if (ART === 'gierig') {
    for (let k = 0; k < 8; k++) {
      const t = await stand();
      const kauf = t.liste.filter(z => !z.aus && z.hit && z.preis < 0 && -z.preis <= t.kasse)
                          .sort((a, b) => (-a.preis) - (-b.preis));
      if (!kauf.length) break;
      await seite.mouse.click(kauf[0].x, kauf[0].y);
      await ruhe(90);
    }
  }

  const vorher = s.jahr * 100 + s.woche;
  const w = await seite.evaluate(() => {
    const el = document.querySelector('[data-zug="weiter"]');
    if (!el || el.disabled) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  if (!w) { abbruch = { grund: 'WEITER weg', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse }; break; }
  await seite.mouse.click(w.x, w.y);
  await ruhe(120);
  const n = await stand();
  if (n.jahr * 100 + n.woche === vorher) {
    await ruhe(300);
    const n2 = await stand();
    if (n2.jahr * 100 + n2.woche === vorher) {
      abbruch = { grund: 'Woche bewegt sich nicht', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
  }
}

const kassen = reihe.map(r => r.kasse);
const roh = await seite.evaluate(() => { try { return BRAUHAUS.preis.leiter(); } catch (e) { return null; } });
const prot = await seite.evaluate(() => BRAUHAUS.protokoll.map(p =>
  ({ wer: p.wer, was: String(p.was).slice(0, 80), preis: p.preis, jahr: p.jahr, woche: p.woche })));
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, art: ART, wochen: reihe.length, fehler, abbruch,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  aufNull: reihe.filter(r => r.kasse === 0).length,
  unterNull: reihe.filter(r => r.kasse < 0).length,
  leiterRoh: roh, protokoll: prot, reihe }, null, 1));
console.log(`E${ep} [${ART}]: ${reihe.length} W, Kasse ${Math.min(...kassen)}..${Math.max(...kassen)}, `
  + `auf 0: ${reihe.filter(r => r.kasse === 0).length}, unter 0: ${reihe.filter(r => r.kasse < 0).length}, `
  + `Wochen ohne erreichbaren Preiszug: ${reihe.filter(r => r.frei === 0).length}, Fehler ${fehler.length}`,
  abbruch || '');
await browser.close();
