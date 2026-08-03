/* ===========================================================================
   stuecke/erbe.js — DAS ERBE.  Was ueber die Amtszeit hinaus bleibt.

   ---------------------------------------------------------------------------
   DER BEFUND, MIT DEM DIESES STUECK ANFAENGT
   ---------------------------------------------------------------------------
   kern/uhr.js ruft welt.erbe(), wenn `zeit.jahr >= zeit.amtszeit.bis`. Die
   Amtszeit dauert `jahr + wuerfel.ganz(21,37)`. Die Partie dauert gut drei
   Braujahre. Mit einem Haken auf welt.erbe und auf dem Ereignis 'erbfall'
   gemessen, saat=1350, nur WEITER:

     Epoche | Amtszeit    | Ende      | Klicks | welt.erbe() | 'erbfall'
     1350   | 1350–1386   | 1353/13   | 103    |      0      |    0
     1600   | 1600–1636   | 1603/13   | 103    |      0      |    0
     1884   | 1884–1920   | 1887/11   | 101    |      0      |    0
     1970   | 1970–2006   | 1973/9    |  99    |      0      |    0

   Auch mit 259 zusaetzlich gedrueckten Knoepfen: null. Vier Stuecke haben
   einen erbfall-Handler gebaut — DIE FUHRE die Geschlechterzeile, DER NAME
   den Ruf-Abschlag, DER GEGNER die Meldung, DER PREIS den Handlohn, der in
   preis.js sogar als Vorschau fuer 1386 in der Rechnung steht. Keiner ist je
   gelaufen. Ein Erbfall, der in keiner gemessenen Partie eintritt, ist kein
   Stueck, sondern ein Versprechen.

   ---------------------------------------------------------------------------
   WAS DIESES STUECK DARAUS MACHT
   ---------------------------------------------------------------------------
   Der Erbfall wird in die erreichbare Zeit geholt und bekommt eine Regel, die
   man vorher und nachher zaehlen kann:

     WAS AM HAUS HAFTET, GEHT UEBER.  WAS AN DER PERSON HAFTET, FAELLT MIT IHR.

   Zwei Zahlen stehen dauernd auf der Erbtafel — AM HAUS n · AN DER PERSON m —
   und am Tag des Erbfalls wird m zu 0, wenn nichts vereinbart war. Jede
   persoenliche Bindung laesst sich vorher aufs Haus schreiben; das kostet, ist
   unwiderruflich, und man kann sich nicht alle leisten.

   Drei Wege, die Uebergabe zu regeln, stehen nebeneinander, jeder mit
   Preisschild, jeder die anderen ausschliessend:
     · LEIBGEDING   0 jetzt, jedes Michaeli ein Jahrgeld — die Person bleibt
                    im Haus, ihre Bindungen bleiben mit ihr. Bis das Jahrgeld
                    einmal nicht bezahlt werden kann; dann fallen sie doch.
     · ABFINDUNG    einmal ausgezahlt, dafuer ein Jahr Frist. Der Preis faellt
                    Woche fuer Woche — wer frueh uebergibt, kauft teuer.
     · OHNE         nichts gegeben. Alles Persoenliche faellt am selben Tag.
   Wer bis zur Stunde nichts entscheidet, bekommt den dritten Weg, ohne ihn
   gewaehlt zu haben.

   Und die Eigenschaft der Amtszeit — sparsam, streitbar, gelehrt … — steht
   seit dem Skelett in welt.zeit.amtszeit und wurde nur abgedruckt. Sie setzt
   jetzt den Preis der Feder (0,70 bis 1,30) und entscheidet, welchen fuenften
   Zug diese Hand ueberhaupt kennt. Am Tag des Erbfalls wechselt sie. Derselbe
   Knopf, dieselbe Adresse, anderer Preis: das ist die andere Hand.

   ---------------------------------------------------------------------------
   PLATZ.  Zwei Dinge, und beide halten sich an die Ordnung DER STADT.
   ---------------------------------------------------------------------------
   · .erb-leiste steht dauernd, unten quer: 44 % x 5,6 % = 2,46 % der Buehne
     und damit unter GRENZE (3,5 %) — DIE STADT laesst sie in Ruhe. Sie traegt
     die drei Uebergabeknoepfe nebeneinander, weil sie das Herz des Stuecks
     sind und nicht hinter einem Reiter liegen duerfen. Der Platz ist ueber
     alle vier Epochen als frei gemessen; die Begruendung steht in erbe.css.
   · .erb-buch   ist ein richtiges Brett und bekommt von der STADT einen
     Reiter wie jedes andere. Dort steht die volle Liste.
   =========================================================================== */

