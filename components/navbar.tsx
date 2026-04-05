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
        scrolled ? "px-3 pt-3" : "px-3 pt-3"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ${
          scrolled
            ? "rounded-[2rem] border border-white/65 bg-white/88 px-3 shadow-[0_18px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:px-4"
            : "rounded-[2rem] border border-white/40 bg-white/78 px-3 shadow-[0_14px_50px_rgba(37,99,235,0.10)] backdrop-blur-xl sm:px-4"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20 lg:grid lg:grid-cols-[auto,minmax(0,1fr),auto] lg:gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-2xl py-2 sm:gap-3 lg:max-w-[19rem] xl:max-w-none">
            <div className="shrink-0 rounded-2xl bg-white/90 p-2 shadow-sm ring-1 ring-primary/8">
              <Image
                src={siteConfig.assets.branding.orgLogo}
                alt={`${siteConfig.name} logo`}
                width={52}
                height={52}
                className="h-11 w-11 sm:h-12 sm:w-12"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[1.7rem] font-semibold leading-[0.9] tracking-tight text-foreground sm:text-[1.9rem] lg:whitespace-nowrap lg:text-[1.75rem] xl:text-[1.95rem]">
                AlMuallim Travels
              </p>
              <p className="mt-1 hidden text-[10px] font-semibold uppercase leading-4 tracking-[0.22em] text-primary/70 sm:block xl:text-[11px]">
                Hajj, Umrah &amp; Tours
              </p>
            </div>
          </Link>

          <nav className="hidden min-w-0 items-center justify-center gap-1 rounded-full border border-primary/8 bg-white/55 px-2 py-2 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-foreground/78 hover:bg-white hover:text-primary xl:px-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Link href="/contact">
              <Button className="h-12 px-6 text-base shadow-[0_16px_40px_rgba(37,99,235,0.22)] xl:px-7">Inquire Now</Button>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 rounded-full border border-primary/10 bg-white/90 p-2.5 shadow-sm lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="pb-4 lg:hidden">
            <div className="max-h-[calc(100vh-6.5rem)] overflow-y-auto rounded-[1.5rem] border border-primary/10 bg-white/95 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
              <div className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-2 py-1 text-sm font-medium text-foreground/80 hover:bg-primary/5 hover:text-primary"
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
