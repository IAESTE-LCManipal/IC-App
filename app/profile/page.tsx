"use client"

import InternProfile from "@/components/profile";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


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
    return <InternProfile />;
}
