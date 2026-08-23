"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

export function UmrahPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("umrah-popup-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem("umrah-popup-dismissed", "1");
  }

  if (!open) return null;

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
        <Link href="/umrah-packages" onClick={close}>
          <Image
            src="/UmrahPkgSept.jpeg"
            alt="September 2026 Umrah Package - 20 Days starting from Rs. 237,500"
            width={800}
            height={1000}
            className="h-auto w-full"
            priority
          />
        </Link>
      </div>
    </div>
  );
}
