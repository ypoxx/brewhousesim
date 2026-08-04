/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — IST ES ANZUFASSEN?

   Latte 4 fragt nach der Bedienbarkeit, nicht nur nach der Schriftgroesse.
   Gezaehlt wird je Epoche und je Brett der FUHRE:
     * wieviele fuhre:*-Zuege es ueberhaupt gibt (auch die ohne Flaeche),
     * wieviele davon eine Flaeche haben,
     * wieviele davon GANZ im Fenster liegen,
     * wieviele davon die Maus in ihrer Mitte wirklich trifft
       (elementFromPoint — dieselbe Probe, die auch das Messgeraet der
       Rueckkopplung benutzt),
     * wieviele unter 24x24 px liegen.

   Die Bretter der FUHRE werden vorher einzeln aufgeschlagen, jedes fuer sich,
   damit kein zugeklapptes Brett als „kein Zug" zaehlt.

     HAFEN=8900 BREITE=1366 HOEHE=768 node griff.mjs <ziel.json>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const HAFEN = process.env.HAFEN || '8900';
const BREITE = +(process.env.BREITE || 1366);
const HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'griff.json';

const probe = (seite) => seite.evaluate(() => {
  const brett = (el) => {
    for (let n = el; n; n = n.parentElement) {
      const c = typeof n.className === 'string' ? n.className : '';
      const m = c.match(/fu-brett\s+(fu-[a-z]+)/);
      if (m) return m[1];
      if (/(^|\s)fu-blatt/.test(c)) return 'fu-blatt';
    }
    return '?';
  };
  const aus = [];
  document.querySelectorAll('[data-zug^="fuhre:"]').forEach(el => {
    const r = el.getBoundingClientRect();
    const flaeche = r.width > 0 && r.height > 0;
    let imFenster = false, trifft = false, wer = null;
    if (flaeche) {
      imFenster = r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        trifft = !!(t && (t === el || el.contains(t)));
        if (!trifft && t) wer = (typeof t.className === 'string' ? t.className : '') || t.tagName;
      }
    }
    aus.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, brett: brett(el),
      w: +r.width.toFixed(1), h: +r.height.toFixed(1),
      flaeche, imFenster, trifft, wer,
      klein: flaeche && (r.width < 24 || r.height < 24),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40) });
  });
  const liste = document.querySelector('.fu-liste');
  const lr = liste ? liste.getBoundingClientRect() : null;
  const karten = [...document.querySelectorAll('.fu-haus')].map(k => {
    const r = k.getBoundingClientRect();
    return { name: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 26),
      top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
  });
  return { zuege: aus, liste: lr ? { top: Math.round(lr.top), bottom: Math.round(lr.bottom),
    h: Math.round(lr.height), scrollH: liste.scrollHeight, klientH: liste.clientHeight,
    rollt: getComputedStyle(liste).overflowY } : null, karten,
    fenster: { w: innerWidth, h: innerHeight } };
});

const browser = await chromium.launch();
const alles = { breite: BREITE, hoehe: HOEHE, epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1400);
  const reiter = await seite.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(x => ({
      zug: x.getAttribute('data-zug'), text: (x.innerText || '').replace(/\s+/g, ' ').trim() })));
  const je = {};
  for (const r of reiter) {
    try { await seite.click(`[data-zug="${r.zug}"]`, { timeout: 2000 }); } catch (x) { }
    await seite.waitForTimeout(400);
    je[r.zug] = await probe(seite);
  }
  const gesamt = await probe(seite);
  // Vereinigung ueber alle Reiterstellungen: bester je Zug
  const best = {};
  Object.values(je).concat([gesamt]).forEach(p => p.zuege.forEach(z => {
    const b = best[z.zug];
    const gut = (x) => (x.trifft ? 4 : 0) + (x.imFenster ? 2 : 0) + (x.flaeche ? 1 : 0);
    if (!b || gut(z) > gut(b)) best[z.zug] = z;
  }));
  const l = Object.values(best);
  const akt = l.filter(z => !z.aus);
  alles.epochen[e] = { reiter, je, gesamt, best: l,
    zahl: { alle: l.length, aktiv: akt.length,
      ohneFlaeche: akt.filter(z => !z.flaeche).length,
      ausserhalb: akt.filter(z => z.flaeche && !z.imFenster).length,
      trifftNicht: akt.filter(z => z.flaeche && !z.trifft).length,
      klein: akt.filter(z => z.klein).length } };
  const z = alles.epochen[e].zahl;
  console.log(`E${e}: ${z.alle} fuhre-Zuege (${z.aktiv} aktiv) · ohne Flaeche ${z.ohneFlaeche} · `
    + `nicht ganz im Fenster ${z.ausserhalb} · Maus trifft nicht ${z.trifftNicht} · unter 24px ${z.klein}`);
  console.log('   Liste:', JSON.stringify(gesamt.liste), 'Karten:', gesamt.karten.length,
    'davon unter der Fensterkante:', gesamt.karten.filter(k => k.bottom > HOEHE).length);
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
