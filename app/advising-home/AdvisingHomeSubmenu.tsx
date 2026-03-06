"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import NavigationSubmenu from "@/components/ui/NavigationSubmenu";
import { ADVISING_HOME_SUBMENU } from "./submenu-items";

export default function AdvisingHomeSubmenu() {
  const pathname = usePathname();

  const items = useMemo(
    () =>
      ADVISING_HOME_SUBMENU.map((item) => ({
        label: item.label,
        href: item.href,
        active: item.match.some((path) => pathname === path),
      })),
    [pathname],
  );

  return <NavigationSubmenu items={items} />;
}
