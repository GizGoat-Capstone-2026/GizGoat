# GizGOAT AI Service

AI Service untuk proyek **GizGOAT** yang menyediakan layanan prediksi kualitas tidur, perhitungan BMI, estimasi kebutuhan kalori, layanan nutrisi makanan, dan recommendation engine melalui REST API menggunakan FastAPI.

---

## Overview

Service ini dikembangkan sebagai komponen Artificial Intelligence pada proyek GizGOAT untuk mendukung fitur:

* Sleep Analysis
* BMI Calculator
* Calorie Estimation
* Food Nutrition Service
* Recommendation Engine

Seluruh model dan logika AI diekspos melalui endpoint API sehingga dapat diintegrasikan dengan Backend dan Frontend secara terpisah.

---

## AI Features

### 1. Sleep Analysis

Model Deep Learning untuk memprediksi kualitas tidur berdasarkan indikator kesehatan dan gaya hidup pengguna.

#### Input Features

* Occupation
* Sleep Duration
* Stress Level
* Daily Steps
* Heart Rate
* Systolic Blood Pressure
* Diastolic Blood Pressure

#### Output

* Sleep Quality Score
* Sleep Category
* Sleep Recommendation

---

### 2. BMI Calculator

Menghitung Body Mass Index (BMI) berdasarkan tinggi dan berat badan pengguna.

#### Input

* Height (cm)
* Weight (kg)

#### Output

* BMI Score
* BMI Category

---

### 3. Calorie Estimation

Mengestimasi kebutuhan kalori harian berdasarkan:

* Age
* Gender
* Height
* Weight
* Activity Level

#### Metode

* BMR Calculation (Mifflin-St Jeor Equation)
* Activity Multiplier

#### Output

* Basal Metabolic Rate (BMR)
* Daily Calorie Requirement

---

### 4. Food Nutrition Service

Menyediakan informasi nutrisi makanan berdasarkan dataset nutrisi yang digunakan pada proyek GizGOAT.

#### Features

* Food Search
* Food Nutrition Detail
* Food Nutrition Tracking
* Daily Nutrition Aggregation

#### Output

* Calories
* Fat
* Carbohydrates
* Protein

---

### 5. Recommendation Engine

Menghasilkan rekomendasi kesehatan sederhana berdasarkan kombinasi:

* BMI
* Konsumsi Kalori Harian
* Kebutuhan Kalori Harian
* Kualitas Tidur

---

## Model Information

### Sleep Quality Prediction Model

| Item              | Description                              |
| ----------------- | ---------------------------------------- |
| Model Name        | GizGOAT Sleep Quality Prediction Model   |
| Framework         | TensorFlow                               |
| Architecture      | Functional API                           |
| Training Method   | Custom GradientTape                      |
| Loss Function     | Huber Loss                               |
| Custom Components | FeatureNoiseLayer, DenseWithQuantization |

---

## Evaluation Results

| Metric              | Score  |
| ------------------- | ------ |
| MAE                 | 0.2180 |
| R² Score            | 0.8462 |
| Regression Accuracy | 96.07% |

---

## Model Artifacts

Model dan artefak yang digunakan dalam proses inferensi:

```text
models/
└── gizgoat_sleep_quality_model.keras

artifacts/
├── feature_scaler.pkl
├── target_scaler.pkl
├── occupation_encoder.pkl
├── occupation_mapping.pkl
└── feature_columns.pkl

metadata/
└── model_metadata.json
```

---

## Project Structure

```text
AI/
│
├── api/
│   ├── __init__.py
│   ├── main.py
│   ├── schemas.py
│   ├── custom_layers.py
│   ├── bmi_service.py
│   ├── calorie_service.py
│   ├── nutrition_service.py
│   └── recommendation_service.py
│
├── artifacts/
│   ├── feature_columns.pkl
│   ├── feature_scaler.pkl
│   ├── occupation_encoder.pkl
│   ├── occupation_mapping.pkl
│   └── target_scaler.pkl
│
├── data/
│   ├── dataset_lifestyle.csv
│   └── dataset_nutrisi.csv
│
├── metadata/
│   └── model_metadata.json
│
├── models/
│   ├── best_sleep_model.keras
│   └── gizgoat_sleep_quality_model.keras
│
├── notebooks/
│   └── GizGoat_Healthy_Living_AI.ipynb
│
├── README.md
└── requirements.txt
```

---

## Folder Description

