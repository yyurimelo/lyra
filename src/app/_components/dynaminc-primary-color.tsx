"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUser } from "@lyra/app/api/user.service";
import { oklchToHex } from "@lyra/utils/color";
import { changeUserAppearanceSettings } from "@lyra/utils/change-user-appearance";

export default function AppearanceUserSettings() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    async function applyUserAppearance() {
      try {
        const userData = await getUser(session!.user.id);

        changeUserAppearanceSettings({
          appearancePrimaryColor: userData?.appearancePrimaryColor
            ? oklchToHex(userData.appearancePrimaryColor)
            : undefined,
          appearanceTextPrimaryLight:
            userData?.appearanceTextPrimaryLight ?? undefined,
          appearanceTextPrimaryDark:
            userData?.appearanceTextPrimaryDark ?? undefined,
        });
      } catch (error) {
        console.error("Erro ao aplicar aparência do usuário:", error);
      }
    }

    // Atualiza ao montar
    applyUserAppearance();

    // Atualiza ao mudar tema
    const observer = new MutationObserver(() => applyUserAppearance());

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [session]);

  return null;
}
