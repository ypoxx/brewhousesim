/* ===========================================================================
   stuecke/stadt.js — DIE STADT: vier Platten, ein Ort, ein wachsender Hof.

   Was dieses Stueck auf den Bildschirm bringt:
   · Ebene 'platte' — das Epochenbild. Vier Stueck, derselbe Ort, dieselbe
     Kamera, 620 Jahre auseinander. Ohne eingebrannte Schrift: im Spiel ist
     Text echter Text.
   · Ebene 'bau'    — der Hof. Jedes Gebaeude ist ein freigestelltes Bild an
     einem Ort aus kern/orte.js. Es steht dort, WEIL Geld ausgegeben wurde,
     nicht weil die Epoche gewechselt hat. Wer nicht kauft, sieht es nicht.
   · Die Beschriftung der Stadt und das Hausschild als echtes HTML.
   · Den Bauhof: die offenen Bauten der Epoche, mit Preisschild nebeneinander.

   Aufnahmen fuer die Bildlatte:
     ?epoche=1..4            der Hof, wie ihn die Vorfahren hinterliessen
     ?epoche=3&bau=keine     derselbe Spielstand ohne einen einzigen Kauf
     ?epoche=3&bau=alle      alles gebaut
   =========================================================================== */

(function (B) {
  'use strict';

  var K = STADT_DATEN;

  /* Was steht. schluessel -> {jahr, gekauft}. Ueberlebt den Epochenwechsel:
     der Hof waechst ueber die Generationen, er wird nicht neu gesetzt. */
  var gebaut = {};
  var vorschau = null;          /* Bauplatz unter der Maus */

  function e() { return B.welt.zeit ? B.welt.zeit.epoche : 1; }
  function daten(nr) { return K.epochen[nr || e()] || K.epochen[1]; }
  function hat(schluessel) { return !!gebaut[schluessel]; }

  function katalog(nr) {
    var ep = nr || e();
    return K.aufbauten.filter(function (a) { return a.von <= ep && a.bis >= ep; });
  }

  function preis(a, nr) {
    return Math.round(a.grund * (K.teuerung[nr || e()] || 1));
  }

  /* Offen = in dieser Epoche baubar und noch nicht gebaut. */
  function offen(nr) {
    return katalog(nr).filter(function (a) { return !hat(a.schluessel); });
  }

  function stehend(nr) {
    return katalog(nr).filter(function (a) { return hat(a.schluessel); });
  }

  /* --------------------------------------------------------------------
     BAUEN.  Der einzige Weg, wie etwas in den Hof kommt.
     -------------------------------------------------------------------- */
  function wirke(a) {
    var n = a.nutzen || {};
    if (n.platz) B.welt.vorrat.plaetze += n.platz;
    if (n.sud) B.welt.haus.sudJeWoche += n.sud;
    if (n.rohstoff) B.welt.haus.rohstoff += n.rohstoff;
  }

  function nutzenWort(a) {
    var n = a.nutzen || {}, l = [];
    if (n.platz) l.push('+' + n.platz + ' Fass Lagerplatz');
    if (n.sud) l.push('+' + n.sud + ' Sud je Woche');
    if (n.rohstoff) l.push('+' + n.rohstoff + ' ' + B.welt.epoche().rohstoff);
    if (!l.length && a.wirkt) l.push(a.wirkt);
    return l.join(' · ');
  }

  function kaufe(a) {
    if (hat(a.schluessel)) return;
    var p = preis(a);
    if (!B.welt.kann(p)) {
      B.welt.schreibe('Der Bau von ' + a.name + ' bleibt liegen: ' + B.welt.geld(p)
        + ' hat das Haus nicht.', 'bau');
      B.sende('zeichne', { grund: 'stadt:bau' });
      return;
    }
    if (!B.welt.zahle(p, 'Bau: ' + a.name)) return;
    gebaut[a.schluessel] = { jahr: B.welt.zeit.jahr, gekauft: true };
    wirke(a);
    B.welt.schreibe(a.name + ' steht im Hof. ' + a.sagt, 'bau');
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:bau');
    B.sende('zeichne', { grund: 'stadt:bau' });
  }

  /* Der Hof, wie ihn die Vorfahren hinterlassen haben — oder was ?bau= sagt. */
  function setzeStand() {
    gebaut = {};
    var wunsch = B.arg.roh ? B.arg.roh.bau : null;
    var liste;
    if (wunsch === 'keine') liste = [];
    else if (wunsch === 'alle') liste = katalog().map(function (a) { return a.schluessel; });
    else if (wunsch) liste = String(wunsch).split(',');
    else liste = daten().stand || [];

    liste.forEach(function (s) {
      gebaut[s] = { jahr: B.welt.zeit.jahr, gekauft: false };
    });
  }

  /* --------------------------------------------------------------------
     ZEICHNEN
     -------------------------------------------------------------------- */
  function zeichnePlatte() {
    var fach = B.ebene('platte', 'stadt');
    var bild = fach.querySelector('.stadt-platte');
    if (!bild) {
      bild = B.el('img', 'stadt-platte');
      bild.alt = '';
      bild.setAttribute('draggable', 'false');
      fach.appendChild(bild);
    }
    var quelle = daten().platte;
    if (bild.getAttribute('data-quelle') !== quelle) {
      bild.setAttribute('data-quelle', quelle);
      bild.src = quelle;
    }
    fach.setAttribute('data-epoche', String(e()));
  }

  function hausbild(a, geist) {
    var el = B.el('img', 'stadt-haus' + (geist ? ' geist' : ''));
    el.alt = '';
    el.setAttribute('draggable', 'false');
    el.setAttribute('data-bau', a.schluessel);
    el.src = 'bild/hof/' + a.bild + '.png';
    el.style.width = a.breite + '%';
    el.style.zIndex = String(Math.round((B.orte.hole(a.ort).y + (a.dy || 0)) * 10));
    B.orte.setze(el, a.ort, { anker: 'unten', dx: a.dx || 0, dy: a.dy || 0 });
    el.title = a.name + ' — ' + a.sagt;
    return el;
  }

  /* Drei feste Faecher in der Ebene 'bau'. Sie werden EINMAL angelegt und
     danach einzeln neu gefuellt. Das ist kein Schoenheitsfehler, sondern eine
     Bedingung der Bedienbarkeit: wer bei jedem Mausueberfahren die ganze Ebene
     neu baut, reisst den Knopf unter dem Zeiger weg — und der Kritiker kommt
     nie zum Klick. */
  function teile() {
    var fach = B.ebene('bau', 'stadt');
    var t = {
      hof: fach.querySelector('.stadt-fach-hof'),
      geist: fach.querySelector('.stadt-fach-geist'),
      brett: fach.querySelector('.stadt-fach-brett')
    };
    if (!t.hof) {
      t.hof = B.el('div', 'stadt-fach stadt-fach-hof');
      t.geist = B.el('div', 'stadt-fach stadt-fach-geist');
      t.brett = B.el('div', 'stadt-fach stadt-fach-brett');
      fach.appendChild(t.hof);
      fach.appendChild(t.geist);
      fach.appendChild(t.brett);
    }
    return t;
  }

  function zeigeVorschau(schluessel) {
    vorschau = schluessel;
    var geist = teile().geist;
    B.leere(geist);
    if (!schluessel) return;
    var v = katalog().filter(function (a) { return a.schluessel === schluessel; })[0];
    if (v) geist.appendChild(hausbild(v, true));
  }

  function zeichneHof(fach) {
    stehend().forEach(function (a) {
      fach.appendChild(hausbild(a, false));

      /* Der Schornstein von 1884 raucht. 1970 steht er noch und raucht nicht
         mehr — das ist keine Kleinigkeit, das ist die Epoche. */
      if (a.schluessel === 'schornstein' && e() === 3) {
        var rauch = B.el('img', 'stadt-rauch');
        rauch.alt = '';
        rauch.src = 'bild/hof/rauch.png';
        rauch.style.width = '9%';
        rauch.style.zIndex = '900';
        B.orte.setze(rauch, a.ort, { anker: 'unten', dx: (a.dx || 0) - 1.5, dy: -13.5 });
        fach.appendChild(rauch);
      }
    });
  }

  /* Die Namen der Stadt: echter Text an einem Ort. */
  function zeichneNamen(fach) {
    K.namen.forEach(function (n) {
      if (n.ab && e() < n.ab) return;
      if (!B.orte.da(n.ort)) return;
      var el = B.el('div', 'stadt-name');
      el.style.fontSize = 'calc(var(--s) * ' + B.rund(21 * (n.gross || 1), 2) + ')';
      el.style.zIndex = '960';
      el.appendChild(B.el('span', 'wort', n.text));
      B.orte.setze(el, n.ort, { anker: 'mitte', dx: n.dx || 0, dy: n.dy || 0 });
      fach.appendChild(el);
    });
  }

  var ANKER = '<svg class="anker" viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M12 2.6a2.1 2.1 0 0 0-.9 4v1.6H8.4v2h2.7v6.9c-2.5-.5-4.4-2.5-4.8-5H8L4.6 8.9 1.2 12.1h1.9c.5 4.4 4.1 7.8 8.6 7.9v.1h.6c4.7 0 8.6-3.5 9.1-8h1.9l-3.4-3.2-3.4 3.2h1.7c-.5 2.6-2.4 4.6-4.9 5.1v-6.9h2.7v-2h-2.7V6.6a2.1 2.1 0 0 0-.9-4z"/></svg>';

  function zeichneHausschild(fach) {
    var s = daten().schild || {};
    var el = B.el('div', 'stadt-hausschild' + (s.hell ? ' hell' : '') + (s.klein ? ' klein' : ''));
    el.style.width = (s.breite || 7.5) + '%';
    el.style.rotate = (s.dreh || 0) + 'deg';
    el.style.zIndex = '950';
    if (s.hell) {
      el.appendChild(B.el('div', 'zeile eins', 'BRAUHAUS'));
      el.appendChild(B.el('div', 'zeile zwei', 'ZUM ANKER'));
    } else {
      el.appendChild(B.el('div', 'zeile eins', 'BRAUHAUS'));
      var mitte = B.el('div', 'mitte');
      mitte.innerHTML = ANKER;
      el.appendChild(mitte);
      el.appendChild(B.el('div', 'zeile zwei', 'ZUM ANKER'));
      el.appendChild(B.el('div', 'gegr', 'GEGR. ' + B.welt.haus.gegruendet));
    }
    B.orte.setze(el, 'tor', { anker: 'mitte', dx: s.dx || 0, dy: s.dy || 0 });
    fach.appendChild(el);
  }

  /* --------------------------------------------------------------------
     DER BAUHOF — die offenen Bauten der Epoche, mit Preisschild
     nebeneinander. Wer hier klickt, gibt Geld aus und sieht es im Bild.
     -------------------------------------------------------------------- */
  function zeichneBauhof(fach) {
    var ep = e();
    var liste = offen(ep).sort(function (a, b) { return a.grund - b.grund; }).slice(0, 5);

    var kasten = B.el('div', 'stadt-bauhof greifbar');
    var kopf = B.el('div', 'kopf');
    kopf.appendChild(B.el('span', 'wort', 'BAUHOF'));
    kopf.appendChild(B.el('span', 'zahl', stehend(ep).length + ' Bauten im Hof · '
      + 'gebaut wird einmal, es steht auch fuer die Enkel'));
    kasten.appendChild(kopf);

    var reihe = B.el('div', 'reihe');
    kasten.appendChild(reihe);

    if (!liste.length) {
      reihe.appendChild(B.el('div', 'leer', 'Der Hof ist fuer diese Zeit fertig gebaut.'));
    }

    liste.forEach(function (a) {
      var p = preis(a, ep);
      var kann = B.welt.kann(p);
      var zeile = B.el('div', 'bauzeile');
      var k = B.knopf({
        text: a.name,
        zug: 'stadt:bau:' + a.schluessel,
        preis: -p,
        aus: !kann,
        titel: a.sagt + (nutzenWort(a) ? '  [' + nutzenWort(a) + ']' : ''),
        tu: function () { kaufe(a); }
      });
      k.addEventListener('mouseenter', function () {
        B.wage('stadt.vorschau', function () { zeigeVorschau(a.schluessel); });
      });
      k.addEventListener('mouseleave', function () {
        if (vorschau === a.schluessel) {
          B.wage('stadt.vorschau', function () { zeigeVorschau(null); });
        }
      });
      zeile.appendChild(k);
      zeile.appendChild(B.el('div', 'nutzen', nutzenWort(a) || 'steht, solange das Haus steht'));
      reihe.appendChild(zeile);
    });

    fach.appendChild(kasten);

    /* Die eine Zahl der Messlatte: der naechste sinnvolle Zug. */
    if (liste.length) {
      var billigste = liste[0];
      B.welt.meldeZug('Bau ' + billigste.name, preis(billigste, ep));
    }
  }

  function zeichne() {
    zeichnePlatte();
    var t = teile();
    B.leere(t.hof);
    B.leere(t.geist);
    B.leere(t.brett);
    vorschau = null;
    zeichneHof(t.hof);
    zeichneNamen(t.hof);
    zeichneHausschild(t.hof);
    zeichneBauhof(t.brett);
  }

  /* --------------------------------------------------------------------
     ANMELDUNG
     -------------------------------------------------------------------- */
  BRAUHAUS.stueck('stadt', {

    aufbau: function () {
      setzeStand();

      /* Alles vorladen: der Hof soll beim Kauf sofort dastehen, und der
         Epochenwechsel darf nicht flackern. Kein Netzzugriff nach aussen. */
      Object.keys(K.epochen).forEach(function (nr) {
        (new Image()).src = K.epochen[nr].platte;
      });
      K.aufbauten.forEach(function (a) {
        (new Image()).src = 'bild/hof/' + a.bild + '.png';
      });
      (new Image()).src = 'bild/hof/rauch.png';
    },

    zeichne: zeichne,

    /* Die Epoche nimmt, was ihre Zeit ueberlebt hat, und laesst den Rest
       zurueck. Der Hof waechst weiter, er faengt nicht neu an. */
    epoche: function (d) {
      var neu = d.epoche || e();
      Object.keys(gebaut).forEach(function (s) {
        var a = K.aufbauten.filter(function (x) { return x.schluessel === s; })[0];
        if (!a) return;
        if (a.bis < neu) {
          delete gebaut[s];
          B.welt.schreibe(a.name + ' hat seine Zeit hinter sich und verschwindet aus dem Hof.',
            'bau');
        }
      });
    }
  });

  /* Kleiner Lesezugriff fuer die anderen drei Stuecke: steht das schon?
     Niemand muss dafuer in fremdes DOM sehen. */
  B.stadt = {
    hat: hat,
    stehend: function () { return stehend().map(function (a) { return a.schluessel; }); },
    offen: function () { return offen().map(function (a) { return a.schluessel; }); }
  };

})(BRAUHAUS);
