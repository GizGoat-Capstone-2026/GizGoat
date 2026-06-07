# GizGoat Project

GizGoat adalah platform berbasis AI yang memberikan rekomendasi kesehatan personal untuk membantu pengguna mencapai kondisi tubuh yang diinginkan. Sistem ini memanfaatkan data seperti usia, gender, durasi dan kualitas tidur, aktivitas fisik, BMI, detak jantung, langkah harian, tingkat stres, gangguan tidur, pekerjaan, serta tekanan darah sistolik dan diastolik untuk menghasilkan insight dan rekomendasi yang lebih akurat dan terarah.

---

## 🧭 Gambaran sistem

Repositori ini terdiri dari tiga domain utama yang saling terintegrasi:

- `AI/` — layanan kecerdasan buatan (model training, inference API, dan pipeline ML)
- `FS/` — aplikasi fullstack (frontend, backend, dan sistem deployment)
- `DS/` — data science layer (analisis data, eksperimen, dan feature engineering)

Ketiga domain berjalan secara independen namun tetap terhubung melalui kontrak API dan alur data yang terstandarisasi.

---

## 🏗️ Arsitektur sistem

GizGoat menggunakan pendekatan **Service-Oriented Architecture** dengan model monorepo yang mengintegrasikan tiga domain utama secara independen namun terhubung.

### Diagram Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│                 🌐 Frontend - React + Vite                      │
│            (Pages, Components, Services, State Mgmt)            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌───────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                            │
│              🖥️ Backend - Node.js + Express                       │
│      (Controllers, Routes, Middleware, Auth, Validation)          │
│                  Database: PostgreSQL                             │
└────────────────┬──────────────────────────┬───────────────────────┘
                 │ REST API Calls           │
    ┌────────────▼───────────────┐          │
    │   🤖 AI SERVICES LAYER    │          │
    │  (FastAPI + TensorFlow)    │          │
    ├────────────────────────────┤          │
    │ • Sleep Quality Service    │          │
    │ • BMI Calculator Service   │          │
    │ • Calorie Estimation       │          ▼
    │ • Nutrition Analysis       │    ┌──────────────────┐
    │ • Recommendation Engine    │    │ DATA STORAGE     │
    └─────────────┬──────────────┘    │ (Prisma ORM)     │
                  │                   │ - Users          │
                  │                   │ - Activities     │
    ┌─────────────▼────────────┐      │ - Recommendations│
    │  🧠 ML MODELS & DATA     │      │ - Health Records │
    │  (Keras/TensorFlow)      │      └──────────────────┘
    ├──────────────────────────┤
    │ Models:                  │
    │ • Sleep Quality Model    │
    │ • Lifestyle Model        │
    │                          │
    │ Datasets:                │
    │ • Lifestyle Data         │
    │ • Nutrition Data         │
    └──────────────────────────┘
                  ▲
    ┌─────────────┴────────────┐
    │  📊 DATA SCIENCE LAYER   │
    ├──────────────────────────┤
    │ • Streamlit Dashboard    │
    │ • Data Notebooks         │
    │ • Data Processors        │
    │ • Feature Engineering    │
    └──────────────────────────┘
```

### Alur Data Sistem

1. **User Interaction** → Frontend mengirimkan data user ke Backend
2. **Data Processing** → Backend menerima, validasi, dan proses data
3. **AI Inference** → Backend memanggil AI Services untuk prediksi
4. **Model Prediction** → AI Services menggunakan ML Models untuk hasil
5. **Data Persistence** → Backend menyimpan hasil ke Database
6. **Response to User** → Frontend menampilkan rekomendasi kepada user
7. **Analytics** → Data Science team monitor metrics via Dashboard

### Tanggung Jawab Setiap Domain

| Domain | Peran | Output |
|--------|-------|--------|
| **DS/** | Data Collection, Cleaning, Exploration | Clean datasets, Feature engineering, Insights |
| **AI/** | Model Training, Inference Services | REST API endpoints, Trained models |
| **FS/** | User-facing Application | Web UI, REST API Gateway, Authentication |

---

## 📦 Struktur proyek

```text
AI/
  api/
  artifacts/
  data/
  metadata/
  models/
  notebooks/
  requirements.txt
  README.md

FS/
  frontend/
  backend/
  README.md

DS/
  dashboard/
  datasets/
  notebook/
  sources/
  README.md

.gitignore
README.md
```

---

## ⚙️ Cara menjalankan sistem

### 1. Data Science pipeline

```bash
cd DS
# jalankan preprocessing / eksperimen pipeline
```

---

### 2. AI service

```bash
cd AI
pip install -r requirements.txt
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

AI service akan tersedia di:

http://localhost:8000

---

### 3. Fullstack application

```bash
cd FS
# install dependencies frontend & backend
# jalankan aplikasi
```

Aplikasi dapat diakses melalui environment deployment yang telah dikonfigurasi.

---

## 🔗 Integrasi sistem

- FS berkomunikasi dengan AI melalui REST API
- AI menggunakan output dari DS sebagai input training pipeline
- DS menghasilkan dataset yang telah divalidasi untuk AI
- Semua komunikasi mengikuti schema data yang terstandarisasi

---

## 🚀 Status proyek

- AI System → Completed
- Fullstack System → Completed
- Data Pipeline → Completed