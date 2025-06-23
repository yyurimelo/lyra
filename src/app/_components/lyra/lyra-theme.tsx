"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SidebarLogo() {
  const { theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>("light");

  useEffect(() => {
    if (theme === "system") {
      setCurrentTheme(systemTheme || "light");
    } else {
      setCurrentTheme(theme || "light");
    }
  }, [theme, systemTheme]);

  return (
    <Image
      src={`/lyra-logo-${currentTheme === "dark" ? "dark" : "light"}.png`}
      alt="Lyra Logo"
      className="w-[110px]"
    />
  );
}
