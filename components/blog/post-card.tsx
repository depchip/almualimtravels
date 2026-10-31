import Link from "next/link";
import { CalendarDays, Clock, ImageIcon, PlayCircle } from "lucide-react";

import { CARD_TRANSFORM, COVER_TRANSFORM, cloudinaryUrl } from "@/lib/blog/cloudinary-url";
import { formatPublicDate } from "@/lib/blog/format";
import type { PublicPost } from "@/lib/blog/public-posts";
import { cn } from "@/lib/utils";

type PostCardProps = {
  post: PublicPost;
  href: string;
  featured?: boolean;
};

export function PostCard({ post, href, featured = false }: PostCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group soft-card flex flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-1 hover:shadow-glow",
        featured && "lg:grid lg:grid-cols-[1.25fr,1fr]",
      )}
    >
      <div className="relative overflow-hidden bg-secondary/40">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cloudinaryUrl(post.coverImage.publicId, featured ? COVER_TRANSFORM : CARD_TRANSFORM)}
            alt={post.coverImage.alt}
            loading={featured ? "eager" : "lazy"}
            className="aspect-video h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-primary/30">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}
        {post.youtubeIds.length > 0 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
            <PlayCircle className="h-4 w-4" />
            Video
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:justify-center lg:p-10")}>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
          {featured && (
            <span className="rounded-full bg-accent/25 px-3 py-1 text-xs font-semibold text-accent-foreground">Featured</span>
          )}
        </div>
        <h2
          className={cn(
            "mt-4 font-display font-semibold leading-tight tracking-tight group-hover:text-primary",
            featured ? "text-3xl lg:text-4xl" : "text-2xl",
          )}
        >
          {post.title}
        </h2>
        <p className={cn("mt-3 text-muted-foreground", featured ? "line-clamp-4 text-base leading-7" : "line-clamp-3 text-sm leading-6")}>
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatPublicDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMinutes} min read
          </span>
        </div>
      </div>
    </Link>
  );
}
