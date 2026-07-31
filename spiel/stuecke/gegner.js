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
    schutz: {},              /* adr -> Jahr, bis zu dem er nicht ran darf   */
    wagen: null,             /* {wer, von, nach, seit, dauer, text}         */
    zuege: [],               /* alle sichtbaren Zuege, neueste zuerst       */
    zaehler: 0,
    wechsel: {},             /* adr -> {takt, an, von} — frisch gewechselt  */
    offen: false,
    seite: 'lage',
    zeigt: null,             /* Ort, auf den der Zeigefinger deutet         */
    wahl: null,
    meldung: null,
    wirkung: {},             /* dauerhafte Folgen der eigenen Festlegungen  */
    gegenzugGetan: {},       /* amtszeit-Nr -> true                         */
    angebot: null,           /* IV: das Angebot der Gruppe                  */
    abschlag: 0,             /* was der Abschlag im letzten Jahr kostete    */
    abschlagJahr: 0,
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

  function mittelVon(k) { return MITTEL[k] || ep().mittel[0]; }

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
    if (m.fest) {
      /* Ratsspruch, Buergermeisteramt: nur solange er das Amt hat. */
      if (h && h.marken[m.k === 'ratssitz' ? 'ratssitz' : 'buergermeister']) return null;
      if (h && (h.marken.ratssitz || h.marken.buergermeister)) return null;
    }
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
    return Math.max(1, Math.round(summe));
  }

  /* Zuvorkommen, solange er erst wirbt: nicht einmal die Haelfte. */
  function werbepreis(a, m) {
    var p = Math.round(grundwert(a, m) * 0.45);
    if (Z.wirkung.bank) p = Math.round(p * (2 / 3));
    return Math.max(1, p);
  }

  /* Was der Abschlag kostet: solange er die Adresse haelt, druckt er den
     Preis, den das Haus dort noch bekommt. Je Fass, das das Haus liefert. */
  function abschlagJeFass(k) {
    var b = Z.bindung[k];
    if (!b) return 0;
    var m = mittelVon(b.mittel);
    var satz = m.satz || 3;
    return satz * (ep().abschlagAnteil || 0.3);
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
        h.erbe.name + ' uebernimmt ' + nameVon(h) + '. Man sagt: ' + w.sagt,
        sitzVon(h).ort, null);
      B.welt.schreibe('Gegenueber uebernimmt ' + h.erbe.name + ' — ' + w.sagt, 'gegner');
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
    /* Er faengt nicht bei null an: zwei Bauten stehen schon auf dem Hof. */
    var b = ep().bauten;
    for (var i = 0; i < 2 && i < b.length; i++) h.bauten.push(b[i].k);
    g.kasse = h.kasse;
    return h;
  }

  /* Die Ausgangslage aus welt.js hat Bindungen mit "Gewohnheit". Was der
     Gegner haelt, bekommt sofort ein richtiges Mittel dieser Epoche —
     damit vom ersten Bildschirm an eine Summe am Schild steht. */
  function uebernehmeAusgangslage() {
    var frei = ep().mittel.filter(function (m) { return !m.fest; });
    B.welt.adressen.forEach(function (a) {
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

  function merkeZug(h, art, text, ort, adr) {
    Z.zaehler += 1;
    h.zuege += 1;
    var g = weltGegner(h.k);
    if (g) { g.zuege = h.zuege; g.kasse = Math.round(h.kasse); }
    var e = {
      nr: Z.zaehler, jahr: jahr(), woche: woche(), takt: takt(),
      wer: h.k, werName: nameVon(h), art: art, text: text,
      ort: ort || sitzVon(h).ort, adr: adr || null
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
      if (Z.wirkung.ratsstuhl && epNr() <= 2) return false;   /* der eigene Ratsstuhl sperrt ihn */
      return true;
    };
  }

  /* ---- die einzelnen Zuege -------------------------------------------- */

  function zugWerben(h) {
    var a = suche(freiFuerIhn(h));
    if (!a) return false;
    var frei = ep().mittel.filter(function (m) { return !m.fest; });
    var m = B.wuerfel.aus(frei);
    var w = ep().wochenWerbung;
    Z.werbung[a.schluessel] = {
      wer: h.k, mittel: m.k, seit: takt(),
      bis: takt() + B.wuerfel.ganz(w[0], w[1]),
      preis: werbepreis(a, m)
    };
    merkeZug(h, 'werben',
      nameVon(h) + ' wirbt um ' + a.name + ': ' + ep().werbesatz
      + ' Zuvorkommen kostet ' + B.welt.geld(Z.werbung[a.schluessel].preis) + '.',
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
    h.kasse -= Math.round(g * 0.5);
    B.welt.binde(a.schluessel, h.k, m.womit, jahr() + m.jahre);
    Z.bindung[a.schluessel] = {
      wer: h.k, mittel: m.k, seit: jahr(), bis: jahr() + m.jahre, grund: g, zusatz: 0
    };
    Z.wechsel[a.schluessel] = { takt: takt(), an: h.k, von: vorher };
    merkeZug(h, vorher === 'haus' ? 'entreissen' : 'binden', text, a.ort, a.schluessel);
    if (vorher === 'haus') {
      B.welt.schreibe(a.name + ' geht an ' + nameVon(h) + '. '
        + 'Gebunden mit ' + m.womit + ' bis ' + (jahr() + m.jahre)
        + '. Abloesen kostet ' + B.welt.geld(abloese(a.schluessel)) + '.', 'gegner');
    }
    return true;
  }

  function zugEntreissen(h, zug) {
    var a = suche(fremde(h));
    if (!a) return false;
    var m = mittelVon(zug.mittel || ep().mittel[0].k);
    if (m.fest && !h.marken[m.k]) {
      m = mittelVon(B.wuerfel.aus(ep().mittel.filter(function (x) { return !x.fest; })).k);
    }
    var text = (zug.text || '{haus} geht an den Adler.').replace('{haus}', a.name);
    return binde(h, a, m, text);
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
      + ' Abloesen kostet jetzt ' + B.welt.geld(abloese(a.schluessel)) + '.',
      a.ort, a.schluessel);
    return true;
  }

  function zugBauen(h) {
    var l = ep().bauten.filter(function (b) {
      return h.bauten.indexOf(b.k) < 0 && h.kasse >= b.preis;
    });
    if (!l.length) return false;
    var b = B.wuerfel.aus(l);
    h.kasse -= b.preis;
    h.bauten.push(b.k);
    merkeZug(h, 'bauen',
      nameVon(h) + ' baut auf dem eigenen Hof: ' + b.name + ' fuer ' + B.welt.geld(b.preis) + '.',
      sitzVon(h).ort, null);
    return true;
  }

  function zugPreis(h, zug) {
    var boden = Math.round(bierpreis() * 0.62);
    if (h.preis <= boden) return false;
    h.preis = Math.max(boden, h.preis - (zug.schritt || 1));
    merkeZug(h, 'preis',
      (zug.text || '').replace('{geld}', B.welt.geld(h.preis)),
      sitzVon(h).ort, null);
    return true;
  }

  function zugFuhre(h, zug) {
    var l = seine(h);
    if (!l.length) l = offeneAdressen();
    if (!l.length) return false;
    var a = B.wuerfel.aus(l);
    Z.wagen = {
      wer: h.k, von: sitzVon(h).ort, nach: a.ort,
      seit: takt(), dauer: 3, text: a.name
    };
    merkeZug(h, 'fuhre', (zug.text || '').replace('{haus}', a.name), a.ort, a.schluessel);
    return true;
  }

  function zugRohstoff(h, zug) {
    var ort = B.orte.da(zug.ort) ? zug.ort : 'muehle';
    Z.wagen = { wer: h.k, von: ort, nach: sitzVon(h).ort, seit: takt(), dauer: 3, text: 'Rohstoff' };
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
    B.welt.binde(a.schluessel, null);
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

  function zugUebernahme(h, zug) {
    var preis = Math.round(h.kasse * 0.22) + 1;
    h.kasse -= preis;
    h.brauereien += 1;
    merkeZug(h, 'uebernahme',
      zug.text + ' Sie zahlt ' + B.welt.geld(preis) + '. Es ist die '
      + h.brauereien + '. in dieser Gegend.', sitzVon(h).ort, null);
    B.welt.schreibe(zug.text, 'gegner');
    return true;
  }

  function zugAngebot(h, zug) {
    if (Z.angebot || Z.wirkung.anteil || Z.wirkung.abgelehnt) return false;
    var wert = Math.max(50000, Math.round(B.welt.haus.kasse * 1.4
      + B.welt.adressenJetzt().filter(function (a) {
        return a.bindung && a.bindung.wem === 'haus';
      }).length * 90000));
    Z.angebot = { jahr: jahr(), summe: wert, wer: h.k };
    merkeZug(h, 'angebot',
      zug.text + ' Sie bietet ' + B.welt.geld(wert) + ' fuer ein Viertel des Hauses.',
      sitzVon(h).ort, null);
    B.welt.schreibe('Die Nordstern-Gruppe bietet ' + B.welt.geld(wert)
      + ' fuer ein Viertel des Hauses. Die Antwort wird nicht zurueckgenommen.', 'gegner');
    return true;
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
    return (h.k === 'konzern' && e.konzernzuege) ? e.konzernzuege : e.zuege;
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

  function waehle(h) {
    var liste = zugliste(h);
    /* Pflichtliste zuerst — aber nur, was gerade moeglich ist. */
    if (h.k === 'adler' && h.zuege < PFLICHT.length) {
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
    for (var versuch = 0; versuch < 5; versuch++) {
      var zug = waehle(h);
      if (fuehreAus(h, zug)) { h.letzterZug = Z.takt; return true; }
    }
    /* Wenn gar nichts geht, dann wenigstens der Wagen. */
    return zugFuhre(h, { text: 'Ein grauer Wagen des Hauses gegenueber faehrt zum {haus}.' });
  }

  /* ----------------------------------------------------------------------
     DIE WOCHE — was ohne den Spieler geschieht
     ---------------------------------------------------------------------- */
  function wocheLaeuft() {
    Z.takt = takt();

    /* Werbungen, die auslaufen, werden zu Bindungen. Ohne Rueckfrage. */
    Object.keys(Z.werbung).forEach(function (k) {
      if (Z.werbung[k].bis <= Z.takt) loeseWerbungEin(k);
    });

    haeuserJetzt().forEach(function (h) {
      var seit = Z.takt - h.letzterZug;
      /* Die ersten zehn Zuege kommen sicher: hoechstens zwei Wochen Pause.
         Danach entscheidet sein Wesen und seine Lage. */
      var muss = (h.k === 'adler' && h.zuege < PFLICHT.length && seit >= 2);
      var g = weltGegner(h.k);
      var mut = g ? g.wagemut : 0.5;
      if (h.stufe >= 2) mut *= 0.5;
      if (muss || B.wuerfel.trifft(mut * (h.k === 'konzern' ? 0.7 : 1))) zieht(h);
    });

    /* Der graue Wagen kommt an. */
    if (Z.wagen && Z.takt - Z.wagen.seit > Z.wagen.dauer) Z.wagen = null;
  }

  /* ----------------------------------------------------------------------
     DAS JAHR — Abrechnung, Erbfall, Untergang
     ---------------------------------------------------------------------- */
  function jahrLaeuft() {
    /* 1. Der Abschlag: was ihn zu halten kostet, dass er haelt.
       Fuer jedes Fass, das das Haus an eine seiner Adressen geliefert hat,
       drueckt er den Preis. Das steht im Buch, mit seinem Namen davor. */
    var jetzt = jahr() - 1;
    var geliefert = {};
    B.protokoll.forEach(function (p) {
      if (p.adresse && p.menge && (p.jahr === jetzt || p.jahr === jahr())) {
        geliefert[p.adresse] = (geliefert[p.adresse] || 0) + p.menge;
      }
    });
    var summe = 0, wo = [];
    Object.keys(Z.bindung).forEach(function (k) {
      var n = geliefert[k] || 0;
      if (!n) return;
      var teil = Math.round(n * abschlagJeFass(k));
      if (teil <= 0) return;
      summe += teil;
      var a = adresse(k);
      wo.push((a ? a.name : k) + ': ' + B.welt.geld(teil));
      var h = haus(Z.bindung[k].wer);
      if (h) h.kasse += teil;
    });
    summe = Math.min(summe, Math.round(Math.max(0, B.welt.haus.kasse) * 0.25));
    Z.abschlag = summe;
    Z.abschlagJahr = jahr();
    if (summe > 0) {
      B.welt.zahle(summe, 'Preisabschlag, weil der Adler die Adresse haelt ('
        + wo.join(', ') + ')', 'gegner');
    }

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
        var verlust = Math.round((bierpreis() - h.preis) * seine(h).length * menge(offeneAdressen()[0] || { bedarf: 20 }) * 0.15);
        h.kasse -= Math.max(0, verlust);
      }
      /* Er erholt sich langsam vom Preiskampf. */
      if (B.wuerfel.trifft(0.35) && h.preis < bierpreis()) h.preis += 1;
    });

    /* 3. Bindungen, die auslaufen. */
    Object.keys(Z.bindung).forEach(function (k) {
      var b = Z.bindung[k];
      var a = adresse(k);
      if (!a) { delete Z.bindung[k]; return; }
      if (b.bis <= jahr() || !a.bindung || a.bindung.wem !== b.wer) {
        if (a.bindung && a.bindung.wem === b.wer) B.welt.binde(k, null);
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
      if (ab > 0) B.welt.zahle(ab, 'Gewinnabfuehrung an die Nordstern-Gruppe (ein Viertel)', 'gegner');
    }
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
        B.welt.binde(a.schluessel, null);
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
        merkeZug(h, 'not', nameVon(h) + ' verpfaendet ' + name + '. Der Hof wird kleiner.',
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
      merkeZug(kon, 'schluckt', 'Die Nordstern-Gruppe uebernimmt ' + nameVon(h)
        + '. Der Name bleibt auf dem Etikett, die Entscheidung nicht im Haus.',
        sitzVon(kon).ort, null);
      B.welt.schreibe('Das Haus gegenueber ist gefallen: ' + nameVon(h)
        + ' gehoert der Nordstern-Gruppe. Alle seine Adressen mit.', 'gegner');
    } else {
      seine(h).forEach(function (a) {
        B.welt.binde(a.schluessel, null);
        delete Z.bindung[a.schluessel];
        Z.wechsel[a.schluessel] = { takt: takt(), an: null, von: h.k };
      });
      h.weg = true;
      merkeZug(h, 'ende', nameVon(h) + ' gibt auf. Der Hof gegenueber steht leer, '
        + 'die Adressen sind frei.', sitzVon(h).ort, null);
      B.welt.schreibe(nameVon(h) + ' gibt auf. Zum ersten Mal seit ' + h.erbe.seit
        + ' braut gegenueber niemand.', 'gegner');
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
        + '. Die Kasse haelt ' + B.welt.geld(B.welt.haus.kasse) + '.';
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
    Z.meldung = a.name + ': zuvorgekommen. Drei Jahre lang ruehrt er die Adresse nicht an.';
    neuZeichnen('gegner-zuvor');
  }

  function loeseAb(k) {
    var b = Z.bindung[k], a = adresse(k);
    if (!b || !a) return;
    var summe = abloese(k);
    if (summe === null) {
      Z.meldung = mittelVon(b.mittel).loest;
      return neuZeichnen('gegner-fest');
    }
    if (!B.welt.zahle(summe, 'Abloesung der Bindung am ' + a.name, 'spieler')) {
      Z.meldung = 'Die Abloesung am ' + a.name + ' kostet ' + B.welt.geld(summe)
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
    B.welt.schreibe(a.name + ' wird abgeloest: ' + B.welt.geld(summe) + ' in der Waehrung '
      + 'dieser Zeit — ' + m.name + '. Vier Jahre lang kommt er nicht wieder.', 'gegner');
    B.ton.spiele('gegner:abloesen', { ort: a.ort });
    Z.meldung = a.name + ' gehoert jetzt dem Haus. ' + B.welt.geld(summe) + ' dafuer.';
    neuZeichnen('gegner-abloese');
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
    B.welt.schreibe('Das Haus verkauft ein Viertel an die Nordstern-Gruppe fuer '
      + B.welt.geld(Z.angebot.summe) + '. Von heute an redet die Gruppe mit. '
      + 'Das wird nicht zurueckgenommen.', 'festlegung');
    Z.angebot = null;
    Z.meldung = 'Angenommen. Die Gruppe haelt ein Viertel und fuehrt jedes Jahr Gewinn ab.';
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
      + 'Das wird nicht zurueckgenommen.', 'festlegung');
    Z.meldung = 'Abgelehnt. ' + n + ' Adressen sind noch am selben Tag weg.';
    neuZeichnen('gegner-abgelehnt');
  }

  function neuZeichnen(grund) { B.sende('zeichne', { grund: grund || 'gegner' }); }

  /* ----------------------------------------------------------------------
     DER NAECHSTE SINNVOLLE ZUG — die eine Zahl der Messlatte
     ---------------------------------------------------------------------- */
  function meldeZug() {
    var bester = null;
    Object.keys(Z.werbung).forEach(function (k) {
      var a = adresse(k);
      if (!a) return;
      var p = Z.werbung[k].preis;
      if (!bester || p < bester.preis) bester = { was: 'Zuvorkommen ' + a.name, preis: p };
    });
    Object.keys(Z.bindung).forEach(function (k) {
      var a = adresse(k), p = abloese(k);
      if (!a || p === null) return;
      if (!bester || p < bester.preis) bester = { was: 'Abloesung ' + a.name, preis: p };
    });
    if (bester) B.welt.meldeZug(bester.was, bester.preis);
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

  /* --- sein Sitz: Schild, Kasse, Preis, Zugzaehler --------------------- */
  function zeichneSitz(fach, h) {
    var s = sitzVon(h);
    var k = document.createElement('button');
    k.type = 'button';
    k.className = 'gg-sitz gg-' + stamm(h.k).farbe + (Z.offen && Z.seite === h.k ? ' offen' : '')
      + (h.stufe >= 1 ? ' klamm' : '');
    k.setAttribute('data-zug', 'gegner:oeffnen:' + h.k);
    k.title = nameVon(h) + ' — ' + s.sagt + '. ' + h.erbe.name + ', ' + h.erbe.wesenName
      + '. Anklicken: das ganze Haus gegenueber.';

    var kopf = B.el('div', 'gg-sitzkopf');
    kopf.appendChild(svg(h.k === 'konzern' ? STERN_SVG : ADLER_SVG, 'gg-wappen'));
    var t = B.el('div', 'gg-sitztext');
    t.appendChild(B.el('div', 'gg-name', nameVon(h)));
    t.appendChild(B.el('div', 'gg-erbe', h.erbe.name + ' · ' + h.erbe.wesenName));
    kopf.appendChild(t);
    k.appendChild(kopf);

    var z = B.el('div', 'gg-zahlen');
    z.appendChild(zahlfeld('Zuege', String(h.zuege)));
    z.appendChild(zahlfeld('Kasse', B.welt.geld(Math.round(h.kasse / 10) * 10)));
    if (h.k === 'adler') {
      z.appendChild(zahlfeld('Preis', B.welt.geld(h.preis) + '/' + B.welt.mengeEinheit()));
    } else {
      z.appendChild(zahlfeld('Brauereien', String(h.brauereien)));
    }
    z.appendChild(zahlfeld('Haeuser', String(seine(h).length)));
    k.appendChild(z);

    var marken = B.el('div', 'gg-marken');
    Object.keys(h.marken).forEach(function (mk) {
      var namen = { ratssitz: 'Sitz im Rat', buergermeister: 'Buergermeister',
                    emailschild: 'Emailschild', fernsehen: 'Fernsehwerbung' };
      marken.appendChild(B.el('span', 'gg-siegel', namen[mk] || mk));
    });
    if (h.stufe >= 1) marken.appendChild(B.el('span', 'gg-siegel not', D.untergang[h.stufe].name));
    if (marken.childNodes.length) k.appendChild(marken);

    B.orte.setze(k, s.ort, { anker: 'oben', dx: s.dx || 0, dy: s.dy || 0 });
    fach.appendChild(k);
    return s;
  }

  function zahlfeld(marke, wert) {
    var f = B.el('span', 'gg-feld');
    f.appendChild(B.el('b', null, wert));
    f.appendChild(B.el('i', null, marke));
    return f;
  }

  /* --- sein Hof: was darauf steht, steht im Bild ------------------------ */
  function zeichneHof(fach, h) {
    var s = sitzVon(h);
    var hof = B.el('div', 'gg-hof');
    if (h.k === 'adler') {
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
      var i = B.el('span', 'gg-bau');
      i.appendChild(svg(glyph(b ? b.glyph : 'kammer')));
      i.title = (b ? b.name : bk) + ' — steht auf dem Hof gegenueber.';
      reihe.appendChild(i);
    });
    hof.appendChild(reihe);
    B.orte.setze(hof, s.ort, { anker: 'oben', dx: s.dx || 0, dy: (s.dy || 0) + 11.5 });
    fach.appendChild(hof);
  }

  /* --- das leere Stammhaus: derselbe Ort, nur er ist weg ---------------- */
  function zeichneStammhaus(fach) {
    var st = stamm('adler').stammhaus;
    if (!st || epNr() < st.ab) return;
    var m = B.el('div', 'gg-stammhaus');
    m.appendChild(B.el('span', null, st.text));
    B.orte.setze(m, st.ort, { anker: 'oben', dx: st.dx, dy: st.dy });
    m.title = 'Bis 1867 stand der Adler hier, Wand an Wand mit dem Rathaus.';
    fach.appendChild(m);
  }

  /* --- Schilder und Wimpel an den Wirtshaeusern ------------------------- */
  function zeichneAdressen(fach) {
    offeneAdressen().forEach(function (a) {
      var k = a.schluessel;
      var b = Z.bindung[k];
      var w = Z.werbung[k];
      var wechsel = Z.wechsel[k];
      var frisch = wechsel && (Z.takt - wechsel.takt) <= 3;

      if (b) {
        var h = haus(b.wer);
        if (!h) return;
        var m = mittelVon(b.mittel);
        var summe = abloese(k);
        var s = document.createElement('button');
        s.type = 'button';
        s.className = 'gg-schild gg-' + stamm(b.wer).farbe
          + (frisch ? ' frisch' : '') + (summe === null ? ' fest' : '');
        s.setAttribute('data-zug', 'gegner:abloesen:' + k);
        s.setAttribute('data-adr', k);
        s.title = a.name + ' · ' + m.name + ' des ' + nameVon(h) + ', laeuft bis ' + b.bis
          + '. ' + m.loest + (summe === null ? '' : ' Abloesung: ' + B.welt.geld(summe) + '.');
        s.appendChild(svg(b.wer === 'konzern' ? STERN_SVG : ADLER_SVG, 'gg-wappen klein'));
        var txt = B.el('span', 'gg-schildtext');
        txt.appendChild(B.el('b', null, (D.kurz[k] || k.slice(0, 3).toUpperCase()) + ' · ' + m.kurz));
        txt.appendChild(B.el('i', null, summe === null
          ? 'nicht abloesbar' : 'abloesen ' + B.welt.geld(summe)));
        s.appendChild(txt);
        if (summe !== null && !B.welt.kann(summe)) s.classList.add('zuteuer');
        B.orte.setze(s, a.ort, { anker: 'unten', dy: -3.6 });
        s.addEventListener('click', function () { loeseAb(k); });
        fach.appendChild(s);
        return;
      }

      if (w) {
        var mw = mittelVon(w.mittel);
        var rest = Math.max(0, w.bis - Z.takt);
        var p = document.createElement('button');
        p.type = 'button';
        p.className = 'gg-wimpel gg-' + stamm(w.wer).farbe;
        p.setAttribute('data-zug', 'gegner:zuvorkommen:' + k);
        p.setAttribute('data-adr', k);
        p.title = nameVon(haus(w.wer)) + ' wirbt um ' + a.name + ' mit ' + mw.name
          + '. In ' + rest + ' Wochen ist die Bindung da, ohne dass du etwas tust. '
          + 'Jetzt zuvorkommen: ' + B.welt.geld(w.preis) + '.';
        var pt = B.el('span', 'gg-wimpeltext');
        pt.appendChild(B.el('b', null, 'wirbt · noch ' + rest + ' Wo.'));
        pt.appendChild(B.el('i', null, 'zuvorkommen ' + B.welt.geld(w.preis)));
        p.appendChild(pt);
        if (!B.welt.kann(w.preis)) p.classList.add('zuteuer');
        B.orte.setze(p, a.ort, { anker: 'unten', dy: -3.6 });
        p.addEventListener('click', function () { zuvorkommen(k); });
        fach.appendChild(p);
        return;
      }

      if (frisch && wechsel.an === 'haus') {
        var g = B.el('div', 'gg-gewonnen');
        g.appendChild(B.el('span', null, 'zurueckgeholt ' + wechsel.takt % 30));
        g.textContent = 'unser Haus — abgeloest';
        B.orte.setze(g, a.ort, { anker: 'unten', dy: -3.6 });
        fach.appendChild(g);
      } else if (frisch && !wechsel.an) {
        var f = B.el('div', 'gg-frei', 'frei geworden');
        B.orte.setze(f, a.ort, { anker: 'unten', dy: -3.6 });
        fach.appendChild(f);
      }
    });
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
    el.title = 'Ein grauer Wagen des Hauses gegenueber, unterwegs zum ' + w.text + '.';
    fach.appendChild(el);
  }

  /* --- der Zeigefinger: "das da, im Bild" ------------------------------- */
  function zeichneZeiger(fach) {
    if (!Z.zeigt || !B.orte.hole(Z.zeigt)) return;
    var r = B.el('div', 'gg-zeiger');
    B.orte.setze(r, Z.zeigt, { anker: 'mitte' });
    fach.appendChild(r);
  }

  /* --- das Laufband: OHNE DICH GESCHEHEN -------------------------------- */
  function zeichneBand(fach) {
    var band = B.el('div', 'gg-band');
    var kopf = B.el('div', 'gg-bandkopf');
    kopf.appendChild(B.el('span', 'gg-bandtitel', 'Ohne dich geschehen'));
    kopf.appendChild(B.el('span', 'gg-bandzahl', Z.zaehler + ' Zuege'));
    kopf.appendChild(B.el('span', 'gg-bandwaehrung',
      'gebunden wird mit: ' + ep().waehrung));
    var auf = B.knopf({
      text: Z.offen ? 'Das Haus gegenueber schliessen' : 'Das Haus gegenueber',
      zug: 'gegner:blatt',
      klasse: 'gg-klein',
      titel: 'Kasse, Erben, Hof und jede Bindung des Gegners — mit der Summe, die sie kostet.',
      tu: function () { Z.offen = !Z.offen; neuZeichnen('gegner-blatt'); }
    });
    kopf.appendChild(auf);
    band.appendChild(kopf);

    var l = Z.zuege.slice(0, 3);
    if (!l.length) {
      band.appendChild(B.el('div', 'gg-bandzeile leer',
        'Gegenueber ist es still. Das bleibt nicht so.'));
    }
    l.forEach(function (e) {
      var z = B.el('div', 'gg-bandzeile' + (e.takt >= Z.takt - 1 ? ' neu' : ''));
      z.appendChild(B.el('span', 'wann', e.jahr + ' W' + e.woche));
      z.appendChild(B.el('span', 'was', e.text));
      z.appendChild(B.knopf({
        text: 'zeigen', zug: 'gegner:zeige:' + e.nr, klasse: 'gg-winzig',
        titel: 'Zeigt im Bild, wo dieser Zug etwas veraendert hat.',
        tu: function () {
          Z.zeigt = (Z.zeigt === e.ort) ? null : e.ort;
          neuZeichnen('gegner-zeigen');
        }
      }));
      band.appendChild(z);
    });
    B.orte.setze(band, 'kopfleiste', { anker: 'oben', dx: 18, dy: 10.5 });
    fach.appendChild(band);
  }

  /* ======================================================================
     DAS BLATT — das ganze Haus gegenueber
     ====================================================================== */
  function karte(a, art) {
    var k = B.el('div', 'gg-karte ' + art);
    return k;
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
      text: 'Schliessen', zug: 'gegner:blatt-zu', klasse: 'gg-klein',
      tu: function () { Z.offen = false; neuZeichnen('gegner-zu'); }
    }));
    kopf.appendChild(reiter);
    bl.appendChild(kopf);

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
      mm.appendChild(B.el('i', null, m.fest ? 'nicht abloesbar, solange er das Amt hat'
        : B.welt.geld(Math.round(m.satz * 10)) + ' je 10 ' + B.welt.mengeEinheit() + ' Jahresbedarf'
          + ' · ' + m.jahre + ' Jahre'));
      mittelzeile.appendChild(mm);
    });
    wk.appendChild(mittelzeile);
    bl.appendChild(wk);

    /* Was er haelt — nebeneinander, jedes mit Preisschild */
    var halten = B.el('div', 'gg-block');
    halten.appendChild(B.el('h3', null, 'Was er haelt — und was es kostet, es zurueckzuholen'));
    var reihe = B.el('div', 'gg-reihe');
    var seins = seine(h);
    if (!seins.length) reihe.appendChild(B.el('div', 'gg-leer',
      'Zurzeit haelt er keine Adresse. Das ist der Augenblick, in dem man baut.'));
    seins.forEach(function (a) {
      var b = Z.bindung[a.schluessel];
      if (!b) return;
      var m = mittelVon(b.mittel);
      var summe = abloese(a.schluessel);
      var kk = karte(a, 'halt');
      kk.appendChild(B.el('div', 'gg-kname', a.name));
      kk.appendChild(B.el('div', 'gg-kzeile', m.name + ' · seit ' + b.seit + ' · laeuft bis ' + b.bis));
      if (ep().tilgung) {
        kk.appendChild(B.el('div', 'gg-kzeile',
          'Darlehen ' + B.welt.geld(b.grund + (b.zusatz || 0))
          + ' · getilgt seit ' + (jahr() - b.seit) + ' Jahren'));
      }
      kk.appendChild(B.el('div', 'gg-kzeile',
        'Er drueckt dort ' + B.welt.geld(Math.round(abschlagJeFass(a.schluessel) * 10))
        + ' je 10 ' + B.welt.mengeEinheit() + ', die das Haus dorthin liefert.'));
      kk.appendChild(B.el('div', 'gg-ksatz', m.loest));
      if (summe === null) {
        kk.appendChild(B.el('div', 'gg-kfest', 'Nicht abloesbar. Erst muss das Amt weg.'));
      } else {
        kk.appendChild(B.knopf({
          text: 'Abloesen', zug: 'gegner:abloesen-blatt:' + a.schluessel,
          preis: -summe, aus: !B.welt.kann(summe),
          titel: m.loest + ' Danach ruehrt er die Adresse vier Jahre nicht an.',
          tu: function () { loeseAb(a.schluessel); }
        }));
      }
      reihe.appendChild(kk);
    });
    halten.appendChild(reihe);
    bl.appendChild(halten);

    /* Worum er wirbt */
    var wirbt = Object.keys(Z.werbung);
    if (wirbt.length) {
      var wb = B.el('div', 'gg-block');
      wb.appendChild(B.el('h3', null, 'Worum er gerade wirbt — die Uhr laeuft ohne dich'));
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
          'Laesst man die Wochen laufen, bindet er ohne weitere Frage. '
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

    /* Die eine Festlegung gegen ihn — je Amtszeit eine, unwiderruflich */
    var g = ep().gegenzug;
    var nr = B.welt.zeit.amtszeit.nr;
    var gb = B.el('div', 'gg-block gg-fest');
    gb.appendChild(B.el('h3', null, 'Der Gegenzug — eine je Amtszeit, und er wird nicht zurueckgenommen'));
    if (Z.angebot) {
      var ab = B.el('div', 'gg-reihe');
      var k1 = karte(null, 'angebot');
      k1.appendChild(B.el('div', 'gg-kname', 'Das Angebot der Nordstern-Gruppe'));
      k1.appendChild(B.el('div', 'gg-ksatz', 'Sie bietet ' + B.welt.geld(Z.angebot.summe)
        + ' fuer ein Viertel des Hauses. Angenommen springt die Kasse, und die Gruppe fuehrt '
        + 'jedes Jahr ein Zwanzigstel ab und redet fuer immer mit.'));
      k1.appendChild(B.knopf({
        text: 'Annehmen', zug: 'gegner:angebot-ja', preis: Z.angebot.summe,
        titel: 'Unwiderruflich. Das Haus gehoert danach nicht mehr ganz sich selbst.',
        tu: angebotAnnehmen
      }));
      ab.appendChild(k1);
      var k2 = karte(null, 'angebot');
      k2.appendChild(B.el('div', 'gg-kname', 'Ablehnen'));
      k2.appendChild(B.el('div', 'gg-ksatz', 'Kein Geld. Die Gruppe listet das Haus noch am '
        + 'selben Tag bei zwei Adressen aus. Das Haus bleibt ganz.'));
      k2.appendChild(B.knopf({
        text: 'Ablehnen', zug: 'gegner:angebot-nein',
        titel: 'Unwiderruflich. Zwei Adressen sind sofort weg.',
        tu: angebotAblehnen
      }));
      ab.appendChild(k2);
      gb.appendChild(ab);
    } else if (Z.gegenzugGetan[nr]) {
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
        titel: 'Eine je Amtszeit. Sie aendert eine Regel fuer den Rest der Partie.',
        tu: gegenzug
      }));
      gr.appendChild(gk);
      gb.appendChild(gr);
    }
    bl.appendChild(gb);

    /* Sein Hof und seine Lage */
    var lb = B.el('div', 'gg-block');
    lb.appendChild(B.el('h3', null, 'Sein Hof, seine Kasse, seine Lage'));
    var lz = B.el('div', 'gg-lage');
    lz.appendChild(B.el('span', null, 'Kasse (was man hoert): '
      + B.welt.geld(Math.round(h.kasse / 10) * 10)));
    lz.appendChild(B.el('span', null, 'Sein Preis: ' + B.welt.geld(h.preis)
      + ' je ' + B.welt.mengeEinheit() + ' — der Satz des Rats: ' + B.welt.geld(bierpreis())));
    lz.appendChild(B.el('span', null, 'Adressen: ' + seins.length));
    lz.appendChild(B.el('span', null, 'Zuege bisher: ' + h.zuege));
    lz.appendChild(B.el('span', null, 'Lage: ' + (D.untergang[h.stufe] || D.untergang[0]).name));
    if (Z.abschlag) {
      lz.appendChild(B.el('span', 'warn', 'Sein Abschlag kostete das Haus '
        + B.welt.geld(Z.abschlag) + ' im Jahr ' + Z.abschlagJahr + '.'));
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
      + ' Zuege, jeder an einem Ort im Bild'));
    var rolle = B.el('div', 'gg-rolle rolle');
    Z.zuege.slice(0, 40).forEach(function (e) {
      var z = B.el('div', 'gg-zzeile');
      z.appendChild(B.el('span', 'wann', e.jahr + ' W' + e.woche));
      z.appendChild(B.el('span', 'art', e.art));
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
      Z.bereit = true;
      B.welt.schreibe('Gegenueber steht ' + nameVon(haus('adler')) + '. '
        + haus('adler').erbe.name + ' fuehrt es. Gebunden wird in dieser Zeit mit '
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
        B.welt.schreibe('Der Adler verlaesst die Stadt und baut jenseits des Flusses, '
          + 'am Gleis. Am Markt bleibt das leere Stammhaus stehen.', 'gegner');
      }
      B.welt.schreibe('Eine neue Waehrung der Bindung: ' + ep().waehrung + '. '
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

      haeuserJetzt().forEach(function (h) {
        zeichneHof(fach, h);
        zeichneSitz(fach, h);
      });
      zeichneStammhaus(fach);
      zeichneAdressen(fach);
      zeichneWagen(fach);
      zeichneZeiger(fach);
      zeichneBand(fach);

      var blatt = B.ebene('blatt', 'gegner');
      B.leere(blatt);
      if (Z.offen) zeichneBlatt(blatt);

      meldeZug();
    }
  });

  /* Fuer die Konsole des Kritikers: BRAUHAUS.gegner.zuege() */
  B.gegner = {
    zuege: function () { return Z.zuege.slice(); },
    zahl: function () { return Z.zaehler; },
    lage: function () { return Z; }
  };

})(BRAUHAUS);
