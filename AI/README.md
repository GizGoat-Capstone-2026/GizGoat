# GizGoat Sleep Quality Prediction

Model Deep Learning untuk memprediksi kualitas tidur berdasarkan gaya hidup dan indikator kesehatan.

## Model Information

- Framework: TensorFlow
- Arsitektur: Functional API
- Pelatihan: Custom GradientTape
- Fungsi Loss: Huber Loss

## Evaluation Results

| Metric | Score |
|----------|----------|
| MAE | 0.2180 |
| R² Score | 0.8462 |
| Regression Accuracy | 96.07% |

## Artifacts

- gizgoat_sleep_quality_model.keras
- feature_scaler.pkl
- target_scaler.pkl
- occupation_encoder.pkl
- occupation_mapping.pkl
- feature_columns.pkl
- model_metadata.json

## API Guide

Instal dependensi terlebih dahulu:

```bash
pip install -r requirements.txt
```

Mulai layanan dari root proyek:

```bash
uvicorn api.main:app --reload
```

API akan tersedia di `http://127.0.0.1:8000`.

## Backend Team Usage

### Health check

```bash
curl http://127.0.0.1:8000/
```

Respons yang diharapkan:

```json
{
  "service": "GizGoat Sleep Quality API",
  "version": "1.0.0",
  "status": "running"
}
```

### Prediction request

Endpoint:

```http
POST /predict
```

Contoh payload:

```json
{
  "Occupation": "Student",
  "Sleep Duration": 7.5,
  "Stress Level": 3,
  "Daily Steps": 5000,
  "Heart Rate": 72,
  "Systolic BP": 120,
  "Diastolic BP": 80
}
```

Contoh panggilan curl:

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Occupation": "Student",
    "Sleep Duration": 7.5,
    "Stress Level": 3,
    "Daily Steps": 5000,
    "Heart Rate": 72,
    "Systolic BP": 120,
    "Diastolic BP": 80
  }'
```

Field respons yang diharapkan:

- `prediction`: skor kualitas tidur yang diprediksi
- `recommendation`: saran teks berdasarkan skor

## Project Structures

```text
GizGoat_Final/
├── notebooks/
├── models/
├── artifacts/
├── metadata/
├── api/
├── requirements.txt
└── README.md
```
