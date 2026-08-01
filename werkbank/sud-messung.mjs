// werkbank/sud-messung.mjs — Messung fuer DAS STUECK "DER SUD".
// Misst AM BILDSCHIRM, nicht im Quelltext: echte Mausklicks, elementFromPoint,
// innerText, die Zahlen, die das Spiel selbst aufschreibt.
//
//   node werkbank/sud-messung.mjs [wochen] [saat]
//
// Gibt eine Tabelle je Epoche aus. Kein Urteil, nur Zahlen.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const WOCHEN = +(process.argv[2] || 90);
const SAAT = +(process.argv[3] || 7);
const URL = 'http://127.0.0.1:8899/spiel/';

const browser = await chromium.launch();

// Was auf dem Schirm erreichbar UND aktiv ist — genau so zaehlt der Kritiker.
const zaehleErreichbar = async (seite, praefix) => seite.evaluate((prae) => {
  const l = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const zug = el.getAttribute('data-zug') || '';
    if (prae && zug.indexOf(prae) !== 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const getroffen = !!(t && (t === el || el.contains(t)));
    l.push({
      zug,
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      preis: el.getAttribute('data-preis'),
      aktiv: !el.disabled,
      getroffen
    });
  });
  return l;
}, praefix);

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  seite.on('requestfailed', (r) => fehler.push('request: ' + r.url()));

  await seite.goto(`${URL}?epoche=${epoche}&saat=${SAAT}`, { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(900);

  console.log('\n================ EPOCHE ' + epoche + ' ================');

  // --- 1. Der Kesselzettel: bleibt er ein Punkt? ---------------------------
  const zettel = await seite.evaluate(() => {
    const z = document.querySelector('.sud-zettel');
    if (!z) return null;
    const r = z.getBoundingClientRect();
    const b = document.getElementById('buehne').getBoundingClientRect();
    return {
      breite: Math.round(r.width), hoehe: Math.round(r.height),
      anteil: +((r.width * r.height) / (b.width * b.height) * 100).toFixed(3),
      text: (z.innerText || '').trim().replace(/\n/g, ' | ')
    };
  });
  console.log('Kesselzettel  :', zettel ? `${zettel.breite}x${zettel.hoehe} px = ${zettel.anteil} % der Buehne (Schwelle der STADT: 2,4 %)` : 'FEHLT');
  if (zettel) console.log('              :', zettel.text);

  // --- 2. Vorgabestand: was ist von MEINEM Stueck erreichbar und aktiv? ----
  const vor = await zaehleErreichbar(seite, 'sud:');
  const vorAktiv = vor.filter((x) => x.aktiv && x.getroffen);
  const vorPreis = vorAktiv.filter((x) => x.preis);
  console.log('Vorgabestand  :', `${vorAktiv.length} Zuege des SUD erreichbar+aktiv, davon ${vorPreis.length} mit Preisschild`);
  vorAktiv.forEach((x) => console.log('   ·', x.text, x.preis ? '[' + x.preis + ']' : ''));

  // --- 3. Brett aufschlagen und alles zaehlen -----------------------------
  const reiter = await seite.$('button[data-zug="stadt:reiter:sud-sud-brett"]');
  if (reiter) { await reiter.click(); await seite.waitForTimeout(600); }
  else console.log('  (kein Reiter DAS SUDHAUS gefunden)');
  const auf = await zaehleErreichbar(seite, 'sud:');
  const aufAktiv = auf.filter((x) => x.aktiv && x.getroffen);
  const aufPreis = aufAktiv.filter((x) => x.preis);
  console.log('Brett offen   :', `${aufAktiv.length} erreichbar+aktiv, davon ${aufPreis.length} mit Preisschild`);
  aufAktiv.forEach((x) => console.log('   ·', x.text, x.preis ? '[' + x.preis + ']' : ''));

  const verben = await seite.evaluate(() => {
    const s = new Set();
    document.querySelectorAll('.sud-brett button[data-zug]').forEach((el) => {
      s.add((el.querySelector('.wort') || el).textContent.trim());
    });
    return [...s];
  });
  console.log('Verbliste     :', verben.join(' · '));

  // Brett wieder zuklappen — sonst deckt es die Stadt.
  if (reiter) { await reiter.click(); await seite.waitForTimeout(300); }

  // --- 4. Wochen spielen ---------------------------------------------------
  const spur = [];
  for (let w = 0; w < WOCHEN; w++) {
    // Zu Georgi legt DIE FUHRE ihren Sommerzettel ueber den Hof und sperrt
    // WEITER darunter ab (ZUSTAENDIGKEIT §2 — so ist es gewollt). Wer weiter
    // spielen will, schliesst ihn: "Michaeli — das Jahr beginnt".
    await seite.evaluate(() => {
      const k = document.querySelector('button[data-zug="fuhre:sommer-zu"]');
      if (k && !k.disabled) k.click();
    });
    // Jede Woche neu suchen: kern/kopf.js baut den Knopf beim Jahreswechsel
    // neu, und ein gehaltener Zeiger darauf klickt danach ins Leere.
    try { await seite.click('button[data-zug="weiter"]', { timeout: 4000 }); }
    catch { console.log('  WEITER nicht mehr klickbar in Woche ' + (w + 1)); break; }
    if (w % 10 === 0) await seite.waitForTimeout(40);
    if (w % 15 === 0 || w === WOCHEN - 1) {
      const s = await seite.evaluate(() => {
        const Z = window.BRAUHAUS.SUD_ZUSTAND;
        const W = window.BRAUHAUS.welt;
        return {
          jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende,
          kasse: Math.round(W.haus.kasse), rohstoff: Math.round(W.haus.rohstoff),
          lager: W.vorrat.faesser.length, plaetze: W.vorrat.plaetze,
          bottiche: Z.bottiche.length,
          gaerfass: Z.bottiche.reduce((n, b) => n + b.fass, 0),
          gaerplaetze: window.BRAUHAUS.sud.gaerkeller.plaetze(),
          guete: Math.round(Z.guete),
          sude: Z.gesamtSude, fass: Z.gesamtFass, fehl: Z.jahrFehl,
          haltbarSchnitt: W.vorrat.faesser.length
            ? +(W.vorrat.faesser.reduce((n, f) => n + (f.haltbar || 0), 0) / W.vorrat.faesser.length).toFixed(1)
            : 0,
          durch: W.vorrat.faesser.filter((f) => f.sudDurch).length,
          lage: window.BRAUHAUS.lage.length
        };
      });
      spur.push(s);
    }
  }
  console.log('\nSpur (alle 15 Wochen):');
  console.log('  jahr/wo  kasse    roh  lager/pl  gaer(f/pl)  gute  sude  fass  haltbar-o  sudDurch');
  spur.forEach((s) => console.log('  ' + [
    (s.jahr + '/' + s.woche).padEnd(9),
    String(s.kasse).padStart(7),
    String(s.rohstoff).padStart(5),
    (s.lager + '/' + s.plaetze).padStart(9),
    (s.gaerfass + '/' + s.gaerplaetze).padStart(11),
    String(s.guete).padStart(5),
    String(s.sude).padStart(5),
    String(s.fass).padStart(5),
    String(s.haltbarSchnitt).padStart(10),
    String(s.durch).padStart(9)
  ].join(' ')));

  // --- 5. Keine Sackgasse: was geht bei leerer Kasse und leerer Kammer? ----
  // Erst alles zuklappen, was der Jahreswechsel aufgeschlagen hat — sonst
  // misst man, was ein fremdes Blatt verdeckt, und nicht die eigene Lage.
  await seite.keyboard.press('Escape');
  await seite.waitForTimeout(200);
  const zumachen = await seite.$('button[data-zug="stadt:alles-zuklappen"]');
  if (zumachen) { await zumachen.click(); await seite.waitForTimeout(300); }
  const notlage = await seite.evaluate(() => {
    window.BRAUHAUS.welt.haus.kasse = 0;
    window.BRAUHAUS.welt.haus.rohstoff = 0;
    window.BRAUHAUS.sende('zeichne', { grund: 'pruefung' });
    return true;
  });
  await seite.waitForTimeout(400);
  const not = (await zaehleErreichbar(seite, 'sud:')).filter((x) => x.aktiv && x.getroffen);
  console.log('\nKasse 0, Kammer 0 → ' + not.length + ' Zuege des SUD noch aktiv und erreichbar:');
  not.forEach((x) => console.log('   ·', x.text));

  const wirkt = await seite.evaluate(() => {
    const lies = () => JSON.stringify({
      verfahren: window.BRAUHAUS.sud.verfahren(),
      guete: Math.round(window.BRAUHAUS.SUD_ZUSTAND.guete),
      lager: window.BRAUHAUS.welt.vorrat.faesser.length,
      gaer: window.BRAUHAUS.sud.gaerkeller.plaetze(),
      buch: window.BRAUHAUS.SUD_ZUSTAND.buch.length
    });
    const vorher = lies();
    const k = [...document.querySelectorAll('button[data-zug^="sud:"]')].find((e) => !e.disabled);
    if (!k) return { ok: false, warum: 'kein Knopf' };
    k.click();
    const nachher = lies();
    return { ok: vorher !== nachher, zug: k.getAttribute('data-zug'), vorher, nachher };
  });
  console.log('  Klick auf den ersten aktiven Zug aendert etwas:', JSON.stringify(wirkt));

  console.log('\nSeitenfehler  :', fehler.length ? fehler.join(' | ') : 'keine Fehler auf der Seite');
  const lage = await seite.evaluate(() => window.BRAUHAUS.lage.map((l) => l.text));
  console.log('BRAUHAUS.lage :', lage.length ? lage.join(' | ') : 'leer');

  await seite.close();
}

await browser.close();
