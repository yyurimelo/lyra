import { ComponentProps } from "react";

import { NavLink } from "../nav-link";

export function MenuLink(props: ComponentProps<typeof NavLink>) {
  return (
    <NavLink
      shouldMatchExact
      className="flex h-12 items-center border-b-2 border-transparent px-3 py-1.5 text-sm font-medium text-muted-foreground hover:border-border data-[current=true]:border-primary data-[current=true]:text-accent-foreground"
      {...props}
    />
  );
}
