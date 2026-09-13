/* ===========================================================================
   kern/klar.js — DIE KLARHEIT.  GEHOERT DEM SKELETT-BAUER.

   Warum es diese Datei gibt
   -------------------------
   Acht blinde Spieler (zwei je Epoche, nur ueber den Bildschirm, ohne
   Quelltext und ohne Konzeptblatt) haben das Spiel gespielt. Kein einziger
   JS-Fehler, keine kaputte Schleife, alle acht ueberlebten zwei Braujahre —
   und trotzdem wusste nach zwei Braujahren KEINER, ob es gut oder schlecht
   laeuft. Sechs von acht sassen in der Todesspirale und hielten sie fuer den
   Normalbetrieb. Gemessen:

     · 5 bis 12 Minuten bis zum ersten verstandenen Erfolg
     · 16 bis 30 von 45 bis 48 Knoepfen in Woche 1 verstanden
     · Der auffaelligste Geldknopf verspricht +40 Pf und bringt +2 Pf;
       in 1884 verspricht er +289 M, und die Kasse faellt um 380 M.
     · Der Rat entzieht das Braurecht im VIERTEN Braujahr, rund hundert
       Wochen nach der Entscheidung, die es gekostet hat.

   Das Spiel hat diese Auskuenfte alle. Sie stehen im BUCH (das niemand
   oeffnete), im `title` der Knoepfe (das keiner der drei Leser sah, weil es
   ein Browser-Tooltip ist) und in einem Reiter, den in 64 Wochen niemand
   aufschlug. Was fehlte, war nicht die Zahl, sondern die Zahl AN DER STELLE,
   AN DER ENTSCHIEDEN WIRD.

   Die Regel dieser Datei
   ----------------------
   SIE MISST DAS SPIEL, SIE RECHNET ES NICHT NACH.

   Jede Zahl hier kommt aus dem Weltzustand und aus B.protokoll — also aus
   dem, was das Spiel selbst gebucht hat, nachdem es geschehen ist. Diese
   Datei kennt keine Braupreise, keine Fuhrloehne und keine Sudordnung; sie
   kennt nur die Kasse vorher und die Kasse nachher. Damit kann sie dem Spiel
   nicht widersprechen, sie kann keine Regel verdoppeln, die sich anderswo
   aendert, und sie faellt nicht auseinander, wenn ein Stueck seine Rechnung
   umbaut. Was sie zeigt, ist definitionsgemaess wahr: es ist geschehen.

   Sie aendert am Spielverlauf nichts. Kein Wuerfelwurf, kein Zustand, keine
   Runde — nur Anzeige. Der Determinismus (?saat=) bleibt Zeile fuer Zeile.
   =========================================================================== */

