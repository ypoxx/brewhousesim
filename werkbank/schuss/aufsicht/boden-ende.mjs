/* BODEN UND ENDE — die zwei Auflagen aus spiel/BEFUND-ENDE.md nachgezaehlt.
   HAFEN=8900 node werkbank/schuss/aufsicht/boden-ende.mjs

   1. Geht die Kasse noch unter null? (Vorher 1350: -6/-7/-14 Pf)
   2. Steht am Ende ein Urteil ueber die PARTIE am Schirm — und zwar sichtbar,
      nicht unter dem Blatt eines anderen Stuecks?

   Der zweite Punkt ist eine Berichtigung an der Aufsicht: BEFUND-ENDE.md §1(a)
   schrieb "das Ende ist stumm". DER SUD hat gezeigt, dass DIE FUHRE sehr wohl
   ein Schlussblatt malt — es lag nur unter dem Sudbuch. Der Befund war richtig
   in dem, was der Spieler sah, und falsch in der Ursache.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
for (const ep of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push(String(e).slice(0, 120)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(800);
  let minKasse = Infinity, wochen = 0, negativ = 0;
  for (let w = 0; w < 140; w++) {
    const k = await s.evaluate(() => BRAUHAUS.welt.haus.kasse);
    minKasse = Math.min(minKasse, k); if (k < 0) negativ++;
    const ok = await s.evaluate(() => {
      const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
        const q = e.getBoundingClientRect(); if (!q.width) return false;
        const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        return !!(t && (t === e || e.contains(t))); };
      const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
        if (e && !e.disabled) { e.click(); return true; } return false; };
      if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
      if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
        if (frei('weiter')) break; r.click(); }
      return tu('weiter');
    });
    wochen = w + 1;
    await s.waitForTimeout(40);
    if (!ok) break;
  }
  /* Was liegt am Ende oben? Grosse, sichtbare Flaechen mit Text. */
  const schluss = await s.evaluate(() => {
    const W = BRAUHAUS.welt;
    const gross = [...document.querySelectorAll('div,section,article')].filter(e => {
      const r = e.getBoundingClientRect();
      if (r.width * r.height < 120000) return false;
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!(t && (t === e || e.contains(t))) && (e.innerText || '').trim().length > 40;
    }).map(e => ({ kl: e.className.toString().slice(0, 40),
                   gr: Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height),
                   text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90) }));
    return { kasse: W.haus.kasse, jahr: W.zeit.jahr, woche: W.zeit.woche,
             ende: !!W.zeit.ende, grund: W.zeit.endgrund || null, oben: gross.slice(0, 3) };
  });
  console.log(`\nE${ep}: ${wochen} Wochen → ${schluss.jahr}/${schluss.woche} · ende=${schluss.ende} grund=${schluss.grund}`);
  console.log(`   Kasse am Ende ${schluss.kasse} · TIEFSTSTAND ${minKasse} · Wochen unter null ${negativ} · Fehler ${fehler.length}`);
  schluss.oben.forEach(o => console.log(`   sichtbar [${o.kl}] ${o.gr}: ${o.text}`));
  await s.close();
}
await b.close();
