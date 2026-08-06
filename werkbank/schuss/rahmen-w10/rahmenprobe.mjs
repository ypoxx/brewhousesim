/* Schnellprobe des Rahmens: Kopfleiste, Hauszeile, Deckungsband, Haushalt,
   Blattaufsicht nach 30 Wochen + 1 Escape, Randwache, Preisbruch.
     HAFEN=8920 WOCHEN=0 ESC=0 node werkbank/schuss/rahmen-w10/rahmenprobe.mjs 1,2,3,4 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8920';
const WOCHEN = +(process.env.WOCHEN || 0);
const ESC = +(process.env.ESC || 0);
const EPS = (process.argv[2] || '1,2,3,4').split(',').map(Number);
const b = await chromium.launch();
for (const e of EPS) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  const f = [];
  s.on('pageerror', x => f.push('pageerror: ' + x.message));
  s.on('console', m => { if (m.type() === 'error') f.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(250); }
  await s.waitForTimeout(1500);
  const d = await s.evaluate(() => {
    const m = (sel) => { const el = document.querySelector(sel); if (!el) return null;
      const r = el.getBoundingClientRect();
      return { b: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y),
               px: Math.round(r.width * r.height) }; };
    const brueche = [];
    document.querySelectorAll('#buehne .preis').forEach(el => {
      [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim()).forEach(n => {
        const rr = document.createRange(); rr.selectNodeContents(n);
        if (rr.getClientRects().length > 1) brueche.push(n.nodeValue.trim()); });
    });
    return {
      kopfleiste: m('.kopfleiste'), hauszeile: m('.hauszeile'), deckung: m('.deckung'),
      weiter: m('[data-zug="weiter"]'),
      haushalt: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.tafel() : 'FEHLT',
      pruefe: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.pruefe() : null,
      blaetter: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.blaetter() : null,
      rand: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.ueberRand() : null,
      geklemmt: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.geklemmt() : null,
      ohneGriff: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.ohneGriff() : null,
      tafeln: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.tafeln() : null,
      lage: (BRAUHAUS.lage || []).length,
      lagewo: (BRAUHAUS.lage || []).map(x => x.text),
      verdeckt: (function () { try { return BRAUHAUS.stadt.rahmen.verdeckt().length; } catch (x) { return 'x'; } }()),
      brueche
    };
  });
  const S6 = 2752 * 1536 / 6;
  console.log(`=== E${e}${WOCHEN ? ' w' + WOCHEN : ''}${ESC ? ' esc' + ESC : ''}  lage ${d.lage} ${JSON.stringify(d.lagewo)} fehler ${f.length} verdeckt ${d.verdeckt}`);
  if (f.length) console.log('   FEHLER:', f.slice(0, 3));
  const q = (o) => o ? `${o.b}x${o.h} @${o.x},${o.y} = ${o.px} px (${(100 * o.px / S6).toFixed(1)} % des obersten 1/6)` : 'fehlt';
  console.log('  kopfleiste', q(d.kopfleiste));
  console.log('  hauszeile ', q(d.hauszeile));
  console.log('  deckung   ', q(d.deckung));
  console.log('  weiter    ', q(d.weiter));
  console.log(d.haushalt);
  console.log('  pruefe():', JSON.stringify(d.pruefe));
  console.log('  blaetter:', JSON.stringify(d.blaetter));
  console.log('  ueberRand:', JSON.stringify(d.rand));
  console.log('  geklemmt:', JSON.stringify(d.geklemmt), ' ohneGriff:', JSON.stringify(d.ohneGriff));
  console.log('  TAFELN>200k:', JSON.stringify(d.tafeln));
  console.log('  Preisbruch:', JSON.stringify(d.brueche));
  await s.close();
}
await b.close();
