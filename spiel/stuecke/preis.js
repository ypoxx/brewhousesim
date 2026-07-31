/* ===========================================================================
   stuecke/preis.js — STUMMEL fuer DER PREIS.
   Ersetze diese Datei vollstaendig.

   Ebene: 'blatt' (Michaeli-Blatt, Chronik, Panels).

   Was der Stummel schon richtig macht:
   · Ein Blatt, das aufgeht, statt eines Reiters, der umschaltet.
   · Optionen, die einander AUSSCHLIESSEN, mit Preisschild nebeneinander.
   · Eine UNWIDERRUFLICHE Festlegung (der gebundene Preis) — die zaehlt der
     Kritiker gesondert, und ohne sie ist ein Wirtschaftsspiel harmlos.
   =========================================================================== */

(function (B) {
  'use strict';

  var offen = false;
  var gebundenBis = 0;

  function tafel() {
    return PREIS_DATEN.epochen[B.welt.zeit.epoche] || PREIS_DATEN.epochen[1];
  }

  function setzePreis(neu, wieLange, wort) {
    B.welt.haus.preis = neu;
    if (wieLange) {
      gebundenBis = B.welt.zeit.jahr + wieLange;
      B.welt.schreibe('Der Preis ist gebunden: ' + B.welt.geld(neu) + ' je '
        + tafel().einheit + ' bis ' + gebundenBis + '. Zurueck geht das nicht.', 'preis');
    }
    B.welt.protokolliere({ wer: 'spieler', was: wort + ' — ' + B.welt.geld(neu) + ' je ' + tafel().einheit, preis: 0 });
    B.ton.spiele('preis:setzen');
    B.sende('zeichne', { grund: 'preis' });
  }

  BRAUHAUS.stueck('preis', {

    aufbau: function () {
      if (B.welt.haus.preis === undefined) B.welt.haus.preis = tafel().mitte;
    },

    zeichne: function () {
      var fach = B.ebene('blatt', 'preis');
      B.leere(fach);
      var t = tafel();
      var jetzt = B.welt.haus.preis || t.mitte;
      var gebunden = gebundenBis > B.welt.zeit.jahr;

      /* Der Griff: immer sichtbar, immer ein echter Knopf. */
      var griff = B.knopf({
        text: offen ? 'Preisblatt schliessen' : 'Preisblatt · ' + B.welt.geld(jetzt) + ' je ' + t.einheit,
        zug: 'preis:blatt',
        tu: function () { offen = !offen; B.sende('zeichne', { grund: 'preis-blatt' }); }
      });
      griff.classList.add('preis-griff');
      B.orte.setze(griff, 'marktstand', { anker: 'links', dy: -6 });
      fach.appendChild(griff);

      if (!offen) {
        B.welt.meldeZug('Preis binden', Math.max(1, Math.round(jetzt * 0.5)));
        return;
      }

      var blatt = B.el('div', 'blatt preis-blatt');
      blatt.style.cssText = 'left:6%;top:24%;width:34%;';
      blatt.appendChild(B.el('h2', null, 'Der Preis — ' + B.welt.epoche().name));
      blatt.appendChild(B.el('div', 'satz', t.sagt));
      blatt.appendChild(B.el('div', 'satz',
        'Jetzt: ' + B.welt.geld(jetzt) + ' je ' + t.einheit
        + '   ·   ' + (gebunden ? 'gebunden bis ' + gebundenBis : 'frei')));

      var reihe = B.el('div', 'preis-reihe');
      [
        { wort: 'Senken', neu: Math.max(1, jetzt - Math.round(t.spanne / 2)),
          sagt: 'Mehr Haeuser nehmen dich. Der Ruf sinkt mit.' },
        { wort: 'Halten', neu: jetzt, sagt: 'Nichts aendern ist auch eine Wahl.' },
        { wort: 'Heben', neu: jetzt + Math.round(t.spanne / 2),
          sagt: 'Weniger Haeuser, mehr je Fass. Der Gegner freut sich.' }
      ].forEach(function (w) {
        reihe.appendChild(B.knopf({
          text: w.wort + ' auf ' + B.welt.geld(w.neu),
          zug: 'preis:' + w.wort.toLowerCase(),
          titel: w.sagt,
          aus: gebunden,
          tu: function () { setzePreis(w.neu, 0, w.wort); }
        }));
      });
      blatt.appendChild(reihe);

      /* Die unwiderrufliche Festlegung. */
      blatt.appendChild(B.knopf({
        text: 'Preis auf fuenf Jahre binden',
        zug: 'preis:binden',
        preis: -Math.max(1, Math.round(jetzt * 0.5)),
        klasse: 'preis-bindung',
        titel: 'Unwiderruflich. Fuenf Jahre lang kein anderer Preis, egal was kommt.',
        aus: gebunden,
        tu: function () {
          if (B.welt.zahle(Math.max(1, Math.round(jetzt * 0.5)), 'Preisbindung beim Rat', 'spieler')) {
            setzePreis(jetzt, 5, 'Preis gebunden');
          }
        }
      }));

      fach.appendChild(blatt);
    }
  });

})(BRAUHAUS);
