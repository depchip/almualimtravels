import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { FloatingActions } from "@/components/floating-actions";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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

export const metadata: Metadata = buildMetadata({
  title: "Trusted Hajj, Umrah and Tours",
  description:
    "Al Mualim Travels and Tours offers trusted Hajj, Umrah, Pakistan tours, and training with guidance from Mufti Furqan Mamji.",
});

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
        <Navbar />
        <main className="min-h-screen pb-24 md:pb-0">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
