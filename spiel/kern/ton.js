/* ===========================================================================
   kern/ton.js — DER TONBUS.  Fuer Welle 2 uebergeben an DAS STUECK "DER KLANG"
   (ZUSTAENDIGKEIT.md §11). Alle anderen Kerndateien bleiben gesperrt.

   Im Skelett war das hier ein Nichtstuer, der nur mitschrieb. Jetzt klingt er.
   Die API bleibt Zeichen fuer Zeichen, wie sie war — vier Stuecke rufen sie:

       melde · spiele · schleife · halt · bett · setzeStumm · setzeLaut

   spiele() gibt weiterhin einen Wahrheitswert zurueck. Neu ist nur, dass er
   jetzt etwas bedeutet: true, wenn wirklich etwas erklungen ist.

   ---------------------------------------------------------------------------
   DIE LATTE, GEGEN DIE DIESE DATEI GEBAUT IST (MESSLATTE.md, Latte 3)

     Ein fremdes Ohr hoert dreissig Sekunden Spielton OHNE JEDES BILD und soll
     Epoche und Vorgang benennen. Raet es falsch, geht die Arbeit zurueck.

   Deshalb hat jeder Ton zwei Aufgaben zugleich:
     1. ER SAGT DIE ZEIT.   Derselbe Hof, vier Zeiten. Das Muenzenzaehlen von
        1350 ist 1970 eine Registrierkasse; der Ochse wird zum Lastzug; die
        Kreide auf dem Schiefer wird zur Schreibmaschine; das offene Holzfeuer
        unter der Pfanne wird zum Dampfventil und dann zur Kreiselpumpe.
     2. ER SAGT DEN VORGANG. Ein Ruf, der ins Leere geht, ist eine verschenkte
        Stelle — deshalb bedient KATALOG jeden Namen, den die vier Stuecke
        heute rufen, und faengt unbekannte Namen mit einem Ersatzklang ab.

   Drei Schichten liegen uebereinander, und erst zusammen ergeben sie 1350:
     BETT  — Musik der Epoche, leise      (ton/klang/bett1..4.mp3)
     HOF   — das Grundrauschen des Hofes  (ton/klang/hof1..4.mp3)
     WERK  — was gerade geschieht         (Proben + Ersatzklaenge)

   ---------------------------------------------------------------------------
   WIE MAN DREISSIG SEKUNDEN ALS DATEI HERAUSBEKOMMT (ohne ffmpeg!)

   Das Spiel rendert seinen EIGENEN Tongraph mit OfflineAudioContext und reicht
   fertige WAV-Bytes heraus. Kein Mikrofon, kein ffmpeg, keine Dateiablage:

       await BRAUHAUS.ton.wav(30)      -> Base64 eines WAV, 30 s Mitschnitt

   Der Mitschnitt laeuft immer mit — auch bei ?stumm=1 und auch dann, wenn der
   Browser die Wiedergabe noch nicht freigegeben hat. Wer also das Spiel
   bedient und danach wav(30) ruft, bekommt genau das, was in den letzten
   dreissig Sekunden im Hof geschehen ist.

       node werkbank/ohrprobe.mjs      -> vier WAV, eines je Epoche
   =========================================================================== */

