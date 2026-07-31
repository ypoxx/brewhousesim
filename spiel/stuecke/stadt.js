/* ===========================================================================
   stuecke/stadt.js — STUMMEL fuer DIE STADT.
   Ersetze diese Datei vollstaendig.

   Ebenen: 'platte' (das Epochenbild) und 'bau' (was darauf gebaut wurde).
   Der Stummel malt bis dahin eine farbige Platzhalterflaeche je Epoche und
   setzt an JEDEN Ort aus kern/orte.js eine beschriftete Marke. Damit sieht
   jeder Bauer sofort, wo sein Ding hingehoert — und die Aufnahme ist nie leer.

   REGELN, die fuer dieses Stueck gelten:
   · Alles wird ueber BRAUHAUS.orte.setze(el,'schluessel') gesetzt. Nie feste
     Pixel, nie eigene Koordinaten. Nur so bleibt es "derselbe Ort".
   · Sperrliste: offene Pfanne statt Destillierblase, kein Emailschild vor
     den 1890ern, keine Bahn in 1600, kein Hopfen in 1350.
   =========================================================================== */

(function (B) {
  'use strict';

  BRAUHAUS.stueck('stadt', {

    aufbau: function () {
      /* Nichts vorzubauen: der Stummel zeichnet alles in zeichne(). */
    },

    zeichne: function () {
      var e = B.welt.zeit.epoche;
      var daten = STADT_DATEN.epochen[e] || STADT_DATEN.epochen[1];

      /* --- Ebene 'platte': das Epochenbild ------------------------------ */
      var platte = B.ebene('platte', 'stadt');
      B.leere(platte);

      var flaeche = B.el('div', 'stadt-platzhalter');
      flaeche.setAttribute('data-epoche', String(e));
      platte.appendChild(flaeche);

      var schild = B.el('div', 'stadt-schild');
      schild.appendChild(B.el('div', 'kopf', 'DIE STADT — Stummel'));
      schild.appendChild(B.el('div', 'jahr', daten.jahr + ' · ' + daten.name));
      schild.appendChild(B.el('div', 'text', daten.sagt));
      schild.appendChild(B.el('div', 'text', 'Hier gehoert ' + daten.platte + ' hin.'));
      platte.appendChild(schild);

      /* --- Ebene 'bau': jeder Ort einmal, beschriftet -------------------- */
      var bau = B.ebene('bau', 'stadt');
      B.leere(bau);

      /* Der Punkt sitzt genau auf dem Ort; nur die Beschriftung weicht aus,
         damit eng benachbarte Orte (hof/kesselstelle, muehle/bruecke_oben)
         lesbar bleiben. */
      var gesetzt = [];
      B.orte.liste(e).forEach(function (o) {
        if (o.art === 'ui') return;
        var stufe = gesetzt.filter(function (v) {
          return Math.abs(v.x - o.x) < 7 && Math.abs(v.y - o.y) < 6;
        }).length;
        gesetzt.push(o);
        var m = B.el('div', 'stadt-ort art-' + o.art);
        m.style.setProperty('--stufe', stufe);
        m.appendChild(B.el('i'));
        m.appendChild(B.el('span', 'wort', o.name));
        m.appendChild(B.el('span', 'zahl', o.x + '/' + o.y));
        m.title = o.schluessel + ' — ' + (o.sagt || '');
        B.orte.setze(m, o.schluessel, { anker: 'mitte' });
        bau.appendChild(m);
      });
    }
  });

})(BRAUHAUS);
