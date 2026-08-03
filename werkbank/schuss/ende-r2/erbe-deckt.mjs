/* Auflage 5, sauber isoliert (gehoert DEM ERBE — hier nur die Zahl):
   erst DIE HAEUSER und DER KELLER aufschlagen, dann messen; danach das
   ERBE-Blatt dazu aufschlagen und nochmals messen. Nur der Unterschied
   zwischen beiden Messungen gehoert dem Erbe-Blatt. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, AUS } from './messe.mjs';
const browser = await chromium.launch();
const erg = {};
const MESS = () => {
  const zaehl = (wahl) => { let n = 0, frei = 0, deck = {};
    document.querySelectorAll(wahl).forEach(el => {
      if (el.disabled) return; n++;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      const t = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
      if (t && (t === el || el.contains(t))) frei++;
      else { const k = t ? ((t.closest('.blatt')||{}).className || (t.closest('.fach')||{}).id || t.className) : 'nichts';
             deck[k] = (deck[k]||0)+1; } });
    return { n, frei, deck }; };
  const buehne = document.getElementById('buehne').getBoundingClientRect();
  const erb = document.querySelector('.erb-buch');
  const er = erb ? erb.getBoundingClientRect() : null;
  const br = {};
  ['fu-haeuser','fu-keller','fu-wagen'].forEach(k => {
    const b = document.querySelector('.' + k); if (!b) return;
    const r = b.getBoundingClientRect();
    br[k] = { klasse: b.className, rect: [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)] };
  });
  return { laden: zaehl('[data-zug^="fuhre:laden:"]'), probe: zaehl('[data-zug^="fuhre:probe:"]'),
    fahre: zaehl('[data-zug^="fuhre:fahre"], [data-zug="fuhre:abfahrt"]'),
    erb: er ? { klasse: erb.className,
      rect: [Math.round(er.x),Math.round(er.y),Math.round(er.width),Math.round(er.height)],
      anteil: +((er.width*er.height)/(buehne.width*buehne.height)*100).toFixed(1) } : null,
    bretter: br, buehne: [Math.round(buehne.width), Math.round(buehne.height)] };
};
for (const ep of [1,2,3,4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  for (let i = 0; i < 6; i++) { const w = await seite.$('[data-zug="weiter"]');
    if (w && !(await w.isDisabled())) { await w.click(); await seite.waitForTimeout(30); } }
  const klick = async (z) => { const el = await seite.$(`[data-zug="${z}"]`);
    if (el) { try { await el.click({ timeout: 700 }); } catch {} await seite.waitForTimeout(150); } };
  await klick('stadt:reiter:fuhre-fu-brett-fu-haeuser');
  await klick('stadt:reiter:fuhre-fu-brett-fu-keller');
  const ohne = await seite.evaluate(MESS);
  await seite.screenshot({ path: `${AUS}erbe-ohne-e${ep}.png` });
  await klick('stadt:reiter:erbe-blatt-erb-buch');
  const mit = await seite.evaluate(MESS);
  await seite.screenshot({ path: `${AUS}erbe-mit-e${ep}.png` });
  erg['e'+ep] = { ohne, mit, fehler };
  console.log(`E${ep} Buehne ${ohne.buehne}  ERBE-Blatt ${JSON.stringify(mit.erb && mit.erb.rect)} = ${mit.erb && mit.erb.anteil}%`);
  console.log(`   fuhre:laden treffbar  ohne Erbe-Blatt ${ohne.laden.frei}/${ohne.laden.n}   mit ${mit.laden.frei}/${mit.laden.n}  Decker ${JSON.stringify(mit.laden.deck)}`);
  console.log(`   fuhre:probe treffbar  ohne ${ohne.probe.frei}/${ohne.probe.n}   mit ${mit.probe.frei}/${mit.probe.n}`);
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}erbe-deckt.json`, JSON.stringify(erg, null, 1));
