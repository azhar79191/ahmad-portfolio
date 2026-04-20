"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardHeader from "@/src/components/shared/dashboard-header";
import Sidebar from "@/src/components/shared/sidebar";
import { useRole } from "@/src/api/hooks/useRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isSuperAdmin } = useRole();

  useEffect(() => {
    if (role && pathname === "/admin/role-managment" && !isSuperAdmin) {
      router.replace("/admin/dashboard");
    }
    if (role && pathname === "/admin/services" && !isSuperAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [pathname, role, isSuperAdmin]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
