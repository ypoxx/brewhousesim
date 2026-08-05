/* KANN MAN ES SPIELEN? — ein echtes Klickprotokoll, mit der Maus, ueber
   mehrere Braujahre, in einer Epoche.
     HAFEN=8901 node werkbank/schuss/sud-blind-r2/spielen.mjs <epoche> <wochen> <ziel.json>

   Gespielt wird wie ein Mensch, der DER SUD verstehen will:
     * das Sudbrett aufschlagen und offen halten
     * jede Woche sehen, was an SUD-Zuegen bedienbar ist
     * eine kostenlose Verbesserung sofort nehmen
     * eine bezahlte Festlegung nehmen, sobald die Kasse sie traegt
     * Gaerraum kaufen, sobald er bezahlbar ist und der Keller eng wird
     * Hefe fuehren / anstechen, wenn es geht
     * gesperrte Chargen (1970) entscheiden
     * dann WEITER

   Protokolliert wird JEDER Klick mit Woche, Ziel, Aufschrift, Preisschild,
   Kasse davor und danach, und was in der Chronik dazu erschienen ist. Ein
   Preisschild, dem keine Abbuchung folgt, faellt damit auf (Sperrliste 3).  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 150);
const ZIEL = process.argv[4] || `werkbank/schuss/sud-blind-r2/spiel-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8901';
const SAAT = process.env.SAAT || '1350';

const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const seite = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1300);

async function ruhe(ms = 90) {
  await seite.waitForTimeout(Math.min(ms, 50));
  try {
    await seite.evaluate(() => new Promise(f => {
      let ab = false; const g = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(g, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0)));
    }));
  } catch (e) {}
}

const stand = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
    faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
    guete: B.sud && B.sud.guete ? B.sud.guete() : null,
    verfahren: B.sud ? B.sud.verfahren() : null,
    gaerfrei: B.sud && B.sud.gaerkeller ? B.sud.gaerkeller.frei() : null,
    chronik: B.welt.chronik.length, lage: B.lage.length };
});

const chronikSeit = (n) => seite.evaluate(k => window.BRAUHAUS.welt.chronik.slice(k)
  .map(x => (x.text || x.was || JSON.stringify(x)).slice(0, 120)), n);

const mitte = (zug) => seite.evaluate(z => {
  const el = document.querySelector(`[data-zug="${z}"]`);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
    ? document.elementFromPoint(cx, cy) : null;
  return { x: cx, y: cy, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
    preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
    fass: el.getAttribute('data-preis-art') === 'fass' ? +el.getAttribute('data-preis-menge') : null,
    text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
}, zug);

const protokoll = [];
async function klicke(zug, warum) {
  const v = await stand();
  const l = await mitte(zug);
  if (!l) return { ok: false, grund: 'kein Knopf' };
  if (l.aus) return { ok: false, grund: 'disabled' };
  if (!l.hit) return { ok: false, grund: 'Maus trifft nicht' };
  await seite.mouse.click(l.x, l.y);
  await ruhe(180);
  const n = await stand();
  const neu = await chronikSeit(v.chronik);
  const e = { jahr: v.jahr, woche: v.woche, zug, warum, aufschrift: l.text,
    preisschild: l.preis, fassschild: l.fass,
    kasseVor: v.kasse, kasseNach: n.kasse, abgebucht: v.kasse - n.kasse,
    faesserVor: v.faesser, faesserNach: n.faesser,
    verfahrenVor: v.verfahren, verfahrenNach: n.verfahren, chronik: neu };
  /* Der Scheinpreis-Test: steht ein Muenz-Preisschild am Knopf, muss die
     Kasse danach genau um diesen Betrag kleiner sein. */
  if (l.preis && l.preis < 0) e.preisEingeloest = (v.kasse - n.kasse) === Math.abs(l.preis);
  protokoll.push(e);
  return { ok: true, e };
}

const sudZuege = () => seite.evaluate(() =>
  [...document.querySelectorAll('button[data-zug^="sud:"]')].map(el => {
    const r = el.getBoundingClientRect();
    let hit = false;
    if (r.width && r.height) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
    }
    return { zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit,
      preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
      fass: el.getAttribute('data-preis-art') === 'fass' ? +el.getAttribute('data-preis-menge') : null,
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }));

async function reiterAuf() {
  for (let i = 0; i < 4; i++) {
    const offen = await seite.evaluate(() => {
      const f = document.getElementById('fach-hand-sud');
      const b = f ? f.firstElementChild : null;
      return b ? !b.classList.contains('stadt-zugeklappt') : null;
    });
    if (offen) return i;
    const l = await mitte('stadt:reiter:sud-sud-brett');
    if (!l || l.aus || !l.hit) return -1;
    await seite.mouse.click(l.x, l.y);
    await ruhe(200);
  }
  return -1;
}

