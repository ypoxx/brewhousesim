/* ===========================================================================
   stuecke/klang.js — DAS STUECK "DER KLANG", sichtbarer Teil.

   Die Arbeit steckt in kern/ton.js (Zustaendigkeit §11). Hier steht nur, was
   auf dem Schirm liegt und was ein Pruefer von aussen greifen kann.

   spiel/index.html ist eingefroren und haengt diese Datei nicht ein — der
   Tonbus haengt sie selbst ein. Faellt das aus, klingt das Spiel trotzdem;
   es fehlt dann nur der Schalter. Deshalb steht hier nichts, wovon der
   Ton abhaengt.

   Der Schalter ist klein und sitzt in der linken unteren Ecke: er darf den
   Blindvergleich der Bildlatte nicht stoeren. Mit ?stumm=1 verschwindet er
   ganz — Bildschirmfotos sehen ihn also nie, wenn man sie stumm macht.
   =========================================================================== */

(function (B) {
  'use strict';

  if (!B || !B.ton) return;

  var ICH = 'klang';

  function fach() { return B.ebene('kopf', ICH); }

  function zeichne() {
    if (B.arg && B.arg.stumm) return;
    var f = fach();
    B.leere(f);

    var an = !B.ton.stumm;
    var laeuft = B.ton.bereit();

    var k = B.knopf({
      text: an ? (laeuft ? '♪' : '♪') : '—',
      zug: 'klang:ton',
      klasse: 'klang-schalter' + (an ? (laeuft ? ' klang-an' : ' klang-wartet') : ' klang-aus'),
      titel: !an ? 'Ton ist aus. Klicken schaltet ihn ein.'
        : (laeuft ? 'Ton laeuft. Klicken schaltet ihn aus.'
          : 'Ton ist bereit — der Browser gibt ihn beim ersten Klick frei.'),
      tu: function () {
        B.ton.setzeStumm(!B.ton.stumm);
        if (!B.ton.stumm) B.ton.wecke();
        zeichne();
      }
    });
    k.setAttribute('aria-label', an ? 'Ton ausschalten' : 'Ton einschalten');
    f.appendChild(k);
  }

  /* Der Schalter zeigt an, ob wirklich etwas klingt — also neu zeichnen,
     wenn sich das aendert. */
  B.auf('ton-schalter', function () { B.wage('klang.schalter', zeichne); });
  B.auf('bereit', function () {
    if (typeof setTimeout === 'function') setTimeout(function () { B.wage('klang.spaet', zeichne); }, 600);
  });

  /* -------------------------------------------------------------------
     Anmeldung. Kommt diese Datei nach buehne.starte() an — und das tut
     sie, weil sie nachtraeglich eingehaengt wird — meldet sie sich nicht
     als Stueck an, sondern haengt sich direkt an 'zeichne'.
     ------------------------------------------------------------------- */
  function anschluss() {
    if (B.buehne && B.buehne.istGestartet && B.buehne.istGestartet()) {
      B.auf('zeichne', function () { B.wage('klang.zeichne', zeichne); });
      B.wage('klang.zeichne', zeichne);
    } else {
      B.stueck(ICH, { aufbau: zeichne, zeichne: zeichne });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { B.wage('klang.anschluss', anschluss); });
  } else {
    B.wage('klang.anschluss', anschluss);
  }

  /* -------------------------------------------------------------------
     Was ein Pruefer von aussen braucht. Alles gibt ein Versprechen
     zurueck, das mit Base64 eines WAV endet — kein ffmpeg, kein Mikrofon.

       await BRAUHAUS.klang.probe(30)        letzte 30 s dieser Partie
       BRAUHAUS.klang.was()                  was gerade zu hoeren war
     ------------------------------------------------------------------- */
  B.klang = {
    probe: function (sek, opt) { return B.ton.wav(sek || 30, opt); },
    was: function (sek) { return B.ton.plan(sek || 30); },
    zeichne: zeichne
  };

})(window.BRAUHAUS);
