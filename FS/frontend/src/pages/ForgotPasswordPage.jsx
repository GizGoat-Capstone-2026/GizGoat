import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side: Illustration & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative h-full items-center justify-center overflow-hidden">
        <img alt="GizGOAT App Illustration" className="absolute inset-0 w-full h-full object-cover z-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6DHF5kYFXHfRe2cvFzRQ3PCNigMbqWccMu0gHVERv-IPnKRiPJg9lvypzfgP7sBZUeGSTPG-zZJaAj5XofN0Ql18Vn7NbJxPrye7x406zdFZ17LuVj1QTn0iAYIwU7RoCgCeNMA2sObIkGpiPc_cv072z6GnTXeWY37KZ8xCSqWrZOy44i2IIDDwDtyvOVZ0lOBjKCPxo7NR80aPv43lGfAgWNfX0cT3FF4iA-yWqUPngNmcOw-xQd3eXXVmx4yfsW-41SXHUnQ" />
        {/* Atmospheric Gradient Blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background-deep pointer-events-none z-0"></div>
        {/* Glassmorphism Overlay for Branding */}
        <div className="relative z-10 bg-surface-glass backdrop-blur-[20px] border border-white/10 p-stack-lg rounded-[16px] flex flex-col items-center justify-center text-center max-w-md shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end opacity-30 rounded-t-[16px]"></div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold mb-4 drop-shadow-[0_0_15px_rgba(68,246,151,0.5)] tracking-tight">GizGOAT</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Track Your Health, Own Your Goals</p>
        </div>
      </div>
      
      {/* Right Side: Form Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-gutter-mobile lg:p-stack-lg relative z-10 bg-background-deep lg:bg-transparent">
        {/* Header / Logo Area for Mobile */}
        <div className="lg:hidden flex items-center justify-between w-full max-w-md mb-8 px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">health_and_safety</span>
            <span className="font-bold text-xl tracking-tight">GizGOAT</span>
          </div>
        </div>
        
        {/* Glassmorphism Card */}
        <div className="w-full max-w-md bg-surface-glass backdrop-blur-[20px] border border-white/10 rounded-[16px] p-[24px] lg:p-stack-lg shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end opacity-50"></div>
          <div className="mb-stack-md text-center lg:text-left">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">Lupa Password?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Masukkan email kamu, kami akan kirimkan link reset password untuk memulihkan akses ke akun GizGOAT kamu.</p>
          </div>
          
          <form className="space-y-stack-md flex flex-col" onSubmit={handleSubmit}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <input className="w-full bg-surface-container border border-white/10 rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50" id="email" placeholder="nama@email.com" type="email" required />
              </div>
            </div>
            
            <button 
              className={`w-full mt-4 text-on-primary font-headline-md text-headline-md py-3 rounded-lg flex justify-center items-center gap-2 transition-all drop-shadow-[0_0_12px_rgba(68,246,151,0.5)] active:scale-[0.98] ${
                status === 'success' ? 'bg-[#16a34a]' : 'bg-primary hover:bg-primary-fixed-dim'
              } ${status === 'loading' ? 'opacity-80 cursor-not-allowed' : ''}`} 
              type="submit"
              disabled={status !== 'idle'}
            >
              {status === 'idle' && 'Kirim Link Reset'}
              {status === 'loading' && (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span> Mengirim...
                </>
              )}
              {status === 'success' && (
                <>
                  <span className="material-symbols-outlined text-sm mr-2">check_circle</span> Link Terkirim!
                </>
              )}
            </button>
          </form>
          
          <div className="mt-stack-md pt-stack-md border-t border-white/10 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Ingat password kamu? <Link className="text-primary hover:text-primary-fixed-dim font-bold transition-colors" to="/login">Kembali ke Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
