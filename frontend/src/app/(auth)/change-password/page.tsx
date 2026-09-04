"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

import { changePassword } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/api";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [visibleFields, setVisibleFields] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(async () => {
        await logout();
        router.replace("/login");
      }, 1500);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#F97316]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#F97316] transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316]/15 text-[#F97316] shadow-lg shadow-orange-500/10 mb-4">
            <Lock className="h-7 w-7" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Change Password
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {user ? `Update security for ${user.email}` : "Update your account password"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#1E293B] p-6 sm:p-8 shadow-2xl shadow-black/40">
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-semibold text-white">Password Updated!</h2>
              <p className="text-sm text-slate-400">
                Your password has been changed successfully. Logging out...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordField
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={visibleFields.current}
                onToggle={() =>
                  setVisibleFields((f) => ({ ...f, current: !f.current }))
                }
                disabled={loading}
              />

              <PasswordField
                label="New Password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={setNewPassword}
                visible={visibleFields.next}
                onToggle={() =>
                  setVisibleFields((f) => ({ ...f, next: !f.next }))
                }
                disabled={loading}
              />

              <PasswordField
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={visibleFields.confirm}
                onToggle={() =>
                  setVisibleFields((f) => ({ ...f, confirm: !f.confirm }))
                }
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-[#F97316] font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggle,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full rounded-xl border border-slate-700 bg-[#0F172A] px-4 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#F97316] focus:ring-2 focus:ring-orange-500/20 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
