"use client";

import { create } from "zustand";

import {
  User,
  login as loginApi,
  logout as logoutApi,
} from "@/lib/auth";

import type { UserRole } from "@/types/auth";

const USER_STORAGE_KEY = "codorium_user";

function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  selectedRole: UserRole | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setSelectedRole: (role: UserRole) => void;
  clearAuth: () => void;

  login: (
    email: string,
    password: string
  ) => Promise<User>;

  logout: () => Promise<void>;

  initialize: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: getStoredUser(),
    accessToken: getStoredToken(),
    selectedRole: null,
    loading: false,

    setUser: (user) => {
      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
          );
        } else {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }

      set({ user });
    },

    setSelectedRole: (selectedRole) =>
      set({
        selectedRole,
      }),

    clearAuth: () =>
      set(() => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem("accessToken");
        }

        return {
          user: null,
          accessToken: null,
          selectedRole: null,
          loading: false,
        };
      }),

    login: async (
      email,
      password
    ) => {
      set({
        loading: true,
      });

      try {
        const response =
          await loginApi({
            email,
            password,
          });

        const user =
          response.data.user;

        const token =
          response.data.accessToken;

        set({
          user,
          accessToken: token,
          loading: false,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
          );
        }

        return user;
      } catch (error) {
        set({
          loading: false,
        });

        throw error;
      }
    },

    logout: async () => {
      set({
        loading: true,
      });

      try {
        await logoutApi();
      } finally {
        if (typeof window !== "undefined") {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem("accessToken");
        }

        set({
          user: null,
          accessToken: null,
          selectedRole: null,
          loading: false,
        });
      }
    },

    initialize: () => {
      if (
        typeof window === "undefined"
      ) {
        return;
      }

      const token =
        localStorage.getItem(
          "accessToken"
        );

      const user = getStoredUser();

      set({
        accessToken: token,
        user,
      });
    },
  }));