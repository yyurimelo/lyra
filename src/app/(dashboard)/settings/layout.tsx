import { ChevronRight, User2, Users } from "lucide-react";

import { AsideLink } from "@lyra/app/_components/aside-link";

export default async function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="grid grid-cols-5 gap-12">
        <aside className="-mx-4 space-y-4">
          <h2 className="mx-4 text-2xl font-bold tracking-tight">
            Configurações
          </h2>

          <nav className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold text-muted-foreground">
                Geral
              </span>
              <AsideLink href="/settings/profile">
                <User2 className="mr-2 size-4 text-primary" />
                Perfil
                <ChevronRight className="h-4 w-4 ml-auto" />
              </AsideLink>
              <AsideLink href="/settings/friend-requests">
                <Users className="mr-2 size-4 text-primary" />
                Solicitações de amizade
                <ChevronRight className="h-4 w-4 ml-auto" />
              </AsideLink>
            </div>
          </nav>
        </aside>

        <div className="col-span-4">{children}</div>
      </div>
    </>
  );
}
