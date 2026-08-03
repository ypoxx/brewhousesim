/* NUR WEITER — die einfachste Schleife, die das Spiel kennt.
   ZUSTAENDIGKEIT 23, Teil 3: ein Spieler, der NICHTS weiss und nichts
   anderes tut, als den einen Knopf zu druecken, den es immer gibt.

   node werkbank/schuss/eichung/nurweiter.mjs

   Verfahren, absichtlich stur:
     1. [data-zug="weiter"] suchen. Gibt es ihn nicht, ist der Lauf zu Ende.
     2. Mittelpunkt bestimmen. document.elementFromPoint MUSS den Knopf
        selbst (oder ein Kind davon) liefern — sonst liegt etwas darueber
        und der Knopf ist fuer die Maus nicht da.
     3. Echter Mausklick auf diesen Punkt (page.mouse.click), kein el.click().
     4. Zaehlen, wie weit Jahr/Woche kommen.

   Abbruchgruende werden benannt, nicht geraten.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BREITE = +(process.env.BREITE || 1920), HOEHE = +(process.env.HOEHE || 1000);
const KLICKS = +(process.env.KLICKS || 200);
const JAHRE = +(process.env.JAHRE || 3);          /* geforderte Braujahre */

const browser = await chromium.launch();
let alleGut = true;

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 140)); });
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${epoche}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(800);

  const stand = () => seite.evaluate(() => ({
    jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    ende: !!BRAUHAUS.welt.zeit.ende, endgrund: BRAUHAUS.welt.zeit.endgrund || '',
    lage: BRAUHAUS.lage.length
  }));

  /* Ist ein Blatt, das oben liegt, mit der Maus zu bedienen? */
  const trifft = (zug) => seite.evaluate((z) => {
    const k = document.querySelector(`[data-zug="${z}"]`);
    if (!k) return null;
    const q = k.getBoundingClientRect();
    if (!q.width || !q.height) return { hit: false, was: 'ohne Flaeche', wort: '' };
    const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
    const t = document.elementFromPoint(cx, cy);
    const kl = t ? (t.className && t.className.baseVal !== undefined ? t.className.baseVal : t.className) : '';
    return {
      hit: !!(t && (t === k || k.contains(t))), wort: (k.textContent || '').trim(),
      was: t ? t.tagName.toLowerCase() + (kl ? '.' + String(kl).trim().split(/\s+/)[0] : '') : 'nichts'
    };
  }, zug);

  const start = await stand();
  let wochen = 0, grund = 'Klickzahl erschoepft', letzte = start, gedeckt = null;
  let georgi = 0, georgiTreffer = 0, georgiDeckel = new Set();

  for (let i = 0; i < KLICKS; i++) {
    /* Zweiter Teil der Auflage: liegt die Georgi-Tafel oben, muss ihr
       Ausgang mit der Maus zu treffen sein — ein Knopf mit dem Wort darauf. */
    const tafel = await trifft('fuhre:sommer-zu');
    if (tafel) {
      georgi++;
      if (tafel.hit) georgiTreffer++; else georgiDeckel.add(tafel.was);
      if (georgi === 1) console.log(`   Georgi-Ausgang: "${tafel.wort}"`);
    }

    const lage = await seite.evaluate(() => {
      const k = document.querySelector('[data-zug="weiter"]');
      if (!k) return { da: false };
      const q = k.getBoundingClientRect();
      if (!q.width || !q.height) return { da: true, sichtbar: false };
      const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
      if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight)
        return { da: true, sichtbar: false, was: 'ausserhalb' };
      const t = document.elementFromPoint(cx, cy);
      const trifft = !!(t && (t === k || k.contains(t)));
      const kl = t ? (t.className && t.className.baseVal !== undefined ? t.className.baseVal : t.className) : '';
      return {
        da: true, sichtbar: true, trifft, cx, cy, aus: k.disabled,
        was: t ? t.tagName.toLowerCase() + (kl ? '.' + String(kl).trim().split(/\s+/)[0] : '') : 'nichts'
      };
    });

    if (!lage.da) { grund = 'kein WEITER mehr im Bild'; break; }
    if (!lage.sichtbar) { grund = 'WEITER hat keine Flaeche (' + (lage.was || '') + ')'; break; }
    if (lage.aus) { grund = 'WEITER ist gesperrt (Spielende)'; break; }
    if (!lage.trifft) { grund = 'WEITER ist verdeckt von ' + lage.was; gedeckt = lage.was; break; }

    await seite.mouse.click(lage.cx, lage.cy);
    await seite.waitForTimeout(70);

    const jetzt = await stand();
    if (jetzt.jahr !== letzte.jahr || jetzt.woche !== letzte.woche) wochen++;
    letzte = jetzt;
    if (jetzt.ende) {
      const w = await trifft('fuhre:wiederanfang');
      grund = 'Spielende (' + (jetzt.endgrund || 'gegenwart') + ')'
        + (w ? ' · Schlussblatt: "' + w.wort + '" ' + (w.hit ? 'zu treffen' : 'VERDECKT von ' + w.was)
             : ' · ohne Schlussblatt der Fuhre');
      break;
    }
    const jahre = jetzt.jahr - start.jahr;
    if (jahre >= JAHRE && jetzt.woche >= 1) { grund = JAHRE + ' Braujahre geschafft'; break; }
  }

  const braujahre = letzte.jahr - start.jahr + (letzte.woche - 1) / 30;
  const gut = braujahre >= JAHRE && !fehler.length && !letzte.lage
    && (georgi === 0 || georgiTreffer === georgi);
  if (!gut) alleGut = false;
  console.log(
    `EPOCHE ${epoche} · ${BREITE}×${HOEHE} — ${wochen} Wochen, ` +
    `${start.jahr}/${start.woche} bis ${letzte.jahr}/${letzte.woche} = ${braujahre.toFixed(2)} Braujahre` +
    `  [${grund}]` + (gedeckt ? ` <- ${gedeckt}` : '') +
    `  Georgi-Ausgang mit der Maus zu treffen: ${georgiTreffer}/${georgi}` +
    (georgiDeckel.size ? ` (verdeckt von ${[...georgiDeckel].join(', ')})` : '') +
    `  lage=${letzte.lage}` + (fehler.length ? `  FEHLER: ${fehler[0]}` : '  keine Fehler auf der Seite') +
    `  ${gut ? 'BESTANDEN' : 'DURCHGEFALLEN'}`);
  await seite.close();
}

await browser.close();
console.log(alleGut ? '\nAlle vier Epochen bestanden.' : '\nNICHT bestanden.');
process.exit(alleGut ? 0 : 1);
