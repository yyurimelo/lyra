import "./globals.css";
import { ThemeProvider } from "@lyra/components/theme-provider";
import { Toaster } from "@lyra/components/ui/sonner";
import AuthProvider from "@lyra/components/providers/session-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LyraCHAT",
  description: "Chat virtual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
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
      </body>
    </html>
  );
}
