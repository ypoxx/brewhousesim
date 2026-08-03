/* WELLE 4 — je Stueck ein Builder, ein blinder Kritiker, eine Nacharbeit.
 *
 * Dieses Skript liegt IM REPO, nicht im Transkriptverzeichnis. Am 3. August 2026
 * hat ein Container-Reset das Verzeichnis von wf_eccf90fc-7a6 geloescht und damit
 * das Journal, die Urteile und das Skript selbst. Begruendung und die uebrigen
 * Regeln: werkbank/wellen/LIESMICH.md
 *
 *   Workflow({scriptPath: "werkbank/wellen/welle-4.js"})
 */
export const meta = {
  name: 'gauntlet-welle-4',
  description: 'Welle 4: 1600 laeuft davon, der Zaehler zaehlt nicht, die dritte Latte wurde nie gemessen',
  phases: [
    { title: 'Bauen', detail: 'vier Builder, je ein Stueck' },
    { title: 'Pruefen', detail: 'je ein blinder Kritiker, frischer Kontext' },
    { title: 'Nacharbeit', detail: 'Builder antwortet auf sein Urteil' },
  ],
}

const REGELN = `
ARBEITSVERZEICHNIS /home/user/brewhousesim. Das Spiel laeuft unter
http://127.0.0.1:8899/spiel/?epoche=1..4&saat=1350 (Server laeuft bereits).

REGELN, die ueber allem stehen (spiel/LIESMICH.md, spiel/ZUSTAENDIGKEIT.md):
- spiel/index.html ist EINGEFROREN. spiel/kern/** ist SCHREIBGESCHUETZT.
  Noetige Kernaenderungen als Absatz "KERN: ..." in den Bericht; die Aufsicht
  arbeitet sie ein, wenn kein Agent mehr laeuft.
- NIEMALS git. Nur Dateien schreiben. Die Aufsicht sichert deine Arbeit.
- Fass NUR die Dateien deines Stuecks an (spiel/LIESMICH.md).
- welt.meldeZug(was, preis, art, zug) hat vier Argumente (ZUSTAENDIGKEIT 24).

PRUEFE VOR DEM ABGEBEN, immer:
  node --check auf jede geaenderte .js-Datei
  alle vier Epochen laden, BRAUHAUS.lage.length === 0, keine Konsolenfehler
Playwright: import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'

MISS AM BILDSCHIRM, nicht im Quelltext. Wer sagt "es funktioniert", ohne es
gezaehlt zu haben, hat nichts gesagt.

FALLSTRICKE, die diesen Lauf schon Stunden gekostet haben:
- BRAUHAUS.uhr.jahr gibt es NICHT. Die Zeit steht in BRAUHAUS.welt.zeit.
- welt.vorrat.faesser ist eine Liste EINZELNER Faesser ohne Stueckzahlfeld.
- data-deckung gibt es zweimal mit verschiedener Bedeutung; nur die Kopfzeile
  traegt zusaetzlich die Klasse .deckung.
- Wer alle Bretter aufschlaegt und danach die Kopfzeile liest, misst seinen
  eigenen Rundgang.
- pkill -f "<muster>" erschlaegt die eigene Shell, wenn das Muster in ihrer
  Kommandozeile steht.
`

const LATTE = `
DIE MESSLATTE (gauntlet/MESSLATTE.md), Latte 2 — DAS SPIEL. Zaehl am Bildschirm,
mit der Maus, in jeder der vier Epochen:
 (a) Entscheidungen mit Preisschild nebeneinander, erreichbar UND aktiv
 (b) unwiderrufliche Festlegungen
 (c) Zuege des Gegners, die ohne dich geschehen
 (d) Barschaft ÷ Preis des naechsten sinnvollen Zuges. Die Latte ist
     ZWEISEITIG: weder davonlaufen noch zusammenbrechen. Ziel |rho| < 0,7 und
     hoechstens ein Jahr von sechs unter 1x.
 (e) die Verbliste je Epoche — viermal dieselbe heisst: die Epoche ist ein Kostuem.
design/PRUEFUNG.md ist SPERRLISTE, keine Latte.
`

