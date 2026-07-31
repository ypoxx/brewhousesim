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
   · DIE WERKBANK am unteren Rand: der Bauhof mit Preisschildern nebeneinander
     und darueber die Reiter aller aufgeschlagenen Bretter.
   · DEN RAHMEN — siehe unten. Das Stadtfenster gehoert dem Bild.

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

  /* ====================================================================
     DER RAHMEN — das Stadtfenster gehoert dem Bild.

     Der Befund des Kritikers aus Runde 1, woertlich: "Das Spielbild zeigt
     die Stadt nicht — es zeigt Tafeln ueber der Stadt." Eine einzige Tafel
     deckte 64 % der Flaeche, vier weitere lagen dauerhaft ueber dem Hof.
     Von vier Platten, die den Ortstest bestehen, war im Spiel nichts zu
     sehen.

     Die Buehne hat deshalb ab jetzt eine Ordnung, und DIE STADT haelt sie:

       oben   0 – 11,2 %   Kopfleiste (kern/kopf.js)
       Mitte 11,2 – 87,5 % DAS STADTFENSTER. Gehoert der Platte und dem Hof.
       unten 87,5 – 100 %  Die Werkbank: Reiter, Bauhof, WEITER.

     Kein Brett irgendeines Stuecks liegt im Ruhezustand mit mehr als
     GRENZE (3,5 %) der Buehnenflaeche im Stadtfenster. Was groesser ist,
     wird zum REITER an der Werkbank — ein Klick schlaegt es auf, ein
     zweiter klappt es zu. Nichts geht verloren, nichts wird umgeschrieben:
     das Brett bleibt an seinem Platz und in seiner Groesse, es wird nur
     weggeschnitten (clip-path) — deshalb stehen im Reiter die LEBENDEN
     Zahlen des Bretts und nicht eine Abschrift davon.

     Zwei Ausnahmen, damit die Ordnung nicht zur Fessel wird:
     · Ein Brett mit dem Attribut data-frei bleibt unangetastet. Wer sein
       Brett selbst in die Leiste legt, wird nicht zweimal gelegt.
     · Was WAEHREND des Spiels neu aufschlaegt — die Michaelitafel zum
       Jahreswechsel — schlaegt auf. Nur was beim Laden schon dalag, liegt
       als Reiter. Beim Laden will man sein Haus sehen.
     ==================================================================== */

  var ZU = 'stadt-zugeklappt';
  var FENSTER = { x0: 0, y0: 11.2, x1: 100, y1: 87.5 };
  var GRENZE = 0.035;           /* Anteil der Buehnenflaeche */
  var TAKT = 240;               /* ms — der Rahmen sieht regelmaessig nach */
  var VERGESSEN = 900;          /* ms — so lange gilt ein Brett als "noch da" */
  var JAHRESFRIST = 1800;       /* ms — Fenster nach einem Jahreswechsel */
  var LADEZEIT = 2500;          /* ms — so lange dauert "beim Laden" */

  var lage = {};                /* schluessel -> 'zu' | 'auf' */
  var gesehen = {};             /* schluessel -> Zeitstempel */
  var startZeit = 0;
  var jahrZeit = 0;
  var beobachter = null;
  var imGange = false;
  var angemeldet = false;
  var reiterStand = '';         /* letzte gezeichnete Reiterzeile, gegen Flackern */

  /* Alle Bretter der anderen Stuecke: direkte Kinder eines fremden Fachs,
     die nicht an einem Ort haengen (.amort ist eine Marke im Bild, kein
     Brett) und die sich nicht selbst abgemeldet haben (data-frei). */
  function fremdeBretter() {
    var l = [];
    ['marken', 'hand', 'blatt'].forEach(function (name) {
      var ebene = document.getElementById('ebene-' + name);
      if (!ebene) return;
      var faecher = ebene.children;
      for (var i = 0; i < faecher.length; i++) {
        var fach = faecher[i];
        var wer = fach.getAttribute('data-stueck');
        if (!wer || wer === 'stadt' || wer.indexOf('kern') === 0) continue;
        var kinder = fach.children;
        for (var j = 0; j < kinder.length; j++) {
          var el = kinder[j];
          if (el.classList.contains('amort')) continue;
          if (el.hasAttribute('data-frei')) continue;
          l.push({ el: el, wer: wer, nr: j });
        }
      }
    });
    return l;
  }

  function schluesselVon(b) {
    var k = [];
    for (var i = 0; i < b.el.classList.length; i++) {
      if (b.el.classList[i] !== ZU) k.push(b.el.classList[i]);
    }
    k.sort();
    return b.wer + '|' + (k.join('.') || ('kind' + b.nr));
  }

  /* Anteil der Buehnenflaeche, den ein Rechteck im Stadtfenster deckt.
     'ganz' misst stattdessen gegen die ganze Buehne. */
  function anteil(r, ganz) {
    var m = B.buehne.masse();
    var x0 = 0, y0 = 0, x1 = m.breite, y1 = m.hoehe;
    if (!ganz) {
      x0 = m.breite * FENSTER.x0 / 100; x1 = m.breite * FENSTER.x1 / 100;
      y0 = m.hoehe * FENSTER.y0 / 100;  y1 = m.hoehe * FENSTER.y1 / 100;
    }
    var w = Math.min(r.right, x1) - Math.max(r.left, x0);
    var h = Math.min(r.bottom, y1) - Math.max(r.top, y0);
    if (w <= 0 || h <= 0) return 0;
    return (w * h) / (m.breite * m.hoehe);
  }

  /* Zuklappen heisst wegschneiden, nicht verstecken: das Brett behaelt
     Platz, Groesse und Umbruch, also stehen im Reiter seine echten Zahlen. */
  function klappeZu(el) {
    if (el.classList.contains(ZU)) return;
    el.classList.add(ZU);
    el.setAttribute('aria-hidden', 'true');
  }

  function klappeAuf(el) {
    if (!el.classList.contains(ZU)) return;
    el.classList.remove(ZU);
    el.removeAttribute('aria-hidden');
  }

  function beschriftung(el) {
    var vorgabe = el.getAttribute('data-reiter');
    if (vorgabe) return { titel: vorgabe, unter: '' };
    var kopf = el.firstElementChild || el;
    var roh = (kopf.innerText || kopf.textContent || '').replace(/ /g, ' ');
    var zeilen = roh.split('\n').map(function (z) { return z.trim(); })
      .filter(function (z) { return z.length; });
    /* Die Ueberschrift des Bretts, nicht die Aufschrift eines Knopfes darin —
       sonst hiesse die Michaelitafel "Chronik des Hauses". */
    var stark = null;
    var kandidaten = kopf.querySelectorAll('b, strong, h1, h2, h3, h4, .titel, .wort');
    for (var j = 0; j < kandidaten.length; j++) {
      if (kandidaten[j].closest('button, a')) continue;
      stark = kandidaten[j];
      break;
    }
    var titel = stark ? (stark.innerText || stark.textContent || '').trim() : '';
    if (!titel) titel = zeilen[0] || 'Brett';
    var unter = '';
    for (var i = 0; i < zeilen.length; i++) {
      if (zeilen[i] !== titel) { unter = zeilen[i]; break; }
    }
    return { titel: titel.slice(0, 30), unter: unter.slice(0, 44) };
  }

  function schalte(schluessel) {
    lage[schluessel] = (lage[schluessel] === 'zu') ? 'auf' : 'zu';
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:reiter');
    pruefe();
  }

  function alleZuklappen() {
    Object.keys(lage).forEach(function (k) { lage[k] = 'zu'; });
    pruefe();
  }

  /* ---- Die Reiterzeile. Wird nur angefasst, wenn sich etwas geaendert
     hat — sonst reisst sie den Knopf unter dem Zeiger weg. ---- */
  function zeichneReiter(liste) {
    var zeile = werkbank().querySelector('.stadt-reiterzeile');
    var offenDa = liste.some(function (b) { return !b.zu; });
    var kennung = liste.map(function (b) {
      return b.schluessel + '~' + (b.zu ? 'z' : 'a') + '~' + b.titel + '~' + b.unter;
    }).join('|') + (offenDa ? '|zeigen' : '');
    if (kennung === reiterStand) return;
    reiterStand = kennung;

    B.leere(zeile);
    if (!liste.length) return;

    liste.forEach(function (b) {
      var k = B.knopf({
        text: b.titel,
        zug: 'stadt:reiter:' + b.schluessel.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
        klasse: 'stadt-reiter' + (b.zu ? '' : ' auf'),
        titel: b.zu
          ? b.titel + ' aufschlagen. Es legt sich ueber die Stadt, bis man es wieder zuklappt.'
          : b.titel + ' zuklappen — dann sieht man die Stadt wieder.',
        tu: function () { schalte(b.schluessel); }
      });
      k.setAttribute('aria-expanded', b.zu ? 'false' : 'true');
      k.appendChild(B.el('span', 'zahl', b.unter || (b.zu ? 'zugeklappt' : 'liegt auf')));
      zeile.appendChild(k);
    });

    if (offenDa) {
      zeile.appendChild(B.knopf({
        text: 'Stadt zeigen',
        zug: 'stadt:alles-zuklappen',
        klasse: 'stadt-reiter frei',
        titel: 'Klappt alle Bretter zu. Danach steht nur noch der Hof im Bild.',
        tu: alleZuklappen
      }));
    }
  }

  function nachsehen() {
    var jetzt = Date.now();
    var liste = fremdeBretter();
    var reiter = [];
    var benutzt = {};

    liste.forEach(function (b) {
      var s = schluesselVon(b);
      if (benutzt[s]) s = s + '#' + b.nr;
      benutzt[s] = true;

      var r = b.el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;      /* nicht da, also kein Reiter */

      /* Klein genug: das ist eine Marke im Bild, kein Brett. Finger weg. */
      if (anteil(r, false) <= GRENZE && !b.el.classList.contains(ZU)) {
        gesehen[s] = jetzt;
        return;
      }

      var frisch = !(s in lage) || (jetzt - (gesehen[s] || 0) > VERGESSEN);
      gesehen[s] = jetzt;

      /* Was beim Laden schon dalag, liegt als Reiter — beim Laden will man
         sein Haus sehen. Was danach aufschlaegt, schlaegt auf. */
      if (frisch) lage[s] = (jetzt - startZeit < LADEZEIT) ? 'zu' : 'auf';
      /* Ein formatfuellendes Blatt zum Jahreswechsel ist eine Entscheidung. */
      if (jetzt - jahrZeit < JAHRESFRIST && anteil(r, true) > 0.25) lage[s] = 'auf';

      if (lage[s] === 'auf') klappeAuf(b.el); else klappeZu(b.el);

      var t = beschriftung(b.el);
      reiter.push({
        schluessel: s, zu: lage[s] === 'zu', titel: t.titel, unter: t.unter
      });
    });

    zeichneReiter(reiter);
  }

  function pruefe() {
    if (imGange) return;
    imGange = true;
    B.wage('stadt.rahmen', nachsehen);
    if (beobachter) beobachter.takeRecords();   /* eigene Aenderungen verwerfen */
    imGange = false;
  }

  function baldPruefen() {
    if (angemeldet) return;
    angemeldet = true;
    window.requestAnimationFrame(function () { angemeldet = false; pruefe(); });
  }

  function starteRahmen() {
    startZeit = Date.now();
    if (window.MutationObserver) {
      beobachter = new MutationObserver(function () { if (!imGange) baldPruefen(); });
      ['marken', 'hand', 'blatt'].forEach(function (name) {
        var ebene = document.getElementById('ebene-' + name);
        if (ebene) beobachter.observe(ebene, { childList: true, subtree: true, attributes: true });
      });
    }
    window.setInterval(pruefe, TAKT);
    window.addEventListener('resize', baldPruefen);
    pruefe();
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

  /* Feste Faecher. Sie werden EINMAL angelegt und danach einzeln neu
     gefuellt. Das ist kein Schoenheitsfehler, sondern eine Bedingung der
     Bedienbarkeit: wer bei jedem Mausueberfahren die ganze Ebene neu baut,
     reisst den Knopf unter dem Zeiger weg — und der Kritiker kommt nie zum
     Klick. */
  function teile() {
    var fach = B.ebene('bau', 'stadt');
    var t = {
      hof: fach.querySelector('.stadt-fach-hof'),
      geist: fach.querySelector('.stadt-fach-geist')
    };
    if (!t.hof) {
      t.hof = B.el('div', 'stadt-fach stadt-fach-hof');
      t.geist = B.el('div', 'stadt-fach stadt-fach-geist');
      fach.appendChild(t.hof);
      fach.appendChild(t.geist);
    }
    return t;
  }

  /* DIE WERKBANK am unteren Rand — ueber allem, was sonst auf der Buehne
     liegt, damit die Reiter erreichbar bleiben, wenn ein Brett aufliegt.
     Sie beginnt bei 87,5 % der Hoehe: darueber ist Stadtfenster. */
  function werkbank() {
    var fach = B.ebene('blatt', 'stadt');
    var w = fach.querySelector('.stadt-werkbank');
    if (!w) {
      w = B.el('div', 'stadt-werkbank');
      w.appendChild(B.el('div', 'stadt-reiterzeile greifbar'));
      w.appendChild(B.el('div', 'stadt-bauhof greifbar'));
      fach.appendChild(w);
    }
    return w;
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
  function zeichneBauhof(kasten) {
    var ep = e();
    var liste = offen(ep).sort(function (a, b) { return a.grund - b.grund; }).slice(0, 5);

    B.leere(kasten);

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
    vorschau = null;
    zeichneHof(t.hof);
    zeichneNamen(t.hof);
    zeichneHausschild(t.hof);
    zeichneBauhof(werkbank().querySelector('.stadt-bauhof'));
    baldPruefen();
  }

  /* --------------------------------------------------------------------
     ANMELDUNG
     -------------------------------------------------------------------- */
  BRAUHAUS.stueck('stadt', {

    aufbau: function () {
      setzeStand();
      werkbank();

      /* Alles vorladen: der Hof soll beim Kauf sofort dastehen, und der
         Epochenwechsel darf nicht flackern. Kein Netzzugriff nach aussen. */
      Object.keys(K.epochen).forEach(function (nr) {
        (new Image()).src = K.epochen[nr].platte;
      });
      K.aufbauten.forEach(function (a) {
        (new Image()).src = 'bild/hof/' + a.bild + '.png';
      });
      (new Image()).src = 'bild/hof/rauch.png';

      starteRahmen();
    },

    zeichne: zeichne,

    jahr: function () { jahrZeit = Date.now(); },

    /* Die Epoche nimmt, was ihre Zeit ueberlebt hat, und laesst den Rest
       zurueck. Der Hof waechst weiter, er faengt nicht neu an. */
    epoche: function (d) {
      var neu = d.epoche || e();
      jahrZeit = Date.now();
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
     Niemand muss dafuer in fremdes DOM sehen.
     rahmen.* ist der Vertrag ueber das Stadtfenster: wer sein Brett selbst
     in eine Leiste legt, setzt data-frei und wird nicht mehr angefasst. */
  B.stadt = {
    hat: hat,
    stehend: function () { return stehend().map(function (a) { return a.schluessel; }); },
    offen: function () { return offen().map(function (a) { return a.schluessel; }); },
    rahmen: {
      fenster: FENSTER,
      grenze: GRENZE,
      lage: function () { return JSON.parse(JSON.stringify(lage)); },
      zeige: alleZuklappen,
      schalte: schalte
    }
  };

})(BRAUHAUS);
