// ===========================================================================
// werkbank/schuss/klang/proben.mjs — was in den Proben WIRKLICH drin steht.
//
// Chromium entschluesselt jede mp3 unter spiel/ton/klang/ und meldet Dauer,
// Effektivwert und Spitze. Eine stumme Datei faellt hier auf, bevor sie in
// einer Aufnahme fehlt: fassholz.mp3 war 0,000 — das Ohr hat "nichts" gehoert
// und niemand hat es gemerkt, weil im Katalog ein Name daraufzeigte.
//
//   node werkbank/schuss/klang/proben.mjs
// ===========================================================================

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readdirSync } from 'node:fs';

const basis = process.argv[2] || 'http://127.0.0.1:8899/spiel/';
const dateien = readdirSync('spiel/ton/klang').filter((d) => d.endsWith('.mp3')).sort();

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const seite = await browser.newPage();
await seite.goto(basis, { waitUntil: 'domcontentloaded', timeout: 60000 });

const aus = await seite.evaluate(async (namen) => {
  const ctx = new OfflineAudioContext(1, 1024, 32000);
  const l = [];
  for (const n of namen) {
    try {
      const a = await fetch('ton/klang/' + n);
      const b = await a.arrayBuffer();
      const buf = await ctx.decodeAudioData(b);
      const d = buf.getChannelData(0);
      let s = 0, h = 0;
      for (let i = 0; i < d.length; i++) { s += d[i] * d[i]; const v = Math.abs(d[i]); if (v > h) h = v; }
      // Wo endet der Klang? Letzte Stelle ueber 1 % der Spitze.
      let ende = 0;
      for (let i = d.length - 1; i >= 0; i--) { if (Math.abs(d[i]) > h * 0.01) { ende = i; break; } }
      l.push({ n, sek: +buf.duration.toFixed(2), rms: +Math.sqrt(s / d.length).toFixed(4),
               spitze: +h.toFixed(3), klingtBis: +(ende / buf.sampleRate).toFixed(2) });
    } catch (f) { l.push({ n, fehler: String(f).slice(0, 80) }); }
  }
  return l;
}, dateien);

console.log('Datei              Dauer   RMS     Spitze  klingt bis');
for (const r of aus) {
  if (r.fehler) { console.log(`${r.n.padEnd(18)} FEHLER ${r.fehler}`); continue; }
  const warn = r.rms < 0.005 ? '   << STUMM' : (r.rms < 0.02 ? '   < leise' : '');
  console.log(`${r.n.padEnd(18)} ${String(r.sek).padStart(5)}  ${String(r.rms).padEnd(7)} ` +
              `${String(r.spitze).padEnd(6)}  ${String(r.klingtBis).padStart(5)}${warn}`);
}

await browser.close();
