import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-primary text-primary-foreground">
      <div className="section-shell py-14">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:grid-cols-[1.2fr,0.9fr,1fr] md:p-8">
          <div>
            <h3 className="font-display text-2xl font-semibold">{siteConfig.name}</h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80">
              Trusted Hajj, Umrah, and tour experiences with preparation, spiritual guidance, and personal care.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">Explore</h4>
            <div className="mt-5 grid gap-3 text-sm">
              <Link href="/umrah-with-guidance">Umrah with Guidance</Link>
              <Link href="/hajj-packages">Hajj Packages</Link>
              <Link href="/umrah-packages">Umrah Packages</Link>
              <Link href="/domestic-tours">Domestic Tours</Link>
              <Link href="/international-tours">International Tours</Link>
              <Link href="/training-resources">Training & Resources</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">Contact</h4>
            <div className="mt-5 space-y-4 text-sm">
              {siteConfig.phoneNumbers.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-start gap-3 text-primary-foreground/85">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{phone}</span>
                </a>
              ))}
              <a href={`mailto:${siteConfig.email}`} className="flex items-start gap-3 text-primary-foreground/85">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="break-all">{siteConfig.email}</span>
              </a>
              <a
                href={siteConfig.maps.search}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 text-primary-foreground/85"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{siteConfig.address}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-4 py-5 text-sm text-primary-foreground/70 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">Copyright © 2025 AlMuallim Travel. All Rights Reserved By AlMuallim</p>
          <a
            href="https://www.depchip.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10"
          >
            <span>Powered by</span>
            <Image src={siteConfig.assets.branding.depchipLogo} alt="Depchip logo" width={28} height={28} className="rounded-full" />
            <span className="font-medium text-primary-foreground">Depchip</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
