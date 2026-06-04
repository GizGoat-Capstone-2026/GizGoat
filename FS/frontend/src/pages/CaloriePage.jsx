import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const DEFAULT_FOOD_ICON = 'restaurant';

export default function CaloriePage() {
  const [showAddEntryMenu, setShowAddEntryMenu] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  
  const [calorieData, setCalorieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // AI Food Search state
  const [aiSearchResults, setAiSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAISource, setIsAISource] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);
  const tooltipRef = useRef(null);
  
  const todayStr = new Date().toISOString().split('T')[0];

  const fetchCalories = async () => {
    try {
      const res = await api.get(`/health/calories?date=${todayStr}`);
      setCalorieData(res.data);
    } catch (error) {
      toast.error('Gagal memuat data kalori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalories();
  }, []);

  // Debounced AI food search
  useEffect(() => {
    if (!showAddEntryMenu || !searchQuery.trim()) {
      setAiSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/foods/search?query=${encodeURIComponent(searchQuery)}`);
        setAiSearchResults(res.data.data || []);
      } catch (error) {
        setAiSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [showAddEntryMenu, searchQuery]);

  const handleSelectFood = (food) => {
    const normalized = {
      name: food.nama || food.name,
      calories: food.kalori || food.calories,
      carbs: food.karbohidrat ?? food.carbs ?? 0,
      protein: food.protein ?? 0,
      fat: food.lemak ?? food.fat ?? 0,
    };
    setSelectedFood(normalized);
    setIsAISource(true);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;
    setIsSubmitting(true);
    try {
      await api.post('/health/calories', {
        foodName: selectedFood.name,
        portion: 1,
        calories: selectedFood.calories,
        carbs: selectedFood.carbs,
        protein: selectedFood.protein,
        fat: selectedFood.fat,
        mealType: 'snack',
        date: todayStr
      });
      toast.success('Makanan berhasil ditambahkan');
      setShowAddEntryMenu(false);
      setSelectedFood(null);
      setIsAISource(false);
      setSearchQuery('');
      fetchCalories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan makanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFood = async (mealId) => {
    try {
      await api.delete(`/health/calories/${mealId}`);
      toast.success('Makanan berhasil dihapus');
      fetchCalories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus makanan');
    }
  };

  const handleCloseModal = () => {
    setShowAddEntryMenu(false);
    setSelectedFood(null);
    setIsAISource(false);
    setSearchQuery('');
    setAiSearchResults([]);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-4 md:px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[calc(100vh-80px)]">
      {/* Left Column: Daily Overview & Food Log */}
      <div className="md:col-span-8 flex flex-col gap-6">
        {/* Daily Calorie Overview */}
        <section className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6 relative overflow-hidden">
          {isLoading ? (
             <div className="flex justify-center py-4"><span className="material-symbols-outlined animate-spin text-primary text-2xl">refresh</span></div>
          ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Daily Goal</h2>
              <div className="font-label-md text-label-md text-on-surface-variant mb-4">You're doing great! Keep it up.</div>
              <div className="flex items-baseline justify-center md:justify-start gap-2 flex-wrap">
                <span className="font-headline-xl text-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end">{calorieData?.totalCalories || 0}</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/</span>
                {/* 7E: AI Calorie Goal Badge + Tooltip */}
                <div className="relative flex items-center gap-1.5" ref={tooltipRef}>
                  <span className="font-body-md text-body-md text-on-surface-variant">{calorieData?.calorieGoal || 2500} kcal</span>
                  <button
                    onMouseEnter={() => setShowAITooltip(true)}
                    onMouseLeave={() => setShowAITooltip(false)}
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold border border-primary/30 hover:bg-primary/30 transition-colors cursor-default"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>auto_awesome</span>
                    AI
                  </button>
                  {showAITooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-surface-container-highest border border-white/10 rounded-xl p-3 shadow-2xl z-20 animate-in fade-in zoom-in-95">
                      <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">Target kalori dihitung oleh AI berdasarkan profil kamu (usia, berat, tinggi, aktivitas)</p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="relative w-40 h-40 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="gradient-cal" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#00D97E"></stop>
                    <stop offset="100%" stopColor="#38BDF8"></stop>
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" fill="none" r="40" strokeWidth="8" stroke="rgba(27, 42, 61, 0.8)"></circle>
                <circle cx="50" cy="50" fill="none" r="40" strokeDasharray="251.2" strokeDashoffset={251.2 - (Math.min(1, (calorieData?.totalCalories || 0) / (calorieData?.calorieGoal || 2500)) * 251.2)} strokeWidth="8" stroke="url(#gradient-cal)" strokeLinecap="round"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-headline-lg text-headline-lg text-on-surface">{calorieData?.remaining || 0}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Remaining</span>
              </div>
            </div>
          </div>
          )}
        </section>
        
        {/* Food Log List */}
        <section className="flex flex-col gap-4 relative">
          <h3 className="font-headline-md text-headline-md text-on-surface">Today's Log</h3>
          <button onClick={() => setShowAddEntryMenu(true)} className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-primary-container py-4 rounded-xl font-headline-md text-headline-md shadow-[0_0_15px_rgba(0,217,126,0.3)] hover:opacity-90 transition-opacity mb-4">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            <span>Add Entry</span>
          </button>
          
          {isLoading ? (
            <div className="flex justify-center py-4"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>
          ) : calorieData?.meals?.length > 0 ? (
            calorieData.meals.map((meal) => (
              <div key={meal.id} className="bg-surface-glass backdrop-blur-md border border-white/10 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">{meal.foodName}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{meal.portion ? `${meal.portion} porsi` : '1 porsi'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-headline-md text-headline-md text-primary">{meal.calories} kcal</div>
                  <button 
                    onClick={() => handleDeleteFood(meal.id)}
                    className="w-8 h-8 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm border border-red-500/30"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-on-surface-variant py-4">Belum ada makanan yang dicatat hari ini.</p>
          )}
        </section>
      </div>
      
      {/* Right Column: Macronutrients */}
      <div className="md:col-span-4 flex flex-col gap-6">
        <aside className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6 flex flex-col gap-6">
          <h3 className="font-headline-md text-headline-md text-on-surface">Macros</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="font-label-md text-label-md text-on-surface">Carbs</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">{calorieData?.macros?.carbs || 0}g / {calorieData?.macroTargets?.carbs || 250}g ({Math.round(((calorieData?.macros?.carbs || 0) / (calorieData?.macroTargets?.carbs || 250)) * 100)}%)</div>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end rounded-full" style={{ width: `${Math.min(100, ((calorieData?.macros?.carbs || 0) / (calorieData?.macroTargets?.carbs || 250)) * 100)}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="font-label-md text-label-md text-on-surface">Protein</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">{calorieData?.macros?.protein || 0}g / {calorieData?.macroTargets?.protein || 180}g ({Math.round(((calorieData?.macros?.protein || 0) / (calorieData?.macroTargets?.protein || 180)) * 100)}%)</div>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end rounded-full" style={{ width: `${Math.min(100, ((calorieData?.macros?.protein || 0) / (calorieData?.macroTargets?.protein || 180)) * 100)}%` }}></div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="font-label-md text-label-md text-on-surface">Fat</div>
              <div className="font-label-sm text-label-sm text-on-surface-variant">{calorieData?.macros?.fat || 0}g / {calorieData?.macroTargets?.fat || 70}g ({Math.round(((calorieData?.macros?.fat || 0) / (calorieData?.macroTargets?.fat || 70)) * 100)}%)</div>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end rounded-full" style={{ width: `${Math.min(100, ((calorieData?.macros?.fat || 0) / (calorieData?.macroTargets?.fat || 70)) * 100)}%` }}></div>
            </div>
          </div>
        </aside>
      </div>

      {/* Add Entry Modal */}
      {showAddEntryMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
          
          {selectedFood ? (
            <div className="relative w-full max-w-sm bg-surface-glass border border-white/10 rounded-[24px] shadow-2xl flex flex-col animate-in fade-in zoom-in-95 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-high/50">
                <button className="text-on-surface-variant hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" onClick={() => { setSelectedFood(null); setIsAISource(false); }}>
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h3 className="font-headline-md text-headline-md text-on-surface">Detail Makanan</h3>
                <div className="w-8"></div>
              </div>
              
              <div className="p-8 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container mb-4 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
                  <span className="material-symbols-outlined text-[40px]">{DEFAULT_FOOD_ICON}</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 text-center">{selectedFood.name}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-2 text-center">1 Porsi</p>
                
                {/* 7A: AI badge */}
                {isAISource && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 text-primary rounded-full text-xs font-semibold border border-primary/30 mb-5 animate-in fade-in zoom-in-95">
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>auto_awesome</span>
                    dari dataset AI 🤖
                  </div>
                )}
                
                <div className="font-headline-xl text-[48px] text-primary mb-8 drop-shadow-[0_0_15px_rgba(0,217,126,0.4)]">
                  {selectedFood.calories} <span className="text-xl font-normal text-on-surface-variant">kcal</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col items-center border border-white/5">
                    <span className="text-xs text-on-surface-variant mb-1">Carbs</span>
                    <span className="font-bold text-lg text-on-surface">{selectedFood.carbs}g</span>
                  </div>
                  <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col items-center border border-white/5">
                    <span className="text-xs text-on-surface-variant mb-1">Protein</span>
                    <span className="font-bold text-lg text-on-surface">{selectedFood.protein}g</span>
                  </div>
                  <div className="bg-surface-container-high rounded-2xl p-4 flex flex-col items-center border border-white/5">
                    <span className="text-xs text-on-surface-variant mb-1">Fat</span>
                    <span className="font-bold text-lg text-on-surface">{selectedFood.fat}g</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-white/10 bg-surface-container-high/30">
                <button onClick={handleAddFood} disabled={isSubmitting} className="w-full bg-primary text-on-primary-fixed font-bold font-headline-md text-lg py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,217,126,0.3)] disabled:opacity-50">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{isSubmitting ? 'hourglass_empty' : 'add_task'}</span>
                  {isSubmitting ? 'Menyimpan...' : 'Tambah ke Jurnal'}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-lg bg-surface-glass border border-white/10 rounded-[24px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in fade-in zoom-in-95">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-high/50">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Pilih Makanan</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '12px' }}>auto_awesome</span>
                    <span className="text-[11px] text-primary font-medium">Didukung AI Dataset</span>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10" onClick={handleCloseModal}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="w-full bg-surface-container border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-on-surface placeholder-on-surface-variant/50" 
                    placeholder="Ketik nama makanan..." 
                    type="text"
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-[200px]">
                {isSearching ? (
                  <div className="flex flex-col items-center py-8 gap-2">
                    <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
                    <p className="text-xs text-on-surface-variant">Mencari di dataset AI...</p>
                  </div>
                ) : searchQuery.trim() === '' ? (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-5xl">search</span>
                    <p className="text-center text-on-surface-variant text-sm">Ketik nama makanan untuk mencari<br/>di database nutrisi AI kami</p>
                  </div>
                ) : aiSearchResults.length > 0 ? (
                  <>
                    <p className="text-[11px] text-on-surface-variant px-1 pb-1">{aiSearchResults.length} makanan ditemukan</p>
                    {aiSearchResults.map((food, idx) => (
                      <div key={idx} onClick={() => handleSelectFood(food)} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">{DEFAULT_FOOD_ICON}</span>
                          </div>
                          <div>
                            <p className="font-bold font-body-md text-on-surface">{food.nama || food.name}</p>
                            <p className="text-xs text-on-surface-variant">1 Porsi · {food.protein}g protein</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold font-body-md text-primary">{food.kalori || food.calories} kcal</p>
                          <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-background transition-colors">
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-5xl">sentiment_dissatisfied</span>
                    <p className="text-center text-on-surface-variant text-sm">Makanan tidak ditemukan di database AI.<br/>Coba kata kunci lain.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
