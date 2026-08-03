/* DIE DECKE, zweite Frage: ist jeder Zug erreichbar, wenn man SEIN Brett aufschlägt?
   node erreichbar.mjs

   `decke.mjs` klappt alle Bretter auf und fragt, was einander zudeckt. Das war
   die richtige Frage, solange Bretter einander zudecken konnten. Seit die STADT
   eine Platzordnung hat (wer zuletzt aufschlägt, liegt oben; was er zudecken
   würde, klappt zu), ist "alles offen" kein erreichbarer Zustand mehr — und ein
   zugeklapptes Brett ist zu Recht nicht bedienbar.

   Also die Frage, auf die es ankommt: geht der Spieler Brett für Brett durch,
   erreicht er dann jeden Zug? Verfahren: je Brett dessen Reiter aufschlagen,
   dann alle [data-zug] IN DIESEM BRETT am Mittelpunkt anfassen. Was auch dann
   nicht sich selbst trifft, ist für die Maus nicht da.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const BREITE = +(process.env.BREITE || 1920), HOEHE = +(process.env.HOEHE || 1000);

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push(String(e).slice(0, 140)));
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${epoche}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(900);

  const reiter = await seite.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

  const gesehen = new Map();          // zug -> erreichbar (einmal true genügt)
  const decke = new Map();            // zug -> was zuletzt darüber lag

  async function erfassen() {
    const l = await seite.evaluate(() => {
      const out = [];
      document.querySelectorAll('[data-zug]').forEach(el => {
        const z = el.getAttribute('data-zug');
        if (/^stadt:reiter:/.test(z)) return;
        const q = el.getBoundingClientRect();
        if (!q.width || !q.height) return;
        const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
        if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) { out.push({ z, hit: false, was: 'ausserhalb' }); return; }
        const t = document.elementFromPoint(cx, cy);
        if (t && (t === el || el.contains(t))) { out.push({ z, hit: true }); return; }
        const k = (t && (t.className && t.className.baseVal !== undefined ? t.className.baseVal : t.className)) || '';
        out.push({ z, hit: false, was: t ? t.tagName.toLowerCase() + (k ? '.' + String(k).trim().split(/\s+/)[0] : '') : 'nichts' });
      });
      return out;
    });
    for (const e of l) {
      if (e.hit) gesehen.set(e.z, true);
      else if (!gesehen.has(e.z)) { gesehen.set(e.z, false); decke.set(e.z, e.was); }
    }
  }

  await erfassen();                                  // Vorgabestand
  for (const r of reiter) {                          // jedes Brett einmal allein aufschlagen
    await seite.evaluate(x => { const e = document.querySelector(`[data-zug="${x}"]`); if (e) e.click(); }, r);
    await seite.waitForTimeout(320);
    await erfassen();
  }

  const zu = [...gesehen.entries()].filter(([, ok]) => !ok).map(([z]) => z);
  console.log(`\n=== EPOCHE ${epoche} · ${BREITE}×${HOEHE} — ${zu.length} von ${gesehen.size} Zügen bleiben unerreichbar`
    + (fehler.length ? `  (${fehler.length} Seitenfehler!)` : '') + ' ===');
  const nach = {};
  zu.forEach(z => { const d = decke.get(z) || '?'; (nach[d] = nach[d] || []).push(z); });
  Object.entries(nach).sort((a, b) => b[1].length - a[1].length).forEach(([d, zs]) =>
    console.log(`  ${String(zs.length).padStart(3)}×  ${d.padEnd(24)} ${zs.slice(0, 5).join(', ')}`));
  await seite.close();
}
await browser.close();
