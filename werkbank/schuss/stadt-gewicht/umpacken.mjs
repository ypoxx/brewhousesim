/* UMPACKEN — PNG/JPG nach WebP, mit gleichen Massen.
 *
 *   node werkbank/schuss/stadt-gewicht/umpacken.mjs probe        # nur messen
 *   node werkbank/schuss/stadt-gewicht/umpacken.mjs schreibe     # wirklich schreiben
 *
 * Warum WebP und NICHT kleinere Bilder: `K.fuesse` und `K.bildmass` in
 * stadt-daten.js stehen in Pixeln bzw. als Anteil der Bildhoehe. Wer die Masse
 * aendert, macht beide Tabellen ungueltig — und DAS LOT rechnet damit, wo ein
 * Aufbau den Boden beruehrt. Gleiche Masse heisst: keine der beiden Tabellen
 * muss angefasst werden, und das Lot misst weiter dasselbe.
 *
 * Warum es keinen Kommandozeilenpacker gibt: auf dieser Maschine ist weder
 * pngquant noch optipng noch ImageMagick noch cwebp installiert (geprueft).
 * Chromium kann es selbst — canvas.toDataURL('image/webp', q) benutzt libwebp,
 * und der Alphakanal bleibt dabei verlustfrei.
 *
 * Die Guete steht als Q unten. Sie ist NICHT frei gewaehlt: darunter steht die
 * pixelweise Gegenprobe (vergleich.mjs), und die entscheidet.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const MODUS = process.argv[2] || 'probe';
const Q = Number(process.env.Q || 0.92);
const WAS = process.env.WAS || 'hof';           // hof | platten | alles
const ORDNER = (WAS === 'platten') ? [] : ['spiel/bild/hof'];
const EINZELN = (WAS === 'hof') ? []
  : ['spiel/bild/platte-1350.jpg', 'spiel/bild/platte-1600.jpg',
     'spiel/bild/platte-1884.jpg', 'spiel/bild/platte-1970.jpg'];

const dateien = [];
for (const o of ORDNER) {
  for (const f of readdirSync(o)) {
    if (/\.(png|jpg|jpeg)$/i.test(f)) dateien.push(join(o, f));
  }
}
dateien.push(...EINZELN);

const b = await chromium.launch();
const s = await b.newPage();
await s.goto('data:text/html,<title>umpacken</title>');

let vorher = 0, nachher = 0;
const zeilen = [];

for (const p of dateien) {
  const roh = readFileSync(p);
  const art = /\.png$/i.test(p) ? 'image/png' : 'image/jpeg';
  const daten = 'data:' + art + ';base64,' + roh.toString('base64');

  const erg = await s.evaluate(async ([d, q]) => {
    const im = new Image();
    await new Promise((ja, nein) => { im.onload = ja; im.onerror = nein; im.src = d; });
    const c = document.createElement('canvas');
    c.width = im.naturalWidth; c.height = im.naturalHeight;
    const k = c.getContext('2d', { willReadFrequently: false });
    k.imageSmoothingEnabled = false;
    k.drawImage(im, 0, 0);
    const u = c.toDataURL('image/webp', q);
    return { w: c.width, h: c.height, u: u, art: u.slice(5, u.indexOf(';')) };
  }, [daten, Q]);

  if (erg.art !== 'image/webp') { console.error('KEIN WEBP fuer ' + p + ' — ' + erg.art); process.exit(1); }
  const neu = Buffer.from(erg.u.slice(erg.u.indexOf(',') + 1), 'base64');
  vorher += roh.length; nachher += neu.length;
  const ziel = p.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  zeilen.push({ von: p, nach: ziel, w: erg.w, h: erg.h,
                kb_alt: Math.round(roh.length / 1024), kb_neu: Math.round(neu.length / 1024),
                anteil: +(neu.length / roh.length).toFixed(3) });
  if (MODUS === 'schreibe') writeFileSync(ziel, neu);
}

await b.close();
zeilen.sort((a, c) => c.kb_alt - a.kb_alt);
for (const z of zeilen) {
  console.log(`${String(z.kb_alt).padStart(5)} → ${String(z.kb_neu).padStart(5)} KB  ` +
              `(${(z.anteil * 100).toFixed(0)}%)  ${z.von}  ${z.w}x${z.h}`);
}
console.log(`SUMME ${(vorher / 1048576).toFixed(2)} MB → ${(nachher / 1048576).toFixed(2)} MB ` +
            `bei Q=${Q} (${((1 - nachher / vorher) * 100).toFixed(1)} % weniger), ${zeilen.length} Dateien`);
writeFileSync('werkbank/schuss/stadt-gewicht/umpacken-q' + String(Q).replace('.', '') + '.json',
              JSON.stringify({ Q, modus: MODUS, vorher, nachher, zeilen }, null, 2));
