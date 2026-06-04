import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function BMIPage() {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(28);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(68);
  const [isLoading, setIsLoading] = useState(false);
  const [bmiResult, setBmiResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchHistory = async () => {
    if (!user) {
      setIsHistoryLoading(false);
      return;
    }
    try {
      const res = await api.get('/health/bmi/history');
      setHistory(res.data.data || []);
      // If history exists, populate initial result display
      if (res.data.data?.length > 0 && !bmiResult) {
        setBmiResult({
          bmi: res.data.data[0].bmi,
          category: res.data.data[0].category,
          tips: ['Berdasarkan riwayat terakhir Anda.'],
          recordedAt: res.data.data[0].recordedAt,
        });
      }
    } catch (error) {
      toast.error('Gagal memuat riwayat BMI');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleCalculate = async () => {
    if (!height || !weight) return toast.error('Lengkapi form terlebih dahulu');
    setIsLoading(true);
    
    if (!user) {
      // Local calculation for non-logged in users
      setTimeout(() => {
        const heightM = Number(height) / 100;
        const bmi = Number(weight) / (heightM * heightM);
        let category = 'Normal';
        if (bmi < 18.5) category = 'Underweight';
        else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
        else if (bmi >= 30) category = 'Obese';
        
        setBmiResult({
          bmi,
          category,
          tips: ['Perhitungan tanpa menyimpan riwayat.', 'Login atau Register untuk menyimpan riwayat BMI Anda dan mendapatkan rekomendasi nutrisi dari AI.']
        });
        setIsLoading(false);
        toast.success('BMI berhasil dihitung!');
      }, 500);
      return;
    }

    try {
      const res = await api.post('/health/bmi', { height: Number(height), weight: Number(weight) });
      setBmiResult(res.data);
      toast.success('BMI berhasil dihitung dan disimpan!');
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghitung BMI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-6 py-10">
      <header className="mb-10">
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">BMI Calculator</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Analyze your body mass index to understand your health baseline.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-6 shadow-lg relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <form className="flex flex-col gap-6">
              {/* Gender Toggle */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant">Gender</label>
                <div className="flex bg-surface-container-high rounded-lg p-1 border border-outline-variant/30">
                  <button 
                    onClick={() => setGender('male')}
                    className={`flex-1 py-2 px-4 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${gender === 'male' ? 'bg-surface-glass text-primary shadow-sm border border-primary/20' : 'text-on-surface-variant hover:text-on-surface border border-transparent'}`} 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">male</span> Male
                  </button>
                  <button 
                    onClick={() => setGender('female')}
                    className={`flex-1 py-2 px-4 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all ${gender === 'female' ? 'bg-surface-glass text-primary shadow-sm border border-primary/20' : 'text-on-surface-variant hover:text-on-surface border border-transparent'}`} 
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">female</span> Female
                  </button>
                </div>
              </div>
              {/* Age */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="age">Age</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-sm text-label-sm">Years</span>
                </div>
              </div>
              {/* Height */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="height">Height</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-sm text-label-sm">cm</span>
                </div>
              </div>
              {/* Weight */}
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="weight">Weight</label>
                <div className="relative">
                  <input className="w-full bg-surface-container-highest border border-outline-variant/30 text-on-surface font-body-md text-body-md rounded-lg p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-sm text-label-sm">kg</span>
                </div>
              </div>
              {/* Submit Action */}
              <button onClick={handleCalculate} disabled={isLoading} className="mt-4 w-full bg-primary text-on-primary font-headline-md text-[18px] py-4 rounded-xl hover:bg-primary-fixed transition-colors shadow-[0_0_20px_rgba(68,246,151,0.2)] flex justify-center items-center gap-2 disabled:opacity-50" type="button">
                <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'calculate'}</span> {isLoading ? 'Menghitung...' : 'Hitung BMI'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Right Column: Results Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="bg-surface-glass backdrop-blur-xl border border-white/10 rounded-[16px] p-8 shadow-lg flex-grow flex flex-col relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-headline-md text-headline-md text-on-surface">Your Result</h2>
              {bmiResult?.recordedAt && (
                <div className="bg-primary/15 border border-primary/30 text-primary px-3 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Updated just now
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center py-6 flex-grow">
              {/* Score Display */}
              <div className="flex flex-col items-center justify-center relative w-48 h-48 flex-shrink-0">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="rgba(255,255,255,0.05)" strokeDasharray="283" strokeDashoffset="0" strokeWidth="8"></circle>
                  <circle cx="50" cy="50" fill="none" r="45" stroke="url(#gradient-bmi)" strokeDasharray="283" strokeDashoffset={Math.max(0, 283 - ((Number(bmiResult?.bmi) || 0) / 40) * 283)} strokeLinecap="round" strokeWidth="8"></circle>
                  <defs>
                    <linearGradient id="gradient-bmi" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#00D97E"></stop>
                      <stop offset="100%" stopColor="#38BDF8"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-headline-xl text-[48px] font-bold text-on-surface leading-none">{bmiResult && bmiResult.bmi !== undefined ? Number(bmiResult.bmi).toFixed(1) : '-'}</span>
                <span className="font-label-md text-label-md text-on-surface-variant mt-2">kg/m²</span>
              </div>
              
              {/* Category Info */}
              <div className="flex flex-col gap-4 text-center md:text-left w-full">
                <div>
                  <h3 className="font-headline-lg text-headline-lg text-primary mb-1">{bmiResult?.category || 'Belum dihitung'}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{bmiResult?.tips?.[0] || 'Masukkan berat dan tinggi badan Anda untuk melihat hasil BMI.'}</p>
                </div>
                {/* Scale Bar */}
                <div className="mt-4 w-full">
                  <div className="flex justify-between font-label-sm text-[10px] text-on-surface-variant mb-1 uppercase tracking-wider">
                    <span>Under</span>
                    <span className="text-primary font-bold">Normal</span>
                    <span>Over</span>
                    <span>Obese</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
                    <div className="h-full bg-tertiary-container/60 w-1/4"></div>
                    <div className="h-full bg-primary w-1/4 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-sm z-10"></div>
                    </div>
                    <div className="h-full bg-[#f59e0b]/60 w-1/4"></div>
                    <div className="h-full bg-error/60 w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Health Tips Footer */}
            {bmiResult?.tips && bmiResult.tips.length > 1 && (
              <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="font-label-md text-label-md text-on-surface-variant mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lightbulb</span> Recommendations
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bmiResult.tips.slice(1).map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                      <span className="font-body-sm text-[14px] text-on-surface">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* History Section */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="font-label-md text-label-md text-on-surface-variant mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">history</span> Riwayat BMI
              </h4>
              {!user ? (
                <p className="text-on-surface-variant text-sm bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                  Silakan <a href="/login" className="text-primary hover:underline">Login</a> untuk melihat dan menyimpan riwayat BMI Anda.
                </p>
              ) : isHistoryLoading ? (
                <div className="flex justify-center"><span className="material-symbols-outlined animate-spin text-primary">refresh</span></div>
              ) : history.length > 0 ? (
                <div className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                  {history.map((item, idx) => (
                    <div key={idx} className="bg-surface-container border border-white/5 p-3 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="font-body-md text-on-surface">{item.bmi !== undefined ? Number(item.bmi).toFixed(1) : '-'}</span>
                        <span className="font-label-sm text-on-surface-variant">({item.category || '-'})</span>
                      </div>
                      <span className="font-label-sm text-on-surface-variant">{new Date(item.recordedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant text-sm">Belum ada riwayat BMI.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
