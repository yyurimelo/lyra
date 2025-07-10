"use client";

import { motion } from "framer-motion";
import { Dot } from "@lyra/app/_components/dot";
import {
  acceptFriendRequest,
  getFriendRequests,
  removeFriendRequest,
} from "@lyra/app/api/services/friend-request.service";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lyra/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lyra/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRoundCheck, UserRoundPlus, UserRoundX } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@lyra/components/ui/button";
import { queryClient } from "@lyra/config/react-query-config/page";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FriendRequests() {
  const { data: loggedUser } = useSession();
  const token = loggedUser?.user.token;

  const { data: friendRequests } = useQuery({
    queryKey: ["request", loggedUser?.user.id],
    queryFn: () => getFriendRequests(loggedUser?.user.token),
    refetchInterval: 1000 * 5,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    enabled: !!loggedUser?.user.id,
  });

  const { mutateAsync: acceptRequestFn, isPending: isAccepted } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", loggedUser?.user.id],
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

  const { mutateAsync: removeRequestFn, isPending: isRemoving } = useMutation({
    mutationFn: removeFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["request", loggedUser?.user.id],
      });
      toast.success("Solicitação de amizade rejeitada!");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro ao remover solicitação de amizade");
      }
    },
  });

  async function handleAcceptRequest(requestId: number) {
    await acceptRequestFn({
      requestId,
      token,
    });
  }

  async function handleCancelRequest(requestId: number) {
    await removeRequestFn({
      requestId,
      token,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações recebidas</CardTitle>
        <CardDescription>
          Aqui você pode gerenciar suas solicitações de amizade pendentes.
          Aceite ou rejeite solicitações de outros usuários.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <section className="space-y-4">
          {friendRequests && friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-accent/20 hover:bg-secondary flex items-center justify-between shadow-lg border rounded-lg px-1 py-2 text-sm transition-colors"
                key={request.id}
              >
                <div className="relative flex items-start pe-3">
                  <div className="flex-1 space-y-1">
                    <div className="group relative flex self-stretch select-none items-start gap-3 p-2 text-foreground/80 text-start cursor-pointer">
                      <UserRoundPlus className="text-primary" />
                      <div>
                        <header className="flex items-center gap-2">
                          <span className="text-[10px] text-primary font-semibold uppercase leading-[1rem] tabular-nums">
                            Nova solicitação de amizade
                          </span>
                          <Dot className="text-muted-foreground/50 size-[3px]" />
                          <span className="text-[10px] text-muted-foreground/80 font-semibold uppercase leading-[1rem] tabular-nums">
                            {request.createdAt
                              ? formatDistanceToNow(
                                  new Date(request.createdAt),
                                  {
                                    locale: ptBR,
                                    addSuffix: true,
                                  }
                                )
                              : "Agora"}
                          </span>
                        </header>
                        <span className="text-pretty">
                          {request.senderName} te enviou uma solicitação de
                          amizade.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        tabIndex={-1}
                        size="icon"
                        variant="ghost"
                        onClick={() => handleAcceptRequest(Number(request.id))}
                        disabled={isAccepted}
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
                        variant="ghost"
                        onClick={() => handleCancelRequest(Number(request.id))}
                        disabled={isRemoving}
                      >
                        <UserRoundX className="w-4 h-4 text-red-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rejeitar solicitação</TooltipContent>
                  </Tooltip>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-muted-foreground">
              Nenhuma solicitação de amizade
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
