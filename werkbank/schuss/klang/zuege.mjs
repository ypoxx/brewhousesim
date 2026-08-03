// werkbank/schuss/klang/zuege.mjs — welche Knoepfe liegen in welcher Epoche,
// und welcher davon macht Geraeusch? Grundlage fuer aufnahme.mjs.
//
//   node werkbank/schuss/klang/zuege.mjs 1 12
//        ^ Epoche         ^ so viele Wochen weiterklicken

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const epoche = Number(process.argv[2] || 1);
const wochen = Number(process.argv[3] || 8);
const basis = process.argv[4] || 'http://127.0.0.1:8899/spiel/';

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio'] });
const seite = await browser.newPage({ viewport: { width: 1376, height: 768 } });
await seite.goto(`${basis}?epoche=${epoche}&saat=1350`, { waitUntil: 'domcontentloaded' });
await seite.waitForSelector('#buehne[data-bereit="1"]');
await seite.waitForTimeout(600);

const gesehen = new Map();
for (let w = 0; w <= wochen; w++) {
  const l = await seite.evaluate(() => {
    const a = [];
    document.querySelectorAll('button[data-zug]').forEach((el) => {
      const r = el.getBoundingClientRect();
      a.push([el.getAttribute('data-zug'), (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60),
              el.disabled ? 0 : 1, r.width > 0 && r.height > 0 ? 1 : 0]);
    });
    return a;
  });
  for (const [z, t, frei, sichtbar] of l) {
    const alt = gesehen.get(z) || { text: t, frei: 0, sichtbar: 0, wochen: 0 };
    alt.frei += frei; alt.sichtbar += sichtbar; alt.wochen++;
    if (!alt.text) alt.text = t;
    gesehen.set(z, alt);
  }
  if (w < wochen) {
    await seite.evaluate(() => {
      const el = document.querySelector('button[data-zug="weiter"]:not([disabled])');
      if (el) el.click();
    });
    await seite.waitForTimeout(220);
  }
}

const liste = [...gesehen.entries()].filter(([, v]) => v.frei > 0).sort();
console.log(`Epoche ${epoche}: ${liste.length} Zuege in ${wochen + 1} Wochen mindestens einmal frei\n`);
for (const [z, v] of liste) console.log(`${String(v.frei).padStart(3)}×  ${z.padEnd(38)} ${v.text}`);
await browser.close();
