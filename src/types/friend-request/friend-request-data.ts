export type FriendRequestDataModel = {
  id: number;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  status: "pending" | "accepted";
  createdAt: Date;
};
