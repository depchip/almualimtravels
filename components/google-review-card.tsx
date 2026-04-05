import { Star } from "lucide-react";

type GoogleReview = {
  name: string;
  service: string;
  quote: string;
  rating: number;
};

export function GoogleReviewCard({ review }: { review: GoogleReview }) {
  return (
    <div className="mesh-panel gold-ring h-full rounded-[2rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-2xl font-semibold">{review.name}</p>
          <p className="text-sm text-muted-foreground">{review.service}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: review.rating }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-accent text-accent" />
          ))}
        </div>
      </div>
      <p className="mt-5 text-base leading-8 text-muted-foreground">“{review.quote}”</p>
    </div>
  );
}
