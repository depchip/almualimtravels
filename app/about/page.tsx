import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about AlMuallim Travels and Tours, its mission, and the scholar-led guidance of Mufti Furqan Mamji.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A travel company built around sincerity, preparation, and service"
        description="AlMuallim Travels and Tours is committed to offering travel experiences that are organized, trustworthy, and spiritually meaningful."
      />
      <section className="section-shell section-space grid gap-8 lg:grid-cols-2">
        <div className="mesh-panel gold-ring rounded-[2rem] p-8">
          <SectionHeading
            eyebrow="Our Mission"
            title="Serve travelers with integrity and calm guidance"
            description="We believe travel, especially sacred travel, should be supported by knowledge, care, and honesty."
          />
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Our work combines travel coordination with education so clients feel informed, prepared, and looked after.</p>
            <p>We aim to make each journey feel responsible, spiritually focused, and accessible for individuals, families, and groups.</p>
          </div>
        </div>
        <div className="mesh-panel gold-ring rounded-[2rem] p-8">
          <SectionHeading
            eyebrow="Leadership"
            title="Mufti Furqan Mamji"
            description="Personally guiding groups, leading training sessions, and creating educational content for the wider community."
          />
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>His involvement gives travelers a strong sense of trust and a source of practical answers throughout the planning process.</p>
            <p>The result is a service that is not only about transportation and hotels, but about preparing for the journey with sincerity and understanding.</p>
          </div>
        </div>
      </section>
    </>
  );
}
