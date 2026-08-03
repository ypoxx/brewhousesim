// siegel.mjs — HAELT DAS SIEGEL? Und zwar auf JEDEM Weg zurueck, nicht nur
// auf dem naechstliegenden.
//
//   node siegel.mjs <epoche> <hafen> <ausgabe.json>
//
// Ablauf je Achse mit einer unwiderruflichen Festlegung:
//   1. Das Geld herbeischaffen (der Messstand darf das; gekauft wird danach
//      mit der Maus wie ein Spieler).
//   2. Brett aufschlagen, Festlegung mit der MAUS kaufen.
//   3. Sechs Wochen weiterspielen.
//   4. Dann jeden Rueckweg einzeln versuchen und protokollieren:
//      W1 Brettknopf der Vorgabe, echter Mausklick
//      W2 derselbe Knopf, vorher zwangsweise aktiviert, echter Mausklick
//      W3 derselbe Knopf, synthetisches click-Ereignis
//      W4 Zettelknopf sud:zettel-wechsel-frei
//      W5 Zettelknopf sud:zettel-wechsel-kauf
//      W6 jede andere Option derselben Achse, zwangsweise aktiviert
//      W7 nach dem Erbfall (neuer Braumeister) noch einmal W2
//      W8 nach Rohstoffmangel (Notsud) noch einmal W2
//   Nach jedem Versuch wird Z.verfahren und Z.fest gelesen.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const HAFEN = +(process.argv[3] || 8911);
const AUS = process.argv[4] || '/tmp/siegel.json';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 240)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 240)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const stand = () => seite.evaluate(() => ({
  verfahren: JSON.parse(JSON.stringify(window.BRAUHAUS.SUD_ZUSTAND.verfahren)),
  fest: Object.keys(window.BRAUHAUS.SUD_ZUSTAND.fest),
  kasse: Math.round(window.BRAUHAUS.welt.haus.kasse),
  jahr: window.BRAUHAUS.welt.zeit.jahr, woche: window.BRAUHAUS.welt.zeit.woche,
  meister: window.BRAUHAUS.welt.zeit.meister || (window.BRAUHAUS.welt.haus.meister || null),
  brettZu: !!window.BRAUHAUS.SUD_ZUSTAND.brettZu
}));

