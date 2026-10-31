import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

// Shared split-screen layout for the admin sign-in and password-reset pages.
type AuthLayoutProps = {
  heading: React.ReactNode;
  description: string;
  features?: string[];
  children: React.ReactNode;
};

export const authFieldClass =
  "flex h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-base text-foreground placeholder:text-slate-400 transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10";

export const authButtonClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-glow transition hover:bg-primary/90 disabled:opacity-60";

export function AuthLayout({ heading, description, features, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.5fr,1fr]">
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#1b3f8f] via-primary to-[#0b1f4d] p-14 text-white lg:flex lg:flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:28px_28px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/3 top-1/3 h-[32rem] w-[32rem] rounded-full bg-sky-400/20 blur-3xl"
        />

        <Brand tone="light" className="relative" />

        <div className="relative my-auto max-w-xl">
          <h1 className="font-display text-6xl font-bold leading-[1.1] xl:text-7xl">{heading}</h1>
          <p className="mt-8 max-w-md text-xl leading-relaxed text-white/80">{description}</p>
          {features && (
            <ul className="mt-10 flex flex-wrap gap-3">
              {features.map((feature) => (
                <li key={feature} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="relative text-sm text-white/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </aside>

      <main className="flex items-center justify-center bg-slate-50 px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Brand tone="dark" className="mb-10 lg:hidden" />

          {children}

          <div className="mt-10 border-t border-slate-200 pt-8">
            <a href="https://www.depchip.com" target="_blank" rel="noreferrer" className="mx-auto flex w-fit items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <Image
                  src={siteConfig.assets.branding.depchipLogo}
                  alt="Depchip logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Powered by Depchip</p>
                <p className="text-sm text-slate-500">Product design and engineering partner</p>
              </div>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Same logo lockup as the site navbar: logo tile, "AlMuallim Travels", "Hajj, Umrah & Tours".
function Brand({ tone, className }: { tone: "light" | "dark"; className?: string }) {
  return (
    <Link href="/" className={cn("flex w-fit items-center gap-3", className)}>
      <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-primary/10">
        <Image src={siteConfig.assets.branding.orgLogo} alt={`${siteConfig.name} logo`} width={52} height={52} className="h-12 w-12" />
      </div>
      <div>
        <p
          className={cn(
            "font-display text-[1.9rem] font-semibold leading-[0.9] tracking-tight",
            tone === "light" ? "text-white" : "text-foreground",
          )}
        >
          AlMuallim Travels
        </p>
        <p
          className={cn(
            "mt-1.5 text-[11px] font-semibold uppercase leading-4 tracking-[0.22em]",
            tone === "light" ? "text-accent" : "text-primary/70",
          )}
        >
          Hajj, Umrah &amp; Tours
        </p>
      </div>
    </Link>
  );
}
