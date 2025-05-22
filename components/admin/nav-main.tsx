"use client"

import * as React from "react"
import { PlusCircleIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { CreateInternModal } from "./create-intern-modal"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
    const [open, setOpen] = React.useState(false)
    return (
        <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                    onClick={() => setOpen(true)}
                    tooltip="Quick Create"
                    className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                <PlusCircleIcon />
                <span className="font-semibold">Add an Intern</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url} className="flex items-center gap-2 w-full">
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
            </SidebarMenu>
            <CreateInternModal open={open} onOpenChange={setOpen} />
        </SidebarGroupContent>
        </SidebarGroup>
    )
}
