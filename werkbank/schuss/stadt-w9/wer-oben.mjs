/* WER LIEGT IM OBERSTEN SECHSTEL?  (Welle 9, zu Auflage A1)
 *
 *   HAFEN=8931 node werkbank/schuss/stadt-w9/wer-oben.mjs [epoche]
 *
 * A1 verlangt hoechstens 25 % Deckung im obersten Sechstel. Gemessen sind
 * dort 50-53 %, und DIE STADT ist nur ein Teil davon. Dieses Geraet nennt
 * fuer jedes Stueck die Kaesten, die im obersten Sechstel liegen — mit
 * Rechteck und Klassennamen, damit der naechste Auftrag nicht raten muss,
 * wem die restlichen Punkte gehoeren.
 *
 * Gezaehlt werden hier HUELLEN (zum Suchen), gemeldet werden immer die
 * Bildpunkte aus `stadt-w9/deckung.mjs`.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8931';
const EP = +(process.argv[2] || 1);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1500);

const raus = await s.evaluate(() => {
  const undurch = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return false;
    const t = m[1].split(',').map((x) => parseFloat(x));
    return t.length < 4 || t[3] > 0.15;
  };
  const wem = (el) => {
    let n = el;
    while (n && n.nodeType === 1) {
      const c = (n.className && typeof n.className === 'string') ? n.className : '';
      const m = c.match(/\b(stadt|fu|pr|gg|sud|nm|erb|kopf)[-\w]*/);
      if (m) return m[1];
      const mi = (n.id || '').match(/\b(?:fach-\w+-)(stadt|fu|pr|preis|gg|sud|nm|erb|kopf)\b/);
      if (mi) return mi[1];
      n = n.parentNode;
    }
    return '(niemand)';
  };
  const s6 = Math.floor(innerHeight / 6), obenGes = innerWidth * s6;
  const treffer = [];
  ['marken', 'hand', 'kopf', 'blatt'].forEach((n) => {
    const w = document.querySelector('#ebene-' + n); if (!w) return;
    w.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      const hatBild = cs.backgroundImage && cs.backgroundImage !== 'none';
      const kasten = (undurch(cs.backgroundColor) && !hatBild)
        || (cs.borderTopWidth !== '0px' && undurch(cs.borderTopColor));
      if (!kasten) return;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || r.top >= s6) return;
      treffer.push({ wer: wem(el), el,
        klasse: String(el.className || '').slice(0, 44),
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        oben: Math.max(0, Math.min(r.bottom, s6) - Math.max(r.top, 0)) * r.width });
    });
  });
  const aussen = treffer.filter((a) => !treffer.some((c) => c !== a && c.el.contains(a.el)));
  const je = {};
  aussen.forEach((a) => { je[a.wer] = (je[a.wer] || 0) + a.oben; });
  return {
    je: Object.entries(je).map(([k, v]) => [k, +(100 * v / obenGes).toFixed(1)]).sort((a, c) => c[1] - a[1]),
    kaesten: aussen.map((a) => ({ wer: a.wer, klasse: a.klasse, x: a.x, y: a.y, w: a.w, h: a.h,
      anteil: +(100 * a.oben / obenGes).toFixed(2) })).sort((p, q) => q.anteil - p.anteil)
  };
});

console.log(`Epoche ${EP}, oberstes Sechstel (y 0..256 von 1536), Huellenanteil je Stueck:`);
raus.je.forEach(([k, v]) => console.log(`   ${k.padEnd(10)} ${String(v).padStart(6)} %`));
console.log('   die groessten Kaesten:');
raus.kaesten.slice(0, 14).forEach((k) => console.log(
  `     ${String(k.anteil).padStart(6)} %  ${k.wer.padEnd(6)} x${k.x}..${k.x + k.w} y${k.y}..${k.y + k.h}  ${k.klasse}`));
await b.close();
