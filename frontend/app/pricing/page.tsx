"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import anime from "animejs";
import Navbar from "@/components/landing/Navbar";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  HelpCircle,
  Play,
  Layers,
  Radio
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"yearly" | "monthly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll('.pricing-anim-item');
      anime({
        targets: elements,
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
      });
    }
  }, []);

  // Accordion for feature comparison
  const [openComparison, setOpenComparison] = useState<{ [key: string]: boolean }>({
    usage: true,
    brand: true,
    management: true,
  });

  const toggleComparison = (key: string) => {
    setOpenComparison((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isYearly = billingCycle === "yearly";

  return (
    <div className="min-h-screen bg-[#0e0e11] text-white selection:bg-purple-500/30 font-sans" ref={containerRef}>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Header */}
        <div className="pricing-anim-item opacity-0 text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1 text-xs text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Pricing for Teams of All Sizes</span>
          </div>
          <h1 className="serif-headline text-5xl sm:text-6xl font-normal text-white tracking-tight">
            Get started with AI forms
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Choose the plan that fits your growth. Switch between monthly or yearly billing to save up to 30%.
          </p>

          {/* Switcher & Enterprise Direct Callout */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto gap-4">
            {/* Billing Toggle */}
            <div className="flex items-center bg-[#17171d] p-1.5 rounded-full border border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-all ${
                  billingCycle === "monthly"
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                  billingCycle === "yearly"
                    ? "bg-white text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">
                  Save 30%
                </span>
              </button>
            </div>

            {/* Enterprise Link */}
            <div className="text-xs text-zinc-400 flex items-center gap-2">
              <span className="text-zinc-300 font-semibold">Enterprise:</span>
              <span>6+ users, SSO, dedicated support</span>
              <a
                href="#enterprise"
                className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 flex items-center gap-1"
              >
                Contact sales <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {/* 1. BASIC */}
          <div className="pricing-anim-item opacity-0 rounded-3xl bg-[#141419] border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="text-xl font-bold text-white">Basic</div>
              <p className="text-xs text-zinc-400 min-h-[36px]">
                Create interactive AI forms that connect to your workflow
              </p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? "28" : "39"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">USD</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1">
                  {isYearly ? "Save 132 USD /yr" : "Billed monthly"}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex justify-center items-center rounded-full bg-[#24242d] hover:bg-[#2c2c38] text-white px-5 py-3 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Get Basic
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-zinc-300">
                <div className="font-semibold text-white">Includes:</div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100 responses/mo included</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1 user seat</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Unlimited forms & questions</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Connect to Zapier & Slack</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PLUS */}
          <div className="pricing-anim-item opacity-0 rounded-3xl bg-[#141419] border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="text-xl font-bold text-white">Plus</div>
              <p className="text-xs text-zinc-400 min-h-[36px]">
                Make your AI forms more beautiful and on-brand
              </p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? "56" : "79"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">USD</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1">
                  {isYearly ? "Save 276 USD /yr" : "Billed monthly"}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex justify-center items-center rounded-full bg-[#24242d] hover:bg-[#2c2c38] text-white px-5 py-3 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Get Plus
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-zinc-300">
                <div className="font-semibold text-white">Everything in Basic, plus:</div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>1,000 responses/mo included</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>3 user seats</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Remove Typeform branding</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom subdomain & colors</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. BUSINESS */}
          <div className="pricing-anim-item opacity-0 rounded-3xl bg-[#141419] border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-xl">
            <div className="space-y-4">
              <div className="text-xl font-bold text-white">Business</div>
              <p className="text-xs text-zinc-400 min-h-[36px]">
                Analyze performance with AI and do more with your data
              </p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? "91" : "129"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">USD</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>
                <div className="text-xs text-emerald-400 font-mono mt-1">
                  {isYearly ? "Save 456 USD /yr" : "Billed monthly"}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex justify-center items-center rounded-full bg-[#24242d] hover:bg-[#2c2c38] text-white px-5 py-3 text-xs font-semibold border border-white/10 transition-colors"
                >
                  Get Business
                </Link>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-zinc-300">
                <div className="font-semibold text-white">Everything in Plus, plus:</div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>10,000 responses/mo included</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>5 user seats</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Drop-off rates & analytics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Priority live chat support</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. GROWTH FLOW (FEATURED WITH BADGE) */}
          <div className="pricing-anim-item opacity-0 relative rounded-3xl bg-gradient-to-b from-[#1b152d] via-[#14131d] to-[#0e0e12] border-2 border-purple-500/50 p-7 flex flex-col justify-between shadow-2xl shadow-purple-950/40">
            {/* Top Pill Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-purple-600 text-white font-bold text-[11px] px-3.5 py-1 tracking-wide uppercase shadow-lg shadow-purple-600/50">
                Free trial
              </span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold text-white">Growth Flow</div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                  NEW
                </span>
              </div>
              <p className="text-xs text-zinc-400 min-h-[36px]">
                For growing teams that need to automate marketing workflows
              </p>

              <div className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? "266" : "349"}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">USD</span>
                  <span className="text-xs text-zinc-500">/mo</span>
                </div>
                <div className="text-xs text-purple-300 font-mono mt-1">
                  {isYearly ? "266 USD/mo after 14 days" : "349 USD/mo after 14 days"}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex justify-center items-center rounded-full bg-purple-600 hover:bg-purple-500 text-white px-5 py-3 text-xs font-bold transition-colors shadow-lg shadow-purple-600/40"
                >
                  Try free for 14 days
                </Link>
                <div className="text-[11px] text-zinc-500 text-center mt-1.5">
                  Credit card required
                </div>
              </div>

              <div className="pt-4 border-t border-purple-500/20 space-y-3 text-xs text-zinc-300">
                <div className="font-semibold text-white">Includes:</div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>10,000 responses/mo included</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Unlimited team seats</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Automated AI lead segmentation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Automated sequences & two-way CRM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- ENTERPRISE SECTION ---------------- */}
        <section id="enterprise" className="pricing-anim-item opacity-0 mb-24 rounded-3xl bg-[#121217] border border-white/10 p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

          <div className="max-w-3xl mb-12">
            <div className="text-xs font-semibold tracking-wider text-purple-400 uppercase mb-2">
              ENTERPRISE SUITE
            </div>
            <h2 className="serif-headline text-3xl sm:text-4xl font-normal text-white mb-4">
              Scale securely with custom limits, dedicated support, and HIPAA compliance
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Tailored for organizations requiring advanced governance, tailored security, and custom integration architecture.
            </p>
          </div>

          {/* 6 Enterprise Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Custom Responses & Seats</h4>
              <p className="text-xs text-zinc-400">
                Scale beyond 100,000+ monthly responses and invite hundreds of team members with custom role permissions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">VIP Account Management</h4>
              <p className="text-xs text-zinc-400">
                Dedicated Customer Success Manager with quarterly business reviews and custom workflow architecture.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Enterprise Security & Compliance</h4>
              <p className="text-xs text-zinc-400">
                SAML 2.0 Single Sign-On (Okta, Azure AD), HIPAA BAA execution, GDPR readiness, and US or EU data residency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">White-Label & Custom Domains</h4>
              <p className="text-xs text-zinc-400">
                Host all forms completely on your own apex domain with custom SSL certificates and 100% hidden Typeform branding.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Tailored Team Onboarding</h4>
              <p className="text-xs text-zinc-400">
                Custom staff training workshops, form design consultations, and migration assistance from legacy survey tools.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181820] border border-white/5 space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Priority 24/7 Support & SLA</h4>
              <p className="text-xs text-zinc-400">
                Guaranteed 99.99% system uptime SLA with 1-hour urgent response times from our senior technical engineering team.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg"
            >
              Contact Enterprise Sales
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs text-zinc-400">Custom volume billing available</span>
          </div>
        </section>

        {/* ---------------- ADD-ONS & RESEARCH FLOW SHOWCASE ---------------- */}
        <section className="pricing-anim-item opacity-0 mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add-ons Card */}
          <div className="rounded-3xl bg-[#141419] border border-white/10 p-8 text-left space-y-6">
            <div>
              <span className="text-xs font-semibold text-purple-400 uppercase">ADD-ON</span>
              <h3 className="text-2xl font-bold text-white mt-1">Contacts & Automations</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Grow your business by sending automated emails, tracking contact history, and syncing customer records.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">2,400 Actions / mo</div>
                  <div className="text-[11px] text-zinc-400">Ideal for small growing lists</div>
                </div>
                <div className="text-sm font-bold text-white">+25 USD/mo</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">12,000 Actions / mo</div>
                  <div className="text-[11px] text-zinc-400">For active outbound sequences</div>
                </div>
                <div className="text-sm font-bold text-white">+75 USD/mo</div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Custom Volume Actions</div>
                  <div className="text-[11px] text-zinc-400">50,000+ monthly actions</div>
                </div>
                <div className="text-xs font-semibold text-purple-400">Custom Tier</div>
              </div>
            </div>
          </div>

          {/* Research Flow Video Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1a152d] via-[#121118] to-[#0d0d10] border border-purple-500/30 p-8 text-left space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-400 uppercase">NEW PLATFORM</span>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                  AI MODERATED
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mt-1">Research Flow</h3>
              <p className="text-xs text-zinc-400 mt-2">
                Run in-depth qualitative AI-moderated studies in hours. Recruit vetted panel participants and receive automated video synthesis.
              </p>
            </div>

            <div className="relative rounded-2xl bg-black/60 border border-white/10 p-5 overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/50">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Watch Research Flow Demo</div>
                  <div className="text-[11px] text-zinc-400">2,500+ Verified participants recruited</div>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-700 px-6 py-2.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                Learn more about Research Flow
                <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- COLLAPSIBLE FEATURE MATRIX ---------------- */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="serif-headline text-3xl sm:text-4xl font-normal text-white">
              Compare plans and features
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2">
              Detailed breakdown of limits, branding customization, and governance.
            </p>
          </div>

          <div className="rounded-3xl bg-[#141419] border border-white/10 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 p-5 border-b border-white/10 bg-[#171720] text-xs font-bold text-zinc-300">
              <div className="text-left">Feature</div>
              <div className="text-center">Basic</div>
              <div className="text-center">Plus</div>
              <div className="text-center">Business</div>
              <div className="text-center text-purple-300">Growth Flow</div>
            </div>

            {/* Category 1: Usage limits */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleComparison("usage")}
                className="w-full flex items-center justify-between p-4 bg-[#181822] text-xs font-semibold text-white hover:bg-[#1f1f2c] transition-colors"
              >
                <span>Usage limits</span>
                {openComparison.usage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openComparison.usage && (
                <div className="divide-y divide-white/5 text-xs text-zinc-300">
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Monthly responses</div>
                    <div className="text-center">100 / mo</div>
                    <div className="text-center">1,000 / mo</div>
                    <div className="text-center">10,000 / mo</div>
                    <div className="text-center font-bold text-purple-300">10,000+ / mo</div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Included user seats</div>
                    <div className="text-center">1 seat</div>
                    <div className="text-center">3 seats</div>
                    <div className="text-center">5 seats</div>
                    <div className="text-center font-bold text-purple-300">Unlimited</div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Active forms</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Questions per form</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                    <div className="text-center text-emerald-400">Unlimited</div>
                  </div>
                </div>
              )}
            </div>

            {/* Category 2: Be on-brand */}
            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={() => toggleComparison("brand")}
                className="w-full flex items-center justify-between p-4 bg-[#181822] text-xs font-semibold text-white hover:bg-[#1f1f2c] transition-colors"
              >
                <span>Be on-brand</span>
                {openComparison.brand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openComparison.brand && (
                <div className="divide-y divide-white/5 text-xs text-zinc-300">
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Remove Typeform branding</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Custom subdomain</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Custom CSS & styling</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Category 3: Account management */}
            <div>
              <button
                type="button"
                onClick={() => toggleComparison("management")}
                className="w-full flex items-center justify-between p-4 bg-[#181822] text-xs font-semibold text-white hover:bg-[#1f1f2c] transition-colors"
              >
                <span>Account management</span>
                {openComparison.management ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openComparison.management && (
                <div className="divide-y divide-white/5 text-xs text-zinc-300">
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Team permissions</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Drop-off analytics</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                  <div className="grid grid-cols-5 p-4">
                    <div className="text-left font-medium">Two-way CRM integration</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-zinc-600">—</div>
                    <div className="text-center text-emerald-400"><Check className="w-4 h-4 mx-auto" /></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- TESTIMONIAL BANNER ---------------- */}
        <section className="mb-24 rounded-3xl bg-gradient-to-r from-[#20182c] via-[#14141d] to-[#1a1824] border border-purple-500/20 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              BARRY&apos;S BOOTCAMP
            </div>
            <blockquote className="serif-headline text-2xl sm:text-3xl text-white font-normal leading-relaxed">
              &quot;Typeform helped us increase our client booking conversion rate by 42% across 140+ studio locations worldwide.&quot;
            </blockquote>
            <div className="text-xs text-zinc-400">
              <strong className="text-white">Joey Gonzalez</strong> — CEO, Barry&apos;s
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ACCORDION ---------------- */}
        <section className="mb-24 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="serif-headline text-3xl font-normal text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Can I cancel or change my plan anytime?",
                a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly inside your account settings. Changes take effect on the next billing date.",
              },
              {
                q: "What happens if I exceed my monthly response limit?",
                a: "We never close your forms or lock you out. When you hit 100% of your allowance, we alert you immediately and offer optional extra responses so your data collection never stops.",
              },
              {
                q: "How does the 14-day free trial for Growth Flow work?",
                a: "You get full, unrestricted access to Growth Flow for 14 days without charge. If you decide it is not for you, cancel before day 14 and you will not be billed.",
              },
              {
                q: "Is there special pricing for non-profits and educators?",
                a: "Yes! We offer a 15% discount for verified non-profit organizations and educational institutions. Contact our sales team to apply the discount.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-[#141419] border border-white/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  <span>{item.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="p-5 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
