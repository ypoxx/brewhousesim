/* WIEDERKEHR w13 — R1: zwoelf Wochen spielen, neu laden, Ziffer fuer Ziffer vergleichen.
   Nachbau von werkbank/schuss/spiel-w12/wiederkehr.mjs (dem Geraet, an dem der
   blinde Kritiker §6 gemessen hat), Zeile fuer Zeile derselbe Ablauf und
   dieselbe Hand — geaendert ist nur:
     * der Hafen kommt aus der Umgebung (eigener Hafen, ZUSTAENDIGKEIT 16),
     * es wird ZUSAETZLICH abgelesen, was Welle 13 verspricht: der Schluessel
       im Speicher, die Zeile "fortgesetzt · JJJJ/WW" im Kopf, der Knopf
       "Neue Partie", der Zaehlerstand des Wuerfels und die Lage,
     * es wird nach dem Neuladen ein zweites Mal WEITER gedrueckt, damit man
       sieht, dass die fortgesetzte Partie auch WEITERLAEUFT und nicht nur
       huebsch aussieht.

   HAFEN=8921 node wiederkehr.mjs <epoche> [wochen]                          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 12);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';
const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const stand = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const f = document.querySelector('[data-fortgesetzt]');
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
    faesser: B.welt.vorrat.faesser.length, chronik: (B.welt.chronik || []).length,
    protokoll: (B.protokoll || []).length,
    amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
    amtsname: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.name : null,
    gebunden: B.welt.adressen.map(a => a.schluessel + ':' + (a.bindung ? a.bindung.wem : '-')).join(','),
    gegnerzuege: B.welt.gegner.map(g => g.schluessel + ':' + g.zuege).join(','),
    wuerfel: B.wuerfel.zustand, saat: B.wuerfel.saat,
    letzteChronik: (B.welt.chronik || []).slice(-1).map(c => c.jahr + '/' + c.woche + ' ' + c.text.slice(0, 60))[0] || null,
    letztesBuch: (B.protokoll || []).slice(-1).map(p => p.nr + ' ' + p.was.slice(0, 50) + ' ' + p.preis)[0] || null,
    lage: B.lage.length,
    lageTexte: B.lage.map(l => l.text.slice(0, 90)),
    speicher: Object.keys(localStorage || {}),
    standZeile: B.stand.zeile(),
    fortgesetztImKopf: f ? f.getAttribute('data-fortgesetzt') : null,
    fortgesetztText: f ? f.textContent : null,
    neuKnopf: !!document.querySelector('[data-zug="kern:neu"]')
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

const anfang = await stand();
for (let i = 0; i < WOCHEN; i++) {
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
const gespielt = await stand();
await seite.screenshot({ path: `${WURZ}/schuesse/wiederkehr-e${ep}-vor-neuladen.png` });

await seite.reload({ waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);
const nachher = await stand();
await seite.screenshot({ path: `${WURZ}/schuesse/wiederkehr-e${ep}-nach-neuladen.png` });

/* Laeuft die fortgesetzte Partie auch weiter? */
await klick('weiter');
const weiter = await stand();

const felder = ['jahr', 'woche', 'kasse', 'rohstoff', 'ansehen', 'faesser', 'chronik',
  'protokoll', 'amtszeit', 'amtsname', 'gebunden', 'gegnerzuege', 'wuerfel',
  'letzteChronik', 'letztesBuch'];
const abweichung = felder.filter(k => JSON.stringify(gespielt[k]) !== JSON.stringify(nachher[k]));

const erg = {
  epoche: ep, url: URL, wochen: WOCHEN, fehler,
  anfang, nachSpielen: gespielt, nachNeuladen: nachher, nachEinemWeiterenWeiter: weiter,
  abweichung,
  bestanden: abweichung.length === 0 && !!nachher.fortgesetztImKopf && fehler.length === 0,
  laeuftWeiter: weiter.woche !== nachher.woche || weiter.jahr !== nachher.jahr
};
fs.writeFileSync(`${WURZ}/protokoll/wiederkehr-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify({
  epoche: ep, wochen: WOCHEN,
  anfang: [anfang.jahr + '/' + anfang.woche, anfang.kasse, anfang.faesser, anfang.chronik, anfang.protokoll],
  nachSpielen: [gespielt.jahr + '/' + gespielt.woche, gespielt.kasse, gespielt.faesser, gespielt.chronik, gespielt.protokoll],
  nachNeuladen: [nachher.jahr + '/' + nachher.woche, nachher.kasse, nachher.faesser, nachher.chronik, nachher.protokoll],
  abweichung, fortgesetzt: nachher.fortgesetztText, neuKnopf: nachher.neuKnopf,
  speicher: nachher.speicher, laeuftWeiter: erg.laeuftWeiter,
  lage: nachher.lage, lageTexte: nachher.lageTexte, fehler
}, null, 1));
await browser.close();
