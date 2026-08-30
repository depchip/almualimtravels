"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const POSTERS = [
  {
    src: "/UmrahPkgSept.jpeg",
    alt: "September 2026 Umrah Package - 20 Days starting from Rs. 237,500",
    href: "/umrah-packages",
    label: "Umrah Package",
  },
  {
    src: "/assets/media/posters/hajj/hajj-training-1.jpeg",
    alt: "Hajj & Umrah Training Program - Jame Masjid Madina, Karachi",
    href: "/training-resources",
    label: "Hajj Training",
  },
  {
    src: "/assets/media/posters/hajj/hajj-training-2.jpeg",
    alt: "Hajj & Umrah Training Program - Mohammadi Masjid, Karachi",
    href: "/training-resources",
    label: "Hajj Training",
  },
];

export function UmrahPopup() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promo-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem("promo-popup-dismissed", "1");
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? POSTERS.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c === POSTERS.length - 1 ? 0 : c + 1));
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, close, prev, next]);

  if (!open) return null;

  const poster = POSTERS[current];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={close}>
      <div
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <Link href={poster.href} onClick={close}>
            <Image
              src={poster.src}
              alt={poster.alt}
              width={800}
              height={1000}
              className="h-auto w-full"
              priority
            />
          </Link>

          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={prev}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              aria-label="Previous poster"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
              {POSTERS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to poster ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
              aria-label="Next poster"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
