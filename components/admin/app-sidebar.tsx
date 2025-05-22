"use client"

import * as React from "react"
import {
    CalendarClockIcon,
    LayoutDashboardIcon,
    ListIcon,
    UsersIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { NavMain } from "@/components/admin/nav-main"
import { NavUser } from "@/components/admin/nav-user"
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

const data = {
  user: {
    name: "IC",
    email: "ic-lcmu@iaeste.in",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Interns",
      url: "/admin-dashboard/interns",
      icon: ListIcon,
    },
    {
      title: "Team",
      url: "/admin-dashboard/lcmu",
      icon: UsersIcon,
    },
    {
      title: "SRO Slots",
      url: "/admin-dashboard/slots",
      icon: CalendarClockIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/iaeste_white.png" : "/iaeste.png";
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
