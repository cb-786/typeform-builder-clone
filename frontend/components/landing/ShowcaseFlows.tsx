"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Star, 
  Sparkles, 
  TrendingUp, 
  Video, 
  BarChart3, 
  UserCheck, 
  Mail, 
  Lightbulb, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

interface ShowcaseFlowsProps {
  activeTab: "intelligent" | "growth" | "research";
}

export default function ShowcaseFlows({ activeTab }: ShowcaseFlowsProps) {
  // Interactive rating state for intelligent forms preview
  const [interactiveRating, setInteractiveRating] = useState<number>(4);
  const [interactiveEmail, setInteractiveEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);

  return (
    <section id="solutions" className="py-16 px-6 max-w-7xl mx-auto">
      {/* ---------------- FLOW 1: INTELLIGENT FORMS ---------------- */}
      {activeTab === "intelligent" && (
        <div className="space-y-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy Left */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                INTELLIGENT FORMS
              </div>
              <h2 className="serif-headline text-4xl sm:text-5xl font-normal text-white leading-tight">
                Build forms at the <br />
                drop of a prompt
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                With over 48 million responses collected monthly, Typeform AI builds
                best-in-class forms proven to get 3.5x more data. Brand easily,
                customize everything.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Explore forms
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </Link>
              </div>
            </div>

            {/* 3D Motion Canvas Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1a1528] via-[#121118] to-[#0d0d10] border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-950/40">
                {/* Purple Mesh Background Aura */}
                <div className="absolute -top-16 -right-16 w-80 h-80 bg-purple-600/30 blur-[90px] rounded-full pointer-events-none" />

                {/* Floating Prompt Pill */}
                <div className="animate-float mb-6 inline-flex items-center gap-2.5 rounded-2xl glass-panel px-4 py-2.5 shadow-lg border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs">
                    ✦
                  </div>
                  <span className="text-xs text-zinc-300 font-medium">
                    Build a feedback form for my fitness studio
                  </span>
                </div>

                {/* Floating Brand Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className="rounded-xl bg-white text-black font-bold px-3.5 py-1 text-sm tracking-tight shadow-md">
                    FitCo
                  </div>
                  <div className="text-[11px] font-mono text-purple-300 bg-purple-500/20 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    Interactive Preview
                  </div>
                </div>

                {/* Main Interactive Form Card */}
                <div className="relative rounded-2xl bg-[#241f17] border border-amber-900/30 p-6 sm:p-8 text-left text-white shadow-xl transition-all duration-300">
                  <div className="text-xs font-medium text-amber-200/80 mb-2">
                    1 → Feedback
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-normal text-amber-100 mb-6">
                    Rate your recent class
                  </h3>

                  {/* Interactive Star Rating Preview */}
                  <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setInteractiveRating(starVal)}
                        className={`p-1.5 rounded-lg transition-transform hover:scale-125 ${
                          interactiveRating >= starVal
                            ? "text-amber-400"
                            : "text-zinc-600"
                        }`}
                      >
                        <Star className="w-7 h-7 fill-current" />
                      </button>
                    ))}
                    <span className="text-xs text-amber-300/70 ml-2 font-mono">
                      {interactiveRating}/5 Stars
                    </span>
                  </div>

                  {/* Simulated Question Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-amber-900/40 text-xs text-amber-200/60">
                    <span>Press Enter ↵ to continue</span>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-900/40 text-[10px]">▲</span>
                      <span className="px-2 py-0.5 rounded bg-amber-900/40 text-[10px]">▼</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                High Response Rate
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Build forms people actually fill out with beautiful design and
                conversational logic that adapts to every response, doubling completion rate vs. traditional forms.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Deeper Insights
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Get rich answers with extra context from AI-generated follow-up
                questions that adapt as people complete your form.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Advanced Analytics
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dig into qualitative and quantitative data with sentiment analysis,
                respondent comparison, and drop-off rate analytics.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FLOW 2: GROWTH FLOW ---------------- */}
      {activeTab === "growth" && (
        <div className="space-y-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* 3D Motion Canvas Left */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1e152f] via-[#14121a] to-[#0d0d10] border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-950/40">
                {/* Purple Mesh Background Aura */}
                <div className="absolute top-0 left-0 w-80 h-80 bg-purple-600/30 blur-[90px] rounded-full pointer-events-none" />

                {/* Floating Contact Added Badge */}
                <div className="animate-float mb-6 inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2 border border-purple-500/30 text-xs text-purple-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Contact added to PROSPECT LIST</span>
                </div>

                {/* Main Interactive Lead Form */}
                <div className="relative rounded-2xl bg-[#1f2015] border border-lime-900/30 p-6 sm:p-8 text-left text-white shadow-xl mb-6">
                  <div className="text-xs font-semibold text-lime-400 mb-2">
                    FitCo Virtual
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-lime-100 mb-4">
                    Share your email for a free virtual class
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="alex@fitness.com"
                      value={interactiveEmail}
                      onChange={(e) => setInteractiveEmail(e.target.value)}
                      className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400"
                    />
                    <button
                      type="button"
                      onClick={() => setEmailSubmitted(true)}
                      className="rounded-xl bg-lime-400 text-black px-5 py-2.5 text-xs font-bold hover:bg-lime-300 transition-colors"
                    >
                      {emailSubmitted ? "Submitted!" : "Submit"}
                    </button>
                  </div>
                </div>

                {/* Enriched Pill */}
                <div className="inline-flex items-center gap-3 rounded-2xl glass-panel p-3 border border-purple-500/20 shadow-md">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs">
                    ✦
                  </div>
                  <div className="text-left text-xs">
                    <div className="text-white font-medium">Enrich contact data</div>
                    <div className="text-[10px] text-zinc-400">92% B2B Match Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Right */}
            <div className="lg:col-span-5 order-1 lg:order-2 text-left space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                  GROWTH FLOW
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  NEW
                </span>
              </div>
              <h2 className="serif-headline text-4xl sm:text-5xl font-normal text-white leading-tight">
                Be proactive with <br />
                customer data
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Set up automations that convert and keep customers for you. As
                opportunities arise, Growth Flow steps in to enrich leads, create
                segments, and send personalized messages.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Explore Growth Flow
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Instant Lead Capture
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Close deals directly in your forms. Capture e-signatures, schedule
                meetings with Calendly, and accept payments with Stripe.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Data Enrichment
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enrich data to complete customer profiles with industry-leading
                match rates of up to 92% for B2B companies.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Customer Engagement
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Follow up instantly across email, SMS, and your favorite tools.
                Trigger personalized workflows from any form submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FLOW 3: RESEARCH FLOW ---------------- */}
      {activeTab === "research" && (
        <div className="space-y-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy Left */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                  RESEARCH FLOW
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  NEW
                </span>
              </div>
              <h2 className="serif-headline text-4xl sm:text-5xl font-normal text-white leading-tight">
                Run fast research, <br />
                moderated by AI
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Make data-backed business decisions with Research Flow. It builds
                your research study, conducts 1000s of AI-moderated interviews at
                once, and analyzes the findings. Fast.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Explore Research Flow
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </Link>
              </div>
            </div>

            {/* 3D Motion Canvas Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1e152f] via-[#121118] to-[#0d0d10] border border-purple-500/20 overflow-hidden shadow-2xl shadow-purple-950/40">
                {/* Purple Mesh Background Aura */}
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-600/30 blur-[90px] rounded-full pointer-events-none" />

                {/* Floating Participant Count */}
                <div className="animate-float mb-6 inline-flex items-center gap-2.5 rounded-2xl glass-panel px-4 py-2 border border-purple-500/30 text-xs text-purple-200">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Recruit participants: <strong>2,480 VERIFIED</strong></span>
                </div>

                {/* AI Interview Simulation Card */}
                <div className="relative rounded-2xl bg-[#1c222b] border border-sky-900/40 p-6 sm:p-8 text-left text-white shadow-xl mb-6">
                  <div className="text-xs font-semibold text-sky-400 mb-2">
                    ROLL AI Studio
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif text-sky-100 mb-6">
                    How familiar are you with e-bikes?
                  </h3>

                  {/* Pulsating Audio Equalizer Bar */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs text-zinc-300 font-mono">Listening...</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="w-1 h-3 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      <span className="w-1 h-6 bg-purple-400 rounded-full animate-bounce [animation-delay:100ms]" />
                      <span className="w-1 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:250ms]" />
                    </div>
                  </div>
                </div>

                {/* Finalize Study Design Chip */}
                <div className="inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2 border border-white/10 text-xs text-zinc-300">
                  <span>Finalize study design</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Fast Insights
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Get insights in hours, not weeks. AI handles recruiting,
                moderating, and synthesizing research studies from start to finish.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Qualitative & Quantitative
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Run AI-moderated text, video, and voice interviews at survey scale.
                Capture tone, hesitation, and reasoning behind every answer.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Verified Panel Recruitment
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Reach the right audience with 400+ targeting criteria and built-in
                incentive management so you need fewer tools.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
