"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Code2,
  Trophy,
  BarChart3,
  Zap,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const { login, isAuthenticated, loading, initialize, initialized } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && isAuthenticated && useAuthStore.getState().user) {
      const user = useAuthStore.getState().user;
      if (user?.roles.includes("ADMIN")) {
        router.replace("/dashboard/Admin");
      } else if (user?.roles && user.roles.length > 1) {
        router.replace("/continue-as");
      } else {
        router.replace("/dashboard/student");
      }
    }
  }, [initialized, isAuthenticated, router]);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Enter a valid email address";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const emailVal = validateEmail(email);
    const passwordVal = validatePassword(password);
    setEmailError(emailVal);
    setPasswordError(passwordVal);

    if (emailVal || passwordVal) return;

    try {
      const result = await login(
        email.trim().toLowerCase(),
        password
      );

      if (result.requiresRoleSelection) {
        router.replace("/continue-as");
      } else {
        const role = result.user.roles[0];
        if (role === "ADMIN") {
          router.replace("/dashboard/Admin");
        } else if (role === "FACULTY") {
          router.replace("/dashboard/Faculty");
        } else if (role === "PROBLEM_SETTER") {
          router.replace("/dashboard/Problem Setter");
        } else {
          router.replace("/dashboard/student");
        }
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(validateEmail(value));
    if (error) setError("");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError(validatePassword(value));
    if (error) setError("");
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================================= */}
        {/* LEFT SIDE — Hero Panel */}
        {/* ================================= */}
        <section className="relative hidden overflow-hidden lg:flex">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]" />

          {/* Decorative elements */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F97316]/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#F97316]/5 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-[#F97316]/8 blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316] text-lg font-bold shadow-lg shadow-orange-500/30">
                  C
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    CodoRium
                  </h1>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                    Competitive Coding Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-4 py-2 text-sm text-orange-300">
                <Zap className="mr-2 h-3.5 w-3.5" />
                Departmental Coding Platform
              </div>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Build.
                <br />
                Compete.
                <br />
                <span className="text-[#F97316]">Get Better.</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Practice coding problems, participate in
                departmental contests, track your performance and
                improve your competitive programming skills.
              </p>

              {/* Features */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <FeatureCard
                  icon={Code2}
                  title="Coding Problems"
                  description="Practice & learn"
                />
                <FeatureCard
                  icon={Trophy}
                  title="Contests"
                  description="Compete with peers"
                />
                <FeatureCard
                  icon={BarChart3}
                  title="Leaderboard"
                  description="Track rankings"
                />
                <FeatureCard
                  icon={Zap}
                  title="Performance"
                  description="Analyze progress"
                />
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CodoRium. All rights
              reserved.
            </p>
          </div>
        </section>

        {/* ================================= */}
        {/* RIGHT SIDE — Login Form */}
        {/* ================================= */}
        <section className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-5 py-10 text-[#0F172A] sm:px-8">
          <div className="w-full max-w-md animate-slide-up">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316] text-lg font-bold text-white">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0F172A]">
                  CodoRium
                </h1>
                <p className="text-xs text-slate-500">
                  Competitive Coding Platform
                </p>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Sign in to your CodoRium account
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-slide-down">
                  <div className="flex gap-2 items-center">
                    <span className="text-red-500">⚠</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#0F172A]"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="h-[18px] w-[18px]" />
                    </div>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      placeholder="your@email.com"
                      autoComplete="email"
                      disabled={loading}
                      onChange={(e) =>
                        handleEmailChange(e.target.value)
                      }
                      className={`
                        h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none transition-all
                        placeholder:text-slate-400
                        focus:border-[#F97316] focus:ring-4 focus:ring-orange-100
                        disabled:cursor-not-allowed disabled:opacity-60
                        ${emailError ? "border-red-400 focus:ring-red-100" : "border-slate-200"}
                      `}
                    />
                  </div>

                  {emailError && (
                    <p className="text-xs text-red-600">{emailError}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-[#0F172A]"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-[#F97316] hover:text-orange-600 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="h-[18px] w-[18px]" />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                      onChange={(e) =>
                        handlePasswordChange(e.target.value)
                      }
                      className={`
                        h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm outline-none transition-all
                        placeholder:text-slate-400
                        focus:border-[#F97316] focus:ring-4 focus:ring-orange-100
                        disabled:cursor-not-allowed disabled:opacity-60
                        ${passwordError ? "border-red-400 focus:ring-red-100" : "border-slate-200"}
                      `}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((v) => !v)}
                      disabled={loading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-[18px] w-[18px]" />
                      ) : (
                        <Eye className="h-[18px] w-[18px]" />
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-xs text-red-600">{passwordError}</p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    h-12 w-full rounded-xl bg-[#F97316] font-semibold text-white
                    shadow-lg shadow-orange-500/25
                    transition-all duration-200
                    hover:bg-[#EA580C] hover:shadow-orange-500/30
                    active:translate-y-px
                    disabled:cursor-not-allowed disabled:opacity-70
                  "
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* Info */}
              <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3 text-center text-xs leading-5 text-slate-500">
                CodoRium accounts are created by the college
                administration. Contact your admin for access.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ================================= */
/* FEATURE CARD */
/* ================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-[#F97316]/30 hover:bg-white/10">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316]/15 text-[#F97316]">
        <Icon className="h-4 w-4" />
      </div>

      <h3 className="text-sm font-semibold text-white">{title}</h3>

      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}