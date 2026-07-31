/* ===========================================================================
   stuecke/fuhre.js — STUMMEL fuer DIE FUHRE.
   Ersetze diese Datei vollstaendig.

   Ebene: 'hand' (Faesser, Wagen, Trefferflaechen).

   Was der Stummel schon richtig macht und was bleiben soll:
   · Jede Handlung haengt an einem echten <button> mit sichtbarem deutschem
     Text und stabilem data-zug (BRAUHAUS.knopf). Ziehen darf dazukommen,
     nie als einziger Weg.
   · Mehrere Ziele stehen mit Preisschild NEBENEINANDER und schliessen
     einander aus — genau das zaehlt der Kritiker am Bildschirm.
   · Der Weltzustand wird nur ueber die API veraendert:
     B.welt.zahle / nimm / nimmHeraus / protokolliere.
   =========================================================================== */

(function (B) {
  'use strict';

  function gespann() {
    return FUHRE_DATEN.gespann[B.welt.zeit.epoche] || FUHRE_DATEN.gespann[1];
  }

  /* Was eine Fuhre zu dieser Adresse kostet und einbringt. */
  function rechnung(adresse) {
    var g = gespann();
    var fass = Math.min(g.fass, B.welt.vorrat.faesser.length);
    var weg = Math.max(1, Math.round(adresse.km * g.kostenJeKm));
    var erloes = Math.round(fass * [9, 22, 48, 130][B.welt.zeit.epoche - 1]);
    return { fass: fass, kosten: weg, erloes: erloes, netto: erloes - weg };
  }

  function fahre(adresse) {
    var r = rechnung(adresse);
    if (!r.fass) {
      B.welt.schreibe('Keine Fuhre: der Keller ist leer.', 'fuhre');
      return;
    }
    if (!B.welt.zahle(r.kosten, 'Fuhre nach ' + adresse.name + ' (' + adresse.km + ' km)', 'spieler')) return;
    B.welt.nimmHeraus(r.fass);
    B.welt.nimm(r.erloes, r.fass + ' Fass an ' + adresse.name, 'spieler');
    B.welt.protokolliere({
      wer: 'spieler', was: 'geliefert an ' + adresse.name,
      preis: 0, menge: r.fass, adresse: adresse.schluessel
    });
    B.welt.binde(adresse.schluessel, 'haus', 'Lieferung', B.welt.zeit.jahr + 1);
    B.ton.spiele('fuhre:abfahrt', { ort: 'tor' });
    B.sende('zeichne', { grund: 'fuhre' });
  }

  /* Ein Sud, damit der Kreislauf im Stummel ueberhaupt laeuft: ohne Bier
     keine Fuhre, ohne Fuhre kein Geld. Welches Stueck das Brauen am Ende
     bekommt, ist NICHT entschieden — hier steht es nur, damit ein Kritiker
     eine geschlossene Schleife vorfindet. */
  function sudKosten() {
    return Math.max(1, Math.round([6, 14, 30, 90][B.welt.zeit.epoche - 1]));
  }

  function braue() {
    var e = B.welt.epoche();
    var menge = B.welt.haus.sudJeWoche;
    if (B.welt.vorrat.faesser.length >= B.welt.vorrat.plaetze) {
      B.welt.schreibe('Kein Platz im Keller. Erst muss Bier hinaus.', 'sud');
      return;
    }
    if (!B.welt.zahle(sudKosten(), 'Ein Sud ' + e.sorte, 'spieler')) return;
    var gelegt = B.welt.legeEin(e.sorte, menge);
    B.welt.protokolliere({ wer: 'spieler', was: gelegt + ' Fass ' + e.sorte + ' eingelegt', preis: 0, menge: gelegt });
    B.ton.spiele('sud:kochen', { ort: 'kesselstelle' });
    B.sende('zeichne', { grund: 'sud' });
  }

  BRAUHAUS.stueck('fuhre', {

    aufbau: function () {},

    zeichne: function () {
      var fach = B.ebene('hand', 'fuhre');
      B.leere(fach);

      var g = gespann();

      /* Der Wagen steht am Tor. */
      var wagen = B.el('div', 'fuhre-wagen stummel');
      wagen.appendChild(B.el('div', 'name', g.name));
      wagen.appendChild(B.el('div', null, 'fasst ' + g.fass + ' Fass · ' + g.reichweite + ' km'));
      B.orte.setze(wagen, 'tor', { anker: 'mitte', dy: 6 });
      fach.appendChild(wagen);

      /* Die Faesser im Hof — eine Menge, die man sieht statt liest. */
      var lager = B.el('div', 'fuhre-lager stummel');
      lager.appendChild(B.el('div', 'name', 'Keller'));
      lager.appendChild(B.el('div', null,
        B.welt.menge(B.welt.vorrat.faesser.length) + ' von '
        + B.welt.menge(B.welt.vorrat.plaetze)));
      B.orte.setze(lager, 'fasslager', { anker: 'mitte' });
      fach.appendChild(lager);

      /* Der Kessel: die offene Pfanne ueber offenem Feuer (Sperrliste). */
      var voll = B.welt.vorrat.faesser.length >= B.welt.vorrat.plaetze;
      fach.appendChild(B.knopf({
        text: 'Sud ansetzen · ' + B.welt.menge(B.welt.haus.sudJeWoche),
        zug: 'fuhre:sud',
        preis: -sudKosten(),
        ort: 'kesselstelle',
        anker: 'mitte',
        dy: 5,
        aus: voll,
        titel: voll ? 'Der Keller ist voll.' : 'Offene Pfanne ueber offenem Feuer. ' + B.welt.epoche().sorte + '.',
        tu: braue
      }));
      B.welt.meldeZug('Sud', sudKosten());

      /* Drei Ziele nebeneinander, jedes mit Preisschild. */
      var wahl = B.el('div', 'fuhre-wahl');
      wahl.appendChild(B.el('div', 'ueber', 'Wohin faehrt die Fuhre? (nur eine je Woche)'));

      var ziele = B.welt.adressenJetzt().slice(0, 3);
      var billigster = null;
      ziele.forEach(function (a) {
        var r = rechnung(a);
        if (billigster === null || r.kosten < billigster) billigster = r.kosten;
        var k = B.knopf({
          text: a.name + ' · ' + a.km + ' km · ' + B.welt.menge(r.fass),
          zug: 'fuhre:fahre:' + a.schluessel,
          preis: -r.kosten,
          titel: 'Bringt ' + B.welt.geld(r.erloes) + ' ein. '
               + (a.bindung ? 'Gebunden an ' + (a.bindung.wem === 'haus' ? 'das Haus' : a.bindung.wem) + '.' : 'Frei.'),
          aus: !r.fass,
          tu: function () { fahre(a); }
        });
        wahl.appendChild(k);
      });

      if (billigster !== null) B.welt.meldeZug('Fuhre', billigster);

      B.orte.setze(wahl, 'strasse', { anker: 'mitte', dy: -4 });
      fach.appendChild(wahl);
    }
  });

})(BRAUHAUS);
