/* DIE HAND 2 — ein Mensch am Brett. Echte Mausereignisse auf der Knopfflaeche,
   Bretter werden aufgeschlagen wie von einem, der sucht.
   Schreibt LAUFEND nach protokoll/<lauf>.jsonl.

   HAFEN=8911 node hand2.mjs <epoche> <minuten> <lauf> [breite] [hoehe]
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
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70) });
    });
    let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
    const n = B.welt.naechsterZug || null;
    const gg = (B.welt.gegner || []).map(g => ({ s: g.schluessel, kasse: g.kasse, zuege: g.zuege }));
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      chronik: (B.welt.chronik || []).length, protokoll: (B.protokoll || []).length,
      lage: B.lage.length, deckung: d, nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
      gegner: gg, zuege };
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

let klicks = 0, danebengegriffen = 0, brettGesucht = 0;
const erreichbar = new Map();      // zug -> {text, preis, n}
const knopfTexte = new Map();      // sichtbarer Text -> n

async function lage1(zug) { return (await schirm()).zuege.find(z => z.zug === zug) || null; }

async function reiterAuf(zug) {
  /* Brett suchen, auf dem dieser Zug liegt: alle Reiter durchgehen. */
  const s = await schirm();
  const stueck = (zug.split(':')[0] || '');
  const reiter = s.zuege.filter(z => /^stadt:reiter:/.test(z.zug) && z.hit && !z.aus);
  reiter.sort((a, b) => (b.zug.includes(stueck) ? 1 : 0) - (a.zug.includes(stueck) ? 1 : 0));
  for (const r of reiter) {
    const rl = await lage1(r.zug); if (!rl || !rl.hit || rl.aus) continue;
    await seite.mouse.move(rl.x, rl.y, { steps: 3 });
    await seite.mouse.down(); await seite.waitForTimeout(50); await seite.mouse.up();
    brettGesucht++;
    await ruhe(160);
    const l = await lage1(zug);
    if (l && l.hit) { schreib({ was: 'brett-gesucht', fuer: zug, ueber: r.zug, text: r.text }); return true; }
  }
  return false;
}

async function greif(zug, { warte = 240, grund = '', beharr = 4, suchen = true } = {}) {
  let l = null;
  for (let v = 0; v < beharr; v++) {
    l = await lage1(zug);
    if (l && l.aus) { schreib({ was: 'abgeschaltet', zug, text: l.text }); return false; }
    if (l && l.hit) break;
    if (v === 0 && suchen && await reiterAuf(zug)) { l = await lage1(zug); if (l && l.hit) break; }
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
    knopf: { text: l.text, preis: l.preis, w: l.w, h: l.h, x: l.x, y: l.y },
    vor: { jahr: vor.jahr, woche: vor.woche, kasse: vor.kasse, faesser: vor.faesser,
           chronik: vor.chronik, protokoll: vor.protokoll },
    nach: { jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse, faesser: nach.faesser,
            chronik: nach.chronik, protokoll: nach.protokoll },
    dkasse: nach.kasse - vor.kasse, lage: nach.lage });
  return true;
}

async function foto(name) {
  const p = `${SCHUSS}/${LAUF}-${name}.png`;
  await seite.screenshot({ path: p });
  schreib({ was: 'foto', datei: p });
  return p;
}

function merke(s) {
  s.zuege.filter(z => z.hit && !z.aus).forEach(z => {
    const e = erreichbar.get(z.zug) || { text: z.text, preis: z.preis, n: 0 };
    e.n++; if (z.preis) e.preis = z.preis; if (z.text) e.text = z.text;
    erreichbar.set(z.zug, e);
    if (z.text) knopfTexte.set(z.text, (knopfTexte.get(z.text) || 0) + 1);
  });
}

/* ---------------------------------------------------------------- Partie */

