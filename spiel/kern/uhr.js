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
      var z = B.welt.zeit;
      if (z.ende) return false;

      B.sende('vorwoche', { jahr: z.jahr, woche: z.woche });

      /* Was ohne den Spieler geschieht, geschieht hier — vor dem Zaehler. */
      B.welt.verfall();

      if (z.woche >= WOCHEN_IM_JAHR) {
        B.uhr.schliesseJahr();
      } else {
        z.woche += 1;
        B.sende('woche', { jahr: z.jahr, woche: z.woche, epoche: z.epoche });
      }

      B.sende('zeichne', { grund: 'woche' });
      return true;
    },

    /* -------------------------------------------------------------------
       JAHRESENDE. Georgi. Danach laeuft der Sommer ohne Hand durch.
       ------------------------------------------------------------------- */
    schliesseJahr: function () {
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
      B.sende('zeichne', { grund: 'jahr' });
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
      return true;
    },

    /* -------------------------------------------------------------------
       Ruhige Jahre werden nicht gespielt, sondern erzaehlt.
       Ein Stueck ruft das, wenn nichts zu entscheiden ist.
       ------------------------------------------------------------------- */
    springe: function (jahre) {
      var n = B.grenze(jahre | 0, 1, 400);
      for (var i = 0; i < n && !B.welt.zeit.ende; i++) {
        B.welt.zeit.woche = WOCHEN_IM_JAHR;
        B.uhr.schliesseJahr();
      }
      B.sende('zeichne', { grund: 'sprung' });
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
