/* IN WIE VIELEN WOCHEN STEHT DIE LAUFENDE BELASTUNG AM SCHIRM?
   Und: wie viele bepreiste Entscheidungen liegen gleichzeitig treffbar da?

   Geht ein volles Braujahr Woche fuer Woche durch (WEITER), und sieht in
   JEDER Woche nach:
     * steht irgendwo am Bildschirm eine Zeile, die den Unterhalt nennt?
     * laesst sich die Michaelitafel oeffnen — und was steht dann da?
     * wie viele [data-zug] sind gleichzeitig sichtbar, treffbar, aktiv und
       tragen ein Preisschild?

     HAFEN=8903 node wochen.mjs <epoche> <wochen> <ziel.json> [breite] [hoehe]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 32);
const ZIEL = process.argv[4] || 'wochen.json';
const BR = +(process.argv[5] || 1366), HO = +(process.argv[6] || 768);
const HAFEN = process.env.HAFEN || '8903';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const s = await b.newPage({ viewport: { width: BR, height: HO } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1000);

async function ruhe(ms) {
  await s.waitForTimeout(Math.min(ms, 40));
  try { await s.evaluate(() => new Promise(f => { let a = false; const g = () => { if (!a) { a = true; f(1); } };
    setTimeout(g, 2000); requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0))); })); } catch (e) {}
}
const lage = (z) => s.evaluate((zz) => {
  const el = document.querySelector(`[data-zug="${zz}"]`); if (!el) return null;
  const r = el.getBoundingClientRect(); if (!r.width || !r.height) return { sichtbar: false };
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) ? document.elementFromPoint(cx, cy) : null;
  return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))), x: cx, y: cy,
    text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
}, z);
async function klick(z, w = 90) {
  const l = await lage(z);
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await s.mouse.click(l.x, l.y); await ruhe(w); return true;
}

const blick = () => s.evaluate(() => {
  const B = window.BRAUHAUS;
  const sicht = (el) => { const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const c = getComputedStyle(el);
    return !(c.visibility === 'hidden' || c.display === 'none' || +c.opacity === 0); };
  const treff = (el) => { const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const o = document.elementFromPoint(x, y); return !!(o && (o === el || el.contains(o))); };
  /* Nur was WIRKLICH auf dem Tisch liegt: sichtbar, im Fenster, treffbar. */
  const zuege = [...document.querySelectorAll('[data-zug]')].map(el => {
    const ps = el.querySelector('.preis');
    return { zug: el.getAttribute('data-zug'), aus: !!el.disabled,
      schild: ps ? (ps.innerText || '').replace(/\s+/g, ' ').trim() : '',
      preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
      sicht: sicht(el), treff: treff(el) };
  });
  /* Der sichtbare Text des ganzen Bildschirms — nur was gezeichnet ist. */
  const sichtbarerText = (() => {
    let t = '';
    const geh = (el) => {
      if (!sicht(el)) return;
      if (!el.children.length) { const x = (el.textContent || '').trim(); if (x) t += x + '\n'; return; }
      [...el.children].forEach(geh);
    };
    geh(document.body); return t;
  })();
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    zuege, text: sichtbarerText };
});

const MUSTER = /in jedem Michaeli|läuft weiter, auch wenn nicht gebraut wird|Zusammen im Jahr|Unterhalt/;
const reihe = [];
for (let i = 0; i < N; i++) {
  let v = await blick();
  const griff = await lage('preis:tafel');
  const tafelZu = !!(griff && !/schließen/.test(griff.text || ''));
  let mitTafel = null;
  if (tafelZu && await klick('preis:tafel', 300)) {
    mitTafel = await blick();
    await klick('preis:tafel', 250);
  }
  const zaehl = (x) => {
    const b = x.zuege.filter(z => z.schild && !z.aus && z.sicht && z.treff);
    return { bepreist: b.length, liste: b.map(z => z.zug + '=' + z.schild).slice(0, 60) };
  };
  reihe.push({ jahr: v.jahr, woche: v.woche, kasse: v.kasse,
    tafelOffenBeimAufschlagen: !tafelZu,
    unterhaltOhneTafel: MUSTER.test(v.text),
    unterhaltMitTafel: mitTafel ? MUSTER.test(mitTafel.text) : null,
    ohneTafel: zaehl(v),
    mitTafel: mitTafel ? zaehl(mitTafel) : null });
  if (!(await klick('weiter', 200))) break;
}
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, breite: BR, hoehe: HO, fehler, reihe }, null, 1));
console.log(`E${ep}: ${reihe.length} Wochen · Unterhalt ohne Tafel in ${reihe.filter(r => r.unterhaltOhneTafel).length}, `
  + `mit aufgeschlagener Tafel in ${reihe.filter(r => r.unterhaltMitTafel).length} · `
  + `bepreist+treffbar Median ohne ${med(reihe.map(r => r.ohneTafel.bepreist))} / mit ${med(reihe.map(r => r.mitTafel ? r.mitTafel.bepreist : 0))}`);
function med(a) { const x = a.slice().sort((p, q) => p - q); return x[Math.floor(x.length / 2)]; }
await b.close();
