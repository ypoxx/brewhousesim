/* PROBE 13 — die Gegenmessung der Aufsicht zur Welle 13.
 *
 *   HAFEN=8931 node probe13.mjs <epoche> [<wochen>]
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * GESCHRIEBEN AM 8. AUGUST 2026 UM 08:30 UTC — WÄHREND DIE VIER BUILDER NOCH
 * ARBEITEN UND BEVOR IRGENDEIN ERGEBNIS DER WELLE 13 VORLIEGT.
 *
 * Das ist kein Zufall, sondern der Zweck. Ein Maß, das erst gebaut wird,
 * nachdem man das Ergebnis kennt, misst nicht — es begründet. Die Schwellen
 * unten stehen deshalb hier, datiert, bevor sie jemanden treffen können.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * WAS DIESE PROBE MISST — und warum sie dafür KEINEN Reiter anfasst.
 *
 * Die Welle 13 arbeitet die Auflagen des blinden Spielkritikers ab, und fast
 * alle davon sind Auflagen über das, was einem Spieler AUFFÄLLT, ohne dass er
 * sucht. Der Kritiker hat sein eigenes Urteil an genau dieser Stelle
 * eingeschränkt: „Was ich messe, ist eine Untergrenze für das, was auffällt."
 * Diese Probe spielt darum wie sein `gegnerblick.mjs`: nur Karren füllen,
 * abschicken, WEITER. Kein Reiter, kein Brett, kein Suchen.
 *
 * Sechs Zahlen, je Woche am Bildschirm abgelesen:
 *
 *   1  LIEGT DIE TAFEL?      mindestens ein greifbarer Knopf `preis:nimm:*`
 *                            oder `preis:festlege:*`. Bildschirmkriterium, kein
 *                            Quelltextwissen.
 *   2  LÜGT DER KNOPF?       Aufschrift von `preis:tafel` gegen (1) gehalten.
 *                            Zwei Richtungen, beide gezählt: er sagt
 *                            „schließen", während nichts liegt (das ist der
 *                            gemessene Fall, 71 von 71 in 1350) — und er sagt
 *                            NICHT „schließen", während etwas liegt.
 *   3  JAHRESANFANG          in Woche 1 jedes Braujahres: lag die Tafel von
 *                            selbst da? Verlangt sind 10 von 10 (heute 0 von 10).
 *   4  BEZAHLBARER GEGENZUG  greifbare, nicht abgeschaltete Knöpfe `gegner:*`,
 *                            deren Preisschild die Kasse trägt. Ein Zug ohne
 *                            Preisschild („Fass an den Wirt · 1 Fass statt
 *                            Geld") zählt mit, wenn er greifbar und an ist —
 *                            er kostet kein Geld, sondern Vorrat, und wer ihn
 *                            drücken kann, hat einen Gegenzug. Beide Lesarten
 *                            werden getrennt geführt, damit niemand die
 *                            günstigere hinterher aussuchen kann.
 *   5  ZIELWORTE             sichtbare Textzeilen mit Ziel / gewinnen /
 *                            überleben / Übergabe. Heute auf dem ersten Schirm
 *                            null von 613 Zeilen.
 *   6  DIE ÜBERGABE          sichtbarer Text „ÜBERGABE" — und ob er an einem
 *                            Reiter hängt (`stadt:reiter:*`, dann versteckt er
 *                            sich weiter) oder an etwas anderem.
 *
 * WAS DIESE PROBE NICHT MISST, weil es dafür schon ein Maß gibt, das die
 * Ausgangszahl erzeugt hat — und ein zweites Lineal wäre ein zweites Ergebnis:
 *
 *   · der Klickanteil (A7/R13, heute 71 % / 78 %)  → `spiel-w12/hand3.mjs`
 *     unverändert, ausgewertet mit `spiel-w12/zaehle.mjs`
 *   · das Neuladen (A1/R1)                          → `spiel-w12/wiederkehr.mjs`
 *     unverändert
 *   · rho und die Jahre unter 1×                    → `rueckkopplung-r3/linie.mjs`
 *   · abgeschnittener Text (A13/R9)                 → `aufsicht/lesbarkeit.mjs`
 *
 * „Bezahlbar" ist hier wörtlich so definiert wie beim Kritiker
 * (`spiel-w12/hand3.mjs:220`): greifbar heißt Fläche da, nicht abgeschaltet,
 * `elementFromPoint` auf der Mitte trifft den Knopf selbst; bezahlbar heißt
 * zusätzlich `|preis| <= kasse`.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 100);
const HAFEN = process.env.HAFEN || '8931';
const SAAT = process.env.SAAT || '1350';
const NEU = process.env.NEU === '0' ? '' : '&neu=1';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/aufsicht/welle13-gegen';
const MARKE = process.env.MARKE || `e${ep}`;

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}${NEU}`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 250)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 250)); });

await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1300);

/* Ein einziges Ablesen je Woche. Alles daraus gerechnet, nichts nachgeladen. */
const lese = () => seite.evaluate(() => {
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
      aus: !!el.disabled, hit,
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90)
    });
  });
  const txt = [];
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim(); if (!t) return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    if (r.top >= innerHeight || r.left >= innerWidth || r.bottom <= 0 || r.right <= 0) return;
    txt.push(t.replace(/\s+/g, ' ').slice(0, 160));
  });
  let d = null; try { d = B.welt.zugDeckung(); } catch (e) {}
  const n = B.welt.naechsterZug || null;
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse: B.welt.haus.kasse, faesser: B.welt.vorrat.faesser.length,
    chronik: (B.welt.chronik || []).length, lage: B.lage.length,
    deckung: d, nennerWas: n ? n.was : null, nennerPreis: n ? n.preis : null,
    speicher: Object.keys(localStorage || {}).length,
    zuege, txt
  };
});

