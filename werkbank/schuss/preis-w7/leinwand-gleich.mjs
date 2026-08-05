/* IST DIE ENTWURFSLEINWAND UNBERUEHRT? — Gegenprobe zur ersten Latte.
     HAFEN=8899 node werkbank/schuss/preis-w7/leinwand-gleich.mjs <ziel.json>

   Der Schriftboden `max(12px, calc(var(--s) * N))` ist auf 2752x1536 ein
   Nichtstuer, solange N >= 12 ist — dort ist `--s` genau 1. Behauptet ist
   das schnell; hier wird es gezaehlt: fuer JEDEN Knoten unter `.fach-preis`
   werden Schriftgroesse und Kastenmass bei 2752x1536 abgelegt. Zwei Laeufe
   (alte und neue Fassung) muessen dieselbe Datei ergeben.

   Warum nicht ein Bildschirmfoto: Bilder gehoeren nicht in die Historie
   (LAUFENDER-AUFTRAG), und ein Foto beweist ohnehin nur, was ein Mensch
   darauf sieht. Zahlen lassen sich mit `diff` vergleichen. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8899';
const ZIEL = process.argv[2] || 'werkbank/schuss/preis-w7/leinwand.json';
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1400);
  for (let i = 0; i < 3; i++) {
    const l = await s.evaluate(() => {
      const el = document.querySelector('[data-zug="preis:tafel"]');
      if (!el || el.disabled) return null;
      if (/schließen/.test(el.innerText || '')) return 'offen';
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (l === 'offen' || !l) break;
    await s.mouse.click(l.x, l.y);
    await s.waitForTimeout(800);
  }
  alles['e' + e] = await s.evaluate(() => {
    const r = (x) => Math.round(x * 100) / 100;
    return [...document.querySelectorAll('.fach-preis *')].map(el => {
      const c = getComputedStyle(el);
      const k = el.getBoundingClientRect();
      return [(typeof el.className === 'string' ? el.className : '') || el.tagName,
        c.fontSize, c.overflowX, c.overflowY, c.whiteSpace,
        r(k.x), r(k.y), r(k.width), r(k.height)].join(' | ');
    });
  });
  console.log(`  E${e}: ${alles['e' + e].length} Knoten unter .fach-preis`);
  await s.close();
}
await b.close();
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
console.log('geschrieben:', ZIEL);
