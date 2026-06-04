# 📋 Data Science Notebooks Documentation

Bagian ini menjelaskan alur kerja, metodologi, dan fokus analisis yang dilakukan di dalam masing-masing Jupyter Notebook pada repositori ini.

---

### 🩺 1. `Dataset_Kesehatan.ipynb`
**Fokus Analisis:** Gaya Hidup, Kualitas Tidur, & Manajemen Stres

Notebook ini menyajikan analisis mendalam mengenai pengaruh gaya hidup terhadap kesehatan fisik melalui proses *data science* yang komprehensif.

* **Alur Preprocessing:** Dimulai dari pembersihan dataset mentah `Sleep_and_healthy_lifestyle.csv`—termasuk penanganan nilai yang hilang (*missing values*), penghapusan duplikasi, dan standardisasi format kategori—hingga menghasilkan dataset bersih `[clean]dataset_lifestyle.csv`.
* **Eksplorasi & Visualisasi:** Melalui *Exploratory Data Analysis* (EDA) yang kaya akan visualisasi interaktif menggunakan `Matplotlib` dan `Seaborn`, notebook ini secara rinci memetakan distribusi aktivitas fisik berdasarkan demografi serta mengukur korelasi kuat antara durasi tidur dengan tingkat stres kerja atau akademis.
* **Core Insight:** Berhasil membedah pola perilaku harian yang paling berkontribusi terhadap penurunan kualitas tidur serta mengidentifikasi faktor risiko utama yang memicu gangguan kesehatan seperti insomnia dan kecemasan.

---

### 🥑 2. `Dataset_Nutrisi.ipynb`
**Fokus Analisis:** Pola Konsumsi Pangan & Pemetaan Status Gizi

Notebook ini berfokus pada evaluasi pola konsumsi pangan dan pemetaan status gizi individu untuk mendeteksi masalah nutrisi di masyarakat.

* **Alur Preprocessing:** Mentransformasikan data mentah `hasil_gizi.csv` menjadi dataset siap pakai `[clean]dataset_nutrisi.csv` melalui serangkaian pembersihan data, penanganan pencilan (*outliers*) pada variabel numerik makronutrisi, serta rekayasa fitur (*encoding*) pada variabel kategorikal.
* **Eksplorasi & Visualisasi:** Dengan memanfaatkan statistik deskriptif dan visualisasi data yang jelas, analisis dalam notebook ini secara tajam membandingkan proporsi status gizi—mulai dari berat badan kurang, normal, hingga obesitas—di berbagai kelompok demografi.
* **Core Insight:** Mengeksplorasi rata-rata asupan kalori, protein, dan lemak harian untuk mengungkap fenomena ketidakseimbangan nutrisi yang terjadi di masyarakat guna merumuskan rekomendasi perbaikan pola makan berbasis data.

---
<p align="center">💡 <i>Gunakan Jupyter Lab atau VS Code untuk pengalaman visualisasi interaktif yang maksimal.</i></p>
