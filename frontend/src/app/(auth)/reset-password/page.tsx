"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { resetPassword } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl animate-scale-in">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />

          <h1 className="mt-6 text-3xl font-bold text-[#0F172A]">
            Password reset successful
          </h1>

          <p className="mt-3 text-slate-500">
            Your password has been changed. You can now login with
            your new password.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#F97316] font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C]"
          >
            Continue to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] px-6">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F97316]/8 blur-3xl" />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-scale-in">
        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-[#F97316]">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold text-[#0F172A]">
            Create new password
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a strong password for your account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 animate-slide-down">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordInput
            label="New password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            placeholder="At least 8 characters"
          />

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
            placeholder="Re-enter your password"
          />

          {/* Password requirements */}
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-600 mb-2">
              Password requirements:
            </p>
            <ul className="space-y-1">
              <li
                className={`text-xs flex items-center gap-2 ${
                  password.length >= 8
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                <span>{password.length >= 8 ? "✓" : "○"}</span>
                At least 8 characters
              </li>
              <li
                className={`text-xs flex items-center gap-2 ${
                  password && password === confirmPassword
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                <span>
                  {password && password === confirmPassword
                    ? "✓"
                    : "○"}
                </span>
                Passwords match
              </li>
            </ul>
          </div>

          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  show,
  toggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#0F172A]">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 text-sm outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 transition hover:text-slate-600"
        >
          {show ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0F172A]">
          <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}