/* SCHNITT — ein Rechteck aus einer PNG-Aufnahme herausschneiden, ohne Browser.
     node werkbank/schuss/bild-w8/schnitt.mjs <quelle.png> <x> <y> <b> <h> <ziel.png> [zoom]

   Warum: das Lesewerkzeug zeigt ein 2752-Bild auf 2000 px herunterskaliert.
   Wer eine Beschriftung oder einen Hofteil beurteilen will, braucht ihn in
   voller Aufloesung. Ein Ausschnitt in Originalgroesse (oder ganzzahlig
   vergroessert) ist genau das.

   Nur Nearest-Neighbour-Vergroesserung — es soll nichts geglaettet werden, was
   im Original hart ist.                                                      */
import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { pngLesen } from '../aufsicht/png-lesen.mjs';

const [q, X, Y, B, H, ziel, z] = process.argv.slice(2);
const x0 = +X, y0 = +Y, bw = +B, bh = +H, zoom = Math.max(1, Math.round(+(z || 1)));
const A = pngLesen(readFileSync(q));
const W = Math.min(bw, A.breite - x0), Ho = Math.min(bh, A.hoehe - y0);
const zw = W * zoom, zh = Ho * zoom;

const roh = Buffer.alloc(zh * (zw * 3 + 1));
for (let y = 0; y < zh; y++) {
  const p = y * (zw * 3 + 1); roh[p] = 0;                    // Filter 0
  const sy = y0 + Math.floor(y / zoom);
  for (let x = 0; x < zw; x++) {
    const sx = x0 + Math.floor(x / zoom);
    const i = (sy * A.breite + sx) * 4, o = p + 1 + x * 3;
    roh[o] = A.daten[i]; roh[o + 1] = A.daten[i + 1]; roh[o + 2] = A.daten[i + 2];
  }
}
const tabelle = (() => { const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return t; })();
const crc = (b) => { let c = -1; for (const v of b) c = tabelle[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const teil = (art, rumpf) => {
  const kopf = Buffer.alloc(8); kopf.writeUInt32BE(rumpf.length, 0); kopf.write(art, 4, 'ascii');
  const ende = Buffer.alloc(4); ende.writeUInt32BE(crc(Buffer.concat([Buffer.from(art, 'ascii'), rumpf])), 0);
  return Buffer.concat([kopf, rumpf, ende]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(zw, 0); ihdr.writeUInt32BE(zh, 4); ihdr[8] = 8; ihdr[9] = 2;
writeFileSync(ziel, Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  teil('IHDR', ihdr), teil('IDAT', deflateSync(roh, { level: 6 })), teil('IEND', Buffer.alloc(0))]));
console.log(`${ziel}  ${zw}x${zh}  (aus ${q} bei ${x0},${y0} ${W}x${Ho}, zoom ${zoom})`);
