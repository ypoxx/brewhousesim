/* Gegenprobe: dreissig Sekunden, in denen NICHTS gespielt wird. Nur der Ton
   wird geweckt, dann liegt die Hand still. Was hier noch klingt, ist Kulisse. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const EP = Number(process.argv[2] || 1);
const ZIEL = process.argv[3];
const SEK = 30;
mkdirSync(ZIEL, { recursive: true });

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1500, height: 1500 } });
const konsole = [];
p.on('console', m => { if (m.type() === 'error') konsole.push('CONSOLE ' + m.text().slice(0, 200)); });
p.on('pageerror', e => konsole.push('PAGEERROR ' + e.message.slice(0, 200)));
await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.BRAUHAUS && window.BRAUHAUS.ton && window.BRAUHAUS.ton.bereit());
await p.waitForTimeout(500);
for (const z of ['klang:ton', 'klang:ton']) {
  const e = p.locator(`[data-zug="${z}"]`).first();
  if (await e.count()) { await e.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(300); }
}
await p.waitForTimeout(1200);

await p.evaluate(() => {
  const B = window.BRAUHAUS, aus = B.ton.ausgang(), ctx = aus.context;
  const w = window.__pruef = { rate: ctx.sampleRate, bloecke: [] };
  const proc = ctx.createScriptProcessor(4096, 1, 1), still = ctx.createGain();
  still.gain.value = 0;
  proc.onaudioprocess = e => w.bloecke.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  aus.connect(proc); proc.connect(still); still.connect(ctx.destination);
  B.ton.beginneMitschnitt();
});
await p.waitForTimeout(SEK * 1000 + 500);

const r = await p.evaluate((sek) => {
  const w = window.__pruef, rate = w.rate;
  const n = Math.min(w.bloecke.length * 4096, Math.round(rate * sek));
  const pcm = new Float32Array(n); let o = 0;
  for (const b of w.bloecke) { if (o >= n) break; pcm.set(b.subarray(0, Math.min(b.length, n - o)), o); o += b.length; }
  const kopf = 44, buf = new ArrayBuffer(kopf + n * 2), dv = new DataView(buf);
  const s = (p, t) => { for (let i = 0; i < t.length; i++) dv.setUint8(p + i, t.charCodeAt(i)); };
  s(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true);
  dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); s(36, 'data'); dv.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, pcm[i])); dv.setInt16(kopf + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true); }
  const bin = new Uint8Array(buf); let roh = '';
  for (let i = 0; i < bin.length; i += 32768) roh += String.fromCharCode.apply(null, bin.subarray(i, i + 32768));
  return { wav: btoa(roh), rate, sekunden: +(n / rate).toFixed(2),
    mitschnitt: BRAUHAUS.ton.mitschnitt().map(m => m.name), lage: BRAUHAUS.lage.length,
    pegel: BRAUHAUS.ton.pegel() };
}, SEK);
writeFileSync(`${ZIEL}/still-epoche${EP}.wav`, Buffer.from(r.wav, 'base64'));
delete r.wav;
writeFileSync(`${ZIEL}/still-epoche${EP}.json`, JSON.stringify({ epoche: EP, konsole, ...r }, null, 1));
console.log(JSON.stringify({ epoche: EP, ...r, konsole: konsole.length }));
await b.close();
