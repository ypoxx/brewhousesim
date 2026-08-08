/* KOSTEN w13 — was das Sichern im Zeichenweg kostet.

   Die Falle dieser Welle heisst: „Das Schreiben des Standes kostet Zeit im
   Zeichenweg und oeffnet ein neues Rennen." Behaupten hilft da nichts, also
   wird gemessen — von AUSSEN, mit `performance.now()` in der Probe, nicht im
   Spiel. In kern/stand.js steht keine einzige Zeitmessung.

   Gemessen wird nach n gespielten Wochen: 21 Aufrufe von
   `BRAUHAUS.stand.sichere()` hintereinander, dazu die Laenge des
   geschriebenen Textes und die Laenge des Buches.

   HAFEN=8921 node kosten.mjs <epoche> [wochen]                              */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 30);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`); if (!el) return null;
    const r = el.getBoundingClientRect(); if (!r.width) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, aus: !!el.disabled };
  }, zug);
  if (!l || l.aus) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(120);
  return true;
}

const punkte = [];
async function miss(marke) {
  const m = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    /* Damit wirklich geschrieben wird, auch wenn die Adresse `neu=1` traegt:
       die Probe schreibt an einem eigenen Schluessel, ausserhalb des Spiels. */
    const d = {
      fassung: 1, saat: B.wuerfel.saat, wuerfel: B.wuerfel.zustand,
      haus: B.welt.haus, zeit: B.welt.zeit, vorrat: B.welt.vorrat,
      adressen: B.welt.adressen, gegner: B.welt.gegner,
      chronik: B.welt.chronik, buch: B.protokoll, buchAb: 0, stuecke: {}
    };
    const zeiten = [];
    for (let i = 0; i < 21; i++) {
      const t0 = performance.now();
      const text = JSON.stringify(d);
      localStorage.setItem('brauhaus:probe:kosten', text);
      zeiten.push(performance.now() - t0);
    }
    const text = JSON.stringify(d);
    localStorage.removeItem('brauhaus:probe:kosten');
    zeiten.sort((a, b) => a - b);
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      zeichen: text.length, buch: B.protokoll.length, chronik: B.welt.chronik.length,
      faesser: B.welt.vorrat.faesser.length,
      msMin: +zeiten[0].toFixed(3), msMittel: +zeiten[10].toFixed(3),
      msMax: +zeiten[20].toFixed(3)
    };
  });
  m.marke = marke;
  punkte.push(m);
  return m;
}

await miss('Ladezustand');
for (let n = 0; n < WOCHEN; n++) {
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
  if ((n + 1) % 10 === 0) await miss('nach ' + (n + 1) + ' Wochen');
}

const erg = { epoche: ep, wochen: WOCHEN, punkte, fehler };
fs.writeFileSync(`${WURZ}/protokoll/kosten-e${ep}.json`, JSON.stringify(erg, null, 1));
punkte.forEach(p => console.log(
  `E${ep} ${(p.marke + '                ').slice(0, 18)} ${p.jahr}/${p.woche}`
  + `  Buch ${String(p.buch).padStart(5)}  ${String(p.zeichen).padStart(8)} Zeichen`
  + `  ${p.msMin.toFixed(2)}/${p.msMittel.toFixed(2)}/${p.msMax.toFixed(2)} ms (min/mittel/max)`));
console.log(fehler.length ? 'FEHLER: ' + fehler.join(' | ') : 'keine Fehler auf der Seite');
await browser.close();
