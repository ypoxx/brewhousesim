/* GEWICHT, unabhaengig von gewicht.mjs des Builders gemessen.
   Er liest die Resource-Timing-API des Fensters; dieses Geraet zaehlt die
   ANTWORTEN, die Playwright selbst sieht — ein anderer Weg zur selben Zahl.
   Zwei Wege, die uebereinstimmen, sind ein Beleg; einer ist eine Behauptung.
     HAFEN=8903 node werkbank/schuss/aufsicht/gewicht-gegenprobe.mjs        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  let n = 0, byte = 0;
  s.on('response', async r => {
    n++;
    try { const buf = await r.body(); byte += buf.length; } catch {}
  });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'load' });
  const beiLoad = { n, byte };
  await s.waitForTimeout(6000);          // Nachladen zweiter Stufe abwarten
  console.log(`E${e}: bis load ${(beiLoad.byte/1048576).toFixed(2)} MB in ${beiLoad.n} Antworten` +
              `  ·  gesamt ${(byte/1048576).toFixed(2)} MB in ${n}`);
  await s.close();
}
await b.close();
