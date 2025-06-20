"use client";

import { SessionProvider } from "next-auth/react";

interface NextAuthSessionProps {
  children: React.ReactNode;
}
export default function AuthProvider({ children }: NextAuthSessionProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
