import { http } from "@lyra/config/http-config/page";

// models
import { UserFormModel } from "@lyra/types/user/user-form";
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
}: UserUpdateModel) {
  try {
    const response = await fetch(`${prefix}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name,
        description,
        appearancePrimaryColor,
        appearanceTextPrimaryLight,
        appearanceTextPrimaryDark,
      }),
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
