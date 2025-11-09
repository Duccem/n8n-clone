"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const PATH_LABELS: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/workflows": "Workflows",
  "/workflows/logs": "Logs",
  "/workflows/analytics": "Analytics",
  "/organization": "Organization",
  "/organization/settings": "Settings",
  "/organization/members": "Members",
  "/organization/billing": "Billing",
};

function titleize(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

const Header = () => {
  const pathname = usePathname() || "/";

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.length
    ? segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const label =
          PATH_LABELS[href] ??
          PATH_LABELS[`/${seg}`] ??
          titleize(decodeURIComponent(seg));
        return { href, label };
      })
    : [{ href: "/", label: PATH_LABELS["/"] ?? "Home" }];

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((c, idx) => (
              <Fragment key={c.href}>
                <BreadcrumbItem
                  className={
                    idx < crumbs.length - 1 ? "hidden md:block" : undefined
                  }
                >
                  {idx < crumbs.length - 1 ? (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < crumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;

