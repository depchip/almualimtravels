import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenCheck, Landmark, MapPinned, ShieldCheck, TentTree, Users } from "lucide-react";

import packages from "@/data/packages.json";
import testimonials from "@/data/testimonials.json";
import videos from "@/data/videos.json";

import { AnimatedSection } from "@/components/animated-section";
import { InquiryForm } from "@/components/inquiry-form";
import { PackageCard } from "@/components/package-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoCard } from "@/components/video-card";
import { siteConfig } from "@/lib/site";

const serviceCards = [
  {
    icon: TentTree,
    title: "Hajj",
    description: "Structured Hajj journeys designed around preparation, care, and clarity in every rite.",
  },
  {
    icon: BookOpenCheck,
    title: "Umrah",
    description: "A guided Umrah experience for individuals, families, and small groups seeking trusted support.",
  },
  {
    icon: Landmark,
    title: "Tours",
    description: "Local and international tours arranged with thoughtful itineraries and dependable service.",
  },
];

const trustSignals = [
  "Scholar-led guidance",
  "Pre-travel training sessions",
  "Community WhatsApp support",
  "Educational video resources",
];

export function ServicesOverview() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="What We Offer"
        title="Travel services built around preparation and trust"
        description="We focus on sacred travel with clarity, responsible planning, and meaningful support at every stage."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {serviceCards.map((service, index) => (
          <AnimatedSection key={service.title} delay={index * 0.08}>
            <div className="mesh-panel gold-ring rounded-[2rem] p-6">
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

export function TrustBand() {
  return (
    <section className="section-shell">
      <div className="rounded-[2rem] bg-primary px-6 py-8 text-primary-foreground sm:px-10">
        <div className="grid gap-4 md:grid-cols-4">
          {trustSignals.map((signal) => (
            <div key={signal} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">{signal}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedPackages() {
  const featured = packages.slice(0, 3);

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Featured Packages"
          title="Meaningful journeys prepared with care"
          description="A sample of our most requested travel experiences across sacred travel and curated tours."
        />
        <Link href="/contact" className="text-sm font-semibold text-primary">
          View all packages <ArrowRight className="ml-1 inline h-4 w-4" />
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Signature Experience</p>
          <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Umrah with personal guidance by Mufti Furqan Mamji</h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:leading-8">
            This is more than a package. It is a carefully supported Umrah journey with practical training, spiritual
            reminders, and a guide who is personally invested in the well-being of the group.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <Users className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm leading-7">Group leadership that remains accessible before departure and during travel.</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-5">
              <BadgeCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm leading-7">Focused attention on ritual understanding, confidence, and sincerity.</p>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/umrah-with-guidance">
              <Button size="lg">Learn More</Button>
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
  const trainingVideos = videos.filter((video) => video.category !== "Testimonials").slice(0, 3);

  return (
    <section className="section-shell section-space">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Training and Resources"
          title="Preparation begins before the journey"
          description="Study practical steps, spiritual reminders, and travel preparation through Mufti Furqan Mamji's educational content."
        />
        <Link href="/training-resources" className="text-sm font-semibold text-primary">
          Explore all videos <ArrowRight className="ml-1 inline h-4 w-4" />
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

export function TestimonialsSection() {
  return (
    <section className="section-shell section-space">
      <SectionHeading
        eyebrow="Testimonials"
        title="What travelers value most"
        description="Pilgrims and families consistently highlight clear guidance, organization, and compassionate support."
        align="center"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <AnimatedSection key={testimonial.name} delay={index * 0.08}>
            <TestimonialCard testimonial={testimonial} />
          </AnimatedSection>
        ))}
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
            eyebrow="Inquire / Book"
            title="Tell us about the journey you are planning"
            description="Whether you are preparing for Hajj, Umrah, a family tour, or training sessions, we can help you find the right path."
          />
          <div className="mt-8 space-y-4">
            <div className="flex gap-3 rounded-[1.5rem] bg-white/70 p-4">
              <MapPinned className="mt-1 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">Join community and package groups on WhatsApp for updates and announcements.</p>
            </div>
            <div className="flex gap-3 rounded-[1.5rem] bg-white/70 p-4">
              <Users className="mt-1 h-5 w-5 text-primary" />
              <p className="text-sm leading-7 text-muted-foreground">Receive guidance suited for first-time pilgrims, returning travelers, and families.</p>
            </div>
          </div>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
