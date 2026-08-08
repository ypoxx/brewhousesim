/* DER GEGENZUG — die Abnahme der Auflage R15 (Welle 13).

   Frage, wörtlich aus WELLE-13.md: „über 100 Wochen darf es höchstens 10
   Wochen geben, in denen KEIN Zug gegen den Gegner bezahlbar ist."

   BEZAHLBAR heißt hier genau das, was der Brief sagt, und nichts Weicheres:
     * der Knopf hat eine Fläche (width>0, height>0),
     * seine Mitte liegt im Sichtfeld,
     * er ist NICHT abgeschaltet (`disabled`),
     * `document.elementFromPoint` auf seiner Mitte trifft ihn oder ein Kind,
     * und der Preis am Knopf (`data-preis`) ist nicht größer als die Kasse
       DERSELBEN Woche. Ein Knopf ohne `data-preis` kostet kein Geld — dann
       trägt ihn jede Kasse (was er sonst kostet, entscheidet `disabled`).

   DIE HAND KLAPPT NICHTS AUF. Sie spielt wie der blinde Kritiker in §4b:
   „Wie vorige Woche" / „Nach Durst füllen", „FUHRE ABSCHICKEN", „WEITER" —
   kein Reiter, kein Brett. Alles, was gezählt wird, stand also im Bild, ohne
   dass jemand danach gesucht hat. Das ist die härtere Lesart der Abnahme.

   Gelesen wird IMMER AM ANFANG der Woche, vor dem ersten eigenen Handgriff.

   HAFEN=8924 node gegenzug.mjs <epoche> <wochen> [ausgabe.json]
   Umgebung: BREITE/HOEHE (Vorgabe 1600x900, das Fenster des Kritikers),
             SAAT (Vorgabe 1350), KLICKE=1 lässt die Hand den billigsten
             bezahlbaren Gegenzug auch wirklich drücken.                     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 100);
const HAFEN = process.env.HAFEN || '8924';
const SAAT = process.env.SAAT || '1350';
const BREITE = +(process.env.BREITE || 1600);
const HOEHE = +(process.env.HOEHE || 900);
const KLICKE = process.env.KLICKE === '1';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/gegenzug-w13';
const ZIEL = process.argv[4] || `${WURZ}/protokoll/gegenzug-e${ep}${KLICKE ? '-klick' : ''}.json`;

/* Was als „Zug gegen den Gegner" zählt. Bewusst eng: `gegner:blatt`,
   `gegner:zeige:*` und die Reiter sind Ansichtssachen, keine Züge. */
