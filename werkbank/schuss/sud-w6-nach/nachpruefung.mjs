/* NACHPRUEFUNG — die vier Auflagen des blinden Kritikers, an SEINEN Zahlen
   gemessen. Gelesen werden die Dateien, die SEIN Gerät `sud-w6/sudhand.mjs`
   schreibt (unverändert benutzt, Sperrliste 7). Dieses Gerät steht daneben
   und rechnet nur nach.

     node nachpruefung.mjs /tmp/sudnach/nach/e*.json

   AUFLAGE 1 — null Ablesungen eines `sud:*`-Knopfes mit data-soll-aus="0"
               UND disabled UND elementFromPoint-Treffer.
               (Ein Treffer setzt voraus, dass das Brett KEIN
               `stadt-zugeklappt` trägt: `stil/sud-zusatz.css:83` schaltet
               dort `pointer-events: none`, dann trifft die Maus nie den
               Knopf. Die Bedingung des Kritikers ist damit schon in `h`
               enthalten und wird nicht zweimal gefordert.)
   AUFLAGE 2 — Preisschilder DES SUD nebeneinander, aktiv und erreichbar.
               `sud:gaerraum` zählt NICHT mit (Sperrliste 3: „das ist ein
               Kauf, keine Gegenkarte zu einer Wahl"). Zum Vergleich steht
               die Zahl des Kritikers mit Gärraum daneben.
   AUFLAGE 3 — Wochen, in denen `sud:fuehrung:rechner` aktiv UND erreichbar
               war.
   AUFLAGE 4 — die Anstichknöpfe: was sie tragen.                          */
import fs from 'fs';

const EPJ = { 1: 1350, 2: 1600, 3: 1884, 4: 1970 };
const ACHSEN = { 1: ['wuerze', 'wasser'], 2: ['schuettung', 'gaerung'],
                 3: ['kaelte', 'hefe'], 4: ['fuehrung', 'behandlung'] };
const zus = [];

