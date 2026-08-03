/* DIE ZWEITE MESSLATTE, am Bildschirm gezaehlt — (a) (b) (c).
   (d) rho kommt aus hand.mjs / rueckkopplung-r3/auswerten.py.

   HAFEN=8899 node latte2.mjs <epoche> <wochen>

   ZUSTAENDIGKEIT 25 — WAS HIER GELESEN WIRD, STEHT DABEI:
   Fuer (a) wird ein Zug nur dann als „erreichbar UND aktiv" gezaehlt, wenn
   ALLE DREI zutreffen:
     * er traegt ein Preisschild  (`data-preis` gesetzt)
     * das Spiel sagt nicht nein  (`data-soll-aus` !== "1")
     * er ist wirklich anzufassen (`elementFromPoint` trifft ihn, Flaeche > 0)
   `disabled` allein reicht nicht: ein Knopf mit `disabled` und
   `data-soll-aus="0"` ist VERDECKT und damit ein Fehler, kein Zustand. Beide
   Zahlen werden getrennt ausgewiesen, damit der Unterschied sichtbar bleibt.

   Die Hand ist die grobe: WEITER, dazwischen ein Zug. Gezaehlt wird der
   Bildschirm, nicht die Partie — deshalb reicht sie hier. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 90);
const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const fehler = [];
s.on('pageerror', x => fehler.push(x.message));
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1200);

const blick = () => s.evaluate(() => {
  const B = window.BRAUHAUS;
  let schild = 0, aktivSoll = 0, aktivDisabled = 0, verdeckt = 0, stumm = 0;
  const namen = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    const soll = el.getAttribute('data-soll-aus');
    if (el.disabled && soll === '0') verdeckt++;
    if (soll === null) stumm++;
    if (!el.hasAttribute('data-preis')) return;
    schild++;
    if (hit && soll !== '1') { aktivSoll++; namen.push(el.getAttribute('data-zug')); }
    if (hit && !el.disabled) aktivDisabled++;
  });
  const g = B.protokoll.filter(p => p.wer === 'gegner').length;
  const fest = (B.welt.chronik || []).filter(c => c && c.art === 'festlegung').length;
  const siegel = [...document.querySelectorAll('[data-zug^="preis:festlege:"]')].length;
  return { schild, aktivSoll, aktivDisabled, verdeckt, stumm, namen,
    gegner: g, fest, siegel, jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
    ende: !!B.welt.zeit.ende, lage: B.lage.length };
});

let max = { aktivSoll: 0, aktivDisabled: 0, schild: 0, siegel: 0 };
let verdecktSumme = 0, stummSumme = 0, w = 0;
let gegnerVorher = (await blick()).gegner;
const reihe = [];

for (; w < WOCHEN; w++) {
  const v = await blick();
  if (v.ende) break;
  reihe.push(v);
  max.aktivSoll = Math.max(max.aktivSoll, v.aktivSoll);
  max.aktivDisabled = Math.max(max.aktivDisabled, v.aktivDisabled);
  max.schild = Math.max(max.schild, v.schild);
  max.siegel = Math.max(max.siegel, v.siegel);
  verdecktSumme += v.verdeckt;
  stummSumme += v.stumm;
  const z = await s.$$('[data-zug]:not([disabled])');
  if (z.length > 3) { await z[3].click({ timeout: 1500 }).catch(() => {}); await s.waitForTimeout(80); }
  const wt = await s.$('[data-zug="weiter"]:not([disabled])');
  if (!wt) break;
  await wt.click({ timeout: 2000 }).catch(() => {});
  await s.waitForTimeout(80);
}

const e = await blick();
const median = (a) => { const v = [...a].sort((x, y) => x - y); return v.length ? v[v.length >> 1] : 0; };
console.log(`E${ep}@${HAFEN} nach ${w} Wochen (${e.jahr}/${e.woche}):`);
console.log(`  (a) Preisschilder gleichzeitig am Schirm: Median ${median(reihe.map(r => r.schild))}, hoechstens ${max.schild}`);
console.log(`      davon erreichbar UND aktiv  — nach data-soll-aus gelesen: Median ${median(reihe.map(r => r.aktivSoll))}, hoechstens ${max.aktivSoll}`);
console.log(`      dieselbe Zahl               — nach disabled  gelesen:     Median ${median(reihe.map(r => r.aktivDisabled))}, hoechstens ${max.aktivDisabled}`);
console.log(`  (b) Siegelknoepfe gleichzeitig: hoechstens ${max.siegel} · Chronikzeilen art='festlegung': ${e.fest}`);
console.log(`  (c) Protokollzeilen des Gegners: ${e.gegner - gegnerVorher} in ${w} Wochen`);
console.log(`      Knoepfe OHNE data-soll-aus (Kern 9868aaa greift nicht): ${stummSumme} Sichtungen`);
console.log(`      disabled mit data-soll-aus="0" (verdeckt = Fehler): ${verdecktSumme} Sichtungen`);
console.log(`  lage ${e.lage}, Seitenfehler ${fehler.length}`);
await b.close();
