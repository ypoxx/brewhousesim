// Ist das Siegel "unwiderruflich" auch nach Wochen noch keins?
// node siegel.mjs <epoche> <kauf> <zurueck> <wochenDazwischen>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2]); const KAUF = process.argv[3]; const ZUR = process.argv[4]; const W = +(process.argv[5] || 4);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=4242`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1000);
const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.width < 3) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80), aktiv: !el.disabled, getroffen: !!(t && (t === el || el.contains(t))), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  });
  return { kn, kasse: (document.querySelectorAll('.wert')[1] || {}).innerText, marke: ((document.querySelector('.fach-marken-sud') || {}).innerText || '').replace(/\n/g, ' / ') };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp(); await s.waitForTimeout(600);
let z = await lies();
let k = z.kn.find((x) => x.zug === KAUF && x.aktiv && x.getroffen);
if (!k) { console.log('KAUF nicht klickbar'); process.exit(0); }
await s.mouse.click(k.x, k.y); await s.waitForTimeout(300);
let n = await lies();
console.log(`gekauft "${k.text}"  kasse ${z.kasse} => ${n.kasse}`);
for (let w = 0; w < W; w++) {
  z = await lies();
  const fu = z.kn.find(x => x.zug === 'fuhre:fuellen' && x.aktiv && x.getroffen); if (fu) { await s.mouse.click(fu.x, fu.y); await s.waitForTimeout(60); }
  z = await lies();
  const ab = z.kn.find(x => (x.zug === 'fuhre:abschicken' || x.zug === 'weiter') && x.aktiv && x.getroffen);
  if (ab) { await s.mouse.click(ab.x, ab.y); await s.waitForTimeout(220); }
  await klapp();
}
z = await lies();
const zk = z.kn.find((x) => x.zug === ZUR);
console.log(`nach ${W} Wochen: ${ZUR} aktiv=${zk && zk.aktiv} getroffen=${zk && zk.getroffen} "${zk && zk.text}"`);
if (zk && zk.aktiv && zk.getroffen) {
  await s.mouse.click(zk.x, zk.y); await s.waitForTimeout(300);
  n = await lies();
  console.log(`  zurückgeklickt: kasse ${z.kasse} => ${n.kasse}`);
  console.log(`  marke: ${n.marke}`);
}
await b.close();
