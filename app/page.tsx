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
import { HajjPosterBanner } from "@/components/hajj-poster-banner";
import { UmrahPosterBanner } from "@/components/umrah-poster-banner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBand />
      <HajjPosterBanner />
      <UmrahPosterBanner />
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
