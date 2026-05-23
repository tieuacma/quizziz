"use client";

import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingStats from "./LandingStats";
import LandingRoles from "./LandingRoles";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingShowcase from "./LandingShowcase";
import LandingFeatures from "./LandingFeatures";
import LandingFAQ from "./LandingFAQ";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#05040f] text-white">
      <LandingNavbar />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingRoles />
        <LandingHowItWorks />
        <LandingShowcase />
        <LandingFeatures />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
