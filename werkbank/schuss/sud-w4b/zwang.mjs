// zwang.mjs — Die engen Zustaende des Kesselzettels erzwingen und nachmessen:
//   arm      Kasse 0   -> zweite Zeile ist die kostenlose Umstellung, dazu die Preiszeile
//   reich    Kasse gross
//   charge   1970 mit gesperrter Charge
//
//   node zwang.mjs <hafen>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8915);
const browser = await chromium.launch();

const MESS = () => {
  const z = document.querySelector('.sud-zettel');
  if (!z) return null;
  const bue = document.getElementById('buehne');
  const br = bue.getBoundingClientRect();
  const zr = z.getBoundingClientRect();
  const treffbar = (k) => {
    const q = k.getBoundingClientRect();
    if (q.width < 3 || q.height < 3) return false;
    const x = q.left + q.width / 2, y = q.top + q.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
    const t = document.elementFromPoint(x, y);
    return !!(t && (t === k || k.contains(t)));
  };
  return {
    ueber: z.scrollHeight - z.clientHeight,
    flaeche: +(100 * (zr.width * zr.height) / (br.width * br.height)).toFixed(3),
    klasse: z.className,
    zuege: [...z.querySelectorAll('button[data-zug]')].map((k) =>
      k.getAttribute('data-zug') + (treffbar(k) && !k.disabled ? '[an]' : (k.disabled ? '[aus]' : '[verdeckt]'))),
    preiszeile: (z.querySelector('.sud-zpreiszeile') || {}).textContent || null
  };
};

for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (x) => fehler.push(String(x).slice(0, 200)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 200)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1200);

  console.log('=== EPOCHE ' + e);
  for (const [name, kasse] of [['reich', 9999999], ['arm', 0]]) {
    await seite.evaluate((k) => {
      window.BRAUHAUS.welt.haus.kasse = k;
      window.BRAUHAUS.sende('zeichne', { grund: 'probe' });
    }, kasse);
    await seite.waitForTimeout(800);
    const r = await seite.evaluate(MESS);
    console.log('   ' + name.padEnd(7) + ' ueberstand ' + r.ueber + ' px  Flaeche ' + r.flaeche
      + ' %  [' + r.klasse + ']');
    console.log('           ' + r.zuege.join('  '));
    if (r.preiszeile) console.log('           Preiszeile: ' + r.preiszeile);
  }

  if (e === 4) {
    // Eine Charge sperren und nachsehen, ob ihre beiden Knoepfe am Zettel stehen.
    await seite.evaluate(() => {
      const Z = window.BRAUHAUS.SUD_ZUSTAND;
      Z.bottiche.push({ nr: 99, k: 'pils', sorte: 'Pilsner', zeichen: 'P', stufe: 2, fass: 30,
        rein: 0, reifAb: 0, haltbarPur: 8, faktor: 1, hoechst: 3, notsud: false,
        verfahren: 'Probe', notdurft: false, gesperrt: true, seitGesperrt: 0, streuung: 9,
        geprueft: true });
      window.BRAUHAUS.welt.haus.kasse = 0;
      window.BRAUHAUS.sende('zeichne', { grund: 'probe' });
    });
    await seite.waitForTimeout(800);
    const r = await seite.evaluate(MESS);
    console.log('   charge  ueberstand ' + r.ueber + ' px  Flaeche ' + r.flaeche
      + ' %  [' + r.klasse + ']');
    console.log('           ' + r.zuege.join('  '));
  }
  console.log('   Fehler: ' + fehler.length + (fehler.length ? '  ' + fehler[0] : ''));
  await seite.close();
}
await browser.close();
