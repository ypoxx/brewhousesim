/* ===========================================================================
   kern/kopf.js — KOPFLEISTE, WEITER-KNOPF, CHRONIKBLATT.
   GEHOERT DEM SKELETT-BAUER.

   Das ist alles, was das Skelett selbst auf den Bildschirm bringt:
   die Kopfleiste mit echten Werten aus welt.js, den WEITER-Knopf, der eine
   Woche schaltet, und das Jahresende, das schliesseJahr() ruft.

   Es benutzt dieselben Ebenen und dieselbe Knopf-Fabrik wie die Stuecke —
   unter dem Namen 'kern'. Kein Stueck heisst 'kern', also kollidiert nichts.
   =========================================================================== */

(function (B) {
  'use strict';

  var blattOffen = null;
  var neuFrage = false;          /* liegt die Rueckfrage "Neue Partie?" an? */

  /* ----------------------------------------------------------------------
     EIN KNOPF OHNE KASTEN.  Welle 13.

     Der Flaechenhaushalt (kern/haushalt.js, Welle 10) gibt dem Rahmen
     120.000 px gesamt und 80.000 px im obersten Sechstel. Gemessen am
     Ladezustand E1 vor dieser Welle: kern 98.096 / 120.000 gesamt und
     78.336 / 80.000 oben — im obersten Sechstel sind das 1.664 px Vorrat,
     also KEIN Platz fuer einen weiteren Kasten. Alles, was diese Welle an
     den Rand des Bildes schreibt, traegt deshalb keinen Grund und keinen
     Rahmen, sondern denselben Lichthof wie die Hauszeile und die Zeile
     „naechster Zug: …". `haushalt.istKasten()` sieht so etwas nicht, und der
     Haushalt bleibt Ziffer fuer Ziffer, wie er war.

     Ein echtes <button> mit sichtbarem deutschem Text und stabilem data-zug
     bleibt es trotzdem — die Bedienregel haengt nicht am Grund, sondern am
     Knopf. Unterstrichen, damit man ihn als Knopf erkennt.
     ---------------------------------------------------------------------- */
  var LICHTHOF = 'text-shadow:0 0 calc(var(--s)*9) rgba(255,248,230,.98),'
    + '0 0 calc(var(--s)*4) rgba(255,248,230,.98);';

  function randKnopf(opt) {
    var k = B.knopf(opt);
    k.style.cssText = 'background:none;background-color:transparent;border:0;box-shadow:none;'
      + 'padding:calc(var(--s)*5) calc(var(--s)*10);'
      + 'min-height:max(24px,calc(var(--s)*38));min-width:max(24px,calc(var(--s)*38));'
      + 'font-family:var(--serif);font-size:max(12px,calc(var(--s)*20));color:#2b1d10;'
      + 'text-decoration:underline;text-underline-offset:calc(var(--s)*5);'
      + 'cursor:pointer;white-space:nowrap;' + LICHTHOF;
    return k;
  }

  function tafel(marke, wert) {
    var t = B.el('div', 'tafel');
    t.appendChild(B.el('span', 'marke', marke));
    t.appendChild(B.el('span', 'wert', wert));
    return t;
  }

  function tafelKnopf(marke, wert, zug, tu) {
    var t = document.createElement('button');
    t.type = 'button';
    t.className = 'tafel knopf';
    t.setAttribute('data-zug', zug);
    t.appendChild(B.el('span', 'marke', marke));
    t.appendChild(B.el('span', 'wert', wert));
    t.addEventListener('click', function (e) {
      e.preventDefault();
      try { tu(); } catch (err) { B.klage('kopf:' + zug, err); }
    });
    return t;
  }

  /* ----------------------------------------------------------------------
     Kopfleiste
     ---------------------------------------------------------------------- */
  function zeichneKopf() {
    var fach = B.ebene('kopf', 'kern');
    B.leere(fach);

    var z = B.welt.zeit;
    var e = B.welt.epoche();
    var d = B.uhr.datum();

    var leiste = B.el('div', 'kopfleiste');
    B.orte.setze(leiste, 'kopfleiste', { anker: 'oben' });

    leiste.appendChild(tafel(d.monat.toUpperCase(), d.jahr));
    leiste.appendChild(tafel('Kasse', B.welt.geld(B.welt.haus.kasse)));
    leiste.appendChild(tafel(e.rohstoff, B.zahl(B.welt.haus.rohstoff)));
    /* GLAETTUNG WELLE 1: Die Kopfleiste hat den Vorrat in Fass gezaehlt,
       waehrend das Brett desselben Vorrats ihn ab 1872 in Hektoliter zeigt —
       "KELLER 140/400" oben, "DIE TANKS 210 von 600 hl" unten, dieselbe
       Menge in zwei Einheiten unter zwei Namen. Beides kommt jetzt aus
       B.welt.menge(), dem einen Formatierer des Kerns, und der Name des
       Lagers wechselt mit der Epoche wie der Name des Rohstoffs daneben. */
    leiste.appendChild(tafel(e.lager || 'Keller',
      B.welt.menge(B.welt.vorrat.faesser.length, true) + '/' + B.welt.menge(B.welt.vorrat.plaetze)));
    leiste.appendChild(tafel('Woche', z.woche + '/' + B.uhr.WOCHEN_IM_JAHR));
    leiste.appendChild(tafelKnopf('Chronik', B.welt.chronik.length, 'kern:chronik', function () {
      zeigeBlatt(blattOffen === 'chronik' ? null : 'chronik');
    }));
    leiste.appendChild(tafelKnopf('Buch', B.protokoll.length, 'kern:protokoll', function () {
      zeigeBlatt(blattOffen === 'protokoll' ? null : 'protokoll');
    }));

    fach.appendChild(leiste);

    /* Haus und Generation, klein unter der Leiste.
       WELLE 10, Auflage R1/R6: der Schriftboden max(12px, …) kam dazu — die
       Zeile stand bei 1366x768 auf 10,9 px und zaehlte als einer der 505
       Textknoten der vierten Latte. Auf der Entwurfsleinwand aendert er
       nichts (dort ist calc(var(--s)*22) = 22 px). Das Papier hinter der
       Zeile nimmt ihr `grund.css` ab; der Lichthof hier traegt sie allein. */
    var haus = B.el('div', 'hauszeile');
    haus.style.cssText = 'position:absolute;left:50%;top:10.4%;transform:translateX(-50%);'
      + 'font-size:max(12px,calc(var(--s)*22));color:#2b1d10;letter-spacing:calc(var(--s)*2);'
      + 'text-shadow:0 0 calc(var(--s)*10) rgba(255,248,230,.95);white-space:nowrap;';
    haus.textContent = B.welt.haus.name + ' · ' + B.uhr.braujahr() + ' · '
      + z.amtszeit.name + ', ' + z.amtszeit.eigenschaftName
      + ' · ' + e.name;
    fach.appendChild(haus);

    zeichneStandzeile(fach);

    /* WEITER — der eine Knopf, den es immer gibt. */
    var letzte = z.woche >= B.uhr.WOCHEN_IM_JAHR;
    var weiter = B.knopf({
      text: z.ende ? 'ENDE' : (letzte ? 'JAHR SCHLIESSEN' : 'WEITER'),
      zug: 'weiter',
      klasse: 'gross',
      ort: 'weiter',
      anker: 'rechts',
      aus: !!z.ende,
      titel: letzte
        ? 'Georgi. Das Braujahr endet, der Sommer läuft ohne Hand durch.'
        : 'Eine Woche weiter. Woche ' + z.woche + ' von ' + B.uhr.WOCHEN_IM_JAHR + '.',
      tu: function () {
        B.ton.spiele('uhr:woche');
        B.uhr.naechsteWoche();
      }
    });
    fach.appendChild(weiter);

    zeichneDeckung();
    zeichneZiel();
    /* Die Stuecke melden ihren naechsten Zug erst NACH diesem Horcher an.
       Ein Bildaufbau spaeter steht die Zahl richtig da. */
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () {
        B.wage('kopf.deckung', zeichneDeckung);
        B.wage('kopf.ziel', zeichneZiel);
      });
    }
  }

  /* -------------------------------------------------------------------
     DIE STANDZEILE — „fortgesetzt · 1354/12" und „Neue Partie".
     Welle 13, R1. Unter der Hauszeile, ohne Kasten (siehe randKnopf).

     Die Zeile steht auf dem Augenblick der WIEDERAUFNAHME, nicht auf der
     laufenden Woche: sie sagt „diese Sitzung hat einen Stand vom
     Jahr 1354, Woche 12 aufgenommen", und das bleibt wahr, wenn man
     weiterspielt. Wer die laufende Woche sucht, findet sie zwei Zentimeter
     darueber in der Kopfleiste.
     ------------------------------------------------------------------- */
  function zeichneStandzeile(fach) {
    if (!B.stand) return;
    var f = B.stand.fortgesetzt();
    var zeigeKnopf = B.stand.liegtVor() && B.stand.modus() === 'spiel';
    if (!f && !zeigeKnopf) return;

    var zeile = B.el('div', 'standzeile');
    zeile.style.cssText = 'position:absolute;left:50%;top:12.9%;transform:translateX(-50%);'
      + 'display:flex;align-items:center;gap:calc(var(--s)*16);'
      + 'font-size:max(11px,calc(var(--s)*20));color:#4a3a24;'
      + 'letter-spacing:calc(var(--s)*1);white-space:nowrap;' + LICHTHOF;

    if (f) {
      var t = B.el('span', 'fortgesetzt',
        'fortgesetzt · ' + f.jahr + '/' + f.woche);
      t.setAttribute('data-fortgesetzt', f.jahr + '/' + f.woche);
      t.title = 'Diese Partie lag gespeichert und wurde bei ' + f.jahr
        + ', Woche ' + f.woche + ' wieder aufgenommen.';
      zeile.appendChild(t);
    }

    if (zeigeKnopf) {
      zeile.appendChild(randKnopf({
        text: 'Neue Partie',
        zug: 'kern:neu',
        titel: 'Verwirft den gespeicherten Stand und fängt von vorn an. Mit Rückfrage.',
        tu: function () { neuFrage = true; B.sende('zeichne', { grund: 'kern-neu-frage' }); }
      }));
    }

    fach.appendChild(zeile);
  }

  /* -------------------------------------------------------------------
     DIE RUECKFRAGE.  Auch sie ohne Kasten — und ohne window.confirm().

     `confirm()` waere ein Dialog des Browsers: Playwright weist ihn
     standardmaessig ab, der Knopf taete dann NICHTS, und ein Knopf, der
     sich anfassen laesst und nichts tut, ist nach dem Urteil des Kritikers
     „die teuerste Sorte Luege in einem Spiel, das nach Klicks bewertet
     wird". Also zwei echte Knoepfe mit stabilem data-zug.
     ------------------------------------------------------------------- */
  function zeichneNeuFrage() {
    var fach = B.ebene('blatt', 'kern-neu');
    B.leere(fach);
    if (!neuFrage) return;

    var kasten = B.el('div', 'neu-frage');
    kasten.style.cssText = 'position:absolute;left:50%;top:34%;transform:translateX(-50%);'
      + 'display:flex;flex-direction:column;align-items:center;gap:calc(var(--s)*10);'
      + 'text-align:center;color:#2b1d10;font-family:var(--serif);'
      + 'font-size:max(13px,calc(var(--s)*26));white-space:nowrap;' + LICHTHOF;

    kasten.appendChild(B.el('div', null, 'Neue Partie beginnen?'));
    kasten.appendChild(B.el('div', null,
      'Der gespeicherte Stand — ' + B.welt.zeit.jahr + ', Woche ' + B.welt.zeit.woche
      + ' — wird verworfen und kommt nicht zurück.'));

    var reihe = B.el('div');
    reihe.style.cssText = 'display:flex;gap:calc(var(--s)*24);margin-top:calc(var(--s)*6);';
    reihe.appendChild(randKnopf({
      text: 'Ja, von vorn anfangen', zug: 'kern:neu:ja',
      titel: 'Der Stand wird gelöscht, die Seite lädt neu.',
      tu: function () {
        neuFrage = false;
        B.stand.verwirf();
        /* Neu geladen statt in der Welt herumgeraeumt: `buehne.starte()`
           laeuft genau einmal je Seite, und ein Stueck kann seinen aufbau()
           nicht ein zweites Mal machen. Ein Neuladen ist der einzige Weg,
           der jedem Stueck denselben Anfang gibt wie beim ersten Mal. */
        window.location.reload();
      }
    }));
    reihe.appendChild(randKnopf({
      text: 'Nein, weiterspielen', zug: 'kern:neu:nein',
      titel: 'Die Rückfrage geht weg, die Partie läuft weiter.',
      tu: function () { neuFrage = false; B.sende('zeichne', { grund: 'kern-neu-nein' }); }
    }));
    kasten.appendChild(reihe);
    fach.appendChild(kasten);
  }

  /* -------------------------------------------------------------------
     DER ZIELSATZ.  Welle 13, R3 (Auflage A2) — die zweite Zeile am
     unteren Rand, ueber „naechster Zug: …".

     Den Satz liefert ein STUECK ueber B.welt.meldeZiel(satz, naehe); der
     Rahmen haelt nur den Platz. Meldet niemand, bleibt die Zeile LEER —
     sie erfindet nichts und sie zeigt nichts Altes.
     ------------------------------------------------------------------- */
  function zeichneZiel() {
    var fach = B.ebene('kopf', 'kern');
    var alt = fach.querySelector('.zielzeile');
    if (alt) alt.parentNode.removeChild(alt);

    var ziel = B.welt.bestesZiel ? B.welt.bestesZiel() : null;
    if (!ziel || !ziel.satz) return;

    var w = B.el('div', 'zielzeile');
    w.style.cssText = 'position:absolute;left:93%;top:86.6%;transform:translate(-100%,-50%);'
      + 'font-family:var(--mono);font-size:max(11px,calc(var(--s)*18));color:#3a2a16;'
      + 'white-space:nowrap;' + LICHTHOF;
    w.setAttribute('data-ziel', '1');
    if (ziel.naehe !== null && ziel.naehe !== undefined) {
      w.setAttribute('data-ziel-naehe', B.rund(ziel.naehe, 3));
    }
    w.textContent = 'Ziel: ' + ziel.satz
      + (ziel.naehe !== null && ziel.naehe !== undefined
        ? '  (' + B.zahl(ziel.naehe * 100, 0) + ' % des Wegs)' : '');
    fach.appendChild(w);
  }

  /* -------------------------------------------------------------------
     DIE EINE ZAHL, auf die es nach der Messlatte ankommt:
     Barschaft gegen Preis des naechsten sinnvollen Zuges. Waechst sie
     ueber die Partie, ist es Patrizier IV — und der Lauf ist verloren.
     Sie steht deshalb von Anfang an auf dem Bildschirm, nicht im Quelltext.
     ------------------------------------------------------------------- */
  function zeichneDeckung() {
    var fach = B.ebene('kopf', 'kern');
    var alt = fach.querySelector('.deckung');
    if (alt) alt.parentNode.removeChild(alt);

    var deckung = B.welt.zugDeckung();
    if (deckung === null) return;

    /* WELLE 10 — DIESES BAND WAR EIN KASTEN, UND ES MUSS KEINER SEIN.
       Gemessen im Ladezustand (rahmen-w10/messen.mjs, Verfahren des blinden
       Kritikers): das Band deckte 959x38 = 36.442 px (E1) bzw. 816x38 =
       31.008 px (E4) — 5,2 bzw. 4,4 Punkte des UNTERSTEN SECHSTELS, wo jedes
       Zielblatt seinen Vordergrund traegt. Zusammen mit WEITER stand der
       Rahmen dort bei 7,1–9,6 %; das Zielblatt bei 2,3 %.
       Die ZAHL bleibt (sie ist die zweite Messlatte und gehoert auf den
       Bildschirm, nicht in den Quelltext) — das PAPIER geht. Der Lichthof
       traegt die Schrift, wie er die Hauszeile traegt. */
    var w = B.el('div', 'deckung');
    w.style.cssText = 'position:absolute;left:93%;top:90%;transform:translate(-100%,-50%);'
      + 'font-family:var(--mono);font-size:max(12px,calc(var(--s)*19));color:#2b1d10;'
      + 'font-weight:700;'
      + 'text-shadow:0 0 calc(var(--s)*9) rgba(255,248,230,.98),'
      + '0 0 calc(var(--s)*4) rgba(255,248,230,.98);white-space:nowrap;';
    w.setAttribute('data-deckung', B.rund(deckung, 2));
    w.textContent = 'nächster Zug: ' + B.welt.naechsterZug.was + ' — '
      + B.welt.geld(B.welt.naechsterZug.preis)
      + '  (Kasse reicht ' + B.zahl(deckung, 1) + '×)';
    fach.appendChild(w);
  }

  /* ----------------------------------------------------------------------
     Blaetter: Chronik und Buch
     ---------------------------------------------------------------------- */
  function zeigeBlatt(welches) {
    blattOffen = welches;
    var fach = B.ebene('blatt', 'kern');
    B.leere(fach);
    if (!welches) return;

    var blatt = B.el('div', 'blatt rolle');
    blatt.style.cssText = 'left:18%;top:12%;width:46%;height:70%;';
    blatt.setAttribute('data-blatt', welches);

    var zu = B.knopf({
      text: 'Schließen', zug: 'kern:blatt-zu',
      tu: function () { zeigeBlatt(null); }
    });
    zu.style.cssText = 'position:absolute;right:calc(var(--s)*20);top:calc(var(--s)*18);';

    if (welches === 'chronik') {
      blatt.appendChild(B.el('h2', null, 'Chronik des Hauses'));
      var liste = B.el('div', 'rolle');
      B.welt.chronik.slice().reverse().forEach(function (c) {
        var z = B.el('div', 'zeile');
        z.appendChild(B.el('span', 'wann', c.jahr + ', W' + c.woche));
        z.appendChild(B.el('span', 'was', c.text));
        liste.appendChild(z);
      });
      if (!B.welt.chronik.length) liste.appendChild(B.el('div', 'zeile', 'Noch nichts eingetragen.'));
      blatt.appendChild(liste);
    } else {
      blatt.appendChild(B.el('h2', null, 'Das Buch — was gebucht wurde'));
      var b = B.el('div', 'rolle');
      B.welt.protokollLetzte(60).slice().reverse().forEach(function (p) {
        var z = B.el('div', 'zeile');
        z.appendChild(B.el('span', 'wann', p.jahr + ', W' + p.woche));
        z.appendChild(B.el('span', 'was', ({
          spieler: '', gegner: '[Gegner] ', verfall: '[ohne Hand] '
        }[p.wer] || '') + p.was));
        z.appendChild(B.el('span', 'zahl', p.preis ? B.welt.geld(p.preis) : ''));
        b.appendChild(z);
      });
      if (!B.protokoll.length) b.appendChild(B.el('div', 'zeile', 'Noch nichts gebucht.'));
      blatt.appendChild(b);
    }

    blatt.appendChild(zu);
    fach.appendChild(blatt);
  }

  B.kopf = {
    zeichne: zeichneKopf,
    blatt: zeigeBlatt,
    offenesBlatt: function () { return blattOffen; },
    /* Fuer die Probe: liegt die Rueckfrage an? */
    neuFrageOffen: function () { return neuFrage; }
  };

  /* Der Kern zeichnet sich selbst bei jedem 'zeichne'. */
  B.auf('zeichne', function () {
    B.wage('kopf', zeichneKopf);
    B.wage('kopf-neu-frage', zeichneNeuFrage);
    if (blattOffen) B.wage('kopf-blatt', function () { zeigeBlatt(blattOffen); });
  });
  B.auf('epoche', function (d) {
    B.buehne.setzeEpoche(d.epoche);
    B.ton.bett(d.epoche);
  });

  /* Tastatur: Leertaste und Eingabe schalten weiter. Die Maus bleibt der
     Hauptweg — das ist nur Bequemlichkeit fuer lange Partien. */
  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === ' ' || e.key === 'Enter') {
      var k = document.querySelector('[data-zug="weiter"]');
      if (k && !k.disabled) { e.preventDefault(); k.click(); }
    }
    if (e.key === 'Escape') {
      if (neuFrage) { neuFrage = false; B.sende('zeichne', { grund: 'kern-neu-escape' }); }
      zeigeBlatt(null);
    }
  });

  /* ENTSCHEIDUNG ③ DER AUFSICHT (Welle 13, A6): wer ein Blatt auflegt, nimmt
     es beim Klick auf einen fremden Reiter selbst wieder weg. Das gilt auch
     fuer die Rueckfrage des Rahmens. Gehorcht wird am eigenen Horcher, in
     der Blasenphase; es wird kein fremdes DOM angefasst und dem Reiter nichts
     weggenommen — er tut zusaetzlich, was er ohnehin tut. */
  document.addEventListener('click', function (e) {
    if (!neuFrage) return;
    var el = e.target && e.target.closest ? e.target.closest('[data-zug]') : null;
    if (!el) return;
    var zug = el.getAttribute('data-zug') || '';
    if (zug.indexOf('stadt:reiter:') !== 0) return;
    neuFrage = false;
    B.sende('zeichne', { grund: 'kern-neu-reiter' });
  });

})(BRAUHAUS);
