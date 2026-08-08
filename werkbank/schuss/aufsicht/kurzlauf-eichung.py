#!/usr/bin/env python3
"""DIE KURZLAUF-EICHUNG — was ein 100-Wochen-Lauf sieht und was er uebersieht.

  python3 werkbank/schuss/aufsicht/kurzlauf-eichung.py

T0.7 des Umsetzungsplans. Die Pruefpyramide will auf Stufe 1 (je Ticket) einen
**Kurzlauf ueber 100 Wochen mit Pruefsummenvergleich** statt der vollen
400-Wochen-Latte — als Beweis, dass eine Aenderung die Partie nicht bewegt.
Das ist eine Wette, und diese Datei loest sie ein oder nicht:

  **Wenn der Kurzlauf die Aenderung nicht sieht, ist sie partieneutral.**

Damit dieser Satz gilt, muss der Kurzlauf jede Aenderung sehen, die spaeter rho
bewegt. Gemessen wird deshalb nicht eine Korrelation zweier rho-Werte — 100
Wochen sind drei Braujahre, und ein rho ueber drei Jahre ist keine Zahl,
sondern eine Laune. Gemessen wird die **Erstabweichungswoche**: in welcher
Woche laufen zwei Partien zum ersten Mal auseinander? Liegt sie in jedem
bekannten Fall unter 100, taugt der Kurzlauf; liegt sie darueber, taugt er
nicht, und die Schwelle muss hoeher.

Die Paare, gegen die geeicht wird, sind alle im Repo:

  * **Knopfboden mit/ohne, 1970** — der haerteste bekannte Fall. Derselbe
    Commit, dieselbe Saat, ein Knopfboden Unterschied, und rho springt von
    +0,699 auf −0,112: **0,811 bei zwoelf Braujahren**. Wer das nicht sieht,
    sieht nichts. (`knopfboden-probe/`, MESSLATTE.md)
  * **Rueckkopplung r3 vorher/nachher** je Epoche — eine echte Wirtschafts-
    aenderung mit Absicht.
  * **Die Wiederholbarkeitslaeufe der Welle 13** je Epoche untereinander — die
    Gegenprobe: gleicher Stand, gleiche Saat. Hier MUSS die Erstabweichung
    ausbleiben, sonst misst das Geraet Rauschen.

Verglichen wird die Wochenreihe Feld fuer Feld, nicht die Datei als Ganzes:
eine Datei traegt auch Hafen und Wochenzahl, und die sollen nicht mitzaehlen.
"""
import json, glob, hashlib, os, sys

# ZWEI KLASSEN VON FELDERN, UND SIE MUESSEN GETRENNT BLEIBEN. Der erste Entwurf
# dieser Datei warf sie zusammen und meldete darauf ein Urteil, das falsch war:
# „1884 vorher/nachher weicht ab Woche 312 ab" — dabei sind Kasse, Faesser,
# Rohstoff, Plaetze und Amtszeit ueber alle 400 Wochen ziffernweise gleich, bis
# auf den letzten Pfennig (18 974 in beiden). Abgewichen ist in 2 von 400 Wochen
# allein der NENNER: welchen Zug die Messung gerade fuer den naechsten
# umkaempften haelt und was er kostet. Das ist die Beschriftung der Messung,
# nicht der Zustand des Hauses — und die Rueckkopplung r3 hat genau daran
# gearbeitet.
#
# Wer beides in eine Pruefsumme wirft, bekommt bei jeder Preisarbeit einen
# Fehlalarm und haelt danach keinen mehr fuer echt.
PARTIE = ('jahr', 'woche', 'kasse', 'rohstoff', 'faesser', 'plaetze', 'amtszeit')
NENNER = ('deckung', 'nennerPreis')


def reihe(p, felder):
    d = json.load(open(p))
    return [tuple(w.get(k) for k in felder) for w in (d.get('reihe') or [])], d


def erstabweichung(a, b):
    """Nummer der ersten Woche, in der zwei Reihen auseinanderlaufen (1-basiert).
    None, wenn sie auf ganzer gemeinsamer Laenge gleich sind."""
    for i, (x, y) in enumerate(zip(a, b)):
        if x != y:
            return i + 1
    return None if len(a) == len(b) else min(len(a), len(b)) + 1


def summe(r, n):
    h = hashlib.md5()
    for w in r[:n]:
        h.update(repr(w).encode())
    return h.hexdigest()[:8]


def spearman(xs, ys):
    n = len(xs)
    if n < 3:
        return None

    def raenge(v):
        s = sorted(range(len(v)), key=lambda i: v[i])
        r = [0.0] * len(v)
        i = 0
        while i < len(s):
            j = i
            while j + 1 < len(s) and v[s[j + 1]] == v[s[i]]:
                j += 1
            m = (i + j) / 2 + 1
            for k in range(i, j + 1):
                r[s[k]] = m
            i = j + 1
        return r

    rx, ry = raenge(xs), raenge(ys)
    mx, my = sum(rx) / n, sum(ry) / n
    num = sum((a - mx) * (b - my) for a, b in zip(rx, ry))
    den = (sum((a - mx) ** 2 for a in rx) * sum((b - my) ** 2 for b in ry)) ** .5
    return num / den if den else None


