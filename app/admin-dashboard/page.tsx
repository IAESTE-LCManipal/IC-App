"use client";
import React, { Suspense, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/admin/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SectionCards } from "@/components/admin/admin-cards";

const DynamicLCsCurrentSlotTable = dynamic(() => import("@/components/admin/lcs-current-slot-table").then(mod => mod.LCsCurrentSlotTable), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />,
});
const DynamicInternsInCurrentSlot = dynamic(() => import("@/components/admin/intern-in-slot").then(mod => mod.InternsInCurrentSlot), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />,
});

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
              {/* Render SectionCards (stats) immediately for fast LCP */}
              <SectionCards />
              {/* Defer loading of heavy tables/lists until after stats are visible */}
              <Suspense fallback={<Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />}>
                <div className="px-4 lg:px-6 gap-4 md:gap-6 flex flex-col">
                  <DynamicLCsCurrentSlotTable />
                  <DynamicInternsInCurrentSlot />
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
