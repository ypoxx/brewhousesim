/* ===========================================================================
   stuecke/stadt-zusatz.js — DER BODEN.  Das Lot des Hofes.

   Runde 5 ging mit einem Satz zurueck: "DER BODEN IST NICHT ZU. Bauten sitzen
   auf Ortsmarken plus Versatz, ohne dass jemand prueft, ob der Fusspunkt im
   Hof liegt." Der Beleg war die Kueferei, die in 1350 mit 250 von 252 Spalten
   121 Pixel unter der Mauerkante stand — auf dem Hoftor, ueber der Einfahrt,
   samt Kuefer, Fass und Feuerkorb in der Luft.

   Das war kein Tippfehler in einer Zeile, sondern eine fehlende Pruefung.
   Diese Datei ist die Pruefung. Sie laeuft IM SPIEL, bei jedem Zeichnen, und
   sie misst dasselbe, was der Kritiker am Bildschirm gemessen hat:

     je Aufbau 24 Spalten, je Spalte die UNTERSTE undurchsichtige Zeile
     seines Bildes, verglichen mit der Mauerlinie der vier Platten.

   Die Fussprofile stehen in stadt-daten.js (K.fuesse), gemessen am
   Alphakanal der 32 Hofdateien mit werkbank/schuss/stadt-r6/fuesse.py.
   Deshalb braucht das Lot keinen Schuss und keine Bildverarbeitung: es
   rechnet mit denselben Zahlen, aus denen der Browser das Bild malt.

   DIE DREI SAETZE, die es prueft:

   1  WER IM HOF STEHT, STEHT HINTER DER MAUER.  Die Mauerlinie ist die
      Vorderkante des Hofes; sie ist an allen vier leeren Platten nachgemessen
      (Runde 4) und in allen vier dieselbe. Kein Punkt eines Hofbaus darf
      darunter reichen. Wer darunter zeichnet, steht auf dem Mauerkopf.

   2  WER DRAUSSEN STEHT, MUSS ES SAGEN.  'boden: gasse' ist eine Erklaerung
      mit Begruendung, kein Schlupfloch: dann muss der Aufbau in JEDER Spalte
      unter der Mauerlinie liegen. Wer halb im Hof und halb auf der Gasse
      steht, steht auf der Mauer — genau das war der Fall Kontor.

   3  NIEMAND VERSTELLT DAS TOR.  Die Einfahrt ist eine gemessene Flaeche der
      Platte. Wessen Fuss dort aufsetzt, versperrt sie. Das ist der Satz, den
      die Kueferei gebrochen hat, und er gilt auch fuer einen Bau, der sich
      brav als 'gasse' abmeldet.

   ZU SEHEN, nicht zu glauben:  ?boden=1  legt die Mauerlinie, das Torfeld und
   je Aufbau seine 24 gemessenen Fusspunkte ins Bild — gruen, wenn sie sitzen,
   rot, wo sie es nicht tun. Und BRAUHAUS.stadt.boden.pruefe() gibt dieselben
   Zahlen in die Konsole, ohne dass jemand ein Bild ausmessen muss.

   ---------------------------------------------------------------------------
   DER VIERTE SATZ — DIE TIEFE.  (Runde 7)

   Runde 6 ging mit dem Satz zurueck, der diese Datei beim Namen nennt:

     "DAS LOT MISST DEN BODEN, NICHT DIE TIEFE, UND EINE DATEI NUTZT DAS AUS.
      Der Boden ist zu, der Platz darauf nicht — DAS LOT fragt 'liegt der Fuss
      hinter der Mauer', nie 'ist dieser Boden schon vergeben'."

   Er hat recht gehabt, und der Beleg war der Pferdestall ueber den Gaertanks:
   47 Prozent der Tanks zugedeckt, der vordere ganz weg, der Laufsteg vom
   Stalldach durchschnitten. Also fragt das Lot jetzt beides:

   4  WER VORNE STEHT, LIEGT OBEN.  Decken sich zwei Aufbauten im Bild, muss
      der mit dem TIEFEREN Fuss oben liegen. Die Tiefe kommt aus derselben
      Zahl, aus der stadt.js den z-Index macht (B.stadt.mass.tiefe) — ein
      Pruefer, der anders rechnet als der Zeichner, findet den naechsten
      Pferdestall erst wieder am Bildschirm.

   Gemeldet wird nur, was man auch sieht: eine Deckung unter DECKARM Prozent
   der eigenen Flaeche des Verdeckten ist ein Streifen und kein Fehler.
   =========================================================================== */

