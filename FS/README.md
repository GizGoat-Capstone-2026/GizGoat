# GizGOAT - Fullstack Repository (FS)

GizGOAT adalah platform kesehatan berbasis AI yang memberikan rekomendasi personal untuk membantu pengguna mencapai kondisi tubuh yang diinginkan. Sistem ini memproses berbagai data gaya hidup dan indikator metrik tubuh (seperti usia, gender, detak jantung, langkah harian, tingkat stres, dll.) untuk memberikan rekomendasi nutrisi, aktivitas fisik, dan kebiasaan tidur yang optimal.

Folder ini (`FS`) berisi implementasi **Fullstack** (Frontend & Backend) dari aplikasi GizGOAT.

## 🚀 Teknologi yang Digunakan

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **AI Integration:** Berkomunikasi dengan Python FastAPI (dari folder AI) via REST API

---

## 📁 Struktur Folder

```text
FS/
├── frontend/          # Kode sumber untuk UI/UX (React + Vite)
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Halaman utama aplikasi
│   │   ├── services/   # Konfigurasi API Client
│   │   └── ...
├── backend/           # API Server (Node.js + Express)
│   ├── prisma/        # Skema Database & Migrations
│   ├── src/
│   │   ├── controllers/# Logika bisnis untuk setiap rute
│   │   ├── routes/     # Definisi endpoint API
│   │   ├── schemas/    # Validasi input data (Zod/Joi)
│   │   ├── utils/      # Helper functions (Kalkulator BMI, dll)
│   │   └── server.js   # Entry point server
└── README.md          # Dokumentasi ini
```

---

## 🛠️ Persyaratan Sistem

Sebelum menjalankan aplikasi secara lokal, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- [npm](https://www.npmjs.com/) atau yarn
- Database PostgreSQL (Disediakan via [Supabase](https://supabase.com/))

---

## ⚙️ Panduan Instalasi & Menjalankan Lokal

### 1. Setup Backend
Masuk ke direktori backend dan instal dependensi:
```bash
cd backend
npm install
```

Buat file `.env` berdasarkan `.env.example` dan isi nilai yang diperlukan:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@aws-0-region.pooler.supabase.com:6543/postgres"
AI_SERVICE_URL="http://localhost:8000"
JWT_SECRET="rahasia_super_aman"
```

Jalankan konfigurasi database dan jalankan server backend:
```bash
npx prisma generate
npm run dev
```
Backend akan berjalan di `http://localhost:3000`.

### 2. Setup Frontend
Buka terminal baru, masuk ke direktori frontend dan instal dependensi:
```bash
cd frontend
npm install
```

Buat file `.env` di dalam folder frontend (opsional jika menggunakan default):
```env
VITE_API_URL="http://localhost:3000/api"
```

Jalankan server *development* frontend:
```bash
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`.

---

## 📡 Integrasi AI & Data Science
Aplikasi Fullstack ini dirancang untuk berkomunikasi dengan model AI/Machine Learning yang dibuat oleh tim Data Science (DS) & AI. Backend meneruskan data pengguna ke service AI (endpoint Python/FastAPI) untuk mendapatkan rekomendasi hasil prediksi yang kemudian disajikan dengan indah di Frontend.
