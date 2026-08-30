"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

const AUTO_INTERVAL = 3000;

export function UmrahPopup() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("promo-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c === POSTERS.length - 1 ? 0 : c + 1));
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    if (open) resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open, resetTimer]);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem("promo-popup-dismissed", "1");
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c === 0 ? POSTERS.length - 1 : c - 1));
    resetTimer();
  }, [resetTimer]);

  const next = useCallback(() => {
    setCurrent((c) => (c === POSTERS.length - 1 ? 0 : c + 1));
    resetTimer();
  }, [resetTimer]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    resetTimer();
  }, [resetTimer]);

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative mx-auto w-[min(420px,85vw)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:bg-gray-100"
          aria-label="Close popup"
        >
          <X size={20} />
        </button>

        {/* Left arrow - positioned outside poster */}
        <button
          onClick={prev}
          className="absolute -left-16 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-all hover:scale-110 hover:bg-white md:flex"
          aria-label="Previous poster"
        >
          <ChevronLeft size={30} strokeWidth={2.5} />
        </button>

        {/* Right arrow - positioned outside poster */}
        <button
          onClick={next}
          className="absolute -right-16 top-1/2 z-20 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg transition-all hover:scale-110 hover:bg-white md:flex"
          aria-label="Next poster"
        >
          <ChevronRight size={30} strokeWidth={2.5} />
        </button>

        {/* Poster card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="max-h-[75vh] overflow-y-auto">
            <Link href={poster.href} onClick={close}>
              <Image
                key={poster.src}
                src={poster.src}
                alt={poster.alt}
                width={800}
                height={1000}
                className="h-auto w-full"
                priority
              />
            </Link>
          </div>

          {/* Bottom bar: mobile arrows + dots */}
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 md:invisible"
              aria-label="Previous poster"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-2.5">
              {POSTERS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === current ? "w-7 bg-primary" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`${p.label} (${i + 1} of ${POSTERS.length})`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 md:invisible"
              aria-label="Next poster"
            >
              <ChevronRight size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
