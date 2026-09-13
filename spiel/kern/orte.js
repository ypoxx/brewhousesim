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
    },

    /* ====================================================================
       DIE ENTFLECHTUNG — Kaertchen, die einander nicht mehr decken.
       Welle 18.

       DAS PROBLEM GEHOERT HIERHER.  Ein Ort ist ein Punkt, und mehrere
       Stuecke setzen ihre Kaertchen auf denselben Punkt, ohne voneinander
       zu wissen: DIE FUHRE haengt ihre Marke an `marktplatz`, DER GEGNER
       seinen Wimpel, DIE STADT ihr Schild. `setze()` gibt jedem dieselben
       Koordinaten, und keines der drei kann das Problem sehen — es entsteht
       erst zwischen ihnen. Also loest es der, der die Orte vergibt.

       Die Blindprobe hat den Schaden gezaehlt und er ist nicht kosmetisch:
         · „Klage vor dem Stadtgericht" lag ueber „TOR · KON ablösen 56 Pf";
           der Klick loeste die Klage aus statt der Abloesung.
         · „FAE · HEI ablösen 126 fl" traf den Knopf „lieber zukaufen"
           darunter: −29 statt −126 fl, eine andere Handlung fuer anderes
           Geld.
         · Insgesamt ueber dreissig tote oder fehlgeleitete Klicks, in allen
           vier Epochen.

       WIE.  Nach dem Zeichnen werden die Kaertchen von oben nach unten
       durchgegangen; wer ein schon gesetztes ueberdeckt, rutscht so weit
       nach unten, dass er es nicht mehr tut. Verschoben wird ueber
       `margin-top` — `top` gehoert dem Stueck, `transform` gehoert dem
       Anker in grund.css, und beide bleiben unangetastet. Zurueckgesetzt
       wird vor jeder Messung, damit sich die Verschiebung nicht aufsummiert.

       WAS SIE NICHT ANFASST.  Bretter, Blaetter und die Kopfleiste: die
       sind gross, haben eine eigene Ordnung (DIE STADT klappt sie) und
       wuerden beim Verschieben mehr zerschlagen als retten. Die Grenze ist
       die Flaeche.
       ==================================================================== */
    entflechte: function () {
      var buehne = document.getElementById('buehne');
      if (!buehne) return 0;
      var breite = buehne.clientWidth, hoehe = buehne.clientHeight;
      if (!breite || !hoehe) return 0;

      var HOECHSTFLAECHE = breite * hoehe * 0.035;   /* darueber ist es ein Brett */
      var MINDESTFLAECHE = 120;                      /* darunter ist es ein Punkt */
      /* Ab wann gilt ein Kaertchen als verdeckt. Gemessen an den
         KNOPF-Huellen (siehe knopfHuelle), nicht an den Kaesten — deshalb
         darf die Schwelle niedriger stehen, ohne dass Kaertchen einander
         ausweichen, die sich nur am Rand beruehren. Gemessen ueber vier
         Epochen: 0,22 laesst in 1350 „Klage vor dem Stadtgericht" auf
         „TOR · KON ablösen" liegen (der Klick loeste die Klage aus statt
         der Abloesung); 0,15 loest das, ohne anderswo etwas zu verschieben. */
      var UEBERDECKUNG = 0.15;
      var LUFT = Math.max(2, Math.round(hoehe * 0.004));
      /* Wie weit ein Kaertchen von seinem Ort wegwandern darf. Gemessen:
         bei 0,16 lief in 1350 das Paar mit „TOR · KON ablösen" genau in
         diesen Anschlag (123 px) und blieb zu einem Viertel unter „Klage vor
         dem Stadtgericht" liegen — der Klick loeste weiter die Klage aus.
         0,22 traegt den Fall; weiter geht es nicht, sonst steht das Kaertchen
         bei einem fremden Haus. */
      var HOECHSTSCHUB = Math.round(hoehe * 0.22);
      /* Quer darf weniger weit gegangen werden als senkrecht. Auf schmalen
         Geraeten (390 px) waeren 9 % nur 35 px — weniger als ein Kaertchen
         breit ist, also nutzlos; deshalb der Boden in echten Bildpunkten. */
      var HOECHSTSCHUB_QUER = Math.max(72, Math.round(breite * 0.09));

      var alle = buehne.querySelectorAll('.amort');
      var l = [], i;

      /* 1 — zuruecksetzen, damit gemessen wird, wo die Stuecke es wollten. */
      for (i = 0; i < alle.length; i++) {
        if (alle[i]._ortSchub) { alle[i].style.marginTop = ''; alle[i]._ortSchub = 0; }
        if (alle[i]._ortQuer) { alle[i].style.marginLeft = ''; alle[i]._ortQuer = 0; }
      }

      function sichtbar(r) {
        return r.width > 1 && r.height > 1
          && r.bottom > 0 && r.top < hoehe && r.right > 0 && r.left < breite;
      }

      /* WEGGESCHNITTEN IST NICHT DA — UND VERERBT SICH.

         DIE STADT klappt ein Brett zu, indem sie `clip-path: inset(50%)`
         darauf legt: die Huelle bleibt, gemalt wird nichts. Ein Kaertchen
         unter so einem Brett ist frei, und das Brett selbst ist kein
         Hindernis. Wer das nicht prueft, misst Gespenster — dieselbe Falle,
         in die kern/haushalt.js schon einmal gelaufen ist, und in die auch
         die erste Messung dieser Welle lief: der Griff des Rufbandes schien
         in allen vier Epochen unter einem Reiter zu liegen, war aber
         laengst weggeschnitten. */
      function weggeschnitten(el) {
        var n = el;
        while (n && n !== buehne) {
          var c = getComputedStyle(n).clipPath;
          if (c && c !== 'none' && /inset\(\s*50%/.test(c)) return true;
          n = n.parentElement;
        }
        return false;
      }

      /* GEMESSEN WIRD, WORAN DER SCHADEN ENTSTEHT: die Huelle der KNOEPFE
         eines Kaertchens, nicht die Huelle des Kaertchens.

         In 1350 decken sich „Klage vor dem Stadtgericht" (124x97) und das
         Paar mit „TOR · KON ablösen" (120x90) nur zu 15 % ihrer Kaesten —
         ihre Knoepfe darin aber zu ueber 30 %, und genau dieser Klick loeste
         die Klage aus statt der Abloesung. Die Schwelle einfach zu senken
         waere der falsche Weg: dann weichen auch Kaertchen einander aus, die
         sich nur am Rand beruehren, und in 1600 sind dabei drei Knoepfe auf
         die Erbe-Leiste geschoben worden, die vorher frei standen (gemessen:
         1 Ueberlappung vorher, 4 nachher). Ein Kaertchen ohne Knopf bleibt
         mit seiner eigenen Huelle in der Rechnung — es kann verdecken, auch
         wenn man es nicht drueckt. */
      function knopfHuelle(el, aussen) {
        var kn = el.querySelectorAll ? el.querySelectorAll('[data-zug]') : [];
        var x0 = null, y0 = null, x1 = null, y1 = null;
        for (var q = 0; q < kn.length; q++) {
          var r = kn[q].getBoundingClientRect();
          if (!r.width || !r.height) continue;
          if (x0 === null || r.left < x0) x0 = r.left;
          if (y0 === null || r.top < y0) y0 = r.top;
          if (x1 === null || r.right > x1) x1 = r.right;
          if (y1 === null || r.bottom > y1) y1 = r.bottom;
        }
        if (x0 === null) return aussen;
        return { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
      }

      /* 2 — WAS SICH BEWEGEN DARF: die Kaertchen auf den Orten. */
      for (i = 0; i < alle.length; i++) {
        var el = alle[i];
        if (el.getAttribute('data-ort-frei') === '1') continue;
        var r = el.getBoundingClientRect();
        var f = r.width * r.height;
        if (!f || f < MINDESTFLAECHE || f > HOECHSTFLAECHE) continue;
        if (!sichtbar(r)) continue;
        if (weggeschnitten(el)) continue;
        var h = knopfHuelle(el, r);
        l.push({ el: el, x: h.left, y: h.top, w: h.width, h: h.height,
                 f: h.width * h.height, schub: 0 });
      }
      if (!l.length && !buehne.querySelector('[data-zug]')) return 0;

      function istInListe(el) {
        for (var q = 0; q < l.length; q++) {
          if (l[q].el === el || l[q].el.contains(el)) return true;
        }
        return false;
      }

      /* 2b — AUCH EIN FREI GESETZTER KNOPF DARF WEICHEN.

         Nicht jedes Ding, das einen Knopf verdeckt, haengt an einem Ort.
         Der Griff des Namensbandes („▾") liegt in allen vier Epochen unter
         einem Reiter der Stadt, und beides ist Inventar: keines der beiden
         wuerde nach Regel 2 weichen, und der Griff bliebe fuer immer
         unerreichbar. Also darf jeder Knopf weichen, der klein genug ist
         und SELBST frei im Bild steht (absolut oder fest gesetzt) — nicht
         aber einer, der in einer Reihe oder einem Raster sitzt: dort gehoert
         die Ordnung dem Stueck, und ein einzeln verschobener Reiter waere
         schlimmer als ein verdeckter. */
      var frei = buehne.querySelectorAll('[data-zug]');
      for (i = 0; i < frei.length; i++) {
        var fk = frei[i];
        if (istInListe(fk)) continue;
        var fst = getComputedStyle(fk);
        if (fst.position !== 'absolute' && fst.position !== 'fixed') continue;
        var fr = fk.getBoundingClientRect();
        var ff = fr.width * fr.height;
        if (!ff || ff < MINDESTFLAECHE || ff > HOECHSTFLAECHE) continue;
        if (!sichtbar(fr)) continue;
        if (weggeschnitten(fk)) continue;
        if (fk._ortSchub || fk._ortQuer) {
          fk.style.marginTop = ''; fk.style.marginLeft = '';
          fk._ortSchub = 0; fk._ortQuer = 0;
          fr = fk.getBoundingClientRect();
        }
        l.push({ el: fk, x: fr.left, y: fr.top, w: fr.width, h: fr.height, f: ff, schub: 0 });
      }

      /* 3 — WAS STEHENBLEIBT UND WOVOR GEWICHEN WIRD.

         Die Kaertchen sind einander nicht allein im Weg. Der teuerste
         gemessene Fall der Blindprobe ist ein Kaertchen unter FESTEM
         Inventar: der Wimpel „wirbt · noch 4 Wo. zuvorkommen 19 Pf" lag zu
         95 % unter dem Griff der Michaelitafel, und genau dieser Wimpel ist
         der Zug, den das Spiel selbst als naechsten empfiehlt. Die Tafel
         weicht nicht — sie ist Moebel; der Wimpel weicht.

         Hindernis ist deshalb jeder sichtbare Knopf, der NICHT zu einem
         beweglichen Kaertchen gehoert. Das ist zugleich genau die Groesse,
         um die es geht: Knopf deckt Knopf. */


      var hindernis = [];
      var knoepfe = buehne.querySelectorAll('[data-zug]');
      for (i = 0; i < knoepfe.length; i++) {
        var kn = knoepfe[i];
        var kr = kn.getBoundingClientRect();
        if (!sichtbar(kr)) continue;
        if (weggeschnitten(kn)) continue;
        var kf = kr.width * kr.height;
        if (!kf || kf > HOECHSTFLAECHE) continue;
        if (istInListe(kn)) continue;
        hindernis.push({ el: null, x: kr.left, y: kr.top, w: kr.width, h: kr.height, f: kf });
      }
      if (l.length < 2 && !hindernis.length) return 0;

      /* 3 — von oben nach unten, bei Gleichstand von links nach rechts.
         Die Reihenfolge entscheidet, wer liegen bleibt und wer weicht; sie
         ist aus der Lage abgeleitet und damit bei gleicher Saat dieselbe. */
      l.sort(function (a, b) { return (a.y - b.y) || (a.x - b.x) || (b.f - a.f); });

      var gesetzt = hindernis.slice(), verschoben = 0;

      /* Wie stark ein Kaertchen bei einer Verschiebung um `dy` noch verdeckt
         wird — null heisst frei. Gemessen wird gegen alles, was schon liegt. */
      function stoerung(c, dy, dx) {
        dx = dx || 0;
        var summe = 0;
        for (var j = 0; j < gesetzt.length; j++) {
          var g = gesetzt[j];
          var bx = Math.min(c.x + dx + c.w, g.x + g.w) - Math.max(c.x + dx, g.x);
          var by = Math.min(c.y + dy + c.h, g.y + g.h) - Math.max(c.y + dy, g.y);
          if (bx <= 0 || by <= 0) continue;
          var anteil = (bx * by) / Math.min(c.f, g.f);
          if (anteil < UEBERDECKUNG) continue;
          summe += anteil;
        }
        return summe;
      }

      /* Der kleinste Schub in eine Richtung, der alle Verdecker raeumt.
         `richtung` ist +1 (nach unten) oder −1 (nach oben). Gesucht wird
         schrittweise: jeder Durchgang raeumt den staerksten Verdecker, und
         der naechste prueft, ob dabei ein neuer entstanden ist. */
      function suche(c, richtung, quer) {
        var d = 0, runde = 0;
        var grenze = quer ? HOECHSTSCHUB_QUER : HOECHSTSCHUB;
        while (runde++ < 24) {
          var noetig = null;
          for (var j = 0; j < gesetzt.length; j++) {
            var g = gesetzt[j];
            var links = c.x + (quer ? d : 0), rechts = links + c.w;
            var oben = c.y + (quer ? 0 : d), unten = oben + c.h;
            var bx = Math.min(rechts, g.x + g.w) - Math.max(links, g.x);
            var by = Math.min(unten, g.y + g.h) - Math.max(oben, g.y);
            if (bx <= 0 || by <= 0) continue;
            if ((bx * by) / Math.min(c.f, g.f) < UEBERDECKUNG) continue;
            var n = quer
              ? (richtung > 0 ? (g.x + g.w + LUFT) - links : links - (g.x - c.w - LUFT))
              : (richtung > 0 ? (g.y + g.h + LUFT) - oben  : oben  - (g.y - c.h - LUFT));
            if (n > 0 && (noetig === null || n > noetig)) noetig = n;
          }
          if (noetig === null) return d;                  /* frei */
          d += richtung * noetig;
          if (Math.abs(d) > grenze) return null;          /* zu weit */
        }
        return null;
      }

      for (i = 0; i < l.length; i++) {
        var c = l[i];
        var schub = 0;
        var quer = 0;
        var vorher = stoerung(c, 0, 0);
        if (vorher > 0) {
          /* Vier Auswege: unten, oben, rechts, links. Genommen wird der
             KUERZESTE, der wirklich frei ist — die Leserichtung entscheidet
             nur bei Gleichstand, und senkrecht vor waagerecht, weil ein
             Kaertchen, das seitlich wandert, seinen Ort schneller sichtbar
             verlaesst als eines, das nach unten rutscht. */
          var wege = [
            { d: suche(c, 1, false),  quer: false, rang: 0 },
            { d: suche(c, -1, false), quer: false, rang: 1 },
            { d: suche(c, 1, true),   quer: true,  rang: 2 },
            { d: suche(c, -1, true),  quer: true,  rang: 3 }
          ];
          var beste = null;
          for (var wi = 0; wi < wege.length; wi++) {
            var wg = wege[wi];
            if (wg.d === null || wg.d === 0) continue;
            if (!beste || Math.abs(wg.d) < Math.abs(beste.d) - 1
                || (Math.abs(wg.d) <= Math.abs(beste.d) + 1 && wg.rang < beste.rang)) {
              beste = wg;
            }
          }
          /* KEIN SCHUB, DER NICHTS BRINGT.  Ohne diese Pruefung wanderte in
             1970 das Kartellamts-Kaertchen 164 px nach unten und lag danach
             auf dem naechsten — verschoben UND verdeckt, also das schlechteste
             von drei moeglichen Ergebnissen. Wer nirgends frei wird, bleibt an
             seinem Ort: dort ist er wenigstens dort, wo er hingehoert. */
          if (beste) {
            var nachher = beste.quer ? stoerung(c, 0, beste.d) : stoerung(c, beste.d, 0);
            if (nachher < vorher) {
              if (beste.quer) quer = beste.d; else schub = beste.d;
            }
          }
        }
        if (schub) {
          c.el.style.marginTop = Math.round(schub) + 'px';
          c.el._ortSchub = schub;
          c.y += schub;
          verschoben++;
        }
        if (quer) {
          c.el.style.marginLeft = Math.round(quer) + 'px';
          c.el._ortQuer = quer;
          c.x += quer;
          verschoben++;
        }
        gesetzt.push(c);
      }

      return verschoben;
    }
  };

})(BRAUHAUS);
