/* SCHNITT — Ausschnitte aus Zielblatt UND Aufnahme, 1:1, in EINEM Browserstart.
     node werkbank/schuss/bild-w9/schnitt.mjs werkbank/schuss/bild-w9/schnitte.json

   Die Auftragsdatei ist eine Liste von {name,x,y,b,h,dateien:[…],mass?}.
   Jede Datei wird als data-URI in eine Leinwand geladen und der Ausschnitt als
   PNG herausgeschrieben. Kein Netz, keine Fremdbibliothek; JPG wie PNG.       */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const auftraege = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ZIEL = 'werkbank/schuss/bild-w9/bilder';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 400, height: 300 } });
await s.goto('about:blank');

/* Jede Datei nur EINMAL laden, auch wenn mehrere Ausschnitte sie brauchen. */
const geladen = new Set();
const alleDateien = [...new Set(auftraege.flatMap(a => a.dateien))];
for (const d of alleDateien) {
  const roh = readFileSync(d);
  const typ = d.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  await s.evaluate(async ([schluessel, uri]) => {
    window.__bilder = window.__bilder || {};
    const im = new Image();
    await new Promise((ok, no) => { im.onload = ok; im.onerror = no; im.src = uri; });
    window.__bilder[schluessel] = im;
  }, [d, `data:${typ};base64,` + roh.toString('base64')]);
  geladen.add(d);
  console.error('geladen: ' + d);
}

for (const a of auftraege) {
  const m = a.mass || 2;
  for (const d of a.dateien) {
    const png = await s.evaluate(([k, x, y, w, h, m]) => {
      const im = window.__bilder[k];
      const c = document.createElement('canvas');
      c.width = w * m; c.height = h * m;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.drawImage(im, x, y, w, h, 0, 0, w * m, h * m);
      return c.toDataURL('image/png').split(',')[1];
    }, [d, a.x, a.y, a.b, a.h, m]);
    const kurz = d.split('/').pop().replace(/\.(png|jpg)$/, '');
    const aus = `${ZIEL}/schnitt-${a.name}-${kurz}.png`;
    writeFileSync(aus, Buffer.from(png, 'base64'));
    console.log(aus);
  }
}
await b.close();