(function (B) {
  'use strict';

  var LAUT = 0.8;
  var STUMM = false;

  var ORDNER = 'ton/klang/';

  /* Wo die Mischung sitzt. Die Latte verlangt ZWEI Auskuenfte aus derselben
     halben Minute: die Zeit und den Vorgang. Das Bett sagt die Zeit, der Hof
     sagt den Ort, das Werk sagt den Vorgang — und das Werk muss dabei oben
     liegen. Im ersten Durchgang stand das Bett zu laut, und das Ohr sagte
     ueber 1350 nur noch "jemand spielt Floete".

     WELLE 4, RUNDE 2 — DER BEFUND, DER DIESE ZAHLEN GEAENDERT HAT.
     Der Kritiker hat dreissig Sekunden aufgenommen, in denen NICHTS geklickt
     wurde, und sie gegen den gespielten Lauf gehalten: 94 / 97 / 59 / 75 %
     des Pegels. Nichtstun klang fast so laut wie Spielen, und drei von drei
     messbaren Betten haben die Epoche ohne einen einzigen Spielklang richtig
     genannt. Die Epoche kam also aus der Kulisse, nicht aus dem Vorgang.
     Das ist keine Geschmacksfrage und mit keinem einzelnen Klang zu heilen:
     das Bett war schlicht zu laut und das Werk zu leise. Bett und Hof gehen
     auf gut die Haelfte herunter, das Werk um das Zweieinhalbfache herauf. */
  var PEGEL = { bett: 1.0, hof: 1.0, werk: 0.80 };

  /* Die vier Hofbaender und die vier Betten sind NICHT gleich laut aus dem
     Erzeuger gekommen — hof1 hatte den dreifachen Effektivwert von hof3.
     Das ist keine Kleinigkeit: das Ohr hat in 1350 daraufhin einen Bauernhof
     gehoert ("Floete und Gaense") statt eines Brauhauses, weil die Gaense
     alles zugedeckt haben, was im Hof geschah. Deshalb wird jede Schleife
     beim Entschluesseln auf einen festen Effektivwert gezogen, statt sie
     je Epoche von Hand nachzustellen. */
  var ZIEL = { bett: 0.038, hof: 0.048 };

  /* DER ATEM DES HOFES — Auflage 2.
     Epoche 4 war ein Dauerteppich: in acht Sekunden Nichtstun schwankte ihr
     Bett um den Faktor 1,4, und sie hat ihren eigenen Michaelitag verschluckt
     (Hub 0,87). Ein Band, das ohne Unterlass gleich laut laeuft, ist keine
     Kulisse mehr, sondern eine Wand. Bett und Hof bekommen deshalb eine
     langsame Kontur: der Hof kommt und geht, mit einer Runde von sieben
     Sekunden — kurz genug, dass in JEDEM Achtsekundenfenster der hoechste
     und der tiefste Punkt vorkommen, lang genug, dass es atmet und nicht
     pumpt. Der Wert ist der TIEFSTE Punkt, 1 waere keine Bewegung.
     1884 und besonders 1970 stehen am tiefsten: deren Baender sind aus dem
     Erzeuger als gleichfoermiges Maschinenbrummen gekommen. */
  var ATEM = { 1: 0.46, 2: 0.46, 3: 0.34, 4: 0.24 };
  var ATEM_RUNDE = 7.0;

  function lautheit(buf) {
    if (buf.__lautheit !== undefined) return buf.__lautheit;
    var d = buf.getChannelData(0), n = d.length, schritt = Math.max(1, Math.floor(n / 40000));
    var summe = 0, zahl = 0;
    for (var i = 0; i < n; i += schritt) { summe += d[i] * d[i]; zahl++; }
    buf.__lautheit = zahl ? Math.sqrt(summe / zahl) : 0;
    return buf.__lautheit;
  }

  function angleich(buf, ziel) {
    var l = lautheit(buf);
    if (!l) return 1;
    return Math.max(0.15, Math.min(6, ziel / l));
  }

  /* ======================================================================
     1 — DER KATALOG
     Ein Name aus einem Stueck -> eine Probe. Die Epoche entscheidet mit.
     ====================================================================== */

  function je(a, b, c, d) { return function (e) { return [a, b, c, d][(e || 1) - 1]; }; }
  function stets(x) { return function () { return x; }; }
  function altNeu(alt, neu) { return function (e) { return e >= 4 ? neu : alt; }; }

  var BETT = je('bett1', 'bett2', 'bett3', 'bett4');
  var HOF = je('hof1', 'hof2', 'hof3', 'hof4');

  /* Was vorn und hinten von einer Schleife wegbleibt. Nicht Kosmetik:
     bett4 haengt am Ende einen kurzen Signalton an, den das pruefende Ohr
     ungefragt als "modern, nicht 1970" geruegt hat. Er wird nie gespielt. */
  var SCHNITT = {
    /* bett3 endet bei 44,4 s mit einem elektronischen Meldeton, den das Ohr
       ungefragt als "Smartphone-Piepen" benannt hat — in einer Aufnahme von
       1884. Zwei Sekunden Schnitt halten ihn sicher heraus (Datei 45,04 s). */
    bett1: [0.8, 1.5], bett2: [0.8, 1.5], bett3: [0.8, 2.5], bett4: [0.8, 5.5],
    hof1: [0.3, 0.8], hof2: [0.3, 0.8], hof3: [0.3, 0.8], hof4: [0.3, 0.8]
  };
  function schnitt(datei, buf) {
    var s = SCHNITT[datei] || [0.05, 0.2];
    var von = Math.min(s[0], buf.duration * 0.1);
    var bis = Math.max(von + 1, buf.duration - s[1]);
    return { von: von, bis: bis };
  }

  /* datei: Datei ohne Endung (oder Funktion der Epoche)
     ersatz: Ersatzklang, wenn keine Datei da ist oder sie noch nicht geladen
     laut: relativ zum Werk-Pegel                                          */
  var KATALOG = {
    /* --- DIE FUHRE ------------------------------------------------------ */
    'sud:pfanne':        { datei: je('sud1', 'sud2', 'sud3', 'sud4'), laut: 1.15, laenge: 3.2,
                           sagt: 'Der Sud: offene Pfanne, Dampfventil, Kreiselpumpe.' },
    'fuhre:fass-rollen': { datei: altNeu('fassholz', 'fassstahl'), laut: 1.15,
                           sagt: 'Ein Fass rollt.' },
    /* Die Abfahrt darf laenger stehen als alles andere: dass ein Gefaehrt
       WEGFAEHRT, hoert man erst, wenn es weg ist. Das Ohr hat die Fuhre
       bisher nur in 2 von 4 Epochen genannt. */
    'fuhre:abfahrt:ochse':   { datei: stets('abfahrt1'), laut: 1.1, laenge: 4.6 },
    'fuhre:abfahrt:pferd':   { datei: stets('abfahrt2'), laut: 1.1, laenge: 4.6 },
    'fuhre:abfahrt:waggon':  { datei: stets('abfahrt3'), laut: 1.1, laenge: 4.6 },
    'fuhre:abfahrt:lastzug': { datei: stets('abfahrt4'), laut: 1.1, laenge: 4.6 },
    'fuhre:kauf':        { datei: altNeu('muenzen', 'kasse'), laut: 1.0 },
    'fuhre:siegel':      { datei: altNeu('siegel', 'maschine'), laut: 0.8 },
    /* Die Kerbe war nur ein Rauschstoss — das Ohr hat sie in 1350 als
       "Reissverschluss" gehoert. Jetzt ist es ein Messer in Eichenholz. */
    'fuhre:kerbe':       { datei: stets('kerbe'), ersatz: 'kerbe', laut: 0.7 },
    'fuhre:probe':       { datei: je('anstich', 'anstich', 'anstich', 'flaschen'), laut: 0.6 },
    'fuhre:listen':      { datei: stets('papier'), ersatz: 'blatt', laut: 0.45 },
    'tafel:kreide':      { datei: altNeu('kreide', 'maschine'), laut: 0.6 },
    /* Die einzige Dauerschleife des Werks: sie beginnt am Michaelitag und
       laeuft bis zum Ende. Damit ist sie faktisch ein zweites Bett und wird
       entsprechend leise gehalten. */
    'sommer:keller-leer': { ersatz: 'keller', laut: 0.32, schleife: true },

    /* --- DER PREIS ------------------------------------------------------ */
    /* Auflage 5. Das Telefon war fuer sich tadellos — einzeln vorgelegt nennt
       das Ohr es "mechanisches Telefonklingeln, 20. Jahrhundert, nichts
       falsch". In der Mischung von 1970 aber fielen bei Sekunde 16/17
       'preis:michaeli' (Telefon) und 'preis:muenzen' (Registrierkasse) in
       DIESELBE Sekunde, und aus Klingel plus Kassenglocke wurde fuer das
       fremde Ohr ein "digitaler Handy-Klingelton" — ein Geraet ab 1990.
       Zwei Aenderungen, und beide zaehlen: der Zahltag von 1970 ist jetzt die
       Werkspfeife (die einzige Probe im Haus, die nirgends angeschlossen war,
       Auflage 7), und das Geld kommt eine halbe Sekunde SPAETER statt
       gleichzeitig. Damit ist es das, wonach das pruefende Ohr sucht:
       "eine einzelne Glocke und danach gezaehltes Geld".

       ZWEITER ANLAUF, und er steht hier, weil der erste GEMESSEN gescheitert
       ist: als Zahltag von 1970 stand hier zuerst `fabrikpfeife` — die tote
       Probe aus Auflage 7, in einem Aufwasch angeschlossen. Das blinde Ohr
       hat die Epoche daraufhin zwar mit 100 % richtig genannt, aber ungefragt
       gemeldet: "STOERT: Das laute Schnaufen und Pfeifen einer Dampflokomotive
       passt nicht in die 1970er Jahre und gehoert eher in die Epoche um 1884."
       Ein Anachronismus rueckwaerts ist auch einer. Die Dampfpfeife steht
       jetzt in 1884, wo sie hingehoert, und 1970 bekommt eine elektrische
       Werksglocke — einzeln vorgelegt: "lautes mechanisches Klingeln wie eine
       Schulglocke, 19./20. Jahrhundert, nichts falsch".
       Der Michaelitag ist ausserdem der einzige Vorgang, den das Ohr heute
       schon 4 von 4 Mal trifft; er traegt die Latte und wird laut gestellt. */
    'preis:michaeli':    { datei: je('glocke', 'glocke', 'fabrikpfeife', 'werksglocke'),
                           laut: 1.5, zeichen: true, duck: 0.22, halt: 1.5,
                           sagt: 'Michaeli: die Kirchenglocke, die Dampfpfeife, die Werksglocke.' },
    'preis:muenzen':     { datei: altNeu('muenzen', 'kasse'), laut: 1.2,
                           zeichen: true, versatz: 0.62, duck: 0.22, halt: 0.9 },
    'preis:siegel':      { datei: altNeu('siegel', 'maschine'), laut: 0.85 },
    'preis:handschlag':  { datei: stets('handschlag'), laut: 0.85 },
    'preis:fertig':      { datei: altNeu('bau1', 'bau4'), laut: 0.55, laenge: 1.8 },
    'preis:blatt':       { datei: stets('papier'), laut: 0.5 },

    /* --- DIE STADT ------------------------------------------------------ */
    /* Das EIGENE Bauen tritt zurueck. Nicht aus Bescheidenheit: solange es
       so laut war wie das fremde, hat das fremde Ohr in 1884 den Gegenzug bei
       Sekunde 12 gemeldet, wo `sud:bau` steht, statt bei 24, wo der Nachbar
       wirbt. Wer zwei gleich laute Baustellen hat, hat keine. */
    'stadt:bau':         { datei: altNeu('bau1', 'bau4'), laut: 0.55 },
    /* Der Reiter war ein Rauschstoss aus dem Ersatzkasten — das Ohr hat ihn
       in 1350 als "Klicken eines modernen Fotoapparats" gehoert. Jetzt ist
       es das, was er sein soll: ein Bogen Papier. */
    'stadt:reiter':      { datei: stets('papier'), ersatz: 'blatt', laut: 0.4 },

    /* --- DER GEGNER -----------------------------------------------------
       AUFLAGE 1, UND SIE IST DER KERN DES GANZEN URTEILS.
       Der Gegenzug stand auf drei von vier Baendern — und das fremde Ohr hat
       ihn 0 von 4 Mal gehoert. Er war da und war doch nicht da, und der
       Grund ist, dass er nach demselben Hof klang wie alles andere: derselbe
       Karren, dasselbe Papier, dasselbe Siegel wie beim eigenen Zug. Zwei
       Klaenge, die sich nur im Namen unterscheiden, sind fuer ein blindes Ohr
       ein Klang.

       Deshalb hat der Gegenzug jetzt einen eigenen ORT statt eines eigenen
       Namens. Alles, was der Nachbar tut, geht durch `fern` — Tiefpass und
       der kurze Nachschlag eines fremden Hofes, also durch eine Wand. Und
       jeder wirkliche Zug des Nachbarn (`nachbar: true`) zieht das
       NACHBARHOF-Zeichen nach sich: zwei Sekunden gedaempftes Saegen und
       Haemmern von drueben, unter dem sich Bett und Hof tief wegducken.
       Das ist die einzige Stelle im ganzen Stueck, die so klingt.
       Was der Spieler selbst anstoesst (`hinsehen`, `oeffnen`, `hinhalten`),
       traegt kein Zeichen — sonst waere das Zeichen wertlos. */
    'gegner:werben':      { datei: altNeu('karren', 'telefon'), laut: 0.95, fern: true, nachbar: true },
    'gegner:entreissen':  { datei: stets('unruhe'), laut: 1.0, fern: true, nachbar: true },
    'gegner:klage':       { datei: stets('unruhe'), laut: 0.9, fern: true },
    'gegner:bauen':       { datei: altNeu('bau1', 'bau4'), laut: 0.85, fern: true, nachbar: true },
    'gegner:aufstocken':  { datei: altNeu('bau1', 'bau4'), laut: 0.85, fern: true, nachbar: true },
    'gegner:preis':       { datei: altNeu('kreide', 'maschine'), laut: 0.8, fern: true },
    'gegner:fuhre':       { datei: je('abfahrt1', 'abfahrt2', 'abfahrt3', 'abfahrt4'), laut: 0.85, laenge: 3.6, fern: true, nachbar: true },
    'gegner:macht':       { datei: altNeu('siegel', 'maschine'), laut: 0.85, fern: true, nachbar: true },
    'gegner:rohstoff':    { datei: altNeu('muenzen', 'kasse'), laut: 0.8, fern: true, nachbar: true },
    'gegner:unglueck':    { datei: stets('brand'), laut: 1.1, fern: true, nachbar: true },
    'gegner:verlieren':   { datei: stets('unruhe'), laut: 0.7, fern: true },
    'gegner:zuvorkommen': { datei: altNeu('karren', 'telefon'), laut: 0.95, fern: true, nachbar: true },
    'gegner:abloesen':    { datei: stets('handschlag'), laut: 0.9, fern: true, nachbar: true },
    'gegner:festlegung':  { datei: altNeu('siegel', 'maschine'), laut: 0.85, fern: true, nachbar: true },
    'gegner:hinsehen':    { datei: stets('horchen'), ersatz: 'aufmerken', laut: 0.6 },
    /* Vier Namen, die DER GEGNER wirklich ruft und die bis Welle 4 alle im
       Notfallkasten landeten — also viermal dasselbe Hundebellen. Am
       Mitschnitt gezaehlt: in 1970 kam 'gegner:zielen' allein sechsmal in
       dreissig Sekunden. */
    'gegner:zielen':      { datei: stets('horchen'), ersatz: 'aufmerken', laut: 0.45, fern: true },
    'gegner:binden':      { datei: stets('handschlag'), laut: 0.9, fern: true, nachbar: true },
    'gegner:angebot':     { datei: altNeu('karren', 'telefon'), laut: 0.85, fern: true, nachbar: true },
    'gegner:hinhalten':   { datei: stets('papier'), ersatz: 'blatt', laut: 0.5 },
    'gegner:mitbieten':   { datei: altNeu('muenzen', 'kasse'), laut: 0.95, fern: true, nachbar: true },
    'gegner:oeffnen':     { datei: stets('papier'), ersatz: 'blatt', laut: 0.4 },
    /* AUFLAGE 3. Sechs Namen, die `merkeZug()` in gegner.js:417 aus
       'gegner:' + art bildet und die deshalb nie jemand als Zeichenkette
       gesucht hat. `gegner:uebernahme` allein ist in 1970 SECHSMAL in den
       Notfallkasten gefallen. Nachgezaehlt an der Zugmaschine selbst: die
       siebzehn Werte von `art` sind angebot · aufstocken · bauen · ende ·
       erbe · fuhre · laesstab · macht · not · preis · rohstoff · schluckt ·
       uebernahme · unglueck · verlieren · werben · zielen, dazu `binden` und
       `entreissen` aus Zeile 579. Alle neunzehn stehen jetzt oben oder hier.
       Abgenommen wird das nicht am Quelltext, sondern an `geraten()`. */
    'gegner:uebernahme':  { datei: stets('handschlag'), laut: 1.0, fern: true, nachbar: true,
                            sagt: 'Der Nachbar uebernimmt ein Haus — Handschlag von drueben.' },
    'gegner:schluckt':    { datei: stets('unruhe'), laut: 1.0, fern: true, nachbar: true },
    'gegner:not':         { datei: altNeu('muenzen', 'kasse'), laut: 0.8, fern: true },
    'gegner:ende':        { datei: stets('brand'), laut: 1.0, fern: true, nachbar: true },
    'gegner:erbe':        { datei: altNeu('feder', 'maschine'), laut: 0.75, fern: true },
    'gegner:laesstab':    { datei: stets('papier'), ersatz: 'blatt', laut: 0.6, fern: true },

    /* --- DER SUD --------------------------------------------------------
       Gebaut in Welle 2b, also nach dieser Datei. Bis Welle 4 fiel JEDER
       Sud-Ruf in den Notfallkasten und klang nach der kochenden Pfanne —
       auch das Anstechen, die Hefe und der Rueckruf. Der Sud ist der
       Vorgang, nach dem die Latte fragt; er bekommt jetzt eigene Klaenge. */
    'sud:anstellen':     { datei: je('sud2', 'sud2', 'sud3', 'sud4'), laut: 0.9,
                           sagt: 'Angestellt wird: Holzfeuer, Dampf, Motor.' },
    'sud:ausschlagen':   { datei: je('sud1', 'sud1', 'sud3', 'sud4'), laut: 0.8 },
    'sud:anstich':       { datei: je('anstich', 'anstich', 'anstich', 'flaschen'), laut: 1.0,
                           sagt: 'Das Fass wird angestochen — 1970 laeuft die Abfuellung.' },
    'sud:hefe':          { datei: stets('hefe'), laut: 0.7 },
    'sud:verschneiden':  { datei: altNeu('fassholz', 'fassstahl'), laut: 0.75 },
    'sud:fehlsud':       { datei: stets('brand'), laut: 0.8 },
    'sud:sperre':        { datei: stets('unruhe'), laut: 0.7 },
    'sud:rueckruf':      { datei: altNeu('glocke', 'telefon'), laut: 0.8 },
    'sud:freigabe':      { datei: je('siegel', 'siegel', 'woche3', 'maschine'), laut: 0.75 },
    'sud:siegel':        { datei: altNeu('siegel', 'maschine'), laut: 0.75 },
    'sud:kauf':          { datei: altNeu('muenzen', 'kasse'), laut: 0.85 },
    'sud:umstellen':     { datei: altNeu('kreide', 'maschine'), laut: 0.6 },
    'sud:bau':           { datei: altNeu('bau1', 'bau4'), laut: 0.5, laenge: 1.8 },
    'sud:anzeige':       { datei: stets('papier'), ersatz: 'blatt', laut: 0.45 },

    /* --- DER NAME ------------------------------------------------------- */
    'name:anschlagen':   { datei: altNeu('bau1', 'bau4'), laut: 0.5, laenge: 1.8 },
    'name:aushaengen':   { datei: altNeu('bau1', 'bau4'), laut: 0.45, laenge: 1.8 },
    'name:einziehen':    { datei: stets('kerbe'), ersatz: 'kerbe', laut: 0.5 },
    'name:siegel':       { datei: altNeu('siegel', 'maschine'), laut: 0.7 },
    'name:aufgeld':      { datei: altNeu('muenzen', 'kasse'), laut: 0.8 },
    'name:verkauf':      { datei: altNeu('muenzen', 'kasse'), laut: 0.7 },
    'name:zulauf':       { datei: stets('unruhe'), laut: 0.6 },
    'name:verlust':      { datei: stets('unruhe'), laut: 0.5 },
    'name:mundpropaganda': { datei: stets('unruhe'), laut: 0.45 },
    /* War eine Glocke. In 1600 lagen dadurch sieben glockenaehnliche Schlaege
       in dreissig Sekunden, und das Ohr hat daraus ungefragt eine "moderne
       Fahrradklingel" gemacht. Ein gutes Urteil ist ein Handschlag. */
    'name:urteil-gut':   { datei: stets('handschlag'), laut: 0.5 },
    'name:urteil-schlecht': { datei: stets('unruhe'), laut: 0.6 },
    'name:entzug':       { datei: stets('unruhe'), laut: 0.7 },
    'name:nachahmung':   { datei: altNeu('karren', 'telefon'), laut: 0.55 },
    'name:rueckruf':     { datei: altNeu('glocke', 'telefon'), laut: 0.7 },
    /* Werbung: der Ausrufer, der Druckstock, die Annonce, der Rundfunk. */
    'name:druck':        { datei: je('feder', 'feder', 'maschine', 'maschine'), laut: 0.5 },
    'name:spot':         { datei: altNeu('kreide', 'telefon'), laut: 0.55 },

    /* --- DAS ERBE ------------------------------------------------------- */
    'erbe:feder':        { datei: stets('feder'), laut: 0.6,
                           sagt: 'Der Kiel im Hausbuch.' },
    'erbe:fallen':       { datei: altNeu('glocke', 'telefon'), laut: 0.85 },
    'erbe:spruch':       { datei: stets('unruhe'), laut: 0.6 },
    'erbe:widerspruch':  { datei: stets('unruhe'), laut: 0.7 },
    'erbe:uebergabe':    { datei: stets('handschlag'), laut: 0.8 },
    /* Nicht Muenzen: erbteil faellt unmittelbar nach 'erbe:fallen', und
       Glocke-dann-klimperndes-Metall hat das Ohr in 1350 als Telefonklingeln
       gehoert. Der Erbteil wird ins Buch geschrieben. */
    'erbe:erbteil':      { datei: altNeu('feder', 'kasse'), laut: 0.6 },
    'erbe:stiftung':     { datei: altNeu('glocke', 'telefon'), laut: 0.7 },
    /* Auch nicht das Wochenzeichen: es faellt in derselben Sekunde wie
       'uhr:woche' und verdoppelt es nur. Eine Kerbe im Holz. */
    'erbe:stunde':       { datei: stets('kerbe'), laut: 0.4 },
    /* Vier Namen aus der Erbleiste, die heute als Zugschluessel dastehen und
       morgen geklungen sein wollen. Sie kosten nichts und halten den
       Notfallkasten leer, falls DAS ERBE sie anschliesst. */
    'erbe:anfechten':    { datei: stets('unruhe'), laut: 0.7 },
    'erbe:nachschrift':  { datei: stets('feder'), laut: 0.55 },
    'erbe:seelgeraet':   { datei: altNeu('glocke', 'telefon'), laut: 0.7 },
    'erbe:verlaengern':  { datei: altNeu('siegel', 'maschine'), laut: 0.65 },

    /* --- DER KERN -------------------------------------------------------
       Der haeufigste Ton im ganzen Spiel: der WEITER-Knopf. Er war zuerst
       ein synthetisches Glockchen — und das pruefende Ohr hat ihn ungefragt
       als "moderne UI-Pieptoene" geruegt, bei 1350. Jetzt ist es je Epoche
       ein wirkliches Zeichen: Holzklapper, Handglocke, Dampfpfiff, Stechuhr. */
    /* AUFLAGE 7, und sie hat mehr eingebracht als das Aufraeumen einer toten
       Datei. `fabrikpfeife.mp3` war nirgends genannt — und `woche3.mp3`, das
       Wochenzeichen von 1884, ist einzeln vorgelegt eine "Trillerpfeife,
       Schiedsrichterpfeife". Zeitlich erlaubt (die Trillerpfeife gibt es seit
       1868), aber im Hof einer Dampfbrauerei ist das Zeichen der Woche die
       WERKSPFEIFE. Die tote Datei war die richtige Probe an der falschen
       Stelle, nicht ueberzaehlig. Die Trillerpfeife steht jetzt bei
       'sud:freigabe' — der Braumeister pfeift den Sud frei. */
    'uhr:woche':         { datei: je('woche1', 'woche2', 'fabrikpfeife', 'woche4'),
                           ersatz: 'woche', laut: 0.5,
                           laenge: je(2.6, 2.6, 1.7, 2.6),
                           sagt: 'Eine Woche weiter — je Epoche ein anderes Zeichen.' }
  };

  /* Was ein unbekannter Name bekommt, damit kein Ruf ins Leere geht.
     Auch der Notfall greift zu einer wirklichen Probe: ein synthetischer
     Piepser waere in jeder der vier Epochen ein Anachronismus.

     Der Notfallkasten ist die zweite Wahl und muss die zweite Wahl bleiben:
     wo ein Stueck einen Namen oft ruft, gehoert er nach oben in den Katalog.
     `B.ton.geraten()` zaehlt, welche Namen hier gelandet sind — damit die
     Luecke zaehlbar wird, statt nur nach Papier zu klingen. */
  var NOTFALL = {
    sud:    { datei: je('sud1', 'sud2', 'sud3', 'sud4'), laut: 0.6 },
    fuhre:  { datei: stets('kerbe'), laut: 0.6 },
    tafel:  { datei: altNeu('kreide', 'maschine'), laut: 0.5 },
    preis:  { datei: stets('papier'), laut: 0.5 },
    stadt:  { datei: stets('papier'), ersatz: 'blatt', laut: 0.45 },
    gegner: { datei: stets('horchen'), ersatz: 'aufmerken', laut: 0.55 },
    name:   { datei: je('feder', 'feder', 'maschine', 'maschine'), laut: 0.5 },
    erbe:   { datei: stets('feder'), laut: 0.5 },
    uhr:    { datei: je('woche1', 'woche2', 'woche3', 'woche4'), laut: 0.5 },
    sommer: { ersatz: 'keller', laut: 0.5 }
  };

  /* Buchfuehrung ueber den Notfallkasten. Kein Ton haengt daran. */
  var GERATEN = {};

  function eintrag(name) {
    if (KATALOG[name]) return KATALOG[name];
    GERATEN[name] = (GERATEN[name] || 0) + 1;
    var kopf = String(name).split(':')[0];
    var n = NOTFALL[kopf];
    if (n) return { datei: n.datei, ersatz: n.ersatz, laut: n.laut, geraten: true };
    return { ersatz: 'blatt', laut: 0.5, geraten: true };
  }

  /* WO IN DER PROBE DER KLANG WIRKLICH ANFAENGT.
     Gemessen, nicht geschaetzt: jede Probe wurde entschluesselt und das erste
     20-ms-Fenster gesucht, das ein Fuenftel des Hoechstwerts erreicht.
     `handschlag.mp3` faengt erst bei 1,28 s an zu klatschen — und derselbe
     Handschlag ist der Klang, mit dem der Nachbar ein Haus abloest, bindet
     und uebernimmt. Die Abnahme der Auflage 1 verlangt die Sekunde auf ±2 s;
     mit anderthalb Sekunden Vorlauf verschenkt man sie an das Messfenster.
     Wo hier nichts steht, faengt die Probe bei null an. */
  var EINSATZ = { handschlag: 1.20, muenzen: 0.26, unruhe: 0.13, hefe: 0.10 };

  function dateiVon(e, epoche) {
    if (!e || !e.datei) return null;
    return (typeof e.datei === 'function') ? e.datei(epoche) : e.datei;
  }

  /* ======================================================================
     2 — ROHDATEN UND PUFFER
     Es wird NICHTS geladen, bevor Ton wirklich gebraucht wird. Ein
     Bildschirmfoto-Lauf (schuss.mjs, ?stumm=1) laedt damit kein einziges Byte.
     ====================================================================== */

  var roh = {};                       /* datei -> Promise<Uint8Array> */

  function basis() {
    /* Der Pfad des Spiels, egal ob es unter /spiel/ oder / liegt. */
    var p = String(location.pathname);
    return p.replace(/[^/]*$/, '') + ORDNER;
  }

  function hole(datei) {
    if (roh[datei]) return roh[datei];
    roh[datei] = new Promise(function (ja, nein) {
      var x = new XMLHttpRequest();
      x.open('GET', basis() + datei + '.mp3', true);
      x.responseType = 'arraybuffer';
      x.onload = function () {
        if (x.status >= 200 && x.status < 300 && x.response) ja(new Uint8Array(x.response));
        else nein(new Error('Probe ' + datei + ': Status ' + x.status));
      };
      x.onerror = function () { nein(new Error('Probe ' + datei + ' nicht erreichbar')); };
      x.send();
    });
    roh[datei]['catch'](function (f) { B.klage('ton.laden', f); });
    return roh[datei];
  }

  /* Entschluesselte Puffer haengen am jeweiligen Kontext — der Offline-Kontext
     hat eine andere Abtastrate als der lebende und braucht eigene. */
  function puffer(ctx, datei) {
    var fach = ctx.__klangPuffer || (ctx.__klangPuffer = {});
    if (fach[datei]) return fach[datei];
    fach[datei] = hole(datei).then(function (u8) {
      return new Promise(function (ja, nein) {
        /* decodeAudioData loest den ArrayBuffer aus — also immer eine Kopie. */
        var kopie = u8.slice().buffer;
        var p;
        try { p = ctx.decodeAudioData(kopie, ja, nein); }
        catch (f) { nein(f); return; }
        if (p && p.then) p.then(ja, nein);
      });
    });
    fach[datei]['catch'](function (f) { B.klage('ton.deuten', f); });
    return fach[datei];
  }

  function fertig(ctx, datei) {
    var fach = ctx.__klangFertig || (ctx.__klangFertig = {});
    return fach[datei] || null;
  }
  function merke(ctx, datei, buf) {
    var fach = ctx.__klangFertig || (ctx.__klangFertig = {});
    fach[datei] = buf;
  }
  function ladeStill(ctx, datei) {
    if (!datei || fertig(ctx, datei)) return;
    puffer(ctx, datei).then(function (b) { merke(ctx, datei, b); }, function () { });
  }

  /* ======================================================================
     3 — ERSATZKLAENGE
     Sie sind nicht Notnagel, sondern Teil des Entwurfs: die kleinen,
     haeufigen Zeichen (Woche, Reiter, Kerbe) sollen keine Datei kosten.
     Gesaet, nie Math.random — sonst ist der Mitschnitt nicht wiederholbar.
     ====================================================================== */

  var saat = 20250801;
  function zufall() { saat = (saat * 1103515245 + 12345) & 0x7fffffff; return saat / 0x7fffffff; }

  function rauschen(ctx, sek) {
    var schl = 'r' + sek;
    var fach = ctx.__klangRausch || (ctx.__klangRausch = {});
    if (fach[schl]) return fach[schl];
    var n = Math.max(1, Math.floor(ctx.sampleRate * sek));
    var b = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = zufall() * 2 - 1;
    fach[schl] = b;
    return b;
  }

  /* Ein Tropfen, gebaut aus RAUSCHEN durch einen Resonanzfilter — nicht aus
     einem Sinus. Das ist der teuerste Fund dieser Runde und er war unsichtbar:
     der Tropfen war ein abfallender Sinus von 900 auf 420 Hz, viermal in einer
     Schleife von sechs Sekunden, und diese Schleife laeuft ab Michaeli bis zum
     Ende. Das fremde Ohr hat sie in 1350 UND in 1884 ungefragt als
     "mehrfach elektronische Pieptoene, wie ein modernes digitales Geraet"
     gemeldet — in genau den beiden Epochen, deren Mischung duenn genug ist,
     dass man sie hoert. Der Kopf dieses Abschnitts behauptete schon vorher
     "kein einziger Oszillator in dieser Datei"; er stimmte nicht.
     Zweipoliges Bandpassfilter (RBJ), Guete 1,2 — breit genug, dass ein
     Wassertropfen daraus wird und kein Piepser. */
  function tropfen(d, ab, n, r, f0, guete, spitze) {
    var w0 = 2 * Math.PI * f0 / r, sin = Math.sin(w0), cos = Math.cos(w0);
    var alpha = sin / (2 * guete);
    var a0 = 1 + alpha, a1 = -2 * cos, a2 = 1 - alpha;
    var x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    var len = Math.floor(r * 0.30);
    for (var k = 0; k < len && ab + k < n; k++) {
      var x = (zufall() * 2 - 1) * Math.exp(-15 * k / len);
      var y = (alpha * x - alpha * x2 - a1 * y1 - a2 * y2) / a0;
      x2 = x1; x1 = x; y2 = y1; y1 = y;
      d[ab + k] += y * spitze;
    }
  }

  /* Ein Keller, der leer ist: Raumton und Tropfen. Als Schleife gebaut. */
  function kellerBand(ctx) {
    if (ctx.__klangKeller) return ctx.__klangKeller;
    var r = ctx.sampleRate, n = Math.floor(r * 6), b = ctx.createBuffer(1, n, r), d = b.getChannelData(0);
    var tief = 0;
    for (var i = 0; i < n; i++) {
      tief = tief * 0.995 + (zufall() * 2 - 1) * 0.005;
      d[i] = tief * 0.9;
    }
    [[0.4, 780], [1.9, 620], [3.1, 900], [4.6, 700]].forEach(function (t) {
      tropfen(d, Math.floor(t[0] * r), n, r, t[1], 1.2, 2.4);
    });
    ctx.__klangKeller = b;
    return b;
  }

  function huelle(ctx, ziel, wann, an, halt, ab, spitze) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, wann);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, spitze), wann + an);
    g.gain.setValueAtTime(Math.max(0.0002, spitze), wann + an + halt);
    g.gain.exponentialRampToValueAtTime(0.0001, wann + an + halt + ab);
    g.connect(ziel);
    return g;
  }

  function knall(ctx, ziel, wann, mitte, guete, dauer, spitze) {
    var q = ctx.createBufferSource(); q.buffer = rauschen(ctx, 1);
    var f = ctx.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = mitte; f.Q.value = guete;
    var g = huelle(ctx, ziel, wann, 0.003, dauer * 0.15, dauer, spitze);
    q.connect(f); f.connect(g);
    q.start(wann); q.stop(wann + dauer + 0.05);
  }

  /* Kein einziger Oszillator in dieser Datei. Siehe 'woche' unten. */
  function ersatz(ctx, ziel, welcher, wann, epoche, laut) {
    var v = laut === undefined ? 0.6 : laut;
    switch (welcher) {

      /* Alle Ersatzklaenge sind gefiltertes Rauschen und keine Oszillatoren.
         Das ist kein Geschmack: ein reiner Sinus oder eine Rechteckwelle
         klingt in JEDER der vier Epochen nach 1980, und genau das hat das
         pruefende Ohr im ersten Durchgang beanstandet. Holz, Blech und
         Papier lassen sich aus Rauschen bauen, ein Piepser nicht wegdenken. */

      case 'woche':                               /* nur bis die Probe geladen ist */
        knall(ctx, ziel, wann, epoche >= 3 ? 900 : 340, epoche >= 3 ? 1.8 : 1.2, 0.10, 0.5 * v);
        knall(ctx, ziel, wann + 0.13, epoche >= 3 ? 1400 : 520, 1.4, 0.14, 0.3 * v);
        return true;

      case 'kerbe':                               /* Messer schneidet Holz */
        knall(ctx, ziel, wann, 1500, 2.5, 0.08, 0.4 * v);
        knall(ctx, ziel, wann + 0.06, 1900, 2.0, 0.12, 0.25 * v);
        return true;

      case 'blatt':                               /* Papier, Reiter, Umblaettern */
        knall(ctx, ziel, wann, 3000, 0.9, 0.09, 0.22 * v);
        knall(ctx, ziel, wann + 0.07, 2400, 0.9, 0.13, 0.16 * v);
        return true;

      case 'aufmerken':                           /* der Nachbar hat sich geregt */
        knall(ctx, ziel, wann, 260, 1.6, 0.11, 0.35 * v);
        knall(ctx, ziel, wann + 0.17, 230, 1.6, 0.14, 0.28 * v);
        return true;

      case 'keller': {                            /* Schleife: leerer Keller */
        var q = ctx.createBufferSource();
        q.buffer = kellerBand(ctx);
        q.loop = true;
        var g = ctx.createGain(); g.gain.value = 0.8 * v;
        q.connect(g); g.connect(ziel);
        q.start(wann);
        return q;
      }
    }
    knall(ctx, ziel, wann, 1200, 1, 0.08, 0.2 * v);
    return true;
  }

  /* ======================================================================
     4 — DER GRAPH
     Dieselben Funktionen bauen den lebenden und den Offline-Graphen. Nur so
     ist die Datei, die der Pruefer bekommt, wirklich der Ton des Spiels.
     ====================================================================== */

  /* DIE BREMSE — Auflage 6.
     `epoche3.wav` hat die Vollaussteuerung beruehrt: Spitze 1,0000 bei einer
     Probe von 1 323 000. Einmal ist einmal zu viel, und der Kompressor allein
     kann es nicht verhindern: er regelt den Pegel, aber er hat keine Decke.
     Diese hier hat eine. Die Kennlinie ist g·tanh(x/g) ueber der Eingabe
     -1..+1; alles darueber klemmt der Knoten selbst auf den Randwert. Mit
     g = 1,2 kann am Ausgang nie mehr als 0,818 stehen, und unterhalb von
     0,3 weicht die Kennlinie um weniger als drei Prozent von der Geraden ab —
     eine Decke, kein Verzerrer.

     `oversample` bleibt AUS, und das ist gemessen und nicht gemeint: mit '4x'
     stand in epoche3.wav wieder eine Spitze von 1,0000 und zwei uebersteuerte
     Proben. Die Ueberabtastung filtert vor und nach der Kennlinie, und diese
     Filter schwingen an der Kante bei ±1 ueber — die Decke gilt dann fuer die
     Kennlinie, aber nicht mehr fuer den Ausgang. Ohne sie ist der Ausgang
     Probe fuer Probe ein Wert der Kennlinie, und die Decke haelt. */
  function bremse(ctx, g) {
    var w = ctx.createWaveShaper();
    var n = 4097, c = new Float32Array(n), i, x;
    for (i = 0; i < n; i++) {
      x = (i / (n - 1)) * 2 - 1;
      c[i] = g * Math.tanh(x / g);
    }
    w.curve = c;
    try { w.oversample = 'none'; } catch (f) { }
    return w;
  }

  /* Die Kontur des Atems: eine Runde von ATEM_RUNDE Sekunden, Wert 0..1.
     Zwei Wellen ungleicher Laenge, damit es nicht nach Motor klingt, und
     hoch 1,5 genommen, damit der Hof unten laenger verweilt als oben — sonst
     erwischt ein Messfenster von 500 ms den tiefsten Punkt nicht. Anfang und
     Ende sind beide null, die Schleife hat also keine Naht. */
  function atemBand(ctx) {
    if (ctx.__klangAtem) return ctx.__klangAtem;
    /* 3000 Hz ist die unterste Abtastrate, die createBuffer zulaesst; darunter
       wirft der Browser. Fuer eine Kontur, deren schnellste Welle drei Runden
       auf sieben Sekunden macht, ist das reichlich. */
    var rate = 3000, n = Math.round(ATEM_RUNDE * rate);
    var b = ctx.createBuffer(1, n, rate), d = b.getChannelData(0), i, p, v;
    for (i = 0; i < n; i++) {
      p = i / n;
      v = 0.72 * (0.5 - 0.5 * Math.cos(2 * Math.PI * p))
        + 0.28 * (0.5 - 0.5 * Math.cos(6 * Math.PI * p));
      d[i] = Math.pow(v, 1.5);
    }
    ctx.__klangAtem = b;
    return b;
  }

  /* Ein Kanal, der durch eine Wand kommt: Tiefpass, ein Hochpass gegen das
     Wummern, und der kurze Nachschlag eines fremden Hofes. Damit klingt der
     Gegenzug nicht wie der eigene Zug, sondern wie DRUEBEN — genau die
     Auskunft, die dem fremden Ohr gefehlt hat. */
  function baueWand(ctx, ziel, kappe, echo, nass) {
    var ein = ctx.createGain(); ein.gain.value = 1;
    var tief = ctx.createBiquadFilter();
    tief.type = 'lowpass'; tief.frequency.value = kappe; tief.Q.value = 0.5;
    var hoch = ctx.createBiquadFilter();
    hoch.type = 'highpass'; hoch.frequency.value = 170;
    var v = ctx.createDelay(0.6); v.delayTime.value = echo;
    var rueck = ctx.createGain(); rueck.gain.value = 0.32;
    var n = ctx.createGain(); n.gain.value = nass;
    ein.connect(tief); tief.connect(hoch);
    hoch.connect(ziel);
    hoch.connect(v); v.connect(rueck); rueck.connect(v);
    v.connect(n); n.connect(ziel);
    return ein;
  }

  function baueWerk(ctx, epoche) {
    var meister = ctx.createGain();
    meister.gain.value = 0.92;
    var letzt = meister;
    try {
      var druck = ctx.createDynamicsCompressor();
      druck.threshold.value = -6; druck.knee.value = 26;
      druck.ratio.value = 3.0; druck.attack.value = 0.008; druck.release.value = 0.26;
      meister.connect(druck);
      letzt = druck;
    } catch (f) { }
    try {
      var deckel = bremse(ctx, 1.2);
      letzt.connect(deckel);
      letzt = deckel;
    } catch (f) { }
    letzt.connect(ctx.destination);

    /* Was wirklich zum Ausgang geht. Daran haengt der Pegelmesser — sonst
       misst man den Wunsch und nicht den Ton. Seit Welle 4 Runde 2 ist das
       der Knoten HINTER der Bremse: wer den Ausgang abgreift, soll denselben
       Ton bekommen, der aus dem Lautsprecher kommt, und nicht den davor. */
    var w = { ctx: ctx, meister: meister, ausgang: letzt,
              bus: {}, ruhe: {}, atem: {}, schleifen: {} };
    /* Der Zeichenbus laeuft an der Zaesur vorbei — sonst duckte sich die
       Glocke unter sich selbst weg. */
    w.ruhe.zeichen = 1.25;
    w.bus.zeichen = ctx.createGain();
    w.bus.zeichen.gain.value = w.ruhe.zeichen;
    w.bus.zeichen.connect(meister);

    ['bett', 'hof', 'werk'].forEach(function (n) {
      w.ruhe[n] = PEGEL[n];
      var g = ctx.createGain(); g.gain.value = w.ruhe[n];
      w.bus[n] = g;
      if (n === 'werk') { g.connect(meister); return; }

      /* Bett und Hof atmen. Der Wert des Knotens ist der tiefste Punkt, das
         Band addiert den Rest hinzu — ein AudioParam summiert, was an ihm
         haengt. So laesst sich die Tiefe spaeter aendern, ohne den Graphen
         neu zu bauen. */
      var a = ctx.createGain();
      var skala = ctx.createGain();
      var q = ctx.createBufferSource();
      q.buffer = atemBand(ctx); q.loop = true;
      q.connect(skala); skala.connect(a.gain);
      g.connect(a); a.connect(meister);
      w.atem[n] = { knoten: a, skala: skala, quelle: q };
      try { q.start(0); } catch (f) { }
    });
    setzeAtem(w, epoche);

    /* Zwei Waende, und beide haengen NICHT am Werkbus, sondern an einem
       eigenen. Das ist die Stelle, an der Auflage 1 haengt: der Gegenzug
       faellt im Spiel regelmaessig in dieselbe Sekunde wie fuenf eigene
       Klaenge — in 1884 stehen bei Sekunde 24 `uhr:woche`, `sud:anstellen`,
       `sud:ausschlagen`, `sud:pfanne` und `name:verlust` neben
       `gegner:werben`. Solange der Nachbar im selben Bus liegt wie sie, kann
       er nicht vortreten, ohne alles andere mitzunehmen. Auf einem eigenen
       Bus kann der Hof fuer ihn zuruecktreten. */
    w.ruhe.fremd = 1.0;
    w.bus.fremd = ctx.createGain();
    w.bus.fremd.gain.value = w.ruhe.fremd;
    w.bus.fremd.connect(meister);
    w.bus.fern = baueWand(ctx, w.bus.fremd, 2000, 0.155, 0.40);
    w.bus.nachbar = baueWand(ctx, w.bus.fremd, 1800, 0.190, 0.55);
    return w;
  }

  function setzeAtem(w, epoche) {
    var tief = ATEM[epoche] === undefined ? 0.5 : ATEM[epoche];
    ['bett', 'hof'].forEach(function (n) {
      var a = w.atem[n];
      if (!a) return;
      try {
        a.knoten.gain.value = tief;
        a.skala.gain.value = 1 - tief;
      } catch (f) { }
    });
  }

  /* Eine Schleife (Bett oder Hof) mit weichem Ein- und Ausblenden.
     versatz: wo im Band angefangen wird — damit vier Epochen nicht viermal
     denselben Musikanfang zeigen. */
  function legeSchleife(w, bus, buf, wann, dauer, blende, datei, versatz) {
    var ctx = w.ctx;
    var f = schnitt(datei, buf);
    var q = ctx.createBufferSource();
    q.buffer = buf;
    q.loop = true;
    q.loopStart = f.von;
    q.loopEnd = f.bis;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, wann);
    g.gain.linearRampToValueAtTime(angleich(buf, ZIEL[bus] || 0.07), wann + (blende || 1.2));
    q.connect(g); g.connect(w.bus[bus]);
    var ab = f.von + ((versatz || 0) % Math.max(0.5, f.bis - f.von));
    q.start(wann, ab);
    if (dauer) q.stop(wann + dauer + 0.2);
    return { quelle: q, gain: g };
  }

  function blendeAus(w, was, wann) {
    if (!was) return;
    try {
      was.gain.gain.cancelScheduledValues(wann);
      was.gain.gain.setValueAtTime(was.gain.gain.value, wann);
      was.gain.gain.linearRampToValueAtTime(0.0001, wann + 1.1);
      was.quelle.stop(wann + 1.3);
    } catch (f) { /* schon gestoppt */ }
  }

  /* Bett UND Hof ducken sich weg, wenn etwas geschieht. 1350 ist eine leise
     Welt: dort entscheidet dieses Wegducken darueber, ob das Ohr das rollende
     Fass ueberhaupt bemerkt oder nur noch die Gaense hoert. `halt` haelt das
     Bett unten, solange ein langer Vorgang laeuft — der Michaelitag von 1970
     war leiser als das, was ohnehin lief (Hub 0,87), und ein Zeichen, das
     unter der Kulisse bleibt, ist kein Zeichen. */
  function senke(w, bus, wann, anteil, halt, zurueck) {
    var g = w.bus[bus].gain, ruhe = w.ruhe[bus];
    try {
      g.cancelScheduledValues(wann);
      g.setValueAtTime(g.value, wann);
      g.linearRampToValueAtTime(ruhe * anteil, wann + 0.05);
      if (halt) g.setValueAtTime(ruhe * anteil, wann + 0.05 + halt);
      g.linearRampToValueAtTime(ruhe, wann + 0.05 + halt + zurueck);
    } catch (f) { }
  }

  function ducke(w, wann, tiefe, halt) {
    var t = tiefe === undefined ? 0.5 : tiefe;
    var h = halt || 0;
    /* Ein spaeterer, FLACHERER Zug darf einen tieferen, der noch laeuft, nicht
       aufheben. Ohne diese Sperre hebt `sud:ausschlagen` die Zaesur des
       Michaelitags wieder auf — es faellt in dieselbe Sekunde, eine Stelle
       spaeter in der Liste, und `cancelScheduledValues` macht keinen
       Unterschied zwischen tief und flach. Gemessen: genau daran hing der
       Michaeli-Hub. */
    if (w.duckBis !== undefined && wann < w.duckBis
        && t >= (w.duckTiefe === undefined ? 1 : w.duckTiefe)) return;
    w.duckBis = wann + 0.05 + h + 0.70;
    w.duckTiefe = t;
    senke(w, 'bett', wann, t, h, 0.70);
    senke(w, 'hof', wann, 1 - (1 - t) * 0.60, h, 0.70);
  }

  /* DIE ZAESUR — Auflage 2, zweite Haelfte.
     Der Michaelitag hatte in 1970 einen Hub von 0,87: der Zahltag war leiser
     als das, was ohnehin lief. Ein tieferes Bett allein heilt das nicht —
     gemessen wurde danach ein Hub von 0,87 in 1350 und 0,74 in 1600, und
     diesmal lag es nicht am Bett, sondern am WERK: das Jahr wechselt nach
     einer Reihe schneller Klicks, und deren Klaenge stehen noch im Raum.
     Ein Zeichen, das die ganze Epoche traegt, braucht deshalb eine Zaesur und
     nicht nur mehr Pegel: Bett, Hof UND Werk gehen zurueck, und das Zeichen
     selbst laeuft an ihnen vorbei auf einen eigenen Bus. Der Hof haelt an,
     wenn die Glocke schlaegt. */
  function zaesur(w, wann, tiefe, halt) {
    var t = tiefe === undefined ? 0.25 : tiefe;
    var h = halt || 0;
    w.duckBis = wann + 0.05 + h + 0.75;
    w.duckTiefe = t;
    senke(w, 'bett', wann, t, h, 0.75);
    senke(w, 'hof', wann, t, h, 0.75);
    senke(w, 'werk', wann, t, h, 0.75);
    if (w.bus.fremd) senke(w, 'fremd', wann, t, h, 0.75);
  }

  /* DAS NACHBARHOF-ZEICHEN — Auflage 1.
     Zwei Sekunden Saegen und Haemmern, eine Wand weiter. Es steht NEBEN dem
     eigentlichen Klang des Zuges, nicht an seiner Stelle: das Ohr soll hoeren,
     WAS drueben geschieht und DASS es drueben geschieht.
     Der Abstand von 3,2 s ist keine Zierde. In 1970 fallen 'gegner:binden',
     ':unglueck' und ':uebernahme' in dieselbe Sekunde; ohne Sperre laege das
     Zeichen dreifach uebereinander und waere wieder eine Wand. Viereinhalb
     Sekunden, weil das Zeichen sonst beim schnellen Weiterklicken zum
     Dauerlaeufer wird und den Michaelitag zudeckt — genau gemessen. */
  /* ZWEITER ANLAUF, und wieder steht er hier, weil der erste GEMESSEN
     gescheitert ist. Das Zeichen war zuerst `bau1`/`bau4` — dieselbe Probe,
     mit der DIE STADT und DER SUD das EIGENE Bauen klingen lassen. Das
     fremde Ohr hat den Gegenzug daraufhin zwar in 4 von 4 Aufnahmen gemeldet
     (vorher 0 von 4), aber dreimal an der falschen Sekunde: in 1884 bei 12 s,
     wo `sud:bau` steht, statt bei 24 s, wo der Nachbar wirbt. Es hoerte
     "Geraeusch einer Handsaege" und nannte das den Gegenzug — zu Recht, denn
     es war genau derselbe Klang.
     Ein Zeichen, das sich eine Probe mit einem anderen Vorgang teilt, ist
     kein Zeichen. DRITTER ANLAUF, und der zweite ist an derselben Klippe
     gescheitert wie der erste: als das Zeichen "schnelles Klopfen auf Holz"
     war, hat das Ohr in 1350 zweimal hintereinander Sekunde 13 genannt statt
     24 — dort steht `sud:anstich`, der Kuefer, der den Zapfen ins Fass
     schlaegt. Auch Klopfen auf Holz. Ein Hof ist voller Holz und voller
     Haemmer; ein Zeichen darf sich nicht daraus bedienen.
     Jetzt ist es ein TOR: es quietscht auf, etwas geht hindurch, es faellt
     zu, der Riegel faellt ein. In den vier Epochen quietscht sonst nichts,
     und ein Tor, das drueben auf- und zugeht, ist genau die Auskunft, um die
     es geht — jemand anderes kommt und geht, ohne dass man ihn angestossen
     hat. Einzeln vorgelegt: "quietschendes Tuerscharnier, schwere Holztuer,
     lautes Zuschlagen, Riegel" (1350: nichts falsch) bzw. dasselbe in Metall
     (1970: nichts falsch). */
  var NACHBAR_DATEI = altNeu('nachbar1', 'nachbar4');
  var NACHBAR_DAUER = 3.6;
  var NACHBAR_PAUSE = 4.5;

  function nachbarhof(w, epoche, wann) {
    var ctx = w.ctx;
    if (w.nachbarLetzt !== undefined && wann - w.nachbarLetzt < NACHBAR_PAUSE) return false;
    var datei = NACHBAR_DATEI(epoche);
    var buf = fertig(ctx, datei);
    if (!buf) { ladeStill(ctx, datei); return false; }
    w.nachbarLetzt = wann;
    w.nachbarZahl = (w.nachbarZahl || 0) + 1;

    var d = Math.min(NACHBAR_DAUER, Math.max(0.6, buf.duration - 0.15));
    /* Immer von vorn. Bei einem Tor ist die Reihenfolge die Auskunft — erst
       das Quietschen, dann der Schlag, dann der Riegel. Ein Einstieg mittendrin
       waere wieder nur ein Geraeusch. Dass es jedes Mal dasselbe Tor ist, ist
       kein Mangel: ein Zeichen wird erkannt, weil es sich gleicht. */
    var ab = 0;

    var q = ctx.createBufferSource();
    q.buffer = buf;
    var g = ctx.createGain();
    /* Wie bei den Schleifen: die beiden Proben sind NICHT gleich laut aus dem
       Erzeuger gekommen (Effektivwert 0,044 gegen 0,100). Ein Zeichen, das in
       1350 halb so laut ist wie in 1970, ist in 1350 kein Zeichen. */
    var laut = angleich(buf, 0.19);
    g.gain.setValueAtTime(0.0001, wann);
    g.gain.linearRampToValueAtTime(laut, wann + 0.22);
    g.gain.setValueAtTime(laut, wann + d - 0.45);
    g.gain.linearRampToValueAtTime(0.0001, wann + d);
    q.connect(g); g.connect(w.bus.nachbar);
    q.start(wann, ab);
    q.stop(wann + d + 0.05);
    /* Bett und Hof gehen tief, das eigene WERK geht mit. Nicht so tief wie
       bei der Zaesur des Michaelitags — der Gegenzug unterbricht den Hof
       nicht, er draengt sich nur davor. */
    w.duckBis = wann + 0.05 + (d - 0.4) + 0.70;
    w.duckTiefe = 0.28;
    senke(w, 'bett', wann, 0.28, d - 0.4, 0.70);
    senke(w, 'hof', wann, 0.34, d - 0.4, 0.70);
    senke(w, 'werk', wann, 0.42, d - 0.4, 0.70);
    return true;
  }

  /* Eine einzelne Probe in einen Graphen setzen. Gibt zurueck, ob etwas kam. */
  function setzeProbe(w, name, opt, epoche, wann) {
    var ctx = w.ctx;
    var e = eintrag(name);
    var v = (e.laut === undefined ? 0.8 : e.laut) * (opt && opt.laut !== undefined ? opt.laut / 0.8 : 1);
    v = Math.max(0.05, Math.min(1.6, v));
    var datei = dateiVon(e, epoche);
    var buf = datei ? fertig(ctx, datei) : null;
    var ziel = w.bus.werk;
    if (e.zeichen && w.bus.zeichen) ziel = w.bus.zeichen;
    else if (e.fern && w.bus.fern) ziel = w.bus.fern;
    if (e.versatz) wann += e.versatz;
    var tief = e.duck === undefined ? 0.45 : e.duck;

    if (e.nachbar) B.wage('ton.nachbar', function () { nachbarhof(w, epoche, wann); });

    if (buf) {
      var q = ctx.createBufferSource();
      q.buffer = buf;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, wann);
      g.gain.linearRampToValueAtTime(v, wann + 0.02);
      var laeuftWeiter = !!(e.schleife || (opt && opt.art === 'schleife'));
      var d = buf.duration;
      /* EIN VORGANG IST EIN EREIGNIS UND KEIN TEPPICH.
         Die Proben sind fuenf bis acht Sekunden lang, und im Spiel faellt alle
         halbe Sekunde ein Klick. Bis Welle 4 lief also jede Probe voll aus,
         und damit lagen an jeder Stelle ein Dutzend Klaenge uebereinander —
         gemessen an der Stelle, an der es weh tat: neun Zehntelsekunden nach
         dem letzten Klick stand im Hof von 1350 noch ein Pegel von 0,25, das
         Achtfache des Bettes, und der Michaelitag konnte darueber nicht mehr
         hinaus. Wer schneidet, hoert mehr. */
      var ab = laeuftWeiter ? 0 : (EINSATZ[datei] || 0);
      var kappe = (typeof e.laenge === 'function') ? e.laenge(epoche) : e.laenge;
      if (!kappe) kappe = e.zeichen ? 3.4 : 2.6;
      d = Math.max(0.3, d - ab);
      if (!laeuftWeiter && d > kappe) d = kappe;
      if (laeuftWeiter) {
        q.loop = true;
        w.schleifen[name] = { quelle: q, gain: g };
      } else {
        g.gain.setValueAtTime(v, wann + Math.max(0.05, d - 0.25));
        g.gain.linearRampToValueAtTime(0.0001, wann + d);
      }
      q.connect(g); g.connect(ziel);
      /* start() MUSS vor stop() stehen. Andersherum wirft Chrome, der Wurf
         landet in B.lage, und spiele() gibt faelschlich false zurueck —
         genau das hat der erste Lauf im lebenden Spiel gezeigt. */
      if (ab) q.start(wann, ab); else q.start(wann);
      if (!laeuftWeiter) q.stop(wann + d + 0.05);
      if (e.zeichen) zaesur(w, wann, tief, e.halt || 0);
      else if (!e.nachbar) ducke(w, wann, tief, e.halt || 0);
      return true;
    }

    if (datei) ladeStill(ctx, datei);              /* fuer das naechste Mal */

    var notfall = NOTFALL[String(name).split(':')[0]];
    var stueck = ersatz(ctx, ziel,
                        e.ersatz || (notfall && notfall.ersatz) || 'blatt',
                        wann, epoche, v);
    if (stueck && stueck !== true) w.schleifen[name] = { quelle: stueck, gain: null };
    if (e.zeichen) zaesur(w, wann, tief, e.halt || 0);
    else if (!e.nachbar) ducke(w, wann, Math.min(0.75, tief + 0.25), 0);
    return true;
  }

  /* ======================================================================
     5 — DAS LEBENDE WERK
     ====================================================================== */

  var werk = null;                 /* der lebende Graph */
  var bettJetzt = null;            /* welche Epoche gerade liegt */
  var liegend = { bett: null, hof: null };
  var wachAn = false;

  function KontextArt() { return window.AudioContext || window.webkitAudioContext; }

  function starteWerk() {
    if (werk) return werk;
    var A = KontextArt();
    if (!A) return null;
    var ctx;
    try { ctx = new A(); } catch (f) { B.klage('ton.kontext', f); return null; }
    werk = baueWerk(ctx, (B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1);
    werk.meister.gain.value = 0.92 * LAUT;
    return werk;
  }

  function laeuft() {
    return !!(werk && werk.ctx && werk.ctx.state === 'running' && !STUMM);
  }

  /* Der Analyser haengt sich beim ersten Ablesen an und bleibt dann haengen.
     Er hat keinen Ausgang — ein AnalyserNode misst auch ohne. */
  var messwerk = null;
  function messer() {
    if (messwerk && messwerk.werk === werk) return messwerk;
    if (!werk || !werk.ctx) return null;
    var a = werk.ctx.createAnalyser();
    a.fftSize = 2048;
    werk.ausgang.connect(a);
    messwerk = { werk: werk, knoten: a, feld: new Float32Array(a.fftSize),
                 hoechste: 0, lauteste: 0 };
    return messwerk;
  }

  /* Browser geben Ton erst nach einer Handlung frei. Wir warten darauf, statt
     eine Konsolenmeldung zu erzeugen — die zaehlt in schuss.mjs als Fehler. */
  function wecke() {
    if (STUMM) return;
    var w = starteWerk();
    if (!w) return;
    if (w.ctx.state === 'suspended' && w.ctx.resume) {
      w.ctx.resume().then(function () { legeBett(bettWunsch); }, function () { });
    } else {
      legeBett(bettWunsch);
    }
  }

  var bettWunsch = null;

  function legeBett(epoche) {
    if (!epoche || STUMM) return;
    var w = starteWerk();
    if (!w || w.ctx.state !== 'running') { bettWunsch = epoche; return; }
    if (bettJetzt === epoche) return;
    bettJetzt = epoche;

    /* Jede Epoche atmet anders tief — 1970 am tiefsten, weil ihr Band als
       gleichfoermiges Maschinenbrummen aus dem Erzeuger kam. */
    B.wage('ton.atem', function () { setzeAtem(w, epoche); });

    var jetzt = w.ctx.currentTime;
    blendeAus(w, liegend.bett, jetzt);
    blendeAus(w, liegend.hof, jetzt);
    liegend.bett = null; liegend.hof = null;

    [['bett', BETT(epoche)], ['hof', HOF(epoche)]].forEach(function (paar) {
      var bus = paar[0], datei = paar[1];
      puffer(w.ctx, datei).then(function (buf) {
        merke(w.ctx, datei, buf);
        if (bettJetzt !== epoche || !werk) return;
        liegend[bus] = legeSchleife(werk, bus, buf, werk.ctx.currentTime + 0.05, 0, 1.6,
                                    datei, bus === 'bett' ? epoche * 3.7 : epoche * 2.3);
      }, function () { });
    });

    /* Die Proben dieser Epoche im Voraus holen, damit der erste Ruf klingt. */
    vorratDerEpoche(epoche).forEach(function (d) { ladeStill(w.ctx, d); });
  }

  function vorratDerEpoche(epoche) {
    var l = {}, aus = [];
    Object.keys(KATALOG).forEach(function (n) {
      var d = dateiVon(KATALOG[n], epoche);
      if (d && !l[d]) { l[d] = 1; aus.push(d); }
    });
    /* Das Nachbarhof-Zeichen steht in keinem Katalogeintrag und muesste sonst
       auf den ZWEITEN Gegenzug warten — in dreissig Sekunden gibt es aber
       oft nur einen. */
    var n = NACHBAR_DATEI(epoche);
    if (n && !l[n]) aus.push(n);
    return aus;
  }

  /* ======================================================================
     6 — DER MITSCHNITT
     Er laeuft IMMER mit, auch stumm. Er ist die Grundlage der Tonlatte:
     wer das Spiel bedient und danach wav(30) ruft, bekommt genau das,
     was geschehen ist — nicht das, was der Bauer sich gedacht hat.
     ====================================================================== */

  var mitschnitt = [];
  var mitAnfang = jetztSek();

  function jetztSek() {
    return (window.performance && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
  }

  /* ======================================================================
     7 — DIE API. Zeichen fuer Zeichen wie im Skelett.
     ====================================================================== */

  var T = {

    protokoll: [],
    proben: {},

    get stumm() { return STUMM; },

    melde: function (name, beschreibung) {
      T.proben[name] = beschreibung || {};
      return name;
    },

    spiele: function (name, opt) {
      opt = opt || {};
      var e = (B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1;
      T.protokoll.push({
        name: String(name),
        art: opt.art || 'geraeusch',
        ort: opt.ort || null,
        laut: opt.laut === undefined ? LAUT : opt.laut,
        epoche: e,
        jahr: (B.welt && B.welt.zeit) ? B.welt.zeit.jahr : null,
        woche: (B.welt && B.welt.zeit) ? B.welt.zeit.woche : null,
        zeit: Date.now()
      });
      if (T.protokoll.length > 300) T.protokoll.splice(0, 100);

      /* Der Mitschnitt haelt fest, WANN es geschah — auch stumm. */
      if (opt.art !== 'halt') {
        mitschnitt.push({ t: jetztSek(), name: String(name), opt: opt, epoche: e });
        if (mitschnitt.length > 600) mitschnitt.splice(0, 200);
      }

      B.sende('ton', { name: name, opt: opt, epoche: e });

      if (opt.art === 'halt') { haltWirklich(name); return false; }
      if (!laeuft()) return false;

      var klang = false;
      B.wage('ton.spiele', function () {
        klang = setzeProbe(werk, String(name), opt, e, werk.ctx.currentTime + 0.02);
      });
      return !!klang;
    },

    schleife: function (name, opt) { return T.spiele(name, Object.assign({ art: 'schleife' }, opt || {})); },

    halt: function (name) { return T.spiele(name || '*', { art: 'halt' }); },

    bett: function (epoche) {
      var r = T.spiele('bett:epoche' + epoche, { art: 'schleife' });
      B.wage('ton.bett', function () { legeBett(epoche); });
      return r;
    },

    setzeStumm: function (an) {
      STUMM = !!an;
      if (werk) B.wage('ton.stumm', function () {
        werk.meister.gain.value = STUMM ? 0 : 0.92 * LAUT;
      });
      if (!STUMM) wecke();
      B.sende('ton-schalter', { stumm: STUMM });
    },

    setzeLaut: function (l) {
      LAUT = B.grenze(l, 0, 1);
      if (werk && !STUMM) werk.meister.gain.value = 0.92 * LAUT;
      B.sende('ton-schalter', { stumm: STUMM });
    },

    /* ------------------------------------------------------------------
       Neu, und nur additiv: nichts davon aendert einen bestehenden Ruf.
       ------------------------------------------------------------------ */

    get laut() { return LAUT; },
    bereit: function () { return laeuft(); },
    wecke: wecke,

    /* ------------------------------------------------------------------
       DER PEGELMESSER — der einzige Beleg, der "es klingt" wirklich stuetzt.

       `bereit()` sagt nur, dass der Browser den Kontext laufen laesst. Das
       ist nicht dasselbe wie Ton: ein Graph, dessen Puffer nie ankommen,
       laeuft genauso. Deshalb haengt hier ein Analyser am WIRKLICHEN
       Ausgang (hinter dem Kompressor), und `pegel()` liest ab, was
       tatsaechlich hinausgeht.

           BRAUHAUS.ton.pegel()
           -> {zustand:'running', rms:0.043, spitze:0.31, hoechste:0.62, ...}

       `hoechste` ist der hoechste je gemessene Ausschlag seit dem Laden —
       damit ein Pruefer nicht im richtigen Millisekundenfenster abfragen
       muss, um einen kurzen Schlag zu erwischen.
       ------------------------------------------------------------------ */
    pegel: function () {
      var aus = { zustand: werk && werk.ctx ? werk.ctx.state : 'kein-werk',
                  stumm: STUMM, laut: LAUT, rms: 0, spitze: 0, hoechste: 0 };
      B.wage('ton.pegel', function () {
        var m = messer();
        if (!m) return;
        m.knoten.getFloatTimeDomainData(m.feld);
        var s = 0, h = 0, i, v, a;
        for (i = 0; i < m.feld.length; i++) {
          v = m.feld[i]; s += v * v; a = v < 0 ? -v : v; if (a > h) h = a;
        }
        aus.rms = Math.sqrt(s / m.feld.length);
        aus.spitze = h;
        if (h > m.hoechste) m.hoechste = h;
        if (aus.rms > m.lauteste) m.lauteste = aus.rms;
        aus.hoechste = m.hoechste;
        aus.lauteste = m.lauteste;
      });
      return aus;
    },

    /* Der lebende Ausgangsknoten — damit ein Pruefstand von aussen einen
       MediaStreamDestination anhaengen und wirklich MITSCHNEIDEN kann,
       statt dem Offline-Renderer zu glauben. */
    ausgang: function () { return werk ? werk.ausgang : null; },

    /* Welche Namen im Notfallkasten gelandet sind, und wie oft. Eine leere
       Rueckgabe heisst: jeder Ruf des Spiels hat einen eigenen Klang. */
    geraten: function () { return Object.assign({}, GERATEN); },

    mitschnitt: function () { return mitschnitt.slice(); },
    beginneMitschnitt: function () { mitschnitt.length = 0; mitAnfang = jetztSek(); return true; },
    katalog: function () { return Object.keys(KATALOG).slice(); },

    /* Was in den letzten sek Sekunden geschah, als Plan fuer den Renderer. */
    plan: function (sek, epoche) {
      var jetzt = jetztSek();
      var ab = jetzt - sek;
      var l = [];
      mitschnitt.forEach(function (m) {
        if (m.t < ab) return;
        if (epoche && m.epoche !== epoche) return;
        if (/^bett:epoche/.test(m.name)) return;      /* das Bett legt der Renderer */
        l.push({ t: Math.max(0, m.t - ab), name: m.name, opt: m.opt });
      });
      return l;
    },

    /* ------------------------------------------------------------------
       DER WEG ZUR DATEI — ohne ffmpeg, ohne Mikrofon.
       Das Spiel rendert seinen eigenen Graphen und reicht WAV heraus.
       ------------------------------------------------------------------ */
    rendere: function (opt) {
      opt = opt || {};
      var sek = opt.sekunden || 30;
      var rate = opt.rate || 32000;
      var kanaele = opt.kanaele || 1;
      var epoche = opt.epoche || ((B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1);
      var plan = opt.plan || T.plan(sek, epoche);

      var O = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!O) return Promise.reject(new Error('kein OfflineAudioContext'));
      var octx = new O(kanaele, Math.ceil(sek * rate), rate);

      /* Alles, was der Plan braucht, muss VOR dem Rendern entschluesselt sein. */
      var noetig = {};
      noetig[BETT(epoche)] = 1;
      noetig[HOF(epoche)] = 1;
      plan.forEach(function (p) {
        var d = dateiVon(eintrag(p.name), epoche);
        if (d) noetig[d] = 1;
      });

      return Promise.all(Object.keys(noetig).map(function (d) {
        return puffer(octx, d).then(function (b) { merke(octx, d, b); }, function () { });
      })).then(function () {
        var w = baueWerk(octx, epoche);
        w.meister.gain.value = 0.92;

        /* Nicht immer bei 0 anfangen: sonst hoert das Ohr viermal denselben
           Musikanfang. Der Versatz haengt an der Epoche, bleibt also gleich. */
        var bettBuf = fertig(octx, BETT(epoche));
        var hofBuf = fertig(octx, HOF(epoche));
        if (bettBuf) legeSchleife(w, 'bett', bettBuf, 0, sek, 0.8, BETT(epoche),
                                  opt.versatz === undefined ? epoche * 3.7 : opt.versatz);
        if (hofBuf) legeSchleife(w, 'hof', hofBuf, 0, sek, 0.6, HOF(epoche),
                                 opt.versatz === undefined ? epoche * 2.3 : opt.versatz);

        plan.forEach(function (p) {
          if (p.t < 0 || p.t > sek - 0.2) return;
          B.wage('ton.rendere.probe', function () {
            setzeProbe(w, p.name, p.opt || {}, epoche, p.t);
          });
        });

        return octx.startRendering();
      }).then(function (buf) {
        return { wav: wavAus(buf, opt.spitze === undefined ? 0.89 : opt.spitze),
                 sekunden: sek, rate: rate, epoche: epoche, ereignisse: plan.length };
      });
    },

    /* Base64 eines WAV — das, was Playwright abholt. */
    wav: function (sek, opt) {
      opt = Object.assign({}, opt || {});
      if (sek) opt.sekunden = sek;
      return T.rendere(opt).then(function (r) { return base64(r.wav); });
    }
  };

  /* ======================================================================
     8 — WAV SCHREIBEN (kein ffmpeg noetig, es ist nur ein Kopf und PCM)
     ====================================================================== */

  function wavAus(buf, spitze) {
    var kn = buf.numberOfChannels, n = buf.length, rate = buf.sampleRate;
    var spuren = [];
    var hoch = 0, i, k;
    for (k = 0; k < kn; k++) {
      var d = buf.getChannelData(k);
      spuren.push(d);
      for (i = 0; i < n; i++) { var a = d[i] < 0 ? -d[i] : d[i]; if (a > hoch) hoch = a; }
    }
    var faktor = (spitze && hoch > 0.0001) ? Math.min(8, spitze / hoch) : 1;

    var bytes = 44 + n * kn * 2;
    var ab = new ArrayBuffer(bytes), s = new DataView(ab);
    function wort(pos, t) { for (var j = 0; j < t.length; j++) s.setUint8(pos + j, t.charCodeAt(j)); }
    wort(0, 'RIFF'); s.setUint32(4, bytes - 8, true); wort(8, 'WAVE');
    wort(12, 'fmt '); s.setUint32(16, 16, true); s.setUint16(20, 1, true);
    s.setUint16(22, kn, true); s.setUint32(24, rate, true);
    s.setUint32(28, rate * kn * 2, true); s.setUint16(32, kn * 2, true); s.setUint16(34, 16, true);
    wort(36, 'data'); s.setUint32(40, n * kn * 2, true);

    var p = 44;
    for (i = 0; i < n; i++) {
      for (k = 0; k < kn; k++) {
        var v = spuren[k][i] * faktor;
        v = v < -1 ? -1 : (v > 1 ? 1 : v);
        s.setInt16(p, v < 0 ? v * 0x8000 : v * 0x7fff, true);
        p += 2;
      }
    }
    return new Uint8Array(ab);
  }

  function base64(u8) {
    var teil = 0x8000, aus = '';
    for (var i = 0; i < u8.length; i += teil) {
      aus += String.fromCharCode.apply(null, u8.subarray(i, i + teil));
    }
    return btoa(aus);
  }

  /* ======================================================================
     9 — HALT
     ====================================================================== */

  function haltWirklich(name) {
    if (!werk) return;
    B.wage('ton.halt', function () {
      var jetzt = werk.ctx.currentTime;
      Object.keys(werk.schleifen).forEach(function (n) {
        if (name !== '*' && n !== name) return;
        var s = werk.schleifen[n];
        try {
          if (s.gain) {
            s.gain.gain.cancelScheduledValues(jetzt);
            s.gain.gain.setValueAtTime(s.gain.gain.value, jetzt);
            s.gain.gain.linearRampToValueAtTime(0.0001, jetzt + 0.4);
            s.quelle.stop(jetzt + 0.5);
          } else { s.quelle.stop(jetzt + 0.05); }
        } catch (f) { }
        delete werk.schleifen[n];
      });
    });
  }

  /* ======================================================================
     10 — ANSCHLUSS
     ====================================================================== */

  B.ton = T;

  if (B.arg && B.arg.stumm) T.setzeStumm(true);
  if (B.arg && B.arg.roh && B.arg.roh.laut) T.setzeLaut(parseFloat(B.arg.roh.laut));

  /* Die erste Handlung des Spielers gibt den Ton frei. Kein Klick geht dabei
     verloren — wir horchen nur mit. */
  function ersteHandlung() {
    if (wachAn) return;
    wachAn = true;
    ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(function (a) {
      document.removeEventListener(a, ersteHandlung, true);
    });
    B.wage('ton.wecken', wecke);
  }
  if (!(B.arg && B.arg.stumm)) {
    ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(function (a) {
      document.addEventListener(a, ersteHandlung, true);
    });
  }

  /* Das Stueck DER KLANG: der sichtbare Schalter und die Ohrprobe-Hilfen.
     index.html ist eingefroren und haengt sie nicht ein — also haengt der
     Tonbus sie selbst ein. Faellt das aus, klingt das Spiel trotzdem. */
  B.wage('ton.stueck-einhaengen', function () {
    if (!document.head) return;
    var s = document.createElement('link');
    s.rel = 'stylesheet'; s.href = 'stil/klang.css';
    document.head.appendChild(s);
    var j = document.createElement('script');
    j.src = 'stuecke/klang.js'; j.async = false;
    document.head.appendChild(j);
  });

})(BRAUHAUS);
