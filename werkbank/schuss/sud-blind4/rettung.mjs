// rettung.mjs — Wenn der Kesselzettel beiseite liegt: kommt der Spieler ueber
// den Reiter noch an die Bierentscheidung?
//
//   node rettung.mjs <epoche> <hafen> <ausgabe.json>
//
// Sorgfaeltig gespielt. In JEDER Woche wird zuerst der Zettel gemessen; ist
// dort keine Bierwahl bedienbar, wird DAS SUDHAUS aufgeschlagen (mit der Maus,
// und so lange gewartet, bis der Rahmen der STADT es wirklich aufgeklappt hat)
// und dort noch einmal gemessen. Danach wieder zu.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const HAFEN = +(process.argv[3] || 8911);
const AUS = process.argv[4] || '/tmp/rettung.json';
const ROH = [40, 65, 120, 340][EPOCHE - 1];
const STARTJAHR = [1350, 1600, 1884, 1970][EPOCHE - 1];
const WECHSEL = ['sud:zettel-wechsel-frei', 'sud:zettel-wechsel-kauf'];

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const SUD = () => {
  const B = window.BRAUHAUS;
  const l = [...document.querySelectorAll('button[data-zug^="sud:"]')].map((k) => {
    const r = k.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
    const t = drin ? document.elementFromPoint(x, y) : null;
    return { zug: k.getAttribute('data-zug'), aus: !!k.disabled,
             sollAus: k.getAttribute('data-soll-aus') === '1',
             trifft: !!(t && (t === k || k.contains(t))), drin };
  });
  const z = document.querySelector('.sud-zettel');
  return { knoepfe: l, brettZu: !!B.SUD_ZUSTAND.brettZu,
           zettelKlasse: z ? z.className : null,
           zettelBreite: z ? Math.round(z.getBoundingClientRect().width) : 0,
           jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
           endgrund: B.welt.zeit.endgrund || null, kasse: Math.round(B.welt.haus.kasse) };
};
const lage = (z) => seite.evaluate((zz) => {
  const k = document.querySelector(`button[data-zug="${zz}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  return { x, y, aus: !!k.disabled, trifft: !!(t && (t === k || k.contains(t))) };
}, z);
const klick = async (z, w = 40) => {
  const p = await lage(z);
  if (!p || p.aus || !p.trifft) return false;
  await seite.mouse.click(p.x, p.y); await seite.waitForTimeout(w); return true;
};
const reiter = async () => {
  const p = await lage('stadt:reiter:sud-sud-brett');
  if (!p || p.aus || !p.trifft) return false;
  await seite.mouse.click(p.x, p.y); return true;
};

// Brett wirklich aufschlagen: Reiter druecken, bis Z.brettZu faellt und ein
// Optionsknopf von der Maus getroffen wird.
async function brettAuf(probe) {
  for (let i = 0; i < 5; i++) {
    const zu = await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
    if (!zu && probe) { const p = await lage(probe); if (p && p.trifft) return true; }
    if (zu) await reiter();
    await seite.waitForTimeout(300);
  }
  const p = probe ? await lage(probe) : null;
  return !!(p && p.trifft);
}
async function brettZu() {
  for (let i = 0; i < 4; i++) {
    if (await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu)) return true;
    await reiter();
    await seite.waitForTimeout(300);
  }
  return false;
}

// Welche Optionsknoepfe hat diese Epoche? Einmal aufschlagen und nachsehen.
await brettAuf(null);
await seite.waitForTimeout(500);
const OPT = (await seite.evaluate(SUD)).knoepfe.map((k) => k.zug)
  .filter((z) => z.split(':').length === 3 && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(z));
await brettZu();
await seite.waitForTimeout(400);

const wochen = [];
let abbruch = null;
for (let w = 0; w < 500; w++) {
  await klick('fuhre:sommer-zu');
  const zettel = await seite.evaluate(SUD);
  const lebt = (s, z) => { const k = s.knoepfe.find((x) => x.zug === z); return !!(k && !k.aus && k.trifft); };
  const amZettel = WECHSEL.filter((z) => lebt(zettel, z));

  // Nur wenn der Zettel nichts hergibt: den Reiter versuchen.
  let brett = null, aufgeschlagen = null;
  if (amZettel.length < 2) {
    aufgeschlagen = await brettAuf(OPT[0]);
    await seite.waitForTimeout(250);
    brett = await seite.evaluate(SUD);
    await brettZu();
    await seite.waitForTimeout(200);
  }
  wochen.push({ w: w + 1, jahr: zettel.jahr, woche: zettel.woche, kasse: zettel.kasse,
    zettelKlasse: zettel.zettelKlasse, zettelBreite: zettel.zettelBreite,
    amZettel, aufgeschlagen,
    amBrett: brett ? OPT.map((z) => ({ zug: z, lebt: lebt(brett, z),
      sollAus: (brett.knoepfe.find((x) => x.zug === z) || {}).sollAus })) : null });

  // Sonst sorgfaeltig weiterspielen.
  const roh = await seite.evaluate(() => Math.round(window.BRAUHAUS.welt.haus.rohstoff));
  if (roh < ROH / 2) { await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60);
    await klick('fuhre:kauf:rohstoff'); await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60); }
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  if (!await klick('fuhre:fuellen')) await klick('fuhre:wie-vorige');
  await klick('fuhre:abschicken', 70);
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  await klick('sud:zettel-anstich');
  await klick('sud:zettel-charge-frei');

  const z2 = await seite.evaluate(() => ({ jahr: window.BRAUHAUS.welt.zeit.jahr,
    ende: !!window.BRAUHAUS.welt.zeit.ende, grund: window.BRAUHAUS.welt.zeit.endgrund || null }));
  if (z2.ende) { abbruch = 'ende ' + z2.grund; break; }
  if (z2.jahr >= STARTJAHR + 14) break;
  if (!await klick('weiter', 45)) {
    await seite.evaluate(() => { const k = document.querySelector('button[data-zug="weiter"]');
      if (k) { k.disabled = false; k.click(); } });
    await seite.waitForTimeout(45);
  }
}

const n = wochen.length;
const zettelWeg = wochen.filter((x) => /beiseite/.test(x.zettelKlasse || '')).length;
const beideAmZettel = wochen.filter((x) => x.amZettel.length === 2).length;
const geprueft = wochen.filter((x) => x.amBrett);
const brettRettet = geprueft.filter((x) => x.amBrett.filter((o) => o.lebt).length >= 2).length;
const brettEineWahl = geprueft.filter((x) => x.amBrett.filter((o) => o.lebt).length === 1).length;
const brettNichts = geprueft.filter((x) => x.amBrett.filter((o) => o.lebt).length === 0).length;
const aufNicht = geprueft.filter((x) => !x.aufgeschlagen).length;

writeFileSync(AUS, JSON.stringify({ epoche: EPOCHE, abbruch, fehler, optionen: OPT, wochen }, null, 0));
console.log('=== EPOCHE ' + EPOCHE + '  ' + n + ' Wochen, ' + wochen[0].jahr + '–'
  + wochen[n - 1].jahr + (abbruch ? '  [' + abbruch + ']' : ''));
console.log('  Zettel liegt beiseite (display:none) in ' + zettelWeg + '/' + n
  + ' (' + (100 * zettelWeg / n).toFixed(1) + ' %)');
console.log('  Beide Bierwahlen AM ZETTEL bedienbar: ' + beideAmZettel + '/' + n
  + ' (' + (100 * beideAmZettel / n).toFixed(1) + ' %)');
console.log('  In den uebrigen ' + geprueft.length + ' Wochen wurde DAS SUDHAUS aufgeschlagen:');
console.log('     Reiter brachte das Brett nicht auf: ' + aufNicht);
console.log('     danach >= 2 Optionen bedienbar: ' + brettRettet
  + '   genau 1: ' + brettEineWahl + '   keine: ' + brettNichts);
const rettbar = beideAmZettel + brettRettet;
console.log('  ZUSAMMEN: Bierentscheidung mit mehr als einem Knopf erreichbar in '
  + rettbar + '/' + n + ' (' + (100 * rettbar / n).toFixed(1) + ' %) der Wochen');
console.log('  Fehler: ' + fehler.length);
await browser.close();
