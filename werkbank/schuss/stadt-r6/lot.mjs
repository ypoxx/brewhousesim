/* ===========================================================================
   werkbank/schuss/stadt-r6/lot.mjs — DAS LOT, Teil 1: die Schuesse.

   Runde 5 ging zurueck mit dem Satz "DER BODEN IST NICHT ZU". Dies ist das
   Geraet, mit dem er zugemacht und nachgewiesen wird — dasselbe Verfahren,
   mit dem der Kritiker die Kueferei auf dem Hoftor gefunden hat: ein Schuss
   ?bau=keine als Grund, je Aufbau ein Schuss ?bau=<schluessel>, und fremde
   Ebenen dabei ausgeblendet, damit kein Preisschild in die Maske geraet.

     node werkbank/schuss/stadt-r6/lot.mjs <ordner> [epoche...]
     python3 werkbank/schuss/stadt-r6/lot.py <ordner>
   =========================================================================== */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const BASIS = 'http://127.0.0.1:8899/spiel/';
const B = 2752, H = 1536;

const ordner = process.argv[2] || 'werkbank/schuss/stadt-r6/lot';
const epochen = process.argv.slice(3).length ? process.argv.slice(3).map(Number) : [1, 2, 3, 4];
fs.mkdirSync(ordner, { recursive: true });

const VERSTECKE = `
  [data-stueck]:not([data-stueck="stadt"]) { display: none !important; }
  #ebene-kopf, .stadt-werkbank { display: none !important; }
  .stadt-name, .stadt-schildwerk { display: none !important; }
`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: B, height: H }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

async function schuss(url, datei) {
  await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await seite.addStyleTag({ content: VERSTECKE });
  await seite.waitForTimeout(450);
  await seite.screenshot({ path: path.join(ordner, datei) });
}

for (const ep of epochen) {
  await schuss(`${BASIS}?epoche=${ep}&bau=keine`, `e${ep}-keine.png`);
  const liste = await seite.evaluate((e) =>
    STADT_DATEN.aufbauten.filter((a) => a.von <= e && a.bis >= e).map((a) => a.schluessel), ep);
  for (const s of liste) await schuss(`${BASIS}?epoche=${ep}&bau=${s}`, `e${ep}-${s}.png`);
  console.log(`E${ep}: ${liste.length} Aufbauten`);
}

await browser.close();
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n') : 'keine Fehler auf der Seite');
