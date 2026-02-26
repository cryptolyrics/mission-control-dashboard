"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
      }}
      className="text-xs px-2 py-1 rounded bg-card hover:bg-card-hover border border-white/10"
    >
      Logout
    </button>
  );
}
