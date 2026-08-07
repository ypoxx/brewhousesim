/* ===========================================================================
   kern/runde.js — DIE KLEMMENWACHE.  GEHOERT DEM SKELETT.  Neu in Welle 12.

   ---------------------------------------------------------------------------
   WAS ES ABSTELLT — gemessen, nicht vermutet
   ---------------------------------------------------------------------------
   Am Stand 7a1a942 spielte 1350 bei EINER Saat ZWEI Partien: rho +0,191 /
   -0,521 / +0,191 in drei einzeln gemessenen Laeufen. Die Trennprobe
   (`werkbank/schuss/aufsicht/welle11-trennprobe/`) fand keinen Verursacher
   unter den drei Stuecken, die in Welle 11 gearbeitet haben — und hatte
   recht: die Ursache gehoert keinem Stueck, sondern der Luecke zwischen
   zweien.

   Die Rohdaten sagen, wo: die beiden Reihen sind bis Woche 60 Ziffer fuer
   Ziffer gleich und gehen in Woche 61 auseinander — Michaeli 1352. Der
   Unterschied ist EIN KLICK, und die Ursache ist eine LUEGE AUF EINEM KNOPF:

     1  DIE STADT entscheidet die Platzordnung (`stadt.js` nachsehen()) und
        setzt `stadt-zugeklappt` auf ein FREMDES Brett. Sie sendet dabei kein
        'zeichne' — niemand erfaehrt es.
     2  DER PREIS sieht deshalb nach einer WANDUHRFRIST von 420 ms nach
        (`stuecke/preis.js:2737` seheNachRahmen) und zeichnet erst dann neu.
     3  In der Zeit dazwischen sagt der Knopf `preis:tafel` „Michaelitafel
        schliessen", obwohl nichts auf dem Tisch liegt.
     4  Die messende Hand wartet nach jedem Klick zwei Bildaufbauten (~33 ms).
        420 ms sind zwoelfmal so lang. Ob sie vor oder nach dem Nachsehen
        liest, haengt an der Last der Maschine — und entscheidet die Partie.

   Nachgestellt mit `werkbank/schuss/rahmen-w12/rennen.mjs` (62 Wochen,
   `Emulation.setCPUThrottlingRate`): Drossel 1x und 2x geben Partie A
   (LEITER leer, Kasse an Michaeli 1352 = 164), Drossel 3x/4x/6x geben
   Partie B (LEITER drei Zeilen, Kasse 119). Das sind Ziffer fuer Ziffer die
   beiden Partien des vollen 400-Wochen-Standes.

   ---------------------------------------------------------------------------
   DIE REGEL, IN EINEM SATZ
   ---------------------------------------------------------------------------
   WER EIN FREMDES BRETT WEGKLAPPT, LOEST EIN NEUZEICHNEN AUS — SOFORT.
   Der Rahmen hoert auf die Klemmklassen (`stadt-zugeklappt`,
   `stadt-verdeckt`, `kern-blatt-zu`). Aendert sich, WER geklemmt liegt,
   schickt er `zeichne`, damit kein Knopf eine Lage beschriftet, die es nicht
   mehr gibt. Das haengt an einem EREIGNIS, nicht an einer Uhr: es kostet
   nichts, solange nichts geklappt wird, und es ist von der Last der Maschine
   unabhaengig.

   Der MutationObserver laeuft als Mikrotask — also im selben Bildaufbau, in
   dem geklappt wurde, und lange bevor die messende Hand ihre zwei Bilder
   abgewartet hat. Die 420-ms-Frist DES PREISES findet danach nichts mehr zu
   tun; sie schadet nur noch sich selbst.

   ---------------------------------------------------------------------------
   DER FEHLER DER ERSTEN FASSUNG — er steht hier, weil er teuer war
   ---------------------------------------------------------------------------
   Die erste Fassung ging weiter: sie fing waehrend einer Zeichenrunde JEDEN
   `setTimeout` (bis 1200 ms) und JEDES `requestAnimationFrame` ab und
   arbeitete sie am Rundenende in Mikrotasks ab — „ein Bildaufbau ist eine
   Runde, und eine Runde hat ein Ende".

   Fuer 1350 hat das gewirkt: sechs 400-Wochen-Laeufe, EINE Pruefsumme
   (`f250961e4ff7`), und der Drosselfaecher 1x/2x/3x/4x/6x lieferte fuenfmal
   dieselbe Partie. Es hat aber ZWEI ANDERE EPOCHEN VERDORBEN, und das ist
   gemessen:

     1600  Vorzustand 3 Laeufe / 1 Pruefsumme   ->  3 Laeufe / 2 Pruefsummen
     1884  Vorzustand 3 Laeufe / 1 Pruefsumme   ->  3 Laeufe / 3 Pruefsummen

   Der Grund liegt auf der Hand, sobald man ihn gesehen hat: `fuhre.js:2541`
   misst `clientHeight`/`scrollHeight` einer Liste und rechnet daraus einen
   Massstab. In einem Bildaufbau gemessen ist das Layout fertig; in einem
   Mikrotask unmittelbar nach dem Umbau ist es das nicht unbedingt. Ein
   anderer Massstab heisst andere Knopfgroessen, und eine andere Knopfgroesse
   heisst, dass ein Klick der messenden Hand trifft oder nicht.

   **Ein Rahmen darf die Zeitrechnung fremder Stuecke nicht umschreiben.**
   Er darf ihnen sagen, WANN etwas zu tun ist (ein Ereignis), nicht WIE
   ihre Messung zustande kommt. Diese Fassung fasst deshalb weder
   `setTimeout` noch `requestAnimationFrame` an.
   =========================================================================== */

