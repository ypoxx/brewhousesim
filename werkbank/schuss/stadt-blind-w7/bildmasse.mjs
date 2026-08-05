// Misst, in welcher Groesse die Hofbilder wirklich auf den Schirm kommen —
// nur so laesst sich sagen, ob ein Kompressionsfehler ueberhaupt sichtbar
// werden KANN oder beim Verkleinern verschwindet.
//
//   node werkbank/schuss/stadt-blind-w7/bildmasse.mjs <breite> <hoehe> <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const [B = '2752', H = '1536', ziel = 'werkbank/schuss/stadt-blind-w7/bildmasse.json'] = process.argv.slice(2);
const browser = await chromium.launch();
const alles = {};
for (const ep of [1, 2, 3, 4]) {
  const s = await browser.newPage({ viewport: { width: +B, height: +H }, deviceScaleFactor: 1 });
  await s.goto(`http://127.0.0.1:8903/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle', timeout: 60000 });
  await s.waitForTimeout(2500);
  alles['e' + ep] = await s.evaluate(() => {
    const out = [];
    document.querySelectorAll('img').forEach((i) => {
      const r = i.getBoundingClientRect();
      if (r.width < 2) return;
      out.push({
        src: i.currentSrc.split('/').slice(-2).join('/'),
        nat: [i.naturalWidth, i.naturalHeight],
        auf: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10],
        faktor: Math.round((r.width / i.naturalWidth) * 1000) / 1000,
        opac: getComputedStyle(i).opacity,
      });
    });
    return out;
  });
  await s.close();
}
fs.writeFileSync(ziel, JSON.stringify(alles, null, 1));
for (const [k, v] of Object.entries(alles)) {
  const hof = v.filter((x) => x.src.startsWith('hof/'));
  const f = hof.map((x) => x.faktor).sort((a, b) => a - b);
  console.log(k, 'Bilder', v.length, '| Hofbilder', hof.length,
    '| Faktor min', f[0], 'median', f[(f.length / 2) | 0], 'max', f[f.length - 1]);
}
await browser.close();
