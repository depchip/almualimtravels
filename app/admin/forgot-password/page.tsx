"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";

import { AuthLayout, authButtonClass, authFieldClass } from "@/components/admin/auth-layout";
import { auth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

const resetSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type ResetValues = z.infer<typeof resetSchema>;

export default function AdminForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onSubmit = async ({ email }: ResetValues) => {
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";

      if (code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a few minutes and try again.");
        return;
      }
      // Any other error (e.g. unknown email) shows the same success message,
      // so the page does not reveal which emails have accounts.
    }

    setSentTo(email);
  };

  return (
    <AuthLayout
      heading={
        <>
          Forgot your
          <br />
          <span className="text-accent">password?</span>
        </>
      }
      description="No worries. Enter your email and we'll send you a link to set a new one right away."
    >
      <Link
        href="/admin/login"
        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>

      {sentTo ? (
        <div className="mt-8">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground">Check your email</h2>
          <p className="mt-3 text-lg text-slate-500">
            If <span className="font-semibold text-foreground">{sentTo}</span> belongs to an account, a reset link is on
            its way. Check your spam folder if it doesn&apos;t arrive in a few minutes.
          </p>
          <Link href="/admin/login" className={cn(authButtonClass, "mt-10")}>
            Back to sign in
            <ArrowRight className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="mt-6 w-full text-center text-base text-slate-500 hover:text-foreground"
          >
            Didn&apos;t get it? <span className="font-semibold text-foreground">Send again</span>
          </button>
        </div>
      ) : (
        <>
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-foreground">Reset password</h2>
          <p className="mt-2 text-lg text-slate-500">Enter your email and we&apos;ll send you a reset link.</p>

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
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cn(authFieldClass, errors.email && "border-red-400")}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <button type="submit" disabled={isSubmitting} className={authButtonClass}>
              {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
              Send reset link
              {!isSubmitting && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-base text-slate-500">
            Remembered it?{" "}
            <Link href="/admin/login" className="font-semibold text-foreground hover:text-primary">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
