import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarCheck2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const trustPoints = [
  "Clear preparation before you leave",
  "Support during the sacred journey",
  "Packages for Umrah, Hajj, and tours",
];

export function HeroSection() {
  return (
    <section className="section-shell relative overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0 -z-10 bg-hero-pattern" />
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/40 bg-[linear-gradient(135deg,rgba(8,47,123,0.90),rgba(30,64,175,0.82),rgba(14,165,233,0.70))] p-6 shadow-[0_30px_100px_rgba(37,99,235,0.18)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.12),transparent_28%)]" />
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:gap-14">
          <div className="relative">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-sm backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sacred Travel, Guided Properly
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Plan your Hajj, Umrah, or tour with clarity, trust, and real guidance.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
              AlMuallim Travels helps pilgrims, families, and travelers book with confidence through scholar-led support,
              practical preparation, and carefully managed journeys from start to finish.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Book Your Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/umrah-with-guidance" className="sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  See Guided Umrah
                </Button>
              </Link>
            </div>

            <p className="mt-3 text-sm text-white/72">
              Speak with us about Hajj, Umrah, domestic tours, international tours, or training sessions.
            </p>
          </div>

          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-[1fr,0.82fr]">
              <div className="overflow-hidden rounded-[2rem] bg-white/10 p-2 shadow-glow backdrop-blur">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src={siteConfig.assets.media.makkahImages[3]}
                    alt="Makkah view"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">For Pilgrims and Families</p>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white">
                      Book with a team that helps you prepare before you travel, not just after you pay.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-[2rem] bg-white/10 p-2 shadow-lg backdrop-blur">
                  <div className="relative aspect-[4/4.2] overflow-hidden rounded-[1.5rem]">
                    <Image
                      src={siteConfig.assets.media.madinahImages[3]}
                      alt="Madinah view"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                </div>
                <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 text-white backdrop-blur">
                  <div className="flex items-center gap-3">
                    <CalendarCheck2 className="h-5 w-5 text-white" />
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">What You Get</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {trustPoints.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <BadgeCheck className="mt-0.5 h-4 w-4 text-accent" />
                        <p className="text-sm leading-6 text-white/88">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
