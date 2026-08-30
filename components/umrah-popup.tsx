"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const POSTERS = [
  {
    src: "/UmrahPkgSept.jpeg",
    alt: "September 2026 Umrah Package - 20 Days starting from Rs. 237,500",
    href: "/umrah-packages",
  },
  {
    src: "/assets/media/posters/hajj/hajj-training-1.jpeg",
    alt: "Hajj & Umrah Training Program - Jame Masjid Madina, Karachi",
    href: "/training-resources",
  },
  {
    src: "/assets/media/posters/hajj/hajj-training-2.jpeg",
    alt: "Hajj & Umrah Training Program - Mohammadi Masjid, Karachi",
    href: "/training-resources",
  },
];

export function UmrahPopup() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Show popup after 1.5s if not dismissed this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem("promo-popup-dismissed")) return;
    } catch {}
    const t = setTimeout(() => setOpen(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!open || paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % POSTERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [open, paused]);

  function close() {
    setOpen(false);
    try { sessionStorage.setItem("promo-popup-dismissed", "1"); } catch {}
  }

  function go(dir: number) {
    setCurrent((c) => (c + dir + POSTERS.length) % POSTERS.length);
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  }

  if (!open) return null;

  const poster = POSTERS[current];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={close}
      style={{ padding: "1rem" }}
    >
      {/* Left arrow — always visible */}
      <button
        onClick={(e) => { e.stopPropagation(); go(-1); }}
        style={{ position: "fixed", left: "clamp(4px, 2vw, 24px)", top: "50%", transform: "translateY(-50%)" }}
        className="z-[110] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-110"
        aria-label="Previous"
      >
        <ChevronLeft size={32} strokeWidth={2.5} className="text-gray-700" />
      </button>

      {/* Right arrow — always visible */}
      <button
        onClick={(e) => { e.stopPropagation(); go(1); }}
        style={{ position: "fixed", right: "clamp(4px, 2vw, 24px)", top: "50%", transform: "translateY(-50%)" }}
        className="z-[110] flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-110"
        aria-label="Next"
      >
        <ChevronRight size={32} strokeWidth={2.5} className="text-gray-700" />
      </button>

      {/* Poster card */}
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute -right-2 -top-2 z-[120] flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-xl transition-colors hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={22} />
        </button>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="max-h-[78vh] overflow-y-auto">
            <Link href={poster.href} onClick={close}>
              <Image
                key={current}
                src={poster.src}
                alt={poster.alt}
                width={800}
                height={1000}
                className="block h-auto w-full"
                priority
              />
            </Link>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-3 py-3">
            {POSTERS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setPaused(true); setTimeout(() => setPaused(false), 6000); }}
                className={`rounded-full transition-all ${
                  i === current
                    ? "h-3 w-8 bg-primary"
                    : "h-3 w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Poster ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
