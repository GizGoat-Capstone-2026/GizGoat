# GizGoat Project

GizGoat adalah platform monorepo terintegrasi yang menggabungkan sistem Artificial Intelligence, Fullstack Engineering, dan Data Science dalam satu ekosistem. Proyek ini dirancang untuk mendukung pengembangan sistem end-to-end mulai dari eksplorasi data, pelatihan model, hingga deployment aplikasi.

---

## 🧭 Gambaran sistem

Repositori ini terdiri dari tiga domain utama yang saling terintegrasi:

- `AI/` — layanan kecerdasan buatan (model training, inference API, dan pipeline ML)
- `FS/` — aplikasi fullstack (frontend, backend, dan sistem deployment)
- `DS/` — data science layer (analisis data, eksperimen, dan feature engineering)

Ketiga domain berjalan secara independen namun tetap terhubung melalui kontrak API dan alur data yang terstandarisasi.

---

## 🏗️ Arsitektur sistem

GizGoat menggunakan pendekatan monorepo berbasis service-oriented architecture, di mana setiap workspace memiliki tanggung jawab yang jelas namun tetap saling terintegrasi.

### Alur sistem utama

- `DS/` → menghasilkan dataset bersih, insight, dan feature engineering
- `AI/` → melatih model dan menyediakan inference service melalui API
- `FS/` → mengonsumsi API AI untuk ditampilkan dalam aplikasi pengguna

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
  deployment/
  README.md

DS/
  notebooks/
  pipelines/
  datasets/
  feature_engineering/
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

## 👥 Pembagian tanggung jawab

- **AI System** → model training, inference API, optimasi performa, MLOps
- **Fullstack System** → UI/UX, backend services, authentication, deployment
- **Data Science System** → data pipeline, eksperimen, feature engineering, analisis

---

## 🚀 Status proyek

- AI System → in development
- Fullstack System → in development
- Data Pipeline → in development
