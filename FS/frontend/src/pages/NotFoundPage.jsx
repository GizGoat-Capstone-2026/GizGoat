import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-deep text-center px-4 relative overflow-hidden">
      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="font-headline-xl text-[120px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end leading-none mb-2">404</h1>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Page Not Found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/dashboard"
          className="bg-primary text-on-primary-fixed font-label-md text-label-md px-8 py-3 rounded-lg hover:bg-primary-fixed-dim transition-all shadow-[0_0_15px_rgba(68,246,151,0.3)] hover:scale-105 active:scale-95"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
