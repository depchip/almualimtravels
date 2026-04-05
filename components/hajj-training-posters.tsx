import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { SectionHeading } from "@/components/ui/section-heading";

type HajjTrainingPostersProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function HajjTrainingPosters({
  eyebrow = "Upcoming Hajj Training",
  title = "See the latest Hajj training posters and reserve your place early",
  description = "These upcoming training sessions help pilgrims prepare before departure with practical reminders, ritual clarity, and space for questions.",
}: HajjTrainingPostersProps) {
  return (
    <section className="section-shell section-space">
      <div className="mesh-panel gold-ring overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr] lg:items-start">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />
            <div className="mt-8 space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                Training is part of what makes the AlMuallim experience more reassuring. You do not just book a
                package. You prepare with confidence before you travel.
              </p>
              <p>
                If you would like details about dates, venue access, or what to expect, our team can guide you to the
                right next step.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
              >
                Ask About Training
              </Link>
              <Link
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary/15 bg-white/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-white"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {siteConfig.assets.media.hajjTrainingPosters.map((poster, index) => (
              <div key={poster} className="gold-ring group overflow-hidden rounded-[1.75rem] bg-white p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={poster}
                    alt={`Upcoming Hajj training poster ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
