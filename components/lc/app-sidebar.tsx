"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import { useSession } from "next-auth/react"

import { NavMain } from "@/components/lc/nav-main"
import { NavSecondary } from "@/components/lc/nav-secondary"
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
import { IconInnerShadowTop, IconListDetails } from "@tabler/icons-react"
import Image from "next/image"

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
    // {
    //   title: "Checklist",
    //   url: "/lc-dashboard/checklist",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: BarChartIcon,
    // },
    // {
    //   title: "Projects",
    //   url: "#",
    //   icon: FolderIcon,
    // },
    // {
    //   title: "Interns",
    //   url: "#",
    //   icon: UsersIcon,
    // },
  ],

//   navSecondary: [
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: SettingsIcon,
    // },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: HelpCircleIcon,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: SearchIcon,
    // },
//   ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  // Defensive extraction for LC user fields
  let user = data.user;
  let initials = "LC";
  if (
    session?.user &&
    typeof (session.user as any).role === "string" &&
    (session.user as any).role === "lc"
  ) {
    const firstName = (session.user as any).firstName || "";
    const lastName = (session.user as any).lastName || "";
    const email = (session.user as any).email || "";
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
                        src="/iaeste_white.png"
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
