import { getApp, getApps, initializeApp } from "firebase/app";
import {
  Timestamp,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore/lite";

import { firebaseConfig } from "@/lib/firebase/config";
import type { BlogCategory, CoverImage, PostSeo } from "@/lib/blog/types";

// Read-only access for public pages, both at build time and in the browser.
// Uses Firestore Lite on its own app instance so the public bundle skips Auth and realtime code.
const APP_NAME = "public-blog";
const app = getApps().some((a) => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME);
const db = getFirestore(app);

// Plain, serialisable post shape (dates as ISO strings) so it can pass from server to client components.
export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  coverImage: CoverImage | null;
  youtubeIds: string[];
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  authorName: string;
  readingMinutes: number;
  featured: boolean;
  seo: PostSeo;
};

function toIso(value: unknown) {
  return value instanceof Timestamp ? value.toDate().toISOString() : new Date(0).toISOString();
}

function toPublicPost(id: string, data: Record<string, unknown>): PublicPost {
  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    excerpt: String(data.excerpt ?? ""),
    contentHtml: String(data.contentHtml ?? ""),
    coverImage: (data.coverImage as CoverImage | null) ?? null,
    youtubeIds: (data.youtubeIds as string[]) ?? [],
    category: data.category as BlogCategory,
    tags: (data.tags as string[]) ?? [],
    publishedAt: toIso(data.publishedAt),
    updatedAt: toIso(data.updatedAt ?? data.publishedAt),
    authorName: String(data.authorName ?? ""),
    readingMinutes: Number(data.readingMinutes ?? 1),
    featured: Boolean(data.featured),
    seo: (data.seo as PostSeo) ?? { metaTitle: "", metaDescription: "" },
  };
}

// The rules only allow reads of live posts, so every public query must match them:
// published posts by status alone, scheduled posts only once their time has passed.
// The scheduled cut-off sits a minute back so a fast device clock never asks for a post the server still sees as future.
const posts = () => collection(db, "posts");
const isPublished = () => where("status", "==", "published");
const isDueScheduled = (): QueryConstraint[] => [
  where("status", "==", "scheduled"),
  where("publishedAt", "<=", Timestamp.fromMillis(Date.now() - 60_000)),
];

export async function listPublishedPosts(max = 100) {
  const [published, scheduled] = await Promise.all([
    getDocs(query(posts(), isPublished(), orderBy("publishedAt", "desc"), limit(max))),
    getDocs(query(posts(), ...isDueScheduled(), orderBy("publishedAt", "desc"), limit(max))),
  ]);

  return [...published.docs, ...scheduled.docs]
    .map((d) => toPublicPost(d.id, d.data()))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, max);
}

export async function getPublishedPostBySlug(slug: string) {
  const published = await getDocs(query(posts(), where("slug", "==", slug), isPublished(), limit(1)));
  const match =
    published.docs[0] ??
    (await getDocs(query(posts(), where("slug", "==", slug), ...isDueScheduled(), limit(1)))).docs[0];
  return match ? toPublicPost(match.id, match.data()) : null;
}

// Build-time helper: a failed fetch (no network, Firestore down) should not break the whole site build.
export async function listPublishedPostsSafe() {
  try {
    return await listPublishedPosts();
  } catch (error) {
    console.warn("[blog] Could not load posts from Firestore:", error);
    return [];
  }
}
