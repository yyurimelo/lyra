import { getInitialName } from "@lyra/helpers/get-initial-name";
import { AvatarFallback, AvatarImage } from "./avatar";
import { useSession } from "next-auth/react";
import { cn } from "@lyra/lib/utils";
import { oklchToHex } from "@lyra/utils/color";

type Props = {
  src?: string;
  alt?: string;
  className?: string;
  name?: string;
  appearancePrimaryColor?: string;
};

export function AvatarImageUser({
  src,
  alt,
  className,
  name,
  appearancePrimaryColor,
}: Props) {
  const { data: loggedUser } = useSession();
  const initialName = getInitialName(name ? name : loggedUser?.user.name);

  const colorUserPublic = appearancePrimaryColor
    ? oklchToHex(appearancePrimaryColor)
    : null;

  return (
    <>
      {src && alt ? (
        <AvatarImage
          alt={alt}
          src={src}
          className={cn(className ? className : "")}
        />
      ) : (
        <AvatarFallback
          className="rounded-full text-primary-foreground bg-primary"
          style={{ backgroundColor: colorUserPublic ?? undefined }}
        >
          {initialName}
        </AvatarFallback>
      )}
    </>
  );
}
