// DAS LOT UND DIE TIEFE, aus dem laufenden Spiel gelesen — nicht aus dem
// Quelltext geschlossen.
//
//   node werkbank/schuss/stadt-r7/pruefe.mjs [bau=alle]
//
// Gibt je Epoche aus: BRAUHAUS.lage, Bodenfehler, Tiefenfehler und die
// Rechtecke aller Aufbauten in Bezugspixeln.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const bau = process.argv[2] || 'alle';
const browser = await chromium.launch();
let schlecht = 0;

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&bau=${bau}&stumm=1`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1300);

  const d = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const o = B.buehne.el.getBoundingClientRect();
    const m = B.buehne.masse();
    const bau = [...document.querySelectorAll('#fach-bau-stadt .stadt-haus[data-bau]:not(.geist)')]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          k: el.getAttribute('data-bau'),
          t: +el.getAttribute('data-tiefe'),
          z: +el.style.zIndex,
          x0: Math.round((r.left - o.left) / m.breite * 2752),
          x1: Math.round((r.right - o.left) / m.breite * 2752),
          y0: Math.round((r.top - o.top) / m.hoehe * 1536),
          y1: Math.round((r.bottom - o.top) / m.hoehe * 1536)
        };
      });
    return {
      lage: B.lage.length,
      boden: B.stadt.boden.fehler(),
      tiefe: B.stadt.tiefe.pruefe(),
      deckung: B.stadt.tiefe.deckung(),
      bau
    };
  });

  console.log(`\n=== Epoche ${ep} (bau=${bau}) ===`);
  console.log(`BRAUHAUS.lage ${d.lage} · Seitenfehler ${fehler.length} · ${d.bau.length} Aufbauten`);
  fehler.forEach((f) => console.log('  ' + f));
  console.log(d.boden.length ? 'BODEN:' : 'BODEN: 0 Fehler');
  d.boden.forEach((z) => console.log('  FEHLER ' + z.schluessel + ' — ' + z.sagt));
  console.log(d.tiefe.length ? 'REIHENFOLGE:' : 'REIHENFOLGE: 0 Fehler');
  d.tiefe.forEach((z) => console.log('  ' + z.sagt));
  const begraben = d.deckung.filter((z) => !z.gut);
  console.log('DECKUNG (Pixel): ' + begraben.length + ' begraben');
  d.deckung.forEach((z) => console.log(
    `  ${z.gut ? ' ' : 'X'} ${z.schluessel.padEnd(18)} ${String(Math.round(z.anteil*100)).padStart(3)} % zu`
    + `  sichtbar ${String(z.sichtbar).padStart(7)} px  ${z.durch.join(', ')}`));
  if (process.argv.includes('--rechtecke')) {
    d.bau.sort((a, b) => a.t - b.t).forEach((b) =>
      console.log(`  ${b.k.padEnd(18)} tiefe ${String(b.t).padStart(6)}  z ${String(b.z).padStart(4)}`
        + `  x ${b.x0}..${b.x1}  y ${b.y0}..${b.y1}`));
  }
  schlecht += d.lage + fehler.length + d.boden.length + d.tiefe.length;
  await seite.close();
}

await browser.close();
console.log(`\nSumme aller Beanstandungen: ${schlecht}`);
