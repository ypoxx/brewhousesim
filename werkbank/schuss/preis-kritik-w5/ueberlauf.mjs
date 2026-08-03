/* LAEUFT IRGENDWO TEXT UEBER SEINEN KASTEN HINAUS?

   HAFEN=8900 node ueberlauf.mjs

   Vier Epochen, drei Aufloesungen. Gemessen wird an jedem Element mit eigenem
   Text:
     * scrollWidth/scrollHeight groesser als clientWidth/clientHeight, ohne
       dass das Element scrollen darf
     * das Rechteck ragt ueber den Bildschirmrand
   Die Michaelitafel wird EINMAL aufgeschlagen, weil dort die langen Saetze
   stehen (`pr-satz-klein`, `pr-regel`, `pr-folge-text`). Bilder werden
   danebengelegt, damit die Stellen nachsehbar sind.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';
const ORT = process.env.ORT || '/home/user/brewhousesim/werkbank/schuss/preis-kritik-w5/bild';
fs.mkdirSync(ORT, { recursive: true });

const MASSE = [[1920, 1080], [1440, 900], [1280, 800]];
const browser = await chromium.launch();
const befund = [];

for (const ep of [1, 2, 3, 4]) {
  for (const [bw, bh] of MASSE) {
    const seite = await browser.newPage({ viewport: { width: bw, height: bh } });
    const fehler = [];
    seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
    seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
    await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
    await seite.waitForTimeout(1200);

    await seite.evaluate(() => {
      const s = document.querySelector('.fu-sommerblatt');
      if (s) { const z = document.querySelector('[data-zug="fuhre:sommer-zu"]'); if (z) z.click(); }
    });
    await seite.waitForTimeout(400);
    await seite.evaluate(() => {
      const el = document.querySelector('[data-zug="preis:tafel"]');
      if (el && !/schließen/.test(el.innerText || '')) el.click();
    });
    await seite.waitForTimeout(700);

    const r = await seite.evaluate(() => {
      const raus = [];
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
        const rr = el.getBoundingClientRect();
        if (!rr.width || !rr.height) return;
        const hatText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!hatText) return;
        const scrollbar = /auto|scroll/.test(cs.overflowX + cs.overflowY);
        const breiter = el.scrollWidth > el.clientWidth + 1;
        const hoeher = el.scrollHeight > el.clientHeight + 1;
        const wo = el.tagName.toLowerCase()
          + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '');
        const zug = el.closest('[data-zug]') ? el.closest('[data-zug]').getAttribute('data-zug') : null;
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70);
        if (!scrollbar && (breiter || hoeher)) {
          raus.push({ art: breiter ? 'breiter als der Kasten' : 'hoeher als der Kasten', wo, zug,
            sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight, text });
        }
        if (rr.right > innerWidth + 1 || rr.left < -1 || rr.bottom > innerHeight + 1) {
          raus.push({ art: 'ueber den Bildschirmrand', wo, zug,
            rect: [Math.round(rr.left), Math.round(rr.top), Math.round(rr.right), Math.round(rr.bottom)],
            fenster: [innerWidth, innerHeight], text });
        }
      });
      return { raus, lage: (BRAUHAUS.lage || []).length,
               koerperBreiter: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    await seite.screenshot({ path: `${ORT}/e${ep}-${bw}x${bh}.png` });
    befund.push({ epoche: ep, breite: bw, hoehe: bh, fehler, ...r });
    console.log(`E${ep} ${bw}x${bh}: ${r.raus.length} Ueberlaeufe, lage=${r.lage}, `
      + `Koerper breiter als Fenster: ${r.koerperBreiter}, Seitenfehler ${fehler.length}`);
    r.raus.slice(0, 8).forEach(x => console.log('    ' + x.art + '  ' + x.wo
      + (x.zug ? ' [' + x.zug + ']' : '') + '  ' + JSON.stringify(x.text)));
    await seite.close();
  }
}
fs.writeFileSync(`${ORT}/../ueberlauf.json`, JSON.stringify(befund, null, 1));
await browser.close();
