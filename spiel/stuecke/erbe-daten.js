/* ===========================================================================
   stuecke/erbe-daten.js — DAS ERBE, die Worte und die Zahlen.

   Der Befund, aus dem dieses Stueck entstanden ist, steht in einem Satz:
   Die Uhr ruft welt.erbe() erst, wenn die Amtszeit ablaeuft — und die
   Amtszeit laeuft 21 bis 37 Jahre, waehrend die Partie nach gut drei
   Braujahren endet (gemessen 103/103/101/99 Wochen, saat=1350). Vier
   Stuecke haben einen erbfall-Handler gebaut, DER PREIS stellt sogar den
   Handlohn beim Erbfall in Rechnung. In keiner gemessenen Partie ist auch
   nur einer davon je gelaufen.

   DAS ERBE holt den Erbfall in die erreichbare Zeit und macht ihn zu einer
   Entscheidung: WAS AM HAUS HAFTET, GEHT UEBER. WAS AN DER PERSON HAFTET,
   FAELLT MIT IHR.

   Das ist keine Erfindung, sondern der Unterschied zwischen einem
   dinglichen und einem persoenlichen Recht — im Brauwesen der Gegensatz
   zwischen der auf das Anwesen geschriebenen (radizierten) und der auf die
   Person verliehenen Gerechtigkeit. Gevatterschaft, Heirat, Amtsgewalt und
   der gute Ruf sterben mit dem Menschen; Brief, Pfand und Vertrag bleiben
   am Haus stehen.
   =========================================================================== */

