// werkbank/sud-lauf.mjs — der lange Lauf.
//   node werkbank/sud-lauf.mjs <wochen> <stil:faul|fleissig> [saat]
//
// faul     = nur WEITER klicken. Prueft, ob DER SUD das Spiel verschlechtert.
// fleissig = jede Woche anstechen, jede bezahlbare Festlegung nehmen.
//            Prueft, ob DER SUD ueberhaupt etwas bewirkt.
//
// Liest die Kennzahl der zweiten Latte AM BILDSCHIRM ab ("Kasse reicht N×").

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const WOCHEN = +(process.argv[2] || 200);
const STIL = process.argv[3] || 'faul';
const SAAT = +(process.argv[4] || 7);

const browser = await chromium.launch();

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${epoche}&saat=${SAAT}`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(700);

  const deckungen = [];
  let geklickt = 0, stillWochen = 0, letzterStand = '', letzte = null, letzteWoche = 0;

  for (let w = 0; w < WOCHEN; w++) {
    if (STIL === 'fleissig') {
      // Echte Mausklicks im Zettel — das Brett bleibt zu, wie im Vorgabestand.
      geklickt += await seite.evaluate(() => {
        let n = 0;
        const nimm = (zug) => {
          const k = document.querySelector(`button[data-zug="${zug}"]`);
          if (k && !k.disabled) { k.click(); n++; }
        };
        nimm('sud:zettel-anstich');
        nimm('sud:zettel-wechsel-kauf');
        return n;
      });
    }
    const weiter = await seite.$('button[data-zug="weiter"]');
    if (!weiter) break;
    try { await weiter.click({ timeout: 3000 }); } catch { break; }

    const s = await seite.evaluate(() => {
      const el = document.querySelector('.deckung, [class*="deckung"]');
      const kopf = document.getElementById('ebene-kopf');
      const text = kopf ? (kopf.innerText || '') : '';
      const m = text.match(/Kasse reicht ([\d.,]+)×/);
      const Z = window.BRAUHAUS.SUD_ZUSTAND, W = window.BRAUHAUS.welt;
      return {
        deckung: m ? m[1] : null,
        jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende,
        stand: [W.haus.kasse, W.haus.rohstoff, W.vorrat.faesser.length,
                Z.bottiche.length, Math.round(Z.guete), Z.gesamtFass].join('|'),
        sude: Z.gesamtSude, fass: Z.gesamtFass,
        gaer: Z.bottiche.reduce((n, b) => n + b.fass, 0),
        gaerpl: window.BRAUHAUS.sud.gaerkeller.plaetze(),
        guete: Math.round(Z.guete),
        kasse: Math.round(W.haus.kasse),
        lager: W.vorrat.faesser.length,
        durch: W.vorrat.faesser.filter((f) => f.sudDurch).length,
        halt: W.vorrat.faesser.length
          ? +(W.vorrat.faesser.reduce((n, f) => n + (f.haltbar || 0), 0) / W.vorrat.faesser.length).toFixed(1) : 0,
        lage: window.BRAUHAUS.lage.length
      };
    });
    if (s.deckung) deckungen.push(+s.deckung.replace(/\./g, '').replace(',', '.'));
    if (s.stand === letzterStand) stillWochen++; else stillWochen = 0;
    letzterStand = s.stand;
    letzte = s; letzteWoche = w + 1;
    if (s.ende) break;
  }
  {
    const s = letzte || {};
    const w = (letzteWoche || 1) - 1;
    {
      console.log(`\nEPOCHE ${epoche} · ${STIL} · nach ${w + 1} Wochen (${s.jahr}/${s.woche})`
        + (s.ende ? ' — DAS SPIEL IST ZU ENDE' : ''));
      console.log('  Kasse ' + s.kasse + ' · Lager ' + s.lager + ' (davon ' + s.durch
        + ' durch den Gärkeller) · Haltbarkeit im Schnitt ' + s.halt + ' Wochen');
      console.log('  Gärkeller ' + s.gaer + '/' + s.gaerpl + ' · Güte ' + s.guete
        + ' · ' + s.sude + ' Sude · ' + s.fass + ' Fass angestellt'
        + (STIL === 'fleissig' ? ' · ' + geklickt + ' SUD-Klicks' : ''));
      const d = deckungen.filter((x) => !isNaN(x));
      if (d.length) {
        const min = Math.min(...d), max = Math.max(...d);
        const drittel = Math.floor(d.length / 3);
        const mit = (a) => a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : 0;
        console.log('  Kennzahl (Kasse reicht N×, vom Bildschirm abgelesen): '
          + 'min ' + min + ' · max ' + max
          + ' · Drittel ' + mit(d.slice(0, drittel)) + ' / ' + mit(d.slice(drittel, 2 * drittel))
          + ' / ' + mit(d.slice(2 * drittel)));
      }
      console.log('  Längste Folge unveränderter Wochen: ' + stillWochen);
      console.log('  BRAUHAUS.lage: ' + s.lage);
    }
  }
  console.log('  ' + (fehler.length ? 'FEHLER: ' + fehler.join(' | ') : 'keine Fehler auf der Seite'));
  await seite.close();
}
await browser.close();
