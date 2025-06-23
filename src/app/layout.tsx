import "./globals.css";
import { ThemeProvider } from "@lyra/components/theme-provider";
import { Toaster } from "@lyra/components/ui/sonner";
import AuthProvider from "@lyra/components/providers/session-provider";
import DynamicPrimaryColor from "@lyra/_components/dynaminc-primary-color";

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
            <DynamicPrimaryColor />
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
