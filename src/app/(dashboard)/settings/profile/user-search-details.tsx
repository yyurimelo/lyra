/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@lyra/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lyra/components/ui/tooltip";
import { Separator } from "@lyra/components/ui/separator";
import { Avatar } from "@lyra/components/ui/avatar";
import { AvatarImageUser } from "@lyra/components/ui/avatar-image-user";
import { Button } from "@lyra/components/ui/button";

// types
import { UserDataModel } from "@lyra/types/user/user-data";
import { UserRoundPlus, UserRoundX, UserRoundCheck } from "lucide-react";

// services
import { removeFriendForUser } from "@lyra/app/api/user.service";
import {
  sendInviteFriend,
  checkPendingFriendRequest,
  acceptFriendRequest,
  removeFriendRequest,
} from "@lyra/app/api/friend-request.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@lyra/config/react-query-config/page";

// -----------------------------------------------------------------------------

type Props = {
  open: boolean;
  setOpen: React.Dispatch<boolean>;
  user: UserDataModel;
};

// -----------------------------------------------------------------------------

export function UserSearchDetails({ open, setOpen, user }: Props) {
  const { data: session } = useSession();

  const loggedUserId = session?.user.userIdentifier;
  const token = session?.user.token;

  const loggedUserIsMe = loggedUserId === user.userIdentifier;

  const { data: request, isPending } = useQuery({
    queryKey: ["request", user.userIdentifier],
    queryFn: () =>
      checkPendingFriendRequest({
        userIdentifier: user.userIdentifier,
        token,
      }),
    enabled: !loggedUserIsMe && open,
  });

  const { mutateAsync: sendInviteFriendFn } = useMutation({
    mutationFn: sendInviteFriend,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", user.userIdentifier],
      });
      toast.success("Solicitação de amizade enviada com sucesso!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao enviar solicitação de amizade");
      }
    },
  });

  const { mutateAsync: acceptRequestFn } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", user.userIdentifier],
      });
      toast.success("Solicitação de amizade aceita com sucesso!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao aceitar solicitação de amizade");
      }
    },
  });

  const { mutateAsync: removeFriendFn } = useMutation({
    mutationFn: removeFriendForUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", user.userIdentifier],
      });
      toast.success("Amigo removido com sucesso!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao remover amigo");
      }
    },
  });

  const { mutateAsync: removeRequestFn } = useMutation({
    mutationFn: removeFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", user.userIdentifier],
      });
      toast.success("Solicitação de amizade removida com sucesso!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao remover solicitação de amizade");
      }
    },
  });

  // Cancelar solicitação de amizade
  async function handleCancelRequest() {
    await removeRequestFn({
      requestId: request.id,
      token,
    });
  }

  // Remover amigo
  async function handleRemoveFriend() {
    await removeFriendFn({
      userIdentifier: user.userIdentifier,
      token,
    });
  }

  // Aceitar solicitação de amizade
  async function handleAcceptRequest() {
    await acceptRequestFn({
      requestId: request.id,
      token,
    });
  }

  // Enviar solicitação de amizade
  async function handleInviteFriend() {
    await sendInviteFriendFn({
      userIdentifier: user.userIdentifier,
      token,
    });
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
          {request ? (
            <>
              {request.status === "Pending" && (
                <>
                  {request.senderId === loggedUserId ? (
                    // Eu enviei e posso cancelar
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          tabIndex={-1}
                          size="icon"
                          variant="outline"
                          onClick={handleCancelRequest}
                          disabled={isPending}
                        >
                          <UserRoundX className="w-4 h-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Cancelar solicitação</TooltipContent>
                    </Tooltip>
                  ) : (
                    // Eu recebi e posso aceitar ou rejeitar
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            tabIndex={-1}
                            size="icon"
                            variant="outline"
                            onClick={handleAcceptRequest}
                            disabled={isPending}
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
                            disabled={isPending}
                          >
                            <UserRoundX className="w-4 h-4 text-red-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rejeitar solicitação</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </>
              )}

              {request.status === "Accepted" && (
                <section className="flex flex-col w-full space-y-2">
                  <div className="flex-1 ml-auto">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          tabIndex={-1}
                          size="icon"
                          variant="outline"
                          onClick={handleRemoveFriend}
                        >
                          <UserRoundX className="w-4 h-4 text-red-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remover amigo</TooltipContent>
                    </Tooltip>
                  </div>

                  <Separator orientation="horizontal" className="my-2" />

                  <div className="flex w-full justify-end">
                    <span className="text-muted-foreground/80 text-[11px]">
                      Vocês se tornaram amigos{" "}
                      {formatDistanceToNow(new Date(request.createdAt), {
                        locale: ptBR,
                        addSuffix: true,
                      })}{" "}
                      atrás.
                    </span>
                  </div>
                </section>
              )}
            </>
          ) : (
            !loggedUserIsMe && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    tabIndex={-1}
                    size="icon"
                    variant="outline"
                    onClick={handleInviteFriend}
                    disabled={isPending}
                  >
                    <UserRoundPlus className="w-4 h-4 text-emerald-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enviar solicitação de amizade</TooltipContent>
              </Tooltip>
            )
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
