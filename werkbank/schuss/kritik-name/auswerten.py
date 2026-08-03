import json, sys, math
p = sys.argv[1]
d = json.load(open(p))
r = [x for x in d['reihe'] if x.get('was') in ('start','w')]
print('Schritte', len(r), 'Jahre', r[0]['jahr'], '-', r[-1]['jahr'])
print()
print('jahr/wo  kasse   nAktiv nKauf nBez minBez minKauf  kopfdeck  gegner        chronik')
for x in r:
    if x['woche'] in (1, 8, 15, 22) or x is r[-1]:
        print(f"{x['jahr']}/{x['woche']:<3} {x['kasse']:>9} {x['nAktiv']:>4} {x['nKauf']:>5} {x['nBez']:>4} {str(x['minBez']):>7} {str(x['minKauf']):>7}  {str(x['kopfDeckung']):>7}  {str(x['gegnerZuege']):<12} {str(x.get('chronik'))[:38]}")
print()
# eigene Deckung: Kasse / billigster bezahlbarer Kauf (sonst billigster Kauf)
def rho_of(vals):
    n=len(vals)
    xs=list(range(n))
    mx=sum(xs)/n; my=sum(vals)/n
    sxy=sum((xs[i]-mx)*(vals[i]-my) for i in range(n))
    sxx=math.sqrt(sum((x-mx)**2 for x in xs)); syy=math.sqrt(sum((v-my)**2 for v in vals))
    return sxy/(sxx*syy) if sxx*syy else 0.0
def rang(v):
    s=sorted(range(len(v)), key=lambda i: v[i]); rr=[0]*len(v)
    for k,i in enumerate(s): rr[i]=k
    return rr
serie=[]
for x in r:
    b = x['minBez'] or x['minKauf']
    if b: serie.append((f"{x['jahr']}/{x['woche']}", x['kasse']/b))
vals=[v for _,v in serie]
print('DECKUNG eigene Zaehlung: n=%d  min=%.2f  max=%.2f  median=%.2f' % (len(vals), min(vals), max(vals), sorted(vals)[len(vals)//2]))
print('Pearson-rho(Zeit, Deckung) = %.3f' % rho_of(vals))
print('Spearman-rho              = %.3f' % rho_of([float(x) for x in rang(vals)]))
# Kopf-Deckung
kv=[float(x['kopfDeckung']) for x in r if x.get('kopfDeckung') not in (None,'')]
if kv:
    print('KOPF-Deckung: n=%d min=%.2f max=%.2f  Pearson-rho=%.3f  Spearman=%.3f' % (len(kv), min(kv), max(kv), rho_of(kv), rho_of([float(x) for x in rang(kv)])))
# Jahre unter 1x (Median je Jahr)
jahre={}
for x in r:
    b = x['minBez'] or x['minKauf']
    if b: jahre.setdefault(x['jahr'],[]).append(x['kasse']/b)
print()
print('Jahr  MedianDeckung  min   max   unter1x?')
u=0
for j in sorted(jahre):
    v=sorted(jahre[j]); m=v[len(v)//2]
    unter = m < 1
    u += 1 if unter else 0
    print(f'{j}   {m:9.2f} {v[0]:7.2f} {v[-1]:7.2f}   {"JA" if unter else "nein"}')
print('Jahre mit Median unter 1x:', u, 'von', len(jahre))
print()
kj={}
for x in r:
    if x.get('kopfDeckung') not in (None,''): kj.setdefault(x['jahr'],[]).append(float(x['kopfDeckung']))
print('Jahr  Median KOPF-Deckung')
for j in sorted(kj):
    v=sorted(kj[j]); print(f'{j}   {v[len(v)//2]:8.2f}  min {v[0]:7.2f} max {v[-1]:7.2f}')
print()
print('Kasse Verlauf (Jahresanfang):', [(x['jahr'],x['kasse']) for x in r if x['woche']==1])
print('Gegnerzuege (Jahresanfang):', [(x['jahr'],x['gegnerZuege']) for x in r if x['woche']==1])
print('Chronik (Jahresanfang):', [(x['jahr'],x.get('chronik')) for x in r if x['woche']==1])
print('Ruf-Band Ende:', r[-1].get('ruf'))
print('nmRuf/bekannt:', [(x['jahr'],x.get('nmRuf'),x.get('nmBekannt'),x.get('aufgeldJahr'),x.get('aufgeldGes')) for x in r if x['woche']==1])
print('unwiderruflich sichtbar (Ende):', r[-1].get('unwSichtbar'))
print()
print('TATEN (erste 60):', d['tat'][:60])
from collections import Counter
print('TATEN-Zaehlung:', Counter([t.split(' ')[0] for t in d['tat']]))