(function (B) {
  'use strict';

  var D = B.erbeDaten || {};

  /* ---------------------------------------------------------------------- */

  var Z = {
    startJahr: 0,
    seitJahr: 0,
    seitWoche: 1,
    startKasse: 0,
    eich: 1,                  /* Auflage 5: an der Startbarschaft geeicht */
    eichRoh: 0,
    stundeJahr: 0,
    stundeWoche: 16,
    uebergeben: false,        /* die LAUFENDE Hand hat uebergeben */
    erbfaelle: 0,             /* wie oft das Haus schon die Hand gewechselt hat */
    form: null,               /* 'leibgeding' | 'abfindung' | 'bruch' | 'stunde' */
    letzteForm: null,
    leibgedinge: [],          /* [{name, betrag, verfallen}] — sie summieren sich */
    gnadeBis: 0,              /* Jahr, bis zu dem die Abfindung die Person haelt */
    antrittBis: 0,            /* bis dahin zahlt die neue Hand Antrittsgeld */
    alt: null,
    neu: null,
    haende: [],               /* [{nr,name,eigenschaft,eigenschaftName,feder,form}] */
    vorher: null,             /* {haus, person, summe} am Tag vor dem Erbfall */
    nachher: null,
    gefallen: [],
    geschrieben: [],
    erloschen: [],            /* Auflage 1: bezahlt und doch verloren */
    borg: [],
    seelgeraet: false,
    angefochten: 0,
    widersprochen: 0,
    erbteilFass: 0,           /* was die Miterben aus dem Keller genommen haben */
    nachgeschrieben: 0,
    letzteTat: ''
  };

  /* --- kurze Griffe in den Weltzustand ---------------------------------- */

  function W()      { return B.welt; }
  function zeit()   { return B.welt.zeit; }
  function jahr()   { return B.welt.zeit.jahr; }
  function woche()  { return B.welt.zeit.woche; }
  function ep()     { return D.EPOCHEN[B.welt.zeit.epoche] || D.EPOCHEN[1]; }
  function amt()    { return B.welt.zeit.amtszeit || {}; }
  function eig()    { return D.EIGENSCHAFTEN[amt().eigenschaft] || { faktor: 1, zug: null, wirkt: '' }; }
  function geld(n)  { return B.welt.geld(n); }
  function roem(n)  { return ['—', 'I.', 'II.', 'III.', 'IV.', 'V.', 'VI.'][n] || (n + '.'); }

  /* Der Unterschied, um den es geht. */
  function amHaus(womit) { return D.AM_HAUS.test(String(womit || '')); }

  function meine() {
    return B.welt.adressenJetzt().filter(function (a) {
      return a.bindung && a.bindung.wem === 'haus';
    });
  }
  function amHausListe() {
    return meine().filter(function (a) { return amHaus(a.bindung.womit); });
  }
  function personListe() {
    return meine().filter(function (a) { return !amHaus(a.bindung.womit); });
  }

  /* DIE FEDER.  Was das Schreiben kostet, haengt an der Eigenschaft der Hand —
     und daran, wie lange sie schon am Haus ist. Eine eben angetretene Hand ist
     dem Schreiber unbekannt und zahlt Antrittsgeld, bis ihr erstes Michaeli
     vorbei ist. Damit ist die Feder nach JEDEM Erbfall eine andere, auch wenn
     der Wuerfel Namen und Eigenschaft der Vorgaengerin noch einmal zieht
     (Auflage 2, zweite Haelfte). */
  function feder() {
    var f = eig().faktor;
    /* Der Erbfolgenachweis: je Handwechsel ein Aufschlag, dauerhaft. */
    f *= (1 + (D.HAND_AUFSCHLAG || 0) * Math.max(0, (amt().nr || 1) - 1));
    /* Das Antrittsgeld: bis zum ersten Michaeli der neuen Hand. */
    if (Z.antrittBis && jahr() < Z.antrittBis) f *= (1 + (D.ANTRITT_AUFSCHLAG || 0));
    return Math.round(f * 100) / 100;
  }
  function imAntritt() { return !!(Z.antrittBis && jahr() < Z.antrittBis); }
  /* Was die Feder dieser Hand kostet, wenn das Antrittsjahr vorbei ist —
     die Zahl, an der sich zwei Haende vergleichen lassen. */
  function federDauernd() {
    var f = eig().faktor * (1 + (D.HAND_AUFSCHLAG || 0) * Math.max(0, (amt().nr || 1) - 1));
    return Math.round(f * 100) / 100;
  }

  /* Was eine Bindung wert ist: der Jahresbedarf des Hauses, mit dem Satz der
     Epoche, mal dem Eichfaktor aus dem aufbau (Auflage 5). */
  function wert(a) { return Math.max(1, Math.round(a.bedarf * ep().satz * Z.eich)); }
  function schreibPreis(a) { return Math.max(1, Math.round(wert(a) * feder())); }
  function personSumme() {
    var s = 0;
    personListe().forEach(function (a) { s += wert(a); });
    return s;
  }
  function hausSumme() {
    var s = 0;
    amHausListe().forEach(function (a) { s += wert(a); });
    return s;
  }

  /* Was die Miterben aus dem Keller naehmen, wenn nichts vereinbart ist.
     Von Hand zu Hand sind weniger da, die fordern koennten. */
  function erbteilNenner() {
    var l = D.ERBTEIL_NENNER_JE_HAND || [D.ERBTEIL_NENNER || 3];
    return l[Math.min(Z.erbfaelle, l.length - 1)] || 3;
  }
  function erbteilFass() {
    var da = B.welt.vorrat.faesser.length;
    return da > 0 ? Math.max(1, Math.ceil(da / erbteilNenner())) : 0;
  }
  function erbteilWert() {
    return Math.round(erbteilFass() * ep().satz * (D.KELLER_JE_FASS || 1.5) * Z.eich);
  }
  /* DIE ERBMASSE — wogegen beide Wege gerechnet werden.
     Was an der Person haengt, plus der Erbteil aus dem Keller, plus der
     Geldanteil der Miterben an dem, was am Haus haftet: die Bindung geht
     ueber, ihr Wert wird ausbezahlt. Genau so stand es in den Uebergabe-
     vertraegen. Dazu ein Anteil der Barschaft, damit auch ein leergeraeumtes
     Haus noch ein Preisschild traegt und keine Null, die nichts unterscheidet. */
  function erbmasse() {
    return personSumme()
      + erbteilWert()
      + Math.round(hausSumme() * (D.HAUS_ANTEIL || 0))
      + Math.round(Math.max(0, B.welt.haus.kasse) * (D.KASSE_ANTEIL || 0));
  }

  /* Wie lang die laufende Amtszeit ist und wieviel davon noch aussteht. */
  function amtszeitWochen() {
    return Math.max(1, (Z.stundeJahr - Z.seitJahr) * B.uhr.WOCHEN_IM_JAHR
                       + (Z.stundeWoche - Z.seitWoche));
  }
  function restAnteil() {
    return Math.max(0, Math.min(1, wochenBisStunde() / amtszeitWochen()));
  }
  /* Was Schreiber, Siegel, Eintrag oder Notar kosten — faellt an, auch wenn
     nichts zu teilen ist. Die Untergrenze beider Wege. */
  function gebuehr() {
    return Math.max(1, Math.round(ep().satz * (D.UEBERGABE_MINDEST || 1) * Z.eich * feder()));
  }
  function abfindungPreis() {
    var f = D.ABFINDUNG_BODEN + (D.ABFINDUNG_ANFANG - D.ABFINDUNG_BODEN) * restAnteil();
    return Math.max(gebuehr(), Math.round(erbmasse() * f));
  }
  function leibgedingPreis() {
    return Math.max(gebuehr(), Math.round(erbmasse() * D.LEIBGEDING_ANTEIL));
  }
  function leibgedingLast() {
    var s = 0;
    Z.leibgedinge.forEach(function (l) { if (!l.verfallen) s += l.betrag; });
    return s;
  }
  function wochenBisStunde() {
    if (Z.uebergeben) return 0;
    var w = (Z.stundeJahr - jahr()) * B.uhr.WOCHEN_IM_JAHR + (Z.stundeWoche - woche());
    return Math.max(0, w);
  }
  function stundeIstDa() {
    return jahr() > Z.stundeJahr || (jahr() === Z.stundeJahr && woche() >= Z.stundeWoche);
  }

  /* In welcher Woche die Stunde schlaegt. Ohne einen einzigen Wuerfelzug:
     `amtszeit.bis` ist bereits gezogen (jahr + ganz(21,37)), streut mit der
     Saat und mit der Epoche und gehoert genau der Hand, um die es geht. Wer
     hier B.wuerfel riefe, verschoebe die Partie aller anderen Stuecke. */
  function stundeWocheFuer(a) {
    var von = D.STUNDE_WOCHE_VON === undefined ? 12 : D.STUNDE_WOCHE_VON;
    var bis = D.STUNDE_WOCHE_BIS === undefined ? 18 : D.STUNDE_WOCHE_BIS;
    var spanne = Math.max(1, bis - von + 1);
    var quelle = (a && a.bis ? a.bis : 0) + (a && a.nr ? a.nr * 3 : 0);
    return von + (Math.abs(quelle) % spanne);
  }

  /* Die naechste Stunde stellen. Nach JEDEM Erbfall — die Amtszeit der
     II. Hand laeuft bis weit hinter das Ende der Partie, und ohne dies bliebe
     die Leiste bis zum letzten Klick leer (Auflage 3). */
  function stelleStunde(a, zielJahr) {
    Z.seitJahr = jahr();
    Z.seitWoche = woche();
    Z.stundeJahr = zielJahr;
    Z.stundeWoche = stundeWocheFuer(a);
  }

  function klang(eigen, ersatz) {
    if (!B.ton || !B.ton.spiele) return;
    if (!B.ton.spiele(eigen) && ersatz) B.ton.spiele(ersatz);
  }

  /* ======================================================================
     DIE TATEN
     ====================================================================== */

  /* Eine Bindung aufs Haus schreiben. Unwiderruflich: das Wort steht dann im
     Buch, und aus dem Buch nimmt es niemand wieder heraus. */
  function schreibeAufsHaus(schluessel, aufBorg) {
    var a = B.welt.adresse(schluessel);
    if (!a || !a.bindung || a.bindung.wem !== 'haus' || amHaus(a.bindung.womit)) return false;
    var e = ep();
    var p = schreibPreis(a);
    var alt = a.bindung.womit;

    if (aufBorg) {
      Z.borg.push({ name: a.name, betrag: p * 2 });
      B.welt.protokolliere({ wer: 'spieler', was: e.verb + ' auf Borg: ' + a.name,
        preis: 0, adresse: schluessel });
    } else if (!B.welt.zahle(p, e.verb + ': ' + a.name + ' ' + e.wo)) {
      return false;
    }

    B.welt.binde(schluessel, 'haus', e.womit, jahr() + e.jahre);
    Z.geschrieben.push({ schluessel: schluessel, name: a.name, jahr: jahr(),
      woche: woche(), preis: aufBorg ? 0 : p, vorher: alt });
    Z.letzteTat = e.verb + ': ' + a.name;
    B.welt.schreibe(a.name + ' wird ' + e.wo + ' geschrieben (vorher: ' + alt
      + '). Diese Bindung haftet jetzt am Haus und überlebt die Hand, die sie gab.',
      'festlegung');
    klang('erbe:feder', 'preis:siegel');
    B.sende('zeichne', { grund: 'erbe-schreiben' });
    return true;
  }

  /* ======================================================================
     AUFLAGE 1 — WAS BEZAHLT WURDE UND DOCH VERLORENGEHT

     Der Kritiker hat es an Saat 1350 nachgezaehlt und die Messung
     reproduziert genau so:

       1350/1   Zum Goldenen Ochsen fuer 16 Pf verschrieben, Buch:
                "Verschreibung im Stadtbuch bis 1362"
       1350/11  DER GEGNER: "Der Rat spricht Zum Goldenen Ochsen dem Adler
                zu. Das Haus hatte dort nur die Gewohnheit."  AM HAUS 2 -> 1
       1350/21  dasselbe fuer Pfarrschenke St. Michael.        AM HAUS 1 -> 0

     Nach 21 von 130 Wochen waren beide Kaeufe wertlos, und das Buch fuehrte
     sie unveraendert unter "GESCHRIEBEN · 2" weiter. Es hatte fuer den
     persoenlichen Verlust eine durchgestrichene Liste und fuer den bezahlten
     keine Zeile.

     Der Kern der Sache gehoert nicht diesem Stueck: `welt.binde` laesst
     jeden ueber jede Bindung schreiben, und der Satz "Das Haus hatte dort nur
     die Gewohnheit" steht in gegner-daten.js Zeile 226 — beides ist tabu.
     Was diesem Stueck gehoert, ist das Buch. Also stirbt die Verschreibung ab
     jetzt SICHTBAR: sie wird jede Woche geprueft, wandert mit Datum, Grund und
     dem gezahlten Betrag in eine dritte Lade, bekommt eine Zeile in der
     Chronik und eine im Protokoll — und einen Knopf, mit dem der Widerspruch
     aus dem Buch dagegen erhoben wird. Was gezahlt war, wird darauf
     angerechnet: der Kauf war teuer, aber nicht umsonst.
     ====================================================================== */

  function wemName(k) {
    if (!k || k === 'haus') return 'dem Haus';
    var g = null;
    B.welt.gegner.forEach(function (x) { if (x.schluessel === k) g = x; });
    return g ? B.welt.gegnerName(g) : k;
  }

  /* Steht die Verschreibung noch? Gibt den Grund zurueck, warum nicht. */
  function warumWeg(g) {
    var a = B.welt.adresse(g.schluessel);
    if (!a) return { grund: 'Die Adresse gibt es in dieser Zeit nicht mehr', wem: null };
    if (a.ab > B.welt.zeit.epoche || a.bis < B.welt.zeit.epoche)
      return { grund: 'Die Adresse gibt es in dieser Zeit nicht mehr', wem: null };
    if (!a.bindung) return { grund: 'Die Frist ist am Michaelitag abgelaufen', wem: null };
    if (a.bindung.wem !== 'haus')
      return { grund: 'genommen von ' + wemName(a.bindung.wem),
               lang: 'genommen von ' + wemName(a.bindung.wem) + ' — ' + a.bindung.womit,
               wem: a.bindung.wem };
    if (!amHaus(a.bindung.womit))
      return { grund: 'überschrieben', lang: 'überschrieben mit „' + a.bindung.womit + '"',
               wem: 'haus' };
    return null;
  }

  function pruefeErloschen() {
    var e = ep();
    for (var i = Z.geschrieben.length - 1; i >= 0; i--) {
      var g = Z.geschrieben[i];
      var w = warumWeg(g);
      if (!w) continue;
      Z.geschrieben.splice(i, 1);
      Z.erloschen.push({
        schluessel: g.schluessel, name: g.name, preis: g.preis || 0,
        jahr: g.jahr, woche: g.woche,
        wegJahr: jahr(), wegWoche: woche(), grund: w.grund, lang: w.lang || w.grund,
        wem: w.wem,
        zurueck: false
      });
      B.welt.protokolliere({ wer: 'verfall',
        was: g.name + ': ' + e.womit + ' erloschen — ' + (w.lang || w.grund),
        preis: 0, adresse: g.schluessel });
      B.welt.schreibe(g.name + ': die ' + e.womit + ' von ' + g.jahr + '/' + g.woche
        + ' ist erloschen — ' + (w.lang || w.grund) + '. ' + geld(g.preis || 0)
        + ' sind dafür bezahlt worden und stehen jetzt unter ERLOSCHEN im Buch.',
        'erbfall');
      klang('erbe:fallen', 'gegner:verlieren');
    }
  }

  function erloschenSumme() {
    var s = 0;
    Z.erloschen.forEach(function (x) { if (!x.zurueck) s += x.preis || 0; });
    return s;
  }

  /* Wogegen sich Widerspruch erheben laesst: was bezahlt und erloschen ist,
     die Adresse gibt es noch, und das Haus hat sie nicht zurueck. */
  function widerspruchListe() {
    return Z.erloschen.filter(function (x) {
      if (x.zurueck) return false;
      var a = B.welt.adresse(x.schluessel);
      if (!a || a.ab > B.welt.zeit.epoche || a.bis < B.welt.zeit.epoche) return false;
      return !a.bindung || a.bindung.wem !== 'haus' || !amHaus(a.bindung.womit);
    }).sort(function (p, q) {
      var ap = B.welt.adresse(p.schluessel), aq = B.welt.adresse(q.schluessel);
      return wert(aq) - wert(ap);
    });
  }
  function widerspruchPreis(x) {
    var a = B.welt.adresse(x.schluessel);
    if (!a) return 0;
    var voll = Math.round(wert(a) * (D.WIDERSPRUCH_SATZ || 2) * feder());
    return Math.max(1, voll - (x.preis || 0));
  }
  /* Gewonnen, nicht geloescht — dieselbe Form wie das Anfechten, und damit
     innerhalb von ZUSTAENDIGKEIT §8. */
  function widersprich(schluessel) {
    var x = null;
    Z.erloschen.forEach(function (y) { if (!y.zurueck && y.schluessel === schluessel) x = y; });
    if (!x) return false;
    var a = B.welt.adresse(schluessel);
    if (!a) return false;
    var e = ep();
    var p = widerspruchPreis(x);
    if (!B.welt.zahle(p, e.widerspruch.name + ': ' + a.name)) return false;
    var vorher = a.bindung ? wemName(a.bindung.wem) : 'niemandem';
    B.welt.binde(schluessel, 'haus', e.widerspruch.womit, jahr() + e.jahre);
    x.zurueck = true;
    Z.widersprochen++;
    Z.geschrieben.push({ schluessel: schluessel, name: a.name, jahr: jahr(),
      woche: woche(), preis: p, vorher: e.widerspruch.name });
    Z.letzteTat = e.widerspruch.name + ': ' + a.name;
    B.welt.schreibe(e.widerspruch.name + ': ' + a.name + ' hing bei ' + vorher
      + '. ' + e.widerspruch.satz + ' Angerechnet: ' + geld(x.preis || 0)
      + ' von ' + jahr() + '. Die Bindung haftet wieder am Haus.', 'festlegung');
    klang('erbe:spruch', 'preis:siegel');
    B.sende('zeichne', { grund: 'erbe-widerspruch' });
    return true;
  }

  /* Die drei Wege der Uebergabe. Jeder ruft welt.erbe() — den Erbfall, den es
     bis hierher in keiner gespielten Partie gab. */
  function uebergib(form) {
    if (Z.uebergeben || zeit().ende) return false;
    var e = ep(), a = amt();
    var f = e.formen[form] || e.formen.bruch;

    if (form === 'abfindung') {
      var p = abfindungPreis();
      if (p > 0 && !B.welt.zahle(p, f.name + ' an ' + a.name)) return false;
      Z.gnadeBis = jahr() + 1;
    }
    if (form === 'leibgeding') {
      /* Jede Hand, die so uebergibt, legt ihr Jahrgeld auf das Haus. Sie
         summieren sich — das ist der Preis dafuer, dass niemand fallen muss. */
      Z.leibgedinge.push({ name: a.name, betrag: leibgedingPreis(),
                           seit: jahr(), verfallen: false });
    }

    Z.form = form;
    merkeVorher();
    B.welt.schreibe(a.name + ' übergibt das Haus. ' + f.name + ': ' + f.satz, 'festlegung');
    klang('erbe:uebergabe', 'preis:handschlag');

    /* Hier geschieht er. */
    B.welt.erbe();

    B.sende('zeichne', { grund: 'erbe-uebergabe' });
    return true;
  }

  /* Die Stunde, die ohne den Spieler kommt. */
  function stundeSchlaegt() {
    if (Z.uebergeben || zeit().ende) return;
    var e = ep(), a = amt();
    Z.form = 'stunde';
    merkeVorher();
    B.welt.schreibe(String(e.stunde).replace('{alt}', a.name), 'erbfall');
    klang('erbe:stunde', 'gegner:unglueck');
    B.welt.erbe();
    B.sende('zeichne', { grund: 'erbe-stunde' });
  }

  function merkeVorher() {
    Z.vorherFrisch = true;
    Z.alt = { nr: amt().nr, name: amt().name, eigenschaft: amt().eigenschaft,
              eigenschaftName: amt().eigenschaftName };
    Z.vorher = { haus: amHausListe().length, person: personListe().length,
                 summe: personSumme(), keller: B.welt.vorrat.faesser.length,
                 namen: personListe().map(function (a) { return a.name; }) };
  }

  /* Was nur an der Person hing, faellt. NUR eigene Bindungen — eine fremde
     zu loesen steht dem Haus nicht zu (ZUSTAENDIGKEIT §8). */
  function loesePersoenliche(grund) {
    var weg = [];
    personListe().forEach(function (a) {
      var womit = a.bindung.womit;
      var w = wert(a);
      if (B.welt.binde(a.schluessel, null, null, 0, 'haus')) {
        weg.push({ schluessel: a.schluessel, name: a.name, womit: womit, wert: w });
        B.welt.protokolliere({ wer: 'verfall', was: a.name + ': ' + womit + ' fällt mit der Hand',
          preis: 0, adresse: a.schluessel });
      }
    });
    if (weg.length) {
      Z.gefallen = Z.gefallen.concat(weg);
      B.welt.schreibe(grund + ' ' + weg.length
        + (weg.length === 1 ? ' Haus hält' : ' Häuser halten') + ' nicht mehr: '
        + weg.map(function (x) { return x.name; }).join(', ') + '.', 'erbfall');
      klang('erbe:fallen', 'gegner:verlieren');
    }
    return weg;
  }

  /* Der Erbteil der Miterben. Wo nichts vereinbart ist, wird geteilt — und
     geteilt wird, was im Keller liegt. Das ist der Grund, warum das
     Ausgedinge ueberall in Naturalien gerechnet wurde: Brot, Bier, Kammer.
     Wer abfindet oder ein Leibgeding verspricht, kauft genau das ab. */
  function erbteilAusDemKeller() {
    var n = erbteilFass();
    if (n <= 0) return 0;
    var weg = B.welt.nimmHeraus(n).length;
    if (!weg) return 0;
    Z.erbteilFass += weg;
    B.welt.protokolliere({ wer: 'verfall', was: 'Erbteil der Miterben aus dem Keller',
      preis: 0, menge: weg });
    B.welt.schreibe('Die Miterben nehmen ihren Teil in Naturalien: '
      + B.welt.menge(weg) + ' gehen ' + (ep().ausDemLager || 'aus dem Lager') + '.', 'erbfall');
    klang('erbe:erbteil', 'fuhre:kerbe');
    return weg;
  }

  /* Nach dem Erbfall: was gefallen ist, laesst sich einmal zurueckholen —
     teuer, und nur solange es niemand anders genommen hat. Die neue Hand
     geht zu den Haeusern, die ihrer Vorgaengerin gehoerten, und fragt neu. */
  function offeneNachschrift() {
    var l = [];
    Z.gefallen.forEach(function (g) {
      var a = B.welt.adresse(g.schluessel);
      if (a && !a.bindung && a.ab <= B.welt.zeit.epoche && a.bis >= B.welt.zeit.epoche) l.push(a);
    });
    return l;
  }
  function nachschriftPreis() {
    var s = 0;
    offeneNachschrift().forEach(function (a) { s += wert(a); });
    return Math.max(1, Math.round(s * 1.4 * feder()));
  }
  function schreibeNach() {
    var l = offeneNachschrift();
    if (!l.length) return false;
    var e = ep();
    var p = nachschriftPreis();
    if (!B.welt.zahle(p, 'Nachschrift: ' + l.length + ' Häuser neu ' + e.wo)) return false;
    l.forEach(function (a) { B.welt.binde(a.schluessel, 'haus', e.womit, jahr() + e.jahre); });
    Z.nachgeschrieben += l.length;
    Z.letzteTat = 'Nachschrift';
    B.welt.schreibe('Die neue Hand geht zu den Häusern zurück, die mit der alten '
      + 'gefallen sind, und lässt neu ' + e.wo + ' schreiben: '
      + l.map(function (a) { return a.name; }).join(', ') + '. Diesmal steht es am Haus.',
      'festlegung');
    klang('erbe:feder', 'preis:siegel');
    B.sende('zeichne', { grund: 'erbe-nachschrift' });
    return true;
  }

  /* Was am Haus haftet, haftet bis zu einem Tag. Die naechste Hand erbt die
     Bindung MIT ihrem Ablaufdatum — und muss sie fortschreiben, sonst faellt
     sie am Michaelitag von selbst (kern/welt.js, rechneJahrAb). Diese Tat gibt
     es, solange das Haus ueberhaupt etwas haelt, und sie ist der Grund, warum
     die Leiste nach dem Erbfall nicht leer dasteht. */
  function baldFaellig() {
    var l = amHausListe().slice().sort(function (x, y) {
      return (x.bindung.bis || 0) - (y.bindung.bis || 0);
    });
    return l.length ? l[0] : null;
  }
  function verlaengerPreis(a) {
    return Math.max(1, Math.round(wert(a) * 0.6 * feder()));
  }
  function verlaengere(schluessel) {
    var a = B.welt.adresse(schluessel);
    if (!a || !a.bindung || a.bindung.wem !== 'haus') return false;
    var e = ep();
    var p = verlaengerPreis(a);
    var alt = a.bindung.bis;
    if (!B.welt.zahle(p, 'Fortschreiben: ' + a.name)) return false;
    B.welt.binde(schluessel, 'haus', e.womit, jahr() + e.jahre);
    Z.geschrieben.push({ schluessel: schluessel, name: a.name, jahr: jahr(),
      woche: woche(), preis: p, vorher: 'lief bis ' + alt });
    Z.letzteTat = 'Fortschreiben: ' + a.name;
    B.welt.schreibe(a.name + ': die Bindung lief bis ' + alt
      + ' und ist ' + e.wo + ' bis ' + (jahr() + e.jahre) + ' fortgeschrieben.',
      'festlegung');
    klang('erbe:feder', 'preis:siegel');
    B.sende('zeichne', { grund: 'erbe-verlaengern' });
    return true;
  }

  /* Der fuenfte Zug der streitbaren Hand: was beim Gegner nur an einer Person
     haengt, laesst sich anfechten. Gewonnen wird sie, nicht geloescht —
     welt.binde setzt sie auf das Haus um. */
  function fechteAn(schluessel) {
    var a = B.welt.adresse(schluessel);
    if (!a || !a.bindung || a.bindung.wem === 'haus' || amHaus(a.bindung.womit)) return false;
    var e = ep();
    var p = Math.round(wert(a) * 2.2);
    var gegen = a.bindung.wem;
    if (!B.welt.zahle(p, e.anfechten.name + ': ' + a.name)) return false;
    B.welt.binde(schluessel, 'haus', e.anfechten.womit, jahr() + e.jahre);
    Z.angefochten++;
    Z.letzteTat = e.anfechten.name + ': ' + a.name;
    B.welt.schreibe(e.anfechten.name + ': ' + a.name + ' hing bei ' + gegen
      + ' nur an einer Person (' + a.bindung.womit + '). Jetzt haftet die Bindung am Haus.',
      'festlegung');
    klang('erbe:spruch', 'gegner:klage');
    B.sende('zeichne', { grund: 'erbe-anfechten' });
    return true;
  }

  /* Der fuenfte Zug der frommen Hand. */
  function geistlicheHaeuser() {
    return B.welt.adressenJetzt().filter(function (a) {
      return a.art === 'kloster' || a.schluessel === 'pfarrhof';
    });
  }
  function seelgeraetPreis() {
    var p = 0;
    geistlicheHaeuser().forEach(function (a) { p += wert(a); });
    return p > 0 ? Math.max(1, Math.round(p * 1.6 * feder())) : 0;
  }
  function stifteSeelgeraet() {
    if (Z.seelgeraet) return false;
    var e = ep();
    var geistlich = geistlicheHaeuser();
    var p = seelgeraetPreis();
    if (p <= 0) return false;
    if (!B.welt.zahle(p, e.seelgeraet.name)) return false;
    Z.seelgeraet = true;
    geistlich.forEach(function (a) {
      B.welt.binde(a.schluessel, 'haus', e.womit, jahr() + e.jahre * 2);
    });
    Z.letzteTat = e.seelgeraet.name;
    B.welt.schreibe(e.seelgeraet.name + '. ' + e.seelgeraet.satz + ' '
      + geistlich.map(function (a) { return a.name; }).join(' und ')
      + ' hängen von nun an am Haus.', 'festlegung');
    klang('erbe:stiftung', 'preis:siegel');
    B.sende('zeichne', { grund: 'erbe-seelgeraet' });
    return true;
  }

  /* ======================================================================
     DAS JAHR — Michaeli. Hier wird bezahlt, was ueber die Amtszeit hinaus
     versprochen wurde, und hier schlaegt die Stunde.
     ====================================================================== */

  function michaeli(d) {
    var e = ep();

    /* Borg der wagemutigen Hand. */
    if (Z.borg.length) {
      var summe = 0;
      Z.borg.forEach(function (b) { summe += b.betrag; });
      var l = Z.borg.length;
      Z.borg = [];
      B.welt.zahle(summe, 'Borg für ' + l + ' Verschreibung' + (l === 1 ? '' : 'en'));
      B.welt.schreibe('Der Borg ist fällig: ' + geld(summe) + ' für '
        + l + (l === 1 ? ' Verschreibung' : ' Verschreibungen') + '.', 'pflicht');
    }

    /* Das Leibgeding — was ueber die Amtszeit hinaus bleibt, jedes Jahr, und
       fuer jede Hand, die es sich versprechen liess. */
    Z.leibgedinge.forEach(function (l) {
      if (l.verfallen || l.betrag <= 0) return;
      if (B.welt.zahle(l.betrag, e.formen.leibgeding.name + ' an ' + l.name)) {
        B.welt.schreibe(e.formen.leibgeding.name + ' bezahlt: ' + geld(l.betrag)
          + ' an ' + l.name + '. Ihre Leute bleiben.', 'pflicht');
      } else {
        l.verfallen = true;
        B.welt.schreibe(e.formen.leibgeding.name + ' konnte nicht bezahlt werden. '
          + l.name + ' zieht aus dem Haus.', 'erbfall');
        loesePersoenliche('Das Leibgeding ist verfallen —');
      }
    });

    /* Die Gnadenfrist der Abfindung laeuft ab. */
    if (Z.gnadeBis && jahr() >= Z.gnadeBis) {
      Z.gnadeBis = 0;
      loesePersoenliche('Die Frist nach der Abfindung ist um —');
    }

    /* rechneJahrAb() laeuft VOR diesem Ereignis (kern/uhr.js: schliesseJahr
       ruft es und sendet danach 'jahr') und loescht abgelaufene Bindungen.
       Hier ist der Ort, an dem eine so verlorene Verschreibung auffliegt. */
    pruefeErloschen();

    /* Sicherung fuer uhr.springe(): wer ganze Jahre ueberspringt, hat keine
       Woche mehr, in der die Stunde schlagen koennte. */
    if (!Z.uebergeben && stundeIstDa()) stundeSchlaegt();
  }

  /* ======================================================================
     DAS BILD
     ====================================================================== */

  function zeile(el, marke, wert2, klasse) {
    var z = B.el('div', 'erb-zeile' + (klasse ? ' ' + klasse : ''));
    z.appendChild(B.el('span', 'm', marke));
    z.appendChild(B.el('span', 'w', wert2));
    el.appendChild(z);
    return z;
  }

  /* --- die dauernd stehende Tafel --------------------------------------- */

  function haeuser(n) { return n + (n === 1 ? ' Haus' : ' Häuser'); }
  function ohneArtikel(t) { return String(t).replace(/^(Das|Der|Die)\s+/, ''); }

  /* Der lange Name eines Wirtshauses sprengt einen Knopf, der ein Viertel der
     Leiste breit ist. Gekuerzt wird von vorn — 'Gasthof Lindenhof' heisst
     dann 'Lindenhof', nicht 'Gasthof Linden…'. */
  function kurzName(a) {
    var n = String(a.name || '')
      .replace(/^(Gasthof|Landgasthof|Gaststätte|Klosterschenke)\s+/i, '')
      .trim();
    if (!n) n = a.name;
    return n.length > 21 ? n.slice(0, 20) + '…' : n;
  }

  /* ======================================================================
     DIE LEISTE.  Vier Knoepfe in einer Zeile, drei mit Preisschild, und zwar
     von der ersten bis zur letzten Woche der Partie.

     Der Kritiker hat gezaehlt, was nach der Stunde uebrigblieb: E1 Mittel
     0,29 preisbeschilderte Zuege je Woche (85 von 115 Wochen null), E4 0,05
     (108 von 113 null). Eigene Nachmessung, Beobachtungspartie, Saat 1350:
     E1 0,03 (85 von 88 null), E2 0,60, E3 0,99, E4 0,96. Der Befund stimmt,
     und er hatte zwei Ursachen, die beide hier lagen:

       · Es gab genau eine Stunde. Danach war die Uebergabe entschieden und
         die drei Wege verschwanden aus dem DOM — fuer immer.
       · Was danach noch kam (Nachschrift, Fortschreiben, Anfechten), setzt
         voraus, dass das Haus ueberhaupt noch etwas haelt. In E1 hielt es ab
         Woche 21 nichts mehr, und die Leiste war leer.

     Beides ist jetzt anders. Nach jedem Erbfall wird die naechste Stunde
     gestellt, und die Leiste traegt IMMER dieselben vier Knoepfe: eine Tat
     und die drei Wege. Die Tat ist die dringendste, die es gerade gibt —
     alle anderen liegen im Buch hinter dem Reiter.
     ====================================================================== */

  /* Die Tat, die auf der Leiste steht. In dieser Reihenfolge, und die erste,
     die es gibt, gewinnt. Die vollstaendige Liste steht im Buch. */
  function taten() {
    var e = ep(), ei = eig(), l = [];

    /* 1 — Was bezahlt wurde und genommen ist. Das drueckt am meisten. */
    var w = widerspruchListe();
    if (w.length) {
      var x = w[0], ax = B.welt.adresse(x.schluessel), pw = widerspruchPreis(x);
      l.push({ zug: 'erbe:widerspruch', art: 'umkaempft', klasse: 'erb-knopf erb-streit',
        text: e.widerspruch.name.replace(/^(Widerspruch aus dem|Auf den)\s+/, 'Widerspruch · '),
        kurz: e.widerspruch.name + ' ' + ax.name, preis: pw,
        titel: ax.name + ': ' + geld(x.preis) + ' sind ' + x.jahr + '/' + x.woche
          + ' dafür bezahlt worden, ' + x.wegJahr + '/' + x.wegWoche + ' war es fort ('
          + (x.lang || x.grund) + '). ' + e.widerspruch.satz,
        aus: !B.welt.kann(pw),
        tu: function () { widersprich(x.schluessel); } });
    }

    /* 2 — Was nur an dieser Hand haengt und die Stunde nicht ueberlebt. */
    var offen = personListe().slice().sort(function (p, q) { return wert(q) - wert(p); });
    if (offen.length) {
      var ziel = offen[0];
      var borg = ei.zug === 'borg';
      var p1 = borg ? schreibPreis(ziel) * 2 : schreibPreis(ziel);
      l.push({ zug: 'erbe:tafel:verschreibe', art: 'bindung', klasse: 'erb-knopf erb-weit',
        text: (borg ? e.verb + ' auf Borg · ' : e.verb + ' · ') + kurzName(ziel),
        kurz: e.verb + ' ' + ziel.name, preis: p1,
        titel: ziel.name + ' hängt an ' + (amt().name || 'der Hand') + ' ('
          + ziel.bindung.womit + '). ' + e.verb + ' ' + e.wo + ' — dann haftet die '
          + 'Bindung am Haus und überlebt den Erbfall. Feder ' + B.zahl(feder(), 2)
          + '×' + (imAntritt() ? ', Antrittsgeld der neuen Hand eingerechnet' : '')
          + '. Unwiderruflich.',
        aus: !borg && !B.welt.kann(p1),
        tu: function () { schreibeAufsHaus(ziel.schluessel, borg); } });
    }

    /* 3 — Was mit der letzten Hand gefallen ist. */
    var nach = offeneNachschrift();
    if (nach.length) {
      var pn = nachschriftPreis();
      l.push({ zug: 'erbe:nachschrift', art: 'bindung', klasse: 'erb-knopf erb-nach',
        text: 'Nachschrift · ' + nach.length + (nach.length === 1 ? ' Haus' : ' Häuser'),
        kurz: 'Nachschrift ' + nach.length, preis: pn,
        titel: 'Mit ' + (Z.alt ? Z.alt.name : 'der alten Hand') + ' gefallen: '
          + nach.map(function (a) { return a.name; }).join(', ')
          + '. Neu ' + e.wo + ' schreiben lassen — diesmal am Haus. Unwiderruflich.',
        aus: !B.welt.kann(pn),
        tu: function () { schreibeNach(); } });
    }

    /* 4 — Was am Haus haftet, haftet nur bis zu einem Tag. */
    var bald = baldFaellig();
    if (bald) {
      var pv = verlaengerPreis(bald);
      l.push({ zug: 'erbe:verlaengern', art: 'bindung', klasse: 'erb-knopf',
        text: 'Fortschreiben · ' + kurzName(bald),
        kurz: 'Fortschreiben ' + bald.name, preis: pv,
        titel: bald.name + ' haftet am Haus (' + bald.bindung.womit + '), aber nur '
          + 'bis ' + bald.bindung.bis + '. Fortschreiben ' + e.wo + ' bis '
          + (jahr() + e.jahre) + '. Unwiderruflich.',
        aus: !B.welt.kann(pv),
        tu: function () { verlaengere(bald.schluessel); } });
    }

    /* 5 — Der Zug, den nur diese Eigenschaft kennt. */
    if (ei.zug === 'anfechten') {
      var fremd = B.welt.adressenJetzt().filter(function (a) {
        return a.bindung && a.bindung.wem !== 'haus' && !amHaus(a.bindung.womit);
      }).sort(function (p, q) { return wert(q) - wert(p); });
      if (fremd.length) {
        var f = fremd[0], pf = Math.round(wert(f) * 2.2);
        l.push({ zug: 'erbe:anfechten', art: 'umkaempft', klasse: 'erb-knopf erb-streit',
          text: e.anfechten.name + ' · ' + kurzName(f),
          kurz: e.anfechten.name + ' ' + f.name, preis: pf,
          titel: f.name + ' hängt bei ' + wemName(f.bindung.wem) + ' nur an einer Person ('
            + f.bindung.womit + '). Das lässt sich anfechten.',
          aus: !B.welt.kann(pf),
          tu: function () { fechteAn(f.schluessel); } });
      }
    }
    if (ei.zug === 'seelgeraet' && !Z.seelgeraet) {
      var ps = seelgeraetPreis();
      if (ps > 0) {
        l.push({ zug: 'erbe:seelgeraet', art: 'bindung', klasse: 'erb-knopf',
          text: e.seelgeraet.name, kurz: e.seelgeraet.name, preis: ps,
          titel: e.seelgeraet.satz + ' ' + geistlicheHaeuser().map(function (a) { return a.name; }).join(', ')
            + ' hängen danach am Haus.',
          aus: !B.welt.kann(ps),
          tu: function () { stifteSeelgeraet(); } });
      }
    }
    return l;
  }

  function tatKnopf(t) {
    var k = B.knopf({ text: t.text, zug: t.zug, preis: -t.preis, klasse: t.klasse,
                      titel: t.titel, aus: t.aus, tu: t.tu });
    B.welt.meldeZug(t.kurz, t.preis, t.art, t.zug);
    return k;
  }

  function zeichneTafel(fach) {
    var e = ep(), a = amt();
    var t = B.el('div', 'erb-leiste');
    /* KEIN data-frei und kein .amort. stadt.js: wer sich als Ortsmarke
       ausgibt und keine ist (ueber MARKE = 2,4 %), hat die zweite Schwelle
       VERWIRKT und wird trotz GRENZE (3,5 %) zum Brett gemacht. Mit
       data-frei="1" trug die Leiste prompt 'stadt-zugeklappt', clip-path
       inset(50%), und alle vier Preisschilder waren am Bildschirm nicht mehr
       zu treffen. Ohne das Attribut greift die GRENZE, und sie steht. */
    t.setAttribute('data-reiter', 'Das Erbe');

    var band = B.el('div', 'erb-band');
    band.appendChild(B.el('b', 'erb-wort', e.wort));
    band.appendChild(B.el('span', 'erb-uhr',
      'noch ' + wochenBisStunde() + (wochenBisStunde() === 1 ? ' Woche' : ' Wochen')));
    /* Die Nummer der Hand, ihre Eigenschaft UND der Preis ihrer Feder in einer
       Spalte: das ist die Zeile, an der sich nachlesen laesst, ob mit dem
       Erbfall wirklich etwas anderes am Haus sitzt (Auflage 2). */
    band.appendChild(B.el('span', 'erb-hand',
      roem(a.nr) + ' ' + (a.name || '—') + ' · ' + (a.eigenschaftName || '—')
      + ' · Feder ' + B.zahl(feder(), 2) + '×'));
    band.appendChild(B.el('span', 'erb-stand',
      'am Haus ' + amHausListe().length + ' · an der Person ' + personListe().length));
    /* Was die Stunde nehmen wird, wenn niemand etwas vereinbart. */
    band.appendChild(B.el('span', 'erb-nimmt',
      'nimmt ' + personListe().length + ' · ' + B.welt.menge(erbteilFass())));
    /* Auflage 1: was bezahlt und doch verloren ist, steht auf der Leiste und
       nicht erst hinter einem Reiter. */
    if (Z.erloschen.length) {
      band.appendChild(B.el('span', 'erb-erloschen',
        'erloschen ' + Z.erloschen.length + ' · ' + geld(erloschenSumme())));
    }
    var last = leibgedingLast();
    if (last > 0) {
      band.appendChild(B.el('span', 'erb-last', 'jedes Michaeli ' + geld(last)));
    }

    /* Die vier Knoepfe. Eine Tat und die drei Wege — immer, in jeder Woche. */
    var knoepfe = B.el('div', 'erb-knoepfe');
    var l = taten();
    if (l.length) knoepfe.appendChild(tatKnopf(l[0]));

    var lg = leibgedingPreis(), ab = abfindungPreis();
    knoepfe.appendChild(B.knopf({
      text: ohneArtikel(e.formen.leibgeding.name) + ' · jährlich',
      zug: 'erbe:uebergabe:leibgeding',
      preis: -lg,
      klasse: 'erb-knopf erb-uebergabe',
      titel: e.formen.leibgeding.satz + ' — ' + geld(lg) + ' jedes Michaeli, '
        + 'solange das Haus steht'
        + (lg <= gebuehr() ? '; das ist die reine Gebühr für ' + e.wo
           + ', denn zu teilen ist nichts mehr' : '')
        + (last > 0 ? '; dazu die ' + geld(last) + ', die schon laufen' : '')
        + '. Unwiderruflich.',
      tu: function () { uebergib('leibgeding'); }
    }));
    knoepfe.appendChild(B.knopf({
      text: ohneArtikel(e.formen.abfindung.name),
      zug: 'erbe:uebergabe:abfindung',
      preis: -ab,
      klasse: 'erb-knopf erb-uebergabe',
      titel: e.formen.abfindung.satz + ' — einmal ' + geld(ab) + '. '
        + (ab <= gebuehr()
           ? 'Mehr ist es nicht: das ist die Gebühr für ' + e.wo + ', zu teilen ist nichts. '
           : 'Der Preis fällt mit jeder Woche, die der Stunde näher kommt. ')
        + 'Unwiderruflich.',
      aus: !B.welt.kann(ab),
      tu: function () { uebergib('abfindung'); }
    }));
    var kLeer = B.knopf({
      text: ohneArtikel(e.formen.bruch.name),
      zug: 'erbe:uebergabe:bruch',
      /* NICHT erb-leer: diese Klasse traegt im Buch die Zeile "Nichts. Alles
         haengt an einem Menschen" und ist grau und kursiv. Am Bildschirm
         gemessen faerbte sie den dritten Weg auf rgb(138,122,94) kursiv —
         ein waehlbarer, unwiderruflicher Zug sah aus wie ein gesperrter. */
      klasse: 'erb-knopf erb-uebergabe erb-ohne',
      titel: e.formen.bruch.satz + ' — kostet nichts und nimmt alles, was nur '
        + 'an der Person hing, dazu ' + B.welt.menge(erbteilFass()) + ' aus dem Lager. '
        + 'Unwiderruflich.',
      tu: function () { uebergib('bruch'); }
    });
    /* B.knopf laesst den Preis 0 weg. Neben zwei Preisschildern sieht ein
       Knopf ohne Schild aber aus wie ein gesperrter — also traegt der
       dritte Weg seine Null selbst. Die Null IST hier die Entscheidung. */
    kLeer.appendChild(B.el('span', 'preis einnahme', geld(0)));
    knoepfe.appendChild(kLeer);

    t.appendChild(band);
    t.appendChild(knoepfe);
    fach.appendChild(t);
  }

  /* --- das Brett: die volle Liste --------------------------------------- */

  function zeichneBuch(fach) {
    var e = ep(), a = amt(), ei = eig();
    var buch = B.el('div', 'erb-buch blatt');
    buch.setAttribute('data-reiter', 'Das Erbe');

    buch.appendChild(B.el('h2', '', e.wort + ' — ' + e.verb + ' ' + e.wo
      + ' · ' + roem(a.nr) + ' Hand'));

    var kopf = B.el('div', 'erb-buchkopf');
    kopf.appendChild(B.el('div', 'erb-name', (a.name || '—') + ' · ' + (a.eigenschaftName || '—')));
    kopf.appendChild(B.el('div', 'erb-sagt', '„' + (a.sagt || '') + '"'));
    kopf.appendChild(B.el('div', 'erb-wirkt', ei.wirkt));
    buch.appendChild(kopf);

    buch.appendChild(B.el('p', 'erb-regel', e.erklaerung));

    buch.appendChild(B.el('p', 'erb-frist',
      'Die Stunde kommt in ' + wochenBisStunde()
      + (wochenBisStunde() === 1 ? ' Woche' : ' Wochen') + ' — '
      + B.uhr.datum(Z.stundeJahr, Z.stundeWoche).lang
      + '. Wer bis dahin nichts vereinbart hat, übergibt mit leeren Händen.'
      + (imAntritt() ? ' ' + (a.name || 'Die neue Hand') + ' ist beim Schreiber noch '
         + 'unbekannt: bis Michaeli ' + jahr() + ' kostet jede Feder das Antrittsgeld mit, '
         + B.zahl(feder(), 2) + '× statt ' + B.zahl(federDauernd(), 2) + '×.' : '')));

    if (Z.erbfaelle) {
      var f = e.formen[Z.letzteForm];
      buch.appendChild(B.el('p', 'erb-frist erb-frist-alt',
        (Z.alt ? Z.alt.name : 'Die Hand davor') + ' hat übergeben — '
        + (f ? f.name + '. ' + f.satz : 'ohne Vereinbarung, weil die Stunde nicht wartete.')
        + (Z.vorher ? ' Am Haus ' + Z.vorher.haus + ' → ' + (Z.nachher ? Z.nachher.haus : '—')
          + ', an der Person ' + Z.vorher.person + ' → ' + (Z.nachher ? Z.nachher.person : '—')
          + (Z.erbteilFass ? ', ' + (e.ausDemLager || 'aus dem Lager') + ' '
             + B.welt.menge(Z.erbteilFass) : '') + '.' : '')));
    }

    /* Am Haus */
    var fest = amHausListe();
    var lade = B.el('div', 'erb-lade erb-lade-fest');
    lade.appendChild(B.el('div', 'erb-ladekopf', 'AM HAUS · ' + fest.length
      + ' — geht über, wer immer die Kelle hält'));
    if (!fest.length) lade.appendChild(B.el('div', 'erb-leer', 'Nichts. Alles hängt an einem Menschen.'));
    fest.forEach(function (x) {
      var r = B.el('div', 'erb-satz greifbar');
      r.appendChild(B.el('span', 'n', x.name));
      r.appendChild(B.el('span', 'v', x.bindung.womit + ' bis ' + x.bindung.bis));
      if (ei.zug === 'zahlen') r.appendChild(B.el('span', 'p', geld(wert(x))));
      /* Was am Haus haftet, haftet bis zu einem Tag — und die naechste Hand
         erbt die Frist mit. Darum steht das Fortschreiben an jeder Zeile und
         nicht nur beim naechstfaelligen Haus auf der Leiste. */
      var pv = verlaengerPreis(x);
      r.appendChild(B.knopf({
        text: 'Fortschreiben',
        zug: 'erbe:fortschreiben:' + x.schluessel,
        preis: -pv,
        klasse: 'erb-knopf erb-mini',
        titel: x.name + ': ' + x.bindung.womit + ' läuft bis ' + x.bindung.bis
          + '. ' + e.verb + ' ' + e.wo + ' bis ' + (jahr() + e.jahre) + ' — '
          + geld(pv) + ', unwiderruflich.',
        aus: !B.welt.kann(pv),
        tu: function () { verlaengere(x.schluessel); }
      }));
      lade.appendChild(r);
    });
    buch.appendChild(lade);

    /* An der Person */
    var los = personListe();
    var lade2 = B.el('div', 'erb-lade erb-lade-lose');
    lade2.appendChild(B.el('div', 'erb-ladekopf', 'AN DER PERSON · ' + los.length
      + ' — fällt mit der Hand, die es gab'));
    if (!los.length) lade2.appendChild(B.el('div', 'erb-leer',
      Z.erbfaelle ? 'Nichts mehr. Was hier stand, ist gefallen oder geschrieben.'
                  : 'Nichts. Alles steht im Buch.'));
    var borg = ei.zug === 'borg';
    los.forEach(function (x) {
      var r = B.el('div', 'erb-satz greifbar');
      r.appendChild(B.el('span', 'n', x.name));
      r.appendChild(B.el('span', 'v', x.bindung.womit));
      if (ei.zug === 'zahlen') r.appendChild(B.el('span', 'p', geld(wert(x))));
      var p = borg ? schreibPreis(x) * 2 : schreibPreis(x);
      r.appendChild(B.knopf({
        text: borg ? e.verb + ' auf Borg' : e.verb,
        zug: 'erbe:verschreibe:' + x.schluessel,
        preis: -p,
        klasse: 'erb-knopf erb-mini',
        titel: x.name + ' — ' + e.verb + ' ' + e.wo + '. Kostet ' + geld(p)
          + ' und ist unwiderruflich. Danach haftet die Bindung am Haus.',
        aus: !borg && !B.welt.kann(p),
        tu: function () { schreibeAufsHaus(x.schluessel, borg); }
      }));
      lade2.appendChild(r);
    });
    buch.appendChild(lade2);

    /* AUFLAGE 1 — die dritte Lade. Datum, Grund und der gezahlte Betrag.
       Solange die Adresse noch existiert und nicht dem Haus gehoert, steht
       daneben der Widerspruch, auf den das Gezahlte angerechnet wird. */
    if (Z.erloschen.length) {
      var ladeE = B.el('div', 'erb-lade erb-lade-erloschen');
      ladeE.appendChild(B.el('div', 'erb-ladekopf',
        (e.erloschen || 'ERLOSCHEN') + ' · ' + Z.erloschen.length
        + ' · ' + geld(erloschenSumme()) + ' bezahlt'));
      Z.erloschen.forEach(function (x) {
        var r = B.el('div', 'erb-satz' + (x.zurueck ? ' erb-zurueck' : ' greifbar'));
        r.appendChild(B.el('span', 'n', x.name));
        var vg = B.el('span', 'v', x.wegJahr + '/' + x.wegWoche + ' · ' + x.grund);
        /* Der Grund wird in der Spalte gekuerzt; er muss trotzdem ganz zu
           lesen sein — sonst steht der halbe Befund im Buch. */
        vg.title = x.name + ': ' + e.verb + ' ' + x.jahr + '/' + x.woche + ' für '
          + geld(x.preis) + '. Erloschen ' + x.wegJahr + '/' + x.wegWoche + ' — '
          + (x.lang || x.grund) + '.';
        r.appendChild(vg);
        r.appendChild(B.el('span', 'p', geld(x.preis)));
        var ax = B.welt.adresse(x.schluessel);
        var offenNoch = !x.zurueck && ax
          && ax.ab <= B.welt.zeit.epoche && ax.bis >= B.welt.zeit.epoche
          && (!ax.bindung || ax.bindung.wem !== 'haus' || !amHaus(ax.bindung.womit));
        if (offenNoch) {
          var pw = widerspruchPreis(x);
          r.appendChild(B.knopf({
            text: 'Widerspruch',
            zug: 'erbe:widerspruch:' + x.schluessel,
            preis: -pw,
            klasse: 'erb-knopf erb-mini erb-streit',
            titel: e.widerspruch.satz + ' ' + geld(x.preis) + ' von ' + x.jahr + '/'
              + x.woche + ' werden angerechnet; zu zahlen bleiben ' + geld(pw) + '.',
            aus: !B.welt.kann(pw),
            tu: function () { widersprich(x.schluessel); }
          }));
        } else if (x.zurueck) {
          r.appendChild(B.el('span', 'v', '· zurückgeholt'));
        }
        ladeE.appendChild(r);
      });
      buch.appendChild(ladeE);
    }

    /* Was gefallen ist */
    if (Z.gefallen.length) {
      var lade3 = B.el('div', 'erb-lade erb-lade-weg');
      lade3.appendChild(B.el('div', 'erb-ladekopf', 'GEFALLEN · ' + Z.gefallen.length
        + ' — hing an einem Menschen, nicht am Haus'));
      Z.gefallen.forEach(function (x) {
        var r = B.el('div', 'erb-satz');
        r.appendChild(B.el('span', 'n', x.name));
        r.appendChild(B.el('span', 'v', x.womit));
        lade3.appendChild(r);
      });
      buch.appendChild(lade3);
    }

    /* Was geschrieben wurde */
    if (Z.geschrieben.length) {
      var lade4 = B.el('div', 'erb-lade erb-lade-buch');
      lade4.appendChild(B.el('div', 'erb-ladekopf', 'GESCHRIEBEN · ' + Z.geschrieben.length));
      Z.geschrieben.forEach(function (x) {
        var r = B.el('div', 'erb-satz');
        r.appendChild(B.el('span', 'n', x.name));
        r.appendChild(B.el('span', 'v', x.jahr + '/' + x.woche + ' · vorher ' + x.vorher));
        r.appendChild(B.el('span', 'p', x.preis ? geld(x.preis) : 'auf Borg'));
        lade4.appendChild(r);
      });
      buch.appendChild(lade4);
    }

    /* DAS GESCHLECHT.  Auflage 2: der Kritiker hat drei von vierzehn
       Uebergaengen gefunden, in denen der Erbe den Vornamen des Erblassers
       trug — und bei gleichem Namen UND gleicher Eigenschaft war auch die
       Feder unveraendert. Dann sei die Zeile "II. Hand" eine reine Behauptung.
       Der Vorname wird in welt.neueAmtszeit gezogen und gehoert dem Kern; die
       Bitte steht im Bericht. Was hier steht, ist die Feder, und die ist ab
       jetzt nach jedem Erbfall eine andere — die Spalte rechts nennt sie fuer
       jede Hand, und wo Name und Eigenschaft sich wiederholen, sagt das Buch
       es hin. */
    if (Z.haende.length) {
      var lade5 = B.el('div', 'erb-lade erb-lade-hand');
      lade5.appendChild(B.el('div', 'erb-ladekopf', 'DIE HÄNDE · ' + Z.haende.length));
      Z.haende.forEach(function (h, i) {
        var vor = i > 0 ? Z.haende[i - 1] : null;
        var gleich = vor && vor.name === h.name && vor.eigenschaft === h.eigenschaft;
        var r = B.el('div', 'erb-satz' + (gleich ? ' erb-gleich' : ''));
        r.appendChild(B.el('span', 'n', roem(h.nr) + ' ' + h.name));
        r.appendChild(B.el('span', 'v', h.eigenschaftName
          + (gleich ? ' · Name und Art wie davor' : '')
          + (h.form ? ' · ' + h.form : '')));
        r.appendChild(B.el('span', 'p', 'Feder ' + B.zahl(h.feder, 2) + '×'));
        lade5.appendChild(r);
      });
      buch.appendChild(lade5);
    }

    fach.appendChild(buch);
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */

  B.stueck('erbe', {

    aufbau: function () {
      Z.startJahr = jahr();
      /* Kein `||` — STUNDE_NACH_JAHREN ist 0, und 0 || 1 ist 1. Genau dieser
         Rueckfall hat die Stunde beim ersten Lauf ein Braujahr zu spaet
         schlagen lassen; die Tafel sagte 45 Wochen, wo 15 stehen mussten. */
      stelleStunde(amt(), jahr() + (D.STUNDE_NACH_JAHREN === undefined ? 1 : D.STUNDE_NACH_JAHREN));

      /* AUFLAGE 5 — DIE EICHUNG AN DER STARTBARSCHAFT.
         Ueber drei Saaten nachgemessen kostete das Verschreiben aller offenen
         Adressen zwischen 17,9 % (E3/Saat 99) und 78,1 % (E4/Saat 7) der
         Startkasse; der Kritiker hatte auf Saat 1350 zwischen 37 % und 56 %
         gemessen. Die Spanne haengt allein daran, welche vier Adressen der
         Wuerfel dem Haus zuteilt. Also wird sie hier gedeckelt: was ueber
         ZIEL_ANTEIL hinausgeht, wird gleichmaessig heruntergesetzt; darunter
         wird nichts angehoben. Einmal gerechnet, im aufbau — danach ist der
         Faktor fest, und die Preise springen dem Spieler nicht davon. */
      Z.startKasse = Math.max(1, B.welt.haus.kasse);
      var roh = 0;
      personListe().forEach(function (x) {
        roh += Math.max(1, Math.round(Math.max(1, Math.round(x.bedarf * ep().satz)) * eig().faktor));
      });
      Z.eichRoh = roh;
      Z.eich = roh > 0
        ? Math.min(1, ((D.ZIEL_ANTEIL === undefined ? 1 : D.ZIEL_ANTEIL) * Z.startKasse) / roh)
        : 1;

      Z.haende.push({ nr: amt().nr, name: amt().name, eigenschaft: amt().eigenschaft,
        eigenschaftName: amt().eigenschaftName, feder: federDauernd(), form: null });

      B.welt.schreibe('Die Hand am Haus ist ' + amt().name + ', ' + amt().eigenschaftName
        + '. Was sie nur mit einem Handschlag hält, hält das Haus nicht. '
        + ep().erklaerung, 'anfang');
    },

    zeichne: function () {
      var kopf = B.ebene('kopf', 'erbe');
      B.leere(kopf);
      zeichneTafel(kopf);

      var blatt = B.ebene('blatt', 'erbe');
      B.leere(blatt);
      zeichneBuch(blatt);
    },

    jahr: function (d) { michaeli(d); },

    /* Die Stunde schlaegt mitten im Braujahr, nicht am Michaelitag — siehe
       den Absatz in erbe-daten.js. Am Jahreswechsel raeumt der Abschluss
       Bindungen und Keller ab, bevor dieses Stueck ueberhaupt drankaeme. */
    woche: function () {
      /* Auflage 1: was bezahlt wurde und in dieser Woche genommen worden ist,
         faellt hier auf und bekommt seine Zeile — nicht erst am Michaeli. */
      pruefeErloschen();
      if (!Z.uebergeben && !zeit().ende && stundeIstDa()) stundeSchlaegt();
    },

    /* Der Erbfall. Hier — und nur hier — wird die Regel vollzogen. */
    erbfall: function (d) {
      Z.uebergeben = true;
      if (!Z.form) Z.form = 'stunde';
      if (!Z.vorherFrisch) merkeVorher();
      Z.neu = d && d.amtszeit
        ? { nr: d.amtszeit.nr, name: d.amtszeit.name,
            eigenschaft: d.amtszeit.eigenschaft, eigenschaftName: d.amtszeit.eigenschaftName }
        : null;

      Z.kellerVorher = B.welt.vorrat.faesser.length;
      if (Z.form !== 'leibgeding' && Z.form !== 'abfindung') {
        loesePersoenliche('Mit der Hand fällt, was nur an ihr hing —');
        erbteilAusDemKeller();
      }
      /* Was bezahlt war und mit dem Erbfall doch fortging, bekommt seine
         Zeile im selben Augenblick. */
      pruefeErloschen();

      Z.nachher = { haus: amHausListe().length, person: personListe().length,
                    keller: B.welt.vorrat.faesser.length };
      B.welt.schreibe('Das Haus geht auf ' + (Z.neu ? Z.neu.name : 'die nächste Hand')
        + ' über. Vorher hafteten ' + Z.vorher.haus + ' Bindungen am Haus und '
        + Z.vorher.person + ' an der Person; jetzt sind es ' + Z.nachher.haus
        + ' und ' + Z.nachher.person + '. ' + (Z.neu ? Z.neu.eigenschaftName + ': '
        + (eig().wirkt || '') : ''), 'erbfall');

      /* ---------------------------------------------------------------
         AUFLAGE 3 — DIE NAECHSTE STUNDE WIRD GESTELLT.
         "Die Amtszeit der II. Hand endet 1378/1626/1914/2006 und damit
         immer nach dem Spielende — ein zweiter Erbfall ist unerreichbar."
         Er ist es ab jetzt nicht mehr: ein Braujahr weiter, in einer Woche,
         die aus `amtszeit.bis` dieser Hand faellt und darum mit der Saat
         streut. Damit traegt die Leiste ihre vier Knoepfe bis zum letzten
         Klick, und die II. Hand entscheidet dieselbe Frage noch einmal.
         Dazu das Antrittsgeld: die neue Hand ist dem Schreiber unbekannt,
         ihre Feder ist bis zum naechsten Michaeli teurer — die Zahl auf der
         Leiste wechselt also auch dann, wenn der Wuerfel Namen UND
         Eigenschaft der Vorgaengerin noch einmal zieht (Auflage 2).
         --------------------------------------------------------------- */
      Z.erbfaelle++;
      Z.letzteForm = Z.form;
      Z.form = null;
      Z.uebergeben = false;
      Z.antrittBis = jahr() + (D.ANTRITT_JAHRE === undefined ? 1 : D.ANTRITT_JAHRE);
      stelleStunde(amt(), jahr() + (D.STUNDE_ABSTAND === undefined ? 1 : D.STUNDE_ABSTAND));
      if (Z.haende.length) Z.haende[Z.haende.length - 1].form =
        (ep().formen[Z.letzteForm] ? ep().formen[Z.letzteForm].kurz : 'DIE STUNDE');
      Z.haende.push({ nr: amt().nr, name: amt().name, eigenschaft: amt().eigenschaft,
        eigenschaftName: amt().eigenschaftName, feder: federDauernd(), form: null });
      Z.vorherFrisch = false;
    },

    epoche: function () { B.sende('zeichne', { grund: 'erbe-epoche' }); }
  });

  /* Der Kritiker soll nachzaehlen koennen, ohne Quelltext zu lesen. */
  B.erbe = {
    stand: function () {
      return {
        stundeJahr: Z.stundeJahr, stundeWoche: Z.stundeWoche,
        wochenBisStunde: wochenBisStunde(),
        uebergeben: Z.uebergeben, erbfaelle: Z.erbfaelle,
        form: Z.form, letzteForm: Z.letzteForm,
        leibgedinge: Z.leibgedinge.slice(), leibgedingLast: leibgedingLast(),
        amHaus: amHausListe().map(function (a) { return a.name + ' · ' + a.bindung.womit; }),
        anDerPerson: personListe().map(function (a) { return a.name + ' · ' + a.bindung.womit; }),
        gefallen: Z.gefallen.slice(), geschrieben: Z.geschrieben.slice(),
        erloschen: Z.erloschen.slice(), erloschenSumme: erloschenSumme(),
        widerspruchOffen: widerspruchListe().length, widersprochen: Z.widersprochen,
        vorher: Z.vorher, nachher: Z.nachher,
        keller: B.welt.vorrat.faesser.length, erbteilFass: Z.erbteilFass,
        nachschriftOffen: offeneNachschrift().length,
        nachgeschrieben: Z.nachgeschrieben,
        alt: Z.alt, neu: Z.neu, haende: Z.haende.slice(),
        startKasse: Z.startKasse, eich: Z.eich, eichRoh: Z.eichRoh,
        erbmasse: erbmasse(), gebuehr: gebuehr(), leibgedingPreis: leibgedingPreis(),
        abfindungPreis: abfindungPreis(),
        eigenschaft: amt().eigenschaft, faktor: eig().faktor,
        feder: feder(), federDauernd: federDauernd(),
        imAntritt: imAntritt(), fuenfterZug: eig().zug,
        taten: taten().map(function (t) { return t.zug + ' ' + t.preis + (t.aus ? ' (aus)' : ''); }),
        borg: Z.borg.slice(), angefochten: Z.angefochten, seelgeraet: Z.seelgeraet
      };
    }
  };

})(BRAUHAUS);
