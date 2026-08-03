/* DIE EICHUNG — Messung am Bildschirm.
   node messe.mjs <epoche> <wochen> <stil> <ausgabe.json>
   stil: 'sparsam' | 'kaufend'
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 150);
const STIL = process.argv[4] || 'sparsam';
const ZIEL = process.argv[5] || `/tmp/eichung/e${ep}-${STIL}.json`;
const LAUT = !!process.env.LAUT;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false, text: '' };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
             x: cx, y: cy, text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}
/* Klicken heisst: den Zug anfassen, und wenn sein Brett nicht oben liegt,
   es aufschlagen und noch einmal anfassen.

   Bis zum 2.8.2026 stand hier nur die erste Haelfte, und davor lief einmal
   `klappeAuf()` ueber alle sieben Bretter. Das war die Klemme: mit allem
   offen lag DER SUD ueber DIE FUHRE, und `fuhre:kauf:rohstoff` war nie zu
   treffen — die Eichung hat einen Betrieb ohne Einkauf gemessen und fuer
   Wirtschaft gehalten (spiel/BEFUND-BRETTER.md). Seit die STADT eine
   Platzordnung hat, genuegt das eigene Brett: wer aufschlaegt, liegt oben. */
async function klick(zug, warte = 70) {
  let l = await lage(zug);
  if (!l || !l.sichtbar || l.aus) return false;
  if (!l.hit) {
    /* Liegt ein formatfuellendes Blatt oben, hilft kein Reiter — es muss
       zuerst weg. Sonst klickt sich die Runde durch alle sieben Bretter,
       waehrend das Blatt liegen bleibt, und der Lauf bricht zu Georgi ab.
       (Gemessen am 2.8.: Abbruch in Woche 31 in allen vier Epochen.) */
    if (await seite.evaluate(() => !!document.querySelector('.fu-sperre'))) {
      const aus = await lage('fuhre:sommer-zu');
      if (aus && aus.sichtbar && !aus.aus && aus.hit) {
        await seite.mouse.click(aus.x, aus.y);
        await seite.waitForTimeout(200);
        l = await lage(zug);
      }
    }
  }
  if (l && !l.hit) {
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await seite.waitForTimeout(110);
      l = await lage(zug);
      if (l && l.hit) break;
    }
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(warte);
  if (LAUT) console.log('   klick', zug);
  return true;
}
const zuKlappt = () => seite.evaluate(() => document.querySelectorAll('.stadt-zugeklappt').length);
const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

/* Frueher: alle Bretter aufschlagen. Das ist seit der Platzordnung der
   STADT das Gegenteil von hilfreich — jedes Aufschlagen klappt zu, was es
   zudecken wuerde, also endete die Runde in einem zufaelligen Stapel.
   Gebraucht wird nur noch, dass beim Laden nichts quer liegt; den Rest
   besorgt `klick()`, wenn es ein Brett braucht. */
async function klappeAuf() { return; }

async function schirm() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const dk = document.querySelector('.deckung');
    const kopf = document.querySelector('.kopfleiste') || document.body;
    const kt = (kopf.innerText || '').replace(/\n/g, ' | ');
    const km = kt.match(/KASSE\s*\|?\s*([0-9.,\-−]+\s*\S*)/i);
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
        aus: !!el.disabled, hit, text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50) });
    });
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      kasseAmSchirm: km ? km[1].trim() : null,
      deckungText: dk ? dk.textContent : null,
      deckungZahl: dk ? +dk.getAttribute('data-deckung') : null,
      naechsterZug: B.welt.naechsterZug, lage: B.lage.length,
      endeDa: !!document.querySelector('[data-ende], .fu-ende, .ende-blatt'),
      zuege
    };
  });
}

function lageaendernd(z) {
  const k = z.zug;
  if (z.preis === null || z.preis >= 0) return false;
  return /^fuhre:kauf:/.test(k) || /^fuhre:bann:/.test(k) || /^stadt:bau:/.test(k)
    || /^gegner:(abloesen|zuvorkommen|ueberbieten)/.test(k)
    || /^sud:(gaerraum|wuerze:brief|kauf)/.test(k) || /^preis:nimm:/.test(k);
}
function eigeneKennzahl(s) {
  const kand = s.zuege.filter(z => !z.aus && z.hit && lageaendernd(z));
  if (!kand.length) return { wert: null, was: null, preis: null, n: 0 };
  const b = kand.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
  return { wert: s.kasse / Math.abs(b.preis), was: b.zug, preis: Math.abs(b.preis), n: kand.length };
}

