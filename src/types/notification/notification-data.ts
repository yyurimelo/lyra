type InviteFriendData = {
  requestId: string;
};

type NewMessageData = {
  chatId: string;
  senderId: string;
};

type NotificationBase = {
  id: number;
  content: string;
  unread: boolean;
  createdAt?: Date;
};

export type NotificationDataModel =
  | (NotificationBase & { type: 0; data: InviteFriendData })
  | (NotificationBase & { type: 1; data?: undefined })
  | (NotificationBase & { type: 2; data: NewMessageData })
  | (NotificationBase & { type: 3; data?: undefined });
