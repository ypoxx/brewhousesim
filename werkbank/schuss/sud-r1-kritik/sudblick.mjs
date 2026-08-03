// Sudbrett aufklappen und ansehen — Wortlaut vom Schirm.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 1);
const SAAT = process.argv[3] || '4242';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('pageerror: ' + e));
s.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1000);

// alle Reiter klicken, die "zugeklappt" sagen
for (let runde = 0; runde < 3; runde++) {
  const reiter = await s.$$('button[data-zug^="stadt:reiter:"]');
  for (const r of reiter) {
    const t = (await r.innerText()).replace(/\s+/g, ' ');
    if (/zugeklappt/.test(t)) { try { await r.click({ timeout: 2000 }); await s.waitForTimeout(120); } catch (e) {} }
  }
}
await s.waitForTimeout(600);

const d = await s.evaluate(() => {
  const out = { knoepfe: [], texte: {} };
  document.querySelectorAll('button').forEach((el) => {
    const zug = el.getAttribute('data-zug') || '';
    if (zug.indexOf('sud') !== 0) return;
    const r = el.getBoundingClientRect();
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    out.knoepfe.push({
      zug, text: (el.innerText || '').trim().replace(/\s+/g, ' '),
      titel: el.getAttribute('title') || '',
      aktiv: !el.disabled,
      getroffen: !!(t && (t === el || el.contains(t))),
      groesse: [Math.round(r.width), Math.round(r.height)],
    });
  });
  // Alles, was zum Sud im DOM steht (eigene Fächer)
  document.querySelectorAll('[class*="sud"],[class*="sd-"]').forEach((el) => {
    if (el.closest('button')) return;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 20) return;
    const key = el.className.toString().slice(0, 40) + '@' + Math.round(r.left) + ',' + Math.round(r.top);
    const txt = (el.innerText || '').trim();
    if (txt) out.texte[key] = txt.slice(0, 1500);
  });
  return out;
});
console.log('=== EPOCHE', EP, '=== Fehler:', fehler.length ? fehler.join('|') : 'keine');
console.log('--- SUD-KNOEPFE ---');
for (const k of d.knoepfe) console.log(`${k.getroffen ? 'T' : '.'}${k.aktiv ? 'A' : '.'} ${k.groesse.join('x')} [${k.zug}] ${k.text}  {{${k.titel}}}`);
console.log('--- SUD-TEXTE ---');
const keys = Object.keys(d.texte).sort();
// nur die längsten, nicht verschachtelt doppelt
let letzt = '';
for (const k of keys) { const t = d.texte[k]; if (letzt.indexOf(t) >= 0) continue; console.log('### ' + k + '\n' + t + '\n'); letzt = t; }
await s.screenshot({ path: `/tmp/claude-0/-home-user-brewhousesim/2945a2cf-1639-5611-b3d8-e1847b092d58/scratchpad/sud-e${EP}.png` });
await b.close();
