/* DIE TAFEL ERST AUFSCHLAGEN, DANN ZAEHLEN.
   Kopie von decke2.mjs mit dem einen Handgriff, der fehlte: den Reiter der
   STADT druecken, wenn die Tafel eingeklappt ist.

   Urspruenglicher Kopf:
   WER LIEGT AUF DER MICHAELITAFEL — IN DER GESPIELTEN PARTIE.
   Kopie von hand.mjs. Sie spielt genau dieselbe Partie und schreibt zu jedem
   Michaeli zusaetzlich auf, WELCHES Element `elementFromPoint` an der Stelle
   jeder Karte zurueckgibt, wenn die Karte nicht getroffen wird.
   Noetig, weil `decke.mjs` (die Hand, die NICHT spielt) das Haus nach gut drei
   Braujahren zusperrt und die verdeckten Jahre gar nicht erreicht.

   Urspruenglicher Kopf:
   DER PREIS — die Hand des blinden Kritikers, Welle 5.

   HAFEN=8900 node hand.mjs <epoche> <wochen> <ausgabe.json>

   Abstammung: wortgleich `werkbank/schuss/rueckkopplung-r3/linie.mjs`
   (ZUSTAENDIGKEIT 16: am fremden Messgeraet wird nicht gedreht — das Vorbild
   liegt unangetastet daneben als `linie-vorbild.mjs`). Geaendert ist genau
   dreierlei, und jede Aenderung steht an ihrer Stelle begruendet:

   (1) DIE PLUS-FALLE. Das Vorbild rechnet `Math.abs(z.preis)` und hat damit
       fuer einen Zufluss von +8.000 DM eine AUSGABE von 8.000 DM auf der
       Rechnung. Es lehnt ihn als zu teuer ab und sieht ihn nie.
       `kern/buehne.js:166` setzt `data-preis` mit Vorzeichen: negativ =
       Ausgabe, positiv = Zufluss (`preis: preis ? -preis : (zufluss || 0)`,
       `spiel/stuecke/preis.js:1899`). Diese Hand liest das Vorzeichen.
   (2) 420 Wochen = vierzehn Braujahre (`kern/uhr.js:18` WOCHEN_IM_JAHR = 30).
   (3) MEHR WIRD MITGESCHRIEBEN, GESPIELT WIRD NICHT ANDERS: Chronikzaehler,
       Kassenboden Woche fuer Woche, Knopfzaehlung nach `data-soll-aus`,
       Gegnerzuege aus `B.protokoll`.

   Das Warten (RUHE/BEHARR) ist unveraendert uebernommen. Es ist der Grund,
   warum diese Hand unter Last dieselbe Reihe liefert wie auf der ruhigen
   Maschine.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 420);
const ZIEL = process.argv[4] || `/tmp/pk5/tafel-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';
const LAUT = !!process.env.LAUT;
const WARTE = +(process.env.WARTE || 1);
const RUHE = process.env.RUHE !== '0';
/* ABS=1 stellt die Plus-Falle wieder her — dieselbe Hand, nur mit
   Math.abs(). Damit laesst sich die Falle messen statt behaupten. */
const ABS = process.env.ABS === '1';

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

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

/* ---------------------------------------------------------------- Handgriffe */

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
             sollAus: el.getAttribute('data-soll-aus'),
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
  if (LAUT) console.log('   klick', zug);
  return true;
}

