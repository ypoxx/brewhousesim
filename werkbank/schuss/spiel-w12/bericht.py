#!/usr/bin/env python3
"""BERICHT — alle Zahlen der Spielprobe in einem Aufwasch.
   python3 bericht.py e1b e2 e3 e4"""
import json, sys, statistics, re
from collections import Counter
W = '/home/user/brewhousesim/werkbank/schuss/spiel-w12/protokoll'
RAHMEN = re.compile(r'^(kern:|klang:|weiter|stadt:reiter|stadt:marke|stadt:alles|stadt:ortsmarken|gegner:zeige|gegner:blatt|preis:chronik|erbe:buch|name:blatt|name:band|fuhre:sommer-bericht)')

def ev(lauf):
    out = []
    for line in open(f'{W}/{lauf}.jsonl'):
        line = line.strip()
        if not line: continue
        try: out.append(json.loads(line))
        except Exception: pass
    return out

laeufe = []
for lauf in sys.argv[1:]:
    j = json.load(open(f'{W}/{lauf}-wahl.json'))
    E = ev(lauf)
    w = j['wahl']
    mp = [x['mitPreis'] for x in w]; bz = [x['bezahlbar'] for x in w]; gb = [x['greifbar'] for x in w]
    d = [x['deckung'] for x in w if isinstance(x['deckung'], (int, float))]
    verben = sorted({':'.join(e['zug'].split(':')[:2]) for e in j['erreichbar'] if not RAHMEN.match(e['zug'])})
    texte = {re.sub(r'\d[\d.,]*', '#', t['t']) for t in j['knopfTexte']}
    mich = [e for e in E if e['was'] == 'michaeli']
    michD = [e for e in E if e['was'] == 'michaeli-danach']
    fehlt = [e for e in E if e['was'] == 'michaeli-fehlt']
    gesucht = [e for e in E if e['was'] == 'michaeli-gesucht']
    kl = Counter(e['zug'] for e in E if e['was'] == 'klick')
    gz = j['gegner']
    laeufe.append(dict(lauf=lauf, ep=j['epoche'], min=j['minuten'], wochen=len(w),
        jahre=f"{w[0]['jahr']}–{w[-1]['jahr']}" if w else '—',
        klicks=j['klicks'], verfehlt=j['danebengegriffen'],
        gbMed=statistics.median(gb), gbMax=max(gb),
        mpMed=statistics.median(mp), mpMax=max(mp),
        bzMed=statistics.median(bz), bzMax=max(bz),
        w0bez=sum(1 for x in bz if x == 0), w2bez=sum(1 for x in bz if x >= 2),
        verben=verben, texte=texte,
        michN=len(mich), michAngebote=[len(m['nimm']) for m in mich], michFest=[len(m['fest']) for m in mich],
        michMax=max([len(m['nimm']) + len(m['fest']) for m in mich], default=0),
        michFehlt=len(fehlt), michGefunden=sum(1 for g in gesucht if g['gefunden']),
        michD=michD,
        klFest=sum(v for k, v in kl.items() if k.startswith('preis:festlege:')),
        klNimm=sum(v for k, v in kl.items() if k.startswith('preis:nimm:')),
        klGegner=sum(v for k, v in kl.items() if k.startswith('gegner:')),
        top=kl.most_common(5), klGesamt=sum(kl.values()),
        gGesamt=(gz[-1]['zuege'] - gz[0]['zuege']) if gz else 0,
        gWochen=sum(1 for x in gz if x['neu']),
        dMin=min(d) if d else None, dMed=statistics.median(d) if d else None,
        dMax=max(d) if d else None, dUnter1=sum(1 for x in d if x < 1), dN=len(d),
        kasse0=w[0]['kasse'] if w else None, kasseE=j['schluss']['kasse'],
        lage=j['schluss']['lage'], fehler=len(j['fehler']), abbruch=j['abbruch']))

print('=' * 96)
print(f"{'':26}" + ''.join(f"E{a['ep']:<11}" for a in laeufe))
def z(name, key, f=str):
    print(f"{name:26}" + ''.join(f"{f(a[key]):<12}" for a in laeufe))
