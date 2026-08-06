/* PROBE — was steht auf dem Schirm, bevor irgendetwas geklickt wird?
   Nur Erkundung: Knopfliste, Ebenen-Inhalte, Fehler. Kein Urteil.
     HAFEN=8906 node werkbank/schuss/bild-w8/probe.mjs <epoche>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8906';
const ep = process.argv[2] || '1';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
p.on('pageerror', e => fehler.push('pageerror: ' + e));
p.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1500);

const bericht = await p.evaluate(() => {
  const out = { ebenen: [], knoepfe: [], lage: (window.BRAUHAUS && BRAUHAUS.lage) || 'kein BRAUHAUS' };
  document.querySelectorAll('.ebene').forEach(w => {
    const kinder = [...w.children].map(k => k.className + ' (' + k.children.length + ')');
    out.ebenen.push({ name: w.dataset.ebene, n: w.children.length, kinder: kinder.slice(0, 24) });
  });
  document.querySelectorAll('button').forEach(bt => {
    const r = bt.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    out.knoepfe.push({
      t: (bt.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70),
      zug: bt.dataset.zug || '',
      k: bt.className.slice(0, 50),
      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
      aus: bt.disabled || bt.classList.contains('aus') || bt.classList.contains('gesperrt')
    });
  });
  return out;
});
console.log('EPOCHE ' + ep);
console.log('lage: ' + JSON.stringify(bericht.lage));
for (const e of bericht.ebenen) console.log(`EBENE ${e.name}: ${e.n} — ${e.kinder.join(' | ')}`);
console.log('KNOEPFE ' + bericht.knoepfe.length);
for (const k of bericht.knoepfe) console.log(`  [${k.x},${k.y} ${k.w}x${k.h}]${k.aus ? ' AUS' : '    '} ${k.zug.padEnd(34)} «${k.t}» .${k.k}`);
console.log(fehler.length ? 'FEHLER:\n' + fehler.slice(0, 10).join('\n') : 'keine Fehler auf der Seite');
await b.close();
