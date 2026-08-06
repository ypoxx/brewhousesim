/* DIE DECKUNG, NACH ZONEN UND NACH STUECKEN — Welle 9, Auflage A1.
 *
 *   HAFEN=8921 node werkbank/schuss/stadt-w9/deckung.mjs [epochen] [wochen]
 *   HAFEN=8921 WOCHEN=30 node werkbank/schuss/stadt-w9/deckung.mjs 1,2,3,4
 *
 * Es misst DASSELBE wie das Geraet des blinden Kritikers
 * (`bild-w8/bauorte.mjs` + `bild-w8/deckung.mjs`) und benutzt woertlich
 * dieselben zwei Entscheidungen, damit die Zahlen vergleichbar bleiben:
 *
 *   · Die Trennung ist eine EIGENSCHAFTSTRENNUNG, keine Ebenentrennung:
 *     in den vier oberen Ebenen verschwindet jedes Element mit deckendem
 *     Grund oder sichtbarem Rahmen — ein KASTEN. Was nur ein freigestelltes
 *     Bild traegt (Gegnerhof, Fuhrwerke), bleibt stehen.
 *   · Gezaehlt wird in BILDPUNKTEN: ein Punkt gilt als gedeckt, wenn er sich
 *     um mehr als 8 Stufen in einem Kanal unterscheidet.
 *
 * NEU gegenueber dem Geraet des Kritikers, und nur das:
 *   · Zonen (oberstes Sechstel / Mittelband / unterstes Sechstel) auch fuer
 *     die Kaesten-Aufnahme, nicht nur fuer die volle.
 *   · Je Stueck: dieselbe Aufnahme, aber nur die Kaesten EINES Stuecks
 *     stehen. So traegt jeder Befund einen Namen und keinen Bildpunkt.
 *   · WOCHEN=n spielt vorher n Wochen mit dem WEITER-Knopf durch, damit der
 *     Fund des Kritikers ("nach 30 Wochen deckt sie 54,7-58,5 %") nachstellbar
 *     bleibt.
 *
 * Aufnahmen landen in werkbank/schuss/stadt-w9/bild/, die Zahlen als JSON
 * daneben. Kein Schreiben in fremde Verzeichnisse.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8921';
const EPOCHEN = (process.argv[2] || '1,2,3,4').split(',').map(Number);
const WOCHEN = +(process.env.WOCHEN || process.argv[3] || 0);
const BREITE = +(process.env.BREITE || 2752), HOEHE = +(process.env.HOEHE || 1536);
const MARKE = process.env.MARKE || 'x';
const AUS = 'werkbank/schuss/stadt-w9/bild';
mkdirSync(AUS, { recursive: true });

/* Die acht Stuecke, an ihrem Klassenpraefix erkannt — wie in
   aufsicht/deckung-je-stueck.mjs. */
const STUECKE = ['stadt', 'fu', 'preis', 'gg', 'sud', 'nm', 'erb', 'kopf'];
const NAMEN = { stadt: 'DIE STADT', fu: 'DIE FUHRE', preis: 'DER PREIS', gg: 'DER GEGNER',
                sud: 'DER SUD', nm: 'DER NAME', erb: 'DAS ERBE', kopf: 'die Kopfleiste' };

/* art: 'voll' | 'nackt' | 'kaesten-weg' | ('nur:' + schluessel)
   'kaesten-weg' blendet ALLE Kaesten aus (= das Bild, wie es ohne Oberflaeche
   waere). 'nur:x' blendet die Kaesten aller Stuecke AUSSER x aus. */
const setze = (art) => {
  const undurch = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return false;
    const t = m[1].split(',').map((s) => parseFloat(s));
    return t.length < 4 || t[3] > 0.15;
  };
  const wem = (el) => {
    let n = el;
    while (n && n.nodeType === 1) {
      const c = (n.className && typeof n.className === 'string') ? n.className : '';
      const m = c.match(/\b(stadt|fu|preis|gg|sud|nm|erb|kopf)[-\w]*/);
      if (m) return m[1];
      const id = n.id || '';
      const mi = id.match(/\b(?:fach-\w+-)(stadt|fu|preis|gg|sud|nm|erb|kopf)\b/);
      if (mi) return mi[1];
      n = n.parentNode;
    }
    return null;
  };
  ['marken', 'hand', 'kopf', 'blatt'].forEach((n) => {
    const w = document.querySelector('#ebene-' + n); if (!w) return;
    w.style.visibility = '';
    w.querySelectorAll('*').forEach((el) => { el.style.visibility = ''; });
    if (art === 'voll') return;
    if (art === 'nackt') { w.style.visibility = 'hidden'; return; }
    const nur = art.indexOf('nur:') === 0 ? art.slice(4) : null;
    w.querySelectorAll('*').forEach((el) => {
      const cs = getComputedStyle(el);
      const hatBild = cs.backgroundImage && cs.backgroundImage !== 'none';
      const kasten = (undurch(cs.backgroundColor) && !hatBild)
        || (cs.borderTopWidth !== '0px' && undurch(cs.borderTopColor));
      if (!kasten) return;
      if (nur && wem(el) === nur) return;      /* dieses eine Stueck bleibt */
      el.style.visibility = 'hidden';
    });
  });
};

