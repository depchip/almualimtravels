import videos from "@/data/videos.json";

import { HajjTrainingPosters } from "@/components/hajj-training-posters";
import { InquiryCTA } from "@/components/site-sections";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoCard } from "@/components/video-card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Training and Resources",
  description:
    "Watch Umrah guidance, preparation sessions, and spiritual tips from Mufti Furqan Mamji in the AlMuallim Travels and Tours resource library.",
  path: "/training-resources",
});

const categories = ["Umrah Guide", "Preparation", "Spiritual Tips", "Client Reviews"];

export default function TrainingResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Training and Resources"
        title="Video guidance for pilgrims and travelers"
        description="Browse educational content from Mufti Furqan Mamji, including Umrah guidance, preparation reminders, and spiritual reflections."
      />
      <HajjTrainingPosters
        eyebrow="Live Training Posters"
        title="Upcoming Hajj training announcements"
        description="Alongside our video library, these posters highlight current Hajj training sessions for pilgrims who want timely preparation and practical guidance."
      />
      <section className="section-shell section-space space-y-16">
        {categories.map((category) => {
          const categoryVideos = videos.filter((video) => video.category === category);

          if (!categoryVideos.length) return null;

          return (
            <div key={category}>
              <SectionHeading
                eyebrow={category}
                title={`${category} Videos`}
                description="Selected videos from the official AlMuallim Travels YouTube channel."
              />
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categoryVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
      <InquiryCTA />
    </>
  );
}
