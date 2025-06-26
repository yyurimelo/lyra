"use client";
import { useEffect, useState } from "react";

// icons
import { SearchIcon } from "lucide-react";

// components
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@lyra/components/ui/command";
import { UserDataModel } from "@lyra/types/user/user-data";
import { Avatar } from "@lyra/components/ui/avatar";
import { AvatarImageUser } from "@lyra/components/ui/avatar-image-user";

// services
import { searchUserByUserIdentifier } from "@lyra/app/api/user.service";
import { UserSearchDetails } from "@lyra/app/(dashboard)/settings/profile/user-search-details";

export default function SearchUser() {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserDataModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDataModel | null>(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 6) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchUserByUserIdentifier(searchQuery);
        const results = Array.isArray(data) ? data : [data];
        setSearchResults(
          results.filter(
            (user) =>
              user && typeof user === "object" && "userIdentifier" in user
          )
        );
      } catch (error) {
        console.log("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  return (
    <>
      <button
        className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">Procurar</span>
        </span>
        <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar usuários..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {searchResults.length > 0 ? (
            <CommandGroup heading="Usuários">
              {searchResults.map((user) => (
                <CommandItem
                  key={user.userIdentifier}
                  value={user.userIdentifier}
                  onSelect={() => {
                    setSelectedUser(user);
                    setOpenDialog(true);
                  }}
                >
                  <Avatar>
                    <AvatarImageUser
                      src={user.avatarUser ?? ""}
                      alt={`Avatar de ${user.name}`}
                      name={user.name}
                    />
                  </Avatar>
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>
              {isLoading
                ? "Nenhum usuário encontrado."
                : "Nenhum usuário encontrado."}
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
      {selectedUser && (
        <UserSearchDetails
          open={openDialog}
          setOpen={setOpenDialog}
          user={selectedUser}
        />
      )}
    </>
  );
}
