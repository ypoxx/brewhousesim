/* ===========================================================================
   stuecke/gegner.js — DER GEGNER.  Die Zuege, die ohne den Spieler geschahen.

   DAS HAUS GEGENUEBER
   Der Adler ist keine Zahl in einer Tabelle. Er hat eine Kasse, einen Hof, auf
   dem etwas steht, Erben mit Namen und Wesen, Adressen, die ihm gehoeren — und
   er kann selber fallen. Ab 1914 kommt die Nordstern-Gruppe dazu: sie braut
   nicht, sie kauft.

   ER HANDELT ZWISCHEN DEN BILDSCHIRMEN
   Jeder Klick auf WEITER kann einen Zug des Gegners ausloesen. Der Zug wird
   nicht angekuendigt und nicht bestaetigt; er steht danach im Bild. Die ersten
   zehn Zuege sind ein Rundgang durch sein ganzes Repertoire — werben, bauen,
   fahren, entreissen, den Preis rufen, eine Adresse verlieren, Macht nehmen —
   damit man in zwanzig Minuten sieht, was er kann, und nicht bloss zufaellig
   dreimal dasselbe.

   DIE WAEHRUNG DER BINDUNG WECHSELT
     I   Recht und Gunst   Konzession · Bannmeile · Ratsspruch · Gevatterschaft
     II  Zunft und Pacht   Zunftbrief · Pacht · Heirat · Buergermeisteramt
     III Der Vertrag       Bierlieferungsvertrag mit Darlehen und Abloesesumme
     IV  Die Listung       Listungsgebuehr · Konditionen · Auslistung
   Wer eine Adresse will, loest die fremde Bindung in der Waehrung DIESER
   Epoche ab. Die Summe steht am Schild, am Giebel des Wirtshauses, im Bild.

   WAS HIER NIE PASSIERT
   Der Gegner kuendigt nichts an, um dann nichts zu tun. Jeder Eintrag in der
   Liste "OHNE DICH GESCHEHEN" hat einen Ort, und an dem Ort hat sich etwas
   veraendert, das man sehen kann.

   BESITZSTAND: stuecke/gegner*.js · stil/gegner*.css · bild/gegner/**
   =========================================================================== */

