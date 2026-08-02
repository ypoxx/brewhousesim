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
      /* Runde 6: das Schild ruecken. Es hing mitten ueber dem Tor und deckte
         genau die Stelle, an der jetzt drei Maenner an der Laderampe
         arbeiten — derselbe Fehler wie der Betonfuss von 1970, nur ohne
         Fuss. Jetzt sitzt es rechts neben der Einfahrt auf der Mauer, wo an
         einer Brauerei von 1884 auch eines haengt. */
      schild: { dx: 5, dy: 1.5, breite: 8.0, dreh: -5 }
    },
    4: {
      jahr: 1970, name: 'Die Marke',
      platte: 'bild/platte-1970.jpg',
      sagt: 'Abfüllhalle, Stahltanks, Lastwagen. Von der Mauer steht ein Turm in einer '
          + 'Grünanlage. Der Schornstein von 1884 steht noch und raucht nicht mehr.',
      /* Runde 5: der Eiskeller ist raus. Ein Eisschlitten mit gesaegten
         Natureisbloecken neben einer Brauerei von 1970 ist derselbe Fehler
         wie ein Emailschild in 1350, nur andersherum — Linde hat das 1876
         erledigt. An seiner Stelle steht das Kesselhaus mit Oelfeuerung,
         das den kalten Schornstein von 1884 erklaert. */
      stand: ['schornstein', 'abfuellhalle', 'stahltanks', 'kastenlager',
              'kesselhaus', 'verladedock'],
      /* Und das Schild steht auf zwei Stahlrohren, weil in diesem Hof kein
         Torbogen mehr ist, an dem es haengen koennte: 'gestell' ist die
         Hoehe der Rohre in Prozent der Buehnenhoehe, der FUSS sitzt dann auf
         dem Ort. Siehe zeichneHausschild() in stadt.js.

         RUNDE 6, der dritte Befund des Kritikers: "DER BETONFUSS VON 1970 IST
         EINE GRAUE KAPSEL UEBER DEM TOR ... die zwei Rohre enden auf einem
         148x10 px grossen grauen Balken quer ueber dem Torbogen, ohne
         Schatten, ohne Bodenkontakt. Dasselbe Schild deckt den einzigen
         arbeitenden Menschen im Hof 1970 zu 95 Prozent zu."
         Beides stimmte. Der Fuss sass auf (45|65,5) = (1238|1006), die
         Mauerkrone dort auf 1018 — zwoelf Pixel. Ein Schild, das auf dem
         Torbogen steht, steht auf nichts.
         Jetzt steht es zwoelf Prozent weiter links und acht tiefer, auf dem
         Hofbeton vor der Waage: Fusspunkt (33|72), die Mauerlinie dort 1167,
         also 61 px INNERHALB des Hofes. Der Mann mit der Sackkarre am
         Verladedock steht damit frei. Und der Fuss wirft einen Schatten —
         'ohne Schatten, ohne Perspektive' war der halbe Befund. */
      schild: { ort: 'tor', dx: -12, dy: 8, breite: 7.4, dreh: -2,
                hell: true, gestell: 3.4 }
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

     DER BODEN.  (Runde 4)

     Runde 3 ging zurueck, weil drei Aufbauten nicht auf dem Boden standen,
     zwei davon auf der Hofmauer. Die Ursache war nicht ein Tippfehler,
     sondern diese Raute: sie ist zu gross. Die Hofmauer der vier Platten ist
     nachgemessen, an allen vier leeren Hoefen (?bau=keine), und sie ist ueberall
     dieselbe Linie — ein Dach mit dem Scheitel in der Sued-Ecke:

         Scheitel S (823|1205) px = (29,9 | 78,5) Prozent
         links davon   y = 1205 - 0,49 * (823 - x)
         rechts davon  y = 1205 - 0,45 * (x - 823)

     Gegenprobe mit den Zahlen des Kritikers: bei x=860 gibt die Formel 1188,
     er hat 1188 gemessen; bei x=900 gibt sie 1172, er hat 1170 gemessen.

     WER UNTER DIESER LINIE ZEICHNET, STEHT AUF DER MAUER. Und zwar nicht der
     Fusspunkt allein, sondern JEDE undurchsichtige Spalte des Bildes: die
     Kistenstapel der Flaschenhalle hingen 58 px unter die Kante, waehrend ihr
     Fusspunkt noch harmlos aussah. Geprueft wird deshalb das Bild, nicht der
     Punkt — je Spalte die unterste undurchsichtige Zeile gegen die Formel.

     Damit fallen drei Plaetze der Raute weg, sie lagen jenseits der Mauer:
         C2 (33|78) und D (30|80) ganz,  C1 (23|76) mit dem Eisschlitten.
     Der Hof ist vorn also deutlich flacher als die Raute glauben macht. Er
     hat genau EINE tiefe Tasche, und die liegt am Scheitel:

        A0 (20|60) Schornstein        A1 (22|63) Wasser
        A2 (31|63) Darre / Sudhaus    A3 (41|63) Malzboden / Maelzerei
        B1 (28|68) Muehle / Maschine  B2 (36|69) Halle / Waage-Vorplatz
        B3 (46|66) Bottiche / Tanks   B4 (41|68) Laderampe
        C1 (26|70) Keller             C2 (30|73,5) Fasslager  — die Tasche
        C3 (45|74) Stall / Dock (auf der Torgasse, dort geht der Boden vor)
        D  (27|76) Waage / Waschhaus  (nur was flach ist, nichts Hohes)
        R  (50|62) Kontor (vor dem Tor, ausserhalb der Mauer)
        L  (17|68) Hopfenlager (ausserhalb der Mauer, in der Haeuserzeile)

     Zwei Plaetze liegen mit Absicht AUSSERHALB der Mauer und muessen es:
     R steht vor dem Tor, L in der Zeile der Stadthaeuser links. Beide stehen
     auf der Gasse, die naeher an der Kamera liegt als die Mauer — sie
     unterschreiten die Formel und stehen trotzdem auf dem Boden. C3 liegt in
     der Tordurchfahrt, wo der Boden durch die Mauer nach vorn tritt.

     Die Tasche traegt genau EINEN Aufbau von voller Breite. Wer als zweiter
     dort hin will, deckt den ersten zu — deshalb steht in jeder Epoche nur
     ein Bau in C2, und was sonst nach vorn moechte, wird flach (die
     Fahrzeugwaage) oder geht in das mittlere Band.

     DIE FUGENNAHT.  (Runde 5)

     Runde 4 hat EINE Datei neu erzeugt (keller_gewoelbe) und die Klasse fuer
     geschlossen erklaert. Der Kritiker hat drei weitere gefunden und mit der
     Messung des Builders selbst nachgerechnet: hopfenlager Oberkante
     91 Spalten / Farbsprung 190, fasslager_stein linke Kante 102 bzw. 138
     Zeilen / 158, abfuellhalle rechte Kante 84 Zeilen / 97, keller_gewoelbe
     rechts noch 14 Zeilen / 197 — gegen einen sauberen Vergleichswert von 36.
     Er hat auch gesagt, woran man es VORHER sieht: am Alphakanal der Datei.

     Diese Runde behandelt deshalb nicht Faelle, sondern den Ordner:

     · NEU GEZEICHNET wurden alle Bilder, in denen etwas Gebautes an einer
       Kante endete: hopfenlager, fasslager_stein, abfuellhalle, verladedock,
       brunnen, flaschenhalle, sudhaus_neu, fasslager_holz, kueferei. Jedes
       ist so erzeugt, dass rundum leerer Grund bleibt, und jedes wird nach
       dem Freistellen geprueft: kein Pixel mit Alpha > 0 auf einer Bildkante.
     · DIE UEBRIGEN 23 Dateien haben denselben Riegel bekommen: die aeussersten
       zwei Pixelreihen sind durchsichtig, die naechsten acht laufen weich an.
       Fuenf Bildschirmpixel Uebergang statt eines Schnitts.
     · GEPRUEFT wird seither mit dem Verfahren des Kritikers, in allen vier
       Epochen mit bau=alle: kein Aufbau hat noch Pixel seiner Differenzmaske
       auf seiner eigenen Rechteckkante. Was an Sprung uebrig ist, sitzt auf
       Unterkanten — dort steht das Haus auf dem Boden, das ist keine Naht —
       und an zwei Seitenkanten mit 17 und 19 Pixeln bei Sprung 97.
       Zum Vergleich: 91 Spalten bei 190.
     -------------------------------------------------------------------- */
  /* Die Preise sind so gestellt, dass die Barschaft am Anfang jeder Epoche
     etwa fuenf der offenen Bauten traegt und der sechste liegen bleibt. Wer
     alles baut, steht ohne Geld da — das ist die Absicht: die Barschaft darf
     dem Preis des naechsten Zuges nie davonlaufen. */
  teuerung: { 1: 0.63, 2: 3, 3: 37, 4: 174 },

  /* --------------------------------------------------------------------
     DER BODEN.  (Runde 6)

     Runde 5 ging mit diesem Satz zurueck: "DER BODEN IST NICHT ZU — Bauten
     sitzen auf Ortsmarken plus Versatz, ohne dass jemand prueft, ob der
     Fusspunkt im Hof liegt." Er hat recht gehabt, und der Beleg war die
     Kueferei auf dem Hoftor.

     Hier stehen die Zahlen, mit denen stuecke/stadt-zusatz.js das bei JEDEM
     Zeichnen nachrechnet. Alles in Prozent der Bezugsbuehne 2752x1536.

     · scheitel/links/rechts — DIE MAUERLINIE, an allen vier leeren Hoefen
       nachgemessen (Runde 4) und in allen vier dieselbe: ein Dach mit dem
       Scheitel in der Sued-Ecke, links 0,49 px je px, rechts 0,45.
     · von/bis — SOWEIT REICHT DER HOF. Das ist die Korrektur, die Runde 5
       gefehlt hat: die Formel ist die Vorderkante DES HOFES, von der West-
       bis zur Ost-Ecke der Raute. Rechnet man sie ueber die ganze Buehne
       weiter, verurteilt sie das Hopfenlager in der Haeuserzeile fuer eine
       Mauer, die dort gar nicht steht — und das ist keine Messung mehr,
       das ist eine Formel, die man zu weit gezogen hat.
     · spiel — wieviel Unschaerfe der weiche Bildrand wert ist: 12 px.
     · tor — DAS TORFELD, die Einfahrt. Wessen Fuss dort unter der
       Mauerlinie aufsetzt, verstellt sie. Das gilt auch fuer einen Bau,
       der sich als 'gasse' abgemeldet hat.

     Und die Regel dazu, die in den Aufbauten steht:

     > boden: 'hof' (Vorgabe) — kein Fusspunkt unter der Mauerlinie.
     > boden: 'gasse'         — steht ausserhalb. Dann MUSS 'warum' dabei
     >                          stehen. Eine Ausnahme ohne Grund ist keine
     >                          Ausnahme, sondern ein vergessener Versatz.
     -------------------------------------------------------------------- */
  boden: {
    scheitel: { x: 29.9, y: 78.5 },
    links: 0.49,
    rechts: 0.45,
    von: 16.0,
    bis: 48.3,
    spiel: 12,
    tor: { x0: 41.4, x1: 48.3, y1: 81.4 }
  },


  /* --------------------------------------------------------------------
     DIE FUSSPROFILE.  (Runde 6)

     Je Hofbild 24 Spalten, je Spalte die UNTERSTE undurchsichtige Zeile als
     Anteil der Bildhoehe. Gemessen am Alphakanal der 32 Dateien mit
     werkbank/schuss/stadt-r6/fuesse.py; -1 heisst: in dieser Spalte ist
     das Bild leer.

     Damit kann DAS LOT im Spiel sagen, wo ein Aufbau den Boden beruehrt,
     ohne ein einziges Pixel zu lesen — es rechnet mit denselben Zahlen, aus
     denen der Browser das Bild malt. Wer ein Bild austauscht, laesst
     fuesse.py neu laufen; sonst misst das Lot das alte.
     -------------------------------------------------------------------- */
  fuesse: {
    abfuellhalle: [0.7611, 0.7875, 0.7957, 0.8155, 0.8418, 0.8682, 0.9226, 0.9506, 0.9753, 0.9769, 0.9605, 0.9176, 0.888, 0.8583, 0.827, 0.7957, 0.7644, 0.7348, 0.7035, 0.6722, 0.6409, 0.6112, 0.5799, 0.5519],
    brunnen: [0.7923, 0.8413, 0.8648, 0.8956, 0.9123, 0.9226, 0.9412, 0.9554, 0.9642, 0.9682, 0.9682, 0.978, 0.978, 0.9731, 0.9657, 0.9525, 0.9343, 0.9103, 0.9931, 0.8658, 0.8241, 0.7648, 0.5723, 0.5683],
    darre: [0.7577, 0.8679, 0.8859, 0.9103, 0.9308, 0.9487, 0.9705, 0.991, 0.9923, 0.9859, 0.9641, 0.9513, 0.9205, 0.9038, 0.8974, 0.8769, 0.8603, 0.5333, -1, -1, -1, -1, -1, -1],
    eiskeller: [0.8967, 0.9144, 0.9307, 0.9457, 0.9633, 0.9783, 0.9918, 0.9918, 0.9891, 0.9389, 0.9293, 0.9144, 0.9253, 0.8845, 0.9008, 0.9158, 0.9266, 0.9198, 0.8804, 0.8247, 0.7894, 0.7459, 0.716, 0.6617],
    fasslager_holz: [0.7812, 0.7896, 0.8008, 0.798, 0.8555, 0.8626, 0.9046, 0.9158, 0.9719, 0.9804, 0.9621, 0.8303, 0.8065, 0.7826, 0.756, 0.7335, 0.7083, 0.6844, 0.8261, 0.8317, 0.8317, 0.8093, 0.7686, 0.756],
    fasslager_stein: [0.4689, 0.7735, 0.7974, 0.8214, 0.8628, 0.8931, 0.9234, 0.9569, 0.9601, 0.9394, 0.9777, 0.9761, 0.949, 0.9234, 0.8979, 0.8692, 0.8437, 0.8134, 0.8054, 0.7687, 0.7703, 0.7448, 0.7177, 0.689],
    flaschenhalle: [0.5402, 0.5731, 0.6043, 0.6355, 0.6667, 0.6962, 0.7291, 0.8473, 0.8686, 0.9146, 0.9491, 0.9557, 0.931, 0.9475, 0.977, 0.977, 0.9458, 0.913, 0.8686, 0.8374, 0.8046, 0.7849, 0.7521, 0.3941],
    gaerbottiche: [0.7765, 0.7947, 0.7905, 0.7542, 0.8031, 0.8156, 0.905, 0.926, 0.9204, 0.9832, 0.9916, 0.9888, 0.9148, 0.9064, 0.8855, 0.7947, 0.8031, 0.8031, 0.8101, 0.8659, 0.8059, 0.8282, 0.7668, 0.7542],
    gaertanks: [0.9064, 0.9308, 0.9538, 0.9769, 0.9923, 0.9923, 0.9923, 0.9923, 0.9808, 0.959, 0.9385, 0.9192, 0.9013, 0.8821, 0.8615, 0.8423, 0.8218, 0.8026, 0.7821, 0.7628, 0.7423, 0.7244, 0.7051, 0.6846],
    grutkammer: [0.2784, 0.7311, 0.7297, 0.7541, 0.7581, 0.7905, 0.8041, 0.8041, 0.7919, 0.7486, 0.8946, 0.9473, 0.9554, 0.9554, 0.9919, 0.9919, 0.9662, 0.9757, 0.9811, 0.9797, 0.9622, 0.9338, 0.9149, 0.8419],
    hopfenlager: [0.4278, 0.4772, 0.8013, 0.881, 0.8848, 0.8747, 0.862, 0.8595, 0.8722, 0.8937, 0.9747, 0.9823, 0.9797, 0.9684, 0.9671, 0.962, 0.9304, 0.9025, 0.8734, 0.8443, 0.8152, 0.7861, 0.5532, 0.381],
    kastenlager: [0.8129, 0.853, 0.8886, 0.8775, 0.8352, 0.7884, 0.7372, 0.6904, 0.8552, 0.8976, 0.9198, 0.9822, 0.9889, 0.9555, 0.9109, 0.8664, 0.8241, 0.7773, 0.7327, 0.6882, 0.6437, 0.5991, 0.6615, 0.6927],
    keller_gewoelbe: [0.5823, 0.6667, 0.7338, 0.7619, 0.7835, 0.8009, 0.7857, 0.7771, 0.7446, 0.7706, 0.8701, 0.9372, 0.9632, 0.9762, 0.987, 0.987, 0.987, 0.9784, 0.9416, 0.9502, 0.9524, 0.8506, 0.7294, 0.5996],
    kesselhaus: [0.7432, 0.7659, 0.787, 0.8097, 0.8308, 0.8535, 0.8761, 0.8988, 0.9199, 0.9426, 0.9637, 0.9864, 0.9789, 0.9441, 0.9139, 0.9275, 0.9502, 0.9713, 0.9909, 0.9909, 0.9758, 0.8625, 0.8822, 0.8822],
    kontor: [0.5096, 0.8511, 0.8678, 0.8845, 0.9024, 0.9191, 0.9358, 0.9525, 0.9692, 0.9884, 0.9923, 0.9923, 0.9782, 0.9628, 0.9461, 0.932, 0.9461, 0.9512, 0.9422, 0.923, 0.9063, 0.8293, 0.8126, 0.4763],
    kueferei: [0.7976, 0.8065, 0.8274, 0.8408, 0.8408, 0.8304, 0.9747, 0.9792, 0.7738, 0.7307, 0.9062, 0.9077, 0.9167, 0.9196, 0.9167, 0.8705, 0.8185, 0.8051, 0.8214, 0.8199, 0.689, 0.689, 0.692, 0.2351],
    laderampe: [0.9181, 0.9933, 0.9933, 0.9933, 0.9933, 0.9933, 0.9812, 0.9595, 0.9379, 0.9162, 0.8945, 0.8733, 0.8516, 0.83, 0.8083, 0.7871, 0.7649, 0.7433, 0.7216, 0.7004, 0.6782, 0.6566, 0.6349, 0.6127],
    maelzerei: [0.8802, 0.8479, 0.9149, 0.9149, 0.8892, 0.9021, 0.9162, 0.942, 0.991, 0.9923, 0.9781, 0.9832, 0.9871, 0.9781, 0.9665, 0.942, 0.9369, 0.9291, 0.9175, 0.9046, 0.893, 0.8802, 0.8673, 0.8544],
    malzboden: [0.9486, 0.9473, 0.9306, 0.9923, 0.9897, 0.9704, 0.9254, 0.9319, 0.9293, 0.9165, 0.982, 0.9923, 0.9923, 0.9846, 0.955, 0.9434, 0.9229, 0.901, 0.8959, 0.8535, 0.8368, 0.8226, 0.8162, 0.3586],
    maschinenhaus: [0.8788, 0.8896, 0.8788, 0.9724, 0.9908, 0.9908, 0.9724, 0.9494, 0.9264, 0.8405, 0.8696, 0.885, 0.8773, 0.8543, 0.9248, 0.9279, 0.7745, 0.7531, 0.7316, 0.7086, 0.7117, 0.7316, 0.7423, -1],
    ochsenstall: [0.7707, 0.7632, 0.7557, 0.7466, 0.7496, 0.7692, 0.8175, 0.8462, 0.8552, 0.8718, 0.8869, 0.8914, 0.8567, 0.8763, 0.8959, 0.9442, 0.991, 0.991, 0.9698, 0.9351, 0.9005, 0.9216, 0.9261, 0.914],
    pfanne: [0.9463, 0.9743, 0.9603, 0.986, 0.986, 0.8808, 0.8668, 0.8551, 0.8364, 0.9322, 0.9603, 0.9486, 0.9439, 0.9299, 0.9393, 0.9322, 0.8271, 0.771, 0.8271, 0.8294, 0.9696, 0.9813, 0.979, 0.8201],
    pferdestall: [0.8146, 0.8774, 0.9058, 0.9357, 0.9626, 0.9776, 0.9686, 0.9776, 0.9731, 0.9462, 0.9253, 0.8999, 0.8774, 0.8535, 0.8326, 0.8087, 0.7848, 0.7623, 0.7414, 0.716, 0.6906, 0.6682, 0.6457, 0.3498],
    rauch: [-1, -1, 0.247, 0.2796, 0.2811, 0.3047, 0.4172, 0.432, 0.4734, 0.4926, 0.4926, 0.4867, 0.4882, 0.4926, 0.5444, 0.6272, 0.6612, 0.676, 0.8269, 0.8343, 0.9024, 0.9911, 0.9911, 0.9911],
    rossmuehle: [-1, -1, -1, 0.8341, 0.8652, 0.8622, 0.8563, 0.6978, 0.9881, 0.9911, 0.877, 0.9615, 0.963, 0.9481, 0.8519, 0.957, 0.9422, 0.9911, 0.9911, 0.7763, 0.8904, 0.8963, 0.88, 0.8548],
    schornstein: [0.9884, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9923, 0.9897],
    stahltanks: [-1, 0.8057, 0.8341, 0.8594, 0.8863, 0.9131, 0.94, 0.9652, 0.9889, 0.9905, 0.9779, 0.9447, 0.9147, 0.8831, 0.8499, 0.8199, 0.7883, 0.7567, 0.7235, 0.6919, 0.6603, 0.6288, 0.5972, 0.5656],
    sudhaus_neu: [0.6884, 0.7253, 0.7605, 0.7973, 0.8342, 0.8693, 0.9062, 0.9414, 0.9765, 0.9765, 0.9514, 0.928, 0.9045, 0.8811, 0.8559, 0.8325, 0.809, 0.7856, 0.7605, 0.737, 0.7136, 0.6884, 0.665, 0.6415],
    verladedock: [0.63, 0.6745, 0.7049, 0.7307, 0.7494, 0.7541, 0.8267, 0.8712, 0.9133, 0.9415, 0.9602, 0.9836, 0.9836, 0.9438, 0.8478, 0.8103, 0.7541, 0.7166, 0.7354, 0.8735, 0.8946, 0.9087, 0.8571, 0.8478],
    verwaltung: [-1, -1, -1, 0.7388, 0.75, 0.8771, 0.8994, 0.9204, 0.9427, 0.9567, 0.9483, 0.9232, 0.905, 0.9232, 0.9427, 0.9623, 0.9902, 0.9916, 0.9707, 0.9637, 0.9916, 0.9763, 0.9693, 0.9176],
    waage: [0.4394, 0.4712, 0.503, 0.5348, 0.5666, 0.6004, 0.6322, 0.664, 0.6958, 0.7276, 0.7594, 0.7913, 0.8231, 0.8569, 0.8867, 0.9205, 0.9503, 0.9821, 0.9881, 0.9722, 0.9264, 0.8827, 0.837, 0.7932],
    waschhaus: [0.4126, 0.8968, 0.9269, 0.957, 0.9713, 0.9484, 0.9785, 0.9914, 0.9914, 0.9728, 0.9484, 0.9284, 0.9069, 0.8854, 0.8653, 0.8438, 0.8223, 0.8009, 0.851, 0.8653, 0.8668, 0.861, 0.8252, 0.8109]
  },

  bildmass: {
    abfuellhalle: [790, 607],
    brunnen: [1928, 2041],
    darre: [684, 780],
    eiskeller: [780, 736],
    fasslager_holz: [790, 713],
    fasslager_stein: [790, 627],
    flaschenhalle: [790, 609],
    gaerbottiche: [778, 716],
    gaertanks: [744, 780],
    grutkammer: [752, 740],
    hopfenlager: [642, 790],
    kastenlager: [790, 449],
    keller_gewoelbe: [780, 462],
    kesselhaus: [778, 662],
    kontor: [605, 779],
    kueferei: [790, 672],
    laderampe: [2076, 2076],
    maelzerei: [430, 776],
    malzboden: [762, 778],
    maschinenhaus: [779, 652],
    ochsenstall: [778, 663],
    pfanne: [900, 428],
    pferdestall: [790, 669],
    rauch: [779, 676],
    rossmuehle: [779, 675],
    schornstein: [218, 779],
    stahltanks: [779, 633],
    sudhaus_neu: [790, 597],
    verladedock: [700, 427],
    verwaltung: [778, 716],
    waage: [777, 503],
    waschhaus: [778, 698]
  },

  aufbauten: [

    /* --- Epoche I ---------------------------------------------------- */
    /* Die Braustelle im Hof: Maischbottich, offene Pfanne ueber offenem Feuer,
       Kuehlschiff, Holzstoss — und zwei Brauerinnen, die genau so gross sind
       wie die Leute auf der Platte. Bei breite 8.2 misst die Brauerin im Bild
       71 px, die Magd am Tor 72; die Pfanne ist 0,75 Koerperlaengen breit,
       also rund 1,3 m. In 1600 ist die Platte weitraeumiger gezeichnet,
       deshalb 6.9 statt 8.2 und ein Schritt nach vorn aus dem Steinhaus.
       Runde 4: in 1600 stand die Braustelle unter dem Dach der Rossmuehle
       und war zu 4.410 geaenderten Pixeln zusammengeschrumpft — jetzt einen
       Schritt weiter nach vorn auf den freien Hofboden (31|69,5). Weil sie
       damit 70 px naeher an der Kamera steht, waechst sie mit: 7.0 statt
       6.6. Die Brauerin misst damit rund 62 px neben den zwei Gehern der
       Platte 1600, die bei Fuss y=915 58 und 62 px hoch sind — sie steht
       naeher und ist gleich gross, also eher zu klein als zu gross. */
    /* Runde 5: der Kritiker hat in 1600 nachgemessen, und zwar am Bildschirm.
       Die zwei Geher auf der leeren Platte sind 53 und 54 px hoch bei Fuss
       y=910, der Reiter auf der Gasse 110 px bei Huf y=1082; daraus 31 px je
       Meter oben und 47 px je Meter unten, linear auf y=1044 interpoliert
       43,5 px je Meter, also 74 px fuer einen Menschen. Gemessen hat er an
       der Pfanne 57 px — 77 Prozent davon. Der Faktor ist 74/57 = 1,30, und
       weil eine Figur weiter hinten eher zu klein als zu gross sein soll,
       steht hier 8,9 statt 9,1: das sind 72 px erwartete 74. */
    { schluessel: 'pfanne', name: 'Braupfanne im Hof', bild: 'pfanne',
      ort: 'kesselstelle', dx: -9, dy: 5,
      breite: 8.9, breiten: { 1: 8.9, 2: 8.9 },
      versatz: { 2: { dx: 7, dy: 0.5 } },
      von: 1, bis: 2, grund: 26,
      sagt: 'Die offene Pfanne über offenem Feuer, daneben Maischbottich und '
          + 'Kühlschiff, zwei Brauerinnen mit Holzschaufeln. Kein Helm, kein '
          + 'Schwanenhals — das wäre eine Blase und kein Sudkessel.',
      nutzen: { sud: 1 } },

    { schluessel: 'malzboden', name: 'Malzboden auf Stelzen', bild: 'malzboden',
      ort: 'malzboden', dx: 0, dy: 19, breite: 14, von: 1, bis: 1, grund: 30,
      sagt: 'Der Speicher steht auf Steinstümpfen: Ratten können nicht hinauf.',
      nutzen: { platz: 4 } },

    /* Runde 6, der zweite Befund des Kritikers: "DER ZIEHBRUNNEN IST FUENF
       METER BREIT ... der Kranz misst 2,4 / 2,9 / 2,5 Koerperlaengen, also
       4,1 / 4,9 / 4,3 m Aussendurchmesser." Er hatte zweimal recht: der
       Brunnen war der einzige Aufbau ueber drei Epochen OHNE Staffelung, und
       das Bild selbst war schon falsch gezeichnet — im alten PNG war der
       Kranz doppelt so breit wie der Trog daneben.
       Beides ist behoben, und zwar in dieser Reihenfolge:
       · DAS BILD ist neu. Im neuen PNG stehen ZWEI Frauen am Brunnen, eine
         am Kranz, eine mit Schulterjoch und zwei Eimern. Sie sind der
         Massstab, den man nicht wegdiskutieren kann: wer nachmessen will,
         legt das Lineal an die Frau und nicht an meine Zusage. Gemessen im
         PNG: Kranz aussen 715 px, Frau 605 px — 1,18 Koerperlaengen.
       · DIE BREITE ist gestaffelt, und zwar an den Leuten, die der Kritiker
         auf der Bildtiefe des Brunnens gezaehlt hat: 1350 rund 61 px,
         1600 51 px, 1884 58 px. Bei breite 6,5 / 5,4 / 6,2 misst der Kranz
         66 / 55 / 63 px, also 1,08 Koerperlaengen — 1,8 m statt 4,1 m.
       Und weil der Brunnen in I, II UND III steht, stehen damit in jedem
       dieser drei Hoefe zwei arbeitende Menschen: der Hof 1884 war im
       Blindvergleich menschenleer, das war der dritte Satz des Kritikers. */
    { schluessel: 'brunnen', name: 'Ziehbrunnen', bild: 'brunnen',
      ort: 'brunnen', dx: 4, dy: 0,
      breite: 6.5, breiten: { 1: 6.5, 2: 5.4, 3: 6.2 },
      von: 1, bis: 3, grund: 18,
      sagt: 'Eigenes Wasser im Hof. Wer es aus dem Bach holt, braut, was der Bach mitbringt.',
      nutzen: { sud: 1 } },

    /* Stand bis Runde 3 auf C2 (35|78). Dort haengen die beiden losen Faesser
       112 px unter die Mauerkante — sie standen auf dem Mauerkopf. Jetzt
       rechts neben der Braustelle (36|68,5), wo der Hof noch Boden hat. */
    { schluessel: 'fasslager_holz', name: 'Fassschuppen', bild: 'fasslager_holz',
      ort: 'fasslager', dx: 12, dy: -7.5, breite: 13, von: 1, bis: 1, grund: 22,
      sagt: 'Ein Pultdach über den Fässern. Sonne ist der Feind des Bieres.',
      nutzen: { platz: 6 } },

    /* Runde 4, das Bild neu: keller_gewoelbe.png war die einzige der 32
       Hofdateien mit einer undurchsichtigen linken Randspalte (97 Prozent) —
       der Erdhuegel war am Bildrand glatt abgeschnitten und stand im Schuss
       1350 als schnurgerade senkrechte Naht neben der Braupfanne. Das neue
       Bild ist ein freistehender Huegel: die Grasflanke laeuft auf beiden
       Seiten INNERHALB des Rahmens zu Boden aus, alle vier Raender messen
       0,00 undurchsichtig. Weil der Huegel damit flacher und breiter ist als
       der angeschnittene, ist die Breite mitgewachsen (11 statt 9,5/8,6);
       das Tor misst in 1350 rund 75 px neben Leuten von 76-80 px. */
    { schluessel: 'keller_gewoelbe', name: 'Gewölbekeller', bild: 'keller_gewoelbe',
      ort: 'keller', dx: 1, dy: 6, breite: 12.5, breiten: { 1: 11, 2: 11 },
      /* Runde 6: der Huegel raeumt der Kueferei die Hoftasche und geht in
         1350 ein Band zurueck (32|72,5 -> 29|70). */
      versatz: { 1: { dx: 6, dy: -6 }, 2: { dx: 1, dy: -7 } },
      von: 1, bis: 2, grund: 34,
      sagt: 'Kühl und dunkel. Jede Woche, die ein Fass länger hält, ist ein Fass mehr.',
      nutzen: { platz: 8 } },

    { schluessel: 'grutkammer', name: 'Grutkammer', bild: 'grutkammer',
      ort: 'keller', dx: 5, dy: -2, breite: 12, von: 1, bis: 1, grund: 20,
      sagt: 'Porst, Gagel, Schafgarbe. Wer die Grut hat, hat das Bier — Hopfen kommt später.',
      nutzen: { rohstoff: 20 } },

    /* Runde 6: dy -4 -> -7. Das Lot fand ihn mit 76 von 393 Spalten bis zu
       37 px unter der Mauerlinie — die rechte Ecke des Stalls stand auf dem
       Mauerkopf neben dem Tor. Jetzt liegt sein tiefster Punkt 14 px darueber. */
    { schluessel: 'ochsenstall', name: 'Ochsenstall', bild: 'ochsenstall',
      ort: 'rampe', dx: 1, dy: -7, breite: 14, von: 1, bis: 1, grund: 28,
      sagt: 'Ein eigenes Zugtier. Danach fährt die Fuhre, wann das Haus es will.',
      nutzen: {}, wirkt: 'fährt, wann das Haus will' },

    /* Runde 6: dy 15 -> 13. Das Lot fand 38 Spalten bis zu 23 px unter der
       Mauerlinie; die vordere Bottichreihe stand auf der Mauer. */
    { schluessel: 'gaerbottiche', name: 'Gärbottiche', bild: 'gaerbottiche',
      ort: 'gaertanks', dx: 2, dy: 13, breite: 13.5, von: 1, bis: 2, grund: 24,
      sagt: 'Offene Holzbottiche unter einem Schutzdach. Was hier gärt, ist obergärig.',
      nutzen: { platz: 4 } },

    /* Der Kuefer im Bild ist ein Mensch, also gilt fuer ihn dieselbe Regel wie
       fuer die Brauerinnen: bei breite 14 war er 113 px hoch neben einer Magd
       von 72. Bei 9.9 misst er 80, bei 8.2 in der weitraeumigeren Platte 1600
       noch 66 — beides die Groesse der Leute, die dort stehen. */
    /* Runde 5, nachgemessen und NICHT angefasst. Erst gerechnet, dann am Bild
       nachgesehen: der Kuefer misst in 1600 bei breite 7,2 volle 71 px (Kopf
       1007, Fuss 1078), und an seiner Tiefe gehoeren nach der Formel des
       Kritikers 46,6 px je Meter, also 79 px hin — 90 Prozent, dieselbe
       Toleranz, die er in 1350 durchgehen liess. Der Kuefer war nie das
       Problem, die Pfanne war es.
       Ein Versuch, ihn trotzdem zu vergroessern, ist zurueckgenommen: der
       Hof 1600 hat vorne genau eine freie Tasche, und die gehoert der
       Braustelle. Jedes breitere Ding an dieser Stelle deckt entweder die
       drei arbeitenden Figuren am Kessel zu (die der Kritiker im Blindtest
       ausdruecklich fuer das Gebaute gezaehlt hat) oder haengt ueber der
       Mauer. Lieber zehn Prozent Massstab als beides. */
    /* RUNDE 6 — DAS STUECK, MIT DEM DIESE RUNDE ZURUECKKAM.
       "DIE KUEFEREI STEHT AUF DEM HOFTOR": ort 'tor' (45|64) plus dy 10 gab
       den Fusspunkt (45|74) = (1238|1136), waehrend die Mauerlinie dort
       y=1018 sagt. 250 von 252 Spalten lagen unter der Kante, die tiefste
       121 px. Im Bild hiess das: Tor weg, Magd weg, zwei Faesser ueber dem
       Mauerkopf auf der Gasse, Kuefer und Feuerkorb in der Luft ueber der
       Einfahrt.
       Der Fehler war nicht die Zahl 10, sondern dass ihn niemand gemerkt
       hat. Beides ist behoben: die Kueferei steht jetzt in der HOFTASCHE
       (30|74) — dem einen tiefen Platz am Scheitel der Mauer, wo der Boden
       wirklich bis nach vorn geht —, und stuecke/stadt-zusatz.js misst
       seither bei jedem Zeichnen nach, ob sie dort auch steht. Der
       Gewoelbekeller, der bis Runde 5 in der Tasche lag, geht ein Band
       zurueck; er ist ein Erdhuegel und vertraegt das, ein Arbeitsschuppen
       mit einem Mann davor nicht.
       Gemessen nach dem Umzug: tiefster Punkt 9 px UEBER der Mauerlinie,
       kein Fuss im Torfeld. */
    { schluessel: 'kueferei', name: 'Küferei', bild: 'kueferei',
      ort: 'fasslager', dx: 4, dy: -4, breite: 9.2, breiten: { 1: 9.2, 2: 7.3 },
      /* In 1600 einen halben Schritt nach links: dort steht die Braustelle
         weiter vorn als in 1350, und ein Schuppen, der die drei Figuren am
         Kessel zudeckt, kostet mehr, als er bringt — der Kritiker hat sie im
         Blindvergleich ausdruecklich fuer das Gebaute gezaehlt. */
      versatz: { 2: { dx: -3.5, dy: -1.5 } },
      von: 1, bis: 2, grund: 36,
      sagt: 'Ein eigener Küfer. Fassband und Daube kosten dann nur noch Holz.',
      nutzen: { platz: 4 } },

    /* --- Epoche II --------------------------------------------------- */
    { schluessel: 'darre', name: 'Darre', bild: 'darre',
      ort: 'malzboden', dx: 0, dy: 19, breite: 15, von: 2, bis: 2, grund: 42,
      sagt: 'Über dem Rauch wird das Malz trocken. Wie heiß man darrt, entscheidet die Farbe.',
      nutzen: { rohstoff: 40 } },

    /* Dieselbe Wanderung wie der Fassschuppen: von C2 (35|78) auf die
       Hoftasche (30|73,5). In 1600 sitzt es weiter rechts an der Mauer. */
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
      boden: 'gasse', warum: 'Das Kontor steht mit Absicht VOR dem Tor, am '
        + 'Platz, wo die Fuhrleute halten — ein Schreibstube gehoert dorthin, '
        + 'wo der Wagen ankommt, nicht hinter die Mauer.',
      sagt: 'Wer schreibt, weiß im Herbst, was der Frühling gekostet hat.',
      nutzen: {}, wirkt: 'Ordnung im Buch' },

    /* Runde 5, zweimal angefasst.
       ERSTENS DAS BILD: hopfenlager.png war der schlimmste der vier
       Guillotineschnitte — der Dachfirst lag glatt abgesaebelt auf der
       Oberkante (91 Spalten, Farbsprung 190 gegen einen sauberen Mittelwert
       von 36), in drei von vier Epochen sichtbar. Das Bild ist neu erzeugt,
       mit beiden Dachflaechen, beiden Ortgaengen und dem ganzen First
       innerhalb des Rahmens; alle vier Raender messen 0 undurchsichtig.
       ZWEITENS DIE ZEIT: bis 3 statt bis 4. Ein Fachwerkspeicher mit
       Leinensaecken in einer Brauerei von 1970 war der Grund, warum das
       Zielbild 04 den Blindvergleich gewonnen hat. 1970 kommt der Hopfen
       als Pellet in den Kuehlraum, nicht als Sack unter den Dachstuhl. */
    { schluessel: 'hopfenlager', name: 'Hopfenlager', bild: 'hopfenlager',
      ort: 'keller', dx: -6, dy: 0, breite: 9, von: 2, bis: 3, grund: 40,
      boden: 'gasse', warum: 'Der Speicher steht westlich der Hofmauer in der '
        + 'Haeuserzeile — dort ist der Hof zu Ende und die Gasse faengt an. '
        + 'Ein Haus, das dem Brauhaus gehoert, aber nicht im Hof steht.',
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

    /* Der Eisschlitten liegt im Bild vorn links unter dem Huegel. Auf dem
       alten Platz C1 (23|76) lag er 103 px unter der Mauerkante — zwei
       Eisbloecke auf dem Mauerkopf. Jetzt auf (26|70), hinter dem Fasslager. */
    /* Runde 5: bis 3 statt bis 4. Der Eisschlitten mit gesaegten
       Natureisbloecken stand im Schuss 1970 neben den Lastwagen — hundert
       Jahre nach Lindes Kaeltemaschine. Beim Wechsel nach 1970 verschwindet
       er jetzt mit einer Zeile in der Chronik, wie jeder Bau, der seine Zeit
       hinter sich hat. */
    { schluessel: 'eiskeller', name: 'Eiskeller', bild: 'eiskeller',
      ort: 'keller', dx: 4, dy: 0, breite: 13, von: 3, bis: 3, grund: 70,
      sagt: 'Natureis aus dem Weiher, in Stroh gepackt. Damit wird untergäriges Lagerbier möglich.',
      nutzen: { platz: 30 } },

    /* Runde 5, der Grenzfall aus dem Befund des Kritikers: "Ihre Treppe endet
       bei y~1110, der Gassenboden vor dem Tor beginnt auf der Platte erst bei
       y~1180 — die Stufen laufen auf dem geschlossenen Torfluegel aus, 70 px
       ueber ihrem Boden." Nachgesehen: das Tor 1884 ist zu, unter der Treppe
       ist Mauer. Die Rampe geht deshalb 70 px (4,6 Prozent der Buehnenhoehe)
       nach hinten in den Hof, wo ihre Stufen auf Hofboden aufsetzen; ihr
       tiefster undurchsichtiger Punkt liegt danach ueber der Mauerlinie. */
    /* RUNDE 6, das Bild neu — und aus demselben Grund wie der Brunnen.
       Der Kritiker hat 1884 blind gegen das Zielbild verloren, unter anderem
       hiermit: "der Hof 1884 ist menschenleer ... waehrend im Zielbild 03
       zwei Maenner Faesser rollen." Auf dieser Rampe stand ein Rollwagen mit
       zwei Faessern und sonst nichts.
       Jetzt rollen ZWEI MAENNER ein Fass auf der Kante ueber die Bohlen und
       ein dritter schiebt die Sackkarre die Treppe herauf. Und weil damit
       zum ersten Mal ein Massstab IM Bild steht, faellt auf, dass die Rampe
       fast doppelt zu gross war: bei breite 14 waere der Mann 87 px hoch
       geworden, neben Leuten der Platte 1884 von 58. Also 9,4 statt 14 —
       gemessen 58 px, und die Rampe ist damit rund 7 m lang, was fuer eine
       Bahnrampe mit einem Gleis stimmt. Der Fusspunkt wandert entsprechend
       nach hinten, sonst haengt die kleinere Rampe ueber der Mauer. */
    { schluessel: 'laderampe', name: 'Laderampe', bild: 'laderampe',
      ort: 'rampe', dx: 1, dy: -3.5, breite: 9.4, von: 3, bis: 3, grund: 60,
      sagt: 'Auf Wagenhöhe, mit Gleis und Vordach. Zwei Mann rollen ein Fass, '
          + 'einer schiebt die Sackkarre — erst mit der Bahn lohnt sich das.',
      nutzen: {}, wirkt: 'Verladen auf Wagenhöhe' },

    { schluessel: 'maschinenhaus', name: 'Maschinenhaus', bild: 'maschinenhaus',
      ort: 'keller', dx: 5, dy: -2, breite: 12.5, von: 3, bis: 3, grund: 90,
      sagt: 'Lindes Kältemaschine. Ab jetzt braucht der Sommer keine Erlaubnis mehr.',
      nutzen: { sud: 4 } },

    { schluessel: 'maelzerei', name: 'Mälzereiturm', bild: 'maelzerei',
      ort: 'malzboden', dx: 0, dy: 19, breite: 10.5, von: 3, bis: 4, grund: 85,
      sagt: 'Fünf Böden übereinander. Das Haus mälzt sein Malz wieder selbst.',
      nutzen: { rohstoff: 120 } },

    /* Stand bis Runde 3 auf (30|81), also zwei Einheiten SUEDLICH der
       Sued-Ecke der eigenen Raute: die Kistenstapel hingen 58 px unter die
       Mauerkante in die Strasse. Jetzt auf B2 (36|69), dem freien Platz
       zwischen Maschinenhaus und Pferdestall. Dieselbe falsche Koordinate
       trug bis Runde 3 auch die Fahrzeugwaage. */
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

    /* Runde 7. Das fremde Auge hat 1970 zum zweiten Mal gegen das Zielbild
       verloren und dafuer Gruende genannt, die man nachmessen kann:
       "schwebende LKW", "der LKW steckt in der Rampe", "in der Luft
       haengende Laderampe". Alle drei zeigen auf dasselbe: das Bild trug
       SEINEN EIGENEN BODEN mit — eine Betonplatte mit sichtbarer Kante,
       auf der die Wagen standen. Zwei Bodenflaechen uebereinander, die
       eigene und die des Hofes, ergeben genau den Eindruck einer Platte,
       die in der Luft haengt; und der vordere Wagen ragte ueber ihre Kante
       hinaus, also stak er darin.
       Das neue Bild hat keinen Boden: zwei Lastwagen, alle Raeder auf
       EINER Bodenlinie, zwei Arbeiter, einer mit der Sackkarre. Der Boden
       darunter ist der Hof.
       Und es ist auf den Menschen geeicht statt geschaetzt — 15,5 waren
       13 Meter Bildbreite fuer zwei Sechsmeterwagen; bei 8,8 misst der
       Mann mit der Sackkarre 55 px wie die Leute der Platte 1970. */
    { schluessel: 'verladedock', name: 'Verladedock', bild: 'verladedock',
      ort: 'rampe', dx: -3.5, dy: -0.5, breite: 8.8, von: 4, bis: 4, grund: 95,
      sagt: 'Zwei Lastzüge geladen, zwei Mann dabei, einer mit der Sackkarre. '
          + 'Was hier abfährt, ist am Abend zweihundert Kilometer weit.',
      nutzen: {}, wirkt: 'zwei Lastzüge gleichzeitig' },

    /* "Absurde Riesen-Kistenwand" — der Satz, mit dem das fremde Auge 1970
       dem Zielbild den Vorzug gab, und der Kritiker hat ihn nachgerechnet:
       neben dem Arbeiter (55 px = 1,70 m) mass EIN Bierkasten 0,78 x 2,08 m,
       der Fuenferstapel las sich als 3,90 m hohe Wand, so hoch wie die
       Abfuellhalle daneben. Ein Bierkasten ist 0,40 x 0,30 x 0,30 m.
       Das alte Bild hatte keinen Menschen darin, also auch kein Mass. Im
       neuen stehen zwei: einer traegt einen Kasten, einer setzt einen ab.
       Jeder Stapel ist fuenf Kaesten auf einer Palette und reicht dem Mann
       an die Schulter — das ist die Probe, die man mit blossem Auge machen
       kann. Neun Stapel statt vier, damit aus dem richtigen Mass kein
       Spielzeug wird: bei breite 8,3 misst der Mann 55 px. */
    { schluessel: 'kastenlager', name: 'Kastenlager', bild: 'kastenlager',
      ort: 'fasslager', dx: -6, dy: -8, breite: 8.3, von: 4, bis: 4, grund: 70,
      sagt: 'Der Kasten ist die neue Verpackung — und das Pfand darauf ist ein Versprechen.',
      nutzen: { platz: 90 } },

    { schluessel: 'kesselhaus', name: 'Kesselhaus', bild: 'kesselhaus',
      ort: 'brunnen', dx: 4, dy: 1, breite: 12.5, von: 4, bis: 4, grund: 85,
      sagt: 'Ölfeuerung. Der alte Schornstein bleibt stehen und bleibt kalt.',
      nutzen: { sud: 8 } },

    /* Die zweite Bewohnerin von (30|81): die Auffahrrampe endete unter dem
       Mauerfuss, auf dem Gehweg. Die Waage ist flach, sie darf deshalb als
       einzige ganz nach vorn auf D (27|76) — vor die Kaesten, wo der Lastzug
       auffaehrt. Alles Hohe wuerde dort den halben Hof zudecken. */
    { schluessel: 'waage', name: 'Fahrzeugwaage', bild: 'waage',
      ort: 'hof', dx: -5, dy: 14, breite: 12, von: 4, bis: 4, grund: 55,
      sagt: 'Voll rein, leer raus, alles gewogen. Wer nicht wiegt, verliert im Kleinen.',
      nutzen: {}, wirkt: 'kein Schwund beim Wiegen' },

    { schluessel: 'sudhaus_neu', name: 'Neues Sudhaus', bild: 'sudhaus_neu',
      ort: 'sudhaus', dx: 2, dy: 16, breite: 13, von: 4, bis: 4, grund: 140,
      sagt: 'Vier kupferne Pfannen hinter Glas, damit man sie von der Strasse sieht. '
          + 'Das ist nicht Technik, das ist Werbung.',
      nutzen: { sud: 16 } },

    { schluessel: 'verwaltung', name: 'Verwaltungsbau', bild: 'verwaltung',
      ort: 'tor', dx: 8, dy: -3, breite: 11, von: 4, bis: 4, grund: 90,
      boden: 'gasse', warum: 'Derselbe Platz wie das Kontor von 1600, drei '
        + 'Geschosse hoeher: an der Strasse, wo man ihn sieht.',
      sagt: 'Drei Geschosse Schreibtisch. Ein Haus, das eine Marke ist, wird verwaltet.',
      nutzen: {}, wirkt: 'Ordnung im Buch' }
  ]
};
