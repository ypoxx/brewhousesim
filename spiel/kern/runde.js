/* ===========================================================================
   kern/runde.js — DER RUNDENSCHLUSS.  GEHOERT DEM SKELETT.  Neu in Welle 12.

   ---------------------------------------------------------------------------
   WAS ES ABSTELLT — gemessen, nicht vermutet
   ---------------------------------------------------------------------------
   Am Stand 7a1a942 spielte 1350 bei EINER Saat ZWEI Partien: rho +0,191 /
   -0,521 / +0,191 in drei einzeln gemessenen Laeufen. Die Trennprobe
   (`werkbank/schuss/aufsicht/welle11-trennprobe/`) fand keinen Verursacher
   unter den drei Stuecken, die in Welle 11 gearbeitet haben.

   Der Grund steht in den Rohdaten: die beiden Reihen sind bis Woche 60
   Ziffer fuer Ziffer gleich und gehen in Woche 61 auseinander — Michaeli
   1352. Der Unterschied ist EIN KLICK, und die Ursache ist eine LUEGE AUF
   EINEM KNOPF:

     1  DIE STADT entscheidet die Platzordnung (`stadt.js` nachsehen()) und
        setzt `stadt-zugeklappt` auf ein FREMDES Brett. Sie sendet dabei kein
        'zeichne' — niemand erfaehrt es.
     2  DER PREIS sieht deshalb nach einer WANDUHRFRIST von 420 ms nach
        (`stuecke/preis.js:2737` seheNachRahmen) und zeichnet erst dann neu.
     3  In der Zeit dazwischen sagt der Knopf `preis:tafel` „Michaelitafel
        schliessen", obwohl nichts auf dem Tisch liegt.
     4  Die messende Hand wartet nach jedem Klick zwei Bildaufbauten (~33 ms).
        420 ms sind zwoelfmal so lang. Ob sie vor oder nach dem Nachsehen
        liest, haengt an der Last der Maschine — und entscheidet die Partie.

   Nachgestellt mit `werkbank/schuss/rahmen-w12/rennen.mjs` (62 Wochen,
   `Emulation.setCPUThrottlingRate`): Drossel 1x und 2x geben Partie A
   (LEITER leer, Kasse an Michaeli 1352 = 164), Drossel 3x/4x/6x geben
   Partie B (LEITER drei Zeilen, Kasse 119). Das sind Ziffer fuer Ziffer die
   beiden Partien des vollen 400-Wochen-Standes.

   ---------------------------------------------------------------------------
   DIE REGEL, IN EINEM SATZ
   ---------------------------------------------------------------------------
   EIN BILDAUFBAU IST EINE RUNDE, UND EINE RUNDE HAT EIN ENDE.
   Was ein Stueck waehrend des Zeichnens auf spaeter verschiebt, gehoert noch
   zu dieser Runde und wird VOM RAHMEN abgearbeitet, bevor die Runde schliesst
   — in fester Reihenfolge, in Mikrotasks, ohne jede Wanduhr. Und wenn sich
   dabei die KLEMMENLAGE geaendert hat (wer ist zugeklappt, wer verdeckt),
   wird noch einmal gezeichnet, damit kein Knopf eine Lage beschriftet, die
   es nicht mehr gibt.

   Damit gilt fuer alle acht Stuecke, ohne dass eines etwas aendern muss:
   wenn die Hand (oder der Spieler, oder der Kritiker) nach einem Klick
   hinsieht, ist die Runde fertig. Immer dieselbe.

   ---------------------------------------------------------------------------
   WIE — und warum genau so
   ---------------------------------------------------------------------------
   Solange eine Runde laeuft, nimmt der Rahmen `setTimeout` (bis FRISTGRENZE)
   und `requestAnimationFrame` ENTGEGEN, statt sie an die Uhr zu geben. Beides
   heisst in diesem Spiel ausnahmslos „den Rest meines Zeichnens gleich
   nachholen" — nachgesehen an jeder einzelnen Stelle:

     kern/kopf.js:112      rAF   Deckungsband, wenn die Zuege gemeldet sind
     stuecke/preis.js:2884 rAF   Kennzahl in die LEITER eintragen
     stuecke/preis.js:2737 Frist nachsehen, ob DIE STADT weggeklappt hat
     stuecke/fuhre.js:2541 rAF   Liste an die Hoehe passen
     stuecke/fuhre.js:3515 rAF   Sommertafel abraeumen, falls die Woche steht
     stuecke/fuhre.js:3606 rAF   Georgi-Tafel nachlegen
     stuecke/sud.js:2407/8 rAF   nachsehen, ob das Brett zugeklappt liegt
     stuecke/stadt.js:1554 rAF   Platzordnung pruefen (aus dem MutationObserver)
     stuecke/name.js:2272  Frist noch einmal zeichnen, wenn Aufgeld kam

   KEINE Animation ist darunter. Wer eine baut, bekommt sie zurueck: eine
   Frist ueber FRISTGRENZE laeuft unveraendert an der Uhr, `setInterval` wird
   ueberhaupt nicht angefasst, und was ausserhalb einer Runde bestellt wird
   (Ton, Bildstaffel der STADT, das Schlussblatt DES SUD) auch nicht.

   Abgearbeitet wird in MIKROTASKS (Promise), nicht in Bildern. Das ist der
   Punkt, an dem es haengt: der MutationObserver der STADT ist selbst ein
   Mikrotask. Zwischen zwei Durchgaengen kommt er also von allein zum Zug,
   ohne dass der Rahmen ihn kennen muss — und die ganze Runde ist trotzdem
   fertig, BEVOR der Browser das naechste Bild baut. Wer danach hinsieht,
   sieht immer dasselbe.

   ---------------------------------------------------------------------------
   WAS ES AUSDRUECKLICH NICHT TUT
   ---------------------------------------------------------------------------
   * Es laeuft NICHT auf einer Frist. Welle 10 hat das teuer bezahlt: eine
     gedrosselte Wache, die nie eingriff, hat 1350 auseinanderlaufen lassen.
     Hier laeuft ueberhaupt nichts, solange nichts gezeichnet wird.
   * Es misst kein Layout. Der Abdruck der Klemmenlage liest Klassennamen,
     kein einziges getBoundingClientRect().
   * Es verschluckt nichts. Was nach PAESSE Durchgaengen noch in der Schlange
     liegt, geht an die echte Uhr zurueck und wird in `bericht()` gezaehlt.
   =========================================================================== */

