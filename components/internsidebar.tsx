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
import iaeste from "@/public/iaeste.png";


export default function InternSidebar() {
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
        href: "https://chat.whatsapp.com/GILNs2ElSRgHHB42aW6Zge",
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
        {/* <div
        className={cn(
            "mx-auto flex w-full max-w-screen flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-[#101827] md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
             "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
        )}
        > */}
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
                    label: "Name LAstname",
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
        {/* </div> */}
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
