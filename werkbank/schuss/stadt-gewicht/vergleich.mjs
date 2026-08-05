/* VERGLEICH — zwei Aufnahmesaetze pixelweise gegeneinander.
 *
 *   node werkbank/schuss/stadt-gewicht/vergleich.mjs <vorher> <nachher> <ziel.json>
 *
 * Das ist die Gegenprobe zur ersten Latte. Sie beweist nicht, dass das Bild
 * gut ist — das entscheidet ein Fremder. Sie beweist, dass es sich durch die
 * Gewichtsarbeit NICHT bewegt hat, und das ist die Frage, die hier ansteht.
 *
 * Gemessen je Epoche:
 *   mittel   mittlerer Absolutunterschied ueber R,G,B (0..255)
 *   max      groesster Einzelunterschied
 *   ueber2   Anteil Pixel, deren groesster Kanalunterschied > 2 ist
 *   ueber8   dito > 8  — ab hier faengt ein Auge ueberhaupt erst an
 *   psnr     Signal-Rausch-Abstand in dB; ueber 40 dB gilt als nicht sichtbar
 *
 * PNG wird ohne Fremdbibliothek gelesen: zlib kann Node selbst, und der Rest
 * ist der Auspacker aus der PNG-Spezifikation (Filter 0..4).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

function lies(p) {
  const d = readFileSync(p);
  if (d.readUInt32BE(0) !== 0x89504e47) throw new Error('kein PNG: ' + p);
  let i = 8, w = 0, h = 0, tiefe = 0, art = 0;
  const teile = [];
  while (i < d.length) {
    const len = d.readUInt32BE(i);
    const typ = d.toString('latin1', i + 4, i + 8);
    const roh = d.subarray(i + 8, i + 8 + len);
    if (typ === 'IHDR') { w = roh.readUInt32BE(0); h = roh.readUInt32BE(4); tiefe = roh[8]; art = roh[9]; }
    else if (typ === 'IDAT') teile.push(roh);
    else if (typ === 'IEND') break;
    i += 12 + len;
  }
  if (tiefe !== 8) throw new Error('nur 8 bit: ' + p);
  const kan = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[art];
  if (!kan || art === 3) throw new Error('Farbart ' + art + ' nicht gelesen: ' + p);
  const roh = inflateSync(Buffer.concat(teile));
  const zeile = w * kan;
  const px = Buffer.alloc(h * zeile);
  let vor = Buffer.alloc(zeile);
  for (let y = 0; y < h; y++) {
    const f = roh[y * (zeile + 1)];
    const q = roh.subarray(y * (zeile + 1) + 1, y * (zeile + 1) + 1 + zeile);
    const z = px.subarray(y * zeile, (y + 1) * zeile);
    for (let x = 0; x < zeile; x++) {
      const a = x >= kan ? z[x - kan] : 0;
      const b = vor[x];
      const c = x >= kan ? vor[x - kan] : 0;
      let v = q[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {
        const p0 = a + b - c, pa = Math.abs(p0 - a), pb = Math.abs(p0 - b), pc = Math.abs(p0 - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      z[x] = v & 255;
    }
    vor = z;
  }
  return { w, h, kan, px };
}

const A = process.argv[2], B = process.argv[3];
const ZIEL = process.argv[4] || 'werkbank/schuss/stadt-gewicht/vergleich.json';
const erg = {};
let schlimm = 0;

for (const e of [1, 2, 3, 4]) {
  const a = lies(`${A}/e${e}.png`), b = lies(`${B}/e${e}.png`);
  if (a.w !== b.w || a.h !== b.h) { console.error(`e${e}: verschiedene Masse`); process.exit(1); }
  let summe = 0, max = 0, u2 = 0, u8 = 0, quad = 0;
  const n = a.w * a.h;
  for (let i = 0; i < n; i++) {
    const ia = i * a.kan, ib = i * b.kan;
    let g = 0;
    for (let k = 0; k < 3; k++) {
      const d = Math.abs(a.px[ia + k] - b.px[ib + k]);
      summe += d; quad += d * d;
      if (d > g) g = d;
    }
    if (g > max) max = g;
    if (g > 2) u2++;
    if (g > 8) u8++;
  }
  const mse = quad / (n * 3);
  const psnr = mse === 0 ? Infinity : 10 * Math.log10(255 * 255 / mse);
  erg['e' + e] = {
    breite: a.w, hoehe: a.h,
    mittel: +(summe / (n * 3)).toFixed(4),
    max,
    ueber2_prozent: +(100 * u2 / n).toFixed(3),
    ueber8_prozent: +(100 * u8 / n).toFixed(3),
    psnr_db: psnr === Infinity ? 'identisch' : +psnr.toFixed(2)
  };
  if (u8 / n > 0.005 || (psnr !== Infinity && psnr < 40)) schlimm++;
  console.log(`e${e}: mittel ${erg['e' + e].mittel}  max ${max}  >2 ${erg['e' + e].ueber2_prozent}%  ` +
              `>8 ${erg['e' + e].ueber8_prozent}%  PSNR ${erg['e' + e].psnr_db} dB`);
}

erg.vorher = A; erg.nachher = B; erg.stand = new Date().toISOString();
erg.urteil = schlimm === 0 ? 'DIE AUFNAHME STEHT' : `BEWEGT — ${schlimm} von 4 Epochen`;
writeFileSync(ZIEL, JSON.stringify(erg, null, 2));
console.log(erg.urteil + ' → ' + ZIEL);
process.exit(schlimm === 0 ? 0 : 1);
