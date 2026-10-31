// Fixed locale and time zone so server-rendered and browser-rendered dates always match.
export function formatPublicDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Karachi",
  });
}

// Posts built into the static export get their own page; newer ones use the client-side fallback.
export function postHref(slug: string, builtSlugs: ReadonlySet<string>) {
  return builtSlugs.has(slug) ? `/blog/${slug}` : `/blog/post?slug=${encodeURIComponent(slug)}`;
}
