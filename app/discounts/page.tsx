"use client";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import DiscountsDialog from "@/components/discountsblock";
import InternSidebar from "@/components/internsidebar";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Discounts() {
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
            "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
        >
            <InternSidebar />
            <div className="flex h-full w-full flex-1 flex-col gap-2  border-0 bg-neutral-900">
                <DiscountsDialog />
            </div>
        </div>
        </>
    );
}
