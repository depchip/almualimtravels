"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { siteConfig } from "@/lib/site";

type PromoSlide = {
  src: string;
  alt: string;
  href: string;
};

const slides: PromoSlide[] = [
  {
    src: "/UmrahPkgSept.jpeg",
    alt: "September 2026 Umrah Package - 20 Days starting from Rs. 237,500",
    href: "/umrah-packages",
  },
  {
    src: siteConfig.assets.media.hajjPackagePosters[0],
    alt: "Hajj Special Package - 26 Days with Al Shohda Hotel, starting from Rs. 1,790,000",
    href: "/packages/hajj-special-package-26-days",
  },
  {
    src: siteConfig.assets.media.hajjPackagePosters[1],
    alt: "Hajj Fixed Aziziya Package, starting from Rs. 1,610,000",
    href: "/packages/hajj-fixed-aziziya",
  },
];

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promo-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem("promo-popup-dismissed", "1");
  }

  function go(delta: number) {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }

  if (!open) return null;

  const slide = slides[index];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={close}>
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {slides.length > 1 ? (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Previous poster"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Next poster"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}

        <Link href={slide.href} onClick={close}>
          <Image src={slide.src} alt={slide.alt} width={800} height={1000} className="h-auto w-full" priority />
        </Link>

        {slides.length > 1 ? (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.href}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/40"}`}
                aria-label={`Go to poster ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
