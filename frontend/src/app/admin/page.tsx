"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/Admin");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0F172A] text-white text-sm">
      Redirecting to Admin Dashboard...
    </main>
  );
}
