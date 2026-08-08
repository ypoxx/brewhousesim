/* ===========================================================================
   kern/start.js — DER ANLASSER.  GEHOERT DEM SKELETT-BAUER.
   Muss als letztes Skript stehen: erst wenn alle Stuecke sich angemeldet
   haben, wird gebaut.

   URL-Parameter (ohne sie ist die Bildlatte nicht messbar):
     ?epoche=1..4   springt in die Schau-Epoche (1350 / 1600 / 1884 / 1970)
     &jahr=1884     genaues Jahr
     &woche=1..30   genaue Woche
     &saat=1350     Wuerfelsaat — dieselbe Saat, dieselbe Partie
     &orte=1        Ortsverzeichnis als Punkte einblenden
     &blatt=chronik ein Blatt offen aufnehmen
     &pruefe=1      Lage-Anzeige (was ein Stueck geworfen hat)
     &stumm=1       Ton aus
     &neu=1         frische Partie: kein Spielstand wird geladen, keiner
                    geschrieben, und der Speicher wird geraeumt (Welle 13, R2)

   Vier Aufrufe von werkbank/schuss.mjs fotografieren damit vier Epochen:
     .../spiel/?epoche=1  ...  ?epoche=4
   =========================================================================== */

(function (B) {
  'use strict';

  /* ----------------------------------------------------------------------
     DER ANSCHLAG AM ANFANG.  Welle 13, R4 — Entscheidung ① der Aufsicht.

     BEFUND, an dem diese Zeilen haengen (Urteil Welle 12, §5): der erste
     Schirm traegt 613 sichtbare Textzeilen, rund 40 anfassbare Knoepfe und
     zehn zugeklappte Bretter — und die Woerter ZIEL, GEWINNEN, UEBERLEBEN
     kommen darin NULL MAL vor. Der Kritiker war nach zwei Minuten
     handlungsfaehig; was ihm fehlte, war das Wozu. Deshalb steht hier kein
     Handbuch, sondern vier Saetze: was man ist, was das gute Ende ist, was
     das schlechte ist, und dass jede Epoche fuer sich steht.

     DREI DINGE, DIE DIESER ANSCHLAG NICHT TUT, und jedes davon mit Grund:

       * ER HAELT NICHTS AUF. Kein Vorschaltbild, kein Klick, der erst
         weggeraeumt werden muesste. Jede messende Hand dieses Laufs
         (`hand3.mjs`, `linie.mjs`, `gegnerblick.mjs`, `schuss.mjs`) faengt
         unmittelbar nach dem Laden an zu klicken; ein Blatt davor haette
         jede Messreihe seit Welle 7 unbrauchbar gemacht.
       * ER NIMMT KEINEN KLICK. Der Behaelter traegt `pointer-events:none`,
         nur der Knopf „Anfangen" nimmt selbst an. `elementFromPoint` — mit
         dem der Kritiker prueft, ob ein Knopf wirklich zu greifen ist —
         sieht durch ihn hindurch. Er kann keinem Zug im Weg stehen.
       * ER IST KEIN KASTEN. Kein Grund, kein Rand, nur der Lichthof, den
         die Hauszeile auch traegt (Flaechenhaushalt, kern/haushalt.js).

     Weg ist er nach dem ersten Wochenwechsel — oder frueher, wenn jemand
     „Anfangen" drueckt.
     ---------------------------------------------------------------------- */

  var LICHTHOF = 'text-shadow:0 0 calc(var(--s)*10) rgba(255,248,230,.99),'
    + '0 0 calc(var(--s)*5) rgba(255,248,230,.99),'
    + '0 0 calc(var(--s)*2) rgba(255,248,230,.99);';

  function zettelWeg() {
    var fach = document.getElementById('fach-kopf-kern-start');
    if (fach && fach.parentNode) fach.parentNode.removeChild(fach);
  }

  function absatz(marke, text) {
    var d = B.el('div');
    d.style.cssText = 'margin-top:calc(var(--s)*9);';
    if (marke) {
      var m = B.el('span', null, marke + ' ');
      m.style.cssText = 'font-weight:700;letter-spacing:calc(var(--s)*2);';
      d.appendChild(m);
    }
    d.appendChild(document.createTextNode(text));
    return d;
  }

  function zeigeZettel() {
    var e = B.welt.epoche();
    var z = B.welt.zeit;
    var fach = B.ebene('kopf', 'kern-start');
    B.leere(fach);

    var zettel = B.el('div', 'startzettel');
    zettel.style.cssText = 'position:absolute;left:2.4%;top:74.4%;width:47%;'
      + 'pointer-events:none;color:#2b1d10;font-family:var(--serif);'
      + 'font-size:max(12px,calc(var(--s)*21));line-height:1.38;' + LICHTHOF;

    var kopf = B.el('div', null,
      B.welt.haus.name.toUpperCase() + ' · ' + z.jahr + ' · ' + e.name.toUpperCase());
    kopf.style.cssText = 'font-weight:700;letter-spacing:calc(var(--s)*3);'
      + 'font-size:max(13px,calc(var(--s)*24));';
    zettel.appendChild(kopf);

    zettel.appendChild(absatz('',
      'Du führst dieses Haus: brauen, ausliefern, die Wirte halten, die Abgaben zahlen. '
      + e.sagt));

    zettel.appendChild(absatz('DAS ZIEL —',
      'das Haus so weit bringen, dass es übergeben werden kann: an die nächste '
      + 'Hand, vor dem Rat. Gewinnen heißt hier nicht groß werden, sondern '
      + 'übergeben können — und die meisten Jahre geht es zuerst ums Überleben.'));

    zettel.appendChild(absatz('SO ENDET ES SCHLECHT —',
      'wenn keine Schenke der Stadt mehr ein Fass nimmt, ist das Braurecht weg. '
      + 'Nicht die leere Kasse macht das Haus zu, sondern das leere Auftragsbuch. '
      + 'Auch eine Pfanne, die drei Jahre kalt bleibt, und ein leerer Hof mit '
      + 'Schulden beenden die Partie.'));

    zettel.appendChild(absatz('JEDE EPOCHE IST EIN EIGENES SZENARIO —',
      '1350, 1600, 1884, 1970, jede mit eigenem Anfang und eigenem Ende. Sie '
      + 'zeigen denselben Ort, aber man spielt sie einzeln; keine wächst in '
      + 'die nächste hinüber.'));

    var knopfzeile = B.el('div');
    knopfzeile.style.cssText = 'margin-top:calc(var(--s)*10);pointer-events:auto;';
    var k = B.knopf({
      text: 'Anfangen',
      zug: 'kern:anfangen',
      titel: 'Legt diesen Anschlag beiseite. Er kommt nach dem ersten WEITER ohnehin nicht wieder.',
      tu: function () { zettelWeg(); }
    });
    k.style.cssText = 'background:none;background-color:transparent;border:0;box-shadow:none;'
      + 'padding:calc(var(--s)*5) calc(var(--s)*10) calc(var(--s)*5) 0;'
      + 'min-height:max(24px,calc(var(--s)*38));min-width:max(24px,calc(var(--s)*38));'
      + 'font-family:var(--serif);font-size:max(12px,calc(var(--s)*22));color:#2b1d10;'
      + 'font-weight:700;text-decoration:underline;text-underline-offset:calc(var(--s)*5);'
      + 'cursor:pointer;white-space:nowrap;' + LICHTHOF;
    knopfzeile.appendChild(k);
    zettel.appendChild(knopfzeile);

    fach.appendChild(zettel);
  }

  /* Der Anschlag geht weg, sobald die Zeit laeuft. Diese Horcher haengen an
     Ereignissen, nicht an einer Frist. */
  B.auf('woche', zettelWeg);
  B.auf('jahr', zettelWeg);

  function los() {
    if (B.arg.saat) B.wuerfel.setze(B.arg.saat);

    B.wage('welt.aufbau', function () {
      B.welt.aufbau({
        epoche: B.arg.epoche || 1,
        jahr: B.arg.jahr,
        woche: B.arg.woche
      });
    });

    if (!B.welt.zeit) {                       /* Notfallwelt, damit nie eine leere Seite steht */
      B.welt.zeit = { jahr: 1350, woche: 1, epoche: 1, ende: false,
                      amtszeit: { nr: 1, name: 'Unbekannt', eigenschaftName: '—', seit: 1350, bis: 1380 } };
    }

    /* DER SPIELSTAND — genau hier und nirgends sonst.  (Welle 13, R1/R2)
       NACH welt.aufbau(), damit alle Behaelter stehen und gefuellt werden
       koennen; VOR buehne.starte(), damit kein Stueck je die frische Welt zu
       sehen bekommt und dann heimlich auf die geladene umgestellt wuerde.
       Ein Stueck baut damit auf genau einer Welt auf — der, die gilt. */
    B.wage('stand.starte', function () { B.stand.starte(); });

    B.wage('buehne.starte', function () { B.buehne.starte(); });
    B.wage('kopf', function () { B.kopf.zeichne(); });

    if (B.arg.orte) B.wage('orte.verzeichnis', function () { B.orte.zeigeVerzeichnis(true); });
    if (B.arg.blatt) B.wage('start.blatt', function () { B.kopf.blatt(B.arg.blatt); });
    B.wage('start.zettel', zeigeZettel);
    B.zeigeLage();

    B.ton.bett(B.welt.zeit.epoche);
    B.sende('bereit', { jahr: B.welt.zeit.jahr, epoche: B.welt.zeit.epoche });

    /* Ein Zeichen fuer Playwright und fuer den Kritiker: die Partie laeuft. */
    document.getElementById('buehne').setAttribute('data-bereit', '1');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { B.wage('start', los); });
  } else {
    B.wage('start', los);
  }

})(BRAUHAUS);
