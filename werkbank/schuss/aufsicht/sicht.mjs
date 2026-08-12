/* DIE SICHT — was verdeckt, was durchscheint, was zu blass ist.
 *
 *   HAFEN=8899 BREITE=1366 HOEHE=768 node werkbank/schuss/aufsicht/sicht.mjs
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GESCHRIEBEN VON DER AUFSICHT AM 9. AUGUST 2026, BEVOR EIN BUILDER DIE WELLE 17
 * ANFASST. Wer gemessen wird, baut sein Messgeraet nicht — das ist derselbe
 * Grund, aus dem die blinden Kritiker keinen Baubericht sehen.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WARUM ES NEBEN `lesbarkeit.mjs` STEHT UND NICHT DARIN. Jenes Geraet hat die
 * Zahlen der vierten Latte erhoben, und an fremden Messgeraeten wird nicht
 * gedreht (ZUSTAENDIGKEIT 16): jede Zahl dieses Laufs zur Schriftgroesse haengt
 * daran, dass es sich nicht bewegt. Also steht meins daneben und misst die drei
 * Dinge, die dort fehlen und nach denen der Auftraggeber gefragt hat:
 *
 *   1. VERDECKUNG — Text, der da ist, aber nicht zu sehen, weil etwas
 *      darueberliegt. Gemessen wie ein Kritiker misst: `elementFromPoint` auf
 *      die Mitte des Textes. Kommt weder das Element selbst noch eines seiner
 *      Kinder zurueck, liegt etwas davor. Dieselbe Technik, mit der die Welle 13
 *      die toten Reiter gefunden hat.
 *
 *   2. DURCHSCHEINEN — Text in einem Kasten mit `opacity < 0,95`. Eine halbe
 *      Deckkraft ueber einer illustrierten Platte ist keine Gestaltung, sondern
 *      ein Ratespiel: was darunter liegt, wechselt mit der Epoche.
 *
 *   3. BLAESSE — Kontrast zwischen Schriftfarbe und dem naechsten wirklich
 *      deckenden Untergrund. Unter 4,5:1 (WCAG AA fuer normalen Text, 3:1 ab
 *      24 px oder 19 px fett) ist Text auf einem gewoehnlichen Notebook bei
 *      Tageslicht nicht mehr sicher lesbar.
 *
 * WAS DIESES GERAET NICHT KANN, und das gehoert dazu: es sieht die
 * Hintergrundfarbe, nicht das Hintergrundbild. Steht Text ueber einer
 * Epochenplatte ohne eigenen Kasten, faellt er unter „unbekannter Grund" und
 * wird gezaehlt, aber nicht beurteilt. Wer diese Zahl senken will, gibt dem
 * Text einen Grund — was ohnehin die Antwort ist.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const EPOCHEN = (process.env.EPOCHEN || '1,2,3,4').split(',').map(Number);

const b = await chromium.launch();
let gesV = 0, gesD = 0, gesB = 0, gesText = 0, gesUnbek = 0;
const alleFunde = [];

for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  /* `&neu=1` gehoert in jede Messadresse — sonst faerbt ein liegengebliebener
     Spielstand die Zahl. */
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350&neu=1`,
               { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);

  const r = await s.evaluate(() => {
    const nachOben = (el, pruef) => { for (let n = el; n; n = n.parentElement) { const v = pruef(n); if (v) return v; } return null; };

    /* sRGB-Luminanz nach WCAG 2.1 */
    const lum = ([r, g, b]) => {
      const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const zahl = s => (s.match(/[\d.]+/g) || []).map(Number);
    const kontrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

    const verdeckt = [], durch = [], blass = [], unbekannt = [];
    let textKnoten = 0;

    for (const el of document.querySelectorAll('*')) {
      if (el.children.length || !(el.textContent || '').trim()) continue;
      const k = el.getBoundingClientRect();
      if (k.width < 2 || k.height < 2) continue;
      if (k.bottom < 0 || k.top > innerHeight || k.right < 0 || k.left > innerWidth) continue;
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') continue;
      textKnoten++;
      const marke = (el.className && typeof el.className === 'string' ? el.className.split(/\s+/)[0] : el.tagName.toLowerCase())
                  + ' · ' + (el.textContent || '').trim().slice(0, 28);

      /* 1 — VERDECKUNG. Was liegt in der Mitte dieses Textes wirklich oben? */
      const x = Math.min(innerWidth - 1, Math.max(0, k.left + k.width / 2));
      const y = Math.min(innerHeight - 1, Math.max(0, k.top + k.height / 2));
      const oben = document.elementFromPoint(x, y);
      if (oben && oben !== el && !el.contains(oben) && !oben.contains(el)) {
        const o = getComputedStyle(oben);
        /* Ein durchsichtiger Deckel zaehlt nicht als Verdeckung — nur was
           wirklich etwas wegnimmt. */
        if (o.pointerEvents !== 'none' && +(o.opacity || 1) > 0.1) {
          verdeckt.push(marke + '  ←  ' + (oben.className || oben.tagName));
        }
      }

      /* 2 — DURCHSCHEINEN, ueber die ganze Kette gerechnet */
      let deck = 1;
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) deck *= +(getComputedStyle(n).opacity || 1);
      if (deck < 0.95) durch.push(marke + '  (Deckkraft ' + deck.toFixed(2) + ')');

      /* 3 — BLAESSE gegen den naechsten wirklich deckenden Grund */
      const vg = zahl(c.color).slice(0, 3);
      const grund = nachOben(el, n => {
        const g = getComputedStyle(n).backgroundColor;
        const z = zahl(g);
        return (z.length >= 3 && (z[3] === undefined || z[3] > 0.9)) ? z.slice(0, 3) : null;
      });
      if (!grund) { unbekannt.push(marke); continue; }
      const px = parseFloat(c.fontSize), fett = +(c.fontWeight) >= 700;
      const ziel = (px >= 24 || (px >= 19 && fett)) ? 3.0 : 4.5;
      const kv = kontrast(vg, grund);
      if (kv < ziel) blass.push(marke + '  (' + kv.toFixed(2) + ':1, verlangt ' + ziel + ')');
    }
    return { verdeckt, durch, blass, unbekannt, textKnoten };
  });

  gesV += r.verdeckt.length; gesD += r.durch.length; gesB += r.blass.length;
  gesText += r.textKnoten; gesUnbek += r.unbekannt.length;
  alleFunde.push([e, r]);
  console.log(`  E${e}: ${r.verdeckt.length} verdeckt · ${r.durch.length} durchscheinend · ` +
              `${r.blass.length} zu blass · ${r.unbekannt.length} ohne erkennbaren Grund ` +
              `(von ${r.textKnoten} sichtbaren Textknoten)`);
  for (const [titel, liste] of [['verdeckt', r.verdeckt], ['durchscheinend', r.durch], ['zu blass', r.blass]]) {
    liste.slice(0, 4).forEach(z => console.log(`      ${titel}: ${z}`));
    if (liste.length > 4) console.log(`      ${titel}: … und ${liste.length - 4} weitere`);
  }
  await s.close();
}
await b.close();

console.log(`\n  Summe ${BREITE}×${HOEHE}: ${gesV} verdeckt · ${gesD} durchscheinend · ${gesB} zu blass ` +
            `· ${gesUnbek} ohne erkennbaren Grund, von ${gesText} sichtbaren Textknoten`);
console.log('  ZIEL: 0 verdeckt · 0 durchscheinend · 0 zu blass. Der letzte Posten ist eine');
console.log('        Beobachtung, keine Latte — Text ohne eigenen Grund steht ueber der Platte.');
/* Getrennte Ausgaenge, weil „durchgefallen" und „keine Messung" zwei Dinge
   sind — die Lehre, die diesen Lauf am 4. August eine Stunde gekostet hat. */
if (!gesText) { console.log('\n  KEINE MESSUNG — kein sichtbarer Text gefunden.'); process.exit(2); }
process.exit(gesV + gesD + gesB ? 1 : 0);
