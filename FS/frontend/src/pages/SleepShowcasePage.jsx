import { Link } from 'react-router-dom';

export default function SleepShowcasePage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto">
        {/* Decorative atmospheric glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
          <div className="flex flex-col gap-stack-md z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit border border-primary/20 font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">bedtime</span>
              Advanced Sleep Analytics
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-on-surface">
              Master Your Rest,<br />
              <span className="text-gradient">Maximize Your Performance.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Transform your nights into a strategic advantage. GizGOAT tracks every micro-phase of your sleep, translating raw physiological data into actionable insights that fuel your daytime fitness and cognitive peaks.
            </p>
            <div className="flex gap-4 mt-4">
              <Link to="/register" className="bg-primary text-background font-label-md text-label-md px-8 py-4 rounded-full btn-glow hover:bg-primary-fixed-dim transition-colors font-bold flex items-center justify-center">Start Tracking</Link>
            </div>
          </div>
          <div className="relative z-10 w-full aspect-square md:aspect-[4/3] rounded-xl overflow-hidden glass-panel flex items-center justify-center p-8">
            {/* Placeholder for Hero Graphic */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-background-deep -z-10"></div>
            <img alt="Sleep tracking dashboard" className="w-full h-full object-cover rounded-lg opacity-80 mix-blend-screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9Yqo10V5m9crsyhaJGSMfN74b31sv-KKdYW_oweGPNJJDrkmZDyIGl6OA2ojLRnWGrjfmrsql8BYwkKcILNzDqfhqIZK_Ks6Sm7q1GtHu0sfR4MTJArX4OGvHciuqPqWsFmnQJX_bQRWigNFh2ZcqFDPriOs89rSz0dm3aaLaaCyrF4lweitFwCv2E5URA_LW6jcijXq0ZgTa_re6mXkCVtLlfr4twIJJmpoFuYHBl6KhUWJedlq9uNHYSC4FqUjM8kXrvUHYKQ" />
            {/* Floating UI elements overlay to simulate data */}
            <div className="absolute bottom-8 right-8 glass-panel p-4 rounded-lg flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 rounded-full border-4 border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold">85</span>
              </div>
              <div>
                <div className="text-label-sm font-label-sm text-on-surface-variant">Sleep Score</div>
                <div className="text-primary font-label-md text-label-md">Excellent Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Precision Data for Elite Recovery</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">Stop guessing how well you slept. Our clinical-grade algorithms break down your night so you can dominate your day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md auto-rows-[300px]">
          {/* Feature 1: Deep Sleep Phase (Large) */}
          <div className="glass-panel rounded-xl p-8 md:col-span-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient-start/10 blur-[60px] rounded-full group-hover:bg-accent-gradient-start/20 transition-all"></div>
            <div className="flex flex-col h-full z-10 relative">
              <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>waves</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Deep Sleep Phase Analysis</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Understand the exact moments your body rebuilds muscle and restores cognitive function. We track REM, Light, and Deep sleep cycles with pinpoint accuracy.</p>
              <div className="mt-auto h-24 flex items-end gap-2">
                {/* Simulated Bar Chart */}
                <div className="w-full bg-surface-container/50 rounded-full h-8 overflow-hidden flex">
                  <div className="h-full bg-secondary-container w-[20%]"></div>
                  <div className="h-full bg-primary/40 w-[50%]"></div>
                  <div className="h-full bg-accent-gradient-start w-[30%]"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Feature 2: Smart Alarm (Small) */}
          <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
            <div className="flex flex-col h-full z-10 relative">
              <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>alarm</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 text-lg">Smart Alarm Suggestions</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-auto">Wake up during your lightest sleep phase feeling refreshed, never groggy. GizGOAT predicts the optimal 30-minute window to wake you.</p>
            </div>
          </div>
          {/* Feature 3: 7-Day Trends (Small) */}
          <div className="glass-panel rounded-xl p-8 relative overflow-hidden">
            <div className="flex flex-col h-full z-10 relative">
              <div className="bg-surface-container-highest w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 text-lg">7-Day Sleep Trends</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-auto">Spot patterns in your recovery. Correlate your workout intensity with your sleep quality over the past week to optimize your training schedule.</p>
            </div>
          </div>
          {/* Promotional Metric (Medium) */}
          <div className="glass-panel rounded-xl p-8 md:col-span-2 relative overflow-hidden flex items-center border-t border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <div className="flex items-center gap-8 z-10">
              <div className="text-6xl font-headline-xl text-primary font-bold">+24%</div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Faster Recovery Times</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Users who optimize their sleep cycles with GizGOAT report significantly reduced muscle soreness and faster return to peak performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto mb-20">
        <div className="glass-panel rounded-2xl p-12 text-center relative overflow-hidden border-primary/30">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent -z-10"></div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-6">Ready to Optimize Your Sleep?</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">Join thousands of high-performers who are treating rest as their most important workout. Start tracking tonight.</p>
          <Link to="/register" className="bg-primary text-background font-headline-md text-[18px] px-10 py-5 rounded-full btn-glow hover:bg-primary-fixed-dim transition-transform scale-100 hover:scale-105 active:scale-95 font-bold inline-block">
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
