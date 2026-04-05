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

4. Start production server locally:

```bash
npm run start
```

## Project Structure

- `app/` App Router pages, layout, globals, and API route
- `components/` Reusable sections, cards, navigation, form, and UI primitives
- `data/` Static JSON content for packages, videos, and testimonials
- `lib/` SEO helpers, utility functions, and shared site configuration
- `public/assets/branding/` Logos, favicon, and brand images
- `public/assets/media/videos/` Local Umrah and Pakistan tour videos

## Notes

- The website pages are statically rendered by default.
- The inquiry form currently posts to `app/api/inquiries/route.ts` as a mock endpoint.
- YouTube videos are handled through reusable `VideoCard` and modal playback with lazy-loaded iframes.
- WhatsApp, Facebook, YouTube, and group/community links are already wired in.
- Shared contact info, social links, and asset paths are centralized in `lib/site.ts`.
