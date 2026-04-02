"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type VideoModalProps = {
  open: boolean;
  onClose: () => void;
  embedUrl: string | null;
  title: string;
};

export function VideoModal({ open, onClose, embedUrl, title }: VideoModalProps) {
  useEffect(() => {
    if (!open) return;

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  if (!open || !embedUrl) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 px-4 py-10 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto max-w-4xl rounded-[2rem] bg-black p-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between px-2 text-white">
          <p className="text-sm font-medium">{title}</p>
          <button type="button" onClick={onClose} aria-label="Close video">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="aspect-video overflow-hidden rounded-[1.5rem]">
          <iframe
            src={embedUrl}
            title={title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
