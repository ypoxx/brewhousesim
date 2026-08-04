/* Wie laut ist eine Probe wirklich aus dem Erzeuger gekommen?
 *
 * `kern/ton.js` zieht jede Probe mit `angleich(buf, ziel)` auf einen festen
 * Effektivwert — aber `angleich` KAPPT den Faktor bei 6. Eine Probe, die zu
 * leise geliefert wurde, erreicht ihr Ziel damit nie, und niemand sieht es:
 * die Zahl im Quelltext sagt 0,55 und der Ton macht 0,3.
 *
 *   HAFEN=http://127.0.0.1:8941 node lautheit.mjs drueben1 drueben4 bau1 bau4
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || 'http://127.0.0.1:8941';
const NAMEN = process.argv.slice(2);
if (!NAMEN.length) { console.error('welche Proben?'); process.exit(1); }

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const p = await b.newPage();
await p.goto(`${HAFEN}/spiel/?epoche=1&saat=1350`, { waitUntil: 'networkidle' });

const aus = await p.evaluate(async (namen) => {
  const ctx = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 1024, 44100);
  const zeilen = [];
  for (const n of namen) {
    try {
      const a = await fetch('ton/klang/' + n + '.mp3');
      const roh = await a.arrayBuffer();
      const buf = await ctx.decodeAudioData(roh);
      const d = buf.getChannelData(0);
      let q = 0, spitze = 0;
      for (let i = 0; i < d.length; i++) { q += d[i] * d[i]; const x = Math.abs(d[i]); if (x > spitze) spitze = x; }
      zeilen.push({ name: n, sek: +buf.duration.toFixed(2), rms: Math.sqrt(q / d.length), spitze: spitze });
    } catch (f) { zeilen.push({ name: n, fehler: String(f).slice(0, 80) }); }
  }
  return zeilen;
}, NAMEN);

for (const z of aus) {
  if (z.fehler) { console.log(`${z.name.padEnd(12)} FEHLER ${z.fehler}`); continue; }
  const f = (ziel) => (ziel / z.rms);
  console.log(`${z.name.padEnd(12)} ${String(z.sek).padStart(5)} s  rms ${z.rms.toFixed(5)}  spitze ${z.spitze.toFixed(3)}`
    + `   noetiger Faktor fuer 0,27: ${f(0.27).toFixed(1)}x   fuer 0,55: ${f(0.55).toFixed(1)}x`
    + (f(0.55) > 6 ? '   >>> ANGLEICH KAPPT BEI 6' : ''));
}
await b.close();