async function klick(zug) {
  const l = await seite.evaluate(z => {
    const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
  }, zug);
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await seite.waitForTimeout(240);
  return true;
}

const ZIELWORT = /(\bZiel\b|gewinn|überleb|ueberleb|Übergabe|Uebergabe)/i;
const SCHLIESSEN = /(schließ|schliess)/i;

const strom = fs.createWriteStream(`${WURZ}/protokoll/${MARKE}.jsonl`, { flags: 'w' });
const reihe = [];
let ersterSchirm = null;

for (let i = 0; i < N; i++) {
  const s = await lese();
  const greifbar = s.zuege.filter(z => z.hit && !z.aus);
  const tafelKnopf = s.zuege.find(z => z.zug === 'preis:tafel');
  const tafelLiegt = greifbar.some(z => /^preis:(nimm|festlege):/.test(z.zug));
  const sagtSchliessen = !!(tafelKnopf && SCHLIESSEN.test(tafelKnopf.text));

  const gegen = greifbar.filter(z => /^gegner:/.test(z.zug));
  const gegenMitPreis = gegen.filter(z => z.preis !== null);
  const gegenBezahlbarEng = gegenMitPreis.filter(z => Math.abs(z.preis) <= s.kasse);
  const gegenBezahlbarWeit = gegen.filter(z => z.preis === null || Math.abs(z.preis) <= s.kasse);

  const mitPreis = greifbar.filter(z => z.preis !== null);
  const bezahlbar = mitPreis.filter(z => Math.abs(z.preis) <= s.kasse);

  const zielZeilen = s.txt.filter(t => ZIELWORT.test(t));
  const uebergabe = s.zuege.filter(z => /ÜBERGABE|Übergabe/i.test(z.text) && z.hit);

  const zeile = {
    n: i + 1, jahr: s.jahr, woche: s.woche, kasse: s.kasse, faesser: s.faesser,
    lage: s.lage, deckung: s.deckung, nenner: s.nennerWas, nennerPreis: s.nennerPreis,
    speicherSchluessel: s.speicher,
    tafelLiegt, tafelKnopfText: tafelKnopf ? tafelKnopf.text : null, sagtSchliessen,
    luegtZu: sagtSchliessen && !tafelLiegt,      // sagt „schließen", nichts liegt
    luegtAuf: !sagtSchliessen && tafelLiegt && !!tafelKnopf,  // liegt, sagt aber nicht „schließen"
    greifbar: greifbar.length, mitPreis: mitPreis.length, bezahlbar: bezahlbar.length,
    gegenGreifbar: gegen.length, gegenBezahlbarEng: gegenBezahlbarEng.length,
    gegenBezahlbarWeit: gegenBezahlbarWeit.length,
    gegenBeispiel: gegenBezahlbarWeit.slice(0, 3).map(z => `${z.zug}|${z.text}`),
    textzeilen: s.txt.length, zielZeilen: zielZeilen.length,
    zielBeispiel: zielZeilen.slice(0, 4),
    uebergabeSichtbar: uebergabe.length,
    uebergabeAmReiter: uebergabe.filter(z => /^stadt:reiter:/.test(z.zug)).length,
    uebergabeBeispiel: uebergabe.slice(0, 3).map(z => `${z.zug}|${z.text}`)
  };
  reihe.push(zeile);
  strom.write(JSON.stringify(zeile) + '\n');

  if (i === 0) {
    ersterSchirm = { textzeilen: s.txt.length, zielZeilen: zielZeilen.length,
      zielBeispiel: zielZeilen.slice(0, 8), knopf: zeile.tafelKnopfText,
      tafelLiegt, speicherSchluessel: s.speicher };
    await seite.screenshot({ path: `${WURZ}/protokoll/${MARKE}-erster-schirm.png` });
  }
  if (s.ende) break;

  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  await klick('fuhre:abschicken');
  await klick('weiter');
}
strom.end();
await seite.screenshot({ path: `${WURZ}/protokoll/${MARKE}-schluss.png` });

