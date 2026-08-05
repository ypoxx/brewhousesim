/* stadt-daten.js im Stand VOR der Nacharbeit zu Auflage 1 und 6.
 *
 *   node werkbank/schuss/stadt-r8/daten-alt-bauen.mjs
 *
 * Nimmt genau die elf Zeilen zurueck, die fuer die beiden Auflagen bewegt
 * wurden — Ort, Versatz und Breite von elf Aufbauten. Alles andere bleibt,
 * wie es ist: der A/B soll EINE Sache messen.
 *
 * Bricht ab, wenn auch nur ein Muster nicht sitzt. Ein Geraet, das im
 * Fehlerfall schweigt, ist in diesem Lauf schon fuenfmal teuer geworden.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ZIEL = 'werkbank/schuss/stadt-r8/stadt-daten-vor-r8.js';
let s = readFileSync('spiel/stuecke/stadt-daten.js', 'utf8');
let fehler = 0;

/* [jetzt, vorher] — die elf Aenderungen der Nacharbeit, rueckwaerts. */
const zurueck = [
  ["      ort: 'kesselstelle', dx: -4, dy: 10,\n      breite: 10.3, breiten: { 1: 10.3, 2: 10.3 },\n      versatz: { 2: { dx: 2, dy: 0.5 } },",
   "      ort: 'kesselstelle', dx: -9, dy: 5,\n      breite: 8.9, breiten: { 1: 8.9, 2: 8.9 },\n      versatz: { 2: { dx: 7, dy: 0.5 } },"],
  ["      ort: 'brunnen', dx: 4, dy: 0,\n      breite: 6.5, breiten: { 1: 6.5, 2: 5.4, 3: 6.2 },",
   "      ort: 'brunnen', dx: 4, dy: 0,\n      breite: 6.5, breiten: { 1: 6.5, 2: 5.4, 3: 6.2 },\n      versatz: { 2: { dx: 4, dy: 9 } },"],
  ["      ort: 'fasslager', dx: 10, dy: -5, breite: 12.5, von: 1, bis: 1, grund: 22,",
   "      ort: 'fasslager', dx: 12, dy: -7.5, breite: 13, von: 1, bis: 1, grund: 22,"],
  ["      ort: 'keller', dx: 4, dy: 1, breite: 12.5, breiten: { 1: 11.5, 2: 11.5 },",
   "      ort: 'keller', dx: 1, dy: 6, breite: 12.5, breiten: { 1: 11, 2: 11 },\n      versatz: { 1: { dx: 6, dy: -6 }, 2: { dx: 1, dy: -7 } },"],
  ["      ort: 'fasslager', dx: 10, dy: -5, breite: 14, breiten: { 2: 11, 3: 13 },",
   "      ort: 'fasslager', dx: 5, dy: -2.5, breite: 14, breiten: { 2: 10.1 },\n      versatz: { 2: { dx: 9, dy: -3.5 } },"],
  ["      ort: 'hof', dx: -5, dy: 6, breite: 9.4, von: 2, bis: 2, grund: 32,",
   "      ort: 'hof', dx: -9, dy: 6, breite: 9.4, von: 2, bis: 2, grund: 32,"],
  ["      ort: 'keller', dx: -11, dy: 0, breite: 9, von: 2, bis: 3, grund: 40,",
   "      ort: 'keller', dx: -6, dy: 0, breite: 9, von: 2, bis: 3, grund: 40,"],
  ["      ort: 'keller', dx: 7, dy: 4.5, breite: 11, von: 3, bis: 3, grund: 70,",
   "      ort: 'keller', dx: 4, dy: 0, breite: 13, von: 3, bis: 3, grund: 70,"],
  ["      ort: 'keller', dx: 9, dy: -4, breite: 12.5, von: 3, bis: 3, grund: 90,",
   "      ort: 'keller', dx: 5, dy: -2, breite: 12.5, von: 3, bis: 3, grund: 90,"],
  ["      ort: 'fasslager', dx: -1, dy: -3, breite: 10.5, von: 4, bis: 4, grund: 70,",
   "      ort: 'fasslager', dx: -6, dy: -8, breite: 8.3, von: 4, bis: 4, grund: 70,"],
  ["      ort: 'rampe', dx: -8, dy: 2, breite: 10.5, von: 4, bis: 4, grund: 95,",
   "      ort: 'rampe', dx: -5, dy: -2, breite: 8.8, von: 4, bis: 4, grund: 95,"]
];

for (const [jetzt, vorher] of zurueck) {
  if (!s.includes(jetzt)) { console.error('DATEN-ALT: Muster nicht gefunden —\n' + jetzt); fehler++; continue; }
  s = s.replace(jetzt, vorher);
}

if (fehler) { console.error(`DATEN-ALT GESCHEITERT — ${fehler} von ${zurueck.length} Mustern. KEIN A/B fahren.`); process.exit(1); }
writeFileSync(ZIEL, s);
console.log(`${zurueck.length} Aenderungen zurueckgenommen → ${ZIEL}`);
