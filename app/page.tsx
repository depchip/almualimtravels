import { HeroSection } from "@/components/hero-section";
import {
  FeaturedPackages,
  GuidedUmrahHighlight,
  HomeTrainingSection,
  InquiryCTA,
  ServicesOverview,
  TestimonialsSection,
  TrustBand,
} from "@/components/site-sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesOverview />
      <TrustBand />
      <FeaturedPackages />
      <GuidedUmrahHighlight />
      <HomeTrainingSection />
      <TestimonialsSection />
      <InquiryCTA />
    </>
  );
}
