/* DAS GUTE ENDE — gibt es eines, und findet man es?
   Spielt 1350 mit echter Maus und sucht ab dem fuenften Braujahr jede Woche
   nach dem Blatt DIE UEBERGABE VOR DEM RAT.
   HAFEN=8911 node gutesende.mjs [minuten]                                    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const MIN = +(process.argv[2] || 14);
const HAFEN = process.env.HAFEN || '8911';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12';
const PROT = `${WURZ}/protokoll/gutesende.jsonl`;
fs.writeFileSync(PROT, '');
const T0 = Date.now();
const schreib = o => fs.appendFileSync(PROT, JSON.stringify({ t: Math.round((Date.now() - T0) / 100) / 10, ...o }) + '\n');

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=1&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const schirm = () => seite.evaluate(() => {
  const B = window.BRAUHAUS; const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t)));
    }
    zuege.push({ zug: el.getAttribute('data-zug'),
      preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
      aus: !!el.disabled, hit, x: Math.round(cx), y: Math.round(cy),
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80) });
  });
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    endgrund: B.welt.zeit.endgrund || null, kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
    faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze, lage: B.lage.length, zuege };
});
const sicht = () => seite.evaluate(() => {
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim(); if (!t) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
    out.push(t.replace(/\s+/g, ' ').slice(0, 200));
  });
  return out;
});
async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 50));
  try { await seite.evaluate(() => new Promise(f => { let a = false; const g = () => { if (!a) { a = true; f(1); } };
    setTimeout(g, 1500); requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0))); })); } catch (e) {}
}
let klicks = 0;
async function greif(zug, warte = 230) {
  const s = await schirm(); const l = s.zuege.find(z => z.zug === zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x - 30, l.y - 20); await seite.waitForTimeout(25);
  await seite.mouse.move(l.x, l.y, { steps: 5 }); await seite.waitForTimeout(35);
  await seite.mouse.down(); await seite.waitForTimeout(60); await seite.mouse.up();
  klicks++; await ruhe(warte); return true;
}

const ENDE = T0 + MIN * 60 * 1000;
let n = 0, gefunden = null, abschluss = null;
while (Date.now() < ENDE) {
  let s = await schirm();
  if (s.ende) { abschluss = { grund: s.endgrund, jahr: s.jahr, woche: s.woche }; break; }
  n++;

  /* Blatt DIE UEBERGABE: erst der Reiter, dann JA */
  const rU = s.zuege.find(z => /uebergabe/i.test(z.zug) && /^stadt:reiter:/.test(z.zug) && z.hit && !z.aus);
  if (rU) {
    if (!gefunden) {
      gefunden = { jahr: s.jahr, woche: s.woche, n, reiterText: rU.text };
      await seite.screenshot({ path: `${WURZ}/schuesse/uebergabe-reiter.png` });
      schreib({ was: 'uebergabe-reiter-gesehen', ...gefunden });
    }
    await greif(rU.zug, 320);
    const s2 = await schirm();
    const ja = s2.zuege.find(z => z.zug === 'fuhre:uebergabe:ja');
    schreib({ was: 'uebergabe-blatt', jahr: s2.jahr, woche: s2.woche,
      jaDa: !!ja, jaGreifbar: ja ? (ja.hit && !ja.aus) : false, jaText: ja ? ja.text : null,
      zeilen: (await sicht()).filter(t => /(Übergabe|übergeb|Haus steht|führen|Braujahr)/i.test(t)).slice(0, 10) });
    await seite.screenshot({ path: `${WURZ}/schuesse/uebergabe-blatt.png` });
    if (ja && ja.hit && !ja.aus) {
      await greif('fuhre:uebergabe:ja', 900);
      const s3 = await schirm();
      await seite.screenshot({ path: `${WURZ}/schuesse/uebergabe-genommen.png` });
      schreib({ was: 'uebergabe-genommen', jahr: s3.jahr, woche: s3.woche, ende: s3.ende, endgrund: s3.endgrund,
        zeilen: (await sicht()).slice(0, 60) });
      abschluss = { grund: s3.endgrund || 'uebergeben', jahr: s3.jahr, woche: s3.woche };
      break;
    }
  }

  /* Zu Michaeli die Zahlweise verabreden — der Knopf, den niemand erklaert */
  if (s.woche <= 2) { if (await greif('fuhre:ziel:bar', 240)) schreib({ was: 'ziel-verabredet', jahr: s.jahr, woche: s.woche }); }

  /* Wirtschaft: Rohstoff, Plan, Fuhre */
  s = await schirm();
  if (s.rohstoff < 45) {
    const roh = s.zuege.find(z => /kauf:rohstoff/.test(z.zug) && !z.aus);
    if (roh) { if (!roh.hit) { const r = s.zuege.find(z => /^stadt:reiter:fuhre/.test(z.zug) && z.hit && !z.aus); if (r) await greif(r.zug, 200); } await greif('fuhre:kauf:rohstoff', 220); }
  }
  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze < 0.6 && s.rohstoff > 15) {
    const auf = s.zuege.filter(z => !z.aus && z.hit && /^fuhre:tafel-auf:/.test(z.zug));
    if (auf.length) await greif(auf[Math.min(1, auf.length - 1)].zug, 170);
  }
  s = await schirm();
  const nimm = s.zuege.filter(z => z.hit && !z.aus && /^preis:nimm:/.test(z.zug) && z.preis && Math.abs(z.preis) <= s.kasse);
  if (nimm.length) await greif(nimm.reduce((a, z) => Math.abs(z.preis) < Math.abs(a.preis) ? z : a).zug, 280);
  await greif('preis:tafel-zu', 280);
  await greif('fuhre:sommer-zu', 280);
  if (!(await greif('fuhre:wie-vorige', 200))) await greif('fuhre:fuellen', 200);
  await greif('fuhre:abschicken', 280);
  const vor = s.jahr * 100 + s.woche;
  let na = await schirm();
  if (na.jahr * 100 + na.woche === vor) { if (!(await greif('weiter', 300))) { abschluss = { grund: 'WEITER tot', jahr: s.jahr, woche: s.woche }; break; } }
}
const schluss = await schirm();
await seite.screenshot({ path: `${WURZ}/schuesse/gutesende-schluss.png` });
schreib({ was: 'schluss', wochen: n, klicks, jahr: schluss.jahr, woche: schluss.woche,
  kasse: schluss.kasse, ende: schluss.ende, endgrund: schluss.endgrund, lage: schluss.lage, fehler, abschluss,
  zeilen: (await sicht()).slice(0, 80) });
console.log(JSON.stringify({ wochen: n, klicks, jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse,
  ende: schluss.ende, endgrund: schluss.endgrund, gefunden, abschluss, fehler: fehler.length }, null, 1));
await browser.close();
