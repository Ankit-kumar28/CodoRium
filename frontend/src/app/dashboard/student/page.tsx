"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BrainCircuit,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Crown,
  ExternalLink,
  FileCode2,
  FileText,
  Filter,
  Flame,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Medal,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

type StudentTab =
  | "dashboard"
  | "problems"
  | "contests"
  | "leaderboard"
  | "progress"
  | "submissions"
  | "profile";

export default function StudentDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState<StudentTab>("dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  /* Filter states */
  const [problemSearch, setProblemSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");

  async function handleLogout() {
    await storeLogout();
    window.location.replace("/login");
  }

  function switchRole() {
    window.location.replace("/continue-as");
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
            <p className="text-[11px] font-medium text-orange-400 uppercase tracking-wider">
              Student Cockpit
            </p>
          </div>
        </div>

        {/* Navigation Items (Exact requested sidebar items) */}
        <nav className="flex-1 space-y-1.5 px-3 py-6">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={Code2}
            label="Problems"
            active={activeTab === "problems"}
            onClick={() => setActiveTab("problems")}
            badge="180+"
          />
          <NavItem
            icon={Trophy}
            label="Contests"
            active={activeTab === "contests"}
            onClick={() => setActiveTab("contests")}
            badge="Live"
          />
          <NavItem
            icon={Medal}
            label="Leaderboard"
            active={activeTab === "leaderboard"}
            onClick={() => setActiveTab("leaderboard")}
          />
          <NavItem
            icon={BarChart3}
            label="My Progress"
            active={activeTab === "progress"}
            onClick={() => setActiveTab("progress")}
          />
          <NavItem
            icon={FileCode2}
            label="Submissions"
            active={activeTab === "submissions"}
            onClick={() => setActiveTab("submissions")}
          />
          <NavItem
            icon={User}
            label="Profile"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </nav>

        {/* Sidebar Footer — User & Logout Button */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-800/60 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F97316] font-bold text-white text-sm">
              {user?.firstName?.[0] || "S"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {`${user?.firstName || "Student"} ${user?.lastName || ""}`.trim()}
              </p>
              <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
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
        {/* Top Header / Topbar (WITHOUT Settings Icon as requested) */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
          {/* Title & Greeting */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-[#F97316] text-white font-bold text-sm">
              C
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {activeTab === "dashboard" && "Learning Cockpit"}
                {activeTab === "problems" && "Practice Problem Bank"}
                {activeTab === "contests" && "Departmental Contests"}
                {activeTab === "leaderboard" && "College Leaderboard"}
                {activeTab === "progress" && "Performance Analytics"}
                {activeTab === "submissions" && "Recent Code Submissions"}
                {activeTab === "profile" && "Student Profile"}
              </h2>
              <p className="text-xs text-slate-400 hidden sm:block">
                Welcome back, {user?.firstName || "Student"} · Turn small practice wins into a high rating
              </p>
            </div>
          </div>

          {/* Right Top Header Actions — Notification Bell & Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Role switch button if multi-role */}
            {user?.roles && user.roles.length > 1 && (
              <button
                onClick={switchRole}
                className="hidden sm:block rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#F97316] hover:text-[#F97316] transition"
              >
                Switch Role
              </button>
            )}

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

              {/* Notifications Popup */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-slide-down">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-[#0F172A]">Notifications</h4>
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#F97316]">
                      2 Unread
                    </span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <NotificationItem
                      title="CodeSprint Weekly #12 Announced"
                      desc="Registration starts today at 6 PM."
                      time="15m ago"
                    />
                    <NotificationItem
                      title="Problem Solved!"
                      desc="You passed all 42 test cases on Binary Tree Paths."
                      time="2h ago"
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
                  {user?.firstName?.[0] || "S"}
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#0F172A]">
                  {user?.firstName || "Student"}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-slide-down">
                  <div className="border-b border-slate-100 p-3">
                    <p className="text-xs font-bold text-[#0F172A]">
                      {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
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

        {/* Dashboard Content */}
        <main className="flex-1 space-y-6 p-6">
          {/* ==================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ==================================================== */}
          {activeTab === "dashboard" && (
            <>
              {/* Hero Banner */}
              <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-white shadow-xl shadow-slate-900/10 lg:p-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#F97316]/10 blur-3xl" />
                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <div className="max-w-xl">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 px-3 py-1 text-xs font-semibold text-orange-300">
                      <Flame className="h-3.5 w-3.5 text-[#F97316]" /> 14-Day Practice Streak Active!
                    </div>
                    <h2 className="text-2xl font-bold sm:text-3xl">
                      Welcome back, {user?.firstName || "Coder"}!
                    </h2>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      Keep your practice momentum high. Complete today&apos;s daily challenge or join the upcoming weekly contest to boost your global rank.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("problems")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F97316] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C]"
                  >
                    <Code2 className="h-4 w-4" /> Start Practicing
                  </button>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Problems Solved"
                  value="186"
                  subtitle="+12 solved this month"
                  icon={Code2}
                  color="border-l-4 border-l-[#F97316]"
                />
                <StatCard
                  title="Current Rating"
                  value="1,642"
                  subtitle="+84 rating this season"
                  icon={Trophy}
                  color="border-l-4 border-l-amber-500"
                />
                <StatCard
                  title="Contest Rank"
                  value="#12"
                  subtitle="Top 12% in Department"
                  icon={Medal}
                  color="border-l-4 border-l-emerald-500"
                />
                <StatCard
                  title="Streak Record"
                  value="14 Days"
                  subtitle="Personal Best: 21 Days"
                  icon={Activity}
                  color="border-l-4 border-l-purple-500"
                />
              </div>

              {/* Main 2-Column Section */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Left 2-Cols: Recent Problems */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">Recommended Problems</h3>
                      <p className="text-xs text-slate-500">Pick up where you left off today.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("problems")}
                      className="text-xs font-bold text-[#F97316] hover:underline"
                    >
                      View All Problems →
                    </button>
                  </div>

                  <div className="mt-4 divide-y divide-slate-100">
                    <ProblemRow
                      title="Two Sum"
                      tags="Arrays · Hash Map"
                      difficulty="Easy"
                      status="Solved"
                    />
                    <ProblemRow
                      title="Binary Tree Longest Path"
                      tags="Trees · DFS Traversal"
                      difficulty="Medium"
                      status="In Progress"
                    />
                    <ProblemRow
                      title="Shortest Path in Weighted Graph"
                      tags="Graphs · Dijkstra"
                      difficulty="Hard"
                      status="Not Started"
                    />
                    <ProblemRow
                      title="Maximum Subarray Sum"
                      tags="Dynamic Programming · Arrays"
                      difficulty="Medium"
                      status="Solved"
                    />
                  </div>
                </div>

                {/* Right Column: Upcoming Contest Box */}
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0F172A]">Next Contest</h3>
                      <Trophy className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">CodeSprint Departmental Weekly #12</p>

                    <div className="mt-5 rounded-2xl bg-[#0F172A] p-5 text-white shadow-xl">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                        Starts In
                      </p>
                      <p className="mt-1 text-3xl font-extrabold text-[#F97316] tracking-wider">
                        02:34:18
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>8 Problems</span>
                        <span>2 Hours</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab("contests")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] py-2.5 text-xs font-bold text-white hover:bg-[#EA580C] transition shadow-lg shadow-orange-500/20"
                    >
                      Register & Join Contest <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Connected Profiles Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0F172A]">External Platforms</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <PlatformBadge name="LeetCode" rating="1,850" status="Active" />
                      <PlatformBadge name="Codeforces" rating="1,620" status="Active" />
                      <PlatformBadge name="CodeChef" rating="1,740" status="Active" />
                      <PlatformBadge name="GFG" rating="1,450" status="Active" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PROBLEMS TAB */}
          {/* ==================================================== */}
          {activeTab === "problems" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Practice Problems Bank</h3>
                    <p className="text-xs text-slate-500">Filter by difficulty or search topics.</p>
                  </div>

                  {/* Difficulty Filters & Search */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search problems..."
                        value={problemSearch}
                        onChange={(e) => setProblemSearch(e.target.value)}
                        className="h-10 w-48 sm:w-60 rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-[#F97316]"
                      />
                    </div>

                    <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                      {["ALL", "Easy", "Medium", "Hard"].map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`rounded-lg px-3 py-1.5 transition ${
                            selectedDifficulty === diff
                              ? "bg-[#F97316] text-white shadow-sm"
                              : "text-slate-600 hover:text-[#0F172A]"
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Problem List Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-xs">
                    <thead className="border-y border-slate-100 bg-slate-50 uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Title</th>
                        <th className="px-4 py-3 font-semibold">Category</th>
                        <th className="px-4 py-3 font-semibold">Difficulty</th>
                        <th className="px-4 py-3 font-semibold">Acceptance</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { title: "Two Sum", tags: "Arrays, Hash Table", difficulty: "Easy", rate: "49.2%", status: "Solved" },
                        { title: "Longest Substring Without Repeating", tags: "Sliding Window, Strings", difficulty: "Medium", rate: "33.8%", status: "Solved" },
                        { title: "Binary Tree Maximum Path Sum", tags: "Trees, DFS", difficulty: "Hard", rate: "37.5%", status: "In Progress" },
                        { title: "Container With Most Water", tags: "Two Pointers, Greedy", difficulty: "Medium", rate: "54.1%", status: "Solved" },
                        { title: "Trapping Rain Water", tags: "Two Pointers, Stack", difficulty: "Hard", rate: "59.4%", status: "Not Started" },
                        { title: "Valid Parentheses", tags: "Stack, Strings", difficulty: "Easy", rate: "40.3%", status: "Solved" },
                        { title: "Climbing Stairs", tags: "Dynamic Programming", difficulty: "Easy", rate: "52.0%", status: "Solved" },
                      ]
                        .filter(
                          (p) =>
                            (selectedDifficulty === "ALL" || p.difficulty === selectedDifficulty) &&
                            (p.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
                              p.tags.toLowerCase().includes(problemSearch.toLowerCase()))
                        )
                        .map((prob, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition">
                            <td className="px-4 py-3.5 font-bold text-[#0F172A]">{prob.title}</td>
                            <td className="px-4 py-3.5 text-slate-500">{prob.tags}</td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 font-semibold text-[10px] ${
                                  prob.difficulty === "Easy"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : prob.difficulty === "Medium"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {prob.difficulty}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-slate-500">{prob.rate}</td>
                            <td className="px-4 py-3.5 font-semibold">
                              {prob.status === "Solved" ? (
                                <span className="text-emerald-600 flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> Solved
                                </span>
                              ) : prob.status === "In Progress" ? (
                                <span className="text-amber-600">In Progress</span>
                              ) : (
                                <span className="text-slate-400">Todo</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button className="rounded-lg bg-[#0F172A] px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-[#F97316] transition">
                                Solve Problem
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: CONTESTS TAB */}
          {/* ==================================================== */}
          {activeTab === "contests" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Active/Upcoming Contest */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-[#F97316]">
                    Upcoming
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#0F172A]">CodeSprint Weekly #12</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Departmental speed coding challenge. 8 algorithmic problems.
                  </p>
                  <div className="mt-5 space-y-2 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#F97316]" /> Duration: 2 Hours
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#F97316]" /> Registered: 142 Students
                    </p>
                  </div>
                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3 text-xs font-bold text-white hover:bg-[#EA580C] shadow-lg shadow-orange-500/20 transition">
                    Register for Contest
                  </button>
                </div>

                {/* Past Contest */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    Completed
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#0F172A]">CodeSprint Weekly #11</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Held on Aug 28. Your Rank: #12 / 160 participants (+84 rating).
                  </p>
                  <div className="mt-5 space-y-2 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-500" /> Solved: 6/8 Problems
                    </p>
                    <p className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" /> Performance: Rating 1,642
                    </p>
                  </div>
                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                    View Submissions & Scoreboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: LEADERBOARD TAB */}
          {/* ==================================================== */}
          {activeTab === "leaderboard" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#0F172A]">Department Leaderboard</h3>
                <p className="text-xs text-slate-500">
                  Global student rankings across external platforms (LeetCode, Codeforces, CodeChef, GFG).
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="border-y border-slate-100 bg-slate-50 uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Rank</th>
                      <th className="px-4 py-3 font-semibold">Student Name</th>
                      <th className="px-4 py-3 font-semibold">LeetCode</th>
                      <th className="px-4 py-3 font-semibold">Codeforces</th>
                      <th className="px-4 py-3 font-semibold">CodeChef</th>
                      <th className="px-4 py-3 font-semibold text-right">Total Solved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { rank: 1, name: "Ankit Kumar", dept: "3rd Year, CSE", lc: "520 (1850)", cf: "340 (1620)", cc: "290 (1740)", total: 1560 },
                      { rank: 2, name: "Priya Singh", dept: "3rd Year, CSE", lc: "480 (1790)", cf: "310 (1540)", cc: "320 (1680)", total: 1490 },
                      { rank: 3, name: "Rahul Verma", dept: "4th Year, IT", lc: "440 (1720)", cf: "280 (1490)", cc: "250 (1610)", total: 1320 },
                      { rank: 4, name: "Sneha Kapoor", dept: "2nd Year, CSE", lc: "390 (1650)", cf: "220 (1410)", cc: "210 (1520)", total: 1110 },
                    ].map((row) => (
                      <tr key={row.rank} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 font-bold text-[#F97316]">#{row.rank}</td>
                        <td className="px-4 py-3.5">
                          <p className="font-bold text-[#0F172A]">{row.name}</p>
                          <p className="text-[11px] text-slate-500">{row.dept}</p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">{row.lc}</td>
                        <td className="px-4 py-3.5 text-slate-700">{row.cf}</td>
                        <td className="px-4 py-3.5 text-slate-700">{row.cc}</td>
                        <td className="px-4 py-3.5 text-right font-extrabold text-[#F97316]">{row.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: MY PROGRESS TAB */}
          {/* ==================================================== */}
          {activeTab === "progress" && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#0F172A]">Topic Mastery</h3>
                  <div className="mt-4 space-y-3">
                    <TopicProgress title="Arrays & Hashing" percent={85} solved="65 solved" />
                    <TopicProgress title="Trees & Graphs" percent={60} solved="42 solved" />
                    <TopicProgress title="Dynamic Programming" percent={45} solved="30 solved" />
                    <TopicProgress title="Sliding Window" percent={75} solved="35 solved" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#0F172A]">Difficulty Breakdown</h3>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100">
                      <p className="text-2xl font-bold text-emerald-700">112</p>
                      <p className="text-xs text-emerald-600 font-medium mt-1">Easy Solved</p>
                    </div>
                    <div className="rounded-xl bg-amber-50 p-4 border border-amber-100">
                      <p className="text-2xl font-bold text-amber-700">58</p>
                      <p className="text-xs text-amber-600 font-medium mt-1">Medium Solved</p>
                    </div>
                    <div className="rounded-xl bg-rose-50 p-4 border border-rose-100">
                      <p className="text-2xl font-bold text-rose-700">16</p>
                      <p className="text-xs text-rose-600 font-medium mt-1">Hard Solved</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: SUBMISSIONS TAB */}
          {/* ==================================================== */}
          {activeTab === "submissions" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#0F172A] mb-4">My Recent Submissions</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="border-y border-slate-100 bg-slate-50 uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Problem</th>
                      <th className="px-4 py-3 font-semibold">Language</th>
                      <th className="px-4 py-3 font-semibold">Verdict</th>
                      <th className="px-4 py-3 font-semibold">Runtime</th>
                      <th className="px-4 py-3 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { problem: "Two Sum", lang: "C++ 20", verdict: "Accepted", runtime: "4 ms", time: "2 hours ago" },
                      { problem: "Binary Tree Paths", lang: "Python 3", verdict: "Accepted", runtime: "32 ms", time: "Yesterday" },
                      { problem: "Graph Traversal", lang: "C++ 20", verdict: "Time Limit Exceeded", runtime: "2000 ms", time: "2 days ago" },
                    ].map((sub, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5 font-bold text-[#0F172A]">{sub.problem}</td>
                        <td className="px-4 py-3.5 text-slate-600">{sub.lang}</td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`font-semibold ${
                              sub.verdict === "Accepted" ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {sub.verdict}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-500">{sub.runtime}</td>
                        <td className="px-4 py-3.5 text-right text-slate-400">{sub.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: PROFILE TAB */}
          {/* ==================================================== */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4">Student Profile Settings</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700">Full Name</label>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">{`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}</p>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Email Address</label>
                  <p className="mt-1 text-sm font-bold text-[#0F172A]">{user?.email}</p>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700">Assigned Roles</label>
                  <div className="mt-1 flex gap-2">
                    {user?.roles?.map((r) => (
                      <span key={r} className="rounded-full bg-orange-100 px-3 py-1 font-bold text-[#F97316]">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href="/change-password"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 font-semibold text-white hover:bg-[#EA580C] transition"
                  >
                    <KeyRound className="h-4 w-4" /> Change Password
                  </Link>
                </div>
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

function ProblemRow({
  title,
  tags,
  difficulty,
  status,
}: {
  title: string;
  tags: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          <Code2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#0F172A]">{title}</p>
          <p className="text-[11px] text-slate-500">{tags}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            difficulty === "Easy"
              ? "bg-emerald-50 text-emerald-700"
              : difficulty === "Medium"
              ? "bg-amber-50 text-amber-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {difficulty}
        </span>
        <span className="text-xs font-semibold text-slate-400">{status}</span>
      </div>
    </div>
  );
}

function PlatformBadge({
  name,
  rating,
  status,
}: {
  name: string;
  rating: string;
  status: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs font-bold text-[#0F172A]">{name}</p>
      <p className="mt-1 text-base font-extrabold text-[#F97316]">{rating}</p>
      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">{status}</p>
    </div>
  );
}

function TopicProgress({
  title,
  percent,
  solved,
}: {
  title: string;
  percent: number;
  solved: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-[#0F172A] mb-1">
        <span>{title}</span>
        <span className="text-slate-500">{solved} ({percent}%)</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-[#F97316] rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>
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