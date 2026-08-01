/* ===========================================================================
   kern/orte.js — DAS ORTSVERZEICHNIS.  GEHOERT DEM SKELETT-BAUER.

   Die wichtigste Datei des Skeletts.  Die harte Auftragsforderung lautet:
   ALLE VIER EPOCHEN ZEIGEN DENSELBEN ORT.  Sie ist hier strukturell
   erzwungen statt versprochen — jeder Ort hat GENAU EIN x/y in Prozent, das
   in allen vier Epochen gilt.  Ein Ort darf erscheinen und verschwinden
   (Felder 'ab' und 'bis', in Epochennummern), aber er darf sich nicht bewegen.

   Alle vier Stuecke setzen ihre Dinge ueber diese Schluessel. Deshalb muss
   kein Stueck wissen, was ein anderes zeichnet: Wenn DIE STADT das Sudhaus
   auf 30/47 malt, haengt DER PREIS sein Schild an 30/47, und DIE FUHRE laesst
   ihren Wagen bei 30/47 halten.

   Prozent beziehen sich auf die Buehne (Bezug 2752 x 1536), x nach rechts,
   y nach unten.
   =========================================================================== */

(function (B) {
  'use strict';

  /* art: hof | bau | stadt | land | wasser | fremd | ui
     Nur eine Lesehilfe fuer die Stuecke, keine Mechanik. */
  var LISTE = [
    /* --- Der eigene Hof --------------------------------------------------- */
    { schluessel: 'hof',          name: 'Der Hof',              x: 33, y: 62, art: 'hof',
      sagt: 'Die freie Flaeche im Anwesen. Hier steht, was gerade getan wird.' },
    { schluessel: 'sudhaus',      name: 'Sudhaus',              x: 30, y: 47, art: 'bau',
      sagt: '1350 ein Holzhaus, 1600 aus Stein, 1884 der Fabrikbau mit Kupferhelm.' },
    { schluessel: 'kesselstelle', name: 'Kesselstelle',         x: 33, y: 64, art: 'hof',
      sagt: 'Die offene Pfanne ueber offenem Feuer. KEINE Destillierblase (Sperrliste).' },
    { schluessel: 'tor',          name: 'Hoftor',               x: 45, y: 64, art: 'hof',
      sagt: 'Durchfahrt der Fuhre. Darueber haengt das Hausschild.' },
    { schluessel: 'fasslager',    name: 'Fasslager',            x: 27, y: 76, art: 'hof',
      sagt: 'Die gestapelten Faesser im Hof. Menge = Vorrat aus welt.js.' },
    { schluessel: 'keller',       name: 'Lagerkeller',          x: 22, y: 70, art: 'hof',
      sagt: 'Ab 1884 der Eiskeller. Bestimmt, wie lange ein Fass haelt.' },
    { schluessel: 'rampe',        name: 'Laderampe',            x: 40, y: 72, art: 'hof', ab: 3,
      sagt: 'Erst mit der Bahn sinnvoll.' },
    { schluessel: 'schornstein',  name: 'Schornstein',          x: 17, y: 28, art: 'bau', ab: 3,
      sagt: 'Ab 1884. Steht 1970 noch und raucht nicht mehr.' },
    { schluessel: 'gaertanks',    name: 'Gärtanks',               x: 45, y: 50, art: 'bau', ab: 3,
      sagt: 'Ab 1884. Vorher gaerte es in Holz im Keller.' },
    { schluessel: 'brunnen',      name: 'Ziehbrunnen',          x: 17, y: 62, art: 'hof', bis: 3,
      sagt: 'Das Wasser. Verschwindet mit der Leitung.' },
    { schluessel: 'malzboden',    name: 'Malzboden',            x: 44, y: 42, art: 'bau',
      sagt: 'Auf Stelzen 1350, Darre 1600, Maelzerei 1884.' },

    /* --- Die Stadt -------------------------------------------------------- */
    { schluessel: 'stadtmauer',   name: 'Stadtmauer',           x: 25, y: 21, art: 'stadt',
      sagt: '1350 neu und geschlossen, 1884 Ruine, 1970 Fragment in einer Gruenanlage.' },
    { schluessel: 'kirche',       name: 'St. Michael',          x: 59, y: 26, art: 'stadt',
      sagt: 'Der feste Punkt am Horizont. Spitzhelm ab 1600.' },
    { schluessel: 'marktplatz',   name: 'Marktplatz',           x: 53, y: 40, art: 'stadt',
      sagt: 'Wo Bier ausgeschenkt und Getreide gehandelt wird.' },
    { schluessel: 'lindenhof',    name: 'Gasthof Lindenhof',    x: 68, y: 47, art: 'stadt',
      sagt: 'Der wichtigste Abnehmer im Ort. Gegenueber vom Hoftor.' },
    { schluessel: 'strasse',      name: 'Landstraße',          x: 50, y: 89, art: 'stadt',
      sagt: 'Der Weg nach vorne aus dem Bild. Hier faehrt die Fuhre ab.' },
    { schluessel: 'marktstand',   name: 'Marktstand',           x: 8, y: 96, art: 'stadt',
      sagt: 'Vorne links, ganz nah an der Kamera.' },
    { schluessel: 'hopfengarten', name: 'Hopfengarten',         x: 10, y: 30, art: 'land', ab: 2,
      sagt: 'Erst ab 1600 Hopfenstangen. In 1350 ist dort Grutland (Sperrliste).' },

    /* --- Fluss, Bruecken, jenseits ---------------------------------------- */
    { schluessel: 'fluss',        name: 'Der Fluss',            x: 82, y: 60, art: 'wasser',
      sagt: 'Kommt in allen vier Bildern von rechts.' },
    { schluessel: 'bruecke_unten', name: 'Untere Brücke',      x: 88, y: 70, art: 'wasser',
      sagt: 'Holzsteg 1350, Steinbogen ab 1600.' },
    { schluessel: 'bruecke_oben', name: 'Obere Brücke',        x: 84, y: 40, art: 'wasser',
      sagt: 'Die zweite Querung, flussaufwaerts.' },
    { schluessel: 'muehle',       name: 'Die Mühle',            x: 85, y: 38, art: 'land',
      sagt: 'Mahlt das Malz, solange es keine Schrotmuehle im Haus gibt.' },
    { schluessel: 'bahnhof',      name: 'Bahnhof',              x: 95, y: 27, art: 'fremd', ab: 3,
      sagt: 'Ab 1884. KEINE Bahn in 1600 — daran ist schon ein Zielbild gescheitert.' },
    { schluessel: 'konkurrenz',   name: 'Brauerei Adler',       x: 80, y: 32, art: 'fremd', ab: 3,
      sagt: 'Der Gegner jenseits des Flusses. Vor 1884 sitzt er in der Stadt.' },
    { schluessel: 'wohnblock',    name: 'Wohnblock',            x: 12, y: 45, art: 'stadt', ab: 4,
      sagt: 'Ab 1970. Nimmt der Brauerei die Luft und bringt Durst.' },

    /* --- Bedienung (kein Bild, feste Plaetze fuer Knoepfe) ---------------- */
    { schluessel: 'kopfleiste',   name: 'Kopfleiste',           x: 50, y: 3,  art: 'ui',
      sagt: 'Die HUD-Leiste. Baut kern/kopf.js.' },
    { schluessel: 'weiter',       name: 'WEITER',               x: 93, y: 96, art: 'ui',
      sagt: 'Der Wochenknopf. Baut kern/kopf.js.' },
    { schluessel: 'mitte',        name: 'Bildmitte',            x: 50, y: 50, art: 'ui',
      sagt: 'Ankerpunkt fuer Blaetter und Panels.' }
  ];

  var NACH_SCHLUESSEL = {};
  LISTE.forEach(function (o) {
    if (o.ab === undefined) o.ab = 1;
    if (o.bis === undefined) o.bis = 4;
    NACH_SCHLUESSEL[o.schluessel] = o;
  });

  function hole(schluessel) {
    var o = NACH_SCHLUESSEL[schluessel];
    if (!o) {
      B.klage('orte', 'unbekannter Ort "' + schluessel + '"');
      return null;
    }
    return o;
  }

  B.orte = {

    /* Alle Orte, oder die einer Epoche. */
    liste: function (epoche) {
      if (!epoche) return LISTE.slice();
      return LISTE.filter(function (o) { return o.ab <= epoche && o.bis >= epoche; });
    },

    hole: hole,

    /* Gibt es den Ort in dieser Epoche? Ohne Argument: in der laufenden. */
    da: function (schluessel, epoche) {
      var o = NACH_SCHLUESSEL[schluessel];
      if (!o) return false;
      var e = epoche || (B.welt && B.welt.zeit ? B.welt.zeit.epoche : 1);
      return o.ab <= e && o.bis >= e;
    },

    /* "left:33%;top:62%" — fuer Stuecke, die ihr DOM als String bauen. */
    stil: function (schluessel, dx, dy) {
      var o = hole(schluessel);
      if (!o) return '';
      return 'left:' + B.rund(o.x + (dx || 0), 3) + '%;top:' + B.rund(o.y + (dy || 0), 3) + '%';
    },

    /* Setzt ein Element auf einen Ort.
       opt: {anker:'mitte'|'oben'|'unten'|'links'|'rechts'|'ecke', dx, dy}
       dx/dy sind Prozentpunkte der Buehne. */
    setze: function (el, schluessel, opt) {
      var o = hole(schluessel);
      if (!el || !o) return el;
      opt = opt || {};
      el.classList.add('amort');
      el.setAttribute('data-ort', schluessel);
      el.setAttribute('data-anker', opt.anker || 'mitte');
      el.style.left = B.rund(o.x + (opt.dx || 0), 3) + '%';
      el.style.top = B.rund(o.y + (opt.dy || 0), 3) + '%';
      return el;
    },

    /* Ort in Bildschirmpixeln, relativ zur Buehne — fuer Linien und Wege. */
    punkt: function (schluessel) {
      var o = hole(schluessel);
      var b = B.buehne && B.buehne.masse ? B.buehne.masse() : { breite: 2752, hoehe: 1536 };
      if (!o) return { x: 0, y: 0 };
      return { x: b.breite * o.x / 100, y: b.hoehe * o.y / 100 };
    },

    /* Abstand zweier Orte in Prozentpunkten der Buehnenbreite.
       DIE FUHRE benutzt das fuer Fahrzeiten auf dem Bild — die
       Entfernung in km steht dagegen in welt.js an der Adresse. */
    abstand: function (a, b) {
      var p = hole(a), q = hole(b);
      if (!p || !q) return 0;
      var dx = p.x - q.x, dy = (p.y - q.y) * (1536 / 2752);
      return Math.sqrt(dx * dx + dy * dy);
    },

    /* Punkte auf der Strecke a->b, 0..1. Fuer Wagen, die unterwegs sind. */
    zwischen: function (a, b, anteil) {
      var p = hole(a), q = hole(b);
      if (!p || !q) return { x: 0, y: 0 };
      var t = B.grenze(anteil, 0, 1);
      return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
    },

    /* Ortsverzeichnis als Punkte einblenden — ?orte=1 oder aus der Konsole.
       Zeichnet in ein eigenes Fach, faellt also niemandem ins Bild. */
    zeigeVerzeichnis: function (an) {
      var fach = B.ebene('blatt', 'kern-orte');
      B.leere(fach);
      if (an === false) return;
      var e = (B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1;
      B.orte.liste(e).forEach(function (o) {
        var m = B.el('div', 'ortsmarke');
        m.appendChild(B.el('i'));
        m.appendChild(B.el('span', null, o.schluessel + ' ' + o.x + '/' + o.y));
        m.style.left = o.x + '%';
        m.style.top = o.y + '%';
        m.title = o.name + ' — ' + (o.sagt || '');
        fach.appendChild(m);
      });
    }
  };

})(BRAUHAUS);
