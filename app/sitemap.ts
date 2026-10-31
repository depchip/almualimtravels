import type { MetadataRoute } from "next";

import { listPublishedPostsSafe } from "@/lib/blog/public-posts";
import { allPackages } from "@/lib/packages";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const staticPaths = [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/hajj-packages",
  "/umrah-packages",
  "/umrah-with-guidance",
  "/domestic-tours",
  "/international-tours",
  "/pakistan-tours",
  "/training-resources",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPublishedPostsSafe();

  return [
    ...staticPaths.map((path) => ({ url: `${siteConfig.url}${path}` })),
    ...allPackages.map((pkg) => ({ url: `${siteConfig.url}/packages/${pkg.id}` })),
    ...posts.map((post) => ({ url: `${siteConfig.url}/blog/${post.slug}`, lastModified: post.updatedAt })),
  ];
}
