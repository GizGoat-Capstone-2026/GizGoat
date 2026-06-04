import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function ActivityPage() {
  const [duration, setDuration] = useState(30);
  const [steps, setSteps] = useState('');
  const [activityType, setActivityType] = useState('walking');
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [allLogs, setAllLogs] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  const [dailyData, setDailyData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [dailyRes, historyRes, notifRes] = await Promise.all([
        api.get(`/health/activity?date=${todayStr}`),
        api.get('/health/activity/history?days=7'),
        api.get('/notifications')
      ]);
      setDailyData(dailyRes.data);
      setHistoryData(historyRes.data);
      setNotifications(notifRes.data.data || []);
    } catch (error) {
      toast.error('Gagal memuat data aktivitas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = async () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu && notifications.some(n => !n.isRead)) {
      try {
        await api.put('/notifications/read');
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    }
  };

  const incrementDuration = () => setDuration(prev => prev + 1);
  const decrementDuration = () => setDuration(prev => Math.max(0, prev - 1));

  const handleSaveActivity = async () => {
    if (!steps || !duration) return toast.error('Lengkapi jumlah langkah dan durasi');
    setIsSubmitting(true);
    try {
      await api.post('/health/activity', {
        steps: Number(steps),
        activityType,
        duration: Number(duration),
        date: todayStr
      });
      toast.success('Aktivitas berhasil dicatat');
      setSteps('');
      setDuration(30);
      fetchData();
      if (showAllLogs) fetchAllLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mencatat aktivitas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const target = dailyData?.stepsTarget || 8000;
  const currentSteps = dailyData?.totalSteps || 0;
  const progressPct = Math.min(100, (currentSteps / target) * 100);
  const dashoffset = 691 - (progressPct / 100) * 691;

  const fetchAllLogs = async () => {
    try {
      const res = await api.get('/health/activity/all');
      setAllLogs(res.data.data);
    } catch (error) {
      toast.error('Gagal memuat semua log aktivitas');
    }
  };

  useEffect(() => {
    if (showAllLogs && !allLogs) {
      fetchAllLogs();
    }
  }, [showAllLogs]);

  const getActivityName = (type) => {
    const map = { walking: 'Jalan Santai', jogging: 'Jogging', running: 'Lari', cycling: 'Bersepeda', gym: 'Gym', other: 'Lainnya' };
    return map[type] || type;
  };

  const getActivityIcon = (type) => {
    const map = { walking: 'directions_walk', jogging: 'directions_run', running: 'directions_run', cycling: 'pedal_bike', gym: 'fitness_center', other: 'directions_run' };
    return map[type] || 'directions_run';
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b border-white/5 flex justify-between items-center h-20 px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Activity Tracker</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="bg-surface-container border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all w-64 text-on-surface placeholder-on-surface-variant/50" placeholder="Cari data..." type="text" />
          </div>
          <div className="flex gap-2 items-center">
            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button onClick={handleNotifClick} className="w-10 h-10 rounded-full bg-surface-glass border border-white/10 flex items-center justify-center text-on-surface hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 bg-[#162231] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="font-headline-md text-label-md font-bold text-on-surface">Notifikasi</h3>
                  </div>
                  <div className="flex flex-col max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                          <p className="font-label-md text-label-sm text-on-surface">{notif.title}</p>
                          <p className="font-label-sm text-[11px] text-on-surface-variant mt-1">{notif.message}</p>
                          <p className="font-label-sm text-[10px] text-on-surface-variant mt-1 opacity-70">
                            {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-on-surface-variant text-sm">
                        Belum ada notifikasi
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Canvas */}
      <div className="px-4 md:px-8 py-8 max-w-5xl mx-auto w-full space-y-6 pb-16">
        
        {/* Section 1: Langkah Hari Ini */}
        <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[24px] p-8 relative overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h3 className="font-headline-md text-headline-md text-on-surface mb-8 w-full text-left">Langkah Hari Ini</h3>
          
          <div className="relative flex items-center justify-center mb-8">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle className="text-white/10" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeWidth="14"></circle>
              <circle className="text-primary transition-all duration-1000" cx="128" cy="128" fill="transparent" r="110" stroke="currentColor" strokeDasharray="691" strokeDashoffset={dashoffset} strokeLinecap="round" strokeWidth="14"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-xl text-[48px] text-primary drop-shadow-[0_0_15px_rgba(68,246,151,0.4)]">{currentSteps.toLocaleString('id-ID')}</span>
              <p className="font-body-md text-label-md text-on-surface-variant mt-1 text-center">dari target <span className="font-bold">{target.toLocaleString('id-ID')}</span> langkah</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error">
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Energi Terbakar</p>
                <p className="font-bold text-on-surface font-headline-md">{dailyData?.caloriesBurned || 0} <span className="text-sm font-normal">kkal</span></p>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary-container">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Durasi Aktif</p>
                <p className="font-bold text-on-surface font-headline-md">{dailyData?.activeMinutes || 0} <span className="text-sm font-normal">menit</span></p>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">distance</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Jarak Tempuh</p>
                <p className="font-bold text-on-surface font-headline-md">{dailyData?.distanceKm?.toFixed(1) || 0} <span className="text-sm font-normal">km</span></p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section 2: Input Aktivitas */}
          <section className="lg:col-span-5 bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[24px] p-6 flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Catat Aktivitasmu</h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Jumlah Langkah</label>
                <div className="relative">
                  <input className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-4 font-headline-md text-[24px] text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-on-surface-variant/30" placeholder="0" type="number" value={steps} onChange={e => setSteps(e.target.value)} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-md text-label-md">Langkah</span>
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Jenis Aktivitas</label>
                <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 font-body-md text-on-surface focus:border-primary outline-none transition-all appearance-none cursor-pointer" value={activityType} onChange={e => setActivityType(e.target.value)}>
                  <option className="bg-[#0D1B2A]" value="walking">Jalan Santai</option>
                  <option className="bg-[#0D1B2A]" value="jogging">Jogging</option>
                  <option className="bg-[#0D1B2A]" value="running">Lari</option>
                  <option className="bg-[#0D1B2A]" value="cycling">Bersepeda</option>
                  <option className="bg-[#0D1B2A]" value="gym">Gym</option>
                  <option className="bg-[#0D1B2A]" value="other">Olahraga Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-2">Durasi (menit)</label>
                <div className="flex items-center gap-4 bg-black/30 border border-white/10 rounded-xl px-2 py-2">
                  <button className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-on-surface" onClick={decrementDuration}>
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input className="flex-1 bg-transparent border-none text-center font-headline-md text-[24px] text-on-surface focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 0)} />
                  <button className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-on-surface" onClick={incrementDuration}>
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
            </div>
            
            <button onClick={handleSaveActivity} disabled={isSubmitting} className="w-full mt-8 bg-primary text-on-primary-fixed font-bold font-headline-md text-[18px] py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(68,246,151,0.3)] disabled:opacity-50">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{isSubmitting ? 'hourglass_empty' : 'save'}</span>
              {isSubmitting ? 'Menyimpan...' : 'Simpan Aktivitas'}
            </button>
          </section>

          {/* Section 3: Progress Mingguan */}
          <section className="lg:col-span-7 bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[24px] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline-md text-headline-md text-on-surface">7 Hari Terakhir</h3>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Live Updates
              </div>
            </div>
            
            <div className="flex-1 space-y-5 mb-8">
              {historyData?.data ? historyData.data.map((item, i) => {
                const dayName = new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' });
                const isToday = item.date === todayStr;
                const widthPct = Math.min(100, (item.steps / target) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className={`flex justify-between text-xs ${isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      <span>{dayName}{isToday ? ' (Hari Ini)' : ''}</span>
                      <span>{item.steps.toLocaleString('id-ID')} steps</span>
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`absolute inset-y-0 left-0 rounded-full ${item.targetAchieved ? 'bg-primary' : 'bg-primary opacity-70'} ${isToday ? 'shadow-[0_0_10px_rgba(68,246,151,0.5)]' : ''}`} style={{ width: `${widthPct}%` }}></div>
                      {!item.targetAchieved && <div className="absolute top-0 bottom-0 border-r-2 border-dashed border-primary/40" style={{ right: `${Math.max(0, 100 - widthPct)}%` }}></div>}
                    </div>
                  </div>
                )
              }) : (
                <div className="flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>
              )}
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-black/20 rounded-2xl border border-white/10">
                <p className="text-xs text-on-surface-variant mb-1">Rata-rata Harian</p>
                <p className="font-headline-md text-on-surface">{historyData?.averageSteps?.toLocaleString('id-ID') || 0} <span className="text-xs font-normal opacity-70">langkah</span></p>
              </div>
              <div className="flex-1 p-4 bg-black/20 rounded-2xl border border-white/10">
                <p className="text-xs text-on-surface-variant mb-1">Target Tercapai</p>
                <div className="flex items-center gap-2">
                  <p className="font-headline-md text-primary">{historyData?.daysTargetAchieved || 0} <span className="text-on-surface font-normal">/ {historyData?.data?.length || 7}</span></p>
                  <span className="text-xs text-on-surface-variant">hari</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section 4: Riwayat Aktivitas */}
        <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[24px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface">Log Aktivitas</h3>
            <button onClick={() => setShowAllLogs(true)} className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1 transition-colors">
              Lihat Semua
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="space-y-2">
            {dailyData?.activities?.length > 0 ? dailyData.activities.map((log, idx) => {
               const icon = getActivityIcon(log.type);
               const name = getActivityName(log.type);
               
               return (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined">{icon}</span>
                      </div>
                      <div>
                        <p className="font-bold font-body-md text-on-surface">{name}</p>
                        <p className="text-xs text-on-surface-variant">{todayStr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-body-md text-on-surface">{log.steps.toLocaleString('id-ID')} Langkah</p>
                      <p className="text-xs text-on-surface-variant">{log.duration} menit</p>
                    </div>
                  </div>
               )
            }) : (
               <p className="text-center text-on-surface-variant py-4">Belum ada aktivitas hari ini.</p>
            )}
          </div>
        </section>
      </div>

      {/* Activity Logs Modal */}
      {showAllLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAllLogs(false)}></div>
          <div className="relative w-full max-w-2xl bg-surface-glass border border-white/10 rounded-[24px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-high/50">
              <h3 className="font-headline-md text-headline-md text-on-surface">Semua Log Aktivitas</h3>
              <button className="text-on-surface-variant hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" onClick={() => setShowAllLogs(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {!allLogs ? (
                 <div className="flex justify-center py-4"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>
              ) : allLogs.length > 0 ? allLogs.map((log, idx) => {
                const dateStr = new Date(log.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
                return (
                  <div key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined">{getActivityIcon(log.activityType)}</span>
                      </div>
                      <div>
                        <p className="font-bold font-body-md text-on-surface">{getActivityName(log.activityType)}</p>
                        <p className="text-xs text-on-surface-variant">{dateStr}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-body-md text-on-surface">{log.steps.toLocaleString('id-ID')} Langkah</p>
                      <p className="text-xs text-on-surface-variant">{log.duration} menit</p>
                    </div>
                  </div>
                );
              }) : (
                <p className="text-center text-on-surface-variant py-4">Belum ada riwayat aktivitas.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
