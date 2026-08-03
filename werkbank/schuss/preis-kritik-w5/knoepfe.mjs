/* WAS AN DEN KNOEPFEN STEHT — ZUSTAENDIGKEIT 25, nachgelesen.

   HAFEN=8900 node knoepfe.mjs [wochen]

   Drei Zahlen je Epoche, je Zugschluessel aufgeschluesselt:
     * `data-soll-aus="1"`               das Spiel sagt nein
     * `disabled` mit `data-soll-aus="0"` VERDECKT — nach ZUSTAENDIGKEIT 25
                                          ein Fehler, kein Zustand
     * gar kein `data-soll-aus`           der Knopf kam nicht aus `B.knopf()`
   Dazu (a) der zweiten Messlatte: Zuege mit Preisschild, die ERREICHBAR
   (elementFromPoint) UND aktiv (`data-soll-aus !== "1"`, nicht `disabled`)
   sind — Median und Spannweite ueber die Wochen.

   Diese Hand spielt nicht, sie geht nur weiter. Sie misst den Bildschirm,
   den das Spiel von sich aus zeigt.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';
const WOCHEN = +(process.argv[2] || 62);
const ZIEL = process.argv[3] || '/tmp/pk5/knoepfe.json';

const browser = await chromium.launch();
const alles = [];

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1000);

  const zaehl = { soll1: {}, aus0: {}, ohne: {}, aktivErreichbar: [], mitPreis: [], aktiv: [] };
  for (let i = 0; i < WOCHEN; i++) {
    const d = await seite.evaluate(() => {
      const s1 = [], a0 = [], oh = [];
      let mitPreis = 0, aktiv = 0, erreichbar = 0;
      document.querySelectorAll('[data-zug]').forEach(el => {
        const k = el.getAttribute('data-zug');
        const sa = el.getAttribute('data-soll-aus');
        if (sa === null) oh.push(k);
        else if (sa === '1') s1.push(k);
        else if (el.disabled) a0.push(k);
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const p = el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null;
        if (!p) return;
        mitPreis++;
        if (sa !== '1') aktiv++;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        let hit = false;
        if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
          const t = document.elementFromPoint(cx, cy);
          hit = !!(t && (t === el || el.contains(t)));
        }
        if (sa !== '1' && !el.disabled && hit) erreichbar++;
      });
      return { s1, a0, oh, mitPreis, aktiv, erreichbar,
               jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche };
    });
    d.s1.forEach(k => zaehl.soll1[k] = (zaehl.soll1[k] || 0) + 1);
    d.a0.forEach(k => zaehl.aus0[k] = (zaehl.aus0[k] || 0) + 1);
    d.oh.forEach(k => zaehl.ohne[k] = (zaehl.ohne[k] || 0) + 1);
    zaehl.mitPreis.push(d.mitPreis); zaehl.aktiv.push(d.aktiv); zaehl.aktivErreichbar.push(d.erreichbar);
    const w = await seite.evaluate(() => {
      const el = document.querySelector('[data-zug="weiter"]');
      if (!el || el.disabled) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (!w) break;
    await seite.mouse.click(w.x, w.y);
    await seite.waitForTimeout(60);
    try {
      await seite.evaluate(() => new Promise(f => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(f, 0)))));
    } catch (e) {}
  }
  const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log(`--- E${ep}: ${zaehl.mitPreis.length} Wochen, Seitenfehler ${fehler.length}`);
  console.log(`  (a) mit Preisschild Median ${med(zaehl.mitPreis)} (${Math.min(...zaehl.mitPreis)}–${Math.max(...zaehl.mitPreis)}) · `
    + `aktiv nach soll-aus Median ${med(zaehl.aktiv)} (${Math.min(...zaehl.aktiv)}–${Math.max(...zaehl.aktiv)}) · `
    + `aktiv UND erreichbar Median ${med(zaehl.aktivErreichbar)} (${Math.min(...zaehl.aktivErreichbar)}–${Math.max(...zaehl.aktivErreichbar)})`);
  console.log(`  soll-aus="1" gesamt ${Object.values(zaehl.soll1).reduce((a, b) => a + b, 0)} Sichtungen`);
  console.log(`  disabled MIT soll-aus="0" (VERDECKT, Fehler): ${Object.values(zaehl.aus0).reduce((a, b) => a + b, 0)} Sichtungen`);
  top(zaehl.aus0).forEach(([k, n]) => console.log(`      ${n}  ${k}`));
  console.log(`  ganz OHNE data-soll-aus: ${Object.values(zaehl.ohne).reduce((a, b) => a + b, 0)} Sichtungen`);
  top(zaehl.ohne).forEach(([k, n]) => console.log(`      ${n}  ${k}`));
  alles.push({ epoche: ep, fehler, ...zaehl });
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
