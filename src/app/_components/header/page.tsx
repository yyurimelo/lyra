import { HeaderAccount } from "./header-account";
import { MenuLink } from "./menu-link";
import { LyraIcon } from "../lyra/lyra-icon";
import SearchUser from "./search-user";
import { Notification } from "./notification/page";

// components
import { ModeToggle } from "@lyra/components/mode-toggle";
import { Badge } from "@lyra/components/ui/badge";

export default function Header() {
  return (
    <div className="border-b bg-accent/20 px-4 pt-4 space-y-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <LyraIcon height="h-7" />
          <div className="h-6 w-px bg-border" />

          <Badge className="rounded-full bg-accent/60">
            <p className="text-[11px] font-light text-foreground/60">BETA</p>
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <SearchUser />
          <Notification />
          <ModeToggle />
          <HeaderAccount />
        </div>
      </div>
      <div>
        <nav className="flex items-center space-x-2 lg:space-x-3">
          <MenuLink href="/">Dashboard</MenuLink>
          <MenuLink href="/settings/" shouldMatchExact={false}>
            Configurações
          </MenuLink>
        </nav>
      </div>
    </div>
    // <div className="border-b bg-accent/20">
    //   <div className="flex items-center justify-between px-8">
    //     <div className="flex items-center space-x-4">
    //       <LyraIcon height="h-8" />

    //       <nav className="flex items-center space-x-2 lg:space-x-3">
    //         <MenuLink href="/">Dashboard</MenuLink>
    //         <MenuLink href="/settings/profile">Configurações</MenuLink>
    //       </nav>
    //     </div>

    //     <div className="flex items-center space-x-4">
    //       <Separator orientation="vertical" className="h-6" />

    //       <Separator orientation="vertical" className="h-6" />

    //       <SearchUser />
    //       <Notification />
    //       <ModeToggle />
    //       <HeaderAccount />
    //     </div>
    //   </div>
    // </div>
  );
}
