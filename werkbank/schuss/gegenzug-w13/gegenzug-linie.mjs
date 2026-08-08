/* DER GEGENZUG — dieselbe Abnahme wie `gegenzug.mjs`, aber mit der HARTEN
   HAND: der kompetent spielenden Linie aus `rueckkopplung-r3/linie.mjs`.

   WARUM ES DIESE ZWEITE MESSUNG GIBT.  Die einfache Hand (§4b des Urteils:
   füllen, abschicken, WEITER) hortet — sie kauft nichts, legt nichts fest und
   hat deshalb im Schnitt Geld in der Lade und Bier im Keller. Der Kritiker
   hat NICHT so gespielt: er hat gekauft, festgelegt und geliefert, und genau
   dabei standen 457 Züge des Gegners gegen 5 von ihm. Eine Auflage, die nur
   der hortenden Hand standhält, ist nicht erfüllt.

   Die Wochenschleife ist Zeile für Zeile die von `linie.mjs` (Michaelitafel,
   Festlegung, Angebot, Ziel, Fässer auf den Karren, Rohstoff, Engpass, Fuhre,
   WEITER) — damit die Zahlen dieser Messung und die rho-Zahlen der zweiten
   Messlatte aus DERSELBEN Partie stammen.

   Gelesen wird am ANFANG der Woche, vor dem ersten eigenen Handgriff.
   Gedrückt wird KEIN Gegenzug — gemessen wird die Möglichkeit, nicht die Tat.

   HAFEN=8924 node gegenzug-linie.mjs <epoche> <wochen> [ausgabe.json]       */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 100);
const HAFEN = process.env.HAFEN || '8924';
const SAAT = process.env.SAAT || '1350';
const BREITE = +(process.env.BREITE || 1600);
const HOEHE = +(process.env.HOEHE || 900);
const WURZ = '/home/user/brewhousesim/werkbank/schuss/gegenzug-w13';
const ZIEL = process.argv[4] || `${WURZ}/protokoll/linie-e${ep}.json`;

const GEGENZUG = /^gegner:(abloesen|abloesen-blatt|zuvorkommen|abwehren|hinhalten|hinhalten-blatt|beschwerde|beschwerde-bild|gebot|mitbieten)(:|$)/;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try {
    await seite.evaluate(() => new Promise((f) => {
      let ab = false;
      const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) { /* Seite wechselt gerade */ }
}

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
             x: cx, y: cy, preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
             text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}

const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

const BEHARR = 6;
async function klick(zug, warte = 60) {
  let l = null;
  for (let v = 0; v < BEHARR; v++) {
    l = await lage(zug);
    if (!l || !l.sichtbar) { if (v + 1 < BEHARR) await ruhe(60); continue; }
    if (l.aus) return false;
    if (l.hit) break;
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await ruhe(90);
      l = await lage(zug);
      if (l && l.hit) break;
    }
    if (l && l.hit) break;
    if (v + 1 < BEHARR) await ruhe(60);
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await ruhe(warte);
  return true;
}

async function schirm() {
  return await seite.evaluate((muster) => {
    const B = window.BRAUHAUS;
    const re = new RegExp(muster);
    const zuege = [], gegen = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const zug = el.getAttribute('data-zug');
      const r = el.getBoundingClientRect();
      const flaeche = !!(r.width && r.height);
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const imBild = flaeche && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight;
      let hit = false;
      if (imBild) { const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t))); }
      const roh = el.getAttribute('data-preis');
      if (flaeche) zuege.push({ zug, preis: roh === null ? null : +roh, aus: !!el.disabled, hit });
      if (re.test(zug)) gegen.push({ zug, flaeche, imBild, hit, aus: !!el.disabled,
        preis: roh === null ? null : Math.abs(+roh) });
    });
    let d = null;
    try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
    const n = B.welt.naechsterZug || null;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length, deckung: d, nennerPreis: n ? n.preis : null,
      gegnerzuege: (B.welt.gegner[0] || {}).zuege || 0, zuege, gegen };
  }, GEGENZUG.source);
}

