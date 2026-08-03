#!/usr/bin/env python3
"""Welle 5 · DER KLANG — die Proben, die das fremde Ohr EINZELN verurteilt hat.

Der blinde Kritiker hat gemessen, dass die gespielte Aufnahme die Epoche
schlechter traegt als die stille. Auf der Suche nach dem Warum habe ich jede
epochentragende Probe EINZELN vorgelegt (`werkbank/schuss/klang/beschreibe.py`,
ohne Dateinamen, ohne Absicht). Ergebnis: sieben Proben enthalten nicht das,
was ihr Name verspricht. Die FUHRE — der Hauptvorgang des Spiels — hat in drei
von vier Epochen gar keinen Abfahrtsklang.

Jede Zeile hier traegt den Satz des Ohres, der die alte Probe verurteilt hat.

    ./erzeuge.py            # alles, was in ZIEL fehlt
    ./erzeuge.py abfahrt1   # nur diese, alte wandert nach <name>.alt.mp3

GRENZEN DER GEGENSTELLE (teuer gelernt, siehe schuss/klang/erzeuge.py):
  * /v1/sound-generation nimmt hoechstens 450 Zeichen.
  * hoechstens 5 gleichzeitige Anfragen.
"""

import pathlib
import shutil
import subprocess
import sys

WURZEL = pathlib.Path(__file__).resolve().parents[3]
ZIEL = WURZEL / "spiel" / "ton" / "klang"
WERKZEUG = WURZEL / "design" / "tools" / "gen_audio.py"

