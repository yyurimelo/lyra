/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useSession } from "next-auth/react";

// hooks
import { useNotificationHub } from "@lyra/hooks/use-notification-hub";

// mappers
import { notificationTypeIconMap } from "@lyra/app/_mappers/notification-type-icon-map";
import { notificationTypeMap } from "@lyra/app/_mappers/notification-type-map";

// components

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lyra/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@lyra/components/ui/tooltip";
import { Badge } from "@lyra/components/ui/badge";
import { Button } from "@lyra/components/ui/button";

// services
import {
  acceptFriendRequest,
  removeFriendRequest,
} from "@lyra/app/api/friend-request.service";

// icons
import { Dot, UserRoundCheck, UserRoundX } from "lucide-react";
import { Bell } from "@phosphor-icons/react";

// -----------------------------------------------------------------------------

export function Notification() {
  const { data: session } = useSession();
  const token = session?.user.token;
  const [isLoading, setIsLoading] = useState(false);

  const { notifications, removeNotificationByRequestId } = useNotificationHub(
    token!
  );
  const unreadCount = notifications.filter((n) => n.unread).length;

  async function handleAcceptRequest(requestId: number) {
    try {
      setIsLoading(true);
      await acceptFriendRequest({ requestId, token });
      toast.success("Pedido de amizade aceito!");
      removeNotificationByRequestId(requestId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aceitar");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancelRequest(requestId: number) {
    try {
      setIsLoading(true);
      await removeFriendRequest({ requestId, token });
      toast.success("Solicitação de amizade removida");
      removeNotificationByRequestId(requestId);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1 mr-28 shadow-xl/30">
        <div className="flex items-baseline px-4 py-2">
          <div className="text-sm font-semibold">Notificações</div>
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        {notifications.length === 0 ? (
          <div className="flex flex-col text-center items-center text-sm text-muted-foreground px-4 gap-2 py-6">
            <Bell className="size-8" weight="duotone" />
            Você não tem novas notificações
          </div>
        ) : (
          notifications.map((notification) => {
            const { id, type, content, createdAt, data } = notification;
            const Icon = notificationTypeIconMap[type];

            const requestId = type === 0 ? data?.requestId : null;

            return (
              <div
                key={id}
                className="hover:bg-accent rounded-md px-4 py-2 text-sm transition-colors"
              >
                <div className="relative flex items-start gap-3 pe-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex space-x-2 w-full">
                      <Icon size={21} className="text-primary flex-shrink-0" />
                      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                        <div className="flex items-center">
                          <span className="text-[11px] text-primary">
                            {notificationTypeMap[type] || "Notificação"}
                          </span>
                          <Dot className="text-muted-foreground/50 size-[15px]" />
                          <span className="text-muted-foreground/80 text-[11px]">
                            {createdAt
                              ? formatDistanceToNow(new Date(createdAt), {
                                  locale: ptBR,
                                  addSuffix: true,
                                })
                              : "Agora"}
                          </span>
                        </div>
                        <span className="text-sm text-foreground break-words">
                          {content || "Sem conteúdo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {type === 0 && (
                  <div className="flex space-x-2 w-full justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          tabIndex={-1}
                          variant={"ghost"}
                          size={"icon"}
                          className="text-emerald-500"
                          onClick={() => handleAcceptRequest(Number(requestId))}
                          disabled={isLoading}
                        >
                          <UserRoundCheck />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Aceitar solicitação</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          tabIndex={-1}
                          variant={"ghost"}
                          size={"icon"}
                          className="text-red-500"
                          onClick={() => handleCancelRequest(Number(requestId))}
                          disabled={isLoading}
                        >
                          <UserRoundX />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Rejeitar solicitação</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
