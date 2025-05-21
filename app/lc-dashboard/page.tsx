//app/lc-dashboard/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/lc/app-sidebar";
// import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/lc/lc-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { InternTable } from "@/components/lc/InternTable";
import { SROChecklistModal } from "@/components/lc/SROChecklistModal";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [selectedIntern, setSelectedIntern] = useState({ id: "", name: "" });

    useEffect(() => {
        if (status === "loading") return;
        if (!session) {
            router.push("/signin");
        } else if (session.user.role !== "lc") {
        // Redirect non-LC users to appropriate dashboard
            router.push(session.user.role === "intern" ? "/intern-dashboard" : "/signin");
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

    if (!session || session.user.role !== "lc") {
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
                    <div className="px-4 lg:px-6">
                        <h3 className="text-xl font-semibold mb-4 flex justify-center">
                            Interns in SRO Slot {session.user.sroSlot}
                        </h3>
                        <InternTable onOpenChecklist={handleOpenChecklist} />
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
