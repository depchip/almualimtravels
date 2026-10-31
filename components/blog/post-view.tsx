import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, MessageCircle, UserRound } from "lucide-react";

import { PostCard } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { COVER_TRANSFORM, cloudinaryUrl } from "@/lib/blog/cloudinary-url";
import { formatPublicDate, postHref } from "@/lib/blog/format";
import type { PublicPost } from "@/lib/blog/public-posts";
import { sanitizePostHtml } from "@/lib/blog/sanitize";
import { siteConfig } from "@/lib/site";

type PostViewProps = {
  post: PublicPost;
  related?: PublicPost[];
  builtSlugs?: string[];
};

export function PostView({ post, related = [], builtSlugs = [] }: PostViewProps) {
  const built = new Set(builtSlugs);

  return (
    <article className="section-shell pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>

        <span className="mt-8 block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {post.category}
        </span>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {post.authorName && (
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-4 w-4" />
              {post.authorName}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            {formatPublicDate(post.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readingMinutes} min read
          </span>
        </div>
      </div>

      {post.coverImage && (
        <figure className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] bg-secondary/40 shadow-glow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cloudinaryUrl(post.coverImage.publicId, COVER_TRANSFORM)}
            alt={post.coverImage.alt}
            width={1200}
            height={675}
            className="aspect-video w-full object-cover"
          />
        </figure>
      )}

      <div className="mx-auto mt-12 max-w-3xl">
        <div
          className="post-content prose prose-lg max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-blockquote:border-l-accent prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: sanitizePostHtml(post.contentHtml) }}
        />

        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                #{tag}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 border-t border-primary/10 pt-8">
          <ShareButtons title={post.title} />
        </div>

        <aside className="mesh-panel gold-ring mt-12 rounded-[2rem] px-6 py-10 sm:px-10">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Planning your Hajj, Umrah or tour?</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Our team in Karachi will help you choose the right package and prepare for every step of the journey.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-semibold text-white hover:bg-[#1fb658]"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Send an inquiry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Keep reading</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.id} post={item} href={postHref(item.slug, built)} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
