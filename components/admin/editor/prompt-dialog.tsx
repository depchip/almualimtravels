"use client";

import { useState } from "react";

export type PromptRequest = {
  title: string;
  label: string;
  placeholder?: string;
  initialValue?: string;
  hint?: string;
  submitLabel?: string;
  // Return an error message to block submit, or null when the value is fine.
  validate?: (value: string) => string | null;
  allowEmpty?: boolean;
  onSubmit: (value: string) => void;
};

// Small modal used by the editor for links, YouTube URLs and image alt text.
export function PromptDialog({ request, onClose }: { request: PromptRequest; onClose: () => void }) {
  const [value, setValue] = useState(request.initialValue ?? "");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed && !request.allowEmpty) {
      setError("This field is required.");
      return;
    }
    const problem = trimmed ? (request.validate?.(trimmed) ?? null) : null;
    if (problem) {
      setError(problem);
      return;
    }
    request.onSubmit(trimmed);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <h2 className="text-lg font-bold">{request.title}</h2>
        <label htmlFor="prompt-input" className="mt-4 block text-sm font-semibold">
          {request.label}
        </label>
        <input
          id="prompt-input"
          autoFocus
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          placeholder={request.placeholder}
          className="mt-2 flex h-11 w-full rounded-xl border border-slate-200 px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
        />
        {error ? (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        ) : (
          request.hint && <p className="mt-2 text-xs text-slate-500">{request.hint}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-full px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button type="submit" className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {request.submitLabel ?? "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
