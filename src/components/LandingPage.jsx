// src/components/LandingPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, ArrowRight, Zap, Shield, BarChart3, Menu, X, Globe, 
  Smartphone, Lock, CheckCircle, UserPlus, Target, DollarSign, 
  ChevronDown, Activity, Star, Quote
} from 'lucide-react';

// --- Animated Counter ---
const AnimatedCounter = ({ end, prefix = "", suffix = "", start }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const duration = 2000; 
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);

      if (progress < 1) {
        setCount(Math.floor(easeProgress * end));
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [start, end]);

  return <span>{prefix}{count}{suffix}</span>;
};

// --- Scroll Reveal Animation Wrapper ---
const FadeInWrapper = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } 
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const LandingPage = ({ onLaunch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); 
  const [startCounters, setStartCounters] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const trustBarRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCounters(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (trustBarRef.current) observer.observe(trustBarRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  const faqs = [
    { q: "What is Fixed-Time Trading?", a: "Fixed-Time Trading involves predicting whether an asset's price will go UP or DOWN within a specific timeframe (e.g., 60 seconds). If your prediction is correct, you earn a fixed payout." },
    { q: "How much is the minimum deposit?", a: "The minimum deposit for a real account is $10. However, you can use our $10,000 Demo Account completely free to practice your strategies." },
    { q: "Can I trade on my mobile phone?", a: "Yes! Our terminal is 100% web-based and highly optimized for all mobile devices. You don't need to download any apps." },
    { q: "How fast are withdrawals processed?", a: "Withdrawals are processed automatically and typically reach your wallet or bank account within 24 hours." }
  ];

  return (
    <div className="min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-[#030712] text-white font-sans scroll-smooth relative selection:bg-blue-500/30">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-blue-600/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-emerald-600/15 blur-[120px] rounded-full animate-float-delayed" />
        <div className="absolute top-[70%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-600/10 blur-[120px] rounded-full animate-float" />
      </div>

      {/* --- AUTH MODAL --- */}
      {authModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 animate-fade-in-down">
          <div className="bg-gradient-to-b from-[#111827] to-[#030712] border border-white/10 border-t-white/20 p-6 md:p-8 rounded-3xl w-full max-w-md relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-lg">CURENZA<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> FX</span></span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{authModal === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Live server connections are being established in Phase 2. For now, please enter the Demo environment.</p>
            <div className="space-y-4 mb-6">
              <input type="email" placeholder="Email Address" className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
              <input type="password" placeholder="Password" className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-white text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all" />
            </div>
            <button onClick={() => { setAuthModal(null); onLaunch(); }} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2">
              Launch Demo Terminal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 flex items-center justify-between px-4 md:px-8 lg:px-12 py-5 bg-[#030712]/80 backdrop-blur-2xl border-b border-white/5 sticky top-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="p-1.5 bg-blue-500/10 rounded-lg"><TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" /></div>
          <span className="font-bold text-xl lg:text-2xl tracking-wide">CURENZA<span className="text-blue-500"> FX</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-gray-400">
          <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it Works</button>
          <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollToSection('platform')} className="hover:text-white transition-colors">Platform</button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">FAQ</button>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <button onClick={() => setAuthModal('login')} className="text-sm font-bold text-gray-300 hover:text-white transition-colors px-4 py-2">Log In</button>
          <button onClick={() => setAuthModal('signup')} className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">Sign Up</button>
        </div>
        <button className="lg:hidden p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg active:scale-95 border border-white/5" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* --- PREMIUM MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#030712]/95 backdrop-blur-3xl lg:hidden flex flex-col animate-fade-in-down">
          <div className="flex justify-between items-center p-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-xl">CURENZA<span className="text-blue-500"> FX</span></span>
            </div>
            <button className="p-2 text-gray-300 hover:text-white bg-white/5 border border-white/5 rounded-lg active:scale-95" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col gap-6 text-2xl font-extrabold text-gray-400 px-8 mt-12">
            <button onClick={() => scrollToSection('how-it-works')} className="text-left hover:text-white hover:pl-2 transition-all">How it Works</button>
            <button onClick={() => scrollToSection('features')} className="text-left hover:text-white hover:pl-2 transition-all">Features</button>
            <button onClick={() => scrollToSection('platform')} className="text-left hover:text-white hover:pl-2 transition-all">Platform</button>
            <button onClick={() => scrollToSection('faq')} className="text-left hover:text-white hover:pl-2 transition-all">FAQ</button>
          </div>
          <div className="mt-auto flex flex-col gap-3 p-6 border-t border-white/5 bg-white/[0.02]">
            <button onClick={() => { setIsMobileMenuOpen(false); setAuthModal('login'); }} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">Log In</button>
            <button onClick={() => { setIsMobileMenuOpen(false); setAuthModal('signup'); }} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-transform">Sign Up</button>
            <button onClick={() => { setIsMobileMenuOpen(false); onLaunch(); }} className="w-full mt-2 text-emerald-400 font-bold text-sm py-2">Skip & Try Free Demo →</button>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-16 pb-32 md:pt-28 md:pb-40 min-h-[85vh]">
        <FadeInWrapper>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-400 text-[11px] md:text-xs font-bold mb-8 shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Terminal V2 Architecture Now Live
          </div>
        </FadeInWrapper>
        
        <FadeInWrapper delay={150}>
          <h1 className="text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter mb-6 max-w-5xl leading-[1.05]">
            Master the Markets with <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
              Split-Second Precision.
            </span>
          </h1>
        </FadeInWrapper>

        <FadeInWrapper delay={300}>
          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-2 font-medium">
            Experience next-generation fixed-time trading with up to 82% payouts. Instant execution, deep liquidity, and a professional-grade interface.
          </p>
        </FadeInWrapper>
        
        <FadeInWrapper delay={450}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
            <button onClick={() => setAuthModal('signup')} className="w-full sm:w-auto group relative flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 active:scale-95 text-white px-8 py-4 md:px-10 md:py-4 rounded-xl text-base font-bold transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Create Real Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onLaunch} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-4 md:px-10 md:py-4 rounded-xl text-base font-bold transition-all active:scale-95">
              Launch $10K Demo
            </button>
          </div>
        </FadeInWrapper>
      </section>

      {/* --- FLOATING TRUST BAR --- */}
      {/* FIX: Raised up to overlap the hero section perfectly */}
      <div ref={trustBarRef} className="relative z-20 max-w-5xl mx-auto -mt-20 md:-mt-28 mb-16 md:mb-32 px-4">
        <div className="bg-[#111827]/80 backdrop-blur-2xl border border-white/10 border-t-white/20 rounded-3xl p-6 md:p-8 shadow-2xl shadow-blue-900/20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-x-0 md:divide-x divide-white/10 text-center">
          <div className="pb-4 md:pb-0 border-b md:border-b-0 border-white/10">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">
              <AnimatedCounter end={2} suffix="M+" start={startCounters} />
            </div>
            <div className="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-widest">Active Traders</div>
          </div>
          <div className="pb-4 md:pb-0 border-b md:border-b-0 border-white/10">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">
              <AnimatedCounter end={82} suffix="%" start={startCounters} />
            </div>
            <div className="text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-widest">Max Payout</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">
              <AnimatedCounter prefix="<" end={10} suffix="ms" start={startCounters} />
            </div>
            <div className="text-[10px] md:text-xs text-cyan-400 font-bold uppercase tracking-widest">Execution Speed</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">
              <AnimatedCounter end={24} suffix="/7" start={startCounters} />
            </div>
            <div className="text-[10px] md:text-xs text-purple-400 font-bold uppercase tracking-widest">Market Access</div>
          </div>
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="relative z-10 px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <FadeInWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">Start Trading in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">3 Easy Steps.</span></h2>
            <p className="text-gray-400 text-base md:text-lg px-2">No complex setups. Go from registration to your first trade in less than a minute.</p>
          </div>
        </FadeInWrapper>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-blue-500/0 via-emerald-500/30 to-emerald-500/0 z-0"></div>
          
          {[
            { icon: UserPlus, color: 'text-blue-400', title: '1. Create Account', desc: 'Sign up in seconds. Instantly access your free $10,000 reloadable demo account to practice risk-free.' },
            { icon: Target, color: 'text-cyan-400', title: '2. Make a Prediction', desc: 'Choose an asset, select a timeframe (15s to 5m), and decide if the price will go UP or DOWN.' },
            { icon: DollarSign, color: 'text-emerald-400', title: '3. Collect Profit', desc: 'If your prediction is correct at the end of the timeframe, collect up to 82% pure profit instantly.' }
          ].map((step, idx) => (
            <FadeInWrapper key={idx} delay={idx * 150}>
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-[#1f2937] to-[#111827] border border-white/5 flex items-center justify-center mb-6 shadow-xl shadow-black group-hover:scale-110 transition-transform duration-300 group-hover:border-white/20">
                  <step.icon className={`w-10 h-10 ${step.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="relative z-10 px-4 md:px-8 lg:px-12 py-16 md:py-32 bg-white/[0.01] border-y border-white/5">
        <FadeInWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Professionals.</span></h2>
            <p className="text-gray-400 text-base md:text-lg px-2">Everything you need to analyze, execute, and manage your trades in one powerful, unified terminal.</p>
          </div>
        </FadeInWrapper>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', title: 'Instant Execution', desc: 'No slippage or delays. Trades are placed at the exact millisecond you click.' },
            { icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10', title: 'Advanced Charting', desc: 'Powered by Lightweight Charts. View real-time price action up to 15M timeframes.' },
            { icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10', title: 'Global Markets', desc: 'Trade Major, Minor, and Exotic Forex pairs 24 hours a day, 5 days a week.' },
            { icon: Smartphone, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Mobile Optimized', desc: 'A specialized mobile layout ensures you have the full power of the terminal in your pocket.' }
          ].map((feat, idx) => (
            <FadeInWrapper key={idx} delay={idx * 100}>
              <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 border-t-white/10 p-6 md:p-8 rounded-[2rem] hover:border-white/20 transition-all duration-300 hover:-translate-y-2 group shadow-xl">
                <div className={`w-14 h-14 ${feat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}><feat.icon className={`w-7 h-7 ${feat.color}`} /></div>
                <h3 className="text-xl font-bold text-white mb-2 md:mb-3">{feat.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* --- PLATFORM PREVIEW SECTION --- */}
      <section id="platform" className="relative z-10 px-4 md:px-8 lg:px-12 py-20 md:py-32">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left w-full">
            <FadeInWrapper>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">A Terminal That Works <span className="text-emerald-400">With You.</span></h2>
              <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                We stripped away the clutter to give you a clean, distraction-free environment. Monitor live floating PnL, manage expiration times seamlessly, and view exact entry lines drawn directly on your chart.
              </p>
              <ul className="space-y-4 text-left max-w-sm mx-auto lg:mx-0">
                {['Live Ticket Countdown Timers', 'Glassmorphism Toast Notifications', 'One-Click UP/DOWN Execution'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 font-bold text-sm md:text-base"><CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> {item}</li>
                ))}
              </ul>
              <button onClick={onLaunch} className="mt-10 w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 border-t-white/20 text-white px-8 py-4 rounded-xl text-base font-bold transition-all active:scale-95 inline-flex justify-center items-center gap-2 shadow-lg shadow-black/20 backdrop-blur-md">
                Experience the Terminal <ArrowRight className="w-4 h-4"/>
              </button>
            </FadeInWrapper>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none mx-auto relative">
            {/* Glowing backdrop for the image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-3xl rounded-full scale-90" />
            
            <FadeInWrapper delay={200}>
              <div className="w-full bg-[#030712] border border-white/10 border-t-white/20 rounded-3xl overflow-hidden shadow-2xl shadow-black aspect-[4/3] flex flex-col relative group">
                 <div className="h-8 md:h-10 border-b border-white/5 flex items-center px-3 md:px-4 gap-2 bg-[#111827]">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                 </div>
                 <div className="flex-1 p-4 relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]">
                   <div className="absolute top-8 left-8 right-8 bottom-[20%] border-b-2 border-emerald-500/50 border-dashed"></div>
                   <div className="absolute top-1/2 right-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.5)]">UP $100</div>
                   <div className="absolute bottom-[20%] left-[15%] w-2 md:w-3 rounded-t h-[20%] bg-rose-500 group-hover:h-[30%] transition-all duration-500"></div>
                   <div className="absolute bottom-[30%] left-[35%] w-2 md:w-3 rounded-t h-[40%] bg-emerald-500 group-hover:h-[45%] transition-all duration-500"></div>
                   <div className="absolute bottom-[40%] left-[55%] w-2 md:w-3 rounded-t h-[15%] bg-rose-500 group-hover:h-[10%] transition-all duration-500"></div>
                   <div className="absolute bottom-[25%] left-[75%] w-2 md:w-3 rounded-t h-[50%] bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:h-[60%] transition-all duration-500"></div>
                   
                   <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10">
                     <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                     <span className="text-[10px] md:text-xs font-bold font-mono">EUR/USD</span>
                   </div>
                 </div>
              </div>
            </FadeInWrapper>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="relative z-10 px-4 md:px-8 lg:px-12 py-16 md:py-28 bg-white/[0.01] border-y border-white/5">
        <FadeInWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight">Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Traders Worldwide.</span></h2>
          </div>
        </FadeInWrapper>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { text: "The UI is incredibly smooth. The 10-second charting is accurate and the execution speed is unmatched compared to other brokers.", author: "Michael R.", role: "Day Trader" },
            { text: "Finally, a platform that doesn't feel cluttered on mobile. I can monitor my floating PnL and place trades effortlessly while on the go.", author: "Sarah L.", role: "Swing Trader" },
            { text: "The 82% payout structure is transparent and the withdrawals are fast. The free demo account helped me perfect my 1-minute strategy.", author: "David K.", role: "Forex Analyst" }
          ].map((testimonial, i) => (
            <FadeInWrapper key={i} delay={i * 150}>
              <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 border-t-white/10 p-8 rounded-3xl relative shadow-xl">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-white/5" />
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 relative z-10">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-lg">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{testimonial.author}</p>
                    <p className="text-gray-500 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION WITH SMOOTH SLIDE DROPDOWN --- */}
      <section id="faq" className="relative z-10 px-4 md:px-8 lg:px-12 py-16 md:py-32">
        <div className="max-w-3xl mx-auto w-full">
          <FadeInWrapper>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-sm md:text-base">Everything you need to know about trading on Curenza FX.</p>
            </div>
          </FadeInWrapper>
          
          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <FadeInWrapper key={index} delay={index * 100}>
                <div className={`backdrop-blur-sm border rounded-2xl overflow-hidden transition-colors duration-300 ${openFaq === index ? 'bg-white/[0.03] border-white/20' : 'bg-transparent border-white/5 hover:border-white/10'}`}>
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 md:px-6 md:py-6 text-left flex justify-between items-center focus:outline-none bg-transparent"
                  >
                    <span className={`font-bold pr-4 transition-colors text-sm md:text-base ${openFaq === index ? 'text-white' : 'text-gray-300'}`}>{faq.q}</span>
                    <div className={`transform transition-transform duration-300 ${openFaq === index ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 ${openFaq === index ? 'text-blue-400' : 'text-gray-500'}`} />
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5 md:px-6 md:pb-6 text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              </FadeInWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="relative z-10 px-4 py-20 md:py-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#030712] to-[#030712] text-center border-t border-white/5">
        <FadeInWrapper>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">Ready to Master the Markets?</h2>
          <p className="text-gray-400 text-base md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto px-2">Join over 2 million traders currently maximizing their profits with our lightning-fast terminal.</p>
          <button onClick={() => setAuthModal('signup')} className="w-full sm:w-auto group relative inline-flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 active:scale-95 text-white px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl text-base md:text-xl font-bold transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-white/10">
            Start Trading Today <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </FadeInWrapper>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 py-10 md:py-16 px-4 border-t border-white/5 bg-[#020408] text-center">
        <div className="flex items-center justify-center gap-2 mb-6 opacity-40">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
          <span className="font-bold text-lg md:text-xl tracking-wide text-white">CURENZA FX</span>
        </div>
        <p className="text-gray-600 text-[11px] md:text-sm max-w-4xl mx-auto leading-relaxed mb-6 px-2">
          Trading foreign exchange carries a high level of risk and may not be suitable for all investors. 
          The high degree of leverage can work against you as well as for you. Before deciding to trade foreign exchange 
          you should carefully consider your investment objectives, level of experience, and risk appetite.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-6 md:mb-8 text-xs md:text-sm font-bold text-gray-500">
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-white cursor-pointer transition-colors">Risk Disclosure</span>
        </div>
        <p className="text-[#1f2937] text-[10px] md:text-xs">© 2026 Curenza FX. All rights reserved.</p>
      </footer>
    </div>
  );
};