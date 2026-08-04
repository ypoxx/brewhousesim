/* AUSWERTEN — was die sorgfaeltig gespielten Partien ueber DEN SUD sagen.
   node auswerten.mjs /tmp/sudw6/e*.json                                     */
import fs from 'fs';

const dateien = process.argv.slice(2);
const EPJ = { 1: 1350, 2: 1600, 3: 1884, 4: 1970 };
const ACHSEN = { 1: ['wuerze', 'wasser'], 2: ['schuettung', 'gaerung'],
                 3: ['kaelte', 'hefe'], 4: ['fuehrung', 'behandlung'] };

for (const p of dateien) {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const ep = d.epoche, achsen = ACHSEN[ep];
  console.log('='.repeat(96));
  console.log(`${p}  EPOCHE ${EPJ[ep]}  STIL ${d.stil}  ${d.wochen} Wochen `
    + `(${d.reihe[0].jahr}–${d.schluss.jahr})  Fehler ${d.fehler.length}  `
    + `Abbruch ${d.abgebrochen ? JSON.stringify(d.abgebrochen) : 'nein'}`);
  const jahre = [...new Set(d.reihe.map(r => r.jahr))];
  console.log(`  Braujahre ${jahre.length}   Kasse ${d.kasseMin}–${d.kasseMax}   `
    + `Schluss-Kasse ${d.schluss.kasse}   lage ${d.schluss.lage}`);

  /* --- 1  WIRD ETWAS ENTSCHIEDEN? ------------------------------------- */
  /* Eine Frage steht an, wenn in derselben Woche ZWEI Knoepfe derselben
     Achse aktiv UND von der Maus erreichbar sind. */
  const fragen = {}, fragenAktiv = {};
  const paare = { anstich: 0, charge: 0, zettel: 0 };
  let wochenMitFrage = 0, wochenMitPreisFrage = 0;
  for (const w of d.sudwochen) {
    let eineFrage = false, einePreisFrage = false;
    for (const a of achsen) {
      const k = w.bild.filter(b => b.z.startsWith('sud:' + a + ':'));
      const offen = k.filter(b => !b.a && b.h);
      fragen[a] = fragen[a] || { wochen: 0, mit2: 0, mit2preis: 0, max: 0 };
      fragen[a].wochen++;
      fragen[a].max = Math.max(fragen[a].max, offen.length);
      if (offen.length >= 2) { fragen[a].mit2++; eineFrage = true; }
      if (offen.length >= 2 && offen.some(b => b.p)) { fragen[a].mit2preis++; einePreisFrage = true; }
    }
    const an = w.bild.filter(b => /^sud:anstich-/.test(b.z) && !b.a && b.h);
    if (an.length >= 2) { paare.anstich++; eineFrage = true; }
    const ch = w.bild.filter(b => /^sud:charge-/.test(b.z) && !b.a && b.h);
    if (ch.length >= 2) { paare.charge++; eineFrage = true; }
    const ze = w.bild.filter(b => /^sud:zettel-wechsel/.test(b.z) && !b.a && b.h);
    if (ze.length >= 2) { paare.zettel++; eineFrage = true; }
    if (eineFrage) wochenMitFrage++;
    if (einePreisFrage) wochenMitPreisFrage++;
  }
  console.log('  --- 1 WIRD ETWAS ENTSCHIEDEN (Knoepfe aktiv UND von der Maus erreichbar) ---');
  for (const a of achsen) {
    const f = fragen[a];
    console.log(`    Achse ${a.padEnd(11)} in ${f.mit2}/${f.wochen} Wochen >=2 Karten offen `
      + `(davon mit Preisschild ${f.mit2preis}), hoechstens ${f.max} zugleich`);
  }
  console.log(`    Anstich jung/alt zugleich offen: ${paare.anstich}/${d.sudwochen.length} Wochen`);
  console.log(`    Charge frei/verschneiden zugleich: ${paare.charge}/${d.sudwochen.length} Wochen`);
  console.log(`    Kesselzettel: zwei Umstellungen zugleich: ${paare.zettel}/${d.sudwochen.length} Wochen`);
  console.log(`    Wochen mit mindestens einer offenen Frage: ${wochenMitFrage}/${d.sudwochen.length}`
    + `  · davon mit Preisschild: ${wochenMitPreisFrage}`);

  /* --- was WIRKLICH getan wurde, und was es gekostet hat --------------- */
  const nachZug = {};
  d.sudtaten.forEach(t => {
    const s = nachZug[t.zug] = nachZug[t.zug] || { n: 0, kosten: 0 };
    s.n++; s.kosten += Math.abs(t.preis || 0);
  });
  console.log('  --- getane Zuege (Anzahl / Summe bezahlt) ---');
  Object.keys(nachZug).sort().forEach(z =>
    console.log(`    ${z.padEnd(26)} ${String(nachZug[z].n).padStart(4)}x  ${nachZug[z].kosten}`));

  /* --- 2  Festlegungen ------------------------------------------------ */
  const feste = d.sudtaten.filter(t => t.festNach && Object.keys(t.festNach).length
    && t.preis && t.preis !== 0);
  console.log('  --- 2 UNWIDERRUFLICHE FESTLEGUNGEN, die diese Hand wirklich genommen hat ---');
  const gesehen = new Set();
  d.sudtaten.forEach(t => {
    if (!t.festNach) return;
    Object.keys(t.festNach).forEach(k => {
      if (gesehen.has(k)) return; gesehen.add(k);
      console.log(`    ${k.padEnd(22)} in Woche ${t.jahr}/${t.woche} fuer ${Math.abs(t.preis)} `
        + `(Kasse ${t.kasseVor} -> ${t.kasseNach}, das sind `
        + `${(100 * Math.abs(t.preis) / Math.max(1, t.kasseVor)).toFixed(0)} % der Barschaft)`);
    });
  });
  if (!gesehen.size) console.log('    KEINE');
  console.log(`    Schlussstand fest: ${JSON.stringify(d.schluss.sud.fest)}`);
  console.log(`    Schlussstand verfahren: ${JSON.stringify(d.schluss.sud.verfahren)}`);

  /* --- Kasse nach der Festlegung: geht danach noch etwas? -------------- */
  d.sudtaten.filter(t => t.preis && Math.abs(t.preis) > 0).forEach(t => {
    const i = d.reihe.findIndex(r => r.n === t.n);
    const nachher = d.reihe.slice(i + 1, i + 9);
    if (!nachher.length) return;
    const kz = nachher.map(r => r.deckung).filter(x => x != null);
    console.log(`    nach ${t.zug} (${t.jahr}/${t.woche}, -${Math.abs(t.preis)}): `
      + `Kasse acht Wochen ${nachher.map(r => r.kasse).join(' ')} `
      + `Kennzahl ${kz.length ? Math.min(...kz).toFixed(2) + '–' + Math.max(...kz).toFixed(2) : '—'}`);
  });

  /* --- 3  SICHTBAR ABER NICHT BEDIENBAR ------------------------------- */
  let verdeckt = 0, zugeklappt = 0, sollJa = 0, gesamtKnopf = 0, hitAberTot = 0;
  const grundZaehler = {};
  const wochenZugeklappt = new Set();
  for (const w of d.sudwochen) {
    for (const b of w.bild) {
      gesamtKnopf++;
      if (b.a) grundZaehler[b.g || '(ohne Grund)'] = (grundZaehler[b.g || '(ohne Grund)'] || 0) + 1;
      if (b.a && b.s === '0') { sollJa++; if (b.h) hitAberTot++; }
      if (b.v === '1') verdeckt++;
      if (b.g === 'brett-zugeklappt') { zugeklappt++; wochenZugeklappt.add(w.n); }
    }
  }
  console.log('  --- 3 SICHTBAR, ABER BEDIENBAR? ---');
  console.log(`    Knopfablesungen gesamt ${gesamtKnopf}; `
    + `abgeschaltet mit data-soll-aus="0" (also NICHT vom Spiel): ${sollJa} `
    + `(${(100 * sollJa / gesamtKnopf).toFixed(1)} %), davon von der Maus erreichbar: ${hitAberTot}`);
  console.log(`    data-verdeckt="1": ${verdeckt}   data-aus-grund-Verteilung: `
    + Object.entries(grundZaehler).map(([k, v]) => `${k} ${v}`).join(' · '));
  console.log(`    Wochen, in denen trotz Aufschlagen "brett-zugeklappt" stand: `
    + `${wochenZugeklappt.size}/${d.sudwochen.length}  `
    + `(Brett konnte nicht aufgeschlagen werden: ${d.sudwochen.filter(w => !w.aufOk).length})`);
  if (d.klemmer && d.klemmer.length) {
    console.log(`    Beleg: ${d.klemmer[0].bild}  Brett ${JSON.stringify(d.klemmer[0].bef.brettMasse)} `
      + `Knopf ${JSON.stringify(d.klemmer[0].bef.knopfMasse)} trifft ${d.klemmer[0].bef.trefferEl} `
      + `Reiter "${d.klemmer[0].reiter.text}" Klassen "${d.klemmer[0].bef.reiterKlassen}"`);
  }

  /* --- 4  TRAEGT DIE PARTIE EIN EIGENES BIER? -------------------------- */
  console.log('  --- 4 WAS AM SCHIRM UEBER DAS BIER STEHT ---');
  console.log(`    gewaehlt: ${JSON.stringify(d.bierText.gewaehlt)}`);
  console.log(`    Siegelzeilen: ${JSON.stringify(d.bierText.siegelzeilen)}`);
  console.log(`    Kesselzettel: ${d.bierText.kessel}`);

  /* --- d  Barschaft / Preis des naechsten sinnvollen Zuges ------------- */
  const roh = (d.leiterRoh || []).filter(r => r && r.zugVerh);
  console.log('  --- d KENNZAHL (Barschaft / Preis des naechsten sinnvollen Zuges) ---');
  console.log(`    ${roh.length} Jahre: ` + roh.map(r => r.zugVerh.toFixed(2)).join(' · '));
}
