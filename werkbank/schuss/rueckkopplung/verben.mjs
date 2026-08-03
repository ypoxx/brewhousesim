/* VERBLISTE JE EPOCHE (Latte 2, Spalte e) — am Bildschirm gezaehlt.
   node verben.mjs <ausgabe.json>

   Vorgehen: Epoche laden, dann in mehreren Runden jeden Knopf anfassen, der
   ein Brett auf- oder zuklappt (Reiter, Blatt, Tafel, Seite) und KEIN
   Preisschild traegt — also nichts kauft. Nach jeder Runde wird alles
   eingesammelt, was ein data-zug und einen lesbaren Text hat. Was am Ende
   dasteht, ist die Verbliste dieser Epoche.

   Es wird ausdruecklich NICHT die Kopfzeile gemessen, waehrend hier Bretter
   aufgeklappt werden — das waere der eigene Rundgang. Diese Datei misst nur
   die Wortliste.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ZIEL = process.argv[2] || '/tmp/rk/verben.json';
const HAFEN = 8900, SAAT = 1350;
const OEFFNER = /(reiter|blatt|tafel|seite|zeige|karte|griff|buch|chronik|zu$)/;

const browser = await chromium.launch();
const ergebnis = {};

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1000);

  const gesehen = {};
  const ernte = async () => {
    const l = await seite.evaluate(() => [...document.querySelectorAll('[data-zug]')].map(el => {
      const r = el.getBoundingClientRect();
      return { zug: el.getAttribute('data-zug'),
               text: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48),
               preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
               sichtbar: !!(r.width && r.height), aus: !!el.disabled };
    }));
    l.forEach(e => { if (e.sichtbar && e.text && !gesehen[e.zug]) gesehen[e.zug] = e; });
  };

  await ernte();
  for (let runde = 0; runde < 4; runde++) {
    const offen = await seite.evaluate((m) => {
      const re = new RegExp(m);
      return [...document.querySelectorAll('[data-zug]')].filter(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || el.disabled) return false;
        if (el.getAttribute('data-preis')) return false;
        return re.test(el.getAttribute('data-zug'));
      }).map(el => el.getAttribute('data-zug'));
    }, OEFFNER.source);
    for (const z of offen) {
      const l = await seite.evaluate((k) => {
        const el = document.querySelector(`[data-zug="${k}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height || el.disabled) return null;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const t = document.elementFromPoint(cx, cy);
        return (t && (t === el || el.contains(t))) ? { x: cx, y: cy } : null;
      }, z);
      if (!l) continue;
      await seite.mouse.click(l.x, l.y);
      await seite.waitForTimeout(120);
      await ernte();
    }
  }

  ergebnis['e' + ep] = { epoche: ep, fehler, anzahl: Object.keys(gesehen).length, zuege: gesehen };
  await seite.close();
}

fs.writeFileSync(ZIEL, JSON.stringify(ergebnis, null, 1));
for (const k of Object.keys(ergebnis)) console.log(k, ergebnis[k].anzahl, 'Zugschluessel mit Text');
await browser.close();
