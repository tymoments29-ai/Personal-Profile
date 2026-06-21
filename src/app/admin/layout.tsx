import { ReactNode } from "react";
import { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  manifest: "/admin.manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Admin",
  },
};

export default function RootAdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
