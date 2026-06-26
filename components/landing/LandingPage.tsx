"use client";

import LandingNavbar from "./LandingNavbar";
import LandingHero from "./LandingHero";
import LandingStats from "./LandingStats";
import LandingRoles from "./LandingRoles";
import LandingHowItWorks from "./LandingHowItWorks";
import LandingPlayground from "./LandingPlayground";
import LandingShowcase from "./LandingShowcase";
import LandingFeatures from "./LandingFeatures";
import LandingTestimonials from "./LandingTestimonials";
import LandingPricing from "./LandingPricing";
import LandingFAQ from "./LandingFAQ";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  return (
    <div className="zenith-mesh min-h-screen">
      <div className="relative z-10">
        <LandingNavbar />
        <main className="text-foreground">
          <LandingHero />
          <LandingStats />
          <LandingRoles />
          <LandingHowItWorks />
          <LandingPlayground />
          <LandingShowcase />
          <LandingFeatures />
          <LandingTestimonials />
          <LandingPricing />
          <LandingFAQ />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
