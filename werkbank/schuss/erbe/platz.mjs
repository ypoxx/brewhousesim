/* WO IST PLATZ? — belegte Rechtecke am Bildschirm, je Stueck.
   node werkbank/schuss/erbe/platz.mjs <epoche> [breite] [hoehe] */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1), BR = +(process.argv[3] || 1920), HO = +(process.argv[4] || 1000);
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: BR, height: HO } });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(800);

const r = await s.evaluate(() => {
  const B = document.getElementById('buehne').getBoundingClientRect();
  const raster = [];
  const NX = 24, NY = 14;
  for (let y = 0; y < NY; y++) {
    let z = '';
    for (let x = 0; x < NX; x++) {
      const px = B.left + (x + 0.5) * B.width / NX;
      const py = B.top + (y + 0.5) * B.height / NY;
      const el = document.elementFromPoint(px, py);
      const fach = el && el.closest ? el.closest('.fach') : null;
      const st = fach ? fach.getAttribute('data-stueck') : null;
      z += st ? st[0].toUpperCase() : (el && el.id === 'buehne' ? '.' : (el && el.classList.contains('ebene') ? '.' : '?'));
    }
    raster.push(z);
  }
  const kaesten = [];
  document.querySelectorAll('.fach > *').forEach(e => {
    const q = e.getBoundingClientRect();
    if (q.width < 20 || q.height < 20) return;
    kaesten.push({
      stueck: e.closest('.fach').getAttribute('data-stueck'),
      klasse: e.className,
      x: Math.round(q.left / B.width * 100), y: Math.round(q.top / B.height * 100),
      b: Math.round(q.width / B.width * 100), h: Math.round(q.height / B.height * 100)
    });
  });
  return { raster, kaesten: kaesten.sort((a, c) => c.b * c.h - a.b * a.h).slice(0, 22) };
});
console.log('EPOCHE ' + EP + '  ' + BR + 'x' + HO + '   (S=stadt F=fuhre/gegner? erster Buchstabe)');
r.raster.forEach((z, i) => console.log(String(i).padStart(2) + ' ' + z));
console.table(r.kaesten);
await b.close();
