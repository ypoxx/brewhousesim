/* AUFLAGE R10 — DER REITER UNTER DEM LIEGENDEN BLATT.

   Verfahren wie bei der Aufsicht (`aufsicht/welle13-gegen/reiterprobe.mjs`):
   bis zu einem Michaeli spielen, an dem die Michaelitafel von selbst liegt,
   dann die fremden Reiter der Reihe nach mit ECHTER MAUS greifen — vorher mit
   `elementFromPoint` geprüft, dass unter dem Zeiger auch wirklich dieser
   Reiter liegt — und nach jedem Klick zählen:

     · liegt das Blatt noch?
     · wie viele Züge sind greifbar (Fläche, nicht gesperrt, unter dem Zeiger)?

   Zwischen zwei Reiterklicks wird das Blatt mit dem Griff oben rechts wieder
   aufgeschlagen, damit jeder Reiter unter denselben Bedingungen geprüft wird.

   Vorzustand, von der Aufsicht gemessen (1351/1): vier Klicks, greifbare Züge
   25 → 26 → 26 → 26 → 26, das Blatt blieb jedes Mal liegen.

   HAFEN=8922 node reiterprobe.mjs <epoche> [marke]                          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const MARKE = process.argv[3] || 'reiter';
const HAFEN = process.env.HAFEN || '8922';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/tafel-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);

const schirm = () => seite.evaluate(() => {
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit, x: cx, y: cy,
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40) });
  });
  const t = document.querySelector('.pr-tafel');
  let liegt = false;
  if (t) {
    const zu = t.classList.contains('stadt-zugeklappt') || t.classList.contains('stadt-verdeckt');
    const r = t.getBoundingClientRect();
    const el = document.elementFromPoint(
      Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2)),
      Math.min(innerHeight - 2, Math.max(2, r.top + r.height / 2)));
    liegt = !zu && r.width > 8 && +getComputedStyle(t).opacity > 0.5
      && !!(el && (el === t || t.contains(el)));
  }
  const k = document.querySelector('[data-zug="preis:tafel"]');
  return { jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    ende: !!BRAUHAUS.welt.zeit.ende, lage: BRAUHAUS.lage.length, liegt,
    kText: k ? (k.innerText || '').trim().replace(/\s+/g, ' ') : null,
    tafelknoepfe: zuege.filter(z => z.hit && !z.aus && /^preis:/.test(z.zug)).length,
    greifbar: zuege.filter(z => z.hit && !z.aus).length, zuege };
});
async function klick(z) {
  if (!z || !z.hit || z.aus) return false;
  await seite.mouse.move(z.x, z.y, { steps: 5 });
  await seite.waitForTimeout(40);
  await seite.mouse.down(); await seite.waitForTimeout(65); await seite.mouse.up();
  await seite.waitForTimeout(320);
  return true;
}
const greif = async (m) => { const s = await schirm(); const z = s.zuege.find(x => x.hit && !x.aus && m.test(x.zug)); return z ? klick(z) : false; };

/* bis zu einem Michaeli mit liegender Tafel spielen */
let s = await schirm();
for (let i = 0; i < 90 && !(s.woche === 1 && s.liegt); i++) {
  if (s.ende) break;
  if (s.liegt) await greif(/^preis:tafel-zu$/);
  else { await greif(/^fuhre:wie-vorige$/) || await greif(/^fuhre:fuellen$/); await greif(/^fuhre:abschicken$/); await greif(/^weiter$/); }
  s = await schirm();
}

const reihe = [{ schritt: 'vorher', liegt: s.liegt, greifbar: s.greifbar,
  tafelknoepfe: s.tafelknoepfe, kText: s.kText }];
const gesehen = {};
for (let n = 0; n < 4; n++) {
  s = await schirm();
  if (!s.liegt) {                       /* Blatt wieder aufschlagen */
    await greif(/^preis:tafel$/);
    s = await schirm();
    if (!s.liegt) break;
  }
  const vor = s.greifbar;
  const r = s.zuege.find(z => z.hit && !z.aus && /^stadt:reiter:/.test(z.zug) && !gesehen[z.zug]);
  if (!r) break;
  gesehen[r.zug] = true;
  const trifft = await seite.evaluate(p => {
    const el = document.elementFromPoint(p.x, p.y);
    const b = el && el.closest ? el.closest('[data-zug]') : null;
    return b ? b.getAttribute('data-zug') : null;
  }, { x: r.x, y: r.y });
  await klick(r);
  const n2 = await schirm();
  reihe.push({ schritt: 'klick', reiter: r.zug, text: r.text, unterDemZeiger: trifft,
    wirklichGetroffen: trifft === r.zug,
    greifbarVor: vor, greifbarNach: n2.greifbar, blattWeg: !n2.liegt,
    tafelknoepfeNach: n2.tafelknoepfe, kText: n2.kText });
}

await seite.screenshot({ path: `${WURZ}/schuesse/${MARKE}-e${ep}.png` });
const klicks = reihe.filter(r => r.schritt === 'klick');
const erg = {
  epoche: ep, bei: s.jahr + '/' + s.woche, reiterklicks: klicks.length,
  wirklichGetroffen: klicks.filter(r => r.wirklichGetroffen).length,
  blattWeg: klicks.filter(r => r.blattWeg).length,
  mehrGreifbar: klicks.filter(r => r.greifbarNach > r.greifbarVor).length,
  reihe, seitenfehler: fehler.length, lage: (await schirm()).lage
};
fs.writeFileSync(`${WURZ}/protokoll/${MARKE}-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
