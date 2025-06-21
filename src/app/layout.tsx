import "./globals.css";
import { ThemeProvider } from "@lyra/components/theme-provider";
import { Toaster } from "@lyra/components/ui/sonner";
import AuthProvider from "@lyra/components/providers/session-provider";
import { Header } from "@lyra/_components/header";

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
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
