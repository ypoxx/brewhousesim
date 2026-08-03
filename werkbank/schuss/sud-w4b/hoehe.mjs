// hoehe.mjs — Passt alles auf den Kesselzettel, oder schneidet ihn die
// Deckelung ab? Misst scrollHeight gegen clientHeight und jeden Knopf einzeln.
//
//   node hoehe.mjs <hafen>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8914);
const browser = await chromium.launch();
for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (x) => fehler.push(String(x).slice(0, 200)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 200)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1400);
  const r = await seite.evaluate(() => {
    const z = document.querySelector('.sud-zettel');
    if (!z) return null;
    const bue = document.getElementById('buehne');
    const br = bue.getBoundingClientRect();
    const zr = z.getBoundingClientRect();
    return {
      scroll: z.scrollHeight, client: z.clientHeight,
      ueber: z.scrollHeight - z.clientHeight,
      flaeche: +(100 * (zr.width * zr.height) / (br.width * br.height)).toFixed(3),
      knoepfe: [...z.querySelectorAll('button[data-zug]')].map((k) => {
        const q = k.getBoundingClientRect();
        return k.getAttribute('data-zug') + ' h=' + Math.round(q.height)
          + ' unten=' + Math.round(zr.bottom - q.bottom);
      })
    };
  });
  console.log('EPOCHE ' + e + '  scroll ' + r.scroll + ' / sichtbar ' + r.client
    + '  ueberstand ' + r.ueber + ' px   Flaeche ' + r.flaeche + ' %  Fehler ' + fehler.length);
  r.knoepfe.forEach((k) => console.log('     ' + k));
  await seite.close();
}
await browser.close();
