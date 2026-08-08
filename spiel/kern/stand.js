/* ===========================================================================
   kern/stand.js — DER SPIELSTAND.  GEHOERT DEM SKELETT.  Neu in Welle 13.

   Auflage A1 des blinden Spielkritikers (§6 seines Urteils, Welle 12):

     „Ein Neuladen loescht die Partie ohne Warnung. localStorage ist leer,
      sessionStorage ist leer, document.cookie ist leer. Wer nach vierzig
      Minuten aus Versehen F5 drueckt, faengt bei 112 Pfennig wieder an."

   Gemessen hat er: 1350/13, Kasse 60, 12 Faesser, Chronik 8, Buch 42 — und
   nach dem Neuladen 1350/1, Kasse 112, 4 Faesser, Chronik 4, Buch 1.

   ---------------------------------------------------------------------------
   DIE GEFAHR, DIE MIT DIESER DATEI INS SPIEL KOMMT
   ---------------------------------------------------------------------------
   Jede Zahl, die dieser Lauf seit Welle 7 erhoben hat, steht auf DIESELBE
   SAAT, DIESELBE PARTIE. Ein Spielstand greift genau das an, und zwar auf
   zwei Wegen:

     1  EIN MESSLAUF LAEDT VERSEHENTLICH EINEN STAND und spielt damit eine
        andere Partie als der Lauf davor. Dagegen steht `?neu=1` (R2): es
        laedt nichts, es schreibt nichts, und es raeumt beim Anlassen jeden
        Schluessel dieses Spiels aus dem Speicher. Playwright oeffnet je Lauf
        ohnehin einen frischen Kontext — das ist ein gluecklicher Umstand und
        kein Entwurf, deshalb der Schalter.
     2  DAS SCHREIBEN HAENGT AN EINER UHR. Das ist die Lehre der Welle 12,
        und sie hat vier Tage gekostet: „Keine Wanduhrfrist im Zeichenweg."
        In dieser Datei steht deshalb KEIN setTimeout, KEIN setInterval, KEIN
        requestAnimationFrame und KEIN Date.now()/performance.now(). Gesichert
        wird SYNCHRON am Ende des Wochenwechsels (kern/uhr.js), in derselben
        Aufrufkette wie der Klick auf WEITER. Was der Rahmen danach in seinem
        Rundenschluss noch abarbeitet, gehoert zur naechsten Sicherung.

   Und weil kein Zeitstempel im Stand steht, ist der geschriebene Stand
   SELBST wiederholbar: dieselbe Saat, dieselben Klicks, Zeichen fuer Zeichen
   derselbe Eintrag im Speicher. Das ist kein Beiwerk — es ist die einzige
   Art, diese Datei ueberhaupt pruefbar zu machen.

   ---------------------------------------------------------------------------
   DREI BETRIEBSARTEN, und die Adresse entscheidet, welche gilt
   ---------------------------------------------------------------------------
     'spiel'     — der Normalfall. Beim Anlassen wird ein Stand gesucht und
                   fortgesetzt; nach jedem Wochenwechsel wird geschrieben.
     'neu'       — `?neu=1`. Es wird nichts geladen und nichts geschrieben,
                   und JEDER Schluessel `brauhaus:*` faellt beim Anlassen weg.
                   Das ist der Schalter der messenden Hand.
     'aufnahme'  — `?jahr=` oder `?woche=` steht in der Adresse. Wer die Uhr
                   von aussen stellt, will einen bestimmten Augenblick sehen
                   und keine fremde Partie. Es wird nichts geladen und nichts
                   geschrieben; ein vorhandener Stand bleibt aber liegen.

   Der Schluessel ist `brauhaus:<epoche>:<saat>` — aus der EPOCHE DER ADRESSE
   (nicht aus dem Jahr, in dem die Partie gerade steht) und der SAAT. Damit
   findet dieselbe URL ihren Stand wieder, auch wenn die Partie inzwischen
   ueber eine Epochengrenze gelaufen ist.

   ---------------------------------------------------------------------------
   WAS GESICHERT WIRD — und was ehrlicherweise NICHT
   ---------------------------------------------------------------------------
   Gesichert wird der ganze Zustand des KERNS: Haus, Zeit (mit Amtszeit),
   Vorrat, Adressen, Gegner, Chronik, Buch — und der ZAEHLERSTAND DES
   WUERFELS. Ohne den letzten wuerfelt eine fortgesetzte Partie ab der
   Wiederaufnahme dieselben Zahlen wie am Anfang, und der Spielstand waere
   ein Zeitreisegeraet.

   NICHT gesichert wird der Eigenzustand der acht Stuecke (`Z` in
   `stuecke/*.js`) — kein Stueck darf in dieser Welle angefasst werden.
   Ein Stueck, das seinen Zustand mitsichern will, braucht dafuer genau zwei
   Zeilen und keine Kernaenderung:

       B.stand.melde('fuhre', function () { return {ladung: Z.ladung, …}; });
       var alt = B.stand.geladen('fuhre');   // in aufbau(); null = frische Partie

   Was ohne diese zwei Zeilen nach dem Neuladen auf den Anfangswert
   zurueckfaellt, steht namentlich im Baubericht dieser Welle
   (`werkbank/urteile/welle13-der-rahmen-bau.md`).
   =========================================================================== */

