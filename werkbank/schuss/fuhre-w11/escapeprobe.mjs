/* ESCAPE — die Abnahme der Auflage des Rahmens an DIE FUHRE.
 *
 *   HAFEN=8952 node werkbank/schuss/fuhre-w11/escapeprobe.mjs nachher-escape
 *
 * Wortlaut der Auflage (`rahmen-w10/ARBEITSSTAND.md`, Punkt 1 fuer Welle 11):
 * „mit aufliegender Sommertafel schliesst Escape sie UND der Chronikgriff
 *  des Rahmens (`kern:chronik`) laesst sich weiter mit Escape schliessen."
 *
 * Gefahren wird je Epoche:
 *   1. 30 x WEITER  → liegt die Sommertafel?
 *   2. Escape       → ist sie fort? sieht die Blattaufsicht des Rahmens die
 *                     Taste (`haushalt.spur()` / `geklemmt()`)?
 *   3. kern:chronik aufschlagen → Escape → ist die Chronik fort?
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8952';
const W = 2752, H = 1536;
const NAME = process.argv[2] || 'escapeprobe';
const ZIEL = 'werkbank/schuss/fuhre-w11/messungen';
mkdirSync(ZIEL, { recursive: true });

const b = await chromium.launch();
const zeilen = [];
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(x.message));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < 30; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(700);
  const vor = await s.evaluate(() => !!document.querySelector('.fu-sommerblatt'));
  await s.keyboard.press('Escape');
  await s.waitForTimeout(600);
  const nach = await s.evaluate(() => !!document.querySelector('.fu-sommerblatt'));

  /* Und jetzt der Griff des Rahmens: Chronik auf, Escape, Chronik zu? */
  const chronikDa = await s.evaluate(() => {
    const k = document.querySelector('[data-zug="kern:chronik"]');
    if (!k) return 'kein Knopf';
    k.click(); return 'geklickt';
  });
  await s.waitForTimeout(600);
  const chronikOffen = await s.evaluate(() => !!document.querySelector('[data-blatt="chronik"]'));
  await s.keyboard.press('Escape');
  await s.waitForTimeout(600);
  const chronikZu = await s.evaluate(() => !document.querySelector('[data-blatt="chronik"]'));
  const wache = await s.evaluate(() => ({
    spur: BRAUHAUS.haushalt.spur(), geklemmt: BRAUHAUS.haushalt.geklemmt(),
    tafeln: BRAUHAUS.haushalt.tafeln().length,
    lage: (BRAUHAUS.lage || []).length,
    verdeckt: (function () { try { return BRAUHAUS.stadt.rahmen.verdeckt().length; } catch (x) { return 'FEHLER'; } })()
  }));
  zeilen.push(`E${e}  Sommertafel vor Escape ${vor}  danach ${nach}`
    + `   ·   Chronik ${chronikDa}, offen ${chronikOffen}, nach Escape zu ${chronikZu}`
    + `   ·   tafeln ${wache.tafeln}  geklemmt ${JSON.stringify(wache.geklemmt)}`
    + `  spur ${JSON.stringify(wache.spur)}  lage ${wache.lage}  verdeckt ${wache.verdeckt}`
    + `  Seitenfehler ${fehler.length}`);
  await s.close();
}
await b.close();
const txt = zeilen.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}.txt`, txt);
