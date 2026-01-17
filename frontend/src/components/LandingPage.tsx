import React, { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

interface LandingPageProps {
  onStart: (view: "login" | "signup") => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const headerRef = useRef(null);
  const subtextRef = useRef(null);
  const buttonRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading slides from LEFT
      gsap.from(headerRef.current, {
        x: -150,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      });

      // Subtext slides from RIGHT
      gsap.from(subtextRef.current, {
        x: 150,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: "power4.out",
      });

      // Button zooms in
      gsap.from(buttonRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "back.out(1.7)",
      });
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="fixed top-0 inset-x-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 z-[100]">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              W
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
              WEVOLVE
            </span>
          </div>
          
          <div className="flex gap-4 items-center">
            <button
              onClick={() => onStart("login")}
              className="text-sm font-bold text-slate-700 px-4 py-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => onStart("signup")}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-black hover:bg-indigo-700 transition-all hover:scale-105 shadow-xl shadow-indigo-100"
            >
              Join Platform
            </button>
          </div>
        </div>
      </nav>

      <header className="relative pt-44 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-indigo-50/50 via-white to-white pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-teal-200 rounded-full blur-[120px] opacity-20 animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <h1 
            ref={headerRef}
            className="text-6xl md:text-[100px] font-black text-slate-900 leading-[0.85] tracking-tight mb-8"
          >
            EVOLVE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">
              CAREER.
            </span>
          </h1>
          
          <p 
            ref={subtextRef}
            className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            The next-generation matching engine designed to connect elite talent 
            with high-performance teams through deep compatibility analysis.
          </p>

          <div ref={buttonRef} className="flex justify-center items-center">
            <button
              onClick={() => onStart("signup")}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-3"
            >
              Get Started Now <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;