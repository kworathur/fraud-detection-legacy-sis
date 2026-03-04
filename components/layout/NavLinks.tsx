"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/types";

export default function NavLinks({
  links,
}: Readonly<{
  links: NavLink[];
}>) {
  const pathname = usePathname();

  return (
    <div className="flex h-[2.4375rem] w-full items-end justify-between border-b border-nav-border bg-white px-10">
      <nav className="flex items-end gap-6">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <div key={link.label} className="relative pb-[0.375rem]">
              <Link
                href={link.href}
                className={
                  isActive
                    ? "font-[family-name:Arial,sans-serif] text-[0.9375rem] font-bold text-link-blue"
                    : "font-[family-name:Arial,sans-serif] text-[0.875rem] text-nav-muted"
                }
              >
                {link.label}
              </Link>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[0.1875rem] bg-link-blue" />
              )}
            </div>
          );
        })}
      </nav>
      <div className="flex items-center gap-[0.3125rem] pb-[0.375rem]">
        <button type="button">
          <Image
            src="/images/search-icon.svg"
            alt="Search"
            width={24}
            height={24}
          />
        </button>
        <span className="font-[family-name:var(--font-akshar)] text-[0.875rem] font-bold tracking-[0.035rem] text-link-blue">
          VIEW ALL CARDS
        </span>
      </div>
    </div>
  );
}
