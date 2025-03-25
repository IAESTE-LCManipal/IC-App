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
    import Dash from "../../components/dash";


    export default function SidebarDemo() {
        const links = [
            {
            label: "Dashboard",
            href: "#",
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
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
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
    //         className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal "
    //         >
    //             <Image src={iaeste} className="h-5 w-5 shrink-0" alt="Dashboard" />

    //         <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    //         </Link>
    //     );
    // };

    // Dummy dashboard component with content
    const Dashboard = () => {
        return (
            <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2  border-0 bg-neutral-900">
                <Dash />
                {/* <div className="flex gap-2">
                {[...new Array(4)].map((i, idx) => (
                    <div
                    key={"first-array-demo-2" + idx}
                    className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
                    ></div>
                ))}
                </div>
                <div className="flex flex-1 gap-2">
                {[...new Array(2)].map((i, idx) => (
                    <div
                    key={"second-array-demo-2" + idx}
                    className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
                    ></div>
                ))}
                </div> */}
            </div>
            </div>
        );
    };
