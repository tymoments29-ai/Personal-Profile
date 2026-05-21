"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Briefcase, GraduationCap,
  MessageSquare, MessageCircle, Settings, LogOut, Info,
  Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "About Details", href: "/admin/about", icon: Info },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { name: "Resume", href: "/admin/resume", icon: GraduationCap },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageCircle },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const title = pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Dashboard";
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-background/95 dark:bg-black/80 backdrop-blur-xl transition-transform duration-300 ease-in-out",
          // Desktop: always visible; Mobile: slide in/out
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-border flex-shrink-0">
          <Link
            href="/admin/dashboard"
            onClick={closeSidebar}
            className="text-xl font-bold tracking-tighter text-foreground"
          >
            AdminPanel<span className="text-primary">.</span>
          </Link>
          {/* Close button (mobile only) */}
          <button
            onClick={closeSidebar}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background/50 px-4 md:px-8 backdrop-blur-xl z-20 sticky top-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-foreground tracking-tight capitalize">
              {displayTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <div className="flex items-center space-x-2 md:space-x-3 border-l border-border pl-2 md:pl-4">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 flex-shrink-0">
                <span className="text-sm font-medium text-primary">
                  {session?.user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">
                {session?.user?.name || "Admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-background to-background dark:from-zinc-900 dark:via-[#09090b] dark:to-[#09090b] -z-10" />
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
