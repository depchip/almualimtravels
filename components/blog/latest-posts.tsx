import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PostCard } from "@/components/blog/post-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { listPublishedPostsSafe } from "@/lib/blog/public-posts";

// Home page strip of the newest articles. Rendered at build time only, so the home page
// loads no Firebase code; the deploy hook rebuilds it after each publish.
export async function LatestPosts() {
  const posts = (await listPublishedPostsSafe()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="From Our Blog"
          title="Guides and updates for your next journey"
          description="Practical Hajj and Umrah advice, travel tips and news from our tours."
        />
        <Link href="/blog" className="text-sm font-semibold text-primary">
          Read the blog <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} href={`/blog/${post.slug}`} />
        ))}
      </div>
    </section>
  );
}
