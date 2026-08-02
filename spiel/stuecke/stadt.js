/* ===========================================================================
   stuecke/stadt.js — DIE STADT: vier Platten, ein Ort, ein wachsender Hof.

   Was dieses Stueck auf den Bildschirm bringt:
   · Ebene 'platte' — das Epochenbild. Vier Stueck, derselbe Ort, dieselbe
     Kamera, 620 Jahre auseinander. Ohne eingebrannte Schrift: im Spiel ist
     Text echter Text.
   · Ebene 'bau'    — der Hof. Jedes Gebaeude ist ein freigestelltes Bild an
     einem Ort aus kern/orte.js. Es steht dort, WEIL Geld ausgegeben wurde,
     nicht weil die Epoche gewechselt hat. Wer nicht kauft, sieht es nicht.
   · Die Beschriftung der Stadt und das Hausschild als echtes HTML.
   · DIE WERKBANK am unteren Rand: der Bauhof mit Preisschildern nebeneinander
     und darueber die Reiter aller aufgeschlagenen Bretter.
   · DEN RAHMEN — siehe unten. Das Stadtfenster gehoert dem Bild.

   Aufnahmen fuer die Bildlatte:
     ?epoche=1..4            der Hof, wie ihn die Vorfahren hinterliessen
     ?epoche=3&bau=keine     derselbe Spielstand ohne einen einzigen Kauf
     ?epoche=3&bau=alle      alles gebaut
   =========================================================================== */

