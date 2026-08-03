/* DIE GEGENPROBE — aendert DAS ERBE die Partie der anderen?
   node werkbank/schuss/erbe/probe.mjs <epoche>

   Nur WEITER, bis zum Ende. Verglichen wird gegen die Zahlen, die vor dem Bau
   dieses Stuecks gemessen wurden (werkbank/schuss/erbe/erbfall.mjs):
     1350  1353/13  braurecht-entzogen  103 Klicks
     1600  1603/13  reihe-gestrichen    103
     1884  1887/11  bank-verwertet      101
     1970  1973/9   brauereisterben      99
   Dazu: die Kennzahl der zweiten Latte in Woche 1 und am Ende, die Zahl der
   Zuege am Bildschirm, und ob die Erbtafel etwas verdeckt.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
s.on('pageerror', e => fehler.push('pageerror: ' + e.message));
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);

const schau = () => s.evaluate(() => {
  const kopf = document.querySelector('.deckung');
  const zuege = [...document.querySelectorAll('[data-zug]')].map(e => {
    const q = e.getBoundingClientRect();
    if (q.width < 2 || q.height < 2) return null;
    const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
    return { zug: e.getAttribute('data-zug'), preis: e.getAttribute('data-preis'),
             aktiv: !e.disabled, frei: !!(t && (t === e || e.contains(t))) };
  }).filter(Boolean);
  /* Deckt die Erbtafel etwas Fremdes zu? Sie ist pointer-events:none, also
     prueft man das an den Rechtecken, nicht am Treffer. */
  const t = document.querySelector('.erb-leiste');
  let deckt = [];
  if (t) {
    const r = t.getBoundingClientRect();
    document.querySelectorAll('.fach > *').forEach(e => {
      if (e === t || e.closest('.fach').getAttribute('data-stueck') === 'erbe') return;
      if (e.classList.contains('stadt-zugeklappt')) return;
      const q = e.getBoundingClientRect();
      if (q.width < 8 || q.height < 8) return;
      const w = Math.min(r.right, q.right) - Math.max(r.left, q.left);
      const h = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
      if (w > 0 && h > 0) deckt.push(e.className + ' ' + Math.round(w * h / (r.width * r.height) * 100) + '%');
    });
  }
  return {
    kennzahl: kopf ? (kopf.innerText || '').replace(/\s+/g, ' ').trim() : null,
    zuege: zuege.length,
    zuegeMitPreis: zuege.filter(z => z.preis).length,
    aktivMitPreis: zuege.filter(z => z.preis && z.aktiv && z.frei).length,
    erbeZuege: zuege.filter(z => z.zug.startsWith('erbe:')),
    verdeckt: zuege.filter(z => !z.frei && z.aktiv).map(z => z.zug),
    tafelDeckt: deckt
  };
});

const w1 = await schau();
let klicks = 0; const nenner = [];
for (let i = 0; i < 140; i++) {
  const ok = await s.evaluate(() => {
    const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
      const q = e.getBoundingClientRect(); if (!q.width) return false;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return !!(t && (t === e || e.contains(t))); };
    const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
      if (e && !e.disabled) { e.click(); return true; } return false; };
    if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
    if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
      if (frei('weiter')) break; r.click();
    }
    return tu('weiter');
  });
  await s.waitForTimeout(45);
  klicks++;
  /* Kapert DAS ERBE die Kennzahl der zweiten Latte? Jede Woche nachsehen,
     wessen Zug der Kern gerade als naechsten nennt. */
  const nz = await s.evaluate(() => { const z = BRAUHAUS.welt.naechsterZug;
    return z ? (z.zug || z.was) + '|' + z.art : null; });
  if (nz) nenner.push(nz);
  if (!ok) break;
}
const ende = await s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  endgrund: BRAUHAUS.welt.zeit.endgrund || null, kasse: BRAUHAUS.welt.haus.kasse,
  keller: BRAUHAUS.welt.vorrat.faesser.length,
  lage: BRAUHAUS.lage.length, lageText: BRAUHAUS.lage.map(l => l.text),
  erbe: BRAUHAUS.erbe.stand(),
  handlohn: BRAUHAUS.welt.chronik.filter(c => /Handlohn/i.test(c.text)).map(c => c.jahr + ': ' + c.text),
  erbfallZeilen: BRAUHAUS.welt.chronik.filter(c => c.art === 'erbfall').map(c => c.jahr + '/' + c.woche + ' ' + c.text)
}));
const meine = nenner.filter(n => n.startsWith('erbe:')).length;
console.log(JSON.stringify({ epoche: EP, klicks, woche1: w1, ende,
  nennerErbe: meine, nennerGesamt: nenner.length, nennerArten: [...new Set(nenner.map(n=>n.split('|')[1]))],
  seitenfehler: fehler.length, fehler: fehler.slice(0, 4) }, null, 1));
await b.close();
