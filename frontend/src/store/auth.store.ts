"use client";

import { create } from "zustand";

import {
  login as loginApi,
  logout as logoutApi,
  getMe,
} from "@/lib/auth";

import type { User, UserRole } from "@/types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  selectedRole: UserRole | null;
  loading: boolean;
  initialized: boolean;

  /* Computed helpers */
  isAuthenticated: boolean;

  /* Actions */
  setUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole) => void;

  login: (
    email: string,
    password: string
  ) => Promise<{
    user: User;
    requiresRoleSelection: boolean;
  }>;

  logout: () => Promise<void>;

  fetchUser: () => Promise<User | null>;

  initialize: () => Promise<void>;

  /* Role helpers */
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  selectedRole: null,
  loading: false,
  initialized: false,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setSelectedRole: (role) =>
    set({ selectedRole: role }),

  login: async (email, password) => {
    set({ loading: true });

    try {
      const response = await loginApi({
        email,
        password,
      });

      const user = response.data.user;
      const token = response.data.accessToken;
      const requiresRoleSelection =
        response.data.requiresRoleSelection;

      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        loading: false,
      });

      return { user, requiresRoleSelection };
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });

    try {
      await logoutApi();
    } finally {
      set({
        user: null,
        accessToken: null,
        selectedRole: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  fetchUser: async () => {
    try {
      const user = await getMe();

      set({
        user,
        isAuthenticated: true,
      });

      return user;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        accessToken: null,
      });

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }

      return null;
    }
  },

  initialize: async () => {
    if (get().initialized) return;

    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");

    if (!token) {
      set({ initialized: true });
      return;
    }

    set({ accessToken: token, loading: true });

    try {
      const user = await getMe();

      set({
        user,
        isAuthenticated: true,
        initialized: true,
        loading: false,
      });
    } catch {
      localStorage.removeItem("accessToken");

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        initialized: true,
        loading: false,
      });
    }
  },

  hasRole: (role: UserRole) => {
    const user = get().user;
    return user?.roles?.includes(role) ?? false;
  },
}));