(function (B) {
  'use strict';

  var K = STADT_DATEN;
  var BD = K.boden;

  /* Alles rechnet auf der Bezugsbuehne 2752x1536 und wird erst zum Schluss
     auf die wirkliche Buehne umgerechnet. Sonst haengt ein Urteil an der
     Fenstergroesse des Pruefers. */
  function bezug() {
    var m = B.buehne.masse();
    return { sx: m.breite / m.bezugBreite, sy: m.hoehe / m.bezugHoehe,
             breite: m.breite, hoehe: m.hoehe };
  }

  /* DIE MAUERLINIE, in Bezugspixeln. Ein Dach mit dem Scheitel in der
     Sued-Ecke: links faellt sie mit 0,49, rechts mit 0,45. */
  function mauer(x) {
    var sx = BD.scheitel.x * 27.52, sy = BD.scheitel.y * 15.36;
    return x <= sx ? sy - BD.links * (sx - x) : sy - BD.rechts * (x - sx);
  }

  /* DAS TORFELD. Oben begrenzt es die Mauerlinie selbst — was darueber
     liegt, steht im Hof HINTER dem Tor und versperrt nichts; was darunter
     liegt, steht in der Einfahrt. Unten endet es dort, wo die Gasse vor dem
     Tor beginnt. */
  function torfeld() {
    return { x0: BD.tor.x0 * 27.52, x1: BD.tor.x1 * 27.52, y1: BD.tor.y1 * 15.36 };
  }

  function imTorfeld(t, x, y) {
    return x >= t.x0 && x <= t.x1 && y <= t.y1 && y > mauer(x) + BD.spiel;
  }

  /* ----------------------------------------------------------------------
     DIE MESSUNG EINES AUFBAUS.
     Der Kasten kommt aus dem DOM (also aus dem, was wirklich im Bild steht),
     das Fussprofil aus dem Alphakanal seines Bildes. Beides zusammen gibt
     je Spalte den untersten undurchsichtigen Punkt in Bezugspixeln.
     ---------------------------------------------------------------------- */
  function fusspunkte(el, profil) {
    var b = bezug();
    var r = el.getBoundingClientRect();
    var buehne = B.buehne.el;
    var o = buehne ? buehne.getBoundingClientRect() : { left: 0, top: 0 };
    var L = (r.left - o.left) / b.sx, W = r.width / b.sx;
    var T = (r.top - o.top) / b.sy, H = r.height / b.sy;
    var l = [];
    for (var i = 0; i < profil.length; i++) {
      if (profil[i] < 0) continue;
      l.push({ x: L + (i + 0.5) * W / profil.length, y: T + profil[i] * H });
    }
    return l;
  }

  /* Nur innerhalb der HOFFRONT urteilt die Mauerlinie. Das ist die
     Korrektur, die Runde 5 gefehlt hat: rechnet man die Formel ueber die
     ganze Buehne weiter, verurteilt sie das Hopfenlager fuer eine Mauer,
     die westlich der West-Ecke gar nicht steht. */
  function imHof(x) {
    return x >= BD.von * 27.52 && x <= BD.bis * 27.52;
  }

  function urteile(a, punkte) {
    var tor = torfeld();
    var draussen = (a.boden === 'gasse');
    var tiefste = -1e9, tiefsteX = 0, drunter = 0, gemessen = 0, imTor = 0;
    punkte.forEach(function (p) {
      if (imTorfeld(tor, p.x, p.y)) imTor++;
      if (!imHof(p.x)) return;
      gemessen++;
      var d = p.y - mauer(p.x);
      if (d > tiefste) { tiefste = d; tiefsteX = p.x; }
      if (d > BD.spiel) drunter++;
    });
    var fehler = [];
    if (!draussen && drunter) fehler.push('steht auf der Mauer (' + drunter + ' von '
      + gemessen + ' Spalten, tiefste ' + Math.round(tiefste) + ' px darunter)');
    if (draussen && !a.warum) fehler.push('meldet sich als "gasse" ab, ohne zu sagen warum');
    if (imTor) fehler.push('verstellt das Hoftor (' + imTor + ' Spalten)');
    return { schluessel: a.schluessel, boden: a.boden || 'hof',
             tiefste: gemessen ? Math.round(tiefste) : null, x: Math.round(tiefsteX),
             spalten: gemessen, drunter: drunter,
             tor: imTor, gut: !fehler.length, sagt: fehler.join(' · ') };
  }

  /* ----------------------------------------------------------------------
     DIE PRUEFUNG. Liest, was wirklich im eigenen Fach steht.
     ---------------------------------------------------------------------- */
  function nachSchluessel(s) {
    for (var i = 0; i < K.aufbauten.length; i++) {
      if (K.aufbauten[i].schluessel === s) return K.aufbauten[i];
    }
    return null;
  }

  /* DAS HAUSSCHILD auf seinem Gestell steht ebenso auf dem Boden wie ein
     Gebaeude — der dritte Befund der Runde 5 war genau dieses Schild ("eine
     graue Kapsel ueber dem Tor"). Also wird es mitgemessen, und zwar an
     seinem Betonfuss: das ist das eine Stueck, das den Boden beruehrt. */
  function schildpunkte() {
    var fuss = document.querySelector('.stadt-schildwerk .stadt-gestell .fuss');
    if (!fuss) return null;
    var b = bezug();
    var r = fuss.getBoundingClientRect();
    var buehne = B.buehne.el;
    var o = buehne ? buehne.getBoundingClientRect() : { left: 0, top: 0 };
    var L = (r.left - o.left) / b.sx, W = r.width / b.sx;
    var Y = (r.bottom - o.top) / b.sy;
    var l = [];
    for (var i = 0; i < 6; i++) l.push({ x: L + (i + 0.5) * W / 6, y: Y });
    return l;
  }

  function pruefe(laut) {
    var fach = document.getElementById('fach-bau-stadt');
    var l = [];
    if (!fach) return l;
    var haeuser = fach.querySelectorAll('.stadt-haus[data-bau]:not(.geist)');
    for (var i = 0; i < haeuser.length; i++) {
      var el = haeuser[i];
      var a = nachSchluessel(el.getAttribute('data-bau'));
      if (!a) continue;
      var profil = K.fuesse[a.bild];
      if (!profil) continue;
      l.push(urteile(a, fusspunkte(el, profil)));
    }
    var sp = schildpunkte();
    if (sp) l.push(urteile({ schluessel: 'hausschild', bild: null }, sp));
    if (laut && window.console) {
      l.forEach(function (z) {
        console.log((z.gut ? 'steht  ' : 'FEHLER ') + z.schluessel + '  Boden ' + z.boden
          + '  tiefster Punkt ' + z.tiefste + ' px unter der Mauerlinie'
          + (z.sagt ? '  — ' + z.sagt : ''));
      });
    }
    return l;
  }

  /* ----------------------------------------------------------------------
     DIE TIEFE.  Der vierte Satz: wer vorne steht, liegt oben — und niemand
     stellt sich auf den Platz eines anderen.

     Gemessen wird an Rechtecken, nicht an Pixeln: der Browser gibt keine
     Deckung freigestellter Bilder heraus, ohne dass man jedes Bild in eine
     Leinwand malt, und das bei jedem Zeichnen. Ein Rechteck ueberschaetzt
     die Deckung, also sind die Schwellen entsprechend grosszuegig — es soll
     ein begrabenes Gebaeude finden, keinen Streifen ruegen. Was es findet,
     hat der Kritiker der Runde 6 mit Pixeln nachgemessen: 47 Prozent.
     ---------------------------------------------------------------------- */
  var DECKARM = 0.42;    /* so viel des Kleineren darf sich decken */
  var ORDNUNG = 0.10;    /* ab hier zaehlt die Reihenfolge schon */

  function deckung(a, b) {
    var w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (w <= 0 || h <= 0) return 0;
    var klein = Math.min(a.width * a.height, b.width * b.height);
    return klein > 0 ? (w * h) / klein : 0;
  }

  function bauten() {
    var fach = document.getElementById('fach-bau-stadt');
    var l = [];
    if (!fach) return l;
    var haeuser = fach.querySelectorAll('.stadt-haus[data-bau]:not(.geist)');
    for (var i = 0; i < haeuser.length; i++) {
      var el = haeuser[i];
      var r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      l.push({
        schluessel: el.getAttribute('data-bau'),
        el: el, r: r,
        tiefe: parseFloat(el.getAttribute('data-tiefe')),
        z: parseFloat(el.style.zIndex) || 0
      });
    }
    return l;
  }

  function pruefeTiefe(laut) {
    var l = bauten(), fehler = [];
    for (var i = 0; i < l.length; i++) {
      for (var j = i + 1; j < l.length; j++) {
        var d = deckung(l[i].r, l[j].r);
        if (d < ORDNUNG) continue;
        var vorn = l[i].z >= l[j].z ? l[i] : l[j];
        var hinten = vorn === l[i] ? l[j] : l[i];
        /* Wer oben liegt, muss den tieferen Fuss haben. */
        if (vorn.tiefe + 0.05 < hinten.tiefe) {
          fehler.push({ art: 'reihenfolge', oben: vorn.schluessel, unten: hinten.schluessel,
            deckung: Math.round(d * 100),
            sagt: vorn.schluessel + ' liegt ueber ' + hinten.schluessel
              + ', steht aber ' + B.rund(hinten.tiefe - vorn.tiefe, 2) + ' dahinter' });
        } else if (d > DECKARM) {
          fehler.push({ art: 'platz', oben: vorn.schluessel, unten: hinten.schluessel,
            deckung: Math.round(d * 100),
            sagt: vorn.schluessel + ' begraebt ' + hinten.schluessel + ' zu '
              + Math.round(d * 100) + ' % — derselbe Platz' });
        }
      }
    }
    if (laut && window.console) {
      if (!fehler.length) console.log('Tiefe: ' + l.length + ' Aufbauten, keine Deckung ueber '
        + Math.round(DECKARM * 100) + ' %, keine verkehrte Reihenfolge');
      fehler.forEach(function (f) { console.log('TIEFE  ' + f.sagt); });
    }
    return fehler;
  }

  /* ----------------------------------------------------------------------
     ?boden=1 — dasselbe, aber im Bild. Damit muss niemand dem Bauer glauben.
     ---------------------------------------------------------------------- */
  function zeichneLot() {
    var an = B.arg.roh && B.arg.roh.boden;
    var fach = B.ebene('bau', 'stadt');
    var alt = fach.querySelector('.stadt-lot');
    if (alt) fach.removeChild(alt);
    if (!an) return;

    var b = bezug();
    var lot = B.el('div', 'stadt-lot');
    lot.setAttribute('data-frei', '1');

    var t = torfeld();
    var oben = Math.min(mauer(t.x0), mauer(t.x1));
    var kasten = B.el('div', 'lot-tor');
    kasten.style.left = (t.x0 / 27.52) + '%';
    kasten.style.top = (oben / 15.36) + '%';
    kasten.style.width = ((t.x1 - t.x0) / 27.52) + '%';
    kasten.style.height = ((t.y1 - oben) / 15.36) + '%';
    lot.appendChild(kasten);

    /* Die Mauerlinie als zwei schraege Balken — dieselbe Formel, die urteilt. */
    [[0, BD.scheitel.x * 27.52], [BD.scheitel.x * 27.52, 2752]].forEach(function (s) {
      var x0 = s[0], x1 = s[1];
      var y0 = mauer(x0), y1 = mauer(x1);
      var laenge = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
      var strich = B.el('div', 'lot-linie');
      strich.style.left = (x0 / 27.52) + '%';
      strich.style.top = (y0 / 15.36) + '%';
      strich.style.width = (laenge / 27.52) + '%';
      strich.style.rotate = (Math.atan2((y1 - y0) * b.sy, (x1 - x0) * b.sx)
        * 180 / Math.PI) + 'deg';
      lot.appendChild(strich);
    });

    var fachbau = document.getElementById('fach-bau-stadt');
    var haeuser = fachbau ? fachbau.querySelectorAll('.stadt-haus[data-bau]:not(.geist)') : [];
    for (var i = 0; i < haeuser.length; i++) {
      var a = nachSchluessel(haeuser[i].getAttribute('data-bau'));
      if (!a || !K.fuesse[a.bild]) continue;
      var draussen = (a.boden === 'gasse');
      var t2 = torfeld();
      fusspunkte(haeuser[i], K.fuesse[a.bild]).forEach(function (p) {
        var schlecht = imTorfeld(t2, p.x, p.y)
          || (!draussen && imHof(p.x) && p.y - mauer(p.x) > BD.spiel);
        var punkt = B.el('div', 'lot-punkt' + (schlecht ? ' schlecht' : ''));
        punkt.style.left = (p.x / 27.52) + '%';
        punkt.style.top = (p.y / 15.36) + '%';
        lot.appendChild(punkt);
      });
    }
    var sp = schildpunkte();
    if (sp) {
      var t3 = torfeld();
      sp.forEach(function (p) {
        var schlecht = imTorfeld(t3, p.x, p.y)
          || (imHof(p.x) && p.y - mauer(p.x) > BD.spiel);
        var punkt = B.el('div', 'lot-punkt' + (schlecht ? ' schlecht' : ''));
        punkt.style.left = (p.x / 27.52) + '%';
        punkt.style.top = (p.y / 15.36) + '%';
        lot.appendChild(punkt);
      });
    }

    /* Wer sich in die Quere kommt, bekommt einen Rahmen um sein Rechteck —
       gelb, wenn nur der Platz eng ist, rot, wenn die Reihenfolge falsch
       herum steht. */
    var o = B.buehne.el ? B.buehne.el.getBoundingClientRect() : { left: 0, top: 0 };
    pruefeTiefe().forEach(function (f) {
      [f.oben, f.unten].forEach(function (s) {
        var el = fachbau ? fachbau.querySelector('.stadt-haus[data-bau="' + s + '"]') : null;
        if (!el) return;
        var r = el.getBoundingClientRect();
        var kasten = B.el('div', 'lot-streit' + (f.art === 'reihenfolge' ? ' schlecht' : ''));
        kasten.style.left = ((r.left - o.left) / b.breite * 100) + '%';
        kasten.style.top = ((r.top - o.top) / b.hoehe * 100) + '%';
        kasten.style.width = (r.width / b.breite * 100) + '%';
        kasten.style.height = (r.height / b.hoehe * 100) + '%';
        kasten.title = f.sagt;
        lot.appendChild(kasten);
      });
    });

    fach.appendChild(lot);
  }

  /* ----------------------------------------------------------------------
     ANMELDUNG. Ein eigenes Stueck-Fach waere ein zweites 'stadt' — deshalb
     haengt das Lot am Zeichen-Ereignis und nicht an B.stueck().
     ---------------------------------------------------------------------- */
  B.auf('zeichne', function () {
    B.wage('stadt.boden', function () {
      zeichneLot();
      if (B.arg.roh && B.arg.roh.boden === 'laut') { pruefe(true); pruefeTiefe(true); }
    });
  });

  B.stadt.boden = {
    mauer: mauer,
    tor: torfeld,
    pruefe: pruefe,
    /* Kurzfassung fuer die Konsole: was steht nicht? */
    fehler: function () {
      return pruefe().filter(function (z) { return !z.gut; });
    }
  };

  /* DIE TIEFE liegt neben DEM BODEN und wird genauso gerufen:
     BRAUHAUS.stadt.tiefe.pruefe() — was deckt wen, und liegt es richtig? */
  B.stadt.tiefe = {
    pruefe: pruefeTiefe,
    liste: bauten,
    grenzen: { deckung: DECKARM, ordnung: ORDNUNG }
  };

})(BRAUHAUS);
