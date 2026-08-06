/* WARUM GIBT DIE HAND KEIN ZIEL AN?  (Welle 9, Rueckverschlechterung)

   Der einzige Unterschied in den ersten 16 Wochen von 1350 zwischen dem
   Vorzustand (Hafen 8912) und dem Welle-8-Stand ist EIN Klick:

       klick fuhre:ziel:bar        — im Vorzustand da, im neuen fehlt er

   Alles danach (sieben ausgefallene `fuhre:tafel-ab:grut`, der ausgefallene
   Rohstoffkauf, die Kasse 80 statt 62 ab Woche 2) haengt daran.

   Dieses Geraet fragt den Knopf an derselben Stelle, an der `linie.mjs:klick`
   ihn fragt — Mitte des Rechtecks, `document.elementFromPoint` — und schreibt
   dazu, WER dort statt seiner liegt.

       node werkbank/schuss/stadt-w9/zielknopf.mjs <hafen> [epoche]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.argv[2] || '8921';
const EP = +(process.argv[3] || 1);
const BREIT = +(process.env.BREIT || 1920);
const HOCH = +(process.env.HOCH || 1000);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BREIT, height: HOCH }, deviceScaleFactor: 1 });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const marke = await (await fetch(`http://127.0.0.1:${HAFEN}/.messstand-marke`).catch(() => null))?.text?.() || '?';

const b = await seite.evaluate(() => {
  const raus = [];
  document.querySelectorAll('[data-zug^="fuhre:ziel:"]').forEach((el) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let deckel = null;
    if (r.width && r.height && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      if (t && !(t === el || el.contains(t))) {
        const dr = t.getBoundingClientRect();
        deckel = {
          tag: t.tagName, klasse: String(t.className || '').slice(0, 80),
          zug: t.getAttribute && t.getAttribute('data-zug'),
          fach: (function (n) { while (n && n !== document.body) { if (n.id) return n.id; n = n.parentNode; } return null; })(t),
          kasten: [Math.round(dr.left), Math.round(dr.top), Math.round(dr.right), Math.round(dr.bottom)]
        };
      }
    }
    raus.push({
      zug: el.getAttribute('data-zug'), aus: !!el.disabled,
      kasten: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
      sichtbar: !!(r.width && r.height), deckel
    });
  });
  return raus;
});

console.log(`Hafen ${HAFEN} (${String(marke).trim()}) Epoche ${EP} bei ${BREIT}x${HOCH}`);
b.forEach((z) => {
  console.log(`  ${z.zug.padEnd(22)} sichtbar=${z.sichtbar} aus=${z.aus} kasten=${z.kasten.join(',')}`);
  console.log(`      ${z.deckel ? 'ZUGEDECKT von ' + z.deckel.tag + '.' + z.deckel.klasse
    + (z.deckel.zug ? ' [' + z.deckel.zug + ']' : '') + ' in #' + z.deckel.fach
    + ' ' + z.deckel.kasten.join(',') : 'frei — der Zeiger trifft ihn'}`);
});
if (!b.length) console.log('  KEIN fuhre:ziel:* im DOM');
await browser.close();
