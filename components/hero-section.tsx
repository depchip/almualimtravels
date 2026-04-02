import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenText, PlaneTakeoff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const trustPoints = [
  "Personally guided Umrah groups",
  "Structured training before departure",
  "Trusted Islamic guidance throughout the journey",
];

export function HeroSection() {
  return (
    <section className="section-shell relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-hero-pattern" />
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:gap-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Travel with Trust and Guidance</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Sacred journeys prepared with knowledge, sincerity, and care.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Al Mualim Travels and Tours brings together travel planning, practical training, and spiritual support so pilgrims
            can travel with confidence under the guidance of Mufti Furqan Mamji.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Plan Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/umrah-with-guidance" className="sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Guided Umrah
              </Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point} className="soft-card p-4 shadow-sm">
                <BadgeCheck className="h-5 w-5 text-accent" />
                <p className="mt-3 text-sm font-medium leading-6">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="mesh-panel gold-ring rounded-[2rem] p-4 sm:p-6">
            <div className="rounded-[1.5rem] bg-primary p-6 text-primary-foreground sm:p-8">
              <div className="flex items-center gap-4">
                <Image src={siteConfig.assets.branding.markLogo} alt="Al Mualim Travels mark" width={72} height={72} className="h-14 w-14 rounded-2xl bg-white/10 p-2 sm:h-[72px] sm:w-[72px]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/70">Led by</p>
                  <h2 className="font-display text-2xl font-semibold">Mufti Furqan Mamji</h2>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-primary-foreground/80">
                Personally leading Umrah groups, delivering training sessions, and sharing educational guidance through trusted
                community channels and YouTube.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <BookOpenText className="h-5 w-5 text-secondary" />
                  <p className="mt-2 text-sm">Training sessions included for better preparation and peace of mind.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                  <PlaneTakeoff className="h-5 w-5 text-secondary" />
                  <p className="mt-2 text-sm">Packages for Hajj, Umrah, Pakistan tours, and international tours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
