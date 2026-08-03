/* WOHIN GEHT DAS GELD — die Jahresrechnung, aufgeschlüsselt.
   node wohin.mjs <epoche> <wochen> [saat]

   Spielt denselben sparsamen Stil wie messe.mjs (liefern, Rohstoff nachkaufen,
   nicht bauen) und liest an jedem Michaelitag `BRAUHAUS.protokoll` aus:
   was hat das Jahr eingebracht, was hat es gekostet, nach Posten sortiert.

   messe.mjs sagt, DASS die Kasse fällt. Dies sagt, WOFÜR.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 2);
const WOCHEN = +(process.argv[3] || 300);
const SAAT = +(process.argv[4] || 1350);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false, text: '' };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
             x: cx, y: cy, text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}
/* Wie in messe.mjs: notfalls das eigene Brett aufschlagen. Die Platzordnung
   der STADT raeumt weg, was daraufliegen wuerde. */
async function klick(zug, warte = 70) {
  let l = await lage(zug);
  if (!l || !l.sichtbar || l.aus) return false;
  if (!l.hit) {
    const rs = await seite.evaluate(() =>
      [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));
    for (const r of rs) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await seite.waitForTimeout(110);
      l = await lage(zug);
      if (l && l.hit) break;
    }
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(warte);
  return true;
}
const zuKlappt = () => seite.evaluate(() => document.querySelectorAll('.stadt-zugeklappt').length);
async function klappeAuf() { return; }   /* siehe messe.mjs — die Platzordnung macht das ueberfluessig */
const stand = () => seite.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  kasse: BRAUHAUS.welt.haus.kasse, rohstoff: BRAUHAUS.welt.haus.rohstoff,
  protoLaenge: BRAUHAUS.protokoll.length, lage: BRAUHAUS.lage.length
}));

/* Alles, was seit Marke `ab` durch die Kasse ging, nach Posten zusammengefasst.
   Der Posten ist der Text ohne Zahlen und ohne Eigennamen in Klammern. */
const buchAb = (ab) => seite.evaluate((n) => {
  const posten = {};
  BRAUHAUS.protokoll.slice(n).forEach(p => {
    if (!p.preis) return;
    const k = (p.wer || '?') + ' · ' + String(p.was || '')
      .replace(/\d[\d.,]*/g, '#').replace(/\s+/g, ' ').trim().slice(0, 48);
    const e = posten[k] || (posten[k] = { ein: 0, aus: 0, n: 0 });
    if (p.preis > 0) e.ein += p.preis; else e.aus += -p.preis;
    e.n++;
  });
  return posten;
}, ab);

await klappeAuf();

const jahre = [];
let marke = (await stand()).protoLaenge;
let jahrOffen = null;

for (let i = 0; i < WOCHEN; i++) {
  let s = await stand();

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sperre'))) {
      if (!(await klick('fuhre:jahresplan:grut', 90))) await klick('fuhre:jahresplan:duenn', 90);
      await klick('fuhre:sommer-zu', 200);
    }
    if (jahrOffen !== null) {
      jahre.push({ jahr: jahrOffen, kasseAmMichaeli: Math.round(s.kasse), posten: await buchAb(marke) });
    }
    jahrOffen = s.jahr;
    marke = (await stand()).protoLaenge;
    const g = await lage('preis:tafel');
    if (g && /schließen/.test(g.text)) await klick('preis:tafel', 200);
    await klappeAuf();
    s = await stand();
  }

  const vorher = s.jahr * 100 + s.woche;
  if (s.rohstoff !== undefined && s.rohstoff < 30) await klick('fuhre:kauf:rohstoff', 90);
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken', 150);

  let nach = await stand();
  if (nach.jahr * 100 + nach.woche === vorher) {
    let w = await klick('weiter', 150);
    if (!w) {
      await klick('fuhre:sommer-zu', 150);
      await klick('preis:tafel', 150);
      await seite.keyboard.press('Escape');
      await seite.waitForTimeout(120);
      w = await klick('weiter', 150);
    }
    if (!w) { console.log(`# Abbruch in ${s.jahr}/${s.woche}: WEITER nicht klickbar`); break; }
    nach = await stand();
  }
  if (nach.jahr * 100 + nach.woche === vorher) {
    console.log(`# Abbruch in ${s.jahr}/${s.woche}: kein Zug verändert die Woche`); break;
  }
}

await browser.close();

const geld = n => Math.round(n).toLocaleString('de-DE');
console.log(`\nEPOCHE ${EP} · sparsam · Saat ${SAAT} · Seitenfehler ${fehler.length}`);
for (const j of jahre) {
  const l = Object.entries(j.posten).map(([k, v]) => ({ k, ...v, netto: v.ein - v.aus }));
  const ein = l.reduce((s, e) => s + e.ein, 0), aus = l.reduce((s, e) => s + e.aus, 0);
  console.log(`\n── ${j.jahr} ── Kasse am nächsten Michaeli: ${geld(j.kasseAmMichaeli)}`
    + `   (ein ${geld(ein)} · aus ${geld(aus)} · netto ${geld(ein - aus)})`);
  l.sort((a, b) => (b.ein - b.aus) - (a.ein - a.aus));
  for (const e of l) {
    if (!e.ein && !e.aus) continue;
    console.log(`   ${(e.netto >= 0 ? '+' : '') + geld(e.netto).padStart(9)}`
      + `  ein ${geld(e.ein).padStart(8)}  aus ${geld(e.aus).padStart(8)}  ${String(e.n).padStart(3)}×  ${e.k}`);
  }
}
if (fehler.length) console.log('\nFEHLER:\n  ' + fehler.slice(0, 5).join('\n  '));
