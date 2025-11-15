import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import InitOrganizationDialog from "@/features/organization/components/init-organization-dialog";
import { AppSidebar } from "@/features/shared/components/app-sidebar";
import Header from "@/features/shared/components/header";
export default function Layout({ children }: LayoutProps<"/[locale]">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        <InitOrganizationDialog />
      </SidebarInset>
    </SidebarProvider>
  );
}

