import { BlogList } from "@/components/blog/blog-list";
import { PageHero } from "@/components/ui/page-hero";
import { listPublishedPostsSafe } from "@/lib/blog/public-posts";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Hajj and Umrah guides, travel tips, and tour updates from AlMuallim Travels and Tours to help you prepare for every journey.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await listPublishedPostsSafe();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Guides and updates for your sacred journeys"
        description="Practical Hajj and Umrah guidance, packing and travel tips, and news from our tours across Pakistan and abroad."
      />
      <section className="section-shell section-space">
        <BlogList initialPosts={posts} builtSlugs={posts.map((post) => post.slug)} />
      </section>
    </>
  );
}
