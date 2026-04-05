import { HeroSection } from "@/components/hero-section";
import {
  ClientVideoReviewsSection,
  FeaturedPackages,
  GoogleReviewsSection,
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
      <GoogleReviewsSection />
      <ClientVideoReviewsSection />
      <TestimonialsSection />
      <InquiryCTA />
    </>
  );
}
