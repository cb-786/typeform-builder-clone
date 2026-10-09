"use client";

import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ShowcaseFlows from "@/components/landing/ShowcaseFlows";
import SocialProof from "@/components/landing/SocialProof";
import Integrations from "@/components/landing/Integrations";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"intelligent" | "growth" | "research">("intelligent");

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f12] text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Hero activeTab={activeTab} onSelectTab={setActiveTab} />
        <ShowcaseFlows activeTab={activeTab} />
        <SocialProof />
        <Integrations />
      </main>
      <Footer />
    </div>
  );
}
