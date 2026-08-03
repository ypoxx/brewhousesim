// Gärkeller gegen Lagerkeller — und ob man dem Fass die Entscheidung ansieht.
// node keller.mjs <epoche> [zugAmAnfang]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const ZUG = process.argv[3] || '';
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
  const txt = (sel) => { const e = document.querySelector(sel); return e ? (e.innerText || '').trim().replace(/\s+/g, ' ') : null; };
  const fass = [];
  document.querySelectorAll('[title]').forEach((el) => { const t = el.getAttribute('title') || ''; if (/gebraut \d{4}/.test(t)) fass.push(t.replace(/\s+/g, ' ')); });
  const gk = (txt('.fach-marken-sud') || '').match(/Gärkeller [^A-ZÄÖÜ]*/);
  return { kopf: Array.from(document.querySelectorAll('.marke')).map((m) => m.innerText.trim() + '=' + ((m.nextElementSibling || {}).innerText || '').trim()).join(' '), gaer: gk ? gk[0].trim() : '', band: txt('.sud-band'), fass: Array.from(new Set(fass)), kn };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp();
if (ZUG) { const z = await lies(); const k = z.kn.find((x) => x.zug === ZUG && x.aktiv && x.getroffen); if (k) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(300); console.log('geklickt:', ZUG, k.text); } else console.log('NICHT KLICKBAR:', ZUG); }
for (let w = 0; w < 14; w++) {
  const z = await lies();
  console.log(`w${String(w).padStart(2, '0')} ${z.kopf}`);
  console.log(`    GÄR: ${z.gaer} | band: ${(z.band || '').slice(0, 110)}`);
  console.log(`    LAGER: ${z.fass.slice(0, 4).join(' // ')}`);
  const f = (g) => z.kn.find(k => k.zug === g && k.aktiv && k.getroffen);
  const fu = f('fuhre:fuellen'); if (fu) { await s.mouse.click(fu.x, fu.y); await s.waitForTimeout(60); }
  const z2 = await lies();
  const ab = z2.kn.find(k => k.zug === 'fuhre:abschicken' && k.aktiv && k.getroffen) || z2.kn.find(k => k.zug === 'weiter' && k.aktiv && k.getroffen);
  if (ab) { await s.mouse.click(ab.x, ab.y); await s.waitForTimeout(220); }
  await klapp();
}
await b.close();
