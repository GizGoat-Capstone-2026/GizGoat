import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function SleepPage() {
  const [bedTime, setBedTime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [qualityRating, setQualityRating] = useState(4);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState(null);
  const [lastAiScore, setLastAiScore] = useState(null); // AI Sleep Score from last log

  
  const fetchHistory = async () => {
    try {
      const res = await api.get('/health/sleep/history?days=7');
      setHistory(res.data);
    } catch (error) {
      toast.error('Gagal memuat riwayat tidur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleLogSleep = async () => {
    setIsSubmitting(true);
    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      const bedDate = new Date();
      const [bedH, bedM] = bedTime.split(':');
      bedDate.setHours(bedH, bedM, 0, 0);
      if (parseInt(bedH) > 12) bedDate.setDate(bedDate.getDate() - 1);

      const wakeDate = new Date();
      const [wakeH, wakeM] = wakeTime.split(':');
      wakeDate.setHours(wakeH, wakeM, 0, 0);

      const res = await api.post('/health/sleep', {
        bedTime: bedDate.toISOString(),
        wakeTime: wakeDate.toISOString(),
        qualityRating: Number(qualityRating),
        date: todayStr
      });
      
      // 7B: Ambil aiSleepScore dari response
      if (res.data?.aiSleepScore != null) {
        setLastAiScore({
          score: res.data.aiSleepScore,
          category: res.data.qualityScore,
          analysis: res.data.analysis,
        });
      } else {
        setLastAiScore(null);
      }
      
      toast.success('Data tidur berhasil disimpan');
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan data tidur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 md:px-6 max-w-container-max mx-auto py-8 flex flex-col gap-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Sleep Analysis</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Track your restorative cycles and optimize your recovery.</p>
      </div>
      
      {/* Top Section: Sleep Log Form */}
      <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-grow w-full md:w-auto flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Bedtime</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">bedtime</span>
              <input className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="time" value={bedTime} onChange={e => setBedTime(e.target.value)} />
            </div>
          </div>
          <div className="flex-grow w-full md:w-auto flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Wake Time</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">light_mode</span>
              <input className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
            </div>
          </div>
          <div className="flex-grow w-full md:w-auto flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Quality (1-5)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">star</span>
              <input className="w-full bg-surface-container border border-outline-variant rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" type="number" min="1" max="5" value={qualityRating} onChange={e => setQualityRating(e.target.value)} />
            </div>
          </div>
          <button onClick={handleLogSleep} disabled={isSubmitting} className="w-full md:w-auto bg-primary text-on-primary font-label-md text-label-md font-bold px-8 py-3.5 rounded-lg hover:bg-primary-fixed-dim transition-colors shadow-[0_0_15px_rgba(68,246,151,0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{isSubmitting ? 'hourglass_empty' : 'add_task'}</span>
            Log Sleep
          </button>
        </div>
      </section>

      {/* 7B: AI Sleep Score Banner */}
      {lastAiScore && (
        <section className="bg-gradient-to-r from-primary/10 to-tertiary/10 backdrop-blur-xl border border-primary/20 rounded-[16px] p-5 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,217,126,0.3)]">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>neurology</span>
          </div>
          <div className="flex-grow text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="font-headline-md text-headline-md text-on-surface">AI Sleep Score</span>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold border border-primary/30">
                <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>auto_awesome</span>
                Deep Learning
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{lastAiScore.analysis}</p>
          </div>
          <div className="flex flex-col items-center flex-shrink-0">
            <span className="font-headline-xl text-headline-xl text-primary drop-shadow-[0_0_10px_rgba(0,217,126,0.4)]">{lastAiScore.score.toFixed(1)}</span>
            <span className="text-xs text-on-surface-variant">/ 10</span>
            <span className="mt-1 bg-primary/20 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full">{lastAiScore.category}</span>
          </div>
        </section>
      )}

      
      {/* Main Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area (Spans 2 cols) */}
        <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6 lg:col-span-2 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="font-headline-md text-headline-md text-on-surface">Weekly Duration</h2>
            <span className="bg-secondary-container text-on-secondary-container font-label-sm text-label-sm px-3 py-1 rounded-full">Last 7 Days</span>
          </div>
          {/* Mock Bar Chart */}
          <div className="relative h-64 mt-4 flex items-end justify-between gap-2 md:gap-4 border-b border-outline-variant/30 pb-2">
            {isLoading ? (
               <div className="absolute inset-0 flex justify-center items-center"><span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span></div>
            ) : (
              <>
                <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                  <div className="border-t border-outline-variant/20 w-full"></div>
                  <div className="border-t border-outline-variant/20 w-full"></div>
                  <div className="border-t border-outline-variant/20 w-full"></div>
                  <div className="border-t border-outline-variant/20 w-full"></div>
                </div>
                
                {history?.data?.length > 0 ? (
                  history.data.slice(-7).map((log, idx) => {
                    const heightPct = Math.min(100, (log.duration / 10) * 100);
                    const isLast = idx === history.data.length - 1;
                    const dayName = new Date(log.date).toLocaleDateString('id-ID', { weekday: 'short' });
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10 group h-full justify-end">
                        <div className={`w-full max-w-[40px] ${isLast ? 'bg-tertiary shadow-[0_0_15px_rgba(68,246,151,0.3)]' : 'bg-secondary-container hover:bg-tertiary'} rounded-t-lg transition-all relative group`} style={{ height: `${heightPct}%` }}>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface text-on-surface font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                            {log.duration.toFixed(1)} hrs
                          </div>
                        </div>
                        <span className={`font-label-sm text-label-sm ${isLast ? 'text-primary' : 'text-on-surface-variant'}`}>{dayName}</span>
                      </div>
                    )
                  })
                ) : (
                  <div className="absolute inset-0 flex justify-center items-center text-on-surface-variant">Belum ada data tidur.</div>
                )}
              </>
            )}
          </div>
        </section>
        
        {/* Quality Score Badge */}
        <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6 flex flex-col items-center justify-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="w-full flex justify-between items-start">
            <h2 className="font-headline-md text-headline-md text-on-surface">Quality Score</h2>
          </div>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(184, 200, 224, 0.1)" strokeLinecap="round" strokeWidth="8"></circle>
              <circle className="text-tertiary" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="282.7" strokeDashoffset={282.7 - ((history?.averageQuality === 'Sangat Baik' ? 90 : history?.averageQuality === 'Baik' ? 75 : history?.averageQuality === 'Cukup' ? 50 : 30) / 100) * 282.7} strokeLinecap="round" strokeWidth="8" style={{ filter: 'drop-shadow(0 0 8px rgba(175,224,255,0.4))', transition: 'stroke-dashoffset 1s ease-in-out' }}></circle>
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="font-headline-xl text-headline-xl bg-clip-text text-transparent bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end">{history?.averageQuality === 'Sangat Baik' ? 90 : history?.averageQuality === 'Baik' ? 75 : history?.averageQuality === 'Cukup' ? 50 : history?.averageQuality === 'Buruk' ? 30 : '-'}</span>
              <span className="bg-primary/20 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mt-2">{history?.averageQuality || '-'}</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-body-lg text-body-lg text-on-surface">{history?.averageDuration ? history.averageDuration.toFixed(1) : '-'}h avg sleep</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">based on {history?.data?.length || 0} records</p>
          </div>
        </section>
      </div>
      
      {/* Secondary Section: Sleep Hygiene Tips */}
      <section className="flex flex-col gap-4">
        <h3 className="font-headline-md text-headline-md text-on-surface">Sleep Hygiene Essentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-5 flex items-start gap-4 hover:border-tertiary/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>devices_off</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Digital Detox</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">No screens 1 hour before bed to reduce blue light exposure.</p>
            </div>
          </div>
          <div className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-5 flex items-start gap-4 hover:border-tertiary/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Optimal Temperature</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Keep your room cool, ideally between 60-67°F (15-19°C).</p>
            </div>
          </div>
          <div className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-5 flex items-start gap-4 hover:border-tertiary/50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0 group-hover:bg-tertiary/20 transition-colors">
              <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>update</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-on-surface font-bold">Consistent Routine</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Go to bed and wake up at the same time every day.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
