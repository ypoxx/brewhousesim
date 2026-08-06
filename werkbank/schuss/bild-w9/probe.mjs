/* PROBE — was liegt beim Laden auf dem Schirm? Nur Erkundung, kein Urteil.
     HAFEN=8907 node werkbank/schuss/bild-w9/probe.mjs 1
   Gibt aus: Ebenenbelegung, Kaesten (deckender Grund/Rahmen), Zuege.        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8907';
const E = process.argv[2] || '1';
const W = 2752, H = 1536;

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: W, height: H } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e)));
s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1500);

const bericht = await s.evaluate(() => {
  const out = { ebenen: [], kaesten: [], zuege: [], lage: (window.BRAUHAUS && BRAUHAUS.lage) || null };
  document.querySelectorAll('.ebene').forEach(w => {
    out.ebenen.push({ name: w.dataset.ebene, kinder: w.children.length,
      klassen: [...w.children].slice(0, 40).map(c => (c.className || '').toString().slice(0, 60)) });
  });
  // Kasten nach EIGENSCHAFT: deckender Grund (alpha>0.35) oder sichtbarer Rahmen
  const alle = document.querySelectorAll('#buehne *');
  const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(Number); return { a: p.length > 3 ? p[3] : 1 }; };
  alle.forEach(el => {
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
    const bg = rgba(c.backgroundColor);
    const hatGrund = bg && bg.a > 0.35;
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
      .map(k => parseFloat(c[k]) || 0);
    const rb = rgba(c.borderTopColor);
    const hatRahmen = Math.max(...bw) >= 1 && rb && rb.a > 0.3;
    if (!hatGrund && !hatRahmen) return;
    out.kaesten.push({ tag: el.tagName, kl: (el.className || '').toString().slice(0, 70),
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      grund: c.backgroundColor, flaeche: Math.round(r.width * r.height) });
  });
  out.kaesten.sort((a, z) => z.flaeche - a.flaeche);
  out.kaesten = out.kaesten.slice(0, 45);
  document.querySelectorAll('button[data-zug],[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 2) return;
    out.zuege.push({ zug: el.dataset.zug, text: (el.textContent || '').trim().slice(0, 55),
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
  });
  return out;
});

console.log('=== EPOCHE ' + E + ' ===');
console.log('lage:', JSON.stringify(bericht.lage));
console.log('fehler:', fehler.length ? fehler : 'keine');
console.log('\n-- Ebenen --');
bericht.ebenen.forEach(e => console.log(`  ${e.name.padEnd(8)} ${String(e.kinder).padStart(4)} Kinder  ${e.klassen.join(' | ').slice(0, 190)}`));
console.log('\n-- groesste Kaesten (deckender Grund oder Rahmen) --');
bericht.kaesten.forEach(k => console.log(
  `  ${String(k.flaeche).padStart(9)} px2  ${String(k.x).padStart(5)},${String(k.y).padStart(5)} ${String(k.w).padStart(5)}x${String(k.h).padStart(4)}  ${k.grund.padEnd(24)} ${k.tag} ${k.kl}`));
console.log(`\n-- Zuege (${bericht.zuege.length}) --`);
bericht.zuege.slice(0, 60).forEach(z => console.log(
  `  ${String(z.x).padStart(5)},${String(z.y).padStart(5)} ${String(z.w).padStart(4)}x${String(z.h).padStart(3)}  ${z.zug.padEnd(38)} ${z.text}`));
await b.close();
