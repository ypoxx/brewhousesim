/* ===========================================================================
   kern/basis.js — Namensraum und Handwerkszeug.  GEHOERT DEM SKELETT-BAUER.

   Alles im Spiel haengt an dem einen globalen Objekt BRAUHAUS. Keine Module,
   kein import, kein Netz. Diese Datei wird als erste geladen.
   =========================================================================== */

var BRAUHAUS = window.BRAUHAUS || {};
window.BRAUHAUS = BRAUHAUS;

(function (B) {
  'use strict';

  B.fassung = '1.0-skelett';

  /* ----------------------------------------------------------------------
     Lage: was schiefgegangen ist, ohne dass die Seite es merkt.
     WICHTIG: console.error zaehlt in werkbank/schuss.mjs als Seitenfehler und
     verliert die Runde. Ein kaputtes Stueck darf die anderen drei nicht mit in
     den Abgrund ziehen. Deshalb wird hier NIE geworfen und NIE .error benutzt;
     alles landet in B.lage und (als Warnung) in der Konsole.
     ---------------------------------------------------------------------- */
  B.lage = [];

  B.klage = function (wo, fehler) {
    var text = wo + ': ' + (fehler && fehler.message ? fehler.message : fehler);
    B.lage.push({ wo: wo, text: text, zeit: Date.now() });
    if (window.console && console.warn) console.warn('[brauhaus] ' + text);
    B.zeigeLage();
  };

  /* Fuehrt fn aus und schluckt jeden Fehler. Gibt zurueck, ob es geklappt hat. */
  B.wage = function (wo, fn) {
    try { fn(); return true; }
    catch (e) { B.klage(wo, e); return false; }
  };

  B.zeigeLage = function () {
    if (!B.arg || !B.arg.pruefe) return;
    var kasten = document.getElementById('kern-lage');
    if (!kasten) {
      kasten = document.createElement('div');
      kasten.id = 'kern-lage';
      if (document.body) document.body.appendChild(kasten);
    }
    kasten.textContent = B.lage.length
      ? 'LAGE\n' + B.lage.map(function (l) { return '· ' + l.text; }).join('\n')
      : 'LAGE: sauber';
  };

  /* ----------------------------------------------------------------------
     DOM-Handwerk. Jedes Stueck darf das benutzen; niemand muss.
     ---------------------------------------------------------------------- */

  /* B.el('div','stummel gross','Text') oder B.el('div',{class:'x',text:'y'}) */
  B.el = function (tag, klasseOderOpt, text) {
    var el = document.createElement(tag || 'div');
    var opt = klasseOderOpt;
    if (typeof opt === 'string') opt = { klasse: opt };
    opt = opt || {};
    if (opt.klasse) el.className = opt.klasse;
    if (opt.class) el.className = opt.class;
    if (opt.id) el.id = opt.id;
    if (opt.stil) el.setAttribute('style', opt.stil);
    if (opt.titel) el.title = opt.titel;
    if (opt.daten) {
      for (var k in opt.daten) {
        if (Object.prototype.hasOwnProperty.call(opt.daten, k)) el.setAttribute('data-' + k, opt.daten[k]);
      }
    }
    var t = (text !== undefined) ? text : opt.text;
    if (t !== undefined && t !== null) el.textContent = String(t);
    return el;
  };

  B.leere = function (el) {
    if (!el) return el;
    while (el.firstChild) el.removeChild(el.firstChild);
    return el;
  };

  /* Zahlen deutsch: 14250 -> "14.250" ; 12.5 -> "12,5" */
  B.zahl = function (n, stellen) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    var k = (stellen === undefined) ? 0 : stellen;
    var neg = n < 0;
    var s = Math.abs(n).toFixed(k);
    var teile = s.split('.');
    teile[0] = teile[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return (neg ? '−' : '') + teile.join(',');
  };

  B.grenze = function (n, min, max) { return n < min ? min : (n > max ? max : n); };

  /* Runde auf eine Stelle — damit Preise nicht in Gleitkommastaub zerfallen. */
  B.rund = function (n, stellen) {
    var f = Math.pow(10, stellen || 0);
    return Math.round(n * f) / f;
  };

  /* ----------------------------------------------------------------------
     URL-Parameter. Ohne sie ist die Bildlatte nicht messbar:
     ?epoche=1..4  &jahr=  &woche=  &saat=
     Dazu: &orte=1 (Ortsverzeichnis einblenden), &pruefe=1 (Lage einblenden),
           &stumm=1 (Ton aus), &blatt=chronik (Blatt offen aufnehmen)

     &neu=1 — WELLE 13, R2. DER SCHALTER DER MESSENDEN HAND.
     Er startet eine frische Partie, laedt keinen Spielstand und SCHREIBT
     KEINEN; beim Anlassen faellt jeder Schluessel `brauhaus:*` aus dem
     Speicher. Ohne ihn waere die zweite Messlatte ab dem zweiten Lauf nicht
     mehr messbar: jede Zahl dieses Laufs seit Welle 7 steht auf „dieselbe
     Saat, dieselbe Partie", und ein zurueckgeladener Stand macht daraus eine
     andere. Siehe kern/stand.js.
     ---------------------------------------------------------------------- */
  B.arg = (function () {
    var a = {};
    var roh = String(window.location.search || '').replace(/^\?/, '');
    roh.split('&').forEach(function (paar) {
      if (!paar) return;
      var i = paar.indexOf('=');
      var k = decodeURIComponent(i < 0 ? paar : paar.slice(0, i));
      var v = i < 0 ? '1' : decodeURIComponent(paar.slice(i + 1).replace(/\+/g, ' '));
      a[k] = v;
    });
    return {
      roh: a,
      epoche: a.epoche ? parseInt(a.epoche, 10) : null,
      jahr: a.jahr ? parseInt(a.jahr, 10) : null,
      woche: a.woche ? parseInt(a.woche, 10) : null,
      saat: a.saat ? parseInt(a.saat, 10) : null,
      orte: a.orte === '1' || a.orte === 'ja',
      pruefe: a.pruefe === '1' || a.pruefe === 'ja',
      stumm: a.stumm === '1' || a.stumm === 'ja',
      neu: a.neu === '1' || a.neu === 'ja',
      blatt: a.blatt || null
    };
  }());

})(BRAUHAUS);
