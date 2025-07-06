"use client";

import { ThemeProvider } from "@lyra/components/theme-provider";
import { Toaster } from "@lyra/components/ui/sonner";
import AuthProvider from "@lyra/components/providers/session-provider";
import {
  queryClient,
  QueryClientProvider,
} from "@lyra/config/react-query-config/page";

export default function RootProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
