import { Facebook, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";

import { InquiryForm } from "@/components/inquiry-form";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact Al Mualim Travels and Tours for Hajj, Umrah, tours, training, and general travel inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Reach out for package details, training, or custom travel planning"
        description="Send your inquiry and we will be ready to help you with Hajj, Umrah, Pakistan tours, international tours, or training sessions."
      />
      <section className="section-shell section-space grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Get in Touch"
            title="Reach us directly or connect with our community"
            description="Call, email, visit, or follow the channels where updates and educational resources are regularly shared."
          />
          <div className="space-y-4">
            {siteConfig.phoneNumbers.map((phone) => (
              <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="soft-card flex items-center gap-3 p-5">
                <Phone className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">{phone}</span>
              </a>
            ))}
            <a href={`mailto:${siteConfig.email}`} className="soft-card flex items-center gap-3 p-5">
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-sm break-all">{siteConfig.email}</span>
            </a>
            <a
              href={siteConfig.maps.search}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-start gap-3 p-5"
            >
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <span className="text-sm">{siteConfig.address}</span>
            </a>
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-5"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-sm">Chat on WhatsApp</span>
            </a>
            <a
              href={siteConfig.social.whatsappChannel}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-5"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-sm">WhatsApp Community Channel</span>
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-5"
            >
              <Facebook className="h-5 w-5 text-primary" />
              <span className="text-sm">Facebook Page</span>
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-5"
            >
              <Linkedin className="h-5 w-5 text-primary" />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={siteConfig.social.youtube}
              target="_blank"
              rel="noreferrer"
              className="soft-card flex items-center gap-3 p-5"
            >
              <Youtube className="h-5 w-5 text-primary" />
              <span className="text-sm">YouTube Channel</span>
            </a>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-primary/10 px-5 py-4">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium">Google Maps</p>
            </div>
            <iframe
              title="Al Mualim Travels and Tours location"
              src={siteConfig.maps.embed}
              loading="lazy"
              className="h-[320px] w-full"
            />
          </div>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
