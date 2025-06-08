"use client";
import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import InternSidebar from "@/components/intern/internsidebar";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DynamicDialogDemo = dynamic(() => import("@/components/intern/essentialsblock"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />,
});

export default function Essential() {
    const { data: session, status } = useSession();
            const router = useRouter();

            useEffect(() => {
                if (status === "loading") return; // Wait for session to load

                if (!session) {
                  router.push("/signin"); // Redirect unauthenticated users
                }
            }, [session, status, router]);

            if (status === "loading") {
                return <div><span className="loading loading-bars loading-xl"></span></div>; // Show a loading state while session is being fetched
            }

            if (!session) {
                return null; // Prevent rendering until navigation completes
            }

    return (
        <>
        <div
        className={cn(
            "mx-auto flex w-full max-w-screen flex-1 flex-col overflow-auto rounded-md border border-neutral-200 bg-[#101827] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            "h-screen"
        )}
        >
            <InternSidebar />
            <div className="flex h-full w-full flex-1 flex-col gap-2  border-0 bg-neutral-900">
                <Suspense fallback={<Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />}>
                  <DynamicDialogDemo />
                </Suspense>
            </div>
        </div>
        </>
    );
}
