"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f0f12]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black font-black text-sm tracking-tighter group-hover:scale-105 transition-transform">
              //
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">
              typeform
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="#solutions" className="hover:text-white transition-colors">
              Platform
            </Link>
            <Link href="#solutions" className="hover:text-white transition-colors">
              Solutions
            </Link>
            <Link href="#integrations" className="hover:text-white transition-colors">
              Integrations
            </Link>
            <Link href="#testimonials" className="hover:text-white transition-colors">
              Resources
            </Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex text-sm text-zinc-300 hover:text-white transition-colors px-3 py-1.5"
          >
            Dashboard
          </Link>
          <Link
            href="/share/feedback-2026"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full hover:bg-purple-500/20 transition-all"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            Live Demo Form
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition-all hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10 active:scale-95"
          >
            Get started—it's free
          </Link>
        </div>
      </div>
    </header>
  );
}
