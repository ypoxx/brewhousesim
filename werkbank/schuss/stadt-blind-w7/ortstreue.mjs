// DIE HAERTESTE EINZELFORDERUNG: 620 Jahre wachsen, OHNE den Ort zu wechseln.
//
// Gemessen wird nicht, was `kern/orte.js` verspricht, sondern wo die Dinge
// wirklich stehen: fuer jeden Bau und jede Marke der Fusspunkt in Prozent der
// Buehne, je Epoche. Was in zwei Epochen vorkommt und sich bewegt hat, faellt
// hier auf.
//
//   HAFEN=8903 node …/ortstreue.mjs <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const HAFEN = process.env.HAFEN || '8903';
const ziel = process.argv[2] || 'werkbank/schuss/stadt-blind-w7/ortstreue.json';
const b = await chromium.launch();
const alles = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350&orte=1`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1800);
  alles['e' + e] = await s.evaluate(() => {
    const bue = document.querySelector('#buehne').getBoundingClientRect();
    const p = (v, ganz) => Math.round((v / ganz) * 10000) / 100;
    const bauten = {};
    document.querySelectorAll('img.stadt-haus').forEach((i) => {
      const r = i.getBoundingClientRect();
      const n = i.currentSrc.split('/').pop().replace(/\.\w+$/, '');
      bauten[n] = { fussX: p(r.left + r.width / 2 - bue.left, bue.width),
                    fussY: p(r.bottom - bue.top, bue.height),
                    br: p(r.width, bue.width) };
    });
    const orte = {};
    if (window.BRAUHAUS && BRAUHAUS.orte && BRAUHAUS.orte.liste) {
      for (const o of BRAUHAUS.orte.liste()) {
        const k = typeof o === 'string' ? o : (o.schluessel || o.name || o.id);
        try { const q = BRAUHAUS.orte.punkt(k);
          orte[k] = { x: p(q.x - (q.x > bue.width ? bue.left : 0), bue.width), y: p(q.y, bue.height) }; } catch (_) { /* */ }
      }
    }
    const marken = {};
    document.querySelectorAll('[data-zug^="stadt:marke:"]').forEach((m) => {
      const r = m.getBoundingClientRect();
      marken[m.dataset.zug] = { x: p(r.left + r.width / 2 - bue.left, bue.width), y: p(r.top + r.height / 2 - bue.top, bue.height) };
    });
    return { bauten, orte, marken };
  });
  console.log(`e${e}: ${Object.keys(alles['e' + e].bauten).length} Bauten · ${Object.keys(alles['e' + e].orte).length} Orte · ${Object.keys(alles['e' + e].marken).length} Marken`);
  await s.close();
}
// Vergleich: alles, was in mehr als einer Epoche vorkommt
const sammel = (feld) => {
  const m = {};
  for (const [e, v] of Object.entries(alles)) for (const [k, q] of Object.entries(v[feld])) { (m[k] = m[k] || {})[e] = q; }
  return m;
};
const bericht = { wanderer: [], treu: 0 };
for (const feld of ['bauten', 'orte', 'marken']) {
  for (const [k, ep] of Object.entries(sammel(feld))) {
    const e = Object.entries(ep); if (e.length < 2) continue;
    const xs = e.map(([, q]) => q.fussX !== undefined ? q.fussX : q.x);
    const ys = e.map(([, q]) => q.fussY !== undefined ? q.fussY : q.y);
    const dx = Math.max(...xs) - Math.min(...xs), dy = Math.max(...ys) - Math.min(...ys);
    if (dx > 0.4 || dy > 0.4) bericht.wanderer.push({ feld, name: k, dx: +dx.toFixed(2), dy: +dy.toFixed(2), ep });
    else bericht.treu++;
  }
}
bericht.wanderer.sort((a, c) => (c.dx + c.dy) - (a.dx + a.dy));
console.log(`\nortstreu in >1 Epoche: ${bericht.treu} · gewandert (>0,4 % der Buehne): ${bericht.wanderer.length}`);
for (const w of bericht.wanderer.slice(0, 20)) console.log(`  ${w.feld} ${w.name}: dx ${w.dx} % dy ${w.dy} %  ` + JSON.stringify(w.ep));
fs.writeFileSync(ziel, JSON.stringify({ alles, bericht }, null, 1));
await b.close();
