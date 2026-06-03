# GizGoat Project

Repositori ini dirancang sebagai workspace multi-tim untuk GizGoat.
Repositori ini dapat menampung pekerjaan dari tim AI, fullstack, dan data science.

## Ruang lingkup saat ini

Saat ini, repositori berisi proyek AI di `AI/`.
Folder placeholder untuk pekerjaan masa depan telah dibuat untuk `FS/` dan `DS/`.

## Panduan cepat AI

```bash
cd AI
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Layanan AI akan tersedia di `http://127.0.0.1:8000`.

## Struktur proyek

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
  README.md
DS/
  README.md
.gitignore
README.md
```

## Tanggung jawab tim

- `AI/` — tim AI: pelatihan model, artifacts, API inferensi, notebook, dan aset data.
- `FS/` — tim Fullstack: frontend, layanan backend, UI, dan alat deployment (masa depan).
- `DS/` — tim Data Science: eksperimen, analisis, rekayasa fitur, dan dataset (masa depan).

## Catatan

- Jadikan `README.md` root ini sebagai titik masuk utama repositori.
- Gunakan `AI/README.md` untuk detail khusus AI jika diperlukan.
- Tambahkan `FS/` dan `DS/` saat tim-tim tersebut siap berkontribusi.
