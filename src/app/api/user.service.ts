import { http } from "@lyra/config/http-config/page";
import { UserDataModel } from "@lyra/types/user/user-data";

// models
import { UserFormModel } from "@lyra/types/user/user-form";
import { UserSearchDataModel } from "@lyra/types/user/user-search-data";
import { UserUpdateModel } from "@lyra/types/user/user-update";

const prefix = `${http}/user`;

export async function createUser({ email, name, password }: UserFormModel) {
  try {
    const response = await fetch(`${prefix}/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
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

export async function updateUser({
  id,
  name,
  description,
  appearancePrimaryColor,
  appearanceTextPrimaryLight,
  appearanceTextPrimaryDark,
  token,
}: UserUpdateModel & { token: string | undefined }) {
  try {
    const response = await fetch(`${prefix}/update?id=${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
        appearancePrimaryColor,
        appearanceTextPrimaryLight,
        appearanceTextPrimaryDark,
      }),
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Erro ao atualizar o usuário.");
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getUser(id: string): Promise<UserDataModel> {
  const response = await fetch(`${prefix}/get/${id}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Erro ao buscar usuário.");
  }

  const data = await response.json();
  return data;
}

export async function searchUserByUserIdentifier(
  userIdentifier: string
): Promise<UserSearchDataModel> {
  const response = await fetch(
    `${prefix}/get/search?userIdentifier=${userIdentifier}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Erro ao buscar usuário.");
  }

  const data = await response.json();
  return data;
}
