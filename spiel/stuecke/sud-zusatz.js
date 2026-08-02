/* ===========================================================================
   stuecke/sud-zusatz.js — DER SUD, zweite Datei.

   Hier steht, was nicht in die Mechanik gehoert:
     1. die Tonmeldungen — DER SUD ruft von Anfang an, DER KLANG haengt spaeter
        die Wiedergabe ein, ohne dass diese Datei angefasst werden muss;
     2. das Schlussblatt auf 'ende' (ZUSTAENDIGKEIT §12: wer auf 'ende' hoert,
        malt sein eigenes Schlussblatt);
     3. die Bitten an den Kern, damit sie NICHT stillschweigend verschwinden.
   =========================================================================== */

(function (B) {
  'use strict';

  /* ======================================================================
     1 — DIE TONMELDUNGEN

     kern/ton.js faellt fuer jeden unbekannten Namen mit dem Kopf "sud:" auf
     die Pfanne der jeweiligen Epoche zurueck; es geht also nie ein Ruf ins
     Leere. Gemeldet wird trotzdem alles, damit DER KLANG die Liste ohne
     Ruecksprache abarbeiten kann — genau dafuer gibt es B.ton.melde.
     ====================================================================== */

  var MELDUNGEN = [
    ['sud:anstellen',   'Würze läuft aus der offenen Pfanne in den Bottich. 1350 Holzrinne '
                      + 'und Schöpfeimer, 1884 Kühlschiff und Rohr, 1970 Pumpe und Ventil.'],
    ['sud:ausschlagen', 'Der Bottich wird ausgeschlagen: Hahn auf, Bier ins Fass. '
                      + 'Holz und Handpumpe, später Schlauch und Druck.'],
    ['sud:hefe',        'Erntehefe wird vom gärenden Bottich abgehoben: Holzschaufel und '
                      + 'Bütte, ab 1884 ein Blechgefäß, 1970 ein Hahn am Konus.'],
    ['sud:anstich',     'Ein Fass wird angebrochen — Schlegel auf Zapfen, ein kurzes Zischen. '
                      + '1970 statt dessen ein Kugelhahn.'],
    ['sud:fehlsud',     'Ein Bottich wird verworfen: Bier läuft auf Stein und in den Ablauf. '
                      + 'Kein Klirren, kein Knall — nur viel Flüssigkeit und Stille danach.'],
    ['sud:anzeige',     'Fremde Schritte im Sudhaus, ein Deckel wird gehoben, jemand schreibt. '
                      + '1350 Leder und Schlüsselbund, 1600 Papier und Siegel.'],
    ['sud:siegel',      'Eine unwiderrufliche Festlegung wird besiegelt: Wachs, Stempel, '
                      + 'ab 1884 ein Abnahmeprotokoll und eine Unterschrift.'],
    ['sud:kauf',        'Anschaffung bezahlt: Münzen, später die Registrierkasse.'],
    ['sud:bau',         'Ein Gärgefäß wird gesetzt — Küferschlegel auf Fassreif, '
                      + '1884 Niete auf Eisen, 1970 Kran und Stahl.'],
    ['sud:umstellen',   'Das Verfahren wird umgestellt: Kreide auf Holz, Feder auf Papier, '
                      + 'ab 1970 ein Kippschalter im Schaltraum.'],
    ['sud:sperre',      'Eine Charge wird gesperrt. Ein Klebeband, ein Stempel, ein Anruf. '
                      + 'Nur 1970.'],
    ['sud:freigabe',    'Eine gesperrte Charge wird freigegeben — Unterschrift, Telefonhörer auf.'],
    ['sud:verschneiden', 'Zwei Tanks werden zusammengefahren: Pumpe an, Rauschen im Rohr.'],
    ['sud:rueckruf',    'Ein Rückläufer kommt an der Rampe an: Rollcontainer auf Beton, '
                      + 'Flaschen klirren im Kasten, ein Lieferschein wird abgezeichnet. Nur 1970.']
  ];

  B.wage('sud.ton', function () {
    if (!B.ton || !B.ton.melde) return;
    MELDUNGEN.forEach(function (m) {
      B.ton.melde(m[0], { art: 'geraeusch', sagt: m[1] });
    });
  });

  /* ======================================================================
     2 — DAS SCHLUSSBLATT, UND WARUM ES JETZT ZURUECKTRITT

     ZUSTAENDIGKEIT §12: Das Haus darf fallen, und dann steht die Uhr. Jedes
     Stueck malt sein eigenes Schlussblatt; keines muss dafuer wissen, was
     die anderen tun. DER SUD schreibt auf, was in seiner Pfanne war.

     RUNDE 3 — DAS BLATT LAG AUF DEM URTEIL.

     Gemessen (1600x1000, nur WEITER bis zum Ende, alle vier Epochen): DIE
     FUHRE malt bei 352|90 ein Schlussblatt von 896x561 px, auf dem steht,
     warum die Partie vorbei ist ("Die Zunft streicht das Haus zum Anker aus
     der Reihe"). Dieses Blatt hier lag mit 736x268 bei 416|220 MITTEN
     DARAUF — und weil die Platzordnung der STADT dem zuletzt Aufgeschlagenen
     den Platz gibt, klappte sie das fremde Blatt zu. Wer danach auf den
     Schirm sah, fand als einzige offene Flaeche DAS SUDBUCH: die
     Rechenschaft eines Stuecks ueber sich selbst, kein Urteil ueber die
     Partie. Genau das hat die Aufsicht in BEFUND-ENDE.md §1(a)
     aufgeschrieben, und sie hat recht — der Fehler lag hier.

     Also tritt das Sudbuch zurueck: es legt sich als KLAPPE an den Rand,
     klein genug, um in der Platzordnung eine Marke und kein Brett zu sein,
     und mit den lebenden Zahlen darauf. Ein Klick schlaegt es auf, ein
     zweiter legt es zurueck. Nur wenn sonst NIEMAND ein Schlussblatt malt,
     schlaegt es von selbst auf — dann ist Stille schlimmer als Deckung.
     ====================================================================== */

  var SCHLUSS = { d: null, offen: false };

  /* Malt ein anderes Stueck bereits ein Schlussblatt? Gesucht wird ueber
     alle Ebenen ausser der Bildplatte, in fremden Faechern, nach Blaettern,
     die sich selbst als Schluss ausweisen. */
  function fremderSchluss() {
    var ebenen = ['marken', 'hand', 'kopf', 'blatt'], i, j, k;
    for (i = 0; i < ebenen.length; i++) {
      var eb = document.getElementById('ebene-' + ebenen[i]);
      if (!eb) continue;
      for (j = 0; j < eb.children.length; j++) {
        var fach = eb.children[j];
        var wer = fach.getAttribute('data-stueck') || '';
        if (wer.indexOf('sud') === 0) continue;
        for (k = 0; k < fach.children.length; k++) {
          var el = fach.children[k];
          var kl = String(el.className || '');
          if (/schluss|nachruf|ende/i.test(kl)) return true;
        }
      }
    }
    return false;
  }

  function epochenSatz(feld) {
    var q = (typeof SUD_DATEN !== 'undefined') ? SUD_DATEN : null;
    if (!q) return '';
    var e = B.welt.zeit.epoche;
    if (feld === 'kalt') return (q.kalt && q.kalt[e]) || null;
    return (q.schluss && q.schluss[e]) || null;
  }

  /* Was aus der Pfanne wird. Ueber die PARTIE urteilt dieses Blatt nicht —
     das steht auf dem Blatt dessen, der das Ende ausgeloest hat. */
  function pfannenSatz() {
    var d = SCHLUSS.d || {};
    var kalt = epochenSatz('kalt');
    if (kalt && d.grund === kalt.grund) return kalt.ende + ' ' + kalt.pfanne;
    var s = epochenSatz('schluss');
    if (!s) return '';
    return d.grund ? s.faellt : s.steht;
  }

  function male() {
    var Z = B.SUD_ZUSTAND;
    if (!Z) return;
    var fach = B.ebene('blatt', 'sud');
    B.leere(fach);
    var d = SCHLUSS.d || {};
    var jahr = d.jahr || B.welt.zeit.jahr;

    /* --- zugeklappt: eine Marke am Rand, mit den lebenden Zahlen --------- */
    if (!SCHLUSS.offen) {
      var klappe = B.el('div', 'sud-buchklappe');
      klappe.setAttribute('data-frei', '1');
      klappe.appendChild(B.el('b', 'sud-klappname', 'DAS SUDBUCH'));
      klappe.appendChild(B.el('span', 'sud-klappzahl',
        Z.gesamtSude + ' Sude · ' + B.welt.menge(Z.gesamtFass)));
      klappe.appendChild(B.knopf({
        text: 'Sudbuch aufschlagen',
        zug: 'sud:schluss-auf',
        klasse: 'sud-tat klein',
        titel: 'Was in dieser Pfanne war, Jahr für Jahr.',
        tu: function () { SCHLUSS.offen = true; male(); }
      }));
      fach.appendChild(klappe);
      return;
    }

    /* --- aufgeschlagen: das Blatt ---------------------------------------- */
    var blatt = B.el('div', 'sud-schluss blatt');
    blatt.appendChild(B.el('h2', null, 'DAS SUDBUCH WIRD GESCHLOSSEN'));
    blatt.appendChild(B.el('div', 'sud-achssatz',
      'Angestellt hat dieses Haus ' + Z.gesamtSude + ' Sude — '
      + B.welt.menge(Z.gesamtFass) + ' Bier, in ' + jahr + ' zum letzten Mal.'));

    var pf = pfannenSatz();
    if (pf) blatt.appendChild(B.el('div', 'sud-pfannensatz', pf));

    var wf = [];
    if (B.sud && B.sud.verfahren) {
      var v = B.sud.verfahren();
      for (var k in v) { if (Object.prototype.hasOwnProperty.call(v, k)) wf.push(v[k]); }
    }
    blatt.appendChild(B.el('div', 'sud-fussnote',
      'Zuletzt gefahren: ' + (wf.join(' · ') || '—')
      + ' · im Gärkeller stehen noch ' + Z.bottiche.length + '.'));

    Z.buch.slice(-8).reverse().forEach(function (x) {
      var z = B.el('div', 'sud-buchzeile');
      z.appendChild(B.el('span', 'wann', x.jahr + '/' + x.woche));
      z.appendChild(B.el('span', 'was', x.text));
      blatt.appendChild(z);
    });

    blatt.appendChild(B.knopf({
      text: 'Sudbuch zuklappen',
      zug: 'sud:schluss-zu',
      klasse: 'sud-tat',
      titel: 'Das Sudbuch legt sich an den Rand zurück.',
      tu: function () { SCHLUSS.offen = false; male(); }
    }));

    fach.appendChild(blatt);
  }

  B.auf('ende', function (d) {
    B.wage('sud.ende', function () {
      SCHLUSS.d = d || {};
      SCHLUSS.offen = false;
      male();
    });
    /* Die fremden Schlussblaetter entstehen erst im 'zeichne' NACH diesem
       Ruf — deshalb wird nicht jetzt entschieden, sondern gleich darauf. */
    window.setTimeout(function () {
      B.wage('sud.ende.platz', function () {
        if (!fremderSchluss()) SCHLUSS.offen = true;
        male();
      });
    }, 700);
  });

  /* ======================================================================
     3 — DIE BITTEN AN DEN KERN, damit sie niemand vergisst

     kern/** ist schreibgeschuetzt (LIESMICH Regel 3). DER SUD hat die drei
     Uebertraege aus ZUSTAENDIGKEIT §6 deshalb in seinen EIGENEN Dateien
     gebaut und legt sie hier offen; wer sie in den Kern hebt, findet unter
     B.sud.kernbitten, was zu heben ist. Gemeldet wurde es ausserdem mit
     ./werkbank/stand.py chronik "KERN: ...".
     ====================================================================== */

  B.wage('sud.kernbitten', function () {
    if (!B.sud) return;
    B.sud.kernbitten = [
      { was: 'welt.nimmHeraus(n, wahl)',
        jetzt: 'nimmt immer das aelteste Fass; DER SUD sortiert vorher um, '
             + 'genau wie DIE FUHRE es tun musste.',
        soll: 'Der Kern nimmt die Auswahl entgegen (aeltestes, juengstes, Sorte, Liste), '
            + 'statt sie zu erraten. Vorlage: B.sud.nimmHeraus.' },
      { was: 'welt.rohstoff.nimm/gib/reicht',
        jetzt: 'jedes Stueck rechnet direkt an haus.rohstoff; zwei Stuecke, die im '
             + 'selben Zug verbrauchen, ueberschreiben einander stillschweigend.',
        soll: 'Eine API im Kern, die protokolliert. Vorlage: B.sud.rohstoff.' },
      { was: 'welt.sorten() — die Leiter der Epoche im Kern',
        jetzt: 'Welche Sorten es in einer Epoche gibt und auf welcher Stufe sie stehen, '
             + 'weiss nur FUHRE_DATEN. DER SUD muss diese fremde Datenglobale LESEN, um '
             + 'sagen zu koennen, als was ein Bottich ausschlaegt (hoechst) — so, wie '
             + 'fuhre.js seinerseits PREIS_DATEN liest. Es funktioniert und faellt still '
             + 'aus, wenn die Globale fehlt; sauber ist es nicht.',
        soll: 'Der Kern fuehrt die Sortenleiter (k, name, zeichen, stufe, reife, haltbar) '
            + 'und gibt sie heraus; DIE FUHRE bepreist sie weiter, DER SUD entscheidet '
            + 'weiter, welche Sprosse aus der Pfanne kommt. Erst dann ist "was fuer ein '
            + 'Bier herauskommt" eine Naht und kein Griff in fremde Daten.' },
      { was: 'welt.vorrat: Gaerkeller neben Lagerkeller',
        jetzt: 'DER SUD zieht reifende Faesser mit nimmHeraus aus dem Lager heraus und '
             + 'legt sie mit legeEin zurueck; dabei muessen k, stufe, zeichen, reife und '
             + 'haltbar von Hand wieder aufgesetzt werden, weil legeEin sie nicht kennt.',
        soll: 'Der Kern fuehrt zwei Behaelter und einen Umzug zwischen ihnen. '
            + 'Solange nicht: legeEin sollte wenigstens ein Musterfass entgegennehmen.' }
    ];
  });

})(BRAUHAUS);
