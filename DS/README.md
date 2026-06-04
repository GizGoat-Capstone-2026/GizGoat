# 📊 GizGoat — Data Science (DS)

Modul Data Science (DS) adalah fondasi analitik dari platform GizGoat. Bagian ini bertanggung jawab atas seluruh proses pengolahan data, mulai dari pengumpulan sumber data mentah, eksplorasi, pembersihan, feature engineering, hingga menghasilkan dataset bersih yang siap digunakan oleh pipeline Machine Learning di modul AI.

---

## 🎯 Tujuan

- Menyediakan dataset berkualitas tinggi sebagai input untuk model AI
- Melakukan eksplorasi dan analisis mendalam terhadap data kesehatan pengguna
- Mengidentifikasi fitur-fitur paling relevan yang mempengaruhi kondisi kesehatan
- Mendukung pengambilan keputusan berbasis data dalam pengembangan model rekomendasi

---

## 🗂️ Struktur Direktori

```
DS/
├── dashboard/       # Visualisasi dan laporan eksplorasi data (EDA)
├── datasets/        # Dataset hasil preprocessing yang sudah bersih dan siap pakai
├── notebook/        # Jupyter Notebook untuk eksperimen, analisis, dan feature engineering
├── sources/         # Data mentah dari sumber eksternal sebelum diproses
└── README.md
```

---

## 🔢 Fitur Data

GizGoat menggunakan berbagai indikator gaya hidup dan kesehatan sebagai fitur utama:

| Fitur | Deskripsi |
|---|---|
| `age` | Usia pengguna |
| `gender` | Jenis kelamin |
| `sleep_duration` | Durasi tidur harian (jam) |
| `sleep_quality` | Kualitas tidur pengguna |
| `physical_activity` | Tingkat aktivitas fisik |
| `bmi` | Body Mass Index |
| `heart_rate` | Detak jantung |
| `daily_steps` | Jumlah langkah per hari |
| `stress_level` | Tingkat stres |
| `sleep_disorder` | Indikasi gangguan tidur |
| `occupation` | Pekerjaan pengguna |
| `blood_pressure_systolic` | Tekanan darah sistolik |
| `blood_pressure_diastolic` | Tekanan darah diastolik |

---

## 🔄 Alur Pipeline DS

```
sources/         →   notebook/         →   datasets/        →   AI/data/
(data mentah)        (EDA + cleaning        (dataset bersih)     (input training
                      + feature eng.)                             model)
```

1. **Data Collection** — data mentah dikumpulkan dari berbagai sumber dan disimpan di `sources/`
2. **Exploratory Data Analysis (EDA)** — analisis distribusi, korelasi, dan outlier dilakukan di `notebook/`
3. **Preprocessing & Feature Engineering** — pembersihan data, encoding, normalisasi, dan seleksi fitur
4. **Output Dataset** — dataset final yang sudah bersih disimpan di `datasets/` untuk dikonsumsi modul AI
5. **Dashboard** — visualisasi insight utama tersedia di `dashboard/`

---

## ⚙️ Cara Menjalankan

### Prasyarat

- Python 3.9+
- Jupyter Notebook / JupyterLab

### Install Dependencies

```bash
cd DS
pip install -r requirements.txt
```

> Jika file `requirements.txt` belum tersedia, install library umum berikut:
> ```bash
> pip install pandas numpy matplotlib seaborn scikit-learn jupyter
> ```

### Menjalankan Notebook

```bash
jupyter notebook notebook/
```

Buka notebook yang relevan sesuai tahap pipeline yang ingin dijalankan.

---

## 🔗 Integrasi dengan Modul Lain

- **→ AI/** : Dataset bersih dari `DS/datasets/` menjadi input training pipeline di modul AI
- **← FS/** : Tidak ada koneksi langsung; DS bersifat upstream terhadap AI

---

## 📌 Status

| Komponen | Status |
|---|---|
| Data Collection | 🔄 In Progress |
| EDA & Visualisasi | 🔄 In Progress |
| Preprocessing Pipeline | 🔄 In Progress |
| Feature Engineering | 🔄 In Progress |
| Dataset Final | 🔄 In Progress |

---

## 👥 Tim Data Science

Bagian ini dikelola oleh tim Data Science GizGoat dalam kerangka Capstone Project 2026.

---

> Untuk gambaran sistem secara keseluruhan, lihat [README utama](../README.md).
