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
    ['sud:verschneiden', 'Zwei Tanks werden zusammengefahren: Pumpe an, Rauschen im Rohr.']
  ];

  B.wage('sud.ton', function () {
    if (!B.ton || !B.ton.melde) return;
    MELDUNGEN.forEach(function (m) {
      B.ton.melde(m[0], { art: 'geraeusch', sagt: m[1] });
    });
  });

  /* ======================================================================
     2 — DAS SCHLUSSBLATT

     ZUSTAENDIGKEIT §12: Das Haus darf fallen, und dann steht die Uhr. Jedes
     Stueck malt sein eigenes Schlussblatt; keines muss dafuer wissen, was die
     anderen tun. DER SUD schreibt auf, was in seiner Pfanne war — das ist
     der einzige Nachruf, den ein Brauhaus verdient.
     ====================================================================== */

  B.auf('ende', function (d) {
    B.wage('sud.ende', function () {
      var Z = B.SUD_ZUSTAND;
      if (!Z) return;
      var fach = B.ebene('blatt', 'sud');
      B.leere(fach);

      var blatt = B.el('div', 'sud-schluss blatt');
      blatt.setAttribute('data-frei', '1');
      blatt.appendChild(B.el('h2', null, 'DAS SUDBUCH WIRD GESCHLOSSEN'));
      blatt.appendChild(B.el('div', 'sud-achssatz',
        'Angestellt hat dieses Haus ' + Z.gesamtSude + ' Sude — '
        + B.welt.menge(Z.gesamtFass) + ' Bier, in ' + (d && d.jahr ? d.jahr : B.welt.zeit.jahr)
        + ' zum letzten Mal.'));

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
        tu: function () { B.leere(B.ebene('blatt', 'sud')); }
      }));

      fach.appendChild(blatt);
    });
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
      { was: 'welt.vorrat: Gaerkeller neben Lagerkeller',
        jetzt: 'DER SUD zieht reifende Faesser mit nimmHeraus aus dem Lager heraus und '
             + 'legt sie mit legeEin zurueck; dabei muessen k, stufe, zeichen, reife und '
             + 'haltbar von Hand wieder aufgesetzt werden, weil legeEin sie nicht kennt.',
        soll: 'Der Kern fuehrt zwei Behaelter und einen Umzug zwischen ihnen. '
            + 'Solange nicht: legeEin sollte wenigstens ein Musterfass entgegennehmen.' }
    ];
  });

})(BRAUHAUS);
