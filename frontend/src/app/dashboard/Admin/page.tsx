"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  Crown,
  Database,
  ExternalLink,
  Flame,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Medal,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { getMe } from "@/lib/auth";
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

/* External Coding Platform Leaderboard Data */
interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  yearDepartment: string;
  leetcode: { solved: number; rating: number };
  codeforces: { solved: number; rating: number; rankTitle: string };
  codechef: { solved: number; rating: number };
  gfg: { solved: number; score: number };
  totalSolved: number;
  rank: number;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    name: "Ankit Kumar",
    email: "ankit.kumar@college.edu",
    yearDepartment: "3rd Year, CSE",
    leetcode: { solved: 520, rating: 1850 },
    codeforces: { solved: 340, rating: 1620, rankTitle: "Specialist" },
    codechef: { solved: 290, rating: 1740 },
    gfg: { solved: 410, score: 1450 },
    totalSolved: 1560,
    rank: 1,
  },
  {
    id: "2",
    name: "Priya Singh",
    email: "priya.singh@college.edu",
    yearDepartment: "3rd Year, CSE",
    leetcode: { solved: 480, rating: 1790 },
    codeforces: { solved: 310, rating: 1540, rankTitle: "Specialist" },
    codechef: { solved: 320, rating: 1680 },
    gfg: { solved: 380, score: 1320 },
    totalSolved: 1490,
    rank: 2,
  },
  {
    id: "3",
    name: "Rahul Verma",
    email: "rahul.v@college.edu",
    yearDepartment: "4th Year, IT",
    leetcode: { solved: 440, rating: 1720 },
    codeforces: { solved: 280, rating: 1490, rankTitle: "Pupil" },
    codechef: { solved: 250, rating: 1610 },
    gfg: { solved: 350, score: 1210 },
    totalSolved: 1320,
    rank: 3,
  },
  {
    id: "4",
    name: "Sneha Kapoor",
    email: "sneha.k@college.edu",
    yearDepartment: "2nd Year, CSE",
    leetcode: { solved: 390, rating: 1650 },
    codeforces: { solved: 220, rating: 1410, rankTitle: "Pupil" },
    codechef: { solved: 210, rating: 1520 },
    gfg: { solved: 290, score: 1040 },
    totalSolved: 1110,
    rank: 4,
  },
  {
    id: "5",
    name: "Aman Gupta",
    email: "aman.g@college.edu",
    yearDepartment: "2nd Year, ECE",
    leetcode: { solved: 310, rating: 1580 },
    codeforces: { solved: 190, rating: 1350, rankTitle: "Pupil" },
    codechef: { solved: 180, rating: 1450 },
    gfg: { solved: 240, score: 890 },
    totalSolved: 920,
    rank: 5,
  },
];

