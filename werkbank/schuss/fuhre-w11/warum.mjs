/* WARUM 169.303 px? — die Gegenprobe zum photographischen Geraet.
 * Sie stellt den Durchgang von messen.mjs fuer EIN Stueck nach und schreibt
 * die Bilder heraus, damit man SIEHT, was verschwindet.
 *   HAFEN=8951 EPOCHE=1 node werkbank/schuss/fuhre-w11/warum.mjs
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8951';
const E = +(process.env.EPOCHE || 1);
const WOCHEN = +(process.env.WOCHEN || 0);
const W = 2752, H = 1536;

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: W, height: H } });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1600);
for (let i = 0; i < WOCHEN; i++) {
  await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
  await s.waitForTimeout(180);
}
await s.waitForTimeout(700);
await s.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused !important;animation-delay:0s !important;transition:none !important;}' });
await s.waitForTimeout(400);

const bericht = await s.evaluate(() => {
  const raus = { bretter: [], marken: [], fach: null };
  document.querySelectorAll('.fu-brett').forEach(el => {
    const c = getComputedStyle(el); const r = el.getBoundingClientRect();
    raus.bretter.push({ klasse: el.className, clip: c.clipPath, vis: c.visibility,
      mass: Math.round(r.width) + '×' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y) });
  });
  document.querySelectorAll('.fu-marke').forEach(el => {
    const c = getComputedStyle(el); const r = el.getBoundingClientRect();
    raus.marken.push({ klasse: el.className, clip: c.clipPath, op: c.opacity,
      mass: Math.round(r.width) + '×' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y) });
  });
  const f = document.querySelector('.fach[data-stueck="fuhre"]');
  raus.faecher = [...document.querySelectorAll('.fach[data-stueck="fuhre"]')].map(x => x.parentElement.id + ' kinder ' + x.children.length);
  return raus;
});
console.log(JSON.stringify(bericht, null, 1));

/* Genau der Durchgang von messen.mjs, aber nur fuer die FUHRE. */
const n = await s.evaluate(() => {
  const alpha = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  let z = 0;
  document.querySelectorAll('#buehne *').forEach(el => {
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    if (/inset\(\s*50%/.test(c.clipPath || '')) return;
    if (parseFloat(c.opacity) < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) return;
    const a = alpha(c.backgroundColor);
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].map(k => parseFloat(c[k]) || 0);
    const ab = alpha(c.borderTopColor) ?? alpha(c.borderBottomColor);
    const ist = (a !== null && a > 0.35) || /gradient/.test(c.backgroundImage || '')
      || (Math.max(...bw) >= 1 && ab !== null && ab > 0.3);
    if (!ist) return;
    const f = el.closest('.fach');
    if (!f || f.getAttribute('data-stueck') !== 'fuhre') return;
    el.setAttribute('data-probe', '1'); z++;
  });
  return z;
});
console.log('markierte fuhre-Kaesten:', n);

const voll = await s.screenshot();
await s.evaluate(() => document.querySelectorAll('[data-probe]').forEach(el => { el.style.visibility = 'hidden'; }));
await s.waitForTimeout(300);
const ohne = await s.screenshot();
writeFileSync(`werkbank/schuss/fuhre-w11/bilder/warum-e${E}-voll.png`, voll);
writeFileSync(`werkbank/schuss/fuhre-w11/bilder/warum-e${E}-ohne.png`, ohne);

const A = pngLesen(voll), Bd = pngLesen(ohne);
let k = 0, minx = W, maxx = 0, miny = H, maxy = 0;
const spalten = new Int32Array(W), zeilen = new Int32Array(H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 4;
  if (Math.abs(A.daten[i] - Bd.daten[i]) > 8 || Math.abs(A.daten[i+1] - Bd.daten[i+1]) > 8 ||
      Math.abs(A.daten[i+2] - Bd.daten[i+2]) > 8) {
    k++; spalten[x]++; zeilen[y]++;
    if (x < minx) minx = x; if (x > maxx) maxx = x;
    if (y < miny) miny = y; if (y > maxy) maxy = y;
  }
}
console.log(`unterschiedliche Bildpunkte: ${k}   Kasten ${minx}..${maxx} × ${miny}..${maxy}`);
const bloecke = [];
let an = -1;
for (let y = 0; y <= H; y++) {
  const da = y < H && zeilen[y] > 0;
  if (da && an < 0) an = y;
  if (!da && an >= 0) { bloecke.push([an, y - 1]); an = -1; }
}
console.log('Zeilenbloecke:', bloecke.map(z => z[0] + '-' + z[1]).join(' '));
await b.close();
