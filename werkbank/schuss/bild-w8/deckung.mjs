/* DECKUNG IN BILDPUNKTEN — wieviel des gemalten Bildes verdeckt die Oberflaeche?
     node werkbank/schuss/bild-w8/deckung.mjs <voll.png> <nackt.png>

   Kein Browser, kein Messfenster noetig: es vergleicht zwei fertige Aufnahmen.
   Gezaehlt wird ein Bildpunkt als GEDECKT, wenn er sich zwischen der Aufnahme
   mit und ohne obere Ebenen um mehr als 8 Stufen in einem Kanal unterscheidet.
   Zusaetzlich getrennt: oberstes Sechstel, unterstes Sechstel, Mittelband.

   Warum Bildpunkte und nicht Kaesten: eine Rechteck-Huelle deckt nicht, was in
   ihr durchsichtig ist.                                                      */
import { readFileSync } from 'node:fs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';

const A = pngLesen(readFileSync(process.argv[2]));   // voll
const B = pngLesen(readFileSync(process.argv[3]));   // nackt
if (A.breite !== B.breite || A.hoehe !== B.hoehe) throw new Error('Groessen ungleich');
const { breite: W, hoehe: H } = A;

const zone = (y0, y1) => {
  let n = 0, ges = 0;
  for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4; ges++;
    if (Math.abs(A.daten[i] - B.daten[i]) > 8 || Math.abs(A.daten[i + 1] - B.daten[i + 1]) > 8 ||
        Math.abs(A.daten[i + 2] - B.daten[i + 2]) > 8) n++;
  }
  return { n, ges, pct: (100 * n / ges).toFixed(1) };
};
const s6 = Math.floor(H / 6);
const g = zone(0, H), o = zone(0, s6), m = zone(s6, H - s6), u = zone(H - s6, H);
console.log(`${process.argv[2].split('/').pop()}  ${W}x${H}`);
console.log(`  gesamt          ${g.pct} %`);
console.log(`  oberstes 1/6    ${o.pct} %`);
console.log(`  Mittelband      ${m.pct} %`);
console.log(`  unterstes 1/6   ${u.pct} %`);
