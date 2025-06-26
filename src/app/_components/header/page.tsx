import { Separator } from "@lyra/components/ui/separator";
import { HeaderAccount } from "./header-account";
import { ModeToggle } from "@lyra/components/mode-toggle";
import { MenuLink } from "./menu-link";
import { LyraIcon } from "../lyra/lyra-icon";
import SearchUser from "./search-user";
import { Notification } from "./notification/page";

export function Header() {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between px-8">
        <div className="flex items-center space-x-4">
          <LyraIcon height="h-8" />

          <Separator orientation="vertical" className="h-6" />

          <nav className="flex items-center space-x-2 lg:space-x-3">
            <MenuLink href="/">Dashboard</MenuLink>
            <MenuLink href="/settings/profile">Configurações</MenuLink>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Separator orientation="vertical" className="h-6" />

          <Separator orientation="vertical" className="h-6" />

          <SearchUser />
          <Notification />
          <ModeToggle />
          <HeaderAccount />
        </div>
      </div>
    </div>
  );
}
