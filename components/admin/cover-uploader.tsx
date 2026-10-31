"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";

import { ACCEPTED_IMAGE_TYPES, COVER_TRANSFORM, cloudinaryUrl, postImageFolder, uploadImage } from "@/lib/blog/cloudinary";
import type { CoverImage } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

type CoverUploaderProps = {
  postId: string;
  value: CoverImage | null;
  onChange: (cover: CoverImage | null) => void;
};

export function CoverUploader({ postId, value, onChange }: CoverUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setProgress(0);

    try {
      const uploaded = await uploadImage(file, postImageFolder(postId), setProgress);
      onChange({ ...uploaded, alt: value?.alt ?? "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setProgress(null);
    }
  };

  const uploading = progress !== null;

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {value && !uploading ? (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cloudinaryUrl(value.publicId, COVER_TRANSFORM)} alt={value.alt} className="aspect-video w-full object-cover" />
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold shadow hover:bg-white"
            >
              <RefreshCw className="h-4 w-4" />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-red-600 shadow hover:bg-white"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            handleFile(event.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 transition hover:border-primary hover:text-primary",
            dragging && "border-primary bg-primary/5 text-primary",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="text-sm font-semibold">Uploading… {progress}%</span>
              <span className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
                <span className="block h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="h-10 w-10" />
              <span className="text-base font-semibold">Add a cover photo</span>
              <span className="text-sm">Click or drag an image here · JPG, PNG or WebP</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {value && (
        <div className="space-y-1.5">
          <label htmlFor="cover-alt" className="text-sm font-semibold">
            Cover alt text <span className="font-normal text-slate-500">(describes the image for screen readers and Google)</span>
          </label>
          <input
            id="cover-alt"
            value={value.alt}
            onChange={(event) => onChange({ ...value, alt: event.target.value })}
            placeholder="e.g. Pilgrims performing tawaf around the Kaaba at dusk"
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
          />
        </div>
      )}
    </div>
  );
}
