/* NEUE PARTIE w13 — R1, der zweite Teil: „Ein Knopf ‚Neue Partie' verwirft
   ihn nach Rückfrage."

   Gespielt wird mit echter Maus, wie der Kritiker: ein paar Wochen, dann
   `kern:neu`, dann wird geprueft, ob die Rueckfrage wirklich dasteht (zwei
   echte Knoepfe, kein Browserdialog), dann `kern:neu:nein` (die Partie muss
   unveraendert weiterlaufen), dann noch einmal `kern:neu` und `kern:neu:ja`.

   Danach muss gelten: der Speicher ist leer, die Partie steht wieder am
   Anfang, und die Zeile „fortgesetzt · …" ist fort.

   HAFEN=8921 node neuepartie.mjs <epoche>                                   */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';
const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
const dialoge = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
/* Ein Browserdialog waere ein Fehlschlag: die messende Hand weist ihn ab,
   und der Knopf taete nichts. Er wird deshalb gezaehlt, nicht bedient. */
seite.on('dialog', d => { dialoge.push(d.type() + ': ' + d.message()); d.dismiss(); });

await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const lesen = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const f = document.querySelector('[data-fortgesetzt]');
  const da = (z) => !!document.querySelector(`[data-zug="${z}"]`);
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
    speicher: Object.keys(localStorage || {}),
    fortgesetzt: f ? f.textContent : null,
    knopfNeu: da('kern:neu'), frageJa: da('kern:neu:ja'), frageNein: da('kern:neu:nein'),
    frageText: [...document.querySelectorAll('.neu-frage div')].map(d => d.textContent).slice(0, 2),
    lage: B.lage.length, stand: B.stand.zeile()
  };
});

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`); if (!el || el.disabled) return null;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, hit: !!(t && (t === el || el.contains(t))) };
  }, zug);
  if (!l || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(60); await seite.mouse.up();
  await seite.waitForTimeout(420);
  return true;
}

const schritte = {};
schritte.amAnfang = await lesen();

for (let i = 0; i < 6; i++) {
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
schritte.nachSechsRunden = await lesen();

schritte.knopfGedrueckt = await klick('kern:neu');
schritte.mitRueckfrage = await lesen();
await seite.screenshot({ path: `${WURZ}/schuesse/neuepartie-e${ep}-rueckfrage.png` });

schritte.neinGedrueckt = await klick('kern:neu:nein');
schritte.nachNein = await lesen();

await klick('kern:neu');
schritte.jaGedrueckt = await klick('kern:neu:ja');
await seite.waitForLoadState('networkidle');
await seite.waitForTimeout(1400);
schritte.nachJa = await lesen();
await seite.screenshot({ path: `${WURZ}/schuesse/neuepartie-e${ep}-danach.png` });

const erg = {
  epoche: ep, url: URL, fehler, browserdialoge: dialoge, schritte,
  bestanden:
    schritte.knopfGedrueckt === true &&
    schritte.mitRueckfrage.frageJa && schritte.mitRueckfrage.frageNein &&
    dialoge.length === 0 &&
    schritte.nachNein.jahr === schritte.mitRueckfrage.jahr &&
    schritte.nachNein.woche === schritte.mitRueckfrage.woche &&
    schritte.nachNein.kasse === schritte.mitRueckfrage.kasse &&
    !schritte.nachNein.frageJa &&
    schritte.nachJa.speicher.length === 0 &&
    schritte.nachJa.woche === schritte.amAnfang.woche &&
    schritte.nachJa.kasse === schritte.amAnfang.kasse &&
    schritte.nachJa.fortgesetzt === null &&
    fehler.length === 0
};
fs.writeFileSync(`${WURZ}/protokoll/neuepartie-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
