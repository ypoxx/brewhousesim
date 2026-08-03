/* DIE GESPERRTE CHARGE — die epocheneigene Bierentscheidung von 1970.
   node charge.mjs [wochen]

   Spielt 1970 mit nichts als WEITER (plus dem noetigen Georgi-Griff) und
   zaehlt, in wie vielen Wochen die beiden Antworten auf eine gesperrte
   Charge — freigeben oder verschneiden — am Bildschirm BEDIENBAR standen.
   Vor Welle 4 waren es null: sie hingen allein am zugeklappten Brett.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const W = +(process.argv[2] || 160);
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e).slice(0, 140)));
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text().slice(0, 140)); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=4&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);
const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t)));
    }
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50),
              aus: !!el.disabled, hit, x: cx, y: cy });
  });
  const B = window.BRAUHAUS, Z = B.SUD_ZUSTAND || {};
  return { kn, jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
           gesperrt: (Z.bottiche || []).filter(x => x.gesperrt).length, lage: B.lage.length };
});
async function klick(zug) {
  const z = await lies(); const k = z.kn.find(x => x.zug === zug && !x.aus && x.hit);
  if (!k) return false;
  await s.mouse.click(k.x, k.y); await s.waitForTimeout(140); return true;
}
let mitWahl = 0, gesperrtWochen = 0, entschieden = 0;
for (let i = 0; i < W; i++) {
  const z = await lies();
  if (z.ende) break;
  if (z.gesperrt) gesperrtWochen++;
  const paar = z.kn.filter(k => /^sud:(zettel-)?charge-(frei|schnitt)/.test(k.zug) && !k.aus && k.hit);
  if (paar.length >= 2) mitWahl++;
  if (paar.length >= 2 && entschieden < 3) {
    const w = paar.find(k => /schnitt/.test(k.zug));
    if (w) { await s.mouse.click(w.x, w.y); await s.waitForTimeout(200); entschieden++; }
  }
  if (await s.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
    if (!(await klick('fuhre:jahresplan:grut'))) await klick('fuhre:jahresplan:duenn');
    await klick('fuhre:sommer-zu');
  }
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  if (!(await klick('weiter'))) break;
  await s.waitForTimeout(90);
}
const e = await lies();
console.log(`1970, ${W} Wochen nur WEITER: Wochen mit gesperrter Charge ${gesperrtWochen} · `
  + `davon mit BEIDEN Antworten bedienbar ${mitWahl} · selbst entschieden ${entschieden} · `
  + `Stand ${e.jahr}/${e.woche} · lage ${e.lage} · Seitenfehler ${fehler.length}`);
await b.close();
