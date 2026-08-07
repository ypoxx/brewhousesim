/* DIE HAND — ein Mensch am Brett, nicht ein Messgeraet.
   Echte Mausereignisse (move/down/up) auf der wirklichen Knopfflaeche.
   Schreibt LAUFEND: protokoll/<lauf>.jsonl  (eine Zeile je Ereignis)

   HAFEN=8911 node hand.mjs <epoche> <minuten> <lauf-name> [breite] [hoehe]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep      = +(process.argv[2] || 1);
const MINUTEN = +(process.argv[3] || 20);
const LAUF    = process.argv[4] || `e${ep}`;
const BR      = +(process.argv[5] || 1600);
const HO      = +(process.argv[6] || 900);
const HAFEN   = process.env.HAFEN || '8911';
const SAAT    = process.env.SAAT || '1350';
const WURZ    = '/home/user/brewhousesim/werkbank/schuss/spiel-w12';
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

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
schreib({ was: 'laden', url: URL, fenster: BR + 'x' + HO });

/* ---------------------------------------------------------------- ablesen */

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
      zuege.push({
        zug: el.getAttribute('data-zug'),
        preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        aus: !!el.disabled, hit, x: Math.round(cx), y: Math.round(cy),
        w: Math.round(r.width), h: Math.round(r.height),
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70)
      });
    });
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
    const n = B.welt.naechsterZug || null;
    const gg = JSON.parse(JSON.stringify(B.welt.gegner || {}));
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      chronik: (B.welt.chronik || []).length, protokoll: (B.protokoll || []).length,
      lage: B.lage.length, deckung: d,
      nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
      gegner: gg, zuege
    };
  });
}

