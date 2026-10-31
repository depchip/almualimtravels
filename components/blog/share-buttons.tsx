"use client";

import { useState } from "react";
import { Check, Facebook, Link2, MessageCircle } from "lucide-react";

const buttonClass =
  "inline-flex h-10 items-center gap-2 rounded-full border border-primary/15 bg-white px-4 text-sm font-semibold transition hover:border-primary hover:text-primary";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const currentUrl = () => window.location.href;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-semibold text-muted-foreground">Share</span>
      <button
        type="button"
        className={buttonClass}
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${currentUrl()}`)}`, "_blank", "noopener")}
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl())}`, "_blank", "noopener")
        }
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={async () => {
          await navigator.clipboard.writeText(currentUrl());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
