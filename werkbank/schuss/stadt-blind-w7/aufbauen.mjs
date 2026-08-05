// Der faire Blindvergleich braucht einen HOF, DER STEHT — das Zielbild zeigt
// einen gehenden Betrieb, die Platte einen leeren Hof mit einer Pfuetze.
// Dieses Skript spielt eine Epoche so lange, bis nichts mehr zu bauen ist oder
// die Wochen alle sind, und nimmt dann auf.
//
//   HAFEN=8903 EPOCHE=3 WOCHEN=260 node …/aufbauen.mjs <bild.png> <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const HAFEN = process.env.HAFEN || '8903';
const EPOCHE = +(process.env.EPOCHE || 1);
const WOCHEN = +(process.env.WOCHEN || 260);
const bild = process.argv[2] || `werkbank/schuss/stadt-blind-w7/voll-e${EPOCHE}.png`;
const ziel = process.argv[3] || `werkbank/schuss/stadt-blind-w7/voll-e${EPOCHE}.json`;

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('' + e));
s.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1500);

let gebaut = 0, gescheitert = 0;
const gekauft = [];
for (let w = 0; w < WOCHEN; w++) {
  const kauf = await s.evaluate(() => {
    const l = [];
    for (const el of document.querySelectorAll('button[data-zug^="stadt:bau:"]')) {
      if (el.disabled) continue;
      if (!/^stadt:bau:[a-z_]+$/.test(el.dataset.zug)) continue;
      const r = el.getBoundingClientRect(); if (r.width < 1) continue;
      l.push(el.dataset.zug);
    }
    return l;
  });
  if (kauf.length) {
    const vor = await s.evaluate(() => document.querySelectorAll('img.stadt-haus').length);
    try { await s.click(`button[data-zug="${kauf[0]}"]`, { timeout: 3000 }); } catch { gescheitert++; }
    await s.waitForTimeout(160);
    const nach = await s.evaluate(() => document.querySelectorAll('img.stadt-haus').length);
    if (nach > vor) { gebaut++; gekauft.push(kauf[0]); }
    else { try { await s.click('[data-zug="weiter"]', { timeout: 3000 }); } catch { gescheitert++; } await s.waitForTimeout(200); }
  } else {
    try { await s.click('[data-zug="weiter"]', { timeout: 3000 }); } catch { gescheitert++; }
    await s.waitForTimeout(200);
  }
}
/* Bretter zuklappen, damit man den Hof sieht — das ist ein Zug, den der
   Spieler auch hat, kein Eingriff ins Spiel. */
try { await s.click('[data-zug="stadt:alles-zuklappen"]', { timeout: 3000, force: true }); } catch { /* */ }
await s.waitForTimeout(900);
const lage = await s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche, epoche: BRAUHAUS.welt.zeit.epoche,
  kasse: BRAUHAUS.welt.haus.kasse, bauten: document.querySelectorAll('img.stadt-haus').length,
  lagefehler: (BRAUHAUS.lage || []).length,
}));
await s.screenshot({ path: bild });
fs.writeFileSync(ziel, JSON.stringify({ epoche: EPOCHE, gebaut, gescheitert, gekauft, lage, fehler: fehler.slice(0, 10) }, null, 1));
console.log(`E${EPOCHE}: ${gebaut} gebaut (${gekauft.join(', ')}) · Ende ${lage.jahr}/${lage.woche} Ep${lage.epoche} Kasse ${lage.kasse} · ${lage.bauten} Bauten · lage ${lage.lagefehler} · Fehler ${fehler.length}`);
await b.close();