(function (B) {
  'use strict';

  var D = {};

  /* ----------------------------------------------------------------------
     WAS AM HAUS HAFTET.  Geprueft gegen `bindung.womit` — die Woerter, die
     kern/welt.js, DER GEGNER, DER PREIS, DIE FUHRE und DER NAME wirklich
     schreiben. Alles, was hier nicht trifft, haftet an der Person.

     am Haus:  Vertrag · Pachtvertrag · Bierlieferungsvertrag · Depotvertrag ·
               Exklusivvertrag · Zunftbrief · Erbbrief · Pfand · Hypothek ·
               Konzession des Rats · Bannrecht · Jahresvereinbarung · Listung
     an der Person: Gewohnheit · Anfrage · Probe · Lieferung · Der Ruf des
               Hauses · Der bessere Name · Gevatterschaft · Heirat ·
               Ratsspruch · Amtsgewalt

     RUNDE 3, NACHGEMESSEN UND KORRIGIERT.  Die Liste war zu kurz — und das
     traf ausgerechnet die eigenen Zuege dieses Stuecks. Der streitbaren Hand
     gelingt das Anfechten, sie zahlt dafuer, `welt.binde` setzt die Adresse
     auf das Haus um — mit 'Ratsspruch fuer das Haus' (1350), 'Urteil des
     Stadtgerichts' (1600), 'Urteil des Landgerichts' (1884), 'Vergleich vor
     dem Landgericht' (1970). KEINES dieser vier Woerter traf den Ausdruck.
     Am Bildschirm gemessen: die teuer gewonnene Adresse stand danach unter
     AN DER PERSON und fiel beim naechsten Erbfall wieder weg. Dasselbe waere
     dem neuen Widerspruch passiert (gemessen: nach dem Klick stand 'am Haus'
     weiter auf 0). Die Woerter der Gerichte stehen jetzt drin. 'Ratsspruch
     fuer das Haus' heisst dazu 'Ratsurteil fuer das Haus' — der GEGNER nimmt
     Adressen mit einem blanken 'Ratsspruch', und zwei Sachen mit demselben
     Wort auseinanderzuhalten ist Sache des Wortes, nicht des Ausdrucks.
     ---------------------------------------------------------------------- */
  D.AM_HAUS = /vertrag|brief|pfand|hypothek|konzession|bannrecht|vereinbarung|listung|pacht|exklusiv|verschreib|kontrakt|eintrag|zunft|widerspruch|urteil|vergleich|vormerkung|verfügung|siegel/i;

  /* ----------------------------------------------------------------------
     DIE EIGENSCHAFT DER AMTSZEIT — der Hebel.
     welt.zeit.amtszeit.eigenschaft steht seit dem Skelett im Weltzustand und
     wurde bis hierher nur abgedruckt. Sie setzt jetzt den Preis der Feder
     und entscheidet, welchen fuenften Zug diese Hand ueberhaupt kennt.
     ---------------------------------------------------------------------- */
  D.EIGENSCHAFTEN = {
    sparsam:   { faktor: 0.70, zug: null,
                 wirkt: 'Schreibgeld um ein Drittel billiger — sie feilscht mit dem Schreiber.' },
    wagemutig: { faktor: 1.00, zug: 'borg',
                 wirkt: 'Schreibt auf Borg. Am Michaeli das Doppelte.' },
    fromm:     { faktor: 0.90, zug: 'seelgeraet',
                 wirkt: 'Ein Seelgerät bindet die geistlichen Häuser ans Haus.' },
    streitbar: { faktor: 1.15, zug: 'anfechten',
                 wirkt: 'Ficht die Bindung des Gegners an, wo sie nur an einer Person hängt.' },
    gelehrt:   { faktor: 0.85, zug: 'zahlen',
                 wirkt: 'Kennt den Jahreswert jeder Bindung und nennt ihn.' },
    bequem:    { faktor: 1.30, zug: null,
                 wirkt: 'Lässt schreiben, wer gerade da ist. Alles kostet ein Viertel mehr.' }
  };

  /* ----------------------------------------------------------------------
     DIE VIER EPOCHEN.  Derselbe Vorgang, vier verschiedene Verben — das ist
     der Unterschied zwischen einer Epoche und einem Kostuem.

       1350  VERSCHREIBEN   vor dem Rat ins Stadtbuch
       1600  VERBRIEFEN     im Briefbuch der Stadt, mit Siegel
       1884  EINTRAGEN      ins Hypothekenbuch (Bayern hat es seit 1822;
                            das einheitliche Grundbuch kommt erst 1900 —
                            darum steht hier nicht "Grundbuch")
       1970  FESTSCHREIBEN  notariell, mit Erbschaftsteuer

     satz: was ein Fass Jahresbedarf kostet, wenn man die Bindung aufs Haus
     schreiben laesst. Geeicht an der Startkasse (112 / 640 / 14.250 / 86.000):
     das teuerste Haus kostet rund ein Viertel der Kasse, das billigste ein
     Zehntel. Man kann drei bis vier von zehn sichern, nicht alle.
     ---------------------------------------------------------------------- */
  D.EPOCHEN = {

    1: {
      wort: 'DAS ERBE',
      verb: 'Verschreiben',
      wo: 'vor dem Rat ins Stadtbuch',
      womit: 'Verschreibung im Stadtbuch',
      satz: 0.9,
      ausDemLager: 'aus dem Keller',
      jahre: 12,
      erklaerung: 'Was im Stadtbuch steht, haftet am Haus. Was auf Treu und '
        + 'Glauben geht, stirbt mit der Hand, die es gab.',
      formen: {
        leibgeding: { name: 'Das Leibgeding', kurz: 'LEIBGEDING',
          satz: 'Sie behält Kost, Kammer und ein festes Jahrgeld im Haus. '
              + 'Solange es gezahlt wird, halten ihre Leute dem Haus die Treue.' },
        abfindung: { name: 'Die Abfertigung', kurz: 'ABFERTIGUNG',
          satz: 'Einmal ausgezahlt und aus dem Haus. Ihre Leute bleiben bis '
              + 'zum nächsten Michaeli, dann sind sie frei.' },
        bruch: { name: 'Mit leeren Händen', kurz: 'LEER',
          satz: 'Nichts gegeben, nichts versprochen. Was nur an ihr hing, '
              + 'ist am selben Tag fort.' }
      },
      stunde: 'Die Stunde kommt ohne Ansage. {alt} legt die Kelle hin, und '
            + 'was nur auf ihr Wort hin ging, geht nicht mehr.',
      seelgeraet: { name: 'Ein Seelgerät stiften', satz: 'Eine Jahrtagsmesse für das Haus.' },
      anfechten: { name: 'Vor dem Rat anfechten', womit: 'Ratsurteil für das Haus' },
      /* Was geschieht, wenn das Bezahlte doch verlorengeht — Auflage 1. */
      erloschen: 'ERLOSCHEN — bezahlt, im Stadtbuch, und doch verloren',
      widerspruch: { name: 'Widerspruch aus dem Stadtbuch',
        womit: 'Widerspruch im Stadtbuch',
        satz: 'Der ältere Eintrag im Stadtbuch wird dem Rat vorgelegt. '
            + 'Was für die Verschreibung schon gezahlt ist, wird angerechnet.' }
    },

    2: {
      wort: 'DAS ERBE',
      verb: 'Verbriefen',
      wo: 'im Briefbuch der Stadt, unter Siegel',
      womit: 'Erbbrief unter Stadtsiegel',
      satz: 3.0,
      ausDemLager: 'aus dem Gewölbe',
      jahre: 14,
      erklaerung: 'Ein Brief mit Siegel hängt am Anwesen und wandert mit ihm. '
        + 'Eine Gevatterschaft hängt an einem Menschen.',
      formen: {
        leibgeding: { name: 'Das Ausgedinge', kurz: 'AUSGEDINGE',
          satz: 'Die Stube hinten hinaus, Brot, Bier und ein Jahrgeld. '
              + 'Sie bleibt im Haus, und ihre Leute bleiben mit ihr.' },
        abfindung: { name: 'Die Abfindung', kurz: 'ABFINDUNG',
          satz: 'Eine Summe gegen Quittung, dann ist geteilt. Ihre Leute '
              + 'halten noch ein Jahr, länger nicht.' },
        bruch: { name: 'Ohne Vergleich', kurz: 'OHNE',
          satz: 'Kein Brief, kein Geld, kein Wort. Was ungeschrieben war, '
              + 'ist mit ihr aus dem Haus.' }
      },
      stunde: '{alt} wird zu Grabe getragen, und mit ihr jedes Wort, das nie '
            + 'ins Briefbuch kam.',
      seelgeraet: { name: 'Eine Stiftung ans Kloster', satz: 'Ein Jahrtag, in Stein.' },
      anfechten: { name: 'Vor dem Stadtgericht anfechten', womit: 'Urteil des Stadtgerichts' },
      erloschen: 'GEBROCHEN — versiegelt, verbrieft und doch dahin',
      widerspruch: { name: 'Widerspruch aus dem Briefbuch',
        womit: 'Widerspruch unter Stadtsiegel',
        satz: 'Der Brief liegt im Briefbuch, das Siegel ist unversehrt. '
            + 'Was für den Brief schon gezahlt ist, wird angerechnet.' }
    },

    3: {
      wort: 'DAS ERBE',
      verb: 'Eintragen',
      wo: 'ins Hypothekenbuch',
      womit: 'Eintrag im Hypothekenbuch',
      satz: 40,
      ausDemLager: 'aus dem Eiskeller',
      jahre: 15,
      erklaerung: 'Was im Hypothekenbuch steht, geht mit dem Anwesen über. '
        + 'Was am Namen des Wirts hängt, geht mit dem Wirt.',
      formen: {
        leibgeding: { name: 'Die Leibrente', kurz: 'LEIBRENTE',
          satz: 'Eine feste Rente auf Lebenszeit, jährlich fällig. '
              + 'Sie bleibt Teilhaberin, und ihre Kundschaft bleibt es auch.' },
        abfindung: { name: 'Die Abfindung', kurz: 'ABFINDUNG',
          satz: 'Der Anteil wird ausgezahlt, die Firma bleibt ungeteilt. '
              + 'Ihre Kundschaft trägt noch ein Geschäftsjahr.' },
        bruch: { name: 'Ohne Abfindung', kurz: 'OHNE',
          satz: 'Sie scheidet aus, ohne dass etwas fließt. Was auf ihren '
              + 'Namen lief, läuft ab sofort nicht mehr.' }
      },
      stunde: '{alt} scheidet aus der Firma, und was auf ihren Namen lief, '
            + 'steht in keinem Buch.',
      seelgeraet: { name: 'Eine Stiftung für die Pfarrei', satz: 'Der Name auf einer Tafel.' },
      anfechten: { name: 'Vor dem Landgericht anfechten', womit: 'Urteil des Landgerichts' },
      erloschen: 'GELÖSCHT — im Hypothekenbuch rot durchgestrichen',
      widerspruch: { name: 'Widerspruch aus dem Hypothekenbuch',
        womit: 'Vormerkung im Hypothekenbuch',
        satz: 'Der ältere Rang im Hypothekenbuch wird geltend gemacht. '
            + 'Die schon gezahlte Eintragungsgebühr wird angerechnet.' }
    },

    4: {
      wort: 'DAS ERBE',
      verb: 'Festschreiben',
      wo: 'notariell, im Liefervertrag',
      womit: 'Bierlieferungsvertrag, notariell',
      satz: 130,
      ausDemLager: 'aus den Tanks',
      jahre: 10,
      erklaerung: 'Ein Vertrag mit Laufzeit überdauert den Geschäftsführer. '
        + 'Eine gute Beziehung überdauert ihn nicht.',
      formen: {
        leibgeding: { name: 'Die Versorgungszusage', kurz: 'VERSORGUNG',
          satz: 'Eine Pensionszusage, jährlich zu bedienen. Sie bleibt im '
              + 'Beirat, und ihre Verbindungen bleiben mit ihr.' },
        abfindung: { name: 'Die Abfindung', kurz: 'ABFINDUNG',
          satz: 'Einmalig ausgezahlt, versteuert, erledigt. Ihre '
              + 'Verbindungen tragen noch ein Geschäftsjahr.' },
        bruch: { name: 'Ohne Abfindung', kurz: 'OHNE',
          satz: 'Übergabe ohne Gegenleistung. Was an ihrer Person hing, '
              + 'ist mit der Unterschrift weg.' }
      },
      stunde: '{alt} übergibt und geht, ohne dass jemand etwas vereinbart '
            + 'hätte. Was ihr gehörte, gehörte nie dem Haus.',
      seelgeraet: { name: 'Eine Stiftung der Firma', satz: 'Ein Name über einem Saal.' },
      anfechten: { name: 'Den Vertrag anfechten', womit: 'Vergleich vor dem Landgericht' },
      erloschen: 'GEKÜNDIGT — Vertrag bezahlt, Laufzeit vorzeitig beendet',
      widerspruch: { name: 'Auf den Liefervertrag klagen',
        womit: 'Einstweilige Verfügung, Liefervertrag',
        satz: 'Der ältere Liefervertrag wird durchgesetzt. '
            + 'Was für ihn schon gezahlt ist, wird angerechnet.' }
    }
  };

  /* DIE ERBMASSE, gegen die beide Wege gerechnet werden: was an der Person
     haengt, plus der Erbteil, den die Miterben sonst aus dem Keller nehmen.
     Nicht die Bindungen allein — die sind in der gemessenen Partie am Tag der
     Stunde oft schon von selbst ausgelaufen, und dann stuende auf beiden
     Knoepfen "0", was eine Behauptung waere und keine Entscheidung.
     Ein Ausgedinge wurde immer gegen den Uebergabewert gerechnet, nicht gegen
     die Kundschaft, und in Naturalien bezahlt. */
  D.KELLER_JE_FASS = 1.5;        /* Vielfaches von satz — was ein Fass im Keller wiegt */
  D.ERBTEIL_NENNER = 3;          /* ein Drittel des Kellers nehmen die Miterben */

  /* Von Hand zu Hand sind weniger Miterben da, die etwas fordern koennten.
     Die zweite Uebergabe nimmt ein Viertel, die dritte ein Fuenftel. */
  D.ERBTEIL_NENNER_JE_HAND = [3, 4, 5, 6];

  /* Was am Haus haftet, GEHT UEBER — aber die Miterben haben trotzdem einen
     Anteil an seinem Wert, und der wird ausbezahlt. Genau so stand es in den
     Uebergabevertraegen: der Uebernehmer erhaelt das Anwesen, die Geschwister
     ihren Erbteil in Geld. Ohne diesen Posten waere die Uebergabe einer Hand,
     die alles verschrieben hat, umsonst — und dann waere sie keine
     Entscheidung mehr, sondern ein Freifahrschein. */
  D.HAUS_ANTEIL = 0.20;
  /* Ein Rest, den es immer gibt: die Barschaft in der Lade. Sorgt dafuer, dass
     auch ein leergeraeumtes Haus noch ein Preisschild traegt statt einer Null,
     die nichts mehr unterscheidet. */
  D.KASSE_ANTEIL = 0.03;

  /* Wer frueh uebergibt, kauft teuer ein: die Abfindung faellt Woche fuer
     Woche, weil die alte Hand weniger Jahre vor sich hat. Das Leibgeding
     bleibt gleich hoch und wird darum umso teurer, je frueher man es
     verspricht — genau der Handel, den ein Ausgedinge wirklich ist. */
  D.ABFINDUNG_ANFANG = 1.0;      /* Anteil der Erbmasse am Anfang der Amtszeit */
  D.ABFINDUNG_BODEN = 0.45;      /* und am Tag vor der Stunde */
  /* Nicht mehr "je verstrichener Woche" mit festem Zerfall: das war an eine
     Amtszeit von 15 Wochen geeicht und stand bei einer von sechzig nach
     Woche 19 nur noch auf dem Boden. Der Preis faellt jetzt im Verhaeltnis
     zur RESTLICHEN Amtszeit — je naeher die Stunde, desto weniger Jahre hat
     die alte Hand noch vor sich, desto billiger ist sie abzufinden. Das gilt
     fuer jede Laenge und faellt in jeder Woche sichtbar weiter. */
  D.LEIBGEDING_ANTEIL = 0.20;    /* je Michaeli, auf die Erbmasse */

  /* WANN DIE STUNDE VON SELBST KOMMT.  Zweimal verschoben, beide Male, weil
     die Messung es verlangt hat — nicht der Geschmack.

     Erster Anlauf, Michaeli des dritten Braujahres (Klick 60). Am Bildschirm
     gemessen stand die Tafel dann auf "Am Haus 0 · An der Person 0 ·
     Keller 0": der Jahresabschluss raeumt aus, bevor dieses Stueck an die
     Reihe kommt. Der Erbfall traf eine leere Stube.

     Zweiter Anlauf, Woche 16 des zweiten Braujahres (Klick 45). Der Keller
     stimmte jetzt (27 -> 18 Fass), aber "An der Person" stand schon auf 0:
     die Gewohnheiten aus welt.aufbau tragen `bis = jahr + 1..4`, und
     rechneJahrAb loescht sie am ersten oder zweiten Michaelitag von selbst.
     Gemessen, Epoche 4, gespielt: Klick 10 -> 2 persoenliche Bindungen,
     Klick 20 -> 1, Klick 30 -> 0.

     Also Woche 16 des ERSTEN Braujahres, Klick 15. Dort leben die
     Gewohnheiten noch; danach bleiben rund 85 Wochen und drei Michaelitage,
     an denen ein Leibgeding wirklich faellig wird. Die Hand am Haus ist alt,
     und die Tafel sagt das von der ersten Woche an. */
  D.STUNDE_NACH_JAHREN = 0;
  D.STUNDE_WOCHE = 16;

  /* RUNDE 3, AUFLAGE 3.  Der Kritiker hat zwei Dinge nachgezaehlt, und beide
     stimmten:

       "sie steht in 16 von 16 Stichproben unverrueckbar auf 'noch 15 Wochen'"
       "in E4 sind 108 von 113 Wochen leer"

     Beides hat dieselbe Wurzel: es gab GENAU EINE Stunde, sie lag immer in
     derselben Woche, und danach hatte die II. Hand nichts mehr zu entscheiden.
     Die Amtszeit der II. Hand laeuft bis 1378/1626/1914/2006 — immer hinter
     dem Ende der Partie. Ein zweiter Erbfall war unerreichbar.

     Zwei Zahlen dagegen:

     (1) DIE WOCHE STREUT.  Nicht ueber den Wuerfel — jeder Zug daraus
         verschoebe die Partie aller sechs anderen Stuecke und machte die
         Zaehlungen des Kritikers unwiederholbar. Statt dessen aus einer Zahl,
         die der gesaete Wuerfel ohnehin schon gezogen hat: dem Ende der
         Amtszeit (`amtszeit.bis`, jahr + ganz(21,37)). Gemessen ergibt das
         E1 12/13/13, E2 17/18/18, E3 14/15/15, E4 16/17/17 (Saaten
         1350 / 7 / 99) — verschieden je Epoche UND je Saat, und kein Zug
         weniger fuer die anderen.

     (2) DIE STUNDE KEHRT WIEDER.  Nach jedem Erbfall wird die naechste
         gestellt, ein Braujahr spaeter, wieder in einer gezogenen Woche. Damit
         traegt die Leiste ihre vier Knoepfe bis zum letzten Klick, die II. und
         die III. Hand entscheiden dieselbe Frage neu — und der zweite Erbfall,
         den es nie gab, faellt in einer Partie von rund 100 Wochen zweimal. */
  D.STUNDE_ABSTAND = 2;          /* Braujahre zwischen zwei Stunden.
     Mit 1 gemessen: E1 vier Erbfaelle in 103 Wochen, Haende I bis V. Das ist
     eine Seuche und keine Hausgeschichte. Mit 2 haelt eine Hand rund sechzig
     gespielte Wochen; in einer Partie von hundert wechselt das Haus zweimal,
     und die Leiste zaehlt trotzdem in jeder Woche ihre vier Knoepfe, weil die
     Uebergabe die ganze Amtszeit ueber offensteht. */
  D.STUNDE_WOCHE_VON = 12;
  D.STUNDE_WOCHE_BIS = 18;

  /* RUNDE 3, AUFLAGE 2, ZWEITE HAELFTE.  "Bei Namens- UND Eigenschaftsgleich-
     heit ist auch die Feder unveraendert (0,70x) — dann gibt es die 'andere
     Hand' nicht."  Der Vorname gehoert welt.neueAmtszeit und damit dem Kern
     (die Bitte steht im Bericht). Die Feder gehoert diesem Stueck, und sie
     wechselt ab jetzt in JEDEM Fall: eine Hand, die eben erst angetreten ist,
     ist dem Schreiber unbekannt und zahlt ein Antrittsgeld, bis sie ihr erstes
     Michaeli hinter sich hat. Derselbe Knopf, dieselbe Adresse, anderer Preis
     — nachmessbar an der Zeile 'Feder n,nn x' auf der Leiste. */
  D.ANTRITT_AUFSCHLAG = 0.25;
  D.ANTRITT_JAHRE = 1;

  /* RUNDE 3, AUFLAGE 5.  "Es zieht 37 bis 56 Prozent der Startbarschaft in den
     ersten 15 Wochen."  Nachgemessen ueber drei Saaten war die Spanne noch
     weiter: 17,9 % (E3/Saat 99) bis 78,1 % (E4/Saat 7) — die Forderung des
     Stuecks haengt daran, welche vier Adressen der Wuerfel dem Haus zuteilt,
     und das schwankt um den Faktor vier.

     Also wird das Stueck an der Startbarschaft geeicht, einmal, im aufbau:
     kosten alle offenen Verschreibungen zusammen mehr als ZIEL_ANTEIL der
     Kasse, werden ALLE Preise dieses Stuecks im selben Verhaeltnis herunter-
     gesetzt. Nach unten wird nie korrigiert — eine billige Saat bleibt billig.
     Damit ist der Deckel gemessen und nicht geraten. */
  D.ZIEL_ANTEIL = 0.38;

  /* Was ein Widerspruch kostet: das Vielfache des Jahreswerts, abzueglich
     dessen, was fuer die erloschene Verschreibung schon bezahlt wurde. */
  D.WIDERSPRUCH_SATZ = 2.0;

  B.erbeDaten = D;

})(BRAUHAUS);
