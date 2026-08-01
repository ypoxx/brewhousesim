# Welle 2 — Was das Haus eigentlich tut

Aufgestellt von der Aufsicht, während Welle 1 noch läuft. Nicht starten, bevor die
Glättung von Welle 1 durch ist und `spiel/STAND.md` steht — Welle 2 fasst Dateien an,
die Welle-1-Builder noch offen haben.

---

## Der Befund, aus dem diese Welle folgt

Welle 1 hat den **Ort** gebaut und die **Zwänge**: die Stadt, in der es steht; die Woche,
die Rohstoff knapp macht; den Michaelitag, an dem der Preis fällt; das Haus gegenüber, das
zieht, während man wegsieht. Das ist ein Wirtschaftsspiel.

Es ist noch kein *Brauhaus*-Spiel. Zwei Dinge fehlen, und beide stehen wörtlich im Auftrag:

> „…die das Bierbrauen **und Bier vermarkten** als Imperium wundervoll wiedergibt."

**Gebraut wird bisher nicht.** `fuhre.js` kennt Malz, Hopfen und Sud als *Eingang* — als
etwas, das man einkauft und das dann Bier ist. Es gibt keine Entscheidung darüber, *was für
ein Bier* dabei herauskommt. **Vermarktet wird bisher gar nicht**; „Marke" kommt im Quelltext
nur als Wort vor.

Und drittens: **Latte 3 aus [`MESSLATTE.md`](MESSLATTE.md) — der Ton — steht seit dem ersten
Tag da und ist noch gegen nichts gemessen worden.** `kern/ton.js` hat 73 Zeilen, `ton/` ist
im Wesentlichen leer. Eine Latte ohne Stück ist der zuverlässigste Weg, sie am Ende
stillschweigend fallen zu lassen.

---

## Die vier Stücke

Jedes ist so geschnitten, dass es **allein beurteilt** werden kann und **eigene Dateien**
besitzt. Die Regeln aus [`../spiel/LIESMICH.md`](../spiel/LIESMICH.md) gelten unverändert:
`index.html` eingefroren, `kern/**` nur über die Aufsicht, kein `git`.

### 1 · DER SUD — was für ein Bier das eigentlich ist

Dateien: `stuecke/sud*.js` · `stil/sud*.css` · `bild/sud/**` · `ton/sud/**`

Das Herzstück, und das einzige Stück, dem der Auftrag ausdrücklich „fast lehrreich"
erlaubt. Es besitzt die Frage: **Woraus besteht die Entscheidung des Brauers?**

Historisch ist das kein Geschmacksthema, sondern ein *Haltbarkeitsthema* — und damit ein
Handelsthema. Das ist die eigentliche Wirtschaftsgeschichte des Biers:

| Epoche | Die Entscheidung, die es wirklich gab |
|---|---|
| 1350 | **Grut oder Hopfen.** Grut ist zunftgebunden und lokal; gehopftes Bier hält die Reise. Wer hopft, kann verkaufen, wo er nicht wohnt — und legt sich mit dem Grutrecht an. |
| 1600 | **Rein oder gestreckt**, und obergärig gegen die neue Kellergärung. Das Gebot von 1516 ist Rohstoffpolitik gegen den Bäcker um den Weizen, nicht Qualitätssiegel. |
| 1884 | **Eis oder Maschine.** Lagerbier braucht Kälte; Kälte kommt bis eben vom Natureis und ab jetzt aus der Maschine. Wer die Maschine hat, braut im Sommer. |
| 1970 | **Gleichmaß.** Der Sud muss nicht mehr gut sein, er muss jedes Mal gleich sein — und das ist eine andere, teurere Aufgabe. |

Mechanisch übernimmt DER SUD die schon vorgemerkten Überträge aus Welle 1:
Gärkeller und Lagerkeller **getrennt** (sie haben verschiedene Zeitkonstanten und das ist
der ganze Witz), `haus.rohstoff` als saubere API statt der jetzigen Direktgriffe, und
`nimmHeraus()` mit Auswahl — man entscheidet, *welches* Fass man anbricht.

**Seine Latte:** Latte 2, Zeile „Verbliste je Epoche". Kommt in allen vier Epochen dieselbe
Entscheidung heraus, ist das Stück durchgefallen, egal wie hübsch der Keller aussieht.

### 2 · DER NAME — warum jemand mehr zahlt, als das Bier wert ist

Dateien: `stuecke/name*.js` · `stil/name*.css` · `bild/name/**` · `ton/name/**`

Die zweite Hälfte des Auftragssatzes, und das Stück, das aus einer Brauerei ein **Imperium**
macht. Ohne es ist das Spiel ein Betrieb; mit ihm ist es eine Firma.

Der ökonomische Kern in einem Satz: **Ein Name ist langsam zu bauen und schnell zu
verlieren, und solange man ihn hat, darf man teurer sein als der Nachbar bei gleichem
Bier.** Das ist eine Rückkopplung in DEN PREIS und ein Angriffsziel für DEN GEGNER — er
kann nachahmen, und das ist billiger als besser brauen.

