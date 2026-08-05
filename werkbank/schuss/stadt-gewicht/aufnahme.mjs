/* AUFNAHME — vier Epochen, immer gleich, damit man sie pixelweise vergleichen kann.
 *
 *   node werkbank/schuss/stadt-gewicht/aufnahme.mjs <ordner>
 *   HAFEN=8899 SAAT=1350 node …
 *
 * Schreibt <ordner>/e1.png … e4.png bei 2752x1536 — der Groesse, in der die
 * erste Latte blind gegen zielbild/ gelegt wird.
 *
 * Der Ordner gehoert NICHT ins Repo: werkbank/schuss/**\/*.png steht in der
 * .gitignore. Genau deshalb wird hierhin geschossen und nicht unter spiel/.
 *
 * Determinismus: feste Saat, feste Epoche, Animationen aus, und vor dem
 * Ausloesen wird gewartet, bis kein Bild mehr unterwegs ist (decode() auf
 * jedes <img>). Ohne das letzte Stueck nimmt man beim zweiten Lauf ein halb
 * geladenes Bild auf und misst seine eigene Ungeduld.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';
const ZIEL = process.argv[2];
if (!ZIEL) { console.error('Aufruf: aufnahme.mjs <ordner>'); process.exit(1); }
mkdirSync(ZIEL, { recursive: true });

const BR = +(process.env.BREITE || 2752), HO = +(process.env.HOEHE || 1536);
const b = await chromium.launch(process.env.LEISTE ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {});
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BR, height: HO } });
  const fehler = [];
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  s.on('pageerror', x => fehler.push('pageerror: ' + x.message));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=${SAAT}`,
               { waitUntil: 'networkidle' });
  await s.waitForTimeout(2500);
  await s.evaluate(async () => {
    const l = [...document.images].map(i => i.decode().catch(() => {}));
    await Promise.all(l);
  });
  await s.waitForTimeout(600);
  await s.screenshot({ path: `${ZIEL}/e${e}.png`, animations: 'disabled' });
  console.log(`e${e}.png  Fehler ${fehler.length}` + (fehler.length ? ' — ' + fehler[0].slice(0, 120) : ''));
  await s.close();
}
await b.close();
console.log('Aufnahmen in ' + ZIEL);
