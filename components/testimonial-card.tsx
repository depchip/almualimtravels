import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  service: string;
  quote: string;
  rating: number;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="mesh-panel gold-ring h-full rounded-[2rem] p-6">
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </div>
      <p className="mt-5 text-base leading-7 text-muted-foreground">“{testimonial.quote}”</p>
      <div className="mt-6">
        <p className="font-display text-xl font-semibold">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">{testimonial.service}</p>
      </div>
    </div>
  );
}
