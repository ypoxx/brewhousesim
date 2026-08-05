/* DAS HAUSSCHILD — wieviel deckt die Oberflaeche davon zu?
   HAFEN=8907 node werkbank/schuss/stadt-w8/schild.mjs

   Der Blindvergleich vom 5. August hat es so gemessen und daraus den ersten
   Punkt seiner Liste "damit es kippt" fuer 1350 gemacht: "65,7 % beim Laden
   und 75,6 % nach dem Spielen" — die Karte DER SUD lag auf dem Schild
   BRAUHAUS ZUM ANKER. Dieses Geraet stellt seine Messung nach: Kasten des
   Schildes aus dem DOM holen, dieselbe Seite einmal mit und einmal ohne die
   Oberflaechenebenen aufnehmen, und in diesem Kasten die abweichenden
   BILDPUNKTE zaehlen — nicht die Kaesten. (Die Lehre der Aufsicht: wer
   Deckung misst, vergleicht Pixel.)                                        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const B = 2752, H = 1536;

const weg = () => {
  document.querySelectorAll('.ebene').forEach((w, i) => {
    if (i >= 2) [...w.children].forEach(el => { el.style.visibility = 'hidden'; });
  });
};

const b = await chromium.launch();
const raus = { stand: new Date().toISOString(), hafen: HAFEN, epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: B, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1200);
  const k = await s.evaluate(() => {
    const el = document.querySelector('.stadt-hausschild') || document.querySelector('.stadt-schildwerk');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  if (!k) { console.log(`E${e}: kein Hausschild gefunden`); await s.close(); continue; }
  const voll = pngLesen(await s.screenshot());
  await s.evaluate(weg); await s.waitForTimeout(250);
  const nackt = pngLesen(await s.screenshot());
  let n = 0, ges = 0;
  for (let y = k.y; y < k.y + k.h; y++) for (let x = k.x; x < k.x + k.w; x++) {
    if (x < 0 || y < 0 || x >= B || y >= H) continue;
    const i = (y * B + x) * 4; ges++;
    if (Math.abs(voll.daten[i] - nackt.daten[i]) > 8 || Math.abs(voll.daten[i + 1] - nackt.daten[i + 1]) > 8 ||
        Math.abs(voll.daten[i + 2] - nackt.daten[i + 2]) > 8) n++;
  }
  const p = ges ? n / ges : 0;
  console.log(`E${e}: Schild (${k.x}|${k.y}) ${k.w}x${k.h} — ${(p * 100).toFixed(1)} % gedeckt`);
  raus.epochen['e' + e] = { kasten: k, gedeckt: p };
  await s.close();
}
await b.close();
writeFileSync(process.env.ZIEL || 'werkbank/schuss/stadt-w8/schild.json', JSON.stringify(raus, null, 1));
