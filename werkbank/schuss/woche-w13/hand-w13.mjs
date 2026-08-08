/* DIE HAND DER WELLE 13 — dieselbe Mausmechanik wie
   werkbank/schuss/spiel-w12/hand3.mjs (echte mouse.move/down/65ms/up, vorher
   elementFromPoint auf der Knopfmitte), aber sie liest die Woche, statt sie
   auswendig zu kennen.

   WARUM EINE EIGENE HAND UND NICHT hand3.mjs
   hand3 klickt `fuhre:wie-vorige` und `fuhre:abschicken` NAMENTLICH. Eine
   Hand, die zwei Schluessel auswendig kann, misst nicht, wie viele Knoepfe die
   Woche traegt — sie misst, wie oft sie ihre zwei Knoepfe findet. Diese Hand
   hat statt dessen EINE Regel je Sorte Knopf, und diese Regeln gelten
   unveraendert vor und nach dem Umbau. Am alten Stand faellt sie deshalb
   Zeile fuer Zeile auf hand3 zurueck (siehe Bericht, Abschnitt „Vorher").

   DIE REGELN, vollstaendig:
     1. Liegt ein Georgi-Blatt: einen Jahresplan nehmen, Blatt schliessen.
     2. Liegt die Michaelitafel: das billigste bezahlbare Angebot nehmen,
        Tafel schliessen.
     3. Rohstoff unter 45 und bezahlbar: kaufen.
     4. Steht eine WOCHENFRAGE (`fuhre:frage:*`): eine Antwort geben —
        die erste greifbare, damit die Wahl nicht vom Messgeraet kommt.
     5. Steht ein SPRUNG (`fuhre:sprung*`) und keine Frage: springen.
     6. Sonst: EINEN Fuhrplan nehmen — den mit dem besten Preisschild;
        hat keiner eines, „Wie vorige Woche", sonst den ersten.
     7. `fuhre:abschicken`, wenn greifbar.
     8. `weiter`, wenn die Woche danach noch dieselbe ist.
     9. Alle drei Wochen ein bezahlbarer Zug gegen den Gegner, alle zehn
        Wochen einer fuer den Namen (woertlich aus hand3 uebernommen).
   KEIN Reiter wird angefasst, ausser Regel 2 verlangt es ausdruecklich.

   HAFEN=8923 node hand-w13.mjs <epoche> <gespielte-wochen> <lauf> [breite] [hoehe]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep      = +(process.argv[2] || 1);
const ZIELWOCHEN = +(process.argv[3] || 100);
const LAUF    = process.argv[4] || `e${ep}`;
const BR      = +(process.argv[5] || 1600);
const HO      = +(process.argv[6] || 900);
const HAFEN   = process.env.HAFEN || '8923';
const SAAT    = process.env.SAAT || '1350';
const WURZ    = '/home/user/brewhousesim/werkbank/schuss/woche-w13';
const PROT    = `${WURZ}/protokoll/${LAUF}.jsonl`;
const SCHUSS  = `${WURZ}/schuesse`;
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.mkdirSync(SCHUSS, { recursive: true });
fs.writeFileSync(PROT, '');

const T0 = Date.now();
const sek = () => Math.round((Date.now() - T0) / 100) / 10;
function schreib(o) { fs.appendFileSync(PROT, JSON.stringify({ t: sek(), ...o }) + '\n'); }

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 250)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 250)); });

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}&neu=1`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
schreib({ was: 'laden', url: URL, fenster: BR + 'x' + HO });

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
        aus: !!el.disabled, hit, x: Math.round(cx), y: Math.round(cy),
        w: Math.round(r.width), h: Math.round(r.height),
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 80) });
    });
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
    const n = B.welt.naechsterZug || null;
    let ziel = null;
    try { ziel = B.welt.zielSatz ? B.welt.zielSatz() : null; } catch (e) {}
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      chronik: (B.welt.chronik || []).length, protokoll: (B.protokoll || []).length,
      lage: B.lage.length, deckung: d, nennerWas: n ? n.was : null, ziel, zuege };
  });
}

async function schirmtext() {
  return await seite.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length) return;
      const t = (el.textContent || '').trim(); if (!t) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
      out.push(t.replace(/\s+/g, ' ').slice(0, 160));
    });
    return out;
  });
}

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 60));
  try {
    await seite.evaluate(() => new Promise(f => {
      let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) {}
  const rest = ms - 60; if (rest > 0) await seite.waitForTimeout(rest);
}

let klicks = 0, danebengegriffen = 0;
async function lage1(zug) { return (await schirm()).zuege.find(z => z.zug === zug) || null; }

async function greif(zug, { warte = 240, grund = '', beharr = 2 } = {}) {
  let l = null;
  for (let v = 0; v < beharr; v++) {
    l = await lage1(zug);
    if (l && l.aus) { schreib({ was: 'abgeschaltet', zug, text: l.text }); return false; }
    if (l && l.hit) break;
    if (v + 1 < beharr) await ruhe(120);
  }
  if (!l || !l.hit) { schreib({ was: 'nicht-zu-greifen', zug }); danebengegriffen++; return false; }
  const vor = await schirm();
  await seite.mouse.move(l.x - 40, l.y - 25);
  await seite.waitForTimeout(30);
  await seite.mouse.move(l.x, l.y, { steps: 6 });
  await seite.waitForTimeout(40);
  await seite.mouse.down();
  await seite.waitForTimeout(65);
  await seite.mouse.up();
  klicks++;
  await ruhe(warte);
  const nach = await schirm();
  schreib({ was: 'klick', nr: klicks, zug, grund,
    knopf: { text: l.text, preis: l.preis, w: l.w, h: l.h },
    vor: { jahr: vor.jahr, woche: vor.woche, kasse: vor.kasse },
    nach: { jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse },
    dkasse: nach.kasse - vor.kasse, lage: nach.lage });
  return true;
}

async function foto(name) {
  const p = `${SCHUSS}/${LAUF}-${name}.png`;
  await seite.screenshot({ path: p });
  return p;
}

/* ---------------------------------------------------------------- Partie */
const wahl = [];
let gespielt = 0, abbruch = null, jahrVorher = null;
let sprungWochen = 0;

