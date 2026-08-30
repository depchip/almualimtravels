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
    src: siteConfig.assets.media.hajjTrainingPosters[0],
    alt: "Hajj & Umrah Training Program - Jame Masjid Madina, Karachi",
    href: "/training-resources",
    label: "Hajj Training",
  },
  {
    src: siteConfig.assets.media.hajjTrainingPosters[1],
    alt: "Hajj & Umrah Training Program - Mohammadi Masjid, Karachi",
    href: "/training-resources",
    label: "Hajj Training",
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
          className="absolute -right-2 -top-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-colors hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="grid gap-4 md:grid-cols-3">
          {slides.map((poster, i) => (
            <Link
              key={i}
              href={poster.href}
              onClick={close}
              className="group block overflow-hidden rounded-2xl bg-white shadow-2xl transition-transform hover:scale-[1.02]"
            >
              <div className="overflow-hidden">
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  width={600}
                  height={750}
                  className="block h-auto w-full"
                  priority
                />
              </div>
              <div className="px-3 py-2.5 text-center">
                <span className="text-sm font-semibold text-gray-700">{poster.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
