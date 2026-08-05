/* Ein winziger PNG-Leser — nur so viel, wie Playwright-Aufnahmen brauchen:
   8 Bit je Kanal, Farbtyp 6 (RGBA) oder 2 (RGB), nicht verschränkt.

   WARUM SELBST GESCHRIEBEN: In diesem Container liegt kein pngjs, und die
   Deckung der Bedienoberfläche muss PIXELWEISE gemessen werden — ein erster
   Anlauf über Rechteck-Hüllen kam auf 72 % statt der gemessenen 27 %, weil
   eine Hülle nicht deckt, was in ihr durchsichtig ist. Lieber vierzig Zeilen
   Dekoder als eine Zahl, die um das Zweieinhalbfache danebenliegt.

   Rückgabe: { breite, hoehe, daten } mit daten als RGBA-Bytes.             */
import { inflateSync } from 'node:zlib';

export function pngLesen(puffer) {
  if (puffer.readUInt32BE(0) !== 0x89504e47) throw new Error('kein PNG');
  let i = 8, breite = 0, hoehe = 0, tiefe = 0, typ = 0, verschraenkt = 0;
  const teile = [];
  while (i < puffer.length) {
    const laenge = puffer.readUInt32BE(i);
    const art = puffer.toString('ascii', i + 4, i + 8);
    const rumpf = puffer.subarray(i + 8, i + 8 + laenge);
    if (art === 'IHDR') {
      breite = rumpf.readUInt32BE(0); hoehe = rumpf.readUInt32BE(4);
      tiefe = rumpf[8]; typ = rumpf[9]; verschraenkt = rumpf[12];
    } else if (art === 'IDAT') teile.push(rumpf);
    else if (art === 'IEND') break;
    i += 12 + laenge;
  }
  if (tiefe !== 8 || (typ !== 6 && typ !== 2) || verschraenkt !== 0)
    throw new Error(`nicht unterstuetzt: Tiefe ${tiefe}, Typ ${typ}, verschraenkt ${verschraenkt}`);

  const kanaele = typ === 6 ? 4 : 3;
  const roh = inflateSync(Buffer.concat(teile));
  const zeile = breite * kanaele;
  const aus = Buffer.alloc(hoehe * breite * 4);
  let vor = Buffer.alloc(zeile);                    // vorherige Zeile, entfiltert

  for (let y = 0; y < hoehe; y++) {
    const f = roh[y * (zeile + 1)];
    const z = Buffer.from(roh.subarray(y * (zeile + 1) + 1, (y + 1) * (zeile + 1)));
    for (let x = 0; x < zeile; x++) {
      const a = x >= kanaele ? z[x - kanaele] : 0;  // links
      const b = vor[x];                             // oben
      const c = x >= kanaele ? vor[x - kanaele] : 0; // oben links
      let v = z[x];
      if (f === 1) v += a;
      else if (f === 2) v += b;
      else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) {                           // Paeth
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      z[x] = v & 0xff;
    }
    for (let x = 0; x < breite; x++) {
      const q = (y * breite + x) * 4, s = x * kanaele;
      aus[q] = z[s]; aus[q + 1] = z[s + 1]; aus[q + 2] = z[s + 2];
      aus[q + 3] = kanaele === 4 ? z[s + 3] : 255;
    }
    vor = z;
  }
  return { breite, hoehe, daten: aus };
}
