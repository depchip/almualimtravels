"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";

import { PostCard } from "@/components/blog/post-card";
import { postHref } from "@/lib/blog/format";
import { listPublishedPosts, type PublicPost } from "@/lib/blog/public-posts";
import { BLOG_CATEGORIES } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type BlogListProps = {
  initialPosts: PublicPost[];
  builtSlugs: string[];
};

// Starts from the posts baked in at build time, then refreshes from Firestore
// so anything published since the last deploy shows up straight away.
export function BlogList({ initialPosts, builtSlugs }: BlogListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const built = useMemo(() => new Set(builtSlugs), [builtSlugs]);

  useEffect(() => {
    listPublishedPosts()
      .then(setPosts)
      .catch(() => {
        // Keep the build-time list if the live refresh fails.
      });
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter(
      (post) =>
        (category === "All" || post.category === category) &&
        (!term || post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term)),
    );
  }, [posts, category, search]);

  const isFiltering = category !== "All" || search.trim() !== "";
  const featured = isFiltering ? undefined : (filtered.find((post) => post.featured) ?? filtered[0]);
  const rest = filtered.filter((post) => post !== featured);
  const usedCategories = BLOG_CATEGORIES.filter((c) => posts.some((post) => post.category === c));

  if (posts.length === 0) {
    return (
      <div className="soft-card bg-white p-12 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-primary/40" />
        <h2 className="mt-4 font-display text-3xl font-semibold">Articles coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Our team is preparing travel guides and Hajj and Umrah updates. Please check back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...usedCategories].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setCategory(name);
                setVisibleCount(PAGE_SIZE);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                category === name ? "bg-primary text-primary-foreground" : "border border-primary/15 bg-white text-foreground hover:border-primary",
              )}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search articles"
            aria-label="Search articles"
            className="flex h-11 w-full rounded-full border border-primary/15 bg-white pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      {featured && <PostCard post={featured} href={postHref(featured.slug, built)} featured />}

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No articles match your search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} href={postHref(post.slug, built)} />
          ))}
        </div>
      )}

      {rest.length > visibleCount && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-full border border-primary/20 bg-white px-6 py-3 text-sm font-semibold hover:border-primary"
          >
            Load more articles
          </button>
        </div>
      )}
    </div>
  );
}
