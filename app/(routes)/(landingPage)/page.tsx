"use client";

import HeroSection from "./_components/HeroSection";
import TrustedBy from "./_components/TrustedBy";
import FeaturesSection from "./_components/FeaturesSection";
import HowItWorks from "./_components/HowItWorks";
import StatsSection from "./_components/StatsSection";
import ReviewsSection from "./_components/ReviewsSection";
import PricingSection from "./_components/PricingSection";
import FAQSection from "./_components/FAQSection";
import CallToAction from "./_components/CallToAction";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <HeroSection />
      <TrustedBy />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <ReviewsSection />
      <PricingSection />
      <FAQSection />
      <CallToAction />
      <Footer />
    </div>
  );
}
