"use client";

import Link from "next/link";

export default function Integrations() {
  const row1 = [
    { name: "slack" },
    { name: "stripe" },
    { name: "Webflow" },
    { name: "_zapier" },
    { name: "ActiveCampaign" },
    { name: "Calendly" },
    { name: "Zendesk" },
  ];

  const row2 = [
    { name: "Mailchimp" },
    { name: "Webflow" },
    { name: "stripe" },
    { name: "slack" },
    { name: "klaviyo" },
    { name: "INTERCOM" },
    { name: "CallRail" },
  ];

  return (
    <section id="integrations" className="py-24 overflow-hidden border-t border-white/5 relative bg-[#0e0e11]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight">
          Integrate with your tech stack
        </h2>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-6 mb-16 select-none z-10 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        
        {/* Row 1: Left */}
        <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused]">
          {[...row1, ...row1].map((tool, i) => (
            <div
              key={`row1-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-10 py-5 mx-3 rounded-2xl bg-[#141419] border border-white/5 hover:border-white/10 hover:bg-[#1a1a20] transition-colors min-w-[220px]"
            >
              <span className="text-xl font-bold text-zinc-400 transition-colors cursor-default">
                {tool.name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Right */}
        <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused]">
          {[...row2, ...row2].map((tool, i) => (
            <div
              key={`row2-${i}`}
              className="flex-shrink-0 flex items-center justify-center px-10 py-5 mx-3 rounded-2xl bg-[#141419] border border-white/5 hover:border-white/10 hover:bg-[#1a1a20] transition-colors min-w-[220px]"
            >
              <span className="text-xl font-bold text-zinc-400 transition-colors cursor-default">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-[#18181b] border border-white/10 px-6 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-all hover:scale-105"
        >
          View integrations
        </Link>
      </div>
    </section>
  );
}
