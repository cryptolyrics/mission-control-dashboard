"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Public", icon: "🌐" },
  { href: "/private", label: "Private", icon: "🔒" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/tasks", label: "Tasks", icon: "📋" },
  { href: "/coach", label: "Coach", icon: "⏰" },
  { href: "/analytics", label: "Analytics", icon: "📊" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-background border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold text-primary">Mission Control</h1>
        <p className="text-xs text-text-secondary mt-1">Elevate Studios</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-card text-primary"
                      : "text-text-secondary hover:bg-card-hover hover:text-text-primary"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="text-xs text-text-secondary space-y-1">
          <p>Active Agents: <span className="text-success">6</span></p>
          <p>Running Tasks: <span className="text-warning">12</span></p>
          <p className="pt-2 border-t border-white/5 mt-2">⌘K Command Palette</p>
        </div>
      </div>
    </aside>
  );
}
