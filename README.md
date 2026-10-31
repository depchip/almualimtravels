# AlMuallim Travels and Tours

Production-ready static website built with Next.js App Router, TypeScript, Tailwind CSS, reusable UI components, Framer Motion, and a mock inquiry API route.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form + Zod
- ShadCN-style reusable UI primitives

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview the static export locally:

```bash
npx serve out
```

## Project Structure

- `app/` App Router pages, layout and globals (`app/blog` public blog, `app/admin` blog admin)
- `components/` Reusable sections, cards, navigation, form, and UI primitives
- `data/` Static JSON content for packages, videos, and testimonials
- `lib/` SEO helpers, utility functions, shared site configuration, Firebase (`lib/firebase`) and blog data (`lib/blog`)
- `public/assets/branding/` Logos, favicon, and brand images
- `public/assets/media/videos/` Local Umrah and Pakistan tour videos

## Notes

- The website pages are statically rendered by default.
- The site is a static export (`out/`). Inquiry and booking forms post to Formspree (`lib/formspree.ts`).
- YouTube videos are handled through reusable `VideoCard` and modal playback with lazy-loaded iframes.
- WhatsApp, Facebook, YouTube, and group/community links are already wired in.
- Shared contact info, social links, and asset paths are centralized in `lib/site.ts`.

## Blog and admin

Admins write posts at `/admin` (sign in at `/admin/login`). Readers see them at `/blog`.

- **Firebase Auth** signs the admin in. Only the UID listed in `firestore.rules` and `lib/firebase/client.ts` (`ADMIN_UIDS`) can write.
- **Cloud Firestore** (`posts` collection, region `asia-southeast1`) stores posts. Rules and indexes live in `firestore.rules` and `firestore.indexes.json`.
- **Cloudinary** stores cover photos and inline images via the unsigned upload preset `almuallim_blog`. Never put the Cloudinary API secret in this repo or in a `NEXT_PUBLIC_` variable.
- **Editor**: Tiptap with headings, formatting, colours, alignment, lists, checklists, tables, images (paste or drag in), YouTube embeds, code blocks, a `/` block menu, autosave for drafts, browser backup of unsaved work, preview and scheduling.

### How a post reaches readers

1. Publishing saves the post and calls the Render deploy hook (`NEXT_PUBLIC_DEPLOY_HOOK_URL`).
2. Straight away, `/blog` lists it (the listing refreshes live from Firestore) and it opens at `/blog/post?slug=…`.
3. A few minutes later the rebuild finishes and the post has its own pre-rendered, SEO-ready page at `/blog/<slug>`, and appears in `sitemap.xml` and the home page "From Our Blog" strip.
4. Scheduled posts appear on `/blog` at their scheduled time; their own page arrives with the next deploy.

### Setup

1. Copy `.env.example` to `.env.local` and fill in the values. Set the same variables in Render under the static site's **Environment**.
2. Deploy rules and indexes after changing them:

```bash
npx firebase-tools deploy --only firestore
```

3. Render static site settings: build command `npm install && npm run build`, publish directory `out`. Copy the site's **Deploy Hook** URL (Settings → Deploy Hook) into `NEXT_PUBLIC_DEPLOY_HOOK_URL`.
4. Cloudinary: create an **unsigned** upload preset named `almuallim_blog` limited to `jpg, jpeg, png, webp`, max 5 MB, overwrite off.
