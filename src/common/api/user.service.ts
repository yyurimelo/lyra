import { http } from "@lyra/config/http-config/page";

// models
import { UserFormModel } from "@lyra/common/models/user/user-form";

export async function createUser({ email, name, password }: UserFormModel) {
  const response = await fetch(`${http}/user/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      name,
      password,
    }),
  });
  return response.json();
}
