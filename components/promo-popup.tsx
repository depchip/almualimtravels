"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

type PromoSlide = {
  src: string;
  alt: string;
  href: string;
  label: string;
};

const slides: PromoSlide[] = [
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
  {
    src: "/UmrahPkgSept.jpeg",
    alt: "September 2026 Umrah Package - 20 Days starting from Rs. 237,500",
    href: "/umrah-packages",
    label: "Umrah Package",
  },
];

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("promo-popup-dismissed")) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!open) return;
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, startTimer]);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem("promo-popup-dismissed", "1"); } catch {}
  }

  function goTo(index: number) {
    setCurrent(index);
    startTimer();
  }

  function prev() {
    goTo((current - 1 + slides.length) % slides.length);
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  if (!open) return null;

  const poster = slides[current];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative flex w-full max-w-lg items-center gap-2 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left arrow */}
        <button
          onClick={prev}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-colors hover:bg-white sm:h-12 sm:w-12"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Poster card */}
        <div className="relative flex-1">
          <button
            onClick={close}
            className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-colors hover:bg-gray-100 sm:h-11 sm:w-11"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <Link
            href={poster.href}
            onClick={close}
            className="group block overflow-hidden rounded-xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="overflow-hidden">
              <Image
                src={poster.src}
                alt={poster.alt}
                width={600}
                height={750}
                className="block h-auto max-h-[70vh] w-full object-contain"
                priority
              />
            </div>
            <div className="px-3 py-2 text-center sm:py-3">
              <span className="text-sm font-semibold text-gray-700">{poster.label}</span>
            </div>
          </Link>

          {/* Dots */}
          <div className="mt-3 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === current
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-colors hover:bg-white sm:h-12 sm:w-12"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
