import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Hotel, MapPin, Plane, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { TravelPackage } from "@/lib/packages";
import { siteConfig } from "@/lib/site";

const themeStyles: Record<TravelPackage["theme"], string> = {
  Hajj: "from-slate-950 via-slate-800 to-amber-700",
  Umrah: "from-sky-100 via-white to-amber-100",
  Domestic: "from-blue-950 via-blue-700 to-cyan-400",
  International: "from-indigo-950 via-blue-700 to-sky-400",
};

function getPackageImage(pkg: TravelPackage) {
  if (pkg.theme === "Hajj") {
    return pkg.id.includes("signature")
      ? siteConfig.assets.media.madinahImages[0]
      : siteConfig.assets.media.makkahImages[0];
  }

  if (pkg.theme === "Umrah") {
    if (pkg.id.includes("14")) return siteConfig.assets.media.makkahImages[3];
    if (pkg.id.includes("12")) return siteConfig.assets.media.madinahImages[3];
    return siteConfig.assets.media.makkahImages[1];
  }

  return null;
}

export function PackageCard({ pkg }: { pkg: TravelPackage }) {
  const packageHref = `/packages/${pkg.id}`;
  const packageImage = getPackageImage(pkg);
  const isSacredPackage = pkg.theme === "Hajj" || pkg.theme === "Umrah";

  return (
    <div className="mesh-panel gold-ring flex h-full flex-col overflow-hidden rounded-[2rem] border border-primary/10">
      <div className={`relative aspect-[5/3] ${isSacredPackage ? "p-0" : `bg-gradient-to-br ${themeStyles[pkg.theme]} p-6`}`}>
        {packageImage ? (
          <>
            <Image
              src={packageImage}
              alt={pkg.location}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,30,0.18),rgba(8,15,30,0.48),rgba(8,15,30,0.78))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_34%)]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_34%)]" />
        )}
        <div className="relative flex h-full flex-col justify-between">
          <span className="m-6 w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {pkg.heroLabel}
          </span>
          <div className="max-w-xs px-6 pb-6">
            <p className={`text-sm uppercase tracking-[0.24em] ${isSacredPackage ? "text-white/80" : pkg.theme === "Umrah" ? "text-primary/70" : "text-white/80"}`}>
              {pkg.duration}
            </p>
            <p className={`mt-2 text-lg font-semibold ${isSacredPackage ? "text-white" : pkg.theme === "Umrah" ? "text-foreground" : "text-white"}`}>{pkg.location}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-3xl font-semibold leading-tight">{pkg.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{pkg.subtitle}</p>
          </div>
        </div>

        <p className="mt-5 text-2xl font-bold text-foreground">{pkg.price}</p>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">{pkg.summary}</p>

        <div className="mt-6 grid gap-3 text-sm text-foreground/90">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
            <Timer className="h-4 w-4 text-primary" />
            <span>{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{pkg.location}</span>
          </div>
          {pkg.highlights.slice(0, 2).map((item, index) => (
            <div key={item} className="flex items-center gap-3 border-b border-primary/10 pb-3">
              {index === 0 ? <Hotel className="h-4 w-4 text-primary" /> : <Plane className="h-4 w-4 text-primary" />}
              <span>{item}</span>
            </div>
          ))}
          {pkg.highlights[2] ? (
            <div className="flex items-center gap-3 pb-1">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{pkg.highlights[2]}</span>
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <Link href={packageHref} className="block">
            <Button size="lg" className="w-full rounded-xl">
              Book Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
