// zweipartien.mjs — TRAEGT DIE PARTIE EIN EIGENES BIER?
// Dieselbe Epoche, dieselbe Saat, zweimal verschieden entschieden. Steht am
// Ende ein anderes Bier da — und ist das AM SCHIRM ablesbar?
//
//   node zweipartien.mjs <epoche> <jahre> <hafen> <ausgabe.json>
//
// Partie A: die billige Abkuerzung (zweite Option jeder Achse, Preis 0)
// Partie B: die teure Festlegung (teuerste Option jeder Achse)
// Partie V: nichts anfassen (Vorgabe) — der Nenner.
//
// Beide spielen sonst gleich: Fuhre laden und abschicken, Rohstoff kaufen,
// Hefe fuehren. Gekauft wird mit der MAUS. Das Geld fuer die Festlegung wird
// dem Haus einmal gutgeschrieben — sonst misst man die Kasse, nicht das Bier.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const JAHRE = +(process.argv[3] || 14);
const HAFEN = +(process.argv[4] || 8911);
const AUS = process.argv[5] || '/tmp/zwei.json';
const STARTJAHR = [1350, 1600, 1884, 1970][EPOCHE - 1];
const ROHSCHWELLE = [40, 65, 120, 340][EPOCHE - 1];

const browser = await chromium.launch();

const ERNTE = () => {
  const B = window.BRAUHAUS, Z = B.SUD_ZUSTAND, W = B.welt;
  const f = W.vorrat.faesser;
  const sorten = {}, stufen = {};
  f.forEach((x) => { const k = x.k || x.sorte || '?'; sorten[k] = (sorten[k] || 0) + 1;
                     const s = x.stufe === undefined ? '?' : x.stufe; stufen[s] = (stufen[s] || 0) + 1; });
  // Was am SCHIRM steht: Sudbrett, Kellerbrett, Kopfzeile.
  const text = (sel) => { const e = document.querySelector(sel); return e ? (e.innerText || '').replace(/\s+/g, ' ').trim() : null; };
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende, endgrund: W.zeit.endgrund || null,
    kasse: Math.round(W.haus.kasse), rohstoff: Math.round(W.haus.rohstoff),
    verfahren: JSON.parse(JSON.stringify(Z.verfahren)), fest: Object.keys(Z.fest),
    lager: f.length, sorten, stufen,
    haltbarSchnitt: f.length ? +(f.reduce((n, x) => n + (x.haltbar || 0), 0) / f.length).toFixed(2) : 0,
    sudDurch: f.filter((x) => x.sudDurch).length,
    sude: Z.gesamtSude, legte: Z.gesamtLegte, gesamtFass: Math.round(Z.gesamtFass),
    guete: Math.round(Z.guete), gestuftGesamt: Z.gestuftGesamt || 0,
    bottiche: Z.bottiche.length, gaerfass: Z.bottiche.reduce((n, b) => n + b.fass, 0),
    plaetze: B.sud.gaerkeller ? B.sud.gaerkeller.plaetze() : null,
    zusatz: Z.zusatz, kaufNr: Z.kaufNr,
    schirm: {
      sudbrett: text('.sud-brett'),
      sudzettel: text('.sud-zettel'),
      kopf: text('#ebene-kopf'),
      buch: (Z.buch || []).slice(-6)
    },
    lage: B.lage.length
  };
};

