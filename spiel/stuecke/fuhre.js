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
    durst: {},           /* adr -> Fass, die das Haus jetzt will            */
    leer: {},            /* adr -> Wochen ohne Lieferung                    */
    mahnung: {},         /* adr -> 0..3 magere Jahre in Folge               */
    verloren: {},        /* adr -> {jahr, fremd}                            */
    ladung: [],          /* [{adr, faesser:[]}] — der beladene Wagen        */
    vorige: null,        /* Verteilung der letzten Fuhre                    */
    zettel: null,
    sommer: null,
    sommerOffen: false,
    kaufNr: {},
    bannNr: 0,
    unterhaltExtra: 0,
    fuhren: 0,
    meldung: null,
    sudMeldung: null,
    tafelGewischt: false
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
  function budgetKosten(s) { var f = budgetFeld(); return f ? (s[f] || 1) : 0; }

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
    var halt = (w.haltPreis || 0) * Z.ladung.length;
    return Math.round(w.grund + halt + w.jeKm * (maxKm + 0.35 * (summeKm - maxKm)));
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

  function fuelleNachDurst() {
    var l = haeuser().slice().sort(function (x, y) {
      return (durst(y) - geladenFuer(y.schluessel)) - (durst(x) - geladenFuer(x.schluessel));
    });
    var sicherung = 0;
    while (geladen() < wagenPlaetze() && sicherung++ < 400) {
      var gelegt = false;
      for (var i = 0; i < l.length; i++) {
        var a = l[i];
        if (durst(a) - geladenFuer(a.schluessel) < 1) continue;
        if (kannLaden(a)) continue;
        var vorher = geladen();
        lade(a);
        if (geladen() > vorher) gelegt = true;
        if (geladen() >= wagenPlaetze()) break;
      }
      if (!gelegt) break;
    }
    B.sende('zeichne', { grund: 'fuhre-fuellen' });
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

    if (!B.welt.zahle(lohn, 'Fuhrlohn ' + (frachtstufe() ? frachtstufe().name : e.wagen.name)
        + ' · ' + Z.ladung.length + (Z.ladung.length === 1 ? ' Halt' : ' Halte'), 'spieler')) {
      Z.meldung = 'Die Kasse reicht nicht für den Fuhrlohn.';
      B.sende('zeichne', { grund: 'fuhre-arm' });
      return;
    }

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

      /* Geliefert heisst gebunden — bis der Naechste kommt. */
      if (!a.bindung || a.bindung.wem === 'haus') {
        B.welt.binde(a.schluessel, 'haus', 'Lieferung', B.welt.zeit.jahr + 1);
      }

      /* Die Faesser stehen jetzt beim Wirt und fehlen im eigenen Bestand. */
      Z.umlauf.push({ faellig: woManifest() + (e.wagen.umlauf || 1), n: n });
      Z.draussen += n;
    });

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
    var e = ep(), gruende = [], gebraut = 0, sudZahl = 0;
    var jeWoche = e.budget ? e.budget.jeWoche : (e.sudeJeWoche || 2);
    var grenzeSude = e.budget ? Infinity : Z.sudeJeWoche;
    var verbrauchtWoche = 0;

    for (var si = 0; si < sorten().length; si++) {
      var s = sorten()[si];
      var will = Z.plan[s.k] || 0;
      for (var n = 0; n < will; n++) {
        var kost = budgetKosten(s);
        if (e.budget) {
          if (verbrauchtWoche + kost > jeWoche) { gruende.push('die Woche hat nur ' + jeWoche + ' ' + e.budget.name); break; }
          if (Z.budget < kost) { gruende.push(e.budget.name + ' verbraucht'); break; }
        } else {
          if (sudZahl >= grenzeSude) { gruende.push('nur ' + grenzeSude + ' Sude je Woche'); break; }
        }
        if (B.welt.vorrat.plaetze - keller().length < s.fass) { gruende.push('kein Platz im Keller'); break; }
        if (fassplaetzeFrei() < s.fass) { gruende.push('keine leeren Fässer'); break; }
        if (B.welt.haus.rohstoff < s.rohstoff) { gruende.push('kein ' + (B.welt.epoche().rohstoff || 'Rohstoff')); break; }
        if (e.eis && Z.eis < (s.eis || 0)) { gruende.push('kein Eis'); break; }
        if (!B.welt.kann(s.kosten)) { gruende.push('die Kasse'); break; }

        B.welt.zahle(s.kosten, 'Ein Sud ' + s.name, 'spieler');
        B.welt.haus.rohstoff -= s.rohstoff;
        if (e.eis) Z.eis = Math.max(0, Z.eis - (s.eis || 0));
        if (e.budget) { Z.budget -= kost; verbrauchtWoche += kost; }
        sudZahl++;

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
      }
    }

    if (gebraut) B.ton.spiele('sud:pfanne', { ort: 'kesselstelle' });
    Z.sudMeldung = gebraut
      ? gebraut + ' Fass angesetzt' + (gruende.length ? ' — dann: ' + gruende[0] : '')
      : (planSummeSude() ? 'Kein Sud: ' + (gruende[0] || 'die Tafel steht leer') : 'Die Tafel ist leer.');
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

  function eisZehrt() {
    var e = ep();
    if (!e.eis) return;
    var brauch = Math.ceil(keller().length / 14) + (keller().length ? 1 : 0);
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
    var liegt = freieFaesser().length;
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
      satz: e.sommerSatz,
      rest: vorrat.length
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

  function mahnenUndVerlieren() {
    var geliefert = jahresLieferung();
    alleHaeuser().forEach(function (a) {
      if (Z.verloren[a.schluessel]) return;
      var soll = jahresbedarf(a) * 0.35;
      var ist = geliefert[a.schluessel] || 0;
      if (ist < soll) {
        Z.mahnung[a.schluessel] = (Z.mahnung[a.schluessel] || 0) + 1;
      } else {
        Z.mahnung[a.schluessel] = Math.max(0, (Z.mahnung[a.schluessel] || 0) - 1);
      }
      if (Z.mahnung[a.schluessel] >= 3) {
        var fremd = a.bindung && a.bindung.wem && a.bindung.wem !== 'haus' ? a.bindung.wem : null;
        Z.verloren[a.schluessel] = { jahr: B.welt.zeit.jahr + 1, fremd: fremd };
        B.welt.binde(a.schluessel, null);
        B.welt.protokolliere({ wer: 'verfall',
          was: a.name + ' führt kein Bier des Hauses mehr', preis: 0, adresse: a.schluessel });
        B.welt.schreibe(a.name + ' nimmt nichts mehr. ' + (fremd
          ? 'Der Gegner stand schon vor der Tür.'
          : 'Niemand hat die Adresse genommen — wir haben sie drei Jahre lang liegen lassen.'), 'fuhre');
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
    Z.fracht = e.fracht ? e.fracht[0].k : 'stueck';
    Z.halte = e.wagen.halte;
    Z.eisKeller = e.eis ? e.eis.keller : 0;
    Z.eis = e.eis ? e.eis.start : 0;
    Z.ladung = [];
    Z.vorige = null;
    Z.kaufNr = {};
    Z.bannNr = 0;
    Z.plan = {};
    /* Ein Vorschlag steht an der Tafel, damit die erste Woche laeuft.
       Kein Tutorial — eine Lage, die schon eingestellt ist. */
    var standard = sorten()[1] || sorten()[0];
    Z.plan[standard.k] = 1;

    /* In 1970 gehoeren die Regalmeter der Marke, nicht dem Haus: zwei
       Adressen sind schon gelistet, die anderen nicht. */
    if (e.listung) {
      Z.listung = {};
      var l = alleHaeuser();
      for (var i = 0; i < l.length && i < 3; i++) {
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
    if (!B.welt.zahle(preis, def.text, 'spieler')) {
      Z.meldung = 'Die Kasse reicht nicht: ' + def.text + ' kostet ' + B.welt.geld(preis) + '.';
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
    if (!B.welt.zahle(preis, 'Bannbrief für ' + a.name, 'spieler')) {
      Z.meldung = 'Der Bannbrief für ' + a.name + ' kostet ' + B.welt.geld(preis) + '.';
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
    if (!B.welt.zahle(preis, 'Listung ' + s.name + ' beim ' + a.name, 'spieler')) {
      Z.meldung = 'Der Regalmeter beim ' + a.name + ' kostet ' + B.welt.geld(preis) + '.';
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
    haeuser().forEach(function (a) { wollen += Math.round(durst(a)); });

    var b = brett('fu-haeuser', 'DIE HÄUSER',
      'wollen ' + B.welt.menge(wollen, true) + ' · im Keller liegen ' + B.welt.menge(liegt));

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
        'AUFGEGEBEN ' + weg.jahr + (weg.fremd ? ' — der Gegner stand schon da'
                                              : ' — niemand hat sie genommen')));
    } else {
      var schritt = e.wagen.schritt;
      var will = Math.round(durst(a));
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
        z2.appendChild(B.knopf({
          text: 'Bannbrief', zug: 'fuhre:bann:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat', preis: -preis,
          titel: e.bann.satz + ' ' + a.name + ' liegt ' + a.km + ' km außerhalb.',
          tu: function () { loeseBann(a); }
        }));
      } else if (grund && e.listung && !gelistet(a)) {
        var s0 = sorten()[1] || sorten()[0];
        var n2 = 0;
        for (var kk in Z.listung) for (var qq in Z.listung[kk]) if (Z.listung[kk][qq]) n2++;
        z2.appendChild(B.knopf({
          text: 'Regalmeter', zug: 'fuhre:listen:' + a.schluessel,
          klasse: 'fu-klein fu-fest fu-tat',
          preis: -Math.round(e.listung.basis * Math.pow(e.listung.staffel, n2)),
          titel: e.listung.satz + ' Gelistet würde: ' + s0.name + '.',
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
      var saeule = B.el('i', 'fu-saeule' + (r < soll * 0.35 ? ' mager' : ''));
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
      sz.appendChild(B.el('b', null, 'Sudhaus: ' + Z.sudeJeWoche + ' Sude je Woche'));
      sz.appendChild(B.el('span', null, e.knappSatz));
      b.appendChild(sz);
    }

    if (Z.tafelGewischt) {
      b.appendChild(B.el('div', 'fu-gewischt',
        'GEWISCHT ZU GEORGI — schreib den Plan für ' + B.uhr.braujahr() + ' an.'));
    }

    var frei = B.welt.zeit.woche <= (e.tafel.freiBis || 3);
    var aendern = frei ? 0 : e.tafel.preis;

    var tab = B.el('div', 'fu-sorten');
    sorten().forEach(function (s) {
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
    b.appendChild(tab);

    if (Z.sudMeldung) b.appendChild(B.el('div', 'fu-sudmeldung', Z.sudMeldung));

    /* Die Knappheit loesen: Preisschilder nebeneinander, die einander
       ausschliessen, weil die Kasse nur fuer eines reicht. */
    var kauf = B.el('div', 'fu-kaeufe');
    (e.kaeufe || []).forEach(function (def) {
      var preis = staffelPreis(def.k, def.basis, def.staffel);
      var aus = !B.welt.kann(preis);
      var titel = def.titel;
      if (def.k === 'eis') {
        if (!frostzeit()) { aus = true; titel = 'Der Fluss trägt nicht mehr. Eis gibt es von Woche '
          + e.eis.frostVon + ' bis ' + e.eis.frostBis + ' und sonst nie.'; }
        else if (Z.eis >= Z.eisKeller) { aus = true; titel = 'Der Eiskeller ist voll.'; }
      }
      kauf.appendChild(B.knopf({
        text: def.text, zug: 'fuhre:kauf:' + def.k, preis: -preis,
        klasse: 'fu-klein', aus: aus, titel: titel,
        tu: function () { kaufe(def.k); }
      }));
    });
    b.appendChild(kauf);
    fach.appendChild(b);
  }

  function stelleTafel(s, richtung, preis) {
    if (richtung > 0 && preis) {
      if (!B.welt.zahle(preis, 'Der Braumeister stellt um', 'spieler')) {
        Z.meldung = 'Umstellen kostet ' + B.welt.geld(preis) + '. Die Kasse reicht nicht.';
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
        ? 'Der Wagen fährt, liefert und kommt zurück. Damit ist die Woche vorbei.'
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
  function zeichneSommer(fach) {
    if (!Z.sommerOffen || !Z.sommer) return;
    var s = Z.sommer, e = ep();
    var bl = B.el('div', 'blatt fu-sommerblatt');
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
      'Sommerabsatz: ' + B.welt.menge(s.verkauft) + ' fuer ' + B.welt.geld(s.geld)
      + '. Übrig und wertlos: ' + B.welt.menge(s.rest) + '.'));

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

    bl.appendChild(B.knopf({
      text: 'Michaeli — das Jahr beginnt', zug: 'fuhre:sommer-zu', klasse: 'gross',
      titel: 'Zurück auf den Hof.',
      tu: function () { Z.sommerOffen = false; B.sende('zeichne', { grund: 'fuhre-sommer-zu' }); }
    }));
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
        /* Wer schon lange mager ist, hat schon Kerben — sonst kann in fuenf
           Jahren keine Adresse verlorengehen. */
        var soll = jahresbedarf(a) * 0.35, m = 0;
        for (var i = a.reihe.length - 1; i >= 0; i--) { if (a.reihe[i] < soll) m++; else break; }
        Z.mahnung[a.schluessel] = Math.min(2, m);
      });
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
      var unterhalt = Math.round((e.wagen.grund || 1) * 0.6 + Z.unterhaltExtra);
      if (unterhalt > 0) {
        B.welt.zahle(unterhalt, 'Löhne, Futter, Instandhaltung', 'spieler');
      }
    },

    jahr: function () {
      var e = ep();
      Z.budget = e.budget ? e.budget.start + (Z.kaufNr.budget || 0) * 0 : 0;
      Z.kaufNr.budget = 0;
      Z.ladung = [];
      Z.vorige = null;
      Z.sommerOffen = !!Z.sommer;
      /* Listungen laufen zu Georgi aus, wenn nichts geliefert wurde. */
      if (e.listung) {
        var gel = jahresLieferung();
        for (var k in Z.listung) {
          if (!gel[k]) delete Z.listung[k];
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
      wischeTafel();
    });
  });

  /* Fuer den Kritiker: BRAUHAUS.fuhre.stand() in der Konsole. */
  B.fuhre = {
    stand: function () {
      return {
        fuhren: Z.fuhren, budget: Z.budget, faesser: Z.faesser, draussen: Z.draussen,
        eis: Z.eis, keller: keller().length, reif: freieFaesser().length,
        durst: Object.keys(Z.durst).map(function (k) { return k + ':' + Math.round(Z.durst[k]); }),
        mahnung: Z.mahnung, verloren: Object.keys(Z.verloren)
      };
    }
  };

})(BRAUHAUS);
