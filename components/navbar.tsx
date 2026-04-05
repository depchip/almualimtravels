"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/", label: "Home" },
  { href: "/umrah-with-guidance", label: "Umrah with Guidance" },
  { href: "/hajj-packages", label: "Hajj Packages" },
  { href: "/umrah-packages", label: "Umrah Packages" },
  { href: "/domestic-tours", label: "Domestic Tours" },
  { href: "/international-tours", label: "International Tours" },
  { href: "/training-resources", label: "Training" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "px-3 pt-3" : "px-0 pt-2"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          scrolled
            ? "rounded-full border border-white/60 bg-white/90 px-4 shadow-lg backdrop-blur"
            : "border-transparent bg-transparent px-4"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image src={siteConfig.assets.branding.orgLogo} alt={`${siteConfig.name} logo`} width={48} height={48} className="h-11 w-11 sm:h-12 sm:w-12" />
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold sm:text-lg">{siteConfig.shortName}</p>
              <p className="truncate text-[10px] uppercase tracking-[0.24em] text-muted-foreground sm:text-xs">Hajj, Umrah & Tours</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/contact">
              <Button>Inquire Now</Button>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 rounded-full border border-primary/10 bg-white/80 p-2.5 lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="pb-4 lg:hidden">
            <div className="rounded-[1.5rem] border border-primary/10 bg-white/95 p-4 shadow-lg">
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-foreground/80 hover:text-primary"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setOpen(false)}>
                  <Button className="w-full">Inquire Now</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