const URTEIL_SCHREIBEN = (stueck) => `
BEVOR du zurueckgibst, schreib dein Urteil nach
werkbank/urteile/welle4-${stueck}.md — Urteil, Zahlen, Auflagen und Sperrliste
im Wortlaut. Der Ruecklauf des Workflows ueberlebt keinen Container-Reset, eine
Datei im Repo schon. Am 3. August sind so elf von zwoelf Urteilen verloren
gegangen, und die Builder haetten gegen nichts nacharbeiten muessen.
`

const STUECKE = [
  {
    k: 'rueckkopplung',
    name: 'DIE RUECKKOPPLUNG (Runde 2)',
    auftrag: `DIE RUECKKOPPLUNG, Runde 2 — 1600 laeuft davon.
Dateien: stuecke/preis*.js, stil/preis*.css

DAS SCHWERSTE STUECK DER WELLE. Die Aufsicht hat am Stand ee1715b vier Laeufe des
sorgfaeltig spielenden Automaten gefahren (werkbank/schuss/eichung/preis-linie.mjs,
je 400 Wochen, 14 Jahre, 0 Seitenfehler). Ergebnis:

  Epoche  Start -> Ende   min-max      rho      Jahre unter 1x   Latte
  1350    5,89 -> 2,69   0,75-7,88   -0,152        1 von 14      besteht
  1600    3,76 -> 27,81  2,27-67,33  +0,873        0 von 14      REISST
  1884    8,35 -> 2,06   0,63-10,18  +0,143        1 von 14      besteht
  1970    2,25 -> 2,54   0,81-6,53   -0,112        1 von 14      besteht

1600 ist das EINZIGE, das reisst, und es reisst NACH OBEN: die Barschaft waechst
schneller als die Preise. Das ist der Patrizier-IV-Fall, gegen den die Messlatte
geschrieben wurde. In Welle 2b war 1600 das einzige, das sauber bestand (+0,165)
— es ist beim Reparieren der anderen drei kaputtgegangen.

Deine Aufgabe:
- Finde zuerst heraus, WAS 1600 anders macht als die drei, die bestehen. Miss es.
  Die Rohdaten liegen in werkbank/urteile/e1.json bis e4.json.
- In 1884 wachsen die Preise mit dem Erfolg mit (8,35 -> 2,06 bei wachsendem
  Vermoegen). Dort liegt vermutlich das Muster, das 1600 fehlt.
- UND BRICH DIE ANDEREN DREI NICHT. Deine Nachmessung zeigt alle vier Epochen,
  nicht nur 1600. Genau dieser Fehler ist in Welle 3 passiert.`,
  },
  {
    k: 'der-preis',
    name: 'DER PREIS',
    auftrag: `DER PREIS — der Zaehler, der nie zaehlt, und der letzte Pfennig unter null.
Dateien: stuecke/preis*.js

1. "Chronik des Hauses · 0 Festlegungen" steht in ALLEN VIER Epochen auf 0, auch
   nach bezahlter Festlegung. Von der Aufsicht am Stand ee1715b nachgezaehlt,
   unveraendert seit Welle 2b. DER GEGNER hat die Ursache damals gefunden und
   gemessen: preis.js:1525 zaehlt Object.keys(Z.festGenommen), also nur die
   Festlegungen von DER PREIS, waehrend in welt.chronik sehr wohl Eintraege mit
   art='festlegung' von anderen Stuecken stehen. Die Zahl ist da, der Zaehler
   liest sie nicht. chronik.filter(c => c.art === 'festlegung').length fasst alle
   vier Stuecke auf einmal.

2. Der Rest des Bodens: in 1350 beruehrt die Kasse im sparsamen Lauf fuer EINE
   Woche -1 Pf. Vorher waren es 44 Wochen bei -14, das ist der Fortschritt; aber
   null ist null.

Miss beides vorher und nachher, in allen vier Epochen.`,
  },
  {
    k: 'der-klang',
    name: 'DER KLANG',
    auftrag: `DER KLANG — die dritte Latte, die in drei Wellen nie gemessen wurde.
Dateien: stuecke/klang*.js · ton/** · kern/ton.js gehoert diesem Stueck
(ZUSTAENDIGKEIT 11 — das ist die eine Kerndatei, die du anfassen darfst).

gauntlet/MESSLATTE.md nennt DREI Latten. Bild und Spiel werden seit Welle 1
gemessen. Die dritte ist in drei Wellen kein einziges Mal geprueft worden. Eine
Latte ohne Stueck ist der zuverlaessigste Weg, sie am Ende stillschweigend fallen
zu lassen — das steht schon in gauntlet/WELLE-2.md und ist seitdem wahr geblieben.

Die Latte im Wortlaut: DREISSIG SEKUNDEN OHNE BILD, EIN FREMDES OHR NENNT EPOCHE
UND VORGANG.

- Es muss in jeder der vier Epochen etwas zu hoeren geben, und es muss sich
  zwischen ihnen hoerbar unterscheiden.
- Was klingt, soll das Spiel sein, nicht Kulisse: die Fuhre, der Sud, der
  Michaelitag, der Gegenzug.
- Pruefe selbst, dass es im Browser wirklich klingt, und leg vier Aufnahmen zu je
  dreissig Sekunden unter werkbank/schuss/klang/ ab, damit der Kritiker sie blind
  zuordnen kann.`,
  },
  {
    k: 'der-sud',
    name: 'DER SUD',
    auftrag: `DER SUD — wird gebraut, und entscheidet man dabei etwas?
Dateien: stuecke/sud*.js · stil/sud*.css

In Welle 2b lautete der Auftrag "Gebraut wird bisher nicht — eine echte
Entscheidung ueber das Bier", und es wurde gebaut. SEITDEM HAT NIEMAND
NACHGEMESSEN, ob eine sorgfaeltig gespielte Partie beim Bier je eine Wahl trifft,
die etwas kostet und etwas aendert.

- Miss es ZUERST am Bildschirm, ueber vierzehn Jahre und alle vier Epochen: wie
  oft steht eine Entscheidung ueber das Bier an, die mehr als einen Knopf hat,
  und was aendert sich danach messbar?
- Wo die Antwort "nie" oder "nichts" lautet, ist das dein Auftrag.
- Ein Vorbild steht in werkbank/schuss/eichung/preis-linie.mjs: ein Automat, der
  eine Epoche sorgfaeltig durchspielt.`,
  },
]