const GEGENZUG = /^gegner:(abloesen|abloesen-blatt|zuvorkommen|abwehren|hinhalten|hinhalten-blatt|beschwerde|beschwerde-bild|gebot|mitbieten)(:|$)/;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const lese = () => seite.evaluate((muster) => {
  const B = window.BRAUHAUS;
  const re = new RegExp(muster);
  const kasse = B.welt.haus.kasse;
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const zug = el.getAttribute('data-zug') || '';
    if (!re.test(zug)) return;
    const r = el.getBoundingClientRect();
    const flaeche = !!(r.width && r.height);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const imBild = flaeche && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight;
    let hit = false;
    if (imBild) { const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t))); }
    const roh = el.getAttribute('data-preis');
    const preis = roh === null ? null : Math.abs(+roh);
    zuege.push({ zug, flaeche, imBild, hit, aus: !!el.disabled, preis,
      fass: el.getAttribute('data-fass') ? +el.getAttribute('data-fass') : null,
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
  });
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse, faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
    ansehen: B.welt.haus.ansehen, lage: B.lage.length,
    gegnerzuege: (B.welt.gegner[0] || {}).zuege || 0,
    /* Wie viele Adressen haelt er, und wie reich ist er? Damit sich nachzaehlen
       laesst, ob der neue Gegenzug ihn abraeumt (WELLE 13, R15). */
    seineAdressen: B.welt.adressen.filter(function (a) {
      return a.bindung && a.bindung.wem !== 'haus'; }).length,
    meineAdressen: B.welt.adressen.filter(function (a) {
      return a.bindung && a.bindung.wem === 'haus'; }).length,
    seineKasse: (B.welt.gegner[0] || {}).kasse || 0,
    zuege
  };
}, GEGENZUG.source);

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (!(cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)) return null;
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
let gedrueckt = 0;
for (let i = 0; i < N; i++) {
  const s = await lese();
  if (s.ende) break;
  const greifbar = s.zuege.filter(z => z.flaeche && z.imBild && z.hit && !z.aus);
  const bezahlbar = greifbar.filter(z => z.preis === null || z.preis <= s.kasse);
  reihe.push({ n: i + 1, jahr: s.jahr, woche: s.woche, kasse: s.kasse,
    faesser: s.faesser, plaetze: s.plaetze, gegnerzuege: s.gegnerzuege,
    seineAdressen: s.seineAdressen, meineAdressen: s.meineAdressen,
    seineKasse: s.seineKasse,
    gefunden: s.zuege.length, greifbar: greifbar.length, bezahlbar: bezahlbar.length,
    billigst: bezahlbar.length ? Math.min(...bezahlbar.map(z => z.preis === null ? 0 : z.preis)) : null,
    wege: bezahlbar.map(z => z.zug),
    verhindert: greifbar.length ? null : s.zuege.map(z => z.zug + (z.aus ? '·aus' : '') + (z.hit ? '' : '·verdeckt')).slice(0, 8),
    zuteuer: bezahlbar.length ? null : greifbar.map(z => z.zug + ' ' + z.preis).slice(0, 8) });

  if (KLICKE && bezahlbar.length) {
    const b = bezahlbar.slice().sort((a, c) => (a.preis === null ? 0 : a.preis) - (c.preis === null ? 0 : c.preis))[0];
    if (await klick(b.zug)) gedrueckt++;
  }

  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}

await seite.screenshot({ path: `${WURZ}/schuesse/gegenzug-e${ep}${KLICKE ? '-klick' : ''}.png` });

const ohne = reihe.filter(r => r.bezahlbar === 0);
const erg = {
  epoche: ep, saat: SAAT, fenster: BREITE + 'x' + HOEHE, klickt: KLICKE,
  wochen: reihe.length,
  wochenOhneBezahlbarenGegenzug: ohne.length,
  wochenOhneGreifbarenGegenzug: reihe.filter(r => r.greifbar === 0).length,
  medianBezahlbar: (() => { const v = reihe.map(r => r.bezahlbar).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : null; })(),
  medianKasse: (() => { const v = reihe.map(r => r.kasse).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : null; })(),
  medianFaesser: (() => { const v = reihe.map(r => r.faesser).sort((a, b) => a - b); return v.length ? v[v.length >> 1] : null; })(),
  gegnerzuege: reihe.length ? reihe[reihe.length - 1].gegnerzuege - reihe[0].gegnerzuege : 0,
  seineAdressenAnfang: reihe.length ? reihe[0].seineAdressen : null,
  seineAdressenEnde: reihe.length ? reihe[reihe.length - 1].seineAdressen : null,
  meineAdressenEnde: reihe.length ? reihe[reihe.length - 1].meineAdressen : null,
  seineKasseAnfang: reihe.length ? reihe[0].seineKasse : null,
  seineKasseEnde: reihe.length ? reihe[reihe.length - 1].seineKasse : null,
  gedrueckt,
  seitenfehler: fehler.length, fehler: fehler.slice(0, 5),
  leereWochen: ohne.slice(0, 20).map(r => ({ n: r.n, jahr: r.jahr, woche: r.woche, kasse: r.kasse,
    faesser: r.faesser, greifbar: r.greifbar, zuteuer: r.zuteuer, verhindert: r.verhindert }))
};
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ ...erg, reihe }, null, 1));
console.log(JSON.stringify(erg, null, 1).slice(0, 4000));
await browser.close();
