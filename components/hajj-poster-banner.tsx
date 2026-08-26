import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPackagesByType } from "@/lib/packages";

type HajjPosterBannerProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function HajjPosterBanner({
  eyebrow = "Upcoming Departure",
  title = "Hajj 2026 Packages",
  description = "Choose between the Special 26-day Hajj Package and the Fixed Aziziya Package, both guided by Mufti Furqan Ahmed Majji.",
}: HajjPosterBannerProps) {
  const hajjPackages = getPackagesByType("Hajj").filter((pkg) => pkg.posterImage);

  if (!hajjPackages.length) return null;

  return (
    <section className="section-shell section-space">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} align="center" />
      <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
        {hajjPackages.map((pkg, index) => (
          <AnimatedSection key={pkg.id} delay={index * 0.08}>
            <Link
              href={`/packages/${pkg.id}`}
              className="group block overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-2xl"
            >
              <Image
                src={pkg.posterImage as string}
                alt={`${pkg.title} poster`}
                width={800}
                height={1000}
                className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
