import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CircleCheckBig } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { buildMetadata } from "@/lib/seo";
import { allPackages, getPackageById } from "@/lib/packages";

export async function generateStaticParams() {
  return allPackages.map((pkg) => ({ id: pkg.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = getPackageById(id);

  if (!pkg) {
    return buildMetadata({
      title: "Package Not Found",
      description: "This package could not be found.",
      path: `/packages/${id}`,
    });
  }

  return buildMetadata({
    title: `${pkg.title}`,
    description: pkg.summary,
    path: `/packages/${pkg.id}`,
  });
}

const heroThemes = {
  Hajj: "from-slate-950 via-slate-800 to-amber-700",
  Umrah: "from-sky-100 via-white to-amber-100",
  Domestic: "from-blue-950 via-blue-700 to-cyan-400",
  International: "from-indigo-950 via-blue-700 to-sky-400",
} as const;

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = getPackageById(id);

  if (!pkg) {
    notFound();
  }

  return (
    <>
      <section className="section-shell pt-28 sm:pt-32">
        <div className={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${heroThemes[pkg.theme]} p-6 sm:p-8`}>
          <Link href={pkg.route} className="inline-flex items-center gap-2 text-sm font-medium text-white/90">
            <ArrowLeft className="h-4 w-4" />
            Back to {pkg.type}
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr,0.9fr] lg:items-end">
            <div className={pkg.theme === "Umrah" ? "text-foreground" : "text-white"}>
              <p className={`text-sm font-semibold uppercase tracking-[0.3em] ${pkg.theme === "Umrah" ? "text-primary/80" : "text-white/80"}`}>
                {pkg.heroLabel}
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{pkg.title}</h1>
              <p className={`mt-4 max-w-2xl text-base leading-8 ${pkg.theme === "Umrah" ? "text-muted-foreground" : "text-white/85"}`}>
                {pkg.description}
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-white/85 p-6 text-foreground shadow-xl backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-primary/70">Package Overview</p>
              <p className="mt-4 font-display text-3xl font-semibold">{pkg.price}</p>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p>{pkg.duration}</p>
                <p>{pkg.location}</p>
                <p>{pkg.subtitle}</p>
              </div>
              <div className="mt-6">
                <Link href="#book-now">
                  <Button size="lg" className="w-full rounded-xl">
                    Book This Package
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell section-space grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Package Details"
            title="What this package includes"
            description="A clear look at the highlights and inclusions for this package before booking your consultation."
          />
          <div className="mt-8 grid gap-4">
            {pkg.highlights.map((highlight) => (
              <div key={highlight} className="soft-card flex items-start gap-3 p-5">
                <BadgeCheck className="mt-0.5 h-5 w-5 text-primary" />
                <span className="text-sm leading-7">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="Inclusions" title="Travel and service inclusions" />
          <div className="mt-8 rounded-[2rem] border border-primary/10 bg-white/80 p-6">
            <div className="grid gap-4">
              {pkg.inclusions.map((inclusion) => (
                <div key={inclusion} className="flex items-start gap-3 border-b border-primary/10 pb-4 last:border-b-0 last:pb-0">
                  <CircleCheckBig className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm leading-7 text-muted-foreground">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="book-now" className="section-shell section-space">
        <BookingForm pkg={pkg} />
      </section>
    </>
  );
}
