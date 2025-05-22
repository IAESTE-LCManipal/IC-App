"use client"

import * as React from "react"
import { LayoutDashboardIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { NavMain } from "@/components/lc/nav-main"
import { NavUser } from "@/components/lc/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { useTheme } from "next-themes"

const data = {
  user: {
    name: "LC",
    email: "lc-mu@iaeste.in",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/lc-dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/iaeste_white.png" : "/iaeste.png";
  const { data: session } = useSession();
  // Defensive extraction for LC user fields
  let user: { name: string; email: string; avatar: string } = { name: "", email: "", avatar: "" };
  let initials = "LC";
  if (
    session?.user &&
    typeof (session.user as { role?: string }).role === "string" &&
    (session.user as { role?: string }).role === "lc"
  ) {
    const firstName = (session.user as { firstName?: string }).firstName || "";
    const lastName = (session.user as { lastName?: string }).lastName || "";
    const email = (session.user as { email?: string }).email || "";
    initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || email.charAt(0).toUpperCase();
    user = {
      name: `${firstName} ${lastName}`.trim() || email,
      email: email,
      avatar: "" // empty string to force fallback
    };
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
                >
                <div>
                    <div className="h-5 w-6 shrink-0 mb-1">
                        <Image
                        src={logoSrc}
                        height={25}
                        width={25}
                        className="shrink-0"
                        alt="Dashboard"
                        />
                    </div>
                    <span className="text-base font-semibold">IAESTE Manipal</span>
                </div>
                </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} initials={initials} />
      </SidebarFooter>
    </Sidebar>
  )
}