async function partie(art) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 200)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(900);

  const lage = (z) => seite.evaluate((zz) => {
    const k = document.querySelector(`button[data-zug="${zz}"]`);
    if (!k) return null;
    const r = k.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
    const t = drin ? document.elementFromPoint(x, y) : null;
    return { x, y, aus: !!k.disabled, trifft: !!(t && (t === k || k.contains(t))),
             text: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 60) };
  }, z);
  const klick = async (z, warte = 40) => {
    const p = await lage(z);
    if (!p || p.aus || !p.trifft) return false;
    await seite.mouse.click(p.x, p.y); await seite.waitForTimeout(warte); return true;
  };
  const brettAuf = async () => { const zu = await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
    if (zu) await klick('stadt:reiter:sud-sud-brett', 200); };
  const brettZu = async () => { const zu = await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
    if (!zu) await klick('stadt:reiter:sud-sud-brett', 200); };

  // ---- Die Bierentscheidung, einmal zu Beginn, mit der Maus am Brett ----
  const gewaehlt = [];
  if (art !== 'V') {
    await brettAuf();
    const opts = await seite.evaluate(() => [...document.querySelectorAll('button[data-zug^="sud:"]')]
      .map((k) => k.getAttribute('data-zug'))
      .filter((z) => z.split(':').length === 3 && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(z))
      .map((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
        const t = (k.innerText || '').replace(/\s+/g, ' '); const m = t.match(/−([\d.,]+)/);
        return { zug: z, achse: z.split(':')[1], k: z.split(':')[2],
                 preis: m ? +m[1].replace(/\./g, '').replace(',', '.') : 0, text: t.slice(0, 55) }; }));
    const achsen = [...new Set(opts.map((o) => o.achse))];
    for (const a of achsen) {
      const d = opts.filter((o) => o.achse === a);
      const ziel = art === 'A'
        ? d.slice(1).filter((o) => o.preis === 0)[0]        // die billige Abkuerzung
        : d.filter((o) => o.preis > 0).sort((x, y) => y.preis - x.preis)[0]; // die teure Festlegung
      if (!ziel) continue;
      if (ziel.preis) await seite.evaluate((p) => { window.BRAUHAUS.welt.haus.kasse += p;
        window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); }, ziel.preis);
      await seite.waitForTimeout(150);
      const ok = await klick(ziel.zug, 200);
      gewaehlt.push({ zug: ziel.zug, preis: ziel.preis, geklickt: ok });
    }
    await brettZu();
  }
  const nachWahl = await seite.evaluate(ERNTE);

  // ---- Vierzehn Jahre, sonst identisch gespielt ----
  let i = 0;
  while (i < 600) {
    i++;
    await klick('fuhre:sommer-zu');
    const roh = await seite.evaluate(() => Math.round(window.BRAUHAUS.welt.haus.rohstoff));
    if (roh < ROHSCHWELLE / 2) {
      await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60);
      await klick('fuhre:kauf:rohstoff');
      await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60);
    }
    await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
    if (!await klick('fuhre:fuellen')) await klick('fuhre:wie-vorige');
    await klick('fuhre:abschicken', 70);
    await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
    await klick('sud:zettel-anstich');
    await klick('sud:zettel-charge-frei');
    const z = await seite.evaluate(() => ({ jahr: window.BRAUHAUS.welt.zeit.jahr,
      ende: !!window.BRAUHAUS.welt.zeit.ende }));
    if (z.ende || z.jahr >= STARTJAHR + JAHRE) break;
    if (!await klick('weiter', 45)) {
      await seite.evaluate(() => { const k = document.querySelector('button[data-zug="weiter"]');
        if (k) { k.disabled = false; k.click(); } });
      await seite.waitForTimeout(45);
    }
  }
  await brettAuf();
  const ende = await seite.evaluate(ERNTE);
  await brettZu();
  const endeZettel = await seite.evaluate(ERNTE);
  await seite.close();
  return { art, gewaehlt, nachWahl, ende, endeZettel, fehler, runden: i };
}

const V = await partie('V');
const A = await partie('A');
const Bp = await partie('B');
writeFileSync(AUS, JSON.stringify({ epoche: EPOCHE, jahre: JAHRE, V, A, B: Bp }, null, 1));

const zeig = (p) => {
  console.log('  --- Partie ' + p.art + ': ' + (p.gewaehlt.map((g) => g.zug + '(' + g.preis + ')').join(' + ') || 'Vorgabe, nichts angefasst'));
  const e = p.ende;
  console.log('      Ende ' + e.jahr + '/' + e.woche + (e.endgrund ? ' [' + e.endgrund + ']' : '')
    + '  verfahren=' + JSON.stringify(e.verfahren) + ' fest=' + JSON.stringify(e.fest));
  console.log('      Lager ' + e.lager + ' Fass, Sorten ' + JSON.stringify(e.sorten)
    + ', Stufen ' + JSON.stringify(e.stufen) + ', Haltbarkeit ' + e.haltbarSchnitt
    + ', durch den Gaerkeller ' + e.sudDurch);
  console.log('      Sude ' + e.sude + '/' + e.legte + ', Fass gesamt ' + e.gesamtFass
    + ', Guete ' + e.guete + ', zurueckgestuft ' + e.gestuftGesamt
    + ', Gaerplaetze ' + e.plaetze + ' (zugekauft ' + e.zusatz + ')');
  console.log('      Kasse ' + e.kasse + ', Fehler ' + p.fehler.length);
};
console.log('=== EPOCHE ' + EPOCHE + ', ' + JAHRE + ' Jahre, dieselbe Saat 1350');
zeig(V); zeig(A); zeig(Bp);
await browser.close();
