// heil.mjs — Ist es heil? Vier Epochen laden, BRAUHAUS.lage, Konsolenfehler,
// Knopfzahlen, und was am Kesselzettel steht.
//
//   node heil.mjs <hafen>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8914);
const browser = await chromium.launch();

for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (x) => fehler.push('pageerror: ' + String(x).slice(0, 300)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1600);

  const r = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const kn = [...document.querySelectorAll('button[data-zug]')];
    const treffbar = (k) => {
      const q = k.getBoundingClientRect();
      if (q.width < 3 || q.height < 3) return false;
      const x = q.left + q.width / 2, y = q.top + q.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
      const t = document.elementFromPoint(x, y);
      return !!(t && (t === k || k.contains(t)));
    };
    const z = document.querySelector('.sud-zettel');
    const zr = z ? z.getBoundingClientRect() : null;
    const bue = document.getElementById('buehne');
    const br = bue ? bue.getBoundingClientRect() : { width: 1, height: 1 };
    const gesperrt = kn.filter((k) => k.disabled);
    return {
      lage: B.welt.lage ? B.welt.lage.length : (B.lage ? B.lage.length : null),
      brauhausLage: (window.BRAUHAUS.lage || []).length,
      jahr: B.welt.zeit.jahr,
      knoepfe: kn.length, aktiv: kn.filter((k) => !k.disabled).length,
      treffbar: kn.filter((k) => !k.disabled && treffbar(k)).length,
      gesperrt: gesperrt.length,
      gesperrtSollAus: gesperrt.filter((k) => k.getAttribute('data-soll-aus') === '1').length,
      gesperrtVerdeckt: gesperrt.filter((k) => k.getAttribute('data-verdeckt') === '1').length,
      gesperrtBrettZu: gesperrt.filter((k) => /^brett-/.test(k.getAttribute('data-aus-grund')||'')).length,
      gesperrtOhneAttribut: gesperrt.filter((k) => !k.hasAttribute('data-soll-aus')).length,
      zettel: z ? {
        klasse: z.className,
        b: +(100 * zr.width / br.width).toFixed(2), h: +(100 * zr.height / br.height).toFixed(2),
        flaeche: +(100 * (zr.width * zr.height) / (br.width * br.height)).toFixed(3),
        zuege: [...z.querySelectorAll('button[data-zug]')].map((k) =>
          k.getAttribute('data-zug') + (k.disabled ? ' [aus]' : ' [an]')),
        text: z.innerText.replace(/\n+/g, ' | ').slice(0, 260)
      } : null,
      sudBrettZuege: [...document.querySelectorAll('button[data-zug^="sud:"]')]
        .map((k) => k.getAttribute('data-zug')).filter((s) => s.split(':').length === 3
          && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(s))
    };
  });
  console.log('=== EPOCHE ' + e + '  ' + r.jahr);
  console.log('   BRAUHAUS.lage = ' + r.brauhausLage + '   Fehler = ' + fehler.length);
  console.log('   Knoepfe ' + r.knoepfe + '  aktiv ' + r.aktiv + '  aktiv+treffbar ' + r.treffbar);
  console.log('   gesperrt ' + r.gesperrt + '  davon soll-aus ' + r.gesperrtSollAus
    + '  verdeckt ' + r.gesperrtVerdeckt + '  brett-zu ' + r.gesperrtBrettZu
    + '  ganz ohne Attribut ' + r.gesperrtOhneAttribut);
  if (r.zettel) {
    console.log('   Zettel ' + r.zettel.b + ' % x ' + r.zettel.h + ' % = '
      + r.zettel.flaeche + ' % der Buehne   [' + r.zettel.klasse + ']');
    console.log('   Zettel-Zuege: ' + r.zettel.zuege.join('  '));
    console.log('   Zettel-Text : ' + r.zettel.text);
  } else console.log('   KEIN ZETTEL');
  console.log('   Brett-Optionen: ' + r.sudBrettZuege.join(' '));
  fehler.forEach((f) => console.log('   !! ' + f));
  await seite.close();
}
await browser.close();
