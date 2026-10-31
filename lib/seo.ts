import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url;

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: { url: string; alt: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: MetaInput): Metadata {
  const fullTitle = `${title} | AlMuallim Travels and Tours`;
  const url = `${baseUrl}${path}`;
  const shareImage = image ?? { url: `${baseUrl}${siteConfig.assets.branding.orgLogo}`, alt: "AlMuallim Travels and Tours" };

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "AlMuallim Travels and Tours",
      locale: "en_US",
      type,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
      images: [
        {
          url: shareImage.url,
          width: 1200,
          height: 630,
          alt: shareImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage.url],
    },
    icons: {
      icon: siteConfig.assets.branding.favicon,
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "AlMuallim Travels and Tours",
  url: baseUrl,
  logo: `${baseUrl}${siteConfig.assets.branding.orgLogo}`,
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.linkedin,
    siteConfig.social.youtube,
    siteConfig.social.whatsappChannel,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Urdu"],
  },
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mufti Furqan Mamji",
  jobTitle: "Islamic Scholar and Group Guide",
  worksFor: {
    "@type": "TravelAgency",
    name: "AlMuallim Travels and Tours",
  },
  sameAs: [siteConfig.social.youtube],
  description:
    "Mufti Furqan Mamji personally leads Umrah groups, offers training sessions, and provides educational guidance for pilgrims.",
};

type BlogPostingInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  publishedTime: string;
  modifiedTime: string;
  authorName: string;
  youtubeIds: string[];
};

export function buildBlogPostingSchema(post: BlogPostingInput) {
  const url = `${baseUrl}${post.path}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url,
      mainEntityOfPage: url,
      ...(post.image ? { image: [post.image] } : {}),
      datePublished: post.publishedTime,
      dateModified: post.modifiedTime,
      author: { "@type": "Organization", name: post.authorName || siteConfig.name, url: baseUrl },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        logo: { "@type": "ImageObject", url: `${baseUrl}${siteConfig.assets.branding.orgLogo}` },
      },
    },
    ...post.youtubeIds.map((id) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: post.title,
      description: post.description,
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      uploadDate: post.publishedTime,
    })),
  ];
}
