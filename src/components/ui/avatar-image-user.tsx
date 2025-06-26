import { getInitialName } from "@lyra/helpers/get-initial-name";
import { AvatarFallback, AvatarImage } from "./avatar";
import { useSession } from "next-auth/react";
import { cn } from "@lyra/lib/utils";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
};

export function AvatarImageUser({ src, alt, className }: Props) {
  const { data: loggedUser } = useSession();
  const initialName = getInitialName(loggedUser?.user.name);

  return (
    <>
      {src && alt ? (
        <AvatarImage
          alt={alt}
          src={src}
          className={cn(className ? className : "")}
        />
      ) : (
        <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
          {initialName}
        </AvatarFallback>
      )}
    </>
  );
}
