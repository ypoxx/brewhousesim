/* SUDHAND — eine SORGFAELTIG gespielte Partie, die den SUD wirklich bedient.
   Grundlage der Wirtschaft ist Zeile fuer Zeile die Hand aus
   werkbank/schuss/rueckkopplung-r3/linie.mjs (nicht angefasst, nur kopiert und
   um die Sudgriffe erweitert), damit die Zahlen der zweiten Latte vergleichbar
   bleiben.

   HAFEN=8917 STIL=reich node sudhand.mjs <epoche> <wochen> <ziel.json>

   STIL=reich  nimmt auf jeder Achse die TEUERSTE bezahlbare Karte (also die
               unwiderrufliche, sobald die Kasse sie traegt)
   STIL=arm    nimmt auf jeder Achse die teuerste KOSTENLOSE Karte und kauft nie
   STIL=blind  ruehrt den SUD gar nicht an (Gegenprobe)
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `/tmp/sudw6/e${ep}.json`;
const HAFEN = process.env.HAFEN || '8917';
const SAAT = process.env.SAAT || '1350';
const STIL = process.env.STIL || 'reich';
const WARTE = +(process.env.WARTE || 1);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
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
  } catch (e) {}
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

const BEHARR = +(process.env.BEHARR || 6);
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
      await ruhe(90 * WARTE);
      l = await lage(zug);
      if (l && l.hit) break;
    }
    if (l && l.hit) break;
    if (v + 1 < BEHARR) await ruhe(60);
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await ruhe(warte * WARTE);
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
        aus: !!el.disabled, hit,
        soll: el.getAttribute('data-soll-aus'), grund: el.getAttribute('data-aus-grund'),
        verdeckt: el.getAttribute('data-verdeckt') });
    });
    const n = B.welt.naechsterZug || null;
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
    let z = null; try { z = JSON.parse(JSON.stringify(B.sud.zustand())); } catch (e) {}
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length, zuege,
      amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      deckung: d,
      nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
      nennerArt: n ? (n.art || null) : null, nennerZug: n ? (n.zug || null) : null,
      sud: z ? { verfahren: z.verfahren, fest: z.fest, guete: z.guete, zusatz: z.zusatz,
                 gesamtSude: z.gesamtSude, gesamtFass: z.gesamtFass, jahrFehl: z.jahrFehl,
                 jahrAnzeige: z.jahrAnzeige, gestuftGesamt: z.gestuftGesamt,
                 bottiche: (z.bottiche || []).length, gemeldet: z.gemeldet, kalt: z.kalt,
                 gesamtLegte: z.gesamtLegte } : null
    };
  });
}

async function leiter() {
  return await seite.evaluate(() => {
    const z = [...document.querySelectorAll('.pr-leiter .pr-leiter-zeile')].slice(1);
    return z.map(r => [...r.children].map(c => c.textContent.trim()));
  });
}

const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

/* ---- Sudbrett aufschlagen und die Achsen ablesen ------------------------ */
const SUDREITER = 'stadt:reiter:sud-sud-brett';
const zu = () => seite.evaluate(() => {
  const el = document.querySelector('button[data-zug^="sud:"][data-aus-grund="brett-zugeklappt"]');
  return !!el;
});
async function sudAuf() {
  for (let v = 0; v < 3; v++) {
    if (!(await zu())) return true;
    const l = await lage(SUDREITER);
    if (!l || !l.sichtbar || l.aus || !l.hit) return false;
    await seite.mouse.click(l.x, l.y);
    await ruhe(200 * WARTE);
  }
  return !(await zu());
}

