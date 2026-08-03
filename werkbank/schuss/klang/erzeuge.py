#!/usr/bin/env python3
"""Welle 4 · DER KLANG — die Proben, die das fremde Ohr beanstandet hat.

Jede Zeile hier steht wegen einer MESSUNG, nicht wegen eines Geschmacks:
`beschreibe.py` hat jede vorhandene Probe einem fremden Ohr vorgelegt, ohne
Dateinamen und ohne Absicht, und gefragt, was darin vorkommt, das es im Jahr
der Epoche noch nicht gab. Was hier neu erzeugt wird, ist die Antwort darauf —
dazu fuenf Proben, die es noch gar nicht gab, weil DER SUD, DER NAME und DAS
ERBE nach Welle 1 gebaut wurden und ihre Rufe bisher im Ersatzkasten landeten.

    ./werkbank/schuss/klang/erzeuge.py            # alles, was fehlt
    ./werkbank/schuss/klang/erzeuge.py karren     # nur diese

Vorhandene Dateien werden uebersprungen, ausser sie stehen namentlich in der
Kommandozeile. Die alte Probe wandert nach <name>.alt.mp3, damit ein Rueckweg
bleibt.

ZWEI GRENZEN DER GEGENSTELLE, teuer gelernt:
  * `/v1/sound-generation` nimmt hoechstens **450 Zeichen** Prompt. Darueber
    kommt 400 text_too_long und gar kein Ton.
  * hoechstens **5 gleichzeitige** Anfragen, sonst 429. Also vier Arbeiter.
"""

import concurrent.futures
import pathlib
import shutil
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parents[3]
ZIEL = WURZEL / "spiel" / "ton" / "klang"
WERKZEUG = WURZEL / "design" / "tools" / "gen_audio.py"

