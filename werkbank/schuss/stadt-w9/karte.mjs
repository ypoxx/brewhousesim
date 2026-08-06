/* DECKKARTE — wo genau liegen die gedeckten Bildpunkte?
 *   node werkbank/schuss/stadt-w9/karte.mjs <voll.png> <ohnekasten.png> [spalten] [zeilen]
 *
 * Zwei fertige Aufnahmen, kein Browser. Gibt ein Raster aus: je Zelle der
 * Anteil gedeckter Bildpunkte in Zehnteln (0-9, '#' = ganz). Damit sieht man
 * ohne Bildbetrachter, WO die Oberflaeche liegt, und nicht nur wieviel.
 */
import { readFileSync } from 'node:fs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';

const A = pngLesen(readFileSync(process.argv[2]));
const B = pngLesen(readFileSync(process.argv[3]));
const SP = +(process.argv[4] || 48), ZE = +(process.argv[5] || 24);
const { breite: W, hoehe: H } = A;
const zeichen = '·123456789#';
console.log(`${process.argv[2].split('/').pop()}  ${W}x${H}  Raster ${SP}x${ZE}`
  + `  (Zeile ${Math.round(H / ZE)} px, oberstes Sechstel = Zeilen 0..${Math.floor(ZE / 6) - 1})`);
for (let r = 0; r < ZE; r++) {
  let zeile = '';
  const y0 = Math.floor(r * H / ZE), y1 = Math.floor((r + 1) * H / ZE);
  for (let c = 0; c < SP; c++) {
    const x0 = Math.floor(c * W / SP), x1 = Math.floor((c + 1) * W / SP);
    let n = 0, g = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      const i = (y * W + x) * 4; g++;
      if (Math.abs(A.daten[i] - B.daten[i]) > 8 || Math.abs(A.daten[i + 1] - B.daten[i + 1]) > 8 ||
          Math.abs(A.daten[i + 2] - B.daten[i + 2]) > 8) n++;
    }
    zeile += zeichen[Math.min(10, Math.round(10 * n / (g || 1)))];
  }
  console.log(String(Math.floor(r * H / ZE)).padStart(5) + ' ' + zeile
    + (r === Math.floor(ZE / 6) - 1 ? '   <- Ende oberstes Sechstel' : '')
    + (r === ZE - Math.floor(ZE / 6) ? '   <- Anfang unterstes Sechstel' : ''));
}
