// auswertung.mjs — zaehlt aus den Partie-Aufnahmen, wie oft die Entscheidung
// ueber das Bier bedienbar dastand.
//   node auswertung.mjs <datei.json> [...]
import { readFileSync } from 'node:fs';

const WECHSEL = ['sud:zettel-wechsel-frei', 'sud:zettel-wechsel-kauf'];

for (const f of process.argv.slice(2)) {
  const d = JSON.parse(readFileSync(f));
  const ws = d.wochen.filter((x) => x.A);
  const A = ws.map((x) => x.A);
  const n = A.length;
  const hol = (s, zug) => s.sud.find((k) => k.zug === zug) || null;
  const lebt = (s, zug) => { const k = hol(s, zug); return !!(k && !k.aus && k.trifft); };

  const zaehl = {};
  for (const z of [...WECHSEL, 'sud:zettel-gaerraum', 'sud:zettel-anstich',
                   'sud:zettel-hefe-fass', 'sud:zettel-charge-frei', 'sud:zettel-charge-schnitt']) {
    zaehl[z] = { da: 0, aktiv: 0, lebt: 0, spielNein: 0, verdeckt: 0, deckel: {} };
    for (const s of A) {
      const k = hol(s, z);
      if (!k) continue;
      zaehl[z].da++;
      if (!k.aus) zaehl[z].aktiv++;
      if (!k.aus && k.trifft) zaehl[z].lebt++;
      // Der entscheidende Unterschied: sagt das Stueck selbst nein
      // (data-soll-aus="1"), oder liegt nur ein fremdes Brett darauf?
      if (k.sollAus) zaehl[z].spielNein++;
      else if (!k.trifft) {
        if (k.drin === false) { zaehl[z].ausserhalb = (zaehl[z].ausserhalb || 0) + 1; }
        else {
          zaehl[z].verdeckt++;
          const d = k.deckel || '(unbekannt)';
          zaehl[z].deckel[d] = (zaehl[z].deckel[d] || 0) + 1;
        }
      }
    }
  }
  // Latte 2a: ZWEI Entscheidungen mit Preisschild nebeneinander, beide lebendig
  let beide = 0, nurEine = 0, keine = 0;
  const preise = [];
  for (const s of A) {
    const l = WECHSEL.filter((z) => lebt(s, z));
    if (l.length === 2) beide++; else if (l.length === 1) nurEine++; else keine++;
    const k = hol(s, 'sud:zettel-wechsel-kauf');
    if (k && !k.aus && k.trifft) preise.push({ preis: k.preis, kasse: s.kasse, text: k.text });
  }
  // Wie viele Verfahrensknoepfe standen ueberhaupt je bedienbar?
  const brettZuAnteil = A.filter((s) => s.brettZu).length;
  const letzte = d.letzte;
  const kassen = A.map((s) => s.kasse);

  console.log('=== ' + f.split('/').pop() + '  Epoche ' + d.epoche + ' / ' + d.stil
    + '  ' + n + ' gemessene Wochen, ' + A[0].jahr + '–' + letzte.jahr
    + (d.abbruch ? '  ABBRUCH: ' + d.abbruch : '')
    + (letzte.endgrund ? '  endgrund=' + letzte.endgrund : ''));
  console.log('  Brett zugeklappt in ' + brettZuAnteil + '/' + n + ' Wochen');
  for (const z of Object.keys(zaehl)) {
    const c = zaehl[z];
    if (!c.da) { console.log('  ' + z.padEnd(28) + ' NIE am Schirm'); continue; }
    console.log('  ' + z.padEnd(28) + ' da ' + String(c.da).padStart(4)
      + '  bedienbar ' + String(c.lebt).padStart(4) + ' (' + (100 * c.lebt / n).toFixed(1) + ' %)'
      + '  |  Spiel sagt nein ' + String(c.spielNein).padStart(4)
      + '  |  FREMDES BRETT DARAUF ' + String(c.verdeckt).padStart(4)
      + '  |  ausserhalb des Schirms ' + String(c.ausserhalb || 0).padStart(4)
      + (c.verdeckt ? '  darueber: ' + Object.entries(c.deckel).sort((a, b) => b[1] - a[1])
          .slice(0, 3).map(([k2, v]) => k2 + '×' + v).join(', ') : ''));
  }
  console.log('  LATTE 2a — zwei Wahlen nebeneinander bedienbar: ' + beide + '/' + n
    + ' (' + (100 * beide / n).toFixed(1) + ' %), nur eine: ' + nurEine + ', keine: ' + keine);
  if (preise.length) {
    const bezahlbar = preise.filter((p) => p.kasse >= p.preis).length;
    console.log('  LATTE 2d — Kaufknopf bedienbar in ' + preise.length + ' Wochen, Preis '
      + preise[0].preis + ', Kasse >= Preis in ' + bezahlbar + ' davon');
  }
  console.log('  Kasse min ' + Math.min(...kassen) + ' max ' + Math.max(...kassen)
    + ' Median ' + kassen.slice().sort((a, b) => a - b)[Math.floor(kassen.length / 2)]);
  console.log('  ENDE: ' + JSON.stringify({ jahr: letzte.jahr, kasse: letzte.kasse,
    verfahren: letzte.verfahren, fest: letzte.fest, sude: letzte.sude, legte: letzte.legte,
    gesamtFass: letzte.gesamtFass, sorten: letzte.sorten, stufen: letzte.stufen,
    guete: letzte.guete, halt: letzte.halt, gestuftGesamt: letzte.gestuftGesamt,
    bottiche: letzte.bottiche, plaetze: letzte.plaetze, lage: letzte.lage }));
  console.log('  Konsolenfehler: ' + d.fehler.length + (d.fehler.length ? ' ' + JSON.stringify(d.fehler.slice(0, 3)) : ''));
}
