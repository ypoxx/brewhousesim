/* SONDE DER FUHRE — Welle 11.
 *
 *   HAFEN=8951 WOCHEN=30 node werkbank/schuss/fuhre-w11/sonde.mjs vorher
 *
 * Keine Kamera, kein Bildvergleich: sie fragt das Spiel selbst.
 * Gemeldet wird je Epoche
 *   · BRAUHAUS.haushalt.miss().je.fuhre  (Huellen, wie der Rahmen sie zaehlt)
 *   · haushalt.tafeln() / ueberRand() / geklemmt() / pruefe()
 *   · jeder SICHTBARE Kasten der FUHRE ueber 15.000 px^2, mit Klasse und Mass
 *     — sichtbar heisst: nicht weggeschnitten, und der Weg nach oben wird
 *     mitgegangen (der Fehler F2 des Rahmens).
 *   · lage, Seitenfehler, verdeckt()
 *
 * Sie ist schnell (rund 20 s je Epoche) und deshalb das Geraet zum Bauen;
 * gemessen wird am Ende trotzdem photographisch mit messen.mjs.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN  = process.env.HAFEN || '8951';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);
const ESC    = +(process.env.ESC || 0);
const NAME   = process.argv[2] || 'sonde';
const EPOCHEN = (process.env.EPOCHEN || '1,2,3,4').split(',').map(Number);
const ZIEL   = 'werkbank/schuss/fuhre-w11/messungen';
mkdirSync(ZIEL, { recursive: true });

const schau = () => {
  const alpha = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  const istKasten = c => {
    const a = alpha(c.backgroundColor);
    if (a !== null && a > 0.35) return true;
    if (/gradient/.test(c.backgroundImage || '')) return true;
    const bw = Math.max(parseFloat(c.borderTopWidth) || 0, parseFloat(c.borderRightWidth) || 0,
      parseFloat(c.borderBottomWidth) || 0, parseFloat(c.borderLeftWidth) || 0);
    if (bw < 1) return false;
    const ab = alpha(c.borderTopColor) ?? alpha(c.borderBottomColor);
    return ab !== null && ab > 0.3;
  };
  /* Der Weg nach oben — dieselbe Regel wie in kern/haushalt.js. */
  const weg = el => {
    let n = el;
    while (n && n.nodeType === 1 && n.id !== 'buehne') {
      const c = getComputedStyle(n);
      if (/inset\(\s*50%/.test(c.clipPath || '') || parseFloat(c.opacity) < 0.05
          || c.visibility === 'hidden' || c.display === 'none') return true;
      n = n.parentElement;
    }
    return false;
  };
  const bu = document.getElementById('buehne');
  const gross = [];
  bu.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    if (r.width >= bu.clientWidth * 0.98 && r.height >= bu.clientHeight * 0.98) return;
    const f = el.closest('.fach');
    if (!f || f.getAttribute('data-stueck') !== 'fuhre') return;
    const c = getComputedStyle(el);
    if (!istKasten(c)) return;
    if (weg(el)) return;
    if (r.width * r.height < 15000) return;
    gross.push({ klasse: String(el.className || '').slice(0, 46),
      mass: Math.round(r.width) + '×' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y),
      flaeche: Math.round(r.width * r.height),
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34) });
  });
  gross.sort((a, b) => b.flaeche - a.flaeche);
  const h = BRAUHAUS.haushalt;
  const m = h.miss();
  return {
    jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    fuhre: m.je.fuhre || null,
    gesamt: m.gesamt, oben: m.oben,
    tafeln: h.tafeln().map(t => t.stueck + ' .' + t.klasse + ' ' + Math.round(t.b) + '×' + Math.round(t.h)
      + ' = ' + Math.round(t.flaeche)),
    ueberRand: h.ueberRand(), geklemmt: h.geklemmt ? h.geklemmt() : null,
    pruefe: h.pruefe(),
    gross: gross.slice(0, 12),
    lage: (BRAUHAUS.lage || []).length,
    verdeckt: (function () { try { return BRAUHAUS.stadt.rahmen.verdeckt().length; } catch (e) { return 'FEHLER'; } })(),
    sommerZug: !!document.querySelector('[data-zug="fuhre:sommer-zu"]'),
    sommerblatt: !!document.querySelector('.fu-sommerblatt'),
    planKnoepfe: [...document.querySelectorAll('[data-zug^="fuhre:jahresplan:"]')].map(k => {
      const r = k.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const t = (x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight) ? document.elementFromPoint(x, y) : null;
      return { zug: k.getAttribute('data-zug'), b: Math.round(r.width), h: Math.round(r.height),
        trifft: !!(t && (t === k || k.contains(t))) };
    })
  };
};

const b = await chromium.launch();
const zeilen = [];
const daten = {};
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(x.message));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(250); }
  await s.waitForTimeout(700);
  const d = await s.evaluate(schau);
  d.seitenfehler = fehler.length;
  daten[e] = d;
  zeilen.push(`\n=== EPOCHE ${e}  ${d.jahr}/${d.woche}${WOCHEN ? '  nach ' + WOCHEN + ' Wochen' : ''}${ESC ? ' +' + ESC + '× Escape' : ''}`
    + `   lage ${d.lage}  Seitenfehler ${d.seitenfehler}  verdeckt() ${d.verdeckt}`);
  zeilen.push(`  fuhre  ${d.fuhre ? d.fuhre.px : 0} px / ${d.fuhre ? d.fuhre.grenze : '-'}   `
    + `oben ${d.fuhre ? d.fuhre.obenPx : 0} px / ${d.fuhre ? d.fuhre.grenzeOben : '-'}`
    + `   Kaesten ${d.fuhre ? d.fuhre.kaesten : 0}`);
  zeilen.push(`  gesamt (Huellen) ${d.gesamt.px} px = ${d.gesamt.anteil.toFixed(1)} %   oberstes 1/6 ${d.oben.anteil.toFixed(1)} %`);
  zeilen.push(`  TAFELN > 200.000 px²: ${d.tafeln.length}` + d.tafeln.map(t => '\n    ' + t).join(''));
  zeilen.push(`  ueberRand ${d.ueberRand.length}  geklemmt ${JSON.stringify(d.geklemmt)}`);
  zeilen.push(`  pruefe(): ${d.pruefe.length ? d.pruefe.join(' | ') : 'leer — alle im Rahmen'}`);
  zeilen.push(`  Sommerblatt ${d.sommerblatt}  Planknoepfe: `
    + (d.planKnoepfe.length ? d.planKnoepfe.map(k => `${k.zug} ${k.b}×${k.h} ${k.trifft ? 'trifft' : 'VERDECKT'}`).join(' · ') : '—'));
  zeilen.push('  sichtbare Kaesten der FUHRE ueber 15.000 px²:');
  d.gross.forEach(g => zeilen.push(`    ${String(g.flaeche).padStart(8)} px²  .${g.klasse}  ${g.mass}  „${g.text}"`));
  await s.close();
}
await b.close();
const txt = zeilen.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}.txt`, txt);
writeFileSync(`${ZIEL}/${NAME}.json`, JSON.stringify(daten, null, 1));
