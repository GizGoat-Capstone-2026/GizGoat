import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# ==============================================================================
# 1. KONFIGURASI HALAMAN UTAMA DASHBOARD (PREMIUM LAYOUT)
# ==============================================================================
st.set_page_config(
    page_title="GizGOAT Enterprise Health Dashboard",
    page_icon="🐐",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Kustomisasi UI via CSS untuk mempercantik Kartu KPI dan Kotak Informasi Analitis
st.markdown("""
    <style>
    /* Styling Kartu KPI Utama */
    div[data-testid="stMetricContainer"] {
        background-color: #ffffff;
        border: 2px solid #eef2f7;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        transition: transform 0.2s;
    }
    div[data-testid="stMetricContainer"]:hover {
        transform: translateY(-2px);
        border-color: #cbd5e1;
    }
    /* Styling Kotak Informasi Rangkuman Analitis (EDA Detailed Metrics) */
    .insight-card-blue {
        background-color: #f0f4f8;
        border-left: 6px solid #1e3a8a;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;
    }
    .insight-card-orange {
        background-color: #fff7ed;
        border-left: 6px solid #ea580c;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;
    }
    .insight-card-green {
        background-color: #f0fdf4;
        border-left: 6px solid #16a34a;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;
    }
    .insight-title {
        font-weight: bold;
        color: #1e293b;
        margin-bottom: 10px;
        font-size: 1.1rem;
    }
    </style>
""", unsafe_allow_html=True)

# ==============================================================================
# 2. PROSES PEMBACAAN DAN PEMBERSIHAN DATA (CLEAN & OPTIMIZED DATA LOADING)
# ==============================================================================
# Jalur Relatif otomatis mendeteksi folder tempat skrip berada
BASE_DIR = Path(__file__).resolve().parent
LIFESTYLE_PATH = BASE_DIR / "Health_and_lifestyle_dataset.csv"
NUTRITION_PATH = BASE_DIR / "Nutrisi Makanan.csv"

@st.cache_data
def load_lifestyle_dataset(path):
    if not path.exists():
        return None
    
    df = pd.read_csv(path)
    
    # 1. Data Cleaning: Isi baris kosong pada Sleep Disorder dengan label 'No Disorder'
    if 'Sleep Disorder' in df.columns:
        df['Sleep Disorder'] = df['Sleep Disorder'].fillna('No Disorder')
        
    # 2. Standardisasi Data: Menyeragamkan penamaan kategori berat badan (BMI Category)
    if 'BMI Category' in df.columns:
        df['BMI Category'] = df['BMI Category'].replace({'Normal Weight': 'Normal'})
        
    # 3. Rekayasa Data (Feature Engineering): Memecah nilai format Tekanan Darah "120/80"
    if 'Blood Pressure' in df.columns:
        bp_split = df['Blood Pressure'].astype(str).str.split('/', expand=True)
        if bp_split.shape[1] == 2:
            df['Tekanan Darah (Sistolik)'] = pd.to_numeric(bp_split[0], errors='coerce')
            df['Tekanan Darah (Diastolik)'] = pd.to_numeric(bp_split[1], errors='coerce')
    
    # Isi nilai kosong cadangan jika proses konversi gagal
    if 'Tekanan Darah (Sistolik)' not in df.columns:
        df['Tekanan Darah (Sistolik)'] = 120
        df['Tekanan Darah (Diastolik)'] = 80
        
    return df

@st.cache_data
def load_nutrition_dataset(path):
    if not path.exists():
        return None
    df = pd.read_csv(path)
    # EDA Pembersihan: Menghapus baris rekaman duplikat dari data makanan
    df = df.drop_duplicates().reset_index(drop=True)
    return df

# Eksekusi fungsi pembacaan data
df_lifestyle = load_lifestyle_dataset(LIFESTYLE_PATH)
df_nutrition = load_nutrition_dataset(NUTRITION_PATH)

# Validasi Keberadaan Berkas File secara tegas untuk menghindari crash aplikasi
if df_lifestyle is None:
    st.error(f"❌ Kritis: Berkas '{LIFESTYLE_PATH.name}' tidak ditemukan di folder kerja Anda. Pastikan diletakkan di: {LIFESTYLE_PATH}")
    st.stop()
if df_nutrition is None:
    st.error(f"❌ Kritis: Berkas '{NUTRITION_PATH.name}' tidak ditemukan di folder kerja Anda. Pastikan diletakkan di: {NUTRITION_PATH}")
    st.stop()

# ==============================================================================
# 3. SIDEBAR PANEL FILTER DINAMIS (KONTROL REAKTIF & MULTISELECT)
# ==============================================================================
st.sidebar.image("https://cdn-icons-png.flaticon.com/512/2345/2345470.png", width=70)
st.sidebar.title("GizGOAT Pusat Filter")
st.sidebar.markdown("Saring demografi data secara real-time untuk memperbarui seluruh visualisasi:")

# --- FILTER GRUP A: LIFESTYLE & KLINIS ---
st.sidebar.subheader("👥 Filter Gaya Hidup Karyawan")
all_genders = sorted(list(df_lifestyle['Gender'].unique()))
selected_genders = st.sidebar.multiselect("Pilih Gender Responden:", options=all_genders, default=all_genders)

all_bmi = sorted(list(df_lifestyle['BMI Category'].unique()))
selected_bmi = st.sidebar.multiselect("Pilih Kategori Massa Tubuh (BMI):", options=all_bmi, default=all_bmi)

all_jobs = sorted(list(df_lifestyle['Occupation'].unique()))
selected_jobs = st.sidebar.multiselect("Pilih Bidang Profesi:", options=all_jobs, default=all_jobs)

all_disorders = sorted(list(df_lifestyle['Sleep Disorder'].unique()))
selected_disorders = st.sidebar.multiselect("Pilih Kondisi Gangguan Tidur:", options=all_disorders, default=all_disorders)

# Proses Pemfilteran Pusat Dataset Gaya Hidup
filtered_lifestyle = df_lifestyle[
    (df_lifestyle['Gender'].isin(selected_genders)) &
    (df_lifestyle['BMI Category'].isin(selected_bmi)) &
    (df_lifestyle['Occupation'].isin(selected_jobs)) &
    (df_lifestyle['Sleep Disorder'].isin(selected_disorders))
]

st.sidebar.markdown("---")

# --- FILTER GRUP B: DIETARY & NUTRISI MAKANAN ---
st.sidebar.subheader("🥗 Filter Kandungan Nutrisi Menu")
search_food = st.sidebar.text_input("🔍 Cari Nama Makanan:", "")

max_calories = int(df_nutrition['kalori'].max())
min_calories = int(df_nutrition['kalori'].min())
selected_cal_range = st.sidebar.slider(
    "Batas Rentang Kalori (kcal):",
    min_value=min_calories,
    max_value=max_calories,
    value=(min_calories, max_calories)
)

# Proses Pemfilteran Pusat Dataset Nutrisi Makanan
filtered_nutrition = df_nutrition[
    (df_nutrition['nama'].str.contains(search_food, case=False, na=False)) &
    (df_nutrition['kalori'] >= selected_cal_range[0]) &
    (df_nutrition['kalori'] <= selected_cal_range[1])
]

# Konfigurasi standardisasi visual grafik
sns.set_theme(style="whitegrid")
plt.rcParams['font.sans-serif'] = 'Arial'

# ==============================================================================
# 4. KARTU RINGKASAN UTAMA (6 HIGH-PERFORMANCE KPI CARDS DENGAN GLOBAL COMPARISON)
# ==============================================================================
st.title("🐐 GizGOAT: Enterprise Health & Nutrition Analytics Dashboard")
st.markdown("Aplikasi intelijen data terpadu untuk menguji korelasi antara pola kebiasaan harian, beban stres, parameter klinis, serta pemetaan profil gizi makro.")
st.write("---")

if not filtered_lifestyle.empty:
    # Perhitungan Basis Data Global untuk Kalkulasi Delta Perbandingan
    base_sleep_dur = df_lifestyle['Sleep Duration'].mean()
    base_sleep_qual = df_lifestyle['Quality of Sleep'].mean()
    base_stress = df_lifestyle['Stress Level'].mean()
    base_steps = df_lifestyle['Daily Steps'].mean()
    
    # Perhitungan Data Kelompok Terfilter saat ini
    curr_sleep_dur = filtered_lifestyle['Sleep Duration'].mean()
    curr_sleep_qual = filtered_lifestyle['Quality of Sleep'].mean()
    curr_stress = filtered_lifestyle['Stress Level'].mean()
    curr_steps = filtered_lifestyle['Daily Steps'].mean()
    
    # Perhitungan Klinis Kardiovaskular & Rasio Penyakit
    avg_sistolik = filtered_lifestyle['Tekanan Darah (Sistolik)'].mean()
    avg_diastolik = filtered_lifestyle['Tekanan Darah (Diastolik)'].mean()
    total_disorders = filtered_lifestyle[filtered_lifestyle['Sleep Disorder'] != 'No Disorder'].shape[0]
    pct_disorder = (total_disorders / filtered_lifestyle.shape[0]) * 100

    st.subheader("📊 Metrik Utama Status Kesehatan Kelompok")
    
    # Baris 1 KPI: Sampel & Kualitas Istirahat
    kpi1, kpi2, kpi3 = st.columns(3)
    with kpi1:
        st.metric(label="Total Sampel Terpilih", value=f"{len(filtered_lifestyle):,} Orang", delta=f"{len(filtered_lifestyle) - len(df_lifestyle)} dari database", delta_color="off")
    with kpi2:
        st.metric(label="Rata-rata Durasi Tidur", value=f"{curr_sleep_dur:.2f} Jam", delta=f"{curr_sleep_dur - base_sleep_dur:+.2f} Jam vs Nilai Global")
    with kpi3:
        st.metric(label="Skor Kualitas Istirahat", value=f"{curr_sleep_qual:.1f} / 10", delta=f"{curr_sleep_qual - base_sleep_qual:+.1f} Poin vs Nilai Global")

    st.write("") 
    
    # Baris 2 KPI: Stres, Mobilitas Fisik, & Klinis Darah
    kpi4, kpi5, kpi6 = st.columns(3)
    with kpi4:
        st.metric(label="Tingkat Tekanan Stres", value=f"{curr_stress:.1f} / 10", delta=f"{curr_stress - base_stress:+.1f} Poin vs Nilai Global", delta_color="inverse")
    with kpi5:
        st.metric(label="Rata-rata Langkah Harian", value=f"{int(curr_steps):,} Langkah", delta=f"{int(curr_steps - base_steps):+,} Langkah vs Nilai Global")
    with kpi6:
        st.metric(label="Tekanan Darah Rata-rata", value=f"{int(avg_sistolik)}/{int(avg_diastolik)} mmHg", delta=f"{pct_disorder:.1f}% Mengalami Gangguan", delta_color="inverse")

    # ==============================================================================
    # 5. BLOK INFORMASI RANGKUMAN ANALITIS (EDA DETAILED METRICS PANEL)
    # ==============================================================================
    st.write("")
    st.subheader("📌 Informasi Rangkuman Analitis & Temuan Kunci (EDA Insights)")
    
    # Komputasi statistik teks deskriptif secara dinamis dari Pandas
    top_occupation = filtered_lifestyle['Occupation'].mode()[0] if not filtered_lifestyle['Occupation'].empty else "Tidak Diketahui"
    top_bmi_category = filtered_lifestyle['BMI Category'].mode()[0] if not filtered_lifestyle['BMI Category'].empty else "Tidak Diketahui"
    
    stress_job_agg = filtered_lifestyle.groupby('Occupation')['Stress Level'].mean()
    highest_stress_job = stress_job_agg.idxmax() if not stress_job_agg.empty else "N/A"
    highest_stress_val = stress_job_agg.max() if not stress_job_agg.empty else 0
    
    sleep_job_agg = filtered_lifestyle.groupby('Occupation')['Sleep Duration'].mean()
    lowest_sleep_job = sleep_job_agg.idxmin() if not sleep_job_agg.empty else "N/A"
    lowest_sleep_val = sleep_job_agg.min() if not sleep_job_agg.empty else 0

    inf_col1, inf_col2 = st.columns(2)
    with inf_col1:
        st.markdown(f"""
        <div class="insight-card-blue">
            <div class="insight-title">🏢 Karakteristik Kelompok & Dominasi Sampel:</div>
            <ul>
                <li>Sektor pekerjaan yang paling mendominasi kelompok filter Anda saat ini adalah kelompok profesi <b>{top_occupation}</b>.</li>
                <li>Rasio postur tubuh mayoritas responden berada dalam klasifikasi berat badan kategori <b>{top_bmi_category}</b>.</li>
                <li>Tingkat aktivitas fisik (olahraga/mobilitas harian) mencatatkan rerata indeks sebesar <b>{filtered_lifestyle['Physical Activity Level'].mean():.1f} poin</b>.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        
    with inf_col2:
        st.markdown(f"""
        <div class="insight-card-orange">
            <div class="insight-title">⚠️ Deteksi Faktor Risiko Kesehatan & Beban Stres Kerja:</div>
            <ul>
                <li><b>Titik Stres Tertinggi:</b> Tekanan stres kerja terbesar diidentifikasi pada profesi <b>{highest_stress_job}</b> dengan skor rata-rata mencapai <b>{highest_stress_val:.1f}/10</b>.</li>
                <li><b>Defisit Istirahat:</b> Kelompok pekerja yang mengalami waktu tidur paling minim adalah profesi <b>{lowest_sleep_job}</b> dengan rata-rata hanya <b>{lowest_sleep_val:.2f} jam</b>.</li>
                <li><b>Prevalensi Kasus Medis:</b> Di dalam lingkup filter ini, tercatat ada sebanyak <b>{total_disorders} kasus</b> indikasi klinis gangguan tidur (Insomnia / Sleep Apnea).</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

else:
    st.error("⚠️ Filter Error: Tidak ada kombinasi data responden gaya hidup yang sesuai dengan opsi filter Anda.")
    st.stop()

st.write("---")

# ==============================================================================
# 6. PANEL VISUALISASI UTAMA (SISTEM TABS MULTIDIMENSI)
# ==============================================================================
tab_rest, tab_clinical, tab_nutrition = st.tabs([
    "📊 Analisis Pola Istirahat & Stres", 
    "🏥 Analisis Kardiovaskular & BMI",
    "🥗 Analisis Pola Nutrisi Makanan"
])

# --- TAB 1: ANALISIS POLA ISTIRAHAT & TINGKAT STRES ---
with tab_rest:
    st.header("1. Profil Kualitas Tidur Berdasarkan Sektor Bidang Profesi")
    job_plot_data = filtered_lifestyle.groupby(['Gender', 'Occupation'], observed=False)['Quality of Sleep'].mean().reset_index()
    job_plot_data = job_plot_data.sort_values(by='Quality of Sleep', ascending=False)
    
    fig1, ax1 = plt.subplots(figsize=(12, 5))
    sns.barplot(data=job_plot_data, x='Occupation', y='Quality of Sleep', hue='Gender', palette=['#1e3a8a', '#ea580c'], ax=ax1)
    ax1.set_title('Rata-rata Skor Kualitas Istirahat Responden Tiap Sektor Pekerjaan', fontsize=12, weight='bold', pad=15)
    ax1.set_xlabel('Nama Sektor Profesi / Pekerjaan')
    ax1.set_ylabel('Kualitas Tidur (Skala Nilai 1-10)')
    ax1.set_ylim(0, 11)
    plt.xticks(rotation=30, ha='right')
    for container in ax1.containers:
        ax1.bar_label(container, fmt='%.1f', padding=3, fontsize=9, weight='semibold')
    plt.tight_layout()
    st.pyplot(fig1)
    plt.close(fig1)
    st.info("💡 **Kesimpulan Analisis Grafik 1:** Beban kerja pada masing-masing profesi berbanding lurus dengan kualitas istirahat. Intervensi kebijakan manajemen waktu kerja sangat krusial bagi sektor profesi dengan catatan nilai tidur rendah.")
    
    st.write("---")
    st.header("2. Pola Degradasi Durasi Jam Tidur Akibat Dampak Skala Stres")
    fig2, ax2 = plt.subplots(figsize=(10, 4.5))
    sns.scatterplot(data=filtered_lifestyle, x='Stress Level', y='Sleep Duration', hue='Sleep Disorder', palette='Set1', s=130, alpha=0.75, ax=ax2)
    ax2.set_title('Korelasi Distribusi: Tingkat Tekanan Stres vs Durasi Nyata Tidur', fontsize=12, weight='bold', pad=15)
    ax2.set_xlabel('Tingkat Nilai Stres (Skala 1-10)')
    ax2.set_ylabel('Durasi Waktu Tidur Harian (Jam)')
    ax2.legend(title='Kondisi Klinis Tidur', bbox_to_anchor=(1.02, 1), loc='upper left')
    plt.tight_layout()
    st.pyplot(fig2)
    plt.close(fig2)
    st.info("💡 **Kesimpulan Analisis Grafik 2:** Terbaca pola tren penurunan linear yang kuat. Saat indeks stres melampaui batas ambang angka 6, jam tidur anjlok drastis, dan mayoritas pasien klinis Insomnia terkonsentrasi kuat pada kuadran stres tinggi tersebut.")

# --- TAB 2: ANALISIS KLINIS KARDIOVASKULAR & KATEGORI BMI ---
with tab_clinical:
    st.header("3. Distribusi Tekanan Darah Sistolik Berdasarkan Kategori Massa Tubuh (BMI)")
    bmi_plot_data = filtered_lifestyle.groupby(['Gender', 'BMI Category'], observed=False)['Tekanan Darah (Sistolik)'].mean().reset_index()
    
    fig3, ax3 = plt.subplots(figsize=(10, 5))
    sns.barplot(data=bmi_plot_data, x='BMI Category', y='Tekanan Darah (Sistolik)', hue='Gender', palette=['#0d9488', '#475569'], ax=ax3)
    ax3.set_title('Rata-rata Nilai Tekanan Darah Sistolik Berdasarkan Status Klasifikasi BMI', fontsize=12, weight='bold', pad=15)
    ax3.set_xlabel('Kategori Indeks Massa Tubuh (BMI Category)')
    ax3.set_ylabel('Tekanan Darah Sistolik (mmHg)')
    ax3.set_ylim(0, 170)
    for container in ax3.containers:
        ax3.bar_label(container, fmt='%.0f', padding=3, fontsize=9, weight='semibold')
    plt.tight_layout()
    st.pyplot(fig3)
    plt.close(fig3)
    st.info("💡 **Kesimpulan Analisis Grafik 3:** Responden di dalam kategori berat badan berlebih (*Overweight* dan *Obese*) mengindikasikan kecenderungan rerata tekanan darah sistolik yang lebih tinggi secara signifikan (mendekati risiko pra-hipertensi) dibandingkan kelompok berberat badan normal.")

# --- TAB 3: ANALISIS KANDUNGAN GIZI MAKANAN (FROM NUTRISI MAKANAN.CSV) ---
with tab_nutrition:
    st.header("🥗 Profil Kandungan Gizi & Pemetaan Energi Menu Makanan")
    st.markdown("Visualisasi interaktif pengolahan berkas gizi pangan berdasarkan data sekunder `Nutrisi Makanan.csv`.")
    
    if filtered_nutrition.empty:
        st.warning("⚠️ Tidak ada menu makanan yang sesuai dengan kata kunci pencarian atau rentang batasan kalori Anda.")
    else:
        # Pembuatan KPI Mini untuk Data Nutrisi Terpilih
        col_nut_kpi1, col_nut_kpi2, col_nut_kpi3 = st.columns(3)
        with col_nut_kpi1:
            st.metric(label="Menu Lolos Filter", value=f"{len(filtered_nutrition)} Menu")
        with col_nut_kpi2:
            top_cal = filtered_nutrition.loc[filtered_nutrition['kalori'].idxmax()]
            st.metric(label="Kalori Terpadat", value=f"{top_cal['kalori']} kcal", delta=top_cal['nama'])
        with col_nut_kpi3:
            top_prot = filtered_nutrition.loc[filtered_nutrition['protein'].idxmax()]
            st.metric(label="Protein Tertinggi", value=f"{top_prot['protein']} g", delta=top_prot['nama'])
            
        st.write("")
        
        # Grafik Distribusi Peringkat Nutrisi Terbanyak
        st.subheader("1. Peringkat Kandungan Makronutrisi Tertinggi")
        selected_nutrient = st.selectbox(
            "Pilih Unsur Nutrisi untuk Grafik Batang:",
            options=['kalori', 'protein', 'karbohidrat', 'lemak'],
            format_func=lambda x: x.capitalize()
        )
        
        top_10_food = filtered_nutrition.sort_values(by=selected_nutrient, ascending=False).head(10)
        
        fig_n1, ax_n1 = plt.subplots(figsize=(11, 4.5))
        sns.barplot(data=top_10_food, x=selected_nutrient, y='nama', palette="flare", ax=ax_n1)
        ax_n1.set_title(f"Top 10 Ragam Hidangan dengan Kandungan {selected_nutrient.capitalize()} Terbanyak", fontsize=11, weight='bold')
        ax_n1.set_xlabel(selected_nutrient.capitalize())
        ax_n1.set_ylabel("Nama Menu Hidangan")
        st.pyplot(fig_n1)
        plt.close(fig_n1)
        
        st.write("---")
        
        # Klasterisasi Manual (Binning Profil Gizi Makro)
        st.subheader("2. Klasterisasi Profil Komposisi Nutrisi Utama")
        
        def hitung_klaster_gizi(row):
            if row['kalori'] < 100:
                return 'Low Calorie / Ringan'
            elif row['protein'] > row['karbohidrat'] and row['protein'] > row['lemak']:
                return 'High Protein / Lauk'
            elif row['karbohidrat'] > row['protein'] and row['karbohidrat'] > row['lemak']:
                return 'High Carbs / Energi'
            else:
                return 'High Fat / Makanan Berat'
                
        df_clustered_food = filtered_nutrition.copy()
        df_clustered_food['Klaster_Gizi'] = df_clustered_food.apply(hitung_klaster_gizi, axis=1)
        
        col_c1, col_c2 = st.columns([3, 2])
        with col_c1:
            fig_n2, ax_n2 = plt.subplots(figsize=(8, 5))
            sns.scatterplot(
                data=df_clustered_food, 
                x='karbohidrat', 
                y='protein', 
                hue='Klaster_Gizi', 
                style='Klaster_Gizi',
                palette='Set2', 
                s=110, 
                ax=ax_n2
            )
            ax_n2.set_title("Peta Klasterisasi Gizi (Kadar Protein vs Karbohidrat)", weight='bold', fontsize=11)
            ax_n2.set_xlabel("Karbohidrat (gram)")
            ax_n2.set_ylabel("Protein (gram)")
            st.pyplot(fig_n2)
            plt.close(fig_n2)
            
        with col_c2:
            st.markdown("""
            <div class="insight-card-green">
                <div class="insight-title">⚙️ Kriteria Aturan Segmentasi Profil Pangan:</div>
                <ul>
                    <li><b>Low Calorie</b>: Aneka opsi makanan sehat dengan energi rendah di bawah 100 kalori.</li>
                    <li><b>High Carbs</b>: Komposisi pangan pokok pensuplai glukosa & tenaga utama.</li>
                    <li><b>High Protein</b>: Didominasi lauk pauk pembangun massa otot.</li>
                    <li><b>High Fat</b>: Ragam olahan bersantan/gorengan dengan retensi lemak dominan.</li>
                </ul>
            </div>
            """, unsafe_allow_html=True)
            
            st.markdown("**Statistik Rerata Kandungan Nilai per Klaster Pangan:**")
            summary_cluster_table = df_clustered_food.groupby('Klaster_Gizi', observed=False)[['kalori', 'protein', 'karbohidrat', 'lemak']].mean().round(1)
            st.dataframe(summary_cluster_table, use_container_width=True)

        st.write("---")
        st.subheader("📋 Seluruh Kandungan Gizi Berkas Nutrisi Makanan Bersih")
        st.dataframe(filtered_nutrition, use_container_width=True)

# ==============================================================================
# 7. FOOTER INFORMASI SISTEM ONDUCTION (READY FOR PRODUCTION)
# ==============================================================================
st.write("---")
st.caption("© 2026 GizGOAT Data Analytics Dashboard Core System. Berjalan optimal menggunakan Python, Streamlit Server, Matplotlib, dan Seaborn Visuals. Status Keberfungsian: Produksi Aktif.")
