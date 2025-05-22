"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/intern-sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function InternSidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
      label: "WhatsApp",
      href: "https://chat.whatsapp.com/GILNs2ElSRgHHB42aW6Zge",
      icon: (
        <IconBrandWhatsapp className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
    {
      label: "Logout",
      href: "/signin",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700" />
      ),
    },
  ];

  return (
    <>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          <SidebarLink
            link={{
              label: session?.user?.name || "Name Lastname", // Fallback to "Name Lastname" if no session
              href: "/profile",
              icon: (
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "Intern"}
                    className="h-7 w-7 shrink-0 rounded-full"
                  />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "I"}</AvatarFallback>
                </Avatar>
              ),
            }}
          />
        </SidebarBody>
      </Sidebar>
    </>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 border-1 border-gray-900">
        <Image
          src="/iaeste.png"
          height={25}
          width={25}
          className="shrink-0"
          alt="Dashboard"
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black"
      >
        IAESTE MU
      </motion.span>
    </Link>
  );
};