await foto('00-ankunft');
const ersterText = await schirmtext();
const zielWorte = ersterText.filter(t => /(Ziel|gewinnen|überleben|Übergabe|übergeben)/i.test(t));
schreib({ was: 'erster-schirmtext', n: ersterText.length,
  zielWorte: zielWorte.slice(0, 20), zielWorteN: zielWorte.length });

const uebergabeGesehen = [];

/* Der Anschlag des Rahmens wird gelesen und beiseitegelegt, wie ein Mensch es
   taete. Er geht ohnehin beim ersten Wochenwechsel von selbst. Der Klick
   zaehlt mit — er steht im Protokoll wie jeder andere. */
await greif('kern:anfangen', { grund: 'Anschlag gelesen', warte: 200 });

while (gespielt < ZIELWOCHEN) {
  let s = await schirm();
  if (s.ende) { abbruch = { grund: 'Spiel meldet ENDE', jahr: s.jahr, woche: s.woche }; await foto('ende'); break; }
  gespielt++;
  const wocheVorher = s.jahr * 100 + s.woche;

  const gb = s.zuege.filter(z => z.hit && !z.aus);
  const mp = gb.filter(z => z.preis);
  const txt = await schirmtext();
  /* Faellt das Uebergabeangebot auf, OHNE einen Reiter anzufassen? */
  const ueb = txt.filter(t => /(ÜBERGABE|Übergabe|übergeben)/.test(t));
  if (ueb.length) uebergabeGesehen.push({ n: gespielt, jahr: s.jahr, woche: s.woche, zeilen: ueb.slice(0, 6) });

  wahl.push({ n: gespielt, jahr: s.jahr, woche: s.woche, kasse: s.kasse, deckung: s.deckung,
    greifbar: gb.length, mitPreis: mp.length,
    bezahlbar: mp.filter(z => Math.abs(z.preis) <= s.kasse).length,
    ziel: s.ziel, uebergabeImText: ueb.length });
  schreib({ was: 'woche', n: gespielt, jahr: s.jahr, woche: s.woche, kasse: s.kasse,
    greifbar: gb.length, mitPreis: mp.length, deckung: s.deckung, nenner: s.nennerWas,
    ziel: s.ziel, uebergabeImText: ueb.length });

  if (s.jahr !== jahrVorher) { jahrVorher = s.jahr; if (s.jahr % 2 === 0) await foto(`jahr-${s.jahr}`); }

  /* 1 · Georgi-Blatt */
  if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
    const ss = await schirm();
    const plan = ss.zuege.filter(z => z.hit && !z.aus && /^fuhre:jahresplan:/.test(z.zug));
    if (plan.length) await greif(plan[Math.floor(plan.length / 2)].zug, { grund: 'Jahresplan', warte: 280 });
    await greif('fuhre:sommer-zu', { grund: 'Georgi-Blatt zu', warte: 300 });
  }

  /* 2 · Michaelitafel — nur wenn sie von selbst daliegt */
  s = await schirm();
  const tafelDa = () => s.zuege.some(z => z.hit && !z.aus && (/^preis:(nimm|festlege):/.test(z.zug) || z.zug === 'preis:tafel-zu'));
  if (tafelDa()) {
    const nimm = s.zuege.filter(z => z.hit && !z.aus && /^preis:(nimm|festlege):/.test(z.zug) && z.preis);
    const kand = nimm.filter(z => Math.abs(z.preis) * 1.2 <= s.kasse);
    if (kand.length) {
      const b = kand.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'Michaeli: billigstes bezahlbare', warte: 300 });
    }
    await greif('preis:tafel-zu', { grund: 'Das Jahr beginnen', warte: 300 });
  }

  /* 3 · Rohstoff */
  s = await schirm();
  if (s.rohstoff < 45) {
    const roh = s.zuege.find(z => /kauf:rohstoff/.test(z.zug) && !z.aus && z.hit);
    if (roh && roh.preis && s.kasse >= Math.abs(roh.preis))
      await greif(roh.zug, { grund: 'Rohstoff geht aus', warte: 220 });
  }

  /* 9a · alle drei Wochen gegen den Gegner (woertlich aus hand3) */
  if (gespielt % 3 === 1) {
    s = await schirm();
    const gz = s.zuege.filter(z => z.hit && !z.aus && /^gegner:(abloesen|zuvorkommen)/.test(z.zug) && z.preis
                                   && Math.abs(z.preis) * 3 <= s.kasse);
    if (gz.length) {
      const b = gz.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'dem Gegner zuvorkommen', warte: 280 });
    }
  }
  /* 9b · alle zehn Wochen etwas fuer den Namen (woertlich aus hand3) */
  if (gespielt % 10 === 5) {
    s = await schirm();
    const nm = s.zuege.filter(z => z.hit && !z.aus && /^name:(jetzt|anschlag):/.test(z.zug) && z.preis
                                   && Math.abs(z.preis) * 4 <= s.kasse);
    if (nm.length) {
      const b = nm.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'etwas fuer den Namen', warte: 260 });
    }
  }

  /* 4 · Die Wochenfrage */
  s = await schirm();
  const fragen = s.zuege.filter(z => z.hit && !z.aus && /^fuhre:frage:/.test(z.zug));
  if (fragen.length) {
    schreib({ was: 'wochenfrage', n: fragen.length, liste: fragen.map(z => ({ zug: z.zug, text: z.text, preis: z.preis })) });
    await greif(fragen[0].zug, { grund: 'Wochenfrage beantworten', warte: 260 });
  }

  /* 5 · Der Sprung — nur, wenn die Woche keine Wahl traegt */
  s = await schirm();
  const sprung = s.zuege.find(z => z.hit && !z.aus && /^fuhre:sprung/.test(z.zug));
  const planZahl = s.zuege.filter(z => z.hit && !z.aus &&
    (/^fuhre:plan:/.test(z.zug) || z.zug === 'fuhre:wie-vorige' || z.zug === 'fuhre:fuellen')).length;
  schreib({ was: 'wahl-der-woche', plaene: planZahl, sprung: !!sprung,
    liste: s.zuege.filter(z => z.hit && !z.aus && /^fuhre:plan:/.test(z.zug))
      .map(z => ({ zug: z.zug, preis: z.preis, text: z.text })) });
  let gesprungen = false;
  if (!fragen.length && sprung && planZahl <= 1) {
    const vorSpr = await schirm();
    if (await greif(sprung.zug, { grund: 'ruhige Wochen zusammenfassen', warte: 340 })) {
      const nachSpr = await schirm();
      const dw = (nachSpr.jahr * 30 + nachSpr.woche) - (vorSpr.jahr * 30 + vorSpr.woche);
      sprungWochen += Math.max(0, dw);
      schreib({ was: 'sprung', wochen: dw, text: sprung.text });
      gesprungen = true;
    }
  }

  /* 6 · Ein Fuhrplan */
  if (!gesprungen) {
    s = await schirm();
    const plaene = s.zuege.filter(z => z.hit && !z.aus &&
      (/^fuhre:plan:/.test(z.zug) || z.zug === 'fuhre:wie-vorige' || z.zug === 'fuhre:fuellen'));
    if (plaene.length) {
      const mitPreis = plaene.filter(z => z.preis !== null && z.preis !== undefined);
      let gew;
      if (mitPreis.length) gew = mitPreis.reduce((a, z) => (z.preis > a.preis ? z : a));
      else gew = plaene.find(z => z.zug === 'fuhre:wie-vorige') || plaene[0];
      await greif(gew.zug, { grund: 'Fuhrplan', warte: 220 });
    }
    /* 7 · abschicken */
    await greif('fuhre:abschicken', { grund: 'Fuhre abschicken', warte: 300 });
  }

  /* 8 · weiter, wenn die Woche noch dieselbe ist */
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === wocheVorher) {
    if (!(await greif('weiter', { grund: 'naechste Woche', warte: 340 }))) {
      abbruch = { grund: 'WEITER nicht zu greifen', jahr: nach.jahr, woche: nach.woche };
      await foto('abbruch'); break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === wocheVorher) {
      abbruch = { grund: 'kein Zug bewegt die Woche', jahr: nach.jahr, woche: nach.woche };
      await foto('abbruch'); break;
    }
  }
}

await foto('99-schluss');
const schluss = await schirm();
schreib({ was: 'schluss', jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse,
  klicks, danebengegriffen, lage: schluss.lage, fehler, abbruch, gespielt, sprungWochen });

fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-wahl.json`, JSON.stringify({
  epoche: ep, saat: SAAT, fenster: BR + 'x' + HO, gespielteWochen: gespielt, sprungWochen,
  klicks, danebengegriffen, fehler, abbruch,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
  ersterSchirmZielWorte: zielWorte, uebergabeGesehen, wahl
}, null, 1));

console.log(`E${ep}: ${gespielt} gespielte Wochen (+${sprungWochen} erzaehlt), ` +
  `${klicks} echte Klicks, ${danebengegriffen} verfehlt, Kasse ${schluss.kasse}, ` +
  `Lage ${schluss.lage}, Seitenfehler ${fehler.length}`, abbruch || '');
await browser.close();
