import Link from "next/link";
import { ComponentProps } from "react";

import { NavLink } from "./nav-link";

export function AsideLink(props: ComponentProps<typeof Link>) {
  return (
    <NavLink
      shouldMatchExact
      className="inline-flex h-11 items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[current=true]:bg-primary/10 dark:hover:bg-accent dark:data-[current=true]:bg-primary/10"
      {...props}
    />
  );
}
