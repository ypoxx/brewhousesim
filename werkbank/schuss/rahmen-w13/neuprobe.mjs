/* NEUPROBE w13 — R2: `?neu=1` startet frisch und schreibt nichts.

   DIE ABNAHME, WOERTLICH: dreimal `?epoche=1&saat=1350&neu=1` hintereinander
   im SELBEN Browserkontext ergibt dieselbe Pruefsumme, und `localStorage` ist
   danach leer.

   Das „im selben Kontext" ist der ganze Punkt. Playwright oeffnet je Lauf
   sonst einen frischen Kontext mit leerem Speicher — die messende Hand ist
   dadurch von sich aus geschuetzt, aber das ist ein gluecklicher Umstand und
   kein Entwurf (WELLE-13.md, Entscheidung ②). Hier wird EIN Kontext geoeffnet
   und dreimal dieselbe Adresse geladen; ohne `?neu=1` traegt der zweite Lauf
   den Stand des ersten und spielt eine andere Partie.

   Deshalb laeuft die Probe zweimal:
     mit `&neu=1`   -> drei gleiche Pruefsummen, Speicher leer   (die Abnahme)
     ohne `&neu=1`  -> Lauf 2 und 3 setzen fort                  (der Gegenbeweis,
                       dass die Gefahr echt ist und der Schalter noetig)

   HAFEN=8921 node neuprobe.mjs <epoche> [wochen]                            */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import crypto from 'crypto';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 30);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';

const browser = await chromium.launch();
/* EIN Kontext fuer alles — er behaelt seinen localStorage ueber alle Laeufe. */
const kontext = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const seite = await kontext.newPage();
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

const ablesen = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
    faesser: B.welt.vorrat.faesser.length, chronik: B.welt.chronik.length,
    buch: B.protokoll.length, wuerfel: B.wuerfel.zustand,
    gebunden: B.welt.adressen.map(a => (a.bindung ? a.bindung.wem : '-')).join('')
  };
});

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`); if (!el) return null;
    const r = el.getBoundingClientRect(); if (!r.width) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, aus: !!el.disabled };
  }, zug);
  if (!l || l.aus) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(60); await seite.mouse.up();
  await seite.waitForTimeout(320);
  return true;
}

async function lauf(url) {
  await seite.goto(url, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1200);
  const reihe = [];
  reihe.push(await ablesen());
  for (let i = 0; i < WOCHEN; i++) {
    if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
    await klick('fuhre:abschicken');
    await klick('weiter');
    reihe.push(await ablesen());
  }
  const speicher = await seite.evaluate(() => Object.keys(localStorage || {}));
  const modus = await seite.evaluate(() => window.BRAUHAUS.stand.modus());
  const bericht = await seite.evaluate(() => window.BRAUHAUS.stand.bericht());
  const lage = await seite.evaluate(() => window.BRAUHAUS.lage.map(l => l.text.slice(0, 90)));
  return {
    pruefsumme: crypto.createHash('sha256').update(JSON.stringify(reihe)).digest('hex').slice(0, 16),
    anfang: reihe[0], schluss: reihe[reihe.length - 1],
    speicher, modus, lage,
    geschrieben: bericht.zahl.geschrieben, zeichen: bericht.zahl.zeichen
  };
}

const mitNeu = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`;
const ohneNeu = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

const A = [];
for (let n = 0; n < 3; n++) A.push(await lauf(mitNeu));

/* Der Gegenbeweis: derselbe Kontext, dieselbe Adresse, aber ohne den Schalter. */
const B2 = [];
for (let n = 0; n < 3; n++) B2.push(await lauf(ohneNeu));

/* Und zum Schluss noch einmal mit `neu=1`: raeumt es den Speicher, den die
   drei Laeufe ohne Schalter hinterlassen haben? */
const C = await lauf(mitNeu);

const erg = {
  epoche: ep, wochen: WOCHEN, fehler,
  mitNeu: {
    pruefsummen: A.map(a => a.pruefsumme),
    einePruefsumme: new Set(A.map(a => a.pruefsumme)).size === 1,
    speicherLeer: A.every(a => a.speicher.length === 0),
    speicher: A.map(a => a.speicher),
    modus: A.map(a => a.modus),
    geschrieben: A.map(a => a.geschrieben),
    schluss: A.map(a => `${a.schluss.jahr}/${a.schluss.woche} Kasse ${a.schluss.kasse}`)
  },
  ohneNeu: {
    pruefsummen: B2.map(a => a.pruefsumme),
    einePruefsumme: new Set(B2.map(a => a.pruefsumme)).size === 1,
    speicher: B2.map(a => a.speicher),
    anfang: B2.map(a => `${a.anfang.jahr}/${a.anfang.woche} Kasse ${a.anfang.kasse}`),
    schluss: B2.map(a => `${a.schluss.jahr}/${a.schluss.woche} Kasse ${a.schluss.kasse}`),
    zeichen: B2.map(a => a.zeichen)
  },
  raeumtNach: { speicher: C.speicher, pruefsumme: C.pruefsumme,
                gleichWieLaufEins: C.pruefsumme === A[0].pruefsumme },
  lage: A.concat(B2).concat([C]).map(a => a.lage.length)
};
erg.bestanden = erg.mitNeu.einePruefsumme && erg.mitNeu.speicherLeer
  && erg.raeumtNach.speicher.length === 0 && erg.raeumtNach.gleichWieLaufEins
  && fehler.length === 0;

fs.writeFileSync(`${WURZ}/protokoll/neuprobe-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
