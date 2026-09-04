"use client";

import { useState, useSyncExternalStore } from "react";

import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Code2,
  FileText,
  LayoutDashboard,
  LogOut,
  Medal,
  Moon,
  KeyRound,
  Settings,
  ShieldCheck,
  Trophy,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/auth";

type DashboardRole = Exclude<UserRole, "ADMIN">;

type RoleDashboardProps = {
  role: DashboardRole;
};

const roleContent: Record<DashboardRole, {
  label: string;
  eyebrow: string;
  description: string;
  accent: string;
  nav: string[];
  stats: Array<{ label: string; value: string; change: string; icon: typeof Trophy }>;
}> = {
  STUDENT: {
    label: "Student",
    eyebrow: "Your learning cockpit",
    description: "Keep your practice streak alive and turn today's small wins into a stronger rating.",
    accent: "from-violet-600 to-indigo-600",
    nav: ["Dashboard", "Problems", "Contests", "Leaderboard", "My Progress", "Submissions", "Profile"],
    stats: [
      { label: "Problems solved", value: "186", change: "+12 this month", icon: Code2 },
      { label: "Current rating", value: "1,642", change: "+84 this season", icon: Trophy },
      { label: "Contest rank", value: "#12", change: "Top 12% overall", icon: Medal },
      { label: "Day streak", value: "14 days", change: "Best: 21 days", icon: Activity },
    ],
  },
  PROBLEM_SETTER: {
    label: "Problem Setter",
    eyebrow: "Build better challenges",
    description: "Shape the question bank, validate test cases and publish contests your department remembers.",
    accent: "from-orange-500 to-rose-500",
    nav: ["Dashboard", "My Problems", "Create Problem", "Test Cases", "Contests", "Submissions", "Profile"],
    stats: [
      { label: "My problems", value: "32", change: "+4 this month", icon: FileText },
      { label: "Published", value: "24", change: "75% publish rate", icon: Award },
      { label: "Drafts", value: "8", change: "3 need review", icon: Wrench },
      { label: "Contests", value: "5", change: "2 upcoming", icon: Trophy },
    ],
  },
  FACULTY: {
    label: "Faculty",
    eyebrow: "See the department clearly",
    description: "Monitor participation, spot learning gaps and keep academic coding activity moving.",
    accent: "from-emerald-500 to-teal-600",
    nav: ["Dashboard", "Students", "Performance", "Contests", "Problems", "Announcements", "Profile"],
    stats: [
      { label: "Active students", value: "436", change: "+18 this week", icon: Users },
      { label: "Avg. rating", value: "1,284", change: "+6.2% this term", icon: BarChart3 },
      { label: "Participation", value: "78%", change: "+9% this month", icon: Trophy },
      { label: "Problems solved", value: "12.4k", change: "+642 this week", icon: BrainCircuit },
    ],
  },
};

const recentProblems = [
  ["Two Sum", "Easy", "Arrays · Hashing", "Solved"],
  ["Binary Tree Paths", "Medium", "Trees · DFS", "In progress"],
  ["Graph Traversal", "Hard", "Graphs · BFS", "Not started"],
];

const recentActivity = [
  ["Solved Valid Parentheses", "2 hours ago", "bg-emerald-100 text-emerald-600"],
  ["Participated in CodeSprint #6", "Yesterday", "bg-amber-100 text-amber-600"],
  ["Submitted Number of Islands", "2 days ago", "bg-indigo-100 text-indigo-600"],
  ["Created a new note: Graphs", "3 days ago", "bg-violet-100 text-violet-600"],
];

