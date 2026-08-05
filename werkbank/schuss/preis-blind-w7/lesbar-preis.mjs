/* Vierte Latte, aber NUR an den Kaesten von DER PREIS (Klassen `pr-*`),
   und zwar ZWEIMAL: wie das Spiel laedt (Tafel im Reiter) und wie es
   gespielt wird (Tafel aufgeschlagen). Ein Stueck, das seine Schrift dadurch
   in Ordnung bringt, dass sein Brett beim Laden zugeklappt ist, hat nichts
   in Ordnung gebracht.

   Rollleiste gezeichnet — dieselbe Vorgabe wie im reparierten Geraet der
   Aufsicht (`aufsicht/lesbarkeit.mjs`, ignoreDefaultArgs).

     HAFEN=8903 BREITE=1366 HOEHE=768 node lesbar-preis.mjs <ziel.json>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8903';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'lesbar-preis.json';
const PNG = process.argv[3] || '';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });

const messe = () => ({
  fn: () => {
    const kappt = v => v === 'hidden' || v === 'clip';
    const sicht = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      const c = getComputedStyle(el);
      return !(c.visibility === 'hidden' || c.display === 'none' || +c.opacity === 0);
    };
    const meins = (el) => {
      let x = el;
      while (x && x !== document.body) {
        const cn = (x.className && typeof x.className === 'string') ? x.className : '';
        if (/\bpr-/.test(cn)) return true;
        x = x.parentElement;
      }
      return false;
    };
    const alle = [...document.querySelectorAll('*')].filter(meins);
    let klein = 0, winzig = 0, ueber = 0, kleinSicht = 0;
    const kleinListe = [], ueberListe = [];
    alle.forEach(el => {
      const c = getComputedStyle(el);
      if (el.children.length === 0 && (el.textContent || '').trim()) {
        const px = parseFloat(c.fontSize);
        if (px < 12) { klein++; if (sicht(el)) { kleinSicht++;
          kleinListe.push({ px: +px.toFixed(1), cn: String(el.className).slice(0, 40),
            t: el.textContent.trim().slice(0, 40) }); } }
        if (px < 10) winzig++;
      }
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
      if (abY || abX) { ueber++;
        ueberListe.push({ cn: String(el.className).slice(0, 44),
          sh: el.scrollHeight, ch: el.clientHeight, sw: el.scrollWidth, cw: el.clientWidth,
          sicht: sicht(el), t: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70) }); }
    });
    /* Knoepfe des Stuecks */
    const kn = [...document.querySelectorAll('[data-zug^="preis:"]')].filter(x => !x.disabled);
    const zuKlein = kn.filter(x => { const r = x.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24); })
      .map(x => { const r = x.getBoundingClientRect();
        return { zug: x.getAttribute('data-zug'), w: Math.round(r.width), h: Math.round(r.height) }; });
    /* IST DER UNTERHALT ZU SEHEN? Jede Angebotskarte, die im DOM
       "in jedem Michaeli" traegt — steht dieser Text im sichtbaren Teil
       seines schneidenden Kastens? */
    const karten = [...document.querySelectorAll('.pr-karte, .pr-angebot, [class*="pr-karte"], [class*="pr-angebot"]')];
    const unterhalt = [];
    [...document.querySelectorAll('*')].forEach(el => {
      if (el.children.length) return;
      const t = (el.textContent || '').trim();
      if (!/in jedem Michaeli/.test(t)) return;
      const r = el.getBoundingClientRect();
      let geschnitten = false, wodurch = '';
      let p = el.parentElement;
      while (p && p !== document.body) {
        const c = getComputedStyle(p);
        if (kappt(c.overflowY) || kappt(c.overflowX) || c.overflow === 'hidden') {
          const pr = p.getBoundingClientRect();
          if (r.bottom > pr.bottom + 1 || r.top < pr.top - 1 || r.right > pr.right + 1) {
            geschnitten = true; wodurch = String(p.className).slice(0, 40); break;
          }
        }
        p = p.parentElement;
      }
      const imFenster = r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
      unterhalt.push({ t: t.slice(0, 90), sicht: sicht(el), imFenster, geschnitten, wodurch,
        px: +parseFloat(getComputedStyle(el).fontSize).toFixed(1),
        y: Math.round(r.top), h: Math.round(r.height) });
    });
    return { knoten: alle.length, klein, kleinSicht, winzig, ueber,
      kleinListe: kleinListe.slice(0, 25), ueberListe: ueberListe.slice(0, 25),
      knoepfe: kn.length, zuKlein, karten: karten.length, unterhalt };
  }
});

const erg = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);
  const zu = await s.evaluate(messe().fn);
  /* Tafel aufschlagen — so, wie ein Spieler sie aufschlaegt. */
  let geoeffnet = false;
  try {
    const g = await s.$('[data-zug="preis:tafel"]');
    if (g) { await g.click({ timeout: 4000 }); await s.waitForTimeout(900); geoeffnet = true; }
  } catch (x) { /* nichts */ }
  const auf = await s.evaluate(messe().fn);
  if (PNG) await s.screenshot({ path: `${PNG}e${e}-tafel.png` });
  erg['e' + e] = { zu, auf, geoeffnet };
  console.log(`E${e} ${BREITE}x${HOEHE}  geladen: ${zu.klein} <12px (${zu.kleinSicht} sichtbar) · ${zu.ueber} Ueberlauf · ${zu.zuKlein.length}/${zu.knoepfe} Knoepfe <24px`);
  console.log(`      Tafel auf: ${auf.klein} <12px (${auf.kleinSicht} sichtbar) · ${auf.ueber} Ueberlauf · ${auf.zuKlein.length}/${auf.knoepfe} Knoepfe <24px · Unterhalt-Zeilen ${auf.unterhalt.length} (davon geschnitten ${auf.unterhalt.filter(u => u.geschnitten).length}, ausserhalb Fenster ${auf.unterhalt.filter(u => !u.imFenster).length})`);
  await s.close();
}
fs.writeFileSync(ZIEL, JSON.stringify({ breite: BREITE, hoehe: HOEHE, hafen: HAFEN, erg }, null, 1));
await b.close();
