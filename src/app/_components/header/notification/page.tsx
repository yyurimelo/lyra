"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Bell } from "@phosphor-icons/react";

import { Badge } from "@lyra/components/ui/badge";
import { Button } from "@lyra/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lyra/components/ui/popover";
import { useSession } from "next-auth/react";
import { useNotificationHub } from "@lyra/hooks/use-notification-hub";
import { notificationTypeIconMap } from "@lyra/app/_mappers/notification-type-icon-map";
import { notificationTypeMap } from "@lyra/app/_mappers/notification-type-map";

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

export function Notification() {
  const { data: session } = useSession();
  const token = session?.user.token;

  const { notifications } = useNotificationHub(token!);
  const unreadCount = notifications.filter((n) => n.unread).length;

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
      <PopoverContent className="w-80 p-1 mr-2">
        <div className="flex items-baseline justify-between gap-4 px-4 py-2">
          <div className="text-sm font-semibold">Notificações</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              // onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </button>
          )}
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
            const { id, type, content, data, createdAt } = notification;
            const Icon = notificationTypeIconMap[type];

            return (
              <div
                key={id}
                className="hover:bg-accent rounded-md px-4 py-2 text-sm transition-colors"
              >
                <div className="relative flex items-start gap-3 pe-3">
                  <div className="flex-1 space-y-1">
                    {type === "InviteFriend" ? (
                      <button
                        className="text-left text-foreground/80 after:absolute after:inset-0"
                        onClick={() => {
                          if (data?.requestId) {
                            console.log(
                              "Abrir detalhes da solicitação:",
                              data.requestId
                            );
                          }
                        }}
                      >
                        {content}
                      </button>
                    ) : (
                      <div className="flex space-x-2 w-full">
                        <Icon
                          size={21}
                          className="text-primary flex-shrink-0"
                        />
                        <div className="flex flex-col gap-[2px] flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-primary">
                              {notificationTypeMap[type] || "Notificação"}
                            </span>
                            <Dot className="text-muted-foreground/50 size-[3px]" />
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
                    )}
                  </div>

                  {/* {unread && (
                    <div className="absolute end-0 self-center">
                      <Dot />
                    </div>
                  )} */}
                </div>
              </div>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
