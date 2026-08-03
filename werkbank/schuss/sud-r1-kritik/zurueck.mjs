// Ist "unwiderruflich" am Schirm wirklich unwiderruflich? Kaufen, dann zurückklicken.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const KAUF = process.argv[3];
const ZURUECK = process.argv[4];
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=4242`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);
const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.width < 3) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80), aktiv: !el.disabled, getroffen: !!(t && (t === el || el.contains(t))), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  });
  const txt = (sel) => { const e = document.querySelector(sel); return e ? (e.innerText || '').trim().replace(/\n+/g, ' / ') : null; };
  return { kasse: (document.querySelectorAll('.wert')[1] || {}).innerText, marke: txt('.fach-marken-sud'), buch: txt('[class*="sud-buch"]'), kn };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp();
let z = await lies();
console.log('START kasse', z.kasse, '|', z.marke);
for (const zug of [KAUF, ZURUECK, KAUF]) {
  z = await lies();
  const k = z.kn.find((x) => x.zug === zug);
  if (!k || !k.aktiv || !k.getroffen) { console.log('  ->', zug, 'NICHT KLICKBAR', JSON.stringify(k && { aktiv: k.aktiv, getroffen: k.getroffen, text: k.text })); continue; }
  await s.mouse.click(k.x, k.y); await s.waitForTimeout(300);
  const n = await lies();
  console.log('  ->', zug, '"' + k.text + '"  kasse', z.kasse, '=>', n.kasse, '|', n.marke);
  console.log('     sudbuch:', n.buch);
}
await b.close();
