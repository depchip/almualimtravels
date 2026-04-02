import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function FloatingActions() {
  return (
    <>
      <a
        href={siteConfig.social.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-24 right-4 z-40 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)] ring-4 ring-white/85 transition-transform hover:scale-105 md:bottom-5 md:right-5"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 stroke-[2.4]" />
      </a>
      <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 md:hidden">
        <Link href="/contact" className="block">
          <Button className="w-full shadow-glow" size="lg">
            Inquire Now
          </Button>
        </Link>
      </div>
    </>
  );
}