# ----------------------------------------------------------------------------
# Jede Ersetzung traegt den Satz des Ohres, der sie verurteilt hat.
# ----------------------------------------------------------------------------
GERAEUSCH = {
    # "Klänge: Rütteln · AUTOHUPE · Verkehrsrauschen · Motorenbrummen —
    #  FALSCH: Autohupe bei 00:02". Diese Probe lief in 1350, 1600 UND 1884,
    #  jedes Mal wenn der Nachbar um ein Haus wirbt.
    "karren": (
        "A light two-wheeled wooden handcart pushed over cobblestones in a small "
        "walled yard: wooden wheels rumbling, one iron-rimmed wheel ringing on stone, "
        "the wooden bed rattling, the cart set down on its shafts. No voices, no "
        "music, no engines, no car horn, no traffic, no sirens.", 6),

    # "FALSCH: moderne Hartplastik- oder Polyurethanrollen (Rollkoffer)" — das
    #  war die Ochsenfuhre von 1350, der Hauptvorgang der Epoche.
    "abfahrt1": (
        "A heavy ox cart leaving a cobbled courtyard in the year 1350: two oxen with "
        "slow cloven hooves on stone, a solid wooden wheel creaking on a wooden axle, "
        "a wooden yoke knocking, a harness chain, the cart rumbling away out through "
        "a gate. No voices, no music, no engines, no rubber or plastic wheels.", 7),

    # "Klänge: rotierendes metallisches Geräusch (wie eine sich drehende Münze)" —
    #  gemeint war ein Pferdefuhrwerk.
    "abfahrt2": (
        "A heavy horse-drawn wagon leaving a cobbled courtyard in the year 1600: two "
        "draught horses, iron-shod hooves clattering on stone, harness chains and "
        "creaking leather, iron-rimmed wooden wheels grinding away through a gate. "
        "No voices, no music, no engines, no coins, no metal spinning.", 7),

    # "FALSCH: mechanische Fahrradklingel" — und das ist der HAEUFIGSTE Ton des
    #  ganzen Spiels: der WEITER-Knopf, in 1350.
    "woche1": (
        "A medieval night watchman's wooden clapper rattle struck three times: dry "
        "hard beechwood knocking on hardwood, close and short, then silence. No bell, "
        "no bicycle bell, no metal ringing, no voices, no music, no electronics.", 3),

    # "FALSCH: klingt stark nach moderner Plastikfolie oder Zellophan" — dabei
    #  ist es der Ton, den DIE FUHRE sechsmal ruft, wenn ein Vertrag gilt.
    "siegel": (
        "Sealing a charter: hot sealing wax dripping onto parchment, a heavy brass "
        "seal pressed into the wax with one short squeeze and pulled away, stiff "
        "parchment shifted on an oak table. No plastic, no cellophane, no crinkling "
        "foil, no voices, no music.", 5),

    # "FALSCH: mechanisches Gerät / Schalter (00:01)", 20. Jahrhundert.
    "kerbe": (
        "Cutting a tally notch: a knife blade chopping three short notches into a dry "
        "oak tally stick, hardwood fibres splitting, the stick knocked once on a "
        "wooden table. No clicks, no switches, no ratchets, no voices, no music.", 3),

    # "FALSCH: elektrisches Gerät (Elektromotor), ab 00:00" — im Hofband von
    #  1884, also unter allem, was in dieser Epoche geschieht.
    "hof3": (
        "Continuous background ambience of a brewery yard in the year 1884: a "
        "stationary steam engine chuffing slowly behind a brick wall, a wide leather "
        "flat belt slapping on a pulley, coal shovelled, iron-shod hooves and an "
        "iron-rimmed dray wagon on cobbles, a cooper hammering hoops further off, "
        "steam hissing from a valve. Even, unchanging, loopable. No electric motor "
        "hum, no cars, no voices, no music.", 22),

    # Nicht anachronistisch, aber der leiseste Ton (RMS 0,038) an einer der
    # lautesten Stellen: ein volles Fass, das ueber den Hof rollt.
    "fassholz": (
        "A heavy full oak beer cask rolled on its bilge over cobblestones and then "
        "over wooden planks: oak staves rumbling low and loud, iron hoops ringing on "
        "stone, the cask thudding against a wooden chock and stopping. No voices, no "
        "music, no engines.", 5),

    # "Klänge: Boing-Geräusch (vibrierende Feder oder Maultrommel)" — gemeint
    #  war ein Stahlfass in 1970.
    "fassstahl": (
        "A stainless steel beer keg in a 1970s brewery yard: the keg set down hard on "
        "concrete with a hollow metallic ring, rolled on its rim over concrete, then "
        "rumbling up a steel ramp and knocking against another keg. No music, no "
        "springs, no boing, no jew's harp, no voices.", 5),

    # "Klänge: Schieben oder Kratzen eines Gegenstandes (z.B. eines Stuhls)" —
    #  gemeint war der Handschlag, mit dem ein Vertrag zustande kommt.
    "handschlag": (
        "Two men's hands striking together in one firm handshake, close to the "
        "microphone: a single sharp clap of skin, coat sleeves and leather rustling, "
        "then a flat hand thumping a heavy oak table once. No voices, no music, no "
        "chairs scraping.", 4),

    # Das Hofband von 1350 war nur ein knarrendes Rad (RMS 0,014, das leiseste
    # Band von allen). Das Ohr hat daraufhin ueber die ganze Epoche gesagt:
    # "Jemand fegt, jemand saegt, Gaense schnattern" — ein Bauernhof, kein
    # Brauhaus. Der Vorgang ist die halbe Latte; also muss das Band brauen.
    "hof1": (
        "Continuous background ambience of a medieval brewing yard, year 1350, from "
        "the middle of a small walled courtyard: a wood fire crackling under a wide "
        "open copper pan, wort bubbling and steaming, a wooden paddle stirring mash "
        "in a tub, a bucket drawn dripping from a well, wooden pattens on cobbles, an "
        "oak cask rolled slowly behind, hens, one distant church bell. Even, quiet, "
        "dry, loopable. No engines, no geese, no voices, no music.", 22),

    # ------------------------------------------------------------------------
    # NEU — Rufe, die es seit Welle 2 gibt und die bisher im Ersatzkasten
    # landeten: DER SUD, DER NAME und DAS ERBE klangen alle nach Papier.
    # ------------------------------------------------------------------------
    "maische": (
        "Mashing in a brewery: a long wooden mash paddle stirring thick hot grain "
        "mash in a large wooden tub, slow heavy sloshing and dragging, steam, grain "
        "husks, a wooden scoop knocked twice on the rim of the tub. No voices, no "
        "music.", 5),

    "anstich": (
        "Tapping a beer cask: a wooden tap driven into the bung of a full oak cask "
        "with three blows of a wooden mallet, the last blow dull as it seats, then "
        "beer gushing and foaming into an earthenware jug. No voices, no music.", 5),

    "flaschen": (
        "A bottling hall: glass beer bottles clinking shoulder to shoulder along a "
        "moving conveyor, crown caps pressed on with a fast rhythmic metallic "
        "clatter, full bottles dropped into a wooden crate. No voices, no music.", 6),

    "feder": (
        "Writing in a house book: a goose quill scratching quickly across parchment, "
        "the quill dipped into an inkhorn and tapped on its rim, sand shaken over the "
        "page, a heavy leather-bound book closed with a thud. No voices, no music, "
        "no electronics.", 5),

    "hefe": (
        "A wooden bucket of thick yeast slurry poured into a large open wooden "
        "fermenting vat: heavy viscous splashing, gurgling, foam settling, the empty "
        "bucket set down on flagstones. No voices, no music.", 4),
}

