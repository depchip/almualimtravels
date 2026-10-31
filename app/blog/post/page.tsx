"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { PostView } from "@/components/blog/post-view";
import { getPublishedPostBySlug, listPublishedPosts, type PublicPost } from "@/lib/blog/public-posts";
import { pickRelated } from "@/lib/blog/related";

// Serves posts published after the last deploy, loaded live from Firestore.
// Once the site is rebuilt, the same post also gets a pre-rendered /blog/<slug> page.
export default function BlogPostFallbackPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LivePost />
    </Suspense>
  );
}

function LivePost() {
  const slug = useSearchParams().get("slug") ?? "";
  const [post, setPost] = useState<PublicPost | null | undefined>(undefined);
  const [related, setRelated] = useState<PublicPost[]>([]);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      return;
    }

    getPublishedPostBySlug(slug)
      .then((found) => {
        setPost(found);
        if (found) {
          document.title = `${found.seo.metaTitle || found.title} | AlMuallim Travels and Tours`;
          listPublishedPosts(30)
            .then((all) => setRelated(pickRelated(found, all)))
            .catch(() => setRelated([]));
        }
      })
      .catch(() => setPost(null));
  }, [slug]);

  if (post === undefined) return <Loading />;

  if (!post) {
    return (
      <section className="section-shell pb-20 pt-32 text-center">
        <h1 className="font-display text-4xl font-semibold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">It may have been moved or unpublished.</p>
        <Link href="/blog" className="mt-6 inline-block font-semibold text-primary hover:underline">
          Browse all articles
        </Link>
      </section>
    );
  }

  return <PostView post={post} related={related} />;
}

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading article" />
    </div>
  );
}
