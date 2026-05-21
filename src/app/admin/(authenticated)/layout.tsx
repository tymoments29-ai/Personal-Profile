import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Make sure to use your auth configuration path
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // If there's no session, we assume middleware handles redirect to login.
  // Uncomment the line below if you want this layout to forcefully redirect to login.
  // if (!session) redirect("/admin/login");

  return (
    <SessionProvider session={session}>
      <div className="flex h-screen overflow-hidden bg-background text-foreground">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-8 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-background to-background dark:from-zinc-900 dark:via-[#09090b] dark:to-[#09090b] -z-10" />
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
