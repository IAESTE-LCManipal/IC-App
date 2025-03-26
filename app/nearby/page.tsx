"use client";
    import React, { useState } from "react";
    import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
    import {
        IconArrowLeft,
        IconBrandTabler,
        IconSettings,
        IconBrandWhatsapp,
    } from "@tabler/icons-react";
    import Link from "next/link";
    import { motion } from "framer-motion";
    import Image from "next/image";
    import { cn } from "@/lib/utils";

    import NearbyCarousel from "@/components/ui/media_slider";

    export default function SidebarDemo() {



        const links = [
            {
            label: "Dashboard",
            href: "/dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            },
            {
            label: "WhatsApp",
            href: "#",
            icon: (
                <IconBrandWhatsapp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            },
            {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            },
            {
            label: "Logout",
            href: "/signin",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
            },
        ];
        const [open, setOpen] = useState(false);
        return (
            <>
            <div
            className={cn(
                "mx-auto flex w-full max-w-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-[#101827] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                 "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
            >
            <Sidebar open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-10">
                <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                    <>
                    <Logo />
                    </>
                    <div className="mt-8 flex flex-col gap-2">
                    {links.map((link, idx) => (
                        <SidebarLink key={idx} link={link} />
                    ))}
                    </div>
                </div>
                <div>
                    <SidebarLink
                    link={{
                        label: "Manu Arora",
                        href: "/profile",
                        icon: (
                        <Image
                            src="https://assets.aceternity.com/manu.png"
                            className="h-7 w-7 shrink-0 rounded-full"
                            width={50}
                            height={50}
                            alt="Avatar"
                        />
                        ),
                    }}
                    />
                </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard />
            </div>
            </>
        );
    }
    export const Logo = () => {
        return (
            <Link
            href="/dashboard"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
            >
            <div className="h-5 w-6 shrink-0">
                <Image src="/iaeste.png" height={25} width={25} className="shrink-0" alt="Dashboard" />
            </div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                IAESTE MU
            </motion.span>
            </Link>
        );
    };
    // export const LogoIcon = () => {
    //     return (
    //         <Link
    //         href="#"
    //         className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    //         >
    //         <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    //         </Link>
    //     );
    // };

    // Dummy dashboard component with content
    const Dashboard = () => {
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
                title: "KAUP BEACH",
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
            // Add more items as needed
        ];

        return (
            <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col border-0 bg-neutral-900 overflow-hidden">
                <NearbyCarousel items={carouselItems}/>
            </div>
            </div>
        );
    };
