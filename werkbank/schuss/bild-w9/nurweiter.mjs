/* NUR WEITER — der Spieler, der nichts tut als weiterklicken.
     HAFEN=8907 node werkbank/schuss/bild-w9/nurweiter.mjs <epoche> <wochen>
   Aufnahme nach n Klicks, dazu die Liste der grossen offenen Kaesten.       */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const W = 2752, H = 1536;
const ZIEL = 'werkbank/schuss/bild-w9/bilder';

const b = await chromium.launch();
for (const [E, N] of process.argv.slice(2).map(s => s.split(':')).map(([e, n]) => [e, +(n || 30)])) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < N; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(900);
  await s.screenshot({ path: `${ZIEL}/e${E}-w${N}-nurweiter.png` });
  const gross = await s.evaluate(() => {
    const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
    const out = [];
    document.querySelectorAll('#buehne *').forEach(el => {
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') return;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < 90000) return;
      const a = rgba(c.backgroundColor);
      if (!(a !== null && a > 0.35) && !/gradient/.test(c.backgroundImage || '')) return;
      if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) return;
      out.push(`${String(Math.round(r.width * r.height)).padStart(8)} px2  ` +
        `${String(Math.round(r.x)).padStart(5)},${String(Math.round(r.y)).padStart(5)} ` +
        `${String(Math.round(r.width)).padStart(5)}x${String(Math.round(r.height)).padStart(4)}  ` +
        `${c.backgroundColor.padEnd(22)} ${(el.className || '').toString().slice(0, 60)}`);
    });
    return out.sort((x, y) => parseInt(y) - parseInt(x)).slice(0, 14);
  });
  console.log(`=== E${E} nach ${N}x WEITER ===`);
  gross.forEach(z => console.log('  ' + z));
  await s.close();
}
await b.close();
