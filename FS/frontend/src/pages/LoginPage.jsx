import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    setFieldErrors({});
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);
      toast.success('Login successful!');
      navigate('/welcome');
    } catch (error) {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        toast.error('Silakan periksa kembali input Anda.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
          {/* Inner Glow simulation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end opacity-30 rounded-t-[16px]"></div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-bold mb-4 drop-shadow-[0_0_15px_rgba(68,246,151,0.5)] tracking-tight">GizGOAT</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Track Your Health, Own Your Goals</p>
        </div>
      </div>
      
      {/* Right Side: Login Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-gutter-mobile lg:p-stack-lg relative z-10 bg-background-deep lg:bg-transparent">
        {/* Glassmorphism Login Card */}
        <div className="w-full max-w-md bg-surface-glass backdrop-blur-[20px] border border-white/10 rounded-[16px] p-[24px] lg:p-stack-lg shadow-2xl relative overflow-hidden">
          {/* Inner Glow simulation */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end opacity-50"></div>
          <div className="mb-stack-md text-center lg:text-left">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 tracking-tight">Welcome Back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your credentials to access your dashboard.</p>
          </div>
          
          <form className="space-y-stack-md flex flex-col" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <input 
                  className={`w-full bg-surface-container border ${fieldErrors.email ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg py-3 pl-10 pr-4 text-on-surface font-body-md text-body-md focus:ring-1 focus:outline-none transition-all placeholder:text-on-surface-variant/50`} 
                  id="email" 
                  placeholder="Enter your email" 
                  type="email" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                  }}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <input 
                  className={`w-full bg-surface-container border ${fieldErrors.password ? 'border-error focus:border-error focus:ring-error' : 'border-white/10 focus:border-primary focus:ring-primary'} rounded-lg py-3 pl-10 pr-12 text-on-surface font-body-md text-body-md focus:ring-1 focus:outline-none transition-all placeholder:text-on-surface-variant/50`} 
                  id="password" 
                  placeholder="Enter your password" 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                  }}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.password[0]}</p>
              )}
              <div className="flex justify-end mt-2">
                <Link className="font-label-sm text-label-sm text-tertiary hover:text-tertiary-container transition-colors" to="/forgot-password">Forgot Password?</Link>
              </div>
            </div>
            <button className="w-full mt-4 bg-primary text-on-primary font-headline-md text-headline-md py-3 rounded-lg hover:bg-primary-fixed-dim transition-all drop-shadow-[0_0_12px_rgba(68,246,151,0.5)] active:scale-[0.98]" type="submit">
              Login
            </button>
          </form>
          
          <div className="mt-stack-md pt-stack-md border-t border-white/10 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Don't have an account? <Link className="text-primary hover:text-primary-fixed-dim font-bold transition-colors" to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
