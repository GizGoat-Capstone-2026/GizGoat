import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function RecommendationsPage() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/recommendations');
        setData(res.data);
      } catch (error) {
        toast.error('Gagal memuat rekomendasi');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-12 py-10 grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Recommendations Column */}
      <div className="md:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Rekomendasi Hari Ini untuk Kamu
            </h1>
            {/* 7C: AI Powered badge */}
            {!isLoading && (
              data?.aiPowered ? (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold border border-primary/30 animate-in fade-in zoom-in-95">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span>
                  Powered by AI 🤖
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-xs font-semibold border border-white/10">
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>rule</span>
                  Mode Standar
                </span>
              )
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span></div>
        ) : (
          <>
            {/* Recommendation Card 1 (Diet) */}
            {data?.recommendations?.diet && (
              <div className="bg-surface-glass backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{data.recommendations.diet.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface/80">{data.recommendations.diet.description}</p>
                    <span className="inline-block mt-2 bg-primary/20 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-sm">{data.recommendations.diet.priority}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation Card 2 (Sleep) */}
            {data?.recommendations?.sleep && (
              <div className="bg-surface-glass backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{data.recommendations.sleep.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface/80">{data.recommendations.sleep.description}</p>
                    <span className="inline-block mt-2 bg-primary/20 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-sm">{data.recommendations.sleep.priority}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendation Card 3 (Activity) */}
            {data?.recommendations?.activity && (
              <div className="bg-surface-glass backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{data.recommendations.activity.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface/80">{data.recommendations.activity.description}</p>
                    <span className="inline-block mt-2 bg-primary/20 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-sm">{data.recommendations.activity.priority}</span>
                  </div>
                </div>
              </div>
            )}
            {/* 7C: AI Recommendations Section */}
            {data?.aiPowered && data?.aiRecommendations?.length > 0 && (
              <div className="bg-gradient-to-br from-primary/5 to-tertiary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Analisis AI Khusus Untukmu</h3>
                    <p className="text-xs text-on-surface-variant">Dianalisis berdasarkan data tidur, kalori, dan aktivitas 7 hari terakhir</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-3">
                  {data.aiRecommendations.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-surface-glass/50 rounded-lg border border-white/5">
                      <span className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0" style={{ fontSize: '18px' }}>check_circle</span>
                      <p className="font-body-md text-body-md text-on-surface/90 text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Health Score Column */}
      <div className="md:col-span-4">
        <div className="bg-surface-glass backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-sm sticky top-24">
          <h2 className="font-headline-md text-headline-md text-on-surface text-center mb-6">Skor Kesehatanmu {data?.zone || '...'}</h2>
          
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8"></circle>
              <circle className="transition-all duration-1000 ease-out" cx="50" cy="50" fill="none" r="40" stroke="#00D97E" strokeDasharray="251.2" strokeDashoffset={251.2 - ((data?.healthScore || 0) / 100) * 251.2} strokeLinecap="round" strokeWidth="8"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-xl text-headline-xl text-on-surface">{data?.healthScore || 0}</span>
              <span className="font-label-md text-label-md text-on-surface/70">/ 100</span>
            </div>
          </div>
          
          <p className="font-body-md text-body-md text-center text-on-surface/80 mb-6">
            Skor kesehatanmu berada dalam kondisi {data?.zone?.toLowerCase() || '...'} berdasarkan aktivitas 7 hari terakhir.
          </p>
          
          <div className="flex justify-center">
            <button onClick={() => setShowHistoryModal(true)} className="bg-transparent border-2 border-primary text-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span>
              Riwayat Skor
            </button>
          </div>
        </div>
      </div>

      {/* Score History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}></div>
          <div className="relative w-full max-w-md bg-surface-glass border border-white/10 rounded-[24px] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-high/50">
              <h3 className="font-headline-md text-headline-md text-on-surface">Riwayat Skor Kesehatan</h3>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" onClick={() => setShowHistoryModal(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined text-sm">today</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">Hari Ini</h4>
                    <p className="text-xs text-on-surface-variant">Stabil</p>
                  </div>
                </div>
                <div className="font-bold text-xl text-primary">78<span className="text-sm font-normal text-on-surface-variant">/100</span></div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">event</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Kemarin</h4>
                    <p className="text-xs text-on-surface-variant">Meningkat</p>
                  </div>
                </div>
                <div className="font-bold text-xl text-on-surface">75<span className="text-sm font-normal text-on-surface-variant">/100</span></div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-tertiary/10 border border-tertiary/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-sm">event_note</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-tertiary">3 Hari Lalu</h4>
                    <p className="text-xs text-on-surface-variant">Sangat Baik</p>
                  </div>
                </div>
                <div className="font-bold text-xl text-tertiary">82<span className="text-sm font-normal text-on-surface-variant">/100</span></div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">history</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">Minggu Lalu</h4>
                    <p className="text-xs text-on-surface-variant">Sedikit Menurun</p>
                  </div>
                </div>
                <div className="font-bold text-xl text-on-surface">70<span className="text-sm font-normal text-on-surface-variant">/100</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
