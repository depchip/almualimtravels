import { FAQSection } from "@/components/faq-section";
import { HajjTrainingPosters } from "@/components/hajj-training-posters";
import { PackageGrid } from "@/components/page-grid";
import { SacredGallery } from "@/components/sacred-gallery";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Hajj Packages",
  description:
    "Explore Hajj packages with guidance, pre-travel preparation, and trusted service from AlMuallim Travels and Tours.",
  path: "/hajj-packages",
});

export default function HajjPackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Hajj Packages"
        title="Hajj journeys designed for clarity, care, and confidence"
        description="Our Hajj planning combines responsible travel arrangements with preparation sessions to help pilgrims focus on the sacred responsibility ahead."
      />
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Packages"
          title="Current Hajj offerings"
          description="Speak with us for the latest departures, accommodation options, and guidance schedule."
        />
        <div className="mt-12">
          <PackageGrid type="Hajj" />
        </div>
      </section>
      <SacredGallery
        eyebrow="Sacred Journey"
        title="Visuals from the Haramain"
        description="A visual reflection of the sacred places that inspire preparation, reverence, and anticipation before Hajj and Umrah."
        images={[siteConfig.assets.media.makkahImages[0], siteConfig.assets.media.makkahImages[3], siteConfig.assets.media.madinahImages[0], siteConfig.assets.media.madinahImages[3]]}
      />
      <HajjTrainingPosters
        title="Upcoming Hajj training sessions for pilgrims who want to prepare properly"
        description="Before travel, we help pilgrims understand the journey ahead through training that covers rituals, logistics, and practical expectations."
      />
      <section className="section-shell section-space">
        <SectionHeading eyebrow="FAQs" title="Planning for Hajj" description="Helpful information for travelers preparing early." />
        <div className="mt-10">
          <FAQSection
            items={[
              {
                question: "Do you provide Hajj preparation sessions?",
                answer: "Yes. Preparation is a core part of our offering so pilgrims understand logistics, rituals, and expectations before travel.",
              },
              {
                question: "Can families inquire together?",
                answer: "Absolutely. We can guide families and small groups through package planning, documentation, and travel preferences.",
              },
            ]}
          />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
