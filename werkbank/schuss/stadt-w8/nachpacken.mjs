/* NACHPACKEN — zwei eigene Hofbilder dichter packen, mit Gegenprobe.
 *
 *   node werkbank/schuss/stadt-w8/nachpacken.mjs probe|schreibe
 *
 * WARUM: die Hoffracht aus Welle 8 kostet Gewicht, und die schwerste Epoche
 * (1600) stand vorher schon bei 7,42 MB gegen eine Obergrenze von 8. Die zwei
 * dicksten Dateien des Ordners sind `laderampe` (407 KB) und `brunnen`
 * (294 KB) — beide gehoeren DER STADT, beide werden in 1600 geladen
 * (brunnen im eigenen Katalog, laderampe ueber die Vorladestufe 1 fuer den
 * Stand von 1884).
 *
 * Die Masse bleiben gleich — das ist Bedingung, sonst werden `K.fuesse` und
 * `K.bildmass` in stadt-daten.js ungueltig und DAS LOT rechnet mit dem alten
 * Bild (dieselbe Begruendung wie in stadt-gewicht/umpacken.mjs, Welle 7).
 * Geaendert wird ausschliesslich die Guete.
 *
 * Die Gegenprobe steht daneben: PSNR gegen die JETZIGE Datei, gerechnet ueber
 * die deckenden Pixel. Unter 40 dB waere sichtbar; darueber nicht.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const MODUS = process.argv[2] || 'probe';
const Q = Number(process.env.Q || 0.72);
const DATEIEN = (process.env.DATEIEN || 'laderampe,brunnen').split(',');

const b = await chromium.launch();
const s = await b.newPage();
await s.setContent('<body style="margin:0">');

for (const name of DATEIEN) {
  const pfad = `spiel/bild/hof/${name}.webp`;
  const alt = statSync(pfad).size;
  const roh = readFileSync(pfad).toString('base64');
  const erg = await s.evaluate(async ({ roh, Q }) => {
    const bild = new Image();
    await new Promise((ok, weh) => { bild.onload = ok; bild.onerror = weh; bild.src = 'data:image/webp;base64,' + roh; });
    const w = bild.naturalWidth, h = bild.naturalHeight;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.drawImage(bild, 0, 0);
    const url = c.toDataURL('image/webp', Q);
    /* Gegenprobe: das neue Bild wieder einlesen und Pixel gegen Pixel. */
    const neu = new Image();
    await new Promise(ok => { neu.onload = ok; neu.src = url; });
    const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;
    const g2 = c2.getContext('2d'); g2.drawImage(neu, 0, 0);
    const A = g.getImageData(0, 0, w, h).data, B = g2.getImageData(0, 0, w, h).data;
    let n = 0, sum = 0, aMax = 0;
    for (let i = 0; i < A.length; i += 4) {
      if (A[i + 3] < 8) continue;
      for (let k = 0; k < 3; k++) { const d = A[i + k] - B[i + k]; sum += d * d; n++; }
      const da = A[i + 3] - B[i + 3]; if (Math.abs(da) > aMax) aMax = Math.abs(da);
    }
    const mse = sum / Math.max(1, n);
    return { url, w, h, psnr: mse === 0 ? 99 : 10 * Math.log10(255 * 255 / mse), alphaMax: aMax };
  }, { roh, Q });
  const buf = Buffer.from(erg.url.split(',')[1], 'base64');
  console.log(`${name}: ${erg.w}x${erg.h}  ${(alt / 1024).toFixed(0)} -> ${(buf.length / 1024).toFixed(0)} KB` +
              `  PSNR ${erg.psnr.toFixed(1)} dB  Alpha-Abweichung max ${erg.alphaMax}`);
  if (MODUS === 'schreibe') writeFileSync(pfad, buf);
}
await b.close();
