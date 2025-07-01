/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { NotificationDataModel } from "@lyra/types/notification/notification-data";

export function useNotificationHub(token: string | null) {
  const [notifications, setNotifications] = useState<NotificationDataModel[]>(
    []
  );

  useEffect(() => {
    if (!token) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hub/notification`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connection.on(
      "ReceiveNotification",
      (notification: {
        type: string;
        content: string;
        data?: any;
        createdAt?: Date;
      }) => {
        const enrichedNotification: NotificationDataModel = {
          id: Date.now(),
          content: notification.content,
          unread: true,
          type: notification.type as NotificationDataModel["type"],
          data: notification.data,
          createdAt: notification.createdAt,
        };

        setNotifications((prev) => [enrichedNotification, ...prev]);
      }
    );

    connection.start().catch(console.error);

    return () => {
      connection.stop();
    };
  }, [token]);

  // function markAllAsRead() {
  //   setNotifications((n) => n.map((x) => ({ ...x, unread: false })));
  // }

  // function markAsRead(id: number) {
  //   setNotifications((n) =>
  //     n.map((x) => (x.id === id ? { ...x, unread: false } : x))
  //   );
  // }

  return {
    notifications,
    // markAllAsRead,
    // markAsRead,
  };
}
