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

    /* Haus und Generation, klein unter der Leiste. */
    var haus = B.el('div', 'hauszeile');
    haus.style.cssText = 'position:absolute;left:50%;top:10.4%;transform:translateX(-50%);'
      + 'font-size:calc(var(--s)*22);color:#2b1d10;letter-spacing:calc(var(--s)*2);'
      + 'text-shadow:0 0 calc(var(--s)*10) rgba(255,248,230,.95);white-space:nowrap;';
    haus.textContent = B.welt.haus.name + ' · ' + B.uhr.braujahr() + ' · '
      + z.amtszeit.name + ', ' + z.amtszeit.eigenschaftName
      + ' · ' + e.name;
    fach.appendChild(haus);

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
    /* Die Stuecke melden ihren naechsten Zug erst NACH diesem Horcher an.
       Ein Bildaufbau spaeter steht die Zahl richtig da. */
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function () { B.wage('kopf.deckung', zeichneDeckung); });
    }
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

    var w = B.el('div', 'deckung');
    w.style.cssText = 'position:absolute;left:93%;top:90%;transform:translate(-100%,-50%);'
      + 'font-family:var(--mono);font-size:calc(var(--s)*19);color:#2b1d10;'
      + 'background:rgba(255,248,230,.75);padding:calc(var(--s)*4) calc(var(--s)*10);'
      + 'border-radius:calc(var(--s)*4);white-space:nowrap;';
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
    offenesBlatt: function () { return blattOffen; }
  };

  /* Der Kern zeichnet sich selbst bei jedem 'zeichne'. */
  B.auf('zeichne', function () {
    B.wage('kopf', zeichneKopf);
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
    if (e.key === 'Escape') zeigeBlatt(null);
  });

})(BRAUHAUS);
