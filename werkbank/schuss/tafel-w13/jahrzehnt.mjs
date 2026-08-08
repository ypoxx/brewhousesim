/* ZEHN BRAUJAHRE — die Abnahme von R7 und R10.

   WARUM NICHT `blick.mjs` MIT ZEHN JAHREN: eine Hand, die NIE ein Brett
   aufschlaegt, liefert nie ein Fass, und der Rat entzieht ihr in allen vier
   Epochen im vierten Braujahr das Braurecht (gemessen: 1353/13, 1603/13,
   1887/11, 1973/9). Zehn Braujahre sind so nicht zu spielen — das ist eine
   Eigenschaft des Spiels, nicht der Tafel.

   Also: diese Hand haelt das Haus am Leben und darf dafuer Reiter anfassen —
   ABER NIE IN WOCHE 1. Am Michaelistag ruehrt sie keinen Reiter, keinen
   Griff, nichts: sie liest nur ab, ob die Tafel von selbst vor ihr liegt,
   und legt sie dann mit dem Knopf der Tafel selbst („Das Jahr beginnen")
   weg. Damit misst sie genau, was R7 verlangt.

   Dazu die Probe zu R10: in Woche 1 wird, wenn die Tafel liegt, ZUERST ein
   fremder Reiter angeklickt und nachgezaehlt, ob das Blatt daraufhin
   verschwindet und ob dahinter mehr greifbare Zuege stehen als davor.

   HAFEN=8922 node jahrzehnt.mjs <epoche> <braujahre> [marke]                */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const JAHRE = +(process.argv[3] || 10);
const MARKE = process.argv[4] || 'jahrzehnt';
const HAFEN = process.env.HAFEN || '8922';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/tafel-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);

const schirm = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit,
      preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
      x: cx, y: cy, text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
  });
  const t = document.querySelector('.pr-tafel');
  let tafelDa = false, klar = null;
  if (t) {
    const zu = t.classList.contains('stadt-zugeklappt') || t.classList.contains('stadt-verdeckt');
    const r = t.getBoundingClientRect();
    klar = +getComputedStyle(t).opacity;
    const el = document.elementFromPoint(
      Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2)),
      Math.min(innerHeight - 2, Math.max(2, r.top + r.height / 2)));
    tafelDa = !zu && r.width > 8 && r.height > 8 && klar > 0.5 && !!(el && (el === t || t.contains(el)));
  }
  const k = document.querySelector('[data-zug="preis:tafel"]');
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse: Math.round(B.welt.haus.kasse), rohstoff: B.welt.haus.rohstoff,
    faesser: B.welt.vorrat.faesser.length, tafelDa, klar, lage: B.lage.length,
    kText: k ? (k.innerText || '').trim().replace(/\s+/g, ' ') : null,
    greifbar: zuege.filter(z => z.hit && !z.aus).length, zuege };
});

