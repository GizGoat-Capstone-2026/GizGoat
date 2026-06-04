import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [timeframe, setTimeframe] = useState('Last 7 Days');
  const [completedTasks, setCompletedTasks] = useState([]);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState(null); // 'online' | 'offline' | null


  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const timeMenuRef = useRef(null);

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifMenu(false);
      if (profileRef.current && !profileRef.current.contains(event.target)) setShowProfileMenu(false);
      if (timeMenuRef.current && !timeMenuRef.current.contains(event.target)) setShowTimeMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysFromTimeframe = (tf) => {
    if (tf === 'Today') return 1;
    if (tf === 'Last 7 Days') return 7;
    if (tf === 'Last 30 Days') return 30;
    if (tf === 'This Year') return 365;
    return 7;
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const days = getDaysFromTimeframe(timeframe);
        const [dashRes, recRes, notifRes] = await Promise.all([
          api.get(`/dashboard?days=${days}`),
          api.get('/recommendations'),
          api.get('/notifications')
        ]);
        setDashboardData(dashRes.data.data || dashRes.data);
        
        let finalRecs = [];
        const rawRecData = recRes.data.data || recRes.data;
        
        // Convert object to array and assign categories based on keys
        const standardRecsObj = rawRecData.recommendations || {};
        const standardRecs = Object.entries(standardRecsObj).map(([key, rec]) => ({
          ...rec,
          category: key === 'diet' ? 'NUTRITION' : key === 'sleep' ? 'SLEEP' : 'ACTIVITY'
        }));
        
        if (rawRecData.aiPowered && rawRecData.aiRecommendations?.length > 0) {
          const aiRecs = rawRecData.aiRecommendations.map((text, i) => ({
            category: 'AI',
            title: `Saran Personal AI #${i + 1}`,
            description: text
          }));
          // Gabungkan AI di posisi teratas, diikuti oleh standar
          finalRecs = [...aiRecs, ...standardRecs];
        } else {
          finalRecs = standardRecs;
        }
        
        setRecommendations(finalRecs);
        setNotifications(notifRes.data.data || []);
      } catch (error) {
        toast.error('Gagal memuat data dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, [timeframe]);

  // 7D: AI Health Check on mount
  useEffect(() => {
    const checkAI = async () => {
      try {
        const res = await api.get('/ai/health');
        const status = res.data?.status || 'offline';
        setAiStatus(status);
        if (status === 'offline') {
          toast('AI Service sedang offline. Beberapa fitur menggunakan mode standar.', {
            icon: '⚠️',
            duration: 5000,
          });
        }
      } catch {
        setAiStatus('offline');
      }
    };
    checkAI();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotifClick = async () => {
    setShowNotifMenu(!showNotifMenu);
    setShowProfileMenu(false);
    if (!showNotifMenu && notifications.some(n => !n.isRead)) {
      try {
        await api.put('/notifications/read');
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    }
  };
  return (
    <div className="w-full px-4 md:px-6 py-8 flex flex-col gap-10">
      {/* Header Section */}
      <header className="flex justify-between items-center relative z-50">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Halo, {user?.name || 'Muhammad Alif'}!</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-body-md text-body-md text-on-surface-variant">Here is your daily health summary.</p>
            {/* 7D: AI Status Indicator */}
            {aiStatus && (
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                aiStatus === 'online'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  aiStatus === 'online' ? 'bg-primary animate-pulse' : 'bg-orange-400'
                }`}></span>
                AI {aiStatus === 'online' ? 'Online ✅' : 'Offline ⚠️'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 relative">
          
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

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }} className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
              <img alt="User Profile" className="w-full h-full object-cover" src={user?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuANiDV_90iD_gxVe6RPq8fm_N-SyAiji9tGg6DeP_8BUeXCc7FglFB_PUqI5MtlVLfu7vl1FnbH9EH_E7RMJUgnAqs-OXGPde4Z2R0nkosBS4R52gkinJnJZHRAqx0KbNoYwNpum6cQ970fs-yps-v01Yr38IP57niVI5o2_EkoSxQjlEOABl1JJ2AHPgOjdat8yaWO8_YHl4tV1FAEyPIfAobSDXegZOidDa5JBE6GXbVz7_p79ompPnfzwQSR-9SK_7nTaEuzmw"} />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-[#162231] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-white/10">
                  <p className="font-label-md text-label-md text-on-surface font-bold">{user?.name || 'Muhammad Alif Ramadhani'}</p>
                  <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">@{user?.email?.split('@')[0] || 'alif1610'}</p>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span className="font-label-sm text-label-sm">Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="font-label-sm text-label-sm">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Summary Metrics */}
      {isLoading ? (
        <div className="flex justify-center py-10"><span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span></div>
      ) : (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Calorie Card */}
        <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm border border-primary/20">Target: {dashboardData?.today?.calories?.goal || '-'}</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">Today's Calories</p>
            <h2 className="font-headline-md text-headline-md text-on-surface">{dashboardData?.today?.calories?.consumed?.toLocaleString() || 0} <span className="font-body-md text-body-md text-on-surface-variant">kcal</span></h2>
          </div>
          <div className="w-full h-1 bg-surface-container-high rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end rounded-full" style={{ width: `${Math.min(100, ((dashboardData?.today?.calories?.consumed || 0) / (dashboardData?.today?.calories?.goal || 1)) * 100)}%` }}></div>
          </div>
        </div>
        
        {/* BMI Card */}
        <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-tertiary-container/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_weight</span>
            </div>
            <span className="bg-primary/20 text-primary px-2 py-1 rounded-full font-label-sm text-label-sm border border-primary/30">{dashboardData?.today?.bmi?.category || 'Unknown'}</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">BMI Status</p>
            <h2 className="font-headline-md text-headline-md text-on-surface">{dashboardData?.today?.bmi?.value?.toFixed(1) || '-'}</h2>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-full h-2 rounded-full flex gap-1">
              <div className="h-full bg-secondary-container rounded-l-full flex-1"></div>
              <div className="h-full bg-primary rounded-full flex-1 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-sm"></div>
              </div>
              <div className="h-full bg-secondary-container rounded-r-full flex-1"></div>
            </div>
          </div>
        </div>
        
        {/* Sleep Card */}
        <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bedtime</span>
            </div>
            <span className="text-on-surface-variant font-label-sm text-label-sm">Goal: {Math.floor((dashboardData?.today?.sleep?.target || 480) / 60)}h</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">Sleep Hours</p>
            <h2 className="font-headline-md text-headline-md text-on-surface">{Math.floor((dashboardData?.today?.sleep?.duration || 0) / 60)}h {(dashboardData?.today?.sleep?.duration || 0) % 60}m</h2>
          </div>
          <div className="flex items-end gap-1 h-8 mt-auto">
            <div className="w-full bg-secondary/30 rounded-t-sm h-[40%]"></div>
            <div className="w-full bg-secondary/50 rounded-t-sm h-[70%]"></div>
            <div className="w-full bg-secondary rounded-t-sm h-[90%] relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-secondary">Today</div>
            </div>
          </div>
        </div>
        
        {/* Steps Card */}
        <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>directions_walk</span>
            </div>
            <span className="text-on-surface-variant font-label-sm text-label-sm">Goal: {(dashboardData?.today?.steps?.target || 0).toLocaleString()}</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-1">Daily Steps</p>
            <h2 className="font-headline-md text-headline-md text-on-surface">{(dashboardData?.today?.steps?.actual || 0).toLocaleString()} <span className="font-body-md text-body-md text-on-surface-variant">steps</span></h2>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(68,246,151,0.5)]" style={{ width: `${Math.min(100, ((dashboardData?.today?.steps?.actual || 0) / (dashboardData?.today?.steps?.target || 1)) * 100)}%` }}></div>
          </div>
        </div>
      </section>
      )}
      
      {/* Main Content & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Main Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Weekly Health Trend */}
          <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 lg:p-8 flex flex-col overflow-x-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md text-on-surface">Activity Trend</h3>
              <div className="relative" ref={timeMenuRef}>
                <button 
                  onClick={() => setShowTimeMenu(!showTimeMenu)} 
                  className="bg-surface-container-high px-3 py-1 rounded-lg border border-white/5 flex items-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="font-label-sm text-label-sm text-on-surface">{timeframe}</span>
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
                {showTimeMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#162231] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-10">
                    <div className="flex flex-col">
                      {['Today', 'Last 7 Days', 'Last 30 Days', 'This Year'].map(option => (
                        <button
                          key={option}
                          onClick={() => { setTimeframe(option); setShowTimeMenu(false); }}
                          className={`px-4 py-3 text-left font-label-sm text-label-sm hover:bg-white/5 transition-colors ${timeframe === option ? 'text-primary bg-primary/5' : 'text-on-surface-variant'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Chart Placeholder using CSS */}
            <div className="w-full h-[250px] relative flex items-end justify-between px-4 pb-6 border-b border-white/5 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white/10">
              <div className="sticky left-0 top-0 h-full flex flex-col justify-between text-[10px] text-on-surface-variant pb-6 z-10 bg-[#162231]/80 px-2 backdrop-blur-sm">
                <span>10k</span>
                <span>7.5k</span>
                <span>5k</span>
                <span>2.5k</span>
                <span>0</span>
              </div>
              <div className="flex w-full items-end justify-between min-w-[300px] h-full pl-8">
                {dashboardData?.weeklyTrend?.map((dayData, idx) => (
                  <div key={idx} className="flex-1 max-w-[40px] min-w-[8px] bg-primary rounded-t-md hover:brightness-110 transition-all cursor-pointer group relative shadow-[0_0_15px_rgba(68,246,151,0.2)] mx-1" style={{ height: `${Math.max(5, Math.min(100, (dayData.steps / 10000) * 100))}%` }}>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest text-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {dayData.steps} steps
                    </div>
                    {/* Date label at bottom */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] text-on-surface-variant font-label-sm whitespace-nowrap">
                      {dashboardData.weeklyTrend.length <= 7 
                        ? new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'short' })
                        : idx % Math.ceil(dashboardData.weeklyTrend.length / 10) === 0 ? new Date(dayData.date).getDate() : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bento Grid for secondary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Circular Progress Card */}
            <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col items-center justify-center relative overflow-hidden h-[240px]">
              <h3 className="font-label-md text-label-md text-on-surface-variant absolute top-6 left-6">Daily Calorie Goal</h3>
              <div className="relative w-32 h-32 mt-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(59, 74, 94, 0.5)" strokeWidth="8"></circle>
                  <circle className="drop-shadow-[0_0_8px_rgba(68,246,151,0.5)]" cx="50" cy="50" fill="none" r="40" stroke="url(#gradient-dash)" strokeDasharray="251.2" strokeDashoffset={251.2 - (Math.min(1, (dashboardData?.today?.calories?.consumed || 0) / (dashboardData?.today?.calories?.goal || 1)) * 251.2)} strokeLinecap="round" strokeWidth="8"></circle>
                  <defs>
                    <linearGradient id="gradient-dash" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#00D97E"></stop>
                      <stop offset="100%" stopColor="#38BDF8"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-md text-headline-md text-on-surface">{Math.round(((dashboardData?.today?.calories?.consumed || 0) / (dashboardData?.today?.calories?.goal || 1)) * 100)}%</span>
                </div>
              </div>
              <p className="font-label-sm text-label-sm text-primary mt-4">
                {Math.max(0, (dashboardData?.today?.calories?.goal || 0) - (dashboardData?.today?.calories?.consumed || 0))} kcal remaining.
              </p>
            </div>
            
            {/* Heart Rate Card */}
            <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col justify-between relative overflow-hidden h-[240px]">
              <div className="absolute top-0 right-0 w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  <h3 className="font-label-md text-label-md text-on-surface-variant">Avg Heart Rate</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <h2 className="font-headline-xl text-headline-xl text-on-surface">72</h2>
                  <span className="font-body-md text-body-md text-on-surface-variant">bpm</span>
                </div>
              </div>
              <div className="w-full h-12 flex items-end pb-2 opacity-80">
                <div className="w-full h-[2px] bg-error flex items-center justify-around">
                  <div className="w-2 h-2 bg-error rounded-full animate-ping"></div>
                  <div className="h-8 w-[2px] bg-error rotate-12"></div>
                  <div className="h-12 w-[2px] bg-error -rotate-12 transform -translate-y-2"></div>
                  <div className="h-6 w-[2px] bg-error rotate-12"></div>
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar Area */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-[16px] p-6 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Today's Recommendations</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Tailored for your goals</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {recommendations?.length > 0 ? recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  onClick={() => toggleTask(`rec-${idx}`)}
                  className={`bg-surface-container-lowest border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group ${completedTasks.includes(`rec-${idx}`) ? 'opacity-60' : ''}`}
                >
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">
                      {rec.category === 'NUTRITION' ? 'restaurant' : rec.category === 'ACTIVITY' ? 'directions_run' : rec.category === 'AI' ? 'neurology' : 'bedtime'}
                    </span>
                  </div>
                  <div className={`flex-grow transition-all ${completedTasks.includes(`rec-${idx}`) ? 'line-through' : ''}`}>
                    <h4 className={`font-label-md text-label-md ${completedTasks.includes(`rec-${idx}`) ? 'text-on-surface-variant' : 'text-on-surface'}`}>{rec.title}</h4>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{rec.description}</p>
                  </div>
                  <div className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${completedTasks.includes(`rec-${idx}`) ? 'bg-primary border-primary' : 'border-outline group-hover:border-primary'}`}>
                    {completedTasks.includes(`rec-${idx}`) && <span className="material-symbols-outlined text-background text-[16px] font-bold">check</span>}
                  </div>
                </div>
              )) : (
                <p className="text-on-surface-variant text-center py-4">Belum ada rekomendasi hari ini.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
