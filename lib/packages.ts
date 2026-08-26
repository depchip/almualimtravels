import packagesData from "@/data/packages.json";

export type PackageType = "Hajj" | "Umrah" | "Domestic Tour" | "International Tour";

export type HajjItineraryStep = {
  range: string;
  stay: string;
};

export type HajjAccommodation = {
  city: string;
  stay: string;
};

export type HajjPricingTier = {
  label: string;
  amount: string;
};

export type HajjConsultant = {
  name: string;
  phone: string;
};

export type TravelPackage = {
  id: string;
  type: PackageType;
  title: string;
  subtitle: string;
  duration: string;
  location: string;
  price: string;
  heroLabel: string;
  route: string;
  theme: "Hajj" | "Umrah" | "Domestic" | "International";
  summary: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  bookingCategories: string[];
  posterImage?: string;
  maktab?: string;
  zone?: string;
  qurbaniIncluded?: boolean;
  itinerary?: HajjItineraryStep[];
  accommodation?: HajjAccommodation[];
  pricingTiers?: HajjPricingTier[];
  consultants?: HajjConsultant[];
};

export const allPackages = packagesData as TravelPackage[];

export function getPackagesByType(type: PackageType) {
  return allPackages.filter((pkg) => pkg.type === type);
}

export function getPackageById(id: string) {
  return allPackages.find((pkg) => pkg.id === id);
}
