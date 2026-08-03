/* DAS ABNAHMETOR DER AUFSICHT.
 *
 *   node werkbank/schuss/aufsicht/tor.mjs        # Arbeitsbaum auf 8899
 *   HAFEN=8900 node werkbank/schuss/aufsicht/tor.mjs
 *
 * Die Mindestbedingung, bevor irgendetwas committet wird: alle vier Epochen
 * laden, BRAUHAUS.lage ist leer, keine Konsolenfehler, und es stehen Zuege da.
 *
 * WARUM DIESE DATEI IM REPO LIEGT: sie lag bis zum 3. August 2026 nur im
 * Scratchpad der Aufsicht und ist bei einem Container-Reset zweimal
 * verschwunden. `spielprobe.mjs` und `deckung.mjs` daneben haben ueberlebt,
 * weil sie committet waren. Ein Messgeraet, das den naechsten Reset nicht
 * uebersteht, ist beim naechsten Mal keins.
 *
 * Das Tor prueft NUR, dass die Seite steht. Ob sie sich noch SPIELEN laesst,
 * prueft spielprobe.mjs daneben — nach einer Kernaenderung immer beide.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';

const b = await chromium.launch();
let schlecht = 0;

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const f = [];
  s.on('console', m => { if (m.type() === 'error') f.push(m.text()); });
  s.on('pageerror', x => f.push('pageerror: ' + x.message));

  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=${SAAT}`,
               { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);

  const d = await s.evaluate(() => ({
    lage:  (BRAUHAUS.lage || []).length,
    wo:    (BRAUHAUS.lage || []).slice(0, 3).map(x => String((x && x.wo) || x)),
    jahr:  BRAUHAUS.welt && BRAUHAUS.welt.zeit ? BRAUHAUS.welt.zeit.jahr : null,
    zuege: document.querySelectorAll('[data-zug]').length,
  }));

  const ok = d.lage === 0 && f.length === 0 && d.zuege > 0;
  if (!ok) schlecht++;
  console.log(`E${e}: ${ok ? 'OK  ' : 'FEHL'} jahr=${d.jahr} zuege=${d.zuege} ` +
              `lage=${d.lage}${d.wo.length ? ' (' + d.wo.join('|') + ')' : ''} fehler=${f.length}`);
  f.slice(0, 3).forEach(x => console.log('    ! ' + x.slice(0, 160)));
  await s.close();
}

await b.close();
console.log(schlecht === 0 ? 'TOR OFFEN' : `TOR ZU — ${schlecht} von 4 Epochen fehlerhaft`);
process.exit(schlecht === 0 ? 0 : 1);
