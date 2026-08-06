import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const lies = async (hafen) => {
  const b = await chromium.launch();
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await s.goto(`http://127.0.0.1:${hafen}/spiel/?epoche=1&saat=1350`, { waitUntil: 'load' });
  await s.waitForTimeout(1500);
  const r = await s.evaluate(() =>
    [...document.querySelectorAll('[data-zug]')].map(e => e.getAttribute('data-zug')));
  await b.close(); return r;
};
const A = await lies(8912), B = await lies(8906);
console.log('gleiche Menge:', JSON.stringify([...A].sort()) === JSON.stringify([...B].sort()));
console.log('gleiche REIHENFOLGE:', JSON.stringify(A) === JSON.stringify(B));
for (let i = 0; i < Math.max(A.length, B.length); i++)
  if (A[i] !== B[i]) { console.log(`erste Abweichung an Stelle ${i}:\n   alt ${A[i]}\n   neu ${B[i]}`); break; }
const zeig = a => a.slice(0, 14).map((z,i)=>`${i}:${z}`).join('  ');
console.log('\nalt:', zeig(A)); console.log('neu:', zeig(B));
