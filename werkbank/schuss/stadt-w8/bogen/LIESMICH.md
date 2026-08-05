# stadt-w8/bogen — die drei erzeugten Bögen der Hoffracht

`alt.txt` · `neu.txt` · `tor.txt` sind die Prompts, `*.json` die Schnittpläne
für `../schneiden.mjs`. Die erzeugten `.jpg` sind Arbeitsmaterial und liegen
nicht in der Versionsverwaltung — wer sie neu braucht, ruft

    python3 design/tools/gen_image.py --prompt-file <name>.txt \
        --out <name>.png --aspect 1:1 --resolution 2K \
        --ref spiel/bild/platte-1600.jpg

und danach `../schneiden.mjs <name>.jpg <name>.json`.

**Der Grund steht in `zielbild/README.md`:** `--ref` würfelt Kleinschrift neu.
Auf diesen Bögen steht deshalb kein einziger Buchstabe — sie tragen nur
Gegenstände und Leute, und jede Schrift im Spiel ist echter Text.
