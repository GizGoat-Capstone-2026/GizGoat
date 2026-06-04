import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        toast.error('Silakan periksa kembali form registrasi.');
      } else {
        toast.error(error.response?.data?.message || 'Registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Side: Illustration & Branding (Hidden on small mobile, visible on md+) */}
      <section className="hidden md:flex md:w-1/2 relative bg-surface overflow-hidden">
        {/* Background Illustration */}
        <img alt="Decorative health technology background" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6DHF5kYFXHfRe2cvFzRQ3PCNigMbqWccMu0gHVERv-IPnKRiPJg9lvypzfgP7sBZUeGSTPG-zZJaAj5XofN0Ql18Vn7NbJxPrye7x406zdFZ17LuVj1QTn0iAYIwU7RoCgCeNMA2sObIkGpiPc_cv072z6GnTXeWY37KZ8xCSqWrZOy44i2IIDDwDtyvOVZ0lOBjKCPxo7NR80aPv43lGfAgWNfX0cT3FF4iA-yWqUPngNmcOw-xQd3eXXVmx4yfsW-41SXHUnQ" />
        {/* Dark Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-deep via-background-deep/40 to-transparent"></div>
        {/* Glassmorphism Branding Card */}
        <div className="relative z-10 m-auto mt-auto mb-stack-lg mx-stack-lg p-stack-md bg-surface-glass backdrop-blur-[20px] border border-white/10 rounded-2xl w-full max-w-[80%]">
          <h1 className="font-headline-xl text-primary font-bold tracking-tight mb-2">GizGOAT</h1>
          <p className="font-headline-md text-on-surface">Track Your Health, Own Your Goals</p>
        </div>
      </section>

      {/* Right Side: Registration Form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-gutter-mobile md:p-gutter-desktop relative">
        {/* Optional subtle background glow on the right side */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>
        {/* Glassmorphism Form Card */}
        <div className="relative z-10 w-full max-w-[440px] bg-surface-glass backdrop-blur-[20px] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="mb-8 text-center md:text-left">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-on-surface font-bold mb-2">Create Account</h2>
            <p className="font-body-md text-on-surface-variant">Join GizGOAT to start your journey.</p>
          </div>
          <form className="flex flex-col gap-stack-sm" onSubmit={handleRegister}>
            {/* Full Name Field */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </span>
                <input className={`w-full bg-surface-container-highest/50 border ${fieldErrors.name ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-colors font-body-md`} id="fullName" name="fullName" placeholder="John Doe" required type="text" value={formData.fullName} onChange={handleChange} />
              </div>
              {fieldErrors.name && (
                <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.name[0]}</p>
              )}
            </div>
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </span>
                <input className={`w-full bg-surface-container-highest/50 border ${fieldErrors.email ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-colors font-body-md`} id="email" name="email" placeholder="john@example.com" required type="email" value={formData.email} onChange={handleChange} />
              </div>
              {fieldErrors.email && (
                <p className="text-error font-body-sm text-sm mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>
            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input className={`w-full bg-surface-container-highest/50 border ${fieldErrors.password ? 'border-error focus:border-error focus:ring-error' : 'border-outline-variant focus:border-primary focus:ring-primary'} rounded-lg pl-10 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 transition-colors font-body-md`} id="password" name="password" placeholder="••••••••" required type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
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
            </div>
            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface-variant" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </span>
                <input className="w-full bg-surface-container-highest/50 border border-outline-variant rounded-lg pl-10 pr-12 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
            </div>
            {/* Submit Button */}
            <button className="mt-4 w-full bg-primary text-on-primary font-headline-md text-[18px] py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed-dim transition-all duration-300 transform active:scale-[0.98]" disabled={isLoading} type="submit">
              {isLoading ? 'Registering...' : 'Register'}
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </form>
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="font-body-md text-on-surface-variant">
              Already have an account? 
              <Link className="font-bold text-primary hover:text-primary-fixed-dim transition-colors ml-1" to="/login">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
