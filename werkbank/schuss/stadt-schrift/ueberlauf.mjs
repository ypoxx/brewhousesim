/* DER UEBERLAUF, NACH STUECK UND NACH KASTEN.
 *
 *   BREITE=1366 HOEHE=768 node werkbank/schuss/stadt-schrift/ueberlauf.mjs <ziel.json> [stueck]
 *
 * Gleiche Zaehlweise wie aufsicht/lesbarkeit.mjs (je Richtung: laeuft ueber
 * UND kann in dieser Richtung nicht rollen), nur mit Herkunft: welches Stueck,
 * welche Klassenkette, wie viel steht draussen, und was steht drin.
 *
 * Das ist das Werkzeug fuer den Teil der Arbeit, vor dem DIE FUHRE und DER SUD
 * beide gewarnt haben: der Schriftboden ist schnell gesetzt, die Kaesten
 * danach aufzuraeumen ist die eigentliche Arbeit.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-schrift/ueberlauf.json';
const NUR = process.argv[3] || '';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = { fenster: BREITE + 'x' + HOEHE, stand: new Date().toISOString() };
const summeStueck = {}, summeKette = {};
let gesamt = 0;

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(4200);
  const r = await s.evaluate((nur) => {
    const kappt = v => v === 'hidden' || v === 'clip';
    const treffer = [];
    for (const el of document.querySelectorAll('*')) {
      const c = getComputedStyle(el);
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
      if (!abY && !abX) continue;
      const fach = el.closest('[data-stueck]');
      const wer = fach ? fach.getAttribute('data-stueck') : '(ohne Stueck)';
      if (nur && wer !== nur) continue;
      const kette = [];
      for (let k = el, i = 0; k && k.nodeType === 1 && i < 4; k = k.parentElement, i++) {
        kette.unshift((typeof k.className === 'string' && k.className)
          ? '.' + k.className.trim().split(/\s+/).join('.') : k.tagName.toLowerCase());
      }
      treffer.push({
        stueck: wer, kette: kette.join(' > '),
        richtung: (abY ? 'y' : '') + (abX ? 'x' : ''),
        drin: el.scrollHeight + 'x' + el.scrollWidth, kasten: el.clientHeight + 'x' + el.clientWidth,
        zuviel_y: el.scrollHeight - el.clientHeight, zuviel_x: el.scrollWidth - el.clientWidth,
        text: (el.textContent || '').trim().slice(0, 60)
      });
    }
    return treffer;
  }, NUR);

  for (const t of r) {
    summeStueck[t.stueck] = (summeStueck[t.stueck] || 0) + 1;
    const s2 = t.stueck + ' · ' + t.kette.split(' > ').slice(-2).join(' > ');
    summeKette[s2] = (summeKette[s2] || 0) + 1;
  }
  gesamt += r.length;
  alles['e' + e] = { gesamt: r.length, kaesten: r };
  console.log(`E${e}: ${r.length} abgeschnittene Kaesten`);
  await s.close();
}
await b.close();
alles.summe = gesamt;
alles.summe_je_stueck = Object.fromEntries(Object.entries(summeStueck).sort((a, c) => c[1] - a[1]));
alles.summe_je_kette = Object.fromEntries(Object.entries(summeKette).sort((a, c) => c[1] - a[1]));
writeFileSync(ZIEL, JSON.stringify(alles, null, 2));
console.log(`\nSUMME ${gesamt} abgeschnittene Kaesten bei ${BREITE}x${HOEHE}`);
console.log('  je Stueck: ' + Object.entries(alles.summe_je_stueck).map(([k, v]) => `${k} ${v}`).join(' · '));
Object.entries(alles.summe_je_kette).slice(0, 14)
  .forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  ${k}`));
