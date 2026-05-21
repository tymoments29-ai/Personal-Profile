"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function AdminTopbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Basic title formatting from pathname
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/50 px-8 backdrop-blur-xl z-10 sticky top-0">
      <h1 className="text-xl font-semibold text-foreground tracking-tight">{displayTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3 border-l border-border pl-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
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
  );
}
