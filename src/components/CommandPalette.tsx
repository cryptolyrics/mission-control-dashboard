"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Command = { label: string; hint?: string; action: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const commands = useMemo<Command[]>(
    () => [
      { label: "Go to Pete Page", hint: "⌘1", action: () => router.push("/pete") },
      { label: "Go to Agents Docs", hint: "⌘2", action: () => router.push("/agents") },
      { label: "Close palette", hint: "Esc", action: () => setOpen(false) },
    ],
    [router]
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4" onClick={() => setOpen(false)}>
      <div
        className="mx-auto mt-24 w-full max-w-xl rounded-xl border border-white/10 bg-card p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command..."
          className="w-full bg-background rounded-lg px-3 py-2 text-sm outline-none border border-white/10"
        />
        <div className="mt-2 max-h-72 overflow-auto space-y-1">
          {filtered.map((c) => (
            <button
              key={c.label}
              onClick={() => {
                c.action();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-card-hover text-sm flex items-center justify-between"
            >
              <span>{c.label}</span>
              <span className="text-xs text-text-secondary">{c.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
