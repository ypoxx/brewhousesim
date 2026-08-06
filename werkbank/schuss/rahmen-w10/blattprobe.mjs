/* Welche Bedienknoepfe stecken in den grossen Blaettern, und wie heissen die
   Reiter? Grundlage fuer die Blattaufsicht des Rahmens (Auflage R2). */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8920';
const WOCHEN = +(process.env.WOCHEN || 30);
const ESC = +(process.env.ESC || 1);
const EPS = (process.argv[2] || '1').split(',').map(Number);
const b = await chromium.launch();
for (const e of EPS) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(300); }
  await s.waitForTimeout(700);
  const d = await s.evaluate(() => {
    const out = { blaetter: [], reiter: [], preisbruch: [] };
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
      out.blaetter.push({
        st: fa && fa.getAttribute('data-stueck'),
        kl: String(el.className || '').slice(0, 50),
        m: Math.round(r.width) + 'x' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y),
        reiter: el.getAttribute('data-reiter'),
        knoepfe: [...el.querySelectorAll('[data-zug]')].slice(0, 40).map(k =>
          k.getAttribute('data-zug') + ' | ' + (k.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24))
      });
    });
    out.reiter = [...document.querySelectorAll('[data-zug^="stadt:reiter"]')].map(k =>
      k.getAttribute('data-zug') + ' | ' + (k.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30));
    /* wo bricht ein Preisschild? */
    document.querySelectorAll('#buehne .preis').forEach(el => {
      const kinder = [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim());
      kinder.forEach(n => { const rr = document.createRange(); rr.selectNodeContents(n);
        if (rr.getClientRects().length > 1) {
          const kn = el.closest('[data-zug]'); const fa = el.closest('.fach');
          out.preisbruch.push({ t: n.nodeValue.trim(), zug: kn && kn.getAttribute('data-zug'),
            st: fa && fa.getAttribute('data-stueck'),
            ws: getComputedStyle(el).whiteSpace, pw: getComputedStyle(kn || el).whiteSpace,
            breite: Math.round(el.getBoundingClientRect().width) });
        }});
    });
    return out;
  });
  console.log('=== E' + e);
  d.blaetter.forEach(x => { console.log(` BLATT ${x.st} .${x.kl} ${x.m} reiter=${x.reiter}`);
    x.knoepfe.forEach(k => console.log('     knopf ' + k)); });
  console.log(' REITER:'); d.reiter.forEach(r => console.log('     ' + r));
  console.log(' PREISBRUCH:', JSON.stringify(d.preisbruch));
  await s.close();
}
await b.close();
