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
    "drueben1": (
        "Heard from the far side of a high stone wall: two or three men "
        "calling to each other, the words indistinct, a hand saw rasping "
        "through a timber, a wooden mallet knocking pegs home, a heavy cask "
        "bumped along the ground and a shovel scraping. Everything muffled "
        "and far away, as though a wall stood between. "
        "No music, no engines, no bells, no whistles, no animals.", 7, 0.6),

    "drueben4": (
        "Heard from the far side of a brick wall: men calling to each other "
        "over their work, the words indistinct, a hammer ringing on steel, a "
        "small electric hoist whining as it lifts, a steel drum set down hard "
        "on concrete. Everything muffled and far away, as though a wall stood "
        "between. No music, no bells, no sirens, no horns, no radio.", 7, 0.6),

    # "Klaenge: Menschliche Schrei- und Ruflaute / KAMPFGESCHREI · Klirren von
    #  METALL- UND WAFFENAUFEINANDERTREFFEN · Schmerzenstoehnen — Zeit: Antike
    #  bis Mittelalter." Das ist eine Schlacht und kein Brand. Die Probe
    #  laeuft an `gegner:unglueck` und `gegner:ende` in ALLEN VIER Epochen;
    #  ein Gefecht mit Schwertern hat in 1884 und 1970 nichts zu suchen.
    "brand": (
        "A large fire burning out of control in a timber building: flames "
        "roaring and drawing hard, dry beams crackling and snapping loudly, "
        "embers popping, a burnt beam giving way and collapsing with a crash, "
        "sparks showering down. "
        "No shouting, no screaming, no voices, no battle, no weapons, no "
        "clashing metal, no swords, no music, no sirens, no bells.", 6, 0.75),

    # "Klaenge: UMBLAETTERN EINER BUCHSEITE · Papierrascheln." Das ist der
    #  Handschlag, mit dem der Nachbar einen Bund schliesst
    #  (`gegner:binden`, `nachbar: true`) und mit dem im PREIS ein Handel
    #  besiegelt wird. Papier hat das Haus schon: `papier.mp3`.
    "handschlag": (
        "Two men strike a bargain: one open hand clapped hard into another "
        "with a solid slap, a short vigorous handshake with leather sleeves "
        "creaking, then a flat pat on a shoulder and a wooden tankard set "
        "down firmly on a table. "
        "No paper, no page turning, no rustling paper, no book, no writing, "
        "no voices, no music.", 5, 0.75),

    # "Klaenge: RASSELGERAEUSCH (Schuetteln einer Rassel oder Maraca) ·
    #  Holzklacken — zeitlos." Keine einzige Muenze. Die Probe traegt in
    #  1350, 1600 und 1884 das Geld: `gegner:rohstoff`, `gegner:mitbieten`,
    #  `gegner:not` und `preis:muenzen` — und der Michaelitag fragt danach.
    "muenzen": (
        "Silver coins counted out onto a bare wooden table one at a time, "
        "each landing with a bright metallic clink and a short ring, then the "
        "small pile swept together and poured clinking into a leather purse "
        "whose drawstring is pulled tight. "
        "No rattle, no maraca, no shaking, no wood block, no drum, no dice, "
        "no voices, no music.", 5, 0.8),

    # "Klaenge: Schritte auf Holz oder festem Boden · Klopfen / Schliessen
    #  eines Holzgegenstandes — kann aus jedem Jahrhundert stammen."
    #  Kein Siegel. Die Probe steht an `gegner:macht` und `gegner:festlegung`
    #  (beide `nachbar: true`) und an `preis:siegel`.
    "siegel": (
        "Sealing wax held over a flame and dripped onto parchment, then a "
        "heavy brass seal pressed down into the soft wax with a firm creak of "
        "its handle and pulled away with a soft sucking tack; the parchment "
        "shifts on a wooden desk. "
        "No footsteps, no walking, no door, no knocking, no voices, "
        "no music.", 5, 0.75),
}


def mach(name):
    prompt, dauer, treue = GERAEUSCH[name]
    ziel = ZIEL / (name + ".mp3")
    if ziel.exists():
        ALT.mkdir(parents=True, exist_ok=True)
        alt = ALT / (name + ".alt.mp3")
        if not alt.exists():
            shutil.copy(ziel, alt)
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