def rho_schnitte(d):
    roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
    out = []
    for n in (12, 13, 14):
        s = roh[:n]
        v = spearman([r['jahr'] for r in s], [r['zugVerh'] for r in s]) if len(s) >= 3 else None
        out.append('  —   ' if v is None else f'{v:+.3f}')
    return ' / '.join(out).replace('.', ',')


W = os.path.dirname(os.path.abspath(__file__)) + '/../..'
os.chdir(W + '/..')
STUFEN = (30, 60, 100, 150, 200, 400)


def paar(name, pa, pb):
    """Gibt (Erstabweichung der PARTIE, rho hat sich bewegt?) zurueck."""
    if not (os.path.exists(pa) and os.path.exists(pb)):
        print(f'{name:34s} — Datei fehlt, uebersprungen')
        return None, None
    ra, da = reihe(pa, PARTIE)
    rb, db = reihe(pb, PARTIE)
    na, _ = reihe(pa, NENNER)
    nb, _ = reihe(pb, NENNER)
    e, en = erstabweichung(ra, rb), erstabweichung(na, nb)
    ta, tb = rho_schnitte(da), rho_schnitte(db)
    gleich = [n for n in STUFEN if summe(ra, n) == summe(rb, n)]
    print(f'{name:34s} Partie weicht ab: {"nie" if e is None else f"Woche {e}"}'
          f'   ·   Nenner: {"nie" if en is None else f"Woche {en}"}')
    print(f'{"":34s} rho A {ta}   rho B {tb}   {"— rho BEWEGT" if ta != tb else "— rho gleich"}')
    print(f'{"":34s} Partie-Pruefsumme gleich bis Woche: '
          + (', '.join(str(n) for n in gleich) if gleich else 'keiner Stufe'))
    return e, (ta != tb)


print('=' * 96)
print('A · GEGENPROBE — derselbe Stand, dieselbe Saat. Hier DARF nichts abweichen.')
print('=' * 96)
gegen = []
for ep in (1, 2, 3, 4):
    fs = sorted(glob.glob(f'werkbank/schuss/aufsicht/welle13-gegen/wdh/e{ep}-*.json'))
    if len(fs) < 2:
        continue
    for f2 in fs[1:]:
        gegen.append(paar(f'W13 wdh e{ep}: {os.path.basename(fs[0])[:5]}↔{os.path.basename(f2)[:5]}',
                          fs[0], f2))

print()
print('=' * 96)
print('B · DER HAERTESTE BEKANNTE FALL — Knopfboden mit/ohne, 1970, Δrho 0,811')
print('=' * 96)
hart = paar('Knopfboden 1970 mit↔ohne',
            'werkbank/schuss/aufsicht/knopfboden-probe/mit/e4-A.json',
            'werkbank/schuss/aufsicht/knopfboden-probe/ohne/e4-A.json')

print()
print('=' * 96)
print('C · ECHTE WIRTSCHAFTSAENDERUNG — Rueckkopplung r3, vorher gegen nachher')
print('=' * 96)
echte = []
for ep in (1, 2, 3, 4):
    echte.append(paar(f'r3 vorher↔nachher e{ep}',
                      f'werkbank/schuss/rueckkopplung-r3/lauf-vorher-e{ep}-A.json',
                      f'werkbank/schuss/rueckkopplung-r3/lauf-nachher-e{ep}-A.json'))

print()
print('=' * 96)
alle = echte + [hart]
falsch = [e for e, _ in gegen if e is not None]
bewegt = [e for e, b in alle if b and e is not None]
still = [e for e, b in alle if b is False and e is not None]

if falsch:
    print('!! DIE GEGENPROBE IST GERISSEN: gleicher Stand, verschiedene Partie.')
    print('   Der Kurzlauf kann nichts beweisen, solange das gilt.')
    sys.exit(1)

print(f'Gegenprobe sauber: {len(gegen)} Paare gleichen Standes, 0 Abweichungen der Partie.')
if not bewegt:
    print('Kein Paar gefunden, das rho bewegt hat — nichts zu eichen.')
    sys.exit(2)
print(f'Aenderungen, die rho BEWEGT haben: {len(bewegt)}, '
      f'Partie lief auseinander ab Woche {sorted(bewegt)}')
if still:
    print(f'Aenderungen ohne rho-Wirkung, Partie dennoch abgewichen ab Woche {sorted(still)}')
print()
if max(bewegt) <= 100:
    print(f'URTEIL: Als rho-WAECHTER genuegen 100 Wochen. Jede bekannte Aenderung, die rho')
    print(f'        bewegt hat, lief spaetestens in Woche {max(bewegt)} aus dem Ruder — '
          f'{100 - max(bewegt)} Wochen Reserve.')
else:
    print(f'URTEIL: 100 Wochen genuegen als rho-Waechter NICHT — Woche {max(bewegt)}.')
print(f'        Die Beweislage ist duenn: {len(bewegt)} Faelle. Zwei Faelle sind kein Gesetz,')
print('        und der Kurzlauf bleibt deshalb ein VETO, kein Freispruch — eine')
print('        abweichende Pruefsumme heisst sicher „nicht partieneutral", eine gleiche')
print('        heisst nur „kein Gegenbeweis". Der Beweis bleibt die Wellengrenze.')
