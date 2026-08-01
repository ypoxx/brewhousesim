/* ===========================================================================
   stuecke/stadt-daten.js — DIE STADT: Tabellen.

   Hier steht, WAS an welchem Ort steht und was es kostet. Die Koordinaten
   stehen NICHT hier, sondern in kern/orte.js; jedes Ding haengt an einem Ort
   und weicht davon nur um dx/dy ab. Das ist der Grund, warum alle vier
   Epochen denselben Ort zeigen: die Platte wechselt, der Ort nicht.

   Vier Platten, ein Ort, ein wachsender Hof.
   =========================================================================== */

var STADT_DATEN = {

  /* --------------------------------------------------------------------
     DIE VIER PLATTEN.
     Jede ist mit design/tools/gen_image.py erzeugt, 16:9, 2K (2752x1536),
     im Stil der Zielbilder — aber OHNE eingebrannte Schrift und OHNE
     Kopfleiste: im Spiel ist Text echter Text.
     'stand' ist der Hof, wie ihn die Vorfahren hinterlassen haben, wenn
     man mit ?epoche=N in diese Zeit einsteigt. Alles andere wird gekauft.
     -------------------------------------------------------------------- */
  epochen: {
    1: {
      jahr: 1350, name: 'Das Recht',
      platte: 'bild/platte-1350.jpg',
      sagt: 'Ein Haus, eine offene Pfanne über offenem Feuer, ein Braurecht. '
          + 'Die Mauer ist neu und geschlossen, über den Fluss führt ein Holzsteg.',
      stand: ['pfanne', 'malzboden', 'brunnen', 'fasslager_holz'],
      schild: { dx: 6.6, dy: 1.2, breite: 6.2, dreh: -3, klein: true }
    },
    2: {
      jahr: 1600, name: 'Die Ordnung',
      platte: 'bild/platte-1600.jpg',
      sagt: 'Steinbrauhaus, Darre, Küferei. Die Stadt füllt ihre Mauer, die Kirche '
          + 'hat den Spitzhelm, über den Fluss geht ein Steinbogen. Keine Bahn.',
      stand: ['pfanne', 'brunnen', 'darre', 'fasslager_stein',
              'kueferei', 'keller_gewoelbe'],
      schild: { dx: 0.2, dy: -3.0, breite: 7.6, dreh: -5 }
    },
    3: {
      jahr: 1884, name: 'Die Maschine',
      platte: 'bild/platte-1884.jpg',
      sagt: 'Schornstein, Gärtanks, Eiskeller. Die Mauer ist Ruine, die Bahn ist da, '
          + 'die Konkurrenz sitzt jenseits des Flusses.',
      stand: ['schornstein', 'gaertanks', 'eiskeller', 'fasslager_stein',
              'brunnen', 'laderampe', 'maschinenhaus'],
      schild: { dx: 0.4, dy: -3.2, breite: 8.0, dreh: -5 }
    },
    4: {
      jahr: 1970, name: 'Die Marke',
      platte: 'bild/platte-1970.jpg',
      sagt: 'Abfüllhalle, Stahltanks, Lastwagen. Von der Mauer steht ein Turm in einer '
          + 'Grünanlage. Der Schornstein von 1884 steht noch und raucht nicht mehr.',
      stand: ['schornstein', 'abfuellhalle', 'stahltanks', 'kastenlager',
              'eiskeller', 'verladedock'],
      schild: { dx: 0.1, dy: -2.4, breite: 7.4, dreh: -4, hell: true }
    }
  },

  /* --------------------------------------------------------------------
     DIE BESCHRIFTUNG DER STADT.
     Im Zielbild ist sie ins Bild gemalt und zerfaellt zu Buchstabensuppe.
     Hier ist sie echter Text an einem Ort — scharf in jeder Aufloesung.
     -------------------------------------------------------------------- */
  namen: [
    { text: 'ST. MICHAEL',       ort: 'kirche',     dy: 9,   gross: 0.9 },
    { text: 'GASTHOF LINDENHOF', ort: 'lindenhof',  dy: 5,   gross: 1 },
    { text: 'BAHNHOF',           ort: 'bahnhof',    dy: 5.5, gross: 0.85, ab: 3 }
  ],

  /* --------------------------------------------------------------------
     DIE STANDPLAETZE IM HOF.  (Runde 2)

     Der Kritiker hat Runde 1 mit einem Satz zurueckgeschickt: bau=keine und
     bau=alle unterscheiden sich im Schuss "nur um Rauchfahne, einen
     Schornsteinschaft und die BAUHOF-Zeile". Zwei Ursachen — die Tafeln der
     anderen Stuecke (behoben durch DEN RAHMEN in stadt.js) und dieser hier:
     die Aufbauten standen zu klein und zu dicht uebereinander.

     Der Hof ist auf allen vier Platten dieselbe Raute:
         W (17|64)   N (33|56)   O (48|66)   S (32|79)
     In diese Raute sind ZWOELF STANDPLAETZE gelegt, in drei Baendern nach
     Tiefe gestaffelt und in x gegeneinander versetzt. Wer hinten steht, ist
     hoeher gebaut als der, der vor ihm steht — deshalb ragt jedes Dach ueber
     seinen Vordermann hinaus und behaelt seine eigene Silhouette:

        A0 (20|60) Schornstein        A1 (22|63) Wasser
        A2 (31|63) Darre / Sudhaus    A3 (41|63) Malzboden / Maelzerei
        B1 (28|68) Muehle / Maschine  B2 (36|69) Pfanne / Halle
        B3 (46|66) Bottiche / Tanks   B4 (41|68) Laderampe
        C1 (23|76) Keller             C2 (33|78) Fasslager
        C3 (45|74) Stall / Dock       D  (30|80) Kueferei / Waschhaus
        R  (50|62) Kontor (vor dem Tor, ausserhalb der Mauer)
        L  (17|68) Hopfenlager (an der Mauer links)

     Jeder Platz wird ueber die Jahrhunderte NEU BESETZT: wo 1350 der
     Malzboden auf Stelzen steht, steht 1884 der Maelzereiturm. Derselbe Ort,
     andere Zeit — deshalb bewegt sich beim Epochenwechsel nichts, es wird
     nur ersetzt. Und deshalb steht in jeder Epoche derselbe Hof.

     ort/dx/dy  = wo es steht (Fusspunkt), breite = Anteil der Buehnenbreite
     von/bis    = in welchen Epochen es ueberhaupt existiert
     grund      = Grundpreis; der Preis der Epoche ist grund * teuerung
     nutzen     = was der Kauf im Weltzustand bewegt

     DER MASSSTAB.  (Runde 3)

     Vier Platten sind vier Zeichnungen. Sie zeigen denselben Ort und
     dieselbe Kamera, aber sie sind nicht auf den Pixel gleich gross
     gezeichnet — auf der Platte 1600 misst ein Mensch im Hof rund 51 px,
     auf der Platte 1350 rund 72 px. Ein Aufbau mit fester Breite ist damit
     in der einen Epoche richtig und in der anderen falsch. Deshalb darf
     jeder Aufbau seine Breite und seinen Versatz JE EPOCHE staffeln:

       breiten: { 1: 8.2, 2: 6.9 }      statt/neben breite
       versatz: { 2: { dx: -1, dy: 1 } } wird auf dx/dy aufgeschlagen

     Was nicht gestaffelt ist, benutzt weiter breite/dx/dy — die dreissig
     uebrigen Aufbauten sitzen damit unveraendert im Raster.

     Und die Regel, an der Runde 2 gescheitert ist: WER FIGUREN ZEIGT, WIRD
     AN DEN FIGUREN DER PLATTE GEMESSEN. Eine Brauerin am Kessel ist so gross
     wie die Magd am Tor, die sechs Meter weiter vorn steht — eher kleiner,
     denn sie steht weiter hinten. Ein Sudkessel von 1350 fasst ein bis zwei
     Sud; er ist rund drei Viertel einer Koerperlaenge breit, nicht zweieinhalb.
     -------------------------------------------------------------------- */
  /* Die Preise sind so gestellt, dass die Barschaft am Anfang jeder Epoche
     etwa fuenf der offenen Bauten traegt und der sechste liegen bleibt. Wer
     alles baut, steht ohne Geld da — das ist die Absicht: die Barschaft darf
     dem Preis des naechsten Zuges nie davonlaufen. */
  teuerung: { 1: 0.63, 2: 3, 3: 37, 4: 174 },

  aufbauten: [

    /* --- Epoche I ---------------------------------------------------- */
    /* Die Braustelle im Hof: Maischbottich, offene Pfanne ueber offenem Feuer,
       Kuehlschiff, Holzstoss — und zwei Brauerinnen, die genau so gross sind
       wie die Leute auf der Platte. Bei breite 8.2 misst die Brauerin im Bild
       71 px, die Magd am Tor 72; die Pfanne ist 0,75 Koerperlaengen breit,
       also rund 1,3 m. In 1600 ist die Platte weitraeumiger gezeichnet,
       deshalb 6.9 statt 8.2 und ein Schritt nach vorn aus dem Steinhaus. */
    { schluessel: 'pfanne', name: 'Braupfanne im Hof', bild: 'pfanne',
      ort: 'kesselstelle', dx: -9, dy: 5,
      breite: 8.9, breiten: { 1: 8.9, 2: 6.6 },
      versatz: { 2: { dx: 8, dy: -4 } },
      von: 1, bis: 2, grund: 26,
      sagt: 'Die offene Pfanne über offenem Feuer, daneben Maischbottich und '
          + 'Kühlschiff, zwei Brauerinnen mit Holzschaufeln. Kein Helm, kein '
          + 'Schwanenhals — das wäre eine Blase und kein Sudkessel.',
      nutzen: { sud: 1 } },

    { schluessel: 'malzboden', name: 'Malzboden auf Stelzen', bild: 'malzboden',
      ort: 'malzboden', dx: 0, dy: 19, breite: 14, von: 1, bis: 1, grund: 30,
      sagt: 'Der Speicher steht auf Steinstümpfen: Ratten können nicht hinauf.',
      nutzen: { platz: 4 } },

    { schluessel: 'brunnen', name: 'Ziehbrunnen', bild: 'brunnen',
      ort: 'brunnen', dx: 4, dy: 0, breite: 13.5, von: 1, bis: 3, grund: 18,
      sagt: 'Eigenes Wasser im Hof. Wer es aus dem Bach holt, braut, was der Bach mitbringt.',
      nutzen: { sud: 1 } },

    { schluessel: 'fasslager_holz', name: 'Fassschuppen', bild: 'fasslager_holz',
      ort: 'fasslager', dx: 3, dy: -2.5, breite: 14, von: 1, bis: 1, grund: 22,
      sagt: 'Ein Pultdach über den Fässern. Sonne ist der Feind des Bieres.',
      nutzen: { platz: 6 } },

    { schluessel: 'keller_gewoelbe', name: 'Gewölbekeller', bild: 'keller_gewoelbe',
      ort: 'keller', dx: 1, dy: 6, breite: 12.5, breiten: { 1: 9.5, 2: 8.6 },
      versatz: { 1: { dx: 7 }, 2: { dx: 0.5, dy: -7 } },
      von: 1, bis: 2, grund: 34,
      sagt: 'Kühl und dunkel. Jede Woche, die ein Fass länger hält, ist ein Fass mehr.',
      nutzen: { platz: 8 } },

    { schluessel: 'grutkammer', name: 'Grutkammer', bild: 'grutkammer',
      ort: 'keller', dx: 5, dy: -2, breite: 12, von: 1, bis: 1, grund: 20,
      sagt: 'Porst, Gagel, Schafgarbe. Wer die Grut hat, hat das Bier — Hopfen kommt später.',
      nutzen: { rohstoff: 20 } },

    { schluessel: 'ochsenstall', name: 'Ochsenstall', bild: 'ochsenstall',
      ort: 'rampe', dx: 1, dy: -4, breite: 14, von: 1, bis: 1, grund: 28,
      sagt: 'Ein eigenes Zugtier. Danach fährt die Fuhre, wann das Haus es will.',
      nutzen: {}, wirkt: 'fährt, wann das Haus will' },

    { schluessel: 'gaerbottiche', name: 'Gärbottiche', bild: 'gaerbottiche',
      ort: 'gaertanks', dx: 2, dy: 15, breite: 13.5, von: 1, bis: 2, grund: 24,
      sagt: 'Offene Holzbottiche unter einem Schutzdach. Was hier gärt, ist obergärig.',
      nutzen: { platz: 4 } },

    /* Der Kuefer im Bild ist ein Mensch, also gilt fuer ihn dieselbe Regel wie
       fuer die Brauerinnen: bei breite 14 war er 113 px hoch neben einer Magd
       von 72. Bei 9.9 misst er 80, bei 8.2 in der weitraeumigeren Platte 1600
       noch 66 — beides die Groesse der Leute, die dort stehen. */
    { schluessel: 'kueferei', name: 'Küferei', bild: 'kueferei',
      ort: 'tor', dx: 0, dy: 10, breite: 9.9, breiten: { 1: 9.9, 2: 7.2 },
      versatz: { 2: { dy: -3 } },
      von: 1, bis: 2, grund: 36,
      sagt: 'Ein eigener Küfer. Fassband und Daube kosten dann nur noch Holz.',
      nutzen: { platz: 4 } },

    /* --- Epoche II --------------------------------------------------- */
    { schluessel: 'darre', name: 'Darre', bild: 'darre',
      ort: 'malzboden', dx: 0, dy: 19, breite: 15, von: 2, bis: 2, grund: 42,
      sagt: 'Über dem Rauch wird das Malz trocken. Wie heiß man darrt, entscheidet die Farbe.',
      nutzen: { rohstoff: 40 } },

    { schluessel: 'fasslager_stein', name: 'Fasslager aus Stein', bild: 'fasslager_stein',
      ort: 'fasslager', dx: 3, dy: -2.5, breite: 14, breiten: { 2: 10.1 },
      versatz: { 2: { dx: 9, dy: -3.5 } },
      von: 2, bis: 3, grund: 46,
      sagt: 'Steinwand statt Bretterwand. Der Vorrat wächst, der Schwund fällt.',
      nutzen: { platz: 10 } },

    { schluessel: 'rossmuehle', name: 'Rossmühle', bild: 'rossmuehle',
      ort: 'keller', dx: 5, dy: -2, breite: 12, von: 2, bis: 2, grund: 40,
      sagt: 'Schroten im eigenen Hof, statt in der Mühle am Fluss zu warten.',
      nutzen: { sud: 1 } },

    { schluessel: 'pferdestall', name: 'Pferdestall', bild: 'pferdestall',
      ort: 'rampe', dx: 1, dy: -4, breite: 13.5, von: 2, bis: 3, grund: 44,
      sagt: 'Zwei Kaltblüter. Der Ochse zieht mehr, das Pferd zieht schneller.',
      nutzen: {}, wirkt: 'die Fuhre fährt schneller' },

    { schluessel: 'kontor', name: 'Kontor', bild: 'kontor',
      ort: 'tor', dx: 8, dy: -3, breite: 10, von: 2, bis: 3, grund: 38,
      sagt: 'Wer schreibt, weiß im Herbst, was der Frühling gekostet hat.',
      nutzen: {}, wirkt: 'Ordnung im Buch' },

    { schluessel: 'hopfenlager', name: 'Hopfenlager', bild: 'hopfenlager',
      ort: 'keller', dx: -6, dy: 0, breite: 9, von: 2, bis: 4, grund: 40,
      sagt: 'Hopfen im Sack, trocken und dunkel. Erst mit dem Hopfen hält Bier eine Reise aus.',
      nutzen: { rohstoff: 60 } },

    /* Stand bis Runde 2 auf (30|81) — im Hof von 1600 ist das jenseits der
       Hofmauer auf der Gasse, und weil es dabei am naechsten an der Kamera
       lag, deckte es die halbe Hofraute. Jetzt im Hof, in der Groesse der
       Platte 1600. */
    { schluessel: 'waschhaus', name: 'Waschhaus', bild: 'waschhaus',
      ort: 'hof', dx: -9, dy: 6, breite: 9.4, von: 2, bis: 2, grund: 32,
      sagt: 'Heißes Wasser für Fass und Bottich. Sauberkeit ist die halbe Haltbarkeit.',
      nutzen: {}, wirkt: 'das Fass bleibt sauber' },

    /* --- Epoche III -------------------------------------------------- */
    { schluessel: 'schornstein', name: 'Schornstein und Dampfmaschine', bild: 'schornstein',
      ort: 'schornstein', dx: 3, dy: 32, breite: 7.5, von: 3, bis: 4, grund: 95,
      sagt: 'Dampf statt Arm. Der Schornstein ist das Zeichen, dass hier nicht mehr '
          + 'gebraut, sondern produziert wird.',
      nutzen: { sud: 6 } },

    { schluessel: 'gaertanks', name: 'Gärtanks', bild: 'gaertanks',
      ort: 'gaertanks', dx: 2, dy: 15, breite: 14, von: 3, bis: 3, grund: 80,
      sagt: 'Genietetes Eisen statt Holz. Was im Tank gärt, schmeckt jede Woche gleich.',
      nutzen: { platz: 40, sud: 2 } },

    { schluessel: 'eiskeller', name: 'Eiskeller', bild: 'eiskeller',
      ort: 'keller', dx: 4, dy: 0, breite: 13, von: 3, bis: 4, grund: 70,
      sagt: 'Natureis aus dem Weiher, in Stroh gepackt. Damit wird untergäriges Lagerbier möglich.',
      nutzen: { platz: 30 } },

    { schluessel: 'laderampe', name: 'Laderampe', bild: 'laderampe',
      ort: 'rampe', dx: 5, dy: 2, breite: 14, von: 3, bis: 3, grund: 60,
      sagt: 'Auf Wagenhöhe. Erst mit der Bahn lohnt sich, was hier verladen wird.',
      nutzen: {}, wirkt: 'Verladen auf Wagenhöhe' },

    { schluessel: 'maschinenhaus', name: 'Maschinenhaus', bild: 'maschinenhaus',
      ort: 'keller', dx: 5, dy: -2, breite: 12.5, von: 3, bis: 3, grund: 90,
      sagt: 'Lindes Kältemaschine. Ab jetzt braucht der Sommer keine Erlaubnis mehr.',
      nutzen: { sud: 4 } },

    { schluessel: 'maelzerei', name: 'Mälzereiturm', bild: 'maelzerei',
      ort: 'malzboden', dx: 0, dy: 19, breite: 10.5, von: 3, bis: 4, grund: 85,
      sagt: 'Fünf Böden übereinander. Das Haus mälzt sein Malz wieder selbst.',
      nutzen: { rohstoff: 120 } },

    { schluessel: 'flaschenhalle', name: 'Flaschenhalle', bild: 'flaschenhalle',
      ort: 'hof', dx: 3, dy: 7, breite: 13.5, von: 3, bis: 3, grund: 100,
      sagt: 'Bier in Flaschen geht dorthin, wo kein Fass mehr hinkommt: nach Hause.',
      nutzen: { platz: 20 } },

    /* --- Epoche IV --------------------------------------------------- */
    { schluessel: 'abfuellhalle', name: 'Abfüllhalle', bild: 'abfuellhalle',
      ort: 'rampe', dx: 1, dy: -4, breite: 15, von: 4, bis: 4, grund: 130,
      sagt: 'Vierzigtausend Flaschen in der Stunde. Der Takt der Halle ist der Takt des Hauses.',
      nutzen: { platz: 120, sud: 20 } },

    { schluessel: 'stahltanks', name: 'Stahltanks im Freien', bild: 'stahltanks',
      ort: 'gaertanks', dx: 2, dy: 15, breite: 15, von: 4, bis: 4, grund: 120,
      sagt: 'Zylindrokonisch, im Freien, aus Edelstahl. Gärkeller braucht das keinen mehr.',
      nutzen: { platz: 150, sud: 12 } },

    { schluessel: 'verladedock', name: 'Verladedock', bild: 'verladedock',
      ort: 'rampe', dx: 5, dy: 2, breite: 14, von: 4, bis: 4, grund: 95,
      sagt: 'Drei Lastzüge am Dock. Was hier abfährt, ist am Abend zweihundert Kilometer weit.',
      nutzen: {}, wirkt: 'drei Lastzüge gleichzeitig' },

    { schluessel: 'kastenlager', name: 'Kastenlager', bild: 'kastenlager',
      ort: 'fasslager', dx: 3, dy: -2.5, breite: 13.5, von: 4, bis: 4, grund: 70,
      sagt: 'Der Kasten ist die neue Verpackung — und das Pfand darauf ist ein Versprechen.',
      nutzen: { platz: 90 } },

    { schluessel: 'kesselhaus', name: 'Kesselhaus', bild: 'kesselhaus',
      ort: 'brunnen', dx: 4, dy: 1, breite: 12.5, von: 4, bis: 4, grund: 85,
      sagt: 'Ölfeuerung. Der alte Schornstein bleibt stehen und bleibt kalt.',
      nutzen: { sud: 8 } },

    { schluessel: 'waage', name: 'Fahrzeugwaage', bild: 'waage',
      ort: 'hof', dx: -6, dy: 14, breite: 12, von: 4, bis: 4, grund: 55,
      sagt: 'Voll rein, leer raus, alles gewogen. Wer nicht wiegt, verliert im Kleinen.',
      nutzen: {}, wirkt: 'kein Schwund beim Wiegen' },

    { schluessel: 'sudhaus_neu', name: 'Neues Sudhaus', bild: 'sudhaus_neu',
      ort: 'sudhaus', dx: 2, dy: 16, breite: 13, von: 4, bis: 4, grund: 140,
      sagt: 'Vier kupferne Pfannen hinter Glas, damit man sie von der Strasse sieht. '
          + 'Das ist nicht Technik, das ist Werbung.',
      nutzen: { sud: 16 } },

    { schluessel: 'verwaltung', name: 'Verwaltungsbau', bild: 'verwaltung',
      ort: 'tor', dx: 8, dy: -3, breite: 11, von: 4, bis: 4, grund: 90,
      sagt: 'Drei Geschosse Schreibtisch. Ein Haus, das eine Marke ist, wird verwaltet.',
      nutzen: {}, wirkt: 'Ordnung im Buch' }
  ]
};
