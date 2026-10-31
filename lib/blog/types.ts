import type { Timestamp } from "firebase/firestore";

export const BLOG_CATEGORIES = ["Hajj", "Umrah", "Travel Tips", "Pakistan Tours", "International", "News"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type PostStatus = "draft" | "published" | "scheduled";

export type CoverImage = {
  url: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
};

export type PostSeo = {
  metaTitle: string;
  metaDescription: string;
};

// One document in the Firestore `posts` collection.
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentJson: Record<string, unknown> | null;
  contentHtml: string;
  coverImage: CoverImage | null;
  youtubeIds: string[];
  category: BlogCategory;
  tags: string[];
  status: PostStatus;
  publishedAt: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  authorName: string;
  readingMinutes: number;
  featured: boolean;
  seo: PostSeo;
};

export const DEFAULT_AUTHOR = "AlMuallim Travels";
