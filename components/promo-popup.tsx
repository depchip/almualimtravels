"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { siteConfig } from "@/lib/site";

type PromoSlide = {
  src: string;
  alt: string;
  href: string;
  label: string;
};

const slides: PromoSlide[] = [
  {
    src: "/UmrahPkgSept.jpeg",
    alt: "September 2026 Umrah Package - 20 Days starting from Rs. 237,500",
    href: "/umrah-packages",
    label: "Umrah Package",
  },
  {
    src: siteConfig.assets.media.hajjPackagePosters[0],
    alt: "Hajj Special Package - 26 Days with Al Shohda Hotel, starting from Rs. 1,790,000",
    href: "/hajj-packages",
    label: "Hajj Package",
  },
  {
    src: siteConfig.assets.media.hajjPackagePosters[1],
    alt: "Hajj Fixed Aziziya Package, starting from Rs. 1,610,000",
    href: "/hajj-packages",
    label: "Hajj Package",
  },
];

export function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("promo-popup-dismissed")) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem("promo-popup-dismissed", "1"); } catch {}
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-1 top-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-colors hover:bg-gray-100 md:-right-2 md:-top-2 md:h-11 md:w-11"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {slides.map((poster, i) => (
            <Link
              key={i}
              href={poster.href}
              onClick={close}
              className="group block overflow-hidden rounded-xl bg-white shadow-2xl transition-transform hover:scale-[1.02] sm:rounded-2xl"
            >
              <div className="overflow-hidden">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  width={600}
                  height={750}
                  className="block h-auto max-h-[40vh] w-full object-contain sm:max-h-none"
                  priority
                />
              </div>
              <div className="px-3 py-2 text-center sm:py-2.5">
                <span className="text-xs font-semibold text-gray-700 sm:text-sm">{poster.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
