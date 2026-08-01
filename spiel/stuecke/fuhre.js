/* ===========================================================================
   stuecke/fuhre.js — DIE FUHRE.
   Die Woche, die man dreissigmal im Braujahr bedient, und die Knappheit,
   die nie Geld ist.

   DER TAKT
     1. Der Sud faellt von selbst, nach der Anschlagtafel. Man stellt ihn ein,
        man spielt ihn nicht.
     2. Die Faesser landen abzaehlbar im Keller, jedes mit Sorte und Braudatum.
     3. Der Wagen hat wenige Plaetze. Jedes Fass bekommt ein Haus.
     4. Fuhre abschicken = die Woche ist vorbei.
     5. Wer nicht beliefert wird, dessen Reihe faellt — drei Jahre lang, dann
        ist die Adresse weg, ohne dass jemand sie genommen hat.
     6. Zu Georgi wird die Tafel gewischt. Der Aprilbestand ist der ganze
        Sommer, und der laeuft ohne Hand ab.

   WAS HIER NIE PASSIERT
     Kein Schieberegler. Eine Sorte belegt Brautage und Fassplaetze, nicht
     bloss eine Reichweite — sonst waere Exportbier immer die Antwort.

   UND: DIE KASSE IST NIE DIE WAND
     Ein Brauhaus mit leerer Kasse hoert nicht auf zu brauen — es braut
     schlechter. Drei Wege stehen offen, alle drei historisch, keiner davon
     Geld:
       · DER NOTSUD. Der zweite Guss auf dieselben Treber: null Barauslage,
         null Rohstoff, kein Tag der Jahresverleihung — nur die Pfanne.
         Wenig Fass, zwei Wochen haltbar, unterste Stufe. Die Pfanne steht
         nie kalt, weil kein Geld da ist. Faellt der geplante Sud an der
         Kasse, setzt der Braumeister von selbst den Notsud an.
       · DAS KERBHOLZ. Der Spieler darf anschreiben lassen, in ganzen
         Kerben. Zu Georgi wird geloescht; was offen bleibt, nimmt sich der
         Glaeubiger in Brautagen, Suden der Reihe, Eis oder Regalmetern.
         Schulden kosten hier also die knappe Sache, nicht Zins.
       · DER RUECKVERKAUF. Grut, Hopfen, Kontrakt gehen zum Bruchteil an den
         Haendler zurueck. Bar auf die Hand, und die Kammer ist leer.
     Das Ende dieses Hauses ist deshalb nie die leere Kasse, sondern das
     leere Auftragsbuch: wenn keine Adresse der Stadt mehr Bier des Hauses
     fuehrt, ist es vorbei.

   BESITZSTAND: stuecke/fuhre*.js · stil/fuhre*.css · bild/fuhre/** · ton/fuhre/**
   =========================================================================== */

