// Behauptung am Schirm: "Anzeige 11 % je Woche". Passiert das je?
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const ZUG = process.argv[3] || 'sud:wuerze:sack';
const W = +(process.argv[4] || 40);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=4242`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);
const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.width < 3) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70), aktiv: !el.disabled, getroffen: !!(t && (t === el || el.contains(t))), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  });
  const B = window.BRAUHAUS;
  return { kn, marke: (document.querySelector('.fach-marken-sud') || {}).innerText || '', chronik: (B.welt.chronik || []).map((c) => (c.text || c.was || JSON.stringify(c)).slice(0, 120)) };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp();
await s.waitForTimeout(700);
let z = await lies();
let k = z.kn.find((x) => x.zug === ZUG && x.aktiv && x.getroffen);
if (!k) { console.log('nicht klickbar'); } else { await s.mouse.click(k.x, k.y); await s.waitForTimeout(250); console.log('geklickt:', k.text); }
let alt = (await lies()).chronik.length;
for (let w = 0; w < W; w++) {
  z = await lies();
  const f = (g) => z.kn.find(x => x.zug === g && x.aktiv && x.getroffen);
  // Verfahren jede Woche wieder auf das heimliche setzen, falls es umgeschaltet wurde
  const wieder = z.kn.find((x) => x.zug === ZUG && x.aktiv && x.getroffen);
  if (wieder && !new RegExp(wieder.text.split(' ')[0]).test(z.marke.split('\n')[1] || '')) { }
  const fu = f('fuhre:fuellen'); if (fu) { await s.mouse.click(fu.x, fu.y); await s.waitForTimeout(50); }
  z = await lies();
  const ab = z.kn.find(x => x.zug === 'fuhre:abschicken' && x.aktiv && x.getroffen) || z.kn.find(x => x.zug === 'weiter' && x.aktiv && x.getroffen);
  if (ab) { await s.mouse.click(ab.x, ab.y); await s.waitForTimeout(200); }
  else {
    z = await lies();
    const so = z.kn.find(x => x.zug === 'fuhre:sommer-zu' && x.aktiv && x.getroffen);
    if (so) { await s.mouse.click(so.x, so.y); await s.waitForTimeout(200); }
    const wt = (await lies()).kn.find(x => x.zug === 'weiter' && x.aktiv && x.getroffen);
    if (wt) { await s.mouse.click(wt.x, wt.y); await s.waitForTimeout(200); }
  }
  await klapp();
  const n = await lies();
  if (n.chronik.length > alt) { n.chronik.slice(alt).forEach((c) => console.log(`  w${w}: ${c}`)); alt = n.chronik.length; }
}
const e = await lies();
console.log('SUD-MARKE am Ende:', e.marke.replace(/\n/g, ' / '));
await b.close();
