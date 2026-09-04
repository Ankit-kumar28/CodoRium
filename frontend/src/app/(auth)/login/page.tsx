"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const {
    login,
    loading,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [redirecting, setRedirecting] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  /**
   * Email validation
   */
  const validateEmail = (
    value: string
  ) => {
    if (!value.trim()) {
      return "Email is required";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return "Enter a valid email address";
    }

    return "";
  };

  /**
   * Password validation
   */
  const validatePassword = (
    value: string
  ) => {
    if (!value) {
      return "Password is required";
    }

    if (value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  /**
   * Submit login
   */
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    const emailValidation =
      validateEmail(email);

    const passwordValidation =
      validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(
      passwordValidation
    );

    if (
      emailValidation ||
      passwordValidation
    ) {
      return;
    }

    try {
      setRedirecting(true);
      const loggedInUser = await login(
        email.trim().toLowerCase(),
        password
      );

      if (loggedInUser.roles.length > 1) {
        router.replace("/continue-as");
      } else if (loggedInUser.roles[0] === "ADMIN") {
        window.location.replace("/dashboard/Admin");
      } else if (loggedInUser.roles[0] === "FACULTY") {
        window.location.replace("/dashboard/Faculty");
      } else if (loggedInUser.roles[0] === "PROBLEM_SETTER") {
        window.location.replace("/dashboard/Problem%20Setter");
      } else {
        window.location.replace("/dashboard");
      }
    } catch (error) {
      setRedirecting(false);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again.";

      setError(message);
    }
  };

  /**
   * Email change
   */
  const handleEmailChange = (
    value: string
  ) => {
    setEmail(value);

    if (emailError) {
      setEmailError(
        validateEmail(value)
      );
    }

    if (error) {
      setError("");
    }
  };

  /**
   * Password change
   */
  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);

    if (passwordError) {
      setPasswordError(
        validatePassword(value)
      );
    }

    if (error) {
      setError("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* ================================= */}
        {/* LEFT SIDE */}
        {/* ================================= */}

        <section className="relative hidden overflow-hidden lg:flex">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-950" />

          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/30">
                  C
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    CodoRium
                  </h1>

                  <p className="text-xs text-slate-400">
                    Competitive Coding Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Hero */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                Departmental Coding Platform
              </div>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Build.
                <br />
                Compete.
                <br />
                <span className="text-blue-400">
                  Get Better.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                Practice coding problems, participate
                in departmental contests, track your
                performance and improve your competitive
                programming skills.
              </p>

              {/* Features */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <Feature
                  title="Coding Problems"
                  description="Practice problems"
                />

                <Feature
                  title="Contests"
                  description="Compete with peers"
                />

                <Feature
                  title="Leaderboard"
                  description="Track rankings"
                />

                <Feature
                  title="Performance"
                  description="Analyze progress"
                />
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} CodoRium.
              All rights reserved.
            </p>
          </div>
        </section>

        {/* ================================= */}
        {/* RIGHT SIDE */}
        {/* ================================= */}

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                C
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  CodoRium
                </h1>

                <p className="text-xs text-slate-500">
                  Competitive Coding Platform
                </p>
              </div>
            </div>

            <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
              <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold">
                  Welcome back
                </CardTitle>

                <CardDescription>
                  Sign in to your CodoRium account
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Error */}
                {error && (
                  <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <div className="flex gap-2">
                      <span>⚠️</span>

                      <span>{error}</span>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* EMAIL */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email
                    </Label>

                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <MailIcon />
                      </div>

                      <Input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="admin@gmail.com"
                        autoComplete="email"
                        disabled={loading || redirecting}
                        onChange={(event) =>
                          handleEmailChange(
                            event.target.value
                          )
                        }
                        className={`h-11 pl-10 ${
                          emailError
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                    </div>

                    {emailError && (
                      <p className="text-xs text-red-600">
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">
                        Password
                      </Label>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <LockIcon />
                      </div>

                      <Input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={password}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={loading || redirecting}
                        onChange={(event) =>
                          handlePasswordChange(
                            event.target.value
                          )
                        }
                        className={`h-11 pl-10 pr-11 ${
                          passwordError
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />

                      <button
                        type="button"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        onClick={() =>
                          setShowPassword(
                            (value) => !value
                          )
                        }
                        disabled={loading || redirecting}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {showPassword ? (
                          <EyeOffIcon />
                        ) : (
                          <EyeIcon />
                        )}
                      </button>
                    </div>

                    {passwordError && (
                      <p className="text-xs text-red-600">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* REMEMBER */}
                  <div className="flex items-center gap-2">
                    <input
                      id="remember"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                    />

                    <label
                      htmlFor="remember"
                      className="cursor-pointer text-sm text-slate-600"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={loading || redirecting}
                    className="h-11 w-full bg-blue-600 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading || redirecting ? (
                      <span className="flex items-center gap-2">
                        <Spinner />
                        {redirecting ? "Opening dashboard..." : "Signing in..."}
                      </span>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </form>

                {/* Info */}
                <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-center text-xs leading-5 text-slate-500">
                  CodoRium accounts are created by
                  the college administration.
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ================================= */
/* FEATURE COMPONENT */
/* ================================= */

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
        ✓
      </div>

      <h3 className="text-sm font-semibold text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* ================================= */
/* ICONS */
/* ================================= */

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="20"
        height="16"
        x="2"
        y="4"
        rx="2"
      />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="18"
        height="11"
        x="3"
        y="11"
        rx="2"
      />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.77 7.3 7.7 4 12 4s8.23 3.3 9.94 7.65a1 1 0 0 1 0 .7C20.23 16.7 16.3 20 12 20s-8.23-3.3-9.94-7.65Z" />
      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c4.3 0 8.23 3.3 9.94 7.65a1 1 0 0 1 0 .7 10.48 10.48 0 0 1-2.12 3.19" />
      <path d="M6.61 6.61A10.7 10.7 0 0 0 2.06 11.65a1 1 0 0 0 0 .7C3.77 16.7 7.7 20 12 20a10.7 10.7 0 0 0 5.39-1.61" />
      <line
        x1="2"
        x2="22"
        y1="2"
        y2="22"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
      aria-hidden="true"
    />
  );
}