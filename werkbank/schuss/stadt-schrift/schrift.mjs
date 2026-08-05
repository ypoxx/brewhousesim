/* DIE SCHRIFT, NACH STUECK UND NACH REGEL AUFGESCHLUESSELT.
 *
 *   BREITE=1366 HOEHE=768 node werkbank/schuss/stadt-schrift/schrift.mjs <ziel.json> [stueck]
 *
 * `aufsicht/lesbarkeit.mjs` zaehlt die Textknoten unter 12 px und sagt eine
 * Gesamtzahl. Zum Bauen fehlen zwei Angaben: WEM gehoert der Knoten, und
 * WELCHE REGEL hat die Groesse gesetzt. Beides steht im Browser bereit —
 * `closest('[data-stueck]')` beantwortet das erste (jedes Fach traegt das
 * Attribut, kern/buehne.js:49), und ein Durchlauf durch document.styleSheets
 * das zweite.
 *
 * Gezaehlt wird wie im Geraet der Aufsicht: Blattknoten mit Text, computed
 * font-size < 12 px, Rollleiste gezeichnet (kein --hide-scrollbars).
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-schrift/schrift.json';
const NUR = process.argv[3] || '';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = { fenster: BREITE + 'x' + HOEHE, stand: new Date().toISOString() };
const summeStueck = {}, summeRegel = {}, summeKlasse = {};
let gesamt = 0;

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);

  const r = await s.evaluate((nur) => {
    /* alle Regeln, die eine Schriftgroesse setzen — Datei, Zeile im Blatt,
       Selektor. @media wird mitgefuehrt, weil genau daran die Arbeit haengt. */
    const regeln = [];
    const sammle = (liste, datei, umgebung) => {
      for (const r of liste) {
        if (r.type === 4 /* MEDIA */) { sammle(r.cssRules, datei, r.conditionText); continue; }
        if (r.type === 12 /* SUPPORTS */) { sammle(r.cssRules, datei, umgebung); continue; }
        if (r.type !== 1 /* STYLE */) continue;
        if (!r.style || !r.style.fontSize) continue;
        regeln.push({ datei, sel: r.selectorText, wert: r.style.fontSize, medien: umgebung || '' });
      }
    };
    for (const bl of document.styleSheets) {
      let l; try { l = bl.cssRules; } catch (x) { continue; }
      sammle(l, (bl.href || '').replace(/^.*\//, ''), '');
    }

    const treffer = [];
    for (const el of document.querySelectorAll('*')) {
      if (el.children.length) continue;
      if (!(el.textContent || '').trim()) continue;
      const px = parseFloat(getComputedStyle(el).fontSize);
      if (!(px < 12)) continue;

      const fach = el.closest('[data-stueck]');
      const wer = fach ? fach.getAttribute('data-stueck') : '(ohne Stueck)';
      if (nur && wer !== nur) continue;

      /* Welche Regel greift? Die zuletzt passende gewinnt in der Reihenfolge
         der Blaetter — genau das macht der Browser auch, solange keine
         Spezifitaet dazwischenkommt. Zusaetzlich der Stilwert am Element. */
      let quelle = null;
      for (let k = el; k && k.nodeType === 1 && !quelle; k = k.parentElement) {
        if (k.style && k.style.fontSize) { quelle = 'style="" ' + k.style.fontSize + (k === el ? '' : '  (geerbt)'); break; }
        const passend = [];
        for (const rg of regeln) {
          try { if (k.matches(rg.sel)) passend.push(rg); } catch (x) { /* :hover u.ae. */ }
        }
        if (passend.length) {
          const z = passend[passend.length - 1];
          quelle = z.datei + ' { ' + z.sel + ' } ' + z.wert +
                   (z.medien ? '  @media ' + z.medien : '') + (k === el ? '' : '  (geerbt)');
        }
      }
      treffer.push({
        px: +px.toFixed(1),
        stueck: wer,
        klasse: (typeof el.className === 'string' ? el.className : '') || el.tagName.toLowerCase(),
        regel: quelle || '(geerbt)',
        text: (el.textContent || '').trim().slice(0, 40)
      });
    }
    return treffer;
  }, NUR);

  const jeStueck = {};
  for (const t of r) {
    jeStueck[t.stueck] = (jeStueck[t.stueck] || 0) + 1;
    summeStueck[t.stueck] = (summeStueck[t.stueck] || 0) + 1;
    summeRegel[t.regel] = (summeRegel[t.regel] || 0) + 1;
    summeKlasse[t.stueck + ' · ' + t.klasse] = (summeKlasse[t.stueck + ' · ' + t.klasse] || 0) + 1;
  }
  gesamt += r.length;
  alles['e' + e] = { gesamt: r.length, je_stueck: jeStueck, knoten: r };
  console.log(`E${e}: ${r.length} Textknoten unter 12 px — ` +
    Object.entries(jeStueck).sort((a, c) => c[1] - a[1]).map(([k, v]) => `${k}:${v}`).join('  '));
  await s.close();
}

await b.close();
alles.summe = gesamt;
alles.summe_je_stueck = Object.fromEntries(Object.entries(summeStueck).sort((a, c) => c[1] - a[1]));
alles.summe_je_regel = Object.fromEntries(Object.entries(summeRegel).sort((a, c) => c[1] - a[1]));
alles.summe_je_klasse = Object.fromEntries(Object.entries(summeKlasse).sort((a, c) => c[1] - a[1]));
writeFileSync(ZIEL, JSON.stringify(alles, null, 2));

console.log(`\nSUMME ${gesamt} Textknoten unter 12 px bei ${BREITE}x${HOEHE}`);
console.log('  je Stueck: ' + Object.entries(alles.summe_je_stueck).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log('  die zehn haeufigsten Regeln:');
Object.entries(alles.summe_je_regel).slice(0, 10)
  .forEach(([k, v]) => console.log(`    ${String(v).padStart(4)}  ${k}`));
console.log('  die zehn haeufigsten Klassen:');
Object.entries(alles.summe_je_klasse).slice(0, 10)
  .forEach(([k, v]) => console.log(`    ${String(v).padStart(4)}  ${k}`));
