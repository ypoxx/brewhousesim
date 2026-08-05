/* FREIFLAECHE — wo liegt auf der Buehne ueberhaupt noch Platz?
   HAFEN=8907 node werkbank/schuss/stadt-w8/freiflaeche.mjs

   Zaehlt je Epoche die Rechteck-Huellen aller sichtbaren Oberflaechen-Kaesten
   (direkte Kinder der Ebenen marken/hand/kopf/blatt) in ein 32x24-Raster und
   nennt je Zelle die Stuecke, die dort liegen. Das ist AUSDRUECKLICH eine
   Huellenzaehlung und misst deshalb KEINE Deckung — dafuer gibt es
   aufsicht/deckung-je-stueck.mjs (Pixel). Hier geht es nur um die Frage:
   welcher Streifen ist von fremder Oberflaeche frei?                        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const B = 2752, H = 1536, SX = 32, SY = 24;

const b = await chromium.launch();
const raus = { stand: new Date().toISOString(), epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: B, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1000);
  const daten = await s.evaluate(({ SX, SY }) => {
    const raster = [];
    for (let i = 0; i < SY; i++) raster.push(new Array(SX).fill(null).map(() => new Set()));
    const kaesten = [];
    document.querySelectorAll('.ebene').forEach((w, i) => {
      if (i < 2) return;                       // platte + bau = das Bild
      /* Die direkten Kinder der Ebene sind die bildschirmfuellenden Faecher.
         Die tragenden Kaesten liegen eine Stufe tiefer. */
      const tief = [];
      [...w.children].forEach(f => {
        const fc = (typeof f.className === 'string') ? f.className : '';
        const fm = fc.match(/\b(stadt|fu|preis|gg|sud|nm|erb|kopf)[-\w]*/);
        [...f.children].forEach(el => tief.push([el, fm ? fm[1] : null]));
      });
      tief.forEach(([el, erbe]) => {
        const c = (typeof el.className === 'string') ? el.className : '';
        const m = c.match(/\b(stadt|fu|preis|gg|sud|nm|erb|kopf)[-\w]*/);
        const wem = m ? m[1] : (erbe || '?');
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        const st = getComputedStyle(el);
        if (st.visibility === 'hidden' || st.display === 'none' || +st.opacity === 0) return;
        kaesten.push({ wem, klasse: c.split(' ')[0], x: Math.round(r.x), y: Math.round(r.y),
                       w: Math.round(r.width), h: Math.round(r.height) });
      });
    });
    return kaesten;
  }, { SX, SY });
  const raster = [];
  for (let i = 0; i < SY; i++) raster.push(new Array(SX).fill(''));
  for (const k of daten) {
    const x0 = Math.max(0, Math.floor(k.x / (B / SX))), x1 = Math.min(SX - 1, Math.floor((k.x + k.w - 1) / (B / SX)));
    const y0 = Math.max(0, Math.floor(k.y / (H / SY))), y1 = Math.min(SY - 1, Math.floor((k.y + k.h - 1) / (H / SY)));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const z = k.wem === 'stadt' ? 'S' : k.wem === 'kopf' ? 'K' : k.wem[0].toUpperCase();
      if (!raster[y][x].includes(z)) raster[y][x] += z;
    }
  }
  console.log(`\n=== Epoche ${e} ===  (Zeile = ${(H / SY).toFixed(0)} px, Spalte = ${(B / SX).toFixed(0)} px)`);
  raster.forEach((z, i) => console.log(String(Math.round(i * H / SY)).padStart(5) + ' |' +
    z.map(c => (c || '.').padEnd(3)).join('')));
  console.log('  Kaesten:');
  daten.sort((a, c) => a.y - c.y).forEach(k =>
    console.log(`    ${k.wem.padEnd(6)} ${k.klasse.padEnd(22)} x${String(k.x).padStart(5)} y${String(k.y).padStart(5)} ${String(k.w).padStart(5)}x${String(k.h).padStart(4)}`));
  raus.epochen['e' + e] = { raster: raster.map(z => z.map(c => c || '.').join('|')), kaesten: daten };
  await s.close();
}
await b.close();
writeFileSync('werkbank/schuss/stadt-w8/freiflaeche.json', JSON.stringify(raus, null, 1));
