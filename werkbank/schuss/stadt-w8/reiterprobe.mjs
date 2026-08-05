/* REITERPROBE — was steht wirklich auf den zehn Reitern?
   HAFEN=8907 ZIEL=…json node werkbank/schuss/stadt-w8/reiterprobe.mjs

   Teil A von Welle 8 verlangt: die Reiterzeile darf umziehen, aber was am
   Schirm steht, muss stehenbleiben. `setzeAufschrift()` kuerzt sauber statt
   abzuschneiden — die vierte Latte zaehlt deshalb null Ueberlaeufe, auch
   wenn auf dem Reiter nur noch "…" steht. Ein Ueberlaufzaehler kann diese
   Regression also NICHT sehen. Dieses Geraet liest den gezeigten Text und
   den vollen Titel und zaehlt, wieviele Reiter gekuerzt sind.

   Gemessen wird auf der Entwurfsleinwand UND bei 1366x768.               */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const FENSTER = [[2752, 1536], [1366, 768]];

const b = await chromium.launch();
const raus = { stand: new Date().toISOString(), fenster: {} };
for (const [BR, HO] of FENSTER) {
  const f = {};
  for (const e of [1, 2, 3, 4]) {
    const s = await b.newPage({ viewport: { width: BR, height: HO } });
    await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
    await s.waitForTimeout(900);
    f['e' + e] = await s.evaluate(() => {
      const z = document.querySelector('.stadt-reiterzeile');
      const r = z ? z.getBoundingClientRect() : null;
      const w = document.querySelector('.stadt-werkbank');
      const rw = w ? w.getBoundingClientRect() : null;
      return {
        zeile: r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null,
        werkbank: rw ? { x: Math.round(rw.x), y: Math.round(rw.y), w: Math.round(rw.width), h: Math.round(rw.height) } : null,
        reiter: [...document.querySelectorAll('.knopf.stadt-reiter')].map(k => {
          const wo = k.querySelector('.wort'), za = k.querySelector('.zahl');
          const kr = k.getBoundingClientRect();
          const voll = (k.title || '').split('. ')[0];
          return {
            wort: wo ? wo.textContent : '', zahl: za ? za.textContent : '',
            titel: voll, breite: Math.round(kr.width), hoehe: Math.round(kr.height),
            gekuerztWort: !!(wo && /…$/.test(wo.textContent)),
            gekuerztZahl: !!(za && /…$/.test(za.textContent)),
            ueberWort: !!(wo && wo.scrollWidth > wo.clientWidth + 1),
            ueberZahl: !!(za && za.scrollWidth > za.clientWidth + 1)
          };
        })
      };
    });
    await s.close();
  }
  raus.fenster[`${BR}x${HO}`] = f;
  console.log(`\n### ${BR}x${HO}`);
  for (const e of [1, 2, 3, 4]) {
    const d = f['e' + e];
    const kw = d.reiter.filter(r => r.gekuerztWort).length, kz = d.reiter.filter(r => r.gekuerztZahl).length;
    const uw = d.reiter.filter(r => r.ueberWort || r.ueberZahl).length;
    console.log(`E${e}: ${d.reiter.length} Reiter · gekuerzter NAME ${kw} · gekuerzte KENNZAHL ${kz} · Ueberlauf ${uw}` +
      `  | Zeile ${d.zeile && d.zeile.w}x${d.zeile && d.zeile.h} @${d.zeile && d.zeile.x},${d.zeile && d.zeile.y}` +
      `  | Werkbank ${d.werkbank && d.werkbank.w}x${d.werkbank && d.werkbank.h} @${d.werkbank && d.werkbank.x},${d.werkbank && d.werkbank.y}`);
    d.reiter.forEach(r => console.log(`     ${String(r.breite).padStart(4)}px  "${r.wort}" / "${r.zahl}"`));
  }
}
await b.close();
writeFileSync(process.env.ZIEL || 'werkbank/schuss/stadt-w8/reiterprobe.json', JSON.stringify(raus, null, 1));