| Folder/File                  | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `api/`                       | Source code FastAPI service dan inference logic               |
| `artifacts/`                 | Encoder, scaler, feature mapping, dan preprocessing artifacts |
| `data/dataset_lifestyle.csv` | Dataset utama untuk pelatihan model kualitas tidur            |
| `data/dataset_nutrisi.csv`   | Dataset nutrisi makanan untuk fitur food search dan tracker   |
| `metadata/`                  | Metadata model dan hasil evaluasi                             |
| `models/`                    | Model TensorFlow yang telah dilatih                           |
| `notebooks/`                 | Notebook eksperimen, training, dan evaluasi model             |
| `requirements.txt`           | Daftar dependency project                                     |
| `README.md`                  | Dokumentasi AI Service                                        |

---

## Installation

Install seluruh dependency:

```bash
pip install -r requirements.txt
```

---

## Running Service

Menjalankan FastAPI secara lokal:

```bash
uvicorn api.main:app --reload
```

Service akan berjalan pada:

```text
http://127.0.0.1:8000
```

---

## API Documentation

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

## Available Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/`                 | Service Information      |
| GET    | `/health`           | Service Health Check     |
| GET    | `/model-info`       | Model Metadata           |
| POST   | `/predict/sleep`    | Sleep Quality Prediction |
| POST   | `/predict/bmi`      | BMI Calculation          |
| POST   | `/predict/calories` | Daily Calorie Estimation |
| POST   | `/recommendation`   | Lifestyle Recommendation |
| GET    | `/foods/search`     | Food Search              |
| POST   | `/foods/nutrition`  | Food Nutrition Detail    |
| POST   | `/foods/tracker`    | Daily Nutrition Tracker  |

---

## Example Endpoint

### Sleep Prediction

#### Request

```http
POST /predict/sleep
```

```json
{
  "Occupation": "Student",
  "Sleep_Duration": 7.5,
  "Stress_Level": 3,
  "Daily_Steps": 5000,
  "Heart_Rate": 72,
  "Systolic_BP": 120,
  "Diastolic_BP": 80
}
```

#### Response

```json
{
  "sleep_score": 8.12,
  "sleep_category": "Excellent",
  "recommendation": "Sleep quality is excellent. Maintain your current sleep routine."
}
```

---

### BMI Calculation

#### Request

```json
{
  "weight": 70,
  "height": 170
}
```

#### Response

```json
{
  "bmi": 24.22,
  "category": "Normal"
}
```

---

### Calorie Estimation

#### Request

```json
{
  "gender": "male",
  "age": 22,
  "weight": 70,
  "height": 170,
  "activity_level": "moderate"
}
```

#### Response

```json
{
  "bmr": 1642.5,
  "daily_calories": 2545.88
}
```

---

### Food Search

#### Request

```http
GET /foods/search?query=nasi
```

#### Response

```json
{
  "count": 2,
  "foods": [
    {
      "nama": "Nasi Putih",
      "kalori": 175,
      "lemak": 0.3,
      "karbohidrat": 40.6,
      "protein": 3.2
    }
  ]
}
```

---

### Food Tracker

#### Request

```json
{
  "foods": [
    "Nasi Putih",
    "Telur Rebus"
  ]
}
```

#### Response

```json
{
  "foods": [
    "Nasi Putih",
    "Telur Rebus"
  ],
  "total_calories": 253,
  "total_fat": 5.6,
  "total_carbohydrates": 41.2,
  "total_protein": 9.8
}
```

---

## Backend Integration Notes

Backend cukup melakukan HTTP Request ke endpoint yang tersedia.

### Integration Flow

```text
Frontend
    │
    ▼
Node.js Backend
    │
    ▼
FastAPI AI Service
    │
    ▼
Prediction Result
    │
    ▼
Frontend Display
```

AI Service tidak menyimpan data pengguna dan hanya bertugas melakukan inferensi model serta menghasilkan rekomendasi berdasarkan input yang diterima.

---

## Future Development

Pengembangan berikutnya yang dapat ditambahkan:

* Personalized Nutrition Recommendation
* Food Recognition using Computer Vision
* Meal Planning Recommendation
* User Health History Prediction
* TensorFlow.js Client-side Inference

---

## Contributors

### GizGOAT Capstone Team

**AI Engineer Team**

* Sleep Quality Prediction Model Development
* Health Analytics Service Development
* Food Nutrition Service Development
* FastAPI Deployment & Integration

---

### Project Theme

**Healthy Lives & Well-Being**
