#!/usr/bin/env python3
"""Erzeugt die Tonproben fuer DAS STUECK "DER KLANG".

Ruft design/tools/gen_audio.py parallel auf und legt alles unter
spiel/ton/klang/ ab. Vorhandene Dateien werden uebersprungen, damit ein
zweiter Lauf nur die Luecken fuellt.

    ./werkbank/klang-erzeuge.py            # alles, was fehlt
    ./werkbank/klang-erzeuge.py bett1 hof3 # nur diese
"""

import concurrent.futures
import pathlib
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parent.parent
ZIEL = WURZEL / "spiel" / "ton" / "klang"
WERKZEUG = WURZEL / "design" / "tools" / "gen_audio.py"

NIE = ("Instrumental only. Absolutely no voices, no singing, no choir, no vocals, "
       "no spoken words. ")
TROCKEN = ("Recorded outdoors in a small walled courtyard: dry, close, small. "
           "No cathedral reverb, no church echo, no big hall. ")

# ---------------------------------------------------------------- Musikbetten
MUSIK = {
    "bett1": (
        NIE + TROCKEN +
        "Music of about 1350, a small band of town waits playing in a brewery yard. "
        "One reedy shawm carries a slow modal melody in the Dorian mode; a bowed vielle "
        "holds a bare open drone underneath; a hand-struck tabor keeps a plain walking "
        "pulse; a few small hand bells. Monophony over a drone only - no chords, no "
        "harmony in thirds, no bass line, no counterpoint. Austere, unhurried, slightly "
        "out of tune, a little rough. Quiet background music, loopable, no ending, "
        "no crescendo.", 45),
    "bett2": (
        NIE +
        "Music of about 1600, a renaissance consort playing in the panelled room of a "
        "burgher's house. Lute, two wooden recorders, a bass viol, a plucked virginal "
        "and a small tabor, playing a stately pavane in a minor mode with plain triadic "
        "harmony. Warm wooden timbres, small dry room, no reverb tail. No orchestra, no "
        "piano, no brass, no percussion kit. Moderate steady pulse, courtly and sober. "
        "Quiet background music, loopable, no ending.", 45),
    "bett3": (
        NIE +
        "Music of about 1884: a small German brass band playing in a beer garden. Two "
        "valve trumpets, a trombone, a tuba on an oom-pah bass, a clarinet on the tune, "
        "snare and bass drum, and a slightly out-of-tune upright piano. A cheerful, "
        "moderate polka-march in a major key. Acoustic 19th century band, warm and "
        "brassy, played a little heavily. No synthesizer, no electric instruments, no "
        "modern drum kit, no reverb, nothing after 1900. Loopable, no ending.", 45),
    "bett4": (
        NIE +
        "Music of about 1970, West German television advertising / library music. "
        "Electric bass guitar walking a relaxed groove, dry close-miked acoustic drum "
        "kit with brushed hi-hat, Hammond organ, clavinet, wah-wah electric guitar, a "
        "few muted trumpet stabs and a flute line. Mid-tempo funky lounge, warm analogue "
        "tape sound, slightly compressed. STRICTLY NO synthesizers, no synth pads, no "
        "synthwave, no arpeggiators, no drum machine, no digital reverb, nothing that "
        "sounds like the 1980s. Loopable, no ending.", 45),
}

