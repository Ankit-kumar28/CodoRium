"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import RoleDashboard from "@/components/dashboard/role-dashboard";
import AdminPage from "./Admin/page";

export default function DashboardRootPage() {
  const router = useRouter();
  const { user, selectedRole, isAuthenticated, initialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeRole = selectedRole || user?.roles?.[0] || "STUDENT";

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0F172A] text-white text-sm">
        Loading dashboard...
      </main>
    );
  }

  if (activeRole === "ADMIN") {
    return <AdminPage />;
  }

  if (activeRole === "FACULTY") {
    return <RoleDashboard role="FACULTY" />;
  }

  if (activeRole === "PROBLEM_SETTER") {
    return <RoleDashboard role="PROBLEM_SETTER" />;
  }

  return <RoleDashboard role="STUDENT" />;
}
