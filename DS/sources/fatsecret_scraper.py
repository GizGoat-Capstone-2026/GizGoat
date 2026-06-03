"""
Scraping Nutrisi Makanan - FatSecret 
"""

import requests
from bs4 import BeautifulSoup
import re
import time
import pandas as pd


# --- Konfigurasi ---
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}
BASE_URL = "https://www.fatsecret.co.id"
DELAY_ANTAR_REQUEST = 1.5  # detik, agar tidak membebani server


def cari_makanan(nama_makanan: str) -> list[dict]:
    """
    Mencari makanan di FatSecret dan mengembalikan daftar hasil pencarian
    beserta URL halaman detailnya.
    """
    url = f"{BASE_URL}/kalori-gizi/search"
    params = {"q": nama_makanan}

    print(f"[INFO] Mencari: '{nama_makanan}' ...")
    resp = requests.get(url, headers=HEADERS, params=params, timeout=15)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    hasil = []

    tabel = soup.find("table", {"class": "generic"})
    if not tabel:
        print("[WARN] Tidak ditemukan hasil pencarian.")
        return hasil

    for baris in tabel.find_all("tr"):
        link = baris.find("a", href=True)
        if link and "/kalori-gizi/" in link["href"]:
            nama = link.get_text(strip=True)
            href = link["href"]
            full_url = href if href.startswith("http") else BASE_URL + href
            hasil.append({"nama": nama, "url": full_url})

    print(f"[INFO] Ditemukan {len(hasil)} hasil pencarian.")
    return hasil


def ekstrak_nilai(teks: str, label: str) -> str | None:
    """
    Mengambil nilai gizi dari teks sel yang formatnya 'Label\\nNilai'.
    Contoh: 'Kal\\n129' -> '129'
    """
    # Pola: label (Kal/Lemak/Karb/Prot) diikuti whitespace lalu angka+satuan
    pola = rf"{label}\s+([\d,\.]+\w*)"
    cocok = re.search(pola, teks, re.IGNORECASE)
    return cocok.group(1) if cocok else None


def ambil_ringkasan_gizi(url: str) -> dict | None:
    """
    Mengambil data ringkasan gizi dari halaman detail makanan.
    Struktur halaman: setiap sel tabel berisi 'Label\\nNilai' dalam satu <td>.
    """
    print(f"[INFO] Mengambil data dari: {url}")
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")

    # --- Nama makanan ---
    judul_tag = soup.find("h1") or soup.find("title")
    nama = judul_tag.get_text(strip=True) if judul_tag else "Tidak diketahui"

    ringkasan = {
        "nama": nama,
        "url": url,
        "kalori": None,
        "lemak": None,
        "karbohidrat": None,
        "protein": None,
        "keterangan": None,
        "rincian_kalori": None,
    }

    # --- Cari tabel Ringkasan Gizi ---
    # Struktur asli: satu baris tabel dengan sel-sel berisi "Kal\n129", "Lemak\n0,28g", dst.
    for tabel in soup.find_all("table"):
        teks_tabel = tabel.get_text()
        if "Kal" in teks_tabel and "Lemak" in teks_tabel and "Karb" in teks_tabel and "Prot" in teks_tabel:
            for td in tabel.find_all("td"):
                teks = td.get_text(separator="\n", strip=True)

                if ringkasan["kalori"] is None:
                    val = ekstrak_nilai(teks, "Kal")
                    if val:
                        ringkasan["kalori"] = val

                if ringkasan["lemak"] is None:
                    val = ekstrak_nilai(teks, "Lemak")
                    if val:
                        ringkasan["lemak"] = val

                if ringkasan["karbohidrat"] is None:
                    val = ekstrak_nilai(teks, "Karb")
                    if val:
                        ringkasan["karbohidrat"] = val

                if ringkasan["protein"] is None:
                    val = ekstrak_nilai(teks, "Prot")
                    if val:
                        ringkasan["protein"] = val

            # Kalau minimal kalori sudah dapat, hentikan pencarian tabel
            if ringkasan["kalori"]:
                break

    # --- Kalimat keterangan kalori ---
    teks_semua = soup.get_text(" ", strip=True)
    cocok_ket = re.search(r"Terdapat[\s\S]{1,200}gram\)\.?", teks_semua)
    if cocok_ket:
        ringkasan["keterangan"] = cocok_ket.group(0).strip()

    # --- Rincian kalori ---
    cocok_rincian = re.search(r"Rincian Kalori:[\s\S]{1,100}prot\.?", teks_semua)
    if cocok_rincian:
        ringkasan["rincian_kalori"] = cocok_rincian.group(0).strip()

    return ringkasan


