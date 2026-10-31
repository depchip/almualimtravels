import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type FieldValue,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import type { BlogPost } from "@/lib/blog/types";

const postsCollection = collection(db, "posts");

export type PostInput = Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
  publishedAt: BlogPost["publishedAt"] | FieldValue;
};

// IDs are generated up front so images can be uploaded into the post's folder before the first save.
export function newPostId() {
  return doc(postsCollection).id;
}

function toPost(id: string, data: Record<string, unknown>) {
  return { id, ...data } as BlogPost;
}

// Admin only: every post, drafts included, newest edit first.
export async function listAllPosts() {
  const snapshot = await getDocs(query(postsCollection, orderBy("updatedAt", "desc")));
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPost(id: string) {
  const snapshot = await getDoc(doc(postsCollection, id));
  return snapshot.exists() ? toPost(snapshot.id, snapshot.data()) : null;
}

export async function isSlugTaken(slug: string, exceptId: string) {
  const snapshot = await getDocs(query(postsCollection, where("slug", "==", slug), limit(2)));
  return snapshot.docs.some((d) => d.id !== exceptId);
}

export async function savePost(id: string, input: PostInput, isNew: boolean) {
  await setDoc(
    doc(postsCollection, id),
    {
      ...input,
      updatedAt: serverTimestamp(),
      ...(isNew ? { createdAt: serverTimestamp() } : {}),
    },
    { merge: true },
  );
}

export async function deletePost(id: string) {
  await deleteDoc(doc(postsCollection, id));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
