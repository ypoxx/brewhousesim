/* WO IST PLATZ? Listet jedes Brett jedes Stuecks mit seinem Rechteck in
   Prozent der Buehne — auch die zugeklappten, denn die behalten ihre Groesse
   (stadt.js: „das Brett bleibt an seinem Platz und in seiner Groesse, es wird
   nur weggeschnitten"). Damit laesst sich ein Rechteck finden, das kein Brett
   zu mehr als DECKGRENZE (12 %) verdecken kann.
   HAFEN=8923 node freiflaeche.mjs <epoche> */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8923';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);
const d = await seite.evaluate(() => {
  const m = window.BRAUHAUS.buehne.masse();
  const raus = [];
  document.querySelectorAll('.ebene [data-stueck] > *').forEach(el => {
    const wer = el.parentElement.getAttribute('data-stueck');
    if (/^(stadt-platte|stadt-fach)/.test(el.className)) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return;
    const p = (v, g) => Math.round(v / g * 1000) / 10;
    raus.push({ wer, kl: String(el.className).slice(0, 40),
      x0: p(r.left, m.breite), x1: p(r.right, m.breite),
      y0: p(r.top, m.hoehe), y1: p(r.bottom, m.hoehe),
      anteil: Math.round(r.width * r.height / (m.breite * m.hoehe) * 1000) / 10 });
  });
  /* Werkbank der STADT */
  const wb = [];
  ['.stadt-reiterzeile', '.stadt-bauhof'].forEach(q => {
    const t = document.querySelector(q); if (!t) return;
    const r = t.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
    const p = (v, g) => Math.round(v / g * 1000) / 10;
    wb.push({ q, x0: p(r.left, m.breite), x1: p(r.right, m.breite),
      y0: p(r.top, m.hoehe), y1: p(r.bottom, m.hoehe) });
  });
  return { masse: m, bretter: raus, werkbank: wb };
});
console.log(`EPOCHE ${ep} — ${d.masse.breite}x${d.masse.hoehe}`);
console.log('WERKBANK:', JSON.stringify(d.werkbank));
d.bretter.sort((a, b) => b.anteil - a.anteil);
d.bretter.filter(b => b.anteil >= 0.4).forEach(b =>
  console.log(`  ${String(b.anteil).padStart(5)}%  x ${String(b.x0).padStart(5)}–${String(b.x1).padStart(5)}  y ${String(b.y0).padStart(5)}–${String(b.y1).padStart(5)}  ${b.wer} ${b.kl}`));
await browser.close();
