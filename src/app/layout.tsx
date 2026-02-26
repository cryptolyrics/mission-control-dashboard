import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Mission Control | Elevate Studios",
  description: "Agent management dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Mobile navigation */}
        <div className="md:hidden">
          <MobileNav />
        </div>
        <main className="flex-1 md:ml-60 p-4 md:p-6">{children}</main>
        <CommandPalette />
      </body>
    </html>
  );
}