/* Was steht in diesem Augenblick als Text auf dem Schirm (nur Sichtbares)? */
async function schirmtext() {
  return await seite.evaluate(() => {
    const out = [];
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length) return;
      const t = (el.textContent || '').trim();
      if (!t) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
      out.push(t.replace(/\s+/g, ' ').slice(0, 140));
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
  const rest = ms - 60;
  if (rest > 0) await seite.waitForTimeout(rest);
}

/* ------------------------------------------------- die Hand: echte Maus */

let klicks = 0, danebengegriffen = 0;

async function greif(zug, { warte = 260, grund = '', beharr = 5 } = {}) {
  let l = null;
  for (let v = 0; v < beharr; v++) {
    l = (await schirm()).zuege.find(z => z.zug === zug) || null;
    if (l && l.aus) { schreib({ was: 'abgeschaltet', zug, text: l.text }); return false; }
    if (l && l.hit) break;
    if (v + 1 < beharr) await ruhe(120);
  }
  if (!l || !l.hit) { schreib({ was: 'nicht-zu-greifen', zug, l }); danebengegriffen++; return false; }

  const vor = await schirm();
  // echte Maus: hin bewegen, druecken, kurz halten, loslassen
  await seite.mouse.move(l.x - 40, l.y - 30);
  await seite.waitForTimeout(35);
  await seite.mouse.move(l.x, l.y, { steps: 6 });
  await seite.waitForTimeout(45);
  await seite.mouse.down();
  await seite.waitForTimeout(70);
  await seite.mouse.up();
  klicks++;
  await ruhe(warte);
  const nach = await schirm();
  schreib({
    was: 'klick', nr: klicks, zug, grund,
    knopf: { text: l.text, preis: l.preis, w: l.w, h: l.h, x: l.x, y: l.y },
    vor: { jahr: vor.jahr, woche: vor.woche, kasse: vor.kasse, faesser: vor.faesser,
           chronik: vor.chronik, protokoll: vor.protokoll, greifbar: vor.zuege.filter(z => z.hit && !z.aus).length },
    nach: { jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse, faesser: nach.faesser,
            chronik: nach.chronik, protokoll: nach.protokoll, greifbar: nach.zuege.filter(z => z.hit && !z.aus).length },
    dkasse: nach.kasse - vor.kasse, lage: nach.lage
  });
  return true;
}

async function foto(name) {
  const p = `${SCHUSS}/${LAUF}-${name}.png`;
  await seite.screenshot({ path: p });
  schreib({ was: 'foto', datei: p });
  return p;
}

/* ------------------------------------------------------------ die Partie */

const wahlSchnappschuss = [];   // je Woche: was stand nebeneinander zur Wahl
const gegnerReihe = [];
const ENDE = T0 + MINUTEN * 60 * 1000;
let woche = 0, jahrVorher = null, abbruch = null;

/* Beim ersten Blick: alle Bretter aufklappen und lesen — wie ein Mensch,
   der zuerst schaut, was es ueberhaupt gibt. */
await foto('00-ankunft');
schreib({ was: 'erster-schirmtext', zeilen: await schirmtext() });

{
  const s = await schirm();
  const reiter = s.zuege.filter(z => /^stadt:reiter:/.test(z.zug) && z.hit);
  schreib({ was: 'reiter-gefunden', n: reiter.length, liste: reiter.map(r => ({ zug: r.zug, text: r.text })) });
  for (const r of reiter) {
    await greif(r.zug, { grund: 'Brett aufschlagen, um zu sehen was drinsteht', warte: 320 });
    const t = await schirmtext();
    schreib({ was: 'brett-offen', reiter: r.zug, zeilen: t.length });
  }
  await foto('01-alle-bretter-offen');
}

function greifbar(s) { return s.zuege.filter(z => z.hit && !z.aus); }
function mitPreis(s) { return greifbar(s).filter(z => z.preis !== null && z.preis !== 0); }

while (Date.now() < ENDE) {
  let s = await schirm();
  if (s.ende) { abbruch = { grund: 'Spiel meldet Ende', jahr: s.jahr, woche: s.woche }; break; }
  woche++;

  const gb = greifbar(s), mp = mitPreis(s);
  wahlSchnappschuss.push({
    n: woche, jahr: s.jahr, woche: s.woche, kasse: s.kasse, deckung: s.deckung,
    nennerWas: s.nennerWas, nennerPreis: s.nennerPreis,
    greifbar: gb.length, mitPreis: mp.length,
    bezahlbar: mp.filter(z => Math.abs(z.preis) <= s.kasse).length,
    liste: gb.map(z => ({ zug: z.zug, preis: z.preis, text: z.text }))
  });
  gegnerReihe.push({ n: woche, jahr: s.jahr, woche: s.woche, gegner: s.gegner });
  schreib({ was: 'woche-anfang', n: woche, jahr: s.jahr, woche: s.woche, kasse: s.kasse,
            greifbar: gb.length, mitPreis: mp.length, deckung: s.deckung,
            nenner: s.nennerWas, nennerPreis: s.nennerPreis });

  if (s.jahr !== jahrVorher) {
    jahrVorher = s.jahr;
    await foto(`jahr-${s.jahr}`);
  }

  /* --- Jahreswechsel/Michaeli: das grosse Blatt --- */
  const somm = await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'));
  if (somm) {
    schreib({ was: 'sommerblatt' });
    const ss = await schirm();
    const plan = greifbar(ss).filter(z => /^fuhre:jahresplan:/.test(z.zug));
    schreib({ was: 'jahresplan-wahl', n: plan.length, liste: plan.map(z => ({ zug: z.zug, text: z.text, preis: z.preis })) });
    if (plan.length) await greif(plan[Math.floor(plan.length / 2)].zug, { grund: 'Jahresplan waehlen', warte: 300 });
    await greif('fuhre:sommer-zu', { grund: 'Sommerblatt zu', warte: 320 });
  }

  s = await schirm();
  const tafel = s.zuege.find(z => z.zug === 'preis:tafel');
  const michaeliOffen = greifbar(s).some(z => /^preis:(nimm|festlege):/.test(z.zug)) ||
                        greifbar(s).some(z => z.zug === 'preis:tafel-zu');
  if (michaeliOffen) {
    const nimm = greifbar(s).filter(z => /^preis:nimm:/.test(z.zug) && z.preis);
    const fest = greifbar(s).filter(z => /^preis:festlege:/.test(z.zug) && z.preis);
    schreib({ was: 'michaeli-tafel', kasse: s.kasse,
              nimm: nimm.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })),
              fest: fest.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })) });
    await foto(`michaeli-${s.jahr}`);
    // wie ein Mensch: das billigste, das ich mir zweimal leisten kann
    const kandidaten = [...fest, ...nimm].filter(z => Math.abs(z.preis) * 2 <= s.kasse);
    if (kandidaten.length) {
      const b = kandidaten.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'Michaeli: billigste bezahlbare Festlegung/Nahme', warte: 340 });
    }
    await greif('preis:tafel-zu', { grund: 'Jahr beginnen', warte: 320 });
  }

  /* --- der Gegner: hinsehen, was er getan hat --- */
  s = await schirm();
  const gegnerZuege = greifbar(s).filter(z => /^gegner:(abloesen|zuvorkommen|hinhalten|beschwerde)/.test(z.zug));
  if (gegnerZuege.length && woche % 3 === 1) {
    const bez = gegnerZuege.filter(z => z.preis && Math.abs(z.preis) * 3 <= s.kasse);
    if (bez.length) {
      const b = bez.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'gegen den Gegner halten', warte: 300 });
    }
  }

  /* --- Wirtschaft: Rohstoff, Fass, Fuhre --- */
  s = await schirm();
  const roh = greifbar(s).find(z => /kauf:rohstoff/.test(z.zug));
  if (roh && roh.preis && s.rohstoff < 40 && s.kasse >= 3 * Math.abs(roh.preis))
    await greif(roh.zug, { grund: 'Rohstoff geht aus', warte: 240 });

  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze < 0.6) {
    const auf = greifbar(s).filter(z => /^fuhre:tafel-auf:/.test(z.zug));
    for (let k = 0; k < 3 && auf.length; k++) {
      if (!(await greif(auf[Math.min(1, auf.length - 1)].zug, { grund: 'mehr brauen', warte: 200 }))) break;
    }
  }

  s = await schirm();
  if (!(await greif('fuhre:wie-vorige', { grund: 'Karren wie vorige Woche', warte: 220 })))
    await greif('fuhre:fuellen', { grund: 'Karren nach Durst fuellen', warte: 220 });
  await greif('fuhre:abschicken', { grund: 'Fuhre abschicken', warte: 320 });

  /* --- Woche weiterschalten --- */
  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await greif('weiter', { grund: 'naechste Woche', warte: 380 }))) {
      abbruch = { grund: 'WEITER nicht zu greifen', jahr: s.jahr, woche: s.woche };
      await foto('abbruch');
      break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) {
      abbruch = { grund: 'kein Zug bewegt die Woche', jahr: s.jahr, woche: s.woche };
      await foto('abbruch');
      break;
    }
  }
  // menschliche Pause: hinsehen, lesen
  await seite.waitForTimeout(400);
}

await foto('99-schluss');
const schluss = await schirm();
schreib({ was: 'schluss', jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse,
          klicks, danebengegriffen, lage: schluss.lage, fehler, abbruch,
          minuten: Math.round((Date.now() - T0) / 6000) / 10 });
schreib({ was: 'letzter-schirmtext', zeilen: await schirmtext() });

fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-wahl.json`, JSON.stringify({
  epoche: ep, saat: SAAT, fenster: BR + 'x' + HO, minuten: Math.round((Date.now() - T0) / 6000) / 10,
  klicks, danebengegriffen, fehler, abbruch,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
  wahl: wahlSchnappschuss, gegner: gegnerReihe
}, null, 1));

console.log(`E${ep}: ${woche} Wochen gespielt (${schluss.jahr}/${schluss.woche}), ${klicks} echte Klicks, ` +
  `${danebengegriffen} nicht zu greifen, Kasse ${schluss.kasse}, Lage ${schluss.lage}, ` +
  `Seitenfehler ${fehler.length}`, abbruch || '');
await browser.close();