# name -> (prompt, dauer, treue)
GERAEUSCH = {

    # "Klänge: Plätschern von Wasser · Gluckern und Blubbern · Wasserbewegung
    #  / Schwappen · Tropfgeräusche — Zeit: 21. Jahrhundert (oder zeitlos)".
    #  Das war die OCHSENFUHRE von 1350, der Hauptvorgang der ersten Epoche.
    #  Sie enthielt keinen Ochsen, keinen Karren und kein Pflaster, sondern
    #  Wasser. Das blinde Ohr hat 1350 dreimal von drei falsch geraten und
    #  einmal ausdruecklich "Umfuellen von Fluessigkeit" gehoert.
    #  ZWEITER ANLAUF: der erste kam als "Eingiessen einer Fluessigkeit ·
    #  Schritte" zurueck — wieder Wasser. Das Wort "oxen" zieht offenbar nichts
    #  Hoerbares nach sich; die Bewegung selbst muss im Prompt stehen.
    "abfahrt1": (
        "Heavy cloven hooves plod slowly away over cobblestones while solid wooden "
        "cartwheels rumble and grind on the stone behind them, a wooden axle "
        "squeaking with every turn, the cart bumping over a threshold and the "
        "rumbling fading into the distance. "
        "No water, no pouring, no splashing, no gurgling, no liquid, no voices, "
        "no music, no engines.", 7, 0.75),

    # "Klänge: Metallisches Kurbeln und Ratschen einer Mechanik · Metallisches
    #  Klappern". Das ist keine Pferdefuhre, das ist eine Winde.
    "abfahrt2": (
        "A heavy horse-drawn wagon pulls out of a cobbled courtyard: two draught "
        "horses, iron-shod hooves clattering on stone, one snort, harness chains "
        "jingling, leather creaking, iron-rimmed wooden wheels grinding away "
        "through a gate and receding. "
        "No cranking, no ratchet, no winch, no machinery, no engines, no voices, "
        "no music.", 7, 0.7),

    # "Klänge: Rhythmisches Zischen / Sprühgeräusch · MENSCHLICHES PFEIFEN EINER
    #  MELODIE · Metallisches Quietschen". Das gepfiffene Liedchen ist der
    #  Grund, aus dem das blinde Ohr die gespielte Aufnahme von 1884 zweimal
    #  von drei als 1350 gehoert hat: "eine einfache mittelalterliche
    #  Holzfloetenmelodie".
    "abfahrt3": (
        "Railway goods wagons being shunted in a brewery siding in 1884: heavy "
        "buffers clashing, couplings and chains rattling, iron wheels squealing and "
        "grinding on rails, a shunting locomotive chuffing slowly and pulling the "
        "wagons away. "
        "No whistling person, no melody, no tune, no spray can, no voices, no "
        "music, no modern engines.", 7, 0.7),

    # "Zischen einer Druckluftentlastung (Pneumatik/Bremse) bei Sekunde 2 bis 4".
    #  Fuer sich richtig — 1970 hat Druckluftbremsen. In der Mischung aber hat
    #  das blinde Ohr die gespielte Aufnahme von 1970 DREIMAL VON DREI als 1884
    #  gehoert, jedes Mal begruendet mit "zischender Wasserdampf". Ein langes
    #  Zischen ist fuer ein Ohr Dampf, gleich woher es kommt.
    "abfahrt4": (
        "A diesel lorry leaves a brewery yard in 1970: the diesel engine idling "
        "rough, the driver revving, a gear engaging with a clunk, tyres rolling on "
        "concrete and the engine note dropping away as the lorry drives off. "
        "No air brakes, no long hiss, no steam, no whistle, no horn, no voices, "
        "no music.", 7, 0.7),

    # "Klänge: Gluckern von Wasser · Blubbern von Luftblasen · Plätschern einer
    #  Flüssigkeit". Kein Feuer. Der Sud von 1350 ist das offene Holzfeuer
    #  unter der Pfanne — ohne es klingt 1350 wie jede andere Zeit auch.
    #  ZWEITER ANLAUF: der erste kam wieder als "Wassergluckern · Blubbern"
    #  zurueck. Jede Erwaehnung von Sud, Wuerze oder Pfanne holt Fluessigkeit
    #  ins Bild; das Feuer muss allein dastehen.
    "sud1": (
        "A big open log fire burning fiercely on a hearth: dry logs crackling and "
        "snapping loudly, sparks popping, flames roaring and drawing, a log "
        "shifting and collapsing into the embers, a wooden pole poking the fire. "
        "No water, no liquid, no bubbling, no gurgling, no boiling, no steam, "
        "no machinery, no voices, no music.", 7, 0.75),

    # "FALSCH: Sprühdose / Aerosolspray (bei Sekunde 0-2, erst ab 1927
    #  erfunden)" — dazu "Dreitöniges Tröten einer SPIELZEUGHUPE". Diese Probe
    #  laeuft in 1884 bei jedem `sud:pfanne` und jedem `sud:anstellen`.
    "sud3": (
        "A steam-driven brewery copper in 1884: a brass steam valve opened with a "
        "short heavy hiss, condensate knocking in the pipes, a slow mechanical "
        "stirring gear turning inside the copper with a rhythmic metallic groan, "
        "and the wort boiling. "
        "No spray can, no aerosol, no toy horn, no honking, no whistle, no voices, "
        "no music.", 7, 0.7),

    # "Klänge: GONGSCHLAG · Resonierender Nachhall eines metallischen
    #  Klangkörpers — Zeit: 21. Jahrhundert (oder zeitlos)". Das war das
    #  rollende Stahlfass von 1970, und zwoelf Kopien davon in einer halben
    #  Sekunde sind der "8-Bit/Chiptune-Soundeffekt" aus Auflage 3.
    #  ZWEITER ANLAUF: der erste kam als "HUNDEBELLEN · dumpfer metallischer
    #  Schlag" zurueck. Das Wort keg/barrel holt offenbar einen Hof mit Hund.
    "fassstahl": (
        "A big empty steel drum lying on its side is pushed and rolled across a "
        "bare concrete floor: a low hollow metallic rumble that wobbles as the drum "
        "turns, the raised seam knocking on the concrete once per revolution, "
        "ending with a dull metallic scrape. "
        "No dog, no barking, no animals, no gong, no bell, no long ringing, "
        "no voices, no music.", 5, 0.75),

    # "Klänge: Dumpfer Klick · HOHER, SCHRILLER ELEKTRONISCHER PFEIFTON ·
    #  Hintergrundrauschen — Zeit: 20. oder 21. Jahrhundert". Ein
    #  Dauerpfeifton ist fuer ein Ohr eine Dampfpfeife; er hat den Michaelitag
    #  von 1970 nach 1884 gezogen.
    "werksglocke": (
        "An electric alarm bell on a factory wall ringing for the end of the shift "
        "in 1970: a metal gong struck rapidly by an electric clapper, harsh and "
        "rattling, ringing for several seconds and stopping abruptly. "
        "No pure tone, no siren, no electronic beep, no whistle, no steam, no "
        "voices, no music.", 5, 0.7),

    # NEU. 1884 hatte fuer den WEITER-Knopf und fuer den Michaelitag DIESELBE
    #  Probe (`fabrikpfeife`), also achtmal denselben reinen Pfeifton in
    #  dreissig Sekunden — und ein wiederholter reiner Ton ist fuer ein Ohr
    #  eine Melodie. Der haeufigste Ton des Spiels bekommt in 1884 ein eigenes
    #  Zeichen; die Dampfpfeife bleibt dem Michaelitag.
    "schicht": (
        "A cast iron shift bell struck three times with a hammer on the wall of a "
        "19th century factory: a hard flat clang each time with a short metallic "
        "ring, over a faint background of a distant steam engine. "
        "No tune, no melody, no whistle, no pure tone, no voices, no music.", 4, 0.7),

    # NEU — DER RUHENDE HOF. Ein Hof, in dem niemand arbeitet, darf die Zeit
    #  NICHT verraten: das ist der ganze Sinn der Auflage 1. Diese eine Probe
    #  liegt in allen vier Epochen und ist die einzige Schicht, die auch ohne
    #  jeden Zug laeuft.
    #  ERSTER ANLAUF VERWORFEN, und zwar gemessen: mit "a loose shutter tapping"
    #  kam ein Klappern zurueck, das das fremde Ohr als "das deutliche, schnelle
    #  Tippgeraeusch einer TASTATUR bzw. SCHREIBMASCHINE" gehoert und die Probe
    #  mit Sicherheit 85 auf Epoche 4 gelegt hat. Eine neutrale Schicht, die
    #  nach 1970 klingt, ist keine neutrale Schicht.
    "grund": (
        "An empty walled courtyard where nobody is working: steady wind moving "
        "through a stone archway, pigeons cooing and shifting their wings on a "
        "ledge, a heavy wooden beam creaking twice, and one low indistinct rumble "
        "far away in the distance. "
        "No tapping, no clicking, no typing, no dripping, no bells, no engines, "
        "no hooves, no tools, no voices, no music.", 22, 0.55),
}


def mach(name):
    prompt, dauer, treue = GERAEUSCH[name]
    ziel = ZIEL / (name + ".mp3")
    if ziel.exists():
        alt = ZIEL / (name + ".alt.mp3")
        if not alt.exists():
            shutil.copy(ziel, alt)
    r = subprocess.run([sys.executable, str(WERKZEUG), "geraeusch",
                        "--prompt", prompt, "--out", str(ziel),
                        "--dauer", str(dauer), "--treue", str(treue)],
                       capture_output=True, text=True)
    print(("%-14s %s" % (name, (r.stdout or r.stderr).strip())))
    return r.returncode


if __name__ == "__main__":
    namen = sys.argv[1:] or [n for n in GERAEUSCH
                             if not (ZIEL / (n + ".mp3")).exists()]
    for n in namen:
        if n not in GERAEUSCH:
            sys.exit("unbekannte Probe: %s" % n)
        mach(n)
