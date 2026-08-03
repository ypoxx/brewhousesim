// decke.mjs — Deckt der wandernde Kesselzettel fremde Zuege zu?
// Misst je Epoche: die Rechtecke der Bretter (offen und zugeklappt), die
// Rechtecke der fremden Knoepfe in zugeklapptem Zustand, und ob der Zettel
// nach dem Aufschlagen eines fremden Bretts dessen Knoepfe verdeckt.
//
//   node decke.mjs <hafen>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = +(process.argv[2] || 8915);
const browser = await chromium.launch();

for (const e of [1]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1200);

  console.log('=== EPOCHE ' + e + ' — Bretter im Vorgabestand');
  const bretter = await seite.evaluate(() => {
    const bue = document.getElementById('buehne').getBoundingClientRect();
    return [...document.querySelectorAll('[data-reiter]')].map((b) => {
      const r = b.getBoundingClientRect();
      const kn = [...b.querySelectorAll('button[data-zug]')];
      const gross = kn.filter((k) => { const q = k.getBoundingClientRect();
        return q.width >= 3 && q.height >= 3; }).length;
      return { name: b.getAttribute('data-reiter'), zu: b.classList.contains('stadt-zugeklappt'),
        l: +(100 * (r.left - bue.left) / bue.width).toFixed(1),
        o: +(100 * (r.top - bue.top) / bue.height).toFixed(1),
        b: +(100 * r.width / bue.width).toFixed(1), h: +(100 * r.height / bue.height).toFixed(1),
        knoepfe: kn.length, mitFlaeche: gross };
    });
  });
  bretter.forEach((b) => console.log('   ' + (b.zu ? 'ZU  ' : 'AUF ') + b.name.padEnd(24)
    + b.l + '/' + b.o + '  ' + b.b + 'x' + b.h + ' %   Knoepfe ' + b.knoepfe
    + ', davon mit Flaeche ' + b.mitFlaeche));

  // Jetzt das Wagenbrett der FUHRE aufschlagen und pruefen, ob der Zettel
  // darauf liegt.
  const reiter = await seite.evaluate(() => [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')]
    .map((k) => k.getAttribute('data-zug')));
  console.log('   Reiter: ' + reiter.join(' '));
  for (const r of reiter.filter((x) => /fuhre/.test(x))) {
    await seite.evaluate((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
      if (k) { k.disabled = false; k.click(); } }, r);
    await seite.waitForTimeout(600);
    const t = await seite.evaluate(() => {
      const z = document.querySelector('.sud-zettel');
      const zr = z.getBoundingClientRect();
      const treffbar = (k) => { const q = k.getBoundingClientRect();
        if (q.width < 3 || q.height < 3) return false;
        const x = q.left + q.width / 2, y = q.top + q.height / 2;
        const t = document.elementFromPoint(x, y);
        return !!(t && (t === k || k.contains(t))); };
      const fremd = [...document.querySelectorAll('button[data-zug]')]
        .filter((k) => !z.contains(k) && !k.disabled);
      const zu = fremd.filter((k) => !treffbar(k)).map((k) => {
        const q = k.getBoundingClientRect();
        const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        return k.getAttribute('data-zug') + ' <- ' + (t ? (t.className || t.tagName) : 'nichts');
      });
      return { zettel: z.className, zuegeVerdeckt: zu, zettelKlasse: z.className,
        zettelOrt: [Math.round(zr.left), Math.round(zr.top)] };
    });
    console.log('   nach ' + r + ':  Zettel ' + JSON.stringify(t.zettelOrt) + '  [' + t.zettel + ']');
    t.zuegeVerdeckt.filter((s) => /sud-zettel|sud-z/.test(s))
      .forEach((s) => console.log('        VOM ZETTEL VERDECKT: ' + s));
    console.log('        aktiv aber nicht treffbar: ' + t.zuegeVerdeckt.length);
    await seite.evaluate((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
      if (k) { k.disabled = false; k.click(); } }, r);
    await seite.waitForTimeout(500);
  }
  await seite.close();
}
await browser.close();
