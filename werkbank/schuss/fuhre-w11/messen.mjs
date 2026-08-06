/* DER FLAECHENHAUSHALT — Messgeraet des Rahmens, Welle 10.
 *
 *   HAFEN=8910 node werkbank/schuss/rahmen-w10/messen.mjs [name]
 *   WOCHEN=30 ESC=1 HAFEN=8910 node ... nachher-w30
 *
 * Es misst DASSELBE wie werkbank/schuss/bild-w9/deckung.mjs — Kasten ist, was
 * einen deckenden Grund oder einen sichtbaren Rahmen hat, gezaehlt in
 * BILDPUNKTEN durch Differenz zweier Aufnahmen — und teilt die Bildpunkte
 * zusaetzlich auf die STUECKE auf: je Stueck eine Aufnahme, in der nur SEINE
 * Kaesten unsichtbar sind. Die Summe der Anteile ist >= dem Ganzen, weil sich
 * Kaesten ueberlappen; das ist gewollt und wird mitgemeldet.
 *
 * Dazu vier Pruefungen, die keine Flaeche messen:
 *   RAND     — Kaesten, die ueber 2752x1536 hinausragen           (Auflage 8)
 *   TAFEL    — Kaesten ueber 200.000 px^2                          (Auflage 16)
 *   WAEHRUNG — Preisschilder, die zwischen Zahl und Einheit brechen (Auflage 10)
 *   ZEICHEN  — Textknoten mit einem Zeichen, das keine Schrift zeichnet (7)
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN  = process.env.HAFEN || '8910';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);
const ESC    = +(process.env.ESC || 0);
const NAME   = process.argv[2] || 'lauf';
const ZIEL   = 'werkbank/schuss/fuhre-w11/messungen';
mkdirSync(ZIEL, { recursive: true });

/* ------------------------------------------------------------------ *
 * Im Browser: Kaesten markieren und ihrem Stueck zuordnen.
 * ------------------------------------------------------------------ */
