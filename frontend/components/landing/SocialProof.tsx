"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SocialProof() {
  const testimonials = [
    {
      company: "SmartBug.",
      quote: "SmartBug Media increased sales leads by 40% with one form",
      stat: "+40%",
      statLabel: "Lead Generation",
      tag: "Marketing Agency"
    },
    {
      company: "Double Denim",
      quote: "Double Denim Marketing drove $3.67 million in sales",
      stat: "$3.67M",
      statLabel: "Revenue Attributed",
      tag: "E-Commerce"
    },
    {
      company: "Viva Translate",
      quote: "Viva scaled user research globally and cut turnaround by 50%",
      stat: "2.5x",
      statLabel: "Faster Insights",
      tag: "AI Tech"
    }
  ];

  const logos = [
    "Webflow",
    "Zapier",
    "HubSpot",
    "Notion",
    "Linear",
    "Stripe"
  ];

  return (
    <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight mb-8">
          Join 150,000+ businesses driving revenue with Typeform
        </h2>

        {/* Company Logos Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-sm font-semibold tracking-wider text-zinc-300 font-mono hover:text-white transition-colors"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      {/* Testimonials Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, i) => (
          <div
            key={i}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-[#1c1829] to-[#121118] border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
          >
            {/* Ambient Purple Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-purple-600/30 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold tracking-tight text-white font-mono">
                  {item.company}
                </span>
                <span className="text-[10px] uppercase font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  {item.tag}
                </span>
              </div>

              <h3 className="serif-headline text-2xl font-normal text-white leading-snug mb-8">
                {item.quote}
              </h3>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {item.stat}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium">
                  {item.statLabel}
                </div>
              </div>

              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-purple-600 group-hover:border-purple-500 transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
