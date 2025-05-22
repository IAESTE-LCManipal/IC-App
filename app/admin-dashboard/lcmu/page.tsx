"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import LCTablePage from "@/components/admin/lcmu";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function isAdminUser(user: unknown): user is { role: string } {
    return typeof user === 'object' && user !== null && 'role' in user && typeof (user as { role?: unknown }).role === 'string';
  }

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
    } else if (!isAdminUser(session.user) || session.user.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div><span className="loading loading-bars loading-xl"></span></div>;
  }

  if (!session || !isAdminUser(session.user) || session.user.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <LCTablePage />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
