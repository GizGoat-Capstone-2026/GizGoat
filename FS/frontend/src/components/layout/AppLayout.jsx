import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/calculator', icon: 'calculate', label: 'Kalkulator BMI' },
    { path: '/activity', icon: 'directions_run', label: 'Activity Tracker' },
    { path: '/calories', icon: 'local_fire_department', label: 'Calories' },
    { path: '/sleep', icon: 'bedtime', label: 'Sleep Tracker' },
    { path: '/recommendations', icon: 'auto_awesome', label: 'AI Recs' },
    { path: '/settings', icon: 'settings', label: 'Pengaturan' }
  ];

  return (
    <div className="flex min-h-screen bg-background-deep text-on-surface w-full overflow-x-hidden">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-72 bg-black/20 border-r border-white/5 sticky top-0 h-screen p-6">
        <div className="mb-16 px-3">
          <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)} className="font-headline-md text-headline-md font-bold text-primary tracking-tight inline-block hover:opacity-80 transition-opacity">GizGOAT</Link>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined" style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4">

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-error/10 text-error hover:bg-error/20 border border-error/20 transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 pb-24 md:pb-6 relative max-w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0D1B2A]/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-around items-center z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              isActive(item.path) ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={logout}
          className="flex flex-col items-center gap-1 text-error"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>
    </div>
  );
}
