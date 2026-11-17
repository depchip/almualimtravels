import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";

import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PromoPopup } from "@/components/promo-popup";
import { SiteChrome } from "@/components/site-chrome";
import { buildMetadata, organizationSchema, personSchema } from "@/lib/seo";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Trusted Hajj, Umrah and Tours",
    description:
      "AlMuallim Travels and Tours offers trusted Hajj, Umrah, Pakistan tours, and training with guidance from Mufti Furqan Mamji.",
  }),
  verification: {
    google: "GCY4f7-Md6iXani0ofQhjwcrnQlCwc4iH-bKpjeWOeo",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <SiteChrome>
          <Navbar />
        </SiteChrome>
        <main className="min-h-screen pb-24 md:pb-0">{children}</main>
        <SiteChrome>
          <Footer />
          <FloatingActions />
          <PromoPopup />
        </SiteChrome>
        {/* AI chatbot (bottom-left). Mobile offset and admin hiding live in globals.css. */}
        <Script
          src="https://al-muallim-travels-chatbot.vercel.app/widget.js"
          data-slug="al-muallim-travels"
          data-api-url="https://al-muallim-travels-api.onrender.com"
          data-position="left"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
