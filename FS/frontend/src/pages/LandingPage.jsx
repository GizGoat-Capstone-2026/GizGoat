import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="flex-grow flex flex-col w-full relative">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-container rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-tertiary-container rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none translate-x-1/2"></div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto w-full flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 bg-surface-glass backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary-fixed-dim shadow-[0_0_8px_rgba(34,226,134,0.8)]"></span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Intelligent Health Cockpit</span>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface max-w-3xl mb-6">
          Track Your Health,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end">Own Your Goals</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
          Monitor your BMI, calories, sleep, and activity in one intelligent platform. Engineered for performance, designed for life.
        </p>
        <Link to="/register" className="font-label-md text-label-md bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,217,126,0.4)] hover:shadow-[0_0_30px_rgba(0,217,126,0.6)] transform hover:-translate-y-1 flex items-center gap-2">
          Mulai Sekarang
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
        
        {/* Hero Dashboard Preview (Abstracted) */}
        <div className="w-full max-w-5xl mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background-deep via-transparent to-transparent z-10"></div>
          <img alt="Dashboard Interface Preview" className="w-full rounded-2xl border border-white/10 shadow-2xl opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1v9Uyrm998LSxJfvcz7MwpzcmKZbdOSPXS9por7xAveLGsso5KZWGfvdr40_cJTRjJ9zaFw7bBXCJhSmC-IiqR4yArMZXhsQbEq_IwKW8WQTbiXrC3UqhtWKlTyYVPKQ-ssdLPr_Kk4deibBYNCk9kXyQ7z7Y5LqdrXUuU2hzykKq7mv7NETrkiw_ho3EUrfL23nMPF99FKbaHh9xRrQJs3fs7mCRVAyKZtTqk1_2_cbVQoApZ7mUC4E8bB7WnjJC79rhOwZoHg" />
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto w-full z-10">
        <div className="mb-16 text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">Precision Tracking Tools</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Everything you need to optimize your daily routine and achieve peak performance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* BMI Calculator (Large Span) */}
          <div className="lg:col-span-8 bg-surface-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between group hover:border-primary-fixed-dim/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-primary-fixed-dim/50 transition-colors">
                <span className="material-symbols-outlined text-primary-fixed-dim">monitor_weight</span>
              </div>
              <span className="bg-primary-container/10 text-primary-fixed-dim font-label-sm text-label-sm px-3 py-1 rounded-full border border-primary-fixed-dim/20">Core Metric</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">BMI Calculator</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Monitor your body mass index with precision. Get instant feedback on your current health status based on established medical guidelines.</p>
            </div>
          </div>
          {/* Calorie Tracker */}
          <div className="lg:col-span-4 bg-surface-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col group hover:border-primary-fixed-dim/30 transition-colors relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 mb-6">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">restaurant</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 text-xl">Calorie Tracker</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Log meals and stay on top of your nutritional goals with our extensive food database.</p>
            </div>
          </div>
          {/* Sleep Analysis */}
          <div className="lg:col-span-4 bg-surface-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col group hover:border-primary-fixed-dim/30 transition-colors relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-white/5 mb-6">
              <span className="material-symbols-outlined text-secondary-fixed">bedtime</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 text-xl">Sleep Analysis</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Understand your rest patterns for better recovery and improved daily energy levels.</p>
            </div>
          </div>
          {/* Recommendation Engine (Large Span) */}
          <div className="lg:col-span-8 bg-surface-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between group hover:border-primary-fixed-dim/30 transition-colors relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gradient-end/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center border border-white/5 group-hover:border-tertiary-fixed-dim/50 transition-colors">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">psychology</span>
              </div>
              <span className="bg-tertiary-container/10 text-tertiary-fixed-dim font-label-sm text-label-sm px-3 py-1 rounded-full border border-tertiary-fixed-dim/20">AI Powered</span>
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Recommendation Engine</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Personalized health insights powered by AI. Receive actionable advice tailored specifically to your unique biometrics and daily activity data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-gutter-mobile md:px-gutter-desktop max-w-container-max mx-auto w-full z-10 flex justify-center">
        <div className="bg-surface-container border border-white/10 rounded-2xl p-12 text-center max-w-3xl w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 to-transparent pointer-events-none"></div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 relative z-10">Ready to Optimize Your Health?</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 relative z-10">Join thousands of users who are already tracking their progress and owning their goals.</p>
          <Link to="/register" className="font-label-md text-label-md bg-primary-container text-on-primary-container px-8 py-4 rounded-xl hover:bg-primary transition-all duration-300 shadow-[0_0_20px_rgba(0,217,126,0.4)] relative z-10 inline-flex items-center gap-2">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </main>
  );
}