const wahl = [], gegnerReihe = [];
const ENDE = T0 + MINUTEN * 60 * 1000;
let woche = 0, jahrVorher = null, abbruch = null, gegnerVorher = null;
const UNWIDER = /(wird nicht zurückgenommen|nicht rückgängig|unwiderruflich|für immer|Für den Rest der Partie|einmal je|Eine je Amtszeit|endgültig)/i;

await foto('00-ankunft');
const ersterText = await schirmtext();
schreib({ was: 'erster-schirmtext', n: ersterText.length, zeilen: ersterText });

/* Rundgang: alle Bretter aufschlagen und aufschreiben, was daraufsteht. */
async function rundgang(marke) {
  const s0 = await schirm();
  const reiter = s0.zuege.filter(z => /^stadt:reiter:/.test(z.zug) && z.hit && !z.aus);
  const gesehen = [];
  for (const r of reiter) {
    const rl = await lage1(r.zug); if (!rl || !rl.hit) continue;
    await seite.mouse.move(rl.x, rl.y, { steps: 3 });
    await seite.mouse.down(); await seite.waitForTimeout(50); await seite.mouse.up();
    klicks++; await ruhe(220);
    const s = await schirm(); merke(s);
    const neu = s.zuege.filter(z => z.hit && !z.aus);
    gesehen.push({ reiter: r.zug, titel: r.text, greifbar: neu.length,
      mitPreis: neu.filter(z => z.preis).length,
      zuege: neu.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })) });
    const txt = await schirmtext();
    const unw = txt.filter(t => UNWIDER.test(t));
    if (unw.length) schreib({ was: 'unwiderruflich-text', reiter: r.zug, zeilen: unw.slice(0, 8) });
  }
  schreib({ was: 'rundgang', marke, bretter: gesehen.length, gesehen });
  await foto(`rundgang-${marke}`);
}

await rundgang('anfang');

