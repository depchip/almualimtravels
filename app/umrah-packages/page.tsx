import { FAQSection } from "@/components/faq-section";
import { PackageGrid } from "@/components/page-grid";
import { SacredGallery } from "@/components/sacred-gallery";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Umrah Packages",
  description:
    "Discover Umrah packages for individuals, families, and guided groups with trusted support from AlMuallim Travels and Tours.",
  path: "/umrah-packages",
});

export default function UmrahPackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Umrah Packages"
        title="Flexible Umrah packages shaped by guidance and thoughtful service"
        description="Choose from guided group travel or flexible family-focused planning with support before, during, and after your journey."
      />
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Packages"
          title="Umrah journeys for different needs"
          description="Packages can be tailored around timing, accommodation preferences, and the level of training support needed."
        />
        <div className="mt-12">
          <PackageGrid type="Umrah" />
        </div>
      </section>
      <SacredGallery
        eyebrow="Journey Atmosphere"
        title="The beauty of Makkah and Madinah"
        description="These sacred views help visitors feel the atmosphere of the Haramain and the kind of journey AlMuallim travelers prepare for."
        images={[...siteConfig.assets.media.makkahImages, ...siteConfig.assets.media.madinahImages].slice(0, 4)}
      />
      <section className="section-shell section-space">
        <SectionHeading eyebrow="FAQs" title="Before you book" description="A few common points about our Umrah services." />
        <div className="mt-10">
          <FAQSection
            items={[
              {
                question: "Is the guided Umrah package suitable for first-time pilgrims?",
                answer: "Yes. It is especially helpful for first-time pilgrims because it combines travel coordination with detailed guidance and training.",
              },
              {
                question: "Do you offer family Umrah arrangements?",
                answer: "Yes. We can help families plan their Umrah journey with comfortable pacing, accommodation options, and optional preparation sessions.",
              },
            ]}
          />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
