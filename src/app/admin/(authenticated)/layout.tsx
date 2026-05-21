import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <AdminShell>
        {children}
      </AdminShell>
    </SessionProvider>
  );
}
