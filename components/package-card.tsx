import { MapPin, Sparkles, Timer } from "lucide-react";

type Package = {
  id: string;
  title: string;
  type: string;
  duration: string;
  location: string;
  price: string;
  description: string;
  features: string[];
};

export function PackageCard({ pkg }: { pkg: Package }) {
  return (
    <div className="mesh-panel gold-ring h-full rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {pkg.type}
        </span>
        <span className="text-sm font-semibold text-accent-foreground">{pkg.price}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold">{pkg.title}</h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">{pkg.description}</p>
      <div className="mt-5 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Timer className="h-4 w-4 text-primary" />
          <span>{pkg.duration}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{pkg.location}</span>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {pkg.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
