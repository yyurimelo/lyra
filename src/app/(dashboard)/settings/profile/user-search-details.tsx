/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  sendInviteFriend,
  // removeFriendRequest,
  checkPendingFriendRequest,
  acceptFriendRequest,
  removeFriendRequest,
} from "@lyra/app/api/friend-request.service";

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
import { UserRoundPlus, UserRoundX, UserRoundCheck } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  user: UserDataModel;
};

export function UserSearchDetails({ open, setOpen, user }: Props) {
  const { data: session } = useSession();

  const loggedUserId = session?.user.userIdentifier;
  const token = session?.user.token;

  const [pendingRequest, setPendingRequest] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loggedUserIsMe = loggedUserId === user.userIdentifier;

  useEffect(() => {
    async function fetchPending() {
      if (!loggedUserIsMe && open) {
        try {
          const request = await checkPendingFriendRequest({
            userIdentifier: user.userIdentifier,
            token,
          });
          setPendingRequest(request);
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Erro ao verificar solicitação pendente");
          }
          setPendingRequest(null);
        }
      }
    }

    fetchPending();
  }, [open, user.userIdentifier, loggedUserIsMe, token]);

  console.log(pendingRequest);

  async function handleInviteFriend() {
    try {
      setIsLoading(true);
      const data = await sendInviteFriend({
        userIdentifier: user.userIdentifier,
        token,
      });
      toast.success("Solicitação enviada com sucesso!");
      setPendingRequest(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelRequest() {
    if (!pendingRequest) return;
    try {
      setIsLoading(true);
      await removeFriendRequest({ requestId: pendingRequest.id, token });
      toast.success("Solicitação de amizade removida");
      setPendingRequest(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAcceptRequest() {
    if (!pendingRequest) return;
    try {
      setIsLoading(true);
      await acceptFriendRequest({ requestId: pendingRequest.id, token });
      toast.success("Pedido de amizade aceito!");
      setPendingRequest(null);
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aceitar");
    } finally {
      setIsLoading(false);
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

        <section className="w-full flex justify-end space-x-2">
          {pendingRequest ? (
            <>
              {pendingRequest.senderId === loggedUserId ? (
                // Se eu envio, eu posso cancelar
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      tabIndex={-1}
                      size="icon"
                      variant="outline"
                      onClick={handleCancelRequest}
                      disabled={isLoading}
                    >
                      <UserRoundX className="w-4 h-4 text-red-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cancelar solicitação</TooltipContent>
                </Tooltip>
              ) : (
                // Se eu recebi eu posso aceitar ou rejeitar
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        tabIndex={-1}
                        size="icon"
                        variant="outline"
                        onClick={handleAcceptRequest}
                        disabled={isLoading}
                      >
                        <UserRoundCheck className="w-4 h-4 text-emerald-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Aceitar solicitação</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        tabIndex={-1}
                        size="icon"
                        variant="outline"
                        onClick={handleCancelRequest}
                        disabled={isLoading}
                      >
                        <UserRoundX className="w-4 h-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rejeitar solicitação</TooltipContent>
                  </Tooltip>
                </>
              )}
            </>
          ) : (
            <>
              {!loggedUserIsMe && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      tabIndex={-1}
                      size="icon"
                      variant="outline"
                      onClick={handleInviteFriend}
                      disabled={isLoading}
                    >
                      <UserRoundPlus className="w-4 h-4 text-emerald-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enviar solicitação de amizade</TooltipContent>
                </Tooltip>
              )}
            </>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