(function (B) {
  'use strict';

  var PRAEFIX = 'brauhaus:';
  /* Steigt, wenn sich die Form des Standes aendert. Ein Stand mit fremder
     Fassung wird weggeworfen statt halb gelesen — ein halb gelesener Stand
     ist schlimmer als gar keiner. */
  var FASSUNG = 1;
  /* Obergrenze fuer den geschriebenen Text. localStorage traegt je nach
     Browser 5 bis 10 MB; darueber wirft setItem. Wir bleiben weit darunter
     und kuerzen vorher das BUCH von vorn (das aelteste zuerst) — die Chronik
     nie, sie ist kurz und sie ist das Gedaechtnis der Partie. */
  var GROESSTMASS = 3000000;
  /* So viele Buchzeilen bleiben mindestens stehen, wenn gekuerzt werden muss. */
  var BUCH_MINDEST = 500;

  var modus = 'spiel';
  var schluessel = null;
  var fortgesetzt = null;        /* {jahr, woche} zum Zeitpunkt der Wiederaufnahme */
  var geladeneStuecke = {};      /* was die Stuecke beim letzten Mal mitgegeben haben */
  var sammler = {};              /* name -> function, von den Stuecken angemeldet */
  var vorhanden = false;         /* liegt gerade ein Stand im Speicher? */
  var aufgegeben = false;        /* dreimal verweigert — es wird nicht mehr versucht */

  var zahl = {
    geschrieben: 0,              /* wie oft gesichert wurde */
    zeichen: 0,                  /* Laenge des zuletzt geschriebenen Textes */
    gekuerzt: 0,                 /* wie oft das Buch gekuerzt werden musste */
    verweigert: 0,               /* NEIN am Stueck — wird bei Erfolg zurueckgesetzt */
    verweigertGesamt: 0,         /* NEIN insgesamt — steigt nur */
    geladen: 0,
    verworfen: 0
  };
  var klagen = [];

  function merke(text) {
    klagen.push(String(text));
    if (klagen.length > 20) klagen.shift();
  }

  /* ----------------------------------------------------------------------
     DER SPEICHER.  Er darf fehlen (privates Fenster, abgeschaltete Ablage,
     Seite ueber file://) — dann laeuft das Spiel wie vor Welle 13 weiter und
     sagt es in `B.stand.bericht()`. Es wirft nie.
     ---------------------------------------------------------------------- */
  /* Einmal geprueft, dann gemerkt. Die Probe kostet ein Schreiben und ein
     Loeschen; sie in jeder Woche zu wiederholen waere Zeit im Zeichenweg
     fuer eine Frage, deren Antwort sich nicht mehr aendert. */
  var ablageGeprueft = false, ablageEl = null;

  function ablage() {
    if (ablageGeprueft) return ablageEl;
    ablageGeprueft = true;
    try {
      var s = window.localStorage;
      if (!s) return (ablageEl = null);
      s.setItem(PRAEFIX + 'probe', '1');
      s.removeItem(PRAEFIX + 'probe');
      return (ablageEl = s);
    } catch (e) {
      merke('kein Speicher: ' + (e && e.message ? e.message : e));
      return (ablageEl = null);
    }
  }

  function alleSchluessel(s) {
    var raus = [], i, k;
    for (i = 0; i < s.length; i++) {
      k = s.key(i);
      if (k && k.indexOf(PRAEFIX) === 0) raus.push(k);
    }
    return raus;
  }

  /* ----------------------------------------------------------------------
     SAMMELN.  Nur Daten, keine Funktionen, kein DOM, keine Uhr.
     ---------------------------------------------------------------------- */
  function stueckStaende() {
    var raus = {}, name;
    for (name in sammler) {
      if (!Object.prototype.hasOwnProperty.call(sammler, name)) continue;
      /* Ein Stueck, das beim Sammeln wirft, kostet den anderen nicht den
         Stand — es kostet nur seinen eigenen. */
      (function (n) {
        B.wage('stand.sammle:' + n, function () { raus[n] = sammler[n](); });
      }(name));
    }
    return raus;
  }

  function sammle() {
    var w = B.welt;
    return {
      fassung: FASSUNG,
      schluessel: schluessel,
      saat: B.wuerfel.saat,
      wuerfel: B.wuerfel.zustand,
      haus: w.haus,
      zeit: w.zeit,
      vorrat: w.vorrat,
      adressen: w.adressen,
      gegner: w.gegner,
      chronik: w.chronik,
      buch: B.protokoll,
      buchAb: 0,                 /* wieviele Buchzeilen vorn fehlen */
      stuecke: stueckStaende()
    };
  }

  /* Schreibt und kuerzt notfalls das Buch von vorn. Gibt den Text zurueck
     oder null. Ohne Uhr, ohne Frist, ohne Wiederholung. */
  function schreibe(d) {
    var text = JSON.stringify(d);
    while (text.length > GROESSTMASS && d.buch.length > BUCH_MINDEST) {
      var weg = Math.max(1, Math.floor(d.buch.length / 2));
      d.buch = d.buch.slice(weg);
      d.buchAb += weg;
      zahl.gekuerzt++;
      text = JSON.stringify(d);
    }
    return text;
  }

  /* ----------------------------------------------------------------------
     EINSETZEN.  Die Behaelter behalten ihre Identitaet — es wird gefuellt,
     nicht ersetzt. Ein Stueck, das sich irgendwo `B.welt.adressen` gemerkt
     hat, haelt danach dieselbe Liste in der Hand.
     ---------------------------------------------------------------------- */
  function fuelleObjekt(ziel, quelle) {
    var k;
    for (k in ziel) if (Object.prototype.hasOwnProperty.call(ziel, k)) delete ziel[k];
    for (k in quelle) if (Object.prototype.hasOwnProperty.call(quelle, k)) ziel[k] = quelle[k];
    return ziel;
  }

  function fuelleListe(ziel, quelle) {
    ziel.length = 0;
    for (var i = 0; i < quelle.length; i++) ziel.push(quelle[i]);
    return ziel;
  }

  /* Ein Stand, der nicht alles mitbringt, was der Kern braucht, wird nicht
     halb eingesetzt. Lieber eine frische Partie als eine kaputte. */
  function taugt(d) {
    if (!d || d.fassung !== FASSUNG) return false;
    if (!d.zeit || !d.haus || !d.vorrat) return false;
    if (typeof d.zeit.jahr !== 'number' || typeof d.zeit.woche !== 'number') return false;
    if (!d.zeit.amtszeit) return false;
    if (typeof d.haus.kasse !== 'number') return false;
    if (!d.vorrat.faesser || typeof d.vorrat.faesser.length !== 'number') return false;
    if (!d.adressen || !d.adressen.length) return false;
    if (typeof d.wuerfel !== 'number') return false;
    return true;
  }

  /* ----------------------------------------------------------------------
     DAS EINSETZEN LAEUFT IN ZWEI ZUEGEN, und der Grund ist gemessen.

     Erster Bau: alles auf einmal, vor `B.buehne.starte()`. Abnahme
     `wiederkehr.mjs` E1, zwoelf Wochen — Jahr, Woche, Kasse und Faesser
     standen Ziffer fuer Ziffer richtig, aber:

         Chronik  8 -> 11        Buch  42 -> 43

     Die Ursache steht in den drei zusaetzlichen Zeilen: sie stammen aus dem
     `aufbau()` der Stuecke, das NACH dem Einsetzen laeuft und in die Chronik
     schreibt („Die Hand am Haus ist Kunigunde Bruckner…"). Beim ersten Start
     der Partie sind genau diese Zeilen geschrieben worden — sie stehen im
     gesicherten Stand also schon drin. Ein zweites Mal geschrieben, sind sie
     Doubletten.

     Also:
       ZUG 1  vor `buehne.starte()` — Haus, Zeit, Vorrat, Adressen, Gegner,
              Wuerfel und die Stueckstaende. Jedes Stueck baut damit auf der
              Welt auf, die wirklich gilt.
       ZUG 2  nach dem `aufbau()` aller Stuecke und VOR dem ersten Bild —
              Chronik, Buch und noch einmal der Zaehlerstand des Wuerfels.
              Was die Stuecke beim Aufbauen hineingeschrieben und
              hinausgewuerfelt haben, wird damit ueberschrieben; ein
              fortgesetztes Spiel wuerfelt ab hier genau da weiter, wo es
              stehengeblieben ist.
     ---------------------------------------------------------------------- */
  var offenerStand = null;      /* haelt den Stand zwischen Zug 1 und Zug 2 */

  function setzeEin(d) {
    var w = B.welt;
    fuelleObjekt(w.haus, d.haus);
    fuelleObjekt(w.zeit, d.zeit);
    fuelleObjekt(w.vorrat, d.vorrat);
    fuelleListe(w.adressen, d.adressen || []);
    fuelleListe(w.gegner, d.gegner || []);
    /* Der Wuerfel zuerst auf die Saat, dann auf den Zaehlerstand: `setze`
       setzt beides, `zustand` nur den Zaehler. */
    B.wuerfel.setze(d.saat || B.wuerfel.saat);
    B.wuerfel.zustand = d.wuerfel;
    geladeneStuecke = d.stuecke || {};
    fortgesetzt = { jahr: w.zeit.jahr, woche: w.zeit.woche };
    offenerStand = d;
  }

  /* ======================================================================
     NACH AUSSEN
     ====================================================================== */
  B.stand = {

    /* Wird von kern/start.js gerufen, NACH B.welt.aufbau() und VOR
       B.buehne.starte() — also bevor irgendein Stueck etwas gesehen hat.
       Gibt zurueck, ob fortgesetzt wurde. */
    starte: function () {
      var arg = B.arg || {};
      var ep = B.grenze(arg.epoche || 1, 1, 4);
      var saat = B.wuerfel.saat;
      schluessel = PRAEFIX + ep + ':' + saat;

      if (arg.neu) modus = 'neu';
      else if (arg.jahr || arg.woche) modus = 'aufnahme';
      else modus = 'spiel';

      var s = ablage();
      if (!s) return false;

      /* `?neu=1` raeumt ALLE Schluessel dieses Spiels weg, nicht nur den
         eigenen. Es ist der Schalter, mit dem gemessen wird; sein
         Versprechen lautet „schreibt nichts und laesst nichts liegen", und
         die Abnahme prueft den Speicher als Ganzes. Wer nur eine einzelne
         Partie loswerden will, nimmt den Knopf „Neue Partie".
         DAS RAEUMEN STEHT VOR JEDER ANDEREN PRUEFUNG: es muss auch dann
         geschehen, wenn die Welt gar nicht aufgebaut ist. */
      if (modus === 'neu') {
        alleSchluessel(s).forEach(function (k) {
          try { s.removeItem(k); zahl.verworfen++; } catch (e) { merke('nicht zu loeschen: ' + k); }
        });
        vorhanden = false;
        return false;
      }

      /* Ist die Welt gar nicht aufgebaut (die Notfallwelt aus kern/start.js
         steht), wird nichts eingesetzt und nichts geschrieben — in eine
         halbe Welt einen ganzen Stand zu giessen, macht sie nicht ganzer. */
      if (!B.welt || !B.welt.haus || !B.welt.zeit || !B.welt.vorrat
          || !B.welt.adressen || !B.welt.gegner || !B.welt.chronik) {
        modus = 'aufnahme';
        merke('keine aufgebaute Welt — Spielstand bleibt aus');
        return false;
      }

      var roh = null;
      try { roh = s.getItem(schluessel); } catch (e) { merke('nicht zu lesen: ' + e); }
      vorhanden = !!roh;
      if (!roh || modus === 'aufnahme') return false;

      var d = null;
      try { d = JSON.parse(roh); } catch (e) { d = null; merke('Stand unlesbar, wird verworfen'); }
      if (!taugt(d)) {
        try { s.removeItem(schluessel); } catch (e2) { /* dann bleibt er halt liegen */ }
        vorhanden = false;
        return false;
      }

      var gut = B.wage('stand.setzeEin', function () { setzeEin(d); });
      if (!gut) {
        /* Halb eingesetzt ist schlimmer als gar nicht. Der Stand fliegt raus,
           und die Partie faengt frisch an — sichtbar, nicht heimlich. */
        try { s.removeItem(schluessel); } catch (e3) { /* … */ }
        vorhanden = false;
        fortgesetzt = null;
        return false;
      }
      zahl.geladen++;
      return true;
    },

    /* ZUG 2 des Einsetzens. Ruft kern/buehne.js, nachdem alle Stuecke ihr
       aufbau() hinter sich haben und bevor das erste Bild entsteht. Ohne
       geladenen Stand tut das gar nichts. */
    nachStuecken: function () {
      if (!offenerStand) return false;
      var d = offenerStand;
      offenerStand = null;
      return B.wage('stand.nachStuecken', function () {
        fuelleListe(B.welt.chronik, d.chronik || []);
        fuelleListe(B.protokoll, d.buch || []);
        B.wuerfel.zustand = d.wuerfel;
      });
    },

    /* Der eine Aufruf, den kern/uhr.js macht. SYNCHRON, ohne jede Frist.
       Wird nur im Modus 'spiel' wirksam.

       WARUM HIER `try/catch` STEHT UND NICHT `B.wage`: `B.wage` schreibt
       jeden Fehler nach `BRAUHAUS.lage`, und `lage.length` muss 0 sein —
       das ist eine Abnahme des Loops. Ein voller oder gesperrter Speicher
       ist aber KEIN Fehler eines Stuecks, sondern eine Lage der Maschine;
       sie gehoert in `B.stand.bericht().klagen` und nicht in die Liste, mit
       der geprueft wird, ob ein Stueck geworfen hat. Ein Fehler beim
       SAMMELN eines Stueckstandes landet weiterhin in `lage` — der wird in
       `stueckStaende()` einzeln eingepackt, und das ist ein echter Bug.

       Nach DREI Verweigerungen hintereinander wird nicht mehr versucht.
       Sonst kostet ein voller Speicher in jeder Woche einen vollen
       JSON-Durchlauf, und das waere Zeit im Zeichenweg fuer nichts. */
    sichere: function (grund) {
      if (modus !== 'spiel' || !schluessel || aufgegeben) return false;
      if (!B.welt || !B.welt.zeit) return false;
      var s = ablage();
      if (!s) return false;
      var text;
      try {
        text = schreibe(sammle());
        s.setItem(schluessel, text);
      } catch (e) {
        zahl.verweigert++; zahl.verweigertGesamt++;
        merke('Speicher hat den Stand nicht genommen (' + grund + '): '
          + (e && e.message ? e.message : e));
        if (zahl.verweigert >= 3) {
          aufgegeben = true;
          merke('nach drei Verweigerungen wird nicht mehr gesichert');
        }
        return false;
      }
      zahl.geschrieben++;
      zahl.zeichen = text.length;
      zahl.verweigert = 0;
      vorhanden = true;
      return true;
    },

    /* „Neue Partie": wirft NUR den Stand dieser Adresse weg. Der Knopf in
       kern/kopf.js ruft das erst nach der Rueckfrage. */
    verwirf: function () {
      var s = ablage();
      if (!s || !schluessel) return false;
      try { s.removeItem(schluessel); } catch (e) { merke('nicht zu loeschen'); return false; }
      zahl.verworfen++;
      vorhanden = false;
      return true;
    },

    /* Was ein Stueck beim letzten Mal mitgegeben hat. null = frische Partie. */
    geladen: function (name) {
      return Object.prototype.hasOwnProperty.call(geladeneStuecke, name)
        ? geladeneStuecke[name] : null;
    },

    /* Ein Stueck meldet, wie sein Eigenzustand gesammelt wird. Die Funktion
       muss reine Daten zurueckgeben (JSON-faehig) und darf nichts messen. */
    melde: function (name, sammeln) {
      if (!name || typeof sammeln !== 'function') return false;
      sammler[name] = sammeln;
      return true;
    },

    /* --- Auskunft. Der Kritiker liest das in der Konsole. ---------------- */
    modus: function () { return modus; },
    schluessel: function () { return schluessel; },
    liegtVor: function () { return vorhanden; },
    fortgesetzt: function () { return fortgesetzt; },
    bericht: function () {
      return {
        modus: modus, schluessel: schluessel, liegtVor: vorhanden,
        fortgesetzt: fortgesetzt, stuecke: Object.keys(sammler),
        aufgegeben: aufgegeben, zahl: zahl, klagen: klagen.slice()
      };
    },
    zeile: function () {
      return 'STAND  ' + modus + ' · ' + schluessel
        + ' · ' + (vorhanden ? 'liegt vor' : 'leer')
        + (fortgesetzt ? ' · fortgesetzt ' + fortgesetzt.jahr + '/' + fortgesetzt.woche : '')
        + ' · ' + zahl.geschrieben + '× geschrieben, zuletzt ' + zahl.zeichen + ' Zeichen'
        + (zahl.gekuerzt ? ' (Buch ' + zahl.gekuerzt + '× gekuerzt)' : '')
        + (zahl.verweigertGesamt ? '  !! ' + zahl.verweigertGesamt + '× verweigert'
           + (aufgegeben ? ', aufgegeben' : '') : '');
    }
  };

})(BRAUHAUS);
