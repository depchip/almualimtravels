import { PackageCard } from "@/components/package-card";
import { getPackagesByType, type PackageType } from "@/lib/packages";

export function PackageGrid({ type }: { type: PackageType }) {
  const filteredPackages = getPackagesByType(type);

  return (
    <div className="grid gap-8 xl:grid-cols-3">
      {filteredPackages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
