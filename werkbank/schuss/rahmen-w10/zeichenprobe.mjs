/* R5 — welche Zeichen kann die Schriftkette NICHT zeichnen?
   Vergleicht die ALTE Kette (bis zur allgemeinen Familie) mit der NEUEN
   (mit Netz) fuer jedes nicht-ASCII-Zeichen, das im Spiel vorkommt.
   Der Abdruck eines Zeichens wird gegen den von U+FFFF gehalten — dem
   garantiert fehlenden. Gleich = leeres Rechteck.
     HAFEN=8920 node werkbank/schuss/rahmen-w10/zeichenprobe.mjs            */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8920';
const ZEICHEN = ['—','„','…','−','–','→','≈','♪','‚','▸','▾','▲','▼','✦','·','×','“','”','°','½','é','ö','ß',' '];
const ALT = {
  serif: '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif',
  sans:  '"Helvetica Neue",Helvetica,Arial,sans-serif',
  mono:  'ui-monospace,SFMono-Regular,Menlo,Consolas,monospace'
};
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1200, height: 800 } });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=4&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1200);
const r = await s.evaluate(({ ZEICHEN, ALT }) => {
  const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
  const c = cv.getContext('2d', { willReadFrequently: true });
  const abdruck = (font, ch) => {
    c.clearRect(0, 0, 64, 64); c.font = font; c.fillStyle = '#000'; c.textBaseline = 'alphabetic';
    c.fillText(ch, 4, 48);
    const d = c.getImageData(0, 0, 64, 64).data;
    let h = 2166136261;
    for (let i = 3; i < d.length; i += 4) { h ^= (d[i] > 40 ? 1 : 0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const cs = getComputedStyle(document.documentElement);
  const NEU = { serif: cs.getPropertyValue('--serif').trim(),
                sans: cs.getPropertyValue('--sans').trim(),
                mono: cs.getPropertyValue('--mono').trim() };
  const raus = [];
  for (const art of ['serif', 'sans', 'mono']) {
    for (const ch of ZEICHEN) {
      const fa = '40px ' + ALT[art], fn = '40px ' + NEU[art];
      const alt = abdruck(fa, ch) === abdruck(fa, '￿');
      const neu = abdruck(fn, ch) === abdruck(fn, '￿');
      if (alt || neu) raus.push({ art, ch, code: 'U+' + ch.codePointAt(0).toString(16).toUpperCase(),
                                  alt, neu });
    }
  }
  return { NEU, raus };
}, { ZEICHEN, ALT });
console.log('NEUE KETTEN:');
Object.entries(r.NEU).forEach(([k, v]) => console.log('  --' + k + ': ' + v));
console.log('ZEICHEN, die in einer der beiden Ketten als leeres Rechteck stehen:');
if (!r.raus.length) console.log('  keine');
r.raus.forEach(x => console.log(`  ${x.art.padEnd(6)} ${x.code} „${x.ch}"   alt=${x.alt ? 'RECHTECK' : 'ok'}   neu=${x.neu ? 'RECHTECK' : 'ok'}`));
await b.close();
