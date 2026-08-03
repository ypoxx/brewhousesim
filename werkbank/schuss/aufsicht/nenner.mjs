/* DER NENNER — die zweite Latte gegen den UMKAEMPFTEN Zug gerechnet.
   node werkbank/schuss/aufsicht/nenner.mjs <epoche> <wochen>

   Warum es das gibt: Die Kopfzeile des Spiels rechnet die Kennzahl gegen den
   billigsten Knopf am Schirm. In 400 Wochen war das in jeder Epoche dieselbe
   Kleinigkeit — Umtrunk 9 Pf, Freitrunk 18 fl, Annonce 240 M, Bierdeckel
   1.800 DM. Drei von vier blinden Kritikern haben das unabhaengig benannt:
   das Spiel misst sich gegen einen Bierdeckel.

   Dieses Werkzeug glaubt der Kopfzeile nicht. Es liest jede Woche Brett fuer
   Brett ALLE Preisschilder selbst vom Schirm und rechnet drei Nenner:

     kopf      was das Spiel selbst behauptet (data-deckung)
     alles     billigstes erreichbares und aktives Preisschild
     umkaempft billigstes Schild an einer Adresse, um die der Gegner mitspielt
               (data-adr) — der Zug, den ein anderer wegnimmt, wenn man wartet

   Nur der dritte steht in der Messlatte. Die Aufsicht misst selbst, weil
   zwischen der Messung eines Builders und der naechsten Runde die anderen
   Stuecke einschlagen.

   FALLSTRICK: nie vier Epochen parallel. Auf vier Kernen brechen alle vier
   reproduzierbar in Woche 31 ab (werkbank/LAUFENDER-AUFTRAG.md).
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const EP = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 160);
const ZIEL = process.argv[4] || `/tmp/nenner/e${EP}.json`;
/* STIL=weiter  nur WEITER — die Obergrenze der Barschaft, aber ein Haus, das
                nichts tut, muss fallen. Allein damit ist die Latte nicht
                gemessen, sondern nur ihr Randfall.
   STIL=kaufend jede Woche den billigsten UMKAEMPFTEN Zug nehmen, sobald die
                Kasse reicht. Das ist der Stil, auf den die Latte zielt:
                bleibt die Kennzahl in der Naehe von 1, wenn man spielt? */
const STIL = process.env.STIL || 'weiter';
/* HAFEN=8900 misst am eingefrorenen Messstand statt am Arbeitsbaum, in dem
   gerade Builder schreiben. Siehe messstand.sh. */
const HAFEN = process.env.HAFEN || '8899';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

/* Ein Preisschild ist erst dann eines, wenn die Maus es trifft. Ein Knopf
   unter einem Blatt ist kein Angebot. */
const ERHEBUNG = () => {
  const raus = [];
  for (const e of document.querySelectorAll('[data-preis]')) {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) continue;
    const t = document.elementFromPoint(cx, cy);
    if (!(t && (t === e || e.contains(t)))) continue;
    const p = Math.abs(parseFloat(String(e.getAttribute('data-preis')).replace(/[^\d.-]/g, '')));
    if (!isFinite(p) || p <= 0) continue;
    raus.push({
      zug: e.getAttribute('data-zug'), preis: p, aus: !!e.disabled,
      adr: e.getAttribute('data-adr') || null,
      text: (e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60)
    });
  }
  return raus;
};

const reiter = await seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

async function sammle() {
  const zusammen = new Map();
  for (const r of reiter) {
    await seite.evaluate(z => document.querySelector(`[data-zug="${z}"]`)?.click(), r);
    await seite.waitForTimeout(60);
    for (const a of await seite.evaluate(ERHEBUNG)) {
      const alt = zusammen.get(a.zug);
      if (!alt || (alt.aus && !a.aus)) zusammen.set(a.zug, a);
    }
  }
  return [...zusammen.values()];
}

/* ACHTUNG, Grenze dieses Werkzeugs — am 2.8.2026 nach der Kernaenderung
   aufgefallen: die Spalte `kopf` ist NICHT das, was der Spieler sieht.
   `sammle()` schlaegt jede Woche alle Bretter der Reihe nach auf; der letzte
   `zeichne`-Durchgang danach findet das Brett des GEGNERS zugeklappt, dieser
   meldet dann keinen umkaempften Zug, und die Kopfzeile faellt auf den
   naechstbesten Rang zurueck. Deshalb steht hier ueber 190 Wochen noch
   'Stueckgut · bis 18 hl' und 199x, waehrend die unberuehrte Seite in Woche 1
   'Abloesung Ausschank am Markt' und 8,35x zeigt.

   Die Spalte `umkaempft` ist davon nicht betroffen — sie wird aus allen
   Brettern selbst gerechnet. Wer die Kopfzeile messen will, misst sie OHNE
   Reiterrundgang. */
