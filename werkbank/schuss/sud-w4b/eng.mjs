// eng.mjs — Der Zettel in der Klemme. Alle fremden Bretter aufschlagen und
// nachsehen, ob DER SUD dann noch am Schirm steht und Knoepfe hat.
//
//   node eng.mjs <hafen>
//
// Das ist der Fall, an dem Auflage 1 haengt: `display:none` ueber einem
// Zettel, dessen Kauf das Spiel ausdruecklich erlaubt.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8914);
const browser = await chromium.launch();

for (const e of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (x) => fehler.push('pageerror: ' + String(x).slice(0, 200)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1200);

  const stand = () => seite.evaluate(() => {
    const z = document.querySelector('.sud-zettel');
    if (!z) return { da: false };
    const r = z.getBoundingClientRect();
    const bue = document.getElementById('buehne');
    const br = bue ? bue.getBoundingClientRect() : { width: 1, height: 1, left: 0, top: 0 };
    const treffbar = (k) => {
      const q = k.getBoundingClientRect();
      if (q.width < 3 || q.height < 3) return false;
      const x = q.left + q.width / 2, y = q.top + q.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false;
      const t = document.elementFromPoint(x, y);
      return !!(t && (t === k || k.contains(t)));
    };
    const kn = [...z.querySelectorAll('button[data-zug]')];
    return { da: true, klasse: z.className,
      links: +(100 * (r.left - br.left) / br.width).toFixed(1),
      oben: +(100 * (r.top - br.top) / br.height).toFixed(1),
      b: +(100 * r.width / br.width).toFixed(2), h: +(100 * r.height / br.height).toFixed(2),
      knoepfe: kn.length, bedienbar: kn.filter((k) => !k.disabled && treffbar(k)).length,
      verdeckt: kn.filter((k) => k.getAttribute('data-verdeckt') === '1').length,
      sollAus: kn.filter((k) => k.getAttribute('data-soll-aus') === '1').length,
      sitz: window.BRAUHAUS.SUD_ZUSTAND.zettelSitz };
  });

  // Alle Reiter fremder Bretter druecken (nicht das eigene).
  const reiter = await seite.evaluate(() => [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')]
    .map((k) => k.getAttribute('data-zug')).filter((s) => !/sud-sud-brett/.test(s)));
  const vorher = await stand();
  const t0 = Date.now();
  for (const r of reiter) {
    await seite.evaluate((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
      if (k && !k.disabled) k.click(); }, r);
    await seite.waitForTimeout(90);
  }
  await seite.waitForTimeout(1400);
  const nachher = await stand();
  // Wie lange braucht ein Takt in der Klemme?
  const takt = await seite.evaluate(() => {
    const t = performance.now();
    for (let i = 0; i < 5; i++) {
      // taktZugeklappt laeuft im Intervall; hier nur die Zeit eines Bildes messen
      document.querySelector('.sud-zettel').getBoundingClientRect();
    }
    return +(performance.now() - t).toFixed(2);
  });

  console.log('=== EPOCHE ' + e + '   ' + reiter.length + ' fremde Bretter aufgeschlagen'
    + '   (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
  console.log('   vorher : ' + JSON.stringify(vorher));
  console.log('   nachher: ' + JSON.stringify(nachher));
  console.log('   Fehler: ' + fehler.length + (fehler.length ? '  ' + fehler[0] : ''));
  await seite.close();
}
await browser.close();
