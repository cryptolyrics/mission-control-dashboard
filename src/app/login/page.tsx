"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/private");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next) setNextPath(next);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push(nextPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-card border border-white/10 rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">Private Mission Control</h1>
        <p className="text-sm text-text-secondary">Server-authenticated access</p>

        <div>
          <label className="text-xs text-text-secondary">Username</label>
          <input value={user} onChange={(e) => setUser(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-white/10 outline-none" />
        </div>
        <div>
          <label className="text-xs text-text-secondary">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-white/10 outline-none" />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-primary text-background font-medium disabled:opacity-50">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
