"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import anime from "animejs";

interface HeroProps {
  activeTab: "intelligent" | "growth" | "research";
  onSelectTab: (tab: "intelligent" | "growth" | "research") => void;
}

export default function Hero({ activeTab, onSelectTab }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      const elementsToAnimate = containerRef.current.querySelectorAll('.hero-anim-item');
      
      anime({
        targets: elementsToAnimate,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(150),
        easing: 'easeOutExpo'
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden pt-16 pb-12 text-center" ref={containerRef}>
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        {/* Pill Badge */}
        <div className="hero-anim-item opacity-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold tracking-wider text-purple-300 uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          AI Forms & Automation
        </div>

        {/* Serif Headline */}
        <h1 className="hero-anim-item opacity-0 serif-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white max-w-4xl mx-auto leading-[1.08] mb-6">
          Your favorite forms. <br />
          <span className="italic font-light text-zinc-300">Now with AI automation.</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-anim-item opacity-0 max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 font-light leading-relaxed mb-10">
          Combine AI forms and automated workflows to drive revenue growth.
          Run in-depth research and manage the entire customer lifecycle. All in Typeform.
        </p>

        {/* CTAs */}
        <div className="hero-anim-item opacity-0 flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200 hover:shadow-xl hover:shadow-purple-500/10 active:scale-95"
          >
            Get started—it's free
          </Link>
          <Link
            href="/share/feedback-2026"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            Experience Live Respondent Flow
            <ArrowRight className="w-4 h-4 text-purple-400" />
          </Link>
        </div>

        {/* 3 Flow Switcher Cards */}
        <div className="hero-anim-item opacity-0 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {/* Tab 1: ASK Intelligent Forms */}
          <button
            onClick={() => onSelectTab("intelligent")}
            className={`group relative p-6 rounded-2xl border transition-all text-left ${
              activeTab === "intelligent"
                ? "bg-[#1c1c22] border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-[#131316] border-white/5 hover:border-white/10 hover:bg-[#18181d]"
            }`}
          >
            <div className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
              ASK
            </div>
            <div className="text-xl font-medium text-white mb-2">
              Intelligent Forms
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Build forms that adapt to every respondent and then analyze your data for rich insights.
            </p>
            {activeTab === "intelligent" && (
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>

          {/* Tab 2: ACT Growth Flow */}
          <button
            onClick={() => onSelectTab("growth")}
            className={`group relative p-6 rounded-2xl border transition-all text-left ${
              activeTab === "growth"
                ? "bg-[#1c1c22] border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-[#131316] border-white/5 hover:border-white/10 hover:bg-[#18181d]"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                ACT
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NEW
              </span>
            </div>
            <div className="text-xl font-medium text-white mb-2">
              Growth Flow
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Convert and keep customers with automated AI segmentation and follow-ups.
            </p>
            {activeTab === "growth" && (
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>

          {/* Tab 3: LEARN Research Flow */}
          <button
            onClick={() => onSelectTab("research")}
            className={`group relative p-6 rounded-2xl border transition-all text-left ${
              activeTab === "research"
                ? "bg-[#1c1c22] border-purple-500/50 shadow-lg shadow-purple-500/10"
                : "bg-[#131316] border-white/5 hover:border-white/10 hover:bg-[#18181d]"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                LEARN
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NEW
              </span>
            </div>
            <div className="text-xl font-medium text-white mb-2">
              Research Flow
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Make confident business decisions fast with AI-moderated studies and automated reports.
            </p>
            {activeTab === "research" && (
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
