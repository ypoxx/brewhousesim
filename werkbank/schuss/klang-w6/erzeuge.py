#!/usr/bin/env python3
"""Welle 6 · DER KLANG — die Proben des GEGENZUGS, einzeln verurteilt.

Vor jeder Zeile steht der Satz des fremden Ohres, der die alte Probe
verurteilt hat (`werkbank/schuss/klang/beschreibe.py`, ohne Dateinamen,
ohne Absicht). Wer hier etwas aendert, ohne die Probe vorher einzeln
vorgelegt zu haben, aendert auf Verdacht.

    ./erzeuge.py             # alles, was in ZIEL fehlt
    ./erzeuge.py nachbar1    # nur diese; die alte wandert nach alt/

GRENZEN DER GEGENSTELLE: /v1/sound-generation nimmt hoechstens 450 Zeichen
und hoechstens 5 gleichzeitige Anfragen.
"""

import pathlib
import shutil
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parents[3]
ZIEL = WURZEL / "spiel" / "ton" / "klang"
ALT = pathlib.Path(__file__).resolve().parent / "alt"
WERKZEUG = WURZEL / "design" / "tools" / "gen_audio.py"

# name -> (prompt, dauer, treue)
GERAEUSCH = {

    # "Klaenge: TROETE / PFEIFGERAEUSCH · Tuerschliessen — Zeit: 20. oder 21.
    #  Jahrhundert. FALSCH: Troete / Trillerpfeife (Sekunde 0-1)."
    #  Das ist das TOR DES NACHBARN in 1350, 1600 und 1884
    #  (`gegner:abloesen`, `gegner:uebernahme`). Der Bauer der Vorrunde hat
    #  genau dieses Tor als NACHBARHOF-Zeichen erprobt und wieder verworfen,
    #  weil das Ohr es "als abfahrende Fuhre" gemeldet hat — kein Wunder:
    #  eine Troete vor einem zuschlagenden Tor ist eine Hupe an einem Fahrzeug.
    "nachbar1": (
        "A heavy wooden yard gate set in a stone wall: the wooden bar lifted "
        "out with a knock, one leaf pushed open on iron hinges with a long low "
        "groan of timber, then swung shut with a heavy dull thud and the bar "
        "dropped back into its iron brackets. "
        "No horn, no trumpet, no whistle, no toy, no bell, no vehicle, no "
        "engine, no voices, no music.", 6, 0.75),

    # NEU. DAS NACHBARHOF-ZEICHEN BEKOMMT EINE EIGENE DATEI.
    #  Bis heute lief es auf `bau1`/`bau4` — denselben Dateien, die
    #  `stadt:bau` (das EIGENE Bauen), `preis:fertig`, `gegner:bauen` und
    #  `gegner:aufstocken` spielen. Zwei Hoefe, die dasselbe Geraeusch
    #  machen, sind fuer ein blindes Ohr ein Hof; die Frage lautet aber
    #  ausdruecklich "von einem FREMDEN Hof nebenan".
    #  Was einen Hof fremd macht, sind nicht die Werkzeuge, sondern die
    #  LEUTE: undeutliche Zurufe von drueben kann der eigene Hof nicht
    #  erzeugen, und sie verraten kein Jahrhundert.
    # ZWEITER ANLAUF. Der erste hiess "Heard from the far side of a high stone
    #  wall … everything muffled and far away" und kam als "menschliches
    #  Keuchen · rhythmisches Schrubben" zurueck, der zweite fuer 1970 sogar
    #  als "Handglocke". Die Gegenstelle kann eine WAND nicht erzeugen — sie
    #  erzeugt einen VORGANG. Die Wand steht ohnehin in kern/ton.js
    #  (`baueWand`, Tiefpass + kurzer Nachschlag); der Prompt darf sie nicht
    #  auch noch beschreiben, sonst nimmt sie ihm den Platz weg.
    #  DRITTER ANLAUF. Der zweite hat die STIMMEN endlich geliefert — aber als
    #  "JUBELN und Rufen von Menschen, 21. Jahrhundert". "Shouting and calling
    #  to one another" liest die Gegenstelle als Menge im Stadion. Es sind
    #  ZWEI Leute bei der Arbeit, kein Publikum; und was sie tun, muss neben
    #  ihnen stehen, sonst fuellt der Jubel die ganze Probe.
    #  VIERTER ANLAUF. Der dritte begann mit einer "lauten EXPLOSION /
    #  KANONENSCHUSS, Sekunde 0-1, 20. Jahrhundert" — die gespaltene
    #  Feuerholzscheit ist der Gegenstelle zum Schuss geraten. Jedes harte
    #  Schlagwort ("crack", "split", "hard") holt einen Knall. Es bleiben die
    #  Stimmen und das Leiseste, was ein Hof hergibt.
    "drueben1": (
        "Two men are talking to each other across a yard, too far away for "
        "the words to be made out: one calls something over, the other "
        "answers, they go back and forth. Slow footsteps on gravel, and a "
        "wooden barrel shifted along the ground. "
        "No bang, no explosion, no gunshot, no crowd, no cheering, "
        "no music.", 7, 0.6),

    #  VIERTER ANLAUF. Der dritte kam als reines "Schmieden am Amboss" ohne
    #  jede Stimme zurueck: Hammer und Kette haben die zwei Leute verdraengt.
    #  Also stehen die Stimmen vorn und das Werkzeug hinten.
    "drueben4": (
        "Two men are talking to each other across a factory yard, too far "
        "away for the words to be made out: one calls something over, the "
        "other answers, they go back and forth. Behind them a metal hammer "
        "taps steadily and a chain rattles. "
        "No bang, no explosion, no crowd, no cheering, no music, "
        "no radio.", 7, 0.6),

    # "Klaenge: Menschliche Schrei- und Ruflaute / KAMPFGESCHREI · Klirren von
    #  METALL- UND WAFFENAUFEINANDERTREFFEN · Schmerzenstoehnen — Zeit: Antike
    #  bis Mittelalter." Das ist eine Schlacht und kein Brand. Die Probe
    #  laeuft an `gegner:unglueck` und `gegner:ende` in ALLEN VIER Epochen;
    #  ein Gefecht mit Schwertern hat in 1884 und 1970 nichts zu suchen.
    # ZWEITER ANLAUF. Der erste begann mit dem "Anreissen eines MODERNEN
    #  STREICHHOLZES" — das Reibholz gibt es erst seit 1826 und die Probe
    #  laeuft auch in 1350. Wer ein Feuer bestellt, bekommt offenbar, wie es
    #  angezuendet wird; also darf im Prompt niemand es anzuenden.
    "brand": (
        "A timber barn already well alight: flames roaring and drawing hard, "
        "dry beams crackling and snapping loudly, embers bursting, a burnt "
        "roof beam giving way and falling into the fire with a heavy crash "
        "and a shower of sparks. "
        "No match, no striking, no lighter, no ignition, no voices, no "
        "shouting, no music.", 6, 0.8),

    # "Klaenge: UMBLAETTERN EINER BUCHSEITE · Papierrascheln." Das ist der
    #  Handschlag, mit dem der Nachbar einen Bund schliesst
    #  (`gegner:binden`, `nachbar: true`) und mit dem im PREIS ein Handel
    #  besiegelt wird. Papier hat das Haus schon: `papier.mp3`.
    # ZWEITER ANLAUF. Der erste kam als "Klopfen auf Holz · Knarren einer
    #  Holztuer" zurueck: der Tisch und der Krug am Ende des Prompts haben
    #  den Handschlag verdraengt. Jetzt steht nur noch die Hand darin.
    #  DRITTER ANLAUF. Der zweite kam als "FINGERSCHNIPSEN" zurueck: ein
    #  einzelner kurzer Schlag ist fuer die Gegenstelle ein Schnipsen. Also
    #  nicht EIN Schlag, sondern das ganze Haendeschuetteln mit Stoff.
    #  VIERTER UND LETZTER ANLAUF. Bisher: "Klopfen auf Holz" (1),
    #  "Fingerschnipsen" (2), "Mischen von SPIELKARTEN, 21. Jahrhundert" (3).
    #  Traegt auch dieser nicht, wird die alte Probe zurueckgeholt und der
    #  Fehlschlag im Bericht genannt — eine Probe, die einen Anachronismus
    #  einfuehrt, ist keine Verbesserung.
    "handschlag": (
        "The sound of two people clapping their hands together once, loudly, "
        "skin on skin, and then rubbing their palms together twice. "
        "No cards, no shuffling, no paper, no snapping, no clicking, "
        "no wood, no voices, no music.", 4, 0.7),

    # "Klaenge: RASSELGERAEUSCH (Schuetteln einer Rassel oder Maraca) ·
    #  Holzklacken — zeitlos." Keine einzige Muenze. Die Probe traegt in
    #  1350, 1600 und 1884 das Geld: `gegner:rohstoff`, `gegner:mitbieten`,
    #  `gegner:not` und `preis:muenzen` — und der Michaelitag fragt danach.
    # ZWEITER ANLAUF. Der erste kam wieder als "Schellen / Rassel / Shaker"
    #  zurueck — das GIESSEN in den Beutel am Ende ist fuer die Gegenstelle
    #  ein Schuetteln. Jetzt faellt jede Muenze einzeln, und es wird nichts
    #  geschuettet und nichts eingefuellt.
    #  DRITTER ANLAUF. Zweimal kam "Rassel / Schellen" zurueck, obwohl weder
    #  geschuettet noch geschuettelt wurde: mehrere Muenzen kurz nacheinander
    #  SIND fuer die Gegenstelle eine Rassel. Also nur noch EINE Muenze auf
    #  einmal, mit Pause dazwischen.
    #  VIERTER UND LETZTER ANLAUF. Dreimal kam "Rassel / Schellen / Gloeckchen"
    #  zurueck, auch als nur noch EINE Muenze mit Pause dazwischen fiel.
    #  Letzter Versuch mit dem Gegenstand statt dem Vorgang; sonst bleibt die
    #  alte Probe, und der Fehlschlag steht im Bericht.
    "muenzen": (
        "A silver coin spinning on a hard stone floor: it wobbles faster and "
        "faster with a rising metallic whirr and comes to rest flat with a "
        "final tap. Then quiet. Then one more coin does the same. "
        "No bells, no jingle bells, no sleigh bells, no rattle, no shaking, "
        "no chimes, no voices, no music.", 6, 0.85),

    # "Klaenge: Schritte auf Holz oder festem Boden · Klopfen / Schliessen
    #  eines Holzgegenstandes — kann aus jedem Jahrhundert stammen."
    #  Kein Siegel. Die Probe steht an `gegner:macht` und `gegner:festlegung`
    #  (beide `nachbar: true`) und an `preis:siegel`.
    # ZWEITER ANLAUF, und er ist der letzte: der erste kam als "Klicken eines
    #  FEUERZEUGS, 20. Jahrhundert" zurueck und war damit SCHLECHTER als die
    #  alte Probe (Schritte auf Holz, zeitlos). Die Flamme muss aus dem
    #  Prompt heraus. Traegt auch dieser Anlauf nicht, wird die alte Probe
    #  aus alt/ zurueckgeholt — eine neue Probe, die einen Anachronismus
    #  einfuehrt, ist keine Verbesserung.
    "siegel": (
        "A heavy brass seal pressed down hard into a blob of soft sealing wax "
        "on a sheet of parchment: the wooden handle creaks under the "
        "pressure, the wax squashes with a dull squelch, and the seal is "
        "pulled free again with a short sticky tack. Parchment rustles once. "
        "No flame, no lighter, no click, no fire, no footsteps, no door, "
        "no voices, no music.", 5, 0.8),
}


