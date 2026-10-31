"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { AuthLayout, authButtonClass, authFieldClass } from "@/components/admin/auth-layout";
import { useAuth } from "@/lib/firebase/auth-context";
import { auth, isAdminUid } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, isAdmin, router]);

  const onSubmit = async ({ email, password }: LoginValues) => {
    setError(null);

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!isAdminUid(user.uid)) {
        await signOut(auth);
        setError("This account does not have admin access.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      setError(
        code === "auth/too-many-requests"
          ? "Too many attempts. Please wait a few minutes and try again."
          : "Invalid email or password.",
      );
    }
  };

  return (
    <AuthLayout
      heading={
        <>
          Share every
          <br />
          <span className="text-accent">sacred</span>
          <br />
          journey.
        </>
      }
      description="Write travel guides, Hajj and Umrah updates, and tour stories, all from one simple dashboard."
      features={["Rich Text Editor", "Cover Photos", "YouTube Embeds", "Drafts & Scheduling"]}
    >
      <h2 className="text-4xl font-bold tracking-tight text-foreground">Welcome back</h2>
      <p className="mt-2 text-lg text-slate-500">Sign in to manage the blog</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
        <div className="space-y-2">
          <label htmlFor="email" className="text-base font-semibold text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              className={cn(authFieldClass, errors.email && "border-red-400")}
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-base font-semibold text-foreground">
              Password
            </label>
            <Link href="/admin/forgot-password" className="text-sm font-semibold text-foreground hover:text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={cn(authFieldClass, "pr-12", errors.password && "border-red-400")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={isSubmitting} className={authButtonClass}>
          {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
          Sign in
          {!isSubmitting && <ArrowRight className="h-5 w-5" />}
        </button>
      </form>

      <p className="mt-8 text-center text-base text-slate-500">Access is limited to authorized administrators.</p>
    </AuthLayout>
  );
}