while (Date.now() < ENDE) {
  let s = await schirm();
  if (s.ende) { abbruch = { grund: 'Spiel meldet ENDE', jahr: s.jahr, woche: s.woche }; await foto('ende'); break; }
  woche++; merke(s);

  const gb = s.zuege.filter(z => z.hit && !z.aus);
  const mp = gb.filter(z => z.preis);
  const txt = await schirmtext();
  const gegnerZahl = (s.gegner[0] || {}).zuege;
  const gegnerNeu = gegnerVorher !== null && gegnerZahl > gegnerVorher;
  const gegnerSpur = txt.filter(t => /(wirbt|spricht vor|zuvorkommen|ablösen|UMKÄMPFT|Vorsprung|OHNE DICH|Adler|Konzern|Nordstern|Zug)/i.test(t));
  gegnerVorher = gegnerZahl;

  wahl.push({ n: woche, jahr: s.jahr, woche: s.woche, kasse: s.kasse, deckung: s.deckung,
    nennerWas: s.nennerWas, nennerPreis: s.nennerPreis, greifbar: gb.length, mitPreis: mp.length,
    bezahlbar: mp.filter(z => Math.abs(z.preis) <= s.kasse).length,
    liste: gb.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })) });
  gegnerReihe.push({ n: woche, jahr: s.jahr, woche: s.woche, zuege: gegnerZahl,
    kasse: (s.gegner[0] || {}).kasse, neu: gegnerNeu, spurAufDemSchirm: gegnerSpur.length,
    spur: gegnerNeu ? gegnerSpur.slice(0, 6) : undefined });
  schreib({ was: 'woche', n: woche, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, greifbar: gb.length, mitPreis: mp.length,
    deckung: s.deckung, nenner: s.nennerWas, nennerPreis: s.nennerPreis,
    gegnerZuege: gegnerZahl, gegnerNeu, gegnerSpur: gegnerSpur.length });

  if (s.jahr !== jahrVorher) { jahrVorher = s.jahr; await foto(`jahr-${s.jahr}`); if (woche > 1) await rundgang(`j${s.jahr}`); }

  /* Sommerblatt / Jahresplan */
  if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
    const ss = await schirm();
    const plan = ss.zuege.filter(z => z.hit && !z.aus && /^fuhre:jahresplan:/.test(z.zug));
    schreib({ was: 'jahresplan', n: plan.length, liste: plan.map(z => ({ zug: z.zug, text: z.text, preis: z.preis })) });
    if (plan.length) {
      const gew = plan[Math.floor(plan.length / 2)];
      await greif(gew.zug, { grund: 'Jahresplan', warte: 280 });
      const n2 = await schirm();
      schreib({ was: 'jahresplan-danach', genommen: gew.zug,
        offen: n2.zuege.filter(z => z.hit && !z.aus && /^fuhre:jahresplan:/.test(z.zug)).map(z => ({ zug: z.zug, text: z.text })),
        aus: n2.zuege.filter(z => z.aus && /^fuhre:jahresplan:/.test(z.zug)).map(z => z.zug) });
    }
    await greif('fuhre:sommer-zu', { grund: 'Sommerblatt zu', warte: 300, suchen: false });
  }

  /* Michaeli */
  s = await schirm();
  if (s.zuege.some(z => z.hit && !z.aus && (/^preis:(nimm|festlege):/.test(z.zug) || z.zug === 'preis:tafel-zu'))) {
    const nimm = s.zuege.filter(z => z.hit && !z.aus && /^preis:nimm:/.test(z.zug) && z.preis);
    const fest = s.zuege.filter(z => z.hit && !z.aus && /^preis:festlege:/.test(z.zug) && z.preis);
    const t = await schirmtext();
    schreib({ was: 'michaeli', jahr: s.jahr, kasse: s.kasse,
      nimm: nimm.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })),
      fest: fest.map(z => ({ zug: z.zug, preis: z.preis, text: z.text })),
      unwiderruflichText: t.filter(x => UNWIDER.test(x)).slice(0, 6) });
    if (s.jahr % 3 === 0 || wahl.length < 5) await foto(`michaeli-${s.jahr}`);
    const kand = [...fest, ...nimm].filter(z => Math.abs(z.preis) * 1.2 <= s.kasse);
    if (kand.length) {
      const b = kand.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'Michaeli: billigstes bezahlbare Angebot/Festlegung', warte: 300 });
      /* Was ist danach noch da? Der Beweis fuer den Ausschluss, am Bildschirm. */
      const n2 = await schirm();
      schreib({ was: 'michaeli-danach', genommen: b.zug,
        nimm: n2.zuege.filter(z => z.hit && !z.aus && /^preis:nimm:/.test(z.zug)).map(z => z.zug),
        nimmAus: n2.zuege.filter(z => z.aus && /^preis:nimm:/.test(z.zug)).map(z => z.zug),
        fest: n2.zuege.filter(z => z.hit && !z.aus && /^preis:festlege:/.test(z.zug)).map(z => z.zug),
        festAus: n2.zuege.filter(z => z.aus && /^preis:festlege:/.test(z.zug)).map(z => z.zug) });
    }
    await greif('preis:tafel-zu', { grund: 'Das Jahr beginnen', warte: 300 });
  }

  /* Rohstoff — sonst steht die Pfanne kalt. Wer hier zoegert, verhungert. */
  s = await schirm();
  if (s.rohstoff < 45) {
    const roh = s.zuege.find(z => /kauf:rohstoff/.test(z.zug) && !z.aus);
    if (roh && roh.preis && s.kasse >= Math.abs(roh.preis))
      await greif(roh.zug, { grund: 'Rohstoff geht aus', warte: 220 });
  }
  s = await schirm();
  if (s.plaetze && s.faesser >= s.plaetze - 1) {
    const ab = s.zuege.filter(z => !z.aus && /^fuhre:tafel-ab:/.test(z.zug));
    if (ab.length) await greif(ab[ab.length - 1].zug, { grund: 'Keller voll, weniger brauen', warte: 180 });
  }

  /* Brauplan aufstocken — nur wenn Rohstoff da ist, hoechstens zweimal je Woche */
  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze < 0.55 && s.rohstoff > 12 && woche % 2 === 0) {
    for (let k = 0; k < 2; k++) {
      const st = await schirm();
      if (st.rohstoff <= 12) break;
      const auf = st.zuege.filter(z => !z.aus && /^fuhre:tafel-auf:/.test(z.zug));
      if (!auf.length) break;
      if (!(await greif(auf[Math.min(1, auf.length - 1)].zug, { grund: 'mehr brauen', warte: 180 }))) break;
    }
  }

  /* Ruf des Hauses — alle zehn Wochen etwas fuer den Namen tun */
  if (woche % 10 === 5) {
    s = await schirm();
    const nm = s.zuege.filter(z => !z.aus && /^name:(jetzt|anschlag):/.test(z.zug) && z.preis
                                   && Math.abs(z.preis) * 4 <= s.kasse);
    if (nm.length) {
      const b = nm.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'etwas fuer den Namen', warte: 260 });
    }
  }

  /* Gegner: alle drei Wochen etwas dagegen tun */
  if (woche % 3 === 1) {
    s = await schirm();
    const gz = s.zuege.filter(z => z.hit && !z.aus && /^gegner:(abloesen|zuvorkommen)/.test(z.zug) && z.preis
                                   && Math.abs(z.preis) * 3 <= s.kasse);
    if (gz.length) {
      const b = gz.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await greif(b.zug, { grund: 'dem Gegner zuvorkommen', warte: 280 });
    }
  }

  /* Fuhre */
  s = await schirm();
  if (!(await greif('fuhre:wie-vorige', { grund: 'wie vorige Woche', warte: 200 })))
    await greif('fuhre:fuellen', { grund: 'nach Durst fuellen', warte: 200 });
  await greif('fuhre:abschicken', { grund: 'Fuhre abschicken', warte: 300 });

  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await greif('weiter', { grund: 'naechste Woche', warte: 340 }))) {
      abbruch = { grund: 'WEITER nicht zu greifen', jahr: s.jahr, woche: s.woche };
      await foto('abbruch'); break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) {
      abbruch = { grund: 'kein Zug bewegt die Woche', jahr: s.jahr, woche: s.woche };
      await foto('abbruch'); break;
    }
  }
  await seite.waitForTimeout(250);
}

