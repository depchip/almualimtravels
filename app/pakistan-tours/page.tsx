import { PackageGrid } from "@/components/page-grid";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Pakistan Tours",
  description:
    "Explore Pakistan tours with curated itineraries, seasonal departures, and trusted coordination from AlMuallim Travels and Tours.",
  path: "/pakistan-tours",
});

const tourVideos = siteConfig.assets.media.pakistanTourVideos;

export default function PakistanToursPage() {
  return (
    <>
      <PageHero
        eyebrow="Domestic Tours"
        title="Curated domestic journeys across the beauty of Pakistan"
        description="Discover scenic escapes, family adventures, and group tours arranged with dependable planning and warm service."
      />
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Featured Tours"
          title="Explore our domestic tour packages"
          description="From northern landscapes to custom seasonal departures, our itineraries are designed around comfort, scenery, and responsible coordination."
        />
        <div className="mt-12">
          <PackageGrid type="Domestic Tour" />
        </div>
      </section>
      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Tour Highlights"
          title="A glimpse of the road ahead"
          description="Short clips from your Pakistan tour library to help visitors feel the mood and destination style."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tourVideos.map((src) => (
            <div key={src} className="overflow-hidden rounded-[2rem] bg-primary p-3 shadow-glow">
              <video src={src} controls preload="metadata" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover" />
            </div>
          ))}
        </div>
      </section>
      <InquiryCTA />
    </>
  );
}