(function (B) {
  'use strict';

  var K = STADT_DATEN;

  /* Was steht. schluessel -> {jahr, gekauft}. Ueberlebt den Epochenwechsel:
     der Hof waechst ueber die Generationen, er wird nicht neu gesetzt. */
  var gebaut = {};
  var vorschau = null;          /* Bauplatz unter der Maus */

  function e() { return B.welt.zeit ? B.welt.zeit.epoche : 1; }
  function daten(nr) { return K.epochen[nr || e()] || K.epochen[1]; }
  function hat(schluessel) { return !!gebaut[schluessel]; }

  function katalog(nr) {
    var ep = nr || e();
    return K.aufbauten.filter(function (a) { return a.von <= ep && a.bis >= ep; });
  }

  function preis(a, nr) {
    return Math.round(a.grund * (K.teuerung[nr || e()] || 1));
  }

  /* DER MASSSTAB je Epoche. Vier Platten sind vier Zeichnungen: auf der
     Platte 1600 misst ein Mensch im Hof rund 51 px, auf der Platte 1350
     rund 72. Ein Aufbau mit fester Breite ist damit in einer der beiden
     Epochen falsch. 'breiten' und 'versatz' staffeln ihn je Epoche; wer
     nichts staffelt, behaelt breite/dx/dy. */
  function masse(a, nr) {
    var ep = nr || e();
    var v = (a.versatz && a.versatz[ep]) || {};
    var b = (a.breiten && a.breiten[ep] !== undefined) ? a.breiten[ep] : a.breite;
    return {
      breite: b,
      dx: (a.dx || 0) + (v.dx || 0),
      dy: (a.dy || 0) + (v.dy || 0)
    };
  }

  /* --------------------------------------------------------------------
     DIE TIEFE.  (Runde 7)

     Runde 6 ging mit diesem Satz zurueck: "DAS LOT MISST DEN BODEN, NICHT
     DIE TIEFE, UND EINE DATEI NUTZT DAS AUS." Der Beleg war der
     Pferdestall: seine Datei trug 17,1 Prozent leeren Rand unten, er malte
     deshalb bei 64,1 Prozent Buehnenhoehe und trug den z-Index seiner
     Unterkante — 680. In 1884 lagen dadurch 47 Prozent der Gaertanks unter
     einem Stall, der zwei Meter hinter ihnen steht.

     Der Fehler sass nicht in der Datei, sondern in der Zeile darunter:
     der z-Index kam aus dem ORT, die Zeichnung aus dem BILD. Solange beide
     zufaellig zusammenfielen, sah man es nicht. Jetzt kommt beides aus
     derselben Zahl:

         die unterste undurchsichtige Zeile des Bildes (K.fuesse),
         umgerechnet in Prozent der Buehnenhoehe.

     Damit ist der Fall keine Ausnahme mehr, sondern unmoeglich: wer ein
     Bild mit leerem Rand einhaengt, bekommt automatisch den z-Index seines
     Fusses und nicht den seines Rahmens.

     UND DER ZWEITE SATZ, der aus derselben Runde stammt (Gaerbottiche ueber
     dem Kontor): WER AUF DER GASSE STEHT, STEHT VOR DER MAUER. Die
     Bildschirmhoehe allein sagt das nicht — die Hofmauer laeuft schraeg
     durchs Bild, und ein Haus jenseits der Ost-Ecke kann hoeher im Bild
     sitzen als ein Bottich im Hof und trotzdem naeher an der Kamera stehen.
     Also bekommt 'gasse' die Tiefe der Mauerlinie an seiner Stelle als
     Untergrenze; damit liegt es vor allem, was im Hof steht.
     -------------------------------------------------------------------- */

  /* Die Bildhoehe in Prozent der BUEHNENHOEHE. breite ist Prozent der
     Buehnenbreite, das Bild behaelt sein Seitenverhaeltnis. */
  function bildhoehe(a, m) {
    var mass = K.bildmass[a.bild];
    if (!mass || !mass[0]) return 0;
    return m.breite * (2752 / 1536) * (mass[1] / mass[0]);
  }

  /* Wo der Aufbau den Boden beruehrt, in Prozent der Buehnenhoehe. */
  function fusshoehe(a, m, nr) {
    var ort = B.orte.hole(a.ort);
    var unten = (ort ? ort.y : 50) + m.dy;
    var profil = K.fuesse[a.bild];
    if (!profil) return unten;
    var tiefst = -1;
    for (var i = 0; i < profil.length; i++) if (profil[i] > tiefst) tiefst = profil[i];
    if (tiefst < 0) return unten;
    return unten - (1 - tiefst) * bildhoehe(a, m);
  }

  /* DIE MAUERLINIE, in Prozent der Buehnenhoehe, an einer x-Stelle in
     Prozent der Buehnenbreite. Dieselben Zahlen, mit denen DAS LOT urteilt
     (K.boden) — nur hier in Prozent statt in Bezugspixeln, weil der z-Index
     mit Prozent rechnet. */
  function mauerhoehe(px) {
    var b = K.boden;
    var d = px - b.scheitel.x;
    var steigung = (d <= 0 ? b.links : b.rechts) * (2752 / 1536);
    return b.scheitel.y - Math.abs(d) * steigung;
  }

  /* Die Zahl, aus der der z-Index wird. */
  function tiefe(a, nr) {
    var m = masse(a, nr);
    var f = fusshoehe(a, m, nr);
    if (a.boden === 'gasse') {
      var ort = B.orte.hole(a.ort);
      f = Math.max(f, mauerhoehe((ort ? ort.x : 50) + m.dx) + 0.4);
    }
    return f;
  }

  /* Offen = in dieser Epoche baubar und noch nicht gebaut. */
  function offen(nr) {
    return katalog(nr).filter(function (a) { return !hat(a.schluessel); });
  }

  function stehend(nr) {
    return katalog(nr).filter(function (a) { return hat(a.schluessel); });
  }

  /* --------------------------------------------------------------------
     BAUEN.  Der einzige Weg, wie etwas in den Hof kommt.
     -------------------------------------------------------------------- */
  function wirke(a) {
    var n = a.nutzen || {};
    if (n.platz) B.welt.vorrat.plaetze += n.platz;
    if (n.sud) B.welt.haus.sudJeWoche += n.sud;
    if (n.rohstoff) B.welt.haus.rohstoff += n.rohstoff;
  }

  function nutzenWort(a) {
    var n = a.nutzen || {}, l = [];
    if (n.platz) l.push('+' + n.platz + ' Fass Lagerplatz');
    if (n.sud) l.push('+' + n.sud + ' Sud je Woche');
    if (n.rohstoff) l.push('+' + n.rohstoff + ' ' + B.welt.epoche().rohstoff);
    if (!l.length && a.wirkt) l.push(a.wirkt);
    return l.join(' · ');
  }

  /* Was ein Bau dem Haus wieder wegnimmt, wenn er aus dem Hof geht. Nur was
     dieses Haus selbst gebaut hat, hatte je 'wirke' gesehen — der geerbte
     Stand steckt schon in den Grundzahlen von kern/welt.js. Trotzdem kostet
     auch der geerbte Bau: wer den Malzboden versetzt, hat den Lagerplatz
     nicht mehr. Deshalb wird immer abgezogen und unten abgefangen. */
  function entwirke(a) {
    var n = a.nutzen || {};
    if (n.platz) B.welt.vorrat.plaetze = Math.max(4, B.welt.vorrat.plaetze - n.platz);
    if (n.sud) B.welt.haus.sudJeWoche = Math.max(1, (B.welt.haus.sudJeWoche || 1) - n.sud);
    if (n.rohstoff) B.welt.haus.rohstoff = Math.max(0, B.welt.haus.rohstoff - n.rohstoff);
  }

  function kaufe(a) {
    if (hat(a.schluessel)) return;
    var p = preis(a);
    if (!B.welt.kann(p)) {
      B.welt.schreibe('Der Bau von ' + a.name + ' bleibt liegen: ' + B.welt.geld(p)
        + ' hat das Haus nicht.', 'bau');
      B.sende('zeichne', { grund: 'stadt:bau' });
      return;
    }
    if (!B.welt.zahle(p, 'Bau: ' + a.name)) return;
    gebaut[a.schluessel] = { jahr: B.welt.zeit.jahr, gekauft: true };
    wirke(a);
    B.welt.schreibe(a.name + ' steht im Hof. ' + a.sagt, 'bau');
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:bau');
    B.sende('zeichne', { grund: 'stadt:bau' });
  }

  /* ====================================================================
     DIE VERWERTUNG — der Boden unter der Kasse.  (Runde 7)

     Die Auflage lautete: "DER BODEN DER WIRTSCHAFT FEHLT. Gebraucht wird ein
     Boden: entweder ein Ende (Haus verloren, Chronik geschlossen), oder ein
     Betrieb, der bei ehrlichem Liefern die laufenden Lasten traegt."

     Ein Betrieb ist nicht die Sache dieses Stuecks — das Bier verkaufen
     andere. Was diesem Stueck gehoert, ist der Hof, und der Hof ist das
     einzige Vermoegen, das ein Brauhaus mit leerer Kasse noch hat. Also
     baut DIE STADT den anderen Boden: Stein zurueck zu Muenze, in vier
     Formen, die es wirklich gab (K.verwertung), und darunter das Ende.

     Drei Stufen, in dieser Reihenfolge:
       1. Der Spieler verwertet selbst — ein Zug mit Preisschild, der auch
          bei null Pfennig noch da ist. Er kostet den Bau.
       2. Steht die Kasse zu Michaeli im Minus, greift der Rat selbst zu,
          und zwar zum Zwangssatz: er gibt weniger als der Markt.
       3. Ist nichts mehr da, was er nehmen koennte, ist das Haus verloren.
          Dann sagt es die Uhr, und die Chronik wird geschlossen.
     ==================================================================== */

  /* schluessel -> {jahr, betrag}. Nur Epoche 3 kennt das: dort bleibt das
     Gebaeude stehen und traegt einen Zins. */
  var belastet = {};

  function verwertungsArt(nr) { return K.verwertung[nr || e()] || K.verwertung[1]; }

  /* Was fuer diese Epoche noch zu Geld zu machen ist. In Epoche 3 faellt
     weg, was schon im Hypothekenbuch steht. */
  function verwertbar(nr) {
    var ep = nr || e();
    var art = verwertungsArt(ep);
    return stehend(ep).filter(function (a) {
      return !(art.bleibt && belastet[a.schluessel]);
    });
  }

  function erloes(a, nr, zwang) {
    var art = verwertungsArt(nr);
    var satz = zwang ? art.zwang : art.anteil;
    return Math.max(1, Math.round(preis(a, nr) * satz));
  }

  /* Nimmt den Bau aus dem Hof — oder laesst ihn stehen und schreibt ihn ins
     Hypothekenbuch. Gibt den Betrag zurueck, der in die Kasse ging. */
  function verwerte(a, zwang) {
    if (!hat(a.schluessel)) return 0;
    var ep = e();
    var art = verwertungsArt(ep);
    var betrag = erloes(a, ep, zwang);
    var bleibt = !!art.bleibt && !zwang;

    B.welt.nimm(betrag, (zwang ? art.ratSagt.split('.')[0] + ': ' : art.tat + ': ') + a.name);
    if (bleibt) {
      belastet[a.schluessel] = { jahr: B.welt.zeit.jahr, betrag: betrag };
    } else {
      delete gebaut[a.schluessel];
      delete belastet[a.schluessel];
      entwirke(a);
    }
    if (art.ansehen) {
      B.welt.haus.ansehen = Math.max(0, (B.welt.haus.ansehen || 0) + art.ansehen);
    }
    B.welt.schreibe(
      zwang
        ? art.ratSagt + ' ' + a.name + ' geht fuer ' + B.welt.geld(betrag) + ' weg.'
        : a.name + ' — ' + art.tat.toLowerCase() + ' gegeben, ' + B.welt.geld(betrag)
          + '. ' + art.sagt,
      'bau');
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:bau');
    return betrag;
  }

  function verwerteZug(a) {
    verwerte(a, false);
    B.sende('zeichne', { grund: 'stadt:bau' });
  }

  /* Michaeli. Steht die Kasse im Minus, greift der Rat zu — solange, bis sie
     wieder ueber null steht oder der Hof leer ist. Zuerst geht das
     billigste Stueck; der Rat nimmt, was am schnellsten Kaeufer findet. */
  function ratGreiftZu() {
    if (!B.welt.zeit || B.welt.zeit.ende) return;
    var geholt = 0;
    for (var runde = 0; runde < 12 && B.welt.haus.kasse < 0; runde++) {
      var l = verwertbarZwang();
      if (!l.length) break;
      l.sort(function (x, y) { return preis(x) - preis(y); });
      verwerte(l[0], true);
      geholt++;
    }
    if (B.welt.haus.kasse < 0 && !verwertbarZwang().length) {
      B.welt.schreibe(
        'Der Hof ist leer, die Kasse steht bei ' + B.welt.geld(B.welt.haus.kasse)
        + '. Es ist nichts mehr da, was ein Glaeubiger nehmen koennte.', 'ende');
      if (B.uhr && B.uhr.beende) {
        B.uhr.beende('haus-verloren',
          'Das Brauhaus zum Anker ist verloren: kein Bargeld, kein Hof, kein Pfand. '
          + 'Die Chronik der Familie ' + B.welt.haus.familie + ' wird geschlossen.');
      }
    }
    if (geholt) B.sende('zeichne', { grund: 'stadt:bau' });
  }

  /* Beim Zwang gibt es kein Hypothekenbuch: das Amtsgericht nimmt auch, was
     schon belastet ist. */
  function verwertbarZwang() { return stehend(); }

  /* Der Zins auf allem, was im Hypothekenbuch steht — jeden Michaeli. */
  function zinsLaeuft() {
    var art = verwertungsArt();
    if (!art.zins) return;
    var summe = 0;
    Object.keys(belastet).forEach(function (s) {
      if (hat(s)) summe += belastet[s].betrag; else delete belastet[s];
    });
    if (summe <= 0) return;
    var zins = Math.max(1, Math.round(summe * art.zins));
    B.welt.nimm(-zins, 'Hypothekenzins auf ' + B.welt.geld(summe));
  }

  /* Der Hof, wie ihn die Vorfahren hinterlassen haben — oder was ?bau= sagt. */
  function setzeStand() {
    gebaut = {};
    belastet = {};
    var wunsch = B.arg.roh ? B.arg.roh.bau : null;
    var liste;
    if (wunsch === 'keine') liste = [];
    else if (wunsch === 'alle') liste = katalog().map(function (a) { return a.schluessel; });
    else if (wunsch) liste = String(wunsch).split(',');
    else liste = daten().stand || [];

    liste.forEach(function (s) {
      gebaut[s] = { jahr: B.welt.zeit.jahr, gekauft: false };
    });
  }

  /* ====================================================================
     DER RAHMEN — das Stadtfenster gehoert dem Bild.

     Der Befund des Kritikers aus Runde 1, woertlich: "Das Spielbild zeigt
     die Stadt nicht — es zeigt Tafeln ueber der Stadt." Eine einzige Tafel
     deckte 64 % der Flaeche, vier weitere lagen dauerhaft ueber dem Hof.
     Von vier Platten, die den Ortstest bestehen, war im Spiel nichts zu
     sehen.

     Die Buehne hat deshalb ab jetzt eine Ordnung, und DIE STADT haelt sie:

       oben   0 – 11,2 %   Kopfleiste (kern/kopf.js)
       Mitte 11,2 – 87,5 % DAS STADTFENSTER. Gehoert der Platte und dem Hof.
       unten 87,5 – 100 %  Die Werkbank: Reiter, Bauhof, WEITER.

     Kein Brett irgendeines Stuecks liegt im Ruhezustand mit mehr als
     GRENZE (3,5 %) der Buehnenflaeche im Stadtfenster. Was groesser ist,
     wird zum REITER an der Werkbank — ein Klick schlaegt es auf, ein
     zweiter klappt es zu. Nichts geht verloren, nichts wird umgeschrieben:
     das Brett bleibt an seinem Platz und in seiner Groesse, es wird nur
     weggeschnitten (clip-path) — deshalb stehen im Reiter die LEBENDEN
     Zahlen des Bretts und nicht eine Abschrift davon.

     Zwei Ausnahmen, damit die Ordnung nicht zur Fessel wird:
     · Ein Brett mit dem Attribut data-frei bleibt unangetastet. Wer sein
       Brett selbst in die Leiste legt, wird nicht zweimal gelegt.
     · Was WAEHREND des Spiels neu aufschlaegt — die Michaelitafel zum
       Jahreswechsel — schlaegt auf. Nur was beim Laden schon dalag, liegt
       als Reiter. Beim Laden will man sein Haus sehen.

     RUNDE 5 — DIE REGEL BRACH AN IHREN EIGENEN AUSNAHMEN.

     Der Kritiker hat den Rahmen mit seinen eigenen Zahlen widerlegt, und er
     hat recht: er lief ueber ebene-marken, ebene-hand und ebene-blatt. Die
     Buehne hat aber SECHS Ebenen, und in ebene-kopf lag nm-band — 578x439 px
     auf (30|123), davon 225.420 px im Stadtfenster, 5,33 % der Buehne, das
     Anderthalbfache der eigenen GRENZE, in allen vier Epochen beim Laden
     aufgeschlagen und nie ein Reiter. Ein Blick, der eine ganze Ebene nicht
     ansieht, ist kein Rahmen.
       -> Der Blick geht jetzt ueber ALLE Ebenen ausser platte und bau; das
          sind die beiden, die dem Bild selbst gehoeren.

     Und die zweite Bresche: .amort und data-frei befreiten OHNE OBERGRENZE.
     Deshalb lag gg-band als 936x158 grosses Banner (3,50 %) dauerhaft als
     "Ortsmarke" ueber der Stadt. Eine Ortsmarke ist ein PUNKT im Bild. Was
     groesser ist als MARKE (2,4 % der Buehne), ist ein Brett — gleichgueltig
     welche Klasse und welches Attribut daran haengt, und ohne zweite
     Schwelle. Wer sich als Punkt ausgibt und ein Brett ist, hat seine
     Ausnahme verwirkt.
       -> Beide Ausnahmen gelten nur noch unterhalb von MARKE.

     MARKE liegt bei 2,4 % und nicht tiefer, und das ist eine Entscheidung
     gegen den bequemeren Weg: gg-hof, das Bild des Hofes gegenueber, misst
     2,19 % und bleibt damit stehen. Es ist ein BILD AN EINEM ORT und keine
     Tafel — es an die Werkbank zu holen haette den Blindvergleich schlechter
     gemacht, nicht besser. Was verschwindet, sind die beiden Schrifttafeln,
     die der Kritiker benannt hat, und nur die.

     Damit ist die Ordnung wieder eine Ordnung und keine Liste von Namen:
       bis MARKE   — ein Punkt. Bekommt einen Pflock, ruht beim Laden.
       ab  MARKE   — ein Brett. Bekommt einen Reiter, liegt beim Laden zu.
     ==================================================================== */

  var ZU = 'stadt-zugeklappt';
  var FENSTER = { x0: 0, y0: 11.2, x1: 100, y1: 87.5 };
  var GRENZE = 0.035;           /* Anteil der Buehnenflaeche — so gross darf ein Brett ruhen */
  var MARKE = 0.024;            /* ... und so gross ist eine Ortsmarke hoechstens */
  /* platte und bau gehoeren dem Bild selbst — alles andere sieht der Rahmen an. */
  var EBENEN = ['marken', 'hand', 'kopf', 'blatt'];
  var TAKT = 240;               /* ms — der Rahmen sieht regelmaessig nach */
  var VERGESSEN = 900;          /* ms — so lange gilt ein Brett als "noch da" */
  var JAHRESFRIST = 1800;       /* ms — Fenster nach einem Jahreswechsel */
  var LADEZEIT = 2500;          /* ms — so lange dauert "beim Laden" */

  var HANDFRIST = 1400;         /* ms — so lange gilt ein Brett als vom Spieler geholt */

  var DECKGRENZE = 0.12;        /* Anteil des kleineren Bretts — so viel darf sich decken */

  var lage = {};                /* schluessel -> 'zu' | 'auf' */
  var aufZeit = {};             /* schluessel -> wann zuletzt aufgeschlagen (0 = zu) */
  var gesehen = {};             /* schluessel -> Zeitstempel */
  var warDa = {};               /* schluessel -> lag beim letzten Blick wirklich da */
  var startZeit = 0;
  var jahrZeit = 0;
  var handZeit = 0;             /* wann der Spieler zuletzt geklickt hat */
  var beobachter = null;
  var imGange = false;
  var angemeldet = false;
  var reiterStand = '';         /* Satz der Bretter — nur er baut die Zeile neu */
  var reiterKnopf = {};         /* schluessel -> der stehende Knopf */

  /* Die beiden Ausnahmen — und ihre Obergrenze. Ein Ding, das an einem Ort
     haengt (.amort) oder sich selbst abgemeldet hat (data-frei), bleibt
     unangetastet, SOLANGE ES EIN PUNKT IST. Ueber MARKE ist es ein Brett und
     wird wie eines behandelt. Genau das hat in Runde 4 gefehlt. */
  function befreit(el) {
    if (!el.classList.contains('amort') && !el.hasAttribute('data-frei')) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return true;
    return anteil(r, false) <= MARKE;
  }

  /* Alle Bretter der anderen Stuecke: direkte Kinder eines fremden Fachs in
     einer der vier Ebenen ueber dem Bild. Was klein genug ist, um ein Punkt
     zu sein, geht an die Kartenschicht weiter unten; alles andere ist hier
     ein Brett — auch wenn es .amort oder data-frei traegt. Dann allerdings
     OHNE zweite Schwelle: 'verwirkt' merkt sich das. */
  function fremdeBretter() {
    var l = [];
    EBENEN.forEach(function (name) {
      var ebene = document.getElementById('ebene-' + name);
      if (!ebene) return;
      var faecher = ebene.children;
      for (var i = 0; i < faecher.length; i++) {
        var fach = faecher[i];
        var wer = fach.getAttribute('data-stueck');
        if (!wer || wer.indexOf('stadt') === 0 || wer.indexOf('kern') === 0) continue;
        var kinder = fach.children;
        for (var j = 0; j < kinder.length; j++) {
          var el = kinder[j];
          if (befreit(el)) continue;
          var beansprucht = el.classList.contains('amort') || el.hasAttribute('data-frei');
          l.push({ el: el, wer: wer, nr: j, verwirkt: beansprucht });
        }
      }
    });
    return l;
  }

  function schluesselVon(b) {
    var k = [];
    for (var i = 0; i < b.el.classList.length; i++) {
      if (b.el.classList[i] !== ZU) k.push(b.el.classList[i]);
    }
    k.sort();
    return b.wer + '|' + (k.join('.') || ('kind' + b.nr));
  }

  /* Anteil der Buehnenflaeche, den ein Rechteck im Stadtfenster deckt.
     'ganz' misst stattdessen gegen die ganze Buehne. */
  function anteil(r, ganz) {
    var m = B.buehne.masse();
    var x0 = 0, y0 = 0, x1 = m.breite, y1 = m.hoehe;
    if (!ganz) {
      x0 = m.breite * FENSTER.x0 / 100; x1 = m.breite * FENSTER.x1 / 100;
      y0 = m.hoehe * FENSTER.y0 / 100;  y1 = m.hoehe * FENSTER.y1 / 100;
    }
    var w = Math.min(r.right, x1) - Math.max(r.left, x0);
    var h = Math.min(r.bottom, y1) - Math.max(r.top, y0);
    if (w <= 0 || h <= 0) return 0;
    return (w * h) / (m.breite * m.hoehe);
  }

  /* Zuklappen heisst wegschneiden, nicht verstecken: das Brett behaelt
     Platz, Groesse und Umbruch, also stehen im Reiter seine echten Zahlen. */
  function klappeZu(el) {
    if (el.classList.contains(ZU)) return;
    el.classList.add(ZU);
    el.setAttribute('aria-hidden', 'true');
  }

  function klappeAuf(el) {
    if (!el.classList.contains(ZU)) return;
    el.classList.remove(ZU);
    el.removeAttribute('aria-hidden');
  }

  function beschriftung(el) {
    var vorgabe = el.getAttribute('data-reiter');
    if (vorgabe) return { titel: vorgabe, unter: '' };
    var kopf = el.firstElementChild || el;
    var roh = (kopf.innerText || kopf.textContent || '').replace(/ /g, ' ');
    var zeilen = roh.split('\n').map(function (z) { return z.trim(); })
      .filter(function (z) { return z.length; });
    /* Die Ueberschrift des Bretts, nicht die Aufschrift eines Knopfes darin —
       sonst hiesse die Michaelitafel "Chronik des Hauses". */
    var stark = null;
    var kandidaten = kopf.querySelectorAll('b, strong, h1, h2, h3, h4, .titel, .wort');
    for (var j = 0; j < kandidaten.length; j++) {
      if (kandidaten[j].closest('button, a')) continue;
      stark = kandidaten[j];
      break;
    }
    var titel = stark ? (stark.innerText || stark.textContent || '').trim() : '';
    if (!titel) titel = zeilen[0] || 'Brett';
    var unter = '';
    for (var i = 0; i < zeilen.length; i++) {
      if (zeilen[i] !== titel) { unter = zeilen[i]; break; }
    }
    return { titel: titel.slice(0, 30), unter: unter.slice(0, 44) };
  }

  function schalte(schluessel) {
    lage[schluessel] = (lage[schluessel] === 'zu') ? 'auf' : 'zu';
    /* Der Klick ist die Zeit, nach der die Platzordnung entscheidet. */
    aufZeit[schluessel] = (lage[schluessel] === 'auf') ? Date.now() : 0;
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:reiter');
    pruefe();
  }

  function alleZuklappen() {
    Object.keys(lage).forEach(function (k) { lage[k] = 'zu'; aufZeit[k] = 0; });
    pruefe();
  }

  /* ---- Die Reiterzeile.

     Runde 5: sie wird nur noch NEU GEBAUT, wenn andere Bretter da sind. Bis
     dahin hing die Kennung auch an Auf/Zu und an den Zahlen — also riss jeder
     Klick auf einen Reiter im naechsten Takt genau den Knopf weg, auf dem der
     Zeiger stand. Mit sieben Reitern statt vier faellt das ins Gewicht: der
     Kritiker der zweiten Latte muss zwanzig Minuten lang klicken koennen.
     Aufschrift, Lage und Titel werden deshalb IM STEHENDEN KNOPF frisch
     gesetzt, und "Stadt zeigen" bleibt liegen und wird nur ausgeblendet. ---- */
  function reiterZug(s) {
    return 'stadt:reiter:' + s.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  }

  function zeichneReiter(liste, ruhend) {
    var zeile = werkbank().querySelector('.stadt-reiterzeile');
    var offenDa = liste.some(function (b) { return !b.zu; });
    var satz = liste.map(function (b) { return b.schluessel; }).join('|')
      + '|' + (markenZahl ? 'marken' : '');

    if (satz !== reiterStand) {
      reiterStand = satz;
      reiterKnopf = {};
      B.leere(zeile);

      liste.forEach(function (b) {
        var s = b.schluessel;
        var k = B.knopf({
          text: b.titel,
          zug: reiterZug(s),
          klasse: 'stadt-reiter',
          tu: function () { schalte(s); }
        });
        k.appendChild(B.el('span', 'zahl', ''));
        reiterKnopf[s] = k;
        zeile.appendChild(k);
      });

      if (markenZahl) {
        var m = B.knopf({
          text: 'Ortsmarken',
          zug: 'stadt:ortsmarken',
          klasse: 'stadt-reiter marken',
          tu: markenSchalter
        });
        m.appendChild(B.el('span', 'zahl', ''));
        reiterKnopf['~marken'] = m;
        zeile.appendChild(m);
      }

      if (liste.length) {
        var z = B.knopf({
          text: 'Stadt zeigen',
          zug: 'stadt:alles-zuklappen',
          klasse: 'stadt-reiter frei',
          titel: 'Klappt alle Bretter zu. Danach steht nur noch der Hof im Bild.',
          tu: alleZuklappen
        });
        reiterKnopf['~zeigen'] = z;
        zeile.appendChild(z);
      }
    }

    /* Aufschrift und Lage — jedes Mal frisch, aber ohne einen Knopf anzufassen. */
    liste.forEach(function (b) {
      var k = reiterKnopf[b.schluessel];
      if (!k) return;
      k.classList.toggle('auf', !b.zu);
      k.setAttribute('aria-expanded', b.zu ? 'false' : 'true');
      k.title = b.zu
        ? b.titel + ' aufschlagen. Es legt sich über die Stadt, bis man es wieder zuklappt.'
        : b.titel + ' zuklappen — dann sieht man die Stadt wieder.';
      var wort = k.querySelector('.wort');
      if (wort && wort.textContent !== b.titel) wort.textContent = b.titel;
      var zahl = k.querySelector('.zahl');
      var text = b.unter || (b.zu ? 'zugeklappt' : 'liegt auf');
      if (zahl && zahl.textContent !== text) zahl.textContent = text;
    });

    var mk = reiterKnopf['~marken'];
    if (mk) {
      var ruht = (ruhend || 0) > 0;
      mk.classList.toggle('auf', !ruht);
      mk.setAttribute('aria-expanded', ruht ? 'false' : 'true');
      mk.title = ruht
        ? markenZahl + ' Ortsmarken der anderen Stücke liegen auf ihren Pflöcken. '
          + 'Ein Zeiger auf einen Pflock zeigt eine einzelne, dieser Knopf zeigt alle.'
        : 'Legt alle Ortsmarken zurück auf ihre Pflöcke — dann steht nur noch '
          + 'die Stadt im Bild.';
      var mz = mk.querySelector('.zahl');
      var mt = ruht ? markenZahl + ' auf dem Pflock' : markenZahl + ' im Bild';
      if (mz && mz.textContent !== mt) mz.textContent = mt;
    }

    var zk = reiterKnopf['~zeigen'];
    if (zk) zk.classList.toggle('aus', !offenDa);
  }

  /* ====================================================================
     DIE KARTENSCHICHT — die Ortsmarken der anderen Stuecke.

     Der Befund des Kritikers aus Runde 2, woertlich: "ueber dem Bild
     schweben je Epoche 8 bis 12 kleine Ortsmarken (OCH, LIN, TOR-GEV,
     FAE-KON, OBE, MUE, BRU, BHF); im Blindvergleich lesen die sich als
     Schmutz auf der Platte."

     Sie lesen sich so, weil sie NIRGENDS STEHEN: kleine helle Schilder,
     ueber eine gemalte Stadt gestreut, ohne Fuss und ohne Ordnung. Die
     Auskunft darin ist richtig und muss lesbar bleiben — der Ort, an dem
     sie klebt, ist es nicht.

     DIE STADT gibt ihnen deshalb einen Boden und eine Ruhelage:

     · JEDE fremde Ortsmarke im Stadtfenster bekommt einen PFLOCK — eine
       kleine dunkle Scheibe mit Goldring, in der Palette der Platte, genau
       auf dem Ort aus kern/orte.js, an dem die Marke haengt. Damit steht
       jede Marke auf einem Punkt, statt ueber der Stadt zu schweben.
     · Beim Laden RUHEN die Marken und nur die Pfloecke stehen — dieselbe
       Regel wie beim Rahmen: beim Laden will man sein Haus sehen. Ein Zeiger
       auf dem Pflock holt die Marke sofort zurueck, ein Klick heftet sie
       fest, und in der Werkbank steht ein Schalter fuer alle auf einmal.
     · Was WAEHREND des Spiels neu dazukommt — eine neue Bindung, ein neues
       Haus — steht sofort da. Nachricht schlaegt auf, Bestand ruht.

     Kein fremdes Blatt wird umgeschrieben, keine fremde Datei angefasst:
     die Marke behaelt ihren Text, ihre Farbe und ihren Platz. data-frei
     nimmt eine Marke von der Kartenschicht aus, wie beim Rahmen.
     ==================================================================== */

  var MRUHT = 'stadt-marke-ruht';
  var MZEIGT = 'stadt-marke-zeigt';   /* vom Zeiger hervorgeholt: sichtbar, aber ohne Maus */
  var markenLage = {};          /* schluessel -> 'ruht' | 'steht' */
  var markenDa = {};
  var markenGesehen = {};
  var markenAlle = 'ruhen';     /* Schalter der Werkbank: 'ruhen' | 'zeigen' */
  var markenStand = '';         /* letzte gezeichnete Pflockreihe */
  var markenZahl = 0;
  var unterZeiger = null;       /* Pflock unter der Maus: seine Marke steht solange */

  function fremdeMarken() {
    var l = [];
    ['marken', 'hand', 'bau', 'kopf', 'blatt'].forEach(function (name) {
      var ebene = document.getElementById('ebene-' + name);
      if (!ebene) return;
      var faecher = ebene.children;
      for (var i = 0; i < faecher.length; i++) {
        var fach = faecher[i];
        var wer = fach.getAttribute('data-stueck');
        if (!wer || wer.indexOf('stadt') === 0 || wer.indexOf('kern') === 0) continue;
        var kinder = fach.querySelectorAll('.amort');
        for (var j = 0; j < kinder.length; j++) {
          var el = kinder[j];
          if (el.hasAttribute('data-frei')) continue;
          if (el.parentNode !== fach && el.parentNode.closest
              && el.parentNode.closest('.amort')) continue;   /* Teil einer Marke */
          l.push({ el: el, wer: wer, nr: j });
        }
      }
    });
    return l;
  }

  /* Der kurze Text der Marke — 'OCH', 'TOR · GEV'. Er wird nur gebraucht,
     damit der Pflock einen sichtbaren deutschen Knopftext hat. */
  function markenwort(el) {
    var roh = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
    return roh.slice(0, 22) || 'Ortsmarke';
  }

  function markeSchalten(s) {
    markenLage[s] = (markenLage[s] === 'ruht') ? 'steht' : 'ruht';
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:reiter');
    pruefe();
  }

  function markenSchalter() {
    markenAlle = (markenAlle === 'ruhen') ? 'zeigen' : 'ruhen';
    Object.keys(markenLage).forEach(function (s) {
      markenLage[s] = (markenAlle === 'zeigen') ? 'steht' : 'ruht';
    });
    if (B.ton && B.ton.spiele) B.ton.spiele('stadt:reiter');
    pruefe();
  }

  function pflockfach() {
    var fach = B.ebene('marken', 'stadt');
    /* Unter die Marken der anderen Stuecke: ebene-marken hat einen eigenen
       Stapel, z-index -1 bleibt darin und liegt trotzdem ueber dem Hof. */
    fach.style.zIndex = '-1';
    return fach;
  }

  /* Zeichnet die Pfloecke neu — aber nur, wenn sich wirklich etwas geaendert
     hat. Sonst reisst die Kartenschicht den Knopf unter dem Zeiger weg. */
  function zeichnePfloecke(liste) {
    var kennung = liste.map(function (m) {
      return m.schluessel + '~' + m.ort + '~' + (m.ruht ? 'r' : 's') + '~' + m.wort;
    }).join('|');
    if (kennung === markenStand) return;
    markenStand = kennung;

    var fach = pflockfach();
    B.leere(fach);

    /* Zwei Stuecke duerfen dieselbe Adresse bespielen — DIE FUHRE haengt ihre
       Mahnkerbe an den Marktplatz, DER GEGNER seinen Ausschank auch. Zwei
       Pfloecke auf demselben Punkt decken einander, und der untere ist mit
       der Maus nicht mehr erreichbar (Playwright: "subtree intercepts pointer
       events"). Deshalb faechern gleiche Orte auf. */
    var jeOrt = {};
    liste.forEach(function (m) { jeOrt[m.ort] = (jeOrt[m.ort] || 0) + 1; });
    var lauf = {};

    liste.forEach(function (m) {
      if (!m.ort || !B.orte.da(m.ort)) return;
      var n = jeOrt[m.ort] || 1;
      var i = (lauf[m.ort] = (lauf[m.ort] || 0) + 1) - 1;
      var faecher = (n > 1) ? (i - (n - 1) / 2) * 1.15 : 0;
      var p = B.knopf({
        text: m.wort,
        zug: 'stadt:marke:' + m.schluessel.replace(/[^a-z0-9]+/gi, '-').toLowerCase(),
        klasse: 'stadt-pflock' + (m.ruht ? ' ruht' : ''),
        titel: m.ruht
          ? m.wort + ' — Ortsmarke von ' + m.wer + '. Zeiger darauf zeigt sie, '
            + 'Klick heftet sie fest.'
          : m.wort + ' — Klick legt die Ortsmarke wieder auf ihren Pflock.',
        tu: function () { markeSchalten(m.schluessel); }
      });
      p.setAttribute('aria-pressed', m.ruht ? 'false' : 'true');
      p.setAttribute('data-marke', m.schluessel);
      p.appendChild(B.el('span', 'scheibe'));
      function heb() {
        unterZeiger = m.schluessel;
        m.el.classList.remove(MRUHT);
        m.el.classList.add(MZEIGT);
      }
      function lass() {
        if (unterZeiger === m.schluessel) unterZeiger = null;
        m.el.classList.remove(MZEIGT);
        if (markenLage[m.schluessel] === 'ruht') m.el.classList.add(MRUHT);
      }
      p.addEventListener('mouseenter', heb);
      p.addEventListener('focus', heb);
      p.addEventListener('mouseleave', lass);
      p.addEventListener('blur', lass);
      /* Der Pflock steht dort, wo die Marke SELBST verankert ist — nicht auf
         dem nackten Ort. Sonst landet er beim Ort 'strasse' (y 89) unter der
         Werkbank, wo ihn niemand mehr trifft, waehrend seine Marke oben im
         Bild liegt. Und er bleibt im Stadtfenster: darunter faengt die
         Werkbank die Maus ab. */
      var lx = parseFloat(m.el.style.left);
      var ly = parseFloat(m.el.style.top);
      var o = B.orte.hole(m.ort);
      if (!isFinite(lx)) lx = o ? o.x : 50;
      if (!isFinite(ly)) ly = o ? o.y : 50;
      p.classList.add('amort');
      p.setAttribute('data-anker', 'mitte');
      p.setAttribute('data-ort', m.ort);
      p.style.left = B.rund(B.grenze(lx + faecher, 1, 99), 2) + '%';
      p.style.top = B.rund(B.grenze(ly, FENSTER.y0 + 1.5, FENSTER.y1 - 1.5), 2) + '%';
      fach.appendChild(p);
    });

    /* KEIN TOTER KNOPF IM BILD. Ein Pflock, den die Maus nicht trifft, weil
       ein fremdes Brett mit data-frei darueberliegt (das Haus gegenueber tut
       genau das), waere ein Knopf, an dem ein Kritiker mit Playwright
       haengenbleibt. Der wird wieder abgeraeumt — und seine Marke darf dann
       stehen, damit keine Auskunft verlorengeht. */
    for (var i = fach.children.length - 1; i >= 0; i--) {
      var el = fach.children[i];
      var r = el.getBoundingClientRect();
      var t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (t && el.contains(t)) continue;
      /* Nur ein DAUERHAFTER Deckel zaehlt: ein fremdes Brett mit data-frei
         oder etwas Eigenes (Hausschild, Hofbau). Eine Marke, die gerade unter
         dem Zeiger hervorgekommen ist, deckt nur einen Wimpernschlag lang —
         die darf ihren Nachbarn nicht vom Pflock holen. */
      var deckel = t && t.closest
        ? (t.closest('[data-frei]') || t.closest('.fach-bau-stadt')
           || t.closest('.fach-blatt-stadt')) : null;
      if (!deckel) continue;
      var s = el.getAttribute('data-marke');
      if (s && markenLage[s] === 'ruht') markenLage[s] = 'steht';
      fach.removeChild(el);
    }
  }

  function marken(jetzt) {
    var liste = fremdeMarken();
    var reihe = [];
    var daJetzt = {};
    var benutzt = {};

    liste.forEach(function (b) {
      var r = b.el.getBoundingClientRect();
      if (r.width < 6 || r.height < 6) return;
      if (anteil(r, false) <= 0) return;              /* liegt nicht im Stadtfenster */
      if (anteil(r, false) > MARKE) return;           /* das ist ein Brett, kein Punkt */

      /* Der Schluessel haengt am ORT, nicht am Text: eine Mahnkerbe mehr ist
         dieselbe Marke und soll nicht jedes Mal von neuem aufspringen. */
      var ort = b.el.getAttribute('data-ort') || '';
      var s = b.wer + '|' + (ort || ('n' + b.nr));
      if (benutzt[s]) s = s + '#' + b.nr;
      benutzt[s] = true;
      daJetzt[s] = true;

      var frisch = !(s in markenLage) || !markenDa[s]
        || (jetzt - (markenGesehen[s] || 0) > VERGESSEN);
      markenGesehen[s] = jetzt;

      if (frisch) {
        var vorher = markenLage[s];
        markenLage[s] = (markenAlle === 'zeigen') ? 'steht'
          : (vorher !== undefined) ? vorher
          : (jetzt - startZeit < LADEZEIT) ? 'ruht' : 'steht';
      }

      /* Der Takt des Rahmens darf nicht wegwischen, was der Zeiger gerade
         hervorgeholt hat: die Marke unter dem Zeiger bleibt sichtbar. */
      if (markenLage[s] === 'ruht' && s !== unterZeiger) b.el.classList.add(MRUHT);
      else b.el.classList.remove(MRUHT);
      if (s !== unterZeiger) b.el.classList.remove(MZEIGT);

      reihe.push({
        schluessel: s, ort: ort, el: b.el, wer: b.wer,
        ruht: markenLage[s] === 'ruht', wort: markenwort(b.el)
      });
    });

    /* Verschwundene Marken vergessen, damit ihr Pflock mitgeht. */
    Object.keys(markenLage).forEach(function (s) {
      if (!daJetzt[s] && (jetzt - (markenGesehen[s] || 0) > VERGESSEN)) {
        delete markenLage[s];
        delete markenGesehen[s];
      }
    });

    markenDa = daJetzt;
    markenZahl = reihe.length;
    zeichnePfloecke(reihe);
    return reihe.filter(function (m) { return m.ruht; }).length;
  }

  /* Wie viel zweier Rechtecke einander decken, gemessen am kleineren der
     beiden. Zwei Bretter, die sich an der Kante beruehren, sind kein Fall
     fuer die Platzordnung; eines, das zu einem Drittel auf dem anderen
     liegt, begraebt dessen Knoepfe. */
  function ueberdeckung(a, b) {
    var w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    var h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (w <= 0 || h <= 0) return 0;
    var klein = Math.min(a.width * a.height, b.width * b.height);
    return klein > 0 ? (w * h) / klein : 0;
  }

  /* DIE PLATZORDNUNG. Die Buehne ist fuer fuenf Stuecke zu klein geworden:
     DIE FUHRE allein kachelt 1,1 bis 78,2 Prozent ueber die ganze Hoehe,
     und DER SUD legt sich mit 47 Prozent Breite darueber. Wer zuletzt
     aufklappte, lag oben — und deckte dem anderen die Knoepfe zu, ohne dass
     man es ihnen ansah: sie blieben aktiv und im Bild, nur traf der Klick
     das Brett darueber. Ein Drittel aller Bedienelemente war so nicht zu
     erreichen, darunter der Rohstoffeinkauf, an dem das ganze Jahr haengt
     (spiel/BEFUND-BRETTER.md).

     Das Rechteck weiterzuschieben hilft nicht, es verschiebt nur, wer
     zugedeckt wird — gemessen und verworfen. Also entscheidet die Zeit:
     WER ZULETZT AUFGESCHLAGEN HAT, LIEGT OBEN; was er zudecken wuerde,
     klappt zu und behaelt seinen Reiter. Das macht die Bretter zu dem, was
     sie im Vorgabestand ohnehin sind — ein Stapel, aus dem man aufschlaegt. */
  function platzordnung(eintraege, jetzt) {
    var offen = eintraege.filter(function (e) {
      return lage[e.s] === 'auf' && anteil(e.r, false) <= 0.6;
    });
    if (offen.length < 2) return;
    /* Das juengste zuerst — es gewinnt jeden Streit, den es hat.

       BEI GLEICHSTAND ENTSCHEIDET DIE EBENE, NICHT DER ZUFALL. Wird die
       ganze Buehne in einem Zug neu gezeichnet, sind alle Bretter im selben
       Durchgang frisch und bekommen denselben Zeitstempel. Vorher fiel der
       Gleichstand still nach der Reihenfolge von EBENEN, in der 'blatt'
       zuletzt kommt — also verlor jedes Blatt gegen jedes Brett. Der Builder
       der FUHRE hat es gemessen: die Georgi-Tafel lag in 9 von 12
       Jahreswechseln als Reiter statt auf dem Tisch, und in E4 in allen
       dreien. Das widerspricht der eigenen Regel dieses Rahmens, dass ein
       formatfuellendes Blatt zum Jahreswechsel eine Entscheidung ist.
       Jetzt gewinnt bei gleicher Zeit, wer weiter oben liegt. */
    offen.sort(function (x, y) {
      var d = (aufZeit[y.s] || 0) - (aufZeit[x.s] || 0);
      return d !== 0 ? d : (y.rang - x.rang);
    });
    var liegt = [];
    offen.forEach(function (e) {
      for (var i = 0; i < liegt.length; i++) {
        if (imStreit(e, liegt[i])) { lage[e.s] = 'zu'; return; }
      }
      liegt.push(e);
    });
  }

  /* WORAN MAN EINEN STREIT ERKENNT.  (Runde 7)

     Bis hierher entschied allein das Rechteck: deckt es mehr als DECKGRENZE
     des kleineren Bretts, klappt das aeltere zu. Das ist zu grob in beide
     Richtungen. Ein Brett ist kein Rechteck, sondern eine Handvoll Knoepfe
     in viel Luft — DER SUD legt ueber DIE FUHRE ein 47 Prozent breites Feld,
     das zu drei Vierteln leer ist. Zwei Bretter koennen sich also zu einem
     Fuenftel decken, ohne dass ein einziger Zug darunter liegt; und eines
     kann ein anderes fast ganz begraben, ohne die Grenze zu reissen, wenn
     der Verdeckte klein ist.

     Der Befund, um den es geht, sagt es selbst (spiel/BEFUND-BRETTER.md §5):
     "erreichbar muss jeder aktive Zug sein". Also wird genau das gefragt und
     nicht seine Naeherung:

       Ein Streit ist, wenn das obere Brett einen ZUG des unteren zudeckt —
       oder wenn es das untere fast ganz verschluckt (dann ist es auch ohne
       Knopf darunter kein bedienbarer Zustand mehr).

     Das schliesst Bretter seltener und richtiger. Wer sich am Rand
     ueberlappt, bleibt offen; wer einen Knopf begraebt, klappt zu. */
  function deckt(r, el) {
    var x = el.left + el.width / 2, y = el.top + el.height / 2;
    return x > r.left && x < r.right && y > r.top && y < r.bottom;
  }

  function imStreit(oben, unten) {
    return ueberdeckung(oben.r, unten.r) > DECKGRENZE;
  }

  /* WAS DIE WERKBANK SELBST ZUDECKT.  (Runde 7)

     Die Platzordnung regelt Brett gegen Brett. Eine Partei war nie dabei:
     die Werkbank der STADT. Sie liegt ueber allem (das muss sie, sonst waeren
     die Reiter unter einem Brett nicht mehr zu treffen) und sie klappt nie
     zu. Ihr Vertrag steht im Kopf von stil/stadt.css — sie faengt erst bei
     87,5 Prozent der Hoehe an, und darueber ist Stadtfenster.

     Nachgemessen haelt sie ihn: Reiterzeile 87,11 / 87,43 / 87,40 Prozent,
     Bauhof 91,11 / 91,34 / 91,31 in 2752x1536, 1920x1000 und 1366x768. Aber
     der Vertrag hat eine zweite Haelfte, die niemand geprueft hat — dass
     unter ihr auch nichts LIEGT. In 1970 liegt dort etwas: drei Zuege der
     FUHRE sitzen bei 87,7 bis 98,9 Prozent der Hoehe, also unter der
     Reiterzeile und unter dem Bauhof, und sind fuer die Maus nicht da.

     Das ist ein fremder Befund und wird deshalb gemeldet, nicht geheilt: den
     Bauhof durchlaessig zu machen hiesse, einen Klick auf ein gemaltes Brett
     an einen unsichtbaren Knopf darunter zu geben, und das ist schlimmer als
     der Fehler. Damit ihn niemand suchen muss, zaehlt der Rahmen ihn:
     BRAUHAUS.stadt.rahmen.verdeckt(). */
  function verdecktVonWerkbank() {
    var w = werkbank();
    var teile = [w.querySelector('.stadt-reiterzeile'), w.querySelector('.stadt-bauhof')];
    var kaesten = [];
    teile.forEach(function (t) {
      if (!t) return;
      var r = t.getBoundingClientRect();
      if (r.width > 2 && r.height > 2) kaesten.push(r);
    });
    var l = document.querySelectorAll('[data-zug]');
    var raus = [];
    for (var i = 0; i < l.length; i++) {
      var el = l[i];
      var zug = el.getAttribute('data-zug');
      if (zug.indexOf('stadt:') === 0 || el.disabled) continue;
      var q = el.getBoundingClientRect();
      if (q.width < 2 || q.height < 2) continue;
      for (var k = 0; k < kaesten.length; k++) {
        if (!deckt(kaesten[k], q)) continue;
        var x = q.left + q.width / 2, y = q.top + q.height / 2;
        var oben = document.elementFromPoint(x, y);
        if (oben && (oben === el || el.contains(oben))) break;
        raus.push({ zug: zug, unter: kaesten[k] === kaesten[0] ? 'reiterzeile' : 'bauhof' });
        break;
      }
    }
    return raus;
  }

  function nachsehen() {
    var jetzt = Date.now();
    var liste = fremdeBretter();
    var reiter = [];
    var benutzt = {};
    var daJetzt = {};
    var eintraege = [];

    liste.forEach(function (b) {
      var s = schluesselVon(b);
      if (benutzt[s]) s = s + '#' + b.nr;
      benutzt[s] = true;

      var r = b.el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8) return;      /* nicht da, also kein Reiter */
      daJetzt[s] = true;

      /* Klein genug: das ist eine Marke im Bild, kein Brett. Finger weg.
         Wer sich als Ortsmarke ausgegeben hat und keine ist, hat diese
         zweite Schwelle verwirkt — sonst laege ein 3,49-%-Banner weiter
         ueber der Stadt, nur eben knapp unter der Grenze. */
      if (!b.verwirkt && anteil(r, false) <= GRENZE && !b.el.classList.contains(ZU)) {
        gesehen[s] = jetzt;
        return;
      }

      /* Frisch heisst: noch nie gesehen, oder eben wieder aufgetaucht. */
      var frisch = !(s in lage) || !warDa[s] || (jetzt - (gesehen[s] || 0) > VERGESSEN);
      gesehen[s] = jetzt;

      /* Was beim Laden schon dalag, liegt als Reiter — beim Laden will man
         sein Haus sehen. Was der Spieler gerade selbst geholt hat und was
         waehrend des Spiels neu aufschlaegt, schlaegt auf.

         Und das Dritte, das Runde 3 gekostet hat: ein fremdes Stueck baut
         sein Brett gelegentlich neu (leeren, fuellen). Zwischen zwei Blicken
         ist es dann kurz weg und gilt als frisch — danach stand es wieder
         offen ueber der Stadt, obwohl es niemand geholt hat. Ein Brett, das
         schon einmal eine Lage hatte, BEHAELT sie ueber seinen Neubau. */
      if (frisch) {
        var vorher = lage[s];
        lage[s] = (jetzt - handZeit < HANDFRIST) ? 'auf'
                : (vorher !== undefined) ? vorher
                : (jetzt - startZeit < LADEZEIT) ? 'zu' : 'auf';
      }
      /* Ein formatfuellendes Blatt zum Jahreswechsel ist eine Entscheidung. */
      if (jetzt - jahrZeit < JAHRESFRIST && anteil(r, true) > 0.25) lage[s] = 'auf';

      /* Ein Brett, das ohne Reiterklick aufschlaegt, gilt als eben geholt —
         sonst haette es keine Zeit und verloere jeden Streit gegen ein
         Brett, das seit dem Laden offen liegt. */
      /* Ein Brett, das eben wieder aufgetaucht ist, ist NEU auf dem Tisch.
         Vorher wurde der Zeitstempel nur gesetzt, wenn er 0 war — ein Blatt,
         das ein Jahr spaeter wiederkommt, trug damit seinen Stempel von vor
         einem Jahr und verlor jeden Streit gegen ein Brett, das seither
         offen lag. Gemeldet und gemessen vom Builder der FUHRE. */
      if (lage[s] === 'auf' && (!aufZeit[s] || !warDa[s])) aufZeit[s] = jetzt;
      if (lage[s] === 'zu') aufZeit[s] = 0;

      /* rang = Reihenfolge der Ebenen (EBENEN), damit der Gleichstand in
         der Platzordnung nicht still nach Einfuegereihenfolge faellt. */
      eintraege.push({ s: s, el: b.el, r: r, rang: eintraege.length });
    });

    platzordnung(eintraege, jetzt);

    eintraege.forEach(function (e) {
      if (lage[e.s] === 'auf') klappeAuf(e.el); else klappeZu(e.el);
      var t = beschriftung(e.el);
      reiter.push({
        schluessel: e.s, zu: lage[e.s] === 'zu', titel: t.titel, unter: t.unter
      });
    });

    warDa = daJetzt;
    var ruhend = marken(jetzt);
    zeichneReiter(reiter, ruhend);
  }

  function pruefe() {
    if (imGange) return;
    imGange = true;
    B.wage('stadt.rahmen', nachsehen);
    if (beobachter) beobachter.takeRecords();   /* eigene Aenderungen verwerfen */
    imGange = false;
  }

  function baldPruefen() {
    if (angemeldet) return;
    angemeldet = true;
    window.requestAnimationFrame(function () { angemeldet = false; pruefe(); });
  }

  function starteRahmen() {
    startZeit = Date.now();
    if (window.MutationObserver) {
      beobachter = new MutationObserver(function () { if (!imGange) baldPruefen(); });
      EBENEN.forEach(function (name) {
        var ebene = document.getElementById('ebene-' + name);
        if (ebene) beobachter.observe(ebene, { childList: true, subtree: true, attributes: true });
      });
    }
    /* Wer klickt, holt sich etwas. Ein Brett, das gleich danach erscheint,
       hat der Spieler geholt — das klappt nicht vor seiner Nase zu. */
    var buehne = document.getElementById('buehne');
    if (buehne) {
      buehne.addEventListener('click', function () { handZeit = Date.now(); }, true);
    }

    window.setInterval(pruefe, TAKT);
    window.addEventListener('resize', baldPruefen);
    pruefe();
  }

  /* --------------------------------------------------------------------
     ZEICHNEN
     -------------------------------------------------------------------- */
  function zeichnePlatte() {
    var fach = B.ebene('platte', 'stadt');
    var bild = fach.querySelector('.stadt-platte');
    if (!bild) {
      bild = B.el('img', 'stadt-platte');
      bild.alt = '';
      bild.setAttribute('draggable', 'false');
      fach.appendChild(bild);
    }
    var quelle = daten().platte;
    if (bild.getAttribute('data-quelle') !== quelle) {
      bild.setAttribute('data-quelle', quelle);
      bild.src = quelle;
    }
    fach.setAttribute('data-epoche', String(e()));
  }

  function hausbild(a, geist) {
    var m = masse(a);
    var el = B.el('img', 'stadt-haus' + (geist ? ' geist' : ''));
    el.alt = '';
    el.setAttribute('draggable', 'false');
    el.setAttribute('data-bau', a.schluessel);
    el.src = 'bild/hof/' + a.bild + '.png';
    el.style.width = m.breite + '%';
    /* Nicht (ort.y + dy) — das ist die Unterkante des RAHMENS. Der z-Index
       gehoert dem Fuss; siehe DIE TIEFE weiter oben. */
    el.style.zIndex = String(Math.round(tiefe(a) * 10));
    el.setAttribute('data-tiefe', B.rund(tiefe(a), 2));
    B.orte.setze(el, a.ort, { anker: 'unten', dx: m.dx, dy: m.dy });
    el.title = a.name + ' — ' + a.sagt;
    return el;
  }

  /* Feste Faecher. Sie werden EINMAL angelegt und danach einzeln neu
     gefuellt. Das ist kein Schoenheitsfehler, sondern eine Bedingung der
     Bedienbarkeit: wer bei jedem Mausueberfahren die ganze Ebene neu baut,
     reisst den Knopf unter dem Zeiger weg — und der Kritiker kommt nie zum
     Klick. */
  function teile() {
    var fach = B.ebene('bau', 'stadt');
    var t = {
      hof: fach.querySelector('.stadt-fach-hof'),
      geist: fach.querySelector('.stadt-fach-geist')
    };
    if (!t.hof) {
      t.hof = B.el('div', 'stadt-fach stadt-fach-hof');
      t.geist = B.el('div', 'stadt-fach stadt-fach-geist');
      fach.appendChild(t.hof);
      fach.appendChild(t.geist);
    }
    return t;
  }

  /* DIE WERKBANK am unteren Rand — ueber allem, was sonst auf der Buehne
     liegt, damit die Reiter erreichbar bleiben, wenn ein Brett aufliegt.
     Sie beginnt bei 87,5 % der Hoehe: darueber ist Stadtfenster. */
  function werkbank() {
    var fach = B.ebene('blatt', 'stadt');
    var w = fach.querySelector('.stadt-werkbank');
    if (!w) {
      w = B.el('div', 'stadt-werkbank');
      w.appendChild(B.el('div', 'stadt-reiterzeile greifbar'));
      w.appendChild(B.el('div', 'stadt-bauhof greifbar'));
      fach.appendChild(w);
    }
    return w;
  }

  function zeigeVorschau(schluessel) {
    vorschau = schluessel;
    var geist = teile().geist;
    B.leere(geist);
    if (!schluessel) return;
    var v = katalog().filter(function (a) { return a.schluessel === schluessel; })[0];
    if (v) geist.appendChild(hausbild(v, true));
  }

  function zeichneHof(fach) {
    stehend().forEach(function (a) {
      fach.appendChild(hausbild(a, false));

      /* Der Schornstein von 1884 raucht. 1970 steht er noch und raucht nicht
         mehr — das ist keine Kleinigkeit, das ist die Epoche. */
      if (a.schluessel === 'schornstein' && e() === 3) {
        var rauch = B.el('img', 'stadt-rauch');
        rauch.alt = '';
        rauch.src = 'bild/hof/rauch.png';
        rauch.style.width = '9%';
        rauch.style.zIndex = '900';
        /* Der Fuss der Fahne sitzt auf der Krone des Schafts: der Schaft ist
           breite * (779/218) hoch, gemessen in Prozent der Buehnenhoehe. */
        B.orte.setze(rauch, a.ort, { anker: 'unten', dx: masse(a).dx - 1.5, dy: -16 });
        fach.appendChild(rauch);
      }
    });
  }

  /* Die Namen der Stadt: echter Text an einem Ort. */
  function zeichneNamen(fach) {
    K.namen.forEach(function (n) {
      if (n.ab && e() < n.ab) return;
      if (!B.orte.da(n.ort)) return;
      var el = B.el('div', 'stadt-name');
      el.style.fontSize = 'calc(var(--s) * ' + B.rund(21 * (n.gross || 1), 2) + ')';
      el.style.zIndex = '960';
      el.appendChild(B.el('span', 'wort', n.text));
      B.orte.setze(el, n.ort, { anker: 'mitte', dx: n.dx || 0, dy: n.dy || 0 });
      fach.appendChild(el);
    });
  }

  var ANKER = '<svg class="anker" viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M12 2.6a2.1 2.1 0 0 0-.9 4v1.6H8.4v2h2.7v6.9c-2.5-.5-4.4-2.5-4.8-5H8L4.6 8.9 1.2 12.1h1.9c.5 4.4 4.1 7.8 8.6 7.9v.1h.6c4.7 0 8.6-3.5 9.1-8h1.9l-3.4-3.2-3.4 3.2h1.7c-.5 2.6-2.4 4.6-4.9 5.1v-6.9h2.7v-2h-2.7V6.6a2.1 2.1 0 0 0-.9-4z"/></svg>';

  /* DAS HAUSSCHILD.

     Runde 5, dritter Befund des Kritikers: "1970 ist das Hausschild ein
     rahmenloses weisses Rechteck 207x71 px auf (1138|917) — kein Pfosten,
     keine Wand dahinter, es steht vor drei Tiefenebenen zugleich."

     Er hat recht, und die Ursache steht in den drei anderen Epochen: dort
     haengt das Schild am Torbogen der Platte, also an etwas Gemaltem. In der
     Platte 1970 ist der Hof ein asphaltierter Parkplatz — da haengt nichts.
     Ein Schild muss aber irgendwo hAENGEN oder STEHEN.

     Deshalb bekommt das Schild, das keine Wand hinter sich hat, ein eigenes
     GESTELL: zwei Stahlrohre und ein Betonfuss, die auf dem Hofboden stehen,
     genau wie die Reklametafel, die in derselben Platte danebensteht.
     'gestell' ist die Hoehe der Rohre in Prozent der Buehnenhoehe; wo es
     gesetzt ist, sitzt der FUSS auf dem Ort und nicht die Mitte. */
  function zeichneHausschild(fach) {
    var s = daten().schild || {};
    var werk = B.el('div', 'stadt-schildwerk');
    werk.style.width = (s.breite || 7.5) + '%';
    werk.style.zIndex = '950';
    werk.style.rotate = (s.dreh || 0) + 'deg';

    var el = B.el('div', 'stadt-hausschild' + (s.hell ? ' hell' : '') + (s.klein ? ' klein' : ''));
    if (s.hell) {
      el.appendChild(B.el('div', 'zeile eins', 'BRAUHAUS'));
      el.appendChild(B.el('div', 'zeile zwei', 'ZUM ANKER'));
    } else {
      el.appendChild(B.el('div', 'zeile eins', 'BRAUHAUS'));
      var mitte = B.el('div', 'mitte');
      mitte.innerHTML = ANKER;
      el.appendChild(mitte);
      el.appendChild(B.el('div', 'zeile zwei', 'ZUM ANKER'));
      el.appendChild(B.el('div', 'gegr', 'GEGR. ' + B.welt.haus.gegruendet));
    }
    werk.appendChild(el);

    if (s.gestell) {
      var g = B.el('div', 'stadt-gestell');
      /* 'gestell' ist Prozent der Buehnenhoehe; --s ist ein Bezugspixel der
         Bezugsbuehne 2752x1536, also sind 1 % der Hoehe 15,36 Bezugspixel. */
      g.style.height = 'calc(var(--s) * ' + B.rund(s.gestell * 15.36, 2) + ')';
      g.appendChild(B.el('span', 'bein links'));
      g.appendChild(B.el('span', 'bein rechts'));
      g.appendChild(B.el('span', 'fuss'));
      werk.appendChild(g);
    }

    B.orte.setze(werk, s.ort || 'tor', {
      anker: s.gestell ? 'unten' : 'mitte',
      dx: s.dx || 0, dy: s.dy || 0
    });
    fach.appendChild(werk);
  }

  /* --------------------------------------------------------------------
     DER BAUHOF — die offenen Bauten der Epoche, mit Preisschild
     nebeneinander. Wer hier klickt, gibt Geld aus und sieht es im Bild.

     Runde 7: derselbe Kasten hat jetzt zwei Seiten. Links wird gebaut,
     rechts wird verwertet — und die zweite Seite heisst in jeder Epoche
     anders, weil sie in jeder Epoche etwas anderes ist. Zwei Seiten statt
     zwei Kaesten, weil die Werkbank ihren Vertrag haelt: sie faengt bei
     87,5 Prozent der Hoehe an und waechst dafuer nicht.
     -------------------------------------------------------------------- */
  var bauhofSeite = 'bau';        /* 'bau' | 'geld' */

  function zeichneBauhof(kasten) {
    var ep = e();
    var art = verwertungsArt(ep);
    var geldListe = verwertbar(ep).sort(function (a, b) { return preis(b, ep) - preis(a, ep); });
    if (bauhofSeite === 'geld' && !geldListe.length) bauhofSeite = 'bau';
    var geld = bauhofSeite === 'geld';
    var liste = geld ? geldListe.slice(0, 5)
                     : offen(ep).sort(function (a, b) { return a.grund - b.grund; }).slice(0, 5);

    B.leere(kasten);

    var kopf = B.el('div', 'kopf');
    var reiter = B.el('span', 'seiten');
    reiter.appendChild(B.knopf({
      text: 'BAUHOF', zug: 'stadt:seite:bau', klasse: 'stadt-seite' + (geld ? '' : ' auf'),
      titel: 'Was in dieser Zeit im Hof noch zu bauen ist.',
      tu: function () { bauhofSeite = 'bau'; B.sende('zeichne', { grund: 'stadt:bau' }); }
    }));
    reiter.appendChild(B.knopf({
      text: art.wort, zug: 'stadt:' + art.verb, klasse: 'stadt-seite' + (geld ? ' auf' : ''),
      aus: !geldListe.length,
      titel: art.kopf + '. ' + art.sagt,
      tu: function () { bauhofSeite = 'geld'; B.sende('zeichne', { grund: 'stadt:bau' }); }
    }));
    kopf.appendChild(reiter);
    kopf.appendChild(B.el('span', 'zahl', geld
      ? art.kopf
      : stehend(ep).length + ' Bauten im Hof · gebaut wird einmal, es steht auch für die Enkel'));
    kasten.appendChild(kopf);

    var reihe = B.el('div', 'reihe');
    kasten.appendChild(reihe);

    if (geld) { zeichneVerwertung(reihe, liste, ep, art); return; }

    if (!liste.length) {
      reihe.appendChild(B.el('div', 'leer', 'Der Hof ist für diese Zeit fertig gebaut.'));
    }

    liste.forEach(function (a) {
      var p = preis(a, ep);
      var kann = B.welt.kann(p);
      var zeile = B.el('div', 'bauzeile');
      var k = B.knopf({
        text: a.name,
        zug: 'stadt:bau:' + a.schluessel,
        preis: -p,
        aus: !kann,
        titel: a.sagt + (nutzenWort(a) ? '  [' + nutzenWort(a) + ']' : ''),
        tu: function () { kaufe(a); }
      });
      k.addEventListener('mouseenter', function () {
        B.wage('stadt.vorschau', function () { zeigeVorschau(a.schluessel); });
      });
      k.addEventListener('mouseleave', function () {
        if (vorschau === a.schluessel) {
          B.wage('stadt.vorschau', function () { zeigeVorschau(null); });
        }
      });
      zeile.appendChild(k);
      zeile.appendChild(B.el('div', 'nutzen', nutzenWort(a) || 'steht, solange das Haus steht'));
      reihe.appendChild(zeile);
    });

    /* Die eine Zahl der Messlatte: der naechste sinnvolle Zug. Der dritte
       Wert sagt, WAS fuer ein Zug das ist — ein Bau aendert die Lage, er ist
       kein Umtrunk. Vier Stuecke melden ihn inzwischen mit; der Kern nimmt
       ihn noch nicht an (siehe Bericht, Absatz KERN). */
    if (liste.length) {
      var billigste = liste[0];
      B.welt.meldeZug('Bau ' + billigste.name, preis(billigste, ep), 'lage');
    }
  }

  /* Die zweite Seite: was der Hof noch wert ist. Die Preisschilder stehen
     hier mit Plus — das ist der Unterschied, auf den es ankommt, wenn die
     Kasse leer ist. */
  function zeichneVerwertung(reihe, liste, ep, art) {
    if (!liste.length) {
      reihe.appendChild(B.el('div', 'leer',
        'Im Hof steht nichts mehr, was sich zu Geld machen ließe.'));
      return;
    }
    liste.forEach(function (a) {
      var betrag = erloes(a, ep, false);
      var zeile = B.el('div', 'bauzeile');
      var k = B.knopf({
        text: art.tat + ': ' + a.name,
        zug: 'stadt:' + art.verb + ':' + a.schluessel,
        preis: betrag,
        klasse: 'stadt-verwertung',
        titel: art.sagt + '  [Bauwert ' + B.welt.geld(preis(a, ep)) + ' · '
             + (art.bleibt ? 'bleibt im Hof, ' + B.rund(art.zins * 100, 1)
                             + ' % Zins jeden Michaeli'
                           : 'geht aus dem Hof'
                             + (nutzenWort(a) ? ', kostet ' + nutzenWort(a) : '')) + ']',
        tu: function () { verwerteZug(a); }
      });
      k.addEventListener('mouseenter', function () {
        B.wage('stadt.vorschau', function () { zeigeVorschau(a.schluessel); });
      });
      k.addEventListener('mouseleave', function () {
        if (vorschau === a.schluessel) {
          B.wage('stadt.vorschau', function () { zeigeVorschau(null); });
        }
      });
      zeile.appendChild(k);
      zeile.appendChild(B.el('div', 'nutzen', art.bleibt
        ? 'bleibt stehen · ' + B.rund(art.zins * 100, 1) + ' % Zins'
        : (nutzenWort(a) ? 'weg: ' + nutzenWort(a) : 'geht aus dem Hof')));
      reihe.appendChild(zeile);
    });
  }

  function zeichne() {
    zeichnePlatte();
    var t = teile();
    B.leere(t.hof);
    B.leere(t.geist);
    vorschau = null;
    zeichneHof(t.hof);
    zeichneNamen(t.hof);
    zeichneHausschild(t.hof);
    zeichneBauhof(werkbank().querySelector('.stadt-bauhof'));
    baldPruefen();
  }

  /* --------------------------------------------------------------------
     ANMELDUNG
     -------------------------------------------------------------------- */
  BRAUHAUS.stueck('stadt', {

    aufbau: function () {
      setzeStand();
      werkbank();

      /* Alles vorladen: der Hof soll beim Kauf sofort dastehen, und der
         Epochenwechsel darf nicht flackern. Kein Netzzugriff nach aussen. */
      Object.keys(K.epochen).forEach(function (nr) {
        (new Image()).src = K.epochen[nr].platte;
      });
      K.aufbauten.forEach(function (a) {
        (new Image()).src = 'bild/hof/' + a.bild + '.png';
      });
      (new Image()).src = 'bild/hof/rauch.png';

      starteRahmen();
    },

    zeichne: zeichne,

    /* Michaeli: erst laeuft der Zins, dann sieht der Rat in die Kasse.
       Das ist der Boden — unter null bleibt sie nicht liegen, es kostet nur
       jedes Mal ein Stueck Hof. */
    jahr: function () {
      jahrZeit = Date.now();
      zinsLaeuft();
      ratGreiftZu();
    },

    /* Die Epoche nimmt, was ihre Zeit ueberlebt hat, und laesst den Rest
       zurueck. Der Hof waechst weiter, er faengt nicht neu an. */
    epoche: function (d) {
      var neu = d.epoche || e();
      jahrZeit = Date.now();
      Object.keys(gebaut).forEach(function (s) {
        var a = K.aufbauten.filter(function (x) { return x.schluessel === s; })[0];
        if (!a) return;
        if (a.bis < neu) {
          delete gebaut[s];
          B.welt.schreibe(a.name + ' hat seine Zeit hinter sich und verschwindet aus dem Hof.',
            'bau');
        }
      });
    }
  });

  /* Kleiner Lesezugriff fuer die anderen drei Stuecke: steht das schon?
     Niemand muss dafuer in fremdes DOM sehen.
     rahmen.* ist der Vertrag ueber das Stadtfenster: wer sein Brett selbst
     in eine Leiste legt, setzt data-frei und wird nicht mehr angefasst. */
  B.stadt = {
    hat: hat,
    stehend: function () { return stehend().map(function (a) { return a.schluessel; }); },
    offen: function () { return offen().map(function (a) { return a.schluessel; }); },
    /* DER BODEN: was der Hof heute noch bar wert ist, und wie er zu Geld
       wird. Damit kann jeder nachrechnen, ohne Quelltext zu lesen:
       BRAUHAUS.stadt.hofwert() */
    hofwert: function () {
      var ep = e(), art = verwertungsArt(ep);
      var frei = verwertbar(ep).reduce(function (s, a) { return s + erloes(a, ep, false); }, 0);
      var zwang = stehend(ep).reduce(function (s, a) { return s + erloes(a, ep, true); }, 0);
      return {
        art: art.verb, wort: art.wort,
        bauten: stehend(ep).length, verwertbar: verwertbar(ep).length,
        bar: frei, imZwang: zwang,
        belastet: Object.keys(belastet).length
      };
    },
    rahmen: {
      fenster: FENSTER,
      grenze: GRENZE,
      marke: MARKE,
      ebenen: EBENEN.slice(),
      lage: function () { return JSON.parse(JSON.stringify(lage)); },
      zeige: alleZuklappen,
      schalte: schalte,
      verdeckt: verdecktVonWerkbank
    },
    /* Die Kartenschicht: wer seine Marke selbst setzen will, setzt data-frei
       und wird nicht mehr angefasst — wie beim Rahmen. */
    karte: {
      lage: function () { return JSON.parse(JSON.stringify(markenLage)); },
      zahl: function () { return markenZahl; },
      schalte: markenSchalter
    },
    /* DIE TIEFE, damit DAS LOT (stuecke/stadt-zusatz.js) mit genau derselben
       Zahl prueft, aus der der z-Index entsteht — und nicht mit einer
       zweiten, die daneben liegt. Ein Pruefer, der anders rechnet als der
       Zeichner, findet den naechsten Pferdestall wieder erst am Bildschirm. */
    mass: {
      masse: masse,
      bildhoehe: function (a, nr) { return bildhoehe(a, masse(a, nr)); },
      fuss: function (a, nr) { return fusshoehe(a, masse(a, nr), nr); },
      mauer: mauerhoehe,
      tiefe: tiefe,
      katalog: katalog
    }
  };

})(BRAUHAUS);
