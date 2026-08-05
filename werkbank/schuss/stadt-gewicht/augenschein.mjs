/* AUGENSCHEIN — der Blick, den keine Kennzahl ersetzt.
 *
 *   node werkbank/schuss/stadt-gewicht/augenschein.mjs <vorher> <nachher> <e> <ziel.png>
 *
 * Legt die dichteste Unterschiedsstelle der Epoche als 1:1-Ausschnitt
 * nebeneinander (links vorher, rechts nachher) und darunter beide ganz,
 * verkleinert. PSNR sagt, ob sich etwas bewegt hat; das hier sagt, WAS.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const A = process.argv[2], B = process.argv[3], E = process.argv[4] || '3';
const ZIEL = process.argv[5] || 'werkbank/schuss/stadt-w7/augenschein.png';

const b = await chromium.launch();
const s = await b.newPage();
await s.goto('data:text/html,<title>augenschein</title>');
const d = (p) => 'data:image/png;base64,' + readFileSync(p).toString('base64');

const u = await s.evaluate(async ([da, db]) => {
  const laden = async (q) => { const i = new Image();
    await new Promise(r => { i.onload = r; i.src = q; }); return i; };
  const ia = await laden(da), ib = await laden(db);
  const W = ia.naturalWidth, H = ia.naturalHeight;
  const k = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h;
                        return [c, c.getContext('2d', { willReadFrequently: true })]; };
  const [ca, ka] = k(W, H); ka.drawImage(ia, 0, 0);
  const [cb, kb] = k(W, H); kb.drawImage(ib, 0, 0);
  const pa = ka.getImageData(0, 0, W, H).data, pb = kb.getImageData(0, 0, W, H).data;

  /* dichteste Stelle: Kachel 128x128 mit der groessten Summe der Unterschiede */
  const T = 128; let best = -1, bx = 0, by = 0;
  for (let y = 0; y + T <= H; y += T) for (let x = 0; x + T <= W; x += T) {
    let sm = 0;
    for (let j = 0; j < T; j += 2) for (let i = 0; i < T; i += 2) {
      const o = ((y + j) * W + (x + i)) * 4;
      sm += Math.abs(pa[o] - pb[o]) + Math.abs(pa[o + 1] - pb[o + 1]) + Math.abs(pa[o + 2] - pb[o + 2]);
    }
    if (sm > best) { best = sm; bx = x; by = y; }
  }
  const AUS = 420;
  const x0 = Math.max(0, Math.min(W - AUS, bx + T / 2 - AUS / 2));
  const y0 = Math.max(0, Math.min(H - AUS, by + T / 2 - AUS / 2));

  const kleinW = 900, kleinH = Math.round(H * kleinW / W);
  const [cz, kz] = k(AUS * 2 + 12, AUS + 24 + kleinH * 2 + 24);
  kz.fillStyle = '#111'; kz.fillRect(0, 0, cz.width, cz.height);
  kz.imageSmoothingQuality = 'high';
  kz.drawImage(ca, x0, y0, AUS, AUS, 0, 0, AUS, AUS);
  kz.drawImage(cb, x0, y0, AUS, AUS, AUS + 12, 0, AUS, AUS);
  kz.fillStyle = '#fff'; kz.font = '16px sans-serif';
  kz.fillText(`VORHER 1:1  (${x0},${y0})`, 8, AUS + 18);
  kz.fillText('NACHHER 1:1', AUS + 20, AUS + 18);
  kz.drawImage(ca, 0, AUS + 24, kleinW, kleinH);
  kz.drawImage(cb, 0, AUS + 24 + kleinH + 12, kleinW, kleinH);
  return cz.toDataURL('image/png');
}, [d(`${A}/e${E}.png`), d(`${B}/e${E}.png`)]);

await b.close();
writeFileSync(ZIEL, Buffer.from(u.slice(u.indexOf(',') + 1), 'base64'));
console.log('geschrieben: ' + ZIEL);
