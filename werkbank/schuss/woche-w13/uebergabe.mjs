/* DIE ABNAHME ZU R12 — „1350 bis 1355 spielen, OHNE einen einzigen Reiter
   anzufassen; das Angebot muss auffallen."

   Diese Hand faehrt die Woche ausschliesslich ueber die Wochenkarte
   (`fuhre:plan:*`, `fuhre:sprung`) und ueber WEITER. Sie fasst KEINEN Reiter
   an — `stadt:reiter:*` steht auf keiner Liste — und schlaegt kein Brett auf.
   Sie hoert nicht auf zu spielen, wenn das Angebot kommt; sie schreibt nur
   mit, ob und wo es im Bild stand.

   Gemessen je Woche:
     · liegt `Z.uebergabe` (BRAUHAUS.fuhre.stand().uebergabe)?
     · steht „ÜBERGABE" irgendwo als SICHTBARER Text im Fenster?
     · steht ein greifbarer Knopf dazu da (fuhre:uebergabe-auf,
       fuhre:uebergabe:ja, fuhre:sommer-uebergabe)?
     · in welchem Bauteil — Wochenkarte, Georgi-Blatt, aufgeschlagenes Blatt?

   HAFEN=8923 node uebergabe.mjs <epoche> <bis-jahr>                        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const BIS = +(process.argv[3] || 1356);
const HAFEN = process.env.HAFEN || '8923';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/woche-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);

const lese = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const f = B.fuhre ? B.fuhre.stand() : {};
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit,
      wo: el.closest('.fu-woche') ? 'wochenkarte'
        : el.closest('.fu-sommerblatt') ? 'georgiblatt'
        : el.closest('.fu-uebergabe') ? 'uebergabeblatt'
        : el.closest('.stadt-reiterzeile') ? 'reiterzeile' : 'sonst',
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
  });
  const txt = [];
  document.querySelectorAll('body *').forEach(e => {
    if (e.children.length) return;
    const t = (e.textContent || '').trim(); if (!t) return;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
    txt.push(t.replace(/\s+/g, ' ').slice(0, 140));
  });
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse: B.welt.haus.kasse, uebergabe: f.uebergabe || null, lage: B.lage.length,
    zuege, uebergabeText: txt.filter(t => /ÜBERGABE|Übergabe|übergeben/.test(t)) };
});

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(230);
  return true;
}

await klick('kern:anfangen');
const reihe = [];
let n = 0, reiterKlicks = 0;
while (n++ < 900) {
  const s = await lese();
  if (s.ende) break;
  const knoepfe = s.zuege.filter(z => z.hit && !z.aus &&
    /^fuhre:(uebergabe-auf|uebergabe:ja|sommer-uebergabe)$/.test(z.zug));
  reihe.push({ n, jahr: s.jahr, woche: s.woche, liegt: s.uebergabe,
    imText: s.uebergabeText.length, textBeispiel: s.uebergabeText.slice(0, 3),
    knoepfe: knoepfe.map(z => ({ zug: z.zug, wo: z.wo, text: z.text })) });
  if (s.jahr > BIS) break;
  /* Der Reiter wird NICHT angefasst. Nur die Wochenkarte und WEITER. */
  const plaene = s.zuege.filter(z => z.hit && !z.aus && /^fuhre:plan:/.test(z.zug));
  const sprung = s.zuege.find(z => z.hit && !z.aus && z.zug === 'fuhre:sprung');
  let getan = false;
  if (await klick('fuhre:sommer-zu')) getan = true;
  else if (sprung) getan = await klick(sprung.zug);
  else if (plaene.length) getan = await klick(plaene[0].zug);
  const vor = s.jahr * 100 + s.woche;
  const jetzt = await lese();
  if (jetzt.jahr * 100 + jetzt.woche === vor) { if (!(await klick('weiter'))) break; }
}

const mitAngebot = reihe.filter(r => r.liegt);
const mitKnopf = mitAngebot.filter(r => r.knoepfe.length);
const mitText = mitAngebot.filter(r => r.imText > 0);
const orte = {};
mitAngebot.forEach(r => r.knoepfe.forEach(k => { orte[k.wo] = (orte[k.wo] || 0) + 1; }));
const erg = { epoche: ep, wochenGespielt: reihe.length, reiterKlicks,
  letztesJahr: reihe.length ? reihe[reihe.length - 1].jahr : null,
  wochenMitAngebot: mitAngebot.length,
  davonMitGreifbaremKnopf: mitKnopf.length,
  davonMitSichtbaremText: mitText.length,
  orteDerKnoepfe: orte,
  ersteWoche: mitAngebot[0] || null,
  fehler };
fs.writeFileSync(`${WURZ}/protokoll/uebergabe-e${ep}.json`, JSON.stringify({ ...erg, reihe }, null, 1));
await seite.screenshot({ path: `${WURZ}/schuesse/uebergabe-e${ep}.png` });
console.log(JSON.stringify(erg, null, 1));
await browser.close();
