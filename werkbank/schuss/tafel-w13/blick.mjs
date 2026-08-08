/* BLICK AUF DIE JAHRESTAFEL — R6 und R7, gemessen wie ein Spieler misst.

   Spielt Braujahre, OHNE einen einzigen Reiter (`stadt:reiter:*`) anzufassen.
   Erlaubt sind nur: „Wie vorige Woche" / „Nach Durst füllen", „FUHRE
   ABSCHICKEN", „WEITER" — und, wenn die Michaelitafel wirklich vor dem
   Spieler liegt, ihr eigener Knopf „Das Jahr beginnen".

   Gemessen je abgelesenem Zustand:
     · liegt die Tafel WIRKLICH da (Rechteck > 8x8, nicht zugeklappt,
       nicht verdeckt, Mittelpunkt trifft sie mit elementFromPoint)?
     · was steht auf dem Knopf `preis:tafel`?
     · luegt der Knopf (Aufschrift „schließen" ohne liegende Tafel, oder
       Aufschrift „Michaelitafel … Angebote" bei liegender Tafel)?

   HAFEN=8922 node blick.mjs <epoche> <braujahre>                            */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const JAHRE = +(process.argv[3] || 10);
const MARKE = process.argv[4] || 'blick';
const HAFEN = process.env.HAFEN || '8922';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/tafel-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);

const lese = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const sicht = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return false;
    if (r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    return true;
  };
  const t = document.querySelector('.pr-tafel');
  let tafelDa = false, tafelFlaeche = 0, getroffen = false, zugeklappt = false;
  let deckung = null, klar = null;
  if (t) {
    zugeklappt = t.classList.contains('stadt-zugeklappt') || t.classList.contains('stadt-verdeckt');
    const cs = getComputedStyle(t);
    deckung = cs.clipPath; klar = +cs.opacity;
    const r = t.getBoundingClientRect();
    tafelFlaeche = Math.round((r.width * r.height) / (innerWidth * innerHeight) * 1000) / 10;
    const el = document.elementFromPoint(
      Math.min(innerWidth - 2, Math.max(2, r.left + r.width / 2)),
      Math.min(innerHeight - 2, Math.max(2, r.top + r.height / 2)));
    getroffen = !!(el && (el === t || t.contains(el)));
    /* „Lag wirklich da" heisst: Flaeche, nicht weggeschnitten, unter dem
       Zeiger, und sichtbar (opacity > 0,5 — eine halbe Aufblende zaehlt
       nicht als Blatt). */
    tafelDa = sicht(t) && !zugeklappt && getroffen && klar > 0.5;
  }
  const k = document.querySelector('[data-zug="preis:tafel"]');
  const kText = k ? (k.innerText || '').trim().replace(/\s+/g, ' ') : null;
  const zu = document.querySelector('[data-zug="preis:tafel-zu"]');
  let zuGreifbar = false;
  if (zu && sicht(zu) && !zu.disabled) {
    const r = zu.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    zuGreifbar = !!(el && (el === zu || zu.contains(el)));
  }
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: Math.round(B.welt.haus.kasse),
    tafelImDom: !!t, tafelDa, zugeklappt, tafelFlaeche, getroffen, klar, deckung,
    kText, zuGreifbar, lage: B.lage.length
  };
});

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return null;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(240);
  return true;
}

const reihe = [];
const jahreMitTafel = new Set();
const michaeliTage = new Set();      /* Braujahre, deren Woche 1 wir erlebt haben */
const jahreGesehen = new Set();
let klicks = 0, reiterklicks = 0, nr = 0;
const startJahr = await seite.evaluate(() => window.BRAUHAUS.welt.zeit.jahr);

/* Nach JEDEM Klick nachsehen — sonst misst die Probe nur jede vierte Lage
   und uebersieht eine Tafel, die zwischen zwei Klicks aufschlaegt. */
async function nachsehen(grund) {
  const s = await lese();
  jahreGesehen.add(s.jahr);
  if (s.woche === 1) michaeliTage.add(s.jahr);
  const luegtZu = !s.tafelDa && /schließen|schliessen/i.test(s.kText || '');
  const luegtAuf = s.tafelDa && !/schließen|schliessen/i.test(s.kText || '');
  reihe.push({ n: ++nr, grund, ...s, luegtZu, luegtAuf });
  if (s.tafelDa) jahreMitTafel.add(s.jahr);
  return s;
}

for (let w = 0; w < JAHRE * 30 + 40; w++) {
  let s = await nachsehen('woche');
  if (s.tafelDa && s.zuGreifbar) {           /* nur der Tafelknopf, kein Reiter */
    if (await klick('preis:tafel-zu')) klicks++;
    continue;
  }
  if (await klick('fuhre:wie-vorige')) { klicks++; s = await nachsehen('nach-wie-vorige'); }
  else if (await klick('fuhre:fuellen')) { klicks++; s = await nachsehen('nach-fuellen'); }
  if (s.tafelDa && s.zuGreifbar) { if (await klick('preis:tafel-zu')) klicks++; continue; }
  if (await klick('fuhre:abschicken')) { klicks++; s = await nachsehen('nach-abschicken'); }
  if (s.tafelDa && s.zuGreifbar) { if (await klick('preis:tafel-zu')) klicks++; continue; }
  if (await klick('weiter')) { klicks++; s = await nachsehen('nach-weiter'); }
  if (s.tafelDa && s.zuGreifbar) { if (await klick('preis:tafel-zu')) klicks++; continue; }
  const j = await seite.evaluate(() => window.BRAUHAUS.welt.zeit.jahr);
  if (j - startJahr >= JAHRE) break;
  if (await seite.evaluate(() => !!window.BRAUHAUS.welt.zeit.ende)) break;
}

await seite.screenshot({ path: `${WURZ}/schuesse/${MARKE}-e${ep}.png` });

const abgelesen = reihe.length;
const erg = {
  epoche: ep, marke: MARKE, startJahr, braujahre: [...jahreGesehen].length,
  abgeleseneZustaende: abgelesen, klicks, reiterklicks,
  michaeliTageErlebt: [...michaeliTage].sort(),
  michaeliTageErlebtN: michaeliTage.size,
  jahreMitLiegenderTafel: [...jahreMitTafel].sort(),
  jahreMitLiegenderTafelN: jahreMitTafel.size,
  zustaendeMitLiegenderTafel: reihe.filter(r => r.tafelDa).length,
  knopfLuegtOhneTafel: reihe.filter(r => r.luegtZu).length,
  knopfLuegtMitTafel: reihe.filter(r => r.luegtAuf).length,
  knopfEhrlich: reihe.filter(r => !r.luegtZu && !r.luegtAuf).length,
  aufschriften: [...new Set(reihe.map(r => r.kText))].slice(0, 24),
  seitenfehler: fehler.length, lage: reihe.length ? reihe[reihe.length - 1].lage : -1,
  fehlerTexte: fehler.slice(0, 6)
};
fs.writeFileSync(`${WURZ}/protokoll/${MARKE}-e${ep}.json`, JSON.stringify({ ...erg, reihe }, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
