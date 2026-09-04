"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { changePassword } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";

export default function ChangePasswordPage() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const [visibleFields, setVisibleFields] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  async function submit(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");

    if (!currentPassword) {
      setError(
        "Enter your current password."
      );
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      await changePassword(
        currentPassword,
        newPassword
      );

      setSuccess(true);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      clearAuth();
      setTimeout(() => window.location.replace("/login"), 1200);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(
        message ||
          "Unable to change password."
      );

      if (status === 401) {
        clearAuth();
        window.setTimeout(() => window.location.replace("/login"), 700);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-8">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-3xl font-bold">
            Change password
          </h1>

          <p className="mt-2 text-slate-500">
            Update your account password.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Password changed successfully.
          </div>
        )}

        <form
          onSubmit={submit}
          className="space-y-5"
        >
          <PasswordField
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={visibleFields.current}
            onToggle={() => setVisibleFields((fields) => ({ ...fields, current: !fields.current }))}
          />

          <PasswordField
            label="New password"
            value={newPassword}
            onChange={setNewPassword}
            visible={visibleFields.next}
            onToggle={() => setVisibleFields((fields) => ({ ...fields, next: !fields.next }))}
          />

          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={visibleFields.confirm}
            onToggle={() => setVisibleFields((fields) => ({ ...fields, confirm: !fields.confirm }))}
          />

          <button
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Change password"
            )}
          </button>
        </form>

        <Link
          href="/dashboard"
          className="mt-5 block text-center text-sm font-semibold text-indigo-600"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-12 w-full rounded-xl border border-slate-200 px-4 pr-12 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
      />
      <button type="button" onClick={onToggle} aria-label={visible ? `Hide ${label}` : `Show ${label}`} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600">
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
      </div>
    </div>
  );
}