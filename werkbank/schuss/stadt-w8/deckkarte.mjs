/* DECKKARTE — welche Zelle der Buehne ist wirklich frei von Oberflaeche?
   HAFEN=8907 node werkbank/schuss/stadt-w8/deckkarte.mjs [epochen…]

   Dasselbe Verfahren wie aufsicht/deckung-je-stueck.mjs (Pixelvergleich der
   Seite mit und ohne Oberflaeche), aber das Ergebnis wird nicht zu einer Zahl
   zusammengezogen, sondern in ein 32x24-Raster geschrieben. Nur so laesst sich
   die Frage beantworten, die Welle 8 stellt: WOHIN darf die Werkbank, ohne
   fremde Oberflaeche zu treffen und ohne im untersten Sechstel zu liegen.

   Zusaetzlich wird die Werkbank der STADT getrennt nach Reiterzeile und
   Bauhof-Lade gemessen — die Aufsicht nennt 47 % des untersten Sechstels
   "die Reiterzeile", gemessen hat sie aber den ganzen Kasten.               */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const B = 2752, H = 1536, SX = 32, SY = 24;
const EPOCHEN = (process.argv.slice(2).length ? process.argv.slice(2) : ['1', '2', '3', '4']).map(Number);

const alleWeg = () => {
  const ebenen = [...document.querySelectorAll('.ebene')];
  ebenen.forEach((w, i) => { if (i >= 2) [...w.children].forEach(el => { el.style.visibility = 'hidden'; }); });
};
const nurDies = (wahl) => {
  const ebenen = [...document.querySelectorAll('.ebene')];
  ebenen.forEach((w, i) => { if (i >= 2) [...w.children].forEach(el => { el.style.visibility = 'hidden'; }); });
  document.querySelectorAll(wahl).forEach(el => {
    el.style.visibility = 'visible';
    for (let p = el.parentElement; p; p = p.parentElement) if (p.classList && p.classList.contains('fach')) p.style.visibility = 'visible';
  });
};

const maske = (a, b) => {
  const A = pngLesen(a), Bd = pngLesen(b);
  const z = [];
  for (let i = 0; i < SY; i++) z.push(new Array(SX).fill(0));
  let ges = 0, unten = 0, untenGes = 0;
  const y5 = Math.floor(H * 5 / 6);
  for (let y = 0; y < A.hoehe; y++) for (let x = 0; x < A.breite; x++) {
    const i = (y * A.breite + x) * 4;
    const d = Math.abs(A.daten[i] - Bd.daten[i]) > 8 || Math.abs(A.daten[i + 1] - Bd.daten[i + 1]) > 8 ||
              Math.abs(A.daten[i + 2] - Bd.daten[i + 2]) > 8;
    if (y >= y5) { untenGes++; if (d) unten++; }
    if (d) { ges++; z[Math.min(SY - 1, Math.floor(y / (H / SY)))][Math.min(SX - 1, Math.floor(x / (B / SX)))]++; }
  }
  const zelle = (H / SY) * (B / SX);
  return { raster: z.map(r => r.map(n => Math.round(100 * n / zelle))),
           flaeche: ges / (A.breite * A.hoehe), sechstel: unten / untenGes };
};

const b = await chromium.launch();
const raus = { stand: new Date().toISOString(), epochen: {} };
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: B, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1200);
  const voll = await s.screenshot();
  await s.evaluate(alleWeg); await s.waitForTimeout(250);
  const nackt = await s.screenshot();
  const ganz = maske(voll, nackt);
  const teile = {};
  for (const [name, wahl] of [['reiterzeile', '.stadt-reiterzeile'], ['bauhof', '.stadt-bauhof'],
                              ['werkbank', '.stadt-werkbank']]) {
    await s.evaluate(nurDies, wahl); await s.waitForTimeout(200);
    const nur = await s.screenshot();
    teile[name] = maske(nur, nackt);
  }
  console.log(`\n=== Epoche ${e} === gesamte Oberflaeche: ${(ganz.flaeche * 100).toFixed(1)} % der Flaeche, ` +
              `${(ganz.sechstel * 100).toFixed(1)} % des untersten Sechstels`);
  for (const k of Object.keys(teile))
    console.log(`    ${k.padEnd(12)} ${(teile[k].flaeche * 100).toFixed(2)} %   unten ${(teile[k].sechstel * 100).toFixed(1)} %`);
  console.log('  Deckungskarte ALLER Stuecke (Zehntel, . = frei, # = 100):');
  ganz.raster.forEach((z, i) => console.log('  ' + String(Math.round(i * H / SY)).padStart(4) + ' ' +
    z.map(n => n === 0 ? '.' : n >= 95 ? '#' : String(Math.min(9, Math.round(n / 10)))).join('')));
  raus.epochen['e' + e] = { ganz, teile };
  await s.close();
}
await b.close();
writeFileSync(process.env.ZIEL || 'werkbank/schuss/stadt-w8/deckkarte.json', JSON.stringify(raus));
