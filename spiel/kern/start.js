/* ===========================================================================
   kern/start.js — DER ANLASSER.  GEHOERT DEM SKELETT-BAUER.
   Muss als letztes Skript stehen: erst wenn alle Stuecke sich angemeldet
   haben, wird gebaut.

   URL-Parameter (ohne sie ist die Bildlatte nicht messbar):
     ?epoche=1..4   springt in die Schau-Epoche (1350 / 1600 / 1884 / 1970)
     &jahr=1884     genaues Jahr
     &woche=1..30   genaue Woche
     &saat=1350     Wuerfelsaat — dieselbe Saat, dieselbe Partie
     &orte=1        Ortsverzeichnis als Punkte einblenden
     &blatt=chronik ein Blatt offen aufnehmen
     &pruefe=1      Lage-Anzeige (was ein Stueck geworfen hat)
     &stumm=1       Ton aus

   Vier Aufrufe von werkbank/schuss.mjs fotografieren damit vier Epochen:
     .../spiel/?epoche=1  ...  ?epoche=4
   =========================================================================== */

(function (B) {
  'use strict';

  function los() {
    if (B.arg.saat) B.wuerfel.setze(B.arg.saat);

    B.wage('welt.aufbau', function () {
      B.welt.aufbau({
        epoche: B.arg.epoche || 1,
        jahr: B.arg.jahr,
        woche: B.arg.woche
      });
    });

    if (!B.welt.zeit) {                       /* Notfallwelt, damit nie eine leere Seite steht */
      B.welt.zeit = { jahr: 1350, woche: 1, epoche: 1, ende: false,
                      amtszeit: { nr: 1, name: 'Unbekannt', eigenschaftName: '—', seit: 1350, bis: 1380 } };
    }

    B.wage('buehne.starte', function () { B.buehne.starte(); });
    B.wage('kopf', function () { B.kopf.zeichne(); });

    if (B.arg.orte) B.wage('orte.verzeichnis', function () { B.orte.zeigeVerzeichnis(true); });
    if (B.arg.blatt) B.wage('start.blatt', function () { B.kopf.blatt(B.arg.blatt); });
    B.zeigeLage();

    B.ton.bett(B.welt.zeit.epoche);
    B.sende('bereit', { jahr: B.welt.zeit.jahr, epoche: B.welt.zeit.epoche });

    /* Ein Zeichen fuer Playwright und fuer den Kritiker: die Partie laeuft. */
    document.getElementById('buehne').setAttribute('data-bereit', '1');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { B.wage('start', los); });
  } else {
    B.wage('start', los);
  }

})(BRAUHAUS);
