import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CalendarClock,
  CircleCheckBig,
  Globe2,
  Landmark,
  MapPinned,
  ShieldCheck,
  Sparkles,
  TentTree,
  Users,
} from "lucide-react";

import testimonials from "@/data/testimonials.json";
import videos from "@/data/videos.json";

import { AnimatedSection } from "@/components/animated-section";
import { GoogleReviewCard } from "@/components/google-review-card";
import { InquiryForm } from "@/components/inquiry-form";
import { PackageCard } from "@/components/package-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoCard } from "@/components/video-card";
import { allPackages } from "@/lib/packages";
import { siteConfig } from "@/lib/site";

const trustSignals = [
  { value: "Scholar-led", label: "Guidance you can rely on" },
  { value: "Pre-travel", label: "Training before departure" },
  { value: "Family-ready", label: "Support for groups and families" },
  { value: "4 services", label: "Hajj, Umrah, domestic, international" },
];

const problemPoints = [
  {
    title: "You do not want confusion during a sacred journey.",
    description: "Many travelers worry about rituals, logistics, hotels, and transport all at once.",
  },
  {
    title: "You want real guidance, not just a booking desk.",
    description: "Pilgrims need preparation, honest answers, and support before and during travel.",
  },
  {
    title: "You need a company you can trust with family travel.",
    description: "When parents, children, or first-time pilgrims are involved, reliability matters even more.",
  },
];

const solutionSteps = [
  {
    icon: CalendarClock,
    title: "Book with clarity",
    description: "We help you choose the right package based on timing, comfort, and travel goals.",
  },
  {
    icon: BookOpenCheck,
    title: "Prepare properly",
    description: "Training sessions and educational resources help you travel informed and confident.",
  },
  {
    icon: Users,
    title: "Travel with support",
    description: "You receive guidance and coordination throughout the journey, not just before departure.",
  },
];

const serviceCards = [
  {
    icon: TentTree,
    title: "Hajj Packages",
    description: "Structured Hajj journeys with support, preparation, and dependable planning.",
  },
  {
    icon: BookOpenCheck,
    title: "Umrah Packages",
    description: "Flexible Umrah options for families, first-time pilgrims, and guided groups.",
  },
  {
    icon: Landmark,
    title: "Domestic Tours",
    description: "Comfortable tours across Pakistan with better coordination, pacing, and support.",
  },
  {
    icon: Globe2,
    title: "International Tours",
    description: "Curated international travel with planning help, flexibility, and trusted service.",
  },
];

const differentiators = [
  "Scholar-led Umrah guidance through Mufti Furqan Mamji",
  "Preparation before departure, not just package selling",
  "Strong public trust with 4.9 Google rating and 297 reviews",
  "Travel support designed for families, first-time pilgrims, and groups",
];

