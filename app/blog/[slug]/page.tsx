import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LivePost } from "@/components/blog/live-post";
import { OG_TRANSFORM, cloudinaryUrl } from "@/lib/blog/cloudinary-url";
import { getPublishedPostBySlug, listPublishedPostsSafe } from "@/lib/blog/public-posts";
import { pickRelated } from "@/lib/blog/related";
import { buildBlogPostingSchema, buildMetadata } from "@/lib/seo";

// Static export: only posts published at build time get a page here.
// Newer posts are served by /blog/post?slug= until the next deploy.
export const dynamicParams = false;

// An export build fails if a dynamic route has no params, so an empty blog gets one 404 placeholder.
const EMPTY_PLACEHOLDER = "no-posts-yet";

type Props = { params: Promise<{ slug: string }> };

// One listing fetch per build worker, shared by every post page it renders.
const loadAllPosts = cache(() => listPublishedPostsSafe());

const loadPost = cache(async (slug: string) => {
  if (slug === EMPTY_PLACEHOLDER) return null;
  try {
    return await getPublishedPostBySlug(slug);
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  const posts = await loadAllPosts();
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: EMPTY_PLACEHOLDER }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return { title: "Article not found", robots: { index: false } };
  }

  return buildMetadata({
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    image: post.coverImage
      ? { url: cloudinaryUrl(post.coverImage.publicId, OG_TRANSFORM), alt: post.coverImage.alt }
      : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) notFound();

  const allPosts = await loadAllPosts();

  const schema = buildBlogPostingSchema({
    title: post.title,
    description: post.seo.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage ? cloudinaryUrl(post.coverImage.publicId, OG_TRANSFORM) : undefined,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authorName: post.authorName,
    youtubeIds: post.youtubeIds,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LivePost initialPost={post} related={pickRelated(post, allPosts)} builtSlugs={allPosts.map((p) => p.slug)} />
    </>
  );
}
