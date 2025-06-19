import { ModeToggle } from "@lyra/components/mode-toggle";
import "./globals.css";
import { ThemeProvider } from "@lyra/components/theme-provider";
import { Toaster } from "@lyra/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
