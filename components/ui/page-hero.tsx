import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  primaryHref = "/contact",
  primaryLabel = "Inquire Now",
}: PageHeroProps) {
  return (
    <section className="section-shell pt-28 sm:pt-32">
      <div className="mesh-panel gold-ring rounded-[2rem] px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">{description}</p>
        <div className="mt-8">
          <Link href={primaryHref} className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              {primaryLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
