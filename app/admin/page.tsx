"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, ImageOff, Loader2, PenSquare, Plus, Search, Star, Trash2 } from "lucide-react";

import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { StatusBadge, effectiveStatus, formatPostDate } from "@/components/admin/status-badge";
import { THUMB_TRANSFORM, cloudinaryUrl } from "@/lib/blog/cloudinary";
import { triggerRebuild } from "@/lib/blog/deploy-hook";
import { deletePost, listAllPosts } from "@/lib/blog/posts";
import { BLOG_CATEGORIES, type BlogPost, type PostStatus } from "@/lib/blog/types";

type StatusFilter = "all" | PostStatus;

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  useEffect(() => {
    listAllPosts()
      .then(setPosts)
      .catch(() => setLoadError(true));
  }, []);

  const counts = useMemo(() => {
    const all = posts ?? [];
    return {
      all: all.length,
      published: all.filter((post) => effectiveStatus(post.status, post.publishedAt) === "published").length,
      draft: all.filter((post) => post.status === "draft").length,
      scheduled: all.filter((post) => effectiveStatus(post.status, post.publishedAt) === "scheduled").length,
    };
  }, [posts]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    return (posts ?? []).filter(
      (post) =>
        (statusFilter === "all" || effectiveStatus(post.status, post.publishedAt) === statusFilter) &&
        (categoryFilter === "all" || post.category === categoryFilter) &&
        (!term || post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term)),
    );
  }, [posts, search, statusFilter, categoryFilter]);

  const handleDelete = async () => {
    if (!deleting) return;
    await deletePost(deleting.id);
    if (deleting.status !== "draft") await triggerRebuild();
    setPosts((current) => current?.filter((post) => post.id !== deleting.id) ?? null);
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Blog posts</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "published", "draft", "scheduled"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={
              statusFilter === key
                ? "rounded-full bg-foreground px-4 py-2 text-sm font-semibold capitalize text-white"
                : "rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold capitalize text-slate-600 hover:text-foreground"
            }
          >
            {key} <span className="ml-1 opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search titles and excerpts"
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm focus-visible:border-primary focus-visible:outline-none"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {BLOG_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {loadError ? (
        <EmptyState title="Could not load posts" text="Check your connection and refresh the page." />
      ) : posts === null ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading posts" />
        </div>
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet" text="Write your first post to share travel guides and updates.">
          <Link href="/admin/posts/new" className="mt-5 inline-flex items-center gap-2 font-semibold text-primary hover:underline">
            <PenSquare className="h-4 w-4" />
            Write the first post
          </Link>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState title="No matching posts" text="Try a different search or filter." />
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {visible.map((post) => (
            <li key={post.id} className="flex items-center gap-4 p-4 hover:bg-slate-50/70">
              <Link href={`/admin/posts/edit?id=${post.id}`} className="shrink-0">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cloudinaryUrl(post.coverImage.publicId, THUMB_TRANSFORM)}
                    alt=""
                    className="aspect-video w-24 rounded-lg object-cover sm:w-32"
                  />
                ) : (
                  <span className="flex aspect-video w-24 items-center justify-center rounded-lg bg-slate-100 text-slate-400 sm:w-32">
                    <ImageOff className="h-5 w-5" />
                  </span>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/admin/posts/edit?id=${post.id}`} className="flex items-center gap-1.5 font-semibold hover:text-primary">
                  {post.featured && <Star className="h-4 w-4 shrink-0 fill-accent text-accent" aria-label="Featured" />}
                  <span className="truncate">{post.title || "Untitled post"}</span>
                </Link>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <StatusBadge status={post.status} publishedAt={post.publishedAt} />
                  <span>{post.category}</span>
                  {effectiveStatus(post.status, post.publishedAt) === "scheduled" ? (
                    <span className="font-semibold text-amber-700">Goes live {formatPostDate(post.publishedAt, true)}</span>
                  ) : (
                    <span>Updated {formatPostDate(post.updatedAt)}</span>
                  )}
                  <span className="hidden sm:inline">{post.readingMinutes} min read</span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/admin/posts/edit?id=${post.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-primary"
                  aria-label={`Edit ${post.title}`}
                >
                  <PenSquare className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleting(post)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-red-600"
                  aria-label={`Delete ${post.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deleting && (
        <ConfirmDelete postId={deleting.id} title={deleting.title} onCancel={() => setDeleting(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}

function EmptyState({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <FileText className="mx-auto h-10 w-10 text-slate-300" />
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{text}</p>
      {children}
    </div>
  );
}