async function schirm() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    let mitPreis = 0, mitPreisAktiv = 0, mitPreisErreichbar = 0;
    let sollAusFehlt = 0, ausMitSoll0 = 0, ausMitSoll1 = 0;
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      const sa = el.getAttribute('data-soll-aus');
      if (sa === null) sollAusFehlt++;
      else if (el.disabled && sa === '0') ausMitSoll0++;
      else if (el.disabled && sa === '1') ausMitSoll1++;
      if (!r.width || !r.height) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let hit = false;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
      const p = el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null;
      if (p) {
        mitPreis++;
        /* (a) der Messlatte: erreichbar UND aktiv. AKTIV nach dem, was das
           SPIEL sagt (data-soll-aus !== "1"), ERREICHBAR nach
           elementFromPoint. Beide getrennt gezaehlt. */
        if (sa !== '1') mitPreisAktiv++;
        if (sa !== '1' && hit && !el.disabled) mitPreisErreichbar++;
      }
      zuege.push({ zug: el.getAttribute('data-zug'), preis: p,
        aus: !!el.disabled, sollAus: sa, hit });
    });
    const plan = [...document.querySelectorAll('.fu-planzahl')].map(e => +e.textContent || 0);
    const n = B.welt.naechsterZug || null;
    let d = null;
    try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
    const chron = B.welt.chronik || [];
    const zg = document.querySelector('[data-zug="preis:chronik-auf"]');
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length, plan, zuege,
      amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      deckung: d,
      nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
      nennerArt: n ? (n.art || null) : null, nennerZug: n ? (n.zug || null) : null,
      /* --- was diese Hand zusaetzlich mitschreibt --- */
      mitPreis, mitPreisAktiv, mitPreisErreichbar,
      sollAusFehlt, ausMitSoll0, ausMitSoll1,
      chronikFest: chron.filter(c => c && c.art === 'festlegung').length,
      chronikGesamt: chron.length,
      zaehlerText: zg ? (zg.innerText || '').trim().replace(/\s+/g, ' ') : null,
      protokoll: B.protokoll.length,
      gegnerZuege: B.protokoll.filter(p => p.wer === 'gegner').length,
      letzteBuchungen: B.protokoll.slice(-8).map(p => (p.wer || '?') + '|' + p.was + '|' + p.preis)
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

/* KOSTEN eines Preisschilds. Negativ = Ausgabe, positiv = Zufluss.
   Das Vorbild rechnet hier Math.abs() und macht damit aus Geld, das
   hereinkommt, Geld, das hinausgeht. ABS=1 stellt das Vorbild wieder her. */
const kosten = (p) => (ABS ? Math.abs(p) : Math.max(0, -p));

/* ------------------------------------------------------- DIE HAND, WOCHE FUER WOCHE */