def scrape_makanan(daftar_makanan: list[str], ambil_pertama_saja: bool = True) -> list[dict]:
    """
    Fungsi utama: scrape ringkasan gizi untuk daftar makanan.
    """
    semua_hasil = []

    for nama in daftar_makanan:
        try:
            hasil_cari = cari_makanan(nama)
            if not hasil_cari:
                print(f"[WARN] '{nama}' tidak ditemukan di database.")
                continue

            target = hasil_cari[0] if ambil_pertama_saja else hasil_cari

            time.sleep(DELAY_ANTAR_REQUEST)

            if isinstance(target, dict):
                data = ambil_ringkasan_gizi(target["url"])
                if data:
                    semua_hasil.append(data)
            else:
                for item in target:
                    data = ambil_ringkasan_gizi(item["url"])
                    if data:
                        semua_hasil.append(data)
                    time.sleep(DELAY_ANTAR_REQUEST)

        except requests.RequestException as e:
            print(f"[ERROR] Gagal mengambil data untuk '{nama}': {e}")

        time.sleep(DELAY_ANTAR_REQUEST)

    return semua_hasil


def tampilkan_hasil(hasil: list[dict]):
    """Menampilkan hasil scraping ke terminal dalam format yang rapi."""
    print("\n" + "=" * 60)
    print("          RINGKASAN GIZI MAKANAN")
    print("=" * 60)

    for data in hasil:
        print(f"\n Makanan : {data['nama']}")
        print(f"   URL     : {data['url']}")
        print(f"   Kalori  : {data.get('kalori', '-')}")
        print(f"   Lemak   : {data.get('lemak', '-')}")
        print(f"   Karb    : {data.get('karbohidrat', '-')}")
        print(f"   Protein : {data.get('protein', '-')}")
        if data.get("keterangan"):
            print(f"   Info    : {data['keterangan']}")
        if data.get("rincian_kalori"):
            print(f"   Rincian : {data['rincian_kalori']}")
        print("-" * 60)

if __name__ == "__main__":
    daftar_makanan = [
        "nasi putih",
        "nasi merah",
        "lontong",
        "lontong sayur",
        "ketupat",
        "nasi goreng ayam",
        "nasi goreng seafood",
        "nasi goreng udang",
        "nasi goreng spesial",
        "nasi uduk",
        "nasi kuning",
        "nasi padang rendang",
        "nasi padang ayam bakar",
        "nasi padang",
        "bubur ayam",
        "bubur kacang hijau",
        "bubur ketan hitam",
        "bubur manado",
        "nasi liwet",
        "ayam goreng",
        "ayam bakar",
        "ayam panggang",
        "ayam geprek",
        "opor ayam",
        "gulai ayam",
        "kari ayam",
        "soto ayam",
        "ayam penyet",
        "ayam kecap",
        "sate ayam",
        "sup ayam",
        "bebek goreng",
        "bebek bakar",
        "rendang",
        "sate kambing",
        "bakso daging sapi",
        "semur daging",
        "sate padang",
        "soto betawi",
        "gulai kambing",
        "gulai daging sapi",
        "tongseng",
        "ikan lele goreng",
        "ikan bawal goreng",
        "ikan bawal bakar",
        "ikan mujair goreng",
        "ikan gurame goreng",
        "ikan gurame asam manis",
        "ikan patin goreng",
        "ikan patin bakar",
        "ikan nila goreng",
        "ikan tongkol balado",
        "ikan tongkol goreng",
        "pepes tongkol",
        "cumi goreng",
        "cumi saos padang",
        "sambal cumi",
        "cumi hitam",
        "udang goreng",
        "udang goreng tepung",
        "udang asam manis",
        "udang panggang",
        "ikan asin",
        "ikan teri",
        "kepiting",
        "rawon",
        "tempe goreng",
        "tahu goreng",
        "tempe bacem",
        "tahu bacem",
        "sayur lodeh",
        "sayur asem",
        "sayur bayam",
        "sayur kangkung",
        "sayur tauge",
        "sayur nangka",
        "capcay",
        "tumis buncis",
        "lalapan",
        "urap",
        "kol goreng",
        "bakmie goreng",
        "bakmie kuah",
        "mie kocok",
        "soto mie",
        "mie ayam",
        "kwetiau goreng",
        "bihun goreng",
        "bihun goreng ayam",
        "risoles",
        "lemper",
        "pastel",
        "martabak telur",
        "terang bulan",
        "pisang goreng",
        "bakwan goreng",
        "bakso goreng",
        "tahu bulat",
    ]
    daftar_makanan2 = [
        'indomie',
        'sambal'
    ]

    # Jalankan scraping
    hasil = scrape_makanan(daftar_makanan, ambil_pertama_saja=True)
    hasil2 = scrape_makanan(daftar_makanan2, ambil_pertama_saja=False)
    hasil_akhir = hasil + hasil2

    # Simpan ke DataFrame pandas
    df = pd.DataFrame(hasil_akhir, columns=[
        "nama", "kalori", "lemak", "karbohidrat", "protein"
    ])

    # Tampilkan DataFrame di terminal
    print("\n DataFrame Hasil Scraping:")
    print(df.to_string(index=False))

    # Simpan DataFrame ke file CSV
    df.to_csv("hasil_gizi.csv", index=False, encoding="utf-8-sig")
    print("\n✅ Data berhasil disimpan ke hasil_gizi.csv")  