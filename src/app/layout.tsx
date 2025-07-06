import "./globals.css";
import { Metadata } from "next";
import RootProviders from "@lyra/components/providers/root-provider";

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
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
