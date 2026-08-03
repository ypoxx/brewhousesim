/* DER SUD, Welle 4 — WIRD GEBRAUT, UND ENTSCHEIDET MAN DABEI ETWAS?

   node linie.mjs <epoche> <wochen> <stil> <ziel.json>
     stil = blind   — die sorgfaeltige Linie aus eichung/preis-linie.mjs,
                      die das Sudhaus NIE anfasst. Das ist der Nullpunkt:
                      wie oft steht eine Bierentscheidung an, wenn niemand
                      sie sucht?
     stil = braut   — dieselbe Hand, die zusaetzlich das Sudhaus fuehrt:
                      Hefe nachfuehren, Gaerraum kaufen, die Festlegung
                      nehmen, sobald sie bezahlbar ist, gesperrte Chargen
                      entscheiden.
     stil = billig  — wie braut, aber die BILLIGE Abkuerzung statt der
                      Festlegung (Hafer, warm, Sack, naturtrueb).

   Gezaehlt wird JEDE Woche am Bildschirm: welche sud-Knoepfe stehen da,
   welche sind aktiv, welche trifft die Maus. Dazu, was das Bier hinterher
   ist: hoechste Sorte, Guete, Bottiche, Sude, Fass, zurueckgestufte Bottiche.

   ACHTUNG, GRENZE VON `braut` UND `billig`: sie suchen ihre Achsknoepfe unter
   den NICHT abgeschalteten. Solange das Sudbrett zugeklappt liegt, sind seine
   Knoepfe abgeschaltet — dieser Automat kauft die Festlegung also nur, wenn
   ein anderer Griff das Brett vorher aufgeschlagen hat. Fuer den Vergleich
   "zwei Partien, verschiedenes Bier" ist deshalb `zweipartien.mjs` zustaendig;
   es schlaegt das eigene Brett ausdruecklich auf. `blind` ist von dieser
   Grenze nicht beruehrt und ist die Zahl, um die es geht.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const STIL = process.argv[4] || 'blind';
const ZIEL = process.argv[5] || `/tmp/sud-w4-e${ep}-${STIL}.json`;
const SAAT = process.env.SAAT || '1350';
const HAFEN = process.env.HAFEN || '8899';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
             x: cx, y: cy, preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
             text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}
const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

async function klick(zug, warte = 60) {
  let l = await lage(zug);
  if (!l || !l.sichtbar || l.aus) return false;
  if (!l.hit) {
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await seite.waitForTimeout(90);
      l = await lage(zug);
      if (l && l.hit) break;
    }
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(warte);
  return true;
}

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
        aus: !!el.disabled, hit,
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) });
    });
    const Zs = B.SUD_ZUSTAND || {};
    const zettel = document.querySelector('.sud-zettel');
    const rang = document.querySelector('.sud-zrang');
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      sorten: B.welt.vorrat.faesser.reduce((o, f) => (o[f.sorte] = (o[f.sorte] || 0) + 1, o), {}),
      lage: B.lage.length,
      sud: {
        verfahren: B.sud ? B.sud.verfahren() : null,
        fest: Object.keys(Zs.fest || {}),
        guete: Zs.guete, bottiche: (Zs.bottiche || []).length,
        jahrSude: Zs.jahrSude, jahrFass: Zs.jahrFass, gestuft: Zs.gestuft,
        gesamtSude: Zs.gesamtSude, gesamtFass: Zs.gesamtFass, jahrFehl: Zs.jahrFehl,
        kalt: Zs.kalt,
        rang: rang ? rang.textContent.trim() : null,
        zettelDa: !!(zettel && !zettel.classList.contains('beiseite'))
      },
      zuege
    };
  });
}

const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);
const ACHSZUG = /^sud:(?!zettel|gaerraum|anstich|hefe-fuehren|charge|schluss)[a-z]+:[a-z]+$/;
const WECHSEL = /^sud:zettel-wechsel-/;

const reihe = [], jahre = [], sudTaten = [];
let abgebrochen = null, festGesetzt = 0;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }
    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();
    const feste = alle(m, /^preis:festlege:/).filter(z => z.preis && Math.abs(z.preis) <= m.kasse * 0.45);
    if (feste.length) {
      const b = feste.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      if (await klick(b.zug, 220)) { festGesetzt++; m = await schirm(); }
    }
    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    if (ang.length) {
      const b = ang.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }
    jahre.push({ jahr: s.jahr, kasseMichaeli: m.kasse, sud: m.sud });
    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);
    await klick('fuhre:ziel:bar', 80);
    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || Math.abs(z.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  /* ---------- ZAEHLUNG: was das Sudhaus diese Woche anbietet ---------- */
  s = await schirm();
  const achsAktiv = s.zuege.filter(z => (ACHSZUG.test(z.zug) || WECHSEL.test(z.zug)) && !z.aus && z.hit);
  const achsDa    = s.zuege.filter(z => ACHSZUG.test(z.zug) || WECHSEL.test(z.zug));
  const chargen   = s.zuege.filter(z => /^sud:charge-/.test(z.zug) && !z.aus && z.hit);
  const anstich   = s.zuege.filter(z => /^sud:(anstich-|hefe-fuehren|zettel-anstich)/.test(z.zug) && !z.aus && z.hit);
  const gaerraum  = s.zuege.filter(z => /^sud:gaerraum/.test(z.zug) && !z.aus && z.hit);
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, rohstoff: s.rohstoff,
    faesser: s.faesser, plaetze: s.plaetze, sud: s.sud,
    wahl: achsAktiv.length, wahlDa: achsDa.length, wahlPreis: achsAktiv.filter(z => z.preis).length,
    charge: chargen.length, anstich: anstich.length, gaerraum: gaerraum.length,
    wahlZuege: achsAktiv.map(z => z.zug + (z.preis ? '|' + z.preis : '')) });

  /* ---------- DIE HAND AM SUDHAUS ---------- */
  if (STIL !== 'blind') {
    /* Hefe: einmal die Woche, kostet kein Geld */
    if (!(await klick('sud:hefe-fuehren', 60))) await klick('sud:zettel-anstich', 60);
    /* gesperrte Chargen (1970): verschneiden, wenn genug im Lager liegt */
    let st = await schirm();
    for (const c of st.zuege.filter(z => /^sud:charge-schnitt:/.test(z.zug) && !z.aus)) {
      if (await klick(c.zug, 80)) { sudTaten.push({ jahr: st.jahr, woche: st.woche, was: c.zug }); break; }
    }
    /* das Verfahren: einmal setzen, dann nie wieder anfassen */
    st = await schirm();
    const ziel = STIL === 'braut'
      ? st.zuege.filter(z => ACHSZUG.test(z.zug) && !z.aus && z.preis && Math.abs(z.preis) <= st.kasse * 0.45)
      : st.zuege.filter(z => ACHSZUG.test(z.zug) && !z.aus && !z.preis && /ohne Ausgabe|Hafer|warm|Sack/i.test(z.text));
    if (ziel.length) {
      const b = STIL === 'braut'
        ? ziel.reduce((a, z) => (Math.abs(z.preis) > Math.abs(a.preis) ? z : a))
        : ziel[0];
      if (await klick(b.zug, 120)) {
        sudTaten.push({ jahr: st.jahr, woche: st.woche, was: b.zug, preis: b.preis, text: b.text });
      }
    }
    /* Gaerraum, wenn der Gaerkeller eng wird und Geld da ist */
    st = await schirm();
    const gr = st.zuege.find(z => z.zug === 'sud:gaerraum' && !z.aus && z.preis);
    if (gr && st.kasse >= 5 * Math.abs(gr.preis) && st.sud.bottiche >= 3) {
      if (await klick('sud:gaerraum', 90)) sudTaten.push({ jahr: st.jahr, woche: st.woche, was: 'sud:gaerraum', preis: gr.preis });
    }
  }

  s = await schirm();
  if (s.plaetze && s.faesser / s.plaetze > 0.95) {
    const ab = alle(s, /^fuhre:tafel-ab:/);
    if (ab.length) await klick(ab[ab.length - 1].zug, 60);
  }
  const kaufRoh = s.zuege.find(z => z.zug === 'fuhre:kauf:rohstoff' && !z.aus);
  if (kaufRoh && kaufRoh.preis && s.rohstoff < 40
      && s.kasse >= 3 * Math.abs(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);

  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }

  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);

  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await klick('weiter', 120))) {
      abgebrochen = { grund: 'WEITER nicht anzufassen', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) {
      abgebrochen = { grund: 'kein Zug veraendert die Woche', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
  }
}

const schluss = await schirm();
const mitWahl = reihe.filter(r => r.wahl >= 2).length;
const mitWahl1 = reihe.filter(r => r.wahl >= 1).length;
const mitPreis = reihe.filter(r => r.wahlPreis >= 1).length;
const verschiedene = [...new Set(reihe.flatMap(r => r.wahlZuege.map(z => z.split('|')[0])))];

fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, stil: STIL, saat: SAAT, wochen: reihe.length, fehler, abgebrochen,
  wochenMitWahl2: mitWahl, wochenMitWahl1: mitWahl1, wochenMitPreis: mitPreis,
  verschiedeneWahlzuege: verschiedene,
  wochenMitCharge: reihe.filter(r => r.charge >= 2).length,
  sudTaten,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse,
             lage: schluss.lage, sud: schluss.sud, sorten: schluss.sorten,
             faesser: schluss.faesser },
  jahre, reihe
}, null, 1));

console.log(`E${ep}/${STIL}: ${reihe.length} Wo (${reihe[0] && reihe[0].jahr}–${schluss.jahr}) · `
  + `Wochen mit >=2 aktiven Bierknoepfen ${mitWahl} · mit >=1 ${mitWahl1} · mit Preisschild ${mitPreis} · `
  + `verschiedene ${verschiedene.length} · Sude ges ${schluss.sud.gesamtSude} / Fass ${schluss.sud.gesamtFass} · `
  + `Rang "${schluss.sud.rang}" · Guete ${schluss.sud.guete} · Kasse ${schluss.kasse} · Fehler ${fehler.length}`,
  abgebrochen || '');
await browser.close();
