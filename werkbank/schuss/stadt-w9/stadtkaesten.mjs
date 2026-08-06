/* WAS DECKT DIE STADT, KASTEN FUER KASTEN.  (Welle 9, Auflage A1)
 *
 *   HAFEN=8921 node werkbank/schuss/stadt-w9/stadtkaesten.mjs [epoche] [breite] [hoehe]
 *
 * `stadt-w9/deckung.mjs` sagt, WIEVIEL DIE STADT deckt (10,6 % der Flaeche,
 * 14,4 % des obersten Sechstels). Dieses Geraet sagt, WOMIT: jeder Kasten der
 * STADT in den vier oberen Ebenen mit seinem Rechteck, seiner Flaeche und
 * seinem Anteil am obersten Sechstel.
 *
 * Es zaehlt HUELLEN, nicht Bildpunkte — und das ist ausdruecklich nur zum
 * Suchen gut, nicht zum Melden. Die gemeldete Zahl kommt immer aus
 * `deckung.mjs`. (Der Fehler, eine Huelle fuer Deckung zu halten, steht im
 * Kopf von aufsicht/deckung-je-stueck.mjs; er wird hier nicht wiederholt,
 * sondern nur benutzt, um den groessten Kasten zu finden.)
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8921';
const EP = +(process.argv[2] || 1);
const BR = +(process.argv[3] || 2752), HO = +(process.argv[4] || 1536);
const WER = process.env.WER || 'stadt';   /* Klassenpraefix des Stuecks */

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1400);

const raus = await s.evaluate((WER) => {
  const RE = new RegExp('\\b' + WER + '[-\\w]*');
  const undurch = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return false;
    const t = m[1].split(',').map((x) => parseFloat(x));
    return t.length < 4 || t[3] > 0.15;
  };
  const s6 = Math.floor(innerHeight / 6);
  const liste = [];
  ['marken', 'hand', 'kopf', 'blatt'].forEach((n) => {
    const w = document.querySelector('#ebene-' + n); if (!w) return;
    w.querySelectorAll('*').forEach((el) => {
      const c = (el.className && typeof el.className === 'string') ? el.className : '';
      if (!RE.test(c)) return;
      const cs = getComputedStyle(el);
      const hatBild = cs.backgroundImage && cs.backgroundImage !== 'none';
      const kasten = (undurch(cs.backgroundColor) && !hatBild)
        || (cs.borderTopWidth !== '0px' && undurch(cs.borderTopColor));
      if (!kasten) return;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) return;
      /* nur die aeusserste Huelle je Zweig — sonst zaehlt jedes Kind mit */
      liste.push({ klasse: c.slice(0, 46), zug: el.getAttribute('data-zug') || '',
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        oben: Math.max(0, Math.min(r.bottom, s6) - Math.max(r.top, 0)) * r.width,
        el, tiefe: (function (n2) { let d = 0; while (n2 && n2 !== document.body) { d++; n2 = n2.parentNode; } return d; })(el) });
    });
  });
  const aussen = liste.filter((a) => !liste.some((b2) => b2 !== a && b2.el.contains(a.el)));
  const rahmen = innerWidth * innerHeight, obenGes = innerWidth * s6;
  const w = document.querySelector('.stadt-werkbank');
  const z = document.querySelector('.stadt-reiterzeile');
  const h = document.querySelector('.stadt-bauhof');
  const kr = (e) => { if (!e) return null; const r = e.getBoundingClientRect();
    return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  return {
    fenster: [innerWidth, innerHeight],
    werkbank: kr(w), reiterzeile: kr(z), bauhof: kr(h),
    reiter: [...document.querySelectorAll('.knopf.stadt-reiter')].length,
    kaesten: aussen.map((a) => ({ klasse: a.klasse, zug: a.zug, x: a.x, y: a.y, w: a.w, h: a.h,
      flaeche: +(100 * a.w * a.h / rahmen).toFixed(2),
      obenAnteil: +(100 * a.oben / obenGes).toFixed(2) }))
      .sort((p, q) => q.flaeche - p.flaeche)
  };
}, WER);

console.log(`Hafen ${HAFEN} Epoche ${EP} bei ${raus.fenster.join('x')} — Stueck '${WER}'`);
console.log(`  .stadt-werkbank    ${raus.werkbank}`);
console.log(`  .stadt-reiterzeile ${raus.reiterzeile}   (${raus.reiter} Reiter)`);
console.log(`  .stadt-bauhof      ${raus.bauhof}`);
console.log('  Kaesten (Huellen, absteigend nach Flaeche):');
raus.kaesten.forEach((k) => console.log(
  `    ${String(k.flaeche).padStart(6)} % Rahmen · ${String(k.obenAnteil).padStart(6)} % oberstes 1/6 · `
  + `x${k.x}..${k.x + k.w} y${k.y}..${k.y + k.h}  ${k.klasse}${k.zug ? ' [' + k.zug + ']' : ''}`));
await b.close();
