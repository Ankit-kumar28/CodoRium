"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
          Loading...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams =
    useSearchParams();

  const token =
    searchParams.get("token");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (!token) {
      setError(
        "Invalid or missing reset token."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        token,
        password
      );

      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(
        message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl">

          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

          <h1 className="mt-6 text-3xl font-bold">
            Password reset successful
          </h1>

          <p className="mt-3 text-slate-500">
            Your password has been changed.
            You can now login with your new
            password.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
          >
            Continue to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            Create new password
          </h1>

          <p className="mt-2 text-slate-500">
            Choose a strong password for
            your account.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <PasswordInput
            label="New password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            toggle={() =>
              setShowPassword(
                !showPassword
              )
            }
          />

          <PasswordInput
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            toggle={() =>
              setShowConfirm(
                !showConfirm
              )
            }
          />

          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  toggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            show ? "text" : "password"
          }
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400"
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