async function klick(z) {
  if (!z || !z.hit || z.aus) return false;
  await seite.mouse.move(z.x, z.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(230);
  return true;
}
async function greif(muster, s) {
  const z = (s || await schirm()).zuege.find(x => x.hit && !x.aus && muster.test(x.zug));
  return z ? await klick(z) : false;
}

const michaeli = [];      /* je Braujahr: lag die Tafel von selbst? */
const r10 = [];           /* je Probe: greifbare Zuege vor/nach dem Reiterklick */
let klicks = 0, reiterInWoche1 = 0, luegt = 0, abgelesen = 0;
const startJahr = (await schirm()).jahr;
let jahrGemerkt = null;

for (let i = 0; i < JAHRE * 34 + 60; i++) {
  let s = await schirm();
  if (s.ende) break;
  abgelesen++;
  if (!s.tafelDa && /schließen/i.test(s.kText || '')) luegt++;
  if (s.tafelDa && !/schließen/i.test(s.kText || '')) luegt++;

  /* ---- MICHAELI: keine Hand am Reiter, nur ablesen -------------------- */
  if (s.woche === 1 && s.jahr !== jahrGemerkt) {
    jahrGemerkt = s.jahr;
    michaeli.push({ jahr: s.jahr, vonSelbst: s.tafelDa, kText: s.kText, klar: s.klar });

    if (s.tafelDa) {
      /* R10 — ein fremder Reiter unter liegendem Blatt. */
      const reiter = s.zuege.find(z => z.hit && !z.aus && /^stadt:reiter:/.test(z.zug));
      if (reiter) {
        const vor = s.greifbar;
        await klick(reiter); klicks++; reiterInWoche1++;
        const n = await schirm();
        r10.push({ jahr: s.jahr, reiter: reiter.zug, text: reiter.text,
          greifbarVor: vor, greifbarNach: n.greifbar, blattWeg: !n.tafelDa,
          kText: n.kText });
        s = n;
      }
    }
    if (s.tafelDa) { await greif(/^preis:tafel-zu$/, s); klicks++; s = await schirm(); }
  }

  /* ---- am Leben bleiben. Reiter nur ausserhalb von Woche 1. ----------- */
  const darfReiter = s.woche !== 1;
  if (await greif(/^fuhre:sommer-zu$/, s)) { klicks++; s = await schirm(); }
  if (darfReiter) {
    for (const muster of [/^fuhre:wie-vorige$/, /^fuhre:fuellen$/, /^fuhre:abschicken$/]) {
      let z = s.zuege.find(x => x.hit && !x.aus && muster.test(x.zug));
      if (!z) {
        const rr = s.zuege.filter(x => x.hit && !x.aus && /^stadt:reiter:fuhre/.test(x.zug));
        for (const r of rr) { await klick(r); klicks++; s = await schirm();
          z = s.zuege.find(x => x.hit && !x.aus && muster.test(x.zug)); if (z) break; }
      }
      if (z) { await klick(z); klicks++; s = await schirm(); }
    }
    if (s.rohstoff < 45) {
      const roh = s.zuege.find(x => x.hit && !x.aus && /kauf:rohstoff/.test(x.zug)
        && x.preis && Math.abs(x.preis) <= s.kasse);
      if (roh) { await klick(roh); klicks++; s = await schirm(); }
      else {
        const rr = s.zuege.filter(x => x.hit && !x.aus && /^stadt:reiter:sud/.test(x.zug));
        for (const r of rr) { await klick(r); klicks++; s = await schirm();
          const r2 = s.zuege.find(x => x.hit && !x.aus && /kauf:rohstoff/.test(x.zug)
            && x.preis && Math.abs(x.preis) <= s.kasse);
          if (r2) { await klick(r2); klicks++; s = await schirm(); break; } }
      }
    }
    const sud = s.zuege.find(x => x.hit && !x.aus && /^sud:(sud-an|sudpfanne|anstellen|brauen)/.test(x.zug));
    if (sud) { await klick(sud); klicks++; s = await schirm(); }
  }

  const w = s.zuege.find(x => x.zug === 'weiter' && x.hit && !x.aus);
  if (w) { await klick(w); klicks++; }
  const n2 = await schirm();
  if (n2.jahr - startJahr >= JAHRE) break;
}

await seite.screenshot({ path: `${WURZ}/schuesse/${MARKE}-e${ep}.png` });
const s = await schirm();
const erg = {
  epoche: ep, marke: MARKE, startJahr, endeBei: s.jahr + '/' + s.woche, ende: s.ende,
  braujahreMitMichaeli: michaeli.length,
  tafelVonSelbst: michaeli.filter(m => m.vonSelbst).length,
  michaeli,
  r10Proben: r10.length,
  r10BlattWeg: r10.filter(x => x.blattWeg).length,
  r10MehrZuege: r10.filter(x => x.greifbarNach > x.greifbarVor).length,
  r10,
  abgeleseneZustaende: abgelesen, knopfLuegt: luegt, klicks,
  reiterklicksInWoche1: reiterInWoche1 - r10.length < 0 ? 0 : reiterInWoche1 - r10.length,
  seitenfehler: fehler.length, lage: s.lage, fehlerTexte: fehler.slice(0, 5)
};
fs.writeFileSync(`${WURZ}/protokoll/${MARKE}-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1).slice(0, 6000));
await browser.close();
