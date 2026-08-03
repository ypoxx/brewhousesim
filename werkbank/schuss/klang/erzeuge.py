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
        "Oxen hooves walking away on cobblestones while a wooden cart with creaking "
        "wooden wheels rumbles out through a stone gateway.", 7),

    # "Klänge: rotierendes metallisches Geräusch (wie eine sich drehende Münze)" —
    #  gemeint war ein Pferdefuhrwerk.
    "abfahrt2": (
        "A heavy horse-drawn wagon leaving a cobbled courtyard in the year 1600: two "
        "draught horses, iron-shod hooves clattering on stone, harness chains and "
        "creaking leather, iron-rimmed wooden wheels grinding away through a gate. "
        "No voices, no music, no engines, no coins, no metal spinning.", 7),

    # "FALSCH: mechanische Fahrradklingel" — und das ist der HAEUFIGSTE Ton des
    #  ganzen Spiels: der WEITER-Knopf, in 1350.
    # Gewaehlt im dritten Anlauf. Der erste Versuch klang dem Ohr WIEDER nach
    #  Fahrradklingel; lange Verbotslisten helfen der Gegenstelle nicht.
    "woche1": (
        "A wooden watchman's rattle: two hard beech boards clapped together three "
        "times in a stone courtyard. Dry knocking wood, no ringing.", 3),

    # "FALSCH: klingt stark nach moderner Plastikfolie oder Zellophan" — dabei
    #  ist es der Ton, den DIE FUHRE sechsmal ruft, wenn ein Vertrag gilt.
    # Drei Anlaeufe: "Zellophan", dann "Gummispielzeug", dann "Ratsche". Erst
    #  der Holzstempel kam als "zeitlos, nichts falsch" zurueck.
    "siegel": (
        "A wooden stamp struck once onto a sheet of parchment on an oak table, one "
        "dull thud, then the parchment lifted and rustled.", 4),

    # "FALSCH: mechanisches Gerät / Schalter (00:01)", 20. Jahrhundert.
    "kerbe": (
        "A knife chopping three deep notches into a dry oak stick. Wood splitting, "
        "chips falling, close.", 3),

    # "FALSCH: elektrisches Gerät (Elektromotor), ab 00:00" — im Hofband von
    #  1884, also unter allem, was in dieser Epoche geschieht.
    # Der erste Anlauf kam als Kuechengeraeusch zurueck ("heisses Fett, Messer
    #  auf dem Brett"). Kurz und auf EINE Sache gerichtet traf es.
    "hof3": (
        "A stationary steam engine working behind a wall: slow rhythmic chuffing and "
        "hissing steam, a big flywheel turning, a leather drive belt slapping, iron "
        "clanking. Continuous factory yard ambience.", 22),

    # Nicht anachronistisch, aber der leiseste Ton (RMS 0,038) an einer der
    # lautesten Stellen: ein volles Fass, das ueber den Hof rollt.
    "fassholz": (
        "A large full oak barrel rolling slowly over cobblestones, deep wooden rumble, "
        "iron hoops ringing, then thudding to a stop.", 5),

    # "Klänge: Boing-Geräusch (vibrierende Feder oder Maultrommel)" — gemeint
    #  war ein Stahlfass in 1970.
    "fassstahl": (
        "An empty stainless steel beer keg dropped onto a concrete floor and rolled on "
        "its rim, hollow metallic booming and scraping, then knocking against another "
        "keg.", 5),

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
    # Der erste Anlauf hatte bei Sekunde 16 ein "Klicken eines Kugelschreibers"
    #  — in einem Band, das 22 Sekunden lang unter allem liegt.
    "hof1": (
        "Ambience inside a medieval brewhouse yard: a steady wood fire crackling under "
        "a copper pan, wort bubbling slowly, a wooden paddle stirring, water dripping "
        "into a bucket. Calm, continuous.", 22),

    # ------------------------------------------------------------------------
    # NEU — Rufe, die es seit Welle 2 gibt und die bisher im Ersatzkasten
    # landeten: DER SUD, DER NAME und DAS ERBE klangen alle nach Papier.
    # ------------------------------------------------------------------------
    # KEINE Maische-Probe. Zwei Anlaeufe kamen als "Espressomaschine" und als
    # "Holzratsche" zurueck; das Anstellen klingt jetzt ueber sud1..sud4, und
    # das ist ohnehin naeher am Spiel: die Pfanne ist der Sud.

    # Dritter Anlauf. Die ersten beiden brachten einen hellen Glockenton mit,
    # und der stand in 1350 als "modernes Telefonklingeln" im Urteil.
    "anstich": (
        "A cooper hammering a wooden bung into a barrel, dull wooden knocks, followed "
        "by liquid pouring heavily into a pot.", 5),

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
    # ------------------------------------------------------------------------
    # Ersetzt in der letzten Runde, nachdem das Ohr die fertigen dreissig
    # Sekunden gehoert hatte — nicht die Probe allein. Beides ist noetig:
    # eine Probe kann fuer sich tadellos sein und in der Mischung kippen.
    # ------------------------------------------------------------------------

    # Die alte Glocke war kurz und hell. In der Mischung von 1600 hat das Ohr
    # sie zweimal als "moderne Autohupe bei 0:03 und 0:26" gemeldet, in 1350
    # als Telefon. Tief und lang klingt sie wie das, was sie ist.
    "glocke": (
        "A large bronze church bell tolling slowly three times in a town, deep and "
        "heavy with a long decaying hum, heard from the street below.", 8),

    # "STÖRT: Der elektronische Rückfahrpiepser war um 1970 noch sehr
    #  unüblich" — vom Ohr ungefragt gemeldet, im Abfahrtklang von 1970.
    "abfahrt4": (
        "A 1970s diesel lorry in a yard: the engine starts, idles roughly, air brakes "
        "hiss and release, gears grind, and the lorry drives away over concrete. No "
        "beeping, no reversing alarm, no electronics.", 8),
}

MUSIK = {
    # DREI Anlaeufe, und der Grund ist die Latte selbst. Das alte bett2 datierte
    # das Ohr auf "18. Jahrhundert, Menuett" — zweihundert Jahre zu spaet. Der
    # erste Ersatz kam als Blockfloete zurueck, also mit demselben
    # Leitinstrument wie bett1 (1350); zwei Epochen mit einem Leitinstrument
    # sind fuer ein blindes Ohr eine Epoche, und 1600 fiel prompt durch
    # ("gehoert: Epoche 3"). Der zweite kam als gezupftes Cello. Erst das
    # Cembalo allein traegt die Epoche: seither nennt das Ohr 1600 mit 95-100 %
    # und begruendet es JEDES MAL zuerst mit dem Cembalo.
    "bett2": ("Instrumental only, no voices, no singing, no flute, no recorder, no "
              "woodwind of any kind. A HARPSICHORD alone plays a slow Renaissance "
              "pavane of about 1600: bright quilled plucked strings, plain modal "
              "harmony, a steady walking tread, no ornament runs, no orchestra, no "
              "piano, no strings, no percussion. Quiet, loopable, no ending.", 40),
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
