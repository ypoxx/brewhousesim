/* ALT BAUEN — die drei Dateien der STADT ohne die Schriftarbeit der Welle 7.
 *
 *   node werkbank/schuss/stadt-schrift/alt-bauen.mjs
 *
 * Erzeugt werkbank/schuss/stadt-schrift/alt/{stadt.css,stadt-zusatz.css,stadt.js}
 * aus dem Arbeitsbaum, indem es GENAU die Aenderungen von Teil B zuruecknimmt:
 *
 *   1. jedes  font-size: max(12px, calc(var(--s) * N))  ->  calc(var(--s) * N)
 *   2. den Deckel des Bauhofknopfes zurueck auf -webkit-line-clamp
 *   3. die beiden Medienschalter (Abschnitt 5 und 6) heraus
 *   4. in stadt.js: den Boden am Stadtnamen und die Kennzahl im Reitertitel
 *
 * NICHT zurueckgenommen wird Teil A (WebP und das gestaffelte Vorladen) — das
 * ist eigens gemessen, und beide Arme sollen sich in genau EINER Sache
 * unterscheiden.
 *
 * Warum ein Skript und keine Kopie von Hand: der Container wird stuendlich
 * zurueckgesetzt. Was von Hand nachgebaut werden muss, ist beim naechsten Mal
 * weg — die Regel steht im LAUFENDEN AUFTRAG, und sie ist dreimal bezahlt.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ALT = 'werkbank/schuss/stadt-schrift/alt';
mkdirSync(ALT, { recursive: true });
let fehler = 0;
const pruefe = (was, bed) => { if (!bed) { console.error('ALT-BAUEN: ' + was + ' NICHT gefunden'); fehler++; } };

/* ---- stadt.css ---------------------------------------------------------- */
let c = readFileSync('spiel/stil/stadt.css', 'utf8');

const vorher = (c.match(/max\(12px, calc\(var\(--s\) \* [0-9.]+\)\)/g) || []).length;
pruefe('Schriftboeden in stadt.css', vorher >= 15);
c = c.replace(/font-size: max\(12px, calc\(var\(--s\) \* ([0-9.]+)\)\)/g,
              'font-size: calc(var(--s) * $1)');

const neuerDeckel = c.indexOf('.stadt-bauhof .bauzeile .knopf .wort {');
pruefe('neuer Deckel des Bauhofknopfes', neuerDeckel > 0);
const deckelEnde = c.indexOf('::-webkit-scrollbar { width: 0; height: 0; }', neuerDeckel);
pruefe('Ende des neuen Deckels', deckelEnde > 0);
if (neuerDeckel > 0 && deckelEnde > 0) {
  const bis = c.indexOf('\n', deckelEnde) + 1;
  c = c.slice(0, neuerDeckel) + `.stadt-bauhof .knopf .wort {
  flex: 1 1 auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: calc(var(--s) * 38);
}
` + c.slice(bis);
}

const schnitt = c.indexOf('/* ==========================================================================\n   5 — UNTERHALB DER ENTWURFSLEINWAND');
pruefe('Abschnitt 5 (Medienschalter)', schnitt > 0);
if (schnitt > 0) c = c.slice(0, schnitt);
writeFileSync(ALT + '/stadt.css', c);

/* ---- stadt-zusatz.css --------------------------------------------------- */
let z = readFileSync('spiel/stil/stadt-zusatz.css', 'utf8');
pruefe('Schriftboden in stadt-zusatz.css', /max\(12px, calc\(var\(--s\) \* 15\)\)/.test(z));
z = z.replace(/font-size: max\(12px, calc\(var\(--s\) \* ([0-9.]+)\)\)/g,
              'font-size: calc(var(--s) * $1)');
writeFileSync(ALT + '/stadt-zusatz.css', z);

/* ---- stadt.js ----------------------------------------------------------- */
let j = readFileSync('spiel/stuecke/stadt.js', 'utf8');
const b1 = "el.style.fontSize = 'max(12px, calc(var(--s) * ' + B.rund(21 * (n.gross || 1), 2) + '))';";
pruefe('Boden am Stadtnamen', j.indexOf(b1) > 0);
j = j.replace(b1, "el.style.fontSize = 'calc(var(--s) * ' + B.rund(21 * (n.gross || 1), 2) + ')';");

const a = j.indexOf("      var kennzahl = b.unter ? ' — ' + b.unter : '';");
const e = j.indexOf("        : b.titel + kennzahl + '. Zuklappen");
pruefe('Kennzahl im Reitertitel', a > 0 && e > a);
if (a > 0 && e > a) {
  const bis = j.indexOf('\n', e) + 1;
  j = j.slice(0, a) + `      k.title = b.zu
        ? b.titel + ' aufschlagen. Es legt sich über die Stadt, bis man es wieder zuklappt.'
        : b.titel + ' zuklappen — dann sieht man die Stadt wieder.';
` + j.slice(bis);
}
writeFileSync(ALT + '/stadt.js', j);

if (fehler) { console.error(`ALT-BAUEN GESCHEITERT — ${fehler} Muster nicht gefunden. KEIN A/B fahren.`); process.exit(1); }
console.log('alt/ gebaut: stadt.css, stadt-zusatz.css, stadt.js');
