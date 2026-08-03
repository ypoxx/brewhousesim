/* DIE RUECKKOPPLUNG r3 — die kompetent gespielte Linie, Hafen waehlbar.
   HAFEN=8900 node linie.mjs <epoche> <wochen> <ausgabe.json>

   Warum diese Datei neben werkbank/schuss/eichung/preis-linie.mjs steht und
   nicht an deren Stelle: `preis-linie.mjs:39` zeigt fest auf 8899, den
   Arbeitsbaum. Am fremden Messgeraet wird nicht gedreht (ZUSTAENDIGKEIT 16),
   also steht meins daneben. DIE HAND IST WORTGLEICH DIE DES ORIGINALS —
   Zeile fuer Zeile derselbe Ablauf, damit die Zahlen vergleichbar bleiben.
   Geaendert ist nur:
     * der Hafen kommt aus der Umgebung,
     * die LEITER wird ZUSAETZLICH roh aus `BRAUHAUS.preis.leiter()` gelesen
       (Zahlen statt gesetzter Zeichen — die letzte Zeile der gezeichneten
       Tafel steht beim Ablesen manchmal noch ohne Kennzahl da),
     * je Woche werden Kasse, Kennzahl (`welt.zugDeckung()`), Nennerzug und
       Amtszeitnummer mitgeschrieben.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `/tmp/rk3/e${ep}.json`;
const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';
const LAUT = !!process.env.LAUT;
/* WARUM ES DIESEN FAKTOR GIBT — der wichtigste Befund dieser Runde.
   Die festen Wartezeiten des Originalgeraets (60 bis 220 ms) sind kein
   Messwert, sondern eine Wette darauf, dass der Bildaufbau schneller ist als
   die Wartezeit. Ist die Maschine belastet, kommt der naechste `lage()`-Blick
   auf ein noch nicht neu gezeichnetes Bild, der Knopf gilt als „nicht
   getroffen", und der Klick faellt AUS. Am staerksten trifft das die Schleife,
   die zu Michaeli den Sudplan stellt: faellt dort ein Klick aus, braut das
   Haus ein Jahr lang weniger, und die ganze Partie laeuft anders. Genau daran
   gehen die Messungen dieser Welle auseinander. Mit WARTE=3 landet jeder
   Klick, und die Partie ist die reiche — die des Kritikers. */
const WARTE = +(process.env.WARTE || 1);
/* RUHE=1 ersetzt die Wette durch eine Messung: nach jedem Klick wird
   gewartet, bis der Bildaufbau wirklich durch ist — zwei Bilder lang, plus
   eine Runde der Aufgabenschlange —, und ERST DANN sieht die Hand wieder
   hin. Das haengt nicht mehr an der Uhr und damit nicht mehr an der Last der
   Maschine. Die feste Wartezeit bleibt als Untergrenze stehen, damit
   Zeitgeber im Spiel (Ton, Blattwechsel) nicht ueberholt werden.
   Nachgewiesen: RUHE=1 liefert unter schwerer Last dieselbe Reihe wie
   WARTE=3 auf der ruhigen Maschine, und beide sind Ziffer fuer Ziffer die
   des Kritikers. */
const RUHE = process.env.RUHE !== '0';
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
  } catch (e) { /* Seite wechselt gerade — dann reicht die feste Wartezeit */ }
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
             x: cx, y: cy, preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
             text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}

const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

/* BEHARRLICH — die eine Aenderung, die aus der Wette eine Messung macht.

   Das Originalgeraet sieht EINMAL hin. Ist der Knopf in dieser Millisekunde
   noch nicht neu gezeichnet, gilt er als „nicht getroffen", und der Klick
   faellt ersatzlos aus. Ob er ausfaellt, haengt an der Last der Maschine —
   also entscheidet die Auslastung mit, wie reich das Haus wird. Genau daran
   sind die Messungen dieser Welle auseinandergegangen: dieselbe Saat,
   derselbe Commit, einmal 5,89 → 2,69 (max 7,88) und einmal 5,89 → 9,20
   (max 41,67).

   Eine Hand am Bildschirm wartet, bis das Bild steht, und klickt dann. Genau
   das tut BEHARR: bis zu N-mal hinsehen, dazwischen einen Bildaufbau
   abwarten. Nicht wiederholt wird bei `aus` — ein abgeschalteter Knopf ist
   eine Aussage des Spiels und keine Verzoegerung. */
const BEHARR = +(process.env.BEHARR || 6);