export default function AdminPage() {
  const router = useRouter();
  const sessionUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const storeLogout = useAuthStore((state) => state.logout);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(!sessionUser);
  const [accessError, setAccessError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "credentials" | "leaderboard" | "users">("overview");

  /* Notifications & Profile Popup states */
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* Credential Form State */
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roles: ["STUDENT"] as Array<Exclude<UserRole, "ADMIN">>,
  });

  /* Search Filter for Leaderboard */
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function verifyAdmin() {
      try {
        if (sessionUser) {
          if (!sessionUser.roles.includes("ADMIN")) {
            setAccessError("This account does not have administrator access.");
            setLoading(false);
            return;
          }

          setAdminName(`${sessionUser.firstName} ${sessionUser.lastName || ""}`.trim());
          setAdminEmail(sessionUser.email);
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
        setAdminEmail(user.email);
      } catch {
        setAccessError("Your session could not be verified. Please sign in again.");
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
    setCopied(false);

    if (form.roles.length === 0) {
      setError("Select at least one role to assign.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/admin/credentials", form);
      const generatedPass = response.data.data.temporaryPassword;
      setMessage(`Credentials created for ${response.data.data.user.email}! Secure email sent.`);
      setTemporaryPassword(generatedPass);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        roles: ["STUDENT"],
      });
    } catch (requestError: unknown) {
      const msg =
        requestError && typeof requestError === "object" && "response" in requestError
          ? (requestError as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setError(msg || "Unable to generate credentials. Please check parameters.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await storeLogout();
    window.location.replace("/login");
  }

  function handleCopyPassword() {
    if (!temporaryPassword) return;
    navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredLeaderboard = mockLeaderboard.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.yearDepartment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F172A] text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#F97316]" />
          <span className="font-medium text-slate-300">Loading Admin Workspace...</span>
        </div>
      </main>
    );
  }

  if (accessError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 text-[#0F172A]">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl border border-slate-200">
          <ShieldCheck className="mx-auto h-12 w-12 text-[#F97316]" />
          <h1 className="mt-4 text-xl font-bold">Admin Access Required</h1>
          <p className="mt-2 text-sm text-slate-500">{accessError}</p>
          <button
            onClick={() => window.location.replace("/login")}
            className="mt-6 rounded-xl bg-[#F97316] px-6 py-2.5 font-semibold text-white hover:bg-orange-600 transition"
          >
            Back to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* ==================================================== */}
      {/* SIDEBAR */}
      {/* ==================================================== */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-[#0F172A] text-white lg:flex border-r border-slate-800">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F97316] font-bold text-white shadow-lg shadow-orange-500/20">
            C
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">CodoRium</h1>
            <p className="text-[11px] font-medium text-orange-400 uppercase tracking-wider">Admin Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          <NavItem
            icon={LayoutDashboard}
            label="Overview & Stats"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavItem
            icon={UserPlus}
            label="Generate Credentials"
            active={activeTab === "credentials"}
            onClick={() => setActiveTab("credentials")}
            badge="Generate"
          />
          <NavItem
            icon={Trophy}
            label="Coding Leaderboards"
            active={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
          />
          <NavItem
            icon={Users}
            label="User Directory"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
        </nav>

        {/* Sidebar Footer — Profile & Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F97316] font-bold text-white text-sm">
              {adminName[0] || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{adminName || "Administrator"}</p>
              <p className="truncate text-[11px] text-slate-400">{adminEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ==================================================== */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header / Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
          {/* Mobile Brand / Page Title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316] text-white font-bold text-sm">
              C
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {activeTab === "overview" && "Dashboard Overview"}
                {activeTab === "credentials" && "User Credential Generator"}
                {activeTab === "leaderboard" && "Competitive Coding Leaderboards"}
                {activeTab === "users" && "User Directory"}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                Welcome back, {adminName || "Admin"} · CodoRium Control Hub
              </p>
            </div>
          </div>

          {/* Right Header Icons — Notifications & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Quick Navigation Tabs (Mobile/Tablet) */}
            <div className="flex lg:hidden gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${activeTab === "overview" ? "bg-[#F97316] text-white" : "text-slate-600"}`}
              >
                Stats
              </button>
              <button
                onClick={() => setActiveTab("credentials")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${activeTab === "credentials" ? "bg-[#F97316] text-white" : "text-slate-600"}`}
              >
                Create
              </button>
            </div>

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setProfileOpen(false);
                }}
                className="relative rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-[#F97316] hover:bg-slate-50 hover:text-[#F97316]"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F97316] ring-2 ring-white" />
              </button>

              {/* Notifications Popup Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-slide-down">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-[#0F172A]">Notifications</h4>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#F97316]">
                      3 New
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <NotificationItem
                      title="New Student Registered"
                      desc="Priya Singh joined the platform."
                      time="10m ago"
                    />
                    <NotificationItem
                      title="Contest CodeSprint #7 Created"
                      desc="Problem setter published 5 tasks."
                      time="1h ago"
                    />
                    <NotificationItem
                      title="System Backup Completed"
                      desc="Database snapshot saved."
                      time="3h ago"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 transition hover:border-[#F97316] hover:bg-slate-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F172A] text-xs font-bold text-white">
                  {adminName[0] || "A"}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#0F172A]">
                  {adminName || "Admin"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-slide-down">
                  <div className="border-b border-slate-100 p-3">
                    <p className="text-xs font-bold text-[#0F172A]">{adminName}</p>
                    <p className="truncate text-[11px] text-slate-400">{adminEmail}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/change-password"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#F97316] transition"
                    >
                      <KeyRound className="h-4 w-4 text-slate-400" />
                      Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Workspace */}
        <main className="flex-1 space-y-6 p-6">
          {/* ============================================= */}
          {/* TOP STATS CARDS */}
          {/* ============================================= */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Active Users"
              value="542"
              subtitle="+12 added this week"
              icon={Users}
              color="border-l-4 border-l-[#0F172A]"
            />
            <StatCard
              title="Total Students"
              value="436"
              subtitle="80.4% of department"
              icon={BookOpen}
              color="border-l-4 border-l-[#F97316]"
            />
            <StatCard
              title="Problem Setters"
              value="64"
              subtitle="11.8% of department"
              icon={Trophy}
              color="border-l-4 border-l-amber-500"
            />
            <StatCard
              title="Faculty Members"
              value="38"
              subtitle="7.8% of department"
              icon={ShieldCheck}
              color="border-l-4 border-l-emerald-500"
            />
          </div>

          {/* ============================================= */}
          {/* GENERATE CREDENTIALS FORM SECTION */}
          {/* ============================================= */}
          {(activeTab === "overview" || activeTab === "credentials") && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#F97316]">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Generate User Credentials</h3>
                    <p className="text-xs text-slate-500">
                      Create student/faculty accounts and instantly dispatch credentials via email.
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" /> Email Delivery Ready
                </span>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-slide-down">
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {message && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 animate-slide-down flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{message}</span>
                </div>
              )}

              {/* Temporary Password Highlight Box */}
              {temporaryPassword && (
                <div className="mb-6 rounded-2xl bg-[#0F172A] p-5 text-white shadow-xl animate-scale-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-orange-400">
                      <KeyRound className="h-4 w-4" /> Generated Temporary Password
                    </div>
                    <button
                      onClick={handleCopyPassword}
                      className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy Password
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-3 font-mono text-lg font-bold text-[#F97316] tracking-wider">
                    {temporaryPassword}
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    This password has been emailed to the user. Copy it if you want to share it directly.
                  </p>
                </div>
              )}

              {/* Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">First Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">Email Address *</label>
                  <input
                    required
                    type="email"
                    placeholder="user@college.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#F97316] focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-[#0F172A]">Assign Platform Roles *</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {assignableRoles.map((role) => (
                      <label
                        key={role}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs font-semibold transition ${
                          form.roles.includes(role)
                            ? "border-[#F97316] bg-orange-50/50 text-[#F97316]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.roles.includes(role)}
                          onChange={() => toggleRole(role)}
                          className="h-4 w-4 rounded accent-[#F97316]"
                        />
                        {roleLabels[role]}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating & Sending Email...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4" />
                      Generate & Email Credentials
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================= */}
          {/* CODING PLATFORMS LEADERBOARD TABLE */}
          {/* ============================================= */}
          {(activeTab === "overview" || activeTab === "leaderboard") && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-[#0F172A]">All Coding Platforms Leaderboard</h3>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Live solved problems & ratings across LeetCode, Codeforces, CodeChef, and GeeksforGeeks.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left text-xs">
                  <thead className="border-y border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Rank</th>
                      <th className="px-4 py-3 font-semibold">Student Details</th>
                      <th className="px-4 py-3 font-semibold">LeetCode</th>
                      <th className="px-4 py-3 font-semibold">Codeforces</th>
                      <th className="px-4 py-3 font-semibold">CodeChef</th>
                      <th className="px-4 py-3 font-semibold">GFG</th>
                      <th className="px-4 py-3 font-semibold text-right">Total Solved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaderboard.map((user) => (
                      <tr key={user.id} className="transition hover:bg-slate-50">
                        {/* Rank */}
                        <td className="px-4 py-4 font-bold text-slate-700">
                          {user.rank === 1 ? (
                            <span className="flex items-center gap-1 text-amber-500 font-extrabold">
                              <Crown className="h-4 w-4" /> #1
                            </span>
                          ) : user.rank === 2 ? (
                            <span className="text-slate-400 font-extrabold">#2</span>
                          ) : user.rank === 3 ? (
                            <span className="text-amber-700 font-extrabold">#3</span>
                          ) : (
                            `#${user.rank}`
                          )}
                        </td>

                        {/* Name & Dept */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-[#0F172A]">{user.name}</p>
                          <p className="text-[11px] text-slate-500">{user.yearDepartment}</p>
                        </td>

                        {/* LeetCode */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-800">
                            <span className="font-bold">{user.leetcode.solved}</span> prob · {user.leetcode.rating}
                          </span>
                        </td>

                        {/* Codeforces */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-800">
                            <span className="font-bold">{user.codeforces.solved}</span> prob · {user.codeforces.rating} ({user.codeforces.rankTitle})
                          </span>
                        </td>

                        {/* CodeChef */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-2.5 py-1 font-semibold text-stone-800">
                            <span className="font-bold">{user.codechef.solved}</span> prob · {user.codechef.rating}★
                          </span>
                        </td>

                        {/* GFG */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800">
                            <span className="font-bold">{user.gfg.solved}</span> prob
                          </span>
                        </td>

                        {/* Total Solved */}
                        <td className="px-4 py-4 text-right font-extrabold text-[#F97316] text-sm">
                          {user.totalSolved}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================= */}
          {/* USER DIRECTORY TAB */}
          {/* ============================================= */}
          {(activeTab === "overview" || activeTab === "users") && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">Recent Registered Users</h3>
                  <p className="text-xs text-slate-500">Department users and their active system roles.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-xs">
                  <thead className="border-y border-slate-100 bg-slate-50 uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3 font-semibold">User</th>
                      <th className="px-3 py-3 font-semibold">Email</th>
                      <th className="px-3 py-3 font-semibold">Roles</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ["Ankit Kumar", "ankit.kumar@college.edu", "Student · Problem Setter", "Active"],
                      ["Priya Singh", "priya.singh@college.edu", "Student", "Active"],
                      ["Dr. Deepak Singh", "deepak.singh@college.edu", "Faculty", "Active"],
                      ["Sneha Kapoor", "sneha.kapoor@college.edu", "Student", "Active"],
                    ].map(([name, email, roles, status]) => (
                      <tr key={email} className="hover:bg-slate-50">
                        <td className="px-3 py-3.5 font-bold text-slate-800">{name}</td>
                        <td className="px-3 py-3.5 text-slate-500">{email}</td>
                        <td className="px-3 py-3.5 font-semibold text-[#F97316]">{roles}</td>
                        <td className="px-3 py-3.5">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700">
                            {status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ==================================================== */
/* HELPER COMPONENTS */
/* ==================================================== */

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-xs font-semibold transition ${
        active
          ? "bg-[#F97316] text-white shadow-lg shadow-orange-500/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? "bg-white text-[#F97316]" : "bg-orange-500/20 text-[#F97316]"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md ${color}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        <div className="rounded-xl bg-orange-50 p-2 text-[#F97316]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function NotificationItem({
  title,
  desc,
  time,
}: {
  title: string;
  desc: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl p-2 transition hover:bg-slate-50">
      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#F97316]" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-[#0F172A]">{title}</p>
        <p className="text-[11px] text-slate-500">{desc}</p>
        <span className="text-[10px] text-slate-400">{time}</span>
      </div>
    </div>
  );
}