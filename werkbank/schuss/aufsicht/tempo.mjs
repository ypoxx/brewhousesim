/* Technische Effizienz im Browser — Ladezeit, Gewicht, Bildzeit, Knotenzahl.
   NUR auf leerer Maschine messen: ein fremder Browser verschiebt jede Zahl.
     node werkbank/schuss/aufsicht/tempo.mjs   */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  let bytes = 0, anfragen = 0;
  s.on('response', async r => { anfragen++;
    try { const l = r.headers()['content-length']; if (l) bytes += +l; } catch {} });
  const t0 = Date.now();
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  const geladen = Date.now() - t0;
  await s.waitForTimeout(600);
  const m = await s.evaluate(async () => {
    const t = performance.timing || {};
    const knoten = document.querySelectorAll('*').length;
    // Bildzeit: 60 Bilder messen
    const zeiten = await new Promise(res => {
      const arr = []; let vor = performance.now();
      function tick() { const n = performance.now(); arr.push(n - vor); vor = n;
        if (arr.length < 60) requestAnimationFrame(tick); else res(arr); }
      requestAnimationFrame(tick);
    });
    zeiten.sort((a,b)=>a-b);
    return { knoten,
      median: zeiten[Math.floor(zeiten.length/2)],
      p95: zeiten[Math.floor(zeiten.length*0.95)],
      max: zeiten[zeiten.length-1],
      speicher: performance.memory ? Math.round(performance.memory.usedJSHeapSize/1048576) : null,
      domInteractive: t.domInteractive && t.navigationStart ? t.domInteractive - t.navigationStart : null };
  });
  console.log(`  E${e}: geladen ${geladen} ms · ${anfragen} Anfragen · ${(bytes/1048576).toFixed(1)} MB` +
    ` · ${m.knoten} DOM-Knoten · Bildzeit Median ${m.median.toFixed(1)} ms / p95 ${m.p95.toFixed(1)} / max ${m.max.toFixed(1)}` +
    (m.speicher ? ` · ${m.speicher} MB Heap` : ''));
  await s.close();
}
await b.close();
console.log("\n  Richtwerte: 60 Bilder je Sekunde = 16,7 ms je Bild. Ueber 50 ms ruckelt es sichtbar.");