export function TrustBand() {
  return (
    <section className="section-shell pt-12">
      <div className="rounded-[2rem] border border-primary/10 bg-primary px-6 py-8 text-primary-foreground shadow-glow sm:px-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal) => (
            <div key={signal.label} className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-5">
              <p className="font-display text-4xl font-semibold">{signal.value}</p>
              <p className="mt-2 text-sm text-primary-foreground/80">{signal.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Why People Hesitate"
        title="Planning sacred travel can feel overwhelming"
        description="If the journey matters deeply, you want more than basic booking. You want calm, clarity, and support you can trust."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {problemPoints.map((point, index) => (
          <AnimatedSection key={point.title} delay={index * 0.08}>
            <div className="soft-card h-full p-6 shadow-sm">
              <p className="font-display text-2xl font-semibold leading-tight">{point.title}</p>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{point.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function SolutionSection() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
        <div>
          <SectionHeading
            eyebrow="How We Help"
            title="A smoother path from planning to travel"
            description="We combine package planning, educational preparation, and ongoing support so you can focus on the purpose of the journey."
          />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {solutionSteps.map((step, index) => (
            <AnimatedSection key={step.title} delay={index * 0.08}>
              <div className="mesh-panel gold-ring h-full rounded-[2rem] p-6">
                <step.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-5 font-display text-2xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesOverview() {
  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="What You Can Book"
          title="Travel services designed around outcomes, not just logistics"
          description="Choose the journey that fits your need, then get the support required to travel with confidence."
        />
        <Link href="/contact" className="text-sm font-semibold text-primary">
          Talk to our team <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {serviceCards.map((service, index) => (
          <AnimatedSection key={service.title} delay={index * 0.08}>
            <div className="mesh-panel gold-ring h-full rounded-[2rem] p-6">
              <service.icon className="h-10 w-10 text-primary" />
              <h3 className="mt-5 font-display text-2xl font-semibold">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{service.description}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-8 lg:grid-cols-[1fr,0.95fr]">
        <div className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Why AlMuallim</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Built for travelers who want guidance, not guesswork
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:leading-8">
            The difference is simple. You are not left to figure everything out alone. Our process is built around clear
            advice, preparation, and dependable support for sacred travel and tours.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-white/80 p-5">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm leading-7">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-primary to-sky-500 p-6 text-primary-foreground shadow-glow sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">What People Want Most</p>
          <div className="mt-8 space-y-5">
            {[
              "A company that answers clearly before payment",
              "Preparation that reduces stress before departure",
              "Support during the journey when questions come up",
              "A premium, organized experience for family travel",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
                <CircleCheckBig className="mt-0.5 h-5 w-5 text-white" />
                <p className="text-sm leading-7 text-white/90">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedPackages() {
  const featured = allPackages.slice(0, 3);

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Popular Packages"
          title="Start with the journeys people ask for most"
          description="These are some of the most requested packages for pilgrims and travelers who want a more organized experience."
        />
        <Link href="/umrah-packages" className="text-sm font-semibold text-primary">
          Explore packages <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 xl:grid-cols-3">
        {featured.map((pkg, index) => (
          <AnimatedSection key={pkg.id} delay={index * 0.08}>
            <PackageCard pkg={pkg} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function GuidedUmrahHighlight() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-8 lg:grid-cols-[1fr,0.95fr]">
        <div className="mesh-panel gold-ring rounded-[2rem] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Signature Offer</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
            Choose Umrah with scholar-led support from Mufti Furqan Mamji
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:leading-8">
            If you want more than a standard travel package, this is the clearest next step. You get preparation,
            guidance, reminders, and a journey built around sincerity and confidence.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <Users className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm leading-7">Helpful for first-time pilgrims, families, and groups who want clear support.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm leading-7">Built around proper preparation, real access to guidance, and calm travel planning.</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/umrah-with-guidance">
              <Button size="lg">Explore Guided Umrah</Button>
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-[2rem] bg-primary p-3 shadow-glow">
          <video
            src={siteConfig.assets.media.umrahHero}
            controls
            preload="metadata"
            className="h-full min-h-[280px] w-full rounded-[1.5rem] object-cover sm:min-h-[360px]"
          />
        </div>
      </div>
    </section>
  );
}

export function HomeTrainingSection() {
  const trainingVideos = videos.filter((video) => video.category !== "Client Reviews").slice(0, 3);

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Preparation Resources"
          title="Prepare before you travel so the journey feels easier"
          description="Short, practical videos help you understand what to expect, what to do, and how to prepare spiritually and practically."
        />
        <Link href="/training-resources" className="text-sm font-semibold text-primary">
          View resources <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {trainingVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}

export function GoogleReviewsSection() {
  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Social Proof"
          title="Real trust, backed by public reviews"
          description="People trust AlMuallim because they can see the experience others had before them."
        />
        <div className="rounded-[2rem] border border-primary/10 bg-white/80 px-6 py-5 shadow-sm">
          <p className="font-display text-5xl font-semibold text-foreground">{siteConfig.googleRating.score}</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Sparkles key={index} className="h-4 w-4 fill-accent text-accent" />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.googleRating.totalReviews} Google Reviews</p>
        </div>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.slice(0, 3).map((review, index) => (
          <AnimatedSection key={review.name} delay={index * 0.08}>
            <GoogleReviewCard review={review} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function ClientVideoReviewsSection() {
  const reviewVideos = videos.filter((video) => video.category === "Client Reviews");

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Video Reviews"
          title="Hear directly from clients who already traveled with us"
          description="These review videos reduce uncertainty and help new travelers understand what the experience actually feels like."
        />
        <Link href="/training-resources" className="text-sm font-semibold text-primary">
          Watch all reviews <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reviewVideos.slice(0, 6).map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="What People Say"
        title="Clients mention the same strengths again and again"
        description="Clear communication. Thoughtful organization. Real guidance. Less stress."
        align="center"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.slice(2, 5).map((testimonial, index) => (
          <AnimatedSection key={testimonial.name} delay={index * 0.08}>
            <TestimonialCard testimonial={testimonial} />
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="section-shell section-space">
      <div className="overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-primary via-blue-700 to-sky-500 px-6 py-10 text-primary-foreground shadow-[0_30px_100px_rgba(37,99,235,0.22)] sm:px-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,0.95fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">Ready When You Are</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Choose the right package and get clear next steps today.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/85">
              If you are comparing options, planning for family travel, or preparing for Umrah or Hajj, we can help you
              move forward with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Book Your Consultation
                </Button>
              </Link>
              <Link href="/umrah-packages" className="sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white/25 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
                  Browse Packages
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/75">Fast response. Clear guidance. No pressure.</p>
          </div>
          <div className="rounded-[2rem] bg-white/95 p-1 text-foreground shadow-2xl">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function InquiryCTA() {
  return (
    <section className="section-shell section-space">
      <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Need Help Choosing?"
            title="Tell us what you are planning and we will guide you to the right option"
            description="Share your travel goal and we will help you choose the right package, timeline, and support level."
          />
          <div className="mt-8 space-y-4">
            <div className="soft-card flex gap-3 p-4">
              <MapPinned className="mt-1 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">
                Ideal if you are comparing packages and want a clear recommendation before booking.
              </p>
            </div>
            <div className="soft-card flex gap-3 p-4">
              <Users className="mt-1 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">
                Helpful for families, first-time pilgrims, and anyone who wants more confidence before travel.
              </p>
            </div>
          </div>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
