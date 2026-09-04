"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Code2,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  useAuthStore,
} from "@/store/auth.store";

import type {
  UserRole,
} from "@/types/auth";

const roleConfig: Record<UserRole, {
  title: string;
  description: string;
  icon: typeof GraduationCap;
  path: string;
}> = {
  STUDENT: {
    title: "Student",
    description:
      "Practice problems, participate in contests and track your progress.",
    icon: GraduationCap,
    path: "/dashboard",
  },

  PROBLEM_SETTER: {
    title: "Problem Setter",
    description:
      "Create coding problems, test cases and contribute to the question bank.",
    icon: Code2,
    path: "/dashboard/Problem%20Setter",
  },

  FACULTY: {
    title: "Faculty",
    description:
      "Manage assessments, students and departmental coding activities.",
    icon: Users,
    path: "/dashboard/Faculty",
  },

  ADMIN: {
    title: "Administrator",
    description:
      "Manage CodoRium users, credentials and platform configuration.",
    icon: ShieldCheck,
    path: "/dashboard/Admin",
  },
};

export default function ContinueAsPage() {
  const router =
    useRouter();

  const user =
    useAuthStore(
      (state) => state.user
    );

  const setSelectedRole =
    useAuthStore(
      (state) =>
        state.setSelectedRole
    );

  useEffect(() => {
    if (!user) {
      router.replace(
        "/login"
      );
    }
  }, [
    user,
    router,
  ]);

  if (!user) {
    return null;
  }

  const selectRole = (
    role: UserRole
  ) => {
    setSelectedRole(role);

    const path =
      roleConfig[role].path;

    router.push(path);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-16">

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">

          <h1 className="text-3xl font-bold text-[#0F172A]">
            Continue as
          </h1>

          <p className="text-slate-500 mt-2">
            Your account has multiple roles.
            Choose how you want to continue.
          </p>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          {user.roles.map(
            (role) => {
              const config =
                roleConfig[
                  role
                ];

              const Icon =
                config.icon;

              return (
                <button
                  key={role}
                  onClick={() =>
                    selectRole(
                      role
                    )
                  }
                  className="group text-left rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#F97316] hover:shadow-lg"
                >

                  <div className="flex items-start gap-4">

                    <div className="rounded-xl bg-[#0F172A] p-3 text-white group-hover:bg-[#F97316]">

                      <Icon
                        size={24}
                      />

                    </div>

                    <div>

                      <h2 className="text-lg font-semibold text-[#0F172A]">
                        {config.title}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {
                          config.description
                        }
                      </p>

                    </div>

                  </div>

                </button>
              );
            }
          )}

        </div>

      </div>

    </main>
  );
}