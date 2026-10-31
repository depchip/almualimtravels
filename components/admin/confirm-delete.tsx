"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { postImageFolder } from "@/lib/blog/cloudinary";

type ConfirmDeleteProps = {
  postId: string;
  title: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};

// Deleting is permanent, so the admin must type the post title to confirm.
export function ConfirmDelete({ postId, title, onCancel, onConfirm }: ConfirmDeleteProps) {
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const expected = title.trim() || "delete";

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await onConfirm();
    } catch {
      setError("Could not delete the post. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold">Delete this post?</h2>
            <p className="mt-1 text-sm text-slate-600">
              This permanently removes <span className="font-semibold text-foreground">{title || "this untitled post"}</span>. It
              cannot be undone.
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Its images stay in Cloudinary. To free the space, delete the folder{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-xs text-foreground">{postImageFolder(postId)}</code> in the
          Cloudinary Media Library.
        </p>

        <label htmlFor="confirm-title" className="mt-5 block text-sm font-semibold">
          Type <span className="text-red-600">{expected}</span> to confirm
        </label>
        <input
          id="confirm-title"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          autoFocus
          className="mt-2 flex h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus-visible:border-red-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="h-11 rounded-full px-5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={typed.trim() !== expected || deleting}
            className="flex h-11 items-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40"
          >
            {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete post
          </button>
        </div>
      </div>
    </div>
  );
}
