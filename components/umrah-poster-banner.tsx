import Image from "next/image";
import Link from "next/link";

import { AnimatedSection } from "@/components/animated-section";
import { SectionHeading } from "@/components/ui/section-heading";

export function UmrahPosterBanner() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Upcoming Departure"
        title="September 2026 Umrah Package"
        description="20-day Umrah journey with Muallim guidance, departing 16 September 2026 via FlyJinnah. Multiple packages available."
        align="center"
      />
      <div className="mx-auto mt-10 max-w-2xl">
        <AnimatedSection>
          <Link href="/umrah-packages" className="group block overflow-hidden rounded-2xl shadow-lg transition-shadow hover:shadow-2xl">
            <Image
              src="/UmrahPkgSept.jpeg"
              alt="September 2026 Umrah Package - 20 Days starting from Rs. 237,500"
              width={800}
              height={1000}
              className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
