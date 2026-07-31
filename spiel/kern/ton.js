/* ===========================================================================
   kern/ton.js — DER TONBUS.  GEHOERT DEM SKELETT-BAUER.

   Im Skelett ein Nichtstuer: er spielt nichts, laedt nichts, fordert nichts
   aus dem Netz an. Er merkt sich nur, WAS wann angefordert wurde.

   Damit kann jedes Stueck von Anfang an BRAUHAUS.ton.spiele('sud:kochen')
   rufen. In Welle 2 wird hier die echte Wiedergabe eingehaengt — ohne dass
   eine einzige Stueck-Datei angefasst werden muss. Das ist der Grund, warum
   dieser Nichtstuer im Skelett steht und nicht spaeter dazukommt.

   Tonlatte: dreissig Sekunden ohne Bild, ein fremdes Ohr nennt Epoche und
   Vorgang. Deshalb bekommt jeder Ruf die Epoche mitgegeben — der spaetere
   Tonbauer soll 1350 anders klingen lassen als 1970, am selben Hof.
   =========================================================================== */

(function (B) {
  'use strict';

  var LAUT = 0.8;
  var STUMM = true;              /* im Skelett immer stumm */

  var T = {

    /* Was angefordert wurde. Ringpuffer, damit nichts vollaeuft. */
    protokoll: [],
    proben: {},                  /* name -> {datei, art, epoche} — fuellt Welle 2 */

    get stumm() { return STUMM; },

    /* Ein Stueck meldet eine Probe an. Im Skelett wird sie nur vermerkt. */
    melde: function (name, beschreibung) {
      T.proben[name] = beschreibung || {};
      return name;
    },

    /* Der Ruf, den die Stuecke benutzen.
       BRAUHAUS.ton.spiele('fass:rollen', {ort:'fasslager', laut:0.6}) */
    spiele: function (name, opt) {
      opt = opt || {};
      var e = (B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1;
      T.protokoll.push({
        name: String(name),
        art: opt.art || 'geraeusch',
        ort: opt.ort || null,
        laut: opt.laut === undefined ? LAUT : opt.laut,
        epoche: e,
        jahr: (B.welt && B.welt.zeit) ? B.welt.zeit.jahr : null,
        woche: (B.welt && B.welt.zeit) ? B.welt.zeit.woche : null,
        zeit: Date.now()
      });
      if (T.protokoll.length > 300) T.protokoll.splice(0, 100);
      B.sende('ton', { name: name, opt: opt, epoche: e });
      return false;                        /* nichts erklungen */
    },

    /* Dauerton (Hofgeraeusch, Musik). Im Skelett ebenfalls nur vermerkt. */
    schleife: function (name, opt) { return T.spiele(name, Object.assign({ art: 'schleife' }, opt || {})); },

    halt: function (name) { return T.spiele(name || '*', { art: 'halt' }); },

    /* Epochenbett — ein Ruf je Epochenwechsel, den kopf.js schon absetzt. */
    bett: function (epoche) { return T.spiele('bett:epoche' + epoche, { art: 'schleife' }); },

    setzeStumm: function (an) { STUMM = !!an; },
    setzeLaut: function (l) { LAUT = B.grenze(l, 0, 1); }
  };

  B.ton = T;

  if (B.arg.stumm) T.setzeStumm(true);

})(BRAUHAUS);
