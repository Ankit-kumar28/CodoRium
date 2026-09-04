"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  KeyRound,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code2,
  Trophy,
  FileText,
  BarChart3,
  Megaphone,
  Shield,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import type { UserRole } from "@/types/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: UserRole[];
  badge?: string;
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Problems",
    href: "/problems",
    icon: Code2,
    badge: "Soon",
  },
  {
    label: "Contests",
    href: "/contests",
    icon: Trophy,
    badge: "Soon",
  },
  {
    label: "Submissions",
    href: "/submissions",
    icon: FileText,
    badge: "Soon",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: BarChart3,
    badge: "Soon",
  },
  {
    label: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    badge: "Soon",
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["ADMIN"],
  },
  {
    label: "Generate Credentials",
    href: "/admin/credentials",
    icon: KeyRound,
    roles: ["ADMIN"],
  },
  {
    label: "Manage Users",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
    badge: "Soon",
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, hasRole } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const filteredAdminItems = adminNavItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => hasRole(role));
  });

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.badge === "Soon" ? "#" : item.href}
        onClick={(e) => {
          if (item.badge === "Soon") e.preventDefault();
        }}
        className={`
          group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200
          ${active
            ? "bg-[#F97316] text-white shadow-md shadow-orange-500/20"
            : item.badge === "Soon"
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]"
          }
          ${collapsed ? "justify-center px-2" : ""}
        `}
        title={collapsed ? item.label : undefined}
      >
        <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : ""}`} />

        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-[280px]"}
      `}
    >
      {/* Brand */}
      <div className={`flex items-center border-b border-slate-100 px-4 h-16 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0F172A] text-sm font-bold text-white shadow-lg">
          C
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#0F172A] tracking-tight">
              CodoRium
            </h1>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Coding Platform
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Main */}
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
        )}
        {mainNavItems.map(renderNavItem)}

        {/* Admin section */}
        {filteredAdminItems.length > 0 && (
          <>
            <div className="my-3 border-t border-slate-100" />
            {!collapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Administration
              </p>
            )}
            {filteredAdminItems.map(renderNavItem)}
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-100 px-3 py-3 space-y-1">
        {bottomNavItems.map(renderNavItem)}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`
            group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600
            ${collapsed ? "justify-center px-2" : ""}
          `}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* User info */}
        {!collapsed && user && (
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              {user.firstName?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#0F172A]">
                {user.firstName} {user.lastName || ""}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-slate-50 hover:text-slate-600"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}
