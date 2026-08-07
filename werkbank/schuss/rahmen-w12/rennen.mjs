/* WELLE 12 — DAS RENNEN SICHTBAR MACHEN.
   HAFEN=8940 node rennen.mjs <epoche> <wochen> <ausgabe.json>

   WOZU. Am Stand 7a1a942 spielt 1350 zwei Partien. Der Vergleich der
   Rohdaten (welle11-saat/rho/e1-{A,B,C}.json) zeigt: die Reihen sind bis
   Woche 60 Ziffer fuer Ziffer gleich und gehen in Woche 61 auseinander —
   1352, Woche 1 (Michaeli). Der Unterschied ist EIN KLICK: in der einen
   Partie steht die Michaelitafel DES PREISES offen (LEITER 3 Zeilen), in der
   anderen nicht (LEITER 0 Zeilen).

   DIE HAND IST WORTGLEICH DIE VON rueckkopplung-r3/linie.mjs — Zeile fuer
   Zeile derselbe Ablauf, damit die Partie dieselbe ist. Am fremden Messgeraet
   wird nicht gedreht; das hier ist eine Kopie mit Protokoll, kein Ersatz.

   ZUSAETZLICH:
   * ein Init-Skript umhuellt setTimeout/setInterval/requestAnimationFrame/
     requestIdleCallback und notiert je Aufruf, WELCHE SPIELDATEI ihn
     bestellt hat (aus dem Aufrufstapel) und in welchem Bildaufbau er faellt.
   * jedes B.sende('zeichne') wird mitgeschrieben.
   * an der entscheidenden Stelle (jede Woche 1) wird ein PROTOKOLL des
     sichtbaren Zustands genommen: preis:tafel (Rechteck, disabled, innerText,
     elementFromPoint), .pr-tafel classList, BRAUHAUS.stadt.rahmen.lage().

   WIEDERHOLUNGEN: LAEUFE=3 faehrt drei Laeufe NACHEINANDER in einem
   Messfenster (nie nebeneinander — das verdirbt die Messung, siehe
   aufsicht/messfenster.sh).
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 62);
const ZIEL = process.argv[4] || '/tmp/rennen.json';
const HAFEN = process.env.HAFEN || '8940';
const SAAT = process.env.SAAT || '1350';
const LAEUFE = +(process.env.LAEUFE || 1);
const WARTE = +(process.env.WARTE || 1);
const RUHE = process.env.RUHE !== '0';
const SPUR = process.env.SPUR !== '0';       /* Fertigstellungsprotokoll an/aus */

/* ------------------------------------------------------------------ Init-Skript
   Laeuft VOR jeder Spieldatei. Es aendert nichts am Ablauf: jede umhuellte
   Funktion ruft das Original mit denselben Argumenten und gibt dessen
   Rueckgabewert zurueck. Es SCHREIBT nur mit. */
const SPURSKRIPT = () => {
  const S = { ereignisse: [], bild: 0, an: true, t0: performance.now() };
  window.__spur = S;

  /* Welche Spieldatei hat das bestellt? Oberster Rahmen aus dem Stapel, der
     auf eine Datei des Spiels zeigt. */
  function wer() {
    const e = new Error();
    const z = String(e.stack || '').split('\n');
    for (let i = 2; i < z.length; i++) {
      const m = z[i].match(/\/(spiel\/(?:kern|stuecke)\/[a-z0-9-]+\.js):(\d+)/);
      if (m) return m[1].replace('spiel/', '') + ':' + m[2];
    }
    return '?';
  }
  function notiere(art, quelle, ms, nr) {
    if (!S.an) return;
    S.ereignisse.push({ art, quelle, ms: Math.round(performance.now() - S.t0), soll: ms, nr, bild: S.bild });
  }

  const oST = window.setTimeout, oSI = window.setInterval;
  const oRAF = window.requestAnimationFrame;
  const oRIC = window.requestIdleCallback;

  let lauf = 0;
  window.setTimeout = function (fn, ms, ...r) {
    if (typeof fn !== 'function') return oST.call(window, fn, ms, ...r);
    const q = wer(), nr = ++lauf;
    notiere('setTimeout:bestellt', q, ms, nr);
    return oST.call(window, function () {
      notiere('setTimeout:faellt', q, ms, nr);
      return fn.apply(this, arguments);
    }, ms, ...r);
  };
  window.setInterval = function (fn, ms, ...r) {
    if (typeof fn !== 'function') return oSI.call(window, fn, ms, ...r);
    const q = wer(), nr = ++lauf;
    notiere('setInterval:bestellt', q, ms, nr);
    return oSI.call(window, function () {
      notiere('setInterval:faellt', q, ms, nr);
      return fn.apply(this, arguments);
    }, ms, ...r);
  };
  window.requestAnimationFrame = function (fn) {
    if (typeof fn !== 'function') return oRAF.call(window, fn);
    const q = wer(), nr = ++lauf;
    notiere('rAF:bestellt', q, null, nr);
    return oRAF.call(window, function (t) {
      S.bild++;
      notiere('rAF:faellt', q, null, nr);
      return fn.call(this, t);
    });
  };
  if (oRIC) window.requestIdleCallback = function (fn, o) {
    if (typeof fn !== 'function') return oRIC.call(window, fn, o);
    const q = wer(), nr = ++lauf;
    notiere('rIC:bestellt', q, o && o.timeout, nr);
    return oRIC.call(window, function (d) {
      notiere('rIC:faellt', q, o && o.timeout, nr);
      return fn.call(this, d);
    }, o);
  };

  /* Jedes 'zeichne' mitschreiben — sobald der Ereignisbus da ist. */
  const anhaengen = () => {
    if (!window.BRAUHAUS || !window.BRAUHAUS.sende || window.__spurAnBus) return;
    window.__spurAnBus = true;
    const o = window.BRAUHAUS.sende;
    window.BRAUHAUS.sende = function (name, daten) {
      if (name === 'zeichne') notiere('zeichne', (daten && daten.grund) || '?', null, null);
      return o.apply(this, arguments);
    };
  };
  document.addEventListener('readystatechange', anhaengen);
  oST.call(window, anhaengen, 0);
  oST.call(window, anhaengen, 50);
};