(function (B) {
  'use strict';

  /* Eine Frist bis hierher ist Rundenarbeit; alles darueber ist Absicht.
     Die laengste Rundenfrist im Spiel ist preis.js:2737 mit 420 ms. */
  var FRISTGRENZE = 1200;
  /* Wieviele Mikrotask-Durchgaenge eine Runde bekommt. Gemessen werden 2
     bis 4 gebraucht; 12 ist Vorrat, nicht Erwartung. */
  var PAESSE = 12;
  /* Wieviele zusaetzliche Bildaufbauten der Schluss anstossen darf, wenn
     sich die Klemmenlage geaendert hat. Gemessen: hoechstens 2. */
  var NACHRUNDEN = 3;
  /* Wie oft die Klemmenwache AUSSERHALB einer Runde nachziehen darf, ohne
     dass zwischendurch etwas anderes gezeichnet wurde. Der Riegel gegen ein
     Hin und Her zwischen zwei Lagen. */
  var AUSSEN_MAX = 3;

  /* Kennungen des Rahmens liegen weit ueber denen des Browsers, damit
     clearTimeout/cancelAnimationFrame sie sicher auseinanderhalten. */
  var ID_BASIS = 900000000;

  /* Die drei Klassen, mit denen in diesem Spiel etwas weggeschnitten wird.
     Sie stehen schon im Kopf von kern/haushalt.js; hier sind sie der
     Abdruck, an dem der Rahmen erkennt, dass sich die Lage geaendert hat. */
  var KLEMMEN = '.stadt-zugeklappt, .stadt-verdeckt, .kern-blatt-zu';

  var oST = window.setTimeout, oCT = window.clearTimeout;
  var oRAF = window.requestAnimationFrame, oCAF = window.cancelAnimationFrame;
  var hatRAF = typeof oRAF === 'function';

  var tiefe = 0;              /* Schachtelung der laufenden Zeichenrunde */
  var imSchluss = false;      /* der Rundenschluss arbeitet gerade */
  var schlange = [];
  var naechste = 0;
  var letzterAbdruck = '';
  var vorletzterAbdruck = null;   /* erkennt ein Hin und Her zwischen zwei Lagen */
  var aussenZaehler = 0;
  var wache = null;

  var zahl = {
    runden: 0, aufgaben: 0, paesse: 0, nachrunden: 0,
    ueberlauf: 0,             /* an die echte Uhr zurueckgegeben */
    aussen: 0,                /* Nachziehen ausserhalb einer Runde */
    aussenPendel: 0,          /* Lage kippt zwischen zwei Zustaenden hin und her */
    aussenRiegel: 0,          /* wie oft der Riegel gegriffen hat */
    maxPaesse: 0, maxNachrunden: 0
  };
  var letzte = null;          /* Bericht der letzten Runde, fuer R9 */

  function faengt() { return tiefe > 0 || imSchluss; }

  function merke(art, fn, args) {
    var id = ID_BASIS + (++naechste);
    schlange.push({ id: id, art: art, fn: fn, args: args });
    return id;
  }

  function vergiss(id) {
    for (var i = 0; i < schlange.length; i++) {
      if (schlange[i].id === id) { schlange.splice(i, 1); return true; }
    }
    return false;
  }

  /* ---------------------------------------------------------------------
     DIE UMHUELLUNG.  Sie greift NUR, solange eine Runde laeuft.
     --------------------------------------------------------------------- */
  window.setTimeout = function (fn, ms) {
    if (faengt() && typeof fn === 'function' && !(+ms > FRISTGRENZE)) {
      return merke('frist', fn, Array.prototype.slice.call(arguments, 2));
    }
    return oST.apply(window, arguments);
  };

  window.clearTimeout = function (id) {
    if (typeof id === 'number' && id >= ID_BASIS) { vergiss(id); return; }
    return oCT.apply(window, arguments);
  };

  if (hatRAF) {
    window.requestAnimationFrame = function (fn) {
      if (faengt() && typeof fn === 'function') return merke('bild', fn, null);
      return oRAF.apply(window, arguments);
    };
    window.cancelAnimationFrame = function (id) {
      if (typeof id === 'number' && id >= ID_BASIS) { vergiss(id); return; }
      return oCAF ? oCAF.apply(window, arguments) : undefined;
    };
  }

  /* ---------------------------------------------------------------------
     DER ABDRUCK DER KLEMMENLAGE.  Nur Klassennamen — kein Layout.
     --------------------------------------------------------------------- */
  function abdruck() {
    var l, i, s = [];
    try { l = document.querySelectorAll(KLEMMEN); } catch (e) { return ''; }
    for (i = 0; i < l.length; i++) {
      var el = l[i];
      var fach = el.closest ? el.closest('.fach') : null;
      s.push((fach && fach.id ? fach.id : '?') + '/' + (el.className || ''));
    }
    s.sort();
    return s.join('|');
  }

  /* ---------------------------------------------------------------------
     DER SCHLUSS
     --------------------------------------------------------------------- */
  function fuehreAus(e) {
    if (e.art === 'bild') {
      B.wage('runde:bild', function () {
        e.fn(typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
      });
    } else {
      B.wage('runde:frist', function () { e.fn.apply(window, e.args || []); });
    }
    zahl.aufgaben++;
  }

  /* Was uebrig bleibt, geht an die echte Uhr — verschluckt wird nichts. */
  function zurueckAnDieUhr() {
    if (!schlange.length) return;
    var rest = schlange; schlange = [];
    zahl.ueberlauf += rest.length;
    rest.forEach(function (e) {
      if (e.art === 'bild' && hatRAF) oRAF.call(window, e.fn);
      else oST.call(window, function () { e.fn.apply(window, e.args || []); }, 0);
    });
  }

  function schliesse() {
    if (imSchluss) return;
    imSchluss = true;
    zahl.runden++;
    var pass = 0, nach = 0;
    /* VERGLICHEN WIRD MIT DER LETZTEN FERTIGEN RUNDE, nicht mit dem Anfang
       dieses Schlusses. Der Unterschied ist der ganze Preis dieser Datei:
       jedes Zeichnen baut die Bretter neu, dabei geht `stadt-zugeklappt`
       verloren und DIE STADT setzt es im Schluss wieder — gegen den Anfang
       gemessen hat sich also IMMER etwas geaendert, und es lief in fast
       jeder Runde eine Nachrunde (gemessen: 197 in 205 Runden, also der
       doppelte Bildaufbau fuer nichts). Gegen die letzte fertige Runde
       gemessen aendert sich nur dann etwas, wenn wirklich ein anderes Brett
       zugeklappt liegt als vorher — und nur dann kann ein Knopf luegen. */
    var vorher = letzterAbdruck;
    var bericht = { paesse: 0, aufgaben: 0, nachrunden: 0, ueberlauf: false };

    function weiter() {
      /* 1 — die Schlange leerlaufen lassen, Durchgang fuer Durchgang. */
      if (schlange.length) {
        if (pass >= PAESSE) {
          bericht.ueberlauf = true;
          zurueckAnDieUhr();
        } else {
          pass++; bericht.paesse = pass;
          var los = schlange; schlange = [];
          bericht.aufgaben += los.length;
          for (var i = 0; i < los.length; i++) fuehreAus(los[i]);
          Promise.resolve().then(weiter);   /* laesst den MutationObserver dazwischen */
          return;
        }
      }
      /* 2 — hat sich die Klemmenlage geaendert? Dann noch einmal zeichnen.
         Sonst beschriftet ein Knopf eine Lage, die es nicht mehr gibt. */
      var jetzt = abdruck();
      if (jetzt !== vorher && nach < NACHRUNDEN) {
        nach++; bericht.nachrunden = nach; zahl.nachrunden++;
        vorher = jetzt;
        B.sende('zeichne', { grund: 'runde-klemme' });
        Promise.resolve().then(weiter);
        return;
      }
      /* 3 — fertig. */
      if (jetzt !== letzterAbdruck) { vorletzterAbdruck = letzterAbdruck; letzterAbdruck = jetzt; }
      zahl.paesse += bericht.paesse;
      if (bericht.paesse > zahl.maxPaesse) zahl.maxPaesse = bericht.paesse;
      if (bericht.nachrunden > zahl.maxNachrunden) zahl.maxNachrunden = bericht.nachrunden;
      letzte = bericht;
      imSchluss = false;
    }

    Promise.resolve().then(weiter);
  }

  /* ---------------------------------------------------------------------
     B.sende('zeichne') wird zur RUNDE.
     Jede andere Nachricht laeuft unveraendert durch.
     --------------------------------------------------------------------- */
  var oSende = B.sende;
  B.sende = function (name) {
    if (name !== 'zeichne') return oSende.apply(this, arguments);
    if (arguments[1] && String(arguments[1].grund || '').indexOf('runde-') !== 0) aussenZaehler = 0;
    tiefe++;
    try { return oSende.apply(this, arguments); }
    finally {
      tiefe--;
      if (tiefe === 0 && !imSchluss) schliesse();
    }
  };

  /* ---------------------------------------------------------------------
     DIE KLEMMENWACHE — und sie haengt an einem EREIGNIS, nicht an einer Uhr.

     DIE STADT prueft die Platzordnung ausserdem alle 240 ms an ihrer eigenen
     Uhr (`stadt.js:1573`) und haelt Fristen von 1400 und 1800 ms. Klappt sie
     dabei ZWISCHEN zwei Runden etwas weg, wuerde derselbe Knopf wieder
     luegen. Der Rahmen sieht das nicht nach einer Frist nach, sondern hoert
     auf die Klassenaenderung selbst und zeichnet dann neu — hoechstens
     AUSSEN_MAX-mal hintereinander, damit ein Hin und Her zwischen zwei Lagen
     das Spiel nicht festhaelt.
     --------------------------------------------------------------------- */
  function starteWache() {
    if (wache || !window.MutationObserver) return;
    letzterAbdruck = abdruck();
    wache = new MutationObserver(function () {
      if (faengt()) return;                       /* die Runde raeumt selbst auf */
      var jetzt = abdruck();
      if (jetzt === letzterAbdruck) return;
      /* ZWEI LAGEN, DIE SICH ABWECHSELN, sind kein Fortschritt. Wer neu
         zeichnet, weil die Lage nach A gekippt ist, und dabei B herstellt,
         das gleich wieder nach A kippt, zeichnet fuer immer. Kommt genau
         die vorletzte Lage zurueck, wird nur gezaehlt, nicht gezeichnet. */
      if (jetzt === vorletzterAbdruck) { zahl.aussenPendel++; return; }
      vorletzterAbdruck = letzterAbdruck;
      letzterAbdruck = jetzt;
      if (aussenZaehler >= AUSSEN_MAX) { zahl.aussenRiegel++; return; }
      aussenZaehler++; zahl.aussen++;
      B.sende('zeichne', { grund: 'runde-klemme-aussen' });
    });
    var stapel = document.getElementById('buehne');
    if (stapel) wache.observe(stapel, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------------------------------------------------------------
     NACH AUSSEN
     --------------------------------------------------------------------- */
  B.runde = {
    /* Eine Runde von Hand fahren — fuer den ersten Bildaufbau, der nicht
       ueber B.sende('zeichne') laeuft (kern/buehne.js starte()). */
    runde: function (fn) {
      tiefe++;
      try { B.wage('runde', fn); }
      finally {
        tiefe--;
        if (tiefe === 0 && !imSchluss) schliesse();
      }
    },
    /* R9 — DIE FRAGE IN EINEM AUFRUF.
       [] heisst: die letzte Runde war deterministisch fertig. Jeder Eintrag
       nennt eine Stelle, an der noch etwas an der Wanduhr haengt. */
    pruefe: function () {
      var raus = [];
      if (zahl.ueberlauf) raus.push({ was: 'ueberlauf', zahl: zahl.ueberlauf,
        sagt: 'Aufgaben sind nach ' + PAESSE + ' Durchgaengen an die echte Uhr zurueckgegangen — '
            + 'die Runde war dort NICHT fertig.' });
      if (zahl.aussenPendel) raus.push({ was: 'aussen-pendel', zahl: zahl.aussenPendel,
        sagt: 'Die Klemmenlage kippt zwischen zwei Zustaenden hin und her; der Rahmen zeichnet '
            + 'dabei nicht mit. Ein Stueck klappt ein fremdes Brett weg, ohne zeichne zu senden.' });
      if (zahl.aussenRiegel) raus.push({ was: 'aussen-riegel', zahl: zahl.aussenRiegel,
        sagt: 'Die Klemmenlage ist ' + AUSSEN_MAX + '-mal hintereinander ausserhalb einer Runde '
            + 'gekippt; der Riegel hat weiteres Nachziehen abgestellt.' });
      if (zahl.maxNachrunden >= NACHRUNDEN) raus.push({ was: 'nachrunden-grenze', zahl: zahl.maxNachrunden,
        sagt: 'Eine Runde hat die Grenze von ' + NACHRUNDEN + ' Nachrunden erreicht.' });
      return raus;
    },
    bericht: function () {
      var b = {}, k;
      for (k in zahl) if (Object.prototype.hasOwnProperty.call(zahl, k)) b[k] = zahl[k];
      b.letzte = letzte;
      b.offen = schlange.length;
      b.abdruck = letzterAbdruck;
      return b;
    },
    /* Fuer die Konsole des Kritikers: eine Zeile. */
    zeile: function () {
      return 'RUNDE  ' + zahl.runden + ' Runden · ' + zahl.aufgaben + ' nachgeholte Aufgaben · '
        + 'max ' + zahl.maxPaesse + ' Durchgaenge · ' + zahl.nachrunden + ' Nachrunden · '
        + zahl.aussen + ' aussen (' + zahl.aussenPendel + ' Pendel, ' + zahl.aussenRiegel
        + ' Riegel) · ueberlauf ' + zahl.ueberlauf
        + (B.runde.pruefe().length ? '  !! ' + B.runde.pruefe().length + ' Beanstandung(en)' : '  — sauber');
    },
    /* nur zum Nachmessen */
    GRENZEN: { FRISTGRENZE: FRISTGRENZE, PAESSE: PAESSE, NACHRUNDEN: NACHRUNDEN, AUSSEN_MAX: AUSSEN_MAX },
    abdruck: abdruck
  };

  /* Die Wache erst, wenn die Buehne steht. 'bereit' kommt aus kern/start.js,
     nach dem ersten Bildaufbau. */
  B.auf('bereit', function () { B.wage('runde.wache', starteWache); });

})(BRAUHAUS);
