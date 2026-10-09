"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Sparkles,
  Layers,
  Wrench,
  LayoutTemplate,
  Users,
  Briefcase,
  HelpCircle,
  Building2,
  BookOpen,
  ArrowRight,
  Video,
  BarChart3,
  GitBranch,
  Bot,
  Zap,
  Target,
  Search,
} from "lucide-react";

type ActiveMenu = "platform" | "solutions" | "resources" | null;

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: ActiveMenu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0e0e11]/95 backdrop-blur-xl transition-all"
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black font-black text-sm tracking-tighter group-hover:scale-105 transition-transform">
              //
            </div>
            <span className="font-serif text-xl tracking-tight text-white font-normal">
              Typeform
            </span>
          </Link>

          {/* Nav Items with Hover Triggers */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-300">
            {/* PLATFORM */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("platform")}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                  activeMenu === "platform"
                    ? "text-white bg-white/5"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Platform</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "platform" ? "rotate-180 text-white" : "text-zinc-500"
                  }`}
                />
              </button>
            </div>

            {/* SOLUTIONS */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("solutions")}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                  activeMenu === "solutions"
                    ? "text-white bg-white/5"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "solutions" ? "rotate-180 text-white" : "text-zinc-500"
                  }`}
                />
              </button>
            </div>

            {/* RESOURCES */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
            >
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${
                  activeMenu === "resources"
                    ? "text-white bg-white/5"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === "resources" ? "rotate-180 text-white" : "text-zinc-500"
                  }`}
                />
              </button>
            </div>

            {/* PRICING LINK */}
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md transition-colors hover:text-white hover:bg-white/5"
            >
              Pricing
            </Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-sm text-zinc-300 hover:text-white transition-colors px-2 py-1.5 font-medium"
          >
            Log in
          </Link>
          <Link
            href="/pricing"
            className="hidden lg:inline-flex text-sm text-zinc-300 hover:text-white transition-colors px-2 py-1.5 font-medium"
          >
            Contact sales
          </Link>
          <Link
            href="/share/feedback-2026"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full hover:bg-purple-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Live Demo Form
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </div>

      {/* MEGA-MENUS DROPDOWN CONTAINER */}
      {activeMenu && (
        <div
          className="absolute left-0 top-16 w-full border-b border-white/10 bg-[#121217]/98 shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-1"
          onMouseEnter={() => handleMouseEnter(activeMenu)}
          onMouseLeave={handleMouseLeave}
        >
          {/* PLATFORM MEGA-MENU */}
          {activeMenu === "platform" && (
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Column 1: PLATFORM (9 items) */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Platform</span>
                  </div>
                  <div className="space-y-3.5">
                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Platform overview
                      </div>
                      <div className="text-xs text-zinc-400">What is Typeform?</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Typeform AI</span>
                      </div>
                      <div className="text-xs text-zinc-400">Your AI know-pilot</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Typeform MCP</span>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">Use Typeform from your AI tools</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Growth Flow</span>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">Automated workflows for GTM teams</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Research Flow</span>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">AI-moderated research studies</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Contacts & Automations
                      </div>
                      <div className="text-xs text-zinc-400">Automated workflows to grow your business</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Video engagement
                      </div>
                      <div className="text-xs text-zinc-400">Interactive video forms</div>
                    </Link>

                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Analytics and reporting
                      </div>
                      <div className="text-xs text-zinc-400">Answers you can act on</div>
                    </Link>

                    <Link href="#integrations" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Integrations
                      </div>
                      <div className="text-xs text-zinc-400">Connect all your apps</div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: TOOLS (10 builders) */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    <span>Tools</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Form builder",
                      "Survey maker",
                      "Quiz maker",
                      "Test maker",
                      "Poll builder",
                      "Application form builder",
                      "Landing page builder",
                      "NPS form builder",
                      "Registration form builder",
                      "Short form builder",
                    ].map((tool) => (
                      <Link
                        key={tool}
                        href="/dashboard"
                        className="block text-sm font-normal text-zinc-300 hover:text-white transition-colors"
                      >
                        {tool}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Column 3: FEATURED CARDS */}
                <div className="col-span-4 space-y-4">
                  {/* Card 1: TEMPLATES */}
                  <div className="rounded-xl border border-white/10 bg-[#1a1a23]/60 p-4 transition-all hover:border-purple-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-2">
                      <LayoutTemplate className="w-3.5 h-3.5 text-purple-400" />
                      <span>TEMPLATES</span>
                    </div>
                    {/* Simulated visual card */}
                    <div className="rounded-lg bg-zinc-900 border border-white/5 p-3 mb-3 relative overflow-hidden group">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                        <span className="font-semibold text-white">ZoDigital</span>
                        <span className="text-zinc-500">Aa</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">What's the best email to reach you on?</p>
                      <div className="mt-2 inline-block rounded bg-zinc-800 px-2.5 py-1 text-[10px] text-zinc-400">
                        Submit
                      </div>
                      <div className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-blue-500/20 blur-sm"></div>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium mb-1">
                      Free form, survey, and quiz templates
                    </p>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
                    >
                      Choose one <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Card 2: RESEARCH FLOW */}
                  <div className="rounded-xl border border-white/10 bg-[#1a1a23]/60 p-4 transition-all hover:border-indigo-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>RESEARCH FLOW</span>
                    </div>
                    {/* Video mockup card */}
                    <div className="rounded-lg bg-zinc-900 border border-white/5 p-2.5 mb-3 flex items-center gap-3">
                      <div className="relative w-16 h-12 rounded bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <Video className="w-5 h-5 text-indigo-300" />
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">AI-Moderated Study</p>
                        <p className="text-[10px] text-zinc-400">2,500 recruited participants</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium mb-1">
                      Run in-depth AI-moderated studies in hours
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      Learn more <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SOLUTIONS MEGA-MENU */}
          {activeMenu === "solutions" && (
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-12 gap-8 mb-6">
                {/* Column 1: TEAMS */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Teams</span>
                  </div>
                  <div className="space-y-3.5">
                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">
                        Marketing
                      </div>
                      <div className="text-xs text-zinc-400">For B2B and B2C marketing</div>
                    </Link>
                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">
                        Product
                      </div>
                      <div className="text-xs text-zinc-400">For product, UX, and research</div>
                    </Link>
                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">
                        Human resources
                      </div>
                      <div className="text-xs text-zinc-400">For HR, ops, and talent</div>
                    </Link>
                    <Link href="#solutions" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-amber-300 transition-colors">
                        Customer success
                      </div>
                      <div className="text-xs text-zinc-400">For CS and education</div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: USE CASES */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Use Cases</span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Lead generation",
                      "Employee onboarding",
                      "Employee satisfaction",
                      "Employee engagement",
                      "Customer feedback",
                    ].map((item) => (
                      <Link
                        key={item}
                        href="/dashboard"
                        className="block text-sm font-normal text-zinc-300 hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-2"
                    >
                      View all use cases <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Column 3: PLANS */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                    <span>Plans</span>
                  </div>
                  <div className="space-y-3.5">
                    <Link href="/pricing" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Core
                      </div>
                      <div className="text-xs text-zinc-400">Plans for everyone</div>
                    </Link>
                    <Link href="/pricing" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Growth</span>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">Plans for GTM teams</div>
                    </Link>
                    <Link href="/pricing" className="group block">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        <span>Research Flow</span>
                        <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                          NEW
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">Plans for research teams</div>
                    </Link>
                    <Link href="/pricing" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Talent
                      </div>
                      <div className="text-xs text-zinc-400">Plans for HR and people teams</div>
                    </Link>
                    <Link href="/pricing" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-purple-300 transition-colors">
                        Enterprise
                      </div>
                      <div className="text-xs text-zinc-400">Plans for larger orgs</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Featured Bar (ASK, ACT, LEARN) as in screenshot PXL_...24972 */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div className="rounded-xl bg-[#181822]/70 border border-white/5 p-4 hover:border-purple-500/30 transition-all">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    ASK
                  </span>
                  <p className="text-sm font-semibold text-white mt-1">Intelligent Forms</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Build forms that adapt to every respondent and then analyze your data for rich insights.
                  </p>
                </div>
                <div className="rounded-xl bg-[#181822]/70 border border-white/5 p-4 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                      ACT
                    </span>
                    <span className="text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">Growth Flow</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Convert and keep customers with automated AI segmentation and follow-ups.
                  </p>
                </div>
                <div className="rounded-xl bg-[#181822]/70 border border-white/5 p-4 hover:border-purple-500/30 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                      LEARN
                    </span>
                    <span className="text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white mt-1">Research Flow</p>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Make confident business decisions fast with AI-moderated studies and automated reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RESOURCES MEGA-MENU */}
          {activeMenu === "resources" && (
            <div className="mx-auto max-w-7xl px-8 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Column 1: SUPPORT */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Support</span>
                  </div>
                  <div className="space-y-3.5">
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition-colors">
                        Help center
                      </div>
                      <div className="text-xs text-zinc-400">Find quick answers</div>
                    </Link>
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition-colors">
                        Community
                      </div>
                      <div className="text-xs text-zinc-400">Share and interact</div>
                    </Link>
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-cyan-300 transition-colors">
                        Contact us
                      </div>
                      <div className="text-xs text-zinc-400">Speak to our team</div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: COMPANY */}
                <div className="col-span-4 pr-4 border-r border-white/5">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <Building2 className="w-3.5 h-3.5 text-pink-400" />
                    <span>Company</span>
                  </div>
                  <div className="space-y-3.5">
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-pink-300 transition-colors">
                        Partners
                      </div>
                      <div className="text-xs text-zinc-400">Browse or join</div>
                    </Link>
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-pink-300 transition-colors">
                        Careers
                      </div>
                      <div className="text-xs text-zinc-400">Join our team</div>
                    </Link>
                    <Link href="#testimonials" className="group block">
                      <div className="text-sm font-medium text-zinc-100 group-hover:text-pink-300 transition-colors">
                        Webinars
                      </div>
                      <div className="text-xs text-zinc-400">Learn and get inspired</div>
                    </Link>
                  </div>
                </div>

                {/* Column 3: BLOG CARD */}
                <div className="col-span-4">
                  <div className="flex items-center gap-2 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Blog</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#1a1a23]/60 p-4 transition-all hover:border-emerald-500/30">
                    <div className="aspect-video rounded-lg bg-zinc-900 border border-white/5 p-4 mb-3 flex flex-col justify-center relative overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 mb-2"></div>
                      <div className="w-2/3 h-2 rounded bg-zinc-700 mb-2"></div>
                      <div className="w-1/2 h-2 rounded bg-zinc-800"></div>
                      <div className="absolute right-3 bottom-3 text-2xl opacity-40">📊</div>
                    </div>
                    <p className="text-xs text-zinc-300 font-medium mb-1">
                      Our guides, latest news, and more.
                    </p>
                    <Link
                      href="#testimonials"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                      Browse blog <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