await foto('99-schluss');
const schluss = await schirm();
const letzterText = await schirmtext();
schreib({ was: 'schluss', jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, klicks,
  danebengegriffen, brettGesucht, lage: schluss.lage, fehler, abbruch,
  minuten: Math.round((Date.now() - T0) / 6000) / 10 });
schreib({ was: 'letzter-schirmtext', n: letzterText.length, zeilen: letzterText });

fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-wahl.json`, JSON.stringify({
  epoche: ep, saat: SAAT, fenster: BR + 'x' + HO, minuten: Math.round((Date.now() - T0) / 6000) / 10,
  klicks, danebengegriffen, brettGesucht, fehler, abbruch,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage },
  erreichbar: [...erreichbar].map(([zug, e]) => ({ zug, ...e })),
  knopfTexte: [...knopfTexte].map(([t, n]) => ({ t, n })),
  wahl, gegner: gegnerReihe
}, null, 1));

console.log(`E${ep}: ${woche} Wochen (${schluss.jahr}/${schluss.woche}), ${klicks} echte Klicks, ` +
  `${danebengegriffen} verfehlt, ${erreichbar.size} verschiedene erreichbare Zuege, ` +
  `Kasse ${schluss.kasse}, Lage ${schluss.lage}, Seitenfehler ${fehler.length}`, abbruch || '');
await browser.close();