z('Minuten', 'min'); z('Wochen', 'wochen'); z('Jahre', 'jahre')
z('echte Klicks', 'klicks'); z('Klicks ins Leere', 'verfehlt')
z('greifbar Median', 'gbMed'); z('greifbar Max', 'gbMax')
z('mit Preisschild Median', 'mpMed'); z('mit Preisschild Max', 'mpMax')
z('davon bezahlbar Median', 'bzMed'); z('davon bezahlbar Max', 'bzMax')
z('Wochen 0 bezahlbar', 'w0bez'); z('Wochen >=2 bezahlbar', 'w2bez')
z('Michaelitafeln gesehen', 'michN'); z('Angebote je Tafel', 'michAngebote')
z('Festlegungen je Tafel', 'michFest'); z('max. nebeneinander', 'michMax')
z('Tafel kam nicht von selbst', 'michFehlt'); z('davon per Suche gefunden', 'michGefunden')
z('Klicks Festlegung', 'klFest'); z('Klicks Nahme', 'klNimm'); z('Klicks gegen Gegner', 'klGegner')
z('Gegnerzuege gesamt', 'gGesamt'); z('Wochen mit Gegnerzug', 'gWochen')
z('Deckung Median', 'dMed', lambda v: f'{v:.2f}' if v is not None else '—')
z('Deckung Min/Max', 'dMin', lambda v: f'{v:.2f}' if v is not None else '—')
z('Wochen Deckung < 1x', 'dUnter1'); z('von Wochen', 'dN')
z('Kasse Anfang', 'kasse0'); z('Kasse Ende', 'kasseE')
z('Verben erreichbar', 'verben', lambda v: len(v))
z('Knopfaufschriften', 'texte', lambda v: len(v))
z('lage / Seitenfehler', 'lage'); z('Abbruch', 'abbruch', lambda v: 'nein' if not v else v.get('grund', '?')[:11])
print('\nHAEUFIGSTE KLICKS')
for a in laeufe:
    print(f"  E{a['ep']}: " + ' · '.join(f'{k} {v}×' for k, v in a['top']))

print('\n' + '=' * 96)
print('VERBLISTE — Schnittmengen')
for i in range(len(laeufe)):
    for k in range(i + 1, len(laeufe)):
        A, B = set(laeufe[i]['verben']), set(laeufe[k]['verben'])
        g = A & B
        print(f"  E{laeufe[i]['ep']}↔E{laeufe[k]['ep']}: gemeinsam {len(g):3d} | nur A {len(A-B):3d} | nur B {len(B-A):3d} | Jaccard {len(g)/len(A|B):.2f}")
alle = set.intersection(*[set(a['verben']) for a in laeufe])
print(f"  in ALLEN {len(laeufe)}: {len(alle)}")
print('   ' + ' · '.join(sorted(alle)))
for a in laeufe:
    nur = set(a['verben']) - set.union(*[set(b['verben']) for b in laeufe if b is not a])
    print(f"  NUR E{a['ep']} ({len(nur)}): " + (' · '.join(sorted(nur)) if nur else '—'))

print('\nKNOPFAUFSCHRIFTEN (Zahlen getilgt) — Schnittmengen')
for i in range(len(laeufe)):
    for k in range(i + 1, len(laeufe)):
        A, B = laeufe[i]['texte'], laeufe[k]['texte']
        g = A & B
        print(f"  E{laeufe[i]['ep']}↔E{laeufe[k]['ep']}: gemeinsam {len(g):4d} | nur A {len(A-B):4d} | nur B {len(B-A):4d} | Jaccard {len(g)/len(A|B):.2f}")
allet = set.intersection(*[a['texte'] for a in laeufe])
print(f"  in ALLEN {len(laeufe)}: {len(allet)}")
print('   ' + ' | '.join(sorted(allet)[:30]))

print('\n' + '=' * 96)
print('AUSSCHLUSS AM BILDSCHIRM (Michaelitafel: was war nach dem Zugriff noch offen?)')
for a in laeufe:
    for m in a['michD'][:4]:
        print(f"  E{a['ep']} genommen {m['genommen']}")
        print(f"     danach offen: nimm {len(m['nimm'])}, fest {len(m['fest'])} | abgeschaltet: nimm {len(m['nimmAus'])}, fest {len(m['festAus'])}")
