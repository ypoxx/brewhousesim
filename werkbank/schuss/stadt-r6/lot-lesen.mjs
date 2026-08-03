/* Liest DAS LOT im laufenden Spiel aus — BRAUHAUS.stadt.boden.pruefe(), also
   dieselbe Rechnung, die auch ?boden=1 ins Bild malt. Kein Quelltext, kein
   Datenblatt: was hier steht, steht so auf dem Bildschirm.

     node werkbank/schuss/stadt-r6/lot-lesen.mjs [bau=alle]                    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const bau = process.argv[2] || 'alle';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
let schlecht = 0, alle = 0;
for (const ep of [1, 2, 3, 4]) {
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&bau=${bau}`,
    { waitUntil: 'networkidle' });
  await seite.waitForTimeout(600);
  const l = await seite.evaluate(() => BRAUHAUS.stadt.boden.pruefe());
  const lage = await seite.evaluate(() => BRAUHAUS.lage.length);
  console.log(`\n--- Epoche ${ep} (bau=${bau}) · ${l.length} Aufbauten · BRAUHAUS.lage ${lage}`);
  for (const z of l) {
    alle++;
    if (!z.gut) schlecht++;
    console.log(`${z.gut ? '  steht ' : '  FEHLER'} ${z.schluessel.padEnd(16)} `
      + `Boden ${z.boden.padEnd(5)} tiefster Punkt ${String(z.tiefste).padStart(5)} px`
      + ` unter der Mauerlinie  (${z.spalten} Spalten gemessen)`
      + (z.sagt ? '  — ' + z.sagt : ''));
  }
}
await browser.close();
console.log(`\n${alle - schlecht} von ${alle} stehen auf ihrem Boden.`);
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n')
  : 'keine Fehler auf der Seite');