const reihe = [], jahre = [];
let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0, festPlus = 0, nimmGesetzt = 0, nimmPlus = 0;
const festListe = [], nimmListe = [], festAngeboten = [];

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, amtszeit: s.amtszeit,
    deckung: s.deckung, nennerPreis: s.nennerPreis, nennerArt: s.nennerArt,
    nennerZug: s.nennerZug, nennerWas: s.nennerWas,
    mitPreis: s.mitPreis, mitPreisAktiv: s.mitPreisAktiv, mitPreisErreichbar: s.mitPreisErreichbar,
    sollAusFehlt: s.sollAusFehlt, ausMitSoll0: s.ausMitSoll0, ausMitSoll1: s.ausMitSoll1,
    chronikFest: s.chronikFest, zaehlerText: s.zaehlerText,
    gegnerZuege: s.gegnerZuege, protokoll: s.protokoll,
    letzteBuchungen: s.kasse <= 0 ? s.letzteBuchungen : undefined });

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }

    /* DIE TAFEL WIRKLICH AUFSCHLAGEN, bevor gezaehlt wird.
       Befund von `decke3.mjs`: an jedem zweiten Michaeli traegt
       `div.pr-tafel` die Klasse `stadt-zugeklappt`, und `stadt.css:186` setzt
       darauf `clip-path: inset(50%) !important` — die Tafel liegt dann
       zusammengeklappt in der Reiterleiste der STADT und ist weder sichtbar
       noch anfassbar. Der Griff des PREIS allein holt sie nicht zurueck; der
       Reiter der STADT tut es. Wer das nicht tut, zaehlt die eingeklappte
       Tafel und meldet eine Verdeckung, die keine ist. */
    for (let v = 0; v < 8; v++) {
      const zu = await seite.evaluate(() => {
        const t = document.querySelector('.pr-tafel');
        return !!(t && t.classList.contains('stadt-zugeklappt'));
      });
      const g = await lage('preis:tafel');
      if (!zu && g && /schließen/.test(g.text || '')) break;
      if (zu) {
        const reiter = await seite.evaluate(() => {
          const r = [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')]
            .find(e => /michae/i.test(e.innerText || '') || /preis/i.test(e.getAttribute('data-zug')));
          if (!r || r.disabled) return null;
          const b = r.getBoundingClientRect();
          return b.width && b.height ? { x: b.left + b.width / 2, y: b.top + b.height / 2 } : null;
        });
        if (reiter) { await seite.mouse.click(reiter.x, reiter.y); await ruhe(500); continue; }
      }
      if (g && !/schließen/.test(g.text || '')) { await klick('preis:tafel', 260); await ruhe(500); continue; }
      break;
    }
    await ruhe(500);
    let m = await schirm();

    /* --- Was die Tafel HEUTE anbietet, vollstaendig aufgeschrieben:
       Preis, disabled, data-soll-aus, Trefferlage. Getrennt, wie es
       ZUSTAENDIGKEIT 25 verlangt. */
    /* WER LIEGT DARAUF — nur an dieser einen Stelle, nur wenn nicht getroffen. */
    const decke = await seite.evaluate(() => {
      const out = [];
      document.querySelectorAll('[data-zug^="preis:festlege:"],[data-zug^="preis:nimm:"]').forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
          ? document.elementFromPoint(cx, cy) : null;
        if (t && (t === el || el.contains(t))) return;
        const teile = []; let n = t;
        while (n && n !== document.body && teile.length < 8) {
          teile.push(n.tagName.toLowerCase()
            + (n.id ? '#' + n.id : '')
            + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).join('.') : ''));
          n = n.parentElement;
        }
        out.push({ zug: el.getAttribute('data-zug'), pfad: teile.join(' < '),
                   punkt: [Math.round(cx), Math.round(cy)] });
      });
      const offen = [...document.querySelectorAll('#ebene-blatt > .fach')].map(f => {
        const r = f.getBoundingClientRect();
        return { fach: f.className, kinder: f.children.length,
                 rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] };
      });
      return { decke: out, faecher: offen };
    });
    festAngeboten.push({ jahr: s.jahr, kasse: m.kasse, decke: decke.decke, faecher: decke.faecher,
      feste: m.zuege.filter(z => /^preis:festlege:/.test(z.zug))
        .map(z => ({ zug: z.zug, preis: z.preis, aus: z.aus, sollAus: z.sollAus, hit: z.hit })),
      angebote: m.zuege.filter(z => /^preis:nimm:/.test(z.zug))
        .map(z => ({ zug: z.zug, preis: z.preis, aus: z.aus, sollAus: z.sollAus, hit: z.hit })) });

    /* DIE UNWIDERRUFLICHE FESTLEGUNG.
       Zuerst der Zufluss: eine Festlegung mit PLUS-Schild kostet nichts, sie
       BRINGT. Sie wird immer genommen, und zwar die groesste.
       Sonst die billigste, die unter 45 % der Kasse bleibt (Regel des
       Vorbilds, unveraendert). */
    let feste = alle(m, /^preis:festlege:/).filter(z => z.preis);
    const festPlusL = ABS ? [] : feste.filter(z => z.preis > 0);
    let gewaehlt = null;
    if (festPlusL.length) {
      gewaehlt = festPlusL.reduce((a, z) => (z.preis > a.preis ? z : a));
    } else {
      const bez = feste.filter(z => kosten(z.preis) <= m.kasse * 0.45);
      if (bez.length) gewaehlt = bez.reduce((a, z) => (kosten(z.preis) < kosten(a.preis) ? z : a));
    }
    if (gewaehlt && await klick(gewaehlt.zug, 220)) {
      festGesetzt++;
      if (gewaehlt.preis > 0) festPlus++;
      festListe.push({ jahr: s.jahr, zug: gewaehlt.zug, preis: gewaehlt.preis });
      m = await schirm();
    }

    /* DIE ANGEBOTE. Zufluss zuerst, sonst das billigste mit dreifacher
       Deckung (Regel des Vorbilds). */
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    const angPlus = ABS ? [] : ang.filter(z => z.preis > 0);
    let gw = null;
    if (angPlus.length) gw = angPlus.reduce((a, z) => (z.preis > a.preis ? z : a));
    else if (ang.length) {
      const b = ang.reduce((a, z) => (kosten(z.preis) < kosten(a.preis) ? z : a));
      const p = kosten(b.preis);
      if (m.kasse - p >= 2 * p) gw = b;
    }
    if (gw && await klick(gw.zug, 220)) {
      nimmGesetzt++;
      if (gw.preis > 0) nimmPlus++;
      nimmListe.push({ jahr: s.jahr, zug: gw.zug, preis: gw.preis });
      m = await schirm();
    }

    jahre.push({ jahr: s.jahr, kasseMichaeli: m.kasse, leiter: await leiter(),
      chronikFest: m.chronikFest, zaehlerText: m.zaehlerText });

    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);

    /* Der Zaehler am Griff — erst NACH dem Schliessen der Tafel steht er da
       (spiel/stuecke/preis.js:2329 haengt ihn nur an den Stand, wenn die
       Tafel ZU ist). */
    const zg = await lage('preis:chronik-auf');
    const nachSchluss = await schirm();
    jahre[jahre.length - 1].zaehlerNachSchluss = zg ? zg.text : null;
    jahre[jahre.length - 1].chronikFestNachSchluss = nachSchluss.chronikFest;

    if (await klick('fuhre:ziel:bar', 80)) zielGesetzt++;

    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || kosten(z.preis) === 0);
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
      && s.kasse >= 3 * kosten(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);

  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (kosten(z.preis) < kosten(a.preis) ? z : a));
    if (s.kasse - kosten(b.preis) >= 4 * kosten(b.preis)) await klick(b.zug, 90);
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
const roh = await seite.evaluate(() => {
  try { return window.BRAUHAUS.preis.leiter(); } catch (e) { return null; }
});
/* Die Chronik im Wortlaut — damit sich nachlesen laesst, WAS unabaenderlich
   wurde und wer es hineingeschrieben hat. */
