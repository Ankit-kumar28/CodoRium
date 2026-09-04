"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  KeyRound,
  LogOut,
  Search,
  ShieldCheck,
  Trophy,
  UserPlus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { getMe, logout } from "@/lib/auth";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/auth";

const assignableRoles: Array<Exclude<UserRole, "ADMIN">> = [
  "STUDENT",
  "PROBLEM_SETTER",
  "FACULTY",
];

const roleLabels: Record<Exclude<UserRole, "ADMIN">, string> = {
  STUDENT: "Student",
  PROBLEM_SETTER: "Problem Setter",
  FACULTY: "Faculty",
};

export default function AdminPage() {
  const router = useRouter();
  const sessionUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(!sessionUser);
  const [accessError, setAccessError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: ["STUDENT"] as Array<Exclude<UserRole, "ADMIN">>,
  });

  useEffect(() => {
    async function verifyAdmin() {
      try {
        if (sessionUser) {
          if (!sessionUser.roles.includes("ADMIN")) {
            setAccessError("This account does not have administrator access.");
            setLoading(false);
            return;
          }

          setAdminName(
            `${sessionUser.firstName} ${sessionUser.lastName || ""}`.trim()
          );
          setLoading(false);
          return;
        }

        const user = await getMe();

        if (!user?.roles.includes("ADMIN")) {
          setAccessError("This account does not have administrator access.");
          setLoading(false);
          return;
        }

        setUser(user);
        setAdminName(`${user.firstName} ${user.lastName || ""}`.trim());
      } catch {
        setAccessError(
          "Your session could not be verified. Please sign in again."
        );
      } finally {
        setLoading(false);
      }
    }

    verifyAdmin();
  }, [router, sessionUser, setUser]);

  function toggleRole(role: Exclude<UserRole, "ADMIN">) {
    setForm((current) => ({
      ...current,
      roles: current.roles.includes(role)
        ? current.roles.filter((item) => item !== role)
        : [...current.roles, role],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setTemporaryPassword("");

    if (form.roles.length === 0) {
      setError("Select at least one role.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/admin/credentials", form);
      setMessage(`Credentials created for ${response.data.data.user.email}.`);
      setTemporaryPassword(response.data.data.temporaryPassword);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        roles: ["STUDENT"],
      });
    } catch (requestError: unknown) {
      const message =
        requestError && typeof requestError === "object" && "response" in requestError
          ? (requestError as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(
        message ||
          "Unable to generate credentials. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading admin workspace...
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto h-10 w-10 text-orange-500" />
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-slate-500">{accessError}</p>
          <button
            onClick={() => window.location.replace("/login")}
            className="mt-6 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-white hover:bg-orange-600"
          >
            Back to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-500 p-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">CodoRium Admin</p>
              <p className="text-sm text-slate-400">{adminName}</p>
            </div>
          </div>
         
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] space-y-6 p-5 lg:p-8">
        <section className="rounded-2xl bg-gradient-to-r from-[#312e81] via-indigo-700 to-violet-600 p-6 text-white shadow-lg lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">Admin control center</p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {adminName || "Admin"}.</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">Manage users, credentials and the health of your department&apos;s coding community.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700"><Activity className="h-4 w-4" /> View activity</button>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Total users", "542", "+12 this week", Users],
            ["Students", "436", "+10 this week", BookOpen],
            ["Problem setters", "64", "+3 this week", Trophy],
            ["Faculty", "38", "+2 this week", ShieldCheck],
          ].map(([label, value, change, Icon]) => {
            const StatIcon = Icon as typeof Users;
            return <div key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><StatIcon className="h-5 w-5" /></div><span className="text-xs font-semibold text-emerald-600">{change as string}</span></div><p className="mt-5 text-2xl font-bold">{value as string}</p><p className="mt-1 text-sm text-slate-500">{label as string}</p></div>;
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="font-bold">User management</h2><p className="mt-1 text-sm text-slate-500">View users and their assigned platform roles.</p></div><div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-400"><Search className="h-4 w-4" /> Search users</div></div>
            <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y border-slate-100 text-xs uppercase tracking-wide text-slate-400"><tr><th className="px-3 py-3 font-semibold">User</th><th className="px-3 py-3 font-semibold">Email</th><th className="px-3 py-3 font-semibold">Roles</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-3 py-3 font-semibold">Credentials</th></tr></thead><tbody className="divide-y divide-slate-100">{[["Ankit Kumar", "ankit.kumar@college.edu", "Student · Problem Setter", "Active", "01 May 2025"], ["Priya Singh", "priya.singh@college.edu", "Student", "Active", "28 Apr 2025"], ["Dr. Deepak Singh", "deepak.singh@college.edu", "Faculty", "Active", "15 Apr 2025"], ["Sneha Kapoor", "sneha.kapoor@college.edu", "Student", "Inactive", "10 Apr 2025"]].map(([name, email, roles, status, date]) => <tr key={email} className="hover:bg-slate-50"><td className="px-3 py-4 font-semibold text-slate-800">{name}</td><td className="px-3 py-4 text-slate-500">{email}</td><td className="px-3 py-4 text-xs text-indigo-600">{roles}</td><td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{status}</span></td><td className="px-3 py-4 text-xs text-slate-500">Generated<br />{date}</td></tr>)}</tbody></table></div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-bold">Role distribution</h2><div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full" style={{ background: "conic-gradient(#4f46e5 0 80%, #f97316 80% 92%, #10b981 92% 99%, #ef4444 99% 100%)" }}><div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center"><span><strong className="block text-xl">542</strong><small className="text-xs text-slate-400">users</small></span></div></div><div className="mt-5 space-y-3 text-sm">{[["Students", "436", "bg-indigo-500"], ["Problem Setters", "64", "bg-orange-500"], ["Faculty", "38", "bg-emerald-500"], ["Admin", "4", "bg-rose-500"]].map(([label, value, color]) => <div key={label} className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</span><strong>{value}</strong></div>)}</div></section>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3"><UserPlus className="mt-1 h-5 w-5 text-orange-500" /><div><h2 className="font-bold">Generate credentials</h2><p className="mt-1 text-sm text-slate-500">Create a user and email secure credentials instantly.</p></div></div>
            {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mb-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">First name<input required value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-orange-500" /></label><label className="text-sm font-medium text-slate-700">Last name<input value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-orange-500" /></label></div>
              <label className="block text-sm font-medium text-slate-700">Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-orange-500" /></label>
              <fieldset><legend className="text-sm font-medium text-slate-700">Assign roles</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{assignableRoles.map((role) => <label key={role} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:border-orange-400"><input type="checkbox" checked={form.roles.includes(role)} onChange={() => toggleRole(role)} className="h-4 w-4 accent-orange-500" />{roleLabels[role]}</label>)}</div></fieldset>
              <button disabled={submitting} className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"><KeyRound className="h-4 w-4" />{submitting ? "Generating..." : "Generate & email credentials"}</button>
            </form>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Student coding profile</h2><p className="mt-1 text-sm text-slate-500">Ankit Kumar · 2nd Year, CSE</p></div><BarChart3 className="h-5 w-5 text-indigo-500" /></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["186", "Solved"], ["1,642", "Rating"], ["14", "Contests"], ["#12", "Rank"]].map(([value, label]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><p className="text-xl font-bold text-indigo-600">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div><div className="mt-5 flex flex-wrap gap-2">{["Arrays", "Dynamic Programming", "Trees", "Graphs", "Hashing"].map((topic) => <span key={topic} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{topic}</span>)}</div><div className="mt-5 rounded-xl bg-slate-950 p-4 text-white"><div className="flex items-center justify-between"><span className="text-sm font-semibold">6 month rating progress</span><span className="text-xs text-emerald-400">+18.4%</span></div><div className="mt-5 flex h-16 items-end gap-1">{[25, 35, 30, 48, 42, 55, 63, 58, 72, 78, 75, 92].map((height, index) => <div key={index} className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-violet-300" style={{ height: `${height}%` }} />)}</div></div></section>
        </div>

        <aside className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm"><div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-orange-400" /><div><h2 className="font-semibold">Temporary password</h2><p className="mt-1 text-sm text-slate-400">Shown here for local admin testing. The same credentials are emailed to the user.</p></div></div><div className="mt-4 min-h-14 rounded-lg border border-dashed border-slate-700 p-4 font-mono text-sm text-orange-300">{temporaryPassword || "No credentials generated yet"}</div></aside>
      </div>
    </main>
  );
}