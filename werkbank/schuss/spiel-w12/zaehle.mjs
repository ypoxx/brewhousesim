/* ZAEHLE — was am Bildschirm stand, aus dem Spielprotokoll gerechnet.
   node zaehle.mjs <lauf> [<lauf> …]                                          */
import fs from 'fs';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/spiel-w12/protokoll';

const med = a => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const verb = z => z.split(':').slice(0, 2).join(':');

const zeilen = [];
for (const lauf of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(`${WURZ}/${lauf}-wahl.json`));
  const L = fs.readFileSync(`${WURZ}/${lauf}.jsonl`, 'utf8').trim().split('\n').map(JSON.parse);
  const w = j.wahl;

  const greifbar = w.map(x => x.greifbar), mitPreis = w.map(x => x.mitPreis), bez = w.map(x => x.bezahlbar);
  const verben = new Set(); j.erreichbar.forEach(e => verben.add(verb(e.zug)));
  const verbenOhneRahmen = [...verben].filter(v => !/^(kern|klang|weiter|stadt:reiter|stadt:marke)/.test(v));

  const gz = j.gegner;
  const gegnerZuegeGesamt = gz.length ? (gz[gz.length - 1].zuege - gz[0].zuege) : 0;
  const wochenMitGegnerzug = gz.filter(g => g.neu).length;
  const davonMitSpur = gz.filter(g => g.neu && g.spurAufDemSchirm > 0).length;

  const michaeli = L.filter(l => l.was === 'michaeli');
  const angebote = michaeli.map(m => (m.nimm || []).length);
  const festl = michaeli.map(m => (m.fest || []).length);
  const klicksFest = L.filter(l => l.was === 'klick' && /^preis:festlege:/.test(l.zug)).length;
  const klicksNimm = L.filter(l => l.was === 'klick' && /^preis:nimm:/.test(l.zug)).length;
  const klicksGegner = L.filter(l => l.was === 'klick' && /^gegner:(abloesen|zuvorkommen|hinhalten|beschwerde)/.test(l.zug)).length;
  const klicksGesamt = L.filter(l => l.was === 'klick').length;
  const klickArten = {};
  L.filter(l => l.was === 'klick').forEach(l => { klickArten[l.zug] = (klickArten[l.zug] || 0) + 1; });
  const oft = Object.entries(klickArten).sort((a, b) => b[1] - a[1]);

  const unw = L.filter(l => l.was === 'unwiderruflich-text' || (l.was === 'michaeli' && (l.unwiderruflichText || []).length));
  const unwZeilen = new Set(); unw.forEach(u => (u.zeilen || u.unwiderruflichText || []).forEach(z => unwZeilen.add(z)));

  const deck = w.map(x => x.deckung).filter(x => typeof x === 'number');
  const unter1 = deck.filter(x => x < 1).length;

  zeilen.push({
    lauf, epoche: j.epoche, minuten: j.minuten, wochen: w.length,
    jahre: w.length ? `${w[0].jahr}–${w[w.length - 1].jahr}` : '—',
    klicks: j.klicks, verfehlt: j.danebengegriffen, brettGesucht: j.brettGesucht,
    greifbarMedian: med(greifbar), greifbarMax: Math.max(...greifbar),
    mitPreisMedian: med(mitPreis), mitPreisMax: Math.max(...mitPreis),
    bezahlbarMedian: med(bez),
    wochenMit2PlusPreis: mitPreis.filter(x => x >= 2).length,
    wochenMit2PlusBezahlbar: bez.filter(x => x >= 2).length,
    verben: verbenOhneRahmen.length, verbListe: verbenOhneRahmen.sort(),
    michaeliTafeln: michaeli.length,
    angeboteJeTafel: angebote.join('/'), festlegungenJeTafel: festl.join('/'),
    klicksFestlegung: klicksFest, klicksNahme: klicksNimm, klicksGegner: klicksGegner, klicksGesamt,
    haeufigsteKlicks: oft.slice(0, 6),
    gegnerZuegeGesamt, wochenMitGegnerzug, davonMitSpurAufSchirm: davonMitSpur,
    deckungMin: deck.length ? Math.min(...deck).toFixed(2) : null,
    deckungMedian: deck.length ? med(deck).toFixed(2) : null,
    deckungMax: deck.length ? Math.max(...deck).toFixed(2) : null,
    jahreUnter1: unter1, unwiderruflicheZeilen: [...unwZeilen].slice(0, 10),
    kasseAnfang: w.length ? w[0].kasse : null, kasseEnde: j.schluss.kasse,
    abbruch: j.abbruch, lage: j.schluss.lage, seitenfehler: j.fehler.length
  });
}
console.log(JSON.stringify(zeilen, null, 1));
