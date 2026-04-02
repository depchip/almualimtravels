import packages from "@/data/packages.json";

import { PackageCard } from "@/components/package-card";

export function PackageGrid({ type }: { type: string }) {
  const filteredPackages = packages.filter((pkg) => pkg.type === type);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {filteredPackages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
