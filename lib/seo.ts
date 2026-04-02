import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

const baseUrl = siteConfig.url;

type MetaInput = {
  title: string;
  description: string;
  path?: string;
};

export function buildMetadata({ title, description, path = "/" }: MetaInput): Metadata {
  const fullTitle = `${title} | Al Mualim Travels and Tours`;
  const url = `${baseUrl}${path}`;

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
      siteName: "Al Mualim Travels and Tours",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}${siteConfig.assets.branding.orgLogo}`,
          width: 1200,
          height: 630,
          alt: "Al Mualim Travels and Tours",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${baseUrl}${siteConfig.assets.branding.orgLogo}`],
    },
    icons: {
      icon: siteConfig.assets.branding.favicon,
    },
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Al Mualim Travels and Tours",
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
    name: "Al Mualim Travels and Tours",
  },
  sameAs: [siteConfig.social.youtube],
  description:
    "Mufti Furqan Mamji personally leads Umrah groups, offers training sessions, and provides educational guidance for pilgrims.",
};
