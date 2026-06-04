import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function WelcomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const userName = user?.name || 'User';

  useEffect(() => {
    // Navigate to dashboard after animation completes
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background-deep bg-pattern relative overflow-hidden">
      {/* Decorative glows to match landing page */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-gradient-end/10 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="font-headline-xl text-[40px] md:text-[60px] font-bold tracking-tight relative inline-block">
          {/* Background Text (Gray) */}
          <span className="text-surface-variant">Welcome, {userName}!</span>
          
          {/* Foreground Text (Gradient fill animation) */}
          <span 
            className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end"
            style={{ 
              animation: 'fillGradient 2s ease-in-out forwards' 
            }}
          >
            Welcome, {userName}!
          </span>
        </h1>
      </div>
      
      <style>{`
        @keyframes fillGradient {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
