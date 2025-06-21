"use client";

import { ModeToggle } from "@lyra/components/mode-toggle";
import { HeaderAccount } from "./header-account";
import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <ModeToggle />
      {session?.user && <HeaderAccount />}
    </header>
  );
}
