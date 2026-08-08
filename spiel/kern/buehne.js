/* ===========================================================================
   kern/buehne.js — DIE BUEHNE.  GEHOERT DEM SKELETT-BAUER.

   Ebenenstapel mit fester z-Ordnung:
     platte < bau < marken < hand < kopf < blatt

   BRAUHAUS.ebene('marken','gegner') liefert dem Stueck seinen EIGENEN
   Container in dieser Ebene. Kein Stueck schreibt je ausserhalb; damit
   koennen vier Bauer gleichzeitig arbeiten, ohne sich das DOM zu zerlegen.

   Ausserdem steht hier die BEDIENREGEL als Werkzeug: BRAUHAUS.knopf() baut
   ein echtes <button> mit sichtbarem deutschem Text und stabilem data-zug.
   Wer den Knopf benutzt, erfuellt die Regel automatisch. Ziehen mit der Maus
   darf es zusaetzlich geben, nie als einzigen Weg — sobald Playwright an der
   Bedienung scheitert, misst der Lauf nur noch Pixel.
   =========================================================================== */

(function (B) {
  'use strict';

  var EBENEN = ['platte', 'bau', 'marken', 'hand', 'kopf', 'blatt'];

  var stuecke = [];              /* Reihenfolge der Anmeldung */
  var nachName = {};
  var aktiv = null;              /* welches Stueck gerade zeichnet */
  var gestartet = false;

  function ebeneEl(name) {
    var el = document.getElementById('ebene-' + name);
    if (!el) {
      B.klage('buehne', 'unbekannte Ebene "' + name + '"');
      return document.getElementById('ebene-hand');
    }
    return el;
  }

  /* ----------------------------------------------------------------------
     BRAUHAUS.ebene(ebene, stueck) -> Fach-Container
     Der zweite Parameter darf entfallen, solange man aus aufbau()/zeichne()
     heraus ruft — dann ist das rufende Stueck bekannt.
     ---------------------------------------------------------------------- */
  B.ebene = function (ebene, stueck) {
    var wer = stueck || aktiv || 'frei';
    var id = 'fach-' + ebene + '-' + wer;
    var vorhanden = document.getElementById(id);
    if (vorhanden) return vorhanden;
    var fach = B.el('div', 'fach fach-' + wer + ' fach-' + ebene + '-' + wer);
    fach.id = id;
    fach.setAttribute('data-stueck', wer);
    fach.setAttribute('data-ebene', ebene);
    ebeneEl(ebene).appendChild(fach);
    return fach;
  };

  /* ----------------------------------------------------------------------
     ANMELDUNG EINES STUECKS
       BRAUHAUS.stueck('gegner', {
         aufbau: function(){...},      // einmal, nach dem Laden
         zeichne: function(){...},     // bei jedem 'zeichne'
         woche: function(d){...},      // optional
         jahr: function(d){...},       // optional
         epoche: function(d){...}      // optional
       });
     Jeder Aufruf ist eingepackt: ein Stueck, das wirft, reisst die anderen
     drei nicht mit und erzeugt keinen Konsolenfehler.
     ---------------------------------------------------------------------- */
  B.stueck = function (name, def) {
    if (nachName[name]) {
      B.klage('buehne', 'Stueck "' + name + '" ist doppelt angemeldet');
      return nachName[name];
    }
    var s = { name: name, def: def || {}, heil: true };
    nachName[name] = s;
    stuecke.push(s);

    function ruf(welche, daten) {
      var fn = s.def[welche];
      if (typeof fn !== 'function') return;
      var vorher = aktiv;
      aktiv = name;
      try { fn.call(s.def, daten || {}); }
      catch (e) { s.heil = false; B.klage('stueck:' + name + '.' + welche, e); }
      aktiv = vorher;
    }
    s.ruf = ruf;

    B.auf('zeichne', function (d) { if (gestartet) ruf('zeichne', d); });
    B.auf('woche', function (d) { ruf('woche', d); });
    B.auf('jahr', function (d) { ruf('jahr', d); });
    B.auf('epoche', function (d) { ruf('epoche', d); });
    B.auf('erbfall', function (d) { ruf('erbfall', d); });

    return s;
  };

  /* ----------------------------------------------------------------------
     DIE BUEHNE SELBST
     ---------------------------------------------------------------------- */
  B.buehne = {

    EBENEN: EBENEN,

    get el() { return document.getElementById('buehne'); },

    masse: function () {
      var el = document.getElementById('buehne');
      return {
        breite: el ? el.clientWidth : 2752,
        hoehe: el ? el.clientHeight : 1536,
        bezugBreite: 2752,
        bezugHoehe: 1536
      };
    },

    /* Setzt die Epochenstimmung. CSS-Haken fuer alle: #buehne[data-epoche] */
    setzeEpoche: function (nr) {
      var el = document.getElementById('buehne');
      if (el) el.setAttribute('data-epoche', String(nr));
      document.documentElement.setAttribute('data-epoche', String(nr));
      document.title = 'Brauhaus zum Anker — ' + B.welt.epoche(nr).name
        + ' (' + B.welt.zeit.jahr + ')';
    },

    stuecke: function () { return stuecke.slice(); },

    /* Ruft aufbau() aller angemeldeten Stuecke. Genau einmal, aus start.js. */
    starte: function () {
      if (gestartet) return;
      B.buehne.setzeEpoche(B.welt.zeit.epoche);
      stuecke.forEach(function (s) { s.ruf('aufbau', {}); });
      gestartet = true;
      /* WELLE 13 — ZUG 2 DES SPIELSTANDES, genau hier und nirgends sonst.
         Die Stuecke haben ihr aufbau() hinter sich (und dabei in die Chronik
         geschrieben und gewuerfelt), das erste Bild ist noch nicht gemalt.
         `nachStuecken()` setzt Chronik, Buch und den Zaehlerstand des
         Wuerfels auf den gesicherten Stand zurueck — die Begruendung mit den
         gemessenen Zahlen steht im Kopf von kern/stand.js. Ohne geladenen
         Stand tut der Aufruf nichts, und der Ladezustand einer frischen
         Partie ist Zeile fuer Zeile derselbe wie vor Welle 13. */
      if (B.stand && B.stand.nachStuecken) {
        B.wage('stand.nachStuecken', function () { B.stand.nachStuecken(); });
      }
      /* WELLE 12 — DER ERSTE BILDAUFBAU IST AUCH EINE RUNDE.
         Diese Schleife ruft die Stuecke direkt und geht NICHT ueber
         B.sende('zeichne'); der Rundenschluss (kern/runde.js) haengt aber
         genau dort. Ohne diese Klammer waere ausgerechnet der Ladezustand
         die einzige Runde ohne Ende — und der Ladezustand ist der, den der
         blinde Kritiker fotografiert. Die Reihenfolge der Aufrufe bleibt
         Zeile fuer Zeile dieselbe; nur der Schluss kommt dazu. */
      var malen = function () {
        stuecke.forEach(function (s) { s.ruf('zeichne', { grund: 'start' }); });
      };
      if (B.runde && B.runde.runde) B.runde.runde(malen); else malen();
    },

    istGestartet: function () { return gestartet; }
  };

  /* ----------------------------------------------------------------------
     DIE BEDIENREGEL ALS WERKZEUG

     BRAUHAUS.knopf({
       text:  'Fuhre beladen',         // sichtbarer deutscher Text, Pflicht
       zug:   'fuhre:beladen',         // stabiles data-zug, Pflicht
       preis: -40,                     // optional, erscheint als Preisschild
       ort:   'tor',                   // optional, setzt ihn auf einen Ort
       anker: 'mitte',
       klasse:'gross',
       titel: 'Was passiert, wenn ich das tue',
       aus:   true,                    // gesperrt
       tu:    function(){...}
     })
     ---------------------------------------------------------------------- */
  B.knopf = function (opt) {
    opt = opt || {};
    var k = document.createElement('button');
    k.type = 'button';
    k.className = 'knopf' + (opt.klasse ? ' ' + opt.klasse : '');
    k.setAttribute('data-zug', opt.zug || 'ohne-namen');
    if (opt.titel) k.title = opt.titel;

    var text = B.el('span', 'wort', opt.text || opt.zug || 'Handeln');
    k.appendChild(text);

    if (opt.preis !== undefined && opt.preis !== null && opt.preis !== 0) {
      var einnahme = opt.preis > 0;
      /* PREIS UND WAEHRUNG NIE TRENNEN.  (Auflage R4/A10, Welle 10)
         Der blinde Kritiker fand „−9 / Pf", „−240 / M", „−1.800 / DM" — die
         Einheit allein auf der zweiten Zeile. Nachgestellt mit
         werkbank/schuss/rahmen-w10/blattprobe.mjs: je Epoche genau EIN Bruch,
         und immer an `name:anschlag:*`; dort steht `white-space: normal`
         sowohl am Preisschild als auch am Knopf. Eine CSS-Regel des Rahmens
         muesste das ueberbieten und traefe damit jeden Knopf jedes Stuecks.
         Das GESCHUETZTE LEERZEICHEN wirkt unabhaengig von `white-space` und
         nur dort, wo das Schild entsteht — hier, in der Knopffabrik des
         Rahmens. Der Text bleibt Zeichen fuer Zeichen derselbe; nur die
         Stelle, an der er brechen darf, ist fort. */
      var schild = (einnahme ? '+' : '−') + B.welt.geld(Math.abs(opt.preis));
      var p = B.el('span', 'preis' + (einnahme ? ' einnahme' : ''),
        schild.replace(/ /g, ' '));
      k.appendChild(p);
      k.setAttribute('data-preis', String(opt.preis));
    }

    /* DAS SPIEL SAGT NEIN, ODER ES IST NICHTS DA — zwei Dinge, eine Zahl.
       `disabled` traegt beides zugleich: die Regel des Spiels UND jede
       Verdeckung, die ein Stueck spaeter darueberlegt. Wer aktive Zuege zaehlt,
       zaehlt damit etwas anderes, als er glaubt — und das ist Spalte (a) der
       zweiten Messlatte. Am 3. August 2026 gemessen: von 440 Zuegen ueber vier
       Epochen trugen 55 ein `data-soll-aus` (12,5 %), weil DER SUD es sich
       selbst eingebaut hatte; die 13/20/20/14 gesperrten Zuege ohne jede
       Auskunft kamen ausnahmslos aus `fuhre:*`.
       Diese eine Zeile setzt das Attribut fuer JEDEN Knopf, der ueber B.knopf()
       entsteht — kein Stueck muss dafuer etwas aendern. `data-soll-aus` sagt,
       was das SPIEL will; `disabled` bleibt die Summe aus Spiel und Verdeckung.
       Vorgeschlagen und gemessen begruendet von DER SUD (Welle 4). */
    k.setAttribute('data-soll-aus', opt.aus ? '1' : '0');

    if (opt.aus) {
      k.disabled = true;
      k.setAttribute('aria-disabled', 'true');
    }

    if (typeof opt.tu === 'function') {
      k.addEventListener('click', function (ereignis) {
        ereignis.preventDefault();
        if (k.disabled) return;
        try { opt.tu(ereignis, k); }
        catch (e) { B.klage('knopf:' + (opt.zug || '?'), e); }
      });
    }

    if (opt.ort) B.orte.setze(k, opt.ort, { anker: opt.anker || 'mitte', dx: opt.dx, dy: opt.dy });
    return k;
  };

  /* Vor jedem Zeichnen wird der "naechste sinnvolle Zug" vergessen; die
     Stuecke melden ihn im selben Durchgang neu an (B.welt.meldeZug). Diese
     Datei wird vor kern/kopf.js und vor allen Stuecken geladen, also laeuft
     dieser Horcher als erster — der Wert kann nicht veralten. */
  /* WELLE 13: der ZIELSATZ wird genauso vergessen wie der naechste Zug —
     sonst stuende nach einer Woche, in der niemand meldet, noch der Satz der
     Vorwoche da. Eine Zeile, die eine Lage beschriftet, die es nicht mehr
     gibt, ist genau der Fehler, an dem Welle 12 vier Tage gehangen hat. */
  B.auf('zeichne', function () {
    if (!B.welt) return;
    B.welt.naechsterZug = null;
    B.welt.zielMeldungen = [];
  });

  /* Alle bedienbaren Zuege auf dem Bildschirm — der Kritiker zaehlt damit,
     ohne Quelltext zu lesen: BRAUHAUS.zuege() in der Konsole. */
  B.zuege = function () {
    var l = [];
    document.querySelectorAll('[data-zug]').forEach(function (el) {
      l.push({
        zug: el.getAttribute('data-zug'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' '),
        preis: el.getAttribute('data-preis'),
        offen: !el.disabled,
        stueck: (el.closest('.fach') || {}).getAttribute
          ? el.closest('.fach').getAttribute('data-stueck') : null
      });
    });
    return l;
  };

})(BRAUHAUS);
