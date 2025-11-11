import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./main-menu";
import { SidebarUserButton } from "./user-button";
import Link from "next/link";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href="/dashboard">
                <div className=" flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="/images/nodebase-logo.png"
                    className="size-8"
                    alt=""
                  />
                </div>
                <span className="text-base font-semibold">Nodebase</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserButton />
      </SidebarFooter>
    </Sidebar>
  );
}

