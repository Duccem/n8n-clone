"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import CreateOrganizationDialog from "@/features/organization/components/create-organization-dialog";

export function OrganizationSwitcher() {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: listOrgs, isPending: isPendingList } =
    authClient.useListOrganizations();
  const { data: activeOrg, isPending: isPendingOrg } =
    authClient.useActiveOrganization();

  React.useEffect(() => {
    if (!activeOrg && listOrgs && listOrgs.length > 0) {
      authClient.organization.setActive(
        {
          organizationId: listOrgs[0].id,
        },
        {
          onSuccess: () => {
            router.refresh();
          },
        }
      );
    }
  }, [activeOrg, listOrgs, router]);

  if (!activeOrg || !listOrgs || isPendingList || isPendingOrg) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-not-allowed opacity-50"
          >
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              ...
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src={activeOrg.logo ?? ""} alt="" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrg.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Orgs
            </DropdownMenuLabel>
            {listOrgs.map((organization, index) => (
              <DropdownMenuItem
                key={organization.name}
                onClick={async () => {
                  await authClient.organization.setActive(
                    {
                      organizationId: organization.id,
                    },
                    {
                      onSuccess: () => {
                        router.refresh();
                      },
                    }
                  );
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <img src={organization.logo ?? ""} alt="" />
                </div>
                {organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" asChild>
              <CreateOrganizationDialog />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

