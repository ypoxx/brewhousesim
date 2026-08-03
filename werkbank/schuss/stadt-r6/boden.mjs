/* ===========================================================================
   werkbank/schuss/stadt-r6/boden.mjs — DAS LOT.

   Runde 5 ging zurueck mit dem Satz "DER BODEN IST NICHT ZU". Dies ist das
   Geraet, mit dem er zugemacht und nachgewiesen wird — dasselbe Verfahren,
   mit dem der Kritiker die Kueferei auf dem Hoftor gefunden hat:

     · ein Schuss ?bau=keine als Grund,
     · je Aufbau ein Schuss ?bau=<schluessel>,
     · Differenzmaske, je Spalte die UNTERSTE geaenderte Zeile,
     · verglichen mit der Mauerlinie der vier Platten.

   Fremde Ebenen werden ausgeblendet, damit kein Preisschild des GEGNERS als
   Gebaeude in die Maske geraet.

     node werkbank/schuss/stadt-r6/boden.mjs [epoche...]
   =========================================================================== */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { PNG } from '/opt/node22/lib/node_modules/pngjs/lib/png.js';
import fs from 'node:fs';

const BASIS = 'http://127.0.0.1:8899/spiel/';
const B = 2752, H = 1536;

/* Die Mauerlinie, nachgemessen an allen vier leeren Hoefen (Runde 4). */
function mauer(x) {
  return x <= 823 ? 1205 - 0.49 * (823 - x) : 1205 - 0.45 * (x - 823);
}

const VERSTECKE = `
  [data-stueck]:not([data-stueck="stadt"]) { display: none !important; }
  #ebene-kopf, .stadt-werkbank, .stadt-name, .stadt-schildwerk { display: none !important; }
`;

async function schuss(seite, url) {
  await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await seite.addStyleTag({ content: VERSTECKE });
  await seite.waitForTimeout(500);
  return PNG.sync.read(await seite.screenshot());
}

function maske(a, b) {
  const n = B * H, unten = new Int32Array(B).fill(-1), oben = new Int32Array(B).fill(-1);
  let zahl = 0;
  for (let i = 0; i < n; i++) {
    const p = i * 4;
    const d = Math.abs(a.data[p] - b.data[p]) + Math.abs(a.data[p + 1] - b.data[p + 1])
            + Math.abs(a.data[p + 2] - b.data[p + 2]);
    if (d > 24) {
      const x = i % B, y = (i / B) | 0;
      zahl++;
      if (y > unten[x]) unten[x] = y;
      if (oben[x] < 0) oben[x] = y;
    }
  }
  return { unten, zahl };
}

const epochen = process.argv.slice(2).length ? process.argv.slice(2).map(Number) : [1, 2, 3, 4];
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: B, height: H }, deviceScaleFactor: 1 });
const bericht = [];

for (const ep of epochen) {
  const grund = await schuss(seite, `${BASIS}?epoche=${ep}&bau=keine`);
  const liste = await seite.evaluate(() => BRAUHAUS.stadt.katalog());
  for (const a of liste) {
    const bild = await schuss(seite, `${BASIS}?epoche=${ep}&bau=${a.schluessel}`);
    const m = maske(grund, bild);
    let tiefe = -1e9, tiefeX = 0, spalten = 0, breit = 0;
    for (let x = 0; x < B; x++) {
      if (m.unten[x] < 0) continue;
      breit++;
      const ueber = m.unten[x] - mauer(x);
      if (ueber > 15) spalten++;
      if (ueber > tiefe) { tiefe = ueber; tiefeX = x; }
    }
    const z = { epoche: ep, schluessel: a.schluessel, pixel: m.zahl, breit,
                tiefe: Math.round(tiefe), x: tiefeX, spalten };
    bericht.push(z);
    console.log(`E${ep} ${a.schluessel.padEnd(18)} px=${String(m.zahl).padStart(7)}`
      + ` unter der Mauer: ${String(z.tiefe).padStart(5)} px bei x=${String(tiefeX).padStart(4)}`
      + `  ${spalten}/${breit} Spalten`);
  }
}

await browser.close();
fs.writeFileSync(new URL('./boden.json', import.meta.url), JSON.stringify(bericht, null, 1));
console.log('\ngeschrieben: werkbank/schuss/stadt-r6/boden.json');