const jahresanfaenge = reihe.filter(r => r.woche === 1);
const je100 = n => reihe.length ? +(100 * n / reihe.length).toFixed(1) : null;

const erg = {
  epoche: ep, url: URL, gespielteWochen: reihe.length,
  jahre: reihe.length ? `${reihe[0].jahr}–${reihe[reihe.length - 1].jahr}` : '—',
  lageMax: Math.max(...reihe.map(r => r.lage)), seitenfehler: fehler.length, fehler: fehler.slice(0, 5),

  ersterSchirm,

  /* 1 + 2 — der lügende Knopf */
  wochenMitTafel: reihe.filter(r => r.tafelLiegt).length,
  knopfDa: reihe.filter(r => r.tafelKnopfText !== null).length,
  luegtZu: reihe.filter(r => r.luegtZu).length,
  luegtAuf: reihe.filter(r => r.luegtAuf).length,
  aufschriften: [...new Set(reihe.map(r => r.tafelKnopfText))].slice(0, 12),

  /* 3 — liegt die Tafel zu Jahresbeginn von selbst? */
  jahresanfaenge: jahresanfaenge.length,
  davonMitTafel: jahresanfaenge.filter(r => r.tafelLiegt).length,

  /* 4 — der bezahlbare Gegenzug */
  wochenOhneGegenzugEng: reihe.filter(r => r.gegenBezahlbarEng === 0).length,
  wochenOhneGegenzugWeit: reihe.filter(r => r.gegenBezahlbarWeit === 0).length,
  wochenOhneGegenzugEngJe100: je100(reihe.filter(r => r.gegenBezahlbarEng === 0).length),
  wochenOhneGegenzugWeitJe100: je100(reihe.filter(r => r.gegenBezahlbarWeit === 0).length),

  /* 5 — die Zielworte */
  wochenMitZielwort: reihe.filter(r => r.zielZeilen > 0).length,

  /* 6 — die Übergabe */
  wochenMitUebergabe: reihe.filter(r => r.uebergabeSichtbar > 0).length,
  davonNurAmReiter: reihe.filter(r => r.uebergabeSichtbar > 0 && r.uebergabeSichtbar === r.uebergabeAmReiter).length,

  /* Wirtschaft, zur Sicherheit mitgeführt */
  wochenOhneBezahlbares: reihe.filter(r => r.bezahlbar === 0).length,
  deckungUnter1: reihe.filter(r => typeof r.deckung === 'number' && r.deckung < 1).length,
  kasseAnfang: reihe.length ? reihe[0].kasse : null,
  kasseEnde: reihe.length ? reihe[reihe.length - 1].kasse : null,
  speicherSchluesselEnde: reihe.length ? reihe[reihe.length - 1].speicherSchluessel : null
};

fs.writeFileSync(`${WURZ}/protokoll/${MARKE}-summe.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
