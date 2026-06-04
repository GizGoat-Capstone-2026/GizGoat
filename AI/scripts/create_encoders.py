import csv
from pathlib import Path
from sklearn.preprocessing import LabelEncoder
import joblib

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data' / 'dataset_lifestyle.csv'
ART = ROOT / 'artifacts'

print('Reading', DATA)

g=set(); b=set(); s=set()
with DATA.open('r', encoding='utf-8') as f:
    reader=csv.DictReader(f)
    for row in reader:
        g.add(row['Gender'])
        b.add(row['BMI Category'])
        s.add(row['Sleep Disorder'])

enc_g = LabelEncoder(); enc_b = LabelEncoder(); enc_s = LabelEncoder()
enc_g.fit(sorted(list(g)))
enc_b.fit(sorted(list(b)))
enc_s.fit(sorted(list(s)))

ART.mkdir(parents=True, exist_ok=True)
joblib.dump(enc_g, ART / 'gender_encoder.pkl')
joblib.dump(enc_b, ART / 'bmi_encoder.pkl')
joblib.dump(enc_s, ART / 'sleepdisorder_encoder.pkl')

print('Saved encoders to', ART)