(function (B) {
  'use strict';

  var D = window.GEGNER_DATEN;
  var BILD = 'bild/gegner/';

  /* Alle Mittel aller Epochen, damit eine Bindung einen Epochenwechsel
     ueberlebt: ein Zunftbrief von 1795 laeuft 1802 noch weiter. */
  var MITTEL = {};
  (function () {
    for (var e in D.epochen) {
      if (!Object.prototype.hasOwnProperty.call(D.epochen, e)) continue;
      D.epochen[e].mittel.forEach(function (m) { MITTEL[m.k] = m; });
    }
  }());

  /* ----------------------------------------------------------------------
     ZUSTAND DES STUECKS
     ---------------------------------------------------------------------- */
  var Z = {
    epoche: 0,
    takt: 0,                 /* fortlaufende Wochenzahl                     */
    haeuser: {},             /* schluessel -> das Haus gegenueber           */
    bindung: {},             /* adr -> {wer, mittel, seit, bis, grund, zusatz} */
    werbung: {},             /* adr -> {wer, mittel, seit, bis, preis}      */
    absicht: {},             /* adr -> {wer, mittel, seit, bis, preis, text} */
    hinhalt: {},             /* adr -> Jahr, in dem hingehalten wurde       */
    schutz: {},              /* adr -> Jahr, bis zu dem er nicht ran darf   */
    wagen: null,             /* {wer, von, nach, seit, dauer, text}         */
    zuege: [],               /* alle sichtbaren Zuege, neueste zuerst       */
    zaehler: 0,
    wechsel: {},             /* adr -> {takt, an, von} — frisch gewechselt  */
    offen: false,
    seite: 'adler',
    zeigt: null,             /* Ort, auf den der Zeigefinger deutet         */
    wahl: null,
    meldung: null,
    wirkung: {},             /* dauerhafte Folgen der eigenen Festlegungen  */
    gegenzugGetan: {},       /* amtszeit-Nr -> true                         */
    angebot: null,           /* IV: das Angebot der Gruppe                  */
    gebot: null,             /* IV: die Versteigerung beim Notar            */
    gebotSperre: 0,          /* bis zu diesem Takt kein neuer Notartermin    */
    gebotAusgang: null,      /* was beim letzten Notartermin herauskam      */
    umkaempft: null,         /* der billigste umkaempfte Zug, fuer die Kennzahl */
    abschlag: 0,             /* was der Abschlag im laufenden Jahr kostet   */
    abschlagJe: {},
    abschlagJahr: 0,
    umsatzJahr: 0,           /* Einnahmen des Hauses im laufenden Braujahr  */
    abschlagVorjahr: 0,
    abschlagJeVorjahr: {},
    beschwerdeJahr: 0,       /* in welchem Jahr zuletzt geklagt wurde       */
    beschwerdeAusgang: null,
    zorn: 0,                 /* Wochen, in denen er sicher und gegen DICH zieht */
    wocheZuege: 0,           /* was seit dem letzten WEITER geschehen ist   */
    wagenTakt: -99,
    bereit: false
  };

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */
  function jahr() { return B.welt.zeit.jahr; }
  function woche() { return B.welt.zeit.woche; }
  function epNr() { return B.welt.zeit.epoche; }
  function ep() { return D.epochen[epNr()] || D.epochen[1]; }
  function takt() { return jahr() * B.uhr.WOCHEN_IM_JAHR + woche(); }

  function stamm(k) { return D.haeuser[k] || D.haeuser.adler; }

  function haus(k) { return Z.haeuser[k]; }

  function haeuserJetzt() {
    return B.welt.gegnerJetzt().map(function (g) { return Z.haeuser[g.schluessel]; })
      .filter(function (h) { return !!h && !h.weg; });
  }

  function weltGegner(k) {
    var l = B.welt.gegner;
    for (var i = 0; i < l.length; i++) if (l[i].schluessel === k) return l[i];
    return null;
  }

  function nameVon(h) {
    var g = weltGegner(h.k);
    return g ? B.welt.gegnerName(g) : stamm(h.k).kurz;
  }

  function sitzVon(h) {
    var s = stamm(h.k).sitz;
    return s[epNr()] || s[4] || s[1];
  }

  /* ----------------------------------------------------------------------
     WELLE 11 — DIE RANDWACHE DES STUECKS
     ----------------------------------------------------------------------
     Der Rahmen hat in Welle 10 gemessen und benannt, was er selbst nicht
     verruecken darf, ohne in fremdes DOM zu schreiben:

       gegner .gg-ziel gg-konzern zuteuer  —  312x52 @2458,202
       „verhandelt · noch 6 Wo. · zuvorkommen …"

     Das sind 18 px ueber die 2752 hinaus; im Bild stand nur noch „Wo".
     Nachgestellt am Vorzustand 7896ee6, 1970, 34 Baurunden + Escape:
     `BRAUHAUS.haushalt.ueberRand()` meldet genau diesen einen Eintrag.

     Ein Zeichen haengt an einer Adresse und kann den Ort nicht wechseln —
     die Ortstreue ueber 620 Jahre ist die haerteste Forderung des Auftrags.
     Also haelt es sich SELBST am Rand: der Ort bleibt, wo er ist, nur das
     Zeichen rueckt so weit nach innen, dass es ganz im Bild steht.

     Gerechnet wird OHNE DOM-Abfrage. Die Hoechstbreite jedes Zeichens steht
     im Stil (`max-width`), also ist die halbe Hoechstbreite in Prozent
     bekannt, ohne ein einziges getBoundingClientRect. Der Grund steht im
     ARBEITSSTAND des Rahmens: wer beim Zeichnen ein Layout erzwingt,
     verschiebt die Phase gegen die Fristen der STADT — und dann laeuft
     dieselbe Saat zweimal verschieden. Ein Zeichen, das sich am Rand haelt,
     darf die Partie nicht kosten.

     Anker ist immer 'oben' oder 'unten', also translate(-50%): der Ort ist
     die MITTE des Zeichens.                                              */
  function amRand(x, breiteS) {
    var halb = (breiteS / 2) / 2752 * 100;
    if (x - halb < 0.5) x = 0.5 + halb;
    if (x + halb > 99.5) x = 99.5 - halb;
    return x;
  }

  /* dx, das ein Zeichen der Hoechstbreite `breiteS` ganz im Bild haelt. */
  function randDx(ort, dxWunsch, breiteS) {
    var o = B.orte.hole(ort);
    if (!o) return dxWunsch || 0;
    var x = o.x + (dxWunsch || 0);
    return B.rund(amRand(x, breiteS) - o.x, 3);
  }

  /* Die Hoechstbreiten stehen hier UND im Stil. Wer eine aendert, aendert
     beide — deshalb stehen sie beieinander und nicht verstreut.
     stil/gegner.css: .gg-stand{max-width} · .gg-paar{max-width}
     stil/gegner-zusatz.css: .gg-gzblock{max-width} */
  var BREIT = { stand: 400, paar: 250, block: 420, spur: 230 };

  /* Jahresmenge einer Adresse in Fass — dieselbe Rechnung wie bei der Fuhre,
     damit die Summen zueinander passen. */
  function menge(a) {
    return Math.max(1, Math.round(a.bedarf * ep().mengenfaktor));
  }

  function bierpreis() {
    var e = epNr();
    var t = (window.PREIS_DATEN && PREIS_DATEN.epochen && PREIS_DATEN.epochen[e])
      ? PREIS_DATEN.epochen[e].mitte : null;
    return t || [9, 26, 48, 130][e - 1];
  }

  function preisJeFass() {
    return bierpreis() * (jahr() >= 1872 ? (B.welt.LITER_JE_FASS / 100) : 1);
  }

  /* Fuer die Anzeige: derselbe Betrag in der Einheit, die gerade gilt. */
  function jeEinheit(betragJeFass) {
    return betragJeFass / (jahr() >= 1872 ? (B.welt.LITER_JE_FASS / 100) : 1);
  }

  function mittelVon(k) { return MITTEL[k] || ep().mittel[0]; }

  /* Die Zugart steht in der Rolle als Wort auf dem Bildschirm. Die Schluessel
     bleiben ASCII (sie stehen in data-zug und in Fallunterscheidungen), das
     Wort daneben ist Deutsch mit Umlauten. */
  var ARTNAME = {
    werben: 'wirbt', binden: 'bindet', entreissen: 'entreißt', aufstocken: 'stockt auf',
    bauen: 'baut', preis: 'unterbietet', fuhre: 'fährt', rohstoff: 'kauft weg',
    macht: 'nimmt Macht', verlieren: 'verliert', unglueck: 'Unglück',
    uebernahme: 'Übernahme', angebot: 'Angebot', erbe: 'Erbfall', not: 'Not',
    ende: 'Ende', schluckt: 'schluckt'
  };
  function artName(a) { return ARTNAME[a] || a; }

  function adresse(k) { return B.welt.adresse(k); }

  function offeneAdressen() {
    return B.welt.adressenJetzt().filter(function (a) { return B.orte.hole(a.ort); });
  }

  function sichtbar(a) { return D.sichtbar.indexOf(a.ort) >= 0; }

  /* ----------------------------------------------------------------------
     DIE SUMMEN.  Was eine Bindung wert ist und was sie kostet.
     ---------------------------------------------------------------------- */

  /* Grundwert: was das Mittel bei dieser Adresse kostet. */
  function grundwert(a, m) {
    return Math.max(1, Math.round(menge(a) * m.satz));
  }

  /* Die Abloesesumme einer laufenden fremden Bindung.
     null heisst: in dieser Waehrung nicht abloesbar. */
  function abloese(k) {
    var b = Z.bindung[k];
    if (!b) return null;
    var m = mittelVon(b.mittel);
    var h = haus(b.wer);
    /* Ratsspruch und Amtsgewalt sind nicht kaeuflich, solange er das Amt hat.
       Faellt das Amt weg, wird auch daraus eine Summe. */
    if (m.fest && h && (h.marken.ratssitz || h.marken.buergermeister)) return null;
    var summe = b.grund + (b.zusatz || 0);
    var e = ep();
    if (e.tilgung) {
      /* III: das Darlehen tilgt sich. Die Restschuld sinkt Jahr um Jahr. */
      var jahre = Math.max(0, jahr() - b.seit);
      summe = summe * Math.pow(1 - e.tilgung, jahre);
      summe = summe * (1 + (e.aufschlag || 0));
    }
    if (Z.wirkung.zunftlade && b.mittel === 'zunftbrief') summe = summe * 0.5;
    if (Z.wirkung.bank) summe = summe * (2 / 3);
    if (Z.wirkung.marke) summe = summe * (2 / 3);
    if (b.nachlass) summe = summe * (1 - b.nachlass);
    return Math.max(1, Math.round(summe));
  }

  /* Zuvorkommen, solange er erst wirbt: nicht einmal die Haelfte. */
  function werbepreis(a, m) {
    var p = Math.round(grundwert(a, m) * 0.45);
    if (Z.wirkung.bank) p = Math.round(p * (2 / 3));
    if (Z.wirkung.marke) p = Math.round(p * (2 / 3));
    return Math.max(1, p);
  }

  /* Zuvorkommen, solange er erst zielt: teurer als beim blossen Werben, weil
     der Wirt schon halb bei ihm sitzt — aber immer noch billiger, als es
     nachher abzuloesen. Wer frueh antwortet, zahlt weniger. Das ist die
     ganze Ordnung dieses Stuecks in einer Zahl. */
  function abwehrpreis(a, m) {
    var p = Math.round(grundwert(a, m) * 0.62);
    if (Z.wirkung.bank) p = Math.round(p * (2 / 3));
    if (Z.wirkung.marke) p = Math.round(p * (2 / 3));
    return Math.max(1, p);
  }

  /* Wie das Bild einen Zug nennt. Vier Epochen, vier Listen — was 1350 der
     Rat zuspricht, wird 1970 eingelistet. Der Rueckfall gilt nur fuer Arten,
     die eine Epoche gar nicht kennt. */
  var VERB_ROH = {
    werben: 'wirbt', binden: 'bindet', zielen: 'sieht sich um', entreissen: 'nimmt',
    aufstocken: 'legt zu', bauen: 'baut', preis: 'ruft aus', fuhre: 'fährt',
    rohstoff: 'kauft weg', macht: 'nimmt Sitz', verlieren: 'verliert',
    unglueck: 'Unglück', not: 'ist klamm', uebernahme: 'übernimmt',
    angebot: 'bietet an', laesstAb: 'lässt ab'
  };
  function verbFuer(art, mittelK) {
    /* Das Mittel ist genauer als die Epoche: "steht Gevatter" ist wahr,
       "der Rat spricht zu" waere es an dieser Stelle nicht. */
    if (mittelK && D.verbenMittel && D.verbenMittel[mittelK]
        && (art === 'binden' || art === 'entreissen' || art === 'zielen'
            || art === 'aufstocken')) {
      return D.verbenMittel[mittelK];
    }
    var v = ep().verben || {};
    return v[art] || VERB_ROH[art] || art;
  }

  /* Was das Hinhalten kostet: kein Geld, sondern Bier. Ein Fass kann auf den
     Karren oder zum Wirt — beides geht nicht, und genau das ist die Wahl. */
  function hinhaltFass() {
    var hh = ep().hinhalten;
    return hh ? (hh.fass || 1) : 1;
  }
  function fassImKeller() {
    return (B.welt.vorrat && B.welt.vorrat.faesser) ? B.welt.vorrat.faesser.length : 0;
  }
  /* Einmal im Braujahr je Adresse — sonst waere es kein Zug, sondern ein Hahn. */
  function hinhaltMoeglich(k) {
    if (!ep().hinhalten) return false;
    if (Z.hinhalt[k] === jahr()) return false;
    return !!(Z.werbung[k] || Z.absicht[k] || Z.bindung[k]);
  }

  /* Was der Abschlag kostet: solange er die Adresse haelt, druckt er den
     Preis, den das Haus dort noch bekommt. Je Fass, das das Haus liefert.
     Steht sein Preis unter dem Satz des Rats, druckt er staerker — das ist
     die Stelle, an der ein unterbotener Preis wirklich wehtut und nicht bloss
     eine Meldung ist. */
  function abschlagJeFass(k) {
    var b = Z.bindung[k];
    if (!b) return 0;
    /* Wer dem Wirt ein Fass hingestellt hat, wird in diesem Braujahr dort
       nicht mehr gedrueckt. Der Zug kostet Bier und bringt Geld — die einzige
       Antwort auf den Adler, die auch bei leerer Kasse geht. */
    if (Z.hinhalt[k] === jahr()) return 0;
    var m = mittelVon(b.mittel);
    return preisJeFass() * (m.abschlag || 0.15) * preisdruck();
  }

  /* 1,0 = er haelt den Satz. Bis 1,5 = er unterbietet ihn um ein Drittel. */
  function preisdruck() {
    var h = haus('adler');
    if (!h || h.weg) return 1;
    var satz = bierpreis();
    if (!satz || h.preis >= satz) return 1;
    return B.grenze(1 + (satz - h.preis) / satz, 1, 1.5);
  }

  /* ----------------------------------------------------------------------
     DER VORSPRUNG.  Technik, die er frueher hat als das Haus.
     Jeder seiner Bauten nennt einen 'spiegel' — den gleichwertigen Aufbau im
     eigenen Hof. Was er hat und das Haus nicht, kuerzt seine Werbung um je
     eine Woche. Die Liste steht im Blatt, die Folge steht darunter.
     ---------------------------------------------------------------------- */
  function bauNach(k) {
    var l = ep().bauten, i;
    for (i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  /* 'hat' | 'offen' | 'fehlt' — und die Wahrheit steht in DIE STADT, nicht hier. */
  function eigenerStand(spiegel) {
    if (!spiegel || !B.stadt) return 'fehlt';
    try {
      if (B.stadt.hat(spiegel)) return 'hat';
      if (B.stadt.offen().indexOf(spiegel) >= 0) return 'offen';
    } catch (e) { return 'fehlt'; }
    return 'fehlt';
  }

  function vorsprungListe(h) {
    var l = [];
    (h.bauten || []).forEach(function (bk) {
      var b = bauNach(bk);
      if (!b) return;
      l.push({ bau: b, stand: eigenerStand(b.spiegel) });
    });
    return l;
  }

  function vorsprung(h) {
    var n = 0;
    vorsprungListe(h).forEach(function (x) { if (x.stand !== 'hat') n += 1; });
    return Math.min(n, D.vorsprungKappe || 3);
  }

  /* ----------------------------------------------------------------------
     AUFBAU
     ---------------------------------------------------------------------- */
  function neuesWesen() { return B.wuerfel.aus(D.wesen); }

  function neuerErbe(h, erste) {
    var s = stamm(h.k);
    var vorn = s.vornamen[epNr()] || s.vornamen[4] || s.vornamen[1];
    var w = neuesWesen();
    var alt = h.erbe;
    h.erbe = {
      nr: alt ? alt.nr + 1 : 1,
      name: (s.titel[epNr()] || '') + B.wuerfel.aus(vorn) + ' ' + s.familie,
      wesen: w.k, wesenName: w.name, sagt: w.sagt,
      seit: jahr(), bis: jahr() + B.wuerfel.ganz(22, 36)
    };
    if (!erste) {
      merkeZug(h, 'erbe',
        h.erbe.name + ' übernimmt ' + nameVon(h) + '. Man sagt: ' + w.sagt,
        sitzVon(h).ort, null);
      B.welt.schreibe('Gegenüber übernimmt ' + h.erbe.name + ' — ' + w.sagt, 'gegner');
    }
    return h.erbe;
  }

  function bauePartei(g) {
    var s = stamm(g.schluessel);
    var h = {
      k: g.schluessel,
      kasse: s.kasse[epNr()] || s.kasse[4] || s.kasse[1] || 200,
      preis: bierpreis(),
      bauten: [],
      marken: {},
      erbe: null,
      zuege: 0,
      letzterZug: -9,
      stufe: 0,
      not: 0,
      marken_zahl: 0,
      brauereien: 0,
      weg: false
    };
    Z.haeuser[g.schluessel] = h;
    neuerErbe(h, true);
    /* Der Adler faengt nicht bei null an: zwei Bauten stehen schon auf dem Hof.
       Die Gruppe baut nichts — sie kauft. */
    if (h.k === 'adler') {
      var b = ep().bauten;
      for (var i = 0; i < 2 && i < b.length; i++) h.bauten.push(b[i].k);
    }
    g.kasse = h.kasse;
    return h;
  }

  /* Die Ausgangslage aus welt.js hat Bindungen mit "Gewohnheit". Was der
     Gegner haelt, bekommt sofort ein richtiges Mittel dieser Epoche —
     damit vom ersten Bildschirm an eine Summe am Schild steht. */
  function uebernehmeAusgangslage() {
    var frei = ep().mittel.filter(function (m) { return !m.fest; });
    /* Nur Haeuser, die es in DIESER Epoche gibt. Ein Bahnhofswirt, den man
       1350 gebunden haette, stuende in keinem Bild und in keiner Rechnung. */
    B.welt.adressenJetzt().forEach(function (a) {
      if (!a.bindung) return;
      if (a.bindung.wem === 'haus') return;
      var h = Z.haeuser[a.bindung.wem];
      if (!h) { return; }
      var m = B.wuerfel.aus(frei);
      Z.bindung[a.schluessel] = {
        wer: h.k, mittel: m.k, seit: jahr() - B.wuerfel.ganz(0, 2),
        bis: jahr() + B.wuerfel.ganz(1, m.jahre), grund: grundwert(a, m), zusatz: 0
      };
      a.bindung.womit = m.womit;
      a.bindung.bis = Z.bindung[a.schluessel].bis;
    });
  }

  /* ----------------------------------------------------------------------
     DIE ZUGMASCHINE
     ---------------------------------------------------------------------- */

  function merkeZug(h, art, text, ort, adr, mittelK) {
    Z.zaehler += 1;
    h.zuege += 1;
    var g = weltGegner(h.k);
    if (g) { g.zuege = h.zuege; g.kasse = Math.round(h.kasse); }
    var e = {
      nr: Z.zaehler, jahr: jahr(), woche: woche(), takt: takt(),
      wer: h.k, werName: nameVon(h), art: art, text: text,
      ort: ort || sitzVon(h).ort, adr: adr || null, mittel: mittelK || null
    };
    Z.zuege.unshift(e);
    if (Z.zuege.length > 140) Z.zuege.length = 140;
    B.welt.protokolliere({ wer: 'gegner', was: text, preis: 0, adresse: adr || null });
    B.ton.spiele('gegner:' + art, { ort: e.ort });
    return e;
  }

  /* Ziel suchen. Was im Bild steht, ist ihm lieber — was er tut, soll man
     sehen koennen. */
  function suche(pruef) {
    var l = offeneAdressen().filter(pruef);
    if (!l.length) return null;
    var gewichtet = [];
    l.forEach(function (a) {
      var n = sichtbar(a) ? 3 : 1;
      for (var i = 0; i < n; i++) gewichtet.push(a);
    });
    return B.wuerfel.aus(gewichtet);
  }

  function freiFuerIhn(h) {
    return function (a) {
      if (Z.werbung[a.schluessel]) return false;
      if (Z.schutz[a.schluessel] && Z.schutz[a.schluessel] > jahr()) return false;
      if (a.bindung && a.bindung.wem === h.k) return false;
      return true;
    };
  }

  /* Wieviele Adressen darf er halten? Nie die ganze Stadt: sonst ist die
     Partie nach zwanzig Wochen entschieden und danach nur noch zaeh. Wer voll
     ist, muss eine fahrenlassen, um eine neue zu nehmen — und dann sieht man
     ZWEI Zeichen wechseln statt einem. */
  function hoechstzahl(h) {
    var n = offeneAdressen().length;
    /* RUNDE 3: seit machePlatz() wirklich freigibt, greifen diese Zahlen zum
       ersten Mal. Vorher war 0,4 folgenlos und der Adler hielt 8 von 10; jetzt
       ist die Grenze die Grenze, und sie liegt bei der knappen Haelfte — das
       ist es, was hier immer stehen sollte. */
    var anteil = [0.5, 0.5, 0.45, 0.3][epNr() - 1] || 0.35;
    return Math.max(2, Math.round(n * anteil));
  }

  /* Und alle Gegner zusammen halten nie mehr als knapp die Haelfte der Stadt.
     Wer darueber will, muss zuerst etwas fahrenlassen. */
  function gesamtgrenze() {
    /* Ab 1914 sind es zwei Parteien; steht die Grenze zu eng, nimmt jeder Zug
       dem anderen etwas weg und die halbe Stadt wechselt woechentlich. */
    var anteil = haeuserJetzt().length > 1 ? 0.52 : 0.45;
    return Math.max(3, Math.round(offeneAdressen().length * anteil));
  }

  function fremdGesamt() {
    return offeneAdressen().filter(function (a) {
      return a.bindung && a.bindung.wem && a.bindung.wem !== 'haus';
    }).length;
  }

  /* Gibt die schwaechste seiner Bindungen frei und nennt sie. */
  function machePlatz(h, ausser) {
    var l = seine(h).filter(function (a) { return a.schluessel !== ausser; });
    if (!l.length) return null;
    l.sort(function (x, y) {
      return (Z.bindung[x.schluessel] ? Z.bindung[x.schluessel].grund : 0)
           - (Z.bindung[y.schluessel] ? Z.bindung[y.schluessel].grund : 0);
    });
    var a = l[0];
    /* FUNFTES ARGUMENT.  kern/welt.js:342 gibt eine Bindung nur frei, wenn
       der Aufrufer sagt, WESSEN Bindung er loest — sonst gibt binde() still
       false zurueck und die Adresse bleibt haengen. Ohne dieses Argument hat
       machePlatz() bis Runde 2 nie etwas freigegeben: Z.bindung wurde
       geloescht, a.bindung nicht, und damit lief die Obergrenze dieses
       Stuecks ins Leere. Gemessen in 1970 nach 70 Wochen: die Gruppe hielt 8
       von 11 Adressen bei einer Hoechstzahl von 3 und einer Gesamtgrenze von
       6, und fuenf davon standen in der Welt als ihre, im Stueck als nichts. */
    B.welt.binde(a.schluessel, null, null, 0, h.k);
    delete Z.bindung[a.schluessel];
    Z.wechsel[a.schluessel] = { takt: takt(), an: null, von: h.k };
    return a;
  }

  function seine(h) {
    return offeneAdressen().filter(function (a) {
      return a.bindung && a.bindung.wem === h.k;
    });
  }

  function fremde(h) {
    /* Was er entreissen kann: was dem Haus gehoert oder dem anderen Gegner. */
    return function (a) {
      if (!a.bindung) return false;
      if (a.bindung.wem === h.k) return false;
      if (Z.schutz[a.schluessel] && Z.schutz[a.schluessel] > jahr()) return false;
      if (Z.wirkung.ratsstuhl && epNr() === 1) return false;  /* der eigene Ratsstuhl sperrt ihn */
      if (Z.wirkung.zunftlade && epNr() === 2) return false;  /* die eigene Zunftlade auch */
      return true;
    };
  }

  /* ---- die einzelnen Zuege -------------------------------------------- */

  function zugWerben(h) {
    /* Wer schon so viel haelt, wie er halten kann, wirbt nicht weiter — sonst
       tauscht er jede Woche und das Bild flackert, statt zu druecken. */
    if (seine(h).length >= hoechstzahl(h) || fremdGesamt() >= gesamtgrenze()) return false;
    var laufend = 0;
    Object.keys(Z.werbung).forEach(function (k) { if (Z.werbung[k].wer === h.k) laufend++; });
    if (laufend >= 2) return false;
    var a = suche(freiFuerIhn(h));
    if (!a) return false;
    var frei = ep().mittel.filter(function (m) { return !m.fest; });
    var m = B.wuerfel.aus(frei);
    var w = ep().wochenWerbung;
    /* Was er frueher hat als das Haus, macht ihn schneller. Je Ding eine
       Woche weniger — bis auf eine Woche herunter, nie auf null. */
    var vor = vorsprung(h);
    /* Nie unter zwei Wochen: sonst ist die Bindung da, ehe der Spieler den
       Wimpel ueberhaupt gesehen hat, und "Zuvorkommen" waere ein Knopf, den
       niemand je druecken kann. */
    var dauer = Math.max(2, B.wuerfel.ganz(w[0], w[1]) - vor);
    Z.werbung[a.schluessel] = {
      wer: h.k, mittel: m.k, seit: takt(), vorsprung: vor,
      bis: takt() + dauer,
      preis: werbepreis(a, m)
    };
    merkeZug(h, 'werben',
      nameVon(h) + ' wirbt um ' + a.name + ': ' + ep().werbesatz
      + ' Zuvorkommen kostet ' + B.welt.geld(Z.werbung[a.schluessel].preis) + '.'
      + (vor ? ' Er braucht ' + vor + (vor === 1 ? ' Woche' : ' Wochen')
             + ' weniger als sonst — er hat, was das Haus nicht hat.' : ''),
      a.ort, a.schluessel);
    return true;
  }

  /* Aus der Werbung wird die Bindung — ohne Klick, ohne Rueckfrage. */
  function loeseWerbungEin(k) {
    var w = Z.werbung[k];
    var a = adresse(k);
    delete Z.werbung[k];
    if (!a || !w) return;
    var h = haus(w.wer);
    if (!h || h.weg) return;
    var m = mittelVon(w.mittel);
    binde(h, a, m, m.bindet.replace('{haus}', a.name)
      .replace('{geld}', B.welt.geld(grundwert(a, m))));
  }

  function binde(h, a, m, text) {
    var vorher = a.bindung ? a.bindung.wem : null;
    var g = grundwert(a, m);
    if (seine(h).length >= hoechstzahl(h) || fremdGesamt() >= gesamtgrenze()) {
      var weg = machePlatz(h, a.schluessel);
      if (!weg) {
        /* Er selbst hat nichts abzugeben — dann geht es dem anderen an den Kragen. */
        var andere = haeuserJetzt().filter(function (x) { return x.k !== h.k; });
        for (var i = 0; i < andere.length && !weg; i++) weg = machePlatz(andere[i], a.schluessel);
      }
      if (weg) text += ' Dafür wird ' + weg.name + ' fallengelassen — die Adresse ist frei.';
    }
    h.kasse -= Math.round(g * 0.18);
    B.welt.binde(a.schluessel, h.k, m.womit, jahr() + m.jahre);
    Z.bindung[a.schluessel] = {
      wer: h.k, mittel: m.k, seit: jahr(), bis: jahr() + m.jahre, grund: g, zusatz: 0
    };
    Z.wechsel[a.schluessel] = { takt: takt(), an: h.k, von: vorher };
    merkeZug(h, vorher === 'haus' ? 'entreissen' : 'binden', text, a.ort, a.schluessel, m.k);
    if (vorher === 'haus') {
      B.welt.schreibe(a.name + ' geht an ' + nameVon(h) + '. '
        + 'Gebunden mit ' + m.womit + ' bis ' + (jahr() + m.jahre)
        + '. Ablösen kostet ' + B.welt.geld(abloese(a.schluessel)) + '.', 'gegner');
    }
    return true;
  }

  /* ---- DIE ABSICHT ----------------------------------------------------
     RUNDE 2.  Bis hierher fiel ein Ratsspruch am Dienstag aus heiterem
     Himmel: eine Adresse des Hauses gehoerte in derselben Woche dem Adler,
     in der er sie sich nahm. Man konnte das nachlesen — zuvorkommen konnte
     man ihm nicht. Das war der halbe Gegner.

     Jetzt zielt er erst. Der Zug faellt in zwei Teilen: "Ein Feist sitzt
     beim Wirt" steht drei bis sechs Wochen im Bild, mit zwei Preisschildern
     daneben — Geld oder Bier —, und erst wenn beide unangetastet bleiben,
     wechselt das Zeichen am Giebel. Beide Teile sind Zuege, die ohne den
     Spieler geschehen; nur ist der erste jetzt eine Frage und nicht mehr
     eine Mitteilung.
     -------------------------------------------------------------------- */
  function zugEntreissen(h, zug) {
    /* Nicht jede Woche. Sonst wechseln in 1970 die Zeichen an den Giebeln so
       schnell, dass man dem Bild nicht mehr glaubt — und ein Wechsel, den man
       nicht glaubt, ist kein Zug, sondern Flackern. */
    if (Z.takt - (h.letzteEntreissung === undefined ? -99 : h.letzteEntreissung) < 5) return false;
    /* Er zielt auf eine Adresse zur Zeit. Zwei offene Absichten desselben
       Hauses wuerden das Bild zukleistern und die Antwort unbezahlbar machen. */
    var eigene = 0;
    Object.keys(Z.absicht).forEach(function (x) { if (Z.absicht[x].wer === h.k) eigene++; });
    if (eigene >= 1) return false;
    var pruef = fremde(h);
    /* Zuerst das Haus. Dem anderen Gegner nimmt er nur, wenn beim Haus
       nichts zu holen ist — sonst fressen sich die beiden gegenseitig auf
       und der Spieler sieht bloss zu. */
    var a = suche(function (x) {
      return pruef(x) && x.bindung.wem === 'haus' && !Z.absicht[x.schluessel];
    }) || suche(function (x) { return pruef(x) && !Z.absicht[x.schluessel]; });
    if (!a) return false;
    var m = mittelVon(zug.mittel || ep().mittel[0].k);
    /* Ratsspruch und Amtsgewalt sind die Ausnahme, nicht die Regel — sonst
       steht an der halben Stadt "nicht abloesbar", und das ist kein Spiel. */
    var fesse = 0;
    Object.keys(Z.bindung).forEach(function (x) {
      if (Z.bindung[x].wer === h.k && mittelVon(Z.bindung[x].mittel).fest) fesse++;
    });
    if (m.fest && (!h.marken.ratssitz && !h.marken.buergermeister
                   || fesse >= 1 || !B.wuerfel.trifft(0.5))) {
      m = mittelVon(B.wuerfel.aus(ep().mittel.filter(function (x) { return !x.fest; })).k);
    }
    var text = (zug.text || '{haus} geht an den Adler.').replace('{haus}', a.name);
    var ab = ep().absicht;
    if (!ab) { if (!binde(h, a, m, text)) return false; h.letzteEntreissung = Z.takt; return true; }

    /* Sein Vorsprung kuerzt auch das Zielen — wer die Technik frueher hat,
       ist frueher an der Tuer. Nie unter zwei Wochen: sonst waere die Antwort
       ein Knopf, den niemand je druecken kann. */
    var dauer = Math.max(2, B.wuerfel.ganz(ab.wochen[0], ab.wochen[1]) - vorsprung(h));
    Z.absicht[a.schluessel] = {
      wer: h.k, mittel: m.k, seit: takt(), bis: takt() + dauer,
      preis: abwehrpreis(a, m), folge: text
    };
    h.letzteEntreissung = Z.takt;
    merkeZug(h, 'zielen',
      ab.text.replace('{haus}', a.name)
      + ' In ' + dauer + (dauer === 1 ? ' Woche' : ' Wochen') + ' ist es unterschrieben, '
      + 'wenn niemand dazwischengeht. Zuvorkommen kostet '
      + B.welt.geld(Z.absicht[a.schluessel].preis) + '.',
      a.ort, a.schluessel, m.k);
    return true;
  }

  /* Die Absicht laeuft aus. Jetzt erst wechselt das Zeichen — oder er laesst
     ab, weil das Haus die Adresse inzwischen gebunden hat. Beides ist ein Zug,
     und beides steht im Bild. */
  function loeseAbsichtEin(k) {
    var s = Z.absicht[k], a = adresse(k);
    delete Z.absicht[k];
    if (!s || !a) return;
    var h = haus(s.wer);
    if (!h || h.weg) return;
    var m = mittelVon(s.mittel);
    /* Zwischenzeitlich geschuetzt oder schon seins — dann laesst er ab, und
       man sieht, dass die Antwort gewirkt hat. */
    if ((Z.schutz[k] && Z.schutz[k] > jahr())
        || (a.bindung && a.bindung.wem === s.wer)) {
      merkeZug(h, 'laesstab',
        nameVon(h) + ' lässt von ' + a.name + ' ab. Das Haus war schneller.',
        a.ort, k);
      return;
    }
    binde(h, a, m, s.folge);
  }

  function zugAufstocken(h, zug) {
    var l = seine(h).filter(function (a) { return Z.bindung[a.schluessel]; });
    if (!l.length) return false;
    var a = B.wuerfel.aus(l);
    var b = Z.bindung[a.schluessel];
    var mehr = Math.round(b.grund * (0.2 + B.wuerfel.zahl() * 0.25));
    b.zusatz = (b.zusatz || 0) + mehr;
    b.bis += 1;
    h.kasse -= Math.round(mehr * 0.6);
    Z.wechsel[a.schluessel] = { takt: takt(), an: h.k, von: h.k, mehr: mehr };
    merkeZug(h, 'aufstocken',
      (zug.text || '').replace('{haus}', a.name).replace('{geld}', B.welt.geld(mehr))
      + ' Ablösen kostet jetzt ' + B.welt.geld(abloese(a.schluessel)) + '.',
      a.ort, a.schluessel, b.mittel);
    return true;
  }

  function zugBauen(h) {
    var l = ep().bauten.filter(function (b) {
      if (b.abJahr && jahr() < b.abJahr) return false;
      return h.bauten.indexOf(b.k) < 0 && h.kasse >= b.preis;
    });
    if (!l.length) return false;
    var b = B.wuerfel.aus(l);
    h.kasse -= b.preis;
    h.bauten.push(b.k);
    merkeZug(h, 'bauen',
      nameVon(h) + ' baut auf dem eigenen Hof: ' + b.name + ' für ' + B.welt.geld(b.preis) + '.',
      sitzVon(h).ort, null);
    return true;
  }

  function zugPreis(h, zug) {
    var boden = Math.round(bierpreis() * 0.62);
    if (h.preis <= boden) return false;
    h.preis = Math.max(boden, h.preis - (zug.schritt || 1));
    merkeZug(h, 'preis',
      (zug.text || '').replace('{geld}', B.welt.geld(h.preis))
        .replace('{einheit}', B.welt.mengeEinheit()),
      sitzVon(h).ort, null);
    return true;
  }

  /* Der graue Wagen ist ein Bild, kein Schlag. Er darf nicht jede zweite
     Woche fahren, sonst besteht sein halbes Repertoire aus Fuhrwerk und der
     Kritiker zaehlt Meldungen statt Zuegen. Hoechstens alle sechs Wochen. */
  function zugFuhre(h, zug) {
    if (Z.takt - Z.wagenTakt < 6) return false;
    var l = seine(h);
    if (!l.length) l = offeneAdressen();
    if (!l.length) return false;
    var a = B.wuerfel.aus(l);
    Z.wagenTakt = Z.takt;
    Z.wagen = {
      wer: h.k, von: sitzVon(h).ort, nach: a.ort,
      seit: takt(), dauer: 5, text: a.name
    };
    merkeZug(h, 'fuhre', (zug.text || '').replace('{haus}', a.name), a.ort, a.schluessel);
    return true;
  }

  function zugRohstoff(h, zug) {
    /* Auch das ist ein Wagen auf der Strasse und faellt unter dieselbe Sperre. */
    if (Z.takt - Z.wagenTakt < 6) return false;
    var ort = B.orte.da(zug.ort) ? zug.ort : 'muehle';
    Z.wagenTakt = Z.takt;
    Z.wagen = { wer: h.k, von: ort, nach: sitzVon(h).ort, seit: takt(), dauer: 5, text: 'Rohstoff' };
    h.kasse -= Math.round(h.kasse * 0.02);
    merkeZug(h, 'rohstoff', zug.text, ort, null);
    return true;
  }

  function zugMacht(h, zug) {
    if (zug.abJahr && jahr() < zug.abJahr) return false;
    if (h.marken[zug.marke]) return false;
    h.marken[zug.marke] = { seit: jahr(), bis: jahr() + (zug.jahre || 10) };
    var ort = sitzVon(h).ort;
    var adr = null;
    if (zug.marke === 'emailschild' || zug.marke === 'fernsehen') {
      var l = seine(h);
      if (l.length) { adr = B.wuerfel.aus(l); ort = adr.ort; }
    }
    merkeZug(h, 'macht', zug.text.replace('{haus}', adr ? adr.name : ''),
      ort, adr ? adr.schluessel : null);
    B.welt.schreibe(nameVon(h) + ': ' + zug.text.replace('{haus}', adr ? adr.name : ''), 'gegner');
    return true;
  }

  function zugVerlieren(h, zug) {
    var l = seine(h);
    if (!l.length) return false;
    var a = B.wuerfel.aus(l);
    B.welt.binde(a.schluessel, null, null, 0, h.k);
    delete Z.bindung[a.schluessel];
    Z.wechsel[a.schluessel] = { takt: takt(), an: null, von: h.k };
    merkeZug(h, 'verlieren', (zug.text || '').replace('{haus}', a.name),
      a.ort, a.schluessel);
    B.welt.schreibe(a.name + ' ist wieder frei. ' + nameVon(h) + ' hat die Bindung verloren.', 'gegner');
    return true;
  }

  function zugUnglueck(h, zug) {
    var verlust = Math.round(h.kasse * (0.08 + B.wuerfel.zahl() * 0.14)) + 1;
    h.kasse -= verlust;
    var text = zug.text + ' Es kostet ihn ' + B.welt.geld(verlust) + '.';
    if (h.bauten.length > 2 && B.wuerfel.trifft(0.45)) {
      var k = h.bauten.pop();
      var name = k;
      ep().bauten.forEach(function (b) { if (b.k === k) name = b.name; });
      text += ' ' + name + ': weg vom Hof.';
    }
    merkeZug(h, 'unglueck', text, sitzVon(h).ort, null);
    return true;
  }

  /* Sie kauft eine Brauerei im Nachbartal. Bis Runde 2 war das eine Zeile
     und ein Zaehlerstand: elf geschluckte Betriebe in 99 Wochen, und auf dem
     Brett hat sich davon nichts bewegt — ein Zug ohne Ort, genau das, was
     dieses Stueck sich selbst verboten hat. Jetzt geht mit dem Betrieb der
     Ausschank IN DIESER STADT mit, und zwischen Handschlag und Notartermin
     liegen fuenf Wochen, in denen ein hoeheres Gebot zaehlt. */
  function zugUebernahme(h, zug) {
    var preis = Math.round(Math.abs(h.kasse) * 0.07) + 1;
    var g = ep().gebot;
    var ziel = (g && !Z.gebot && Z.takt >= Z.gebotSperre) ? suche(function (a) {
      if (a.bindung && a.bindung.wem === 'haus') return false;
      if (a.bindung && a.bindung.wem === h.k) return false;
      if (Z.werbung[a.schluessel] || Z.absicht[a.schluessel]) return false;
      if (Z.schutz[a.schluessel] && Z.schutz[a.schluessel] > jahr()) return false;
      return true;
    }) : null;
    h.kasse -= preis;
    if (!ziel) {
      /* Kein Ausschank in dieser Stadt, der mitginge — dann bleibt es eine
         Zahl auf ihrem Briefkopf, und sie bekommt ihn ohne Gegenrede. */
      h.brauereien += 1;
      merkeZug(h, 'uebernahme',
        zug.text + ' Sie zahlt ' + B.welt.geld(preis) + '. Es ist die '
        + h.brauereien + '. in dieser Gegend, und in dieser Stadt hängt kein Schild daran.',
        sitzVon(h).ort, null);
      B.welt.schreibe(zug.text, 'gegner');
      return true;
    }
    var wochen = g.wochen || 5;
    var m = mittelVon('jahresvereinbarung');
    Z.gebot = {
      wer: h.k, k: ziel.schluessel, name: B.wuerfel.aus(g.brauereien),
      gebot: Math.max(500, Math.round(grundwert(ziel, m) * 0.8)),
      seit: Z.takt, bis: Z.takt + wochen, ort: ziel.ort
    };
    merkeZug(h, 'uebernahme',
      zug.text.replace('eine kleine Brauerei im Nachbartal', Z.gebot.name)
      + ' Sie zahlt ' + B.welt.geld(preis) + ' für die Kessel. Mit ihnen geht der Ausschank '
      + 'in dieser Stadt: ' + ziel.name + '. Notartermin in ' + wochen + ' Wochen, bis dahin zählt das '
      + 'höhere Gebot.', ziel.ort, ziel.schluessel);
    B.welt.schreibe(Z.gebot.name + ' wird verkauft. Der Betrieb geht an die Nordstern-Gruppe; '
      + 'über den Ausschank in der Stadt — ' + ziel.name + ' — wird beim Notar entschieden. '
      + 'Ihr Gebot steht bei ' + B.welt.geld(Z.gebot.gebot) + '.', 'gegner');
    return true;
  }

  /* Der Notartermin. Wer nicht mitgeboten hat, sieht hier zu. */
  function loeseGebotEin() {
    var G = Z.gebot, g = ep().gebot;
    Z.gebot = null;
    Z.gebotSperre = Z.takt + 2 * ((g && g.wochen) || 5);
    if (!G) return;
    var h = haus(G.wer), a = adresse(G.k);
    if (!h || !a) return;
    h.brauereien += 1;
    var m = mittelVon('jahresvereinbarung');
    binde(h, a, m, (g && g.verpasst ? g.verpasst : 'Der Notartermin ist gehalten.')
      + ' ' + G.name + ' gehört der Gruppe, und der Ausschank in der Stadt — ' + a.name + ' — mit.');
    Z.gebotAusgang = { takt: Z.takt, wo: a.name, gelingt: false, still: true };
  }

  function zugAngebot(h, zug) {
    if (Z.angebot || Z.wirkung.anteil || Z.wirkung.abgelehnt) return false;
    var ab = ep().angebot || {};
    var wert = Math.max(50000, Math.round(B.welt.haus.kasse * 1.4
      + B.welt.adressenJetzt().filter(function (a) {
        return a.bindung && a.bindung.wem === 'haus';
      }).length * 90000));
    Z.angebot = { jahr: jahr(), summe: wert, wer: h.k,
                  seit: Z.takt, bis: Z.takt + (ab.wochen || 8) };
    merkeZug(h, 'angebot',
      zug.text + ' Sie bietet ' + B.welt.geld(wert) + ' für ein Viertel des Hauses. '
      + 'Sie erwartet die Antwort binnen ' + (ab.wochen || 8) + ' Wochen.',
      sitzVon(h).ort, null);
    B.welt.schreibe('Die Nordstern-Gruppe bietet ' + B.welt.geld(wert)
      + ' für ein Viertel des Hauses. Die Antwort wird nicht zurückgenommen — '
      + 'und keine Antwort ist auch eine.', 'gegner');
    return true;
  }

  /* Acht Wochen ohne Antwort sind keine Ablehnung, sondern ein Versaeumnis:
     sie zieht die Anfrage zurueck, nimmt sich stattdessen eine Adresse und
     fragt spaeter wieder. Die Wahl bleibt also im Spiel — der Preis fuers
     Wegsehen nicht. */
  function verfaelltAngebot() {
    var ab = ep().angebot || {};
    var h = haus(Z.angebot ? Z.angebot.wer : 'konzern') || haus('konzern');
    Z.angebot = null;
    if (!h || h.weg) return;
    var m = mittelVon('jahresvereinbarung');
    var ziel = suche(function (a) {
      return !(a.bindung && a.bindung.wem === h.k);
    });
    if (!ziel) return;
    binde(h, ziel, m, (ab.verfallen || 'Die Gruppe zieht die Anfrage zurück.')
      .replace('{haus}', ziel.name));
    B.welt.schreibe('Die Anfrage der Nordstern-Gruppe ist verfallen. Ungefragt genommen '
      + 'hat sie sich ' + ziel.name + '.', 'gegner');
  }

  /* Die Auswahl. Die ersten zehn Zuege folgen einer Pflichtliste — so sieht
     der Spieler das ganze Repertoire, und nicht dreimal dieselbe Meldung. */
  var PFLICHT = ['werben', 'bauen', 'fuhre', 'entreissen', 'preis',
                 'werben', 'macht', 'verlieren', 'aufstocken', 'entreissen'];

  function fuehreAus(h, zug) {
    switch (zug.art) {
      case 'werben':     return zugWerben(h);
      case 'entreissen': return zugEntreissen(h, zug);
      case 'aufstocken': return zugAufstocken(h, zug);
      case 'bauen':      return zugBauen(h);
      case 'preis':      return zugPreis(h, zug);
      case 'fuhre':      return zugFuhre(h, zug);
      case 'rohstoff':   return zugRohstoff(h, zug);
      case 'macht':      return zugMacht(h, zug);
      case 'verlieren':  return zugVerlieren(h, zug);
      case 'unglueck':   return zugUnglueck(h, zug);
      case 'uebernahme': return zugUebernahme(h, zug);
      case 'angebot':    return zugAngebot(h, zug);
    }
    return false;
  }

  function zugliste(h) {
    var e = ep();
    var l = (h.k === 'konzern' && e.konzernzuege) ? e.konzernzuege : e.zuege;
    return l.filter(function (z) {
      if (z.abJahr && jahr() < z.abJahr) return false;
      if (z.bisJahr && jahr() > z.bisJahr) return false;
      return true;
    });
  }

  function gewicht(h, zug) {
    var w = zug.gewicht || 10;
    var wes = null;
    D.wesen.forEach(function (x) { if (x.k === h.erbe.wesen) wes = x; });
    if (wes) {
      if (wes.mehr[zug.art]) w *= wes.mehr[zug.art];
      if (wes.weniger[zug.art]) w *= wes.weniger[zug.art];
    }
    /* Wer klamm ist, baut nicht und wirbt weniger. */
    if (h.stufe >= 1 && (zug.art === 'bauen' || zug.art === 'werben')) w *= 0.35;
    if (h.stufe >= 1 && zug.art === 'verlieren') w *= 2.5;
    return w;
  }

  function waehle(h, versuch) {
    var liste = zugliste(h);
    /* Pflichtliste zuerst — aber nur beim ersten Versuch und nur, was geht. */
    if (!versuch && h.k === 'adler' && h.zuege < PFLICHT.length) {
      var art = PFLICHT[h.zuege];
      var pf = liste.filter(function (z) { return z.art === art; });
      if (pf.length) return B.wuerfel.aus(pf);
    }
    var summe = 0, i;
    for (i = 0; i < liste.length; i++) summe += gewicht(h, liste[i]);
    var r = B.wuerfel.zahl() * summe;
    for (i = 0; i < liste.length; i++) {
      r -= gewicht(h, liste[i]);
      if (r <= 0) return liste[i];
    }
    return liste[0];
  }

  function zieht(h) {
    for (var versuch = 0; versuch < 6; versuch++) {
      var zug = waehle(h, versuch);
      if (fuehreAus(h, zug)) { h.letzterZug = Z.takt; return true; }
    }
    /* Wenn gar nichts geht, dann wenigstens der Wagen — aber der hat seine
       eigene Sperre und faehrt nicht jede Woche. */
    if (zugFuhre(h, { text: 'Ein grauer Wagen des Hauses gegenüber fährt zum {haus}.' })) {
      h.letzterZug = Z.takt;
      return true;
    }
    return false;
  }

  /* ----------------------------------------------------------------------
     DIE WOCHE — was ohne den Spieler geschieht
     ---------------------------------------------------------------------- */
  function wocheLaeuft() {
    Z.takt = takt();
    var vorher = Z.zaehler;
    Z.meldung = null;              /* eine Woche steht sie, dann ist sie gelesen */

    /* Werbungen, die auslaufen, werden zu Bindungen. Ohne Rueckfrage. */
    Object.keys(Z.werbung).forEach(function (k) {
      if (Z.werbung[k].bis <= Z.takt) loeseWerbungEin(k);
    });
    /* Absichten, die reif sind, werden zur Unterschrift — oder er laesst ab,
       weil das Haus ihm zuvorgekommen ist. */
    Object.keys(Z.absicht).forEach(function (k) {
      if (Z.absicht[k].bis <= Z.takt) loeseAbsichtEin(k);
    });
    /* Der Notartermin und die Frist der Gruppe laufen ab, ob man hinsieht
       oder nicht. Beides steht mit der Zahl der Wochen im Bild. */
    if (Z.gebot && Z.gebot.bis <= Z.takt) loeseGebotEin();
    if (Z.angebot && Z.angebot.bis && Z.angebot.bis <= Z.takt) verfaelltAngebot();

    haeuserJetzt().forEach(function (h) {
      var seit = Z.takt - h.letzterZug;
      /* Die ersten zehn Zuege kommen sicher: hoechstens zwei Wochen Pause.
         Danach entscheidet sein Wesen und seine Lage. */
      var muss = (h.k === 'adler' && h.zuege < PFLICHT.length && seit >= 2);
      /* Wer geklagt hat, bekommt Antwort: drei Wochen zieht er sicher. */
      if (Z.zorn > 0 && h.k === 'adler') muss = true;
      var g = weltGegner(h.k);
      var mut = g ? g.wagemut : 0.5;
      if (h.stufe >= 2) mut *= 0.5;
      if (muss || B.wuerfel.trifft(mut * (h.k === 'konzern' ? 0.7 : 1))) zieht(h);
    });
    if (Z.zorn > 0) Z.zorn -= 1;

    /* Der graue Wagen kommt an. */
    if (Z.wagen && Z.takt - Z.wagen.seit > Z.wagen.dauer) Z.wagen = null;

    /* Was seit dem letzten Klick auf WEITER geschehen ist — die Zahl, die der
       Kritiker sucht, steht danach oben im Band. */
    Z.wocheZuege = Z.zaehler - vorher;
  }

  /* ----------------------------------------------------------------------
     DAS JAHR — Abrechnung, Erbfall, Untergang
     ---------------------------------------------------------------------- */
  function jahrLaeuft() {
    /* 1. Der Abschlag wird nicht mehr am Jahresende gerechnet, sondern bei
       jeder einzelnen Lieferung abgezogen (siehe hoerePlatte weiter unten).
       Hier wird nur noch das Jahr umgeblättert. */
    Z.abschlagVorjahr = Z.abschlag;
    Z.abschlagJeVorjahr = Z.abschlagJe;
    Z.abschlagJahr = jahr();
    Z.abschlag = 0;
    Z.abschlagJe = {};
    Z.umsatzJahr = 0;

    var jetzt = jahr() - 1;
    var geliefert = {};
    B.protokoll.forEach(function (p) {
      if (p.adresse && p.menge && (p.jahr === jetzt || p.jahr === jahr())) {
        geliefert[p.adresse] = (geliefert[p.adresse] || 0) + p.menge;
      }
    });

    /* 2. Er verdient an dem, was das Haus dort NICHT liefert. */
    haeuserJetzt().forEach(function (h) {
      var ertrag = 0;
      seine(h).forEach(function (a) {
        var offen = Math.max(0, menge(a) - (geliefert[a.schluessel] || 0));
        ertrag += offen * (ep().ertragJeFass || 3) * (h.preis / Math.max(1, bierpreis()));
      });
      h.kasse += Math.round(ertrag);
      /* Der Preiskampf kostet ihn: was er unter dem Satz ausschenkt. */
      if (h.preis < bierpreis()) {
        var fass = 0;
        seine(h).forEach(function (a) { fass += menge(a); });
        h.kasse -= Math.round((bierpreis() - h.preis) * fass * 0.15);
      }
      /* Er erholt sich langsam vom Preiskampf. */
      if (B.wuerfel.trifft(0.35) && h.preis < bierpreis()) h.preis += 1;
    });

    /* 2b. Absichten auf Adressen, die es nicht mehr gibt, verfallen still;
       das Hinhalten gilt nur fuer ein Braujahr. */
    Object.keys(Z.absicht).forEach(function (k) { if (!adresse(k)) delete Z.absicht[k]; });
    Object.keys(Z.hinhalt).forEach(function (k) {
      if (Z.hinhalt[k] < jahr() - 1) delete Z.hinhalt[k];
    });

    /* 3. Bindungen, die auslaufen. */
    Object.keys(Z.bindung).forEach(function (k) {
      var b = Z.bindung[k];
      var a = adresse(k);
      if (!a) { delete Z.bindung[k]; return; }
      if (b.bis <= jahr() || !a.bindung || a.bindung.wem !== b.wer) {
        if (a.bindung && a.bindung.wem === b.wer) B.welt.binde(k, null, null, 0, b.wer);
        delete Z.bindung[k];
      }
    });

    /* 4. Erbfall und Untergang. */
    haeuserJetzt().forEach(function (h) {
      if (jahr() >= h.erbe.bis) neuerErbe(h, false);
      untergang(h);
    });

    /* 5. Schutzfristen laufen ab. */
    Object.keys(Z.schutz).forEach(function (k) {
      if (Z.schutz[k] <= jahr()) delete Z.schutz[k];
    });

    /* 6. Der Anteil der Gruppe will jedes Jahr bedient werden. */
    if (Z.wirkung.anteil) {
      var ab = Math.round(Math.max(0, B.welt.haus.kasse) * 0.05);
      if (ab > 0) B.welt.zahle(ab, 'Gewinnabführung an die Nordstern-Gruppe (ein Viertel)', 'gegner');
    }
  }

  /* ----------------------------------------------------------------------
     DER ABSCHLAG — abgezogen bei JEDER Lieferung, nicht erst am Jahresende.
     Der Kritiker soll den Verlust an der Stelle sehen, an der er entsteht:
     eine Zeile im Buch, mit seinem Namen davor, in derselben Woche.

     DECKEL (spiel/ZUSTAENDIGKEIT.md §4): alles zusammen bleibt unter DREI vom
     Hundert des Umsatzes dieses Braujahres. Es wird laufend mitgezaehlt, nicht
     geschaetzt — was das Haus nicht eingenommen hat, kann er nicht abpressen.
     ---------------------------------------------------------------------- */
  var imAbzug = false;

  function hoereBuch(p) {
    if (!Z.bereit || imAbzug || !p) return;
    if (p.wer !== 'spieler' || p.misslungen) return;
    if (p.preis > 0) Z.umsatzJahr += p.preis;
    if (!p.adresse || !p.menge) return;
    var b = Z.bindung[p.adresse];
    if (!b) return;
    var h = haus(b.wer);
    if (!h || h.weg) return;

    var teil = Math.round(p.menge * abschlagJeFass(p.adresse));
    var kappe = Math.floor(Z.umsatzJahr * (D.abschlagKappe || 0.03));
    teil = Math.min(teil, kappe - Z.abschlag);
    teil = Math.min(teil, Math.floor(Math.max(0, B.welt.haus.kasse)));
    if (teil <= 0) return;

    var a = adresse(p.adresse);
    imAbzug = true;
    B.wage('gegner.abschlag', function () {
      B.welt.zahle(teil, 'Preisabschlag beim ' + (a ? a.name : p.adresse)
        + ' — ' + nameVon(h) + ' hält die Adresse'
        + (preisdruck() > 1.02 ? ' und schenkt unter dem Satz aus' : ''), 'gegner');
    });
    imAbzug = false;

    Z.abschlag += teil;
    Z.abschlagJe[p.adresse] = (Z.abschlagJe[p.adresse] || 0) + teil;
    h.kasse += teil;
  }

  /* ----------------------------------------------------------------------
     DER ZUG, DER KEIN GELD KOSTET
     Damit es keinen Zustand gibt, aus dem heraus gegen ihn nichts mehr geht:
     eine Klage je Braujahr. Sie kostet Ansehen, nicht Bargeld — und sie macht
     ihn zornig, was drei Wochen lang zu spueren ist.
     ---------------------------------------------------------------------- */
  function beschwerdeZiel() {
    var wl = Object.keys(Z.werbung).filter(function (k) { return !!adresse(k); });
    if (wl.length) return { art: 'werbung', k: wl[0] };
    var bl = Object.keys(Z.bindung).filter(function (k) {
      return adresse(k) && abloese(k) !== null;
    });
    if (!bl.length) return null;
    bl.sort(function (x, y) { return (abloese(y) || 0) - (abloese(x) || 0); });
    return { art: 'bindung', k: bl[0] };
  }

  function beschwerdeMoeglich() {
    return !!ep().beschwerde && Z.beschwerdeJahr !== jahr() && !!beschwerdeZiel();
  }

  function beschwerdeFuehren() {
    var bs = ep().beschwerde;
    var ziel = beschwerdeZiel();
    if (!bs || !ziel || Z.beschwerdeJahr === jahr()) return;
    Z.beschwerdeJahr = jahr();
    B.welt.haus.ansehen = Math.max(0, (B.welt.haus.ansehen || 0) - 4);
    Z.zorn = 3;

    var a = adresse(ziel.k);
    var g = ep().gegenzug;
    var glueck = 0.5 + (Z.wirkung[g.k] ? 0.2 : 0);
    var gelingt = B.wuerfel.trifft(glueck);
    var satz;

    if (gelingt && ziel.art === 'werbung') {
      delete Z.werbung[ziel.k];
      Z.schutz[ziel.k] = jahr() + 2;
      satz = a.name + ': die Werbung ist vom Tisch. Zwei Jahre rührt er die Adresse nicht an.';
    } else if (gelingt) {
      var b = Z.bindung[ziel.k];
      b.bis = Math.max(jahr() + 1, b.bis - 2);
      b.nachlass = Math.min(0.5, (b.nachlass || 0) + 0.25);
      if (a.bindung) a.bindung.bis = b.bis;
      satz = bs.gelingt.replace('{haus}', a.name)
        + ' Ablösen kostet jetzt ' + B.welt.geld(abloese(ziel.k)) + ' statt vorher mehr.';
    } else {
      satz = bs.misslingt;
    }

    Z.wechsel[ziel.k] = { takt: takt(), an: gelingt ? null : (Z.bindung[ziel.k] ? Z.bindung[ziel.k].wer : null),
                          von: null, klage: true };
    B.welt.protokolliere({ wer: 'spieler', was: bs.name + ' gegen ' + a.name
      + (gelingt ? ' — durchgedrungen' : ' — abgewiesen'), preis: 0, adresse: ziel.k });
    B.welt.schreibe(bs.name + ': ' + satz + ' Es hat keinen '
      + B.welt.waehrung().name + ' gekostet, aber vier Ansehen — und der Adler '
      + 'weiß jetzt, von wem.', 'gegner');
    B.ton.spiele('gegner:klage', { ort: a.ort });
    Z.beschwerdeAusgang = { jahr: jahr(), gelingt: gelingt, satz: satz, wo: a.name };
    Z.meldung = bs.name + ': ' + satz;
    neuZeichnen('gegner-klage');
  }

  /* Auch das Haus gegenueber kann fallen. Drei Stufen und ein Ende. */
  function untergang(h) {
    if (h.kasse >= 0) { h.not = 0; if (h.stufe > 0 && h.kasse > 0) h.stufe = Math.max(0, h.stufe - 1); return; }
    h.not += 1;
    if (h.not < 2) return;

    if (h.stufe === 0) {
      h.stufe = 1;
      var l = seine(h);
      if (l.length) {
        var a = B.wuerfel.aus(l);
        B.welt.binde(a.schluessel, null, null, 0, h.k);
        delete Z.bindung[a.schluessel];
        Z.wechsel[a.schluessel] = { takt: takt(), an: null, von: h.k };
        h.kasse += Math.round(grundwert(a, ep().mittel[0]) * 0.8);
        merkeZug(h, 'not', nameVon(h) + ' ist klamm und gibt ' + a.name
          + ' auf. Die Adresse ist frei.', a.ort, a.schluessel);
        B.welt.schreibe(nameVon(h) + ' ist klamm: ' + a.name + ' wird frei.', 'gegner');
      }
      return;
    }
    if (h.stufe === 1) {
      h.stufe = 2;
      if (h.bauten.length) {
        var k = h.bauten.pop(), name = k;
        ep().bauten.forEach(function (b) { if (b.k === k) { name = b.name; h.kasse += Math.round(b.preis * 0.5); } });
        merkeZug(h, 'not', nameVon(h) + ' verpfändet ' + name + '. Der Hof wird kleiner.',
          sitzVon(h).ort, null);
      }
      return;
    }
    /* Am Ende. In IV schluckt ihn die Gruppe, davor faellt er einfach. */
    h.stufe = 3;
    if (epNr() >= 4 && Z.haeuser.konzern && !Z.haeuser.konzern.weg && h.k === 'adler') {
      var kon = Z.haeuser.konzern;
      seine(h).forEach(function (a) {
        B.welt.binde(a.schluessel, 'konzern', 'Jahresvereinbarung', jahr() + 5);
        if (Z.bindung[a.schluessel]) Z.bindung[a.schluessel].wer = 'konzern';
        Z.wechsel[a.schluessel] = { takt: takt(), an: 'konzern', von: 'adler' };
      });
      h.weg = true;
      /* Aber nicht die ganze Stadt. Der Schluck geht bis Runde 2 an der
         Gesamtgrenze vorbei: gemessen hielten die Gegner nach dem Fall des
         Adlers 11 von 11 Adressen, und danach hat der Spieler nichts mehr,
         woran er ansetzen koennte. Was die Gruppe nicht bedienen kann, laesst
         sie fahren — dieselbe Grenze wie fuer jede andere Bindung. */
      var frei = [];
      while (fremdGesamt() > gesamtgrenze()) {
        var weg = machePlatz(kon, null);
        if (!weg) break;
        frei.push(weg.name);
      }
      merkeZug(kon, 'schluckt', 'Die Nordstern-Gruppe übernimmt ' + nameVon(h)
        + '. Der Name bleibt auf dem Etikett, die Entscheidung nicht im Haus.'
        + (frei.length ? ' Bedienen kann sie nicht alles: ' + frei.join(', ')
           + (frei.length === 1 ? ' wird frei.' : ' werden frei.') : ''),
        sitzVon(kon).ort, null);
      B.welt.schreibe('Das Haus gegenüber ist gefallen: ' + nameVon(h)
        + ' gehört der Nordstern-Gruppe. Seine Adressen mit — bis auf die, '
        + 'die ihr Lastzug nicht anfährt.', 'gegner');
    } else {
      seine(h).forEach(function (a) {
        B.welt.binde(a.schluessel, null, null, 0, h.k);
        delete Z.bindung[a.schluessel];
        Z.wechsel[a.schluessel] = { takt: takt(), an: null, von: h.k };
      });
      h.weg = true;
      merkeZug(h, 'ende', nameVon(h) + ' gibt auf. Der Hof gegenüber steht leer, '
        + 'die Adressen sind frei.', sitzVon(h).ort, null);
      B.welt.schreibe(nameVon(h) + ' gibt auf. Zum ersten Mal seit ' + h.erbe.seit
        + ' braut gegenüber niemand.', 'gegner');
    }
  }

  /* ----------------------------------------------------------------------
     WAS DER SPIELER TUN KANN
     ---------------------------------------------------------------------- */

  function zuvorkommen(k) {
    var w = Z.werbung[k], a = adresse(k);
    if (!w || !a) return;
    if (!B.welt.zahle(w.preis, 'Zuvorkommen beim ' + a.name, 'spieler')) {
      Z.meldung = 'Zuvorkommen beim ' + a.name + ' kostet ' + B.welt.geld(w.preis)
        + '. Die Kasse hält ' + B.welt.geld(B.welt.haus.kasse) + '.';
      return neuZeichnen('gegner-knapp');
    }
    var m = mittelVon(w.mittel);
    delete Z.werbung[k];
    B.welt.binde(k, 'haus', m.womit, jahr() + m.jahre);
    Z.schutz[k] = jahr() + 3;
    Z.wechsel[k] = { takt: takt(), an: 'haus', von: null };
    B.welt.schreibe('Das Haus kommt dem Adler zuvor: ' + a.name + ' wird mit '
      + m.womit + ' gebunden, bis ' + (jahr() + m.jahre) + '.', 'gegner');
    B.ton.spiele('gegner:zuvorkommen', { ort: a.ort });
    Z.meldung = a.name + ': zuvorgekommen. Drei Jahre lang rührt er die Adresse nicht an.';
    neuZeichnen('gegner-zuvor');
  }

  /* Ihm zuvorkommen, solange er erst zielt. Teurer als beim Werben, billiger
     als das Abloesen danach — wer frueh antwortet, zahlt weniger. */
  function abwehren(k) {
    var s = Z.absicht[k], a = adresse(k);
    if (!s || !a) return;
    var ab = ep().absicht || {};
    if (!B.welt.zahle(s.preis, (ab.abwehr || 'Zuvorkommen') + ' beim ' + a.name, 'spieler')) {
      Z.meldung = (ab.abwehr || 'Zuvorkommen') + ' beim ' + a.name + ' kostet '
        + B.welt.geld(s.preis) + '. Die Kasse hält ' + B.welt.geld(B.welt.haus.kasse) + '.';
      return neuZeichnen('gegner-knapp');
    }
    var m = mittelVon(s.mittel);
    delete Z.absicht[k];
    B.welt.binde(k, 'haus', m.womit, jahr() + m.jahre);
    Z.schutz[k] = jahr() + 3;
    Z.wechsel[k] = { takt: takt(), an: 'haus', von: null };
    B.welt.schreibe('Das Haus kommt dem Adler zuvor: ' + a.name + ' wird mit '
      + m.womit + ' gebunden, bis ' + (jahr() + m.jahre) + '. '
      + (ab.abwehrsatz || ''), 'gegner');
    B.ton.spiele('gegner:zuvorkommen', { ort: a.ort });
    Z.meldung = a.name + ': zuvorgekommen, ehe er unterschrieben hat. '
      + 'Drei Jahre lang rührt er die Adresse nicht an.';
    neuZeichnen('gegner-abwehr');
  }

  /* ---- DER ZUG, DER BIER KOSTET UND KEIN GELD -------------------------
     RUNDE 2.  Gemessen wurde: in 63 bis 82 von 92 Wochen stand in keiner
     Epoche EIN einziges bezahlbares Preisschild dieses Stuecks auf dem
     Schirm — die Kasse ist am Boden, und alles, was gegen den Adler hilft,
     kostet Geld. Ein Gegner, gegen den man nur mit vollem Beutel etwas tun
     kann, ist kein Gegner, sondern eine Rechnung.

     Also gibt es eine zweite Waehrung, und sie liegt im eigenen Keller. Ein
     Fass geht auf den Karren oder zum Wirt — beides geht nicht, und das ist
     die Wahl, die neben dem teuren Preisschild steht.
     -------------------------------------------------------------------- */
  function hinhalten(k) {
    var a = adresse(k), hh = ep().hinhalten;
    if (!a || !hh || !hinhaltMoeglich(k)) return;
    var n = hinhaltFass();
    if (fassImKeller() < n) {
      Z.meldung = hh.name + ' beim ' + a.name + ': dafür müssten ' + B.welt.menge(n)
        + ' im ' + (B.welt.epoche().lager || 'Keller') + ' liegen. Es liegt nichts da.';
      return neuZeichnen('gegner-leer');
    }
    B.welt.nimmHeraus(n);
    Z.hinhalt[k] = jahr();
    /* Ohne 'menge': DIE FUHRE liest das Protokoll und zaehlt jeden Eintrag mit
       Adresse UND Menge als Lieferung. Ein Fass, das der Wirt geschenkt
       bekommt, ist keine Lieferung — es stuende sonst in fremder Buchfuehrung
       als Umsatz, den es nie gab. Die Menge steht im Text. */
    B.welt.protokolliere({ wer: 'spieler',
      was: hh.name + ' an ' + a.name + ' · ' + B.welt.menge(n),
      preis: 0, adresse: k });

    var folge = [];
    if (Z.absicht[k]) { Z.absicht[k].bis += (hh.wochen || 3); folge.push('er vertagt'); }
    if (Z.werbung[k]) { Z.werbung[k].bis += (hh.wochen || 3); folge.push('seine Werbung steht still'); }
    if (Z.bindung[k]) folge.push('bis Michaeli drückt er hier den Preis nicht mehr');

    B.welt.schreibe(hh.name + ' an ' + a.name + ': ' + hh.satz
      + ' Es kostet ' + B.welt.menge(n) + ' aus dem eigenen Vorrat und keinen '
      + B.welt.waehrung().name + '.', 'gegner');
    B.ton.spiele('gegner:hinhalten', { ort: a.ort });
    Z.wechsel[k] = { takt: takt(), an: null, von: null, hinhalt: true };
    Z.meldung = a.name + ': ' + hh.marke + ' — ' + B.welt.menge(n) + ' aus dem Vorrat, '
      + (folge.length ? folge.join(', ') + '.' : 'der Wirt lässt ihn warten.')
      + ' Einmal im Braujahr je Adresse.';
    neuZeichnen('gegner-hinhalt');
  }

  function loeseAb(k) {
    var b = Z.bindung[k], a = adresse(k);
    if (!b || !a) return;
    var summe = abloese(k);
    if (summe === null) {
      Z.meldung = mittelVon(b.mittel).loest;
      return neuZeichnen('gegner-fest');
    }
    if (!B.welt.zahle(summe, 'Ablösung der Bindung am ' + a.name, 'spieler')) {
      Z.meldung = 'Die Ablösung am ' + a.name + ' kostet ' + B.welt.geld(summe)
        + '. In der Kasse liegen ' + B.welt.geld(B.welt.haus.kasse) + '.';
      return neuZeichnen('gegner-knapp');
    }
    var h = haus(b.wer);
    if (h) h.kasse += summe;                 /* er bekommt sein Geld — und gibt es aus */
    var m = mittelVon(b.mittel);
    delete Z.bindung[k];
    B.welt.binde(k, 'haus', m.womit, jahr() + m.jahre);
    Z.schutz[k] = jahr() + 4;
    Z.wechsel[k] = { takt: takt(), an: 'haus', von: b.wer };
    B.welt.schreibe(a.name + ' wird abgelöst: ' + B.welt.geld(summe) + ' in der Währung '
      + 'dieser Zeit — ' + m.name + '. Vier Jahre lang kommt er nicht wieder.', 'gegner');
    B.ton.spiele('gegner:abloesen', { ort: a.ort });
    Z.meldung = a.name + ' gehört jetzt dem Haus. ' + B.welt.geld(summe) + ' dafür.';
    neuZeichnen('gegner-abloese');
  }

  /* ---- DAS GEBOT BEIM NOTAR — der fuenfte Zug, und der einzige ohne Tarif
     Abloesen, Zuvorkommen und Hinhalten haben einen Preis, der am Schild
     steht; hier steht ein fremdes Gebot, und was daraufgelegt wird, ist die
     Entscheidung. Drei Stufen nebeneinander, jede mit ihrem Preisschild,
     jede schliesst die beiden anderen aus. Sicher ist keine.
     -------------------------------------------------------------------- */
  function gebotStufen() {
    var g = ep().gebot;
    if (!g || !Z.gebot) return [];
    return g.stufen.map(function (st, i) {
      return { nr: i, name: st.name, sagt: st.sagt, glueck: st.glueck,
               preis: Math.max(1, Math.round(Z.gebot.gebot * st.faktor)) };
    });
  }

  function mitbieten(nr) {
    var g = ep().gebot, G = Z.gebot;
    if (!g || !G) return;
    var st = gebotStufen()[nr];
    var a = adresse(G.k);
    if (!st || !a) return;
    if (!B.welt.zahle(st.preis, 'Gebot beim Notar: Ausschank ' + a.name, 'spieler')) {
      Z.meldung = 'Das Gebot ' + st.name + ' kostet ' + B.welt.geld(st.preis)
        + '. In der Kasse liegen ' + B.welt.geld(B.welt.haus.kasse) + '.';
      return neuZeichnen('gegner-knapp');
    }
    var h = haus(G.wer);
    var gelingt = B.wuerfel.trifft(st.glueck);
    var name = G.name;
    Z.gebot = null;
    Z.gebotSperre = Z.takt + 2 * (g.wochen || 5);
    if (h) h.brauereien += 1;               /* die Kessel im Tal bekommt sie so oder so */
    if (gelingt) {
      var m = mittelVon('jahresvereinbarung');
      delete Z.bindung[a.schluessel];
      delete Z.werbung[a.schluessel];
      delete Z.absicht[a.schluessel];
      B.welt.binde(a.schluessel, 'haus', m.womit, jahr() + m.jahre);
      Z.schutz[a.schluessel] = jahr() + 3;
      Z.wechsel[a.schluessel] = { takt: takt(), an: 'haus', von: G.wer };
      B.welt.schreibe(g.gewonnen.replace('{haus}', a.name) + ' ' + B.welt.geld(st.preis)
        + ' beim Notar, ' + name + ' behält die Gruppe.', 'gegner');
      B.ton.spiele('gegner:zuvorkommen', { ort: a.ort });
      Z.meldung = a.name + ' gehört dem Haus. ' + B.welt.geld(st.preis) + ' dafür — '
        + st.sagt;
      Z.gebotAusgang = { takt: Z.takt, wo: a.name, gelingt: true, summe: st.preis };
    } else {
      var zurueck = Math.round(st.preis * (1 - (g.notarteil || 0.12)));
      B.welt.nimm(zurueck, 'Bietungssicherheit zurück vom Notar', 'gegner');
      var weg = st.preis - zurueck;
      if (h) binde(h, a, mittelVon('jahresvereinbarung'),
        'Beim Notar unterschreiben die Erben an die Gruppe. Der Ausschank in der '
        + 'Stadt — ' + a.name + ' — geht mit ' + name + ' an sie.');
      B.welt.schreibe(g.verloren.replace('{geld}', B.welt.geld(weg))
        .replace('{haus}', a.name), 'gegner');
      B.ton.spiele('gegner:entreissen', { ort: a.ort });
      Z.meldung = 'Überboten. ' + B.welt.geld(zurueck) + ' kommen zurück, '
        + B.welt.geld(weg) + ' bleiben beim Notar, und ' + a.name + ' ist weg.';
      Z.gebotAusgang = { takt: Z.takt, wo: a.name, gelingt: false, summe: weg };
    }
    neuZeichnen('gegner-gebot');
  }

  function gegenzug() {
    var g = ep().gegenzug;
    var nr = B.welt.zeit.amtszeit.nr;
    if (Z.gegenzugGetan[nr]) return;
    if (g.preis > 0 && !B.welt.zahle(g.preis, g.name, 'spieler')) {
      Z.meldung = g.name + ' kostet ' + B.welt.geld(g.preis) + '.';
      return neuZeichnen('gegner-knapp');
    }
    Z.gegenzugGetan[nr] = true;
    Z.wirkung[g.k] = true;
    B.welt.schreibe(g.chronik.replace('{name}', B.welt.zeit.amtszeit.name)
      + ' ' + g.folge, 'festlegung');
    Z.meldung = g.name + ': festgelegt. ' + g.folge;
    B.ton.spiele('gegner:festlegung');
    neuZeichnen('gegner-gegenzug');
  }

  function angebotAnnehmen() {
    if (!Z.angebot) return;
    B.welt.nimm(Z.angebot.summe, 'Nordstern-Gruppe: ein Viertel des Hauses', 'gegner');
    Z.wirkung.anteil = true;
    B.welt.schreibe('Das Haus verkauft ein Viertel an die Nordstern-Gruppe für '
      + B.welt.geld(Z.angebot.summe) + '. Von heute an redet die Gruppe mit. '
      + 'Das wird nicht zurückgenommen.', 'festlegung');
    Z.angebot = null;
    Z.meldung = 'Angenommen. Die Gruppe hält ein Viertel und führt jedes Jahr Gewinn ab.';
    neuZeichnen('gegner-anteil');
  }

  function angebotAblehnen() {
    if (!Z.angebot) return;
    var kon = haus('konzern');
    Z.wirkung.abgelehnt = true;
    Z.angebot = null;
    var n = 0;
    if (kon) {
      offeneAdressen().filter(function (a) {
        return a.bindung && a.bindung.wem === 'haus';
      }).slice(0, 2).forEach(function (a) {
        var m = mittelVon('jahresvereinbarung');
        binde(kon, a, m, 'Die Nordstern-Gruppe listet das Haus beim ' + a.name
          + ' aus. Das war die Antwort auf das Nein.');
        n++;
      });
    }
    B.welt.schreibe('Das Haus lehnt das Angebot der Nordstern-Gruppe ab. '
      + 'Am selben Tag verliert es ' + n + ' Adressen an die Gruppe. '
      + 'Das wird nicht zurückgenommen.', 'festlegung');
    Z.meldung = 'Abgelehnt. ' + n + ' Adressen sind noch am selben Tag weg.';
    neuZeichnen('gegner-abgelehnt');
  }

  function neuZeichnen(grund) { B.sende('zeichne', { grund: grund || 'gegner' }); }

  /* Liegt gerade die Michaelitafel des PREISES oben, gehoert der Bildschirm
     ihr (spiel/ZUSTAENDIGKEIT.md §5). Dann wird das eigene Blatt NICHT
     stillschweigend verschluckt, sondern gesagt, warum es zubleibt — ein Knopf,
     der nichts tut und nichts sagt, ist das Schlimmste im ganzen Spiel. */
  function tafelOben() {
    return !!document.querySelector('[data-zug="preis:tafel-zu"]');
  }

  function schalteBlatt(wer) {
    if (tafelOben()) {
      Z.offen = false;
      Z.meldung = 'Solange die Michaelitafel oben liegt, bleibt das Haus gegenüber zu. '
        + 'Erst die Tafel schließen.';
      return neuZeichnen('gegner-gesperrt');
    }
    if (Z.offen && (!wer || Z.seite === wer)) { Z.offen = false; }
    else { Z.offen = true; if (wer) Z.seite = wer; }
    neuZeichnen('gegner-blatt');
  }

  /* ----------------------------------------------------------------------
     DER NAECHSTE SINNVOLLE ZUG — die eine Zahl der Messlatte
     ---------------------------------------------------------------------- */
  /* Der billigste UMKAEMPFTE Zug — nicht der billigste Posten ueberhaupt.
     Der Unterschied ist kein Feinschliff: in 1970 steht der billigste Posten
     des ganzen Spiels bei 1.800 DM (ein Bierdeckel), das billigste Abloesen
     bei 24.300 DM. Wer die Kennzahl gegen den Bierdeckel rechnet, liest
     47,8x statt 3,5x und wuerde eine Wohlstandssingularitaet nicht anzeigen,
     sondern verdecken. Dieses Stueck meldet deshalb seinen Zug mit der Art
     'umkaempft' an und schreibt die Zahl zusaetzlich selbst ins Bild.
     (Was der Kern daraus macht, steht als KERN-Absatz im Bericht.) */
  /* WELLE 11: `bester` traegt jetzt zusaetzlich den Schluessel der Adresse
     (`k`). Das aendert an der GEMELDETEN Groesse nichts — `B.welt.meldeZug`
     bekommt Wort fuer Wort dieselben zwei Werte und dieselbe Art —, aber es
     sagt dem Bild, an WELCHEM Giebel die Zahl zu stehen hat. Bis hierher
     stand sie als Band im untersten Sechstel; das ist Auflage 6. */
  function meldeZug() {
    var bester = null;
    if (Z.gebot) {
      var st = gebotStufen()[0];
      var ga = adresse(Z.gebot.k);
      if (st && ga) bester = { was: 'Mitbieten ' + ga.name, preis: st.preis, k: Z.gebot.k };
    }
    Object.keys(Z.werbung).forEach(function (k) {
      var a = adresse(k);
      if (!a) return;
      var p = Z.werbung[k].preis;
      if (!bester || p < bester.preis) bester = { was: 'Zuvorkommen ' + a.name, preis: p, k: k };
    });
    Object.keys(Z.absicht).forEach(function (k) {
      var a = adresse(k);
      if (!a) return;
      var p = Z.absicht[k].preis;
      if (!bester || p < bester.preis) bester = { was: 'Zuvorkommen ' + a.name, preis: p, k: k };
    });
    Object.keys(Z.bindung).forEach(function (k) {
      var a = adresse(k), p = abloese(k);
      if (!a || p === null) return;
      if (!bester || p < bester.preis) bester = { was: 'Ablösung ' + a.name, preis: p, k: k };
    });
    Z.umkaempft = bester;
    if (bester) B.welt.meldeZug(bester.was, bester.preis, 'umkaempft');
  }

  /* DIE ZAHL DER ZWEITEN MESSLATTE — sie steht jetzt an dem Giebel, um den
     gestritten wird.

     WELLE 11, Auflage 6.  Bis hierher lag sie als Band neben WEITER:
     849x32 @1710,1282 (1350) bis 860x32 @1699,1282 (1970). Das unterste
     Sechstel beginnt bei y = 1280 — sie lag also vollstaendig darin, und
     dort traegt jedes der vier Zielblaetter seinen Vordergrund: Asphalt mit
     Mittelstrich, einen gelben Kaefer, den Fluss, einen Baum.

     Die Zahl selbst bleibt Wort fuer Wort dieselbe, samt `data-umkaempft`
     und `data-umkaempft-preis`, damit jedes Messgeraet sie weiter findet.
     Sie ist nur nicht mehr ein Band im Vordergrund, sondern eine gemalte
     Zeile unter dem Preisschild, das sie meint — dort, wo die Entscheidung
     faellt. Wer den Preis liest, liest im selben Blick, wie oft die Kasse
     ihn traegt.

     `zeichneKennzahl` haengt sie nur noch dann selbst auf, wenn der
     umkaempfte Zug an einer Adresse haengt, die gerade KEIN Zeichen im Bild
     hat (der Notartermin ist so ein Fall). Dann steht sie am Ort, mit
     demselben Wortlaut. */
  /* `amSchild` heisst: die Zeile haengt unmittelbar unter dem Preisschild,
     das sie meint. Dann steht „Ablösung Ausschank am Markt — 1.706 M" schon
     eine Zeile darueber, samt Ort im Bild — ein zweites Mal daneben wuerde
     dasselbe zweimal auf die Platte schreiben. Der Wortlaut ist nicht fort:
     er steht am Schild, und im `title` dieser Zeile steht er noch einmal
     ganz. Steht die Zeile FREI (kein Zeichen an dieser Adresse, etwa beim
     Notartermin), traegt sie den vollen Satz wie bisher. */
  function kennzahlZeile(amSchild) {
    var u = Z.umkaempft;
    if (!u || !u.preis) return null;
    var q = B.welt.haus.kasse / u.preis;
    var el = B.el('div', 'gg-kennzahl' + (q < 1 ? ' knapp' : ''));
    el.setAttribute('data-umkaempft', B.rund(q, 2));
    el.setAttribute('data-umkaempft-preis', String(u.preis));
    el.appendChild(B.el('b', null, 'umkämpft'));
    if (!amSchild) el.appendChild(B.el('span', null, u.was + ' — ' + B.welt.geld(u.preis)));
    el.appendChild(B.el('i', null, 'Kasse reicht ' + B.zahl(q, 1) + '×'));
    el.title = 'Umkämpft: ' + u.was + ' — ' + B.welt.geld(u.preis) + '. Die Kasse reicht '
      + B.zahl(q, 1) + '× dafür. Das ist der billigste Zug, um den gegenüber jemand '
      + 'mitbietet — nicht der billigste Posten auf dem Brett.';
    return el;
  }

  function zeichneKennzahl(fach) {
    if (Z.kennzahlSteht) return;             /* haengt schon an ihrem Giebel */
    var el = kennzahlZeile();
    if (!el) return;
    var u = Z.umkaempft;
    var a = u.k ? adresse(u.k) : null;
    var sa = stamm('adler').sitz;
    var ort = (a && B.orte.hole(a.ort)) ? a.ort
      : (sa[epNr()] || sa[4] || sa[1]).ort;
    if (!ort || !B.orte.hole(ort)) return;
    el.classList.add('frei');
    B.orte.setze(el, ort, { anker: 'oben', dx: randDx(ort, 0, BREIT.paar), dy: 7 });
    el.setAttribute('data-frei', 'gegner');
    fach.appendChild(el);
  }

  /* ======================================================================
     DAS BILD
     ====================================================================== */

  function svg(markup, klasse) {
    var s = B.el('span', 'gg-svg' + (klasse ? ' ' + klasse : ''));
    s.innerHTML = markup;
    return s;
  }

  var ADLER_SVG =
    '<svg viewBox="0 0 80 86" aria-hidden="true">'
    + '<path class="gg-schildform" d="M4 3h72v42c0 20-19 33-36 38C23 78 4 65 4 45Z"/>'
    + '<path class="gg-vogel" d="M40 17c-4 0-7 2-7 5l-6-3-3 6 5 4c-7 2-13 7-16 13 5-2 10-3 14-1'
    + 'l-5 12 6-2 3 11 6-9 3 12 3-12 6 9 3-11 6 2-5-12c4-2 9-1 14 1-3-6-9-11-16-13l5-4-3-6-6 3'
    + 'c0-3-3-5-7-5Z"/></svg>';

  var STERN_SVG =
    '<svg viewBox="0 0 80 86" aria-hidden="true">'
    + '<path class="gg-schildform" d="M4 3h72v42c0 20-19 33-36 38C23 78 4 65 4 45Z"/>'
    + '<path class="gg-vogel" d="M40 16l7 16 17 2-13 12 4 17-15-9-15 9 4-17-13-12 17-2Z"/></svg>';

  function glyph(k) {
    var g = {
      bottich: '<circle cx="16" cy="20" r="9"/><rect x="7" y="18" width="18" height="10"/>',
      kammer:  '<rect x="5" y="12" width="22" height="16"/><path d="M5 12l11-7 11 7"/>',
      darre:   '<rect x="6" y="14" width="20" height="14"/><path d="M16 14V5"/><circle cx="16" cy="4" r="3"/>',
      wagen:   '<rect x="5" y="12" width="22" height="8"/><circle cx="10" cy="24" r="4"/><circle cx="23" cy="24" r="4"/>',
      brunnen: '<rect x="9" y="16" width="14" height="12"/><path d="M6 14h20M16 14V6"/>',
      keller:  '<path d="M5 28V16a11 11 0 0 1 22 0v12Z"/><path d="M16 28V18"/>',
      eis:     '<path d="M16 5v23M7 11l18 11M25 11L7 22"/>',
      muehle:  '<rect x="11" y="14" width="10" height="14"/><path d="M16 14 4 6M16 14l12-8"/>',
      pfanne:  '<path d="M6 14h20l-3 12H9Z"/><path d="M10 10c2-3 4-3 6 0s4 3 6 0"/>',
      fass:    '<rect x="8" y="10" width="16" height="18" rx="6"/><path d="M8 16h16M8 22h16"/>',
      maschine:'<rect x="5" y="12" width="16" height="16"/><circle cx="24" cy="20" r="5"/>',
      flasche: '<path d="M13 6h6v6l4 8v8H9v-8l4-8Z"/>',
      gleis:   '<path d="M4 26h24M8 12v14M20 12v14M4 12h24"/>',
      halle:   '<rect x="4" y="14" width="24" height="14"/><path d="M4 14l12-8 12 8"/>',
      turm:    '<rect x="12" y="4" width="8" height="24"/><path d="M8 28h16"/>',
      tank:    '<rect x="8" y="8" width="7" height="20" rx="3"/><rect x="18" y="8" width="7" height="20" rx="3"/>',
      schild:  '<rect x="6" y="8" width="20" height="14"/><path d="M16 22v6M10 28h12"/>'
    };
    return '<svg viewBox="0 0 32 32" aria-hidden="true"><g class="gg-glyph">'
      + (g[k] || g.kammer) + '</g></svg>';
  }

  /* --- sein Sitz: EIN Schild am Giebel, und darunter gemalte Schrift -----

     WELLE 11.  Bis hierher war das eine Karteikarte: 366x171 px, Papier,
     Rahmen, Schlagschatten — 62.426 px² Huelle fuer ein Stueck, dessen
     ganzer Haushalt 28.000 px betraegt. Und sie wuchs nach UNTEN: mit
     Marken, Wochenzettel und Wochenzugzeile stand ihre Unterkante im
     gebauten Zustand von 1884 bei y = 802, und „GASTHOF LINDENHOF" beginnt
     bei y = 787. Gemessen am Vorzustand, 34 Baurunden:

       „GASTHOF LINDENHOF"  634 px² unter button.gg-sitz  366x218 @1964,584

     Das ist Befund (C) des blinden Kritikers und seine Auflage 3.

     ZWEI AENDERUNGEN, und beide folgen aus derselben Einsicht:

     1  EIN KASTEN JE HAUS, und das ist das Namensschild. Alles darunter —
        Kasse, Zuege, sein Preis, seine Marken, sein Wochenzettel — ist
        jetzt GEMALT: Schrift mit Lichthof, kein Papier darunter. Es steht
        Wort fuer Wort weiter im Bild. „Weniger anzeigen" waere keine
        Loesung; anders anzeigen ist eine.

     2  DER STAPEL WAECHST NICHT MEHR UEBER DAS SCHILD HINAUS, weil er
        gedeckelt ist: das Schild hat feste Hoehe, die gemalten Zeilen
        stehen in `.gg-stand` mit fester Hoechstbreite und einer Zeile je
        Sache. Zwischen der Unterkante des Stapels und „GASTHOF LINDENHOF"
        bleibt gemessener Abstand — nachgeprueft in allen vier Epochen, im
        Lade-, im 30-Wochen- und im gebauten Zustand.

     Die Zahlen stehen nicht mehr in drei engen Spalten nebeneinander,
     sondern in EINER Zeile mit umbrechbaren Feldern, jedes fuer sich
     unzerbrechlich. Das ist die zweite Haelfte der Auflage 10: die
     Kassenspalte war 109 px breit und trug „2.637.150 DM" mit 130 px —
     abgeschnitten, ohne Auslassungspunkte, in 1970 in JEDER gemessenen
     Lage. Eine falsch gelesene Zahl ist schlimmer als ein gekuerzter Satz.
     --------------------------------------------------------------------- */
  function zeichneSitz(fach, h) {
    var s = sitzVon(h);
    /* Der Stapel ist EIN Ding am Ort — das Schild darin, die gemalten
       Zeilen darunter. So kann nichts auseinanderlaufen, und die STADT
       sieht einen einzigen Punkt statt sieben. */
    var stand = B.el('div', 'gg-stand gg-' + stamm(h.k).farbe);

    var k = document.createElement('button');
    k.type = 'button';
    k.className = 'gg-sitz' + (Z.offen && Z.seite === h.k ? ' offen' : '')
      + (h.stufe >= 1 ? ' klamm' : '');
    k.setAttribute('data-zug', 'gegner:oeffnen:' + h.k);
    k.title = nameVon(h) + ' — ' + s.sagt + '. ' + h.erbe.name + ', ' + h.erbe.wesenName
      + '. Anklicken: das ganze Haus gegenüber.';
    k.addEventListener('click', function (ereignis) {
      ereignis.preventDefault();
      B.ton.spiele('gegner:hinsehen', { ort: s.ort });
      schalteBlatt(h.k);
    });

    var kopf = B.el('div', 'gg-sitzkopf');
    kopf.appendChild(svg(h.k === 'konzern' ? STERN_SVG : ADLER_SVG, 'gg-wappen'));
    kopf.appendChild(B.el('span', 'gg-name', nameVon(h)));
    k.appendChild(kopf);
    stand.appendChild(k);

    /* Der Erbe stand bisher in der Karte und machte sie hoch. Er gehoert
       zu den Zahlen: wer regiert, ist eine Angabe wie die Kasse. */
    var z = B.el('div', 'gg-zahlen');
    z.appendChild(zahlfeld(h.erbe.name + ' · ' + h.erbe.wesenName));
    z.appendChild(zahlfeld(seine(h).length + (seine(h).length === 1 ? ' Haus' : ' Häuser')));
    z.appendChild(zahlfeld(h.zuege + (h.zuege === 1 ? ' Zug' : ' Züge')
      + (h.k === 'adler' && Z.wocheZuege > 0 ? ', ' + Z.wocheZuege + ' diese Woche' : '')));
    z.appendChild(zahlfeld('Kasse ' + B.welt.geld(Math.round(h.kasse / 10) * 10)));
    if (h.k === 'adler') {
      z.appendChild(zahlfeld('sein Preis ' + B.welt.geld(h.preis)));
    } else {
      z.appendChild(zahlfeld(h.brauereien + (h.brauereien === 1 ? ' Brauerei' : ' Brauereien')));
    }
    stand.appendChild(z);

    /* SEIN WOCHENZETTEL.  Was er auf dem eigenen Hof tut — bauen, den Preis
       ausrufen, den Rohstoff wegkaufen —, hat keine fremde Adresse, an die
       man einen Zettel haengen koennte. Es steht deshalb an ihm selbst: die
       letzten drei Zuege mit dem Verb dieser Epoche, drei Wochen lang. Wer
       nur auf sein Haus sieht, sieht trotzdem, was geschehen ist. */
    var zettel = B.el('div', 'gg-zettel');
    var gez = 0;
    for (var zi = 0; zi < Z.zuege.length && gez < 3; zi++) {
      var e = Z.zuege[zi];
      if (e.wer !== h.k) continue;
      var alt = Z.takt - e.takt;
      if (alt < 0 || alt > 2) continue;
      gez++;
      var ch = B.el('span', 'gg-zchip' + (alt === 0 ? ' neu' : ''));
      ch.setAttribute('data-ort', e.ort);
      ch.setAttribute('data-zugnr', String(e.nr));
      ch.title = e.jahr + ' Woche ' + e.woche + ': ' + e.text;
      ch.appendChild(B.el('b', null, verbFuer(e.art, e.mittel)));
      ch.appendChild(B.el('i', null, 'W' + e.woche));
      zettel.appendChild(ch);
    }
    if (gez) stand.appendChild(zettel);

    var marken = B.el('div', 'gg-marken');
    Object.keys(h.marken).forEach(function (mk) {
      var namen = { ratssitz: 'Sitz im Rat', buergermeister: 'Bürgermeister',
                    emailschild: 'Emailschild', fernsehen: 'Fernsehwerbung' };
      marken.appendChild(B.el('span', 'gg-siegel', namen[mk] || mk));
    });
    /* Was die eigene Klage bewirkt hat, sieht man an ihm: er zieht jetzt
       sicher, statt zu wuerfeln. Ein Zug ohne sichtbare Folge ist keiner. */
    if (h.k === 'adler' && Z.zorn > 0) {
      marken.appendChild(B.el('span', 'gg-siegel zorn',
        'erzürnt · zieht noch ' + Z.zorn + (Z.zorn === 1 ? ' Woche' : ' Wochen') + ' sicher'));
    }
    if (h.stufe >= 1) marken.appendChild(B.el('span', 'gg-siegel not', D.untergang[h.stufe].name));
    if (marken.childNodes.length) stand.appendChild(marken);

    B.orte.setze(stand, s.ort, { anker: 'oben',
      dx: randDx(s.ort, s.dx || 0, BREIT.stand), dy: s.dy || 0 });
    /* DIE STADT legt fremde Ortsmarken auf einen Pflock und laesst sie beim
       Laden ruhen (stadt.js, Kartenschicht). Das ist richtig fuer die kleinen
       Schilder an den Giebeln — das ist es, was der Kritiker als "Schmutz auf
       der Platte" gelesen hat, und dort machen wir mit. Das Haus gegenueber
       selbst ist keine Ortsmarke: es ist der Gegner. Es meldet sich mit dem
       vorgesehenen data-frei von der Kartenschicht ab und bleibt stehen. */
    stand.setAttribute('data-frei', 'gegner');
    fach.appendChild(stand);
    return s;
  }

  /* Ein Feld der gemalten Zahlenzeile. Es bricht NIE in sich um — die Zeile
     bricht zwischen den Feldern. So kann keine Zahl auseinanderfallen und
     keine abgeschnitten werden. */
  function zahlfeld(wert) {
    return B.el('span', 'gg-feld', wert);
  }

  /* --- sein Hof: was darauf steht, steht im Bild -------------------------
     WICHTIG fuer die Bildlatte: In 1884 und 1970 ist seine Brauerei auf der
     Platte selbst gemalt — Backstein, zwei Schornsteine, spaeter Tanks im
     Freien. Ein zweites Gebaeude daruebergelegt waere eine Attrappe ueber dem
     Bild, und genau das ist einem Kritiker schon aufgefallen. Deshalb steht
     das Hofbild nur dort, wo die Platte an dieser Stelle leeres Feld zeigt
     (1350 und 1600). Danach uebernimmt die Platte, und dieses Stueck zeigt
     nur noch, was NEU dazugekommen ist. */
  function zeichneHof(fach, h) {
    var s = sitzVon(h);
    var hof = B.el('div', 'gg-hof');
    if (h.k === 'adler' && ep().hofbild) {
      var bild = B.el('img', 'gg-hofbild');
      bild.src = BILD + ep().hofbild + '.png';
      bild.alt = '';
      hof.appendChild(bild);
    }
    var reihe = B.el('div', 'gg-bauten');
    var namen = {};
    ep().bauten.forEach(function (b) { namen[b.k] = b; });
    h.bauten.forEach(function (bk) {
      var b = namen[bk];
      var stand = b ? eigenerStand(b.spiegel) : 'fehlt';
      var i = B.el('span', 'gg-bau' + (stand === 'hat' ? '' : ' vor'));
      i.appendChild(svg(glyph(b ? b.glyph : 'kammer')));
      i.title = (b ? b.name : bk) + ' — steht auf dem Hof gegenüber.'
        + (b && b.nutzen ? ' ' + b.nutzen : '')
        + (stand === 'hat' ? ' Das Haus hat es auch.'
           : stand === 'offen' ? ' Im eigenen Hof noch nicht gebaut.'
           : ' Im eigenen Hof gibt es das nicht.');
      reihe.appendChild(i);
    });
    hof.appendChild(reihe);
    if (h.k === 'adler') {
      var vor = vorsprung(h);
      if (vor > 0) {
        var v = B.el('div', 'gg-vorschild',
          'Vorsprung: ' + vor + (vor === 1 ? ' Ding' : ' Dinge') + ' · wirbt '
          + vor + (vor === 1 ? ' Woche' : ' Wochen') + ' kürzer');
        v.title = 'Technik, die er früher hat als das Haus. Jedes Ding kürzt seine '
          + 'Werbung um eine Woche — er ist an der Tür, ehe man ihn kommen sieht.';
        hof.appendChild(v);
      }
    }
    /* Der Hof steht UEBER dem Schild: unten verankert, damit er nach oben
       waechst und dem Schild nie ins Gesicht rutscht.

       WELLE 11, Auflage 3.  Nach oben stand aber auch etwas: das gemalte
       Ortsschild der STADT am selben Ort — „BRAUHAUS ZUM ADLER" (1350),
       „BRAUSTATT ADLER" (1600), 191x18 @2051,461. Gemessen am Vorzustand
       lag das Hofbild mit 3.024 px² (1350) bzw. 2.652 px² (1600) darauf.
       Die Regel dafuer steht in spiel/LIESMICH.md und ist eindeutig:
       „Was gegraben wird, bleibt … Steht etwas davor, rueckt das, was
       davorsteht." Das Schild bleibt, das Hofbild rueckt zur Seite — nur
       dort, wo es ueberhaupt eines gibt (1350 und 1600; ab 1884 ist seine
       Brauerei auf der Platte selbst gemalt und dieser Zweig faellt weg). */
    var hofDx = (s.dx || 0) - (h.k === 'adler' && ep().hofbild ? 9 : 0);
    B.orte.setze(hof, s.ort, { anker: 'unten', dx: randDx(s.ort, hofDx, 200),
      dy: (s.hofDy === undefined ? 4 : s.hofDy) });
    hof.setAttribute('data-frei', 'gegner');
    fach.appendChild(hof);
  }

  /* --- sein Ausschank in der Stadt: derselbe Ort, andere Zeit ----------- */
  function zeichneNebenzeichen(fach) {
    var st = stamm('adler').nebenzeichen;
    if (!st) return;
    if (st.ab && epNr() < st.ab) return;
    if (st.bis && epNr() > st.bis) return;
    var m = B.el('div', 'gg-stammhaus', st.text);
    m.title = st.titel || st.text;
    B.orte.setze(m, st.ort, { anker: 'oben',
      dx: randDx(st.ort, st.dx, BREIT.spur), dy: st.dy });
    fach.appendChild(m);
  }

  /* Zwei Wirtshaeuser koennen im Bild dicht beieinanderliegen — die Muehle
     und die obere Bruecke sind einen Prozentpunkt auseinander. Dann darf das
     eine Schild nicht auf dem anderen liegen: gestapelt wird nach oben, in
     der festen Reihenfolge der Adressliste, also in jeder Woche gleich. */
  /* Sein Haus ist das groesste Ding, das dieses Stueck ins Bild stellt: Karte,
     Hofbild, Vorsprungschild. Wer sein Zeichen dicht daneben haengt, haengt es
     hinein — gemessen waren das in 1350 einunddreissig Wochen am Stueck, in
     denen das Schild der Klosterschenke im Hof des Adlers lag. Der ORT bleibt,
     wo er ist (Ortstreue ueber 620 Jahre); nur sein Zeichen rueckt zur Seite. */
  function seitenversatz(o) {
    var dx = 0;
    haeuserJetzt().forEach(function (h) {
      var s = sitzVon(h);
      var so = B.orte.hole(s.ort);
      if (!so) return;
      var sx = so.x + (s.dx || 0), sy = so.y + (s.dy || 0);
      var weit = Math.abs(o.x - sx);
      if (weit < 12 && o.y > sy - 22 && o.y < sy + 24) {
        /* Vom Haus weg, nicht hindurch — und nur so weit, dass das Zeichen
           im Bild bleibt. */
        var nach = (o.x >= sx ? 1 : -1) * (12 - weit);
        if (o.x + nach > 94) nach = 94 - o.x;
        if (o.x + nach < 6) nach = 6 - o.x;
        if (Math.abs(nach) > Math.abs(dx)) dx = nach;
      }
    });
    return dx;
  }

  function schildVersatz() {
    var belegt = {}, karte = {};
    offeneAdressen().forEach(function (a) {
      var o = B.orte.hole(a.ort);
      if (!o) return;
      var feld = Math.round(o.x / 5) + '/' + Math.round(o.y / 5);
      var n = belegt[feld] || 0;
      belegt[feld] = n + 1;
      /* GLAETTUNG WELLE 1: 3,6 % Stapelabstand reichten nicht, seit die
         Preisschilder nicht mehr auf Pfloecken ruhen, sondern alle stehen —
         zwei Orte im selben Rasterfeld liegen selbst schon 2 % auseinander,
         und dann deckte das eine Schild das andere zur Haelfte.
         RUNDE 2: seit unter jedem Schild das zweite Preisschild in Bier
         haengt, ist ein Zeichen doppelt so hoch — 9,0 statt 5,6. Zwei Orte im
         selben Rasterfeld liegen bis zu 2 % auseinander; 9,0 minus 2 ist noch
         groesser als ein Zeichen hoch ist. */
      var hebe = 0;
      /* Der Marktstand liegt bei 96 %, die Landstrasse bei 89 % — dort unten
         liegen die Bretter der Werkbank, und ein Preisschild hinter einem
         Brett ist kein Preisschild. Was tief liegt, wird angehoben, bis es
         im freien Bild steht. Der ORT bleibt, wo er ist; nur sein Zeichen
         haengt hoeher. */
      if (o.y > 82) hebe = (o.y - 82) * 1.15;
      /* Gestapelt wird nach oben — ausser oben ist kein Platz mehr. Ueber
         der Muehle liegt die Michaelitafel des PREISES; ein Zeichen, das
         dorthin steigt, ist verdeckt. Dann wird nach unten gestapelt. */
      var richtung = (o.y - 3.6 - n * 9 < 30) ? 1 : -1;
      karte[a.schluessel] = { hoch: n * 9 * richtung - hebe, seite: seitenversatz(o) };
    });
    return karte;
  }

  /* --- Schilder, Wimpel und Zielzeichen an den Wirtshaeusern -------------
     RUNDE 2.  An jedem Giebel, an dem der Adler etwas tut, haengen jetzt ZWEI
     Preisschilder untereinander und in zwei verschiedenen Waehrungen: oben
     die teure, endgueltige Antwort in Geld — abloesen, zuvorkommen —, unten
     die billige in Bier. Man kann beide sehen, ohne ein Blatt aufzuschlagen,
     und man kann nur eine von beiden haben.
     --------------------------------------------------------------------- */

  /* Der Knopf, der Bier kostet statt Geld. */
  function fassKnopf(a) {
    var k = a.schluessel, hh = ep().hinhalten;
    if (!hh) return null;
    var n = hinhaltFass();
    var geht = hinhaltMoeglich(k);
    var da = fassImKeller() >= n;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'gg-fass' + (geht && da ? '' : ' zuteuer');
    b.setAttribute('data-zug', 'gegner:hinhalten:' + k);
    b.setAttribute('data-adr', k);
    b.setAttribute('data-fass', String(n));
    b.disabled = !geht || !da;
    b.title = hh.name + ' beim ' + a.name + '. ' + hh.satz
      + ' Kostet ' + B.welt.menge(n) + ' aus dem eigenen Vorrat und keinen '
      + B.welt.waehrung().name + '. Einmal im Braujahr je Adresse.'
      + (Z.hinhalt[k] === jahr() ? ' In diesem Braujahr schon geschehen.' : '')
      + (da ? '' : ' Es liegt nicht genug im ' + (B.welt.epoche().lager || 'Keller') + '.');
    var t = B.el('span', 'gg-fasstext');
    t.appendChild(B.el('b', null, Z.hinhalt[k] === jahr() ? hh.marke : hh.kurz));
    t.appendChild(B.el('i', null, Z.hinhalt[k] === jahr()
      ? 'läuft bis Michaeli' : (da ? B.welt.menge(n) + ' statt Geld'
                                  : 'Vorrat reicht nicht')));
    b.appendChild(t);
    b.addEventListener('click', function () { hinhalten(k); });
    return b;
  }

  function zeichneAdressen(fach) {
    var versatz = schildVersatz();
    Z.kennzahlSteht = false;
    offeneAdressen().forEach(function (a) {
      var v = versatz[a.schluessel] || { hoch: 0, seite: 0 };
      var hoch = -3.6 + v.hoch;
      var k = a.schluessel;
      var b = Z.bindung[k];
      var w = Z.werbung[k];
      var s = Z.absicht[k];
      var wechsel = Z.wechsel[k];
      var frisch = wechsel && (Z.takt - wechsel.takt) <= 3;
      var reihen = [];

      /* 1 — Er zielt. Das Dringendste steht oben. */
      if (s) {
        var sh = haus(s.wer);
        if (sh) {
          var ab = ep().absicht || {};
          var rest = Math.max(0, s.bis - Z.takt);
          var zz = document.createElement('button');
          zz.type = 'button';
          zz.className = 'gg-ziel gg-' + stamm(s.wer).farbe + (rest <= 2 ? ' knapp' : '');
          zz.setAttribute('data-zug', 'gegner:abwehren:' + k);
          zz.setAttribute('data-adr', k);
          zz.setAttribute('data-preis', String(-s.preis));
          zz.title = nameVon(sh) + ': ' + ab.text.replace('{haus}', a.name)
            + ' In ' + rest + (rest === 1 ? ' Woche' : ' Wochen') + ' ist es unterschrieben, '
            + 'ohne dass jemand fragt. ' + (ab.abwehrsatz || '')
            + ' Jetzt: ' + B.welt.geld(s.preis) + '.';
          zz.appendChild(svg(s.wer === 'konzern' ? STERN_SVG : ADLER_SVG, 'gg-wappen klein'));
          var zt = B.el('span', 'gg-zieltext');
          zt.appendChild(B.el('b', null, (ab.kurz || 'zielt') + ' · noch ' + rest + ' Wo.'));
          zt.appendChild(B.el('i', null, 'zuvorkommen ' + B.welt.geld(s.preis)));
          zz.appendChild(zt);
          if (!B.welt.kann(s.preis)) zz.classList.add('zuteuer');
          zz.addEventListener('click', function () { abwehren(k); });
          reihen.push(zz);
        }
      }

      /* 2 — Er haelt. Das Zeichen am Giebel, mit der Abloesesumme. */
      if (b) {
        var h = haus(b.wer);
        if (h) {
          var m = mittelVon(b.mittel);
          var summe = abloese(k);
          var sc = document.createElement('button');
          sc.type = 'button';
          sc.className = 'gg-schild gg-' + stamm(b.wer).farbe
            + (frisch ? ' frisch' : '') + (summe === null ? ' fest' : '')
            + (Z.hinhalt[k] === jahr() ? ' hingehalten' : '');
          sc.setAttribute('data-zug', 'gegner:abloesen:' + k);
          sc.setAttribute('data-adr', k);
          /* Das Preisschild gehoert an die Sache im Bild, nicht nur ins Blatt —
             der Kritiker zaehlt Optionen mit Preis NEBENEINANDER, und die
             liegen hier: an vier Giebeln gleichzeitig, aus einer Kasse. */
          if (summe !== null) sc.setAttribute('data-preis', String(-summe));
          sc.title = a.name + ' · ' + m.name + ' des ' + nameVon(h) + ', läuft bis ' + b.bis
            + '. ' + m.loest + (summe === null ? '' : ' Ablösung: ' + B.welt.geld(summe) + '.')
            + (Z.hinhalt[k] === jahr()
               ? ' Bis Michaeli drückt er hier den Preis nicht — das Fass steht beim Wirt.' : '');
          sc.appendChild(svg(b.wer === 'konzern' ? STERN_SVG : ADLER_SVG, 'gg-wappen klein'));
          var txt = B.el('span', 'gg-schildtext');
          txt.appendChild(B.el('b', null, (D.kurz[k] || k.slice(0, 3).toUpperCase()) + ' · ' + m.kurz));
          txt.appendChild(B.el('i', null, summe === null
            ? 'nicht ablösbar' : 'ablösen ' + B.welt.geld(summe)));
          sc.appendChild(txt);
          if (summe !== null && !B.welt.kann(summe)) sc.classList.add('zuteuer');
          sc.addEventListener('click', function () { loeseAb(k); });
          reihen.push(sc);
        }
      }

      /* 3 — Er wirbt. Die Uhr laeuft, auch wenn man wegsieht. */
      if (w && !s) {
        var mw = mittelVon(w.mittel);
        var restw = Math.max(0, w.bis - Z.takt);
        var p = document.createElement('button');
        p.type = 'button';
        p.className = 'gg-wimpel gg-' + stamm(w.wer).farbe;
        p.setAttribute('data-zug', 'gegner:zuvorkommen:' + k);
        p.setAttribute('data-adr', k);
        p.setAttribute('data-preis', String(-w.preis));
        p.title = nameVon(haus(w.wer)) + ' wirbt um ' + a.name + ' mit ' + mw.name
          + '. In ' + restw + ' Wochen ist die Bindung da, ohne dass du etwas tust. '
          + 'Jetzt zuvorkommen: ' + B.welt.geld(w.preis) + '.';
        var pt = B.el('span', 'gg-wimpeltext');
        pt.appendChild(B.el('b', null, 'wirbt · noch ' + restw + ' Wo.'));
        pt.appendChild(B.el('i', null, 'zuvorkommen ' + B.welt.geld(w.preis)));
        p.appendChild(pt);
        if (!B.welt.kann(w.preis)) p.classList.add('zuteuer');
        p.addEventListener('click', function () { zuvorkommen(k); });
        reihen.push(p);
      }

      /* 4 — Die Antwort, die Bier kostet. Sie steht unter der teuren. */
      if (reihen.length) {
        var fk = fassKnopf(a);
        if (fk) reihen.push(fk);
      }

      /* 5 — WELLE 11, Auflage 6: die Zahl der zweiten Messlatte steht an
         dem Giebel, den sie meint, und nicht mehr als Band im untersten
         Sechstel. Sie ist gemalt (kein Papier) und nimmt keine Maus an —
         sie sagt etwas ueber die Knoepfe darueber, sie ist keiner. */
      if (reihen.length && Z.umkaempft && Z.umkaempft.k === k) {
        var kz = kennzahlZeile();
        if (kz) { reihen.push(kz); Z.kennzahlSteht = true; }
      }

      if (reihen.length) {
        var paar = B.el('div', 'gg-paar');
        reihen.forEach(function (r) { paar.appendChild(r); });
        /* ZUSTAENDIGKEIT §10, vollstaendig abgemeldet (Glaettung Welle 1):
           Ein Preisschild ist keine Beschriftung, sondern ein Knopf. Auf der
           Kartenschicht der STADT bekam es 'stadt-marke-ruht' und damit
           pointer-events:none — der Ortspflock daneben trug dieselbe
           Aufschrift samt Preis und tat nichts. Von zwei Dingen mit
           demselben Preisschild war das wirksame nicht anklickbar und das
           anklickbare wirkungslos. Wer selbst einen Knopf setzt, meldet ihn
           ab; die stummen Marken des Stuecks bleiben im Pflocksystem. */
        paar.setAttribute('data-frei', 'gegner');
        B.orte.setze(paar, a.ort, { anker: 'unten',
          dx: randDx(a.ort, v.seite, BREIT.paar), dy: hoch });
        fach.appendChild(paar);
        return;
      }

      if (frisch && !sichtbar(a)) return;
      if (frisch && wechsel.an === 'haus') {
        var g = B.el('div', 'gg-gewonnen', 'zurückgeholt — unser Haus');
        g.title = a.name + ' ist wieder gebunden. Vier Jahre lang rührt er die Adresse nicht an.';
        B.orte.setze(g, a.ort, { anker: 'unten',
          dx: randDx(a.ort, v.seite, BREIT.paar), dy: hoch });
        fach.appendChild(g);
      } else if (frisch && !wechsel.an) {
        var f = B.el('div', 'gg-frei', 'frei geworden');
        B.orte.setze(f, a.ort, { anker: 'unten',
          dx: randDx(a.ort, v.seite, BREIT.paar), dy: hoch });
        fach.appendChild(f);
      }
    });
  }

  /* --- DIE SPUR: was diese Woche geschah, steht am Ort ------------------
     RUNDE 2.  Gemessen wurde am Bildschirm: von 39 / 44 / 40 / 80 Zuegen in
     je 92 Wochen hinterliessen nur 19 / 16 / 12 / 25 eine Marke im Bild, die
     die Maus auch trifft. Alles andere — er baut, er faehrt, er ruft den
     Preis aus, er verliert eine Konzession — stand allein in der Liste, und
     die Liste liegt im Vorgabestand zugeklappt. Wer nicht aufschlaegt, sieht
     zwei Drittel seiner Zuege nicht.

     Jetzt legt jeder Zug drei Wochen lang einen Zettel an seinen Ort. Das
     Verb darauf ist in jeder Epoche ein anderes: der Rat spricht zu · die
     Zunft schreibt zu · er nimmt unter Vertrag · er listet aus.
     --------------------------------------------------------------------- */
  function zeichneZugmarken(fach) {
    var belegt = {};
    var offen = {};
    /* Wo schon ein Preisschild haengt, braucht es keinen zweiten Zettel. */
    Object.keys(Z.bindung).forEach(function (k) { offen[k] = true; });
    Object.keys(Z.werbung).forEach(function (k) { offen[k] = true; });
    Object.keys(Z.absicht).forEach(function (k) { offen[k] = true; });

    /* Sein eigener Hof traegt seinen Wochenzettel schon (zeichneSitz) — dort
       waere ein zweiter Zettel nur ein Deckel ueber seinem Haus. */
    var eigene = {};
    haeuserJetzt().forEach(function (h) { eigene[sitzVon(h).ort] = true; });

    var gezeigt = 0;
    for (var i = 0; i < Z.zuege.length && gezeigt < 6; i++) {
      var e = Z.zuege[i];
      var alter = Z.takt - e.takt;
      if (alter < 0 || alter > 2) continue;
      if (e.adr && offen[e.adr]) continue;
      if (eigene[e.ort]) continue;
      if (!B.orte.hole(e.ort)) continue;
      var n = belegt[e.ort] || 0;
      if (n >= 2) continue;
      belegt[e.ort] = n + 1;
      gezeigt++;
      /* Was tief im Bild liegt, bekommt seinen Zettel nach oben statt nach
         unten: unten stehen die Bretter der Werkbank. */
      var oo = B.orte.hole(e.ort);
      var oy = oo.y;
      var unten = oy > 74;
      var seite = seitenversatz(oo);

      var m = B.el('div', 'gg-spur gg-' + stamm(e.wer).farbe
        + (alter === 0 ? ' neu' : '') + (alter >= 2 ? ' alt' : ''));
      m.setAttribute('data-ort', e.ort);
      m.setAttribute('data-zugnr', String(e.nr));
      m.title = e.werName + ', ' + e.jahr + ' Woche ' + e.woche + ': ' + e.text
        + ' — geschehen, ohne dass jemand gefragt hat.';
      var kopf = B.el('span', 'gg-spurkopf');
      kopf.appendChild(B.el('b', null, verbFuer(e.art, e.mittel)));
      kopf.appendChild(B.el('i', null, alter === 0 ? 'diese Woche' : 'W' + e.woche));
      m.appendChild(kopf);
      var spurDx = randDx(e.ort, seite, BREIT.spur);
      B.orte.setze(m, e.ort, unten
        ? { anker: 'unten', dx: spurDx, dy: -(4 + n * 3.4) }
        : { anker: 'oben', dx: spurDx, dy: 2.6 + n * 3.4 });
      /* Ein Zettel, der die Maus schluckt, waere schlimmer als keiner: er
         liegt auf der Platte und deckt die Knoepfe der anderen zu. */
      m.setAttribute('data-frei', 'gegner');
      fach.appendChild(m);
    }
  }

  /* --- Der Zug ohne Bargeld, im Bild statt im zugeklappten Brett --------
     RUNDE 1 hatte ihn gemeldet: "Klage vor dem Stadtgericht laeuft — nur ist
     an ihm keine Wirkung zu sehen." Er steht ausserdem im Band, und das Band
     liegt im Vorgabestand zugeklappt. Also steht er jetzt am Markt, wo in
     jeder Epoche das Amt sitzt, das er anruft — und was er bewirkt hat,
     steht daneben. */
  function zeichneKlage(fach) {
    var bs = ep().beschwerde;
    if (!bs || !B.orte.hole('marktplatz')) return;
    var moeglich = beschwerdeMoeglich();
    var getan = Z.beschwerdeJahr === jahr();
    if (!moeglich && !getan) return;
    var ziel = beschwerdeZiel();
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'gg-amt' + (getan ? ' getan' : '');
    el.setAttribute('data-zug', 'gegner:beschwerde-bild');
    el.setAttribute('data-preis', '0');
    el.disabled = !moeglich;
    el.title = bs.name + '. ' + bs.sagt + ' ' + bs.preis
      + (Z.beschwerdeAusgang && Z.beschwerdeAusgang.jahr === jahr()
         ? ' Zuletzt: ' + Z.beschwerdeAusgang.satz : '');
    var t = B.el('span', 'gg-amttext');
    t.appendChild(B.el('b', null, bs.name));
    t.appendChild(B.el('i', null, getan
      ? (Z.beschwerdeAusgang && Z.beschwerdeAusgang.jahr === jahr()
          ? (Z.beschwerdeAusgang.gelingt ? 'durchgedrungen' : 'abgewiesen')
          : 'in diesem Braujahr schon geschehen')
      : 'kostet kein Geld · vier Ansehen'));
    /* Gegen wen, in einer eigenen Zeile: die Namen der Adressen sind lang,
       und ein Kasten, der mit dem laengsten Namen waechst, schiebt sich unter
       das Brett des SUDES. */
    var wo = getan
      ? (Z.beschwerdeAusgang && Z.beschwerdeAusgang.jahr === jahr()
          ? Z.beschwerdeAusgang.wo : null)
      : (ziel && adresse(ziel.k) ? adresse(ziel.k).name : null);
    if (wo) t.appendChild(B.el('em', null, 'gegen ' + wo));
    el.appendChild(t);
    el.addEventListener('click', beschwerdeFuehren);
    /* Nicht auf den Markt selbst: dort haengt das Zeichen des Ochsen, und
       eine Handbreit tiefer stand bis eben das Schild der Torschenke unter
       diesem Knopf. Er steht jetzt zwischen beiden, im freien Bild. */
    B.orte.setze(el, 'marktplatz', { anker: 'oben',
      dx: randDx('marktplatz', -8, BREIT.paar), dy: 4 });
    el.setAttribute('data-frei', 'gegner');
    fach.appendChild(el);
  }

  /* --- WAS DIE GRUPPE GERADE VOM HAUS WILL ------------------------------
     RUNDE 2 hat es gemessen: die beiden Antworten auf das Uebernahmeangebot
     lagen im fuenften Block eines Blattes, das erst aufgeschlagen und dann
     gescrollt werden muss — der Kritiker hat sie nicht gefunden und dem
     Stueck bescheinigt, es gebe sie nicht. Es gab sie (gegner:angebot-ja mit
     436.608 DM am Schild, in Woche 11), aber zwei Klicks tief ist so gut wie
     gar nicht. Was das Haus als Ganzes betrifft, steht deshalb jetzt im
     Bild, an ihrem Buero, mit der Frist daneben.
     -------------------------------------------------------------------- */
  function zeichneAngebotZettel(fach) {
    var kon = haus('konzern');
    if (!Z.angebot || !kon || kon.weg) return;
    var s = sitzVon(kon);
    if (!B.orte.hole(s.ort)) return;
    var ab = ep().angebot || {};
    var rest = Math.max(0, (Z.angebot.bis || 0) - Z.takt);
    var kasten = B.el('div', 'gg-gzblock gg-gzangebot');
    kasten.appendChild(B.el('div', 'gg-gzkopf', 'Die Gruppe fragt an'));
    kasten.appendChild(B.el('div', 'gg-gzsatz', B.welt.geld(Z.angebot.summe)
      + ' für ein Viertel des Hauses · Antwort binnen ' + rest
      + (rest === 1 ? ' Woche' : ' Wochen') + ', dann nimmt sie sich eine Adresse'));
    var reihe = B.el('div', 'gg-gzreihe');
    reihe.appendChild(B.knopf({
      text: ab.ja || 'Annehmen', zug: 'gegner:angebot-ja', preis: Z.angebot.summe,
      titel: 'Unwiderruflich. ' + (ab.jasatz || ''),
      tu: angebotAnnehmen
    }));
    reihe.appendChild(B.knopf({
      text: ab.nein || 'Ausschlagen', zug: 'gegner:angebot-nein',
      titel: 'Unwiderruflich. ' + (ab.neinsatz || ''),
      tu: angebotAblehnen
    }));
    kasten.appendChild(reihe);
    B.orte.setze(kasten, s.ort, { anker: 'oben',
      dx: randDx(s.ort, 0, BREIT.block), dy: (s.dy || 0) + 25 });
    kasten.setAttribute('data-frei', 'gegner');
    fach.appendChild(kasten);
  }

  /* Der Notarzettel haengt an dem Haus, um das gestritten wird — nicht an
     ihrem Buero. Wer ihn liest, sieht im selben Blick, wo es liegt. */
  function zeichneGebotZettel(fach) {
    var g = ep().gebot;
    if (!Z.gebot || !g) return;
    var a = adresse(Z.gebot.k);
    if (!a || !B.orte.hole(a.ort)) return;
    var rest = Math.max(0, Z.gebot.bis - Z.takt);
    var kb = B.el('div', 'gg-gzblock gg-gzgebot');
    kb.appendChild(B.el('div', 'gg-gzkopf', g.verb + ' · ' + a.name));
    kb.appendChild(B.el('div', 'gg-gzsatz', Z.gebot.name + ' wird verkauft. Ihr Gebot für '
      + 'den Ausschank: ' + B.welt.geld(Z.gebot.gebot) + ' · Notartermin in ' + rest
      + (rest === 1 ? ' Woche' : ' Wochen')));
    var gr = B.el('div', 'gg-gzreihe');
    gebotStufen().forEach(function (st) {
      gr.appendChild(B.knopf({
        text: st.name, zug: 'gegner:mitbieten:' + st.nr, preis: -st.preis,
        aus: !B.welt.kann(st.preis),
        titel: st.sagt + ' Geht es daneben, kommt die Bietungssicherheit zurück — '
             + 'bis auf ' + Math.round((g.notarteil || 0.12) * 100) + ' vom Hundert Notarkosten.',
        tu: function () { mitbieten(st.nr); }
      }));
    });
    kb.appendChild(gr);
    B.orte.setze(kb, a.ort, { anker: 'oben',
      dx: randDx(a.ort, 0, BREIT.block), dy: 9 });
    kb.setAttribute('data-frei', 'gegner');
    fach.appendChild(kb);
  }

  /* --- der graue Wagen, der die Strasse faehrt -------------------------- */
  function zeichneWagen(fach) {
    if (!Z.wagen) return;
    var w = Z.wagen;
    if (!B.orte.hole(w.von) || !B.orte.hole(w.nach)) return;
    var t = B.grenze((Z.takt - w.seit) / Math.max(1, w.dauer), 0, 1);
    var p = B.orte.zwischen(w.von, w.nach, t);
    var el = B.el('div', 'gg-wagen');
    var img = B.el('img', 'gg-wagenbild');
    img.src = BILD + ep().wagenbild + '.png';
    img.alt = '';
    el.appendChild(img);
    el.appendChild(B.el('span', 'gg-wagenzettel', 'Adler → ' + w.text));
    el.style.left = B.rund(p.x, 3) + '%';
    el.style.top = B.rund(p.y, 3) + '%';
    el.title = 'Ein grauer Wagen des Hauses gegenüber, unterwegs zum ' + w.text + '.';
    fach.appendChild(el);
  }

  /* --- der Zeigefinger: "das da, im Bild" ------------------------------- */
  function zeichneZeiger() {
    var fach = B.ebene('kopf', 'gegner');
    B.leere(fach);
    if (!Z.zeigt || !B.orte.hole(Z.zeigt)) return;
    var r = B.el('div', 'gg-zeiger');
    r.appendChild(B.el('i'));
    var o = B.orte.hole(Z.zeigt);
    var z = Z.zuege.filter(function (x) { return x.ort === Z.zeigt; })[0];
    r.appendChild(B.el('span', 'gg-zeigertext',
      o.name + (z ? ' · ' + z.jahr + ' W' + z.woche : '')));
    B.orte.setze(r, Z.zeigt, { anker: 'mitte' });
    r.setAttribute('data-frei', 'gegner');   /* der Zeigefinger muss zeigen */
    fach.appendChild(r);
  }

  /* Was eine Abloesung in dieser Zeit kostet — ohne dass jemand fragen muss. */
  function abloesespanne() {
    var l = [];
    Object.keys(Z.bindung).forEach(function (k) {
      var p = abloese(k);
      if (p !== null) l.push(p);
    });
    if (!l.length) {
      var e = ep().mittel.filter(function (m) { return !m.fest; });
      var a = offeneAdressen();
      if (!a.length || !e.length) return 'Ablösung: noch nichts gebunden';
      var min = grundwert(a[0], e[0]), max = min;
      a.forEach(function (x) {
        e.forEach(function (m) {
          var g = grundwert(x, m);
          if (g < min) min = g; if (g > max) max = g;
        });
      });
      return 'eine Bindung würde ' + B.welt.geld(min) + ' bis ' + B.welt.geld(max) + ' kosten';
    }
    l.sort(function (x, y) { return x - y; });
    return l.length === 1
      ? 'Ablösung: ' + B.welt.geld(l[0])
      : 'Ablösung ' + B.welt.geld(l[0]) + ' bis ' + B.welt.geld(l[l.length - 1]);
  }

  /* --- das Laufband: OHNE DICH GESCHEHEN -------------------------------- */
  function zeichneBand(fach) {
    var band = B.el('div', 'gg-band');
    var kopf = B.el('div', 'gg-bandkopf');
    kopf.appendChild(B.el('span', 'gg-bandtitel', 'Ohne dich geschehen'));
    kopf.appendChild(B.el('span', 'gg-bandzahl',
      Z.zaehler + (Z.zaehler === 1 ? ' Zug' : ' Züge')));
    if (Z.wocheZuege > 0) {
      var neu = B.el('span', 'gg-bandneu', 'diese Woche ' + Z.wocheZuege);
      neu.title = 'So viele Züge sind seit dem letzten Klick auf WEITER gefallen — '
        + 'ohne Ankündigung, ohne Rückfrage.';
      kopf.appendChild(neu);
    }
    kopf.appendChild(B.el('span', 'gg-bandluecke'));
    var auf = B.knopf({
      text: Z.offen ? 'Das Haus gegenüber schließen' : 'Das Haus gegenüber',
      zug: 'gegner:blatt',
      klasse: 'gg-klein',
      titel: 'Kasse, Erben, Hof und jede Bindung des Gegners — mit der Summe, die sie kostet.',
      tu: function () { schalteBlatt(null); }
    });
    kopf.appendChild(auf);
    band.appendChild(kopf);

    var wz = B.el('div', 'gg-bandwaehrung');
    wz.appendChild(B.el('b', null, 'Gebunden wird ' + (epNr() <= 2 ? 'hier' : 'jetzt') + ' mit '
      + ep().waehrung));
    wz.appendChild(B.el('span', null, abloesespanne()));
    band.appendChild(wz);

    /* Der Zug, der kein Geld kostet — er steht hier oben, damit man ihn auch
       bei leerer Kasse findet, ohne ein Blatt zu oeffnen. */
    var bs = ep().beschwerde;
    if (bs) {
      var bz = B.el('div', 'gg-bandklage');
      if (beschwerdeMoeglich()) {
        bz.appendChild(B.knopf({
          text: bs.name, zug: 'gegner:beschwerde', klasse: 'gg-klein',
          titel: bs.sagt + ' ' + bs.preis,
          tu: beschwerdeFuehren
        }));
        bz.appendChild(B.el('span', 'gg-ohnegeld', 'kostet kein Geld · vier Ansehen · einmal im Braujahr'));
      } else if (Z.beschwerdeJahr === jahr()) {
        bz.appendChild(B.el('span', 'gg-ohnegeld',
          bs.name + ': in diesem Braujahr schon geschehen'
          + (Z.beschwerdeAusgang && Z.beschwerdeAusgang.jahr === jahr()
             ? (Z.beschwerdeAusgang.gelingt ? ' — durchgedrungen' : ' — abgewiesen') : '')));
      } else {
        bz.appendChild(B.el('span', 'gg-ohnegeld',
          bs.name + ': erst, wenn er etwas hält oder um etwas wirbt'));
      }
      band.appendChild(bz);
    }

    if (Z.meldung) band.appendChild(B.el('div', 'gg-bandmeldung', Z.meldung));

    /* AUFLAGE 10, erste Haelfte — DER SATZ, DER NICHT MEHR GEKUERZT WIRD.

       `.gg-bandzeile .was` trug bis hierher `overflow:hidden` mit
       `text-overflow:ellipsis` und `white-space:nowrap`. Gemessen am
       Vorzustand, Ladezustand: 1772 px Satz in 731 px Kasten (1350),
       1588 in 731 (1600), 1092 in 731 (1884), 850 in 731 (1970); im
       gespielten Zustand bis 1652 in 731. Es fehlten also bis zu 60 % —
       und zwar ausgerechnet in dem Band, das erzaehlt, was der Gegner tat,
       waehrend man woanders hinsah. Ein Zaehler, der Ueberlauf misst,
       misst nicht Vollstaendigkeit: sauber gekuerzt besteht man ihn und
       zeigt trotzdem nichts.

       Jetzt UMBRICHT der Satz, statt zu enden. Damit das Brett dabei nicht
       waechst — es ist ohnehin schon 936 px breit —, rollt die Liste:
       `.gg-bandliste` hat eine feste Hoechsthoehe und `overflow-y:auto`.
       Ein Rollkasten zeigt alles, er kuerzt nur die Sicht; die vierte
       Latte zaehlt ihn ausdruecklich nicht als Abschnitt
       (`aufsicht/lesbarkeit.mjs`, `kappt()`). */
    var liste = B.el('div', 'gg-bandliste');
    var l = Z.zuege.slice(0, 3);
    if (!l.length) {
      liste.appendChild(B.el('div', 'gg-bandzeile leer',
        'Gegenüber ist es still. Das bleibt nicht so.'));
    }
    l.forEach(function (e) {
      var z = B.el('div', 'gg-bandzeile' + (e.takt >= Z.takt - 1 ? ' neu' : ''));
      z.appendChild(B.el('span', 'wann', e.jahr + ' W' + e.woche));
      z.appendChild(B.el('span', 'was', e.text));
      z.appendChild(B.knopf({
        text: 'zeigen', zug: 'gegner:zeige:' + e.nr, klasse: 'gg-winzig',
        titel: 'Zeigt im Bild, wo dieser Zug etwas verändert hat.',
        tu: function () {
          Z.zeigt = (Z.zeigt === e.ort) ? null : e.ort;
          neuZeichnen('gegner-zeigen');
        }
      }));
      liste.appendChild(z);
    });
    band.appendChild(liste);
    B.orte.setze(band, 'kopfleiste', { anker: 'oben', dx: 18, dy: 10.5 });
    /* Kein Ortszeichen, sondern die Liste selbst: "Ohne dich geschehen" ist
       die eine Zahl, die dieses Stueck zu zeigen hat. Sie ruht nie. */
    band.setAttribute('data-frei', 'gegner');
    fach.appendChild(band);
  }

  /* ======================================================================
     DAS BLATT — das ganze Haus gegenueber
     ====================================================================== */
  function karte(a, art) {
    var k = B.el('div', 'gg-karte ' + art);
    return k;
  }

  /* --- die drei Bloecke, die nicht zurueckgenommen werden koennen -------- */

  function zeichneAngebotBlock(bl) {
    if (!Z.angebot) return;
    var ab = ep().angebot || {};
    var rest = Math.max(0, (Z.angebot.bis || 0) - Z.takt);
    var abl = B.el('div', 'gg-block gg-fest');
    abl.appendChild(B.el('h3', null, (ab.frage
      || 'Die Nordstern-Gruppe fragt an — beide Antworten sind endgültig')
      + ' · noch ' + rest + (rest === 1 ? ' Woche' : ' Wochen')));
    var reihe = B.el('div', 'gg-reihe');
    var k1 = karte(null, 'angebot');
    k1.appendChild(B.el('div', 'gg-kname', ab.ja || 'Annehmen'));
    k1.appendChild(B.el('div', 'gg-ksatz', 'Sie bietet ' + B.welt.geld(Z.angebot.summe)
      + ' für ein Viertel des Hauses. ' + (ab.jasatz || '')));
    k1.appendChild(B.knopf({
      text: (ab.ja || 'Annehmen') + ' · ' + B.welt.geld(Z.angebot.summe),
      zug: 'gegner:angebot-ja-blatt', preis: Z.angebot.summe,
      titel: 'Unwiderruflich. Das Haus gehört danach nicht mehr ganz sich selbst.',
      tu: angebotAnnehmen
    }));
    reihe.appendChild(k1);
    var k2 = karte(null, 'angebot');
    k2.appendChild(B.el('div', 'gg-kname', ab.nein || 'Ausschlagen'));
    k2.appendChild(B.el('div', 'gg-ksatz', ab.neinsatz
      || 'Kein Geld. Die Gruppe listet das Haus noch am selben Tag bei zwei Adressen aus.'));
    k2.appendChild(B.knopf({
      text: ab.nein || 'Ausschlagen', zug: 'gegner:angebot-nein-blatt',
      titel: 'Unwiderruflich. Zwei Adressen sind sofort weg.',
      tu: angebotAblehnen
    }));
    reihe.appendChild(k2);
    var k3 = karte(null, 'angebot');
    k3.appendChild(B.el('div', 'gg-kname', 'Nicht antworten'));
    k3.appendChild(B.el('div', 'gg-ksatz', 'Kostet keinen Klick. Nach ' + rest
      + (rest === 1 ? ' weiteren Woche' : ' weiteren Wochen')
      + ' zieht sie die Anfrage zurück, nimmt sich dafür eine Adresse und fragt '
      + 'in ein paar Jahren wieder.'));
    reihe.appendChild(k3);
    abl.appendChild(reihe);
    bl.appendChild(abl);
  }

  function zeichneGebotBlock(bl) {
    var g = ep().gebot;
    if (!Z.gebot || !g) return;
    var a = adresse(Z.gebot.k);
    if (!a) return;
    var rest = Math.max(0, Z.gebot.bis - Z.takt);
    var gb = B.el('div', 'gg-block gg-fest');
    gb.appendChild(B.el('h3', null, g.verb + ' beim Notar — ' + a.name
      + ' · in ' + rest + (rest === 1 ? ' Woche' : ' Wochen') + ' wird unterschrieben'));
    gb.appendChild(B.el('div', 'gg-gsatz', Z.gebot.name + ' wird verkauft. ' + g.sagt
      + ' Ihr Gebot steht bei ' + B.welt.geld(Z.gebot.gebot) + '.'));
    var reihe = B.el('div', 'gg-reihe');
    gebotStufen().forEach(function (st) {
      var k = karte(a, 'gebot');
      k.appendChild(B.el('div', 'gg-kname', st.name));
      k.appendChild(B.el('div', 'gg-kzeile', Math.round(st.glueck * 100)
        + ' von 100 unterschreiben die Erben daraufhin an das Haus'));
      k.appendChild(B.el('div', 'gg-ksatz', st.sagt));
      k.appendChild(B.knopf({
        text: g.verb + ' · ' + B.welt.geld(st.preis),
        zug: 'gegner:mitbieten-blatt:' + st.nr, preis: -st.preis,
        aus: !B.welt.kann(st.preis),
        titel: 'Ein Gebot je Notartermin. Geht es daneben, kommt das Geld zurück — '
             + 'bis auf ' + Math.round((g.notarteil || 0.12) * 100) + ' vom Hundert Notarkosten.',
        tu: function () { mitbieten(st.nr); }
      }));
      reihe.appendChild(k);
    });
    gb.appendChild(reihe);
    bl.appendChild(gb);
  }

  function zeichneGegenzugBlock(bl) {
    var g = ep().gegenzug;
    var nr = B.welt.zeit.amtszeit.nr;
    var gb = B.el('div', 'gg-block gg-fest');
    gb.appendChild(B.el('h3', null,
      'Der Gegenzug — eine je Amtszeit, und er wird nicht zurückgenommen'));
    if (Z.gegenzugGetan[nr]) {
      gb.appendChild(B.el('div', 'gg-getan', g.name + ' — festgelegt in dieser Amtszeit. '
        + g.folge));
    } else if (Z.wirkung[g.k]) {
      gb.appendChild(B.el('div', 'gg-getan', g.name + ' steht bereits. ' + g.folge));
    } else {
      var gr = B.el('div', 'gg-reihe');
      var gk = karte(null, 'gegen');
      gk.appendChild(B.el('div', 'gg-kname', g.name));
      gk.appendChild(B.el('div', 'gg-ksatz', g.sagt));
      gk.appendChild(B.el('div', 'gg-kzeile stark', g.folge));
      gk.appendChild(B.knopf({
        text: 'Festlegen', zug: 'gegner:gegenzug', preis: -g.preis,
        aus: g.preis > 0 && !B.welt.kann(g.preis),
        titel: 'Eine je Amtszeit. Sie ändert eine Regel für den Rest der Partie.',
        tu: gegenzug
      }));
      gr.appendChild(gk);
      gb.appendChild(gr);
    }
    bl.appendChild(gb);
  }

  function zeichneBlatt(fach) {
    var bl = B.el('div', 'blatt gg-blatt');
    var h = haus(Z.seite) || haus('adler');
    if (!h || h.weg) h = haeuserJetzt()[0];
    if (!h) { Z.offen = false; return; }

    /* Kopf */
    var kopf = B.el('div', 'gg-bkopf');
    var t = B.el('div');
    t.appendChild(B.el('h2', null, nameVon(h)));
    t.appendChild(B.el('div', 'gg-unter', sitzVon(h).sagt + ' · ' + h.erbe.name
      + ', ' + h.erbe.nr + '. Geschlecht, ' + h.erbe.wesenName + ' — ' + h.erbe.sagt));
    kopf.appendChild(t);
    var reiter = B.el('div', 'gg-reiter');
    haeuserJetzt().forEach(function (x) {
      reiter.appendChild(B.knopf({
        text: nameVon(x), zug: 'gegner:seite:' + x.k, klasse: 'gg-klein'
          + (x.k === h.k ? ' an' : ''),
        tu: function () { Z.seite = x.k; neuZeichnen('gegner-seite'); }
      }));
    });
    reiter.appendChild(B.knopf({
      text: 'Schließen', zug: 'gegner:blatt-zu', klasse: 'gg-klein',
      tu: function () { Z.offen = false; neuZeichnen('gegner-zu'); }
    }));
    kopf.appendChild(reiter);
    bl.appendChild(kopf);

    /* GANZ OBEN, ehe irgendetwas gescrollt werden muss: was nicht
       zurueckgenommen werden kann. Bis Runde 2 standen diese Bloecke als
       fuenfter und sechster im Blatt; ein Blatt, das 75 % der Hoehe misst
       und mehr Inhalt hat, schiebt sie unter die Kante. Gemessen: der Knopf
       gegner:gegenzug lag in allen vier Epochen bei 93 bis 97 % der
       Bildhoehe und war von der Werkbank der STADT verdeckt — die eine
       unwiderrufliche Festlegung dieses Stuecks war mit der Maus nicht zu
       treffen, ohne vorher zu scrollen. */
    zeichneAngebotBlock(bl);
    zeichneGebotBlock(bl);
    zeichneGegenzugBlock(bl);

    /* Die Waehrung der Bindung — der Satz, den man ungefragt sagen koennen soll */
    var wk = B.el('div', 'gg-waehrung');
    wk.appendChild(B.el('div', 'gg-wtitel', 'Gebunden wird in dieser Zeit mit: '
      + ep().waehrung));
    wk.appendChild(B.el('div', 'gg-wsatz', ep().satz));
    wk.appendChild(B.el('div', 'gg-wsatz stark', ep().abloesesatz));
    var mittelzeile = B.el('div', 'gg-mittel');
    ep().mittel.forEach(function (m) {
      var mm = B.el('span', 'gg-mkarte' + (m.fest ? ' fest' : ''));
      mm.appendChild(B.el('b', null, m.name));
      mm.appendChild(B.el('i', null, (m.fest ? 'nicht ablösbar, solange er das Amt hat · '
        : '') + B.welt.geld(Math.round(jeEinheit(m.satz) * 10)) + ' je 10 '
        + B.welt.mengeEinheit() + ' Jahresbedarf · ' + m.jahre + ' Jahre · '
        + Math.round((m.abschlag || 0.15) * 100) + ' vom Hundert Abschlag'));
      mittelzeile.appendChild(mm);
    });
    wk.appendChild(mittelzeile);
    bl.appendChild(wk);

    /* Was er haelt — nebeneinander, jedes mit Preisschild */
    var halten = B.el('div', 'gg-block');
    halten.appendChild(B.el('h3', null, 'Was er hält — und was es kostet, es zurückzuholen'));
    var reihe = B.el('div', 'gg-reihe');
    var seins = seine(h);
    if (!seins.length) reihe.appendChild(B.el('div', 'gg-leer',
      'Zurzeit hält er keine Adresse. Das ist der Augenblick, in dem man baut.'));
    seins.forEach(function (a) {
      var b = Z.bindung[a.schluessel];
      if (!b) return;
      var m = mittelVon(b.mittel);
      var summe = abloese(a.schluessel);
      var kk = karte(a, 'halt');
      kk.appendChild(B.el('div', 'gg-kname', a.name));
      kk.appendChild(B.el('div', 'gg-kzeile', m.name + ' · seit ' + b.seit + ' · läuft bis ' + b.bis));
      if (ep().tilgung) {
        kk.appendChild(B.el('div', 'gg-kzeile',
          'Darlehen ' + B.welt.geld(b.grund + (b.zusatz || 0))
          + ' · getilgt seit ' + (jahr() - b.seit) + ' Jahren'));
      }
      kk.appendChild(B.el('div', 'gg-kzeile',
        'Solange er hält, bekommt das Haus dort ' + B.welt.geld(Math.round(jeEinheit(abschlagJeFass(a.schluessel))))
        + ' weniger je ' + B.welt.mengeEinheit() + ' — bei jeder Fuhre, sofort.'
        + (Z.abschlagJe[a.schluessel]
            ? ' In diesem Braujahr bisher ' + B.welt.geld(Z.abschlagJe[a.schluessel]) + '.'
            : '')
        + (Z.abschlagJeVorjahr[a.schluessel]
            ? ' Im Jahr ' + (Z.abschlagJahr - 1) + ' waren es '
              + B.welt.geld(Z.abschlagJeVorjahr[a.schluessel]) + '.'
            : '')));
      kk.appendChild(B.el('div', 'gg-ksatz', m.loest));
      if (summe === null) {
        kk.appendChild(B.el('div', 'gg-kfest', 'Nicht ablösbar. Erst muss das Amt weg.'));
      } else {
        kk.appendChild(B.knopf({
          text: 'Ablösen', zug: 'gegner:abloesen-blatt:' + a.schluessel,
          preis: -summe, aus: !B.welt.kann(summe),
          titel: m.loest + ' Danach rührt er die Adresse vier Jahre nicht an.',
          tu: function () { loeseAb(a.schluessel); }
        }));
      }
      /* Die billige Antwort daneben, in der anderen Waehrung. */
      if (ep().hinhalten) {
        kk.appendChild(B.knopf({
          text: ep().hinhalten.name + ' · ' + B.welt.menge(hinhaltFass()),
          zug: 'gegner:hinhalten-blatt:' + a.schluessel,
          aus: !hinhaltMoeglich(a.schluessel) || fassImKeller() < hinhaltFass(),
          titel: ep().hinhalten.satz + ' Kostet Bier, kein Geld — und bis Michaeli '
               + 'drückt er an dieser Adresse den Preis nicht mehr.',
          tu: function () { hinhalten(a.schluessel); }
        }));
      }
      reihe.appendChild(kk);
    });
    halten.appendChild(reihe);
    bl.appendChild(halten);

    /* Was er frueher hat als das Haus — und was ihm das einbringt */
    if (h.k === 'adler') {
      var vl = vorsprungListe(h);
      var vb = B.el('div', 'gg-block');
      var vor = vorsprung(h);
      vb.appendChild(B.el('h3', null, 'Was auf seinem Hof steht — und was davon das Haus nicht hat'));
      vb.appendChild(B.el('div', 'gg-vsatz', ep().hofsatz || ''));
      var vr = B.el('div', 'gg-vliste');
      if (!vl.length) {
        vr.appendChild(B.el('div', 'gg-leer', 'Auf seinem Hof steht nichts als der Kessel. Noch.'));
      }
      vl.forEach(function (x) {
        var z = B.el('div', 'gg-vzeile ' + x.stand);
        z.appendChild(B.el('span', 'was', x.bau.name));
        z.appendChild(B.el('span', 'satz', x.bau.nutzen || ''));
        z.appendChild(B.el('span', 'stand',
          x.stand === 'hat' ? 'auch im Haus'
          : x.stand === 'offen' ? 'im Haus zu kaufen — er hat es schon'
          : 'im Haus gibt es das nicht'));
        vr.appendChild(z);
      });
      vb.appendChild(vr);
      vb.appendChild(B.el('div', 'gg-vfolge', vor
        ? 'Sein Vorsprung: ' + vor + (vor === 1 ? ' Ding' : ' Dinge') + '. Darum braucht seine '
          + 'Werbung ' + vor + (vor === 1 ? ' Woche' : ' Wochen') + ' weniger, ehe eine Adresse '
          + 'gebunden ist. Das ist keine Ankündigung — es ist die Uhr am Wimpel.'
        : 'Kein Vorsprung: was auf seinem Hof steht, steht auch im eigenen. '
          + 'Seine Werbung braucht die volle Zeit.'));
      bl.appendChild(vb);
    }

    /* Der Zug, der kein Geld kostet */
    var bsd = ep().beschwerde;
    if (bsd) {
      var bb = B.el('div', 'gg-block');
      bb.appendChild(B.el('h3', null, 'Ohne Bargeld gegen ihn — einmal im Braujahr'));
      var br = B.el('div', 'gg-reihe');
      var bk = karte(null, 'klage');
      bk.appendChild(B.el('div', 'gg-kname', bsd.name));
      bk.appendChild(B.el('div', 'gg-ksatz', bsd.sagt));
      bk.appendChild(B.el('div', 'gg-kzeile stark', bsd.preis));
      if (Z.beschwerdeAusgang && Z.beschwerdeAusgang.jahr === jahr()) {
        bk.appendChild(B.el('div', 'gg-kzeile',
          (Z.beschwerdeAusgang.gelingt ? 'Durchgedrungen: ' : 'Abgewiesen: ')
          + Z.beschwerdeAusgang.satz));
      }
      bk.appendChild(B.knopf({
        text: Z.beschwerdeJahr === jahr() ? 'In diesem Braujahr schon geschehen' : bsd.name,
        zug: 'gegner:beschwerde-blatt',
        aus: !beschwerdeMoeglich(),
        titel: 'Kostet keinen Heller. Kostet vier Ansehen, und er zieht drei Wochen lang sicher.',
        tu: beschwerdeFuehren
      }));
      br.appendChild(bk);
      bb.appendChild(br);
      bl.appendChild(bb);
    }

    /* Worauf er zielt — und was es kostet, ihm zuvorzukommen */
    var zielt = Object.keys(Z.absicht).filter(function (k) { return !!adresse(k); });
    if (zielt.length) {
      var zb = B.el('div', 'gg-block');
      zb.appendChild(B.el('h3', null,
        'Worauf er gerade zielt — die Unterschrift fällt ohne Rückfrage'));
      var zr = B.el('div', 'gg-reihe');
      zielt.forEach(function (kk) {
        var a = adresse(kk);
        var s = Z.absicht[kk];
        var m = mittelVon(s.mittel);
        var abd = ep().absicht || {};
        var ka = karte(a, 'zielt');
        ka.appendChild(B.el('div', 'gg-kname', a.name));
        ka.appendChild(B.el('div', 'gg-kzeile', abd.text.replace('{haus}', a.name)));
        ka.appendChild(B.el('div', 'gg-kzeile', 'Es wird ' + m.name
          + ' · noch ' + Math.max(0, s.bis - Z.takt) + ' Wochen'));
        ka.appendChild(B.el('div', 'gg-ksatz',
          'Lässt man die Wochen laufen, unterschreibt der Wirt. Danach kostet die '
          + 'Ablösung ' + B.welt.geld(grundwert(a, m)) + ' statt ' + B.welt.geld(s.preis) + '.'));
        ka.appendChild(B.knopf({
          text: abd.abwehr || 'Zuvorkommen', zug: 'gegner:abwehren-blatt:' + kk,
          preis: -s.preis, aus: !B.welt.kann(s.preis),
          titel: abd.abwehrsatz || 'Jetzt binden, ehe er unterschreibt.',
          tu: function () { abwehren(kk); }
        }));
        if (ep().hinhalten) {
          ka.appendChild(B.knopf({
            text: ep().hinhalten.name + ' · ' + B.welt.menge(hinhaltFass()),
            zug: 'gegner:hinhalten-blatt:' + kk,
            aus: !hinhaltMoeglich(kk) || fassImKeller() < hinhaltFass(),
            titel: ep().hinhalten.satz + ' Kostet Bier, kein Geld — und schiebt ihn '
                 + (ep().hinhalten.wochen || 3) + ' Wochen hinaus.',
            tu: function () { hinhalten(kk); }
          }));
        }
        zr.appendChild(ka);
      });
      zb.appendChild(zr);
      bl.appendChild(zb);
    }

    /* Worum er wirbt */
    var wirbt = Object.keys(Z.werbung);
    if (wirbt.length) {
      var wb = B.el('div', 'gg-block');
      wb.appendChild(B.el('h3', null, 'Worum er gerade wirbt — die Uhr läuft ohne dich'));
      var wr = B.el('div', 'gg-reihe');
      wirbt.forEach(function (k) {
        var a = adresse(k); if (!a) return;
        var w = Z.werbung[k];
        var m = mittelVon(w.mittel);
        var kk = karte(a, 'wirbt');
        kk.appendChild(B.el('div', 'gg-kname', a.name));
        kk.appendChild(B.el('div', 'gg-kzeile', 'Er will ' + m.name
          + ' · noch ' + Math.max(0, w.bis - Z.takt) + ' Wochen'));
        kk.appendChild(B.el('div', 'gg-ksatz',
          'Lässt man die Wochen laufen, bindet er ohne weitere Frage. '
          + 'Danach kostet es ' + B.welt.geld(grundwert(a, m)) + ' statt ' + B.welt.geld(w.preis) + '.'));
        kk.appendChild(B.knopf({
          text: 'Zuvorkommen', zug: 'gegner:zuvorkommen-blatt:' + k,
          preis: -w.preis, aus: !B.welt.kann(w.preis),
          titel: 'Jetzt binden, ehe er es tut. Drei Jahre Ruhe an dieser Adresse.',
          tu: function () { zuvorkommen(k); }
        }));
        wr.appendChild(kk);
      });
      wb.appendChild(wr);
      bl.appendChild(wb);
    }

    /* Sein Hof und seine Lage */
    var lb = B.el('div', 'gg-block');
    lb.appendChild(B.el('h3', null, 'Sein Hof, seine Kasse, seine Lage'));
    var lz = B.el('div', 'gg-lage');
    lz.appendChild(B.el('span', null, 'Kasse (was man hört): '
      + B.welt.geld(Math.round(h.kasse / 10) * 10)));
    lz.appendChild(B.el('span', h.preis < bierpreis() ? 'warn' : null,
      'Sein Preis: ' + B.welt.geld(h.preis) + ' je ' + B.welt.mengeEinheit()
      + ' — der Satz: ' + B.welt.geld(bierpreis())
      + (h.preis < bierpreis()
         ? ' · er unterbietet, und darum drückt er den Abschlag um '
           + Math.round((preisdruck() - 1) * 100) + ' vom Hundert hoch'
         : '')));
    lz.appendChild(B.el('span', null, 'Adressen: ' + seins.length));
    lz.appendChild(B.el('span', null, 'Züge bisher: ' + h.zuege));
    lz.appendChild(B.el('span', null, 'Lage: ' + (D.untergang[h.stufe] || D.untergang[0]).name));
    if (Z.abschlag) {
      lz.appendChild(B.el('span', 'warn', 'Sein Abschlag hat das Haus in diesem Braujahr '
        + B.welt.geld(Z.abschlag) + ' gekostet — bei ' + B.welt.geld(Z.umsatzJahr)
        + ' Einnahmen. Mehr als drei vom Hundert nimmt er nicht.'));
    } else if (Z.abschlagVorjahr) {
      lz.appendChild(B.el('span', 'warn', 'Sein Abschlag kostete das Haus im Jahr '
        + (Z.abschlagJahr - 1) + ' ' + B.welt.geld(Z.abschlagVorjahr) + '.'));
    }
    lb.appendChild(lz);
    var bauten = B.el('div', 'gg-hofliste');
    var nm = {};
    ep().bauten.forEach(function (b) { nm[b.k] = b.name; });
    h.bauten.forEach(function (bk) {
      bauten.appendChild(B.el('span', 'gg-hofding', nm[bk] || bk));
    });
    if (!h.bauten.length) bauten.appendChild(B.el('span', 'gg-hofding', 'Nichts als der Kessel.'));
    lb.appendChild(bauten);
    bl.appendChild(lb);

    /* Alles, was ohne den Spieler geschah */
    var zb = B.el('div', 'gg-block');
    zb.appendChild(B.el('h3', null, 'Ohne dich geschehen — ' + Z.zaehler
      + (Z.zaehler === 1 ? ' Zug, er hat' : ' Züge, jeder hat') + ' einen Ort im Bild'));
    var rolle = B.el('div', 'gg-rolle rolle');
    Z.zuege.slice(0, 40).forEach(function (e) {
      var z = B.el('div', 'gg-zzeile');
      z.appendChild(B.el('span', 'wann', e.jahr + ' W' + e.woche));
      z.appendChild(B.el('span', 'art', artName(e.art)));
      z.appendChild(B.el('span', 'was', e.text));
      z.appendChild(B.knopf({
        text: 'zeigen', zug: 'gegner:zeige-blatt:' + e.nr, klasse: 'gg-winzig',
        tu: function () {
          Z.zeigt = (Z.zeigt === e.ort) ? null : e.ort;
          Z.offen = false;
          neuZeichnen('gegner-zeigen');
        }
      }));
      rolle.appendChild(z);
    });
    if (!Z.zuege.length) rolle.appendChild(B.el('div', 'gg-zzeile', 'Noch nichts.'));
    zb.appendChild(rolle);
    bl.appendChild(zb);

    if (Z.meldung) bl.appendChild(B.el('div', 'gg-meldung', Z.meldung));
    fach.appendChild(bl);

    /* AUFLAGE 7 DES RAHMENS (Welle 10, ARBEITSSTAND): jedes ganzseitige
       Blatt meldet sich an, WENN es aufschlaegt. Der Rahmen darf waehrend
       des Spielens nichts auf einer Frist tun — eine Anmeldung ist ein
       Ereignis und kostet nichts, solange nichts aufschlaegt.
       Dieses Blatt hat einen eigenen Schliessknopf (`gegner:blatt-zu`) und
       eine eigene Escape-Taste; die Anmeldung sorgt dafuer, dass die
       Blattaufsicht den Griff findet, statt klemmen zu muessen —
       `BRAUHAUS.haushalt.geklemmt()` bleibt leer. */
    if (B.blatt && B.blatt.melde) {
      B.blatt.melde(bl, function () { Z.offen = false; neuZeichnen('gegner-aufsicht'); });
    }
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */
  BRAUHAUS.stueck('gegner', {

    aufbau: function () {
      Z.epoche = epNr();
      Z.takt = takt();
      B.welt.gegner.forEach(function (g) { bauePartei(g); });
      uebernehmeAusgangslage();
      /* Sein erster Zug faellt, ehe der Spieler das erste Mal hinsieht.
         Von der ersten Sekunde an laeuft irgendwo eine Uhr, die ihm gehoert. */
      B.wage('gegner.ersterZug', function () {
        Z.takt = takt();
        var a = haus('adler');
        /* Wirbt er schon so viel, wie er halten kann, wirbt er nicht — dann
           soll trotzdem etwas geschehen sein. Auf dem ERSTEN Bildschirm darf
           die Zeile "Ohne dich geschehen" nie auf null stehen. */
        if (a && !zugWerben(a)) zieht(a);
      });
      /* Das Buch mithoeren: der Abschlag wird bei der Lieferung abgezogen,
         nicht am Jahresende nachgereicht. */
      B.auf('protokoll', function (p) {
        B.wage('gegner.buch', function () { hoereBuch(p); });
      });
      Z.beschwerdeJahr = 0;
      Z.bereit = true;
      B.welt.schreibe('Gegenüber steht ' + nameVon(haus('adler')) + '. '
        + haus('adler').erbe.name + ' führt es. Gebunden wird in dieser Zeit mit '
        + ep().waehrung + '.', 'gegner');
      B.ton.melde('gegner:werben', { art: 'geraeusch', sagt: 'Fremder Karren im Hof' });
    },

    woche: function () {
      B.wage('gegner.woche', wocheLaeuft);
    },

    jahr: function () {
      B.wage('gegner.jahr', jahrLaeuft);
      Z.takt = takt();
    },

    epoche: function (d) {
      Z.epoche = d.epoche;
      /* Was in der alten Zeit angebahnt war, wird in der neuen nicht
         unterschrieben: eine Absicht auf einen Ratsspruch hat 1884 keinen
         Adressaten mehr. Das Hinhalten laeuft mit dem Braujahr ohnehin ab. */
      Z.absicht = {};
      /* Sein Preis rechnet sich in der neuen Waehrung neu. */
      haeuserJetzt().forEach(function (h) {
        h.preis = bierpreis();
        var b = ep().bauten;
        while (h.bauten.length && !b.some(function (x) { return x.k === h.bauten[0]; })) {
          h.bauten.shift();
        }
        for (var i = 0; i < 2 && i < b.length; i++) {
          if (h.bauten.indexOf(b[i].k) < 0) h.bauten.push(b[i].k);
        }
        h.marken = {};
      });
      /* Neue Parteien, die es vorher nicht gab. */
      B.welt.gegnerJetzt().forEach(function (g) {
        if (!Z.haeuser[g.schluessel]) bauePartei(g);
      });
      var a = haus('adler');
      if (a && d.epoche === 3) {
        B.welt.schreibe('Der Adler verlässt die Stadt und baut jenseits des Flusses, '
          + 'am Gleis. Am Markt bleibt das leere Stammhaus stehen.', 'gegner');
      }
      B.welt.schreibe('Eine neue Währung der Bindung: ' + ep().waehrung + '. '
        + ep().abloesesatz, 'gegner');
    },

    erbfall: function () {
      Z.meldung = null;
    },

    zeichne: function () {
      var fach = B.ebene('marken', 'gegner');
      B.leere(fach);
      if (!Z.bereit) return;
      Z.takt = takt();

      /* Zuerst rechnen, dann malen: die Kennzahl der zweiten Messlatte steht
         mit im Bild und darf nicht eine Woche alt sein. */
      meldeZug();

      haeuserJetzt().forEach(function (h) {
        zeichneHof(fach, h);
        zeichneSitz(fach, h);
      });
      zeichneNebenzeichen(fach);
      zeichneAdressen(fach);
      zeichneZugmarken(fach);
      zeichneKlage(fach);
      zeichneAngebotZettel(fach);
      zeichneGebotZettel(fach);
      zeichneWagen(fach);
      zeichneZeiger();
      zeichneBand(fach);
      zeichneKennzahl(fach);

      /* Solange die Michaelitafel offen ist, gehoert der Bildschirm ihr. */
      var blatt = B.ebene('blatt', 'gegner');
      B.leere(blatt);
      if (Z.offen && !document.querySelector('[data-zug="preis:tafel-zu"]')) zeichneBlatt(blatt);
    }
  });

  /* GLAETTUNG WELLE 1: Jedes andere Blatt im Spiel geht mit Escape zu — die
     Chronik und das Buch des Kerns, die Georgi-Tafel der FUHRE. Nur das Haus
     gegenueber blieb stehen. Ein Spieler lernt eine Taste einmal; sie muss
     dann ueberall gelten. (Die gemeinsame Sperrschicht bleibt Kernaufgabe
     der Welle 2, ZUSTAENDIGKEIT §2 — das hier ist die eigene Tuer.) */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !Z.offen) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    Z.offen = false;
    neuZeichnen('gegner-escape');
  });

  /* Fuer die Konsole des Kritikers: BRAUHAUS.gegner.zuege() */
  B.gegner = {
    zuege: function () { return Z.zuege.slice(); },
    zahl: function () { return Z.zaehler; },
    lage: function () { return Z; }
  };

})(BRAUHAUS);