Das Träger-Medium wechselt mit der Epoche, und genau daran wird die Epoche sichtbar:
Bierzeiger und Zunftzeichen · Wirtshausschild und Krug · Etikett, Plakat und Litfaßsäule ·
Kronkorken, Bandenwerbung und der Fernsehspot. **Sperrliste beachten: Emailschilder erst ab
den 1890ern.**

**Seine Latte:** Latte 1 — das Zeichen des Hauses muss auf der Platte der jeweiligen Epoche
*sitzen*, nicht darüberliegen. Und Latte 2, Spalte „Optionen mit Preisschild nebeneinander".

### 3 · DAS ERBE — was über den Epochenschnitt hinüberkommt

Dateien: `stuecke/erbe*.js` · `stil/erbe*.css` · `bild/erbe/**` · `ton/erbe/**`

Das Stück gegen den teuersten Vorwurf des Auftrags. Wenn 1600 bei null anfängt, sind es
vier Spiele hintereinander und kein Imperium über 675 Jahre.

Es besitzt den Schnitt selbst: **was mitgeht** (Adressen und ihre Bindungen, der Ruf des
Namens, der Keller, die Schulden, das Rezept), **was verfällt**, und die *eine
Entscheidung*, die man am Schnitt trifft und die die nächste Epoche prägt.

Der historische Fund, auf dem es sitzt, ist zu gut, um ihn liegen zu lassen: **die
Braugerechtigkeit hing am Haus, nicht an der Person.** Deshalb durfte die Witwe
weiterbrauen, und deshalb war das Gebäude wertvoller als der Betrieb. Später wird aus dem
Erbfall die Aktiengesellschaft und zuletzt der Konzern — dreimal dieselbe Frage, dreimal
eine andere Antwort darauf, wem das Haus gehört.

DAS ERBE ist außerdem das Stück, das die **Wohlstandssingularität** bricht: Barschaft ÷
Preis des nächsten Zuges war über die Epochen 22× / 594× / 1323× — verboten laut Latte 2.
Der Schnitt ist die einzige Stelle, an der die Welt sich sauber neu bepreisen darf.

**Seine Latte:** die Kurve aus Latte 2, gemessen über alle vier Epochen hinweg statt je
Epoche. Sie darf nicht monoton wachsen.

### 4 · DER KLANG — dreißig Sekunden ohne Bild

Dateien: `stuecke/klang*.js` · `stil/klang*.css` · `ton/klang/**` · dazu `ton/**` als Ganzes

Latte 3 hat noch nie jemand gemessen. Dieses Stück existiert, damit sie gemessen wird.

Werkzeug steht: [`../design/tools/gen_audio.py`](../design/tools/gen_audio.py) mit
ElevenLabs `/v1/music` und `/v1/sound-generation`, Gemini als Rückfall. Der Auftraggeber hat
gesagt: **Musik und Effekte zuerst**, Stimmen sind freigeschaltet, aber nicht der Punkt.

**Seine Latte** ist wörtlich Latte 3 und blind: ein fremdes Ohr hört dreißig Sekunden ohne
jedes Bild und benennt Epoche und Vorgang. Rät es falsch, geht die Arbeit zurück. Diese
Latte ist billig und fälschungssicher — sie ist der Grund, warum dieses Stück nicht ans Ende
der Welle gehört, wo Zeit knapp wird.

---

## Was die Aufsicht vorab entscheidet

Damit nicht dieselbe Kollision entsteht wie in Welle 1, wo vier Stücke unabhängig aus einer
Kasse abgabepflichtig wurden:

1. **Der Abgabendeckel aus [`../spiel/ZUSTAENDIGKEIT.md`](../spiel/ZUSTAENDIGKEIT.md) §4
   bleibt bei 18 % und wird nicht erhöht.** Welle 2 nimmt kein neues Geld aus der Kasse.
   DER SUD und DER NAME kosten **Zeit und Rohstoff**, nicht Abgabe. Wer das nicht kann,
   meldet es der Aufsicht, statt still einen Posten aufzumachen.
2. **DER NAME schreibt keinen Preis.** Er setzt einen Ruf; DER PREIS liest ihn. Ein Stück,
   das in ein fremdes Zahlenfeld schreibt, ist wieder ein Kollisionsfall.
3. **Die harte Regel gilt weiter:** *Es darf keinen Zustand geben, aus dem heraus kein Zug
   mehr etwas verändert.* Sie hat Welle 1 den Todzustand gekostet und wird in Welle 2 zuerst
   geprüft, nicht zuletzt.
4. **Kernänderungen sammeln**, nicht selbst vornehmen — `./werkbank/stand.py chronik "KERN: …"`.
   Vorgemerkt ist bereits die **Sperrschicht mit einem Register offener Blätter**: in Welle 1
   hat die Georgi-Sperre der FUHRE den WEITER-Knopf des Kerns mit verdeckt, weil jedes Stück
   seine eigene Sperre malt.

## Die Reihenfolge

DER KLANG und DER NAME können sofort parallel starten — sie berühren nichts, was Welle 1
noch offen hat. DER SUD wartet auf die Glättung, weil er `fuhre.js` Ansprüche abnimmt.
DAS ERBE geht zuletzt und zuerst wieder in die Glättung, weil es als einziges Stück in alle
anderen hineinliest.
