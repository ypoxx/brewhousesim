/* VERBLISTE — kommt in 1350, 1600, 1884 und 1970 dieselbe Liste heraus?
   Gerechnet aus dem, was waehrend des Spielens wirklich greifbar auf dem
   Schirm stand (hit && !disabled), nicht aus dem Quelltext.
   node verbliste.mjs <lauf1> <lauf2> …                                       */
import fs from 'fs';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12/protokoll';
const verb = z => z.split(':').slice(0, 2).join(':');
const RAHMEN = /^(kern:|klang:|weiter|stadt:reiter|stadt:marke|stadt:alles|stadt:ortsmarken|stadt:bauhof|gegner:zeige|gegner:blatt|preis:chronik|erbe:buch|name:blatt|name:band)/;

const laeufe = process.argv.slice(2).map(l => {
  const j = JSON.parse(fs.readFileSync(`${WURZ}/${l}-wahl.json`));
  const verben = new Set(), texte = new Set(), voll = new Set();
  j.erreichbar.forEach(e => {
    voll.add(e.zug);
    if (RAHMEN.test(e.zug)) return;
    verben.add(verb(e.zug));
  });
  j.knopfTexte.forEach(t => texte.add(t.t.replace(/[−–-]?\s?[\d.,]+\s?(Pf|Gulden|Mark|RM|DM|€|hl|Fass)\b/gi, '§').replace(/\d+/g, '#')));
  return { lauf: l, epoche: j.epoche, verben, texte, voll };
});

const zeig = (name, feld) => {
  console.log(`\n===== ${name} =====`);
  laeufe.forEach(a => console.log(`  E${a.epoche} (${a.lauf}): ${a[feld].size}`));
  console.log('  Paarweise: gemeinsam / nur A / nur B / Jaccard');
  for (let i = 0; i < laeufe.length; i++) for (let k = i + 1; k < laeufe.length; k++) {
    const A = laeufe[i][feld], B = laeufe[k][feld];
    const g = [...A].filter(x => B.has(x));
    const u = new Set([...A, ...B]);
    console.log(`   E${laeufe[i].epoche}↔E${laeufe[k].epoche}: ${g.length} / ${A.size - g.length} / ${B.size - g.length} / ${(g.length / u.size).toFixed(2)}`);
  }
  if (laeufe.length >= 2) {
    const schnitt = [...laeufe[0][feld]].filter(x => laeufe.every(a => a[feld].has(x)));
    console.log(`  In ALLEN ${laeufe.length} Epochen: ${schnitt.length}`);
    if (feld === 'verben') console.log('   ' + schnitt.sort().join(' · '));
    laeufe.forEach(a => {
      const nur = [...a[feld]].filter(x => laeufe.every(b => b === a || !b[feld].has(x)));
      console.log(`  NUR in E${a.epoche}: ${nur.length}`);
      if (feld === 'verben') console.log('   ' + nur.sort().join(' · '));
      else console.log('   ' + nur.sort().slice(0, 18).map(s => s.slice(0, 46)).join(' | '));
    });
  }
};
zeig('VERBEN (data-zug, Stueck:Handlung)', 'verben');
zeig('KNOPFAUFSCHRIFTEN (Zahlen und Waehrung getilgt)', 'texte');