export default function RoleDashboard({ role }: RoleDashboardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );
  const content = roleContent[role];

  async function handleLogout() {
    await logout();
    window.location.replace("/login");
  }

  function switchRole() {
    window.location.replace("/continue-as");
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {!mounted ? (
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          Loading workspace...
        </div>
      ) : (
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 flex-col bg-[#10152a] text-white lg:flex">
          <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 font-black">C</div>
            <div>
              <p className="text-lg font-bold tracking-tight">CodoRium</p>
              <p className="text-[11px] text-slate-400">Code. Compete. Grow.</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-5">
            {content.nav.map((item, index) => (
              <button key={item} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${index === 0 ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-white/10 hover:text-white"}`}>
                {index === 0 ? <LayoutDashboard className="h-4 w-4" /> : index === 1 ? <BookOpen className="h-4 w-4" /> : index === 2 ? <Trophy className="h-4 w-4" /> : index === 3 ? <BarChart3 className="h-4 w-4" /> : index === 4 ? <Activity className="h-4 w-4" /> : index === 5 ? <FileText className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {item}
              </button>
            ))}
          </nav>
          <div className="relative border-t border-white/10 p-4">
            {profileOpen && (
              <div className="absolute bottom-20 left-4 right-4 z-20 overflow-hidden rounded-2xl border border-white/15 bg-[#202438]/95 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 font-semibold">{user?.firstName?.[0] || "U"}</div>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "CodoRium user"}</p><p className="truncate text-xs text-slate-400">{user?.email}</p></div>
                  </div>
                  <button onClick={() => setProfileOpen(false)} aria-label="Close profile menu" className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-2">
                  <button className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10"><span className="flex items-center gap-3"><Moon className="h-4 w-4 text-slate-400" /> Theme</span><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                  <button onClick={() => window.location.assign("/change-password")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10"><KeyRound className="h-4 w-4 text-slate-400" /> Change password</button>
                  <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 hover:bg-rose-500/10"><LogOut className="h-4 w-4" /> Log out</button>
                </div>
              </div>
            )}
            <button onClick={() => setProfileOpen((open) => !open)} className="mb-3 flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-semibold">{user?.firstName?.[0] || "U"}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user?.firstName || "CodoRium user"}</p>
                <p className="text-xs text-slate-400">{content.label}</p>
              </div>
            </button>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">{content.eyebrow}</p>
              <h1 className="mt-1 text-xl font-bold sm:text-2xl">Welcome back, {user?.firstName || "there"}.</h1>
            </div>
            <div className="flex items-center gap-2">
              {user?.roles && user.roles.length > 1 && <button onClick={switchRole} className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 sm:block">Switch role</button>}
              <button onClick={() => router.push("/change-password")} title="Settings" className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:text-indigo-600"><Settings className="h-4 w-4" /></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{user?.firstName?.[0] || "U"}</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 p-5 lg:p-8">
            <div className={`rounded-2xl bg-gradient-to-r ${content.accent} p-6 text-white shadow-lg shadow-indigo-900/10 lg:p-8`}>
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold"><ShieldCheck className="h-3.5 w-3.5" /> {content.label} workspace</div>
                  <h2 className="text-2xl font-bold sm:text-3xl">Build momentum, one session at a time.</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">{content.description}</p>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"><CalendarDays className="h-4 w-4" /> View schedule</button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {content.stats.map(({ label, value, change, icon: Icon }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between"><div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Icon className="h-5 w-5" /></div><span className="text-xs font-semibold text-emerald-600">{change}</span></div>
                  <p className="mt-5 text-2xl font-bold tracking-tight">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between"><div><h3 className="font-bold">{role === "STUDENT" ? "Continue learning" : role === "PROBLEM_SETTER" ? "Recent problems" : "Student performance"}</h3><p className="mt-1 text-sm text-slate-500">{role === "FACULTY" ? "A quick view of the latest department activity." : "Pick up where you left off."}</p></div><button className="text-sm font-semibold text-indigo-600">View all</button></div>
                <div className="mt-5 divide-y divide-slate-100">
                  {recentProblems.map(([name, difficulty, tags, status]) => <div key={name} className="flex items-center justify-between gap-4 py-4"><div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-slate-100 p-2.5 text-slate-600"><Code2 className="h-4 w-4" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{name}</p><p className="mt-1 truncate text-xs text-slate-500">{tags}</p></div></div><div className="flex items-center gap-3"><span className={`hidden rounded-full px-2.5 py-1 text-xs font-semibold sm:inline-flex ${difficulty === "Easy" ? "bg-emerald-50 text-emerald-700" : difficulty === "Medium" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>{difficulty}</span><span className="text-xs text-slate-400">{status}</span><ChevronRight className="h-4 w-4 text-slate-300" /></div></div>)}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="font-bold">Upcoming contest</h3><p className="mt-1 text-sm text-slate-500">CodeSprint weekly #12</p></div><Trophy className="h-5 w-5 text-amber-500" /></div><div className="mt-6 rounded-xl bg-slate-950 p-5 text-white"><p className="text-xs uppercase tracking-widest text-slate-400">Starts in</p><p className="mt-2 text-3xl font-bold">02:34:18</p><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>8 problems</span><span>2 hours</span></div></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">View contest <ChevronRight className="h-4 w-4" /></button></section>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold">Recent activity</h3><div className="mt-4 space-y-4">{recentActivity.map(([title, time, color]) => <div key={title} className="flex gap-3"><div className={`mt-0.5 rounded-full p-2 ${color}`}><Activity className="h-3.5 w-3.5" /></div><div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-slate-400">{time}</p></div></div>)}</div></section>
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h3 className="font-bold">Coding profile</h3><button className="text-sm font-semibold text-indigo-600">Edit</button></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["LeetCode", "1,720", "350 solved"], ["GeeksforGeeks", "Gold", "280 solved"], ["CodeChef", "1,540", "420 solved"], ["AtCoder", "1,286", "120 solved"]].map(([platform, rating, solved]) => <div key={platform} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-sm font-bold">{platform}</p><p className="mt-3 text-xl font-bold text-indigo-600">{rating}</p><p className="mt-1 text-xs text-slate-500">{solved}</p></div>)}</div></section>
            </div>
          </div>
        </section>
      </div>
      )}
    </main>
  );
}