for (const p of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ep = d.epoche;
  console.log('='.repeat(96));
  console.log(`${p}  EPOCHE ${EPJ[ep]}  STIL ${d.stil}  ${d.wochen} W `
    + `(${d.reihe[0].jahr}–${d.schluss.jahr}, ${new Set(d.reihe.map(r => r.jahr)).size} Braujahre)  `
    + `Kasse ${d.kasseMin}–${d.kasseMax}  Fehler ${d.fehler.length}  `
    + `Abbruch ${d.abgebrochen ? JSON.stringify(d.abgebrochen) : 'nein'}`);

  /* ---- AUFLAGE 1 ---- */
  let klemmAbl = 0, klemmWochen = 0, totZugeklappt = 0;
  const wer = {};
  for (const w of d.sudwochen) {
    let inWoche = 0;
    for (const b of w.bild) {
      if (b.g === 'brett-zugeklappt') totZugeklappt++;
      if (b.a && b.s === '0' && b.h) { klemmAbl++; inWoche++; wer[b.z] = (wer[b.z] || 0) + 1; }
    }
    if (inWoche) klemmWochen++;
  }
  console.log(`  AUFLAGE 1  Ablesungen soll-aus=0 + disabled + Maus trifft: ${klemmAbl} `
    + `(in ${klemmWochen}/${d.sudwochen.length} Wochen)   `
    + `${klemmAbl === 0 ? 'ERFUELLT' : 'NICHT ERFUELLT'}`);
  if (klemmAbl) console.log('             ' + Object.entries(wer).sort((a, b) => b[1] - a[1])
    .slice(0, 8).map(([z, n]) => `${z} ${n}x`).join(' · '));
  console.log(`             Ablesungen mit data-aus-grund="brett-zugeklappt" ueberhaupt: ${totZugeklappt}`);

  /* ---- AUFLAGE 2 ---- */
  const streng = {}, weit = {};
  let max = 0;
  for (const w of d.sudwochen) {
    const offen = w.bild.filter(b => b.p && !b.a && b.h);
    const s = offen.filter(b => b.z !== 'sud:gaerraum').length;
    streng[s] = (streng[s] || 0) + 1;
    weit[offen.length] = (weit[offen.length] || 0) + 1;
    max = Math.max(max, s);
  }
  const zeig = (o) => Object.keys(o).sort((a, b) => a - b).map(k => `${k}:${o[k]}W`).join(' · ');
  const zwei = Object.keys(streng).filter(k => +k >= 2).reduce((s, k) => s + streng[k], 0);
  console.log(`  AUFLAGE 2  Preisschilder DES SUD zugleich aktiv+erreichbar, OHNE sud:gaerraum:`);
  console.log(`             ${zeig(streng)}   ->  >=2 Schilder in ${zwei}/${d.sudwochen.length} Wochen`
    + `   ${zwei >= 60 ? 'ERFUELLT (Latte 60)' : 'unter 60'}`);
  console.log(`             mit Gaerraum (die Zaehlung des Kritikers): ${zeig(weit)}`);

  /* welche Achse traegt das Schild */
  for (const a of ACHSEN[ep]) {
    let mit2 = 0, mit2preis = 0, mitPreis = 0;
    for (const w of d.sudwochen) {
      const k = w.bild.filter(b => b.z.startsWith('sud:' + a + ':') && !b.a && b.h);
      if (k.length >= 2) mit2++;
      if (k.length >= 2 && k.some(b => b.p)) mit2preis++;
      if (k.some(b => b.p)) mitPreis++;
    }
    console.log(`             Achse ${a.padEnd(11)} >=2 Karten offen in ${mit2}W · davon mit Preisschild ${mit2preis}W `
      + `· ueberhaupt ein Preisschild in ${mitPreis}W`);
  }

  /* ---- AUFLAGE 3 ---- */
  if (ep === 4) {
    let offenR = 0, sichtR = 0, aktivR = 0;
    for (const w of d.sudwochen) {
      const r = w.bild.find(b => b.z === 'sud:fuehrung:rechner');
      if (!r) continue;
      sichtR++;
      if (!r.a) aktivR++;
      if (!r.a && r.h) offenR++;
    }
    console.log(`  AUFLAGE 3  sud:fuehrung:rechner  am Brett in ${sichtR}W · aktiv in ${aktivR}W · `
      + `aktiv UND erreichbar in ${offenR}/${d.sudwochen.length} Wochen  `
      + `${offenR >= 1 ? 'ERFUELLT' : 'NICHT ERFUELLT'}`);
    const p = d.sudtaten.filter(t => t.zug === 'sud:fuehrung:rechner');
    console.log(`             gekauft: ${p.length ? p.map(t => `${t.jahr}/${t.woche} fuer ${Math.abs(t.preis)} (Kasse ${t.kasseVor}->${t.kasseNach})`).join(', ') : 'nein'}`);
    let offenP = 0;
    for (const w of d.sudwochen) {
      const r = w.bild.find(b => b.z === 'sud:behandlung:pasteur');
      if (r && !r.a && r.h) offenP++;
    }
    console.log(`             zum Vergleich sud:behandlung:pasteur aktiv+erreichbar in ${offenP}W`);
  }

  /* ---- Festlegungen und Schluss ---- */
  const gesehen = new Set(); const feste = [];
  d.sudtaten.forEach(t => {
    if (!t.festNach) return;
    Object.keys(t.festNach).forEach(k => {
      if (gesehen.has(k)) return; gesehen.add(k);
      feste.push(`${k} ${t.jahr}/${t.woche} fuer ${Math.abs(t.preis)} (${(100 * Math.abs(t.preis) / Math.max(1, t.kasseVor)).toFixed(0)} % der Barschaft)`);
    });
  });
  console.log(`  Festlegungen genommen: ${feste.length ? feste.join(' · ') : 'KEINE'}`);
  console.log(`  Schluss: verfahren ${JSON.stringify(d.schluss.sud.verfahren)}  guete ${d.schluss.sud.guete}  `
    + `Fass ${d.schluss.sud.gesamtFass}  Sude ${d.schluss.sud.gesamtSude}  Anzeigen ${d.schluss.sud.jahrAnzeige}`);
  console.log(`  Kesselzettel: ${(d.bierText && d.bierText.kessel || '').replace(/\s+/g, ' ').slice(0, 220)}`);
  console.log(`  Siegelzeilen: ${JSON.stringify(d.bierText && d.bierText.siegelzeilen || [])}`);
  zus.push({ ep, stil: d.stil, klemmAbl, zwei, wochen: d.sudwochen.length, fehler: d.fehler.length,
             abbruch: !!d.abgebrochen });
}

console.log('='.repeat(96));
console.log('ZUSAMMEN');
for (const z of zus) {
  console.log(`  ${EPJ[z.ep]} ${z.stil.padEnd(6)} Klemme ${String(z.klemmAbl).padStart(4)} Ablesungen  `
    + `>=2 Preisschilder ${String(z.zwei).padStart(3)}/${z.wochen} W  `
    + `Fehler ${z.fehler}  Abbruch ${z.abbruch ? 'JA' : 'nein'}`);
}
const kl = zus.reduce((s, z) => s + z.klemmAbl, 0);
console.log(`  AUFLAGE 1 ueber alle Laeufe: ${kl} Ablesungen  ${kl === 0 ? 'ERFUELLT' : 'NICHT ERFUELLT'}`);
