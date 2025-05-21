"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/admin/app-sidebar"
import { SectionCards } from "@/components/admin/admin-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { LCsCurrentSlotTable } from "@/components/admin/lcs-current-slot-table";
import { InternCards } from "@/components/admin/intern-cards";
import SlotModifier from "@/components/admin/slot-modifier";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/signin");
    } else if ((session.user as any).role !== "admin") {
      router.push("/unauthorized");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div><span className="loading loading-bars loading-xl"></span></div>;
  }

  if (!session || (session.user as any).role !== "admin") {
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
              <h1 className="flex justify-center text-xl sm:text-2xl md:text-3xl font-bold mb-4 ml-4">SRO Slots</h1>
              <div className="px-4 lg:px-6">
                <SlotModifier />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
