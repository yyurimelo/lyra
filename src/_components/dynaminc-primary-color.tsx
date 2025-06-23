"use client";
import { useEffect } from "react";
import { getUser } from "@lyra/app/api/user.service";
import { oklchToHex } from "@lyra/utils/color";
import { useSession } from "next-auth/react";

export default function DynamicPrimaryColor() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userData: any = null;

    async function fetchColors() {
      try {
        userData = await getUser(session!.user.id);

        // Cor primária
        if (userData?.appearancePrimaryColor) {
          const hexColor = oklchToHex(String(userData.appearancePrimaryColor));
          document.documentElement.style.setProperty("--primary", hexColor);
        } else {
          document.documentElement.style.removeProperty("--primary");
        }

        applyTextColor();
      } catch (error) {
        console.error("Erro ao aplicar cores:", error);
      }
    }

    function applyTextColor() {
      const isDark = document.documentElement.classList.contains("dark");

      const textColor = isDark
        ? userData?.appearanceTextPrimaryDark
        : userData?.appearanceTextPrimaryLight;

      if (textColor) {
        document.documentElement.style.setProperty(
          "--primary-foreground",
          textColor
        );
      } else {
        document.documentElement.style.removeProperty("--primary-foreground");
      }
    }

    const observer = new MutationObserver(() => {
      applyTextColor(); // sempre que a classe do <html> mudar
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    fetchColors();

    return () => observer.disconnect();
  }, [session]);

  return null;
}
