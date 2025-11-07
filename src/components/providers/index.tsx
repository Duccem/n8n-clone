"use client";

import { I18nProviderClient } from "@/lib/translation/client";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "../ui/sonner";

export const Providers = ({
  children,
  locale = "en",
}: {
  children: React.ReactNode;
  locale?: string;
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NuqsAdapter>
        <I18nProviderClient locale={locale}>
          {children}
          <Toaster />
        </I18nProviderClient>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

