"use client";

import Link from "next/link";

export interface SubmenuItem {
  label: string;
  href: string;
  active: boolean;
}

export default function NavigationSubmenu({
  items,
}: Readonly<{
  items: SubmenuItem[];
}>) {
  return (
    <div className="flex w-[15.625rem] shrink-0 flex-col self-stretch border-r border-[#d4d4d4] bg-[#f5f5f5]">
      <div className="flex flex-col py-[0.75rem]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-[1.25rem] py-[0.5rem] font-[family-name:Arial,sans-serif] text-[0.8125rem] leading-normal text-black ${
              item.active ? "font-bold" : "font-normal"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
