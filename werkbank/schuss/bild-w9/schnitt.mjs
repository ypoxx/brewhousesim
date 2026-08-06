/* SCHNITT — Ausschnitte aus Zielblatt UND Aufnahme nebeneinander, 1:1.
     node werkbank/schuss/bild-w9/schnitt.mjs <name> <x> <y> <b> <h> <datei…>

   Laedt jede Datei als data-URI in eine Leinwand und schreibt den Ausschnitt
   als PNG heraus. Kein Netz, keine Fremdbibliothek. JPG und PNG gleichermassen.
   Massstab 2: der Ausschnitt wird verdoppelt, damit kleine Schrift lesbar ist. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const [name, X, Y, B, H, ...dateien] = process.argv.slice(2);
const ZIEL = 'werkbank/schuss/bild-w9/bilder';
const M = +(process.env.MASS || 2);

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 400, height: 300 } });
await s.goto('about:blank');

for (const d of dateien) {
  const roh = readFileSync(d);
  const typ = d.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  const uri = `data:${typ};base64,` + roh.toString('base64');
  const png = await s.evaluate(async ([uri, x, y, w, h, m]) => {
    const im = new Image();
    await new Promise((ok, no) => { im.onload = ok; im.onerror = no; im.src = uri; });
    const c = document.createElement('canvas');
    c.width = w * m; c.height = h * m;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(im, x, y, w, h, 0, 0, w * m, h * m);
    return c.toDataURL('image/png').split(',')[1];
  }, [uri, +X, +Y, +B, +H, M]);
  const kurz = d.split('/').pop().replace(/\.(png|jpg)$/, '');
  const aus = `${ZIEL}/schnitt-${name}-${kurz}.png`;
  writeFileSync(aus, Buffer.from(png, 'base64'));
  console.log(aus);
}
await b.close();
