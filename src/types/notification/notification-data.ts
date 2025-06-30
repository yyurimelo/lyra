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
  | (NotificationBase & { type: "InviteFriend"; data: InviteFriendData })
  | (NotificationBase & { type: "NewMessage"; data: NewMessageData })
  | (NotificationBase & { type: "Generic"; data?: undefined });
