"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  title?: string;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export default function Topbar({
  title,
  onMobileMenuToggle,
  mobileMenuOpen,
}: TopbarProps) {
  const router = useRouter();
  const { user, logout, selectedRole } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const displayRole = selectedRole || user?.roles?.[0] || "USER";

  const roleLabel: Record<string, string> = {
    ADMIN: "Administrator",
    STUDENT: "Student",
    PROBLEM_SETTER: "Problem Setter",
    FACULTY: "Faculty",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

        {title && (
          <h1 className="text-lg font-bold text-[#0F172A]">
            {title}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        <Badge variant="orange" className="hidden sm:inline-flex">
          {roleLabel[displayRole] || displayRole}
        </Badge>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
            {user?.firstName?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#0F172A]">
              {user?.firstName} {user?.lastName || ""}
            </p>
            <p className="text-xs text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
