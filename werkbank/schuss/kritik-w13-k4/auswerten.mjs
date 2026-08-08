import fs from 'node:fs';
const dateien = process.argv.slice(2);
for (const f of dateien) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const geklickt = d.klickProtokoll.filter(k => k.ergebnis === 'geklickt');
  const nichtGegriffen = d.klickProtokoll.filter(k => k.ergebnis !== 'geklickt');
  const zaehler = {};
  for (const k of geklickt) zaehler[k.zug] = (zaehler[k.zug] || 0) + 1;
  const sortiert = Object.entries(zaehler).sort((a, b) => b[1] - a[1]);
  const gesamt = geklickt.length;
  console.log('=== ' + f + ' (epoche ' + d.epoche + ') ===');
  console.log('kumWoche erreicht:', d.kumWocheErreicht, 'ende:', d.endZustand.ende);
  console.log('Klicks gesamt (nur erfolgreiche):', gesamt, '  nicht-gegriffen:', nichtGegriffen.length);
  console.log('Top 8 Knoepfe:');
  sortiert.slice(0, 8).forEach(([zug, n]) => console.log('  ' + zug + ': ' + n + '  (' + (100 * n / gesamt).toFixed(1) + ' %)'));
  const top1 = sortiert[0] ? sortiert[0][1] : 0;
  const top3 = sortiert.slice(0, 3).reduce((s, [, n]) => s + n, 0);
  console.log('haeufigster Knopf: ' + (100 * top1 / gesamt).toFixed(1) + ' %  (' + (sortiert[0] ? sortiert[0][0] : '-') + ')');
  console.log('drei haeufigste zusammen: ' + (100 * top3 / gesamt).toFixed(1) + ' %');
  // Gegner-Zensus
  if (d.gegnerZensus) {
    const ohneGegner = d.gegnerZensus.filter(g => g.anzahlGreifbar === 0).length;
    console.log('Wochen ohne greifbaren+bezahlbaren Gegner-Zug: ' + ohneGegner + ' von ' + d.gegnerZensus.length);
  }
  console.log('lageMax:', d.lageMax, 'Seitenfehler:', d.seitenfehler.length);
  console.log('nicht-gegriffen Details:', JSON.stringify(nichtGegriffen.map(k => k.zug + ':' + k.ergebnis)));
  console.log();
}
