import Image from "next/image";
import { BedDouble, MapPinned, Phone, Users } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import type { TravelPackage } from "@/lib/packages";

export function HajjPackageDetails({ pkg }: { pkg: TravelPackage }) {
  if (!pkg.itinerary || !pkg.pricingTiers) {
    return null;
  }

  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Itinerary & Pricing"
        title="A day-by-day look at this Hajj journey"
        description="Every stage of accommodation and travel is planned in advance so you always know what to expect."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold">Stage-by-stage itinerary</h3>
            {pkg.maktab ? (
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {pkg.maktab} · {pkg.zone}
              </span>
            ) : null}
          </div>

          <ol className="mt-8 space-y-5 border-l border-primary/15 pl-6">
            {pkg.itinerary.map((step, index) => (
              <li key={step.range} className="relative">
                <span className="absolute -left-[2.05rem] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">{step.range}</p>
                <p className="mt-1 text-base font-medium text-foreground">{step.stay}</p>
              </li>
            ))}
          </ol>

          {pkg.accommodation ? (
            <div className="mt-8 grid gap-4 border-t border-primary/10 pt-6 sm:grid-cols-2">
              {pkg.accommodation.map((stay) => (
                <div key={`${stay.city}-${stay.stay}`} className="soft-card flex items-start gap-3 p-4">
                  <BedDouble className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">{stay.city}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{stay.stay}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">
          <div className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">Sharing options</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Per-person pricing based on room sharing. Speak with our team to confirm current availability.
            </p>
            <div className="mt-6 grid gap-3">
              {pkg.pricingTiers.map((tier, index) => (
                <div
                  key={tier.label}
                  className={`flex items-center justify-between rounded-2xl px-5 py-4 ${
                    index === 0 ? "bg-primary text-primary-foreground shadow-glow" : "border border-primary/10 bg-white/80"
                  }`}
                >
                  <span className={`text-sm font-medium ${index === 0 ? "text-primary-foreground/90" : "text-foreground"}`}>
                    {tier.label}
                  </span>
                  <span className={`font-display text-lg font-semibold ${index === 0 ? "text-primary-foreground" : "text-foreground"}`}>
                    {tier.amount}
                  </span>
                </div>
              ))}
            </div>
            {pkg.qurbaniIncluded === false ? (
              <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Qurbani not included</p>
            ) : null}
          </div>

          {pkg.consultants ? (
            <div className="rounded-[2rem] border border-primary/10 bg-white/80 p-6 sm:p-8">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-display text-lg font-semibold">Speak with our Hajj consultants</h3>
              </div>
              <div className="mt-5 grid gap-3">
                {pkg.consultants.map((consultant) => (
                  <a
                    key={consultant.phone}
                    href={`tel:${consultant.phone.replace(/[^+\d]/g, "")}`}
                    className="flex items-center justify-between rounded-xl border border-primary/10 px-4 py-3 text-sm transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span className="font-medium text-foreground">{consultant.name}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      {consultant.phone}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {pkg.posterImage ? (
            <div className="gold-ring overflow-hidden rounded-[2rem] bg-white p-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={pkg.posterImage}
                  alt={`${pkg.title} official poster`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 30vw"
                />
              </div>
              <p className="mt-3 flex items-center gap-2 px-2 pb-1 text-xs text-muted-foreground">
                <MapPinned className="h-3.5 w-3.5 text-primary" />
                Official package poster for reference
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
