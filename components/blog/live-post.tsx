"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PostView } from "@/components/blog/post-view";
import { getPublishedPostBySlug, type PublicPost } from "@/lib/blog/public-posts";

type LivePostProps = {
  initialPost: PublicPost;
  related: PublicPost[];
  builtSlugs: string[];
};

// Wraps a pre-rendered post page. After load it checks Firestore once, so edits show up
// and unpublished or deleted posts disappear without waiting for the next site rebuild.
export function LivePost({ initialPost, related, builtSlugs }: LivePostProps) {
  const [post, setPost] = useState<PublicPost | null>(initialPost);

  useEffect(() => {
    getPublishedPostBySlug(initialPost.slug)
      .then((fresh) => {
        if (!fresh) setPost(null);
        else if (fresh.updatedAt !== initialPost.updatedAt) setPost(fresh);
      })
      .catch(() => {
        // Offline or Firestore unavailable: keep showing the pre-rendered version.
      });
  }, [initialPost.slug, initialPost.updatedAt]);

  if (!post) {
    return (
      <section className="section-shell pb-20 pt-32 text-center">
        <h1 className="font-display text-4xl font-semibold">This article is no longer available</h1>
        <p className="mt-3 text-muted-foreground">It may have been updated, moved or taken down.</p>
        <Link href="/blog" className="mt-6 inline-block font-semibold text-primary hover:underline">
          Browse all articles
        </Link>
      </section>
    );
  }

  return <PostView post={post} related={related} builtSlugs={builtSlugs} />;
}
