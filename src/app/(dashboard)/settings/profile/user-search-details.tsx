import { sendInviteFriend } from "@lyra/app/api/friend-request.service";
import { Avatar } from "@lyra/components/ui/avatar";
import { AvatarImageUser } from "@lyra/components/ui/avatar-image-user";
import { Button } from "@lyra/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@lyra/components/ui/dialog";
import { Separator } from "@lyra/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lyra/components/ui/tooltip";
import { UserDataModel } from "@lyra/types/user/user-data";
import { UserRoundPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: Dispatch<boolean>;
  user: UserDataModel;
};

export function UserSearchDetails({ open, setOpen, user }: Props) {
  const { data: loggedUser } = useSession();

  const inviteFriend = loggedUser?.user.userIdentifier === user.userIdentifier;

  async function handleInviteFriend() {
    try {
      await sendInviteFriend({
        userIdentifier: user.userIdentifier,
        token: loggedUser?.user.token,
      });
      toast.success("Solicitação de amizade enviada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível enviar a solicitação de amizade");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Recupere as informações detalhadas do usuário selecionado.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <section>
          <div className="flex items-center">
            <Avatar className="w-24 h-24">
              <AvatarImageUser
                src={user.avatarUser ?? ""}
                alt={user.avatarUser ?? ""}
                name={user.name}
                appearancePrimaryColor={user.appearancePrimaryColor ?? ""}
              />
            </Avatar>
            <div className="flex flex-col ml-4 space-y-1">
              <h1 className="text-xl font-semibold">
                {user.name ?? "Nome não disponível"}
              </h1>
              <p className="text-secondary-foreground/80 text-xs">
                {user.description
                  ? user.description
                  : "Descrição não disponível"}
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex justify-end">
          {!inviteFriend && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  tabIndex={-1}
                  size="icon"
                  variant="outline"
                  onClick={handleInviteFriend}
                >
                  <UserRoundPlus className="w-4 h-4 text-emerald-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enviar solicitação de amizade</TooltipContent>
            </Tooltip>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