(function (B) {
  'use strict';

  /* Wie oft die Klemmenwache hintereinander nachziehen darf, ohne dass
     zwischendurch etwas anderes gezeichnet wurde. Der Riegel gegen ein Hin
     und Her zwischen zwei Lagen. */
  var AUSSEN_MAX = 3;

  /* Die drei Klassen, mit denen in diesem Spiel etwas weggeschnitten wird.
     Sie stehen schon im Kopf von kern/haushalt.js. */
  var KLEMMEN = '.stadt-zugeklappt, .stadt-verdeckt, .kern-blatt-zu';

  var oST = window.setTimeout;      /* fuer die Probe, nie fuer das Spiel */

  var tiefe = 0;                    /* Schachtelung der laufenden Zeichenrunde */
  var letzterAbdruck = '';
  var vorletzterAbdruck = null;     /* erkennt ein Hin und Her zwischen zwei Lagen */
  var aussenZaehler = 0;
  var wache = null;

  var zahl = {
    runden: 0,
    nachgezogen: 0,   /* wie oft die Wache ein Neuzeichnen ausgeloest hat */
    pendel: 0,        /* Lage kippt zwischen zwei Zustaenden hin und her */
    riegel: 0         /* wie oft der Riegel gegriffen hat */
  };

  /* ---------------------------------------------------------------------
     DER ABDRUCK DER KLEMMENLAGE.  Nur Klassennamen — kein Layout, kein
     getBoundingClientRect, kein erzwungener Umbruch.
     --------------------------------------------------------------------- */
  function abdruck() {
    var l, i, s = [];
    try { l = document.querySelectorAll(KLEMMEN); } catch (e) { return ''; }
    for (i = 0; i < l.length; i++) {
      var el = l[i];
      var fach = el.closest ? el.closest('.fach') : null;
      s.push((fach && fach.id ? fach.id : '?') + '/' + (el.className || ''));
    }
    s.sort();
    return s.join('|');
  }

  /* Trenner, die in keinem Spieltext vorkommen. Als Escape geschrieben,
     damit in dieser Datei kein rohes Steuerzeichen steht. */
  var TRENN = '\u0001', SATZ = '\u0002';

  /* Was die messende Hand von einem Zug liest: Name, Sperre, Beschriftung.
     `textContent` erzwingt kein Layout — anders als `innerText`. Nur fuer
     die Probe `nachwehen()`, nie im Spielbetrieb. */
  function schirmAbdruck() {
    var l, i, s = [];
    try { l = document.querySelectorAll('[data-zug]'); } catch (e) { return ''; }
    for (i = 0; i < l.length; i++) {
      s.push(l[i].getAttribute('data-zug') + TRENN + (l[i].disabled ? '1' : '0')
        + TRENN + String(l[i].textContent || '').replace(/\s+/g, ' ').trim());
    }
    s.sort();
    return s.join(SATZ);
  }

  /* Welche Zuege haben sich geaendert — hoechstens zwoelf, damit die Antwort
     in eine Konsole passt. */
  function unterschied(a, b) {
    var mA = {}, mB = {}, raus = [];
    function nach(t, ziel) {
      t.split(SATZ).forEach(function (z) { if (z) ziel[z.split(TRENN)[0]] = z; });
    }
    nach(a, mA); nach(b, mB);
    function zeig(z) {
      if (!z) return '(fort)';
      var t = z.split(TRENN);
      return (t[1] === '1' ? 'gesperrt · ' : '') + (t[2] || '').slice(0, 60);
    }
    Object.keys(mA).forEach(function (k) {
      if (mA[k] !== mB[k] && raus.length < 12) raus.push({ zug: k, vorher: zeig(mA[k]), nachher: zeig(mB[k]) });
    });
    Object.keys(mB).forEach(function (k) {
      if (!(k in mA) && raus.length < 12) raus.push({ zug: k, vorher: '(fort)', nachher: zeig(mB[k]) });
    });
    return raus;
  }

  /* ---------------------------------------------------------------------
     B.sende('zeichne') — der Rahmen merkt sich nur, dass gerade gezeichnet
     wird. Er greift NICHT ein.
     --------------------------------------------------------------------- */
  var oSende = B.sende;
  B.sende = function (name) {
    if (name !== 'zeichne') return oSende.apply(this, arguments);
    /* Jedes Zeichnen, das NICHT die Wache angestossen hat, macht ihren
       Zaehler wieder frei — der Riegel soll ein Hin und Her abstellen,
       nicht das Spiel. */
    if (String((arguments[1] && arguments[1].grund) || '').indexOf('runde-') !== 0) aussenZaehler = 0;
    tiefe++;
    zahl.runden++;
    try { return oSende.apply(this, arguments); }
    finally {
      tiefe--;
      /* Am Ende einer Runde ist die Lage, gegen die die Stuecke gezeichnet
         haben, genau die, die jetzt dasteht. */
      if (tiefe === 0) letzterAbdruck = abdruck();
    }
  };

  /* ---------------------------------------------------------------------
     DIE KLEMMENWACHE
     --------------------------------------------------------------------- */
  function starteWache() {
    if (wache || !window.MutationObserver) return;
    letzterAbdruck = abdruck();
    wache = new MutationObserver(function () {
      if (tiefe > 0) return;                      /* mitten im Zeichnen: gleich fertig */
      var jetzt = abdruck();
      if (jetzt === letzterAbdruck) return;
      /* ZWEI LAGEN, DIE SICH ABWECHSELN, sind kein Fortschritt. Wer neu
         zeichnet, weil die Lage nach A gekippt ist, und dabei B herstellt,
         das gleich wieder nach A kippt, zeichnet fuer immer. Kommt genau
         die vorletzte Lage zurueck, wird nur gezaehlt, nicht gezeichnet. */
      if (jetzt === vorletzterAbdruck) { zahl.pendel++; return; }
      vorletzterAbdruck = letzterAbdruck;
      letzterAbdruck = jetzt;
      if (aussenZaehler >= AUSSEN_MAX) { zahl.riegel++; return; }
      aussenZaehler++; zahl.nachgezogen++;
      B.wage('runde.wache', function () {
        B.sende('zeichne', { grund: 'runde-klemme' });
      });
    });
    var stapel = document.getElementById('buehne');
    if (stapel) wache.observe(stapel, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ---------------------------------------------------------------------
     NACH AUSSEN
     --------------------------------------------------------------------- */
  B.runde = {
    /* Eine Runde von Hand fahren — fuer den ersten Bildaufbau, der nicht
       ueber B.sende('zeichne') laeuft (kern/buehne.js starte()). */
    runde: function (fn) {
      tiefe++;
      try { B.wage('runde', fn); }
      finally { tiefe--; if (tiefe === 0) letzterAbdruck = abdruck(); }
    },

    /* R9 — DIE FRAGE IN EINEM AUFRUF.
       [] heisst: der Rahmen hat nichts zu melden. Jeder Eintrag nennt eine
       Stelle, an der ein Stueck ein fremdes Brett klappt, ohne es zu sagen. */
    pruefe: function () {
      var raus = [];
      if (zahl.pendel) raus.push({ was: 'pendel', zahl: zahl.pendel,
        sagt: 'Die Klemmenlage kippt zwischen zwei Zustaenden hin und her; der Rahmen zeichnet '
            + 'dabei nicht mit. Ein Stueck klappt ein fremdes Brett weg, ohne zeichne zu senden.' });
      if (zahl.riegel) raus.push({ was: 'riegel', zahl: zahl.riegel,
        sagt: 'Die Klemmenlage ist ' + AUSSEN_MAX + '-mal hintereinander gekippt, ohne dass '
            + 'zwischendurch etwas anderes gezeichnet wurde; der Riegel hat weiteres '
            + 'Nachziehen abgestellt.' });
      return raus;
    },

    /* R9 — DIE FRAGE ALS PROBE, NICHT ALS NEUN MESSLAEUFE.
       Nimmt den Abdruck der Klemmenlage UND aller bedienbaren Zuege (Name,
       gesperrt, Beschriftung — kein Layout), wartet eine echte Wanduhrfrist,
       in der NIEMAND etwas anfasst, und sieht noch einmal hin. Aendert sich
       in dieser Zeit etwas, war die Runde nicht fertig, als sie zu Ende ging
       — und genau das ist die Bedingung, unter der zwei gleiche Saaten
       auseinanderlaufen.

       Das ist das einzige im Rahmen, das eine Uhr benutzt. Es laeuft NUR auf
       Zuruf; wer es waehrend einer Messung ruft, misst sein eigenes Warten.

         await BRAUHAUS.runde.nachwehen()   ->  { ruhig: true, … }  */
    nachwehen: function (ms) {
      var frist = ms || 1200;
      var a1 = abdruck(), s1 = schirmAbdruck();
      return new Promise(function (fertig) {
        oST.call(window, function () {
          var a2 = abdruck(), s2 = schirmAbdruck();
          var raus = [];
          if (a1 !== a2) raus.push({ was: 'klemmenlage', vorher: a1, nachher: a2,
            sagt: 'Ein Stueck hat nach dem Ende der Runde ein Brett weggeklappt oder '
                + 'aufgeschlagen, ohne dass neu gezeichnet wurde.' });
          if (s1 !== s2) raus.push({ was: 'zuege', unterschiede: unterschied(s1, s2),
            sagt: 'Beschriftung oder Sperre eines Zuges hat sich nach dem Ende der Runde '
                + 'geaendert. Wer in dieser Zeit hinsieht, sieht etwas anderes als wer '
                + 'danach hinsieht.' });
          fertig({ frist: frist, ruhig: raus.length === 0, beanstandungen: raus,
                   bericht: B.runde.bericht() });
        }, frist);
      });
    },

    bericht: function () {
      return { runden: zahl.runden, nachgezogen: zahl.nachgezogen,
               pendel: zahl.pendel, riegel: zahl.riegel,
               abdruck: letzterAbdruck };
    },

    /* Fuer die Konsole des Kritikers: eine Zeile. */
    zeile: function () {
      var p = B.runde.pruefe();
      return 'RUNDE  ' + zahl.runden + ' Runden · ' + zahl.nachgezogen + ' mal nachgezogen · '
        + zahl.pendel + ' Pendel · ' + zahl.riegel + ' Riegel'
        + (p.length ? '  !! ' + p.length + ' Beanstandung(en)' : '  — sauber');
    },

    GRENZEN: { AUSSEN_MAX: AUSSEN_MAX },
    abdruck: abdruck
  };

  /* Die Wache erst, wenn die Buehne steht. 'bereit' kommt aus kern/start.js,
     nach dem ersten Bildaufbau. */
  B.auf('bereit', function () { B.wage('runde.wache-start', starteWache); });

})(BRAUHAUS);
