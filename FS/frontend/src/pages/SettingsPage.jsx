import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    job: 'Pilih Pekerjaan',
    gender: 'Laki-laki',
    height: '',
    weight: '',
    targetSteps: 10000,
    targetCalories: '',
    targetCarbs: '',
    targetProtein: '',
    targetFat: '',
    avatarUrl: ''
  });
  const fileInputRef = useRef(null);

  const { updateUser, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const data = response.data;
        setProfile({
          name: data.name || '',
          email: data.email || '',
          age: data.age || '',
          job: data.occupation || 'Pilih Pekerjaan',
          gender: data.gender === 'female' ? 'Perempuan' : 'Laki-laki',
          height: data.height || '',
          weight: data.weight || '',
          targetSteps: data.dailyStepsTarget || 10000,
          targetCalories: data.dailyCalorieTarget || '',
          targetCarbs: data.dailyCarbsTarget || '',
          targetProtein: data.dailyProteinTarget || '',
          targetFat: data.dailyFatTarget || '',
          avatarUrl: data.avatarUrl || ''
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const stepChange = (amount) => {
    setProfile(prev => ({ ...prev, targetSteps: Math.max(0, prev.targetSteps + amount) }));
  };

  const calorieChange = (amount) => {
    setProfile(prev => ({ ...prev, targetCalories: Math.max(0, (Number(prev.targetCalories) || 2000) + amount) }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfile(prev => ({ ...prev, avatarUrl: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('loading');
    setFieldErrors({});
    try {
      await api.put('/users/profile', {
        name: profile.name,
        age: Number(profile.age) || undefined,
        occupation: profile.job !== 'Pilih Pekerjaan' ? profile.job : undefined,
        gender: profile.gender === 'Perempuan' ? 'female' : 'male',
        height: Number(profile.height) || undefined,
        weight: Number(profile.weight) || undefined,
        dailyStepsTarget: Number(profile.targetSteps) || 10000,
        dailyCalorieTarget: Number(profile.targetCalories) || null,
        dailyCarbsTarget: Number(profile.targetCarbs) || null,
        dailyProteinTarget: Number(profile.targetProtein) || null,
        dailyFatTarget: Number(profile.targetFat) || null,
        avatarUrl: profile.avatarUrl || null
      });
      updateUser({ name: profile.name, email: profile.email, avatarUrl: profile.avatarUrl });
      setSaveStatus('success');
      toast.success('Profile updated');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('idle');
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        toast.error('Silakan periksa kembali form profil Anda.');
      } else {
        toast.error('Failed to update profile');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun? Semua data akan hilang permanen.')) {
      try {
        await api.delete('/users/profile');
        toast.success('Akun berhasil dihapus');
        logout();
      } catch (error) {
        toast.error('Gagal menghapus akun');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl w-full mx-auto pb-16">
      {/* Page Header */}
      <div className="mb-10">
        <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-2">Pengaturan</h2>
        
        {/* Tabs */}
        <div className="flex bg-white/5 rounded-lg p-1 w-max mt-6 border border-white/10">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2 rounded-md font-label-md transition-colors ${activeTab === 'profile' ? 'bg-surface-glass text-primary shadow-[0_0_10px_rgba(68,246,151,0.2)] border border-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`px-6 py-2 rounded-md font-label-md transition-colors ${activeTab === 'security' ? 'bg-surface-glass text-primary shadow-[0_0_10px_rgba(68,246,151,0.2)] border border-primary/20' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Keamanan
          </button>
        </div>
      </div>
      
      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="mb-6 p-6 bg-surface-glass backdrop-blur-[12px] border border-white/10 rounded-xl flex items-start gap-6 border-l-4 border-l-primary">
            <span className="material-symbols-outlined text-primary mt-1">lightbulb</span>
            <p className="font-body-md text-body-md text-on-surface">
              Data pekerjaan kamu akan digunakan untuk personalisasi rekomendasi kesehatan.
            </p>
          </div>
          {/* 1. Informasi Pribadi */}
          <section className="bg-surface-glass backdrop-blur-[12px] border border-white/10 p-6 md:p-10 rounded-xl">
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-primary">person_edit</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Informasi Pribadi</h3>
            </div>
            
            <div className="flex flex-col md:flex-row gap-10">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleImageChange} 
                />
                <div 
                  className="relative w-32 h-32 rounded-full border-4 border-primary p-1 bg-black/20 overflow-hidden group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <img 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover rounded-full" 
                    src={profile.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBncBh1DJvzGuc4sh9KJfDoGW4W-yWq79o1Df6TCI06AcNxosDZCD2u2BtSLNnTWwWJfSuzVIVhpdn5nT3vLKB5Ow_b3QMYYyU_QxAbyt1pstwzcL2aPqokXTryJlCa15wVX4jm5WmvteFXE463pi62ZKnNGMPwEs0SDkJbBQynXHBqASi6AKLx0FFI_uJFK-5OgmcNL9RbucfJ5ZKo9aeAPkG30I-YDavGRFRDwZmJwkHq8t0Dbyj6kumpsNgKsa9ZB7SzI7bA7A"} 
                  />
                  <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-on-primary">photo_camera</span>
                  </div>
                </div>
                <button 
                  className="text-primary font-label-sm text-label-sm hover:underline" 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Ganti Foto
                </button>
              </div>
              
              {/* Fields Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Nama Lengkap</label>
                  <input name="name" value={profile.name} onChange={handleChange} className={`w-full bg-white/5 border ${fieldErrors.name ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1`} type="text" />
                  {fieldErrors.name && <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.name[0]}</p>}
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Email</label>
                  <input name="email" value={profile.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface-variant cursor-not-allowed" disabled type="email" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Usia</label>
                  <input name="age" value={profile.age} onChange={handleChange} className={`w-full bg-white/5 border ${fieldErrors.age ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1`} type="number" />
                  {fieldErrors.age && <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.age[0]}</p>}
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Pekerjaan</label>
                  <select name="job" value={profile.job} onChange={handleChange} className={`w-full bg-white/5 border ${fieldErrors.job ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface appearance-none focus:outline-none focus:ring-1`}>
                    <option className="bg-[#0D1B2A]">Pilih Pekerjaan</option>
                    <option className="bg-[#0D1B2A]" value="Pekerja Kantoran">Pekerja Kantoran</option>
                    <option className="bg-[#0D1B2A]" value="Pelajar/Mahasiswa">Pelajar/Mahasiswa</option>
                    <option className="bg-[#0D1B2A]" value="Pekerja Lapangan">Pekerja Lapangan</option>
                    <option className="bg-[#0D1B2A]" value="Wirausaha">Wirausaha</option>
                    <option className="bg-[#0D1B2A]" value="Tenaga Kesehatan">Tenaga Kesehatan</option>
                    <option className="bg-[#0D1B2A]" value="Lainnya">Lainnya</option>
                  </select>
                  {fieldErrors.job && <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.job[0]}</p>}
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Jenis Kelamin</label>
                  <div className="flex gap-10 mt-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={profile.gender === 'Laki-laki'} onChange={handleChange} value="Laki-laki" className="w-5 h-5 text-primary bg-white/5 border-white/20 focus:ring-primary focus:ring-offset-0" name="gender" type="radio" />
                      <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Laki-laki</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked={profile.gender === 'Perempuan'} onChange={handleChange} value="Perempuan" className="w-5 h-5 text-primary bg-white/5 border-white/20 focus:ring-primary focus:ring-offset-0" name="gender" type="radio" />
                      <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors">Perempuan</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 2. Data Fisik */}
          <section className="bg-surface-glass backdrop-blur-[12px] border border-white/10 p-6 md:p-10 rounded-xl">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">monitor_weight</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Data Fisik</h3>
              </div>
              <div className="flex items-center gap-1 px-6 py-1 bg-primary/20 rounded-full border border-primary/30">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                  BMI Terkini: {profile.height && profile.weight ? (profile.weight / Math.pow(profile.height/100, 2)).toFixed(1) : '-'}
                </span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant">Tinggi Badan (cm)</label>
                <div className="relative">
                  <input name="height" value={profile.height} onChange={handleChange} className={`w-full bg-white/5 border ${fieldErrors.height ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface pr-12 focus:outline-none focus:ring-1`} type="number" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-sm">cm</span>
                </div>
                {fieldErrors.height && <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.height[0]}</p>}
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant">Berat Badan (kg)</label>
                <div className="relative">
                  <input name="weight" value={profile.weight} onChange={handleChange} className={`w-full bg-white/5 border ${fieldErrors.weight ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-6 py-3 font-body-md text-body-md text-on-surface pr-12 focus:outline-none focus:ring-1`} type="number" />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-sm">kg</span>
                </div>
                {fieldErrors.weight && <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.weight[0]}</p>}
              </div>
            </div>
          </section>
          
          {/* 3. Target Aktivitas */}
          <section className="bg-surface-glass backdrop-blur-[12px] border border-white/10 p-6 md:p-10 rounded-xl">
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-primary">directions_run</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Target Aktivitas</h3>
            </div>
            <div className="max-w-md space-y-6">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant">Target Langkah Harian</label>
                <div className="flex items-center gap-6">
                  <div className="flex-1 relative">
                    <input className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-10 py-6 text-center font-headline-md text-headline-md text-primary tracking-[0.2em] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" readOnly type="text" value={profile.targetSteps.toLocaleString('id-ID')} />
                    <div className="absolute inset-y-0 left-0 px-6 flex items-center">
                      <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors" onClick={() => stepChange(-500)} type="button">
                        <span className="material-symbols-outlined text-primary">remove</span>
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 px-6 flex items-center">
                      <button className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors" onClick={() => stepChange(500)} type="button">
                        <span className="material-symbols-outlined text-primary">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <span className="font-label-sm text-label-sm italic">Rekomendasi WHO: 8.000 - 10.000 langkah/hari</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Target Kalori */}
          <section className="bg-surface-glass backdrop-blur-[12px] border border-white/10 p-6 md:p-10 rounded-xl">
            <div className="flex items-center gap-3 mb-10">
              <span className="material-symbols-outlined text-primary">local_dining</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Target Kalori & Macros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Target Kalori */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant">Target Kalori Harian</label>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 relative">
                      <input 
                        name="targetCalories" 
                        onChange={handleChange}
                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl px-12 py-6 text-center font-headline-md text-headline-md text-primary tracking-wide focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-on-surface-variant/40" 
                        type="number" 
                        placeholder="Otomatis"
                        value={profile.targetCalories} 
                      />
                      <div className="absolute inset-y-0 left-0 px-4 flex items-center">
                        <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors" onClick={() => calorieChange(-100)} type="button">
                          <span className="material-symbols-outlined text-primary">remove</span>
                        </button>
                      </div>
                      <div className="absolute inset-y-0 right-0 px-4 flex items-center">
                        <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors" onClick={() => calorieChange(100)} type="button">
                          <span className="material-symbols-outlined text-primary">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 text-on-surface-variant bg-white/5 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-sm mt-0.5 text-primary">info</span>
                    <span className="font-label-sm text-label-sm leading-relaxed">
                      Kosongkan input ini jika Anda ingin sistem menghitung target kalori ideal secara otomatis berdasarkan profil BMI Anda.
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Macros */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="font-label-md text-label-md text-on-surface-variant">Target Macros (opsional)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-label-sm text-xs text-on-surface-variant">Karbohidrat (g)</label>
                      <input name="targetCarbs" value={profile.targetCarbs} onChange={handleChange} placeholder="250" className={`w-full bg-white/5 border ${fieldErrors.dailyCarbsTarget ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1`} type="number" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-xs text-on-surface-variant">Protein (g)</label>
                      <input name="targetProtein" value={profile.targetProtein} onChange={handleChange} placeholder="180" className={`w-full bg-white/5 border ${fieldErrors.dailyProteinTarget ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1`} type="number" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-label-sm text-xs text-on-surface-variant">Lemak (g)</label>
                      <input name="targetFat" value={profile.targetFat} onChange={handleChange} placeholder="70" className={`w-full bg-white/5 border ${fieldErrors.dailyFatTarget ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1`} type="number" />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3 text-on-surface-variant bg-white/5 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-sm mt-0.5 text-primary">info</span>
                    <span className="font-label-sm text-label-sm leading-relaxed">
                      Biarkan kosong untuk menggunakan nilai rekomendasi standar (Karbo: 250g, Protein: 180g, Lemak: 70g).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Actions */}
          <div className="pt-6">
            <button 
              className={`w-full text-on-primary font-headline-md text-headline-md py-6 rounded-xl shadow-[0_0_20px_rgba(0,217,126,0.3)] transform active:scale-95 transition-all flex items-center justify-center gap-3 ${saveStatus === 'success' ? 'bg-tertiary-container' : 'bg-primary hover:shadow-[0_0_35px_rgba(0,217,126,0.5)]'} ${saveStatus === 'loading' ? 'opacity-80' : ''}`}
              type="submit"
              disabled={saveStatus !== 'idle'}
            >
              {saveStatus === 'idle' && (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                  Simpan Perubahan
                </>
              )}
              {saveStatus === 'loading' && (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span> Menyimpan...
                </>
              )}
              {saveStatus === 'success' && (
                <>
                  <span className="material-symbols-outlined">check_circle</span> Berhasil Disimpan
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SECURITY TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Form Card (Glassmorphism) */}
          <div className="bg-surface-glass backdrop-blur-xl rounded-xl border border-white/5 p-6 md:p-8 relative overflow-hidden">
            {/* Subtle Inner Top Glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[28px]">password</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Ganti Password</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Pastikan password baru Anda kuat dan belum pernah digunakan.</p>
              </div>
            </div>
            
            <form className="space-y-6 max-w-xl">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="current_password">Password Saat Ini</label>
                <div className="relative">
                  <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" id="current_password" placeholder="Masukkan password saat ini" type={showCurrentPassword ? "text" : "password"} />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-white/10 my-4"></div>
              
              {/* New Password */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="new_password">Password Baru</label>
                <div className="relative">
                  <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" id="new_password" placeholder="Minimal 8 karakter" type={showNewPassword ? "text" : "password"} />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>

              </div>
              
              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirm_password">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder-on-surface-variant/50" id="confirm_password" placeholder="Ulangi password baru" type={showConfirmPassword ? "text" : "password"} />
                  <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors" type="button">
                    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>
              
              {/* Action Area */}
              <div className="pt-6 flex justify-end gap-4 border-t border-white/10">
                <button className="px-6 py-3 rounded-lg font-label-md text-label-md font-bold text-on-surface hover:bg-white/10 transition-colors" type="button">
                  Batal
                </button>
                <button className="px-8 py-3 rounded-lg font-label-md text-label-md font-bold bg-primary text-on-primary-fixed hover:bg-primary-fixed-dim transition-all shadow-[0_0_15px_rgba(68,246,151,0.3)] hover:scale-[1.02] active:scale-95 flex items-center gap-2" type="button">
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-error/10 backdrop-blur-xl rounded-xl border border-error/30 p-6 md:p-8">
            <h3 className="font-headline-md text-headline-md text-error mb-2">Danger Zone</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Menghapus akun Anda akan menghapus semua data, riwayat kesehatan, dan pengaturan Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <button 
              onClick={handleDeleteAccount}
              className="px-6 py-3 bg-error text-white font-label-md rounded-lg hover:brightness-110 transition-colors flex items-center gap-2 shadow-sm border border-error/30"
              type="button"
            >
              <span className="material-symbols-outlined">delete_forever</span>
              Hapus Akun Permanen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
