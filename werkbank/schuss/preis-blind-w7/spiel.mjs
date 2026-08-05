/* DER PREIS, blinder Kritiker Welle 7 — die eigene Hand.
   Spielt mit echten Mausklicks und schreibt Woche fuer Woche mit, was am
   BILDSCHIRM stand: Kasse, jede bepreiste Entscheidung, die man treffen kann,
   die Michaelirechnung mit allen Namen, und jede Buchung im Protokoll.

   HAFEN=8903 node spiel.mjs <epoche> <wochen> <ziel.json> [breite] [hoehe]

   Die Hand ist bewusst NICHT die der Aufsicht: sie nimmt zu Michaeli das
   TEUERSTE Angebot, das sie bezahlen kann (statt des billigsten), weil die
   Frage lautet, ob das Haus je an die teuren Entscheidungen herankommt.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || 'spiel.json';
const BR = +(process.argv[5] || 1366);
const HO = +(process.argv[6] || 768);
const HAFEN = process.env.HAFEN || '8903';
const SAAT = process.env.SAAT || '1350';
const GIER = process.env.GIER !== '0';   /* teuerstes bezahlbares Angebot */

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try {
    await seite.evaluate(() => new Promise((f) => {
      let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) { /* egal */ }
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
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) };
  }, zug);
}
const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

async function klick(zug, warte = 60) {
  let l = null;
  for (let v = 0; v < 6; v++) {
    l = await lage(zug);
    if (!l || !l.sichtbar) { if (v < 5) await ruhe(60); continue; }
    if (l.aus) return false;
    if (l.hit) break;
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y); await ruhe(90);
      l = await lage(zug); if (l && l.hit) break;
    }
    if (l && l.hit) break;
    if (v < 5) await ruhe(60);
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y); await ruhe(warte);
  return true;
}

async function schirm() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let hit = false;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
      const ps = el.querySelector('.preis');
      zuege.push({ zug: el.getAttribute('data-zug'),
        preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        schild: ps ? (ps.innerText || '').replace(/\s+/g, ' ').trim() : '',
        aus: !!el.disabled, hit,
        tx: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 60) });
    });
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
    const n = B.welt.naechsterZug || null;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      ansehen: B.welt.haus.ansehen,
      lage: B.lage.length, zuege, deckung: d,
      nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
      protokollN: B.protokoll.length,
      amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null };
  });
}

/* Die Michaelitafel abschreiben, so wie sie am Schirm steht. */
async function tafelText() {
  return await seite.evaluate(() => {
    const w = document.querySelector('.pr-tafel, .pr-blatt, [class*="pr-tafel"]');
    const t = w ? w.innerText : '';
    const roh = (() => { try { return window.BRAUHAUS.preis.leiter(); } catch (e) { return null; } })();
    return { text: t.replace(/\n{3,}/g, '\n\n'), leiter: roh };
  });
}

const protokollAb = (n) => seite.evaluate((x) => window.BRAUHAUS.protokoll.slice(x)
  .map(p => ({ w: p.wer, s: p.was, p: p.preis, j: p.jahr, wo: p.woche })), n);

const alle = (s, m) => s.zuege.filter(z => m.test(z.zug) && !z.aus);
const bepreist = (s) => s.zuege.filter(z => z.schild && !z.aus && z.hit);

const reihe = [], jahre = [], buchungen = [];
let abbruch = null;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abbruch = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }
  const pn0 = s.protokollN;

  const bp = bepreist(s);
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, ansehen: s.ansehen, amtszeit: s.amtszeit,
    deckung: s.deckung, nennerPreis: s.nennerPreis, nennerWas: s.nennerWas,
    /* am Schirm sichtbar, treffbar, aktiv, mit Preisschild */
    bepreisteZuege: bp.length,
    bezahlbar: bp.filter(z => z.preis === null || Math.abs(z.preis) <= s.kasse || z.preis > 0).length,
    teuerstesSchild: bp.reduce((a, z) => Math.max(a, z.preis ? Math.abs(z.preis) : 0), 0),
    preisZuege: s.zuege.filter(z => /^preis:/.test(z.zug) && !z.aus && z.hit).length });

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }
    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 260);
    let m = await schirm();
    const tafel = await tafelText();

    /* Festlegung: die teuerste, die die Lade traegt und danach noch ein
       Drittel uebrig laesst. */
    const feste = alle(m, /^preis:festlege:/).filter(z => z.preis && Math.abs(z.preis) <= m.kasse * 0.75);
    let festGenommen = null;
    if (feste.length) {
      const b = feste.reduce((a, z) => (Math.abs(z.preis) > Math.abs(a.preis) ? z : a));
      if (await klick(b.zug, 260)) { festGenommen = { zug: b.zug, preis: b.preis }; m = await schirm(); }
    }
    /* Angebot: teuerstes bezahlbares (GIER) bzw. billigstes. */
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    const angebote = ang.map(z => ({ zug: z.zug, preis: z.preis, tx: z.tx }));
    let angGenommen = null;
    if (ang.length) {
      const tragbar = ang.filter(z => Math.abs(z.preis) <= m.kasse);
      if (tragbar.length) {
        const b = GIER ? tragbar.reduce((a, z) => (Math.abs(z.preis) > Math.abs(a.preis) ? z : a))
                       : tragbar.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
        const kv = m.kasse;
        if (await klick(b.zug, 260)) { m = await schirm();
          angGenommen = { zug: b.zug, preis: b.preis, kasseVor: kv, kasseNach: m.kasse }; }
      }
    }
    jahre.push({ jahr: s.jahr, kasseMichaeli: m.kasse, tafel: tafel.text, leiter: tafel.leiter,
      angebote, angGenommen, festGenommen,
      festlegungen: alle(m, /^preis:festlege:/).map(z => ({ zug: z.zug, preis: z.preis })),
      festAlle: m.zuege.filter(z => /^preis:festlege:/.test(z.zug)).map(z => ({ zug: z.zug, preis: z.preis, aus: z.aus })) });

    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 220);
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
  const kr = s.zuege.find(z => z.zug === 'fuhre:kauf:rohstoff' && !z.aus);
  if (kr && kr.preis && s.rohstoff < 40 && s.kasse >= 3 * Math.abs(kr.preis)) await klick('fuhre:kauf:rohstoff', 70);

  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }
  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);

  const vor = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vor) {
    if (!(await klick('weiter', 120))) { abbruch = { grund: 'WEITER tot', i, stand: s.jahr + '/' + s.woche }; break; }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vor) { abbruch = { grund: 'Woche steht', i, stand: s.jahr + '/' + s.woche }; break; }
  }
  const neu = await protokollAb(pn0);
  neu.forEach(b => buchungen.push(b));
}

const schluss = await schirm();
const kassen = reihe.map(r => r.kasse);
fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, breite: BR, hoehe: HO, hafen: HAFEN, saat: SAAT, gier: GIER,
  wochen: reihe.length, fehler, abbruch,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
  jahre, reihe, buchungen
}, null, 1));
console.log(`E${ep} ${BR}x${HO}: ${reihe.length} Wo (${reihe[0] && reihe[0].jahr}–${schluss.jahr}), `
  + `Kasse ${Math.min(...kassen)}–${Math.max(...kassen)}, Buchungen ${buchungen.length}, `
  + `Seitenfehler ${fehler.length}, lage ${schluss.lage}`, abbruch || '');
await browser.close();
