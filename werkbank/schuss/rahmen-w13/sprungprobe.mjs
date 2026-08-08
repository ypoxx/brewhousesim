/* SPRUNGPROBE w13 — R5: ist `B.uhr.springe()` benutzbar?

   Die Frage, die zaehlt, ist nicht „laeuft es durch", sondern:
   IST EIN SPRUNG DASSELBE WIE KLICKEN?  Also wird zweimal gespielt, mit
   derselben Saat, in zwei frischen Kontexten:

     A  dreissigmal WEITER druecken (mit echter Maus, ohne sonst etwas
        anzufassen — die Hand von `gegnerblick.mjs`)
     B  einmal `B.uhr.springeWochen(30)`

   Danach werden Jahr, Woche, Kasse, Rohstoff, Faesser, Chronik, Buch, Zuege
   des Gegners und der Zaehlerstand des Wuerfels verglichen. Ein Sprung, der
   dabei etwas anderes ergibt als das Klicken, ist kein „erzaehltes Jahr",
   sondern ein uebergangenes.

   ZUSAETZLICH die alte Fassung zum Vergleich, mit derselben Hand nachgestellt
   (woche=30 setzen, schliesseJahr rufen) — damit im Bericht steht, WAS der
   Fehler gekostet haette.

   HAFEN=8921 node sprungprobe.mjs <epoche> [wochen]                         */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 30);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';
const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`;

const browser = await chromium.launch();
const fehler = [];

async function frischeSeite() {
  const k = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const s = await k.newPage();
  s.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
  s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  await s.goto(URL, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1200);
  return s;
}

const lesen = (s) => s.evaluate(() => {
  const B = window.BRAUHAUS;
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    rohstoff: B.welt.haus.rohstoff, faesser: B.welt.vorrat.faesser.length,
    chronik: B.welt.chronik.length, buch: B.protokoll.length,
    gegnerzuege: B.welt.gegner.map(g => g.schluessel + ':' + g.zuege).join(','),
    wuerfel: B.wuerfel.zustand, amtszeit: B.welt.zeit.amtszeit.nr,
    verfall: B.protokoll.filter(p => p.wer === 'verfall').length,
    ende: !!B.welt.zeit.ende, lage: B.lage.length
  };
});

/* --- A: klicken ------------------------------------------------------- */
let s = await frischeSeite();
const anfang = await lesen(s);
for (let i = 0; i < N; i++) {
  const l = await s.evaluate(() => {
    const el = document.querySelector('[data-zug="weiter"]'); if (!el || el.disabled) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  if (!l) break;
  await s.mouse.click(l.x, l.y);
  await s.waitForTimeout(260);
}
const A = await lesen(s);
await s.context().close();

/* --- B: springen ------------------------------------------------------ */
s = await frischeSeite();
const sprung = await s.evaluate((n) => window.BRAUHAUS.uhr.springeWochen(n), N);
await s.waitForTimeout(900);
const B1 = await lesen(s);
const standNachSprung = await s.evaluate(() => window.BRAUHAUS.stand.zeile());
await s.context().close();

/* --- C: die ALTE Fassung nachgestellt --------------------------------- */
s = await frischeSeite();
await s.evaluate((n) => {
  const B = window.BRAUHAUS;
  const jahre = Math.ceil(n / B.uhr.WOCHEN_IM_JAHR);
  for (let i = 0; i < jahre && !B.welt.zeit.ende; i++) {
    B.welt.zeit.woche = B.uhr.WOCHEN_IM_JAHR;
    B.uhr.schliesseJahr();
  }
  B.sende('zeichne', { grund: 'sprung-alt' });
}, N);
await s.waitForTimeout(900);
const C = await lesen(s);
await s.context().close();

const felder = ['jahr', 'woche', 'kasse', 'rohstoff', 'faesser', 'chronik', 'buch',
  'gegnerzuege', 'wuerfel', 'amtszeit', 'verfall'];
const abwAB = felder.filter(k => JSON.stringify(A[k]) !== JSON.stringify(B1[k]));
const abwAC = felder.filter(k => JSON.stringify(A[k]) !== JSON.stringify(C[k]));

const erg = {
  epoche: ep, wochen: N, url: URL, fehler,
  anfang, geklickt: A, gesprungen: B1, alteFassung: C,
  rueckgabe: sprung, standNachSprung,
  abweichungSprungGegenKlicken: abwAB,
  abweichungAlteFassungGegenKlicken: abwAC,
  bestanden: abwAB.length === 0 && fehler.length === 0
};
fs.writeFileSync(`${WURZ}/protokoll/sprungprobe-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
