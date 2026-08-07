/* WIEDERKEHR — kann man eine Partie unterbrechen und fortsetzen?
   Spielt ein paar Wochen, laedt dieselbe URL neu, sieht nach.
   HAFEN=8911 node wiederkehr.mjs <epoche>                                    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const ep = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8911';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12';
const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const stand = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
           faesser: B.welt.vorrat.faesser.length, chronik: (B.welt.chronik || []).length,
           protokoll: (B.protokoll || []).length,
           speicher: { local: Object.keys(localStorage || {}), session: Object.keys(sessionStorage || {}) },
           cookies: document.cookie.length, idb: typeof indexedDB !== 'undefined' };
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

const vorher0 = await stand();
for (let i = 0; i < 12; i++) {
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

const erg = { epoche: ep, url: URL, anfang: vorher0, nachSpielen: gespielt, nachNeuladen: nachher,
  fortgesetzt: nachher.jahr === gespielt.jahr && nachher.woche === gespielt.woche && nachher.kasse === gespielt.kasse };
fs.writeFileSync(`${WURZ}/protokoll/wiederkehr-e${ep}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
