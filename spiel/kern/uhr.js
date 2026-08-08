/* ===========================================================================
   kern/uhr.js — Taktwerk, Ereignisbus, gesaeter Wuerfel.
   GEHOERT DEM SKELETT-BAUER.

   Das Braujahr laeuft Michaeli (29.9.) bis Georgi (23.4.) — 30 Wochen. Der
   Sommer laeuft ohne Hand durch; er wird in schliesseJahr() abgerechnet und
   in die Chronik geschrieben, nicht geklickt. (Historischer Anker:
   Sommerbrauverbot 1553. Ab der Kaeltemaschine ist das eine Gewohnheit statt
   eines Gesetzes — die Rundenform bleibt, die Begruendung wechselt.)

   Der Wuerfel ist gesaet: dieselbe Saat ergibt dieselbe Partie. Ein Kritiker
   kann seine Zaehlung damit wiederholen (?saat=1350).
   =========================================================================== */

(function (B) {
  'use strict';

  var WOCHEN_IM_JAHR = 30;

  /* ----------------------------------------------------------------------
     Der gesaete Wuerfel (mulberry32). Klein, schnell, reproduzierbar.
     ---------------------------------------------------------------------- */
  function macheWuerfel(saat) {
    var a = (saat >>> 0) || 1350;
    var start = a;

    function zahl() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    return {
      get saat() { return start; },
      setze: function (neu) { start = (neu >>> 0) || 1350; a = start; },
      /* DER ZAEHLERSTAND — neu in Welle 13, fuer den Spielstand.
         mulberry32 hat genau ein Wort Zustand: `a`. Wer eine Partie
         fortsetzt, muss ihn mitnehmen, sonst wuerfelt das Haus ab der
         Wiederaufnahme noch einmal dieselben Zahlen wie am Anfang — der
         Spielstand waere ein Zeitreisegeraet, und die Wiederholbarkeit
         waere kaputt, ohne dass es jemand saehe. Lesen ist harmlos;
         Schreiben tut nur kern/stand.js beim Wiederaufnehmen. */
      get zustand() { return a | 0; },
      set zustand(v) { a = (v | 0); },
      zahl: zahl,
      /* ganze Zahl von..bis, beide einschliesslich */
      ganz: function (von, bis) { return von + Math.floor(zahl() * (bis - von + 1)); },
      /* Element aus einer Liste */
      aus: function (liste) { return liste[Math.floor(zahl() * liste.length)] ; },
      /* trifft mit Wahrscheinlichkeit p (0..1) */
      trifft: function (p) { return zahl() < p; },
      /* +/- streu um mitte */
      um: function (mitte, streu) { return mitte + (zahl() * 2 - 1) * streu; },
      /* mischt eine Kopie der Liste */
      misch: function (liste) {
        var l = liste.slice();
        for (var i = l.length - 1; i > 0; i--) {
          var j = Math.floor(zahl() * (i + 1));
          var t = l[i]; l[i] = l[j]; l[j] = t;
        }
        return l;
      }
    };
  }

  B.macheWuerfel = macheWuerfel;
  B.wuerfel = macheWuerfel(B.arg.saat || 1350);

  /* ----------------------------------------------------------------------
     Ereignisbus.  B.auf('woche', fn) / B.sende('woche', daten)
     Ein Horcher, der wirft, reisst NIE die Seite mit.
     ---------------------------------------------------------------------- */
  var horcher = {};

  B.auf = function (name, fn) {
    if (!horcher[name]) horcher[name] = [];
    horcher[name].push(fn);
    return fn;
  };

  B.ab = function (name, fn) {
    var l = horcher[name];
    if (!l) return;
    var i = l.indexOf(fn);
    if (i >= 0) l.splice(i, 1);
  };

  B.sende = function (name, daten) {
    var l = horcher[name];
    if (!l || !l.length) return;
    for (var i = 0; i < l.length; i++) {
      try { l[i](daten || {}, name); }
      catch (e) { B.klage('horcher:' + name, e); }
    }
  };

  /* ----------------------------------------------------------------------
     Monatsnamen. In Epoche I und II die alten deutschen — das ist der
     billigste und deutlichste Epochenunterschied, den die Kopfleiste hat.
     ---------------------------------------------------------------------- */
  var MONAT_ALT = ['Jänner', 'Hornung', 'Lenzing', 'Ostermond', 'Wonnemond', 'Brachet',
                   'Heuert', 'Ernting', 'Scheiding', 'Gilbhart', 'Nebelung', 'Christmond'];
  var MONAT_NEU = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                   'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  var TAG_JE_WOCHE = 7;

  /* ----------------------------------------------------------------------
     EINE WOCHE, OHNE BILD.  Neu in Welle 13 — herausgeloest aus
     naechsteWoche(), damit springe() dieselbe Woche laufen lassen kann wie
     ein Klick auf WEITER, nur ohne fuer jede einzelne neu zu malen.
     Vorher hat springe() die Wochen einer Reihe UEBERSPRUNGEN statt sie
     laufen zu lassen: kein 'vorwoche', kein 'woche', kein Verfall, kein Zug
     des Gegners. Ein Jahr, das so vergeht, ist kein erzaehltes Jahr — es ist
     ein Jahr, das nicht stattgefunden hat.
     ---------------------------------------------------------------------- */
  function eineWoche(stumm) {
    var z = B.welt.zeit;
    if (z.ende) return false;

    B.sende('vorwoche', { jahr: z.jahr, woche: z.woche });

    /* Was ohne den Spieler geschieht, geschieht hier — vor dem Zaehler. */
    B.welt.verfall();

    if (z.woche >= WOCHEN_IM_JAHR) {
      /* OHNE `stumm` LAEUFT DIESE ZEILE WIE VOR WELLE 13, EINSCHLIESSLICH
         DES ZWEITEN 'zeichne'. Am Jahreswechsel gab es immer zwei Runden —
         eine mit grund 'jahr' aus schliesseJahr(), eine mit grund 'woche'
         von hier. Sie zusammenzulegen waere aufgeraeumter und WAERE EINE
         AENDERUNG AM SPIELVERLAUF: sieben rAF-Stellen des Spiels haengen an
         der Zahl der Zeichenrunden, und die Wiederholbarkeit dieses Laufs
         ist teuer erkauft (Welle 12, vier Tage). Der Sprung ist neu und darf
         deshalb stumm sein; der Klick auf WEITER bleibt, wie er war. */
      B.uhr.schliesseJahr(stumm);
    } else {
      z.woche += 1;
      B.sende('woche', { jahr: z.jahr, woche: z.woche, epoche: z.epoche });
    }
    return true;
  }

  B.uhr = {

    WOCHEN_IM_JAHR: WOCHEN_IM_JAHR,

    auf: function (n, f) { return B.auf(n, f); },
    ab: function (n, f) { return B.ab(n, f); },
    sende: function (n, d) { return B.sende(n, d); },

    /* Kalendertag der laufenden Woche. Michaeli + (woche-1)*7 Tage. */
    datum: function (jahr, woche) {
      var z = B.welt.zeit;
      var j = (jahr === undefined) ? z.jahr : jahr;
      var w = (woche === undefined) ? z.woche : woche;
      var d = new Date(Date.UTC(2000, 8, 29));            /* 29. September */
      d.setUTCDate(d.getUTCDate() + (w - 1) * TAG_JE_WOCHE);
      var uebersJahr = d.getUTCFullYear() > 2000 ? 1 : 0;  /* Jahreswechsel im Braujahr */
      var alt = B.welt.epoche().nr <= 2;
      return {
        tag: d.getUTCDate(),
        monatNr: d.getUTCMonth() + 1,
        monat: (alt ? MONAT_ALT : MONAT_NEU)[d.getUTCMonth()],
        jahr: j + uebersJahr,
        kurz: (alt ? MONAT_ALT : MONAT_NEU)[d.getUTCMonth()].slice(0, 3).toUpperCase() + ' ' + (j + uebersJahr),
        lang: d.getUTCDate() + '. ' + (alt ? MONAT_ALT : MONAT_NEU)[d.getUTCMonth()] + ' ' + (j + uebersJahr)
      };
    },

    /* "1350/51" */
    braujahr: function (jahr) {
      var j = (jahr === undefined) ? B.welt.zeit.jahr : jahr;
      return j + '/' + String((j + 1) % 100).padStart(2, '0');
    },

    /* -------------------------------------------------------------------
       EIN KLICK AUF WEITER.
       Wochen 1..30. Der dreissigste Klick schliesst das Braujahr.
       ------------------------------------------------------------------- */
    naechsteWoche: function () {
      if (!eineWoche(false)) return false;
      B.sende('zeichne', { grund: 'woche' });
      /* DER SPIELSTAND, UND ZWAR HIER. (Welle 13, R1)

         SYNCHRON, in derselben Aufrufkette wie der Klick auf WEITER, ohne
         jede Frist — das ist die Lehre der Welle 12, und sie steht in
         spiel/LIESMICH.md: „Keine Wanduhrfrist im Zeichenweg." Ein
         `setTimeout('gleich noch sichern')` waere genau das Rennen mit der
         messenden Hand, an dem 1350 am 7. August in zwei Partien zerfallen
         ist.

         NACH dem Zeichnen, nicht davor: die Stuecke haben in ihrem
         `woche`-Horcher gerechnet und im Zeichnen noch einmal; was der
         Rundenschluss danach in Mikrotasks nachholt, gehoert zur naechsten
         Sicherung. Ein Stueck, das den Weltzustand erst im Rundenschluss
         aendert, hat ein groesseres Problem als diesen Stand. */
      if (B.stand) B.stand.sichere('woche');
      return true;
    },

    /* -------------------------------------------------------------------
       JAHRESENDE. Georgi. Danach laeuft der Sommer ohne Hand durch.
       ------------------------------------------------------------------- */
    /* `stumm` (Welle 13) heisst nur: DAS BILD KOMMT SPAETER. Alles andere
       laeuft Zeile fuer Zeile wie bisher. Wer schliesseJahr() wie bisher
       ohne Argument ruft, bekommt wie bisher sein 'zeichne'. */
    schliesseJahr: function (stumm) {
      var z = B.welt.zeit;
      var altesJahr = z.jahr;
      var alteEpoche = z.epoche;

      B.sende('jahresende', { jahr: altesJahr, epoche: alteEpoche });

      /* Der Sommer: gebraut wird nicht, gerechnet schon. */
      B.welt.rechneJahrAb();

      z.jahr += 1;
      z.woche = 1;

      var neueEpoche = B.welt.epocheZuJahr(z.jahr);
      if (neueEpoche !== alteEpoche) {
        z.epoche = neueEpoche;
        B.welt.schreibe('Eine neue Zeit: ' + B.welt.epoche().name + '. Es geht ums '
          + B.welt.epoche().verb + '.', 'epoche');
        B.sende('epoche', { epoche: neueEpoche, vorher: alteEpoche });
      }

      /* Erbfall: das Haus bleibt, der Mensch nicht. */
      if (z.jahr >= z.amtszeit.bis) B.welt.erbe();

      if (z.jahr > B.welt.LETZTES_JAHR) {
        z.jahr = B.welt.LETZTES_JAHR;
        z.ende = true;
        B.welt.schreibe('Die Gegenwart ist erreicht. Das Haus steht noch.', 'ende');
        B.sende('ende', { jahr: z.jahr });
      }

      B.sende('jahr', { jahr: z.jahr, epoche: z.epoche, vorher: altesJahr });
      if (!stumm) B.sende('zeichne', { grund: 'jahr' });
      return true;
    },

    /* -------------------------------------------------------------------
       DAS ENDE AUS URSACHE.  Aufsicht, ZUSTAENDIGKEIT 12.

       Bis hierher kannte die Uhr genau ein Ende: die Gegenwart ist erreicht,
       das Haus steht noch. Ein Haus kann aber auch fallen — und dann lief
       WEITER bisher ewig weiter und schlug einem Haus, das das Spiel selbst
       fuer tot erklaert hatte, den naechsten Zug vor.

       Ein Stueck darf die Welt nicht allein anhalten (dieselbe Erwaegung wie
       bei der Sperre, ZUSTAENDIGKEIT 2): es sagt der Uhr den Grund, die Uhr
       haelt an und sagt es allen. Jedes Stueck malt sein eigenes Schlussblatt
       auf 'ende'; keines muss dafuer wissen, was die anderen tun.

           B.uhr.beende('keine-abnehmer', 'Kein Haus der Stadt fuehrt mehr ...')

       Zweimal rufen schadet nicht — das erste Ende gilt.
       ------------------------------------------------------------------- */
    beende: function (grund, text) {
      var z = B.welt.zeit;
      if (z.ende) return false;
      z.ende = true;
      z.endgrund = String(grund || 'unbekannt');
      if (text) B.welt.schreibe(String(text), 'ende');
      B.sende('ende', { jahr: z.jahr, woche: z.woche, epoche: z.epoche, grund: z.endgrund });
      B.sende('zeichne', { grund: 'ende' });
      /* Auch das Ende wird gesichert. Ein Schlussblatt, das ein Neuladen
         nicht ueberlebt, waere die haerteste Form von A1: gerade das
         Schlussblatt ist nach dem Urteil das beste Blatt des Spiels. */
      if (B.stand) B.stand.sichere('ende');
      return true;
    },

    /* -------------------------------------------------------------------
       RUHIGE ZEIT WIRD NICHT GEKLICKT, SONDERN ERZAEHLT.
       Ein Stueck ruft das, wenn nichts zu entscheiden ist.

       WAS HIER STAND UND WARUM ES NICHT BENUTZBAR WAR (geprueft in Welle 13,
       Auflage R5 — kein Stueck hat es je gerufen, und das war richtig so):

           for (i = 0; i < n; i++) {
             B.welt.zeit.woche = WOCHEN_IM_JAHR;   // <- der Fehler
             B.uhr.schliesseJahr();
           }

       Die Zeile setzt den Zaehler auf die letzte Woche und schliesst das
       Jahr. Damit FANDEN DIE UEBERSPRUNGENEN WOCHEN NICHT STATT: kein
       'vorwoche', kein 'woche', kein `welt.verfall()`. Das Bier im Keller
       verdarb nicht, der Gegner zog nicht, geliefert wurde nicht, gezahlt
       wurde nicht — nur der Jahresabschluss lief. Ein Haus, das zwoelf Jahre
       „springt", kaeme mit vollem Keller und ohne einen einzigen Zug des
       Adlers heraus. Das ist kein erzaehltes Jahr, das ist ein Jahr, das
       uebergangen wurde; als Werkzeug fuer Auflage A7 („Wochen ohne
       Entscheidung werden zusammengefasst") war es unbrauchbar, weil
       zusammenfassen heisst: es passiert dasselbe, nur ohne Hand.

       Dazu kam: `B.sende('zeichne')` lief bei JEDEM Jahresschluss mit,
       zwoelf Jahre also zwoelfmal — der Sprung malte zwoelf Bilder, die
       niemand sah, und jedes davon zog die sieben rAF-Stellen des Spiels
       hinterher.

       JETZT laeuft jede Woche wirklich, mit allen Ereignissen, und gemalt
       wird EINMAL am Ende. Der Wuerfel wird dabei genau so oft gedreht wie
       beim Spielen — ein Sprung ist damit dasselbe wie „dreissigmal WEITER
       druecken, ohne hinzusehen", und nichts anderes.

         B.uhr.springe(3)              — 3 Braujahre erzaehlen
         B.uhr.springeWochen(8)        — 8 Wochen erzaehlen
         -> {jahre, wochen, angehalten}   angehalten: null | 'ende' | 'grenze'

       Beide halten an, sobald `B.welt.zeit.ende` steht — wer springt,
       ueberspringt kein Spielende. Beide sichern den Spielstand EINMAL am
       Schluss, nicht je Woche.
       ------------------------------------------------------------------- */

    /* Obergrenze in Wochen. Ein Sprung ist eine Rechnung, keine Animation:
       12 Braujahre sind 360 Wochenlaeufe ueber acht Stuecke. 3000 ist der
       Riegel dagegen, dass ein Rechenfehler in einem Stueck die Seite
       stehenlaesst — nicht die erwartete Groesse. */
    SPRUNG_HOECHST: 3000,

    springeWochen: function (wochen) {
      var n = B.grenze(wochen | 0, 0, B.uhr.SPRUNG_HOECHST);
      var z = B.welt.zeit;
      var vonJahr = z.jahr, gelaufen = 0, angehalten = null;
      if (z.ende) angehalten = 'ende';
      while (gelaufen < n && !z.ende) {
        if (!eineWoche(true)) { angehalten = 'ende'; break; }
        gelaufen++;
      }
      if (!angehalten && (wochen | 0) > n) angehalten = 'grenze';
      if (z.ende && !angehalten) angehalten = 'ende';
      B.sende('zeichne', { grund: 'sprung' });
      if (B.stand) B.stand.sichere('sprung');
      return { jahre: z.jahr - vonJahr, wochen: gelaufen, angehalten: angehalten };
    },

    springe: function (jahre) {
      var n = B.grenze(jahre | 0, 0, 400);
      var z = B.welt.zeit;
      var vonJahr = z.jahr, gelaufen = 0, angehalten = null;
      if (z.ende) angehalten = 'ende';
      /* Ein „Braujahr" ist von hier bis zum naechsten Michaeli, nicht
         dreissig Wochen ab Woche eins — wer in Woche 17 springt, kommt in
         Woche 1 heraus. */
      while (z.jahr - vonJahr < n && !z.ende) {
        if (gelaufen >= B.uhr.SPRUNG_HOECHST) { angehalten = 'grenze'; break; }
        if (!eineWoche(true)) { angehalten = 'ende'; break; }
        gelaufen++;
      }
      if (z.ende && !angehalten) angehalten = 'ende';
      B.sende('zeichne', { grund: 'sprung' });
      if (B.stand) B.stand.sichere('sprung');
      return { jahre: z.jahr - vonJahr, wochen: gelaufen, angehalten: angehalten };
    },

    /* Setzt die Uhr hart — nur fuer URL-Parameter und Aufnahmen. */
    stelle: function (jahr, woche) {
      var z = B.welt.zeit;
      if (jahr) z.jahr = jahr;
      if (woche) z.woche = B.grenze(woche | 0, 1, WOCHEN_IM_JAHR);
      z.epoche = B.welt.epocheZuJahr(z.jahr);
    }
  };

})(BRAUHAUS);
