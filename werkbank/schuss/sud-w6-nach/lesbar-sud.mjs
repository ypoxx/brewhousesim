/* LESBARKEIT, aber nur was DEM SUD gehoert — vierte Latte, MESSLATTE.md §4.
   Das gemeinsame Geraet `aufsicht/lesbarkeit.mjs` misst die ganze Buehne und
   sagt nicht, wem ein Fund gehoert; an `stil/grund.css` (dem `--s`, aus dem
   die kleinen Schriften ueberhaupt erst entstehen) arbeitet in dieser Welle
   ein anderer Builder, und die Datei wird hier nicht angefasst.

   Dieses Geraet steht daneben und misst nur `.sud-*`: einmal mit
   zugeklapptem Brett (Vorgabestand) und einmal AUFGESCHLAGEN — sonst faellt
   das ganze Brett aus der Messung, und das ist die Flaeche, auf der dieses
   Stueck seine Entscheidungen zeigt.

     HAFEN=8951 BREITE=1366 HOEHE=768 node lesbar-sud.mjs                   */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8951';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const b = await chromium.launch();

const messen = () => ({
  klein: [], // gefuellt in evaluate
});

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);

  const lies = () => s.evaluate(() => {
    const meins = (el) => !!(el.closest && el.closest('[data-stueck="sud"], .sud-brett, .sud-zettel'));
    const alle = [...document.querySelectorAll('*')].filter(meins);
    const schrift = {}, ueber = [];
    let kleinste = 999;
    alle.forEach(el => {
      const c = getComputedStyle(el);
      if (el.children.length === 0 && (el.textContent || '').trim()) {
        const px = Math.round(parseFloat(c.fontSize) * 10) / 10;
        schrift[px] = (schrift[px] || 0) + 1;
        if (px < kleinste) kleinste = px;
      }
      if (c.overflow === 'hidden' || c.overflowY === 'hidden' || c.display === '-webkit-box') {
        if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
          ueber.push({ k: String(el.className).slice(0, 40),
            fehlt: Math.max(el.scrollHeight - el.clientHeight, el.scrollWidth - el.clientWidth) });
        }
      }
    });
    const kn = [...document.querySelectorAll('button[data-zug^="sud:"]')];
    const aktiv = kn.filter(x => !x.disabled);
    const masse = aktiv.map(x => { const r = x.getBoundingClientRect(); return { z: x.getAttribute('data-zug'),
      w: Math.round(r.width), h: Math.round(r.height) }; }).filter(m => m.w > 0 && m.h > 0);
    const zuKlein = masse.filter(m => m.w < 24 || m.h < 24);
    return {
      knoepfe: kn.length, aktiv: aktiv.length, imBild: masse.length,
      zuKlein, kleinsteKnopfHoehe: masse.length ? Math.min(...masse.map(m => m.h)) : null,
      kleinsteSchrift: kleinste === 999 ? null : kleinste,
      unter12: Object.entries(schrift).filter(([px]) => +px < 12).reduce((s, [, n]) => s + n, 0),
      schrift: Object.entries(schrift).sort((a, c) => a[0] - c[0]).slice(0, 5),
      ueber: ueber.slice(0, 10), ueberN: ueber.length
    };
  });

  const zu = await lies();
  await s.evaluate(() => { const x = document.querySelector('[data-zug="stadt:reiter:sud-sud-brett"]'); x && x.click(); });
  await s.waitForTimeout(900);
  const auf = await lies();

  for (const [wie, r] of [['Brett zugeklappt', zu], ['Brett AUFGESCHLAGEN', auf]]) {
    console.log(`  E${e} ${wie.padEnd(20)} kleinste Schrift ${r.kleinsteSchrift} px · `
      + `${r.unter12} Textknoten unter 12 px · ${r.zuKlein.length}/${r.imBild} aktive sud-Knoepfe unter 24 px `
      + `(kleinste Hoehe ${r.kleinsteKnopfHoehe} px) · ${r.ueberN} abgeschnittene Kaesten`);
    if (r.zuKlein.length) console.log(`       zu klein: ${r.zuKlein.map(m => `${m.z} ${m.w}×${m.h}`).join(' · ')}`);
    if (r.ueberN) console.log(`       abgeschnitten: ${r.ueber.map(u => `${u.k} (+${u.fehlt}px)`).join(' · ')}`);
    console.log(`       Schriftgroessen: ${r.schrift.map(([px, n]) => `${px}px×${n}`).join('  ')}`);
  }
  await s.close();
}
await b.close();