async function klick(zug, warte = 60) {
  let l = null;
  for (let v = 0; v < BEHARR; v++) {
    l = await lage(zug);
    if (!l || !l.sichtbar) { if (v + 1 < BEHARR) await ruhe(60); continue; }
    if (l.aus) return false;
    if (l.hit) break;
    /* Zugedeckt: erst das eigene Brett aufschlagen, dann noch einmal. */
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
        aus: !!el.disabled, sollAus: el.getAttribute('data-soll-aus'), hit });
    });
    const plan = [...document.querySelectorAll('.fu-planzahl')].map(e => +e.textContent || 0);
    const n = B.welt.naechsterZug || null;
    let d = null;
    try { d = B.welt.zugDeckung(); } catch (e) { d = null; }
    /* AUFTRAG 1 — die Chronik des Hauses ausgezaehlt, nach Art. */
    const ch = B.welt.chronik || [];
    const arten = {};
    ch.forEach(c => { const a = (c && c.art) || '?'; arten[a] = (arten[a] || 0) + 1; });
    const festZeilen = ch.filter(c => c && c.art === 'festlegung')
      .map(c => ({ jahr: c.jahr, woche: c.woche, text: String(c.text || '').slice(0, 90) }));
    /* Was der Knopf SELBST behauptet — abgelesen, nicht nachgerechnet. */
    const kn = document.querySelector('[data-zug="preis:chronik-auf"]');
    return {
      chronikN: ch.length, arten, festZeilen,
      knopfText: kn ? (kn.innerText || '').trim().replace(/\s+/g, ' ') : null,
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

/* Was DIE LEITER zeigt — abgelesen, nicht nachgerechnet. */
async function leiter() {
  return await seite.evaluate(() => {
    const z = [...document.querySelectorAll('.pr-leiter .pr-leiter-zeile')].slice(1);
    return z.map(r => [...r.children].map(c => c.textContent.trim()));
  });
}

const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

/* ------------------------------------------------------- DIE HAND, WOCHE FUER WOCHE */

const reihe = [], jahre = [], festSicht = [];
let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  /* Am ANFANG der Woche abgelesen, vor jedem eigenen Handgriff. */
  reihe.push({ n: i, chronikN: s.chronikN, arten: s.arten, knopfText: s.knopfText,
    jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, amtszeit: s.amtszeit,
    deckung: s.deckung, nennerPreis: s.nennerPreis, nennerArt: s.nennerArt,
    nennerZug: s.nennerZug, nennerWas: s.nennerWas });

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }

    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();

    /* AUFTRAG 1 — bevor geklickt wird, wird PROTOKOLLIERT, was ueberhaupt
       dasteht: jeder Siegelknopf mit disabled, data-soll-aus, Trefferlage und
       Preis. Ohne das laesst sich hinterher nicht sagen, ob die Festlegung
       ausblieb, weil das Spiel nein sagte, weil sie zugedeckt war, oder weil
       die Hand sie sich nicht leisten wollte. */
    const festLage = m.zuege.filter(z => /^preis:festlege:/.test(z.zug))
      .map(z => ({ zug: z.zug, aus: z.aus, sollAus: z.sollAus, hit: z.hit, preis: z.preis }));
    festSicht.push({ jahr: s.jahr, kasse: m.kasse, amtszeit: m.amtszeit, lage: festLage });

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
/* DIE LEITER roh — Zahlen aus der Quelle, nicht aus gesetzten Zeichen. */
const roh = await seite.evaluate(() => {
  try { return window.BRAUHAUS.preis.leiter(); } catch (e) { return null; }
});

const kassen = reihe.map(r => r.kasse);
const verh = [];
jahre.forEach(j => (j.leiter || []).forEach(z => {
  const v = parseFloat(String(z[3]).replace(',', '.'));
  if (!isNaN(v)) verh.push({ jahr: z[0], kasse: z[1], billigst: z[2], mal: v });
}));
const eindeutig = [];
verh.forEach(v => { if (!eindeutig.some(e => e.jahr === v.jahr)) eindeutig.push(v); });

fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, hafen: HAFEN, saat: SAAT, wochen: reihe.length, fehler, abgebrochen,
  zielGesetzt, festGesetzt,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  leiter: eindeutig,
  leiterRoh: roh,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage,
             amtszeit: schluss.amtszeit },
  chronik: { n: schluss.chronikN, arten: schluss.arten, festZeilen: schluss.festZeilen },
  knopfText: schluss.knopfText,
  festSicht,
  jahre, reihe
}, null, 1));

const rk = (roh || []).filter(r => r && r.zugVerh).map(r => r.zugVerh);
const fz = schluss.festZeilen || [];
console.log(`E${ep}@${HAFEN}: ${reihe.length} Wochen (${reihe[0] && reihe[0].jahr}–${schluss.jahr}), `
  + `Kasse ${Math.min(...kassen)}–${Math.max(...kassen)}, `
  + `KENNZAHL roh ${rk.length ? Math.min(...rk).toFixed(2) + '–' + Math.max(...rk).toFixed(2) + '×' : '—'} `
  + `ueber ${rk.length} Jahre, Ziel ${zielGesetzt}× / Festlegung ${festGesetzt}×, `
  + `Amtszeit bis ${schluss.amtszeit}, Seitenfehler ${fehler.length}`, abgebrochen || '');
console.log(`   CHRONIK ${schluss.chronikN} Zeilen ${JSON.stringify(schluss.arten)}`);
console.log(`   art='festlegung': ${fz.length}` + (fz.length ? ' — ' + fz.map(z => z.jahr + '/' + z.woche).join(', ') : ''));
console.log(`   KNOPF: ${schluss.knopfText}`);
await browser.close();
