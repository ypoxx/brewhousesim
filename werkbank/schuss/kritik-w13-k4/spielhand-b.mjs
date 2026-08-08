// Variante B derselben Messhand — einziger Unterschied zu spielhand.mjs:
// Schritt 2 (Wochenkarte der FUHRE) waehlt nicht dringlichkeitsgeordnet den
// ersten Plan, sondern GLEICHVERTEILT zufaellig (eigene gesaete PRNG, aus
// epoche+kumWoche, wiederholbar) unter den angebotenen Plaenen. Das prueft,
// ob die Dominanz von 'fuhre:plan:mager' in Variante A ein Artefakt der
// festen Prioritaet ist oder eine echte Eigenschaft der Partie.
// Aufruf identisch zu spielhand.mjs.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const [epocheArg, wochenZielArg, ausgabe, saatArg] = process.argv.slice(2);
const epoche = epocheArg || '1';
const wochenZiel = parseInt(wochenZielArg || '100', 10);
const saat = saatArg || '1350';

function pseudo(n) {
  // kleine, deterministische PRNG (mulberry32-artig)
  let t = n + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push('pageerror: ' + String(e)));
seite.on('console', (m) => { if (m.type() === 'error') seitenfehler.push('console: ' + m.text()); });
seite.on('requestfailed', (r) => seitenfehler.push('request: ' + r.url() + ' — ' + r.failure()?.errorText));

const url = `http://127.0.0.1:8933/spiel/?epoche=${epoche}&saat=${saat}&neu=1`;
await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(700);

async function echterKlick(zug) {
  const handle = await seite.$(`[data-zug="${zug}"]`);
  if (!handle) return { ok: false, grund: 'nicht-im-dom' };
  try { await handle.scrollIntoViewIfNeeded({ timeout: 2000 }); } catch (e) {}
  const box = await handle.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) return { ok: false, grund: 'keine-flaeche' };
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const treffer = await seite.evaluate(([x, y, zug]) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return { getroffen: false, was: null };
    const ziel = el.closest('[data-zug]');
    return { getroffen: !!ziel && ziel.getAttribute('data-zug') === zug, was: ziel ? ziel.getAttribute('data-zug') : (el.tagName) };
  }, [x, y, zug]);
  if (!treffer.getroffen) return { ok: false, grund: 'nicht-unter-zeiger', unterZeiger: treffer.was };
  await seite.mouse.click(x, y);
  return { ok: true };
}

async function zuege() { return seite.evaluate(() => BRAUHAUS.zuege()); }

async function weltZustand() {
  return seite.evaluate(() => {
    const w = BRAUHAUS.welt;
    return {
      jahr: w.zeit.jahr, woche: w.zeit.woche, epoche: w.zeit.epoche, ende: !!w.zeit.ende,
      kasse: w.haus.kasse
    };
  });
}

const setupKlicks = [];
let z0 = await zuege();
if (z0.some(z => z.zug === 'kern:anfangen')) {
  const r = await echterKlick('kern:anfangen');
  setupKlicks.push({ zug: 'kern:anfangen', ergebnis: r });
  await seite.waitForTimeout(150);
}

const klickProtokoll = [];
let kumWoche = 0;
let lageMax = 0;

for (let w = 1; w <= wochenZiel; w++) {
  kumWoche++;
  const vorZustand = await weltZustand();
  if (vorZustand.ende) break;
  const vorZuege = await zuege();

  async function istGreifbarUndBezahlbar(zug, aktuelleKasse) {
    const eintrag = vorZuege.find(zz => zz.zug === zug);
    if (!eintrag || !eintrag.offen) return false;
    if (eintrag.preis !== null && eintrag.preis !== undefined) {
      const p = parseFloat(eintrag.preis);
      if (!isNaN(p) && p < 0 && (-p) > aktuelleKasse) return false;
    }
    return true;
  }
  async function klickeWennMoeglich(zug, quelle) {
    const aktuelleKasse = (await weltZustand()).kasse;
    if (!(await istGreifbarUndBezahlbar(zug, aktuelleKasse))) return false;
    const r = await echterKlick(zug);
    klickProtokoll.push({ kumWoche, zug, ergebnis: r.ok ? 'geklickt' : 'nicht-gegriffen:' + r.grund, quelle, kasseVorher: aktuelleKasse });
    await seite.waitForTimeout(70);
    return r.ok;
  }

  if (!(await klickeWennMoeglich('sud:zettel-anstich', 'sud-anzapfen'))) {
    await klickeWennMoeglich('sud:zettel-hefe-fass', 'sud-anzapfen');
  }

  const gegnerKandidaten = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('gegner:') === 0
    && zz.offen
    && zz.zug.indexOf('gegner:oeffnen:') !== 0 && zz.zug !== 'gegner:blatt'
    && zz.zug.indexOf('gegner:zeige:') !== 0 && zz.zug.indexOf('gegner:beschwerde-bild') !== 0);
  let bester = null, besteFrist = Infinity;
  for (const g of gegnerKandidaten) {
    const m = /noch (\d+) Wo/.exec(g.text || '');
    if (!m) continue;
    const frist = parseInt(m[1], 10);
    if (frist < besteFrist) { besteFrist = frist; bester = g; }
  }
  if (bester) await klickeWennMoeglich(bester.zug, 'gegenzug');

  // Woche abschliessen: ENTWEDER ein zufaellig gewaehlter Fuhrplan-Chip
  // (ruft naechsteWoche() selbst auf, stuecke/fuhre.js:1892) ODER 'weiter'.
  const planZuege = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('fuhre:plan:') === 0 && zz.offen);
  let planGeklickt = false;
  if (planZuege.length) {
    const idx = Math.floor(pseudo(epoche.charCodeAt(0) * 100000 + kumWoche) * planZuege.length);
    const zielPlan = planZuege[Math.min(idx, planZuege.length - 1)].zug;
    planGeklickt = await klickeWennMoeglich(zielPlan, 'fuhre-woche-zufall');
  }

  if (!planGeklickt) {
    const kasseVorWeiter = (await weltZustand()).kasse;
    const rW = await echterKlick('weiter');
    klickProtokoll.push({ kumWoche, zug: 'weiter', ergebnis: rW.ok ? 'geklickt' : 'nicht-gegriffen:' + rW.grund, quelle: 'pflicht', kasseVorher: kasseVorWeiter });
    await seite.waitForTimeout(90);
  }

  const lageLen = await seite.evaluate(() => (BRAUHAUS.lage || []).length);
  if (lageLen > lageMax) lageMax = lageLen;
}

const endZustand = await weltZustand();
await seite.screenshot({ path: ausgabe.replace(/\.json$/, '.png') });
const ergebnis = { epoche, saat, wochenZiel, kumWocheErreicht: kumWoche, setupKlicks, klickProtokoll, endZustand, lageMax, seitenfehler };
fs.writeFileSync(ausgabe, JSON.stringify(ergebnis, null, 1));
console.log('fertig(B):', ausgabe, 'kumWoche=', kumWoche, 'ende=', endZustand.ende, 'lageMax=', lageMax, 'seitenfehler=', seitenfehler.length);
await browser.close();
