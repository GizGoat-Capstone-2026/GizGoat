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

## 📖 Data Dictionary

GizGoat menggunakan dua dataset utama yang saling melengkapi untuk menghasilkan rekomendasi kesehatan yang personal.

---

### 1. Dataset Sleep Health & Lifestyle

Dataset berisi indikator gaya hidup dan kesehatan pengguna. Digunakan sebagai fitur utama dalam model prediksi dan rekomendasi.

| Kolom | Tipe Data | Deskripsi | Contoh Nilai |
|---|---|---|---|
| `person_id` | `int64` | ID unik untuk setiap individu | 1, 2, 3 |
| `gender` | `object` | Jenis kelamin pengguna | `Male`, `Female` |
| `age` | `int64` | Usia pengguna (tahun) | 27, 35, 52 |
| `occupation` | `object` | Pekerjaan atau profesi pengguna | `Doctor`, `Engineer` |
| `sleep_duration` | `float64` | Durasi tidur harian (jam) | 6.5, 7.0, 8.2 |
| `sleep_quality` | `int64` | Kualitas tidur subjektif (skala 1–10) | 4, 7, 9 |
| `physical_activity` | `int64` | Durasi aktivitas fisik harian (menit/hari) | 30, 60, 90 |
| `stress_level` | `int64` | Tingkat stres subjektif (skala 1–10) | 3, 6, 8 |
| `bmi_category` | `object` | Kategori BMI pengguna | `Normal`, `Overweight`, `Obese` |
| `blood_pressure` | `object` | Tekanan darah (sistolik/diastolik) | `120/80`, `135/90` |
| `heart_rate` | `int64` | Detak jantung saat istirahat (bpm) | 65, 72, 80 |
| `daily_steps` | `int64` | Jumlah langkah kaki per hari | 5000, 8000, 12000 |
| `sleep_disorder` | `object` | Jenis gangguan tidur yang dialami | `None`, `Insomnia`, `Sleep Apnea` |

---

### 2. Dataset Nutrisi Makanan (`_clean_dataset_nutrisi.csv`)

Dataset berisi nilai gizi dari 116 makanan khas Indonesia. Digunakan untuk mendukung fitur rekomendasi makanan berbasis kebutuhan kalori dan nutrisi pengguna.

| Kolom | Tipe Data | Deskripsi | Contoh Nilai |
|---|---|---|---|
| `nama` | `object` | Nama makanan dalam Bahasa Indonesia | `Nasi Putih`, `Ayam Goreng`, `Tempe Goreng` |
| `kalori` | `int64` | Kandungan energi per sajian (kkal) | 129, 297, 200 |
| `lemak` | `float64` | Kandungan lemak per sajian (gram) | 0.28, 16.5, 12.3 |
| `karbohidrat` | `float64` | Kandungan karbohidrat per sajian (gram) | 27.9, 0.0, 8.5 |
| `protein` | `float64` | Kandungan protein per sajian (gram) | 2.66, 25.3, 14.0 |

**Statistik ringkas dataset nutrisi:**

| | `kalori` | `lemak` | `karbohidrat` | `protein` |
|---|---|---|---|---|
| Jumlah data | 116 | 116 | 116 | 116 |
| Rata-rata | 195.4 kkal | 8.6 g | 18.2 g | 11.3 g |
| Minimum | 15 kkal | 0.20 g | 0.00 g | 0.00 g |
| Maksimum | 980 kkal | 55.0 g | 95.0 g | 44.1 g |

> Kategori makanan yang tercakup: nasi & olahan, ayam, daging & kambing, seafood, tahu & tempe, sayuran, mie & bihun, jajanan, Indomie, dan sambal.

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

### Install Requirement

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

## 👥 Tim Data Science

Bagian ini dikelola oleh tim Data Science GizGoat dalam kerangka Capstone Project 2026.

---

> Untuk gambaran sistem secara keseluruhan, lihat [README utama](../README.md).