function zonen(a, b) {
  const A = pngLesen(a), B = pngLesen(b);
  const W = A.breite, H = A.hoehe, s6 = Math.floor(H / 6);
  const zone = (y0, y1) => {
    let n = 0, ges = 0;
    for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4; ges++;
      if (Math.abs(A.daten[i] - B.daten[i]) > 8 || Math.abs(A.daten[i + 1] - B.daten[i + 1]) > 8 ||
          Math.abs(A.daten[i + 2] - B.daten[i + 2]) > 8) n++;
    }
    return +(100 * n / ges).toFixed(1);
  };
  return { gesamt: zone(0, H), oben: zone(0, s6), mitte: zone(s6, H - s6), unten: zone(H - s6, H) };
}

const browser = await chromium.launch();
const bericht = [];
for (const e of EPOCHEN) {
  const s = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  const fehler = [];
  s.on('pageerror', (x) => fehler.push(String(x).slice(0, 160)));
  s.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 160)); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);

  for (let i = 0; i < WOCHEN; i++) {
    const w = await s.$('[data-zug="weiter"]');
    if (!w) break;
    try { await w.click({ timeout: 4000 }); } catch (x) { break; }
    await s.waitForTimeout(120);
  }
  if (WOCHEN) await s.waitForTimeout(900);

  const t = WOCHEN ? `w${WOCHEN}` : 'roh';
  const voll = await s.screenshot({ path: `${AUS}/${MARKE}-e${e}-${t}-voll.png` });
  await s.evaluate(setze, 'kaesten-weg'); await s.waitForTimeout(300);
  const ohne = await s.screenshot({ path: `${AUS}/${MARKE}-e${e}-${t}-ohnekasten.png` });
  await s.evaluate(setze, 'nackt'); await s.waitForTimeout(300);
  const nackt = await s.screenshot({ path: `${AUS}/${MARKE}-e${e}-${t}-nackt.png` });

  const kaesten = zonen(voll, ohne);
  const alles = zonen(voll, nackt);
  const je = {};
  for (const k of STUECKE) {
    await s.evaluate(setze, 'nur:' + k); await s.waitForTimeout(160);
    je[k] = zonen(await s.screenshot(), ohne);
  }
  await s.evaluate(setze, 'voll');
  const lage = await s.evaluate(() => window.BRAUHAUS.lage.length);
  bericht.push({ epoche: e, wochen: WOCHEN, kaesten, alles, je, lage, fehler });

  const p = (o) => `${String(o.gesamt).padStart(5)} %  oben ${String(o.oben).padStart(5)} %  `
    + `mitte ${String(o.mitte).padStart(5)} %  unten ${String(o.unten).padStart(5)} %`;
  console.log(`\nEPOCHE ${e}${WOCHEN ? ' nach ' + WOCHEN + ' Wochen' : ' (Ladezustand)'}  `
    + `lage=${lage} fehler=${fehler.length}`);
  console.log(`  KAESTEN gesamt   ${p(kaesten)}`);
  console.log(`  alles ueber Bild ${p(alles)}`);
  Object.entries(je).sort((a, c) => c[1].gesamt - a[1].gesamt).forEach(([k, o]) => {
    if (o.gesamt < 0.05 && o.oben < 0.05) return;
    console.log(`    ${(NAMEN[k] || k).padEnd(14)} ${p(o)}`);
  });
  await s.close();
}
writeFileSync(`werkbank/schuss/stadt-w9/rho/deckung-${MARKE}-${WOCHEN ? 'w' + WOCHEN : 'roh'}.json`,
  JSON.stringify(bericht, null, 1));
await browser.close();