const knopfLage = (zug) => seite.evaluate((z) => {
  const k = document.querySelector(`button[data-zug="${z}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  return { x, y, aus: !!k.disabled, trifft: !!(t && (t === k || k.contains(t))),
           text: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 70) };
}, zug);

async function mausAuf(zug, { zwing = false } = {}) {
  if (zwing) await seite.evaluate((z) => {
    const k = document.querySelector(`button[data-zug="${z}"]`);
    if (k) { k.disabled = false; k.removeAttribute('aria-disabled'); }
  }, zug);
  const p = await knopfLage(zug);
  if (!p) return { weg: 'kein Knopf' };
  if (p.aus && !zwing) return { weg: 'abgeschaltet', trifft: p.trifft };
  if (!p.trifft) return { weg: 'verdeckt', aus: p.aus };
  await seite.mouse.click(p.x, p.y);
  await seite.waitForTimeout(120);
  return { geklickt: true, war: p };
}

async function synth(zug) {
  return seite.evaluate((z) => {
    const k = document.querySelector(`button[data-zug="${z}"]`);
    if (!k) return 'kein Knopf';
    k.disabled = false;
    k.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    return 'abgeschickt';
  }, zug);
}

async function woche(n = 1) {
  for (let i = 0; i < n; i++) {
    await seite.evaluate(() => {
      const s = document.querySelector('button[data-zug="fuhre:sommer-zu"]');
      if (s && !s.disabled) s.click();
    });
    const p = await knopfLage('weiter');
    if (p && !p.aus && p.trifft) { await seite.mouse.click(p.x, p.y); }
    else await seite.evaluate(() => {
      const k = document.querySelector('button[data-zug="weiter"]');
      if (k) { k.disabled = false; k.click(); }
    });
    await seite.waitForTimeout(70);
  }
}

// Welche Achsen und Optionen es in dieser Epoche gibt — vom Bildschirm, nicht
// aus der Datei: alle sud:<achse>:<option>-Knoepfe des aufgeschlagenen Bretts.
async function brettAuf() {
  const zu = await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
  if (zu) await mausAuf('stadt:reiter:sud-sud-brett');
  await seite.waitForTimeout(150);
}
async function brettZu() {
  const zu = await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
  if (!zu) await mausAuf('stadt:reiter:sud-sud-brett');
  await seite.waitForTimeout(150);
}

await brettAuf();
const optionen = await seite.evaluate(() => [...document.querySelectorAll('button[data-zug^="sud:"]')]
  .map((k) => k.getAttribute('data-zug'))
  .filter((z) => z.split(':').length === 3 && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(z))
  .map((z) => {
    const k = document.querySelector(`button[data-zug="${z}"]`);
    const t = (k.innerText || '').replace(/\s+/g, ' ');
    const m = t.match(/−([\d.,]+)/);
    return { zug: z, achse: z.split(':')[1], k: z.split(':')[2],
             preis: m ? +m[1].replace(/\./g, '').replace(',', '.') : 0, text: t.slice(0, 60) };
  }));

const bericht = { epoche: EPOCHE, optionen, versuche: [], fehler };

// Je Achse: die teuerste "unwiderrufliche" Option kaufen und danach zurueck wollen.
const achsen = [...new Set(optionen.map((o) => o.achse))];
for (const achse of achsen) {
  const dieser = optionen.filter((o) => o.achse === achse);
  const vorgabe = dieser[0];                       // erste Option = Vorgabe
  const teuer = dieser.filter((o) => o.preis > 0).sort((a, b) => b.preis - a.preis)[0];
  if (!teuer) continue;

  // Geld herbeischaffen — nur damit die Festlegung ueberhaupt kaufbar ist.
  await seite.evaluate((p) => { window.BRAUHAUS.welt.haus.kasse = p * 3 + 1000;
    window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); }, teuer.preis);
  await seite.waitForTimeout(200);
  await brettAuf();

  const vor = await stand();
  const kauf = await mausAuf(teuer.zug);
  await seite.waitForTimeout(200);
  const nach = await stand();
  const eintrag = { achse, vorgabe: vorgabe.zug, gekauft: teuer.zug, preis: teuer.preis,
                    kauf, vorKauf: vor, nachKauf: nach, wege: [] };

  if (nach.verfahren[achse] !== teuer.k) {
    eintrag.hinweis = 'Kauf hat nicht gegriffen';
    bericht.versuche.push(eintrag);
    await brettZu();
    continue;
  }

  await brettZu();
  await woche(6);
  await brettAuf();
  eintrag.nachSechsWochen = await stand();

  const probe = async (name, tu) => {
    const v = await stand();
    const r = await tu();
    await seite.waitForTimeout(150);
    const n = await stand();
    eintrag.wege.push({ weg: name, ergebnis: r,
      vorher: v.verfahren[achse], nachher: n.verfahren[achse],
      zurueck: n.verfahren[achse] !== v.verfahren[achse] });
    // Falls doch zurueckgesprungen: sofort wieder festsetzen, damit die
    // folgenden Wege denselben Ausgangsstand haben.
    if (n.verfahren[achse] !== v.verfahren[achse]) {
      await seite.evaluate(([a, k]) => { window.BRAUHAUS.SUD_ZUSTAND.verfahren[a] = k;
        window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); }, [achse, teuer.k]);
      await seite.waitForTimeout(120);
    }
  };

  await probe('W1 Brettknopf Vorgabe, echte Maus', () => mausAuf(vorgabe.zug));
  await probe('W2 Brettknopf Vorgabe, zwangsweise aktiviert, echte Maus',
    () => mausAuf(vorgabe.zug, { zwing: true }));
  await probe('W3 Brettknopf Vorgabe, synthetisches click-Ereignis', () => synth(vorgabe.zug));
  for (const o of dieser) {
    if (o.zug === teuer.zug) continue;
    await probe('W6 ' + o.zug + ' zwangsweise aktiviert', () => mausAuf(o.zug, { zwing: true }));
  }
  await brettZu();
  await probe('W4 sud:zettel-wechsel-frei', () => mausAuf('sud:zettel-wechsel-frei'));
  await probe('W5 sud:zettel-wechsel-kauf', () => mausAuf('sud:zettel-wechsel-kauf'));
  eintrag.zettelNachSiegel = {
    frei: await knopfLage('sud:zettel-wechsel-frei'),
    kauf: await knopfLage('sud:zettel-wechsel-kauf'),
    gaerraum: await knopfLage('sud:zettel-gaerraum')
  };

  // W7 — der Erbfall. Vierzig Jahre gibt es nicht; wir spielen bis der
  // Braumeister wechselt, hoechstens 12 Jahre.
  const m0 = (await stand()).meister;
  let jahre = 0;
  while (jahre < 12) {
    await woche(30); jahre++;
    const s = await stand();
    if (s.meister !== m0) break;
  }
  eintrag.nachErbfall = await stand();
  await brettAuf();
  await probe('W7 nach ' + jahre + ' Jahren (Erbfall) Vorgabe zwangsweise', () => mausAuf(vorgabe.zug, { zwing: true }));

  // W8 — Rohstoff auf null: der Notsud faehrt nach Vorgabe. Bleibt das Siegel?
  await seite.evaluate(() => { window.BRAUHAUS.welt.haus.rohstoff = 0; });
  await brettZu(); await woche(3); await brettAuf();
  eintrag.nachNotsud = await stand();
  await probe('W8 nach Rohstoffmangel Vorgabe zwangsweise', () => mausAuf(vorgabe.zug, { zwing: true }));
  await brettZu();

  bericht.versuche.push(eintrag);
}

writeFileSync(AUS, JSON.stringify(bericht, null, 1));
console.log('EPOCHE ' + EPOCHE + ': ' + bericht.versuche.length + ' Achsen mit Festlegung geprueft');
for (const v of bericht.versuche) {
  const zurueck = v.wege.filter((w) => w.zurueck);
  console.log('  ' + v.achse + ' <- ' + v.gekauft + ' (' + v.preis + '): '
    + v.wege.length + ' Wege probiert, ' + zurueck.length + ' fuehrten zurueck'
    + (zurueck.length ? ' >>> ' + zurueck.map((w) => w.weg).join(' | ') : ''));
}
console.log('Fehler: ' + fehler.length);
await browser.close();
