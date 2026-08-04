/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — Latte 4 am Stueck gemessen.

   Statische Ablesung, keine Klickfolge, kein Zeitmass. Gemessen wird bei
   1366x768 (Latte 4). Gezaehlt wird GETRENNT: was gehoert der FUHRE, was
   dem Rest des Spiels. Ein Kritiker, der die Summe nennt, urteilt ueber
   fremde Arbeit mit.

   Zugehoerigkeit: ein Knoten gehoert der FUHRE, wenn er in einem
   #fach-*-fuhre liegt ODER seine naechste Klasse mit `fu-` beginnt ODER
   sein data-zug mit `fuhre:` beginnt.

     HAFEN=8900 BREITE=1366 HOEHE=768 node lesbar.mjs <ziel.json> [reiter]
   `reiter` = 1: vorher alle stadt:reiter:* nacheinander aufschlagen, damit
   auch zugeklappte Bretter gezeichnet sind.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const HAFEN = process.env.HAFEN || '8900';
const BREITE = +(process.env.BREITE || 1366);
const HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'lesbar.json';
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
  const kl = (el) => (typeof el.className === 'string' ? el.className : '').trim().split(/\s+/)[0] || el.tagName.toLowerCase();
  const txt = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim();

  const res = {
    klein: { fuhre: [], fremd: 0 }, knopf: { fuhre: [], fremd: 0 },
    schnitt: { fuhre: [], fremd: 0 }, rand: { fuhre: [], fremd: 0 },
    versteckt: [], nurTitel: [], knoepfeFuhre: 0, knoepfeAlle: 0,
    groessen: {}
  };

  [...document.querySelectorAll('*')].forEach(el => {
    const c = getComputedStyle(el);
    const f = inFuhre(el);
    // 1. Schriftgroesse an Blattknoten mit Text
    if (el.children.length === 0 && txt(el)) {
      const px = parseFloat(c.fontSize);
      const r = el.getBoundingClientRect();
      const sichtbar = r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none';
      if (sichtbar) {
        if (f) res.groessen[px.toFixed(1)] = (res.groessen[px.toFixed(1)] || 0) + 1;
        if (px < 12) {
          if (f) res.klein.push ? 0 : 0;
          if (f) res.klein.fuhre.push({ px: +px.toFixed(1), kl: kl(el), t: txt(el).slice(0, 40) });
          else res.klein.fremd++;
        }
      }
    }
    // 2. abgeschnittener Text
    if (c.overflow === 'hidden' || c.overflowY === 'hidden' || c.overflowX === 'hidden') {
      if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
        if (f) res.schnitt.fuhre.push({ kl: kl(el),
          w: el.clientWidth, sw: el.scrollWidth, h: el.clientHeight, sh: el.scrollHeight,
          t: txt(el).slice(0, 60) });
        else res.schnitt.fremd++;
      }
    }
    // 3. text-overflow: ellipsis, der wirklich greift
    if (c.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) {
      if (f) res.schnitt.fuhre.push({ kl: kl(el), art: 'ellipsis',
        w: el.clientWidth, sw: el.scrollWidth, t: txt(el).slice(0, 60) });
    }
    // 4. ueber den Rand der Buehne
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && c.display !== 'none' && c.visibility !== 'hidden') {
      if (r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1) {
        // nur die aeussersten melden: Elternteil schon gemeldet -> ueberspringen
        const p = el.parentElement;
        const pr = p ? p.getBoundingClientRect() : null;
        const pdrueber = pr && (pr.right > innerWidth + 1 || pr.bottom > innerHeight + 1 || pr.left < -1 || pr.top < -1);
        if (!pdrueber) {
          if (f) res.rand.fuhre.push({ kl: kl(el), l: Math.round(r.left), t2: Math.round(r.top),
            rr: Math.round(r.right), b: Math.round(r.bottom), t: txt(el).slice(0, 40) });
          else res.rand.fremd++;
        }
      }
    }
    // 5. was per CSS verschwunden ist, aber Text traegt
    if (c.display === 'none' && txt(el) && el.children.length === 0) {
      if (f) res.versteckt.push({ kl: kl(el), t: txt(el).slice(0, 90) });
    }
  });

  // 6. Knoepfe
  [...document.querySelectorAll('[data-zug]')].forEach(el => {
    if (el.disabled) return;
    const r = el.getBoundingClientRect();
    if (!(r.width > 0 && r.height > 0)) return;
    const f = inFuhre(el);
    if (f) res.knoepfeFuhre++;
    res.knoepfeAlle++;
    if (r.width < 24 || r.height < 24) {
      if (f) res.knopf.fuhre.push({ zug: el.getAttribute('data-zug'),
        w: +r.width.toFixed(1), h: +r.height.toFixed(1), t: txt(el).slice(0, 40) });
      else res.knopf.fremd++;
    }
  });

  // 7. title-Attribute in der FUHRE, deren Text NIRGENDS sichtbar steht
  const sichtbarerText = (() => {
    let s = '';
    [...document.querySelectorAll('*')].forEach(el => {
      if (el.children.length) return;
      const c = getComputedStyle(el);
      if (c.display === 'none' || c.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return;
      s += ' ' + txt(el);
    });
    return s.replace(/\s+/g, ' ');
  })();
  [...document.querySelectorAll('[title]')].forEach(el => {
    if (!inFuhre(el)) return;
    const t = (el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
    if (!t) return;
    // Kernaussage: erste 30 Zeichen des Titels irgendwo sichtbar?
    const probe = t.slice(0, 30);
    if (sichtbarerText.indexOf(probe) < 0) {
      res.nurTitel.push({ kl: kl(el), zug: el.getAttribute('data-zug') || null, t: t.slice(0, 120) });
    }
  });

  return res;
});

const browser = await chromium.launch(process.env.ECHTEBALKEN ? { ignoreDefaultArgs: ['--hide-scrollbars'] } : {});
const alles = { hafen: HAFEN, breite: BREITE, hoehe: HOEHE, reiter: REITER, epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  const fehler = [];
  seite.on('pageerror', x => fehler.push(String(x).slice(0, 160)));
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1400);
  if (REITER) {
    const rs = await seite.evaluate(() =>
      [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(x => x.getAttribute('data-zug')));
    for (const r of rs) {
      try { await seite.click(`[data-zug="${r}"]`, { timeout: 1500 }); await seite.waitForTimeout(250); }
      catch (x) { /* verdeckt — dann eben nicht */ }
    }
    await seite.waitForTimeout(600);
  }
  const r = await messung(seite);
  r.fehler = fehler;
  alles.epochen[e] = r;
  console.log(`E${e} @${BREITE}x${HOEHE}${REITER ? ' (Reiter auf)' : ''}: `
    + `Schrift<12px FUHRE ${r.klein.fuhre.length} / fremd ${r.klein.fremd} · `
    + `Knopf<24 FUHRE ${r.knopf.fuhre.length}/${r.knoepfeFuhre} / fremd ${r.knopf.fremd} (alle ${r.knoepfeAlle}) · `
    + `abgeschnitten FUHRE ${r.schnitt.fuhre.length} / fremd ${r.schnitt.fremd} · `
    + `ueber Rand FUHRE ${r.rand.fuhre.length} / fremd ${r.rand.fremd} · `
    + `display:none-mit-Text ${r.versteckt.length} · nur-im-title ${r.nurTitel.length} · Seitenfehler ${fehler.length}`);
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
