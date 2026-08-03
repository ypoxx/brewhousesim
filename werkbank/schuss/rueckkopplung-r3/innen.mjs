/* INNENANSICHT — dieselbe Hand wie linie.mjs, aber sie schreibt zu jedem
   Michaeli auf, WORAUS die Zahl entstanden ist: die Rechnungsspalte, den
   Anschlag, Ausstoss und Nahrung, die Jahreslast und den Freibetrag.
   Ohne das laesst sich am Bildschirm nicht nachpruefen, warum die Kasse
   waechst — und der Auftrag heisst: an der Kasse reparieren, nicht am Nenner.

   HAFEN=8899 node innen.mjs <epoche> <wochen> <ziel.json>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `/tmp/rk3/innen-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

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
async function klick(zug, warte = 60) {
  let l = await lage(zug);
  if (!l || !l.sichtbar || l.aus) return false;
  if (!l.hit) {
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await seite.waitForTimeout(90);
      l = await lage(zug);
      if (l && l.hit) break;
    }
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(warte);
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
      zuege.push({ zug: el.getAttribute('data-zug'),
        preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        aus: !!el.disabled, hit });
    });
    const n = B.welt.naechsterZug || null;
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length, zuege, deckung: d,
      nennerPreis: n ? n.preis : null, nennerArt: n ? (n.art || null) : null };
  });
}
const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

const michaelis = [];
let abgebrochen = null;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  if (s.woche === 1) {
    /* Die Rechnung dieses Michaeli, BEVOR die Hand etwas kauft. */
    const z = await seite.evaluate(() => {
      const Z = window.BRAUHAUS.preis.lage();
      const sum = (art) => (Z.rechnung || []).filter(r => r.art === art)
        .reduce((a, r) => a + (r.betrag || 0), 0);
      return { jahr: Z.tafelJahr, anschlag: Math.round(Z.anschlag), hoehe: Math.round(Z.hoehe),
        umsatz: Math.round(Z.umsatz), ertrag: Math.round(Z.ertrag),
        rueckstand: Math.round(Z.rueckstand || 0), gestundet: Math.round(Z.gestundet || 0),
        pflicht: Math.round(sum('pflicht')), umlage: Math.round(sum('umlage')),
        rate: Math.round(sum('rate')),
        zeilen: (Z.rechnung || []).map(r => [r.name, Math.round(r.betrag || 0), r.art, r.wurzel || '']),
        kasse: Math.round(window.BRAUHAUS.welt.haus.kasse) };
    });
    z.deckung = s.deckung; z.nennerPreis = s.nennerPreis;
    michaelis.push(z);

    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }
    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();
    const feste = alle(m, /^preis:festlege:/).filter(x => x.preis && Math.abs(x.preis) <= m.kasse * 0.45);
    if (feste.length) {
      const b = feste.reduce((a, x) => (Math.abs(x.preis) < Math.abs(a.preis) ? x : a));
      if (await klick(b.zug, 220)) m = await schirm();
    }
    const ang = alle(m, /^preis:nimm:/).filter(x => x.preis);
    if (ang.length) {
      const b = ang.reduce((a, x) => (Math.abs(x.preis) < Math.abs(a.preis) ? x : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }
    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);
    await klick('fuhre:ziel:bar', 80);
    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(x => !x.preis || Math.abs(x.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze > 0.95) {
    const ab = alle(s, /^fuhre:tafel-ab:/);
    if (ab.length) await klick(ab[ab.length - 1].zug, 60);
  }
  const kaufRoh = s.zuege.find(x => x.zug === 'fuhre:kauf:rohstoff' && !x.aus);
  if (kaufRoh && kaufRoh.preis && s.rohstoff < 40
      && s.kasse >= 3 * Math.abs(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);
  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(x => x.preis);
  if (eng.length) {
    const b = eng.reduce((a, x) => (Math.abs(x.preis) < Math.abs(a.preis) ? x : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }
  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);
  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await klick('weiter', 120))) { abgebrochen = { grund: 'WEITER', i }; break; }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) { abgebrochen = { grund: 'steht', i }; break; }
  }
}

const roh = await seite.evaluate(() => { try { return window.BRAUHAUS.preis.leiter(); } catch (e) { return null; } });
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, hafen: HAFEN, fehler, abgebrochen, michaelis, leiterRoh: roh }, null, 1));
console.log(`E${ep}@${HAFEN} innen: ${michaelis.length} Michaelitage, Seitenfehler ${fehler.length}`, abgebrochen || '');
for (const m of michaelis) {
  console.log(`  ${m.jahr}  Kasse ${String(m.kasse).padStart(7)}  Anschlag ${String(m.anschlag).padStart(7)}`
    + `  Umsatz ${String(m.umsatz).padStart(7)}  Ertrag ${String(m.ertrag).padStart(7)}`
    + `  Pflicht ${String(m.pflicht).padStart(6)}  Umlage ${String(m.umlage).padStart(6)}`
    + `  Nenner ${String(m.nennerPreis).padStart(6)}  Kennzahl ${m.deckung ? m.deckung.toFixed(2) : '—'}`);
}
await browser.close();
