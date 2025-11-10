"use client";

import {
  Building2,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  LayoutGrid,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/animate-ui/primitives/radix/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const menu = [
  {
    title: "Dashboard",
    url: "/dashboard",
    isActive: true,
    icon: LayoutDashboard,
  },
  {
    title: "Workflows",
    url: "#",
    icon: FolderOpen,
    items: [
      {
        title: "Workflows",
        url: "/workflows",
      },
      {
        title: "Executions",
        url: "/workflows/executions",
      },
      {
        title: "Editor",
        url: "/workflows/editor",
      },
    ],
  },
  {
    title: "Integrations",
    icon: LayoutGrid,
    items: [
      { title: "All", url: "/integrations?q=all" },
      { title: "AI", url: "/integrations?q=ai" },
    ],
  },
  {
    title: "Organization",
    icon: Building2,
    items: [
      {
        title: "Settings",
        url: "/organization",
      },
      {
        title: "Members",
        url: "/organization/members",
      },
      {
        title: "Billing",
        url: "/organization/billing",
      },
    ],
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {menu.map((item) =>
          item.items && item.items.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url as any}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url as any}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