(function (B) {
  'use strict';

  /* Wie viele Wochen Verlauf die Hochrechnung ansieht. Kurz genug, um auf
     eine Wende zu reagieren, lang genug, um eine einzelne teure Woche nicht
     fuer einen Trend zu halten. */
  var TREND_WOCHEN = 8;

  /* Wie viele Posten die Quittung und die Wochenbilanz hoechstens einzeln
     nennen. Was darueber liegt, wird zu „und N weitere" zusammengefasst —
     ein Kasten, der ueberlaeuft, ist genau der Fehler, den die Blindprobe an
     der Michaelitafel gefunden hat. */
  var POSTEN_HOECHSTENS = 4;

  var Z = {
    vorKlick: null,       /* Momentaufnahme vor dem laufenden Klick          */
    quittung: null,       /* was der letzte Klick bewirkt hat                */
    bilanz: null,         /* was die letzte Woche gekostet und gebracht hat  */
    wocheStart: 0,        /* Protokollstand am Anfang der laufenden Woche    */
    verlauf: [],          /* [{jahr, woche, kasse, rohstoff, faesser}]       */
    kosten: [],           /* Aufwand der letzten Wochen, fuer den Mittelwert */
    ein: [],              /* und was sie eingebracht haben                  */
    letzteMarke: null     /* jahr/woche der letzten Verlaufsmarke            */
  };

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */

  function bereit() {
    return !!(B.welt && B.welt.haus && B.welt.zeit && B.protokoll);
  }

  function kasse() { return bereit() ? B.welt.haus.kasse : 0; }
  function rohstoff() { return bereit() ? B.welt.haus.rohstoff : 0; }
  function faesser() { return (B.welt && B.welt.vorrat) ? B.welt.vorrat.faesser.length : 0; }

  function momentaufnahme() {
    return {
      kasse: kasse(),
      rohstoff: rohstoff(),
      faesser: faesser(),
      protokoll: B.protokoll ? B.protokoll.length : 0,
      jahr: B.welt.zeit.jahr,
      woche: B.welt.zeit.woche,
      ende: !!B.welt.zeit.ende
    };
  }

  /* Der Lichthof des Rahmens — dieselbe Schrift traegt sich selbst, wo kein
     Kasten hingehoert (siehe kern/kopf.js). */
  var LICHTHOF = 'text-shadow:0 0 calc(var(--s)*9) rgba(255,248,230,.98),'
    + '0 0 calc(var(--s)*4) rgba(255,248,230,.98);';

  /* Ein Kasten, auf dem Text wirklich steht. Die Blindprobe hat in ALLEN
     acht Laeufen gemeldet, dass Schrift ohne Grund ueber Daechern und
     Gaensen nicht zu lesen ist; was diese Datei schreibt, ist genau das,
     worauf es ankommt, und bekommt deshalb Papier. */
  function papier(klasse) {
    var k = B.el('div', 'klar ' + (klasse || ''));
    k.style.cssText = 'position:relative;background:rgba(252,246,232,.97);'
      + 'border:1px solid rgba(90,66,38,.55);border-radius:calc(var(--s)*4);'
      + 'box-shadow:0 calc(var(--s)*3) calc(var(--s)*12) rgba(40,26,12,.28);'
      + 'padding:calc(var(--s)*7) calc(var(--s)*10);color:#2b1d10;'
      + 'font-family:var(--serif);font-size:max(12px,calc(var(--s)*19));'
      + 'line-height:1.28;z-index:3;';
    return k;
  }

  function zeile(text, klasse) {
    var z = B.el('div', 'klar-zeile ' + (klasse || ''), text);
    z.style.cssText = 'display:flex;justify-content:space-between;gap:calc(var(--s)*14);'
      + 'white-space:nowrap;';
    return z;
  }

  function posten(was, zahl, gut) {
    var z = B.el('div', 'klar-posten');
    z.style.cssText = 'display:flex;justify-content:space-between;gap:calc(var(--s)*16);'
      + 'white-space:nowrap;font-size:max(11px,calc(var(--s)*18));';
    var w = B.el('span', null, was);
    w.style.cssText = 'overflow:hidden;text-overflow:ellipsis;max-width:calc(var(--s)*330);';
    z.appendChild(w);
    var g = B.el('span', null, zahl);
    g.style.cssText = 'font-family:var(--mono);font-variant-numeric:tabular-nums;'
      + 'color:' + (gut === null ? '#4a3a24' : (gut ? '#2f5d2a' : '#8a2f20')) + ';';
    z.appendChild(g);
    return z;
  }

  /* ----------------------------------------------------------------------
     WAS SEIT EINER MARKE GEBUCHT WURDE

     Fasst gleiche Posten zusammen (dreimal „Ungeld −1 Pf" ist eine Zeile mit
     −3 Pf) und sortiert nach Betrag — die groesste Bewegung zuerst, denn die
     erklaert den Kassenstand.
     ---------------------------------------------------------------------- */
  function buchungenSeit(stand) {
    if (!B.protokoll) return [];
    var neu = B.protokoll.slice(Math.max(0, stand));
    var nachName = {}, reihe = [];
    neu.forEach(function (p) {
      /* Der Name ohne die wechselnden Zahlen darin — sonst zaehlt jede
         Lieferung als eigener Posten. */
      var name = String(p.was || '').replace(/\s*·.*$/, '').replace(/\s*\(nicht bezahlbar\)$/, '');
      var schluessel = p.wer + '|' + name;
      if (!nachName[schluessel]) {
        nachName[schluessel] = { was: name, wer: p.wer, preis: 0, mal: 0,
                                 menge: 0, misslungen: false };
        reihe.push(nachName[schluessel]);
      }
      var e = nachName[schluessel];
      e.preis += p.preis || 0;
      e.menge += p.menge || 0;
      e.mal += 1;
      if (p.misslungen) e.misslungen = true;
    });
    reihe.sort(function (a, b) { return Math.abs(b.preis) - Math.abs(a.preis); });
    return reihe;
  }

  function postenListe(buchungen, kasten) {
    var gezeigt = buchungen.filter(function (b) { return b.preis || b.menge || b.misslungen; });
    var rest = 0, restSumme = 0;
    gezeigt.forEach(function (b, i) {
      if (i >= POSTEN_HOECHSTENS) { rest++; restSumme += b.preis; return; }
      var zahlText = b.preis
        ? (b.preis > 0 ? '+' : '−') + B.welt.geld(Math.abs(b.preis))
        : (b.menge ? B.welt.menge(b.menge) : '—');
      var name = b.was + (b.mal > 1 ? ' (' + b.mal + '×)' : '')
        + (b.wer === 'verfall' ? ' · ohne Hand' : (b.wer === 'gegner' ? ' · Gegner' : ''));
      kasten.appendChild(posten(name, zahlText, b.preis ? b.preis > 0 : null));
    });
    if (rest > 0) {
      kasten.appendChild(posten('und ' + rest + ' weitere',
        restSumme ? ((restSumme > 0 ? '+' : '−') + B.welt.geld(Math.abs(restSumme))) : '—',
        restSumme ? restSumme > 0 : null));
    }
    return gezeigt.length;
  }

  /* ======================================================================
     1 · DIE QUITTUNG — was der letzte Klick wirklich getan hat

     Die Blindprobe in einem Satz: „Der Knopf verspricht +40 Pf, die Kasse
     steigt um 2." Beides ist wahr — der Knopf nennt den Erloes, die Kasse
     zeigt, was nach Fuhrlohn, Ungeld und Sud davon uebrig ist, und ein Teil
     steht ueberhaupt nur angeschrieben. Die Quittung sagt beides
     nebeneinander, in der Waehrung des Jahres, an der Stelle, an der gerade
     geklickt wurde.
     ====================================================================== */

  function nimmVor(el) {
    if (!bereit()) return;
    var zug = el ? el.getAttribute('data-zug') : null;
    var text = el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
    Z.vorKlick = momentaufnahme();
    Z.vorKlick.zug = zug;
    Z.vorKlick.text = text.slice(0, 70);
    /* Das Preisschild des Knopfes — das ist das VERSPRECHEN, gegen das die
       Quittung rechnet. */
    var p = el ? el.getAttribute('data-preis') : null;
    Z.vorKlick.versprochen = (p === null || p === undefined || p === '') ? null : parseFloat(p);
    /* Der Abdruck des Wochenlaufs VOR dem Klick — verglichen wird er erst
       beim naechsten Zeichnen, wenn das Bild steht (siehe wochenSchritt). */
    Z.vorKlick.abdruck = laufAbdruck();

    /* GEMERKT WIRD DER KLICK, NICHT DIE QUITTUNG.

       Der Schritt der Woche darf sich nicht darauf verlassen, dass es zu
       jedem Klick eine Quittung gibt: das Anschlagen eines Brautags bewegt
       weder Geld noch Vorrat, und `reinesOeffnen` unterdrueckt die Quittung
       fuer solche Knoepfe mit gutem Grund — „Nichts geschehen" waere dort
       eine Falschmeldung. Ohne diese Notiz riet die Zeile in 1900 elfmal
       hintereinander zum Anschlagen, weil sie den eigenen Klick nie zu
       sehen bekam. */
    if (zug) Z.schrittKlick = { zug: zug, abdruck: Z.vorKlick.abdruck };
  }

  function werteAus() {
    if (!Z.vorKlick || !bereit()) { Z.vorKlick = null; return; }
    var v = Z.vorKlick;
    Z.vorKlick = null;

    var jetzt = momentaufnahme();
    var buchungen = buchungenSeit(v.protokoll);
    var dKasse = jetzt.kasse - v.kasse;
    var dRohstoff = jetzt.rohstoff - v.rohstoff;
    var dFass = jetzt.faesser - v.faesser;
    var wocheGelaufen = (jetzt.jahr !== v.jahr) || (jetzt.woche !== v.woche);

    /* Ein Klick, der NICHTS getan hat, ist die zweite Haelfte des Befundes:
       die Blindprobe hat ueber dreissig tote oder ins Leere laufende Klicks
       gezaehlt, und keiner von ihnen sagte, dass er nichts tat. Hier sagt er
       es. Ausgenommen sind Knoepfe, die nur etwas AUFSCHLAGEN sollen (ein
       Brett, ein Blatt, ein Reiter) — die tun sichtbar genug. */
    /* WAS NUR ETWAS ZEIGT, MUSS NICHTS BUCHEN.

       Die Quittung sagt „Nichts geschehen", wenn ein Klick weder Geld noch
       Vorrat bewegt und die Woche nicht schaltet. Fuer einen Zug ist das die
       richtige Auskunft; fuer einen Knopf, der nur etwas AUFSCHLAEGT,
       UMLEGT oder ZEIGT, ist es eine Falschmeldung — und die Nachprobe hat
       genau die kassiert: die sieben Ortsmarken meldeten „Nichts geschehen",
       obwohl sie taten, was auf ihnen steht. Ein Kasten, der ueber tote
       Knoepfe wacht und dabei selbst falsch meldet, ist schlimmer als
       keiner. */
    var reinesOeffnen = /(:reiter:|:marke:|:blatt|:band$|:seite:|chronik|protokoll|buch|:auf$|:zu$|:auf:|zeige|zeigen|schliess|bauhof|tafel)/i.test(v.zug || '');
    var nichts = !buchungen.length && !dKasse && !dRohstoff && !dFass && !wocheGelaufen;

    if (nichts && reinesOeffnen) return;

    Z.quittung = {
      titel: v.text || 'Der letzte Zug',
      zug: v.zug,
      versprochen: v.versprochen,
      dKasse: dKasse, dRohstoff: dRohstoff, dFass: dFass,
      buchungen: buchungen,
      wocheGelaufen: wocheGelaufen,
      nichts: nichts,
      abdruck: v.abdruck || null,
      kasseNachher: jetzt.kasse
    };
    zeichneKlar();
  }

  function zeichneQuittung(fach) {
    var q = Z.quittung;
    if (!q) return;

    var k = papier('klar-quittung');
    /* Unten links, ueber der Wochenkarte und unter der Stadt — dort, wo in
       allen vier Epochen der Knopf steht, der geklickt wurde. */
    k.style.cssText += 'width:100%;box-sizing:border-box;';
    k.setAttribute('data-klar', 'quittung');
    k.setAttribute('data-klar-kasse', String(q.dKasse));

    var kopf = B.el('div', 'klar-kopf', q.nichts ? 'Nichts geschehen' : 'Das hat der Zug gebracht');
    kopf.style.cssText = 'font-variant:small-caps;letter-spacing:calc(var(--s)*2);'
      + 'font-size:max(11px,calc(var(--s)*18));color:#6a5436;'
      + 'border-bottom:1px solid rgba(90,66,38,.3);margin-bottom:calc(var(--s)*5);'
      + 'padding-bottom:calc(var(--s)*3);';
    k.appendChild(kopf);

    var name = B.el('div', 'klar-titel', q.titel);
    name.style.cssText = 'font-weight:700;margin-bottom:calc(var(--s)*4);'
      + 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    k.appendChild(name);

    if (q.nichts) {
      var w = B.el('div', 'klar-nichts',
        'Dieser Knopf hat weder Geld noch Vorrat bewegt und die Woche nicht '
        + 'weitergeschaltet. Entweder liegt etwas darüber, oder er wirkt erst später.');
      w.style.cssText = 'font-size:max(11px,calc(var(--s)*18));color:#6a5436;'
        + 'white-space:normal;max-width:calc(var(--s)*360);';
      k.appendChild(w);
      fach.appendChild(k);
      return;
    }

    postenListe(q.buchungen, k);

    /* Die Summe — die eine Zahl, die in der Kopfleiste steht. */
    var strich = B.el('div');
    strich.style.cssText = 'border-top:1px solid rgba(90,66,38,.35);'
      + 'margin-top:calc(var(--s)*5);padding-top:calc(var(--s)*4);';
    k.appendChild(strich);

    var summe = posten('In der Kasse',
      (q.dKasse > 0 ? '+' : (q.dKasse < 0 ? '−' : '±')) + B.welt.geld(Math.abs(q.dKasse)),
      q.dKasse ? q.dKasse > 0 : null);
    summe.style.fontWeight = '700';
    summe.style.fontSize = 'max(12px,calc(var(--s)*20))';
    k.appendChild(summe);

    /* DER SATZ, DEN DIE BLINDPROBE VERMISST HAT.
       Nur wenn der Knopf wirklich etwas versprochen hat und die Kasse etwas
       anderes sagt — sonst waere es Laerm. */
    if (q.versprochen !== null && Math.abs(q.versprochen - q.dKasse) >= 1) {
      var diff = B.el('div', 'klar-abweichung');
      diff.style.cssText = 'margin-top:calc(var(--s)*4);font-size:max(11px,calc(var(--s)*17));'
        + 'color:#6a5436;white-space:normal;max-width:calc(var(--s)*360);font-style:italic;';
      diff.textContent = 'Am Knopf stand '
        + (q.versprochen > 0 ? '+' : '−') + B.welt.geld(Math.abs(q.versprochen))
        + ' — der Rest ist angeschrieben oder gleich wieder hinausgegangen.';
      k.appendChild(diff);
    }

    if (q.dRohstoff || q.dFass) {
      var v = B.el('div', 'klar-vorrat');
      v.style.cssText = 'margin-top:calc(var(--s)*3);font-size:max(11px,calc(var(--s)*16));'
        + 'color:#4a3a24;font-family:var(--mono);white-space:nowrap;'
        + 'overflow:hidden;text-overflow:ellipsis;';
      var teile = [];
      if (q.dFass) teile.push((q.dFass > 0 ? '+' : '−') + B.welt.menge(Math.abs(q.dFass))
        + ' im ' + (B.welt.epoche().lager || 'Keller'));
      if (q.dRohstoff) teile.push((q.dRohstoff > 0 ? '+' : '−') + B.zahl(Math.abs(q.dRohstoff))
        + ' ' + B.welt.epoche().rohstoff);
      v.textContent = teile.join('  ·  ');
      k.appendChild(v);
    }

    fach.appendChild(k);
  }

  /* ======================================================================
     2 · DIE WOCHENBILANZ — was die Woche gekostet und gebracht hat

     Die Nullstrategie („nur WEITER") fiel in 1350 von 112 auf 0 Pf, ohne dass
     je ein Grund erschien. Der Grund stand die ganze Zeit im Buch.
     ====================================================================== */

  function wocheAbschliessen() {
    if (!bereit()) return;
    var buchungen = buchungenSeit(Z.wocheStart);
    var ein = 0, aus = 0;
    buchungen.forEach(function (b) {
      if (b.preis > 0) ein += b.preis; else aus += -b.preis;
    });
    Z.bilanz = {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      buchungen: buchungen, ein: ein, aus: aus, netto: ein - aus
    };
    /* Was eine Woche kostet, OHNE was sie einbringt — Sud, Fuhrlohn, Ungeld,
       Unterhalt. Das ist die Zahl, die der Fahren-Knopf nicht nennen kann
       (sie faellt an, weil die Woche zu Ende geht, nicht weil diese Fuhre
       fuhr) und die in 1884 den Unterschied zwischen „+82 M am Knopf" und
       „−398 M in der Kasse" ausmacht. Gemerkt wird sie, nicht gerechnet. */
    Z.kosten.push(aus);
    if (Z.kosten.length > TREND_WOCHEN) Z.kosten.shift();
    Z.ein.push(ein);
    if (Z.ein.length > TREND_WOCHEN) Z.ein.shift();
    Z.wocheStart = B.protokoll.length;
    merkeVerlauf();
  }

  /* Der mittlere Wochenaufwand der letzten Wochen. Der MITTLERE, nicht der
     durchschnittliche: eine einzelne Michaeli-Woche mit einer Ablösung von
     tausend Pfennig darf die Zahl nicht verbiegen. */
  function mitte(liste) {
    if (liste.length < 2) return null;
    var l = liste.slice().sort(function (a, b) { return a - b; });
    return Math.round(l[Math.floor(l.length / 2)]);
  }

  function wochenkosten() { return mitte(Z.kosten); }
  function wocheneinnahmen() { return mitte(Z.ein); }

  function merkeVerlauf() {
    if (!bereit()) return;
    var marke = B.welt.zeit.jahr + '/' + B.welt.zeit.woche;
    if (Z.letzteMarke === marke) return;
    Z.letzteMarke = marke;
    Z.verlauf.push({ jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
                     kasse: kasse(), rohstoff: rohstoff(), faesser: faesser() });
    if (Z.verlauf.length > 400) Z.verlauf.shift();
  }

  /* ======================================================================
     3 · DIE LAGE — Hochrechnung, Vorrat, Abnehmer

     Alles hier ist gemessen, nicht gerechnet: die Steigung der letzten
     Wochen, fortgeschrieben. Steht zu wenig Verlauf zur Verfuegung, sagt die
     Zeile nichts — sie erfindet keinen Trend aus zwei Punkten.
     ====================================================================== */

  function trend(feld) {
    var v = Z.verlauf;
    if (v.length < 3) return null;
    var n = Math.min(TREND_WOCHEN, v.length);
    var a = v[v.length - n], b = v[v.length - 1];
    var wochen = (b.jahr - a.jahr) * B.uhr.WOCHEN_IM_JAHR + (b.woche - a.woche);
    if (wochen <= 0) return null;
    return (b[feld] - a[feld]) / wochen;
  }

  /* Wie viele Wochen, bis das Feld bei null ist? null = faellt nicht. */
  function reicht(feld) {
    var t = trend(feld);
    if (t === null || t >= -0.0001) return null;
    var jetzt = Z.verlauf[Z.verlauf.length - 1][feld];
    if (jetzt <= 0) return 0;
    return Math.max(0, Math.floor(jetzt / -t));
  }

  /* ----------------------------------------------------------------------
     WO LIEGT DIESER KNOPF?

     Die erste Fassung dieser Warnung nannte ein Brett beim Namen („Nachgekauft
     wird auf dem Brett DAS SUDHAUS"). In 1600 war das falsch, und ein blinder
     Spieler hat die Partie darueber verloren: „das Spiel sagte mir jede Woche
     richtig, was schiefging, und schickte mich fuer die Abhilfe auf das
     falsche Brett."

     Ein Name, der geraten ist, ist schlimmer als keiner. Diese Datei raet
     nicht — sie SIEHT NACH: sie sucht den Knopf im Bild und liest ab, in
     welchem Brett er liegt. Findet sie ihn nicht (das Brett ist zugeklappt,
     der Knopf gibt es in dieser Epoche nicht), sagt sie nichts weiter. Das
     ist dieselbe Regel wie ueberall hier: lieber eine Auskunft weniger als
     eine falsche.
     ---------------------------------------------------------------------- */
  function woLiegt(zug) {
    if (typeof document === 'undefined') return null;
    var el = document.querySelector('[data-zug="' + zug + '"]');
    if (!el) return null;
    var n = el.parentElement;
    while (n && n.id !== 'buehne') {
      /* DIE STADT gibt einem Brett `data-reiter`, wenn es sich selbst
         beschriften will — das ist der genaueste Name, den es gibt. */
      var name = n.getAttribute && n.getAttribute('data-reiter');
      if (name) return String(name).split(' · ')[0].trim();
      /* Sonst die Ueberschrift des Bretts, in dem der Knopf liegt. Woran
         man ein Brett erkennt: es ist der Kasten, den DIE STADT auf- und
         zuklappt, und der traegt eine der vier Klassen. Nachgemessen in
         allen vier Epochen — der Rohstoffknopf liegt in einem Kasten
         `fu-brett fu-tafel fu-schiefer`, dessen Ueberschrift „SUDORDNUNG"
         lautet und der mit dem gleichnamigen Reiter aufgeschlagen wird. */
      var kl = (n.className || '').toString();
      if (/(^|[\s-])(brett|band|tafel|karte)([\s-]|$)/.test(kl)
          || (n.classList && n.classList.contains('amort'))) {
        var kopf = n.querySelector ? n.querySelector('b, strong, h2, h3, .titel') : null;
        var t = kopf ? (kopf.textContent || '').replace(/\s+/g, ' ').trim() : '';
        if (t && t.length <= 40) return t;
      }
      n = n.parentElement;
    }
    return null;
  }

  /* Der Knopf, der den Rohstoff nachfuellt. Er gehoert DER FUHRE und heisst
     in jeder Epoche anders („Grut vom Grutherrn", „Hopfen vom Markt",
     „Hopfen aus der Hallertau", „Hopfen im Kontrakt") — der Schluessel ist
     derselbe, und der steht hier, nicht der Name. */
  function rohstoffKnopf() {
    if (typeof document === 'undefined') return null;
    var el = document.querySelector('[data-zug="fuhre:kauf:rohstoff"]');
    if (!el) return null;
    return {
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      brett: woLiegt('fuhre:kauf:rohstoff')
    };
  }

  /* ----------------------------------------------------------------------
     DER NAECHSTE SCHRITT DER WOCHE

     DER BEFUND.  Die Zeile „naechster Zug" ist die beste des Spiels und
     nennt trotzdem nie das, was ein Haus am Leben haelt. Der Grund steht in
     kern/welt.js, erste Zeile von `meldeZug`: `if (!preis) return;`. Die
     Zahl ist der NENNER einer Messlatte — der billigste Zug, der die Lage
     aendert — und ein Zug ohne Preis hat darin nichts verloren. BRAUEN
     kostet kein Geld, sondern Rohstoff. AUSFAHREN kostet gar nichts, es
     BRINGT. Beide koennen dort also gar nicht auftauchen.

     Die Folge, gemessen in Woche 1 von 1350: von 47 sichtbaren Knoepfen
     empfahl das Spiel „Zuvorkommen Muehlschenke — 29 Pf". Das ist ein
     richtiger Zug und der falsche erste: ein Spieler, der ihn befolgt, hat
     Geld ausgegeben, ehe er ein einziges Mal gebraut oder geliefert hat.
     Die drei Bretter, auf denen die Woche wirklich stattfindet —
     ANSCHLAGTAFEL, DER KELLER, OCHSENKARREN — liegen zugeklappt unter
     Reitern, und in 64 Wochen der Blindprobe hat sie niemand aufgeschlagen.

     WAS HIER STEHT, IST KEINE ZWEITE MECHANIK.  Diese Datei kennt die
     Regeln des Brauens nicht und will sie nicht kennen. Sie sucht den
     ERSTEN Knopf des Wochenlaufs, der WIRKLICH DA und NICHT GESPERRT ist —
     dieselbe Frage, die `zugBedienbar()` fuer die Kennzahl stellt. Ob
     gebraut werden darf, entscheidet weiter DER SUD; ob der Karren faehrt,
     DIE FUHRE. Steht keiner der vier Knoepfe frei, sagt sie nichts.

     Die Reihenfolge ist die der Woche selbst, und sie ist so gewaehlt, dass
     sie sich nicht im Kreis dreht: ABSCHICKEN steht vor FUELLEN, weil ein
     beladener Karren erst fahren muss, ehe wieder geladen wird — sonst
     hiesse es in jeder Woche „fuellen", und der Karren fuehre nie.
     ---------------------------------------------------------------------- */
  var WOCHENLAUF = [
    { zug: 'fuhre:fuellen', einmal: true,
      text: 'Den Karren füllen',
      warum: 'Im Keller liegt reifes Bier, und die Häuser warten darauf. '
           + 'Geladen wird nach dem Durst der Adressen.' },
    { zug: 'fuhre:tafel-auf:', vorsilbe: true, einmal: true,
      text: 'Einen Brautag anschlagen',
      warum: 'Was heute angeschlagen wird, liegt in einigen Wochen als reifes Fass '
           + 'im Keller. Ohne Anschlag bleibt der Kessel kalt.' },
    /* DER VIERTE SCHRITT IST NICHT DIE WOCHE, SONDERN DIE STADT.

       Zwei Braujahre nach der Zeile gespielt, in allen vier Epochen: das
       Haus lebt, die Kasse haelt — und die Zahl der Adressen faellt von 10
       auf 3 (in 1970 auf 0). Brauen und Ausfahren halten ein Haus am Leben,
       aber nicht in der Stadt; wem niemand mehr abnimmt, dem hilft der
       vollste Keller nichts.

       Welche Adresse und welcher Preis — das rechnet der Kern laengst und
       zeigt es in der Zeile „naechster Zug". Dieser Schritt erfindet dazu
       nichts, er greift an denselben Knopf. Zwei Bedingungen halten ihn im
       Zaum, und beide sind gemessen, nicht geraten:

         · nur UMKAEMPFTE Zuege. Alles andere (bauen, verbessern) ist eine
           Frage der Strategie, nicht des Ueberlebens.
         · nur, wenn nach dem Zug noch ZWEI WOCHEN in der Lade bleiben.
           Zwei der acht blinden Spieler sind der Zeile „naechster Zug"
           gefolgt und fielen von 79 auf 8 Pf. Wer einem Rat blind folgt,
           darf davon nicht arm werden. Gemessen wird gegen dieselbe Zahl,
           die im Kasten „Wie es steht" schon steht — was eine Woche kostet;
           eine feste Deckung von 3x war der erste Versuch und traf die
           knappe Lade von 1350 fast nie. */
    { zug: 'kern:naechster-zug', einmal: true,
      text: 'Eine Adresse halten',
      warum: 'Ein anderer wirbt um ein Haus, das dem Brauhaus abnimmt. Wer nichts tut, '
           + 'verliert es — und mit jeder Adresse fällt, was sich überhaupt ausfahren lässt.',
      pruefe: function () {
        if (!B.welt.besterZug) return false;
        var z = B.welt.besterZug();
        if (!z || z.art !== 'umkaempft' || !z.preis) return false;
        var rest = B.welt.haus.kasse - z.preis;
        if (rest < 0) return false;
        var wk = wochenkosten();
        /* In der ersten Woche gibt es noch keine gemessene Wochenlast —
           dann gilt ersatzweise die alte, grobe Regel: die Lade muss den
           Zug dreifach tragen. Ohne diesen Ersatz ging in 1350 gleich in
           Woche 1 ein Viertel der Anfangslade fuer einen Zug weg, dessen
           Preis niemand gegen etwas halten konnte. */
        if (wk === null || wk <= 0) return B.welt.haus.kasse >= z.preis * 3;
        return rest >= wk * 2;
      } },
    /* ZULETZT, WEIL ES DIE WOCHE BEENDET.

       Gemessen und zuerst falsch herum gebaut: das Abschicken der Fuhre
       schaltet die Woche weiter (kern/klar.js sah den Wochenzaehler von
       40501 auf 40502 springen, ohne dass WEITER gedrueckt wurde). Stand es
       vorn in dieser Liste, war die Woche vorbei, ehe ein Brautag
       angeschlagen oder eine Adresse gehalten war — in zwei Braujahren fiel
       die Zahl der Adressen von 10 auf 3, in 1970 auf 0. Alles, was in
       dieser Woche noch geschehen soll, steht deshalb DAVOR. */
    { zug: 'fuhre:abschicken',
      text: 'Die Fuhre abschicken',
      warum: 'Der Karren ist beladen. Was darauf steht, bringt erst Geld, wenn er fährt '
           + '— und mit der Fuhre geht die Woche zu Ende.' },
    { zug: 'weiter', schluss: true,
      text: 'Die Woche schließen',
      warum: 'Diese Woche ist nichts mehr zu tun. Die nächste bringt neue Fässer '
           + 'und neuen Durst.' }
  ];

  function schrittKnopf(s) {
    if (typeof document === 'undefined') return null;
    if (s.pruefe && !B.wageWert('klar.schrittPruefe', s.pruefe, false)) return null;
    if (!s.vorsilbe) {
      var el = document.querySelector('[data-zug="' + s.zug + '"]');
      return (el && !el.disabled) ? el : null;
    }
    var alle = document.querySelectorAll('[data-zug^="' + s.zug + '"]');
    for (var i = 0; i < alle.length; i++) {
      if (!alle[i].disabled) return alle[i];
    }
    return null;
  }

  /* EIN FREIER KNOPF IST NOCH KEIN ZUG.

     Gemessen an „Den Karren füllen" in 1884: der Knopf bleibt die ganze
     Woche frei, auch wenn im Keller nichts Reifes mehr liegt. Zehn Klicks
     hintereinander taten nichts, und die Zeile riet zehnmal dasselbe — der
     Spieler kaeme nie zum Brauen und nie zur naechsten Woche.

     Die Quittung hilft hier nur halb: FUELLEN bewegt weder Geld noch
     Vorrat noch Keller, es raeumt Faesser auf den Karren. Sie meldet
     deshalb auch bei einer gelungenen Ladung „Nichts geschehen". Was sich
     dabei aendert, ist etwas anderes und im Bild ablesbar: DER KARREN IST
     NUN BELADEN, also ist „Die Fuhre abschicken" nicht mehr gesperrt.

     Gemerkt wird darum ein ABDRUCK des ganzen Wochenlaufs — welche seiner
     vier Knoepfe frei sind und wie sie heissen. Aendert ein Klick daran
     nichts und bucht er nichts, dann hat dieser Schritt in dieser Woche
     nichts mehr zu geben, und die Zeile geht zum naechsten weiter. Mit der
     Woche faengt die Liste von vorne an. */
  function laufAbdruck() {
    if (typeof document === 'undefined') return '';
    var t = [];
    for (var i = 0; i < WOCHENLAUF.length; i++) {
      var el = schrittKnopf(WOCHENLAUF[i]);
      t.push(el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '—');
    }
    return t.join('|');
  }

  function wochenMarke() {
    if (!bereit()) return 0;
    return B.welt.zeit.jahr * B.uhr.WOCHEN_IM_JAHR + B.welt.zeit.woche;
  }

  /* Gehoert dieser Zugschluessel zu diesem Schritt? */
  function gehoert(s, zug) {
    if (!zug) return false;
    return s.vorsilbe ? zug.indexOf(s.zug) === 0 : zug === s.zug;
  }

  function wochenSchritt() {
    if (!bereit() || B.welt.zeit.ende) return null;

    var marke = wochenMarke();
    if (!Z.schrittTot || Z.schrittTot.marke !== marke) {
      /* Mit der Woche faengt die Liste von vorn an — und die Notiz ueber
         den letzten Klick gehoert zur alten. Ohne dieses Loeschen war der
         Schritt, mit dem eine Woche endete, in der naechsten schon
         erledigt, ehe er ein einziges Mal angeboten worden war. */
      Z.schrittTot = { marke: marke, stufen: {} };
      Z.schrittKlick = null;
    }

    /* WANN EIN SCHRITT FUER DIESE WOCHE ERLEDIGT IST — zwei Gruende.

       ERSTENS: er hat nichts mehr zu geben. Der letzte Klick galt ihm, hat
       nichts gebucht und am Abdruck des Wochenlaufs nichts geaendert.
       Geprueft wird das hier und nicht in der Auswertung, weil erst jetzt
       feststeht, wie das Bild nach dem Klick aussieht.

       ZWEITENS, und nur beim Anschlagen: er ist GETAN. „Noch einen Brautag"
       ist keine Tatsache, sondern eine Strategie — mehr brauen heisst mehr
       Rohstoff, mehr Aufwand und mehr Bier, das verderben kann. Diese Zeile
       sagt, WO die Woche gemacht wird, und nicht, wie viel davon. Ohne
       diese Regel riet sie in 1900 elfmal hintereinander zum Anschlagen,
       bis der Vorrat an Brautagen aufgebraucht war. */
    var kl = Z.schrittKlick;
    if (kl && kl.zug) {
      var abgelaufen = (kl.abdruck === laufAbdruck());
      for (var qi = 0; qi < WOCHENLAUF.length; qi++) {
        if (!gehoert(WOCHENLAUF[qi], kl.zug)) continue;
        if (abgelaufen || WOCHENLAUF[qi].einmal) Z.schrittTot.stufen[qi] = true;
      }
    }

    for (var i = 0; i < WOCHENLAUF.length; i++) {
      if (Z.schrittTot.stufen[i]) continue;
      var el = schrittKnopf(WOCHENLAUF[i]);
      if (!el) continue;
      var zug = el.getAttribute('data-zug');
      return {
        text: WOCHENLAUF[i].text,
        warum: WOCHENLAUF[i].warum,
        schluss: !!WOCHENLAUF[i].schluss,
        zug: zug,
        am: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 44),
        brett: woLiegt(zug)
      };
    }
    return null;
  }

  /* Die Adressen, die dem Haus noch abnehmen — der einzige Zaehler, an dem
     das Spiel wirklich endet. */
  function abnehmer() {
    if (!B.welt || !B.welt.adressenJetzt) return null;
    var alle = B.welt.adressenJetzt();
    var unser = alle.filter(function (a) {
      return a.bindung && a.bindung.wem === 'haus';
    });
    return { unser: unser.length, alle: alle.length, liste: unser };
  }

  /* Seit wie vielen Wochen hat das Haus ueberhaupt irgendwohin geliefert? */
  function wochenOhneLieferung() {
    if (!B.protokoll || !bereit()) return null;
    var jetzt = B.welt.zeit.jahr * B.uhr.WOCHEN_IM_JAHR + B.welt.zeit.woche;
    for (var i = B.protokoll.length - 1; i >= 0; i--) {
      var p = B.protokoll[i];
      if (p.wer === 'spieler' && p.adresse && p.menge > 0) {
        return jetzt - (p.jahr * B.uhr.WOCHEN_IM_JAHR + p.woche);
      }
    }
    return null;                    /* noch nie geliefert */
  }

  function zeichneLage(fach) {
    if (!bereit() || B.welt.zeit.ende) return;

    var saetze = [];

    /* --- DAS GUTE ENDE, solange es auf dem Tisch liegt. ---

       Der einzige Weg, dieses Spiel zu GEWINNEN, ist die Uebergabe an die
       naechste Hand. Sie liegt eine begrenzte Zahl von Wochen offen, und die
       Nachprobe hat sie in 1350 nicht gefunden: „das gute Ende stand nur in
       der abgeschnittenen Ziel-Zeile am unteren Bildrand, hinter der offenen
       Tafel — ein WEITER-Druecker findet es nie, und das Spiel endet auch
       nach 20 Braujahren nicht." Zwanzig Braujahre ohne Ende sind kein
       Spiel mehr, sondern ein Laufband.

       Der Kasten liest den Knopf, den DIE FUHRE ohnehin auf die Wochenkarte
       legt — er erfindet kein Ende und keine Frist, er sagt nur, dass es
       gerade eines gibt. Steht der Knopf nicht da, steht hier nichts. */
    var gut = (typeof document !== 'undefined')
      ? document.querySelector('[data-zug="fuhre:uebergabe-auf"]') : null;
    var gutText = gut ? (gut.textContent || '').replace(/\s+/g, ' ').trim() : '';

    /* --- Vorrat: wie lange reicht er? --- */
    var e = B.welt.epoche();
    var rW = reicht('rohstoff');
    if (rW !== null && rW <= 12) {
      saetze.push({
        dringend: rW <= 4,
        /* DER SATZ, DEN SECHS VON ACHT SPIELERN GEBRAUCHT HAETTEN.
           Hopfen und Grut liefen zwischen Woche 5 und 16 still leer; die
           Kopfzeile zeigte die fallende Zahl, und niemand wusste, dass sie
           etwas bedeutet oder was dagegen zu tun ist. Der Kaufknopf liegt im
           Brett DAS SUDHAUS, das in 64 Wochen niemand aufgeschlagen hat —
           der einzige Spieler, der ihn fand, erreichte das gute Ende. Also
           steht hier, wo er liegt. */
        text: e.rohstoff + ' ' + B.zahl(rohstoff()) + ' — reicht noch etwa '
          + (rW === 0 ? 'keine Woche' : rW + (rW === 1 ? ' Woche' : ' Wochen'))
          + '. Ohne ' + e.rohstoff + ' kein Sud, ohne Sud kein Fass, ohne Fass keine Fuhre.'
          + (function () {
              var kn = rohstoffKnopf();
              if (!kn) return '';
              return ' Nachgekauft wird mit „' + kn.text + '"'
                + (kn.brett ? ' auf ' + kn.brett : '') + '.';
            }())
      });
    }
    var fW = reicht('faesser');
    if (fW !== null && fW <= 6 && faesser() <= B.welt.vorrat.plaetze * 0.34) {
      saetze.push({
        dringend: fW <= 2,
        text: (e.lager || 'Keller') + ' ' + B.welt.menge(faesser()) + ' von '
          + B.welt.menge(B.welt.vorrat.plaetze) + ' — bei diesem Lauf in etwa '
          + (fW === 0 ? 'dieser Woche' : fW + (fW === 1 ? ' Woche' : ' Wochen'))
          + ' leer. Ein leerer Keller heißt: keine Fuhre.'
      });
    }

    /* --- Kasse: wohin laeuft sie? --- */
    var kT = trend('kasse');
    if (kT !== null && kT < 0) {
      var wochenBisNull = kasse() > 0 ? Math.floor(kasse() / -kT) : 0;
      if (wochenBisNull <= 20) {
        saetze.push({
          dringend: wochenBisNull <= 6,
          text: 'Die Kasse verliert etwa ' + B.welt.geld(Math.round(-kT))
            + ' in der Woche. Bei gleichem Handeln ist sie in '
            + (wochenBisNull === 0 ? 'dieser Woche' : 'etwa ' + wochenBisNull
               + (wochenBisNull === 1 ? ' Woche' : ' Wochen')) + ' leer.'
        });
      }
    }

    /* --- Abnehmer: der Zaehler, an dem das Haus wirklich stirbt. --- */
    var ab = abnehmer();
    if (ab && ab.unser <= 3) {
      saetze.push({
        dringend: ab.unser <= 1,
        text: ab.unser === 0
          ? 'KEIN Haus der Stadt nimmt mehr ein Fass. Jetzt läuft die Frist — '
            + 'wer nicht liefert, verliert das Braurecht, gleichgültig wie voll die Kasse ist.'
          : 'Nur noch ' + ab.unser + ' von ' + ab.alle + ' Adressen nehmen Bier des Hauses. '
            + 'Bei null läuft eine Frist, an deren Ende das Braurecht heimfällt.'
      });
    }
    var ol = wochenOhneLieferung();
    if (ol !== null && ol >= 4) {
      saetze.push({
        dringend: ol >= 8,
        text: 'Seit ' + ol + ' Wochen ist kein Fass hinausgegangen. Nicht die leere '
          + 'Kasse schließt das Haus, sondern das leere Auftragsbuch.'
      });
    }

    /* DIE STEHENDE ZEILE. Sie gilt auch, wenn nichts zu warnen ist: was
       eine Woche kostet, ist die Zahl, gegen die jeder Ertrag zu lesen ist,
       und sie stand bisher nirgends auf dem Bildschirm. */
    var wk = wochenkosten();

    if (!saetze.length && wk === null && !gut) return;
    saetze.sort(function (a, b) { return (b.dringend ? 1 : 0) - (a.dringend ? 1 : 0); });
    saetze = saetze.slice(0, 2);

    var k = papier('klar-lage');
    k.style.cssText += 'width:100%;box-sizing:border-box;';
    k.setAttribute('data-klar', 'lage');
    k.setAttribute('data-klar-warnungen', String(saetze.length));

    var kopf = B.el('div', null, 'Wie es steht');
    kopf.style.cssText = 'font-variant:small-caps;letter-spacing:calc(var(--s)*2);'
      + 'font-size:max(11px,calc(var(--s)*18));color:#6a5436;'
      + 'border-bottom:1px solid rgba(90,66,38,.3);margin-bottom:calc(var(--s)*5);'
      + 'padding-bottom:calc(var(--s)*3);';
    k.appendChild(kopf);

    if (gut) {
      var gz = B.el('div', 'klar-gut',
        'DAS GUTE ENDE LIEGT AUF DEM TISCH — ' + gutText
        + '. Wer jetzt übergibt, hat gewonnen; der Knopf steht auf der Wochenkarte.');
      gz.style.cssText = 'white-space:normal;margin-bottom:calc(var(--s)*7);'
        + 'font-size:max(11px,calc(var(--s)*18));line-height:1.35;font-weight:600;'
        + 'padding:calc(var(--s)*5) calc(var(--s)*9);border-radius:calc(var(--s)*3);'
        + 'color:#1f4a1c;background:rgba(120,170,95,.26);'
        + 'border-left:calc(var(--s)*3) solid #2f5d2a;';
      k.appendChild(gz);
    }

    if (wk !== null) {
      /* BEIDE SEITEN NEBENEINANDER.  „Kein Klick macht die Kasse groesser"
         war der meistgenannte Eindruck der Nachprobe in 1350 — und er ist
         falsch, nur sieht man es nicht: die Fuhren bringen etwas herein, es
         geht bloss in derselben Woche wieder hinaus. Wer nur den Aufwand
         sieht, haelt das Haus fuer ein Fass ohne Boden. Beide Zahlen sind
         gemessen, nicht gerechnet: der Mittelwert der letzten Wochen. */
      var we = wocheneinnahmen();
      var wz = B.el('div', 'klar-wochenkosten');
      wz.style.cssText = 'display:flex;justify-content:space-between;gap:calc(var(--s)*12);'
        + 'white-space:nowrap;font-size:max(11px,calc(var(--s)*18));'
        + 'margin-bottom:calc(var(--s)*6);color:#3a2a16;';
      wz.appendChild(B.el('span', null, 'Die Woche bringt / kostet'));
      var wv = B.el('span', null,
        (we === null ? '?' : '+' + B.welt.geld(we, true)) + ' / −' + B.welt.geld(wk));
      wv.style.cssText = 'font-family:var(--mono);font-variant-numeric:tabular-nums;'
        + 'color:' + ((we !== null && we >= wk) ? '#2f5d2a' : '#8a2f20') + ';';
      wz.appendChild(wv);
      wz.title = 'Der Mittelwert der letzten Wochen, beide Seiten. LINKS was hereinkam '
               + '(Lieferungen, Rückgaben, Einnahmen), RECHTS was hinausging (Sud, Fuhrlohn, '
               + 'Ungeld, Unterhalt). Der Aufwand fällt an, weil die Woche zu Ende geht — '
               + 'auch ohne Fuhre. Steht links die kleinere Zahl, zehrt das Haus von der Lade.';
      k.appendChild(wz);
    }

    saetze.forEach(function (s) {
      var z = B.el('div', 'klar-satz' + (s.dringend ? ' dringend' : ''), s.text);
      z.style.cssText = 'white-space:normal;margin-bottom:calc(var(--s)*6);'
        + 'font-size:max(11px,calc(var(--s)*18));line-height:1.35;'
        + 'padding-left:calc(var(--s)*9);border-left:calc(var(--s)*3) solid '
        + (s.dringend ? '#8a2f20' : '#a98c58') + ';'
        + (s.dringend ? 'color:#6b2418;font-weight:600;' : 'color:#3a2a16;');
      k.appendChild(z);
    });

    fach.appendChild(k);
  }

  /* ======================================================================
     4 · DIE WOCHENBILANZ AM BILD
     ====================================================================== */

  function zeichneBilanz(fach) {
    var b = Z.bilanz;
    if (!b || !b.buchungen.length) return;
    /* Die Bilanz steht nur, solange die Quittung NICHT steht — sonst
       erzaehlen zwei Kaesten uebereinander dasselbe. Die Quittung ist die
       genauere von beiden, sie gewinnt. */
    if (Z.quittung) return;

    var k = papier('klar-bilanz');
    k.style.cssText += 'width:100%;box-sizing:border-box;';
    k.setAttribute('data-klar', 'bilanz');

    var kopf = B.el('div', null, 'Die Woche in der Kasse');
    kopf.style.cssText = 'font-variant:small-caps;letter-spacing:calc(var(--s)*2);'
      + 'font-size:max(11px,calc(var(--s)*18));color:#6a5436;'
      + 'border-bottom:1px solid rgba(90,66,38,.3);margin-bottom:calc(var(--s)*5);'
      + 'padding-bottom:calc(var(--s)*3);';
    k.appendChild(kopf);

    postenListe(b.buchungen, k);

    var strich = B.el('div');
    strich.style.cssText = 'border-top:1px solid rgba(90,66,38,.35);'
      + 'margin-top:calc(var(--s)*5);padding-top:calc(var(--s)*4);';
    k.appendChild(strich);
    var summe = posten('Zusammen',
      (b.netto > 0 ? '+' : (b.netto < 0 ? '−' : '±')) + B.welt.geld(Math.abs(b.netto)),
      b.netto ? b.netto > 0 : null);
    summe.style.fontWeight = '700';
    k.appendChild(summe);

    fach.appendChild(k);
  }

  /* ======================================================================
     DAS ZEICHNEN
     ====================================================================== */

  /* EINE SPALTE, KEINE DREI KAESTEN.

     Erster Versuch: Quittung unten links, Lage rechts oben. Gemessen wurde
     dabei genau der Fehler, den die Blindprobe an der Stadtkarte gefunden
     hat — die Lage lag unter dem Kasten der Michaelitafel und war zur
     Haelfte nicht zu lesen. Beides steht deshalb UNTEREINANDER an EINER
     Stelle: unten links, dort, wo in allen vier Epochen die Wochenkarte und
     der Fahren-Knopf stehen, also dort, wo ohnehin entschieden wird. Die
     Spalte waechst nach oben und kann keinen fremden Kasten schneiden, weil
     sie nur einen Platz belegt statt zwei.

     `data-stueck` beginnt mit `kern-`: DIE STADT macht aus jedem FREMDEN
     Fach einen Reiter in ihrer Leiste (stadt.js, fremdeBretter()), und ein
     Kasten, der sagt „das hat der Zug gebracht", ist kein Brett, das man
     auf- und zuklappt. Der Rahmen haelt sich an dieselbe Regel wie bei der
     Rueckfrage `kern-neu`. */
  function zeichneKlar() {
    if (!bereit()) return;
    var fach = B.ebene('kopf', 'kern-klar');
    B.leere(fach);
    /* Ist die Partie zu Ende, treten diese Kaesten ab. Dann gilt das
       Schlussblatt, und das ist der beste Text des Spiels — es braucht
       keine Quittung ueber den letzten Klick neben sich. */
    if (B.welt.zeit.ende) return;

    /* ueber der Wochenkarte, nicht auf ihr.

       Die Spalte steht dort, wo unten links die Wochenkarte und die
       Fahren-Knoepfe stehen — also genau da, wo entschieden wird, und genau
       da, wo sie sie zudecken wuerde. Gemessen wird deshalb, wo der untere
       Block wirklich anfaengt, und darueber gesetzt. Gemessen wird am Bild
       DER VORIGEN Runde: DIE FUHRE zeichnet nach dem Rahmen, ihr Kasten
       steht an derselben Stelle wie eben, und eine Runde spaeter sitzt die
       Spalte ohnehin richtig. Findet sich nichts, gilt ein Anschlag, der in
       allen vier Epochen frei ist. */
    var unterkante = 15.6;
    B.wage('klar.platz', function () {
      var hoehe = B.buehne.masse().hoehe;
      var oben = null;
      var kandidaten = document.querySelectorAll(
        '.fu-woche, [data-zug^="fuhre:plan:"], [data-zug="fuhre:sprung"]');
      for (var i = 0; i < kandidaten.length; i++) {
        var r = kandidaten[i].getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left > B.buehne.masse().breite * 0.5) continue;   /* nur der linke Block */
        if (oben === null || r.top < oben) oben = r.top;
      }
      if (oben !== null && hoehe) {
        var anteil = 100 * (hoehe - oben) / hoehe + 1.2;
        if (anteil > unterkante && anteil < 60) unterkante = anteil;
      }
    });

    var spalte = B.el('div', 'klar-spalte');
    spalte.style.cssText = 'position:absolute;left:1.2%;bottom:' + B.rund(unterkante, 2) + '%;'
      + 'display:flex;flex-direction:column-reverse;align-items:flex-start;'
      + 'gap:calc(var(--s)*6);width:24.5%;min-width:calc(var(--s)*250);'
      /* KEIN KLICK BLEIBT AN DIESEN KAESTEN HAENGEN.

         Sie tragen nur Auskunft; nichts darin ist zu druecken. Ohne diese
         Zeile waere ausgerechnet die Klarheit die naechste Ursache fuer
         einen toten Knopf: die Spalte steht ueber der Wochenkarte, ihre
         Lage wird am Bild der VORIGEN Runde bemessen, und in der einen
         Runde, in der die Wochenkarte um eine Zeile waechst, lieferte sie
         sonst genau den Befund, den sie beheben soll. Gemessen: ein
         Fahren-Klick in Woche 28 von 1884, der „Nichts geschehen" quittierte.
         `pointer-events:none` faellt auf die Kinder durch — der Klick geht
         durch das Papier auf den Knopf darunter. */
      + 'pointer-events:none;';
    fach.appendChild(spalte);

    B.wage('klar.quittung', function () { zeichneQuittung(spalte); });
    B.wage('klar.bilanz', function () { zeichneBilanz(spalte); });
    B.wage('klar.lage', function () { zeichneLage(spalte); });
  }

  /* ----------------------------------------------------------------------
     ANSCHLUSS AN DAS SPIEL

     Der Klick wird in der EINFANGPHASE gemerkt (da hat noch niemand
     gehandelt) und in der BLASENPHASE ausgewertet (da ist alles geschehen,
     denn jede Geldbewegung des Spiels ist synchron: welt.zahle/welt.nimm).
     Dazwischen laeuft der Zug des Spiels unveraendert; diese Datei haengt
     sich nirgends dazwischen und haelt nichts auf.
     ---------------------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-zug]') : null;
    if (!el || el.disabled) { Z.vorKlick = null; return; }
    B.wage('klar.vor', function () { nimmVor(el); });
  }, true);

  document.addEventListener('click', function () {
    B.wage('klar.nach', werteAus);
  }, false);

  /* Die Woche wird abgeschlossen, BEVOR die Stuecke ihr `woche` sehen —
     sonst zaehlten deren eigene Wochenbuchungen schon zur naechsten. */
  B.auf('vorwoche', function () { B.wage('klar.vorwoche', wocheAbschliessen); });

  /* Nach jedem Zeichnen: die eigenen Kaesten neu, und der Verlauf bekommt
     seine Marke, falls eine Woche ohne 'vorwoche' vergangen ist (Sprung,
     Jahreswechsel, Wiederaufnahme). */
  B.auf('zeichne', function () {
    B.wage('klar.merke', merkeVerlauf);
    B.wage('klar.zeichne', zeichneKlar);
  });

  /* ----------------------------------------------------------------------
     DIE ENTFLECHTUNG DER KAERTCHEN — hier eingehaengt, dort gebaut.

     Der Algorithmus gehoert kern/orte.js: wer die Orte vergibt, verantwortet
     auch, dass zwei Kaertchen auf demselben Ort einander nicht decken. Die
     ANMELDUNG steht hier, weil orte.js als zweite Datei laedt — vor
     kern/uhr.js, also bevor es `B.auf` ueberhaupt gibt. Diese Datei laedt
     spaet genug und gehoert ohnehin zu derselben Welle.

     `requestAnimationFrame` laeuft NACH dem Zeichnen aller Stuecke und wird
     von kern/runde.js INNERHALB der Runde gehalten — es entsteht keine
     Wanduhrfrist im Zeichenweg (spiel/LIESMICH.md). Denselben Weg geht
     kern/kopf.js fuer die Kennzahl. */
  /* Angemeldet wird der Horcher beim ERSTEN Zeichnen, nicht beim Laden.

     `B.sende()` laeuft mit `for (i = 0; i < l.length; i++)` ueber die LEBENDE
     Liste der Horcher (kern/uhr.js): wer sich waehrend einer Sendung
     anmeldet, kommt in DERSELBEN Sendung noch dran — und zwar als letzter.
     Genau das wird hier gebraucht: die Entflechtung muss laufen, wenn alle
     acht Stuecke ihre Kaertchen gesetzt haben, und sie muss es IN DERSELBEN
     RUNDE tun.

     Der erste Versuch lief in `requestAnimationFrame`. Das ist im Rahmen
     erlaubt (kern/runde.js faengt ihn ein) und war trotzdem falsch: zwischen
     dem Zeichnen und dem naechsten Bild lag ein Augenblick, in dem die
     Kaertchen noch an ihrer alten Stelle standen. Fuer ein Auge ist das ein
     Zucken; fuer eine Hand, die in genau diesem Augenblick klickt, ist es
     ein Knopf, der nicht mehr da ist, wo er war. Gemessen: ein Fahren-Klick
     in 120 Wochen von 1970, der ins Leere ging — dieselbe Sorte Fehler, die
     diese Welle beseitigt. */
  var angemeldet = false;
  var nachLaeuft = false;
  B.auf('zeichne', function () {
    if (angemeldet) return;
    angemeldet = true;
    B.auf('zeichne', function () {
      if (B.orte && B.orte.entflechte) {
        B.wage('orte.entflechte', function () { B.orte.entflechte(); });
      }
      /* Die Nachbesserung erst im naechsten Bild: sie fragt den Browser, wer
         den Klick wirklich bekommt, und dafuer muss ALLES stehen — auch die
         Kaesten, die sich erst nach dem Zeichenlauf legen (der Griff der
         Michaelitafel in 1970). Sie fasst nur an, was blockiert ist, in aller
         Regel also nichts; es gibt damit auch nichts, was zucken koennte.
         `requestAnimationFrame` haelt kern/runde.js innerhalb der Runde. */
      if (nachLaeuft || typeof requestAnimationFrame !== 'function') return;
      if (!B.orte || !B.orte.nachbessere) return;
      nachLaeuft = true;
      requestAnimationFrame(function () {
        nachLaeuft = false;
        B.wage('orte.nachbessere', function () { B.orte.nachbessere(); });
        horcheAufBewegung();
      });
    });
  });

  /* NOCH EIN BILD REICHT NICHT, WENN SICH ETWAS BEWEGT.

     Die Michaelitafel faehrt ein. Im Bild direkt nach dem Zeichnen steht sie
     noch nicht dort, wo sie gleich stehen wird — die Nachbesserung fragt den
     Browser also zum falschen Zeitpunkt und bekommt „alles frei" zur
     Antwort. Eine halbe Sekunde spaeter liegen drei Wimpel des Muehlwirts
     darunter und sind nicht mehr zu druecken (gemessen in 1350, Saat 11:
     drei unerreichbare Knoepfe, alle unter `pr-was`; ein Aufruf der
     Nachbesserung von Hand raeumt alle drei ab).

     Wann eine Bewegung zu Ende ist, weiss der Browser selbst und sagt es mit
     `transitionend` und `animationend`. Beide steigen auf, ein Horcher auf
     der Buehne genuegt. Gebuendelt wird ueber eine kurze Frist, damit aus
     zwanzig Enden einer Tafel ein Durchgang wird und nicht zwanzig;
     kern/runde.js haelt die Frist innerhalb der Runde. */
  var horchtSchon = false;
  var bewegungFrist = 0;
  function horcheAufBewegung() {
    if (horchtSchon) return;
    var buehne = document.getElementById('buehne');
    if (!buehne || typeof setTimeout !== 'function') return;
    horchtSchon = true;
    function spaeter() {
      if (bewegungFrist) return;
      bewegungFrist = setTimeout(function () {
        bewegungFrist = 0;
        if (B.orte && B.orte.nachbessere) {
          B.wage('orte.nachbessere', function () { B.orte.nachbessere(); });
        }
      }, 120);
    }
    buehne.addEventListener('transitionend', spaeter, true);
    buehne.addEventListener('animationend', spaeter, true);
  }

  /* Ein neues Jahr und eine neue Epoche raeumen die Quittung ab: sie gehoert
     zu einem Zug, den es in dieser Lage nicht mehr gibt. */
  B.auf('jahr', function () { Z.quittung = null; Z.schrittTot = null; });
  B.auf('epoche', function () {
    Z.quittung = null; Z.bilanz = null; Z.verlauf = []; Z.kosten = []; Z.ein = [];
  });

  /* ----------------------------------------------------------------------
     NACH AUSSEN — fuer die Probe und fuer andere Kerndateien.
     ---------------------------------------------------------------------- */
  B.klar = {
    wochenSchritt: wochenSchritt,
    quittung: function () { return Z.quittung; },
    bilanz: function () { return Z.bilanz; },
    verlauf: function () { return Z.verlauf.slice(); },
    trend: trend,
    wochenkosten: wochenkosten,
    wocheneinnahmen: wocheneinnahmen,
    reicht: reicht,
    abnehmer: abnehmer,
    wochenOhneLieferung: wochenOhneLieferung,
    zeichne: zeichneKlar
  };

})(BRAUHAUS);
