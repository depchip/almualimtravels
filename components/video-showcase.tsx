import { SectionHeading } from "@/components/ui/section-heading";
import { VideoCard } from "@/components/video-card";

type Video = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
};

export function VideoShowcase({
  title,
  eyebrow,
  description,
  videos,
}: {
  title: string;
  eyebrow: string;
  description: string;
  videos: Video[];
}) {
  return (
    <section className="section-shell section-space">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}
