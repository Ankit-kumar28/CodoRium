"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, Send } from "lucide-react";
import { forgotPassword } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email.trim().toLowerCase());

      setSuccess(
        "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6">
      {/* Decorative */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F97316]/8 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#F97316]/5 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-scale-in">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-[#F97316]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#F97316]">
            <Mail className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold text-[#0F172A]">
            Forgot password?
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your registered email and we&apos;ll send you a
            reset link.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 animate-slide-down">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 animate-slide-down">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
              Email address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send reset link
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}