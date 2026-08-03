import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required','--no-sandbox'] });
const p = await b.newPage();
await p.goto('http://127.0.0.1:8899/spiel/?epoche=1&saat=1350&stumm=1', { waitUntil: 'networkidle' });
const namen = process.argv.slice(2);
const r = await p.evaluate(async (namen) => {
  const ctx = new OfflineAudioContext(1, 128, 44100);
  const aus = [];
  for (const n of namen) {
    const ab = await (await fetch('ton/klang/' + n + '.mp3')).arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    const d = buf.getChannelData(0), rate = buf.sampleRate;
    const f = Math.round(rate * 0.02), fen = [];
    for (let i = 0; i + f <= d.length; i += f) {
      let q = 0; for (let k = i; k < i + f; k++) q += d[k]*d[k];
      fen.push(Math.sqrt(q/f));
    }
    const max = Math.max(...fen);
    let ein = 0; for (let i = 0; i < fen.length; i++) if (fen[i] > 0.20*max) { ein = i*0.02; break; }
    let q=0, sp=0; for (let i=0;i<d.length;i++){q+=d[i]*d[i]; const a=Math.abs(d[i]); if(a>sp)sp=a;}
    aus.push({ n, dauer:+buf.duration.toFixed(2), rms:+Math.sqrt(q/d.length).toFixed(4),
               spitze:+sp.toFixed(3), einsatz:+ein.toFixed(2), fenMax:+max.toFixed(4) });
  }
  return aus;
}, namen);
for (const x of r) console.log(JSON.stringify(x));
await b.close();
