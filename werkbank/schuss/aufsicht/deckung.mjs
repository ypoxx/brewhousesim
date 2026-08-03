import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
let ges = 0, mit = 0;
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1200);
  const r = await s.evaluate(() => {
    const z = [...document.querySelectorAll('[data-zug]')];
    const hat = z.filter(x => x.getAttribute('data-soll-aus') !== null);
    const gesperrtOhne = z.filter(x => x.disabled && x.getAttribute('data-soll-aus') === null);
    const praef = {};
    gesperrtOhne.forEach(x => { const p = (x.getAttribute('data-zug')||'').split(':')[0];
      praef[p] = (praef[p]||0)+1; });
    return { n: z.length, hat: hat.length, gesperrtOhne: gesperrtOhne.length, praef };
  });
  ges += r.n; mit += r.hat;
  console.log(`  E${e}: ${r.hat}/${r.n} Zuege tragen data-soll-aus — ${r.gesperrtOhne} gesperrte ohne, davon ${JSON.stringify(r.praef)}`);
  await s.close();
}
await b.close();
console.log(`\n  gesamt: ${mit}/${ges} = ${(100*mit/ges).toFixed(1)} %`);
