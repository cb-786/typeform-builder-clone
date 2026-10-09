"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0a0d] text-zinc-400 text-xs">
      {/* Big CTA Banner */}
      <div className="py-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

        <h2 className="serif-headline text-4xl sm:text-5xl md:text-6xl font-normal text-white mb-8 tracking-tight">
          AI forms and automation. <br />
          <span className="italic">All in Typeform.</span>
        </h2>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-xl"
        >
          Get started—it's free
        </Link>
      </div>

      {/* Navigation Columns */}
      <div className="border-t border-white/5 py-16 px-6 max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">Product</div>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Enterprise</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Security</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">Templates</div>
          <ul className="space-y-2">
            <li><Link href="/share/feedback-2026" className="hover:text-white transition-colors">Feedback Surveys</Link></li>
            <li><Link href="/share/dev-survey" className="hover:text-white transition-colors">Developer Polls</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Registration Forms</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Quizzes</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">Integrations</div>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Popular Apps</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">HubSpot</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Zapier</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Webhooks</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">Resources</div>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Guides</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Help Center</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Community</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <div className="text-[11px] font-bold text-white uppercase tracking-wider">Get to Know Us</div>
          <ul className="space-y-2">
            <li><Link href="/dashboard" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Contact Sales</Link></li>
            <li><Link href="/dashboard" className="hover:text-white transition-colors">Legal & Privacy</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 py-8 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
        <div>© 2026 Typeform Clone Assignment. Crafted with Next.js & FastAPI.</div>
        <div className="flex gap-6">
          <Link href="/dashboard" className="hover:text-zinc-300">Terms of Service</Link>
          <Link href="/dashboard" className="hover:text-zinc-300">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
