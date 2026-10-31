import type { PublicPost } from "@/lib/blog/public-posts";

// Up to `count` other posts: same category first (newest first), then the newest of the rest.
export function pickRelated(post: Pick<PublicPost, "id" | "category">, all: PublicPost[], count = 3) {
  const others = all.filter((candidate) => candidate.id !== post.id);
  const sameCategory = others.filter((candidate) => candidate.category === post.category);
  const rest = others.filter((candidate) => candidate.category !== post.category);
  return [...sameCategory, ...rest].slice(0, count);
}
