import { http } from "@lyra/config/http-config/page";

import { FriendRequestFormModel } from "@lyra/types/friend-request/friend-request-form";

const prefix = `${http}/shared`;

export async function sendInviteFriend({
  userIdentifier,
  token,
}: FriendRequestFormModel & { token?: string }) {
  try {
    const response = await fetch(`${prefix}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId: userIdentifier }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}
