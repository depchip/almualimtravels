import videos from "@/data/videos.json";

import { FAQSection } from "@/components/faq-section";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoShowcase } from "@/components/video-showcase";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Umrah with Guidance",
  description:
    "Experience Umrah with personal guidance from Mufti Furqan Mamji, including training sessions, educational content, and trusted group support.",
  path: "/umrah-with-guidance",
});

const faqItems = [
  {
    question: "What makes this Umrah special?",
    answer:
      "This journey includes personal group leadership by Mufti Furqan Mamji, training before travel, and ongoing guidance to help pilgrims understand each step with confidence.",
  },
  {
    question: "Are training sessions included?",
    answer:
      "Yes. The guided Umrah experience emphasizes pre-travel preparation, practical reminders, and space for questions so pilgrims feel spiritually and logistically ready.",
  },
  {
    question: "Who is this suitable for?",
    answer:
      "It is well suited for first-time pilgrims, families, and returning travelers who want a more grounded and supported experience.",
  },
];

export default function UmrahWithGuidancePage() {
  const featuredVideos = videos.filter((video) => video.category !== "Testimonials").slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Mufti-Led Umrah"
        title="A guided Umrah journey with preparation, clarity, and companionship"
        description="Travel with Mufti Furqan Mamji in an Umrah experience centered on Islamic guidance, practical preparation, and calm confidence throughout the journey."
      />

      <section className="section-shell section-space grid gap-10 lg:grid-cols-[0.95fr,1.05fr]">
        <div className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
          <SectionHeading
            eyebrow="About Mufti"
            title="Guidance rooted in knowledge and service"
            description="Mufti Furqan Mamji personally leads groups for Umrah, conducts training sessions, and shares educational reminders through accessible online content."
          />
          <div className="mt-8 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>His role goes beyond logistics. He helps pilgrims prepare their hearts, understand the rites, and travel with greater sincerity and confidence.</p>
            <p>This combination of scholarship, experience, and accessibility gives the journey a deeply reassuring foundation for individuals and families alike.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-primary p-3 shadow-glow">
          <video
            src={siteConfig.assets.media.umrahHero}
            controls
            preload="metadata"
            className="h-full min-h-[280px] w-full rounded-[1.5rem] object-cover sm:min-h-[380px]"
          />
        </div>
      </section>

      <section className="section-shell section-space">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Live guidance from an experienced scholar",
            "Training sessions included before departure",
            "Supportive group environment throughout the journey",
          ].map((item) => (
            <div key={item} className="mesh-panel gold-ring rounded-[2rem] p-6">
              <h3 className="font-display text-2xl font-semibold">{item}</h3>
            </div>
          ))}
        </div>
      </section>

      <VideoShowcase
        eyebrow="Training Sessions Included"
        title="Learn before you travel"
        description="These resources reflect the kind of preparation that supports pilgrims before departure and deepens understanding during the journey."
        videos={featuredVideos}
      />

      <section className="section-shell section-space">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Common questions about guided Umrah"
          description="A few common points travelers ask before reserving their place."
        />
        <div className="mt-10">
          <FAQSection items={faqItems} />
        </div>
      </section>

      <InquiryCTA />
    </>
  );
}