async function michaeli() {
  const griff = await lage('preis:tafel');
  let geoeffnet = false;
  if (griff && !/schließen/.test(griff.text)) geoeffnet = await klick('preis:tafel', 300);
  await seite.waitForTimeout(200);
  const t = await seite.evaluate(() => {
    const zaehl = (sel) => {
      const l = [];
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        let hit = false; const sicht = r.width > 0 && r.height > 0;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (sicht && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
          const x = document.elementFromPoint(cx, cy);
          hit = !!(x && (x === el || el.contains(x)));
        }
        l.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, sicht, hit,
                 preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : 0,
                 text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 45) });
      });
      return l;
    };
    const tf = document.querySelector('.pr-tafel');
    const kopf = (document.querySelector('.kopfleiste') || document.body).innerText.replace(/\n/g, ' | ');
    return {
      tafelDa: !!tf,
      tafelText: tf ? (tf.innerText || '').replace(/\s+/g, ' ') : null,
      angebote: zaehl('[data-zug^="preis:nimm:"],[data-zug^="preis:steht:"],[data-zug^="preis:zu:"]'),
      fest: zaehl('[data-zug^="preis:festlege:"],[data-zug="preis:fest-steht"]'),
      kasse: window.BRAUHAUS.welt.haus.kasse,
      kasseAmSchirm: (kopf.match(/KASSE\s*\|?\s*([0-9.,\-−]+\s*\S*)/i) || [])[1] || null
    };
  });
  const aAktiv = t.angebote.filter(a => /^preis:nimm:/.test(a.zug) && !a.aus && a.hit);
  const fAktiv = t.fest.filter(a => /^preis:festlege:/.test(a.zug) && !a.aus && a.hit);
  return {
    kasse: t.kasse, kasseAmSchirm: t.kasseAmSchirm, geoeffnet, tafelDa: t.tafelDa,
    angeboteGesamt: t.angebote.filter(a => /^preis:nimm:/.test(a.zug)).length,
    angeboteKarten: t.angebote.length,
    angeboteAktiv: aAktiv.length, angeboteAktivListe: aAktiv.map(a => ({ zug: a.zug, preis: a.preis })),
    festGesamt: t.fest.filter(a => /^preis:festlege:/.test(a.zug)).length,
    festKarten: t.fest.length,
    festAktiv: fAktiv.length, festAktivListe: fAktiv.map(a => ({ zug: a.zug, preis: a.preis })),
    angeboteAlle: t.angebote.map(a => ({ zug: a.zug, preis: a.preis, aus: a.aus, hit: a.hit, text: a.text })),
    festAlle: t.fest.map(a => ({ zug: a.zug, preis: a.preis, aus: a.aus, hit: a.hit, text: a.text })),
    heuteNicht: t.tafelText ? /HEUTE NICHT/i.test(t.tafelText) : null,
    tafelText: t.tafelText ? t.tafelText.slice(0, 1400) : null
  };
}

await klappeAuf();

const reihe = [], michaelis = [];
let abgebrochen = null, letzteWoche = null;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.woche === 1) {
    /* Der Sommerzettel der FUHRE liegt zu Jahresbeginn oben: Jahresplan
       waehlen, dann schliessen — danach erst geht das Michaeli-Blatt auf. */
    if (await seite.evaluate(() => !!document.querySelector('.fu-sperre'))) {
      if (!(await klick('fuhre:jahresplan:grut', 90))) await klick('fuhre:jahresplan:duenn', 90);
      await klick('fuhre:sommer-zu', 200);
      /* Der Ausgang ist seit Auflage 23 ein sichtbarer Knopf und braucht die
         Planwahl nicht mehr als Vorbedingung — falls oben nichts griff. */
      if (await seite.evaluate(() => !!document.querySelector('.fu-sperre')))
        await klick('fuhre:sommer-zu', 250);
    }
    const m = await michaeli();
    m.jahr = s.jahr; m.woche = s.woche;
    michaelis.push(m);
    if (STIL === 'kaufend' && m.angeboteAktiv > 0) {
      const b = m.angeboteAktivListe.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      await klick(b.zug, 250);
    }
    const g = await lage('preis:tafel');
    if (g && /schließen/.test(g.text)) await klick('preis:tafel', 250);
    await klappeAuf();
    s = await schirm();
  }

  const eig = eigeneKennzahl(s);
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, kasse: s.kasse, kasseAmSchirm: s.kasseAmSchirm,
    schirmDeckung: s.deckungZahl, schirmZug: s.naechsterZug ? s.naechsterZug.was : null,
    schirmPreis: s.naechsterZug ? s.naechsterZug.preis : null,
    lageDeckung: eig.wert === null ? null : +eig.wert.toFixed(3),
    lageZug: eig.was, lagePreis: eig.preis, lageZahl: eig.n });

  const vorher = s.jahr * 100 + s.woche;
  if (s.rohstoff !== undefined && s.rohstoff < 30) await klick('fuhre:kauf:rohstoff', 90);
  if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
  /* FUHRE ABSCHICKEN beendet die Woche selbst. Nur wenn sie danach noch
     steht, wird WEITER gedrueckt — sonst verfaellt jede zweite Woche. */
  await klick('fuhre:abschicken', 150);
  let nach = await schirm();
  let w = true;
  if (nach.jahr * 100 + nach.woche === vorher) {
    w = await klick('weiter', 150);
    if (!w) {
      /* Liegt ein Blatt darueber? Dann wegraeumen und noch einmal. */
      await klick('fuhre:sommer-zu', 150);
      await klick('preis:tafel', 150);
      await seite.keyboard.press('Escape');
      await seite.waitForTimeout(120);
      w = await klick('weiter', 150);
    }
    nach = await schirm();
  }
  if (!w) {
    const decke = await seite.evaluate(() => {
      const el = document.querySelector('[data-zug="weiter"]');
      if (!el) return 'kein WEITER im DOM';
      const r = el.getBoundingClientRect();
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      const pfad = []; let n = t;
      while (n && n !== document.body) { pfad.push(n.tagName.toLowerCase() + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).join('.') : '')); n = n.parentElement; }
      return (el.disabled ? 'AUS ' : '') + 'darueber: ' + pfad.slice(0, 3).join(' < ');
    });
    abgebrochen = { grund: 'WEITER nicht klickbar', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse, decke };
    break;
  }
  if (nach.jahr * 100 + nach.woche === vorher) {
    abgebrochen = { grund: 'kein Zug veraendert die Woche', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse }; break;
  }
  letzteWoche = nach;
}

const schluss = await schirm();
fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, stil: STIL, wochen: reihe.length, fehler, abgebrochen, michaelis, reihe,
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage }
}, null, 1));
console.log(`E${ep} ${STIL}: ${reihe.length} Wochen (${reihe[0] && reihe[0].jahr}–${schluss.jahr}), `
  + `${michaelis.length} Michaelitage, Seitenfehler ${fehler.length}`, abgebrochen || '');
await browser.close();
