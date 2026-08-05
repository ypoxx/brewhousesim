/* GREIFT DER DECKEL? — die Gegenprobe zu `max-height: 2em; overflow-y: auto`.
 *
 *   BREITE=1366 HOEHE=768 node werkbank/schuss/stadt-schrift/deckel.mjs <ziel.json>
 *
 * `aufsicht/lesbarkeit.mjs` zaehlt einen rollenden Kasten zu Recht NICHT als
 * abgeschnitten. Wer den Deckel des Bauhofknopfes von `hidden` auf `auto`
 * stellt, koennte sich damit aus der Zahl herausschreiben, ohne dass ein
 * Zeichen mehr zu lesen waere. Also wird nachgesehen, ob ueberhaupt etwas
 * ueber den Deckel hinausragt: scrollHeight gegen clientHeight, Knopf fuer
 * Knopf, in beiden Fenstern, in allen vier Epochen — und auf BEIDEN Seiten
 * des Bauhofs, denn die Verwertungsseite traegt die laengeren Namen
 * ("Schornstein und Dampfmaschine" gegen "Kontor").
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-schrift/deckel.json';
const FENSTER = [{ w: 2752, h: 1536 }, { w: 1920, h: 1000 }, { w: 1366, h: 768 }];

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = { stand: new Date().toISOString() };
let ueber = 0, gezaehlt = 0;

for (const f of FENSTER) {
  for (const e of [1, 2, 3, 4]) {
    const s = await b.newPage({ viewport: { width: f.w, height: f.h } });
    await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
    await s.waitForTimeout(4200);
    const lies = () => s.evaluate(() => [...document.querySelectorAll('.stadt-bauhof .bauzeile .knopf .wort')]
      .map(el => ({ text: (el.textContent || '').trim(),
                    drin: el.scrollHeight, kasten: el.clientHeight,
                    zuviel: Math.max(0, el.scrollHeight - el.clientHeight) })));

    const bau = await lies();
    /* Umschlagen auf die Verwertungsseite — dort stehen die langen Namen. */
    const um = await s.$('[data-zug^="stadt:"][class*="stadt-seite"]:not(.auf)');
    let geld = [];
    if (um) { await um.click({ force: true }).catch(() => {}); await s.waitForTimeout(700); geld = await lies(); }

    const alle = bau.concat(geld);
    const raus = alle.filter(x => x.zuviel > 1);
    ueber += raus.length; gezaehlt += alle.length;
    alles[`${f.w}x${f.h}_e${e}`] = { knoepfe: alle.length, ueber_deckel: raus.length, wer: raus };
    console.log(`${f.w}x${f.h} E${e}: ${alle.length} Bauknoepfe, ${raus.length} ueber dem Deckel` +
                (raus.length ? '  — ' + raus.map(r => `"${r.text.slice(0, 28)}" +${r.zuviel}px`).join(', ') : ''));
    await s.close();
  }
}
await b.close();
alles.summe_knoepfe = gezaehlt;
alles.summe_ueber_deckel = ueber;
alles.urteil = ueber === 0
  ? 'DER DECKEL GREIFT NIRGENDS — es wird nichts verborgen, auch nicht rollend'
  : `${ueber} von ${gezaehlt} Knoepfen ragen ueber den Deckel`;
writeFileSync(ZIEL, JSON.stringify(alles, null, 2));
console.log('\n' + alles.urteil);
