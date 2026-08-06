/* Kurze Sonde: was ist nach N Wochen offen, und wer haelt es offen?
     HAFEN=8910 WOCHEN=30 node werkbank/schuss/rahmen-w10/sonde.mjs [epochen] */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8910';
const WOCHEN = +(process.env.WOCHEN || 30);
const ESC = +(process.env.ESC || 0);
const EPS = (process.argv[2] || '1').split(',').map(Number);

const b = await chromium.launch();
for (const e of EPS) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  const f = [];
  s.on('pageerror', x => f.push(x.message));
  s.on('console', m => { if (m.type() === 'error') f.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(300); }
  await s.waitForTimeout(600);
  const d = await s.evaluate(() => {
    const gross = [];
    document.querySelectorAll('#buehne *').forEach(el => {
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') return;
      if (/inset\(\s*50%/.test(c.clipPath || '')) return;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < 200000) return;
      if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) return;
      const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
        const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
      const a = rgba(c.backgroundColor);
      if (!(a > 0.35 || /gradient/.test(c.backgroundImage || ''))) return;
      const fa = el.closest('.fach');
      gross.push({ st: fa && fa.getAttribute('data-stueck'),
        kl: String(el.className || '').slice(0, 55),
        m: Math.round(r.width) + '×' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y),
        z: getComputedStyle(el).zIndex, reiter: el.getAttribute('data-reiter') });
    });
    let lage = null, bauhof = null;
    try { lage = BRAUHAUS.stadt.rahmen.lage(); bauhof = BRAUHAUS.stadt.rahmen.bauhof(); } catch (x) {}
    return { gross, lage, bauhof, jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
      verdeckt: (function () { try { return BRAUHAUS.stadt.rahmen.verdeckt().length; } catch (x) { return 'x'; } }()),
      esc: [...document.querySelectorAll('[data-zug]')].map(x => x.getAttribute('data-zug'))
             .filter(z => /zu$|zeige|alles|schliess/i.test(z)) };
  });
  console.log(`E${e} ${d.jahr}/${d.woche} verdeckt ${d.verdeckt} bauhof ${d.bauhof} fehler ${f.length}`);
  console.log('  lage:', JSON.stringify(d.lage));
  console.log('  schliess-zuege:', JSON.stringify(d.esc));
  d.gross.forEach(g => console.log(`  GROSS ${g.st} .${g.kl} ${g.m} z=${g.z} reiter=${g.reiter}`));
  await s.close();
}
await b.close();
