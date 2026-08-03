// Gezielte Probe: eine Sudentscheidung klicken und ALLES vorher/nachher vergleichen.
// node probe.mjs <epoche> <zug> [wochenVorher]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const ZUG = process.argv[3];
const VOR = +(process.argv[4] || 0);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('pageerror: ' + e));
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
  const titel = [];
  document.querySelectorAll('[title]').forEach((el) => { const t = el.getAttribute('title'); if (/hält|Haltbarkeit|reif/.test(t)) titel.push(t.replace(/\s+/g, ' ').slice(0, 130)); });
  return {
    kopf: Array.from(document.querySelectorAll('.marke')).map((m) => m.innerText.trim() + '=' + ((m.nextElementSibling || {}).innerText || '').trim()).join(' | '),
    marke: txt('.fach-marken-sud'), keller: txt('[class*="fu-keller"]'),
    band: txt('.sud-band'), buch: txt('[class*="sud-buch"]'),
    kn, titel: Array.from(new Set(titel)).slice(0, 10),
  };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp();
for (let w = 0; w < VOR; w++) {
  let z = await lies();
  const f = (g) => z.kn.find(k => k.zug === g && k.aktiv && k.getroffen);
  const fu = f('fuhre:fuellen'); if (fu) { await s.mouse.click(fu.x, fu.y); await s.waitForTimeout(60); z = await lies(); }
  const ab = f('fuhre:abschicken'); if (ab) { await s.mouse.click(ab.x, ab.y); await s.waitForTimeout(150); }
  else { const wt = f('weiter'); if (wt) { await s.mouse.click(wt.x, wt.y); await s.waitForTimeout(150); } }
  await klapp();
}
const zeige = (z, wo) => {
  console.log('###', wo, z.kopf);
  console.log('marke :', z.marke);
  console.log('keller:', (z.keller || '').slice(0, 320));
  console.log('band  :', z.band);
  console.log('buch  :', z.buch);
  console.log('titel :', z.titel.join(' // '));
  z.kn.filter((x) => /^sud:/.test(x.zug)).forEach((x) => console.log('   ', (x.getroffen ? 'T' : '.') + (x.aktiv ? 'A' : '.'), x.zug, '|', x.text));
};
const vor = await lies();
zeige(vor, 'VORHER');
const k = vor.kn.find((x) => x.zug === ZUG);
if (!k || !k.aktiv || !k.getroffen) console.log('!!! ZUG NICHT KLICKBAR:', JSON.stringify(k));
else {
  await s.mouse.click(k.x, k.y);
  await s.waitForTimeout(350);
  zeige(await lies(), 'NACHHER (echter Mausklick auf ' + ZUG + ')');
}
console.log('Fehler:', fehler.length ? fehler : 'keine');
await b.close();
