import { http } from "@lyra/config/http-config/page";

//models
import { FriendRequestFormModel } from "@lyra/types/friend-request/friend-request-form";
import { FriendRequestRemoveModel } from "@lyra/types/friend-request/friend-request-remove";

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

export async function removeFriendRequest({
  requestId,
  token,
}: FriendRequestRemoveModel & { token?: string }) {
  try {
    const response = await fetch(`${prefix}/remove?requestId=${requestId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      throw new Error("Solicitação não encontrada ou já removida.");
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function checkPendingFriendRequest({
  userIdentifier,
  token,
}: FriendRequestFormModel & { token?: string }) {
  const response = await fetch(
    `${prefix}/check/request?otherUserId=${userIdentifier}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 404) return null;

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message);
  }

  return data;
}

export async function acceptFriendRequest({
  requestId,
  token,
}: FriendRequestRemoveModel & { token?: string }) {
  try {
    const response = await fetch(`${prefix}/accept?requestId=${requestId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function getFriendRequests(token?: string) {
  try {
    const response = await fetch(`${prefix}/get/all/requests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        data?.message || "Erro ao buscar solicitações de amizade"
      );
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
