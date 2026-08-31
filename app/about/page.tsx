import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about AlMuallim Travels and Tours, its mission, and the scholar-led guidance of Mufti Furqan Mamji and Maulana Dr. Muhammad Nisar.",
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

      <section className="section-shell -mt-4 pb-16">
        <div className="mesh-panel gold-ring rounded-[2rem] p-8">
          <SectionHeading
            eyebrow="Scholarly Partner"
            title="Maulana Dr. Muhammad Nisar"
            description="Islamic scholar, educator, researcher, and academic administrator dedicated to guiding pilgrims with knowledge and sincerity."
          />
          <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>Maulana Dr. Muhammad Nisar is a respected Islamic scholar with a deep focus on the Qur&apos;an, Hadith, Seerah, and character development. He serves in an educational leadership role at Hidayah Academy, where he contributes to the academic and moral development of students.</p>
            <p>He is currently pursuing PhD-level research in Islamic Studies and remains actively engaged in guiding and educating pilgrims during Hajj and Umrah. His work reflects a blend of Islamic scholarship, research, education, training, and community service.</p>
          </div>
        </div>
      </section>
    </>
  );
}
