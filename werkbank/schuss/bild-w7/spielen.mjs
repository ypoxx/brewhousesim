// Spielt eine Epoche mit echten Mausklicks ~20 Wochen und nimmt danach auf.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = process.argv[2] || '1';
const ziel = process.argv[3];
const wochen = +(process.argv[4] || 20);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
p.on('pageerror', e => fehler.push('pageerror: ' + e));
p.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await p.goto(`http://127.0.0.1:8905/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1200);

const log = [];
async function klickeMaus(el, was) {
  try {
    const bb = await el.boundingBox();
    if (!bb) return false;
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.mouse.down(); await p.waitForTimeout(40); await p.mouse.up();
    await p.waitForTimeout(220);
    log.push(was); if(process.env.LAUT) console.error('  · '+was);
    return true;
  } catch (e) { return false; }
}

// BAUHOF-Reiter oeffnen
async function bauhof() {
  const r = p.locator('button.stadt-seite', { hasText: 'BAUHOF' }).first();
  if (await r.count()) { try { await r.click({ timeout: 2000 }); } catch {} await p.waitForTimeout(200); }
}

// Alle bezahlbaren Hofbauten kaufen
async function kaufen() {
  await bauhof();
  const leiste = p.locator('.stadt-lade button.knopf, #ebene-kopf .knopf');
  // gezielter: Knoepfe in der untersten Leiste (y > 1440 bei 1536? nein: y~1453)
  const alle = await p.locator('button.knopf:not([disabled])').all();
  for (const el of alle) {
    const bb = await el.boundingBox().catch(() => null);
    if (!bb) continue;
    if (bb.y < 1430 || bb.y > 1520) continue;   // nur die Bauhof-Zeile
    const t = (await el.textContent().catch(() => '') || '').trim().replace(/\s+/g, ' ');
    const dis = await el.evaluate(e => e.disabled || e.classList.contains('gesperrt') || e.classList.contains('aus') || getComputedStyle(e).pointerEvents === 'none').catch(() => true);
    if (dis) continue;
    await klickeMaus(el, 'KAUF ' + t);
  }
}

async function weiter() {
  const w = p.locator('button.gross', { hasText: 'WEITER' }).first();
  if (!(await w.count())) return false;
  return await klickeMaus(w, 'WEITER');
}

await kaufen();
for (let i = 0; i < wochen; i++) {
  const ok = await weiter();
  if (!ok) { log.push('WEITER nicht gefunden bei Woche ' + i); break; }
  await p.waitForTimeout(260);
  if (i % 4 === 3) await kaufen();
}
await kaufen();
await p.waitForTimeout(400);
// Blaetter/Overlays, die den Blick versperren, NICHT schliessen — das Bild soll zeigen, was da ist.
await p.waitForTimeout(600);
await p.screenshot({ path: ziel });
const kopf = await p.evaluate(() => (document.querySelector('#ebene-kopf')?.innerText || '').replace(/\s+/g, ' ').slice(0, 300));
await b.close();
console.log(ziel);
console.log('KOPF: ' + kopf);
console.log('KLICKS: ' + log.length);
console.log(log.join('\n'));
console.log(fehler.length ? 'FEHLER:\n' + fehler.slice(0,10).join('\n') : 'keine Fehler');
