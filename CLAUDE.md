# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev     # local dev server
npm run build   # static export to out/ — also the only type/compile check
npm run start   # note: with output: "export", serve out/ instead (e.g. npx serve out)
```

There is no test suite, and ESLint is not installed, so `npm run lint` will not work without setup. Use `npm run build` to verify changes.

## Architecture

Marketing site for AlMuallim Travels and Tours (Hajj/Umrah/tour agency in Karachi), built with Next.js 15 App Router, React 19, TypeScript, Tailwind 3, and Framer Motion.

- **Fully static export.** `next.config.ts` sets `output: "export"` and `images.unoptimized: true`. There are no API routes or server actions (the README's mention of `app/api/inquiries` is out of date). Anything dynamic must run client-side, and new dynamic routes need `generateStaticParams`.
- **Forms post straight to Formspree.** `components/inquiry-form.tsx` and `components/booking-form.tsx` (React Hook Form + Zod) call `submitToFormspree` in `lib/formspree.ts`. The endpoint ID there gets changed from time to time.
- **Package data is JSON.** Every Hajj/Umrah/domestic/international package is defined in `data/packages.json`, typed by `TravelPackage` in `lib/packages.ts`. The listing pages (`app/hajj-packages`, `app/umrah-packages`, `app/domestic-tours`, `app/international-tours`) filter with `getPackagesByType`. `app/packages/[id]/page.tsx` statically generates one detail page per package. That page's `BookingForm` takes its category options from `pkg.bookingCategories`. When editing a package, keep the `type`, `theme`, `route` and `bookingCategories`/`pricingTiers` labels consistent with each other.
- **Site-wide config** lives in `lib/site.ts`: contact numbers, address, social links, Google rating and review count, and every asset path. `lib/seo.ts` provides `buildMetadata()` (used by each page's `metadata` export) and the JSON-LD schemas injected in `app/layout.tsx`.
- **Layout shell:** `app/layout.tsx` renders `Navbar`, `Footer`, `FloatingActions` (WhatsApp, etc.) and `PromoPopup` on every page.
- **UI primitives** in `components/ui/` are ShadCN-style (`cva` + `cn` from `lib/utils.ts`). Page sections are composed from `components/site-sections.tsx`, `animated-section.tsx`, etc.

## Assets

- Served files live under `public/assets/...` and are referenced through `siteConfig.assets` in `lib/site.ts`. The root-level folders (`MakkahImages/`, `MadinahImages/`, `UmrahVideo/`, `PakistanTourVideo/`, `UpcomingHajjTrainingPosters/`) and root `*.png` logos are original source copies that the site does not serve.
- The current monthly Umrah poster sits at `public/UmrahPkg<Month>.jpeg`.

## Recurring task: monthly Umrah poster swap

Each month the Umrah poster gets replaced. Recent commits show the pattern:
1. Add the new `public/UmrahPkg<Month>.jpeg` and delete the old one.
2. Update the image `src` and the alt text (month, year, days, starting price) in `components/promo-popup.tsx`, `components/umrah-popup.tsx`, and `components/umrah-poster-banner.tsx`. In the banner, also update the default `title` and `description` (departure date, airline).

`components/umrah-popup.tsx` is not currently mounted anywhere, but it is kept in sync anyway.

## Blog (Firebase + Cloudinary)

- Public: `app/blog/page.tsx` (listing), `app/blog/[slug]/page.tsx` (pre-rendered at build via `generateStaticParams`), `app/blog/post/page.tsx` (client fallback for posts newer than the last build). `components/blog/live-post.tsx` re-checks Firestore after load so edits/unpublishes show without a rebuild. Public reads use Firestore Lite in `lib/blog/public-posts.ts` on a named Firebase app; every public query must keep the `status in [...]` + `publishedAt <=` filters or the rules reject it.
- Admin: `/admin/login`, `/admin/forgot-password`, `/admin` (dashboard), `/admin/posts/new`, `/admin/posts/edit?id=`. Guard in `components/admin/admin-shell.tsx`; `components/site-chrome.tsx` hides the public navbar/footer/popups on `/admin`. Editor: `components/admin/post-editor.tsx` + `components/admin/rich-text-editor.tsx` (Tiptap v3) + `components/admin/editor/*`.
- Only import `lib/firebase/client.ts` from admin code, never from the root layout or public pages. The home page's `LatestPosts` is build-time only so the home page ships no Firebase code.
- Post HTML is sanitised by `lib/blog/sanitize.ts` (DOMPurify): only YouTube iframes and `text-align`/`color`/`background-color` styles survive. Content styles live under `.post-content` in `app/globals.css`.
- The admin is matched by UID in both `firestore.rules` and `ADMIN_UIDS` in `lib/firebase/client.ts`; keep them in sync. Deploy rules/indexes with `npx firebase-tools deploy --only firestore`.
- Images go to Cloudinary through the unsigned preset in `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Never put the Cloudinary API secret in the repo or a `NEXT_PUBLIC_` variable. Deleting a post does not delete its Cloudinary folder (`almuallim/blog/<postId>`); that needs the secret, so it is manual.
- Publishing calls `NEXT_PUBLIC_DEPLOY_HOOK_URL` (Render) to rebuild the static site.
- Running `npm run build` while `npm run dev` is running corrupts the dev server's `.next`; stop dev first, then `rm -rf .next` before restarting it.
