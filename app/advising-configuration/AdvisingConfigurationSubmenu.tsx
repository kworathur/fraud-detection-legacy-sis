"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import { ADVISING_CONFIGURATION_SUBMENU } from "./submenu-items";

export default function AdvisingConfigurationSubmenu() {
  const pathname = usePathname();

  const items = useMemo(
    () =>
      ADVISING_CONFIGURATION_SUBMENU.map((item) => ({
        label: item.label,
        href: item.href,
        active: item.match.some((path) => pathname === path),
      })),
    [pathname],
  );

  return <NavigationSubmenu items={items} />;
}
