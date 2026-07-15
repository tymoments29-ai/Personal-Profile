import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/AdminShell";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  let settings = null;
  try {
    settings = await prisma.siteSettings.findFirst();
  } catch (error) {
    console.error("Failed to fetch settings for admin layout:", error);
  }

  return (
    <SessionProvider session={session}>
      <AdminShell 
        profileName={settings?.nameEn || undefined} 
        profilePhoto={settings?.profilePhotoUrl || null}
      >
        {children}
      </AdminShell>
    </SessionProvider>
  );
}
