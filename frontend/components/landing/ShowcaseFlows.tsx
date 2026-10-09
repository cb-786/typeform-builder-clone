"use client";

import { useState, useEffect } from "react";
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
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Maximize2,
  Activity,
  Send,
  Zap,
  Radio
} from "lucide-react";

interface ShowcaseFlowsProps {
  activeTab: "intelligent" | "growth" | "research";
}

export default function ShowcaseFlows({ activeTab }: ShowcaseFlowsProps) {
  // ---------------- Video Simulation States ----------------
  // FitCo Video Questionnaire
  const [isPlayingFitCo, setIsPlayingFitCo] = useState<boolean>(true);
  const [fitCoSeconds, setFitCoSeconds] = useState<number>(4);
  const [interactiveRating, setInteractiveRating] = useState<number>(5);
  const [hasRated, setHasRated] = useState<boolean>(true);

  // Growth Flow Live Stream
  const [leadCounter, setLeadCounter] = useState<number>(1);
  const [interactiveEmail, setInteractiveEmail] = useState<string>("");
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const [isEnriching, setIsEnriching] = useState<boolean>(false);

  // Research Flow AI Video Call
  const [isPlayingCall, setIsPlayingCall] = useState<boolean>(true);
  const [callSeconds, setCallSeconds] = useState<number>(252); // 04:12
  const [audioBars, setAudioBars] = useState<number[]>([40, 75, 55, 90, 65, 80, 45, 95, 60]);

  // Timer loop for video playback emulation
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlayingFitCo) {
        setFitCoSeconds((prev) => (prev >= 15 ? 0 : prev + 1));
      }
      if (isPlayingCall) {
        setCallSeconds((prev) => prev + 1);
        // randomize audio bars slightly to simulate realistic speech frequencies
        setAudioBars([
          20 + Math.floor(Math.random() * 60),
          30 + Math.floor(Math.random() * 70),
          25 + Math.floor(Math.random() * 65),
          40 + Math.floor(Math.random() * 60),
          35 + Math.floor(Math.random() * 65),
          25 + Math.floor(Math.random() * 75),
          20 + Math.floor(Math.random() * 60),
          30 + Math.floor(Math.random() * 70),
          15 + Math.floor(Math.random() * 50),
        ]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlayingFitCo, isPlayingCall]);

  const formatFitCoTime = (sec: number) => {
    return `00:${sec < 10 ? `0${sec}` : sec}`;
  };

  const formatCallTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  return (
    <section id="solutions" className="py-20 px-6 max-w-7xl mx-auto">
      {/* ---------------- FLOW 1: INTELLIGENT FORMS (VIDEO-SIMULATED FITCO) ---------------- */}
      {activeTab === "intelligent" && (
        <div className="space-y-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy Left */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                  INTELLIGENT FORMS
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  VIDEO POWERED
                </span>
              </div>
              <h2 className="serif-headline text-4xl sm:text-5xl font-normal text-white leading-tight">
                Build forms at the <br />
                drop of a prompt
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                With over 48 million responses collected monthly, Typeform AI builds
                best-in-class interactive video forms proven to get 3.5x more data. 
                Brand easily, customize everything.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Create an AI form
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/share/demo-customer-satisfaction"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Try live demo
                </Link>
              </div>
            </div>

            {/* Dynamic Video Player Simulation Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#1c162c] via-[#121118] to-[#0c0c0f] border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-950/50">
                {/* Dynamic Ambient Glow Backdrop */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-600/25 blur-[100px] rounded-full pointer-events-none transition-all duration-700" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/15 blur-[90px] rounded-full pointer-events-none" />

                {/* Floating AI Prompt Pill */}
                <div className="animate-float mb-6 inline-flex items-center gap-2.5 rounded-2xl glass-panel px-4 py-2.5 shadow-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs">
                    ✦
                  </div>
                  <span className="text-xs text-zinc-200 font-medium">
                    Build a feedback form for my fitness studio
                  </span>
                </div>

                {/* Video Player Container */}
                <div className="relative rounded-2xl bg-[#1b1712] border border-amber-900/40 overflow-hidden shadow-2xl">
                  {/* Top Video Header Bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 text-xs text-zinc-300">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="rounded bg-white text-black font-extrabold px-2 py-0.5 text-[11px] tracking-tight">
                        FitCo
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px]">
                        Studio Session 04
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-zinc-300">
                        1080p HD
                      </span>
                      <button 
                        onClick={() => setIsPlayingFitCo(!isPlayingFitCo)}
                        className="p-1 rounded hover:bg-white/10 text-white transition-colors"
                        title={isPlayingFitCo ? "Pause Video" : "Play Video"}
                      >
                        {isPlayingFitCo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                    </div>
                  </div>

                  {/* Video Stage Simulation */}
                  <div className="relative p-6 sm:p-8 text-left bg-gradient-to-b from-[#241f17]/90 to-[#18140f]">
                    {/* Simulated Studio Atmosphere Watermark */}
                    <div className="absolute right-4 bottom-14 opacity-10 pointer-events-none">
                      <Activity className="w-32 h-32 text-amber-500" />
                    </div>

                    <div className="text-xs font-medium text-amber-300/80 mb-2 flex items-center gap-2">
                      <span>1 → Feedback</span>
                      <span className="text-amber-500/50">•</span>
                      <span className="text-[11px] text-zinc-400 font-mono">Video Question</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-amber-50 mb-6 leading-snug">
                      Rate your recent class
                    </h3>

                    {/* Interactive 5-Star Rating */}
                    <div className="flex items-center gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => {
                            setInteractiveRating(starVal);
                            setHasRated(true);
                          }}
                          className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-125 ${
                            interactiveRating >= starVal
                              ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                              : "text-zinc-600"
                          }`}
                        >
                          <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                        </button>
                      ))}
                      <span className="text-xs text-amber-300/90 ml-3 font-mono font-bold">
                        {interactiveRating}/5 Stars
                      </span>
                    </div>

                    {/* Virtual Hand / Cursor Pointer Animation */}
                    <div className="relative flex items-center justify-between pt-4 border-t border-amber-900/40 text-xs text-amber-200/70">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded text-amber-300">
                          Press Enter ↵
                        </span>
                        <span className="text-zinc-400 text-[11px]">to advance video</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
                        <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">▲</span>
                        <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5">▼</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Scrubber & Playback Timeline Bar */}
                  <div className="px-5 py-3 bg-black/80 backdrop-blur-md border-t border-white/5 flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingFitCo(!isPlayingFitCo)}
                      className="text-white hover:text-amber-300 transition-colors"
                    >
                      {isPlayingFitCo ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    <div className="text-[11px] font-mono text-zinc-400 min-w-[70px]">
                      {formatFitCoTime(fitCoSeconds)} / 00:15
                    </div>

                    {/* Scrubber Track */}
                    <div className="flex-1 relative h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                        style={{ width: `${(fitCoSeconds / 15) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400">
                      <Volume2 className="w-3.5 h-3.5" />
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Value Proposition Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                3.5x Higher Completion
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Forms feel like human conversations. By presenting questions one at a time with rich media, respondents stay engaged from first click to submit.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Video-First Engagement
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Embed personalized greetings and video questions. Collect face-to-face feedback without scheduling synchronous meetings.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Real-Time Drop-off Tracking
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Know the exact step where users pause. Identify friction points and auto-optimize field phrasing with generative AI recommendations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FLOW 2: GROWTH FLOW (LIVE PIPELINE SIMULATOR) ---------------- */}
      {activeTab === "growth" && (
        <div className="space-y-16 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Dynamic Event Simulator Left */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#1a142c] via-[#121118] to-[#0c0c0f] border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-950/50">
                {/* Gradient Pulse Background */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-lime-600/15 blur-[100px] rounded-full pointer-events-none" />

                {/* Header Status Bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 rounded-xl glass-panel px-3.5 py-1.5 border border-purple-500/30 text-xs text-purple-200">
                    <span className="flex h-2 w-2 rounded-full bg-lime-400 animate-ping" />
                    <span>Live Lead Automation Pipeline</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
                    Event #{leadCounter} Active
                  </span>
                </div>

                {/* Main Interactive Lead Form Card */}
                <div className="relative rounded-2xl bg-[#1b2016] border border-lime-800/40 p-6 sm:p-8 text-left text-white shadow-xl mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-lime-400">
                      FitCo Virtual • Lead Magnet
                    </span>
                    <span className="text-[10px] font-mono text-lime-300/80 bg-lime-950/60 border border-lime-800/50 px-2 py-0.5 rounded">
                      Step 1: Capture
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-lime-50 mb-4">
                    Share your email for a free virtual pass
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="alex.mercer@stripe.com"
                      value={interactiveEmail}
                      onChange={(e) => setInteractiveEmail(e.target.value)}
                      className="flex-1 rounded-xl bg-black/50 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEmailSubmitted(true);
                        setIsEnriching(true);
                        setTimeout(() => {
                          setIsEnriching(false);
                          setLeadCounter((c) => c + 1);
                        }, 1800);
                      }}
                      className="rounded-xl bg-lime-400 text-black px-5 py-2.5 text-xs font-bold hover:bg-lime-300 transition-colors flex items-center gap-1.5 shadow-lg"
                    >
                      {emailSubmitted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Captured</span>
                        </>
                      ) : (
                        <>
                          <span>Submit</span>
                          <Send className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Animated Connecting Pipeline Nodes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Node 1: AI Enrichment */}
                  <div className={`rounded-2xl glass-panel p-4 border transition-all duration-300 text-left ${
                    isEnriching ? "border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "border-white/10"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs">
                          ✦
                        </div>
                        <span className="text-xs font-semibold text-white">AI Enrichment</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                        98% B2B Match
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 space-y-0.5">
                      <div>Alex Mercer • VP Product</div>
                      <div className="text-zinc-500">TechCorp Inc. • 250+ Employees</div>
                    </div>
                  </div>

                  {/* Node 2: Automated Outreach */}
                  <div className="rounded-2xl glass-panel p-4 border border-white/10 text-left">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-lime-500/20 flex items-center justify-center text-lime-400 text-xs">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-white">Auto Follow-Up</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                        Instant
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-300 space-y-0.5">
                      <div>Sequence: Enterprise Trial</div>
                      <div className="text-zinc-500">Scheduled via Hubspot & Slack</div>
                    </div>
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
                segments, and send personalized messages without human intervention.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Explore Growth Flow
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  View CRM connectors
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
                Real-Time Data Enrichment
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enrich contact data to complete customer profiles with industry-leading
                match rates of up to 92% for B2B enterprises.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Triggered AI Sequences
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Follow up instantly across email, SMS, and your favorite tools.
                Trigger personalized workflows from any form submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- FLOW 3: RESEARCH FLOW (LIVE AI VIDEO CALL SIMULATOR) ---------------- */}
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
                  AI MODERATED
                </span>
              </div>
              <h2 className="serif-headline text-4xl sm:text-5xl font-normal text-white leading-tight">
                Run fast research, <br />
                moderated by AI
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Make data-backed business decisions with Research Flow. It builds
                your research study, conducts 1,000s of AI-moderated video interviews at
                once, and extracts rich findings in hours, not weeks.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
                >
                  Explore Research Flow
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-3 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                >
                  Recruit panel sample
                </Link>
              </div>
            </div>

            {/* Live AI Video Call Simulator Right */}
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#1a142e] via-[#111119] to-[#0c0c0f] border border-sky-500/30 overflow-hidden shadow-2xl shadow-sky-950/40">
                {/* Sky & Purple Mesh Aura */}
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-sky-600/20 blur-[100px] rounded-full pointer-events-none" />

                {/* Floating Participant Tag */}
                <div className="animate-float mb-6 inline-flex items-center gap-2.5 rounded-2xl glass-panel px-4 py-2 border border-sky-500/30 text-xs text-sky-200">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <span>Recruited: <strong>2,480 VERIFIED PARTICIPANTS</strong></span>
                </div>

                {/* Video Conference Interface Card */}
                <div className="relative rounded-2xl bg-[#141b24] border border-sky-900/50 overflow-hidden shadow-2xl mb-6">
                  {/* Top Recording Bar */}
                  <div className="flex items-center justify-between px-5 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-rose-400 font-mono font-bold text-[11px]">REC 1080p</span>
                      <span className="text-zinc-500">•</span>
                      <span className="font-mono text-zinc-300 text-[11px]">{formatCallTime(callSeconds)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono">
                        AI Moderator Active
                      </span>
                      <button
                        onClick={() => setIsPlayingCall(!isPlayingCall)}
                        className="p-1 rounded hover:bg-white/10 text-white"
                      >
                        {isPlayingCall ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      </button>
                    </div>
                  </div>

                  {/* Video & Interview Dialog Canvas */}
                  <div className="p-6 sm:p-8 text-left space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-semibold text-sky-400">
                        ROLL AI Studio • Study #409
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400">
                        Marcus Vance (Daily Commuter)
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-serif text-sky-50 leading-snug">
                      How familiar are you with e-bikes?
                    </h3>

                    {/* Live Equalizer Voice Audio Wave */}
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/50 border border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                        <span className="text-xs text-zinc-300 font-mono">Speaking</span>
                      </div>

                      {/* 9 Dynamic Bouncing Audio Frequency Bars */}
                      <div className="flex items-end gap-1.5 h-7 ml-auto">
                        {audioBars.map((height, i) => (
                          <span
                            key={i}
                            className="w-1.5 bg-sky-400 rounded-full transition-all duration-200"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Live Transcript Stream */}
                    <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/30 text-xs text-zinc-300 leading-relaxed font-mono">
                      <span className="text-sky-400 font-bold mr-2">Transcript:</span>
                      &quot;I commute 15 miles daily and need a reliable battery that withstands winter conditions...&quot;
                    </div>

                    {/* Real-time Sentiment Tag */}
                    <div className="flex items-center gap-2 pt-2 border-t border-sky-900/40 text-xs">
                      <span className="text-zinc-400 text-[11px]">Instant AI Extraction:</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                        Positive • High Purchase Intent (89%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Finalize Study Design Chip */}
                <div className="inline-flex items-center gap-2 rounded-xl glass-panel px-4 py-2 border border-white/10 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Synthesizing findings across 2,480 sessions in 14 minutes</span>
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
                Insights in Hours
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Get synthesized executive reports in hours, not months. AI handles recruiting,
                moderating, and thematic coding from start to finish.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Qualitative Nuance at Scale
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Conduct AI-moderated video interviews at massive survey sample sizes.
                Capture tone, facial hesitation, and unvarnished reasoning.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-card space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">
                Vetted Global Panel
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Recruit instantly from verified global consumer & B2B panels with 400+ demographic
                filters and automated payout incentives.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