const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

const reihe = [];
let abgebrochen = null;
for (let i = 0; i < N; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i }; break; }

  const greifbar = s.gegen.filter(z => z.flaeche && z.imBild && z.hit && !z.aus);
  const bezahlbar = greifbar.filter(z => z.preis === null || z.preis <= s.kasse);
  reihe.push({ n: i + 1, jahr: s.jahr, woche: s.woche, kasse: s.kasse, faesser: s.faesser,
    deckung: s.deckung, nennerPreis: s.nennerPreis, gegnerzuege: s.gegnerzuege,
    gefunden: s.gegen.length, greifbar: greifbar.length, bezahlbar: bezahlbar.length,
    wege: bezahlbar.map(z => z.zug),
    zuteuer: bezahlbar.length ? null : greifbar.map(z => z.zug + ' ' + z.preis).slice(0, 8),
    verhindert: greifbar.length ? null : s.gegen.map(z => z.zug + (z.aus ? '·aus' : '') + (z.hit ? '' : '·verdeckt')).slice(0, 10) });

  /* ---- ab hier Zeile für Zeile die Hand aus rueckkopplung-r3/linie.mjs ---- */
  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }
    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();
    const feste = alle(m, /^preis:festlege:/).filter(z => z.preis && Math.abs(z.preis) <= m.kasse * 0.45);
    if (feste.length) {
      const b = feste.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      if (await klick(b.zug, 220)) m = await schirm();
    }
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    if (ang.length) {
      const b = ang.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }
    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);
    await klick('fuhre:ziel:bar', 80);
    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || Math.abs(z.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze > 0.95) {
    const ab = alle(s, /^fuhre:tafel-ab:/);
    if (ab.length) await klick(ab[ab.length - 1].zug, 60);
  }
  const kaufRoh = s.zuege.find(z => z.zug === 'fuhre:kauf:rohstoff' && !z.aus);
  if (kaufRoh && kaufRoh.preis && s.rohstoff < 40
      && s.kasse >= 3 * Math.abs(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);

  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }

  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);

  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await klick('weiter', 120))) { abgebrochen = { grund: 'WEITER nicht anzufassen', i }; break; }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) { abgebrochen = { grund: 'kein Zug bewegt die Woche', i }; break; }
  }
}

await seite.screenshot({ path: `${WURZ}/schuesse/linie-e${ep}.png` });

const ohne = reihe.filter(r => r.bezahlbar === 0);
const med = (v) => { const s = v.slice().sort((a, b) => a - b); return s.length ? s[s.length >> 1] : null; };
const erg = {
  epoche: ep, saat: SAAT, fenster: BREITE + 'x' + HOEHE, hand: 'linie', wochen: reihe.length,
  abgebrochen,
  wochenOhneBezahlbarenGegenzug: ohne.length,
  wochenOhneGreifbarenGegenzug: reihe.filter(r => r.greifbar === 0).length,
  medianBezahlbar: med(reihe.map(r => r.bezahlbar)),
  medianKasse: med(reihe.map(r => r.kasse)),
  medianFaesser: med(reihe.map(r => r.faesser)),
  medianDeckung: med(reihe.filter(r => r.deckung).map(r => r.deckung)),
  gegnerzuege: reihe.length ? reihe[reihe.length - 1].gegnerzuege - reihe[0].gegnerzuege : 0,
  seitenfehler: fehler.length, fehler: fehler.slice(0, 5),
  leereWochen: ohne.slice(0, 24).map(r => ({ n: r.n, jahr: r.jahr, woche: r.woche, kasse: r.kasse,
    faesser: r.faesser, greifbar: r.greifbar, zuteuer: r.zuteuer, verhindert: r.verhindert }))
};
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ ...erg, reihe }, null, 1));
console.log(JSON.stringify(erg, null, 1).slice(0, 4000));
await browser.close();
