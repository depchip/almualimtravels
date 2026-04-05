import Image from "next/image";

import { SectionHeading } from "@/components/ui/section-heading";

type SacredGalleryProps = {
  eyebrow: string;
  title: string;
  description: string;
  images: string[];
};

export function SacredGallery({ eyebrow, title, description, images }: SacredGalleryProps) {
  return (
    <section className="section-shell section-space">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image}
            className={`gold-ring group relative overflow-hidden rounded-[1.75rem] bg-white ${
              index === 0 || index === 3 ? "xl:translate-y-6" : ""
            }`}
          >
            <div className="relative aspect-[4/5]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