MUSIK = {
    # Das Ohr datiert das alte bett2 auf "18. Jahrhundert, Spätbarock/Galant,
    # Menuett in G-Dur" — zweihundert Jahre zu spaet fuer 1600.
    "bett2": ("Instrumental only. Absolutely no voices, no singing, no choir. "
              "Music of about 1600, a broken consort playing in the panelled room of a "
              "burgher's house: lute, treble recorder, tenor recorder, bass viol, a "
              "small hand-struck tabor. A slow pavane, plain and modal, with a "
              "measured walking tread. Renaissance, not baroque: no harpsichord solo, "
              "no minuet, no galant style, no orchestra, no functional dominant "
              "cadences, no virtuoso runs. Quiet background music, loopable, no "
              "ending, no crescendo.", 40),
}

GRENZE = 450


def mache(name):
    if name in MUSIK:
        prompt, dauer = MUSIK[name]
        art, treue = "musik", None
    else:
        prompt, dauer = GERAEUSCH[name]
        art, treue = "geraeusch", "0.85"
    if art == "geraeusch" and len(prompt) > GRENZE:
        return name, "FEHLER: Prompt %d Zeichen, erlaubt sind %d" % (len(prompt), GRENZE)

    ziel = ZIEL / (name + ".mp3")
    if ziel.exists():
        alt = ZIEL / (name + ".alt.mp3")
        if not alt.exists():
            shutil.copy2(ziel, alt)

    befehl = [sys.executable, str(WERKZEUG), art, "--prompt", prompt,
              "--out", str(ziel), "--dauer", str(dauer)]
    if treue:
        befehl += ["--treue", treue]
    r = subprocess.run(befehl, capture_output=True, text=True)
    if r.returncode != 0:
        return name, "FEHLER: " + (r.stderr or r.stdout).strip()[:200]
    return name, (r.stdout or "").strip()


def main():
    argumente = [a for a in sys.argv[1:] if not a.startswith("-")]
    alle = list(GERAEUSCH) + list(MUSIK)
    namen = argumente or [n for n in alle if not (ZIEL / (n + ".alt.mp3")).exists()]
    unbekannt = [n for n in namen if n not in alle]
    if unbekannt:
        sys.exit("unbekannt: " + " ".join(unbekannt))
    if not namen:
        print("nichts zu tun")
        return
    print("erzeuge: " + " ".join(namen))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for name, sagt in pool.map(mache, namen):
            print("%-12s %s" % (name, sagt))


if __name__ == "__main__":
    main()
