"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useState } from "react";

import { VideoModal } from "@/components/video-modal";
import { siteConfig } from "@/lib/site";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/utils";

type Video = {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
};

export function VideoCard({ video }: { video: Video }) {
  const [open, setOpen] = useState(false);
  const thumbnail = youtubeThumbnail(video.url) ?? siteConfig.assets.branding.orgLogo;
  const embedUrl = youtubeEmbedUrl(video.url);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mesh-panel gold-ring group h-full overflow-hidden rounded-[2rem] text-left"
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-white/90 p-4 text-primary shadow-xl transition-transform duration-300 group-hover:scale-110">
              <Play className="h-6 w-6 fill-current" />
            </span>
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {video.category}
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl font-semibold">{video.title}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">{video.description}</p>
        </div>
      </button>
      <VideoModal open={open} onClose={() => setOpen(false)} embedUrl={embedUrl} title={video.title} />
    </>
  );
}
