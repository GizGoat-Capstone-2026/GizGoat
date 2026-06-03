## 🌐 Interactive Analytics Dashboard

**Link Aplikasi Web:** [🐐 GizGOAT Enterprise Health Dashboard](https://gizgoat-dashboardfix.streamlit.app/)

Aplikasi web interaktif ini mentransformasikan hasil temuan *data science* menjadi platform visualisasi bisnis (*enterprise-grade*) yang dinamis dan responsif menggunakan **Streamlit Cloud**.

---

### 🎛️ 1. Sistem Filter Pusat Dinamis
Memungkinkan pengguna menyaring profil demografi secara *real-time* untuk memperbarui seluruh visualisasi secara reaktif:
* **Filter Gaya Hidup Karyawan:** Kontrol *multi-select* untuk menyaring responden berdasarkan Jenis Kelamin (`Gender`), Kategori Massa Tubuh (`BMI Category`), Bidang Profesi (`Occupation`), hingga Kondisi Gangguan Tidur (`Sleep Disorder`).
* **Filter Kandungan Nutrisi Menu:** Dilengkapi dengan fitur *text input* untuk pencarian spesifik nama makanan serta komponen *slider* interaktif untuk membatasi rentang total energi kalori (`kcal`).

---

### 🚀 2. Arsitektur Data & Pembersihan Terintegrasi
Dioptimalkan dengan kode tingkat lanjut untuk memastikan performa aplikasi tetap cepat dan bebas dari *crash*:
* **Mekanisme Caching Data:** Menggunakan dekorator `@st.cache_data` untuk memangkas waktu pemuatan data sehingga performa eksekusi *dashboard* menjadi jauh lebih ringan.
* **Feature Engineering Tekanan Darah:** Memecah string klinis format "120/80" secara otomatis menjadi variabel numerik terpisah, yaitu `Tekanan Darah (Sistolik)` dan `Tekanan Darah (Diastolik)`.
* **Pembersihan Data Otomatis:** Mengisi baris kosong pada kolom gangguan tidur dengan label *'No Disorder'* serta melakukan penghapusan rekaman duplikat secara instan.

---

### 📊 3. Sistem Manajemen Panel (Tabs Layout)
Analisis multidimensi yang rapi dan terorganisasi ke dalam 3 tab visualisasi utama:

* **Tab 1: Analisis Pola Istirahat & Stres**
  * **Visualisasi Profesi:** Grafik batang (`Seaborn`) tingkat kualitas istirahat (skala 1-10) responden tiap sektor pekerjaan berdasarkan gender.
  * **Visualisasi Distribusi:** *Scatter plot* korelasi degradasi linear antara tingkat nilai stres dengan durasi nyata jam tidur harian untuk memetakan konsentrasi pasien *Insomnia*.
* **Tab 2: Analisis Kardiovaskular & BMI**
  * **Visualisasi Klinis:** Grafik komparasi nilai tekanan darah sistolik rata-rata berdasarkan klasifikasi BMI untuk mendeteksi ambang batas risiko pra-hipertensi pada kelompok *Overweight* & *Obese*.
* **Tab 3: Analisis Pola Nutrisi Makanan**
  * **Metrik KPI Pendukung:** Menampilkan menu dengan kalori terpadat dan protein tertinggi dari database secara dinamis.
  * **Interactive Binning & Scatter Plot:** Klasterisasi otomatis profil makanan (*Low Calorie*, *High Carbs*, *High Protein*, dan *High Fat*) lengkap dengan tabel ringkasan rata-rata kandungan gizinya.

---
