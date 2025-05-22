"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {SectionCards} from "@/components/admin/admin-cards";
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LCsCurrentSlotTable } from "@/components/admin/lcs-current-slot-table";
import { InternsInCurrentSlot } from "@/components/admin/intern-in-slot";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  function isAdminUser(user: any): user is { role: string } {
    return user && typeof user.role === "string";
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
              <SectionCards />
              <div className="px-4 lg:px-6 gap-4 md:gap-6 flex flex-col">
                <LCsCurrentSlotTable/>
                <InternsInCurrentSlot/>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