/* Alle Sudknoepfe mit voller Auskunft. */
async function sudBild() {
  return await seite.evaluate(() => {
    const raus = [];
    document.querySelectorAll('button[data-zug^="sud:"]').forEach(el => {
      const r = el.getBoundingClientRect();
      const sicht = !!(r.width && r.height);
      let hit = false;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (sicht && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
      raus.push({ zug: el.getAttribute('data-zug'), sicht, hit, aus: !!el.disabled,
        soll: el.getAttribute('data-soll-aus'), grund: el.getAttribute('data-aus-grund'),
        verdeckt: el.getAttribute('data-verdeckt'),
        preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : 0,
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
    });
    return raus;
  });
}

/* --------------------------------------------------------------- DIE HAND */

const reihe = [], jahre = [], sudtaten = [], sudwochen = [];
let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, amtszeit: s.amtszeit,
    deckung: s.deckung, nennerPreis: s.nennerPreis, nennerArt: s.nennerArt,
    nennerZug: s.nennerZug, nennerWas: s.nennerWas, sud: s.sud });

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
      if (await klick(b.zug, 220)) { festGesetzt++; m = await schirm(); }
    }
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    if (ang.length) {
      const b = ang.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }
    jahre.push({ jahr: s.jahr, kasseMichaeli: m.kasse, leiter: await leiter() });
    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);
    if (await klick('fuhre:ziel:bar', 80)) zielGesetzt++;
    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || Math.abs(z.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  /* ------------------------------------------------------ DER SUD */
  if (STIL !== 'blind') {
    await sudAuf();
    const bild = await sudBild();
    const vorher = await schirm();
    sudwochen.push({ n: i, jahr: vorher.jahr, woche: vorher.woche, kasse: vorher.kasse,
      bild: bild.map(b => ({ z: b.zug, a: b.aus ? 1 : 0, s: b.soll, g: b.grund,
        v: b.verdeckt, h: b.hit ? 1 : 0, p: b.preis })) });

    /* Achsen: Zug 'sud:<achse>:<option>' — mehrere Knoepfe an derselben Frage */
    const achsen = {};
    bild.forEach(b => {
      const t = b.zug.split(':');
      if (t.length === 3 && !/^zettel|^charge/.test(t[1])) {
        (achsen[t[1]] = achsen[t[1]] || []).push(b);
      }
    });
    for (const a of Object.keys(achsen)) {
      const frei = achsen[a].filter(b => !b.aus && b.hit);
      if (!frei.length) continue;
      let wahl = null;
      if (STIL === 'reich') {
        const bezahlbar = frei.filter(b => Math.abs(b.preis) <= vorher.kasse * 0.5);
        if (bezahlbar.length) wahl = bezahlbar.reduce((x, y) => Math.abs(y.preis) > Math.abs(x.preis) ? y : x);
      } else if (STIL === 'arm') {
        const gratis = frei.filter(b => !b.preis);
        if (gratis.length) wahl = gratis[gratis.length - 1];
      }
      if (wahl) {
        const k0 = vorher.kasse;
        const ok = await klick(wahl.zug, 140);
        if (ok) {
          const na = await schirm();
          sudtaten.push({ n: i, jahr: vorher.jahr, woche: vorher.woche, zug: wahl.zug,
            preis: wahl.preis, kasseVor: k0, kasseNach: na.kasse,
            verfahrenNach: na.sud && na.sud.verfahren, festNach: na.sud && na.sud.fest,
            gueteVor: vorher.sud && vorher.sud.guete, gueteNach: na.sud && na.sud.guete });
        }
      }
    }

    /* Gaerraum, wenn der Keller eng wird */
    let st = await schirm();
    if (st.plaetze && st.faesser / st.plaetze > 0.8) {
      const g = (await sudBild()).find(b => b.zug === 'sud:gaerraum' && !b.aus && b.hit);
      if (g && Math.abs(g.preis) <= st.kasse * 0.4) {
        const k0 = st.kasse;
        if (await klick('sud:gaerraum', 120)) {
          const na = await schirm();
          sudtaten.push({ n: i, jahr: st.jahr, woche: st.woche, zug: 'sud:gaerraum',
            preis: g.preis, kasseVor: k0, kasseNach: na.kasse,
            plaetzeVor: st.plaetze, plaetzeNach: na.plaetze });
        }
      }
    }

    /* Hefe fuehren und Anstich — die kleinen wiederkehrenden Wahlen */
    const b2 = await sudBild();
    const hf = b2.find(b => b.zug === 'sud:hefe-fuehren' && !b.aus && b.hit);
    if (hf) {
      const v = await schirm();
      if (await klick('sud:hefe-fuehren', 100)) {
        const na = await schirm();
        sudtaten.push({ n: i, jahr: v.jahr, woche: v.woche, zug: 'sud:hefe-fuehren', preis: 0,
          gueteVor: v.sud && v.sud.guete, gueteNach: na.sud && na.sud.guete,
          faesserVor: v.faesser, faesserNach: na.faesser });
      }
    }
    const b3 = await sudBild();
    const an = b3.filter(b => /^sud:anstich-/.test(b.zug) && !b.aus && b.hit);
    if (an.length) {
      const v = await schirm();
      const wahl = STIL === 'reich' ? 'sud:anstich-jung' : 'sud:anstich-alt';
      const nimm = an.find(b => b.zug === wahl) || an[0];
      if (await klick(nimm.zug, 100)) {
        const na = await schirm();
        sudtaten.push({ n: i, jahr: v.jahr, woche: v.woche, zug: nimm.zug, preis: 0,
          auswahl: an.length,
          gueteVor: v.sud && v.sud.guete, gueteNach: na.sud && na.sud.guete,
          faesserVor: v.faesser, faesserNach: na.faesser });
      }
    }
    /* Chargen: freigeben oder verschneiden — zwei Knoepfe an derselben Frage */
    const b4 = await sudBild();
    const ch = b4.filter(b => /^sud:charge-/.test(b.zug) && !b.aus && b.hit);
    if (ch.length) {
      const v = await schirm();
      const wahl = STIL === 'reich' ? ch.find(b => /schnitt/.test(b.zug)) : ch.find(b => /frei/.test(b.zug));
      const nimm = wahl || ch[0];
      if (await klick(nimm.zug, 120)) {
        const na = await schirm();
        sudtaten.push({ n: i, jahr: v.jahr, woche: v.woche, zug: nimm.zug, preis: 0,
          auswahl: ch.length, gueteVor: v.sud && v.sud.guete, gueteNach: na.sud && na.sud.guete });
      }
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
    if (!(await klick('weiter', 120))) {
      abgebrochen = { grund: 'WEITER nicht anzufassen', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) {
      abgebrochen = { grund: 'kein Zug veraendert die Woche', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
  }
}

const schluss = await schirm();
const roh = await seite.evaluate(() => { try { return window.BRAUHAUS.preis.leiter(); } catch (e) { return null; } });
/* Was am Schirm ueber das Bier steht — Wort fuer Wort, ohne Nachrechnen. */
const bierText = await seite.evaluate(() => {
  const raus = {};
  const g = (s) => { const e = document.querySelector(s); return e ? e.innerText.trim().replace(/\s+/g, ' ').slice(0, 400) : null; };
  raus.siegelzeilen = [...document.querySelectorAll('.sud-siegelzeile')].map(e => e.innerText.trim().replace(/\s+/g, ' '));
  raus.schilder = [...document.querySelectorAll('.sud-schild')].map(e => e.innerText.trim());
  raus.gewaehlt = [...document.querySelectorAll('.sud-karte.gewaehlt .knopf')].map(e => e.innerText.trim().replace(/\s+/g, ' '));
  raus.kessel = g('.sud-zettel');
  raus.brett = g('.sud-brett');
  return raus;
});
const kassen = reihe.map(r => r.kasse);
fs.mkdirSync(ZIEL.replace(/\/[^/]*$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, stil: STIL, hafen: HAFEN, saat: SAAT, wochen: reihe.length, fehler, abgebrochen,
  zielGesetzt, festGesetzt,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  leiterRoh: roh, bierText,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage,
             amtszeit: schluss.amtszeit, sud: schluss.sud },
  sudtaten, jahre, reihe, sudwochen
}, null, 1));
const rk = (roh || []).filter(r => r && r.zugVerh).map(r => r.zugVerh);
console.log(`E${ep}/${STIL}: ${reihe.length} W (${reihe[0] && reihe[0].jahr}-${schluss.jahr}) `
  + `Kasse ${Math.min(...kassen)}-${Math.max(...kassen)} KENNZAHL ${rk.length ? Math.min(...rk).toFixed(2) + '-' + Math.max(...rk).toFixed(2) : '—'} ueber ${rk.length} J `
  + `Sudtaten ${sudtaten.length} verfahren=${JSON.stringify(schluss.sud && schluss.sud.verfahren)} `
  + `fest=${JSON.stringify(schluss.sud && schluss.sud.fest)} Fehler ${fehler.length}`, abgebrochen || '');
await browser.close();
