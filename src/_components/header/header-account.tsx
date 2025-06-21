"use client";

// components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lyra/components/ui/avatar";
import { Button } from "@lyra/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@lyra/components/ui/dropdown-menu";
import { getInitialName } from "@lyra/helpers/get-initial-name";
import { CircleUser, LogOut } from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function HeaderAccount() {
  const { data: loggedUser } = useSession();

  const initialName = getInitialName(loggedUser?.user.name);

  function handleSignOut() {
    signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant={"ghost"}>
          <Avatar className="size-8 rounded-full">
            <AvatarImage alt={loggedUser?.user.name} />
            <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
              {initialName}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-8 rounded-full">
              <AvatarImage src={""} alt={loggedUser?.user.name} />
              <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
                {initialName}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {loggedUser?.user.name}
              </span>
              <span className="truncate text-xs">{loggedUser?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href={"/settings/profile"}>
            <DropdownMenuItem>
              <CircleUser />
              Perfil
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
