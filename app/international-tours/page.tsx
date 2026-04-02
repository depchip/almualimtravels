import { PackageGrid } from "@/components/page-grid";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "International Tours",
  description:
    "Browse international tour options from Al Mualim Travels and Tours for families, groups, and custom departures.",
  path: "/international-tours",
});

export default function InternationalToursPage() {
  return (
    <>
      <PageHero
        eyebrow="International Tours"
        title="Global destinations arranged with comfort and confidence"
        description="We organize international tours for travelers who want thoughtful itineraries, dependable coordination, and destination flexibility."
      />
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Packages"
          title="International travel experiences"
          description="Speak with us for destination-specific planning, timing, and package customization."
        />
        <div className="mt-12">
          <PackageGrid type="International Tour" />
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
