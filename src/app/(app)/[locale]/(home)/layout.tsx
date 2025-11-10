import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import InitOrganizationDialog from "@/features/organization/components/init-organization-dialog";
import { AppSidebar } from "@/features/shared/components/app-sidebar";
import Header from "@/features/shared/components/header";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        <Suspense>
          <InitOrganizationDialog />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  );
}

