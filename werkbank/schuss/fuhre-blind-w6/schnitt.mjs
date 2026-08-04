/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — ABGESCHNITTEN oder GEROLLT?

   Die vierte Latte verbietet abgeschnittenen Text. Ein Kasten mit
   `overflow-y: auto` schneidet nichts ab — er legt tiefer. Ein Kasten mit
   `overflow: hidden` schneidet ab. Das Messgeraet der Aufsicht wirft beides
   in eine Zahl (`lesbarkeit.mjs:26` prueft `overflow === 'hidden' ||
   overflowY === 'hidden'` und zaehlt dann JEDE Ueberlaufachse mit, auch die
   rollende). Hier wird es getrennt, achsenweise:

     ECHT ABGESCHNITTEN  die ueberlaufende Achse steht auf hidden/clip
     GEROLLT             die ueberlaufende Achse steht auf auto/scroll
     ELLIPSE             text-overflow: ellipsis greift wirklich

   Dazu die Zuordnung FUHRE / fremd, damit kein Kritiker fremde Arbeit
   mitzaehlt.

     HAFEN=8900 BREITE=1366 HOEHE=768 node schnitt.mjs <ziel.json> [reiter]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const HAFEN = process.env.HAFEN || '8900';
const BREITE = +(process.env.BREITE || 1366);
const HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'schnitt.json';
const REITER = process.argv[3] === '1';

const messung = (seite) => seite.evaluate(() => {
  const inFuhre = (el) => {
    for (let n = el; n; n = n.parentElement) {
      if (n.id && /^fach-.*-fuhre$/.test(n.id)) return true;
      const c = typeof n.className === 'string' ? n.className : '';
      if (/(^|\s)fu-/.test(c)) return true;
      const z = n.getAttribute && n.getAttribute('data-zug');
      if (z && z.indexOf('fuhre:') === 0) return true;
    }
    return false;
  };
  const kl = (el) => (typeof el.className === 'string' ? el.className : '').trim() || el.tagName;
  const txt = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();
  const r = { echt: { fuhre: [], fremd: [] }, gerollt: { fuhre: [], fremd: 0 },
              ellipse: { fuhre: [], fremd: [] } };
  const zu = (x) => (x === 'hidden' || x === 'clip');
  const rollt = (x) => (x === 'auto' || x === 'scroll');
  [...document.querySelectorAll('*')].forEach(el => {
    const c = getComputedStyle(el);
    if (c.display === 'none' || c.visibility === 'hidden') return;
    const f = inFuhre(el);
    const uy = el.scrollHeight > el.clientHeight + 1;
    const ux = el.scrollWidth > el.clientWidth + 1;
    const eintrag = { kl: kl(el), w: el.clientWidth, sw: el.scrollWidth,
      h: el.clientHeight, sh: el.scrollHeight, t: txt(el).slice(0, 70) };
    if ((uy && zu(c.overflowY)) || (ux && zu(c.overflowX))) {
      if (c.textOverflow === 'ellipsis' && ux) {
        (f ? r.ellipse.fuhre : r.ellipse.fremd).push(eintrag);
      } else if (f) r.echt.fuhre.push(eintrag);
      else r.echt.fremd.push(eintrag);
    } else if ((uy && rollt(c.overflowY)) || (ux && rollt(c.overflowX))) {
      if (f) r.gerollt.fuhre.push(eintrag); else r.gerollt.fremd++;
    }
  });
  return r;
});

const browser = await chromium.launch(process.env.ECHTEBALKEN ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {});
const alles = { breite: BREITE, hoehe: HOEHE, reiter: REITER, epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1400);
  if (REITER) {
    for (const b of ['fuhre-fu-brett-fu-haeuser', 'fuhre-fu-brett-fu-schiefer-fu-tafel',
                     'fuhre-fu-brett-fu-keller', 'fuhre-fu-brett-fu-wagen']) {
      try { await seite.click(`[data-zug="stadt:reiter:${b}"]`, { timeout: 2000 }); } catch (x) { }
      await seite.waitForTimeout(350);
    }
    await seite.waitForTimeout(500);
  }
  const r = await messung(seite);
  alles.epochen[e] = r;
  console.log(`E${e}: ECHT ABGESCHNITTEN FUHRE ${r.echt.fuhre.length} / fremd ${r.echt.fremd.length} · `
    + `ELLIPSE FUHRE ${r.ellipse.fuhre.length} / fremd ${r.ellipse.fremd.length} · `
    + `gerollt FUHRE ${r.gerollt.fuhre.length} / fremd ${r.gerollt.fremd}`);
  r.echt.fuhre.forEach(x => console.log(`    ECHT  ${x.kl}  ${x.w}x${x.h} <- ${x.sw}x${x.sh}  „${x.t}"`));
  r.ellipse.fuhre.forEach(x => console.log(`    ELL   ${x.kl}  ${x.w} <- ${x.sw}  „${x.t}"`));
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