const chronik = await seite.evaluate(() => (window.BRAUHAUS.welt.chronik || [])
  .map(c => ({ art: c.art, jahr: c.jahr, text: String(c.text || c.was || '').slice(0, 160) })));
const protokoll = await seite.evaluate(() => window.BRAUHAUS.protokoll
  .map(p => ({ wer: p.wer, was: String(p.was).slice(0, 90), preis: p.preis,
               jahr: p.jahr, woche: p.woche, misslungen: !!p.misslungen })));

const kassen = reihe.map(r => r.kasse);
const verh = [];
jahre.forEach(j => (j.leiter || []).forEach(z => {
  const v = parseFloat(String(z[3]).replace(',', '.'));
  if (!isNaN(v)) verh.push({ jahr: z[0], kasse: z[1], billigst: z[2], mal: v });
}));
const eindeutig = [];
verh.forEach(v => { if (!eindeutig.some(e => e.jahr === v.jahr)) eindeutig.push(v); });

fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, hafen: HAFEN, saat: SAAT, abs: ABS, wochen: reihe.length, fehler, abgebrochen,
  zielGesetzt, festGesetzt, festPlus, nimmGesetzt, nimmPlus,
  festListe, nimmListe, festAngeboten,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  wochenAufNull: reihe.filter(r => r.kasse === 0).length,
  wochenUnterNull: reihe.filter(r => r.kasse < 0).length,
  leiter: eindeutig, leiterRoh: roh,
  chronik, protokoll,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage,
             amtszeit: schluss.amtszeit, chronikFest: schluss.chronikFest,
             zaehlerText: schluss.zaehlerText, gegnerZuege: schluss.gegnerZuege },
  jahre, reihe
}, null, 1));

const rk = (roh || []).filter(r => r && r.zugVerh).map(r => r.zugVerh);
console.log(`E${ep}@${HAFEN}${ABS ? ' [ABS]' : ''}: ${reihe.length} Wochen `
  + `(${reihe[0] && reihe[0].jahr}–${schluss.jahr}), Kasse ${Math.min(...kassen)}–${Math.max(...kassen)}, `
  + `auf 0: ${reihe.filter(r => r.kasse === 0).length} W, unter 0: ${reihe.filter(r => r.kasse < 0).length} W, `
  + `KENNZAHL ${rk.length ? Math.min(...rk).toFixed(2) + '–' + Math.max(...rk).toFixed(2) + '×' : '—'} `
  + `ueber ${rk.length} J, Fest ${festGesetzt}x (davon Plus ${festPlus}), Nimm ${nimmGesetzt}x (Plus ${nimmPlus}), `
  + `Chronik-Fest ${schluss.chronikFest}, Gegner ${schluss.gegnerZuege}, Seitenfehler ${fehler.length}`,
  abgebrochen || '');
await browser.close();
