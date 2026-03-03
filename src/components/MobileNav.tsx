"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/pete", label: "Pete Page", icon: "📈" },
  { href: "/agents", label: "Agents Docs", icon: "🤖" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-lg md:hidden"
      >
        <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-background ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col h-full pt-16 px-4">
          <h1 className="text-xl font-bold text-primary mb-6 px-2">
            Mission Control
          </h1>
          <nav className="flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
                  pathname === item.href
                    ? "bg-primary/20 text-primary"
                    : "text-text-secondary hover:bg-card-hover"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5">
            <p className="text-xs text-text-secondary">
              MVP: <span className="text-primary">Pete + Agents Docs</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