const kopfzahl = () => seite.evaluate(() => {
  /* ACHTUNG: data-deckung gibt es zweimal mit verschiedener Bedeutung —
     kern/kopf.js die Kennzahl, stuecke/name.js das Deckungsband des Rufs.
     Nur die Kopfzeile traegt die Klasse .deckung. */
  const e = document.querySelector('.deckung[data-deckung]');
  return e ? { deckung: parseFloat(e.getAttribute('data-deckung')),
               text: (e.textContent || '').replace(/\s+/g, ' ').trim() } : null;
});
/* Die Zeit steht in welt.zeit, nicht an der Uhr — BRAUHAUS.uhr.jahr gibt es
   nicht, und JSON.stringify wirft undefined lautlos weg. Ein erster Anlauf hat
   deshalb 240 Wochen ohne Jahreszahl aufgeschrieben und die Auswertung fand
   'keine umkaempften Angebote', obwohl 60 von 60 Wochen welche hatten. */
const stand = () => seite.evaluate(() => {
  const z = BRAUHAUS.welt.zeit;
  return { kasse: BRAUHAUS.welt.haus.kasse, jahr: z.jahr, woche: z.woche };
});

const zeilen = [];
for (let w = 0; w < WOCHEN; w++) {
  const s = await stand();
  const angebote = await sammle();
  const offen = angebote.filter(a => !a.aus);
  const billigst = l => l.length ? l.reduce((a, b) => (b.preis < a.preis ? b : a)) : null;
  const alles = billigst(offen);
  const umk = billigst(offen.filter(a => a.adr));
  const k = await kopfzahl();
  zeilen.push({
    w, jahr: s.jahr, woche: s.woche, kasse: s.kasse,
    kopf: k ? k.deckung : null, kopfText: k ? k.text : null,
    alles: alles ? { zug: alles.zug, preis: alles.preis, deckung: s.kasse / alles.preis } : null,
    umkaempft: umk ? { zug: umk.zug, preis: umk.preis, deckung: s.kasse / umk.preis } : null,
    angebote: offen.length, davonAdresse: offen.filter(a => a.adr).length
  });

  /* Im Stil 'kaufend' wird der eben gemessene billigste umkaempfte Zug
     genommen, sobald die Kasse ihn traegt. Sein Brett liegt nach dem Rundgang
     womoeglich nicht mehr oben, also erst dessen Reiter, dann der Zug. */
  if (STIL === 'kaufend' && umk && s.kasse >= umk.preis) {
    await seite.evaluate(async (zug) => {
      const frei = e => { const q = e.getBoundingClientRect(); if (!q.width) return false;
        const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        return !!(t && (t === e || e.contains(t))); };
      let e = document.querySelector(`[data-zug="${zug}"]`);
      if (e && !e.disabled && !frei(e)) {
        for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
          r.click();
          e = document.querySelector(`[data-zug="${zug}"]`);
          if (e && frei(e)) break;
        }
      }
      if (e && !e.disabled && frei(e)) e.click();
    }, umk.zug);
    await seite.waitForTimeout(80);
    zeilen[zeilen.length - 1].gekauft = umk.zug;
  }

  /* WEITER — und wenn ein formatfuellendes Blatt oben liegt, erst das weg. */
  const ok = await seite.evaluate(() => {
    const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
      const r = e.getBoundingClientRect(); if (!r.width) return false;
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!(t && (t === e || e.contains(t))); };
    const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
      if (e && !e.disabled) { e.click(); return true; } return false; };
    if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
    if (!frei('weiter')) {
      /* Was WEITER zudeckt, ist das zuletzt aufgeschlagene Brett. Sein Reiter
         klappt es wieder zu. */
      for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
        if (frei('weiter')) break;
        r.click();
      }
    }
    return tu('weiter');
  });
  await seite.waitForTimeout(90);
  if (!ok) { zeilen.push({ w, abbruch: 'WEITER nicht bedienbar' }); break; }
}

fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: EP, fehler, zeilen }, null, 1));

const gut = zeilen.filter(z => z.umkaempft);
const q = l => l.slice().sort((a, b) => a - b);
const med = l => l.length ? q(l)[Math.floor(l.length / 2)] : null;
console.log(`\n=== EPOCHE ${EP} · ${zeilen.length} Wochen · ${fehler.length} Fehler ===`);
console.log(`  Wochen mit umkaempftem Angebot: ${gut.length} von ${zeilen.length}`);
if (gut.length) {
  console.log(`  Kopfzeile behauptet   Median ${med(gut.map(z => z.kopf)).toFixed(2)}×  max ${Math.max(...gut.map(z => z.kopf || 0)).toFixed(2)}×`);
  console.log(`  gegen alles           Median ${med(gut.map(z => z.alles.deckung)).toFixed(2)}×`);
  console.log(`  gegen UMKAEMPFT       Median ${med(gut.map(z => z.umkaempft.deckung)).toFixed(2)}×  max ${Math.max(...gut.map(z => z.umkaempft.deckung)).toFixed(2)}×`);
  const nenner = [...new Set(gut.map(z => z.kopfText && z.kopfText.split('—')[0].trim()))];
  console.log(`  verschiedene Nenner in der Kopfzeile: ${nenner.length}`);
  nenner.slice(0, 6).forEach(n => console.log(`     ${n}`));
}
await browser.close();
