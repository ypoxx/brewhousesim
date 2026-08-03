// erkundung.mjs — was steht ueberhaupt am Schirm, ehe man spielt?
//   node erkundung.mjs <hafen>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8911);
const SAAT = 1350;
const browser = await chromium.launch();

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 200)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${epoche}&saat=${SAAT}`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1200);

  const d = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const kn = [...document.querySelectorAll('button[data-zug]')].map((k) => {
      const r = k.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const t = (r.width >= 3 && r.height >= 3 && cx >= 0 && cy >= 0
        && cx <= innerWidth && cy <= innerHeight) ? document.elementFromPoint(cx, cy) : null;
      return {
        zug: k.getAttribute('data-zug'),
        aus: k.disabled,
        w: Math.round(r.width), h: Math.round(r.height),
        x: Math.round(cx), y: Math.round(cy),
        trifft: !!(t && (t === k || k.contains(t))),
        text: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 60)
      };
    });
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      lage: B.lage.length, lageTexte: B.lage.slice(0, 5),
      verfahren: JSON.parse(JSON.stringify(B.SUD_ZUSTAND.verfahren)),
      fest: JSON.parse(JSON.stringify(B.SUD_ZUSTAND.fest)),
      brettZu: B.SUD_ZUSTAND.brettZu,
      knoepfe: kn
    };
  });
  console.log('=== EPOCHE ' + epoche + ' (' + d.jahr + ') Kasse ' + d.kasse
    + ' Rohstoff ' + d.rohstoff + ' lage=' + d.lage + ' brettZu=' + d.brettZu);
  if (d.lage) console.log('  LAGE: ' + JSON.stringify(d.lageTexte));
  console.log('  verfahren: ' + JSON.stringify(d.verfahren));
  console.log('  Knoepfe gesamt ' + d.knoepfe.length
    + ', aktiv ' + d.knoepfe.filter((k) => !k.aus).length
    + ', aktiv+treffbar ' + d.knoepfe.filter((k) => !k.aus && k.trifft).length);
  for (const k of d.knoepfe) {
    console.log('    ' + (k.aus ? 'AUS ' : 'AN  ') + (k.trifft ? 'hit ' : 'VERDECKT ')
      + k.zug.padEnd(34) + ' ' + k.w + 'x' + k.h + ' @' + k.x + ',' + k.y + '  ' + k.text);
  }
  if (fehler.length) console.log('  FEHLER: ' + JSON.stringify(fehler.slice(0, 5)));
  else console.log('  keine Konsolenfehler');
  await seite.close();
}
await browser.close();
