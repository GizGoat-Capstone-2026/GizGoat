import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest font-label-sm text-label-sm full-width border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-stack-md py-stack-lg px-gutter-desktop max-w-container-max mx-auto w-full">
      <div>
        <div className="font-headline-md text-headline-md text-primary-fixed-dim mb-4 flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
          <span className="material-symbols-outlined fill text-primary-fixed-dim">analytics</span>
          GizGOAT
        </div>
        <p className="text-on-surface-variant mt-2">© 2026 GizGOAT Health-Tech. All rights reserved.</p>
      </div>
      <div className="flex flex-wrap gap-4 md:justify-end items-center">
        <Link className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="#">Privacy Policy</Link>
        <Link className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="#">Terms of Service</Link>
        <Link className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="#">Cookie Policy</Link>
        <Link className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="#">Support</Link>
        <Link className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors" to="#">Contact</Link>
      </div>
    </footer>
  );
}