def mach(name):
    """Erzeugt die Probe neu und hebt JEDEN Anlauf einzeln auf.

    Die erste Fassung dieses Werkzeugs schrieb nur den allerersten Stand nach
    alt/ und ueberschrieb danach jeden Anlauf mit dem naechsten. Beim dritten
    Versuch an `drueben4` war damit der ZWEITE weg — und ausgerechnet der war
    der beste ("Rufen von Menschen"), waehrend der dritte keine Stimme mehr
    enthielt. Wer drei Anlaeufe braucht, muss alle drei noch haben, sonst
    kann er den besten nicht mehr waehlen.
    """
    prompt, dauer, treue = GERAEUSCH[name]
    ziel = ZIEL / (name + ".mp3")
    if ziel.exists():
        ALT.mkdir(parents=True, exist_ok=True)
        alt = ALT / (name + ".alt.mp3")
        if not alt.exists():
            shutil.copy(ziel, alt)
        n = 1
        while (ALT / ("%s.%02d.mp3" % (name, n))).exists():
            n += 1
        shutil.copy(ziel, ALT / ("%s.%02d.mp3" % (name, n)))
    r = subprocess.run([sys.executable, str(WERKZEUG), "geraeusch",
                        "--prompt", prompt, "--out", str(ziel),
                        "--dauer", str(dauer), "--treue", str(treue)],
                       capture_output=True, text=True)
    print("%-12s %s" % (name, (r.stdout or r.stderr).strip()))
    return r.returncode


if __name__ == "__main__":
    namen = sys.argv[1:] or [n for n in GERAEUSCH
                             if not (ZIEL / (n + ".mp3")).exists()]
    schlecht = 0
    for n in namen:
        if n not in GERAEUSCH:
            print("unbekannt: %s" % n)
            schlecht += 1
            continue
        schlecht += 1 if mach(n) else 0
    sys.exit(1 if schlecht else 0)
