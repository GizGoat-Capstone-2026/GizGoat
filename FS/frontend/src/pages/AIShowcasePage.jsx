import { Link } from 'react-router-dom';

export default function AIShowcasePage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-gutter-mobile md:px-gutter-desktop overflow-hidden bg-pattern">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-gradient-end/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-container-max mx-auto relative z-10 grid md:grid-cols-2 gap-stack-lg items-center">
          <div className="flex flex-col gap-stack-md">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Elite Health Performance</span>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-on-surface">
              Your Personal Health Coach, <br />
              <span className="gradient-text">Powered by AI</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              GizGOAT processes millions of biometric data points to deliver real-time, actionable insights. Optimize your workouts, master your nutrition, and accelerate recovery with elite-level intelligence.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/register" className="bg-primary text-background font-label-md text-label-md font-bold px-8 py-4 rounded-full btn-glow hover:bg-primary-fixed-dim transition-colors flex items-center gap-2">
                Start Optimizing
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden glass-panel flex items-center justify-center p-6">
            <img alt="Dashboard visualization" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa6t1XPsb4rZI9Jz2wNKn0QyZbbslEOSmsbIkoHVJlN7INhhLzCFQKpWooVH52KeqZ0_LFlKs1c9AGgeEqvPhSLVojvo1cnx0G9c2cYdtquezJEjWaowepyEi-kutM47tr5tTBEnVRRIPnseCCs9I8l9qiiT1kZGqBBc-OBIqd2ze7yN5e_r0Mjllpv3Sf6E5zaw3b92BZ6KRH-7yJGpwT-Iufd7g-bsD8ta_fXQGrC1BkD3H3jMJWbTqebhgC2E_z-OYMhT1DGA" />
            <div className="relative z-10 w-full max-w-md space-y-4">
              {/* Mock UI Element 1 */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 bg-background-deep/80">
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="text-primary font-label-md">98%</span>
                </div>
                <div>
                  <div className="font-label-sm text-on-surface-variant">Recovery Score</div>
                  <div className="font-headline-md text-on-surface">Optimal State</div>
                </div>
              </div>
              {/* Mock UI Element 2 */}
              <div className="glass-panel rounded-xl p-4 bg-background-deep/80 translate-x-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-sm text-on-surface-variant">AI Workout Suggestion</span>
                  <span className="material-symbols-outlined text-accent-gradient-end text-sm">psychology</span>
                </div>
                <div className="font-body-md text-on-surface">HIIT Interval Focus</div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="w-3/4 h-full bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-gutter-mobile md:px-gutter-desktop relative">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mb-4">Intelligent Health Mastery</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Our proprietary AI engine translates your raw biometric data into precise, highly personalized daily protocols.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
            {/* Feature 1: Workouts */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 md:col-span-2 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient-start/5 rounded-full blur-[60px] group-hover:bg-accent-gradient-start/10 transition-colors"></div>
              <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-primary text-3xl">exercise</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-headline-md text-headline-md mb-2">Adaptive Workout Protocols</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Plans that evolve daily based on your sleep quality, HRV, and previous day's strain. Never under-train, never over-train.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-primary text-label-md font-bold cursor-pointer hover:text-primary-fixed-dim transition-colors">
                Explore Protocols <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
            {/* Feature 2: Nutrition */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group">
              <div class="absolute bottom-0 left-0 w-48 h-48 bg-accent-gradient-end/5 rounded-full blur-[50px] group-hover:bg-accent-gradient-end/10 transition-colors"></div>
              <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center border border-white/5">
                <span className="material-symbols-outlined text-accent-gradient-end text-3xl">restaurant</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md mb-2">Real-Time Nutrition</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Macro adjustments calculated instantly post-workout to optimize muscle synthesis and energy replenishment.</p>
              </div>
            </div>
            {/* Feature 3: Recovery */}
            <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group md:col-span-3">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center border border-white/5 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">bedtime</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md">Dynamic Recovery Scoring</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                    Understand your readiness to perform. GizGOAT analyzes your circadian rhythm and physiological stress markers to output a single, actionable readiness score every morning.
                  </p>
                </div>
                {/* Visual Element */}
                <div className="w-full md:w-1/3 h-32 flex items-center justify-center relative">
                  {/* Circular Gauge Mock */}
                  <div className="w-32 h-32 rounded-full border-[8px] border-surface-container-high relative flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                    <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="none" r="46" stroke="url(#grad-ai)" strokeDasharray="289" strokeDashoffset="40" strokeLinecap="round" strokeWidth="8"></circle>
                      <defs>
                        <linearGradient id="grad-ai" x1="0%" x2="100%" y1="0%" y2="0%">
                          <stop offset="0%" stopColor="#00D97E"></stop>
                          <stop offset="100%" stopColor="#38BDF8"></stop>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center">
                      <span className="block font-headline-lg text-primary">87</span>
                      <span className="block font-label-sm text-on-surface-variant uppercase tracking-widest">Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-gutter-mobile md:px-gutter-desktop">
        <div className="max-w-container-max mx-auto glass-panel rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          {/* Glowing background effect */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
            <div className="w-[800px] h-[400px] bg-primary blur-[150px] rounded-full"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-background-deep drop-shadow-lg max-w-3xl" style={{ color: 'white', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Stop Guessing. <br /> Start Optimizing.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface max-w-xl mx-auto opacity-90">
              Get Personalized Insights Today. Join the elite performers utilizing GizGOAT to push their human potential.
            </p>
            <Link to="/register" className="bg-primary text-background font-headline-md text-headline-md font-bold px-10 py-5 rounded-full btn-glow hover:bg-primary-fixed-dim transition-transform scale-100 hover:scale-105 active:scale-95 duration-200 mt-4">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
