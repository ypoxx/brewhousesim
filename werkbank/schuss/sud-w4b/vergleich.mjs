// vergleich.mjs — VORHER gegen NACHHER, mit derselben Zaehlung wie
// rettung.mjs, aber ueber die GLEICH LANGE Strecke: die beiden Partien einer
// Epoche enden verschieden lang, und ein Prozentsatz ueber verschieden viele
// Wochen vergleicht zwei Dinge.
//
//   node vergleich.mjs <vorher-praefix> <nachher-praefix>

import { readFileSync } from 'node:fs';

const A = process.argv[2] || 'vorher';
const B = process.argv[3] || 'end';

function zaehle(d, n) {
  const w = d.wochen.slice(0, n);
  const beide = w.filter((x) => x.amZettel.length === 2).length;
  const gepr = w.filter((x) => x.amBrett);
  const rettet = gepr.filter((x) => x.amBrett.filter((o) => o.lebt).length >= 2).length;
  const weg = w.filter((x) => /beiseite/.test(x.zettelKlasse || '')).length;
  return { n: w.length, beide, rettet, weg, zus: beide + rettet,
    p: +(100 * (beide + rettet) / w.length).toFixed(1) };
}

const JAHR = { 1: 1350, 2: 1600, 3: 1884, 4: 1970 };
console.log('Epoche | Wochen | VORHER beide/Brett/weg  ->  %   | NACHHER beide/Brett/weg  ->  %');
for (const e of [1, 2, 3, 4]) {
  let a, b;
  try { a = JSON.parse(readFileSync(`${A}-e${e}.json`)); } catch (x) { console.log(JAHR[e] + ': vorher fehlt'); continue; }
  try { b = JSON.parse(readFileSync(`${B}-e${e}.json`)); } catch (x) { console.log(JAHR[e] + ': nachher fehlt'); continue; }
  const n = Math.min(a.wochen.length, b.wochen.length);
  const X = zaehle(a, n), Y = zaehle(b, n);
  console.log(String(JAHR[e]).padEnd(7) + '| ' + String(n).padStart(5) + '  | '
    + String(X.beide).padStart(4) + ' /' + String(X.rettet).padStart(4) + ' /'
    + String(X.weg).padStart(4) + '  -> ' + String(X.p).padStart(5) + ' % | '
    + String(Y.beide).padStart(4) + ' /' + String(Y.rettet).padStart(4) + ' /'
    + String(Y.weg).padStart(4) + '  -> ' + String(Y.p).padStart(5) + ' %'
    + '   (Optionen am Brett ' + a.optionen.length + ' -> ' + b.optionen.length + ')');
}
console.log('');
console.log('Volle Partien, so wie rettung.mjs sie abschliesst:');
for (const e of [1, 2, 3, 4]) {
  let a, b;
  try { a = JSON.parse(readFileSync(`${A}-e${e}.json`)); b = JSON.parse(readFileSync(`${B}-e${e}.json`)); }
  catch (x) { continue; }
  const X = zaehle(a, a.wochen.length), Y = zaehle(b, b.wochen.length);
  console.log('  ' + JAHR[e] + ':  VORHER ' + X.zus + '/' + X.n + ' = ' + X.p + ' %'
    + '  [' + (a.abbruch || 'volle 14 Jahre') + ']'
    + '   NACHHER ' + Y.zus + '/' + Y.n + ' = ' + Y.p + ' %'
    + '  [' + (b.abbruch || 'volle 14 Jahre') + ']');
}
