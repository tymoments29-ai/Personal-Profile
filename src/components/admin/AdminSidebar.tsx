"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  GraduationCap,
  MessageSquare,
  MessageCircle,
  Settings,
  LogOut,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-background/80 dark:bg-black/50 backdrop-blur-xl">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/admin/dashboard" className="text-xl font-bold tracking-tighter text-foreground">
          AdminPanel<span className="text-primary">.</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
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

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
