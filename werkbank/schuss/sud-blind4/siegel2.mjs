// siegel2.mjs — das Siegel je Achse einzeln, auf frischer Seite, und dazu
// DIE RATSCHE: haelt "unwiderruflich" auch dann, wenn die Achse zwei
// unwiderrufliche Optionen hat (1970: Labor 42.000, dann Prozessrechner
// 118.000)? Geht es dann noch hinauf — und sicher nicht mehr hinunter?
//
//   node siegel2.mjs <epoche> <hafen> <ausgabe.json>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const HAFEN = +(process.argv[3] || 8911);
const AUS = process.argv[4] || '/tmp/siegel2.json';

const browser = await chromium.launch();
const bericht = { epoche: EPOCHE, achsen: [], fehler: [] };

async function frisch() {
  const s = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  s.on('pageerror', (e) => bericht.fehler.push('pageerror: ' + String(e).slice(0, 200)));
  s.on('console', (m) => { if (m.type() === 'error') bericht.fehler.push('console: ' + m.text().slice(0, 200)); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
    { waitUntil: 'networkidle', timeout: 60000 });
  await s.waitForTimeout(900);
  return s;
}

const lage = (s, zug) => s.evaluate((z) => {
  const k = document.querySelector(`button[data-zug="${z}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  return { x, y, aus: !!k.disabled, sollAus: k.getAttribute('data-soll-aus') === '1',
           trifft: !!(t && (t === k || k.contains(t))),
           text: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 70) };
}, zug);

const zustand = (s) => s.evaluate(() => ({
  verfahren: JSON.parse(JSON.stringify(window.BRAUHAUS.SUD_ZUSTAND.verfahren)),
  fest: Object.keys(window.BRAUHAUS.SUD_ZUSTAND.fest),
  kasse: Math.round(window.BRAUHAUS.welt.haus.kasse),
  jahr: window.BRAUHAUS.welt.zeit.jahr, woche: window.BRAUHAUS.welt.zeit.woche,
  brettZu: !!window.BRAUHAUS.SUD_ZUSTAND.brettZu
}));

// Das Sudbrett sicher aufschlagen: Reiter druecken, notfalls erst alles zu.
async function brettAuf(s) {
  for (let i = 0; i < 4; i++) {
    const zu = await s.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
    if (!zu) {
      const p = await lage(s, `sud:${bericht.probeZug || ''}`);
      if (!bericht.probeZug || (p && p.trifft)) return true;
    }
    const r = await lage(s, 'stadt:reiter:sud-sud-brett');
    if (r && r.trifft && !r.aus) { await s.mouse.click(r.x, r.y); await s.waitForTimeout(200); }
    else { await s.evaluate(() => { const k = document.querySelector('button[data-zug="stadt:alles-zuklappen"]'); if (k) k.click(); }); await s.waitForTimeout(200); }
  }
  return !(await s.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu));
}
async function brettZu(s) {
  const zu = await s.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu);
  if (zu) return;
  const r = await lage(s, 'stadt:reiter:sud-sud-brett');
  if (r && r.trifft && !r.aus) { await s.mouse.click(r.x, r.y); await s.waitForTimeout(200); }
}

async function klick(s, zug, { zwing = false } = {}) {
  if (zwing) await s.evaluate((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
    if (k) { k.disabled = false; k.removeAttribute('aria-disabled'); } }, zug);
  const p = await lage(s, zug);
  if (!p) return { weg: 'kein Knopf' };
  if (p.aus && !zwing) return { weg: 'abgeschaltet', trifft: p.trifft, sollAus: p.sollAus };
  if (!p.trifft) return { weg: 'verdeckt', aus: p.aus, sollAus: p.sollAus };
  await s.mouse.click(p.x, p.y);
  await s.waitForTimeout(150);
  return { geklickt: true, text: p.text };
}

async function weiter(s, n) {
  for (let i = 0; i < n; i++) {
    await s.evaluate(() => { for (const z of ['fuhre:sommer-zu']) {
      const k = document.querySelector(`button[data-zug="${z}"]`); if (k && !k.disabled) k.click(); } });
    const p = await lage(s, 'weiter');
    if (p && !p.aus && p.trifft) await s.mouse.click(p.x, p.y);
    else await s.evaluate(() => { const k = document.querySelector('button[data-zug="weiter"]');
      if (k) { k.disabled = false; k.click(); } });
    await s.waitForTimeout(60);
  }
}

// Welche Achsen/Optionen hat diese Epoche?
{
  const s = await frisch();
  await brettAuf(s);
  bericht.optionen = await s.evaluate(() => [...document.querySelectorAll('button[data-zug^="sud:"]')]
    .map((k) => k.getAttribute('data-zug'))
    .filter((z) => z.split(':').length === 3 && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(z))
    .map((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
      const t = (k.innerText || '').replace(/\s+/g, ' ');
      const m = t.match(/−([\d.,]+)/);
      const karte = k.closest('.sud-karte');
      const marke = karte ? (karte.querySelector('.sud-marke') || {}).textContent : '';
      return { zug: z, achse: z.split(':')[1], k: z.split(':')[2],
               preis: m ? +m[1].replace(/\./g, '').replace(',', '.') : 0,
               marke: (marke || '').trim(), text: t.slice(0, 55) }; }));
  await s.close();
}

const achsen = [...new Set(bericht.optionen.map((o) => o.achse))];

for (const achse of achsen) {
  const dieser = bericht.optionen.filter((o) => o.achse === achse);
  const fest = dieser.filter((o) => o.preis > 0 && /unwiderruflich|gesiegelt/i.test(o.marke));
  const eintrag = { achse, optionen: dieser, festOptionen: fest.map((o) => o.zug), stufen: [] };
  if (!fest.length) { eintrag.hinweis = 'keine unwiderrufliche Option auf dieser Achse'; bericht.achsen.push(eintrag); continue; }

  // Aufsteigend kaufen: erst die billigste Festlegung, dann die naechste.
  const folge = fest.slice().sort((a, b) => a.preis - b.preis);
  const s = await frisch();
  for (const ziel of folge) {
    await s.evaluate((p) => { window.BRAUHAUS.welt.haus.kasse = p + 5000;
      window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); }, ziel.preis);
    await s.waitForTimeout(150);
    await brettAuf(s);
    const vor = await zustand(s);
    const kauf = await klick(s, ziel.zug);
    await s.waitForTimeout(200);
    const nach = await zustand(s);
    const stufe = { gekauft: ziel.zug, preis: ziel.preis, kauf, vor, nach, wege: [] };
    if (nach.verfahren[achse] !== ziel.k) { stufe.hinweis = 'Kauf griff nicht'; eintrag.stufen.push(stufe); continue; }

    // Sechs Wochen spielen, dann jeden Rueckweg.
    await brettZu(s); await weiter(s, 6); await brettAuf(s);
    stufe.nachSechsWochen = await zustand(s);

    const probe = async (name, tu) => {
      const v = await zustand(s);
      const r = await tu();
      await s.waitForTimeout(150);
      const n = await zustand(s);
      const zurueck = n.verfahren[achse] !== v.verfahren[achse];
      stufe.wege.push({ weg: name, ergebnis: r, vorher: v.verfahren[achse], nachher: n.verfahren[achse], zurueck });
      if (zurueck) { await s.evaluate(([a, k]) => { window.BRAUHAUS.SUD_ZUSTAND.verfahren[a] = k;
        window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); }, [achse, ziel.k]); await s.waitForTimeout(120); }
    };

    for (const o of dieser) {
      if (o.zug === ziel.zug) continue;
      const teurerFest = fest.some((f) => f.zug === o.zug && f.preis > ziel.preis);
      await probe((teurerFest ? 'HINAUF ' : 'HINUNTER ') + o.zug + ' — echte Maus', () => klick(s, o.zug));
      if (!teurerFest) {
        await probe('HINUNTER ' + o.zug + ' — zwangsweise aktiviert, echte Maus', () => klick(s, o.zug, { zwing: true }));
        await probe('HINUNTER ' + o.zug + ' — synthetisches click-Ereignis', () => s.evaluate((z) => {
          const k = document.querySelector(`button[data-zug="${z}"]`); if (!k) return 'kein Knopf';
          k.disabled = false; k.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          return 'abgeschickt'; }, o.zug));
      }
      // Das Schild an der Karte nach dem Siegel
      const schild = await s.evaluate((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
        if (!k) return null; const ka = k.closest('.sud-karte');
        return { klasse: ka ? ka.className : null,
                 marke: ka && ka.querySelector('.sud-marke') ? ka.querySelector('.sud-marke').textContent.trim() : null }; }, o.zug);
      stufe.wege[stufe.wege.length - 1].schild = schild;
    }
    // Der Zettel nach dem Siegel
    await brettZu(s);
    stufe.zettel = {
      frei: await lage(s, 'sud:zettel-wechsel-frei'),
      kauf: await lage(s, 'sud:zettel-wechsel-kauf'),
      gaerraum: await lage(s, 'sud:zettel-gaerraum')
    };
    // Nach zwoelf weiteren Jahren (Erbfall faellt hinein) noch einmal.
    await weiter(s, 360);
    stufe.nachZwoelfJahren = await zustand(s);
    await brettAuf(s);
    const vorg = dieser[0];
    await probe('nach 12 Jahren: ' + vorg.zug + ' zwangsweise aktiviert', () => klick(s, vorg.zug, { zwing: true }));
    eintrag.stufen.push(stufe);
    await brettZu(s);
  }
  await s.close();
  bericht.achsen.push(eintrag);
}

writeFileSync(AUS, JSON.stringify(bericht, null, 1));
console.log('=== EPOCHE ' + EPOCHE);
for (const a of bericht.achsen) {
  if (a.hinweis) { console.log('  ' + a.achse + ': ' + a.hinweis); continue; }
  for (const st of a.stufen) {
    const zur = st.wege.filter((w) => w.zurueck);
    const hinunter = st.wege.filter((w) => /^HINUNTER|^nach 12/.test(w.weg));
    const hinauf = st.wege.filter((w) => /^HINAUF/.test(w.weg));
    console.log('  ' + a.achse + ' <- ' + st.gekauft + ' (' + st.preis + '): '
      + hinunter.length + ' Rueckwege probiert, ' + zur.length + ' fuehrten zurueck'
      + (hinauf.length ? '; ' + hinauf.length + ' Aufwaerts-Optionen: '
         + hinauf.map((w) => (w.ergebnis.weg ? 'gesperrt' : 'offen')).join(',') : ''));
    if (zur.length) for (const w of zur) console.log('      >>> ZURUECK: ' + w.weg + '  ' + w.vorher + ' -> ' + w.nachher);
    if (st.zettel) console.log('      Zettel danach: frei=' + (st.zettel.frei ? st.zettel.frei.text : 'kein Knopf')
      + ' | kauf=' + (st.zettel.kauf ? st.zettel.kauf.text : 'kein Knopf')
      + ' | gaerraum=' + (st.zettel.gaerraum ? st.zettel.gaerraum.text : 'kein Knopf'));
  }
}
console.log('  Fehler: ' + bericht.fehler.length);
await browser.close();