/* --------------------------------------------------------------- ein Lauf
   DROSSEL: Emulation.setCPUThrottlingRate. Sie erzeugt die Phasenlage, die
   sonst nur die Last der Maschine erzeugt — INNERHALB des einen Browsers,
   also ohne einen zweiten Prozess neben der Messung. Damit ist das Rennen
   auf einer ruhigen Maschine reproduzierbar. */
async function einLauf(marke, drossel) {
  const browser = await chromium.launch();
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
  const fehler = [];
  seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  if (SPUR) await seite.addInitScript(SPURSKRIPT);
  if (drossel && drossel > 1) {
    const cdp = await seite.context().newCDPSession(seite);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: drossel });
  }

  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(900);

  async function ruhe(ms) {
    if (!RUHE) { await seite.waitForTimeout(ms); return; }
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

  const BEHARR = +(process.env.BEHARR || 6);

  /* WORTGLEICH linie.mjs — nur der Rueckgabewert ist reicher (Protokoll). */
  const klickSpur = [];
  async function klick(zug, warte = 60) {
    let l = null, versuche = 0, reiterKlicks = 0;
    for (let v = 0; v < BEHARR; v++) {
      versuche++;
      l = await lage(zug);
      if (!l || !l.sichtbar) { if (v + 1 < BEHARR) await ruhe(60); continue; }
      if (l.aus) { klickSpur.push({ zug, ergebnis: 'aus', versuche }); return false; }
      if (l.hit) break;
      for (const r of await reiterListe()) {
        const rl = await lage(r);
        if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
        await seite.mouse.click(rl.x, rl.y); reiterKlicks++;
        await ruhe(90 * WARTE);
        l = await lage(zug);
        if (l && l.hit) break;
      }
      if (l && l.hit) break;
      if (v + 1 < BEHARR) await ruhe(60);
    }
    if (!l || !l.sichtbar || l.aus || !l.hit) {
      klickSpur.push({ zug, ergebnis: !l ? 'fehlt' : (!l.sichtbar ? 'unsichtbar' : (l.aus ? 'aus' : 'nicht-getroffen')),
                       versuche, reiterKlicks });
      return false;
    }
    await seite.mouse.click(l.x, l.y);
    await ruhe(warte * WARTE);
    klickSpur.push({ zug, ergebnis: 'geklickt', versuche, reiterKlicks });
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
      const plan = [...document.querySelectorAll('.fu-planzahl')].map(e => +e.textContent || 0);
      const n = B.welt.naechsterZug || null;
      let d = null;
      try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
      return {
        jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
        kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
        faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
        lage: B.lage.length, plan, zuege,
        amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
        deckung: d,
        nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
        nennerArt: n ? (n.art || null) : null, nennerZug: n ? (n.zug || null) : null
      };
    });
  }

  async function leiter() {
    return await seite.evaluate(() => {
      const z = [...document.querySelectorAll('.pr-leiter .pr-leiter-zeile')].slice(1);
      return z.map(r => [...r.children].map(c => c.textContent.trim()));
    });
  }

  /* DAS PROTOKOLL DER ENTSCHEIDENDEN STELLE. Nur lesen, nie schreiben. */
  async function protokoll(wo) {
    return await seite.evaluate((wo) => {
      const B = window.BRAUHAUS;
      const el = document.querySelector('[data-zug="preis:tafel"]');
      const t = document.querySelector('.pr-tafel');
      const r = el ? el.getBoundingClientRect() : null;
      let oben = null;
      if (r && r.width && r.height) {
        const o = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        oben = o ? (o.className || o.tagName) + '' : null;
      }
      let stadtLage = null, geholt = null;
      try { stadtLage = B.stadt && B.stadt.rahmen ? B.stadt.rahmen.lage() : null; } catch (e) {}
      let prZ = null;
      try { prZ = B.preis && B.preis.lage ? {
        offen: B.preis.lage().offen, weggeklappt: B.preis.lage().weggeklappt,
        erzwungen: B.preis.lage().erzwungen, tafelJahr: B.preis.lage().tafelJahr } : null; } catch (e) {}
      return {
        wo,
        griffText: el ? (el.innerText || '').trim().replace(/\s+/g, ' ') : null,
        griffRect: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
        griffAus: el ? !!el.disabled : null,
        obenAmGriff: oben,
        tafelDa: !!t,
        tafelKlassen: t ? t.className : null,
        tafelRect: t ? (() => { const q = t.getBoundingClientRect();
          return [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)]; })() : null,
        leiterZeilen: document.querySelectorAll('.pr-leiter .pr-leiter-zeile').length,
        sommerblatt: !!document.querySelector('.fu-sommerblatt'),
        stadtLage, prZ,
        spurBis: window.__spur ? window.__spur.ereignisse.length : null,
        bild: window.__spur ? window.__spur.bild : null
      };
    }, wo);
  }

  const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);
  const reihe = [], jahre = [], proto = [];
  let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0;

  for (let i = 0; i < WOCHEN; i++) {
    let s = await schirm();
    if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

    reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
      faesser: s.faesser, plaetze: s.plaetze, amtszeit: s.amtszeit,
      deckung: s.deckung, nennerPreis: s.nennerPreis, nennerArt: s.nennerArt,
      nennerZug: s.nennerZug, nennerWas: s.nennerWas });

    if (s.woche === 1) {
      proto.push(await protokoll('W1:anfang ' + s.jahr));
      if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
        if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
        await klick('fuhre:sommer-zu', 160);
      }
      proto.push(await protokoll('W1:nach-sommer ' + s.jahr));

      const griff = await lage('preis:tafel');
      if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
      proto.push(await protokoll('W1:nach-tafelgriff ' + s.jahr));
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
  const rundenbericht = await seite.evaluate(() => {
    try {
      return window.BRAUHAUS.runde
        ? { bericht: window.BRAUHAUS.runde.bericht(), pruefe: window.BRAUHAUS.runde.pruefe(),
            zeile: window.BRAUHAUS.runde.zeile() }
        : null;
    } catch (e) { return { fehler: String(e) }; }
  });
  const spur = SPUR ? await seite.evaluate(() => window.__spur ? window.__spur.ereignisse : []) : [];
  const kassen = reihe.map(r => r.kasse);
  await browser.close();

  return { marke, drossel, epoche: ep, hafen: HAFEN, saat: SAAT, wochen: reihe.length, fehler, abgebrochen,
    zielGesetzt, festGesetzt, kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
    schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
    jahre: jahre.map(j => ({ jahr: j.jahr, kasseMichaeli: j.kasseMichaeli, leiterZeilen: j.leiter.length })),
    proto, klickSpur, rundenbericht, reihe, spur };
}

/* DROSSEL=1,2,3,4 faehrt je einen Lauf mit dieser Drosselung, nacheinander. */
const DROSSELN = String(process.env.DROSSEL || '1').split(',').map(Number);
const ergebnisse = [];
let k = 0;
for (const dr of DROSSELN) {
  for (let w = 0; w < LAEUFE; w++) {
    const m = String.fromCharCode(65 + (k++)) + '/d' + dr;
    const e = await einLauf(m, dr);
    ergebnisse.push(e);
    console.log(`  Lauf ${m}: ${e.wochen} Wochen, Kasse ${e.kasseMin}–${e.kasseMax}, `
      + `LEITER ${e.jahre.map(j => j.leiterZeilen).join('/')}, `
      + `KasseMich ${e.jahre.map(j => j.kasseMichaeli).join('/')}, Fehler ${e.fehler.length}`);
    if (e.rundenbericht && e.rundenbericht.zeile) console.log('        ' + e.rundenbericht.zeile);
    fs.writeFileSync(ZIEL, JSON.stringify({ hafen: HAFEN, epoche: ep, wochen: WOCHEN, laeufe: ergebnisse }, null, 1));
  }
}
console.log('geschrieben:', ZIEL);
