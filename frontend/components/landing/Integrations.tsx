"use client";

import Link from "next/link";

export default function Integrations() {
  const integrationList = [
    { name: "Stripe", category: "Payments" },
    { name: "Slack", category: "Notifications" },
    { name: "Klaviyo", category: "Email Marketing" },
    { name: "Webflow", category: "Website Builder" },
    { name: "Zapier", category: "Automation" },
    { name: "Intercom", category: "Support" },
    { name: "Calendly", category: "Scheduling" },
    { name: "CallRail", category: "Analytics" },
  ];

  return (
    <section id="integrations" className="py-20 px-6 max-w-7xl mx-auto text-center border-t border-white/5">
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight mb-4">
          Integrate with your tech stack
        </h2>
        <p className="text-sm text-zinc-400">
          Sync submissions in real time with the tools your team relies on daily.
        </p>
      </div>

      {/* Pill Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-4xl mx-auto mb-10">
        {integrationList.map((tool) => (
          <div
            key={tool.name}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#16161b] border border-white/5 hover:border-purple-500/30 hover:bg-[#1d1d24] transition-all group cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-semibold text-zinc-200">
              {tool.name}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {tool.category}
            </span>
          </div>
        ))}
      </div>

      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 px-6 py-2.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
        >
          View integrations
        </Link>
      </div>
    </section>
  );
}
