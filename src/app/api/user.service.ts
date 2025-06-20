import { http } from "@lyra/config/http-config/page";

// models
import { UserFormModel } from "@lyra/app/types/user/user-form";

export async function createUser({ email, name, password }: UserFormModel) {
  try {
    const response = await fetch(`${http}/user/create`, {
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
