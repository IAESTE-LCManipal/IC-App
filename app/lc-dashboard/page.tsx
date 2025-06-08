//app/lc-dashboard/page.tsx
"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { AppSidebar } from "@/components/lc/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SROChecklistModal } from "@/components/lc/SROChecklistModal";

// Define a User type for role checks
interface User {
  role?: string;
  sroSlot?: string;
  [key: string]: unknown;
}

function hasRole(user: User): user is { role: string } {
  return user && typeof user.role === "string";
}

function isLCUser(user: User): user is { role: string; sroSlot: string } {
  return (
    user &&
    typeof user === "object" &&
    user !== null &&
    "role" in user &&
    (user as { role?: unknown }).role === "lc" &&
    "sroSlot" in user &&
    typeof (user as { sroSlot?: unknown }).sroSlot === "string"
  );
}

// Fix dynamic import for named exports
const DynamicSectionCards = dynamic(() => import("@/components/lc/lc-cards").then(mod => mod.SectionCards), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />,
});
const DynamicInternTable = dynamic(() => import("@/components/lc/InternTable").then(mod => mod.InternTable), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />,
});

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState({ id: "", name: "" });

    useEffect(() => {
        if (status === "loading") return;
        if (!session || !session.user) {
            router.push("/signin");
        } else if (!isLCUser(session.user)) {
            // Redirect non-LC users to appropriate dashboard
            if (hasRole(session.user) && session.user.role === "intern") {
                router.push("/intern-dashboard");
            } else {
                router.push("/signin");
            }
        }
    }, [session, status, router]);

    const handleOpenChecklist = (internId: string, internName: string) => {
    setSelectedIntern({ id: internId, name: internName });
    setIsChecklistOpen(true);
    };

    if (status === "loading") {
        return (
        <div>
            <span className="loading loading-bars loading-xl"></span>
        </div>
        );
    }

    if (!session || !session.user || !isLCUser(session.user)) {
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
                    <Suspense fallback={<Skeleton className="w-full h-40 rounded-lg bg-neutral-800" />}>
                      <DynamicSectionCards />
                    </Suspense>
                    <div className="px-4 lg:px-6">
                        <h3 className="text-xl font-semibold mb-4 flex justify-center">
                            Interns in SRO Slot {session.user.sroSlot}
                        </h3>
                        <Suspense fallback={<Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />}>
                          <DynamicInternTable onOpenChecklist={handleOpenChecklist} />
                        </Suspense>
                    </div>
                </div>
                </div>
            </div>
            <SROChecklistModal
                isOpen={isChecklistOpen}
                onClose={() => setIsChecklistOpen(false)}
                internId={selectedIntern.id}
                internName={selectedIntern.name}
            />
            </SidebarInset>
        </SidebarProvider>
    );
}
