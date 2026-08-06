import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const lies = async (hafen) => {
  const b = await chromium.launch();
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await s.goto(`http://127.0.0.1:${hafen}/spiel/?epoche=1&saat=1350`, { waitUntil: 'load' });
  await s.waitForTimeout(1500);
  const r = await s.evaluate(() => {
    const alle = [...document.querySelectorAll('[data-zug]')].map(e => e.getAttribute('data-zug'));
    const f = m => alle.filter(z => m.test(z));
    return { auf: f(/^fuhre:tafel-auf:/), ab: f(/^fuhre:tafel-ab:/),
             fest: f(/^preis:festlege:/), nimm: f(/^preis:nimm:/) };
  });
  await b.close(); return r;
};
const A = await lies(8912), B = await lies(8906);
for (const k of ['auf','ab','fest','nimm']) {
  const gleich = JSON.stringify(A[k]) === JSON.stringify(B[k]);
  console.log(`${k.padEnd(5)} ${gleich ? 'GLEICHE Reihenfolge' : 'ANDERE Reihenfolge'}`);
  console.log(`      alt: ${A[k].join(' | ') || '—'}`);
  console.log(`      neu: ${B[k].join(' | ') || '—'}`);
}
