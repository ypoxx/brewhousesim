/* DECKUNG NACH EIGENSCHAFT — nicht nach Ebene.
     HAFEN=8907 node werkbank/schuss/bild-w9/deckung.mjs

   WARUM NICHT NACH EBENE: dieselbe Ebene traegt gemalte Gebaeude UND
   Karteikarten. Wer 'marken/hand/kopf/blatt' pauschal ausblendet, loescht
   Teile der gemalten Welt mit und misst zu viel; wer nur 'platte+bau' als Bild
   nimmt, erklaert jede gemalte Hofmarke zur Oberflaeche.

   TRENNUNG NACH EIGENSCHAFT: ein Element ist ein KASTEN, wenn es einen
   deckenden Grund (background-color alpha > 0,35, oder ein Verlauf als
   background-image) oder einen sichtbaren Rahmen (>=1 px, alpha > 0,3) hat.
   Ein Element, das nur ein freigestelltes Bild traegt (background-image mit
   url(...webp|png|jpg) und durchsichtigem Grund, oder <img>), ist WELT.

   Gemessen wird in BILDPUNKTEN: zwei Aufnahmen, einmal mit und einmal ohne die
   Kaesten; was sich um mehr als 8 Stufen in einem Kanal unterscheidet, ist
   gedeckt. Eine Rechteck-Huelle deckt nicht, was in ihr durchsichtig ist.     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);

const istKasten = () => {
  const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  const treffer = [];
  document.querySelectorAll('#buehne *').forEach(el => {
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    const a = rgba(c.backgroundColor);
    const hatGrund = a !== null && a > 0.35;
    const bi = c.backgroundImage || 'none';
    const hatVerlauf = /gradient/.test(bi);
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
      .map(k => parseFloat(c[k]) || 0);
    const ab = rgba(c.borderTopColor) ?? rgba(c.borderBottomColor);
    const hatRahmen = Math.max(...bw) >= 1 && ab !== null && ab > 0.3;
    if (hatGrund || hatVerlauf || hatRahmen) treffer.push(el);
  });
  /* Die Epochenplatte ist die BUEHNE selbst und nie ein Kasten: das eine
     Element, dessen Bild den ganzen Schirm fuellt. */
  const raus = treffer.filter(el => {
    const r = el.getBoundingClientRect();
    return !(r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98);
  });
  raus.forEach(el => { el.dataset.w9kasten = '1'; });
  return raus.length;
};

const b = await chromium.launch();
const zeilen = [];
const EPOCHEN = (process.env.EPOCHEN || '1,2,3,4').split(',').map(Number);
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  if (process.env.ESCAPE) {           // Lesetafeln beiseitelegen — der faire Fall
    for (let i = 0; i < 3; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(250); }
  }
  await s.waitForTimeout(700);
  const n = await s.evaluate(istKasten);
  const voll = await s.screenshot();
  await s.evaluate(() => document.querySelectorAll('[data-w9kasten]')
    .forEach(el => { el.style.visibility = 'hidden'; }));
  await s.waitForTimeout(300);
  const nackt = await s.screenshot();
  writeFileSync(`werkbank/schuss/fuhre-w11/bilder/e${e}-nackt${WOCHEN ? "-w" + WOCHEN : ""}${process.env.ESCAPE ? "-esc" : ""}.png`, nackt);

  const A = pngLesen(voll), Bd = pngLesen(nackt);
  const zone = (y0, y1) => {
    let k = 0, g = 0;
    for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4; g++;
      if (Math.abs(A.daten[i] - Bd.daten[i]) > 8 || Math.abs(A.daten[i+1] - Bd.daten[i+1]) > 8 ||
          Math.abs(A.daten[i+2] - Bd.daten[i+2]) > 8) k++;
    }
    return 100 * k / g;
  };
  const s6 = Math.floor(H / 6);
  const z = { ges: zone(0, H), oben: zone(0, s6), mitte: zone(s6, H - s6), unten: zone(H - s6, H) };
  const p = v => v.toFixed(1).padStart(5) + ' %';
  const zeile = `E${e}  Kaesten ${String(n).padStart(4)}   gesamt ${p(z.ges)}   ` +
                `oberstes 1/6 ${p(z.oben)}   Mittelband ${p(z.mitte)}   unterstes 1/6 ${p(z.unten)}`;
  console.log(zeile); zeilen.push(zeile);
  await s.close();
}
await b.close();
writeFileSync(`werkbank/schuss/fuhre-w11/messungen/deckung-${process.env.NAME||'lauf'}.txt`, zeilen.join('\n') + '\n');
