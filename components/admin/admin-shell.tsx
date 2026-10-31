"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "@/lib/firebase/auth-context";
import { siteConfig } from "@/lib/site";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname().replace(/\/$/, "");
  const router = useRouter();
  const { user, isAdmin, loading, logout } = useAuth();
  // Pages reachable while signed out.
  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/forgot-password";

  useEffect(() => {
    if (loading || isLoginPage) return;

    if (!user) {
      router.replace("/admin/login");
    } else if (!isAdmin) {
      // Signed in with a non-admin account: drop the session and send back to login.
      logout().then(() => router.replace("/admin/login"));
    }
  }, [loading, user, isAdmin, isLoginPage, logout, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b border-primary/10 bg-white/90 backdrop-blur">
        <div className="section-shell flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-primary/10">
              <Image src={siteConfig.assets.branding.orgLogo} alt={`${siteConfig.name} logo`} width={40} height={40} className="h-9 w-9" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-[0.9] tracking-tight sm:text-2xl">AlMuallim Travels</p>
              <p className="mt-1 text-[10px] font-semibold uppercase leading-4 tracking-[0.22em] text-primary/70">Blog Admin</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">{user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              aria-label="Sign out"
              onClick={() => logout().then(() => router.replace("/admin/login"))}
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="section-shell py-6 sm:py-8">{children}</div>
    </div>
  );
}