# ------------------------------------------------------------ Hofgrundrauschen
# /v1/sound-generation nimmt hoechstens 450 Zeichen. Jeder Prompt bleibt darunter.
GERAEUSCH = {
    "hof1": ("Ambience loop, medieval brewery yard 1350. Well windlass creaking, wooden "
             "bucket, cooper tapping iron hoops onto an oak cask, an ox lowing, geese and "
             "hens, wooden cartwheels on packed earth, a broom on flagstones, one distant "
             "church bell, men's voices far off. No music. Nothing mechanical: no engine, "
             "no motor, no hum, no machinery, nothing modern.", 22),
    "hof2": ("Ambience loop, brewery yard of a walled town 1600. Horse cart with "
             "iron-tyred wheels on cobblestones, a squeaking hand water pump, a cooper "
             "hammering, a wooden mill wheel and wooden gears turning, market voices "
             "murmuring further off, a hand bell, a dog, a distant church bell. No music. "
             "No engine, no motor hum, nothing electrical, nothing modern.", 22),
    "hof3": ("Ambience loop, industrial brewery yard 1884. A stationary steam engine "
             "chuffing steadily, leather belt drives slapping over pulleys, a steam valve "
             "hissing, coal shovelled, riveting on an iron vessel, a heavy horse dray on "
             "cobbles, a distant factory whistle, workmen calling. No music. Steam and "
             "iron only: no electric motor, no diesel, no car, nothing modern.", 22),
    "hof4": ("Ambience loop, brewery yard 1970. A diesel lorry idling, a glass bottle "
             "filling and capping line rattling and clinking steadily, a conveyor belt, "
             "electric motor hum, compressed air hissing, a metal keg set on concrete, a "
             "distant tannoy too far off to understand. No music. No horses, no steam "
             "engine, no digital or electronic sounds.", 22),

    "sud1": ("A wood fire crackling under a wide shallow open copper pan, thick wort "
             "bubbling slowly, a long wooden paddle stirring and scraping the bottom, a "
             "wooden ladle dipped and poured. No music.", 7),
    "sud2": ("A brewer's open copper pan over a wood fire: a rolling boil, a wooden rake "
             "stirring, a wooden shovel of grain poured in, a copper ladle set down on "
             "stone, a log fed to the fire. No music.", 7),
    "sud3": ("An 1884 steam brewery: steam hissing sharply from a brass valve, a large "
             "steam-heated copper kettle rumbling to a boil, an iron stirring rake on a "
             "geared drive, a heavy iron lid swung shut, one short steam whistle. "
             "No music.", 7),
    "sud4": ("A 1970 stainless-steel brewhouse: an electric pump starting and settling "
             "into a hum, a pneumatic valve clacking, wort surging through steel "
             "pipework, relays clicking on a control panel, a steel hatch closed. "
             "No music.", 7),

    "abfahrt1": ("A pair of oxen harnessed to a heavy wooden cart, the driver calling "
                 "out, chains and leather traces creaking, wooden wheels groaning as they "
                 "start to roll on packed earth, an ox lowing, the cart moving away. "
                 "No music.", 7),
    "abfahrt2": ("Two horses hitched to a loaded cart, snorting, hooves on cobblestones, "
                 "a whip cracking, iron-tyred wheels rumbling away under a stone "
                 "gateway. No music.", 7),
    "abfahrt3": ("A steam locomotive shunting freight wagons at a loading ramp: buffers "
                 "clashing, couplings clanking, steam venting, a guard's whistle, the "
                 "engine chuffing slowly away. No music.", 8),
    "abfahrt4": ("A 1970s diesel lorry: the engine starting, air brakes releasing with a "
                 "loud hiss, wooden crates rolling on a metal roller conveyor, a tail "
                 "gate slammed, the lorry pulling away and changing gear. No music.", 8),

    "fassholz": ("One heavy oak cask rolled on its side across cobblestones, the wooden "
                 "staves rumbling, then tipped upright with a hollow wooden thud. "
                 "No music.", 5),
    "fassstahl": ("A stainless steel beer keg dropped on a concrete floor with a metallic "
                  "ring, then rolled and pushed onto a steel roller conveyor. "
                  "No music.", 5),

    "muenzen": ("A leather purse opened and a handful of silver coins counted out one by "
                "one onto a bare wooden table. No music.", 5),
    "kasse": ("A 1970s mechanical cash register: keys punched, an adding machine printing "
              "a strip, the drawer springing open with a bell, coins dropped into the "
              "tray. No music.", 5),

    "glocke": ("A single deep bronze church bell struck slowly three times, heard "
               "outdoors across a town square. No music.", 8),
    "fabrikpfeife": ("A steam factory whistle sounding one long blast over a works yard, "
                     "echoing off brick buildings. No music.", 6),
    "telefon": ("A 1970s rotary desk telephone ringing twice with a mechanical bell, the "
                "receiver lifted off the cradle. No music.", 5),

    "kreide": ("Chalk writing quick strokes and a figure on a slate board, then the chalk "
               "set down. No music.", 4),
    "maschine": ("A mechanical typewriter typing one short line briskly and the carriage "
                 "returned with a bell. No music.", 5),

    "siegel": ("Sealing wax melted and dripped onto parchment and pressed with a brass "
               "seal, stiff paper handled. No music.", 5),
    "papier": ("A single large stiff sheet of paper picked up, turned over and laid down "
               "on a wooden desk. No music.", 4),

    "bau1": ("Carpenters and masons at work: a mallet driving wooden pegs, a hand saw in "
             "oak timber, a trowel slapping mortar on stone, a stone set down, men "
             "calling to each other. No music.", 7),
    "bau4": ("A 1970s building site: a concrete mixer turning, a pneumatic hammer for a "
             "moment, a crane motor lifting, steel scaffolding poles clanging together. "
             "No music.", 7),

    "brand": ("An alarm bell rung frantically, fire roaring, timber cracking and "
              "collapsing, men shouting, buckets of water thrown. No music.", 7),
    "handschlag": ("Two men shake hands firmly, a wooden chair scrapes back over "
                   "floorboards, a short murmur of agreement, a heavy mug set down on a "
                   "table. No music.", 5),
    "karren": ("A strange cart drawn up in a yard and halted, the brake set, someone "
               "getting down and knocking twice at a door. No music.", 6),

    # Der WEITER-Knopf ist der haeufigste Ton des Spiels. Er war zuerst ein
    # synthetisches Glockchen; das pruefende Ohr hat ihn als "moderne
    # UI-Pieptoene" geruegt. Jetzt ist er je Epoche ein wirkliches Zeichen.
    "woche1": ("A wooden clapper knocked twice on a board in a yard, then a very small "
               "handbell rung once. Dry, close, no music.", 3),
    "woche2": ("A church tower clock striking one single deep bronze stroke over a "
               "town, with a faint mechanical whirring of the clockwork just before "
               "it. Low and heavy, not a small bell. No music.", 4),
    "woche3": ("One short blast of a steam whistle at a works, close by, then silence. "
               "No music.", 3),
    "woche4": ("A mechanical factory time clock stamping a card: a lever pulled, a punch "
               "striking, a small bell ping. No music.", 3),
    "kerbe": ("A knife chopping a notch into a wooden tally stick: two short dull "
              "chops into dry oak, close up, then the stick set down. No scraping, "
              "no music.", 3),
    "horchen": ("A dog barking once far off across a yard and two men murmuring briefly, "
                "indistinct. No music.", 4),
    "unruhe": ("A small crowd of men murmuring and arguing in a yard, indistinct, one "
               "voice raised briefly, feet shifting on gravel. No music.", 6),
}


def baue(name):
    if name in MUSIK:
        prompt, dauer = MUSIK[name]
        art = "musik"
    else:
        prompt, dauer = GERAEUSCH[name]
        art = "geraeusch"
    aus = ZIEL / (name + ".mp3")
    if aus.exists() and aus.stat().st_size > 4000:
        return name, "steht schon"
    ruf = [sys.executable, str(WERKZEUG), art, "--prompt", prompt,
           "--out", str(aus), "--dauer", str(dauer)]
    if art == "geraeusch":
        ruf += ["--treue", "0.65"]
    p = subprocess.run(ruf, capture_output=True, text=True)
    if p.returncode != 0:
        return name, "FEHLER " + (p.stdout + p.stderr).strip()[:200]
    return name, p.stdout.strip()


def main():
    ZIEL.mkdir(parents=True, exist_ok=True)
    alle = list(MUSIK) + list(GERAEUSCH)
    wunsch = sys.argv[1:] or alle
    unbekannt = [w for w in wunsch if w not in alle]
    if unbekannt:
        sys.exit("unbekannt: " + " ".join(unbekannt))
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        for name, wort in pool.map(baue, wunsch):
            print(f"{name:14s} {wort}", flush=True)


if __name__ == "__main__":
    main()
