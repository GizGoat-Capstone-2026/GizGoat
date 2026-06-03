# 📊 Raw Datasets Documentation

Bagian ini merangkum cakupan informasi dan struktur variabel asli dari dataset mentah sebelum melalui tahap transformasi data.

---

### 🛌 1. `Sleep_and_healthy_lifestyle.csv`
**Tipe Data:** Kombinasi Numerik & Kategorikal 

Dataset ini menyediakan informasi komprehensif mengenai profil kesehatan dan kebiasaan harian dari berbagai individu.

* **Metrik Demografi & Profesi:** Mencakup variabel esensial seperti usia, jenis kelamin, dan jenis profesi (`Occupation`).
* **Parameter Fisik & Medis:** Mencatat metrik objektif berupa tekanan darah, detak jantung, jumlah langkah harian (`Daily Steps`), serta kategori BMI.
* **Indikator Gaya Hidup & Tidur:** Mengukur tingkat aktivitas fisik, durasi tidur, tingkat stres, kualitas tidur, hingga status gangguan tidur (`Sleep Disorder`).

> **Fungsi Analisis:** Karakteristik datanya yang variatif menjadikannya instrumen yang sangat kaya untuk mengidentifikasi korelasi antara tekanan psikologis atau beban kerja profesi terhadap higienitas tidur dan risiko gangguan kesehatan seseorang.

---

### 🥗 2. `hasil_gizi.csv`
**Tipe Data:** Teks & Nilai Bersatuan (String Formatted)

Dataset ini berfokus pada kandungan nutrisi dan profil makronutrisi dari berbagai jenis makanan komersial maupun rumahan.

* **Identifikasi Menu:** Mencatat secara spesifik nama menu utama atau bahan makanan pendamping.
* **Energi & Kalori:** Memuat total kandungan energi makanan dalam satuan kalori.
* **Zat Gizi Makro:** Menyediakan rincian komposisi zat gizi esensial yang meliputi lemak, karbohidrat, dan protein.

> **Fungsi Analisis:** Struktur data awal yang masih memuat nilai nutrisi dalam format teks bersatuan (seperti gram) ini berfungsi sebagai fondasi utama untuk latihan pembersihan data (*data cleaning*) dan transformasi numerik guna mengevaluasi kualitas gizi serta menyusun rekomendasi makanan seimbang.

---
<p align="center">⚠️ <i>Catatan: Kedua dataset di atas memerlukan proses preprocessing sebelum dapat dimasukkan ke dalam model komputasi.</i></p>
