"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // Basic title formatting from pathname
  const title = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  const displayTitle = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/50 px-8 backdrop-blur-xl z-10 sticky top-0">
      <h1 className="text-xl font-semibold text-white tracking-tight">{displayTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3 border-l border-white/10 pl-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <span className="text-sm font-medium text-primary">
              {session?.user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <span className="text-sm font-medium text-zinc-300 hidden md:block">
            {session?.user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
