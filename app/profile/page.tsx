"use client"

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DynamicInternProfile = dynamic(() => import("@/components/intern/profile"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />,
});

export default function ProfilePage() {
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
        <Suspense fallback={<Skeleton className="w-full h-96 rounded-lg bg-neutral-800" />}>
            <DynamicInternProfile />
        </Suspense>
    );
}