const markiere = () => {
  const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  const treffer = [];
  document.querySelectorAll('#buehne *').forEach(el => {
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    /* WEGGESCHNITTEN IST NICHT OFFEN. `.stadt-zugeklappt` traegt
       clip-path: inset(50%) — die Huelle bleibt 1293x1091, gedeckt wird
       nichts. bild-w9/deckung.mjs zaehlt sie trotzdem als Kasten; in
       Bildpunkten macht das nichts aus, in der Tafelliste sehr wohl. */
    if (/inset\(\s*50%/.test(c.clipPath || '')) return;
    if (parseFloat(c.opacity) < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    const a = rgba(c.backgroundColor);
    const hatGrund = a !== null && a > 0.35;
    const bi = c.backgroundImage || 'none';
    const hatVerlauf = /gradient/.test(bi);
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
      .map(k => parseFloat(c[k]) || 0);
    const ab = rgba(c.borderTopColor) ?? rgba(c.borderBottomColor);
    const hatRahmen = Math.max(...bw) >= 1 && ab !== null && ab > 0.3;
    if (hatGrund || hatVerlauf || hatRahmen) treffer.push(el);
  });
  const raus = treffer.filter(el => {
    const r = el.getBoundingClientRect();
    return !(r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98);
  });
  const wer = el => {
    const f = el.closest('.fach');
    return (f && f.getAttribute('data-stueck')) || 'ohne-fach';
  };
  const liste = [];
  raus.forEach(el => {
    el.dataset.w10kasten = '1';
    const s = wer(el);
    el.dataset.w10stueck = s;
    const r = el.getBoundingClientRect();
    liste.push({
      stueck: s,
      klasse: (el.className && el.className.baseVal !== undefined
                ? el.className.baseVal : String(el.className || '')).slice(0, 60),
      tag: el.tagName.toLowerCase(),
      x: Math.round(r.x), y: Math.round(r.y),
      b: Math.round(r.width), h: Math.round(r.height),
      flaeche: Math.round(r.width * r.height),
      /* ragt es ueber den Bildrand? */
      raus: (r.x < -0.5 || r.y < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5),
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
    });
  });
  const stuecke = [...new Set(liste.map(k => k.stueck))].sort();
  return { anzahl: raus.length, liste, stuecke };
};

/* Waehrung getrennt? Ein Preisschild, dessen Text ueber mehrere Zeilen bricht. */
const waehrungsbruch = () => {
  const raus = [];
  document.querySelectorAll('#buehne .preis, #buehne [data-preis], #buehne .fu-preis, #buehne .pr-preis')
    .forEach(el => {
      /* nur Blaetter mit eigenem Text ansehen */
      const kinder = [...el.childNodes].filter(n => n.nodeType === 3 && n.nodeValue.trim());
      kinder.forEach(n => {
        const r = document.createRange(); r.selectNodeContents(n);
        const z = r.getClientRects();
        if (z.length > 1) {
          /* bricht die letzte Zeile mitten in einem Geldbetrag? */
          raus.push({
            text: n.nodeValue.trim().slice(0, 40),
            zeilen: z.length,
            klasse: String(el.className || '').slice(0, 40),
            x: Math.round(z[0].x), y: Math.round(z[0].y)
          });
        }
      });
    });
  return raus;
};

/* Fehlende Glyphen: ein Zeichen, das PIXELGLEICH so aussieht wie ein
   garantiert fehlendes (U+FFFF) — also als leeres Rechteck (.notdef) steht.
   Ueber die BREITE geht das nicht: in einer Festbreitenschrift haben alle
   Zeichen dieselbe Breite, und der Zaehler meldet dann jedes Sonderzeichen. */
const fehlendeZeichen = () => {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const c = cv.getContext('2d', { willReadFrequently: true });
  const abdruck = (font, ch) => {
    c.clearRect(0, 0, 64, 64);
    c.font = font; c.fillStyle = '#000'; c.textBaseline = 'alphabetic';
    c.fillText(ch, 4, 48);
    const d = c.getImageData(0, 0, 64, 64).data;
    let h = 2166136261;
    for (let i = 3; i < d.length; i += 4) { h ^= (d[i] > 40 ? 1 : 0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const gesehen = new Map();          /* font|zeichen -> boolean */
  const raus = [];
  const gehe = (knoten) => {
    const w = document.createTreeWalker(knoten, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const t = n.nodeValue;
      if (!t || !t.trim()) continue;
      const el = n.parentElement;
      if (!el) continue;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none') continue;
      const font = `${st.fontStyle} ${st.fontWeight} 40px ${st.fontFamily}`;
      for (const ch of new Set(t)) {
        if (ch.codePointAt(0) < 0x80) continue;
        const k = font + '|' + ch;
        if (gesehen.has(k)) { if (gesehen.get(k)) raus.push({ ch, code: 'U+' + ch.codePointAt(0).toString(16).toUpperCase(), font: st.fontFamily.slice(0, 40) }); continue; }
        const fehlt = abdruck(font, ch) === abdruck(font, '￿');
        gesehen.set(k, fehlt);
        if (fehlt) raus.push({ ch, code: 'U+' + ch.codePointAt(0).toString(16).toUpperCase(), font: st.fontFamily.slice(0, 40) });
      }
    }
  };
  gehe(document.getElementById('buehne'));
  const einmalig = [];
  const s = new Set();
  raus.forEach(r => { const k = r.code + r.font; if (!s.has(k)) { s.add(k); einmalig.push(r); } });
  return einmalig;
};

/* ------------------------------------------------------------------ */
const b = await chromium.launch();
const bericht = [];
const daten = {};

const EPOCHEN = (process.env.EPOCHEN || '1,2,3,4').split(',').map(Number);
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(x.message));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(250); }
  await s.waitForTimeout(700);

  /* BEWEGUNG ANHALTEN. Ohne das misst der Vergleich zweier Aufnahmen nicht nur
     den weggenommenen Kasten, sondern auch Rauch, Wagen und Laufschrift: der
     erste Durchgang meldete fuer JEDES Stueck mindestens 4,5 %, auch fuer den
     Tonschalter, der 40x40 gross ist. Beide Aufnahmen entstehen jetzt im
     selben angehaltenen Bild. */
  await s.addStyleTag({ content:
    '*,*::before,*::after{animation-play-state:paused !important;'
    + 'animation-delay:0s !important;transition:none !important;}' });
  await s.waitForTimeout(400);

  const k = await s.evaluate(markiere);
  const brueche = await s.evaluate(waehrungsbruch);
  const zeichen = await s.evaluate(fehlendeZeichen);
  const lage = await s.evaluate(() => (BRAUHAUS.lage || []).length);
  const verdeckt = await s.evaluate(() => {
    try { return BRAUHAUS.stadt && BRAUHAUS.stadt.rahmen && BRAUHAUS.stadt.rahmen.verdeckt
      ? BRAUHAUS.stadt.rahmen.verdeckt() : null; } catch (x) { return 'FEHLER'; }
  });

  const voll = await s.screenshot();
  const A = pngLesen(voll);

  const s6 = Math.floor(H / 6);
  /* Maske: welche Bildpunkte liegen ueberhaupt in einer Kastenhuelle dieses
     Satzes? Ausserhalb kann kein weggenommener Kasten etwas veraendern —
     was sich dort dennoch bewegt, ist Restbewegung und wird nicht gezaehlt. */
  const maske = (kaesten) => {
    const m = new Uint8Array(W * H);
    for (const q0 of kaesten) {
      /* Schattenrand: box-shadow faellt neben die Huelle. NICHT den Eintrag
         selbst veraendern — maske() laeuft mehrfach ueber dieselbe Liste, und
         beim ersten Versuch wanderten dadurch die gemeldeten Koordinaten. */
      const q = { x: q0.x - 30, y: q0.y - 30, b: q0.b + 60, h: q0.h + 60 };
      const x0 = Math.max(0, q.x), y0 = Math.max(0, q.y);
      const x1 = Math.min(W, q.x + q.b), y1 = Math.min(H, q.y + q.h);
      for (let y = y0; y < y1; y++) { const z = y * W; for (let x = x0; x < x1; x++) m[z + x] = 1; }
    }
    return m;
  };
  const zonen = (Bd, m) => {
    const zone = (y0, y1) => {
      let t = 0, g = 0;
      for (let y = y0; y < y1; y++) for (let x = 0; x < W; x++) {
        const j = y * W + x, i = j * 4; g++;
        if (!m[j]) continue;
        if (Math.abs(A.daten[i] - Bd.daten[i]) > 8 || Math.abs(A.daten[i+1] - Bd.daten[i+1]) > 8 ||
            Math.abs(A.daten[i+2] - Bd.daten[i+2]) > 8) t++;
      }
      return { anteil: 100 * t / g, punkte: t };
    };
    return { ges: zone(0, H), oben: zone(0, s6), mitte: zone(s6, H - s6), unten: zone(H - s6, H) };
  };

  /* Gerätekontrolle: zwei Aufnahmen OHNE jede Änderung. Was hier auffaellt,
     ist Restbewegung und gehoert in keinen Haushalt. */
  await s.waitForTimeout(300);
  const ruhe = zonen(pngLesen(await s.screenshot()), maske(k.liste));

  /* alle Kaesten weg — das Ganze */
  await s.evaluate(() => document.querySelectorAll('[data-w10kasten]')
    .forEach(el => { el.style.visibility = 'hidden'; }));
  await s.waitForTimeout(300);
  const gesamtBild = await s.screenshot();
  const gesamt = zonen(pngLesen(gesamtBild), maske(k.liste));
  await s.evaluate(() => document.querySelectorAll('[data-w10kasten]')
    .forEach(el => { el.style.visibility = ''; }));
  await s.waitForTimeout(200);

  /* je Stueck */
  const jeStueck = {};
  for (const st of k.stuecke) {
    await s.evaluate((n) => document.querySelectorAll(`[data-w10stueck="${n}"]`)
      .forEach(el => { el.style.visibility = 'hidden'; }), st);
    await s.waitForTimeout(220);
    const bild = await s.screenshot();
    jeStueck[st] = zonen(pngLesen(bild), maske(k.liste.filter(q => q.stueck === st)));
    await s.evaluate((n) => document.querySelectorAll(`[data-w10stueck="${n}"]`)
      .forEach(el => { el.style.visibility = ''; }), st);
    await s.waitForTimeout(150);
  }

  /* EINZELNE KAESTEN DES RAHMENS — die Zahl, nach der Auflage R1 fragt:
     „die Kopfleiste ALLEIN unter 12 % des obersten Sechstels". Der
     Stueck-Anteil `kern` traegt Kopfleiste, Hauszeile, WEITER und das
     Deckungsband zusammen; hier wird jeder fuer sich weggenommen.
     Laeuft NACH allen Stueck-Durchgaengen und aendert an ihnen nichts —
     maske() ist nicht mehr veraendernd (der Fehler, der die Koordinaten der
     ersten Messung verschoben hat, steckte genau dort). */
  const EINZELN = ['.kopfleiste', '.hauszeile', '.deckung', '[data-zug="weiter"]'];
  const jeKasten = {};
  for (const sel of EINZELN) {
    const da = await s.evaluate((q) => {
      const el = document.querySelector('#buehne ' + q);
      if (!el) return null;
      el.setAttribute('data-w10einzeln', '1');
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y),
               b: Math.round(r.width), h: Math.round(r.height) };
    }, sel);
    if (!da) { jeKasten[sel] = null; continue; }
    await s.evaluate(() => document.querySelectorAll('[data-w10einzeln]')
      .forEach(el => { el.style.visibility = 'hidden'; }));
    await s.waitForTimeout(220);
    const bild = await s.screenshot();
    jeKasten[sel] = Object.assign({ huelle: da.b * da.h, mass: `${da.b}×${da.h} @${da.x},${da.y}` },
      zonen(pngLesen(bild), maske([{ x: da.x, y: da.y, b: da.b, h: da.h }])));
    await s.evaluate(() => document.querySelectorAll('[data-w10einzeln]')
      .forEach(el => { el.style.visibility = ''; el.removeAttribute('data-w10einzeln'); }));
    await s.waitForTimeout(150);
  }

  const p = v => v.toFixed(1).padStart(5) + ' %';
  bericht.push(`\n=== EPOCHE ${e}${WOCHEN ? ' nach ' + WOCHEN + ' Wochen' : ''}${ESC ? ' + ' + ESC + '× Escape' : ''}`
    + `   lage ${lage}  Seitenfehler ${fehler.length}  verdeckt() ${verdeckt}`);
  bericht.push(`RUHEPROBE   (ohne jede Änderung, muss ~0 sein)  gesamt ${p(ruhe.ges.anteil)}   `
    + `oberstes 1/6 ${p(ruhe.oben.anteil)}   ${ruhe.ges.punkte} px`);
  bericht.push(`GESAMT      Kaesten ${String(k.anzahl).padStart(4)}   gesamt ${p(gesamt.ges.anteil)}   `
    + `oberstes 1/6 ${p(gesamt.oben.anteil)}   Mittelband ${p(gesamt.mitte.anteil)}   unterstes 1/6 ${p(gesamt.unten.anteil)}`);
  const sortiert = Object.entries(jeStueck).sort((a, c) => c[1].ges.punkte - a[1].ges.punkte);
  for (const [st, z] of sortiert) {
    const n = k.liste.filter(x => x.stueck === st).length;
    bericht.push(`  ${st.padEnd(10)} Kaesten ${String(n).padStart(4)}   gesamt ${p(z.ges.anteil)}   `
      + `oberstes 1/6 ${p(z.oben.anteil)}   Mittelband ${p(z.mitte.anteil)}   unterstes 1/6 ${p(z.unten.anteil)}`
      + `   ${String(z.ges.punkte).padStart(8)} px`);
  }
  /* die groessten Einzelkaesten */
  const gross = k.liste.slice().sort((a, c) => c.flaeche - a.flaeche).slice(0, 8);
  bericht.push('  groesste Kaesten (Huelle):');
  gross.forEach(g => bericht.push(`    ${String(g.flaeche).padStart(8)} px²  ${g.stueck.padEnd(8)} `
    + `${g.b}×${g.h} @${g.x},${g.y}  .${g.klasse}  „${g.text}"`));
  const tafeln = k.liste.filter(x => x.flaeche > 200000);
  bericht.push(`  TAFELN über 200.000 px²: ${tafeln.length}`
    + tafeln.map(t => `\n    ${t.stueck} .${t.klasse} ${t.b}×${t.h} @${t.x},${t.y} = ${t.flaeche}`).join(''));
  const ueberRand = k.liste.filter(x => x.raus);
  bericht.push(`  ÜBER DEM RAND: ${ueberRand.length}`
    + ueberRand.slice(0, 12).map(t => `\n    ${t.stueck} .${t.klasse} ${t.b}×${t.h} @${t.x},${t.y} „${t.text}"`).join(''));
  bericht.push(`  WÄHRUNGSBRUCH: ${brueche.length}`
    + brueche.slice(0, 12).map(t => `\n    „${t.text}" ${t.zeilen} Zeilen .${t.klasse} @${t.x},${t.y}`).join(''));
  bericht.push(`  FEHLENDE ZEICHEN: ${zeichen.length}`
    + zeichen.slice(0, 12).map(t => `\n    ${t.code} „${t.ch}" in ${t.font}`).join(''));

  daten[e] = { ruhe, gesamt, jeStueck, kaesten: k.liste, tafeln, ueberRand, brueche, zeichen, lage, fehler: fehler.length, verdeckt };
  await s.close();
}
await b.close();
const txt = bericht.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}.txt`, txt);
writeFileSync(`${ZIEL}/${NAME}.json`, JSON.stringify(daten));
