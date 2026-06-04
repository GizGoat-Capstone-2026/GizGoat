import { Link, useLocation, useNavigate } from 'react-router-dom';
import geminiLogo from '../../assets/gemini-svg.svg';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollToFeatures = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-surface-glass backdrop-blur-md font-body-md text-body-md docked full-width top-0 sticky z-50 border-b border-white/10 shadow-sm flex justify-between items-center h-20 px-gutter-desktop max-w-container-max mx-auto w-full">
      <Link onClick={() => window.scrollTo(0, 0)} className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2 scale-95 active:scale-90 transition-transform" to="/">
        <img src={geminiLogo} alt="GizGOAT Logo" className="w-8 h-8" />
        GizGOAT
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="/#features" onClick={handleScrollToFeatures} className="text-on-surface hover:text-primary transition-all duration-300">Features</a>
        <Link className="text-on-surface hover:text-primary transition-all duration-300" to="/bmi">Calculators</Link>
        <Link className="text-on-surface hover:text-primary transition-all duration-300" to="/features/sleep">Sleep Tracker</Link>
        <Link className="text-on-surface hover:text-primary transition-all duration-300" to="/features/ai">AI Recommendations</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/login" className="hidden md:block font-label-md text-label-md text-on-surface hover:text-primary transition-colors py-2 px-4 rounded-lg">Login</Link>
        <Link to="/register" className="font-label-md text-label-md bg-primary-container text-on-primary-container px-6 py-2 rounded-lg hover:bg-primary transition-colors shadow-[0_0_15px_rgba(0,217,126,0.3)]">Get Started</Link>
      </div>
    </nav>
  );
}
