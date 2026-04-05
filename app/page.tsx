import { HeroSection } from "@/components/hero-section";
import {
  ClientVideoReviewsSection,
  FinalCTASection,
  FeaturedPackages,
  GoogleReviewsSection,
  GuidedUmrahHighlight,
  HomeTrainingSection,
  ProblemSection,
  ServicesOverview,
  SolutionSection,
  TestimonialsSection,
  TrustBand,
  WhyChooseUsSection,
} from "@/components/site-sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBand />
      <ProblemSection />
      <SolutionSection />
      <ServicesOverview />
      <FeaturedPackages />
      <WhyChooseUsSection />
      <GuidedUmrahHighlight />
      <HomeTrainingSection />
      <GoogleReviewsSection />
      <ClientVideoReviewsSection />
      <TestimonialsSection />
      <FinalCTASection />
    </>
  );
}
