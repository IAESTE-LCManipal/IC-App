"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

import InternSidebar from "@/components/internsidebar";
import NearbyCarousel from "@/components/ui/media_slider";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
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

    const carouselItems = [
        {
            id: 1,
            image: "/image/nearby3.jpg",
            title: "ST. MARY'S ISLES",
            subtitle: "The Scenic",
            description: "Said to have been visited by Vasco da Gama before he docked at Calicut, St. Mary's Isles were a part of Madagascar millions of years ago. It is accessible by ferry from Malpe Beach."
        },
        {
            id: 2,
            image: "/image/nearby1.jpg",
            title: "MURUDESHWAR",
            subtitle: "The Holy",
            description: "Experience Murudeshwar's tranquil beaches, the grand Shiva statue, and vibrant cultural heritage. Ideal for both peaceful retreats and exciting adventures in a picturesque coastal setting."
        },
        {
            id: 3,
            image: "/image/nearby2.jpg",
            title: "KAPU BEACH",
            subtitle: "The Calming",
            description: "Kapu Lighthouse and Beach, is a hidden gem nestled along the coastline of Karnataka in the Udupi district. This serene beach is renowned for its pristine sandy shores, azure waters, and the iconic lighthouse that stands tall as a beacon of the past."
        },
        {
            id: 4,
            image: "/image/nearby4.jpg",
            title: "SITANADI",
            subtitle: "River Rafting at",
            description: "Home to the second tallest statue of Lord Shiva in the world, Murudeshwar is a coastal town known for its beautiful beaches and temple.",
            discover: "https://maps.app.goo.gl/3KSn8sjSfKJh5PgX9"
        },
        // Add more items when lcs give
    ];

    return (
        <>
            <div
                className={cn(
                    "mx-auto flex w-full max-w-screen flex-1 flex-col overflow-auto rounded-md border border-neutral-200 bg-[#101827] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                    "h-screen"
                )}
            >
                <InternSidebar />
                <div className="flex h-full w-full flex-1 flex-col gap-2 border-0 bg-neutral-900">
                    <NearbyCarousel items={carouselItems} />
                </div>
            </div>
        </>
    );
};
