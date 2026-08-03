// Fahrer: fuehrt eine Liste von Aktionen mit echter Maus aus und protokolliert
// nach jedem Schritt den Bildschirmzustand.
//   node fahrer.mjs <epoche> <saat> <planDatei.json> <markenname>
// Plan: [ {klick:"name:blatt"}, {schuss:"a"}, {weiter:5}, {dump:1} ... ]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';

const [ep, saat, planDatei, marke] = process.argv.slice(2);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const plan = JSON.parse(readFileSync(planDatei, 'utf8'));

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1000);

const zustand = () => seite.evaluate(() => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
    const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05);
  };
  const knoepfe = [...document.querySelectorAll('[data-zug]')].filter(sichtbar).map(el => {
    const r = el.getBoundingClientRect();
    const mid = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return {
      zug: el.getAttribute('data-zug'),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 110),
      kl: el.className,
      aus: el.disabled === true || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('aus') || el.classList.contains('gesperrt'),
      preis: el.getAttribute('data-preis'),
      frei: el.closest('[data-frei]')?.getAttribute('data-frei') ?? el.getAttribute('data-frei'),
      oben: mid === el || el.contains(mid),
    };
  });
  const W = window.BRAUHAUS && BRAUHAUS.welt;
  return {
    jahr: W?.zeit?.jahr, woche: W?.zeit?.woche, epoche: W?.zeit?.epoche,
    kasse: W?.haus?.kasse, rohstoff: W?.haus?.rohstoff, ansehen: W?.haus?.ansehen,
    faesser: W?.vorrat?.faesser?.length,
    knoepfe,
    kopf: (document.querySelector('#ebene-kopf')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 1500),
    blatt: (document.querySelector('#ebene-blatt')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 3000),
  };
});

const log = [];
for (const [i, a] of plan.entries()) {
  try {
    if (a.klick) {
      const sel = a.klick.startsWith('.') || a.klick.startsWith('#') ? a.klick : `[data-zug="${a.klick}"]`;
      const el = seite.locator(sel).first();
      await el.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
      await el.click({ timeout: 5000, force: !!a.force });
      await seite.waitForTimeout(a.warte || 450);
    }
    if (a.weiter) {
      for (let k = 0; k < a.weiter; k++) {
        await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 });
        await seite.waitForTimeout(a.warte || 260);
      }
    }
    if (a.schuss) await seite.screenshot({ path: `${out}/${marke}-${a.schuss}.png` });
    if (a.dump) {
      const z = await zustand();
      log.push({ schritt: i, marke: a.dump, ...z });
    }
  } catch (e) {
    log.push({ schritt: i, fehlerbeiAktion: String(e).slice(0, 300), aktion: a });
  }
}

console.log(JSON.stringify(log, null, 1));
console.log('SEITENFEHLER:', fehler.length ? fehler.join('\n') : 'keine');
await browser.close();
