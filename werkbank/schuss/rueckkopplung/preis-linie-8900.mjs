/* DIE EICHUNG — EINE KOMPETENT GESPIELTE LINIE.
   node preis-linie.mjs <epoche> <wochen> <ausgabe.json>

   Warum es diese Datei gibt
   -------------------------
   messe.mjs spielt zwei Extreme: nie kaufen und jede Woche das Billigste
   kaufen. Beide enden bei Kasse 0, und beide benutzen weder die
   Anschlagtafel noch die Fuhrziele noch die Bindung an eine Adresse. Damit
   ist DIE LEITER — Barschaft gegen das billigste Angebot — nur nach unten
   belegt: sie faellt, weil das Haus stirbt, und nicht, weil die Preise
   steigen. Das ist die halbe Aussage.

   Diese Datei spielt die andere Haelfte: eine Hand, die den Betrieb fuehrt.
   Sie stellt den Sudplan nach dem Durst der Haeuser, kauft Rohstoff, bevor
   er ausgeht, verabredet einmal im Jahr das Zahlungsziel, loest die
   Knappheit der Epoche (Bannbrief, Zunftquote, Frachtstufe, Regalmeter)
   ein, sobald sie sich bezahlt macht, und nimmt zu Michaeli nur, was die
   Kasse nach dem Kauf noch handlungsfaehig laesst. Keine Innenkenntnis:
   jeder Zug geht als echter Mausklick auf einen Knopf, der am Bildschirm
   steht und sich selbst trifft.

   Aufgezeichnet wird je Braujahr, was DIE LEITER zeigt: Kasse, billigstes
   Angebot, Verhaeltnis. Genau die drei Zahlen, um die Latte 2 streitet.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `/tmp/preis-linie-e${ep}.json`;
const LAUT = !!process.env.LAUT;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:8900/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
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

/* Anfassen heisst: hinsehen, und wenn das eigene Brett zugeklappt ist, es
   aufschlagen und noch einmal hinsehen. Nie el.click() — sonst misst der
   Lauf Zuege, die eine Hand nicht erreicht. */
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
        aus: !!el.disabled, hit });
    });
    const plan = [...document.querySelectorAll('.fu-planzahl')].map(e => +e.textContent || 0);
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length, plan, zuege
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

/* Gesucht wird, was NICHT AUS ist. Ob es gerade obenauf liegt, entscheidet
   klick(): das eigene Brett wird aufgeschlagen, wenn es sein muss. Wer hier
   schon auf 'hit' filtert, spielt nur das oberste Brett — und genau daran
   sind die frueheren Automaten vorbeigelaufen. */
const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

/* ------------------------------------------------------- DIE HAND, WOCHE FUER WOCHE */

const reihe = [], jahre = [];
let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  /* ---- WOCHE 1: Georgi abraeumen, Michaeli entscheiden, das Jahr verabreden ---- */
  if (s.woche === 1) {
    /* Die Georgi-Tafel geht ueber ihren eigenen Ausgang beiseite, nicht ueber
       WEITER — WEITER wuerde jetzt auch die Woche nehmen, und der Michaelitag
       ist der einzige, an dem genommen werden kann. */
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }

    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();

    /* Die Festlegung: eine je Amtszeit, unwiderruflich. Genommen wird die
       billigste, die hoechstens 45 Prozent der Kasse kostet — was darueber
       liegt, macht das Haus fuer den Rest des Jahres zahlungsunfaehig. */
    const feste = alle(m, /^preis:festlege:/).filter(z => z.preis && Math.abs(z.preis) <= m.kasse * 0.45);
    if (feste.length) {
      const b = feste.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      if (await klick(b.zug, 220)) { festGesetzt++; m = await schirm(); }
    }

    /* Das Angebot: nur, wenn danach noch das Doppelte des Kaufpreises in der
       Kasse liegt. Ein Haus ohne Reserve verliert im naechsten Umlagejahr
       eine Adresse, und die ist teurer als jeder Bau. */
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    if (ang.length) {
      const b = ang.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }

    jahre.push({ jahr: s.jahr, kasseMichaeli: m.kasse, leiter: await leiter() });

    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);

    /* Das Zahlungsziel: einmal im Jahr, und es ist eine echte Wahl. Barzahlung
       bringt weniger je Fass, aber keinen Ausfall — solange die Kasse duenn
       ist, ist das die Linie. Sitzt Geld fest, wird auf Ziel verkauft. */
    if (await klick('fuhre:ziel:bar', 80)) zielGesetzt++;

    /* Der Sudplan wird zu Michaeli neu gestellt und kostet an diesem einen
       Tag nichts. Also wird an diesem Tag angeschlagen, was der Keller
       traegt — und nicht Woche fuer Woche mit Umstellgeld nachgebessert. */
    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || Math.abs(z.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  s = await schirm();

  /* ---- DER KELLER LAEUFT UEBER: einen Sud weniger. Umgekehrt wird unter
     dem Jahr nicht aufgestockt — das kostet Umstellgeld, und der richtige
     Tag dafuer war Michaeli. */
  if (s.plaetze && s.faesser / s.plaetze > 0.95) {
    const ab = alle(s, /^fuhre:tafel-ab:/);
    if (ab.length) await klick(ab[ab.length - 1].zug, 60);
  }

  /* ---- ROHSTOFF, bevor er ausgeht — aber nie das letzte Geld dafuer. */
  const kaufRoh = s.zuege.find(z => z.zug === 'fuhre:kauf:rohstoff' && !z.aus);
  if (kaufRoh && kaufRoh.preis && s.rohstoff < 40
      && s.kasse >= 3 * Math.abs(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);

  /* ---- DIE KNAPPHEIT DER EPOCHE. Bannbrief, Frachtstufe, Regalmeter: das
     eine, was in dieser Zeit knapp ist und nicht Geld heisst. Gekauft wird
     eines je Woche, und nur wenn danach das Vierfache in der Kasse bleibt. */
  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }

  /* ---- DIE FUHRE. Das ist der Betrieb: laden und abschicken. */
  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);

  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze });

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

function billigstesAngebotPreis(s) {
  const a = s.zuege.filter(z => /^preis:nimm:/.test(z.zug) && z.preis);
  if (!a.length) return 1;
  return Math.min(...a.map(z => Math.abs(z.preis)));
}

const schluss = await schirm();
const kassen = reihe.map(r => r.kasse);
const verh = [];
jahre.forEach(j => (j.leiter || []).forEach(z => {
  const v = parseFloat(String(z[3]).replace(',', '.'));
  if (!isNaN(v)) verh.push({ jahr: z[0], kasse: z[1], billigst: z[2], mal: v });
}));
const eindeutig = [];
verh.forEach(v => { if (!eindeutig.some(e => e.jahr === v.jahr)) eindeutig.push(v); });

fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, wochen: reihe.length, fehler, abgebrochen, zielGesetzt, festGesetzt,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  leiter: eindeutig,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
  jahre, reihe
}, null, 1));

const mal = eindeutig.map(e => e.mal);
console.log(`E${ep}: ${reihe.length} Wochen (${reihe[0] && reihe[0].jahr}–${schluss.jahr}), `
  + `Kasse ${Math.min(...kassen)}–${Math.max(...kassen)}, `
  + `LEITER ${mal.length ? Math.min(...mal).toFixed(2) + '–' + Math.max(...mal).toFixed(2) + '×' : '—'} `
  + `ueber ${eindeutig.length} Jahre, Ziel ${zielGesetzt}× / Festlegung ${festGesetzt}×, `
  + `Seitenfehler ${fehler.length}`, abgebrochen || '');
await browser.close();