const reiterKlicks = [];
reiterKlicks.push(await reiterAuf());

let abbruch = null;
for (let w = 0; w < WOCHEN; w++) {
  const s = await stand();
  if (s.ende) { abbruch = 'Partie beendet'; break; }
  const n = await reiterAuf();
  if (n > 0) reiterKlicks.push(n);

  const zuege = (await sudZuege()).filter(z => !z.aus && z.hit);

  /* 1 — gesperrte Chargen entscheiden (1970): verschneiden ist die
     vorsichtige Antwort, freigeben die schnelle. Abwechselnd, damit beide
     Wege einmal wirklich gegangen werden. */
  const ch = zuege.filter(z => /^sud:(zettel-)?charge/.test(z.zug));
  if (ch.length) {
    const pick = (w % 2 === 0)
      ? ch.find(z => /schnitt/.test(z.zug)) || ch[0]
      : ch.find(z => /frei/.test(z.zug)) || ch[0];
    await klicke(pick.zug, 'gesperrte Charge entscheiden');
  }

  /* 2 — kostenlose Verbesserung nehmen, wenn eine dasteht. */
  const gratis = zuege.filter(z => /^sud:[a-z]+:[a-z0-9-]+$/.test(z.zug) && !z.preis);
  if (gratis.length && w % 7 === 3) await klicke(gratis[0].zug, 'kostenlose Umstellung probieren');

  /* 3 — die bezahlte Festlegung nehmen, sobald sie bedienbar ist. */
  const teuer = zuege.filter(z => z.preis && z.preis < 0 && /^sud:[a-z]+:/.test(z.zug))
    .sort((a, b) => Math.abs(a.preis) - Math.abs(b.preis));
  if (teuer.length) await klicke(teuer[0].zug, 'unwiderrufliche Festlegung kaufen');

  /* 4 — Gaerraum, wenn der Keller eng wird. */
  const gk = zuege.find(z => /gaerraum/.test(z.zug));
  if (gk && s.gaerfrei !== null && s.gaerfrei <= 2) await klicke(gk.zug, 'Gaerraum wird eng');

  /* 5 — Hefe fuehren (kostet nichts) oder anstechen (kostet ein Fass). */
  const hf = zuege.find(z => /hefe-fuehren/.test(z.zug));
  if (hf) await klicke(hf.zug, 'Hefe fuehren, kostet kein Fass');
  else {
    const an = zuege.find(z => /anstich-jung/.test(z.zug)) || zuege.find(z => /anstich/.test(z.zug));
    if (an && s.faesser > 2) await klicke(an.zug, 'Hefe vom Fass, kostet ein Fass');
  }

  const ok = await klicke('weiter', 'Woche weiter');
  if (!ok.ok) {
    await ruhe(200);
    const ok2 = await klicke('weiter', 'Woche weiter, zweiter Versuch');
    if (!ok2.ok) { abbruch = 'WEITER nicht erreichbar: ' + ok2.grund; break; }
  }
}

const schluss = await stand();
const scheinpreise = protokoll.filter(e => e.preisEingeloest === false);
const erg = { epoche: ep, wochen: WOCHEN, abbruch, fehler, reiterKlicks, schluss,
  klicks: protokoll.length, scheinpreise, protokoll };
fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify(erg, null, 1));

console.log(`e${ep}: ${protokoll.length} Klicks, Jahr ${schluss.jahr} W${schluss.woche}, `
  + `Kasse ${schluss.kasse}, Faesser ${schluss.faesser}/${schluss.plaetze}, Guete ${schluss.guete}`);
console.log(`  Reiterklicks bis offen: ${JSON.stringify(reiterKlicks.slice(0, 12))}`);
console.log(`  Verfahren am Ende: ${JSON.stringify(schluss.verfahren)}`);
console.log(`  SCHEINPREISE (Preisschild ohne Abbuchung): ${scheinpreise.length}`);
scheinpreise.slice(0, 6).forEach(e => console.log(`    ${e.zug} Schild ${e.preisschild} abgebucht ${e.abgebucht}`));
const kauf = protokoll.filter(e => e.preisschild && e.preisschild < 0);
console.log(`  Kaeufe mit Muenz-Preisschild: ${kauf.length}`);
kauf.slice(0, 10).forEach(e => console.log(`    J${e.jahr} W${e.woche} ${e.zug} "${e.aufschrift}" Schild ${e.preisschild} abgebucht ${e.abgebucht}`));
console.log(`  Abbruch: ${abbruch || 'keiner'} · Seitenfehler ${fehler.length} · BRAUHAUS.lage ${schluss.lage}`);
await browser.close();
