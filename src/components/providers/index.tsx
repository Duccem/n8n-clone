"use client";

import { I18nProviderClient } from "@/lib/translation/client";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "../ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({});

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
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
          <Toaster />
        </I18nProviderClient>
      </NuqsAdapter>
    </ThemeProvider>
  );
};