const BAU_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['stueck', 'was', 'gemessen', 'offen', 'kern', 'geaendert'],
  properties: {
    stueck: { type: 'string' },
    was: { type: 'string' },
    gemessen: { type: 'string', description: 'Zahlen vom Bildschirm, vorher/nachher' },
    offen: { type: 'string' },
    kern: { type: 'string' },
    geaendert: { type: 'array', items: { type: 'string' } },
  },
}

const URTEIL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['stueck', 'urteil', 'zahlen', 'auflagen', 'sperrliste', 'urteilsdatei'],
  properties: {
    stueck: { type: 'string' },
    urteil: { type: 'string', enum: ['besteht', 'besteht mit Auflage', 'faellt durch'] },
    zahlen: { type: 'string' },
    auflagen: { type: 'array', items: { type: 'string' } },
    sperrliste: { type: 'string' },
    urteilsdatei: { type: 'string', description: 'Pfad der geschriebenen Urteilsdatei' },
  },
}

phase('Bauen')

const ergebnisse = await pipeline(
  STUECKE,

  (s) => agent(
    `Du bist der Builder fuer ${s.name}.\n${REGELN}\n${LATTE}\n\nDEIN AUFTRAG:\n${s.auftrag}\n\n` +
    `Lies zuerst spiel/LIESMICH.md, spiel/ZUSTAENDIGKEIT.md, spiel/STAND.md, ` +
    `gauntlet/WELLE-4.md und werkbank/LAUFENDER-AUFTRAG.md. Bau, miss, berichte. ` +
    `Der Bericht ist deine Rueckgabe, keine Nachricht an einen Menschen.`,
    { label: `bau:${s.k}`, phase: 'Bauen', schema: BAU_SCHEMA }
  ),

  (bau, s) => agent(
    `Du bist ein frischer, BLINDER Kritiker fuer das Stueck ${s.name}.\n\n` +
    `Du hast den Builder NICHT gelesen und darfst seine Begruendung nicht suchen — ` +
    `weder in Berichten noch in Kommentaren, die erklaeren was jemand vorhatte. ` +
    `Du siehst NUR das laufende Spiel. Quelltext nur, um Zugschluessel und ` +
    `Klassennamen zu finden, nicht um Absichten zu lesen.\n\n` +
    `Arbeitsverzeichnis /home/user/brewhousesim, Spiel unter ` +
    `http://127.0.0.1:8899/spiel/?epoche=1..4&saat=1350 (Server laeuft).\n` +
    `Playwright: import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'\n` +
    `Belege unter werkbank/schuss/ ablegen. NIEMALS git.\n\n${LATTE}\n\n` +
    `WORUM ES BEI DIESEM STUECK GEHT (das steht im Auftrag des Laufs, nicht in der ` +
    `Begruendung des Builders):\n${s.auftrag.split('\n').slice(0, 4).join('\n')}\n\n` +
    `SPIEL ES. Jede der vier Epochen, mit der Maus, lange genug dass etwas passiert. ` +
    `Nenn Zahlen, keine Eindruecke. Wo du etwas behauptest, nenn den Zugschluessel ` +
    `oder die Klasse, an der man es nachsehen kann.\n` +
    URTEIL_SCHREIBEN(s.k) +
    `\nFallstricke: BRAUHAUS.uhr.jahr gibt es nicht (welt.zeit); vorrat.faesser ist ` +
    `eine Liste einzelner Faesser; data-deckung gibt es zweimal mit verschiedener ` +
    `Bedeutung (nur die Kopfzeile traegt .deckung); wer alle Bretter aufschlaegt und ` +
    `danach die Kopfzeile liest, misst seinen eigenen Rundgang.`,
    { label: `kritik:${s.k}`, phase: 'Pruefen', schema: URTEIL_SCHEMA }
  ).then(u => ({ bau, urteil: u, s })),

  async ({ bau, urteil, s }) => {
    if (!urteil) return { stueck: s.name, bau, urteil: null, nach: null }
    if (urteil.urteil === 'besteht' && !(urteil.auflagen || []).length) {
      log(`${s.name}: besteht ohne Auflage`)
      return { stueck: s.name, bau, urteil, nach: null }
    }
    const nach = await agent(
      `Du bist wieder der Builder fuer ${s.name}. Ein blinder Kritiker hat dein ` +
      `Stueck gespielt und so geurteilt:\n\nURTEIL: ${urteil.urteil}\n` +
      `ZAHLEN: ${urteil.zahlen}\nAUFLAGEN:\n` +
      `${(urteil.auflagen || []).map((a, i) => `${i + 1}. ${a}`).join('\n')}\n` +
      `SPERRLISTE: ${urteil.sperrliste || '—'}\n` +
      `Sein volles Urteil steht in ${urteil.urteilsdatei || 'werkbank/urteile/'}.\n\n` +
      `${REGELN}\n\nArbeite die Auflagen ab, soweit sie DEINE Dateien betreffen. ` +
      `Wo eine Auflage einem anderen Stueck gehoert, fass sie nicht an — MISS sie ` +
      `und schreib die Zahl in deinen Bericht. Wo der Kritiker sich IRRT, sag es ` +
      `und leg die Zahl daneben, die es zeigt. Ein Kritiker ist nicht im Recht, ` +
      `weil er Kritiker ist.`,
      { label: `nach:${s.k}`, phase: 'Nacharbeit', schema: BAU_SCHEMA }
    )
    return { stueck: s.name, bau, urteil, nach }
  }
)

const fertig = ergebnisse.filter(Boolean)
log(`Welle 4 durch: ${fertig.length} von ${STUECKE.length} Stuecken`)
return {
  stuecke: fertig.map(r => ({
    stueck: r.stueck,
    urteil: r.urteil ? r.urteil.urteil : 'kein Urteil',
    urteilsdatei: r.urteil ? r.urteil.urteilsdatei : null,
    auflagen: r.urteil ? r.urteil.auflagen : [],
    sperrliste: r.urteil ? r.urteil.sperrliste : '',
    gebaut: r.bau ? r.bau.was : null,
    gemessen: r.bau ? r.bau.gemessen : null,
    nachgearbeitet: r.nach ? r.nach.was : null,
    nachGemessen: r.nach ? r.nach.gemessen : null,
    kern: [r.bau && r.bau.kern, r.nach && r.nach.kern].filter(Boolean).join('\n'),
  })),
}
