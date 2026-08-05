/* FUESSE PRUEFEN — bleibt DAS LOT gueltig, nachdem die Bilder umgepackt sind?
 *
 *   node werkbank/schuss/stadt-gewicht/fuesse-pruefen.mjs <endung> <ziel.json>
 *
 * `K.fuesse` in stadt-daten.js sagt je Bild in 24 Spalten, wo der Aufbau den
 * Boden beruehrt — als Anteil der Bildhoehe, gemessen am Alphakanal
 * (`werkbank/schuss/stadt-r6/fuesse.py`, Schwelle Alpha > 60). Das Lot rechnet
 * daraus den z-Index. Wer die Bilder anfasst, ohne das nachzumessen, verschiebt
 * lautlos, was vor was steht — und genau das war der Befund von Runde 6.
 *
 * Dieses Geraet misst dasselbe noch einmal, aber im Browser (canvas), weil auf
 * dieser Maschine kein PIL und kein numpy liegt. Es vergleicht Spalte fuer
 * Spalte gegen die eingetragene Tabelle.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';

const ENDUNG = process.argv[2] || 'webp';
const ZIEL = process.argv[3] || 'werkbank/schuss/stadt-gewicht/fuesse.json';

const s = {}; createContext(s);
runInContext(readFileSync('spiel/stuecke/stadt-daten.js', 'utf8'), s);
const soll = s.STADT_DATEN.fuesse;

const b = await chromium.launch();
const seite = await b.newPage();
await seite.goto('data:text/html,<title>fuesse</title>');

const erg = {}; let schlimm = 0, groesst = 0;
for (const name of Object.keys(soll)) {
  const p = `spiel/bild/hof/${name}.${ENDUNG}`;
  const art = ENDUNG === 'webp' ? 'image/webp' : 'image/png';
  const d = 'data:' + art + ';base64,' + readFileSync(p).toString('base64');
  const ist = await seite.evaluate(async (d) => {
    const im = new Image();
    await new Promise((ja, nein) => { im.onload = ja; im.onerror = nein; im.src = d; });
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const k = c.getContext('2d', { willReadFrequently: true });
    k.drawImage(im, 0, 0);
    const px = k.getImageData(0, 0, c.width, c.height).data;
    const N = 24, w = c.width, h = c.height, out = [];
    for (let i = 0; i < N; i++) {
      const x0 = Math.floor(i * w / N);
      const x1 = Math.max(Math.floor((i + 1) * w / N), x0 + 1);
      let unten = -1;
      for (let y = h - 1; y >= 0 && unten < 0; y--) {
        for (let x = x0; x < x1; x++) {
          if (px[(y * w + x) * 4 + 3] > 60) { unten = y; break; }
        }
      }
      out.push(unten < 0 ? -1 : Math.round(((unten + 1) / h) * 10000) / 10000);
    }
    return out;
  }, d);

  let max = 0;
  for (let i = 0; i < 24; i++) {
    const a = soll[name][i], c = ist[i];
    if ((a < 0) !== (c < 0)) { max = 1; break; }
    if (a >= 0) max = Math.max(max, Math.abs(a - c));
  }
  erg[name] = { groesster_abstand: +max.toFixed(4) };
  if (max > groesst) groesst = max;
  if (max > 0.01) { schlimm++; erg[name].soll = soll[name]; erg[name].ist = ist; }
}

await b.close();
erg._endung = ENDUNG;
erg._groesster_abstand = +groesst.toFixed(4);
erg._urteil = schlimm === 0 ? 'DAS LOT BLEIBT GUELTIG' : `${schlimm} Bilder verschoben`;
writeFileSync(ZIEL, JSON.stringify(erg, null, 2));
console.log(`groesster Abstand ueber alle 32 Bilder x 24 Spalten: ${groesst.toFixed(4)} ` +
            `(Anteil der Bildhoehe) — ${erg._urteil}`);
process.exit(schlimm === 0 ? 0 : 1);
