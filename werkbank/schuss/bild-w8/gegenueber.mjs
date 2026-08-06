/* GEGENUEBER — Zielblatt und Spielaufnahme, derselbe Ausschnitt, uebereinander.
     node werkbank/schuss/bild-w8/gegenueber.mjs

   Baut aus den vier Zielblaettern und den vier Spielaufnahmen Vergleichsbogen:
   je Epoche und Ausschnitt ein PNG, oben das Zielblatt, unten das Spiel, beide
   im GLEICHEN Rechteck des 2752x1536-Rahmens und gleich vergroessert. So haengt
   das Urteil an Bildpunkten derselben Stelle und nicht am Gedaechtnis.

   Ein Browser, ein Messfenster, alle Bogen in einem Durchgang.               */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';

const AUS = 'werkbank/schuss/bild-w8/bogen';
mkdirSync(AUS, { recursive: true });
const ziel = { 1: 'zielbild/01-1350.jpg', 2: 'zielbild/02-1600.jpg',
               3: 'zielbild/03-1884.jpg', 4: 'zielbild/04-1970.jpg' };
const spiel = e => `werkbank/schuss/bild-w8/bilder/e${e}-10-gespielt.png`;
const nackt = e => `werkbank/schuss/bild-w8/bilder/e${e}-11-gespielt-nackt.png`;

/* Ausschnitte im Bezugsrahmen 2752x1536 */
const felder = [
  { n: 'hof',        x: 200,  y: 460, w: 1350, h: 860 },
  { n: 'stadt',      x: 1150, y: 120, w: 1050, h: 760 },
  { n: 'fluss-bahn', x: 1800, y: 120, w: 952,  h: 1000 },
  { n: 'unten',      x: 0,    y: 1180, w: 2752, h: 356 },
  { n: 'kopfband',   x: 0,    y: 0,   w: 2752, h: 190 },
];

const uri = f => 'data:image/' + (f.endsWith('.jpg') ? 'jpeg' : 'png') + ';base64,' +
  readFileSync(f).toString('base64');

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2400, height: 1400 }, deviceScaleFactor: 1 });

for (const e of [1, 2, 3, 4]) {
  const aZ = uri(ziel[e]), aS = uri(spiel(e)), aN = uri(nackt(e));
  for (const f of felder) {
    const zoom = Math.min(2360 / f.w, 1.9);
    const bh = Math.round(f.h * zoom), bw = Math.round(f.w * zoom);
    const html = `<style>
      body{margin:0;background:#141414;font:600 22px system-ui,sans-serif;color:#f2e6d0}
      .r{display:block;margin:0 0 6px}
      .t{padding:5px 12px;background:#3a2a18}
      .b{width:${bw}px;height:${bh}px;overflow:hidden;position:relative}
      .b img{position:absolute;left:${-f.x * zoom}px;top:${-f.y * zoom}px;
             width:${2752 * zoom}px;height:${1536 * zoom}px;image-rendering:auto}
    </style>
    <div class="r"><div class="t">ZIELBILD ${e} — ${f.n} — x${f.x} y${f.y} ${f.w}×${f.h} — zoom ${zoom.toFixed(2)}</div>
      <div class="b"><img src="${aZ}"></div></div>
    <div class="r"><div class="t">SPIEL ${e} (gespielt, mit Oberflaeche)</div>
      <div class="b"><img src="${aS}"></div></div>
    <div class="r"><div class="t">SPIEL ${e} (gespielt, NACKT — nur platte+bau)</div>
      <div class="b"><img src="${aN}"></div></div>`;
    await p.setViewportSize({ width: bw + 4, height: 3 * (bh + 40) + 20 });
    await p.setContent(html);
    await p.waitForTimeout(350);
    const datei = `${AUS}/e${e}-${f.n}.png`;
    await p.screenshot({ path: datei, fullPage: true });
    console.log(datei);
  }
}
await b.close();
