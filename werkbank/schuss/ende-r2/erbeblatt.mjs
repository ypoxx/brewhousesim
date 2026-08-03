/* Auflage 5 (gehoert DEM ERBE, hier nur gemessen): was verdeckt das grosse
   ERBE-Blatt? Gemessen wird nicht am Rechteck allein, sondern an dem, was
   die Maus danach noch trifft. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, STAND, AUS } from './messe.mjs';
const browser = await chromium.launch();
const erg = {};
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  /* ein paar Wochen, damit Keller und Haeuser gefuellt sind */
  for (let i = 0; i < 8; i++) { const w = await seite.$('[data-zug="weiter"]');
    if (w && !(await w.isDisabled())) { await w.click(); await seite.waitForTimeout(30); } }
  const mess = () => {
    const B = window.BRAUHAUS;
    const buehne = document.getElementById('buehne').getBoundingClientRect();
    const blatt = document.querySelector('.erb-buch, [data-reiter="Das Erbe"], #fach-blatt-erbe .blatt');
    const br = blatt ? blatt.getBoundingClientRect() : null;
    const bretter = {};
    document.querySelectorAll('#fach-hand-fuhre .fu-brett, .fu-brett').forEach(b => {
      const kopf = b.querySelector('h2, h3, b');
      const r = b.getBoundingClientRect();
      bretter[(kopf ? kopf.textContent : b.className).trim().slice(0, 24)] =
        [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
    });
    let laden = 0, ladenFrei = 0, ladenDecker = {};
    document.querySelectorAll('[data-zug^="fuhre:laden:"]').forEach(el => {
      laden++;
      const r = el.getBoundingClientRect();
      if (r.width < 2) return;
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (t && (t === el || el.contains(t))) ladenFrei++;
      else if (t) { const k = (t.closest('.blatt') || t).className || t.tagName;
        ladenDecker[k] = (ladenDecker[k] || 0) + 1; }
    });
    return { blattDa: !!blatt, blattKlasse: blatt ? blatt.className : null,
      blattRect: br ? [Math.round(br.x), Math.round(br.y), Math.round(br.width), Math.round(br.height)] : null,
      anteilBuehne: br ? +( (br.width * br.height) / (buehne.width * buehne.height) * 100 ).toFixed(1) : 0,
      bretter, laden, ladenFrei, ladenDecker };
  };
  const zu = await seite.evaluate(mess);
  const r = await seite.$('[data-zug="stadt:reiter:erbe-blatt-erb-buch"]');
  if (r) { await r.click(); await seite.waitForTimeout(200); }
  const auf = await seite.evaluate(mess);
  await seite.screenshot({ path: `${AUS}erbeblatt-e${ep}.png` });
  erg['e' + ep] = { zu, auf, fehler };
  console.log(`E${ep} Blatt ${auf.anteilBuehne}% der Buehne, rect ${JSON.stringify(auf.blattRect)}`
    + ` | fuhre:laden ${auf.ladenFrei}/${auf.laden} treffbar (zu: ${zu.ladenFrei}/${zu.laden})`
    + ` | Decker ${JSON.stringify(auf.ladenDecker)}`);
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}erbeblatt.json`, JSON.stringify(erg, null, 1));