(function (B) {
  'use strict';

  var D = window.FUHRE_DATEN;

  /* ----------------------------------------------------------------------
     ZUSTAND DES STUECKS. Alles, was welt.js nicht kennt, wohnt hier.
     ---------------------------------------------------------------------- */
  var Z = {
    epoche: 0,
    plan: {},            /* sortenschluessel -> Sude je Woche               */
    budget: 0,           /* Brautage (1350) bzw. Sude der Reihe (1600)      */
    sudeJeWoche: 0,
    faesser: 0,          /* eigene Faesser insgesamt — die Fassplaetze      */
    umlauf: [],          /* [{faellig, n}] Faesser beim Wirt                */
    draussen: 0,
    eis: 0, eisKeller: 0,
    fracht: 'stueck',
    halte: 0,
    bann: {},            /* adr -> Jahr des Bannbriefs                      */
    listung: {},         /* adr -> {sorte: true}                            */
    listungLeer: {},     /* adr -> Jahre ohne Lieferung trotz Listung        */
    durst: {},           /* adr -> Fass, die das Haus jetzt will            */
    leer: {},            /* adr -> Wochen ohne Lieferung                    */
    mahnung: {},         /* adr -> 0..3 magere Jahre in Folge               */
    verloren: {},        /* adr -> {jahr, fremd}                            */
    fremdBeiMahnung: {}, /* stand der Gegner schon da, als es anfing?       */
    ladung: [],          /* [{adr, faesser:[]}] — der beladene Wagen        */
    vorige: null,        /* Verteilung der letzten Fuhre                    */
    zettel: null,
    sommer: null,
    sommerOffen: false,
    kaufNr: {},
    bannNr: 0,
    unterhaltExtra: 0,
    jahrUmsatz: 0,
    fuhren: 0,
    meldung: null,
    sudMeldung: null,
    tafelGewischt: false,
    kerben: 0,           /* offene Kerben auf dem Kerbholz                  */
    kerbAbzug: 0,        /* was der Glaeubiger dem neuen Jahr abgenommen hat */
    kerbGeorgi: null,    /* Abrechnung fuers Georgi-Blatt                    */
    notsud: 0,           /* Notsude DIESER Woche, vom Braumeister gesetzt    */
    notGesamt: 0,        /* Notsude im laufenden Braujahr                    */
    notGemeldet: false,
    endeGemeldet: false
  };

  /* ----------------------------------------------------------------------
     KLEINES HANDWERK
     ---------------------------------------------------------------------- */
  function ep() { return D.epochen[B.welt.zeit.epoche] || D.epochen[1]; }
  function sorten() { return ep().sorten; }
  function art(a) { return D.arten[a.art] || D.arten.wirtshaus; }
  function kurz(a) { return D.kurz[a.schluessel] || a.schluessel.slice(0, 3).toUpperCase(); }

  function sorteVon(k) {
    var l = sorten();
    for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i];
    return null;
  }

  /* Ein Fass aus einer frueheren Epoche behaelt seine Stufe, nicht seinen
     Namen. So ueberlebt der Keller einen Epochenwechsel. */
  function sorteFass(f) {
    return sorteVon(f.k) || (function () {
      var l = sorten();
      for (var i = 0; i < l.length; i++) if (l[i].stufe === (f.stufe || 2)) return l[i];
      return l[1] || l[0];
    }());
  }

  function budgetFeld() { return ep().budget ? ep().budget.feld : null; }

  /* Was ein Sud der JAHRESVERLEIHUNG kostet — Brautage beim Rat, Sude bei der
     Zunft. Der Notsud kostet sie NICHT: Nachbier ist im Buch des Rats kein
     Bier. Genau daran haengt, dass eine leere Kasse die Pfanne nie kalt
     stellt. */
  function budgetKosten(s) {
    if (s && s.not) return 0;
    var f = budgetFeld();
    return f ? (s[f] || 1) : 0;
  }

  /* Was ein Sud DIE WOCHE kostet: die Pfanne steht denselben Tag am Feuer,
     ob Grutbier oder Kofent. Das ist die Schranke, die auch fuer den Notsud
     gilt — sonst waere er unbegrenzt und damit die Antwort auf alles. */
  function pfannenKosten(s) {
    var f = budgetFeld();
    return f ? (s[f] || 1) : 1;
  }

  /* Der Notsud dieser Epoche: Kofent · Nachbier · Einfachbier · Handelsmarke */
  function notSorte() {
    var l = sorten();
    for (var i = 0; i < l.length; i++) if (l[i].not) return l[i];
    return null;
  }
  function echteSorten() {
    return sorten().filter(function (s) { return !s.not; });
  }

  /* ----------------------------------------------------------------------
     DAS KERBHOLZ — anschreiben lassen
     Der Glaeubiger schneidet ganze Kerben und zahlt sie aus. Was zu Georgi
     offen bleibt, nimmt er sich in der knappen Sache dieser Zeit. Deshalb
     ist eine Schuld hier kein Geldproblem, sondern ein Verlust an Brautagen,
     Suden der Reihe, Eis oder Regalmetern.
     ---------------------------------------------------------------------- */
  function kerbholz() { return ep().kerbholz || null; }
  function kerbFrei() {
    var kh = kerbholz();
    return kh ? Math.max(0, kh.kerben - Z.kerben) : 0;
  }
  function kerbDeckung() {
    var kh = kerbholz();
    return kh ? kerbFrei() * kh.jeKerbe : 0;
  }
  /* Wie viele Kerben ein Betrag braucht, den die Kasse nicht traegt. */
  function kerbenFuer(betrag) {
    var kh = kerbholz();
    if (!kh || B.welt.kann(betrag)) return 0;
    var fehlt = betrag - Math.max(0, B.welt.haus.kasse);
    return Math.ceil(fehlt / kh.jeKerbe);
  }
  function kannBezahlen(betrag) {
    if (B.welt.kann(betrag)) return true;
    var n = kerbenFuer(betrag);
    return !!n && n <= kerbFrei();
  }
  /* Der einzige Weg, in diesem Stueck etwas zu bezahlen. Reicht die Kasse
     nicht, laesst das Haus anschreiben — solange Kerben frei sind. */
  function zahleOderKerbe(betrag, was) {
    if (B.welt.kann(betrag)) return B.welt.zahle(betrag, was, 'spieler');
    var kh = kerbholz();
    if (!kh) return false;
    var n = kerbenFuer(betrag);
    if (!n || n > kerbFrei()) return false;
    Z.kerben += n;
    B.welt.nimm(n * kh.jeKerbe,
      kh.kurz + ': ' + n + (n === 1 ? ' Kerbe' : ' Kerben') + ' geschnitten', 'spieler');
    B.ton.spiele('fuhre:kerbe', { ort: 'hof', laut: 0.5 });
    return B.welt.zahle(betrag, was, 'spieler');
  }
  /* Was am Knopf steht, wenn er auf Kerbe geht — der Preis bleibt sichtbar,
     die Waehrung wechselt. */
  function kerbZusatz(betrag) {
    var n = kerbenFuer(betrag);
    if (!n || n > kerbFrei()) return '';
    return ' · auf ' + n + (n === 1 ? ' Kerbe' : ' Kerben');
  }
  function kerbTitel(betrag) {
    var kh = kerbholz(), n = kerbenFuer(betrag);
    if (!kh || !n) return '';
    if (n > kerbFrei()) {
      return ' ' + kh.name + ': nur noch ' + kerbFrei() + ' von ' + kh.kerben
        + ' Kerben frei — das reicht nicht.';
    }
    return ' Die Kasse reicht nicht: das geht auf ' + n + (n === 1 ? ' Kerbe' : ' Kerben')
      + ' beim ' + kh.name + '. ' + kh.pfand.sagt;
  }
  function loeseKerbe() {
    var kh = kerbholz();
    if (!kh || !Z.kerben) return;
    if (!B.welt.zahle(kh.jeKerbe, 'Eine Kerbe geloescht · ' + kh.name, 'spieler')) {
      Z.meldung = 'Eine Kerbe zu loeschen kostet ' + B.welt.geld(kh.jeKerbe) + '.';
      B.sende('zeichne', { grund: 'fuhre-kerbe' });
      return;
    }
    Z.kerben -= 1;
    B.ton.spiele('fuhre:kerbe', { ort: 'hof', laut: 0.35 });
    B.sende('zeichne', { grund: 'fuhre-kerbe' });
  }

  /* Der dritte Weg: Rohstoff zurueck an den Haendler. Bar auf die Hand,
     zum Bruchteil des Einkaufs — und die Kammer ist danach leer. */
  function verkaufeRohstoff(def) {
    if (!def || !def.rueck) return;
    if (B.welt.haus.rohstoff < def.menge) return;
    var erloes = Math.max(1, Math.round(def.basis * def.rueck));
    B.welt.haus.rohstoff -= def.menge;
    B.welt.nimm(erloes, (def.rtext || 'Rohstoff zurueck').split(' ·')[0]
      + ' · ' + def.menge + ' ' + (B.welt.epoche().rohstoff || 'Rohstoff'), 'spieler');
    Z.meldung = def.menge + ' ' + (B.welt.epoche().rohstoff || 'Rohstoff')
      + ' zurueck an den Haendler — ' + B.welt.geld(erloes) + ' bar, '
      + B.welt.geld(def.basis) + ' hat es gekostet.';
    B.ton.spiele('fuhre:kauf', { ort: 'hof' });
    B.sende('zeichne', { grund: 'fuhre-rueckverkauf' });
  }

  /* Preis je Fass — DER PREIS setzt den Multiplikator, DIE FUHRE die Sorte. */
  function preisMult() {
    var e = B.welt.zeit.epoche;
    var p = B.welt.haus.preis;
    var t = (typeof PREIS_DATEN !== 'undefined' && PREIS_DATEN.epochen) ? PREIS_DATEN.epochen[e] : null;
    if (!p || !t || !t.mitte) return 1;
    return B.grenze(p / t.mitte, 0.45, 2.2);
  }

  function preisJeFass(s, a) {
    return Math.max(1, Math.round(s.preis * preisMult() * (a ? art(a).faktor : 1)));
  }

  /* Anzeige je Hektoliter ab 1872, sonst je Fass — Sperrliste. */
  function preisJeEinheit(s, a) {
    var p = preisJeFass(s, a);
    if (B.welt.zeit.jahr >= 1872) p = p / (B.welt.LITER_JE_FASS / 100);
    return Math.max(1, Math.round(p));
  }

  function staffelPreis(k, basis, staffel) {
    return Math.max(1, Math.round(basis * Math.pow(staffel || 1, Z.kaufNr[k] || 0)));
  }

  /* ----------------------------------------------------------------------
     DIE HAEUSER
     ---------------------------------------------------------------------- */
  function haeuser() {
    return B.welt.adressenJetzt().filter(function (a) { return !Z.verloren[a.schluessel]; });
  }
  function alleHaeuser() { return B.welt.adressenJetzt(); }

  function jahresbedarf(a) { return Math.max(1, Math.round(a.bedarf * ep().mengenfaktor)); }
  function wochenbedarf(a) { return jahresbedarf(a) * ep().winteranteil / B.uhr.WOCHEN_IM_JAHR; }
  function durst(a) { return Z.durst[a.schluessel] || 0; }

  function nimmt(a, s) { return art(a).stufen.indexOf(s.stufe) >= 0; }

  /* Warum ein Haus diese Woche kein Fass bekommen kann. Der Grund steht am
     Knopf — er ist in jeder Epoche ein anderer, und genau das ist der Punkt. */
  function sperre(a) {
    var e = ep();
    if (Z.verloren[a.schluessel]) return 'Aufgegeben. Diese Adresse ist weg.';
    if (e.bannmeile && a.km > e.bannmeile && !Z.bann[a.schluessel]) {
      return 'Außerhalb der Bannmeile (' + e.bannmeile + ' Meile). Ohne Bannbrief des Rats fährt hier kein Fass.';
    }
    if (e.listung && !gelistet(a)) {
      return 'Nicht gelistet. Ohne Regalmeter nimmt der Einkauf keine Ware an.';
    }
    return null;
  }

  function gelistet(a) {
    var l = Z.listung[a.schluessel];
    if (!l) return false;
    for (var k in l) if (l[k]) return true;
    return false;
  }

  function gelistetFuer(a, s) {
    if (!ep().listung) return true;
    /* Der Notsud laeuft unter dem Etikett des Haendlers und braucht deshalb
       keinen eigenen Regalmeter — er braucht nur ein Regal. Genau darum ist
       er in 1970 der Weg zurueck: kein Name, aber ein Absatz. */
    if (s && s.not) return gelistet(a);
    var l = Z.listung[a.schluessel];
    return !!(l && l[s.k]);
  }

  /* ----------------------------------------------------------------------
     DER KELLER
     ---------------------------------------------------------------------- */
  function keller() { return B.welt.vorrat.faesser; }

  function alter(f) { return B.welt.fassAlter(f); }
  function reif(f) { return alter(f) >= (f.reife || 0); }

  function reserviert() {
    var s = [];
    Z.ladung.forEach(function (l) { l.faesser.forEach(function (f) { s.push(f); }); });
    return s;
  }

  function freieFaesser() {
    var res = reserviert();
    return keller().filter(function (f) { return reif(f) && res.indexOf(f) < 0; });
  }

  /* Aeltestes passendes Fass zuerst — wer hortet, verliert es an den Verfall. */
  function waehleFass(a) {
    var frei = freieFaesser();
    var beste = null, besteAlter = -1;
    for (var i = 0; i < frei.length; i++) {
      var f = frei[i], s = sorteFass(f);
      if (!nimmt(a, s)) continue;
      if (!gelistetFuer(a, s)) continue;
      var al = alter(f);
      if (al > besteAlter) { beste = f; besteAlter = al; }
    }
    return beste;
  }

  function fassplaetzeFrei() {
    return Math.max(0, Z.faesser - keller().length - Z.draussen);
  }

  /* ----------------------------------------------------------------------
     DER WAGEN
     ---------------------------------------------------------------------- */
  function frachtstufe() {
    var f = ep().fracht;
    if (!f) return null;
    for (var i = 0; i < f.length; i++) if (f[i].k === Z.fracht) return f[i];
    return f[0];
  }

  function wagenPlaetze() {
    var fr = frachtstufe();
    return fr ? fr.fass : ep().wagen.fass;
  }

  function geladen() {
    var n = 0;
    Z.ladung.forEach(function (l) { n += l.faesser.length; });
    return n;
  }

  function geladenFuer(k) {
    for (var i = 0; i < Z.ladung.length; i++) if (Z.ladung[i].adr === k) return Z.ladung[i].faesser.length;
    return 0;
  }

  function fuhrlohn() {
    var e = ep(), w = e.wagen;
    if (!Z.ladung.length) return 0;
    var maxKm = 0, summeKm = 0;
    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      if (!a) return;
      if (a.km > maxKm) maxKm = a.km;
      summeKm += a.km;
    });
    var fr = frachtstufe();
    if (fr) {
      return Math.round(fr.pauschale + fr.jeFass * geladen() + fr.jeKm * maxKm);
    }
    var halt = (w.haltPreis || 0) * Math.max(0, Z.ladung.length - 1);
    return Math.round(w.grund + halt + w.jeKm * maxKm + w.jeKm * 0.12 * (summeKm - maxKm));
  }

  function fuhrerloes() {
    var summe = 0;
    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      l.faesser.forEach(function (f) { summe += preisJeFass(sorteFass(f), a); });
    });
    return Math.round(summe);
  }

  /* ----------------------------------------------------------------------
     LADEN UND ENTLADEN — der eine Handgriff der Woche
     ---------------------------------------------------------------------- */
  function kannLaden(a) {
    var g = sperre(a);
    if (g) return g;
    if (geladen() >= wagenPlaetze()) return 'Der Wagen ist voll. ' + B.welt.menge(wagenPlaetze()) + ' und kein Fass mehr.';
    if (geladenFuer(a.schluessel) === 0 && Z.ladung.length >= (frachtstufe() ? ep().wagen.halte : ep().wagen.halte)) {
      return 'Keine Halte frei. Diese Tour fährt ' + ep().wagen.halte + ' Adressen an.';
    }
    if (!waehleFass(a)) {
      var frei = freieFaesser().length;
      if (!frei) return 'Der Keller ist leer. Es liegt kein reifes Fass da.';
      return art(a).wort + ': nimmt keine der Sorten, die reif im Keller liegen.';
    }
    return null;
  }

  function lade(a) {
    var e = ep(), schritt = e.wagen.schritt, gelegt = 0;
    var eintrag = null;
    for (var i = 0; i < Z.ladung.length; i++) if (Z.ladung[i].adr === a.schluessel) eintrag = Z.ladung[i];
    for (var n = 0; n < schritt; n++) {
      if (geladen() >= wagenPlaetze()) break;
      var f = waehleFass(a);
      if (!f) break;
      if (!eintrag) { eintrag = { adr: a.schluessel, faesser: [] }; Z.ladung.push(eintrag); }
      eintrag.faesser.push(f);
      gelegt++;
    }
    if (gelegt) B.ton.spiele('fuhre:fass-rollen', { ort: 'fasslager', laut: 0.5 });
    B.sende('zeichne', { grund: 'fuhre-laden' });
  }

  function entlade(a) {
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr !== a.schluessel) continue;
      var schritt = ep().wagen.schritt;
      Z.ladung[i].faesser.splice(Math.max(0, Z.ladung[i].faesser.length - schritt), schritt);
      if (!Z.ladung[i].faesser.length) Z.ladung.splice(i, 1);
      break;
    }
    B.sende('zeichne', { grund: 'fuhre-entladen' });
  }

  function leereWagen() {
    Z.ladung = [];
    B.sende('zeichne', { grund: 'fuhre-leer' });
  }

  /* Eine Faustregel des Fuhrmanns, kein Rat: die Durstigsten zuerst, und
     kein neuer Halt, dessen Weg mehr kostet, als er einbringt. Die teuren
     Entscheidungen — welche Sorte, wen man fallenlässt, wann der Bannbrief
     fällig ist — bleiben beim Spieler. */
  function fuelleNachDurst() {
    function rang(a) { return (durst(a) - geladenFuer(a.schluessel)) / (1 + a.km * 0.45); }
    var l = haeuser().slice().sort(function (x, y) { return rang(y) - rang(x); });
    var sicherung = 0;
    while (geladen() < wagenPlaetze() && sicherung++ < 600) {
      var gelegt = false;
      for (var i = 0; i < l.length; i++) {
        var a = l[i];
        if (durst(a) - geladenFuer(a.schluessel) < 1) continue;
        if (kannLaden(a)) continue;
        var neuerHalt = geladenFuer(a.schluessel) === 0 && Z.ladung.length > 0;
        var vorher = geladen(), vorherLohn = fuhrlohn(), vorherErloes = fuhrerloes();
        lade(a);
        if (geladen() === vorher) continue;
        /* Ein ZUSAETZLICHER Halt muss sich tragen. Die Grundfracht der ersten
           Ladung wird nicht gegen ein einzelnes Fass gerechnet — sonst fuehre
           der Wagen nie los. */
        if (neuerHalt && fuhrerloes() - vorherErloes < fuhrlohn() - vorherLohn) {
          entladeStill(a, geladen() - vorher);
          continue;
        }
        gelegt = true;
        if (geladen() >= wagenPlaetze()) break;
      }
      if (!gelegt) break;
    }
    B.sende('zeichne', { grund: 'fuhre-fuellen' });
  }

  function entladeStill(a, n) {
    for (var i = 0; i < Z.ladung.length; i++) {
      if (Z.ladung[i].adr !== a.schluessel) continue;
      Z.ladung[i].faesser.splice(Math.max(0, Z.ladung[i].faesser.length - n), n);
      if (!Z.ladung[i].faesser.length) Z.ladung.splice(i, 1);
      return;
    }
  }

  function wieVorigeWoche() {
    if (!Z.vorige) return;
    Z.ladung = [];
    for (var k in Z.vorige) {
      var a = B.welt.adresse(k);
      if (!a || Z.verloren[k]) continue;
      var soll = Z.vorige[k], sicherung = 0;
      while (geladenFuer(k) < soll && !kannLaden(a) && sicherung++ < 200) lade(a);
    }
    B.sende('zeichne', { grund: 'fuhre-wie-vorige' });
  }

  /* ----------------------------------------------------------------------
     DIE FUHRE ABSCHICKEN — und damit die Woche schliessen
     ---------------------------------------------------------------------- */
  function schicke() {
    if (!Z.ladung.length) return;
    var lohn = fuhrlohn();
    var e = ep();
    var gesamt = 0, erloesGesamt = 0;
    var verteilung = {};

    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      if (!a) return;
      var n = l.faesser.length;
      var erloes = 0;
      l.faesser.forEach(function (f) { erloes += preisJeFass(sorteFass(f), a); });

      /* Die Faesser gehen ueber die Welt-API aus dem Keller: erst nach vorn
         sortieren, dann herausnehmen. So bleibt der Weltzustand die eine
         Wahrheit und die Kopfleiste stimmt. */
      nimmHerausGezielt(l.faesser);

      B.welt.nimm(Math.round(erloes), B.welt.menge(n) + ' an ' + a.name, 'spieler');
      B.welt.protokolliere({
        wer: 'spieler', was: 'geliefert an ' + a.name,
        preis: 0, menge: n, adresse: a.schluessel
      });

      Z.durst[a.schluessel] = Math.max(0, durst(a) - n);
      Z.leer[a.schluessel] = 0;
      verteilung[a.schluessel] = n;
      gesamt += n;
      erloesGesamt += erloes;
      Z.jahrUmsatz += erloes;

      /* Geliefert heisst gebunden — bis der Naechste kommt. */
      if (!a.bindung || a.bindung.wem === 'haus') {
        B.welt.binde(a.schluessel, 'haus', 'Lieferung', B.welt.zeit.jahr + 1);
      }

      /* Die Faesser stehen jetzt beim Wirt und fehlen im eigenen Bestand. */
      Z.umlauf.push({ faellig: woManifest() + (e.wagen.umlauf || 1), n: n });
      Z.draussen += n;
    });

    /* Erst liefert der Wagen, dann wird der Fuhrmann bezahlt — aus dem, was
       er mitgebracht hat. Eine leere Kasse haelt die Woche deshalb nie an. */
    B.welt.zahle(Math.min(lohn, Math.max(0, B.welt.haus.kasse)),
      'Fuhrlohn ' + (frachtstufe() ? frachtstufe().name : e.wagen.name)
      + ' · ' + Z.ladung.length + (Z.ladung.length === 1 ? ' Halt' : ' Halte'), 'spieler');

    Z.vorige = verteilung;
    Z.ladung = [];
    Z.fuhren += 1;
    Z.meldung = B.welt.menge(gesamt) + ' ausgeliefert an ' + Object.keys(verteilung).length
      + (Object.keys(verteilung).length === 1 ? ' Haus' : ' Häuser')
      + ' · ' + B.welt.geld(Math.round(erloesGesamt) - lohn) + ' geblieben';

    B.ton.spiele('fuhre:abfahrt:' + ['ochse', 'pferd', 'waggon', 'lastzug'][B.welt.zeit.epoche - 1],
      { ort: 'tor' });

    B.uhr.naechsteWoche();
  }

  /* Fortlaufende Wochennummer, damit der Umlauf ueber den Jahreswechsel traegt. */
  function woManifest() {
    return B.welt.zeit.jahr * B.uhr.WOCHEN_IM_JAHR + B.welt.zeit.woche;
  }

  /* Nimmt genau diese Faesser heraus — ueber die API, nicht am Array vorbei. */
  function nimmHerausGezielt(liste) {
    var f = keller();
    liste.forEach(function (fass) {
      var i = f.indexOf(fass);
      if (i > 0) { f.splice(i, 1); f.unshift(fass); }
    });
    B.welt.nimmHeraus(liste.length);
  }

  /* ----------------------------------------------------------------------
     DER SUD — faellt von selbst, nach der Anschlagtafel
     ---------------------------------------------------------------------- */
  function planSummeBudget() {
    var n = 0;
    sorten().forEach(function (s) { n += (Z.plan[s.k] || 0) * budgetKosten(s); });
    return n;
  }
  function planSummeSude() {
    var n = 0;
    sorten().forEach(function (s) { n += (Z.plan[s.k] || 0); });
    return n;
  }

  function braue() {
    var e = ep(), gruende = [], gebraut = 0;
    /* Die Pfanne dieser Woche. In 1350/1600 in Brautagen bzw. Suden der
       Reihe, sonst in Suden — sie begrenzt AUCH den Notsud. */
    var jeWoche = e.budget ? e.budget.jeWoche : (Z.sudeJeWoche || 1);
    var verbraucht = 0;
    var geldFehlt = false;
    Z.notsud = 0;

    /* Einen Sud ansetzen. Gibt null zurueck, wenn er faellt, sonst den
       Grund, warum nicht — der steht danach an der Tafel. */
    function setzeAn(s) {
      var kost = pfannenKosten(s);
      if (verbraucht + kost > jeWoche) {
        return e.budget ? ('die Woche hat nur ' + jeWoche + ' ' + e.budget.name)
                        : ('nur ' + jeWoche + (jeWoche === 1 ? ' Sud' : ' Sude') + ' je Woche');
      }
      if (e.budget && Z.budget < budgetKosten(s)) return e.budget.name + ' verbraucht';
      if (B.welt.vorrat.plaetze - keller().length < s.fass) return 'kein Platz im Keller';
      if (fassplaetzeFrei() < s.fass) return 'keine leeren Fässer';
      if (B.welt.haus.rohstoff < s.rohstoff) return 'kein ' + (B.welt.epoche().rohstoff || 'Rohstoff');
      if (e.eis && Z.eis < (s.eis || 0)) return 'kein Eis';
      /* Die einzige Stelle, an der Geld einen Sud noch aufhalten kann — und
         der Notsud kommt hier nie an, weil er nichts kostet. */
      if (s.kosten > 0 && !B.welt.kann(s.kosten)) return 'die Kasse';

      if (s.kosten > 0) B.welt.zahle(s.kosten, 'Ein Sud ' + s.name, 'spieler');
      if (s.rohstoff) B.welt.haus.rohstoff -= s.rohstoff;
      if (e.eis) Z.eis = Math.max(0, Z.eis - (s.eis || 0));
      if (e.budget) Z.budget -= budgetKosten(s);
      verbraucht += kost;

      var gelegt = B.welt.legeEin(s.name, s.fass);
      var f = keller();
      for (var i = f.length - gelegt; i < f.length; i++) {
        f[i].k = s.k;
        f[i].stufe = s.stufe;
        f[i].reife = s.reife;
        f[i].haltbar = s.reife + s.haltbar;
        f[i].zeichen = s.zeichen;
      }
      gebraut += gelegt;
      B.welt.protokolliere({ wer: 'spieler', was: gelegt + ' Fass ' + s.name + ' eingelegt',
        preis: 0, menge: 0 });
      return null;
    }

    /* 1. Was an der Tafel steht. */
    for (var si = 0; si < sorten().length; si++) {
      var s = sorten()[si];
      var will = Z.plan[s.k] || 0;
      for (var n = 0; n < will; n++) {
        var grund = setzeAn(s);
        if (grund) {
          gruende.push(grund);
          if (grund === 'die Kasse') geldFehlt = true;
          break;
        }
      }
    }

    /* 2. DER NOTSUD. Der Braumeister laesst die Pfanne nicht kalt, wenn
       nichts zu verkaufen im Keller liegt oder der Plan bloss am Geld
       gescheitert ist. Der zweite Guss kostet keinen Pfennig, kein Korn und
       keinen Tag der Verleihung — nur die Pfanne. Das ist die Antwort des
       Stuecks auf die leere Kasse, und sie steht an der Tafel, nicht im
       Handbuch. */
    var ns = notSorte();
    /* Nur wirklich in der Not: der Keller ist ganz leer, oder der Plan ist
       am Geld gescheitert und es liegt kein reifes Fass zum Verkauf da.
       Solange etwas im Keller reift, wartet die Pfanne. */
    var nichtsDa = keller().length === 0;
    var nurGeld = geldFehlt && !gebraut && freieFaesser().length === 0;
    var notGrund = null;
    if (ns && (nichtsDa || nurGeld)) {
      var ziel = Math.max(1, Math.ceil(wagenPlaetze() / Math.max(1, ns.fass)));
      while (Z.notsud < ziel) {
        notGrund = setzeAn(ns);
        if (notGrund) break;
        Z.notsud++;
      }
    }

    if (gebraut) B.ton.spiele('sud:pfanne', { ort: 'kesselstelle' });

    /* 3. Was an der Tafel darueber steht. */
    var teile = [];
    if (gebraut) teile.push(gebraut + ' Fass angesetzt');
    if (Z.notsud && ns) {
      Z.notGesamt += Z.notsud;
      teile.push('davon ' + Z.notsud + '× ' + ns.name + ' ohne Barauslage'
        + (geldFehlt ? ' — für den Plan fehlte die Kasse' : ' — der Keller war leer'));
      if (!Z.notGemeldet) {
        Z.notGemeldet = true;
        B.welt.schreibe('Kein Geld in der Lade, und die Pfanne steht trotzdem am Feuer: '
          + 'der Braumeister setzt ' + ns.name + ' an, den zweiten Guss auf dieselben Treber. '
          + 'Kein Pfennig, kein ' + (B.welt.epoche().rohstoff || 'Rohstoff')
          + ', kein Tag der Verleihung — nur die Pfanne.', 'fuhre');
      }
    } else if (!gebraut) {
      teile.push(planSummeSude()
        ? 'Kein Sud: ' + (gruende[0] || notGrund || 'die Tafel steht leer')
        : (notGrund ? 'Kein Sud: ' + notGrund : 'Die Tafel ist leer.'));
    } else if (gruende.length) {
      teile.push('dann: ' + gruende[0]);
    }
    /* Wenn Geld den Plan aufgehalten hat, steht der Ausweg daneben. Die
       Kasse ist in diesem Stueck nie eine Wand, und die Tafel sagt das
       selbst — sonst glaubt es niemand. */
    if (geldFehlt && ns && !Z.notsud) {
      teile.push(ns.name + ' kostet nichts und steht unter dem Strich der Tafel');
    }
    Z.sudMeldung = teile.join(' · ');
  }

  /* ----------------------------------------------------------------------
     DIE WOCHE, DIE OHNE DEN SPIELER LAEUFT
     ---------------------------------------------------------------------- */
  function umlaufZurueck() {
    var jetzt = woManifest(), zurueck = 0, bruch = 0;
    Z.umlauf = Z.umlauf.filter(function (u) {
      if (u.faellig > jetzt) return true;
      for (var i = 0; i < u.n; i++) {
        if (B.wuerfel.trifft(ep().wagen.bruch)) bruch++; else zurueck++;
      }
      return false;
    });
    Z.draussen = Math.max(0, Z.draussen - zurueck - bruch);
    if (bruch) {
      Z.faesser = Math.max(4, Z.faesser - bruch);
      B.welt.protokolliere({ wer: 'verfall',
        was: bruch + (bruch === 1 ? ' Fass ist' : ' Fässer sind') + ' beim Wirt zersprungen', preis: 0 });
    }
  }

  /* 1600: Fassplätze sind die Währung. Wer nicht warten will, bis das Pfand
     von selbst zurückkommt, schickt den Knecht — und bezahlt dafür. */
  function ziehePfand() {
    var e = ep();
    if (!e.pfand || !Z.draussen) return;
    var preis = Math.round(e.pfand.grund + e.pfand.jeFass * Z.draussen);
    if (!zahleOderKerbe(preis, 'Pfand eingezogen · ' + Z.draussen + ' Fässer')) {
      Z.meldung = 'Die Runde des Knechts kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-pfand' });
      return;
    }
    var zurueck = Z.draussen;
    Z.umlauf = [];
    Z.draussen = 0;
    Z.meldung = zurueck + ' Fässer sind zurück im Hof.';
    B.ton.spiele('fuhre:fass-rollen', { ort: 'fasslager' });
    B.sende('zeichne', { grund: 'fuhre-pfand' });
  }

  function eisZehrt() {
    var e = ep();
    if (!e.eis) return;
    var brauch = Math.ceil(keller().length / 25) + (keller().length ? 1 : 0);
    if (Z.eis >= brauch) { Z.eis -= brauch; return; }
    Z.eis = 0;
    /* Ohne Eis wird der Keller warm — jedes Fass verliert zwei Wochen. */
    var betroffen = 0;
    keller().forEach(function (f) {
      if (f.haltbar > 2) { f.haltbar -= 2; betroffen++; }
    });
    if (betroffen) {
      B.welt.protokolliere({ wer: 'verfall',
        was: 'Kein Eis: ' + betroffen + ' Fass verlieren zwei Wochen Haltbarkeit', preis: 0 });
    }
  }

  function durstWaechst() {
    var mult = preisMult();
    var faktor = B.grenze(1.3 - 0.3 * mult, 0.6, 1.6);
    haeuser().forEach(function (a) {
      var w = wochenbedarf(a) * faktor * (0.72 + B.wuerfel.zahl() * 0.62);
      Z.durst[a.schluessel] = Math.min(wochenbedarf(a) * 9, durst(a) + w);
      Z.leer[a.schluessel] = (Z.leer[a.schluessel] || 0) + 1;
    });
    /* In JEDER Woche will mindestens ein Haus mehr, als im Keller liegt.
       Nachzaehlbar am Bildschirm: die Fassbetten unter dem Haus gegen die
       Faesser im Keller. */
    var liegt = Math.max(keller().length, freieFaesser().length);
    var l = haeuser().filter(function (a) { return !sperre(a); });
    if (!l.length) l = haeuser();
    if (l.length) {
      var groesster = l[0];
      l.forEach(function (a) { if (durst(a) > durst(groesster)) groesster = a; });
      if (durst(groesster) <= liegt) {
        Z.durst[groesster.schluessel] = liegt + 1 + Math.floor(wochenbedarf(groesster) * 0.5);
      }
    }
  }

  function schreibeZettel() {
    var l = haeuser().filter(function (a) { return durst(a) >= 1; });
    if (!l.length) { Z.zettel = null; return; }
    var wahl = l[0];
    l.forEach(function (a) {
      var p = durst(a) * (1 + (Z.leer[a.schluessel] || 0) * 0.25) * (1 + (Z.mahnung[a.schluessel] || 0));
      var q = durst(wahl) * (1 + (Z.leer[wahl.schluessel] || 0) * 0.25) * (1 + (Z.mahnung[wahl.schluessel] || 0));
      if (p > q) wahl = a;
    });
    var muster = D.zettel[B.welt.zeit.epoche] || D.zettel[1];
    var text = B.wuerfel.aus(muster)
      .replace('{wirt}', wahl.name)
      .replace('{n}', B.welt.menge(Math.round(durst(wahl))));
    Z.zettel = { adr: wahl.schluessel, text: text, fehlt: Math.round(durst(wahl)) };
  }

  /* ----------------------------------------------------------------------
     GEORGI — die Tafel wird gewischt, und der Sommer laeuft ohne Hand ab
     ---------------------------------------------------------------------- */
  function sommerLaeuft() {
    var e = ep(), monate = e.monate;
    var teile = [];
    var sommerAnteil = 1 - e.winteranteil;

    /* Die Hitze: was den Sommer nicht uebersteht, kippt sofort. */
    var gekippt = 0;
    var bleibt = [];
    keller().forEach(function (f) {
      var s = sorteFass(f);
      if (s.sommer) bleibt.push(f); else gekippt++;
    });
    if (gekippt) {
      B.welt.protokolliere({ wer: 'verfall',
        was: 'Georgi: ' + gekippt + ' Fass überstehen den Sommer nicht und kippen', preis: 0, menge: gekippt });
    }

    var vorrat = bleibt.slice();
    var reihenfolge = haeuser().slice().sort(function (x, y) {
      var bx = (x.bindung && x.bindung.wem === 'haus') ? 0 : 1;
      var by = (y.bindung && y.bindung.wem === 'haus') ? 0 : 1;
      if (bx !== by) return bx - by;
      return x.km - y.km;
    });

    var geldGesamt = 0, verkauftGesamt = 0;
    for (var m = 0; m < monate.length; m++) {
      var vorher = vorrat.length;
      var verkauft = 0, geld = 0;
      for (var i = 0; i < reihenfolge.length; i++) {
        var a = reihenfolge[i];
        if (sperre(a)) continue;
        var will = Math.round(jahresbedarf(a) * sommerAnteil / monate.length);
        var gab = 0;
        while (gab < will && vorrat.length) {
          var idx = -1;
          for (var v = 0; v < vorrat.length; v++) {
            if (nimmt(a, sorteFass(vorrat[v])) && gelistetFuer(a, sorteFass(vorrat[v]))) { idx = v; break; }
          }
          if (idx < 0) break;
          var f = vorrat.splice(idx, 1)[0];
          geld += preisJeFass(sorteFass(f), a) * 0.86;
          gab++;
        }
        if (gab) {
          verkauft += gab;
          B.welt.protokolliere({ wer: 'spieler', was: 'Sommer: ' + B.welt.menge(gab) + ' an ' + a.name,
            preis: 0, menge: gab, adresse: a.schluessel });
          Z.durst[a.schluessel] = Math.max(0, durst(a) - gab);
        }
      }
      /* Was liegen bleibt, verliert im Sommer. */
      var schwund = Math.round(vorrat.length * 0.08);
      vorrat.splice(0, schwund);
      teile.push({ monat: monate[m], vorher: vorher, verkauft: verkauft,
        schwund: schwund, rest: vorrat.length, geld: Math.round(geld) });
      geldGesamt += geld;
      verkauftGesamt += verkauft;
    }

    if (geldGesamt > 0) B.welt.nimm(Math.round(geldGesamt), 'Sommerabsatz aus dem Aprilbestand', 'spieler');
    Z.jahrUmsatz += geldGesamt;

    /* DIE ABGABE. Sie wächst mit dem Ausstoß, nicht mit der Kasse — deshalb
       kann das Haus nicht in eine Wohlstandssingularität davonlaufen. Ungeld,
       Malzaufschlag, Biersteuer: das historische Gegenstück zum Erfolg. */
    var abgabe = 0, abgabeName = '';
    if (e.abgabe) {
      abgabeName = e.abgabe.name;
      abgabe = Math.round(Z.jahrUmsatz * e.abgabe.satz);
      /* Der Rat nimmt nach Ausstoß — aber er nimmt nie das Saatgut. Es bleibt
         immer genug für drei Sude, und nie mehr als die Hälfte des Freien.
         Sonst wäre die Abgabe kein Gegengewicht, sondern ein Fallbeil. */
      var notgroschen = 0;
      sorten().forEach(function (so) { if (!notgroschen || so.kosten < notgroschen) notgroschen = so.kosten; });
      var frei = Math.max(0, B.welt.haus.kasse - notgroschen * 4);
      var zahlbar = Math.min(abgabe, Math.round(frei * 0.55));
      if (zahlbar > 0) {
        B.welt.zahle(zahlbar, abgabeName + ' auf ' + B.welt.geld(Math.round(Z.jahrUmsatz)) + ' Umsatz', 'spieler');
      }
      if (zahlbar < abgabe) {
        B.welt.schreibe('Das Haus bleibt ' + B.welt.geld(abgabe - zahlbar) + ' '
          + abgabeName + ' schuldig. Der Rat merkt sich das.', 'fuhre');
      }
    }

    /* DAS KERBHOLZ WIRD GELOESCHT. Erst in Geld, soweit welches da ist.
       Was offen bleibt, nimmt sich der Glaeubiger NICHT in Geld, sondern in
       der knappen Sache dieser Zeit: Brautage, Sude der Reihe, Eis,
       Regalmeter. Das ist der Preis der Schuld, und er ist nie Zins. */
    var kh = kerbholz();
    Z.kerbGeorgi = null;
    Z.kerbAbzug = 0;
    if (kh && Z.kerben > 0) {
      var hatte = Z.kerben, geloescht = 0;
      while (Z.kerben > 0 && B.welt.haus.kasse >= kh.jeKerbe) {
        B.welt.zahle(kh.jeKerbe, kh.kurz + ': eine Kerbe geloescht', 'spieler');
        Z.kerben -= 1;
        geloescht += 1;
      }
      var offen = Z.kerben;
      var pf = kh.pfand, genommen = 0, wovon = '';
      if (offen > 0 && pf) {
        if (pf.was === 'budget') {
          genommen = offen * pf.menge;
          Z.kerbAbzug = genommen;
          wovon = genommen + ' ' + (e.budget ? e.budget.name : 'Sude');
        } else if (pf.was === 'eis') {
          genommen = Math.min(Z.eis, offen * pf.menge);
          Z.eis = Math.max(0, Z.eis - genommen);
          wovon = genommen + ' Fuder Eis';
        } else if (pf.was === 'listung') {
          var offenL = offen * pf.menge, weg = [];
          for (var lk in Z.listung) {
            if (weg.length >= offenL) break;
            /* Zwei Regalmeter bleiben immer stehen — der Handel wirft ein
               Haus nicht ganz aus dem Markt, er nimmt ihm die Fläche. */
            if (Object.keys(Z.listung).length - weg.length <= 2) break;
            weg.push(lk);
          }
          weg.forEach(function (lk) { delete Z.listung[lk]; delete Z.listungLeer[lk]; });
          genommen = weg.length;
          wovon = genommen + (genommen === 1 ? ' Regalmeter' : ' Regalmeter');
        }
        B.welt.protokolliere({ wer: 'verfall', preis: 0,
          was: kh.name + ': ' + offen + (offen === 1 ? ' Kerbe' : ' Kerben')
             + ' offen — genommen wurden ' + wovon });
        B.welt.schreibe(kh.name + ': ' + offen + (offen === 1 ? ' Kerbe steht' : ' Kerben stehen')
          + ' noch im Holz. ' + pf.sagt + ' Genommen: ' + wovon + '.', 'fuhre');
      }
      Z.kerbGeorgi = { hatte: hatte, geloescht: geloescht, offen: offen,
        wovon: wovon, sagt: pf ? pf.sagt : '', name: kh.name };
      /* Genommen ist genommen: das Holz wird glattgehobelt. */
      Z.kerben = 0;
    }

    /* Der Keller wird geleert: der Rest ist im Herbst nichts mehr wert. */
    var uebrig = keller().length;
    if (uebrig) B.welt.nimmHeraus(uebrig);
    Z.draussen = 0;
    Z.umlauf = [];

    Z.sommer = {
      jahr: B.welt.zeit.jahr + 1,
      april: bleibt.length + gekippt,
      gekippt: gekippt,
      sommerfest: bleibt.length,
      teile: teile,
      verkauft: verkauftGesamt,
      geld: Math.round(geldGesamt),
      umsatz: Math.round(Z.jahrUmsatz),
      abgabe: abgabe, abgabeName: abgabeName,
      abgabeSatz: e.abgabe ? e.abgabe.sagt : '',
      satz: e.sommerSatz,
      rest: vorrat.length,
      kerb: Z.kerbGeorgi,
      notsude: Z.notGesamt,
      verloren: []
    };
    B.ton.spiele('sommer:keller-leer', { ort: 'keller', art: 'schleife' });
  }

  /* Was dieses Braujahr an eine Adresse ging — dieselbe Rechnung, die
     welt.rechneJahrAb gleich in die Reihe schreibt. */
  function jahresLieferung() {
    var m = {};
    B.protokoll.forEach(function (p) {
      if (p.jahr === B.welt.zeit.jahr && p.adresse && p.menge) {
        m[p.adresse] = (m[p.adresse] || 0) + p.menge;
      }
    });
    return m;
  }

  var verlorenJetzt = [];

  function mahnenUndVerlieren() {
    verlorenJetzt = [];
    var geliefert = jahresLieferung();
    alleHaeuser().forEach(function (a) {
      if (Z.verloren[a.schluessel]) return;
      var soll = jahresbedarf(a) * 0.30;
      var ist = geliefert[a.schluessel] || 0;
      if (ist < soll) {
        if (!Z.mahnung[a.schluessel]) {
          /* Beim ERSTEN mageren Jahr wird festgehalten, ob der Gegner damals
             schon an der Tür stand. Nur so lässt sich später ehrlich sagen,
             ob die Adresse genommen oder liegengelassen wurde. */
          Z.fremdBeiMahnung[a.schluessel] = !!(a.bindung && a.bindung.wem && a.bindung.wem !== 'haus');
        }
        Z.mahnung[a.schluessel] = (Z.mahnung[a.schluessel] || 0) + 1;
      } else {
        Z.mahnung[a.schluessel] = Math.max(0, (Z.mahnung[a.schluessel] || 0) - 1);
      }
      if (Z.mahnung[a.schluessel] >= 3) {
        var fremd = Z.fremdBeiMahnung[a.schluessel] ? (a.bindung ? a.bindung.wem : 'gegner') : null;
        Z.verloren[a.schluessel] = { jahr: B.welt.zeit.jahr + 1, fremd: fremd };
        verlorenJetzt.push({ name: a.name, fremd: fremd, reihe: a.reihe.slice() });
        B.welt.binde(a.schluessel, null);
        B.welt.protokolliere({ wer: 'verfall',
          was: a.name + ' führt kein Bier des Hauses mehr', preis: 0, adresse: a.schluessel });
        B.welt.schreibe(a.name + ' nimmt nichts mehr. ' + (fremd
          ? 'Der Gegner stand schon vor der Tür, als es anfing.'
          : 'Niemand hat die Adresse genommen — wir haben sie drei Jahre lang liegen lassen.')
          + ' Die Reihe: ' + a.reihe.map(function (r) { return B.welt.menge(r, true); }).join(' · ')
          + ' von ' + B.welt.menge(jahresbedarf(a)) + '.', 'fuhre');
      }
    });
  }

  function wischeTafel() {
    Z.plan = {};
    Z.tafelGewischt = true;
    B.welt.schreibe('Georgi. Die Tafel am Sudhaus wird gewischt. ' + ep().sommerSatz, 'fuhre');
  }

  /* ----------------------------------------------------------------------
     EPOCHE EINRICHTEN
     ---------------------------------------------------------------------- */
  function richteEpocheEin(neu) {
    var e = ep();
    Z.epoche = B.welt.zeit.epoche;
    Z.budget = e.budget ? e.budget.start : 0;
    Z.sudeJeWoche = e.sudeJeWoche || 0;
    Z.faesser = Math.max(Z.faesser, e.faesser);
    Z.fracht = e.fracht ? e.fracht[Math.min(1, e.fracht.length - 1)].k : 'stueck';
    Z.halte = e.wagen.halte;
    Z.eisKeller = e.eis ? e.eis.keller : 0;
    Z.eis = e.eis ? e.eis.start : 0;
    Z.ladung = [];
    Z.vorige = null;
    Z.kaufNr = {};
    Z.bannNr = 0;
    Z.plan = {};
    /* Ein neuer Glaeubiger, ein neues Holz: ueber einen Epochensprung von
       zweihundert Jahren wird keine Kerbe mitgeschleppt. */
    Z.kerben = 0;
    Z.kerbAbzug = 0;
    Z.kerbGeorgi = null;
    Z.notGesamt = 0;
    Z.notGemeldet = false;
    /* Ein Vorschlag steht an der Tafel, damit die erste Woche laeuft.
       Kein Tutorial — eine Lage, die schon eingestellt ist. */
    var standard = sorten()[1] || sorten()[0];
    Z.plan[standard.k] = e.planStart || 1;

    /* In 1970 gehoeren die Regalmeter der Marke, nicht dem Haus: zwei
       Adressen sind schon gelistet, die anderen nicht. */
    if (e.listung) {
      Z.listung = {};
      var l = alleHaeuser();
      for (var i = 0; i < l.length && i < 6; i++) {
        var o = {}; o[standard.k] = true;
        Z.listung[l[i].schluessel] = o;
      }
    }
    if (neu) normalisiereKeller();
  }

  function normalisiereKeller() {
    var l = sorten();
    keller().forEach(function (f) {
      if (f.k && sorteVon(f.k)) return;
      var s = null;
      for (var i = 0; i < l.length; i++) if (l[i].name === f.sorte) s = l[i];
      if (!s) for (var j = 0; j < l.length; j++) if (l[j].stufe === (f.stufe || 2)) s = l[j];
      if (!s) s = l[1] || l[0];
      f.k = s.k; f.stufe = s.stufe; f.zeichen = s.zeichen;
      f.reife = 0;
      f.haltbar = Math.max(f.haltbar || 4, s.haltbar);
      f.sorte = s.name;
    });
  }

  /* ----------------------------------------------------------------------
     KAEUFE — die Knappheit loesen, nie mit einem Regler
     ---------------------------------------------------------------------- */
  function kaufe(k) {
    var e = ep(), def = null;
    (e.kaeufe || []).forEach(function (x) { if (x.k === k) def = x; });
    if (!def) return;
    if (k === 'eis' && !frostzeit()) return;
    if (k === 'eis' && Z.eis >= Z.eisKeller) return;
    var preis = staffelPreis(k, def.basis, def.staffel);
    if (!zahleOderKerbe(preis, def.text)) {
      Z.meldung = def.text + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-kauf' });
      return;
    }
    Z.kaufNr[k] = (Z.kaufNr[k] || 0) + 1;
    if (def.staffel > 1) Z.unterhaltExtra += preis * 0.006;

    if (k === 'budget') Z.budget += def.menge;
    else if (k === 'rohstoff') B.welt.haus.rohstoff += def.menge;
    else if (k === 'fass') Z.faesser += def.menge;
    else if (k === 'eis') Z.eis = Math.min(Z.eisKeller, Z.eis + def.menge);
    else if (k === 'eiskeller') Z.eisKeller += def.menge;
    else if (k === 'sudwerk') Z.sudeJeWoche += def.menge;
    else if (k === 'lastzug') Z.halte += def.menge;

    if (k === 'lastzug') ep().wagen.halte = Z.halte;
    B.ton.spiele('fuhre:kauf', { ort: 'hof' });
    B.sende('zeichne', { grund: 'fuhre-kauf' });
  }

  function frostzeit() {
    var e = ep();
    if (!e.eis) return false;
    return B.welt.zeit.woche >= e.eis.frostVon && B.welt.zeit.woche <= e.eis.frostBis;
  }

  function loeseBann(a) {
    var e = ep();
    if (!e.bann) return;
    var preis = Math.round(e.bann.basis * Math.pow(e.bann.staffel, Z.bannNr));
    if (!zahleOderKerbe(preis, 'Bannbrief für ' + a.name)) {
      Z.meldung = 'Der Bannbrief für ' + a.name + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-bann' });
      return;
    }
    Z.bannNr += 1;
    Z.unterhaltExtra += preis * 0.004;
    Z.bann[a.schluessel] = B.welt.zeit.jahr;
    B.welt.schreibe('Der Rat siegelt den Bannbrief für ' + a.name + '. '
      + 'Das gilt für immer und kostete ' + B.welt.geld(preis) + '.', 'fuhre');
    B.ton.spiele('fuhre:siegel', { ort: 'marktplatz' });
    B.sende('zeichne', { grund: 'fuhre-bann' });
  }

  function liste(a, s) {
    var e = ep();
    if (!e.listung) return;
    var n = 0;
    for (var k in Z.listung) for (var q in Z.listung[k]) if (Z.listung[k][q]) n++;
    var preis = Math.round(e.listung.basis * Math.pow(e.listung.staffel, n));
    if (!zahleOderKerbe(preis, 'Listung ' + s.name + ' beim ' + a.name)) {
      Z.meldung = 'Der Regalmeter beim ' + a.name + ' kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
      B.sende('zeichne', { grund: 'fuhre-listung' });
      return;
    }
    Z.unterhaltExtra += preis * 0.004;
    if (!Z.listung[a.schluessel]) Z.listung[a.schluessel] = {};
    Z.listung[a.schluessel][s.k] = true;
    B.welt.schreibe(s.name + ' steht jetzt im Regal beim ' + a.name + '. '
      + 'Ein Meter, ein Jahr, ' + B.welt.geld(preis) + '.', 'fuhre');
    B.sende('zeichne', { grund: 'fuhre-listung' });
  }

  /* Der naechste sinnvolle Zug — die Zahl, an der die Messlatte haengt.
     Nie der Sud (der faellt von selbst), immer die Knappheit. */
  function meldeZug() {
    var e = ep();
    if (e.bann) {
      var offen = haeuser().filter(function (a) {
        return a.km > e.bannmeile && !Z.bann[a.schluessel];
      });
      if (offen.length) {
        B.welt.meldeZug('Bannbrief', Math.round(e.bann.basis * Math.pow(e.bann.staffel, Z.bannNr)));
        return;
      }
    }
    if (e.listung) {
      var ohne = haeuser().filter(function (a) { return !gelistet(a); });
      if (ohne.length) {
        var n = 0;
        for (var k in Z.listung) for (var q in Z.listung[k]) if (Z.listung[k][q]) n++;
        B.welt.meldeZug('Regalmeter', Math.round(e.listung.basis * Math.pow(e.listung.staffel, n)));
        return;
      }
    }
    var bester = null;
    (e.kaeufe || []).forEach(function (def) {
      if (def.k === 'rohstoff' || def.k === 'eis') return;
      var p = staffelPreis(def.k, def.basis, def.staffel);
      if (!bester || p < bester.preis) bester = { was: def.text.split(' ·')[0], preis: p };
    });
    if (bester) B.welt.meldeZug(bester.was, bester.preis);
  }

  /* ======================================================================
     DAS BILD
     ====================================================================== */

  function brett(klasse, kopf, unter) {
    var b = B.el('div', 'fu-brett ' + klasse);
    var k = B.el('div', 'fu-kopf');
    k.appendChild(B.el('b', null, kopf));
    if (unter) k.appendChild(B.el('span', null, unter));
    b.appendChild(k);
    return b;
  }

  function fassZeichen(f, klein) {
    var s = sorteFass(f);
    var i = B.el('i', 'fu-fass s' + s.stufe + (reif(f) ? '' : ' fu-lagert') + (klein ? ' klein' : ''));
    i.appendChild(B.el('b', null, s.zeichen));
    i.appendChild(B.el('em', null, 'W' + f.woche));
    var rest = (f.reife || 0) - alter(f);
    i.title = s.name + ' · gebraut ' + f.jahr + ', Woche ' + f.woche
      + (rest > 0 ? ' · reif in ' + rest + (rest === 1 ? ' Woche' : ' Wochen')
                  : ' · reif, hält noch ' + Math.max(0, f.haltbar - alter(f)) + ' Wochen');
    return i;
  }

  /* --- DIE HAEUSER ---------------------------------------------------- */
  function zeichneHaeuser(fach) {
    var e = ep();
    var liegt = freieFaesser().length;
    var wollen = 0;
    haeuser().forEach(function (a) { wollen += Math.max(durst(a) > 0 ? 1 : 0, Math.round(durst(a))); });

    var b = brett('fu-haeuser', 'DIE HÄUSER',
      'wollen ' + B.welt.menge(wollen, true) + ' · im Keller liegen ' + B.welt.menge(liegt));

    /* DAS ENDE DIESES HAUSES IST NIE DIE LEERE KASSE. Solange eine Adresse
       Bier des Hauses fuehrt, geht es weiter — notfalls mit Kofent und auf
       Kerbe. Erst wenn keine mehr da ist, ist es vorbei. */
    if (!haeuser().length) {
      var aus = B.el('div', 'fu-ausgelaufen');
      aus.appendChild(B.el('b', null, 'KEIN HAUS DER STADT FÜHRT MEHR BIER DES ANKER'));
      aus.appendChild(B.el('span', null,
        'Das ist das Ende — nicht die leere Kasse. Die Pfanne könnte morgen wieder brennen, '
        + 'und es gäbe niemanden, der das Fass abnimmt.'));
      b.appendChild(aus);
      if (!Z.endeGemeldet) {
        Z.endeGemeldet = true;
        B.welt.schreibe('Die letzte Adresse ist weg. Das Brauhaus zum Anker braut noch, '
          + 'aber es liefert nirgendwohin mehr. Nicht das Geld ist ausgegangen — '
          + 'die Kundschaft.', 'fuhre');
      }
    }

    if (Z.zettel) {
      var z = B.el('div', 'fu-zettel');
      z.appendChild(B.el('div', 'fu-zettel-text', '„' + Z.zettel.text + '"'));
      b.appendChild(z);
    }

    var liste = B.el('div', 'fu-liste');
    var neediest = null;
    haeuser().forEach(function (a) { if (!neediest || durst(a) > durst(neediest)) neediest = a; });

    alleHaeuser().forEach(function (a) {
      liste.appendChild(hausKarte(a, a === neediest));
    });
    b.appendChild(liste);
    fach.appendChild(b);
  }

  function hausKarte(a, wichtig) {
    var e = ep();
    var k = B.el('div', 'fu-haus');
    k.setAttribute('data-adr', a.schluessel);
    var weg = Z.verloren[a.schluessel];
    if (weg) k.classList.add('weg');
    if (wichtig && !weg) k.classList.add('durstig');

    /* Zeile 1: wer, wie weit, an wen gebunden */
    var z1 = B.el('div', 'fu-z1');
    z1.appendChild(B.el('span', 'fu-kuerzel', kurz(a)));
    z1.appendChild(B.el('span', 'fu-name', a.name));
    z1.appendChild(B.el('span', 'fu-km', B.zahl(a.km, a.km < 1 ? 1 : 0) + ' km'));
    var b2 = a.bindung;
    z1.appendChild(B.el('span', 'fu-bindung', weg ? '—'
      : (b2 ? (b2.wem === 'haus' ? 'unser Haus' : b2.wem) : 'frei')));
    k.appendChild(z1);

    /* Zeile 2: was das Haus will — und der eine Handgriff daneben */
    var z2 = B.el('div', 'fu-z2');
    if (weg) {
      z2.appendChild(B.el('span', 'fu-verloren',
        'AUFGEGEBEN ' + weg.jahr + (weg.fremd ? ' — der Gegner hatte sie schon'
                                              : ' — niemand hat sie genommen')));
    } else {
      var schritt = e.wagen.schritt;
      var will = Math.max(durst(a) > 0 ? 1 : 0, Math.round(durst(a)));
      var hat = geladenFuer(a.schluessel);
      var betten = B.el('span', 'fu-betten');
      var n = Math.min(7, Math.ceil(will / schritt));
      for (var i = 0; i < n; i++) {
        betten.appendChild(B.el('i', 'fu-bett' + (i * schritt < hat ? ' voll' : '')));
      }
      if (!n) betten.appendChild(B.el('i', 'fu-bett satt'));
      z2.appendChild(betten);
      z2.appendChild(B.el('span', 'fu-will', 'will ' + B.welt.menge(will)
        + (hat ? ' · ' + B.welt.menge(hat) + ' geladen' : '')));

      var grund = sperre(a);
      if (grund && e.bann && a.km > e.bannmeile && !Z.bann[a.schluessel]) {
        var preis = Math.round(e.bann.basis * Math.pow(e.bann.staffel, Z.bannNr));
        var bk = kerbZusatz(preis);
        z2.appendChild(B.knopf({
          text: 'Bannbrief' + bk, zug: 'fuhre:bann:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat' + (bk ? ' fu-aufkerbe' : ''), preis: -preis,
          aus: !kannBezahlen(preis),
          titel: e.bann.satz + ' ' + a.name + ' liegt ' + a.km + ' km außerhalb.'
            + kerbTitel(preis),
          tu: function () { loeseBann(a); }
        }));
      } else if (grund && e.listung && !gelistet(a)) {
        var s0 = sorten()[1] || sorten()[0];
        var n2 = 0;
        for (var kk in Z.listung) for (var qq in Z.listung[kk]) if (Z.listung[kk][qq]) n2++;
        var lp = Math.round(e.listung.basis * Math.pow(e.listung.staffel, n2));
        var lk2 = kerbZusatz(lp);
        z2.appendChild(B.knopf({
          text: 'Regalmeter' + lk2, zug: 'fuhre:listen:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat' + (lk2 ? ' fu-aufkerbe' : ''),
          preis: -lp,
          aus: !kannBezahlen(lp),
          titel: e.listung.satz + ' Gelistet würde: ' + s0.name + '.' + kerbTitel(lp),
          tu: function () { liste(a, s0); }
        }));
      } else {
        var hemm = kannLaden(a);
        var kn = B.knopf({
          text: '+ ' + B.welt.menge(e.wagen.schritt), zug: 'fuhre:laden:' + a.schluessel,
          klasse: 'fu-klein fu-laden fu-tat', aus: !!hemm,
          titel: hemm || (B.welt.menge(e.wagen.schritt) + ' für ' + a.name + ' auf den Wagen. '
            + a.name + ' zahlt ' + B.welt.geld(preisJeFass(sorten()[1] || sorten()[0], a)) + ' je Fass.'),
          tu: function () { lade(a); }
        });
        if (!hemm && !Z.fuhren && durst(a) >= 1) kn.classList.add('fu-weiser');
        z2.appendChild(kn);
        z2.appendChild(B.knopf({
          text: '−', zug: 'fuhre:abladen:' + a.schluessel,
          klasse: 'fu-klein fu-ab', aus: !geladenFuer(a.schluessel),
          titel: 'Wieder herunter vom Wagen.',
          tu: function () { entlade(a); }
        }));
      }
    }
    k.appendChild(z2);

    /* Zeile 3: die Reihe der letzten drei Jahre. Daran sieht man zwei Jahre
       vorher, dass eine Adresse verlorengeht — und zwar ohne den Gegner. */
    var z3 = B.el('div', 'fu-z3');
    var soll = jahresbedarf(a);
    var reihe = B.el('span', 'fu-reihe');
    reihe.title = 'Absatz der drei letzten Braujahre gegen den Bedarf von '
      + B.welt.menge(soll) + '. Bleibt er drei Jahre unter einem Drittel, ist die Adresse weg.';
    a.reihe.forEach(function (r) {
      var saeule = B.el('i', 'fu-saeule' + (r < soll * 0.30 ? ' mager' : ''));
      saeule.style.height = B.grenze(Math.round(r / Math.max(1, soll) * 100), 5, 100) + '%';
      reihe.appendChild(saeule);
    });
    z3.appendChild(reihe);
    z3.appendChild(B.el('span', 'fu-zahlen',
      a.reihe.map(function (r) { return B.welt.menge(r, true); }).join('·')
      + ' von ' + B.welt.menge(soll)));

    if (!weg) {
      var m = Z.mahnung[a.schluessel] || 0;
      var mk = B.el('span', 'fu-mahnung' + (m >= 2 ? ' rot' : ''));
      mk.title = m
        ? m + ' magere Jahre in Folge. Beim dritten nimmt das Haus nichts mehr.'
        : 'Keine Mahnung.';
      for (var q = 0; q < 3; q++) mk.appendChild(B.el('i', q < m ? 'an' : ''));
      z3.appendChild(mk);
    }
    k.appendChild(z3);
    return k;
  }

  /* --- DIE ANSCHLAGTAFEL ---------------------------------------------- */
  function zeichneTafel(fach) {
    var e = ep();
    var b = brett('fu-tafel', e.tafel.name.toUpperCase(), e.tafel.unter);
    /* Die Tafel haengt an der Sudhauswand — der Ort steht als Zeugnis dran,
       gesetzt wird sie ueber die Platzordnung in stil/fuhre.css, weil ein
       Brett dieser Groesse kein Punkt ist. */
    b.setAttribute('data-ort', 'sudhaus');
    b.classList.add('fu-schiefer');

    if (e.budget) {
      var reicht = planSummeBudget() ? Math.floor(Z.budget / planSummeBudget()) : 0;
      var bz = B.el('div', 'fu-budget' + (Z.budget <= 0 ? ' leer' : ''));
      bz.appendChild(B.el('b', null, e.budget.name + ': ' + Z.budget + ' übrig'));
      bz.appendChild(B.el('span', null, planSummeBudget()
        ? 'Dieser Plan frisst ' + planSummeBudget() + ' je Woche — reicht ' + reicht
          + (reicht === 1 ? ' Woche' : ' Wochen')
        : e.budget.satz));
      b.appendChild(bz);
    } else {
      var sz = B.el('div', 'fu-budget');
      sz.appendChild(B.el('b', null, 'Sudhaus: ' + Z.sudeJeWoche
        + (Z.sudeJeWoche === 1 ? ' Sud je Woche' : ' Sude je Woche')));
      sz.appendChild(B.el('span', null, 'Mehr Pfannen gibt es nur gebaut, nicht bestellt.'));
      b.appendChild(sz);
    }

    /* Was in der Kammer liegt — damit der Braumeister nicht wortlos stehen
       bleibt, wenn der Rohstoff ausgeht. */
    var rname = B.welt.epoche().rohstoff || 'Rohstoff';
    var teuerste = 0;
    sorten().forEach(function (so) { if ((Z.plan[so.k] || 0) && so.rohstoff > teuerste) teuerste = so.rohstoff; });
    var reichtFuer = teuerste ? Math.floor(B.welt.haus.rohstoff / teuerste) : null;
    var rz = B.el('div', 'fu-rohstoff' + (reichtFuer !== null && reichtFuer < 3 ? ' knapp' : ''));
    rz.textContent = rname + ' in der Kammer: ' + B.zahl(B.welt.haus.rohstoff)
      + (reichtFuer !== null ? ' — reicht für ' + reichtFuer + (reichtFuer === 1 ? ' Sud' : ' Sude') : '');
    b.appendChild(rz);

    if (Z.tafelGewischt) {
      b.appendChild(B.el('div', 'fu-gewischt',
        'GEWISCHT ZU GEORGI — schreib den Plan für ' + B.uhr.braujahr() + ' an.'));
    }

    var frei = B.welt.zeit.woche <= (e.tafel.freiBis || 3);
    var aendern = frei ? 0 : e.tafel.preis;

    var tab = B.el('div', 'fu-sorten');
    echteSorten().forEach(function (s) {
      var r = B.el('div', 'fu-sorte s' + s.stufe);
      r.title = s.satz;
      var kopf = B.el('div', 'fu-sorte-kopf');
      kopf.appendChild(B.el('i', 'fu-zeichen', s.zeichen));
      kopf.appendChild(B.el('b', null, s.name));
      kopf.appendChild(B.el('span', 'fu-erloes',
        B.welt.geld(preisJeEinheit(s)) + ' je ' + B.welt.mengeEinheit()));
      r.appendChild(kopf);

      var kosten = B.el('div', 'fu-sorte-kosten');
      if (e.budget) kosten.appendChild(B.el('span', null, budgetKosten(s) + ' ' + e.budget.name));
      kosten.appendChild(B.el('span', null, '→ ' + B.welt.menge(s.fass)));
      if (s.reife) kosten.appendChild(B.el('span', 'fu-lagerzeit', s.reife + ' Wo. Lager'));
      kosten.appendChild(B.el('span', null, 'hält ' + s.haltbar + ' Wo.'));
      if (s.eis) kosten.appendChild(B.el('span', 'fu-eiszeichen', s.eis + ' Eis'));
      if (s.sommer) kosten.appendChild(B.el('span', 'fu-sommerfest', 'sommerfest'));
      r.appendChild(kosten);

      var stell = B.el('div', 'fu-stell');
      stell.appendChild(B.knopf({
        text: '−', zug: 'fuhre:tafel-ab:' + s.k, klasse: 'fu-klein',
        aus: !(Z.plan[s.k] > 0),
        titel: 'Einen Sud weniger je Woche.',
        tu: function () { stelleTafel(s, -1, aendern); }
      }));
      stell.appendChild(B.el('span', 'fu-planzahl', String(Z.plan[s.k] || 0)));
      stell.appendChild(B.knopf({
        text: '+', zug: 'fuhre:tafel-auf:' + s.k, klasse: 'fu-klein',
        preis: aendern ? -aendern : 0,
        titel: frei
          ? 'Zu Michaeli steht die Tafel frei. ' + s.satz
          : 'Der Braumeister muss umstellen. Das kostet ' + B.welt.geld(aendern) + '. ' + s.satz,
        tu: function () { stelleTafel(s, +1, aendern); }
      }));
      r.appendChild(stell);
      tab.appendChild(r);
    });

    /* DER NOTSUD — mit Kreide unter den Strich geschrieben. Er kostet keinen
       Pfennig, keinen Rohstoff und keinen Tag der Jahresverleihung: nur die
       Pfanne. Deshalb steht er hier in einer eigenen, mageren Zeile und
       nicht zwischen den drei Bieren des Hauses. */
    var ns = notSorte(), nz = null;
    if (ns) {
      nz = B.el('div', 'fu-notsud' + (Z.notsud ? ' laeuft' : ''));
      var nk = B.el('div', 'fu-notsud-kopf');
      nk.appendChild(B.el('i', 'fu-zeichen', ns.zeichen));
      nk.appendChild(B.el('b', null, ns.name));
      nk.appendChild(B.el('span', 'fu-erloes',
        B.welt.geld(preisJeEinheit(ns)) + ' je ' + B.welt.mengeEinheit()));
      nz.appendChild(nk);
      nz.appendChild(B.el('div', 'fu-notsud-zeile',
        '0 ' + B.welt.waehrung().kurz + ' Auslage · 0 ' + (B.welt.epoche().rohstoff || 'Rohstoff')
        + ' · 0 ' + (e.budget ? e.budget.name : 'Ration') + ' → ' + B.welt.menge(ns.fass)
        + ' · hält ' + ns.haltbar + ' Wo. · frisst nur die Pfanne'));
      var nstell = B.el('div', 'fu-stell');
      nstell.appendChild(B.knopf({
        text: '−', zug: 'fuhre:tafel-ab:' + ns.k, klasse: 'fu-klein',
        aus: !(Z.plan[ns.k] > 0), titel: 'Einen Notsud weniger je Woche.',
        tu: function () { stelleTafel(ns, -1, 0); }
      }));
      nstell.appendChild(B.el('span', 'fu-planzahl', String(Z.plan[ns.k] || 0)));
      nstell.appendChild(B.knopf({
        text: '+', zug: 'fuhre:tafel-auf:' + ns.k, klasse: 'fu-klein',
        titel: ns.satz + ' Umstellen kostet hier nichts — der Braumeister braucht dafür '
             + 'weder Kreide noch Erlaubnis.',
        tu: function () { stelleTafel(ns, +1, 0); }
      }));
      nz.appendChild(nstell);
    }
    b.appendChild(tab);
    /* Der Notsud haengt UNTER der Sortenliste, nicht darin: die Liste darf
       bei vier Sorten und schmalem Brett rollen, der Weg aus der leeren
       Kasse darf das nie. Er steht immer im Bild. */
    if (nz) b.appendChild(nz);

    if (Z.sudMeldung) b.appendChild(B.el('div', 'fu-sudmeldung', Z.sudMeldung));

    /* DAS KERBHOLZ. Was das Haus schuldig ist, steht sichtbar im Holz —
       und daneben, womit es zu Georgi bezahlt wird. Nie mit Zins. */
    var kh = kerbholz();
    if (kh) {
      var kb = B.el('div', 'fu-kerbholz' + (Z.kerben ? ' offen' : ''));
      var kzeile = B.el('div', 'fu-kerbzeile');
      kzeile.appendChild(B.el('b', null, kh.name.toUpperCase()));
      var holz = B.el('span', 'fu-kerben');
      holz.title = kh.satz;
      for (var ki = 0; ki < kh.kerben; ki++) {
        holz.appendChild(B.el('i', ki < Z.kerben ? 'an' : ''));
      }
      kzeile.appendChild(holz);
      kzeile.appendChild(B.el('span', 'fu-kerbzahl',
        Z.kerben + ' von ' + kh.kerben + ' · 1 Kerbe = ' + B.welt.geld(kh.jeKerbe)));
      kb.appendChild(kzeile);
      kb.appendChild(B.el('div', 'fu-kerbsatz', Z.kerben
        ? kh.pfand.sagt
        : kh.satz));
      if (Z.kerben) {
        kb.appendChild(B.knopf({
          text: 'Eine Kerbe löschen', zug: 'fuhre:kerbe-loeschen', klasse: 'fu-klein',
          preis: -kh.jeKerbe, aus: !B.welt.kann(kh.jeKerbe),
          titel: 'Bar bezahlen, ehe Georgi kommt. Was zu Georgi offen steht, '
               + 'nimmt sich der Gläubiger anders: ' + kh.pfand.sagt,
          tu: loeseKerbe
        }));
      }
      b.appendChild(kb);
    }

    /* Wovon diese Epoche zu wenig hat. Nie Geld. */
    var kn = B.el('div', 'fu-knappheit');
    kn.appendChild(B.el('b', null, 'KNAPP IN DIESER ZEIT: ' + e.knappheit));
    kn.appendChild(B.el('span', null, e.knappSatz));
    b.appendChild(kn);

    /* Die Knappheit loesen: Preisschilder nebeneinander, die einander
       ausschliessen, weil die Kasse nur fuer eines reicht. */
    var kauf = B.el('div', 'fu-kaeufe');
    (e.kaeufe || []).forEach(function (def) {
      var preis = staffelPreis(def.k, def.basis, def.staffel);
      var aufKerbe = kerbZusatz(preis);
      var aus = !kannBezahlen(preis);
      var titel = def.titel + kerbTitel(preis);
      if (def.k === 'eis') {
        if (!frostzeit()) { aus = true; aufKerbe = '';
          titel = 'Der Fluss trägt nicht mehr. Eis gibt es von Woche '
          + e.eis.frostVon + ' bis ' + e.eis.frostBis + ' und sonst nie.'; }
        else if (Z.eis >= Z.eisKeller) { aus = true; aufKerbe = ''; titel = 'Der Eiskeller ist voll.'; }
      }
      kauf.appendChild(B.knopf({
        text: def.text + aufKerbe, zug: 'fuhre:kauf:' + def.k, preis: -preis,
        klasse: 'fu-klein' + (aufKerbe ? ' fu-aufkerbe' : ''), aus: aus, titel: titel,
        tu: function () { kaufe(def.k); }
      }));

      /* Der Rueckweg. Rohstoff geht zum Bruchteil an den Haendler zurueck —
         der eine Weg, aus einem vollen Speicher Bargeld zu machen, und er
         kostet genau das, was die Pfanne naechste Woche braucht. */
      if (def.rueck) {
        var erloes = Math.max(1, Math.round(def.basis * def.rueck));
        kauf.appendChild(B.knopf({
          text: def.rtext || 'Zurück an den Händler', zug: 'fuhre:rueckkauf:' + def.k,
          preis: erloes, klasse: 'fu-klein fu-rueck',
          aus: B.welt.haus.rohstoff < def.menge,
          titel: (def.rtitel || '') + ' Einkauf ' + B.welt.geld(def.basis)
               + ', Rückgabe ' + B.welt.geld(erloes) + '. In der Kammer liegen '
               + B.zahl(B.welt.haus.rohstoff) + '.',
          tu: function () { verkaufeRohstoff(def); }
        }));
      }
    });
    b.appendChild(kauf);
    fach.appendChild(b);
  }

  function stelleTafel(s, richtung, preis) {
    if (richtung > 0 && preis) {
      if (!zahleOderKerbe(preis, 'Der Braumeister stellt um')) {
        Z.meldung = 'Umstellen kostet ' + B.welt.geld(preis) + '.' + kerbTitel(preis);
        B.sende('zeichne', { grund: 'fuhre-tafel' });
        return;
      }
    }
    Z.plan[s.k] = Math.max(0, (Z.plan[s.k] || 0) + richtung);
    Z.tafelGewischt = false;
    B.ton.spiele('tafel:kreide', { ort: 'sudhaus', laut: 0.4 });
    B.sende('zeichne', { grund: 'fuhre-tafel' });
  }

  /* --- DER KELLER ----------------------------------------------------- */
  function zeichneKeller(fach) {
    var e = ep(), f = keller(), bf = e.keller.bettFass;
    var reifeZahl = f.filter(reif).length;
    var b = brett('fu-keller', e.keller.name.toUpperCase(),
      B.welt.menge(f.length, true) + ' von ' + B.welt.menge(B.welt.vorrat.plaetze)
      + ' · ' + B.welt.menge(reifeZahl, true) + ' reif');

    var gitter = B.el('div', 'fu-gitter');
    gitter.style.setProperty('--spalten', e.keller.spalten);
    var betten = Math.max(1, Math.round(B.welt.vorrat.plaetze / bf));
    for (var i = 0; i < betten; i++) {
      var von = i * bf;
      if (von < f.length) gitter.appendChild(fassZeichen(f[von], bf > 1));
      else {
        var leer = B.el('i', 'fu-fass leer');
        leer.title = 'Leerer Platz im ' + e.keller.name + ' — ' + e.keller.bett;
        gitter.appendChild(leer);
      }
    }
    b.appendChild(gitter);

    var fuss = B.el('div', 'fu-kellerfuss');
    fuss.appendChild(B.el('span', null, 'Fassplätze: ' + Z.faesser + ' eigene · '
      + f.length + ' gefüllt · ' + Z.draussen + ' beim Wirt · ' + fassplaetzeFrei() + ' leer'));
    if (e.eis) {
      var eis = B.el('span', 'fu-eis' + (Z.eis <= 2 ? ' knapp' : ''));
      eis.textContent = 'Eis: ' + Z.eis + ' von ' + Z.eisKeller + ' Fuder'
        + (frostzeit() ? ' · der Fluss trägt' : ' · kein Frost mehr');
      eis.title = e.eis.satz;
      fuss.appendChild(eis);
    }
    if (e.pfand) {
      var pp = Math.round(e.pfand.grund + e.pfand.jeFass * Z.draussen);
      var pk = Z.draussen ? kerbZusatz(pp) : '';
      fuss.appendChild(B.knopf({
        text: e.pfand.name + ' · ' + Z.draussen + ' Fass' + pk,
        zug: 'fuhre:pfand', klasse: 'fu-klein' + (pk ? ' fu-aufkerbe' : ''), preis: -pp,
        aus: !Z.draussen || !kannBezahlen(pp),
        titel: e.pfand.satz + (Z.draussen ? kerbTitel(pp) : ''),
        tu: ziehePfand
      }));
    }
    if (bf > 1) fuss.appendChild(B.el('span', 'fu-einheit', 'Ein Zeichen = ein ' + e.keller.bett
      + ' zu ' + B.welt.menge(bf)));
    b.appendChild(fuss);

    var verdorben = null;
    B.protokoll.slice(-8).forEach(function (p) {
      if (p.wer === 'verfall' && p.jahr === B.welt.zeit.jahr && p.woche === B.welt.zeit.woche) verdorben = p.was;
    });
    if (verdorben) b.appendChild(B.el('div', 'fu-verfall', 'Ohne Hand: ' + verdorben));

    fach.appendChild(b);
  }

  /* --- DER WAGEN ------------------------------------------------------ */
  function zeichneWagen(fach) {
    var e = ep(), fr = frachtstufe();
    var voll = geladen(), kap = wagenPlaetze();
    var b = brett('fu-wagen', (fr ? fr.name : e.wagen.name).toUpperCase(),
      B.welt.menge(voll, true) + ' von ' + B.welt.menge(kap) + ' · '
      + Z.ladung.length + ' von ' + e.wagen.halte + ' Halten');

    if (e.fracht) {
      var reihe = B.el('div', 'fu-fracht');
      e.fracht.forEach(function (st) {
        var lohn = Math.round(st.pauschale + st.jeFass * voll + st.jeKm * 4);
        var jeFass = voll ? Math.round(lohn / voll) : lohn;
        var kn = B.knopf({
          text: st.name + ' · bis ' + B.welt.menge(st.fass),
          zug: 'fuhre:fracht:' + st.k, preis: -lohn,
          klasse: 'fu-klein' + (Z.fracht === st.k ? ' fu-gewaehlt' : ''),
          titel: st.satz + ' Bei der jetzigen Ladung: ' + B.welt.geld(jeFass) + ' je Fass.',
          tu: function () {
            Z.fracht = st.k;
            while (geladen() > wagenPlaetze() && Z.ladung.length) {
              var l = Z.ladung[Z.ladung.length - 1];
              l.faesser.pop();
              if (!l.faesser.length) Z.ladung.pop();
            }
            B.sende('zeichne', { grund: 'fuhre-fracht' });
          }
        });
        reihe.appendChild(kn);
      });
      b.appendChild(reihe);
    }

    var gitter = B.el('div', 'fu-wagenbetten');
    var schritt = e.wagen.schritt;
    var plaetze = Math.min(26, Math.ceil(kap / schritt));
    var gesetzt = 0;
    Z.ladung.forEach(function (l) {
      var a = B.welt.adresse(l.adr);
      var gruppen = Math.ceil(l.faesser.length / schritt);
      for (var g = 0; g < gruppen && gesetzt < plaetze; g++) {
        var f = l.faesser[g * schritt];
        var s = sorteFass(f);
        var bett = B.el('i', 'fu-wbett voll s' + s.stufe);
        bett.appendChild(B.el('b', null, kurz(a)));
        bett.appendChild(B.el('em', null, s.zeichen));
        bett.title = B.welt.menge(Math.min(schritt, l.faesser.length - g * schritt)) + ' '
          + s.name + ' für ' + a.name + ' (' + a.km + ' km)';
        gitter.appendChild(bett);
        gesetzt++;
      }
    });
    for (var i = gesetzt; i < plaetze; i++) {
      var leer = B.el('i', 'fu-wbett');
      leer.title = 'Freier Platz auf dem Wagen.';
      gitter.appendChild(leer);
    }
    b.appendChild(gitter);

    /* Der Frachtbrief: was diese eine Fuhre einbringt, Halt für Halt.
       Preisschilder nebeneinander, die einander ausschließen — der Platz,
       den ein Fass belegt, hat kein zweites. */
    var brief = B.el('div', 'fu-frachtbrief');
    if (!Z.ladung.length) {
      brief.appendChild(B.el('div', 'fu-leerzeile', e.wagen.satz));
      brief.appendChild(B.el('div', 'fu-leerzeile',
        'Der Wagen steht. Jedes Fass bekommt ein Haus — dann fährt er.'));
    } else {
      Z.ladung.forEach(function (l) {
        var a = B.welt.adresse(l.adr);
        var erloes = 0, sorteName = {};
        l.faesser.forEach(function (f) {
          erloes += preisJeFass(sorteFass(f), a);
          sorteName[sorteFass(f).name] = (sorteName[sorteFass(f).name] || 0) + 1;
        });
        var zeile = B.el('div', 'fu-briefzeile');
        zeile.appendChild(B.el('span', 'k', kurz(a)));
        zeile.appendChild(B.el('span', 'n', a.name));
        zeile.appendChild(B.el('span', 'm', Object.keys(sorteName).map(function (s) {
          return B.welt.menge(sorteName[s]) + ' ' + s; }).join(' + ')));
        zeile.appendChild(B.el('span', 'w', B.zahl(a.km, a.km < 1 ? 1 : 0) + ' km'));
        zeile.appendChild(B.el('span', 'g', '+' + B.welt.geld(Math.round(erloes))));
        brief.appendChild(zeile);
      });
      var summe = B.el('div', 'fu-briefzeile summe');
      summe.appendChild(B.el('span', 'n', 'Fuhrlohn '
        + (frachtstufe() ? frachtstufe().name : e.wagen.name)));
      summe.appendChild(B.el('span', 'g', '−' + B.welt.geld(fuhrlohn())));
      brief.appendChild(summe);
    }
    b.appendChild(brief);

    var hilfe = B.el('div', 'fu-hilfe');
    hilfe.appendChild(B.knopf({
      text: 'Nach Durst füllen', zug: 'fuhre:fuellen', klasse: 'fu-klein',
      aus: voll >= kap,
      titel: 'Eine Faustregel, kein Rat: der Fuhrmann lädt für die Dürstenden. '
           + 'Der weite Weg und der zahlende Wirt stehen da nicht drin.',
      tu: fuelleNachDurst
    }));
    hilfe.appendChild(B.knopf({
      text: 'Wie vorige Woche', zug: 'fuhre:wie-vorige', klasse: 'fu-klein',
      aus: !Z.vorige, titel: 'Dieselbe Verteilung wie bei der letzten Fuhre.',
      tu: wieVorigeWoche
    }));
    hilfe.appendChild(B.knopf({
      text: 'Wagen leeren', zug: 'fuhre:leeren', klasse: 'fu-klein',
      aus: !voll, titel: 'Alles wieder in den Keller.', tu: leereWagen
    }));
    b.appendChild(hilfe);

    var lohn = fuhrlohn(), erloes = fuhrerloes();
    var ab = B.knopf({
      text: voll ? 'FUHRE ABSCHICKEN · ' + B.welt.menge(voll) + ' · bringt ' + B.welt.geld(erloes)
                 : 'FUHRE ABSCHICKEN',
      zug: 'fuhre:abschicken', klasse: 'fu-abschicken', preis: lohn ? -lohn : 0,
      aus: !voll,
      titel: voll
        ? 'Der Wagen fährt, liefert und kommt zurück. Der Fuhrmann wird danach bezahlt. '
          + 'Damit ist die Woche vorbei.'
        : 'Erst beladen. Jedes Fass bekommt ein Haus.',
      tu: schicke
    });
    b.appendChild(ab);

    if (Z.meldung) b.appendChild(B.el('div', 'fu-meldung', Z.meldung));
    fach.appendChild(b);
  }

  /* --- ZEICHEN AUF DEM BILD ------------------------------------------- */
  function zeichneMarken(fach) {
    alleHaeuser().forEach(function (a) {
      var m = D.marken[a.schluessel];
      if (!m) return;
      if (!B.orte.da(a.ort)) return;
      var marke = B.el('div', 'fu-marke');
      if (Z.verloren[a.schluessel]) marke.classList.add('weg');
      marke.appendChild(B.el('b', null, kurz(a)));
      var betten = B.el('span', 'fu-mbetten');
      var n = Math.min(6, Math.ceil(Math.round(durst(a)) / ep().wagen.schritt));
      for (var i = 0; i < n; i++) betten.appendChild(B.el('i', null));
      marke.appendChild(betten);
      marke.title = a.name + ' · will ' + B.welt.menge(Math.round(durst(a)));
      B.orte.setze(marke, a.ort, { anker: 'mitte', dy: m.dy || 0 });
      fach.appendChild(marke);
    });
  }

  /* --- DAS GEORGI-BLATT ----------------------------------------------- */

  /* Der eine Weg hinaus. Steht hier oben, weil ihn drei Dinge brauchen: der
     Knopf im Fuss der Tafel, die Sperre und die Escape-Taste. */
  function schliesseSommer(grund) {
    if (!Z.sommerOffen) return false;
    Z.sommerOffen = false;
    B.sende('zeichne', { grund: grund || 'fuhre-sommer-zu' });
    return true;
  }

  /* Liegt die Georgi-Tafel gerade oben? */
  function sommerLiegtOben() { return !!(Z.sommerOffen && Z.sommer); }

  /* Eine Tafel, die oben liegt, muss den Hintergrund WIRKLICH sperren — und
     zwar auch gegen die Tastatur. kern/kopf.js schaltet mit Leertaste und
     Eingabe eine Woche weiter; ein Deckel aus Pixeln haelt das nicht auf.
     Dieser Horcher laeuft in der Fangphase auf document und damit VOR dem
     Horcher des Kerns, der am selben Knoten in der Blasenphase haengt.
     stopImmediatePropagation() nimmt ihm die Taste ab, bevor er sie sieht.
     Angemeldet wird genau einmal, im Aufbau. */
  function tastenSperre(ereignis) {
    if (!sommerLiegtOben()) return;

    if (ereignis.key === 'Escape') {
      ereignis.preventDefault();
      ereignis.stopImmediatePropagation();
      B.ton.spiele('tafel:kreide');
      schliesseSommer('fuhre-sommer-escape');
      return;
    }

    if (ereignis.key === ' ' || ereignis.key === 'Enter') {
      /* Dem Kern die Taste in jedem Fall abnehmen — sonst laeuft die Woche
         weiter, waehrend die Tafel noch oben liegt. Nur wenn der Finger auf
         einem Knopf DIESER Tafel steht, darf die Taste ihre eigene,
         eingebaute Wirkung behalten. */
      ereignis.stopImmediatePropagation();
      var ziel = ereignis.target;
      var eigen = ziel && ziel.closest && ziel.closest('.fu-sommerblatt');
      if (!eigen) ereignis.preventDefault();
    }
  }

  function zeichneSommer(fach) {
    if (!sommerLiegtOben()) return;
    var s = Z.sommer, e = ep();

    /* Die Sperre: ein Deckel ueber der ganzen Buehne, im Fach der Fuhre und
       damit auf Ebene 'blatt' (z=60). Sie liegt ueber allem, was darunter
       liegt — insbesondere ueber dem WEITER-Knopf des Kerns auf Ebene
       'kopf' (z=50). data-frei, weil die Reiterleiste der Stadt eine Sperre
       niemals zuklappen darf: eine zugeklappte Sperre unter einer offenen
       Tafel waere genau die Falle, die sie verhindern soll. */
    var sperre = B.el('div', { klasse: 'fu-sperre', daten: { frei: '1' } });
    sperre.setAttribute('aria-hidden', 'true');
    fach.appendChild(sperre);

    var bl = B.el('div', { klasse: 'blatt fu-sommerblatt', daten: { frei: '1' } });
    bl.setAttribute('role', 'dialog');
    bl.setAttribute('aria-modal', 'true');
    bl.setAttribute('aria-label', 'Georgi ' + s.jahr);
    bl.appendChild(B.el('h2', null, 'Georgi ' + s.jahr + ' — die Tafel ist gewischt'));
    bl.appendChild(B.el('div', 'fu-satz', e.sommerSatz));
    bl.appendChild(B.el('div', 'fu-satz stark',
      'Der Aprilbestand: ' + B.welt.menge(s.april) + '. Davon sommerfest: '
      + B.welt.menge(s.sommerfest) + '. Gekippt in der ersten Hitze: ' + B.welt.menge(s.gekippt) + '.'));

    var tab = B.el('div', 'fu-sommer-tab');
    s.teile.forEach(function (t) {
      var z = B.el('div', 'fu-sommer-zeile');
      z.appendChild(B.el('span', 'm', t.monat));
      var bar = B.el('span', 'balken');
      var i = B.el('i');
      i.style.width = B.grenze(Math.round(t.rest / Math.max(1, s.sommerfest) * 100), 0, 100) + '%';
      bar.appendChild(i);
      z.appendChild(bar);
      z.appendChild(B.el('span', 'w', 'ausgeliefert ' + B.welt.menge(t.verkauft)
        + ' · Schwund ' + B.welt.menge(t.schwund) + ' · im Keller ' + B.welt.menge(t.rest)));
      tab.appendChild(z);
    });
    bl.appendChild(tab);

    bl.appendChild(B.el('div', 'fu-satz stark',
      'Sommerabsatz: ' + B.welt.menge(s.verkauft) + ' für ' + B.welt.geld(s.geld)
      + '. Übrig und wertlos: ' + B.welt.menge(s.rest) + '.'));
    if (s.abgabe) {
      bl.appendChild(B.el('div', 'fu-abgabe',
        s.abgabeName + ' auf einen Umsatz von ' + B.welt.geld(s.umsatz) + ': −'
        + B.welt.geld(s.abgabe) + '   ·   ' + s.abgabeSatz));
    }

    /* Die Abrechnung des Kerbholzes — in Geld, soweit welches da war, und
       im uebrigen in der knappen Sache dieser Zeit. */
    if (s.kerb && s.kerb.hatte) {
      var kz = B.el('div', 'fu-kerbabrechnung');
      kz.appendChild(B.el('b', null, s.kerb.name.toUpperCase() + ': '
        + s.kerb.hatte + (s.kerb.hatte === 1 ? ' Kerbe' : ' Kerben')));
      kz.appendChild(B.el('div', null, s.kerb.geloescht
        ? s.kerb.geloescht + (s.kerb.geloescht === 1 ? ' Kerbe' : ' Kerben') + ' in Geld gelöscht.'
        : 'Keine einzige in Geld gelöscht — es war keines da.'));
      if (s.kerb.offen) {
        kz.appendChild(B.el('div', null, s.kerb.offen
          + (s.kerb.offen === 1 ? ' Kerbe blieb offen' : ' Kerben blieben offen')
          + '. ' + s.kerb.sagt + ' Genommen: ' + s.kerb.wovon + '.'));
      } else {
        kz.appendChild(B.el('div', null, 'Das Holz ist glatt. Nichts genommen.'));
      }
      bl.appendChild(kz);
    }

    if (s.notsude) {
      bl.appendChild(B.el('div', 'fu-satz',
        'Aus der Not gebraut: ' + s.notsude + ' Sud '
        + (notSorte() ? notSorte().name : 'Notbier') + ' in diesem Braujahr. '
        + 'Ohne Barauslage — und ohne dass jemand dafür Geld gesehen hätte, das nicht da war.'));
    }

    if (s.verloren && s.verloren.length) {
      var vl = B.el('div', 'fu-verlust');
      vl.appendChild(B.el('b', null, s.verloren.length === 1
        ? 'Eine Adresse ist weg:' : s.verloren.length + ' Adressen sind weg:'));
      s.verloren.forEach(function (v) {
        vl.appendChild(B.el('div', null, v.name + ' — ' + (v.fremd
          ? 'der Gegner stand schon da, als es anfing'
          : 'niemand hat sie genommen; wir haben drei Jahre lang nichts geliefert')
          + '   ·   Reihe ' + v.reihe.map(function (r) { return B.welt.menge(r, true); }).join(' · ')));
      });
      bl.appendChild(vl);
    }

    /* Und gleich hier die eine Jahresentscheidung: was wird gebraut? */
    bl.appendChild(B.el('h3', null, 'Was steht ' + B.uhr.braujahr() + ' an der Tafel?'));
    var wahl = B.el('div', 'fu-sommer-wahl');
    sorten().forEach(function (so) {
      wahl.appendChild(B.knopf({
        text: so.name + ' · ' + (e.budget ? budgetKosten(so) + ' ' + e.budget.name + ' → ' : '')
              + B.welt.menge(so.fass) + (so.sommer ? ' · sommerfest' : ''),
        zug: 'fuhre:jahresplan:' + so.k,
        preis: -so.kosten,
        titel: so.satz,
        tu: function () { Z.plan[so.k] = (Z.plan[so.k] || 0) + 1; Z.tafelGewischt = false;
          B.sende('zeichne', { grund: 'fuhre-jahresplan' }); }
      }));
    });
    bl.appendChild(wahl);
    var stand = B.el('div', 'fu-satz', 'An der Tafel steht: ' + (planSummeSude()
      ? sorten().filter(function (x) { return Z.plan[x.k]; })
          .map(function (x) { return Z.plan[x.k] + '× ' + x.name; }).join(' · ')
      : 'nichts. Dann steht die Pfanne kalt.'));
    bl.appendChild(stand);

    /* Der Ausgang klebt am Fuss der Tafel. Er scrollt nicht mit: sonst haengt
       er bei einem vollen Georgi-Blatt (viele verlorene Adressen, viele
       Sorten) unter der Kante und ist bei 1920x937 nicht mehr zu treffen.
       So steht er bei jeder Aufloesung an derselben Stelle. */
    var fuss = B.el('div', 'fu-sommer-fuss');
    fuss.appendChild(B.knopf({
      text: 'Michaeli — das Jahr beginnt', zug: 'fuhre:sommer-zu', klasse: 'gross',
      titel: 'Zurück auf den Hof. Die Taste Escape tut dasselbe.',
      tu: function () { schliesseSommer('fuhre-sommer-zu'); }
    }));
    fuss.appendChild(B.el('div', 'fu-sommer-hinweis',
      'Solange diese Tafel oben liegt, ruht der Hof: WEITER ist gesperrt. '
      + 'Escape schliesst sie ebenfalls.'));
    bl.appendChild(fuss);

    fach.appendChild(bl);
  }

  /* ======================================================================
     ANMELDUNG
     ====================================================================== */
  BRAUHAUS.stueck('fuhre', {

    aufbau: function () {
      B.ton.melde('sud:pfanne', { art: 'geraeusch', sagt: 'Offene Pfanne, Holzfeuer, Rührscheit.' });
      B.ton.melde('fuhre:fass-rollen', { art: 'geraeusch', sagt: 'Ein Fass rollt über Kopfsteinpflaster.' });
      B.ton.melde('fuhre:abfahrt:ochse', { art: 'geraeusch', sagt: 'Ochsengespann, Holzräder, Peitsche.' });
      B.ton.melde('fuhre:abfahrt:pferd', { art: 'geraeusch', sagt: 'Zwei Pferde, Eisenreifen, Torbogen.' });
      B.ton.melde('fuhre:abfahrt:waggon', { art: 'geraeusch', sagt: 'Rangieren, Puffer, Dampf an der Rampe.' });
      B.ton.melde('fuhre:abfahrt:lastzug', { art: 'geraeusch', sagt: 'Diesel, Luftbremse, Kästen auf Rollen.' });
      B.ton.melde('tafel:kreide', { art: 'geraeusch', sagt: 'Kreide auf Schiefer.' });
      B.ton.melde('sommer:keller-leer', { art: 'schleife', sagt: 'Tropfen im leeren Gewölbe, Fliegen.' });
      B.ton.melde('fuhre:siegel', { art: 'geraeusch', sagt: 'Siegelwachs, Papier, Ratsstube.' });
      B.ton.melde('fuhre:kerbe', { art: 'geraeusch', sagt: 'Ein Messer schneidet eine Kerbe in Holz.' });
      B.ton.melde('fuhre:kauf', { art: 'geraeusch', sagt: 'Muenzen auf einen Ladentisch.' });

      /* Fangphase: laeuft vor dem Tastenhorcher des Kerns. Siehe tastenSperre. */
      document.addEventListener('keydown', tastenSperre, true);

      richteEpocheEin(true);

      /* Die Reihe der letzten drei Jahre auf das Mengenmass dieser Epoche
         bringen — sonst stuende 1884 eine Reihe in Fass neben einem Bedarf
         in Hektoliter, und der Kritiker koennte nichts vergleichen. */
      var mf = ep().mengenfaktor;
      B.welt.adressen.forEach(function (a) {
        if (mf !== 1) a.reihe = a.reihe.map(function (r) { return Math.round(r * mf); });
        /* Durst zum Anfang: die Woche 1 ist keine leere Buehne. */
        Z.durst[a.schluessel] = wochenbedarf(a) * (1 + B.wuerfel.zahl() * 4);
        Z.leer[a.schluessel] = B.wuerfel.ganz(0, 4);
        /* Wer schon lange mager ist, hat schon Kerben — sonst kann in fünf
           Jahren keine Adresse verlorengehen. */
        var soll = jahresbedarf(a) * 0.30, m = 0;
        for (var i = a.reihe.length - 1; i >= 0; i--) { if (a.reihe[i] < soll) m++; else break; }
        Z.mahnung[a.schluessel] = Math.min(1, m);
      });
      /* Genau EINE Adresse steht schon auf der Kippe: die mit der schwächsten
         Reihe. So sieht der Kritiker den Verlust zwei Jahre vorher kommen,
         statt in einem Jahr sechs Häuser auf einmal zu verlieren. */
      var kandidaten = B.welt.adressen.filter(function (a) { return Z.mahnung[a.schluessel] > 0; });
      if (kandidaten.length) {
        var schwaechste = kandidaten[0];
        kandidaten.forEach(function (a) {
          if (a.reihe[2] / Math.max(1, jahresbedarf(a))
            < schwaechste.reihe[2] / Math.max(1, jahresbedarf(schwaechste))) schwaechste = a;
        });
        Z.mahnung[schwaechste.schluessel] = 2;
      }
      durstWaechst();
      schreibeZettel();
    },

    woche: function () {
      if (Z.epoche !== B.welt.zeit.epoche) richteEpocheEin(false);
      Z.meldung = null;
      umlaufZurueck();
      braue();
      eisZehrt();
      durstWaechst();
      schreibeZettel();

      var e = ep();
      var unterhalt = Math.round((e.unterhalt || 1) + Z.unterhaltExtra);
      if (unterhalt > 0) {
        B.welt.zahle(unterhalt, 'Löhne, Futter, Instandhaltung', 'spieler');
      }
    },

    jahr: function () {
      var e = ep();
      /* Was der Glaeubiger sich zu Georgi genommen hat, fehlt jetzt — nicht
         in der Kasse, sondern an Brautagen bzw. Suden der Reihe. */
      Z.budget = e.budget ? Math.max(4, e.budget.start - (Z.kerbAbzug || 0)) : 0;
      Z.kerbAbzug = 0;
      Z.kaufNr.budget = 0;
      Z.ladung = [];
      Z.vorige = null;
      Z.jahrUmsatz = 0;
      Z.notGesamt = 0;
      Z.notGemeldet = false;
      Z.sommerOffen = !!Z.sommer;
      /* Listungen laufen zu Georgi aus, wenn nichts geliefert wurde. */
      /* Ein Regalmeter fällt, wenn zwei Jahre lang nichts darin stand.
         Ein leeres Jahr verzeiht der Händler noch. */
      if (e.listung) {
        var gel = jahresLieferung();
        for (var k in Z.listung) {
          if (gel[k]) { Z.listungLeer[k] = 0; continue; }
          Z.listungLeer[k] = (Z.listungLeer[k] || 0) + 1;
          if (Z.listungLeer[k] >= 2) {
            delete Z.listung[k];
            delete Z.listungLeer[k];
            var ad = B.welt.adresse(k);
            B.welt.protokolliere({ wer: 'verfall', preis: 0, adresse: k,
              was: (ad ? ad.name : k) + ': Listung gefallen, das Regal ist neu belegt' });
          }
        }
      }
      durstWaechst();
      schreibeZettel();
    },

    epoche: function () {
      richteEpocheEin(false);
      normalisiereKeller();
    },

    zeichne: function () {
      var fach = B.ebene('hand', 'fuhre');
      B.leere(fach);
      zeichneMarken(fach);
      zeichneHaeuser(fach);
      zeichneTafel(fach);
      zeichneKeller(fach);
      zeichneWagen(fach);

      var blatt = B.ebene('blatt', 'fuhre');
      B.leere(blatt);
      zeichneSommer(blatt);

      meldeZug();
    }
  });

  /* Der Wagen bleibt nicht ueber die Woche stehen: was nicht abgeschickt
     wurde, bleibt im Keller. Laeuft VOR dem Verfall, damit keine Ladung auf
     ein verdorbenes Fass zeigt. */
  B.auf('vorwoche', function () { Z.ladung = []; });

  /* Georgi. Vor der Abrechnung des Kerns, damit der Sommerabsatz noch in
     die Reihe DIESES Braujahres faellt. */
  B.auf('jahresende', function () {
    B.wage('fuhre.sommer', function () {
      sommerLaeuft();
      mahnenUndVerlieren();
      if (Z.sommer) Z.sommer.verloren = verlorenJetzt.slice();
      wischeTafel();
    });
  });

  /* Fuer den Kritiker: BRAUHAUS.fuhre.stand() in der Konsole. */
  B.fuhre = {
    stand: function () {
      return {
        fuhren: Z.fuhren, budget: Z.budget, faesser: Z.faesser, draussen: Z.draussen,
        eis: Z.eis, keller: keller().length, reif: freieFaesser().length,
        kerben: Z.kerben, kerbFrei: kerbFrei(), notsud: Z.notsud, notGesamt: Z.notGesamt,
        notsorte: notSorte() ? notSorte().name : null,
        durst: Object.keys(Z.durst).map(function (k) { return k + ':' + Math.round(Z.durst[k]); }),
        mahnung: Z.mahnung, verloren: Object.keys(Z.verloren)
      };
    }
  };

})(BRAUHAUS);
