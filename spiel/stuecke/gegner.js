/* ===========================================================================
   stuecke/gegner.js — STUMMEL fuer DER GEGNER.
   Ersetze diese Datei vollstaendig.

   Ebene: 'marken' (Schilder, Zeichen, Gegnerzuege).

   Was der Stummel schon richtig macht und was bleiben MUSS:
   · Der Gegner zieht JEDE Woche, ohne dass der Spieler etwas tut, und jeder
     Zug landet mit wer:'gegner' im Protokoll. Ein Gegner, der nur ankuendigt,
     verliert gegen Victoria 3 und Rise of Industry — das ist der Punkt.
   · Der Zug ist am Bildschirm sichtbar (eine Marke am Ort des Gegners),
     nicht nur in einer Liste.
   · Er greift auf dieselben Adressen zu wie DIE FUHRE — ueber welt.binde(),
     nie ueber eigenen Zustand.
   =========================================================================== */

(function (B) {
  'use strict';

  var letzteZuege = [];        /* nur Anzeige; die Wahrheit steht im Protokoll */

  function zieht(g) {
    var e = B.welt.zeit.epoche;
    var muster = GEGNER_DATEN.zuege[e] || GEGNER_DATEN.zuege[1];
    var wort = B.wuerfel.aus(muster);
    var frei = B.welt.adressenJetzt().filter(function (a) {
      return !a.bindung || a.bindung.wem !== 'adler';
    });

    var text = B.welt.gegnerName(g) + ' ' + wort;
    var adresse = null;

    if (/ $/.test(wort) && frei.length) {
      adresse = B.wuerfel.aus(frei);
      text += adresse.name;
      B.welt.binde(adresse.schluessel, g.schluessel, 'Vertrag', B.welt.zeit.jahr + B.wuerfel.ganz(1, 3));
    } else if (/ $/.test(wort)) {
      text += 'Markt';
    }

    g.zuege += 1;
    B.welt.protokolliere({
      wer: 'gegner', was: text, preis: 0,
      adresse: adresse ? adresse.schluessel : null
    });
    letzteZuege.unshift({ jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, text: text });
    if (letzteZuege.length > 4) letzteZuege.length = 4;
  }

  BRAUHAUS.stueck('gegner', {

    aufbau: function () {},

    /* Laeuft bei jedem Wochenwechsel — ohne Zutun des Spielers. */
    woche: function () {
      B.welt.gegnerJetzt().forEach(function (g) {
        if (B.wuerfel.trifft(g.wagemut)) zieht(g);
      });
    },

    jahr: function () {
      B.welt.gegnerJetzt().forEach(function (g) {
        B.welt.schreibe(B.welt.gegnerName(g) + ' hat im vergangenen Jahr '
          + g.zuege + ' Mal gehandelt.', 'gegner');
      });
    },

    zeichne: function () {
      var fach = B.ebene('marken', 'gegner');
      B.leere(fach);

      B.welt.gegnerJetzt().forEach(function (g) {
        var ort = B.welt.gegnerOrt(g);
        if (!B.orte.da(ort)) ort = 'marktplatz';
        var m = B.el('div', 'gegner-marke stummel');
        m.appendChild(B.el('div', 'name', B.welt.gegnerName(g)));
        m.appendChild(B.el('div', null, g.zuege + ' Zuege bisher'));
        B.orte.setze(m, ort, { anker: 'mitte' });
        fach.appendChild(m);
      });

      /* Was geschah, waehrend der Spieler woanders hinsah. */
      if (letzteZuege.length) {
        var zettel = B.el('div', 'gegner-zettel');
        zettel.appendChild(B.el('div', 'ueber', 'Ohne dich geschehen'));
        letzteZuege.forEach(function (z) {
          zettel.appendChild(B.el('div', 'zeile', z.jahr + ', W' + z.woche + ': ' + z.text));
        });
        B.orte.setze(zettel, 'muehle', { anker: 'mitte', dy: 18 });
        fach.appendChild(zettel);
      }
    }
  });

})(BRAUHAUS);
